import { RentalStatus } from "../../../generated/prisma/enums"
import type { ICreateRental } from "../../Interfaces/rental.interface"
import { prisma } from "../../lib/prisma"
import { diffInDays } from "./utils.rental"

const insertRentalIntoDB = async (payload: ICreateRental, customerId: string) => {
    const { startDate, endDate, gearItemId, quantity } = payload

    // if (!item || item.length === 0) {
    //     throw new Error("At least one gear item is required to place a rental")
    // }
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid startDate or endDate")
    }
    if (start < today) {
        throw new Error("startDate cannot be less than the current date")
    }
    if (end <= start) {
        throw new Error("endDate must be after startDate")
    }
    const days = diffInDays(start, end)

    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: { id: gearItemId }
    })

    let safeQuantity = quantity && quantity > 0 ? quantity : 1

    if (!gear.isAvailable) {
        throw new Error(`Gear "${gear.name}" is not available`)
    }
    if (gear.stock < quantity) {
        throw new Error(`Not enough stock for "${gear.name}" (requested ${quantity}, available ${gear.stock})`)
    }
    const totalAmount = gear.pricePerDay * safeQuantity * days;

    const order = await prisma.rentalOrder.create({
        data: {
            customerId,
            gearItemId: gear.id,
            startDate: start,
            endDate: end,
            quantity: safeQuantity,
            days,
            pricePerDay: gear.pricePerDay,
            totalAmount,
            status: RentalStatus.PLACED
        },
        include: {
            gearItem : true
        }
    })
    return order

}


const getMyRentalsFromDB = async (customerId: string) => {
    const orders = await prisma.rentalOrder.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
        include: {
            items: { include: { gearItem: true } },
            payment: true
        }
    })
    return orders
}
const getRentalByIdFromDB = async (orderId: string, customerId: string) => {
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: {
            items: { include: { gearItem: true } },
            payment: true,
            customer: { omit: { password: true } }
        }
    })
    if (order.customerId !== customerId) {
        throw new Error("You are not allowed to view this rental order")
    }
    return order
}

const cancelRentalInDB = async (orderId: string, customerId: string) => {
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: orderId }
    })
    if (order.customerId !== customerId) {
        throw new Error("You are not the owner of this rental order")
    }
    // Customers may only cancel before the order is confirmed
    if (order.status !== RentalStatus.PLACED) {
        throw new Error(`Cannot cancel an order in status ${order.status}`)
    }
    const result = await prisma.rentalOrder.update({
        where: { id: orderId },
        data: { status: RentalStatus.CANCELLED }
    })
    return result
}

export const rentalServices = {
    insertRentalIntoDB,
    getMyRentalsFromDB,
    getRentalByIdFromDB,
    cancelRentalInDB
}