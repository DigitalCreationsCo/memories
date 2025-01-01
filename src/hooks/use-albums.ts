import { useMediaStore } from "@/store/mediaStore"
import { useEffect } from "react"
import { Album, CreateAlbumInput, UpdateAlbumInput } from "@/types/album.types"

export function useAlbums(projectId: string) {
    const { 
        albums,
        isLoading,
        error,
        fetchAlbums,
        createAlbum,
        updateAlbum,
        deleteAlbum 
    } = useMediaStore()

    // Fetch albums on mount or projectId change
    useEffect(() => {
        fetchAlbums(projectId)
    }, [projectId, fetchAlbums])

    // Get albums for this project
    const projectAlbums = albums[projectId] || []

    // Wrapped functions with better error handling and types
    const handleCreate = async (input: CreateAlbumInput) => {
        const album = await createAlbum(input)
        return album
    }

    const handleUpdate = async (input: UpdateAlbumInput) => {
        const album = await updateAlbum(input)
        return album
    }

    const handleDelete = async (albumId: string) => {
        const success = await deleteAlbum(albumId)
        return success
    }

    const getAlbum = (albumId: string): Album | undefined => {
        return projectAlbums.find(album => album.id === albumId)
    }

    return {
        // Data
        albums: projectAlbums,
        isLoading,
        error,
        
        // Actions
        createAlbum: handleCreate,
        updateAlbum: handleUpdate,
        deleteAlbum: handleDelete,
        getAlbum,
        
        // Status
        isEmpty: projectAlbums.length === 0 && !isLoading,
    }
} 