import jwt from "jsonwebtoken";
import { Tokens } from "../db/tables/Tokens.js";
import { config } from "dotenv";
import { Users } from "../db/tables/Users.js";

config();

export class TokensService {
    declare accessToken: string;
    declare refreshToken: string;
    #id: number;

    constructor(user: Users) {
        this.#createTokens(user);
        this.#id = user.id;
    }

    #createTokens(user: Users) {
        const data = this.#convertUser(user);
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

    #convertUser(user: Users) {
        return { id: user.id, email: user.email, name: user.name };
    }

    async save() {
        await Tokens.upsert({
            userId: this.#id,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
        });
    }
}
