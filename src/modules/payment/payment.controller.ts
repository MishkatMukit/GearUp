import type { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { paymentServices } from "./payment.services"
import sendResponse from "../../utils/sendResponse"
import httpstatus from "http-status"

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const { rentalOrderId } = req.body
    const result = await paymentServices.createPayment(rentalOrderId as string, customerId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Payment session created successfully",
        data: result
    })
})

const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"]

    if (!signature) {
        throw new Error("Stripe signature is missing")
    }

    await paymentServices.handleWebhook(
        req.body as Buffer,
        signature as string
    )

    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Payment confirmed successfully",
        data: null
    })
}
)
const getMyPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const payments = await paymentServices.getMyPaymentsFromDB(customerId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Payment history retrieved successfully",
        data: payments
    })
})

const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const isAdmin = req.user?.role === "ADMIN"
    const paymentId = req.params.id as string
    const payment = await paymentServices.getPaymentByIdFromDB(paymentId, customerId, isAdmin)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Payment details retrieved successfully",
        data: payment
    })
})

export const paymentController = {
    createPayment,
    handleWebhook,
    getMyPayments,
    getPaymentById
}