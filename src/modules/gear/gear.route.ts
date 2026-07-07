import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { gearController } from "./gear.controller";

const router  = Router()

router.get('/',gearController.getAllGear )

export const gearRoutes = router