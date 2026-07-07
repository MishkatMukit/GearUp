import type { RentalStatus } from "../../generated/prisma/enums";

export interface IRentalItemInput {
    gearItemId: string;
    quantity?: number;
}

export interface ICreateRental {
    startDate: string;
    endDate: string;
    items: IRentalItemInput[];
}

export interface IUpdateRentalStatus {
    status: RentalStatus;
}
