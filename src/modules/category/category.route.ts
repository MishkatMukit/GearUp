import { Router } from "express";
import { categoryController } from "./category.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { createCategorySchema, updateCategorySchema } from "../../validations/requestSchemas";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get('/', categoryController.getAllCategories)

router.post('/', auth(Role.ADMIN), validateRequest(createCategorySchema), categoryController.createCategory)

router.put('/:categoryId', auth(Role.ADMIN), validateRequest(updateCategorySchema), categoryController.updateCategory)

router.delete('/:categoryId', auth(Role.ADMIN), categoryController.deleteCategory)

export const categoryRoutes = router