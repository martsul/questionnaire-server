import { User } from "../db/User.js";
import { AuthorizationBody } from "../types/authorization-body";
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
        const result = await User.findOne({
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
        const result = await this.#findUser();
        await this.#validatePassword(result.password);
        this.#checkBlock(Boolean(result.isBlocked));
        return {
            id: result.id,
            name: result.name,
            isAdmin: Boolean(result.isAdmin),
            email: result.email,
        };
    }

    async signup() {
        await this.#hashingPassword();
        const result = await User.create({
            name: this.#name,
            password: this.#password,
            email: this.#email,
        });
        return {
            id: result.id,
            name: result.name,
            isAdmin: Boolean(result.isAdmin),
            email: result.email,
        };
    }
}
