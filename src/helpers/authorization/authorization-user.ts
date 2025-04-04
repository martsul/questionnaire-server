import { AuthorizationService } from "../../service/authorization-service";
import { AuthorizationBody } from "../../types/authorization-body";
import { AuthorizationMethods } from "../../types/authorization-methods";


export const authorizationUser = async (
    action: AuthorizationMethods,
    data: AuthorizationBody
) => {
    const authorization = new AuthorizationService(data);
    return await authorization[action]();
};
