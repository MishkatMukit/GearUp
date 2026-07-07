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


})
export const providerController = {
    addGear,
    updateGear
}