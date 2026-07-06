import { Role } from "../../../generated/prisma/enums";
import config from "../../config";
import type { RegisterUserPayload } from "../../Interfaces/user.interface";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs"

const registerUserInDB  = async(payload: RegisterUserPayload)=>{
    const { name, email, password, phone, role, profilePhoto } = payload

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })
    if (isUserExist) {
        throw new Error("User with this email already exists");
    }
    const safeRole = role === Role.PROVIDER ? Role.PROVIDER : Role.CUSTOMER

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            role: safeRole
        }
    })
    await prisma.profile.create({
        data: {
            userId: createdUser.id,
            profilePhoto: profilePhoto || null
        }
    })

    const user = await prisma.user.findUnique({
        where: { id: createdUser.id },
        omit: { password: true },
        include: { profile: true }
    })
    return user
}

export const authServices = {
    registerUserInDB
}