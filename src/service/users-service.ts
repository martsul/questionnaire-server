import { Op } from "sequelize";
import { Users } from "../db/tables/Users.js";
import { RightsError } from "../errors/rights-error.js";

export class UsersService {
    #userId: number;

    constructor(userId: number) {
        this.#userId = userId;
    }

    async getUsers() {
        await this.#checkIsAdmin();
        const users = await this.#get();
        return users;
    }

    async block(ids: number[]) {
        await this.#checkIsAdmin();
        await this.#block(ids);
    }

    async unblock(ids: number[]) {
        await this.#checkIsAdmin();
        await this.#unblock(ids);
    }

    async giveAdmin(ids: number[]) {
        await this.#checkIsAdmin();
        await this.#giveAdmin(ids);
    }

    async takeAdmin(ids: number[]) {
        await this.#checkIsAdmin();
        await this.#takeAdmin(ids);
    }

    async #checkIsAdmin() {
        const user = await Users.findOne({ where: { id: this.#userId } });
        if (!user?.isAdmin) {
            throw new RightsError();
        }
    }

    async #get() {
        return await Users.findAll({
            attributes: ["id", "name", "isAdmin", "isBlocked"],
            order: ["id"],
        });
    }

    async #block(ids: number[]) {
        await Users.update(
            { isBlocked: true },
            {
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            }
        );
    }

    async #unblock(ids: number[]) {
        await Users.update(
            { isBlocked: true },
            {
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            }
        );
    }

    async #giveAdmin(ids: number[]) {
        await Users.update(
            { isAdmin: true },
            {
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            }
        );
    }

    async #takeAdmin(ids: number[]) {
        await Users.update(
            { isAdmin: false },
            {
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            }
        );
    }
}
