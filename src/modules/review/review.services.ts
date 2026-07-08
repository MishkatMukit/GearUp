import { RentalStatus } from "../../../generated/prisma/enums"
import type { ICreateReview } from "../../Interfaces/review.interface"

import { prisma } from "../../lib/prisma"

const insertReviewIntoDB = async (payload: ICreateReview, customerId: string) => {
    const { gearItemId, rating, comment } = payload

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5")
    }

    await prisma.gearItem.findUniqueOrThrow({
        where: { id: gearItemId }
    })
    const returnedRental = await prisma.rentalOrder.findFirst({
        where: {
            customerId,
            status: RentalStatus.RETURNED,
            items: { some: { gearItemId } }
        }
    })
    if (!returnedRental) {
        throw new Error("You can only review gear after you have returned it")
    }

    const alreadyReviewed = await prisma.review.findUnique({
        where: {
            customerId_gearItemId: { customerId, gearItemId }
        }
    })
    if (alreadyReviewed) {
        throw new Error("You have already reviewed this gear item")
    }

    const review = await prisma.review.create({
        data: {
            customerId,
            gearItemId,
            rating,
            comment: comment || null
        }
    })
    return review
}

export const reviewServices = {
    insertReviewIntoDB
}
