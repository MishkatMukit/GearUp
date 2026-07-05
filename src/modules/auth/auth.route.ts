import { Router } from "express";

const router = Router()

router.post("/register", authController.registerUser)

export const authRoutes = router