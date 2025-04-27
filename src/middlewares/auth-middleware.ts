import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthorizationError } from "../errors/authorization-error.js";
import { ResponseLocals } from "../types/response-locals.js";

config();

const validateAccessToken = (token: string | undefined) => {
    if (!token || !process.env.JWT_ACCESS_SECRET) {
        throw new AuthorizationError();
    }
    const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    ) as JwtPayload;
    return decoded.id as number;
};

export const authMiddleware = async (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        const id = validateAccessToken(accessToken);
        res.locals.userId = id;
        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).send("Unauthorized");
        }
        console.error(error);
    }
};
