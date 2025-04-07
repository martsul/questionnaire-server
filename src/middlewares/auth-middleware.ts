import { NextFunction, Request, Response } from "express";
import { ValidatedTokens } from "../classes/validated-tokens.js";

const getTokens = (req: Request) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshToken: string | undefined = req.cookies.refreshToken;
    return { refreshToken, accessToken };
};

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { accessToken, refreshToken } = getTokens(req);
        const tokensData = new ValidatedTokens(accessToken, refreshToken);
        await tokensData.startVerify();
        res.locals.tokensData = tokensData;
        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).send("Unauthorized");
        }
    }
};
