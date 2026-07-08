import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { adminService } from "./admin.services";
import sendResponse from "../../utils/sendResponse";
import httpstatus from "http-status";
import type { ActiveStatus } from "../../../generated/prisma/enums";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await adminService.getAllUsersFromDB()
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Users retrieved successfully",
        data: users
    })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string
    const {status} = req.body
    const user = await adminService.updateUserStatusInDB(userId, status)
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "User status updated successfully",
        data: user
    })
})

const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const gear = await adminService.getAllGearFromDB()
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Gear listings retrieved successfully",
        data: gear
    })
})

const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rentals = await adminService.getAllRentalsFromDB()
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Rental orders retrieved successfully",
        data: rentals
    })
})

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllGear,
    getAllRentals
}
