"use server"

import { MediaType } from "@/types/media.types"
import { createAnonClient } from "../client"

export class MediaError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'MediaError'
    }
}

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