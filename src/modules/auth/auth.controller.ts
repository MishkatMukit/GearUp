import type { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { authServices } from "./auth.services"
import sendResponse from "../../utils/sendResponse"
import httpstatus from "http-status"
const registerUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const payload  = req.body

    const user  = await authServices.registerUserInDB(payload)

    sendResponse(res, {
        statusCode: httpstatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: { user }
    })
})
const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body

    const { accessToken, refreshToken } = await authServices.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 60 * 60 * 1000 * 24,
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 60 * 60 * 1000 * 24 * 7,
    })

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Login successful",
        data: { accessToken, refreshToken }
    })
})

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken

    const accessToken = await authServices.setRefreshToken(refreshToken)
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 60 * 60 * 1000 * 24,
    })
    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Token refreshed successfully",
        data: { accessToken }
    })
})


export const authController  = {
    registerUser,
    loginUser,
    refreshToken
}