import { Op } from "sequelize";
import { Users } from "../db/tables/Users.js";
import { Forms } from "../db/tables/Forms.js";

export class UsersService {
    #id: number;

    constructor(id: number) {
        this.#id = id;
    }

    async getUsers() {
        const users = await this.#queryUsers();
        const { isAdmin, isBlocked } = users.find(
            (user) => user.id === this.#id
        )?.dataValues || { isAdmin: false, isBlocked: false };
        return {
            users,
            status: {
                isAdmin,
                isBlocked,
            },
        };
    }

    async #queryUsers() {
        return await Users.findAll({
            attributes: ["id", "name", "isAdmin", "isBlocked"],
            order: ["id"],
        });
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
