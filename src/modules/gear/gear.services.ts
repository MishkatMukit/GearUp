import type { IGearQuery } from "../../Interfaces/gear.interface";
import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/browser";

const getAllGearFromDB = async (query: IGearQuery) => {

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit
    const sortBy = query.sortBy ? query.sortBy : "createdAt"
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"

    const andConditions: Prisma.GearItemWhereInput[] = []

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: query.searchTerm, mode: "insensitive" } },
                { description: { contains: query.searchTerm, mode: "insensitive" } },
                { brand: { contains: query.searchTerm, mode: "insensitive" } }
            ]
        })
    }
    if (query.category) {
        andConditions.push({
            category: {
                name: {
                    equals: query.category,
                    mode: "insensitive"
                }
            }
        })
    }
    if (query.brand) {
        andConditions.push(
            {
                brand: {
                    equals: query.brand,
                    mode: "insensitive"
                }
            })
    }
    if (query.minPrice || query.maxPrice) {
        const priceFilter: Prisma.FloatFilter = {};

        if (query.minPrice) {
            priceFilter.gte = Number(query.minPrice);
        }

        if (query.maxPrice) {
            priceFilter.lte = Number(query.maxPrice);
        }

        andConditions.push({
            pricePerDay: priceFilter,
        });
    }

    andConditions.push({ isAvailable: true })

    const result = await prisma.gearItem.findMany({
        where: { AND: andConditions },
        take: limit,
        skip: skip,
        orderBy: { [sortBy]: sortOrder },
        include: {
            category: true,
            provider: { omit: { password: true } },
            // _count: { select: { reviews: true } }
        }
    })

    const total = await prisma.gearItem.count({ where: { AND: andConditions } })

    return { data: result, meta: { page, limit, total } }
}
const getGearByIdFromDB = async (gearId: string) => {
    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: { id: gearId },
        include: {
            category: true,
            provider: { omit: { password: true } },
            reviews: {
                include: {
                    customer: { omit: { password: true } }
                },
                orderBy: { createdAt: "desc" }
            }
        }
    })
    return gear
}

export const gearServices = {
    getAllGearFromDB,
    getGearByIdFromDB
}