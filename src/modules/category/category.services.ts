import type { ICreateCategory } from "../../Interfaces/category.interface"
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
export const categoryServices = {
    getAllCategoriesFromDB,
    insertCategoryIntoDB
}