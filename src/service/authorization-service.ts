import { Users } from "../db/tables/Users.js";
import { AuthorizationBody } from "../types/authorization-body.js";
import { hash, compare } from "bcrypt-ts";

export class AuthorizationService {
    #name?: string;
    #password: string;
    #email: string;

    constructor(userData: AuthorizationBody) {
        this.#email = userData.email;
        this.#password = userData.password;
        this.#name = userData.name;
    }

    async #findUser() {
        const result = await Users.findOne({
            where: { email: this.#email },
        });
        if (result === null) {
            throw new Error("Invalid email address");
        }
        return result;
    }

    async #validatePassword(hashedPassword: string) {
        const isRealPassword = await compare(this.#password, hashedPassword);
        if (!isRealPassword) {
            throw new Error("Invalid password");
        }
    }

    async #hashingPassword() {
        if (this.#password.length) {
            this.#password = await hash(this.#password, 3);
        }
    }

    #checkBlock(isBlocked: boolean) {
        if (isBlocked) {
            throw new Error("User is blocked");
        }
    }

    async signin() {
        const user = await this.#findUser();
        await this.#validatePassword(user.password);
        this.#checkBlock(Boolean(user.isBlocked));
        return user
    }

    async signup() {
        await this.#hashingPassword();
        const user = await Users.create({
            name: this.#name,
            password: this.#password,
            email: this.#email,
        });
        return user
    }
}
