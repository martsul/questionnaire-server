import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";

export class Users extends Model {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare isBlocked: number;
    declare isAdmin: number;
}

Users.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: { len: [1, 100] },
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: { len: [1, 255], isEmail: true },
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: { len: [1, 60] },
        },
        isBlocked: { type: DataTypes.BOOLEAN(), defaultValue: false,field:"is_blocked" },
        isAdmin: { type: DataTypes.BOOLEAN(), defaultValue: false, field:"is_admin" },
    },
    { sequelize, tableName: "users", timestamps: false }
);
