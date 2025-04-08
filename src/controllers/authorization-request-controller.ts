import { Request, Response } from "express";
import { User } from "../db/User.js";
import { AuthorizationError } from "../errors/authorization-error";

const findUser = async (id: number) => {
    const data = await User.findOne({
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
    res: Response
) => {
    try {
        const id = res.locals.id as number;
        const user = await findUser(id);
        if (user.isBlocked) throw new AuthorizationError();
        res.send(user);
    } catch (error) {
        res.status(401).send();
    }
};
