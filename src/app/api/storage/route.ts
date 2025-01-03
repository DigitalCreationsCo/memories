import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const storageProvider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER;

// Initialize storage clients based on provider
const googleStorage = storageProvider === 'google' ? new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
}) : null;

const s3Client = storageProvider === 'aws' ? new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
}) : null;

export async function POST(request: NextRequest) {
    try {
        const { operation, key, fileType, expiresIn = 3600 } = await request.json();

        if (storageProvider === 'google' && googleStorage) {
            const bucket = googleStorage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME!);
            const file = bucket.file(key);

            switch (operation) {
                case 'getUploadUrl': {
                    const [url] = await file.getSignedUrl({
                        version: 'v4',
                        action: 'write',
                        expires: Date.now() + expiresIn * 1000,
                        contentType: fileType,
                    });
                    return NextResponse.json({ url });
                }

                case 'getDownloadUrl': {
                    const [url] = await file.getSignedUrl({
                        version: 'v4',
                        action: 'read',
                        expires: Date.now() + expiresIn * 1000,
                    });
                    return NextResponse.json({ url });
                }

                case 'deleteFile': {
                    await file.delete();
                    return NextResponse.json({ success: true });
                }

                case 'listFiles': {
                    const [files] = await bucket.getFiles({ prefix: key });
                    return NextResponse.json({
                        files: files.map(f => ({
                            key: f.name,
                            lastModified: f.metadata.updated,
                            size: parseInt(f.metadata.size!.toString()),
                            etag: f.metadata.etag,
                        }))
                    });
                }
            }
        } 
        else if (storageProvider === 'aws' && s3Client) {
            const bucket = process.env.AWS_BUCKET_NAME!;

            switch (operation) {
                case 'getUploadUrl': {
                    const command = new PutObjectCommand({
                        Bucket: bucket,
                        Key: key,
                        ContentType: fileType,
                    });
                    const url = await getSignedUrl(s3Client, command, { expiresIn });
                    return NextResponse.json({ url });
                }

                case 'getDownloadUrl': {
                    const command = new GetObjectCommand({
                        Bucket: bucket,
                        Key: key,
                    });
                    const url = await getSignedUrl(s3Client, command, { expiresIn });
                    return NextResponse.json({ url });
                }
            }
        }

        return NextResponse.json(
            { error: 'Invalid storage configuration' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Storage API error:', error);
        return NextResponse.json(
            { error: 'Storage operation failed' },
            { status: 500 }
        );
    }
} 