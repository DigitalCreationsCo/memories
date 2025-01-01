"use server"
import { createAnonClient } from "../client"
import { Album, CreateAlbumInput, UpdateAlbumInput } from "@/types/album.types"

export class AlbumError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AlbumError'
    }
}

export async function getAlbums(projectId: string): Promise<Album[]> {
    try {
        const client = createAnonClient()
        const { data, error } = await client
            .from('albums')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false })

        if (error) throw new AlbumError(error.message)
        if (!data) throw new AlbumError('No albums found')

        return data
    } catch (error) {
        if (error instanceof AlbumError) throw error
        throw new AlbumError('Failed to fetch albums')
    }
}

export async function getAlbum(albumId: string): Promise<Album> {
    try {
        const client = createAnonClient()
        const { data, error } = await client.from('albums').select('*').eq('id', albumId).single()
        if (error) throw new AlbumError(error.message)
        if (!data) throw new AlbumError('Album not found')
        return data
    } catch (error) {
        if (error instanceof AlbumError) throw error
        throw new AlbumError('Failed to fetch album')
    }
}

export async function createAlbum({ name, project_id }: CreateAlbumInput): Promise<Album> {
    try {
        const client = createAnonClient()
        const { data, error } = await client
            .from('albums')
            .insert({
                name,
                project_id: project_id,
                media_ids: [],
            })
            .select()
            .single()

        if (error) throw new AlbumError(error.message)
        if (!data) throw new AlbumError('Failed to create album')

        return data
    } catch (error) {
        if (error instanceof AlbumError) throw error
        throw new AlbumError('Failed to create album')
    }
}

export async function updateAlbum({ id, name, media_ids }: UpdateAlbumInput): Promise<Album> {
    try {
        const client = createAnonClient()
        const { data, error } = await client
            .from('albums')
            .update({
                name,
                media_ids: media_ids,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw new AlbumError(error.message)
        if (!data) throw new AlbumError('Album not found')

        return data
    } catch (error) {
        if (error instanceof AlbumError) throw error
        throw new AlbumError('Failed to update album')
    }
}

export async function deleteAlbum(albumId: string): Promise<void> {
    try {
        const client = createAnonClient()
        const { error } = await client
            .from('albums')
            .delete()
            .eq('id', albumId)

        if (error) throw new AlbumError(error.message)
    } catch (error) {
        if (error instanceof AlbumError) throw error
        throw new AlbumError('Failed to delete album')
    }
}

export async function addMediaToAlbum(albumId: string, mediaKey: string): Promise<Album> {
    try {
        const client = createAnonClient()
        // First get the current album to append to media_ids
        const { data: album, error: fetchError } = await client
            .from('albums')
            .select('media_ids')
            .eq('id', albumId)
            .single()

        if (fetchError) throw new AlbumError(fetchError.message)
        if (!album) throw new AlbumError('Album not found')

        const updatedMediaIds = [...(album.media_ids || []), mediaKey]

        const { data, error } = await client
            .from('albums')
            .update({ media_ids: updatedMediaIds })
            .eq('id', albumId)
            .select()
            .single()

        if (error) throw new AlbumError(error.message)
        if (!data) throw new AlbumError('Failed to update album')

        return data
    } catch (error) {
        if (error instanceof AlbumError) throw error
        throw new AlbumError('Failed to add media to album')
    }
}

export async function removeMediaFromAlbum(albumId: string, mediaKey: string): Promise<Album> {
    try {
        const client = createAnonClient()
        // First get the current album to remove from media_ids
        const { data: album, error: fetchError } = await client
            .from('albums')
            .select('media_ids')
            .eq('id', albumId)
            .single<Album>()

        if (fetchError) throw new AlbumError(fetchError.message)
        if (!album) throw new AlbumError('Album not found')

        const updatedMediaIds = (album.media_ids || []).filter(id => id !== mediaKey)

        const { data, error } = await client
            .from('albums')
            .update({ media_ids: updatedMediaIds })
            .eq('id', albumId)
            .select()
            .single()

        if (error) throw new AlbumError(error.message)
        if (!data) throw new AlbumError('Failed to update album')

        return data
    } catch (error) {
        if (error instanceof AlbumError) throw error
        throw new AlbumError('Failed to remove media from album')
    }
}