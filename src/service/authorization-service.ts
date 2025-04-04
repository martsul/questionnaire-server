import { Users } from "../db/Users";
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
        const result = await Users.findOne({ where: { email: this.#email } });
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

    async signin() {
        const result = await this.#findUser();
        await this.#validatePassword(result.password);
        return { id: result.id, name: result.name };
    }

    async signup() {
        await this.#hashingPassword();
        const result = await Users.create({
            name: this.#name,
            password: this.#password,
            email: this.#email,
        });
        return { id: result.id, name: result.name };
    }
}
