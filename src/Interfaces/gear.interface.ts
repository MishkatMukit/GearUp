import type { GearItemWhereInput } from "../../generated/prisma/models";

export interface ICreateGear {
    name: string;
    description: string;
    brand?: string;
    pricePerDay: number;
    stock?: number;
    isAvailable?: boolean;
    images?: string[];
    categoryId: string;
}

export interface IGearQuery
    extends Omit<GearItemWhereInput, "category"> {
    searchTerm?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}
