import { DataTypes, Model } from "sequelize";
import { sequelize } from "../index.js";
import { Users } from "./Users.js";

export class Tokens extends Model {
    declare id: number;
    declare userId: number;
    declare accessToken: string;
    declare refreshToken: string;
    declare Users?: Users;
}

Tokens.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: Users,
                key: "id",
            },
            onDelete: "CASCADE",
            field: "user_id",
        },
        accessToken: {
            type: DataTypes.STRING(512),
            allowNull: false,
            field: "access_token",
        },
        refreshToken: {
            type: DataTypes.STRING(512),
            allowNull: false,
            field: "refresh_token",
        },
    },
    {
        tableName: "tokens",
        timestamps: false,
        sequelize,
    }
);
