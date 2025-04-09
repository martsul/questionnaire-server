import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";
import { User } from "./User.js";

export class Token extends Model {
    declare id: number;
    declare userId: number;
    declare accessToken: string;
    declare refreshToken: string;
    declare User?: User;
}

Token.init(
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
                model: User,
                key: "id",
            },
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
        tableName: "token",
        timestamps: false,
        sequelize,
    }
);
