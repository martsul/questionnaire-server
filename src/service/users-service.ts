import { Op } from "sequelize";
import { Users } from "../db/Users.js";

export class UsersService {
    #id: number;

    constructor(id: number) {
        this.#id = id;
    }

    async getUsers() {
        const users = await Users.findAll({
            attributes: ["id", "name", "isAdmin", "isBlocked"],
            order: ["id"],
        });
        const status = await Users.findOne({
            attributes: ["isAdmin", "isBlocked"],
            where: { id: this.#id },
        });
        return { users, status };
    }

    async block(ids: number[]) {
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
        return await this.getUsers();
    }

    async unblock(ids: number[]) {
        await Users.update(
            { isBlocked: false },
            {
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            }
        );
        return await this.getUsers();
    }

    async giveAdmin(ids: number[]) {
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
        return await this.getUsers();
    }

    async takeAdmin(ids: number[]) {
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
        return await this.getUsers();
    }
}
