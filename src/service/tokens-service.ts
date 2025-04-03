import jwt from "jsonwebtoken";
import { Tokens } from "../db/Tokens";

type Data = { email: string; id: number; name: string };

export class TokensService {
    declare accessesToken: string;
    declare refreshToken: string;
    #id: number;

    constructor(data: Data) {
        this.accessesToken = jwt.sign(
            data,
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "30m" }
        );
        this.refreshToken = jwt.sign(
            data,
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "30d" }
        );
        this.#id = data.id;
    }

    async save() {
        await Tokens.upsert({
            userId: this.#id,
            accessToken: this.accessesToken,
            refreshToken: this.refreshToken,
        });
    }
}
