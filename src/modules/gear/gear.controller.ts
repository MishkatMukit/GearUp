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

export const gearController = {
    getAllGear
}