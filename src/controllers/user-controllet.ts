import { Request, Response } from "express";
import { UserRequestQuery } from "../types/user-request-query";
import { userQuery } from "../helpers/user-query";

export const userController = async (
    req: Request<any, any, any, UserRequestQuery>,
    res: Response
) => {
    try {
        const { user, userFilter } = req.query;
        const result = await userQuery(user, userFilter);
        res.json(result);
    } catch (error) {
        res.status(500).send()
        console.log(error);
    }
};
