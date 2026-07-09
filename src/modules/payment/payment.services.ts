import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import { randomUUID } from "crypto"
import { handleStripeCheckoutCompleted } from "./utils.payment"

const createPayment = async (rentalOrderId: string, customerId: string) => {

    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: rentalOrderId },
        include: { payment: true, customer: true }
    })

    if (order.customerId !== customerId) {
        throw new Error("You are not the owner of this rental order")
    }
    if (order.status === RentalStatus.CANCELLED) {
        throw new Error("Cannot pay for a cancelled order")
    }
    if (order.status !== RentalStatus.CONFIRMED) {
        throw new Error("Payment is only allowed after the provider confirms the order")
    }
    if (order.payment && order.payment.status === PaymentStatus.COMPLETED) {
        throw new Error("This order has already been paid")
    }

    const transactionId = `GEARUP-${randomUUID()}`


    const payment = await prisma.payment.upsert({
        where: { rentalOrderId },
        update: {
            transactionId,
            amount: order.totalAmount,
            status: PaymentStatus.PENDING,
            stripeSessionId: null,
            paidAt: null
        },
        create: {
            transactionId,
            rentalOrderId,
            customerId,
            amount: order.totalAmount,
            status: PaymentStatus.PENDING
        }
    })

    let paymentUrl: string | null = null

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: { name: `GearUp Rental #${order.id}` },
                unit_amount: Math.round(order.totalAmount * 100)
            },
            quantity: 1
        }],
        success_url: `${config.app_url}/payment/success?tran_id=${transactionId}`,
        cancel_url: `${config.app_url}/payment/cancel?tran_id=${transactionId}`,
        metadata: {
            transactionId,
            rentalOrderId: order.id,
            paymentId: payment.id
        }
    })
    await prisma.payment.update({
        where: { id: payment.id },
        data: { stripeSessionId: session.id }
    })
    paymentUrl = session.url
    return { transactionId, paymentUrl }
}
const handleWebhook = async (payload: Buffer, signature: string) => {
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe_webhook_secret_key
    )
    switch (event.type) {
        case "checkout.session.completed":
            await handleStripeCheckoutCompleted(event.data.object)
            break
        default:
            console.log(`Unhandled stripe event type ${event.type}`)
            break
    }
}
const getMyPaymentsFromDB = async (customerId: string) => {
    const payments = await prisma.payment.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
        include: {
            rentalOrder: {
                include: { items: { include: { gearItem: true } } }
            }
        }
    })
    return payments
}
const getPaymentByIdFromDB = async (paymentId: string, customerId: string, isAdmin: boolean) => {
    const payment = await prisma.payment.findUniqueOrThrow({
        where: { id: paymentId },
        include: {
            rentalOrder: {
                include: { items: { include: { gearItem: true } } }
            }
        }
    })
    if (!isAdmin && payment.customerId !== customerId) {
        throw new Error("You are not allowed to view this payment")
    }
    return payment
}

export const paymentServices = {
    createPayment,
    handleWebhook,
    getMyPaymentsFromDB,
    getPaymentByIdFromDB
}