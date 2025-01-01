import { StorageClient } from './storage-client';
import { S3Service } from './aws-s3';
import { GoogleStorageService } from './google-storage';

export type StorageProvider = 'aws' | 'google';

export class StorageFactory {
    private static instance: StorageClient;

    static initialize(provider: StorageProvider): StorageClient {
        switch (provider) {
            case 'aws':
                this.instance = new S3Service();
                break;
            case 'google':
                this.instance = new GoogleStorageService();
                break;
            default:
                throw new Error('Invalid storage provider');
        }
        return this.instance;
    }

    static getInstance(): StorageClient {
        if (!this.instance) {
            throw new Error('Storage not initialized. Call initialize() first.');
        }
        return this.instance;
    }
} 