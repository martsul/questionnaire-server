import { Users } from "../db/tables/Users.js";
import { BlockUserError } from "../errors/block-user-error.js";
import { UnknownUserError } from "../errors/unknown-user-error.js";

export class User {
    #id: number;
    private declare user?: Users;

    constructor(id: number) {
        this.#id = id;
    }

    async checkUserIsBlocked() {
        if (!this.user) await this.#findUser();
        const user = this.user as Users;
        if (user.isBlocked) throw new BlockUserError();
    }

    async getUser() {
        if (!this.user) await this.#findUser();
        const user = this.user as Users;
        return user;
    }

    async #findUser() {
        const user = await Users.findOne({ where: { id: this.#id } });
        if (!user) throw new UnknownUserError();
        this.user = user;
    }
}
