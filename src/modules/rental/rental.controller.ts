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
const getMyRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const orders = await rentalServices.getMyRentalsFromDB(customerId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Rental orders retrieved successfully",
        data: orders
    })
})
const getRentalById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const orderId = req.params.id as string
    const order = await rentalServices.getRentalByIdFromDB(orderId, customerId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Rental order retrieved successfully",
        data: order
    })
})
const cancelRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const orderId = req.params.id as string
    const order = await rentalServices.cancelRentalInDB(orderId, customerId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Rental order cancelled successfully",
        data: order
    })
})

export const rentalController = {
    createRental,
    getMyRentals,
    getRentalById,
    cancelRental
}