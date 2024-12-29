export type Project = {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export type CreateProjectInput = {
    name: string;
    description: string;
}