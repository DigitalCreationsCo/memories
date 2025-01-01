export abstract class StorageClient {
    abstract uploadFile(file: File, key: string): Promise<string>;
    abstract getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    abstract deleteFile(key: string): Promise<void>;
    abstract listFiles(prefix: string): Promise<any[]>;
}
