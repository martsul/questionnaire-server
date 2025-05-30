import { Users } from "../db/tables/Users.js";

export const convertUserData = (user: Users, accessToken: string) => {
    return {
        name: user.name,
        email: user.email,
        id: user.id,
        isAdmin: user.isAdmin,
        accessToken,
    };
};