import { Users } from "../../tables/Users.js";
import { typesenseClient } from "../index.js";

export const usersUpdate = () => {
    Users.afterCreate(async (user) => {
        await typesenseClient
            .collections("users")
            .documents()
            .create({
                id: `${user.id}`,
                name: user.name,
                email: user.email,
            });
    });

    Users.afterUpdate(async (user) => {
        await typesenseClient
            .collections("users")
            .documents(`${user.id}`)
            .update({
                id: `${user.id}`,
                name: user.name,
                email: user.email,
            });
    });

    Users.afterDestroy(async (user) => {
        await typesenseClient
            .collections("users")
            .documents(`${user.id}`)
            .delete();
    });
};
