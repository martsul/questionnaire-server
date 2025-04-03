import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import { Users } from "./Users";

export class Tokens extends Model {
    declare id: number;
    declare userId: number;
    declare accessToken: string;
    declare refreshToken: string;
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
        },
        accessToken: { type: DataTypes.STRING(512), allowNull: false },
        refreshToken: { type: DataTypes.STRING(512), allowNull: false },
    },
    {
        tableName: "tokens",
        timestamps: false,
        sequelize,
    }
);
