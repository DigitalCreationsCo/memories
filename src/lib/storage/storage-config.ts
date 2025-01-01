export const config = {
    storageProvider: process.env.NEXT_PUBLIC_STORAGE_PROVIDER as 'aws' | 'google',
    aws: {
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    },
    google: {
        projectId: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID,
        bucketName: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUCKET_NAME,
    }
}