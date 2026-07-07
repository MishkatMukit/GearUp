import { RentalStatus } from "../../../generated/prisma/enums"
import type { ICreateRental } from "../../Interfaces/rental.interface"
import { prisma } from "../../lib/prisma"
import { diffInDays } from "./rental.utils"

const insertRentalIntoDB = async (payload: ICreateRental, customerId: string) => {
    const { startDate, endDate, items } = payload

    if (!items || items.length === 0) {
        throw new Error("At least one gear item is required to place a rental")
    }
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid startDate or endDate")
    }
    if (end <= start) {
        throw new Error("endDate must be after startDate")
    }
    const days = diffInDays(start, end)


    const rentalItemsData = []
    let totalAmount = 0

    for (const item of items) {
        const gear = await prisma.gearItem.findUniqueOrThrow({
            where: { id: item.gearItemId }
        })

        const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1

        if (!gear.isAvailable) {
            throw new Error(`Gear "${gear.name}" is not available`)
        }
        if (gear.stock < quantity) {
            throw new Error(`Not enough stock for "${gear.name}" (requested ${quantity}, available ${gear.stock})`)
        }

        const subtotal = gear.pricePerDay * quantity * days
        totalAmount += subtotal

        rentalItemsData.push({
            gearItemId: gear.id,
            quantity,
            days,
            pricePerDay: gear.pricePerDay,
            subtotal
        })
    }
    const order = await prisma.rentalOrder.create({
        data: {
            customerId,
            startDate: start,
            endDate: end,
            totalAmount,
            status: RentalStatus.PLACED,
            items: {
                create: rentalItemsData
            }
        },
        include: {
            items: { include: { gearItem: true } }
        }
    })
    return order
}

export const rentalServices = {
    insertRentalIntoDB
}