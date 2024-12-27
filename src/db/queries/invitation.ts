import { User } from "./user";

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