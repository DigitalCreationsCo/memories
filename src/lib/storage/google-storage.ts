import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';
import { StorageClient } from './storage-client';

export class GoogleStorageService extends StorageClient {
    private storage: Storage;
    private bucket: string;

    constructor() {
        super();
        this.storage = new Storage({
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
            credentials: {
                client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
        });
        this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME!;
    }

    async uploadFile(file: File, key: string): Promise<string> {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(key);

        try {
            await blob.save(file, {
                contentType: file.type,
                metadata: {
                    contentType: file.type,
                },
            });
            return await this.getSignedUrl(key);
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(key);

        const options: GetSignedUrlConfig = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + expiresIn * 1000,
        };

        try {
            const [url] = await blob.getSignedUrl(options);
            return url;
        } catch (error) {
            console.error('Error generating signed URL:', error);
            throw error;
        }
    }

    async deleteFile(key: string): Promise<void> {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(key);

        try {
            await blob.delete();
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    async listFiles(prefix: string): Promise<any[]> {
        const bucket = this.storage.bucket(this.bucket);

        try {
            const [files] = await bucket.getFiles({ prefix });
            return files.map(file => ({
                Key: file.name,
                LastModified: file.metadata.updated,
                Size: parseInt(file.metadata.size),
                ETag: file.metadata.etag,
            }));
        } catch (error) {
            console.error('Error listing files:', error);
            throw error;
        }
    }
} 