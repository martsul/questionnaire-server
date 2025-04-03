import { Router } from "express";
import { sequelize } from "../db";
import multer from "multer";
import { authorizationController } from "../controllers/authorization-controller";
import { logoutController } from "../controllers/logout-controller";

const upload = multer();

export const router = Router();

router.post("/signin", upload.none(), authorizationController("signin"));
router.post("/signup", upload.none(), authorizationController("signup"));
router.post("/logout",  logoutController);
