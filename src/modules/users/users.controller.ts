import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpstatus from "http-status";
import { userServices } from "./user.services";

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedUser = await userServices.updateMyProfileInDB(userId, payload);
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "User profile updated successfully",
        data: updatedUser
    })
})

export const userController = {
    updateMyProfile
}
