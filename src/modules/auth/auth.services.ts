import { ActiveStatus, Role } from "../../../generated/prisma/enums";
import config from "../../config";
import type { IloginUser } from "../../Interfaces/auth.interface";
import type { RegisterUserPayload } from "../../Interfaces/user.interface";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs"
import { jwtUtils } from "../../utils/jwt";
import type { JwtPayload } from "jsonwebtoken";

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
const loginUser = async (payload: IloginUser) => {
    const { email, password } = payload

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    if (user.status === ActiveStatus.SUSPENDED) {
        throw new Error("Your account has been suspended. Please contact support.")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new Error("Invalid credentials")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in)
    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expires_in)

    return { user, accessToken, refreshToken }
}
const setRefreshToken = async (refreshToken: string) => {
    const verifyRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret)

    if (!verifyRefreshToken.success) {
        throw new Error(verifyRefreshToken.error);
    }

    const { id } = verifyRefreshToken.data as JwtPayload

    const user = await prisma.user.findUniqueOrThrow({
        where: { id }
    })
    if (user.status === ActiveStatus.SUSPENDED) {
        throw new Error("Your account has been suspended.");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in)

    return accessToken
}
const getMe = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: { password: true },
        include: { profile: true }
    })
    return user
}
export const authServices = {
    registerUserInDB,
    loginUser,
    setRefreshToken,
    getMe
}