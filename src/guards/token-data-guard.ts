import { ValidatedTokens } from "../classes/validated-tokens";
import { AuthorizationError } from "../errors/authorization-error";

export const tokenDataGuard = (tokenData: ValidatedTokens | undefined) => {
    if (!tokenData) {
        throw new AuthorizationError()
    }
    return tokenData
}