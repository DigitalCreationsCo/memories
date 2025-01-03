import { StorageClient } from '../../types/storage.types';
import { Storage } from '@google-cloud/storage';

interface StorageApiResponse {
    url: string;
    files?: Array<{
        Key: string;
        LastModified: string;
        Size: number;
        ETag: string;
    }>;
}

class StorageError extends Error {
    constructor(message: string, public readonly code?: string) {
        super(message);
        this.name = 'StorageError';
    }
}

export class GoogleStorageService extends StorageClient {
    private storage: Storage | null = null;
    private bucket: string;

    constructor() {
        super();
        // Only initialize Google Storage on server side
        if (typeof window === 'undefined') {
            this.storage = new Storage({
                projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
                credentials: {
                    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
                    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                },
            });
            this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME!;
        } else {
            // Client-side: don't initialize Storage, just set bucket name
            this.bucket = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUCKET_NAME!;
        }
    }

    async uploadFile(file: File, key: string): Promise<string> {
        if (typeof window !== 'undefined') {
            // Client-side implementation
            try {
                // Get upload URL
                const response = await fetch('/api/storage', {
                    method: 'POST',
                    body: JSON.stringify({
                        operation: 'getUploadUrl',
                        key,
                        provider: 'google'
                    }),
                });
                const { url } = await response.json();

                // Upload file
                await fetch(url, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                // Get download URL
                return await this.getSignedUrl(key);
            } catch (error) {
                throw new StorageError(
                    'Failed to upload file',
                    error instanceof Error ? error.message : 'Unknown error'
                );
            }
        } else {
            // Server-side implementation
            const bucket = this.storage!.bucket(this.bucket);
            const blob = bucket.file(key);
            
            try {
                await blob.save(await file.arrayBuffer() as Uint8Array, {
                    contentType: file.type,
                });
                return await this.getSignedUrl(key);
            } catch (error) {
                throw new StorageError(
                    'Failed to upload file',
                    error instanceof Error ? error.message : 'Unknown error'
                );
            }
        }
    }

    async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
        if (typeof window !== 'undefined') {
            // Client-side implementation
            const response = await fetch('/api/storage', {
                method: 'POST',
                body: JSON.stringify({
                    operation: 'getDownloadUrl',
                    key,
                    expiresIn,
                    provider: 'google'
                }),
            });
            const { url } = await response.json();
            return url;
        } else {
            // Server-side implementation
            const bucket = this.storage!.bucket(this.bucket);
            const blob = bucket.file(key);
            const [url] = await blob.getSignedUrl({
                version: 'v4',
                action: 'read',
                expires: Date.now() + expiresIn * 1000,
            });
            return url;
        }
    }

    async deleteFile(key: string): Promise<void> {
        if (typeof window !== 'undefined') {
            // Client-side implementation
            await fetch('/api/storage', {
                method: 'POST',
                body: JSON.stringify({
                    operation: 'deleteFile',
                    key,
                    provider: 'google'
                }),
            });
        } else {
            // Server-side implementation
            const bucket = this.storage!.bucket(this.bucket);
            const blob = bucket.file(key);
            await blob.delete();
        }
    }

    async listFiles(prefix: string): Promise<any[]> {
        if (typeof window !== 'undefined') {
            // Client-side implementation
            const response = await fetch('/api/storage', {
                method: 'POST',
                body: JSON.stringify({
                    operation: 'listFiles',
                    prefix,
                    provider: 'google'
                }),
            });
            const { files } = await response.json();
            return files;
        } else {
            // Server-side implementation
            const bucket = this.storage!.bucket(this.bucket);
            const [files] = await bucket.getFiles({ prefix });
            return files.map(file => ({
                Key: file.name,
                LastModified: file.metadata.updated,
                Size: parseInt(file.metadata.size!.toString()),
                ETag: file.metadata.etag,
            }));
        }
    }
} 