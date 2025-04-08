import jwt from "jsonwebtoken";
import { Token } from "../db/Token.js";
import { config } from "dotenv";
import { TokensServiceConstructor } from "../types/tokens-service-constructor.js";

config();

export class TokensService {
    declare accessToken: string;
    declare refreshToken: string;
    #id: number;

    constructor(data: TokensServiceConstructor) {
        this.#createTokens(data);
        this.#id = data.id;
    }

    #createTokens(data: TokensServiceConstructor) {
        this.accessToken = jwt.sign(
            data,
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "30m" }
        );
        this.refreshToken = jwt.sign(
            data,
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: "30d" }
        );
    }

    async save() {
        await Token.upsert({
            userId: this.#id,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
        });
    }
}
