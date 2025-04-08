import { Op, where } from "sequelize";
import { User } from "../db/User.js";

export class UsersService {
    #id: number;

    constructor(id: number) {
        this.#id = id;
    }

    async getUsers() {
        const users = await User.findAll({
            attributes: ["id", "name", "isAdmin", "isBlocked"],
            order: ["id"],
        });
        const status = await User.findOne({
            attributes: ["isAdmin", "isBlocked"],
            where: { id: this.#id },
        });
        return {users, status}
    }

    async block(ids: number[]) {
        await User.update(
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
        await User.update(
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
        await User.update(
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
        await User.update(
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
