import { Router } from "express";
import { categoryController } from "./category.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get('/', categoryController.getAllCategories)

router.post('/', auth(Role.ADMIN), categoryController.createCategory)

router.put('/:categoryId',auth(Role.ADMIN),categoryController.updateCategory)

router.delete('/:categoryId', auth(Role.ADMIN), categoryController.deleteCategory)

export const categoryRoutes = router