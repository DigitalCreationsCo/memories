'use server'

import { auth } from "@/auth"
import { S3Service } from "@/lib/s3"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const s3Service = new S3Service()

const mediaSchema = z.object({
    file: z.instanceof(File),
    projectId: z.string(),
})

export async function uploadMedia(data: FormData) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const file = data.get('file') as File
    const projectId = data.get('projectId') as string

    const validated = mediaSchema.parse({
        file,
        projectId,
    })

    const key = `projects/${projectId}/users/${session.user.id}/${Date.now()}-${file.name}`
    
    try {
        const url = await s3Service.uploadFile(file, key)
        
        // Here you might want to save the media metadata to your database
        // await db.media.create({ ... })

        revalidatePath(`/projects/${projectId}`)
        return { success: true, url }
    } catch (error) {
        console.error('Error uploading media:', error)
        return { success: false, error: 'Failed to upload media' }
    }
}

export async function deleteMedia(key: string, projectId: string) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    try {
        await s3Service.deleteFile(key)
        
        // Delete from database as well
        // await db.media.delete({ ... })

        revalidatePath(`/projects/${projectId}`)
        return { success: true }
    } catch (error) {
        console.error('Error deleting media:', error)
        return { success: false, error: 'Failed to delete media' }
    }
}

export async function getProjectMedia(projectId: string) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    try {
        const prefix = `projects/${projectId}/users/${session.user.id}/`
        const files = await s3Service.listFiles(prefix)
        
        // Get signed URLs for all files
        const mediaItems = await Promise.all(
            files.map(async (file) => ({
                key: file.Key!,
                url: await s3Service.getSignedUrl(file.Key!),
                lastModified: file.LastModified!,
                size: file.Size!,
            }))
        )

        return { success: true, media: mediaItems }
    } catch (error) {
        console.error('Error fetching media:', error)
        return { success: false, error: 'Failed to fetch media' }
    }
}
