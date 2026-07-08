import { z } from "zod";
import { ActiveStatus, RentalStatus, Role } from "../../generated/prisma/enums";

const optionalString = z.string().trim().min(1, "Value cannot be empty");

export const registerSchema = z.object({
  name: optionalString.min(2, "Name must be at least 2 characters"),
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: optionalString.optional(),
  role: z.enum(Role).optional(),
  profilePhoto: optionalString.optional(),
});

export const loginSchema = z.object({
  email: z.email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const createCategorySchema = z.object({
  name: optionalString.min(2, "Category name must be at least 2 characters"),
  description: z.string().trim().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").optional(),
  description: z.string().trim().optional(),
}).refine((data) => Object.keys(data).some((key) => data[key as keyof typeof data] !== undefined), {
  message: "At least one field is required",
});

export const createGearSchema = z.object({
  name: optionalString.min(2, "Gear name is required"),
  description: optionalString.min(5, "Description must be at least 5 characters"),
  brand: z.string().trim().optional(),
  pricePerDay: z.number().positive("Price per day must be greater than 0"),
  stock: z.number().int().positive("Stock must be a positive integer").optional(),
  isAvailable: z.boolean().optional(),
  images: z.array(z.string().trim().min(1)).optional(),
  categoryId: optionalString,
});

export const updateGearSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().min(5).optional(),
  brand: z.string().trim().optional(),
  pricePerDay: z.number().positive().optional(),
  stock: z.number().int().positive().optional(),
  isAvailable: z.boolean().optional(),
  images: z.array(z.string().trim().min(1)).optional(),
  categoryId: z.string().trim().min(1).optional(),
}).refine((data) => Object.keys(data).some((key) => data[key as keyof typeof data] !== undefined), {
  message: "At least one field is required",
});

export const createRentalSchema = z.object({
  startDate: optionalString,
  endDate: optionalString,
  items: z.array(
    z.object({
      gearItemId: optionalString,
      quantity: z.number().int().positive().optional(),
    })
  ).min(1, "At least one gear item is required"),
});

export const updateRentalStatusSchema = z.object({
  status: z.enum(RentalStatus),
});

export const createReviewSchema = z.object({
  gearItemId: optionalString,
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().trim().optional(),
});

export const createPaymentSchema = z.object({
  rentalOrderId: optionalString,
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().min(5).optional(),
  profilePhoto: z.string().trim().min(1).optional(),
  bio: z.string().trim().optional(),
  address: z.string().trim().optional(),
}).refine((data) => Object.keys(data).some((key) => data[key as keyof typeof data] !== undefined), {
  message: "At least one field is required",
});

export const updateUserStatusSchema = z.object({
  status: z.enum(ActiveStatus),
});
