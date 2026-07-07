import type { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { paymentServices } from "./payment.services"
import sendResponse from "../../utils/sendResponse"
import httpstatus from "http-status"

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const {rentalOrderId} = req.body
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


export const paymentController = {
    createPayment,
    handleWebhook
}