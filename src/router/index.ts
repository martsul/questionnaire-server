import { Router } from "express";
import multer from "multer";
import { authorizationController } from "../controllers/authorization-controller.js";
import { logoutController } from "../controllers/logout-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { authorizationRequestController } from "../controllers/authorization-request-controller.js";

const upload = multer();

export const router = Router();

router.post("/signin", upload.none(), authorizationController("signin"));
router.post("/signup", upload.none(), authorizationController("signup"));
router.post("/logout",  logoutController);
router.get("/auth_request", authMiddleware, authorizationRequestController)
