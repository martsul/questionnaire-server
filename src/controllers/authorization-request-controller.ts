import { Request, Response } from "express";
import { Users } from "../db/tables/Users.js";
import { AuthorizationError } from "../errors/authorization-error.js";
import { ResponseLocals } from "../types/response-locals.js";

const findUser = async (id: number) => {
    const data = await Users.findOne({
        where: {
            id: id,
        },
        attributes: ["isAdmin", "name", "id", "isBlocked"],
    });
    if (!data) throw new AuthorizationError();
    return data;
};

export const authorizationRequestController = async (
    req: Request,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const id = res.locals.userId;
        const user = await findUser(id);
        if (user.isBlocked) throw new AuthorizationError();
        res.send(user);
    } catch (error) {
        console.error("Auth Request Controller:", error);
        res.status(401).send();
    }
};
