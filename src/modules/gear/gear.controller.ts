import catchAsync from "../../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpstatus from "http-status";
import { gearServices } from "./gear.services";
const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const {data, meta}= await gearServices.getAllGearFromDB(query)
    
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Gears retrieved successfully",
        data,
        meta
    })
})
const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const gearId = req.params.id as string
    if (!gearId) {
        throw new Error("Gear id required in params");
    }
    const gear = await gearServices.getGearByIdFromDB(gearId)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Gear details retrieved successfully",
        data: gear
    })
})
export const gearController = {
    getAllGear,
    getGearById
}