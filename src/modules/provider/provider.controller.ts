import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { providerServices } from "./provider.services";
import sendResponse from "../../utils/sendResponse";
import httpstatus from "http-status"

const addGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string
    const payload = req.body
    

    const result = await providerServices.insertGearIntoDB(payload, providerId)

    sendResponse(res, {
        statusCode: httpstatus.CREATED,
        success: true,
        message: "Gear added to inventory successfully",
        data: result
    })
})
const updateGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const providerId = req.user?.id as string
    const gearId = req.params.id as string
    if(!gearId){
        throw new Error("Please provide gearId in params");
    }
    const gear = await providerServices.updateGearInDB(gearId, req.body, providerId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Gear updated successfully",
        data: gear
    })

})
const deleteGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string
    const gearId = req.params.id as string
    await providerServices.deleteGearFromDB(gearId, providerId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Gear removed from inventory successfully",
        data: null
    })
})
const getOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string
    const orders = await providerServices.getProviderOrdersFromDB(providerId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Incoming orders retrieved successfully",
        data: orders
    })
})
const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string
    const orderId = req.params.id as string
    const order = await providerServices.updateOrderStatusInDB(orderId, req.body, providerId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Order status updated successfully",
        data: order
    })
})
export const providerController = {
    addGear,
    updateGear,
    deleteGear,
    getOrders,
    updateOrderStatus
}