import type { Role } from "../../generated/prisma/enums";

export interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: Role;
    profilePhoto?: string;
}