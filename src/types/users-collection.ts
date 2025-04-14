import { User } from "../db/User.js";

export type UsersCollection = Record<User["id"], User>