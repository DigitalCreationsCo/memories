interface StorageApiOptions {
    key: string;
    expiresIn?: number;
    prefix?: string;
}

export const storageApi = {
    async getUploadUrl({ key, expiresIn }: StorageApiOptions) {
        const response = await fetch('/api/storage', {
            method: 'POST',
            body: JSON.stringify({
                operation: 'getUploadUrl',
                key,
                expiresIn,
            }),
        });
        return response.json();
    },

    async getDownloadUrl({ key, expiresIn }: StorageApiOptions) {
        const response = await fetch('/api/storage', {
            method: 'POST',
            body: JSON.stringify({
                operation: 'getDownloadUrl',
                key,
                expiresIn,
            }),
        });
        return response.json();
    },

    async deleteFile({ key }: StorageApiOptions) {
        const response = await fetch('/api/storage', {
            method: 'POST',
            body: JSON.stringify({
                operation: 'deleteFile',
                key,
            }),
        });
        return response.json();
    },

    async listFiles({ prefix }: StorageApiOptions) {
        const response = await fetch('/api/storage', {
            method: 'POST',
            body: JSON.stringify({
                operation: 'listFiles',
                prefix,
            }),
        });
        return response.json();
    },
}; 