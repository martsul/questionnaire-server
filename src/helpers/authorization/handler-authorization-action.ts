import { TokensService } from "../../service/tokens-service.js";
import { AuthorizationBody } from "../../types/authorization-body.js";
import { AuthorizationMethods } from "../../types/authorization-methods.js";
import { authorizationUser } from "./authorization-user.js";

type Values = {
    action: AuthorizationMethods;
    userData: AuthorizationBody;
};

export const handlerAuthorizationAction = async ({
    action,
    userData,
}: Values) => {
    const receivedData = await authorizationUser(action, userData);
    const tokens = new TokensService({
        email: userData.email,
        ...receivedData,
    });
    await tokens.save();
    return { ...tokens, name: receivedData.name, id: receivedData.id };
};
