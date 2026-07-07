import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { providerController } from "./provider.controller";

const router = Router()

router.post('/gear', auth(Role.PROVIDER), providerController.addGear)
router.put('/gear/:id', auth(Role.PROVIDER), providerController.updateGear)
router.delete('/gear/:id', auth(Role.PROVIDER), providerController.deleteGear)
export const providerRoutes = router