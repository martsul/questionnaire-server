import { config } from "dotenv";
import { AuthorizationError } from "../errors/authorization-error.js";
import jwt from "jsonwebtoken";
import { TokensService } from "../service/tokens-service.js";
import { TokensServiceConstructor } from "../types/tokens-service-constructor.js";

config();

export class ValidatedTokens {
    accessToken: string;
    refreshToken: string;
    declare userData: TokensServiceConstructor;

    constructor(
        accessToken: string | undefined,
        refreshToken: string | undefined
    ) {
        if (!accessToken || !refreshToken) {
            throw new AuthorizationError();
        }
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    #verifyAccessToken() {
        return jwt.verify(this.accessToken, process.env.JWT_ACCESS_SECRET as string)  as TokensServiceConstructor;
    }

    #saveDataLocal(
        accessToken: string,
        refreshToken: string,
        data: TokensServiceConstructor
    ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userData = data;
    }

    #getDto(data: TokensServiceConstructor) {
        return {id: data.id, name: data.name, isAdmin: data.isAdmin, email: data.email}
    }

    async #verifyRefreshToken() {
        const result = jwt.verify(this.refreshToken, process.env.JWT_REFRESH_SECRET as string) as TokensServiceConstructor;
        const newTokens = new TokensService(this.#getDto(result));
        await newTokens.save();
        this.#saveDataLocal(newTokens.accessToken, newTokens.refreshToken, result);
    }

    async #verifyTokens() {
        try {
            this.#saveDataLocal(this.accessToken, this.refreshToken, this.#verifyAccessToken())
        } catch (error) {
            console.error(error)
            await this.#verifyRefreshToken();
        }
    }

    async startVerify() {
        try {
            await this.#verifyTokens();
        } catch (error) {
            console.error(error)
            throw new AuthorizationError();
        }
    }
}
