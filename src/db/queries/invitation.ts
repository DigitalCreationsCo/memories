import { User } from "@/types/user.types";

export type Invitation = {
    id: string;
    projectId: string;
    email: string;
    role: Role;
    token: string;
    expires: Date;
    invitedBy: string;
    createdAt: Date;
    updatedAt: Date;
  
    user: User;
    // project: Project;
}