import { Request, Response } from "express";
import { ValidatedTokens } from "../classes/validated-tokens.js";

type AuthResponse = Response & {
    locals: {
        tokensData?: ValidatedTokens;
    };
};

export const authorizationRequestController = (
    req: Request,
    res: AuthResponse
) => {
    const tokensData = res.locals.tokensData;
    if (!tokensData) {
        res.status(401).send();
        return;
    }
    res.cookie("refreshToken", tokensData.refreshToken, {
        maxAge: 2592000000,
        httpOnly: true,
    });
    res.json({
        refreshToken: tokensData.refreshToken,
        accessToken: tokensData.accessToken,
        ...tokensData.userData,
    });
};
