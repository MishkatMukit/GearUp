import type { ICreateGear, IUpdateGear } from "../../Interfaces/gear.interface";
import type { IUpdateRentalStatus } from "../../Interfaces/rental.interface";
import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { allowedTransitions } from "./utils.provider";

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
        include: {
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

const getProviderOrdersFromDB = async (providerId: string) => {
    const orders = await prisma.rentalOrder.findMany({
        where: {
            items: {
                some: { gearItem: { providerId } }
            }
        },
        orderBy: { createdAt: "desc" },
        include: {
            customer: { omit: { password: true } },
            payment: true,
            items: {
                where: {
                    gearItem: {
                        providerId
                    }
                },
                include: { gearItem: true }
            }
        }
    })
    return orders
}


const updateOrderStatusInDB = async (orderId: string, payload: IUpdateRentalStatus, providerId: string) => {
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: {
            items: { include: { gearItem: true } }
        }
    })

    const ownsGear = order.items.some((item: any) => item.gearItem.providerId === providerId)
    if (!ownsGear) {
        throw new Error("This order does not contain any of your gear")
    }

    const nextAllowed = allowedTransitions[order.status] || []
    if (!nextAllowed.includes(payload.status)) {
        throw new Error(`Cannot change status from ${order.status} to ${payload.status}`)
    }

    const result = await prisma.$transaction(async (tx) => {
        if (payload.status === RentalStatus.RETURNED && order.status !== RentalStatus.RETURNED) {
            for (const item of order.items) {
                await tx.gearItem.update({
                    where: { id: item.gearItemId },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                })
            }
        }

        return tx.rentalOrder.update({
            where: { id: orderId },
            data: { status: payload.status },
            include: {
                items: { include: { gearItem: true } },
                payment: true
            }
        })
    })

    return result
}
export const providerServices = {
    insertGearIntoDB,
    updateGearInDB,
    deleteGearFromDB,
    getProviderOrdersFromDB,
    updateOrderStatusInDB
}