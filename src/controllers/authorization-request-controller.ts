import { Request, Response } from "express";
import { ResponseLocals } from "../types/response-locals.js";
import { User } from "../class/user.js";
import { handlerError } from "../helpers/handler-error.js";

export const authorizationRequestController = async (
    req: Request,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const id = res.locals.userId;
        const user = await new User(id).getUser();
        res.send({
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error("Auth Request Controller:", error);
        handlerError(error, res);
    }
};
