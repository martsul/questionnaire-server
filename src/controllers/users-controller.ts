import { Request, Response } from "express";
import { ManagementUsersOperations } from "../types/management-users-operations.js";
import { AuthorizationError } from "../errors/authorization-error.js";
import { handlerError } from "../helpers/handler-error.js";
import { UsersService } from "../service/users-service.js";
import { Users } from "../db/tables/Users.js";
import { ResponseLocals } from "../types/response-locals.js";

type BodyRequest = number[];

const checkUserStatus = async (res: Response<unknown, ResponseLocals>) => {
    const id = res.locals.userId;
    const user = await Users.findOne({
        where: { id },
        attributes: ["isAdmin", "isBlocked"],
    });
    return { userHasRights: user?.isAdmin && !user?.isBlocked, id };
};

export const usersController = (operation: ManagementUsersOperations) => {
    return async (
        req: Request<{}, {}, BodyRequest>,
        res: Response<unknown, ResponseLocals>
    ) => {
        try {
            const { userHasRights, id } = await checkUserStatus(res);
            if (!userHasRights) throw new AuthorizationError();
            const users = await new UsersService(id)[operation](req.body);
            res.json(users);
        } catch (error) {
            console.error(error);
            handlerError(error, res);
        }
    };
};
