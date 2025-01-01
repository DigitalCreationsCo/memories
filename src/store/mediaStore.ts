import { create } from 'zustand'
import { Album, UpdateAlbumInput, CreateAlbumInput } from '@/types/album.types'
import { getAlbums, getAlbum, createAlbum, updateAlbum, deleteAlbum } from '@/db/queries/album'

interface MediaStore {
  // State
  albums: Record<string, Album[]>  // projectId -> albums[]
  isLoading: boolean
  error?: string

  // Actions
  fetchAlbums: (projectId: string) => Promise<void>
  fetchAlbum: (albumId: string) => Promise<Album | null>
  createAlbum: (input: CreateAlbumInput) => Promise<Album | null>
  updateAlbum: (input: UpdateAlbumInput) => Promise<Album | null>
  deleteAlbum: (albumId: string) => Promise<boolean>
  clearCache: () => void
}

export const useMediaStore = create<MediaStore>((set, get) => ({
  albums: {},
  isLoading: false,
  error: undefined,

  fetchAlbums: async (projectId: string) => {
    // Return cached data if available
    if (get().albums[projectId]?.length > 0) {
      return
    }

    set({ isLoading: true, error: undefined })
    try {
      const albums = await getAlbums(projectId)
      set((state) => ({
        albums: { ...state.albums, [projectId]: albums }
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch albums' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchAlbum: async (albumId: string) => {
    try {
      return await getAlbum(albumId)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch album' })
      return null
    }
  },

  createAlbum: async (input) => {
    try {
      const album = await createAlbum(input)
      // Update cache
      set((state) => ({
        albums: {
          ...state.albums,
          [input.project_id]: [album, ...(state.albums[input.project_id] || [])]
        }
      }))
      return album
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create album' })
      return null
    }
  },

  updateAlbum: async (input) => {
    try {
      const album = await updateAlbum(input)
      // Update cache
      set((state) => ({
        albums: {
          ...state.albums,
          [album.project_id]: state.albums[album.project_id]?.map(a => 
            a.id === album.id ? album : a
          ) || []
        }
      }))
      return album
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update album' })
      return null
    }
  },

  deleteAlbum: async (albumId: string) => {
    try {
      await deleteAlbum(albumId)
      // Remove from cache
      set((state) => ({
        albums: Object.fromEntries(
          Object.entries(state.albums).map(([projectId, albums]) => [
            projectId,
            albums.filter(a => a.id !== albumId)
          ])
        )
      }))
      return true
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete album' })
      return false
    }
  },

  clearCache: () => set({ albums: {}, error: undefined })
})) 