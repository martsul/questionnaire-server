import { Request, Response } from "express";
import { AuthorizationMethods } from "../types/authorization-methods.js";
import { handlerAuthorizationAction } from "../helpers/authorization/handler-authorization-action.js";
import { getErrorMessage } from "../helpers/authorization/get-error-message.js";

export const authorizationController = (action: AuthorizationMethods) => {
    return async (req: Request, res: Response) => {
        try {
            const receivedData = await handlerAuthorizationAction({
                action,
                userData: req.body,
            });
            res.cookie("refreshToken", receivedData.refreshToken, {
                maxAge: 2592000000,
                httpOnly: true,
            });
            res.json(receivedData);
        } catch (error) {
            console.error(error)
            res.status(404).send(getErrorMessage(error))
        }
    };
};
