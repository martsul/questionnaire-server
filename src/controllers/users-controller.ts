import { Request, Response } from "express";
import { ManagementUsersOperations } from "../types/management-users-operations.js";
import { AuthorizationError } from "../errors/authorization-error.js";
import { handlerError } from "../helpers/handler-error.js";
import { UsersService } from "../service/users-service.js";
import { Users } from "../db/tables/Users.js";

type BodyRequest = number[];

const checkUserStatus = async (res: Response) => {
    const id = res.locals.id as number;
    const user = await Users.findOne({
        where: { id: id },
        attributes: ["isAdmin", "isBlocked"],
    });
    return { userHasRights: user?.isAdmin && !user?.isBlocked, id };
};

export const usersController = (operation: ManagementUsersOperations) => {
    return async (req: Request<{}, {}, BodyRequest>, res: Response) => {
        try {
            const { userHasRights, id } = await checkUserStatus(res);
            if (!userHasRights) throw new AuthorizationError();
            const users = await new UsersService(id)[operation](req.body);
            res.json(users);
        } catch (error) {
            handlerError(error, res);
        }
    };
};
