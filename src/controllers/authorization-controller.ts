import { Request, Response } from "express";
import { AuthorizationMethods } from "../types/authorization-methods";
import { handlerAuthorizationAction } from "../helpers/handler-authorization-action";

export const authorizationController = (action: AuthorizationMethods) => {
    return async (req: Request, res: Response) => {
        try {
            const receivedData = await handlerAuthorizationAction({action,userData: req.body,});
            res.cookie("refreshToken", receivedData.tokens.refreshToken, {maxAge: 2592000000, httpOnly:true})
            res.json(receivedData)
        } catch (error) {
            console.error(error);
        }
    };
};
