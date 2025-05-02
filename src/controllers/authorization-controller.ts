import { Request, Response } from "express";
import { AuthorizationMethods } from "../types/authorization-methods.js";
import { getErrorMessage } from "../helpers/get-error-message.js";
import { AuthorizationService } from "../service/authorization-service.js";
import { AuthorizationBody } from "../types/authorization-body.js";
import { TokensService } from "../service/tokens-service.js";
import { Users } from "../db/tables/Users.js";
import { convertUserData } from "./convert-user-data.js";

export const authorizationController = (action: AuthorizationMethods) => {
    return async (
        req: Request<unknown, unknown, AuthorizationBody>,
        res: Response
    ) => {
        try {
            const userData = await new AuthorizationService(req.body)[action]();
            const tokens = new TokensService(userData);
            await tokens.save();
            res.cookie("refreshToken", tokens.refreshToken, {
                maxAge: 2592000000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.send(convertUserData(userData, tokens.accessToken));
        } catch (error) {
            console.error("Auth Error:", error);
            res.status(400).send(getErrorMessage(error));
        }
    };
};
