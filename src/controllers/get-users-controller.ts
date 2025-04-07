import { Request, Response } from "express";
import { Users } from "../db/Users.js";
import { getTokensData } from "../helpers/get-tokens-data.js";
import { AuthorizationError } from "../errors/authorization-error.js";
import { handlerError } from "../helpers/handler-error.js";

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const tokensData = getTokensData(res);
        if (!tokensData.userData.isAdmin) throw new AuthorizationError();
        const users = await Users.findAll({
            attributes: ["id", "name", "isAdmin", "isBlocked"],
            order: ["id"],
        });
        res.json(users);
    } catch (error) {
        handlerError(error, res)
    }
};
