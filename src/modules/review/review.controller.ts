import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { reviewServices } from "./review.services";
import sendResponse from "../../utils/sendResponse";
import httpstatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const review = await reviewServices.insertReviewIntoDB(req.body, customerId)
    sendResponse(res, {
        statusCode: httpstatus.CREATED,
        success: true,
        message: "Review submitted successfully",
        data: review
    })
})
export const reviewController = {
    createReview
}
