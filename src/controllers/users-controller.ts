import { Request, Response } from "express";
import { ManagementUsersOperations } from "../types/management-users-operations";
import { getTokensData } from "../helpers/get-tokens-data";
import { AuthorizationError } from "../errors/authorization-error";
import { handlerError } from "../helpers/handler-error";
import { UsersService } from "../service/users-service";

type BodyRequest = number[];

export const usersController = (operation: ManagementUsersOperations) => {
    return async (req: Request<{}, {}, BodyRequest>, res: Response) => {
        try {
            const tokensData = getTokensData(res);
            console.log(req.body)
            if (!tokensData.userData.isAdmin) throw new AuthorizationError();
            const users = await new UsersService()[operation](req.body);
            res.json(users);
        } catch (error) {
            handlerError(error, res);
        }
    };
};
