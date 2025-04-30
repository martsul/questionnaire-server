import { Request, Response } from "express";
import { ManagementUsersOperations } from "../types/management-users-operations.js";
import { handlerError } from "../helpers/handler-error.js";
import { UsersService } from "../service/users-service.js";
import { ResponseLocals } from "../types/response-locals.js";

type BodyRequest = number[];

export const usersController = (operation: ManagementUsersOperations) => {
    return async (
        req: Request<{}, {}, BodyRequest>,
        res: Response<unknown, ResponseLocals>
    ) => {
        try {
            const { userId } = res.locals;
            const users = await new UsersService(userId)[operation](req.body);
            res.json(users);
        } catch (error) {
            console.error("Users Error:", error);
            handlerError(error, res);
        }
    };
};
