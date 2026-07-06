import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { userController } from "./users.controller";

const router  = Router()

router.put('/update-profile', auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), userController.updateMyProfile)

export const userRoutes = router