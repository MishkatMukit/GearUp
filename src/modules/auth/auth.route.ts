import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { loginSchema, registerSchema } from "../../validations/requestSchemas";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/register", validateRequest(registerSchema), authController.registerUser)
router.post("/login", validateRequest(loginSchema), authController.loginUser)
router.post("/refresh-token", authController.refreshToken)
router.get("/me", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), authController.getMe)

export const authRoutes = router