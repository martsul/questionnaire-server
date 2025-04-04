import { TokensService } from "../../service/tokens-service";
import { AuthorizationBody } from "../../types/authorization-body";
import { AuthorizationMethods } from "../../types/authorization-methods";
import { authorizationUser } from "./authorization-user";


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
