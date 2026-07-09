import { ActiveStatus, Role } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        where: {
            role: {
                not: Role.ADMIN
            }
        },
        omit: {
            password: true
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            profile: true
        }
    })
    return users
}

const updateUserStatusInDB = async (userId: string, status: ActiveStatus) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    })

    if (user.role === Role.ADMIN) {
        throw new Error("Cannot change admin status")
    }

    const result = prisma.user.update({
        where: { id: userId },
        data: { status },
        omit: { password: true }
    })
    return result
}

const getAllGearFromDB = async () => {
    const gear = await prisma.gearItem.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            category: true,
            provider:
            {
                omit: {
                    password: true
                }
            }
        }
    })
    return gear
}

const getAllRentalsFromDB = async () => {
    const rentals = await prisma.rentalOrder.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            customer: {
                omit: { password: true }
            },
            payment: true,
            gearItem:true

        }
    })
    return rentals
}

export const adminService = {
    getAllUsersFromDB,
    updateUserStatusInDB,
    getAllGearFromDB,
    getAllRentalsFromDB
}
