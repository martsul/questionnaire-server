import { AuthorizationError } from "../errors/authorization-error.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export const validateToken = (
    token: string | undefined,
    secretKey: string | undefined
) => {
    if (token === "undefined" || !token || !secretKey) {
        throw new AuthorizationError();
    }
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded.id as number;
};
