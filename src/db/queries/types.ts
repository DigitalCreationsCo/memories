import { User as BaseUser } from "@supabase/supabase-js"

export type User = BaseUser & {
    password: string;
}

export type CreateUserInput = {
    email: string;
    password: string;
    name?: string;
}

enum Role {
    ADMIN = 'ADMIN',
    OWNER = 'OWNER',
    MEMBER = 'MEMBER',
}

export type Invitation = {
    id: string;
    teamId: string;
    email: string;
    role: Role;
    token: string;
    expires: Date;
    invitedBy: string;
    createdAt: Date;
    updatedAt: Date;
  
    user: User;
    // team: Team;
}