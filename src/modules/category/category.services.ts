import type { ICreateCategory, IUpdateCategory } from "../../Interfaces/category.interface"
import { prisma } from "../../lib/prisma"

const getAllCategoriesFromDB = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { gearItems: true }
            }
        }
    })
    return categories
}

const insertCategoryIntoDB = async (payload: ICreateCategory) => {
    const result = await prisma.category.create({
        data: payload
    })
    return result
}

const updateCategoryInDB = async(categoryId : string, payload: IUpdateCategory)=>{
    await prisma.category.findUniqueOrThrow({
        where:{
            id: categoryId
        }
    })
    const result = await prisma.category.update({
        where:{
            id: categoryId
        },
        data:{
            ...payload
        },
    })
    return result
}
const deleteCategoryFromDB = async(categoryId : string)=>{
    await prisma.category.findUniqueOrThrow({
        where:{
            id: categoryId
        }
    })
    const result = await prisma.category.delete({
        where:{
            id: categoryId
        },
    })
}
export const categoryServices = {
    getAllCategoriesFromDB,
    insertCategoryIntoDB,
    updateCategoryInDB,
    deleteCategoryFromDB
}