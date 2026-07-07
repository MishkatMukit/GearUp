import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router()

router.post('/', auth(Role.CUSTOMER), rentalController.createRental)
router.get('/', auth(Role.CUSTOMER), rentalController.getMyRentals)
router.get('/:id', auth(Role.CUSTOMER), rentalController.getRentalById)


export const rentalRoutes = router