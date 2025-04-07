import { Op } from "sequelize";
import { Users } from "../db/Users";

export class UsersService {
    async getUsers() {
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
