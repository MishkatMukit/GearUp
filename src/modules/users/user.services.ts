// import type { UpdateProfilePayload } from "../../Interface/user.interface"
import { prisma } from "../../lib/prisma"

const updateMyProfileInDB = async (userId: string, payload: any) => {
    const { name, phone, profilePhoto, bio, address } = payload

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            phone,
            profile: {
                update: {
                    profilePhoto,
                    bio,
                    address
                }
            }
        },
        omit:{
            password: true
        },
        include: { profile: true }
    })
    
    return updatedUser
}

export const userServices = {
    updateMyProfileInDB
}
