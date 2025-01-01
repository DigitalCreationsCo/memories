export type Project = {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    media_ids: string[];
}

export type CreateProjectInput = {
    name: string;
    description?: string;
    user_id: string;

}

export class ProjectError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'ProjectError'
    }
}