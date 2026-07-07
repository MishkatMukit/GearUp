import type { ICreateGear, IUpdateGear } from "../../Interfaces/gear.interface";
import { prisma } from "../../lib/prisma";

const insertGearIntoDB = async (payload: ICreateGear, providerId: string) => {
    await prisma.category.findUniqueOrThrow({
        where: {
            id: payload.categoryId
        }
    })

    const result = await prisma.gearItem.create({
        data: {
            ...payload,
            providerId
        },
        include:{
            category: true
        }
    })
    return result
}

const updateGearInDB = async (gearId: string, payload: IUpdateGear, providerId: string) => {
    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: {
            id: gearId
        }
    })
    if (gear.providerId !== providerId) {
        throw new Error("You are not the owner of this gear item")
    }
    const result = await prisma.gearItem.update({
        where: { id: gearId },
        data: payload,
        include: {
            category: true
        }
    })
    return result
}
const deleteGearFromDB = async (gearId: string, providerId: string) => {
    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: {
            id: gearId
        }
    })
    if (gear.providerId !== providerId) {
        throw new Error("You are not the owner of this gear item")
    }
    const result = await prisma.gearItem.delete({
        where: { id: gearId }
    })
    return result
}


export const providerServices = {
    insertGearIntoDB,
    updateGearInDB,
    deleteGearFromDB
}