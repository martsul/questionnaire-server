import { Router } from "express";
import { authorizationController } from "../controllers/authorization-controller.js";
import { logoutController } from "../controllers/logout-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { authorizationRequestController } from "../controllers/authorization-request-controller.js";
import { usersController } from "../controllers/users-controller.js";
import { refreshController } from "../controllers/refresh-controller.js";
import { fromController } from "../controllers/form-controller.js";
import { tagController } from "../controllers/tag-controller.js";
import { themeController } from "../controllers/theme-controller.js";
import { userController } from "../controllers/user-controllet.js";

export const router = Router();

router.post("/signin", authorizationController("signin"));
router.post("/signup", authorizationController("signup"));
router.post("/logout",  logoutController);
router.get("/refresh", refreshController)
router.get("/auth_request", authMiddleware, authorizationRequestController)
router.get("/users", authMiddleware, usersController("getUsers"))
router.post("/block", authMiddleware, usersController("block"))
router.post("/unblock", authMiddleware, usersController("unblock"))
router.post("/give_admin", authMiddleware, usersController("giveAdmin"))
router.post("/take_admin", authMiddleware, usersController("takeAdmin"))
router.post("/form", fromController("create"))
router.get("/form", fromController("get"))
router.put("/form", fromController("update"))
router.get("/tag", tagController)
router.get("/theme", themeController)
router.get("/user", userController)