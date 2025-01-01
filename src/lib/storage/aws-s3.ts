import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageClient } from '../../types/storage.types';

export class S3Service extends StorageClient {
    private s3Client: S3Client;
    private bucket: string;

    constructor() {
        super();
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
        this.bucket = process.env.AWS_BUCKET_NAME!;
    }

    async uploadFile(file: File, key: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file,
            ContentType: file.type,
        });

        try {
            await this.s3Client.send(command);
            return await this.getSignedUrl(key);
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    async getSignedUrl(key: string, expiresIn = 3600) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return await getSignedUrl(this.s3Client, command, { expiresIn });
    }

    async deleteFile(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        try {
            await this.s3Client.send(command);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    async listFiles(prefix: string) {
        const command = new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: prefix,
        });

        try {
            const response = await this.s3Client.send(command);
            return response.Contents || [];
        } catch (error) {
            console.error('Error listing files:', error);
            throw error;
        }
    }
} 