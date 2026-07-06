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
const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const categoryId = req.params.categoryId as string
    const payload = req.body

    const category = await categoryServices.updateCategoryInDB(categoryId, payload)

     sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Category updated successfully",
        data: category
    })
})
const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const categoryId = req.params.categoryId as string

    const category = await categoryServices.deleteCategoryFromDB(categoryId)

     sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Category deleted successfully",
        data: null
    })
})

export const categoryController = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}