import type Stripe from "stripe"
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const markPaymentCompleted = async (transactionId: string) => {
    const payment = await prisma.payment.findUnique({
        where: { transactionId }
    })
    if (!payment) {
        console.log("Payment webhook: no payment found for tran_id:", transactionId)
        return
    }
    if (payment.status === PaymentStatus.COMPLETED) {
        return
    }

    await prisma.$transaction(async (tx) => {
        const rentalOrder = await tx.rentalOrder.findUniqueOrThrow({
            where: {
                id: payment.rentalOrderId
            },
            include: {
                gearItem: true
            }
        })

        const gearItem = await tx.gearItem.findUniqueOrThrow({
            where: {
                id: rentalOrder.gearItemId
            }
        })

        if (gearItem.stock < rentalOrder.quantity) {
            throw new Error(`Not enough stock for "${gearItem.name}" to fulfill this rental order`)
        }

        await tx.gearItem.update({
            where: { id: gearItem.id },
            data: {
                stock: {
                    decrement: rentalOrder.quantity
                }
            }
        })


        await tx.payment.update({
            where: { transactionId },
            data: {
                status: PaymentStatus.COMPLETED,
                paidAt: new Date()
            }
        })
        await tx.rentalOrder.update({
            where: { id: payment.rentalOrderId },
            data: { status: RentalStatus.PAID }
        })
    })
}

export const handleStripeCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
    const transactionId = session.metadata?.transactionId
    if (!transactionId) {
        console.log("Stripe webhook: missing transactionId in metadata")
        return
    }
    await markPaymentCompleted(transactionId)
}