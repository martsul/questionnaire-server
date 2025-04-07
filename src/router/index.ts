import { Router } from "express";
import multer from "multer";
import { authorizationController } from "../controllers/authorization-controller.js";
import { logoutController } from "../controllers/logout-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { authorizationRequestController } from "../controllers/authorization-request-controller.js";
import { usersController } from "../controllers/users-controller.js";

export const router = Router();

router.post("/signin", authorizationController("signin"));
router.post("/signup", authorizationController("signup"));
router.post("/logout",  logoutController);
router.get("/auth_request", authMiddleware, authorizationRequestController)
router.get("/users", authMiddleware, usersController("getUsers"))
router.post("/block", authMiddleware, usersController("block"))
router.post("/unblock", authMiddleware, usersController("unblock"))
router.post("/give_admin", authMiddleware, usersController("giveAdmin"))
router.post("/take_admin", authMiddleware, usersController("takeAdmin"))