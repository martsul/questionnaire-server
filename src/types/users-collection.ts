import { Users } from "../db/tables/Users.js";

export type UsersCollection = Record<Users["id"], Users>;
