import { RentalStatus } from "../../../generated/prisma/enums";

export const allowedTransitions: Record<string, RentalStatus[]> = {
    [RentalStatus.PLACED]: [RentalStatus.CONFIRMED],
    [RentalStatus.PAID]: [RentalStatus.PICKED_UP],
    [RentalStatus.PICKED_UP]: [RentalStatus.RETURNED]
}