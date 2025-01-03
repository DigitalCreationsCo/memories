// add media types here
export type MediaType = {
    id: string;
    url: string;
    type: string;
    created_at: string;
    updated_at: string;
    project_id: string;
    name: string;
    description: string;
    size: number;
    mime_type: string;
    width: number;
    height: number;
}

export class MediaError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'MediaError'
    }
}