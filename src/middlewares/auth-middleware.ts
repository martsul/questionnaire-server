import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthorizationError } from "../errors/authorization-error.js";

config();

const validateAccessToken = (token: string | undefined) => {
    if (!token || !process.env.JWT_ACCESS_SECRET) {
        throw new AuthorizationError();
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload;
    return decoded.id as number;
};

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        const id = validateAccessToken(accessToken);
        res.locals.id = id
        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).send("Unauthorized");
        }
    }
};
