import type Stripe from "stripe"
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const markPaymentCompleted = async (transactionId: string, method?: string) => {
    const payment = await prisma.payment.findUnique({
        where: { transactionId }
    })
    if (!payment) {
        console.log("Payment webhook: no payment found for tran_id:", transactionId)
        return
    }
    if (payment.status === PaymentStatus.COMPLETED) {
        return // idempotent - already processed
    }

    await prisma.$transaction(async (tx) => {
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
    await markPaymentCompleted(transactionId, "card")
}