export interface Album {
    id: string;
    name: string;
    project_id: string;
    media_ids: string[];  // Array of media keys
    user_id: string;      // Owner of the album
    created_at: Date;
    updated_at: Date;
}

export interface CreateAlbumInput {
    name: string;
    project_id: string;
}

export interface UpdateAlbumInput {
    id: string;
    name?: string;
    media_ids?: string[];
}

export interface AlbumResponse {
    success: boolean;
    data?: Album;
    error?: string;
}

export interface AlbumsResponse {
    success: boolean;
    data?: Album[];
    error?: string;
}

export class AlbumError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AlbumError'
    }
}