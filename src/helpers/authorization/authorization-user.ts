import { AuthorizationService } from "../../service/authorization-service.js";
import { AuthorizationBody } from "../../types/authorization-body.js";
import { AuthorizationMethods } from "../../types/authorization-methods.js";


export const authorizationUser = async (
    action: AuthorizationMethods,
    data: AuthorizationBody
) => {
    const authorization = new AuthorizationService(data);
    return await authorization[action]();
};
