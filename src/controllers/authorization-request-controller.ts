import { Request, Response } from "express";
import { ValidatedTokens } from "../classes/validated-tokens.js";
import { tokenDataGuard } from "../guards/token-data-guard.js";
import { getTokensData } from "../helpers/get-tokens-data.js";

type AuthResponse = Response & {
    locals: {
        tokensData?: ValidatedTokens;
    };
};

export const authorizationRequestController = (
    req: Request,
    res: AuthResponse
) => {
try {
        const tokensData = getTokensData(res)
        res.cookie("refreshToken", tokensData.refreshToken, {
            maxAge: 2592000000,
            httpOnly: true,
        });
        res.json({
            refreshToken: tokensData.refreshToken,
            accessToken: tokensData.accessToken,
            ...tokensData.userData,
        });
} catch (error) {
    res.status(401).send()
}
};
