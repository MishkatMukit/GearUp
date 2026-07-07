import type { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { rentalServices } from "./rental.services"
import sendResponse from "../../utils/sendResponse"
import httpstatus from "http-status"

const createRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const order = await rentalServices.insertRentalIntoDB(req.body, customerId)
    sendResponse(res, {
        statusCode: httpstatus.CREATED,
        success: true,
        message: "Rental order placed successfully",
        data: order
    })
})

export const rentalController ={
    createRental
}