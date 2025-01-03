"use server"

import { MediaError, MediaType } from "@/types/media.types"
import { createAnonClient } from "../client"

export async function getMediaItems(projectId: string): Promise<MediaType[]> {
    try {
        const client = createAnonClient()
        const { data, error } = await client
            .from('media')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false })

        if (error) throw new MediaError(error.message)
        if (!data) throw new MediaError('No media items found')

        return data
    } catch (error) {
        if (error instanceof MediaError) throw error
        throw new MediaError('Failed to fetch media items')
    }
}

export async function getMediaItemsMultiple(projectId: string, mediaIds: string[]): Promise<MediaType[]> {
    try {
        const client = createAnonClient()
        const { data, error } = await client
            .from('media')
            .select('*')
            .eq('project_id', projectId)
            .in('id', mediaIds)
            .order('created_at', { ascending: false })

        if (error) throw new MediaError(error.message)
        if (!data) throw new MediaError('No media items found')

        return data
    } catch (error) {
        if (error instanceof MediaError) throw error
        throw new MediaError('Failed to fetch media items')
    }
}

// ... existing getMedia functions ...

export async function createMedia(
    projectId: string,
    mediaData: Omit<MediaType, 'id' | 'created_at'>
): Promise<MediaType> {
    try {
        const client = createAnonClient()
        const { data, error } = await client
            .from('media')
            .insert({
                ...mediaData,
                project_id: projectId
            })
            .select()
            .single()

        if (error) throw new MediaError(error.message)
        if (!data) throw new MediaError('Failed to create media item')

        return data
    } catch (error) {
        if (error instanceof MediaError) throw error
        throw new MediaError('Failed to create media item')
    }
}