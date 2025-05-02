import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { validateToken } from "../helpers/validate-token.js";
import { User } from "../class/user.js";
import { handlerError } from "../helpers/handler-error.js";

config();

export const authMiddleware = async (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        const id = validateToken(accessToken, process.env.JWT_ACCESS_SECRET);
        await new User(id).checkUserIsBlocked();
        res.locals.userId = id;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        handlerError(error, res);
    }
};
