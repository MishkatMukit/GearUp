import catchAsync from "../../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";
import { categoryServices } from "./category.services";
import sendResponse from "../../utils/sendResponse";
import httpstatus from "http-status";


const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryServices.getAllCategoriesFromDB()
    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: categories
    })
})

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const category = await categoryServices.insertCategoryIntoDB(req.body)
    sendResponse(res, {
        statusCode: httpstatus.CREATED,
        success: true,
        message: "Category created successfully",
        data: category
    })
})

export const categoryController = {
    getAllCategories,
    createCategory
}