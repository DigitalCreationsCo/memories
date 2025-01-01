import { NextRequest, NextResponse } from 'next/server';
import { StorageFactory } from '@/lib/storage/storage-factory';

export async function POST(request: NextRequest) {
    try {
        const storage = StorageFactory.getInstance();
        const data = await request.json();
        const { operation, key, expiresIn = 3600 } = data;

        switch (operation) {
            case 'getUploadUrl':
                const uploadUrl = await storage.getSignedUrl(key, expiresIn);
                return NextResponse.json({ url: uploadUrl });

            case 'getDownloadUrl':
                const downloadUrl = await storage.getSignedUrl(key, expiresIn);
                return NextResponse.json({ url: downloadUrl });

            case 'deleteFile':
                await storage.deleteFile(key);
                return NextResponse.json({ success: true });

            case 'listFiles':
                const { prefix = '' } = data;
                const files = await storage.listFiles(prefix);
                return NextResponse.json({ files });

            default:
                return NextResponse.json(
                    { error: 'Invalid operation' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Storage API error:', error);
        return NextResponse.json(
            { error: 'Storage operation failed' },
            { status: 500 }
        );
    }
} 