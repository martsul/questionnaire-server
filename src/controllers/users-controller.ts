import { Request, Response } from "express";
import { ManagementUsersOperations } from "../types/management-users-operations";
import { AuthorizationError } from "../errors/authorization-error";
import { handlerError } from "../helpers/handler-error";
import { UsersService } from "../service/users-service";
import { User } from "../db/User";

type BodyRequest = number[];

const checkUserStatus = async (res: Response) => {
    const id = res.locals.id as number;
    const user = await User.findOne({
        where: { id: id },
        attributes: ["isAdmin", "isBlocked"],
    });
    return {userHasRights: user?.isAdmin && !user?.isBlocked, id};
};

export const usersController = (operation: ManagementUsersOperations) => {
    return async (req: Request<{}, {}, BodyRequest>, res: Response) => {
        try {
            const {userHasRights, id} = await checkUserStatus(res);
            if (!userHasRights) throw new AuthorizationError();
            const users = await new UsersService(id)[operation](req.body);
            res.json(users);
        } catch (error) {
            handlerError(error, res);
        }
    };
};
