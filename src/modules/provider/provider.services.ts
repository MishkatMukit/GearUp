import type { ICreateGear } from "../../Interfaces/gear.interface";
import { prisma } from "../../lib/prisma";

const insertGearIntoDB = async(payload : ICreateGear, providerId : string)=>{
    await prisma.category.findUniqueOrThrow({
        where:{
            id: payload.categoryId
        }
    })

    const result = await prisma.gearItem.create({
        data:{
            ...payload,
            providerId
        }
    })
    return result
}

const updateGearInDB = async(payload: IUP)

export const providerServices = {
    insertGearIntoDB
}