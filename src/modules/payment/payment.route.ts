import { Router } from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { createPaymentSchema } from "../../validations/requestSchemas";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router()

router.post('/create', auth(Role.CUSTOMER), validateRequest(createPaymentSchema), paymentController.createPayment)
router.post('/confirm', paymentController.handleWebhook)

router.get('/', auth(Role.CUSTOMER), paymentController.getMyPayments)
router.get('/:id', auth(Role.CUSTOMER, Role.ADMIN), paymentController.getPaymentById)

export const paymentRoutes = router