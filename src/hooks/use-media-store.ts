import { create } from 'zustand'
import { MediaType } from '@/types/media.types'

interface Album {
    id: string
    name: string
    media_ids: string[]
    created_at: string
    updated_at: string
}

interface MediaStore {
    albums: Record<string, Album[]>
    mediaItems: Record<string, MediaType>
    isLoading: boolean;
    isInitialized: boolean
    initialize: (projectId: string) => Promise<void>
    error: string | null
    
    // Actions
    setAlbums: (projectId: string, albums: Album[]) => void
    addMediaItems: (items: MediaType[]) => void
    removeMediaItem: (mediaId: string) => void
    fetchAlbums: (projectId: string) => Promise<void>
    fetchMediaItems: (projectId: string, mediaIds: string[]) => Promise<void>
}

export const useMediaStore = create<MediaStore>((set, get) => ({
    albums: {},
    mediaItems: {},
    isLoading: false,
    error: null,
    isInitialized: false,

    initialize: async (projectId: string) => {
        if (get().isInitialized) return

        set({ isLoading: true, error: null })
        try {
            // Fetch albums first
            const albumsResponse = await fetch(`/api/projects/${projectId}/albums`)
            const albums = await albumsResponse.json()

            // Get all unique media IDs from albums
            const mediaIds = Array.from(new Set(
                albums.flatMap((album: Album) => album.media_ids)
            ))

            // Fetch all media items
            const mediaResponse = await fetch(`/api/projects/${projectId}/media`, {
                method: 'POST',
                body: JSON.stringify({ mediaIds })
            })
            const mediaItems: MediaType[] = await mediaResponse.json()

            // Update store with all fetched data
            set((state) => ({
                albums: {
                    ...state.albums,
                    [projectId]: albums
                },
                mediaItems: {
                    ...state.mediaItems,
                    ...mediaItems.reduce((acc, item) => ({
                        ...acc,
                        [item.id]: item
                    }), {})
                },
                isLoading: false,
                isInitialized: true
            }))
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to initialize media store',
                isLoading: false 
            })
        }
    },

    setAlbums: (projectId, albums) => {
        set((state) => ({
            albums: {
                ...state.albums,
                [projectId]: albums
            }
        }))
    },

    addMediaItems: (items) => {
        set((state) => ({
            mediaItems: {
                ...state.mediaItems,
                ...items.reduce((acc, item) => ({
                    ...acc,
                    [item.id]: item
                }), {})
            }
        }))
    },

    removeMediaItem: (mediaId) => {
        set((state) => {
            const newMediaItems = { ...state.mediaItems }
            delete newMediaItems[mediaId]
            
            // Also remove from albums
            const newAlbums = Object.entries(state.albums).reduce((acc, [projectId, albums]) => ({
                ...acc,
                [projectId]: albums.map(album => ({
                    ...album,
                    media_ids: album.media_ids.filter(id => id !== mediaId)
                }))
            }), {})

            return {
                mediaItems: newMediaItems,
                albums: newAlbums
            }
        })
    },

    fetchAlbums: async (projectId) => {
        // Check if already initialized
        if (!get().isInitialized) {
            await get().initialize(projectId)
            return
        }

        // Existing fetchAlbums logic for subsequent fetches
        set({ isLoading: true, error: null })
        try {
            const response = await fetch(`/api/projects/${projectId}/albums`)
            const albums: Album[] = await response.json()
            
            const mediaIds = Array.from(new Set(
                albums.flatMap((album: Album) => album.media_ids)
            ))
            
            await get().fetchMediaItems(projectId, mediaIds)
            
            set((state) => ({
                albums: {
                    ...state.albums,
                    [projectId]: albums
                },
                isLoading: false
            }))
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to fetch albums',
                isLoading: false 
            })
        }
    },

    fetchMediaItems: async (projectId:string, mediaIds: string[]) => {
        const store = get()
        // Filter out media IDs that we already have
        const missingIds = mediaIds.filter(id => !store.mediaItems[id])
        
        if (missingIds.length === 0) return

        try {
            const response = await fetch(`/api/projects/${projectId}/media`, {
                method: 'POST',
                body: JSON.stringify({ mediaIds: missingIds })
            })
            const items: MediaType[] = await response.json()
            
            store.addMediaItems(items)
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to fetch media items' 
            })
        }
    }
}))