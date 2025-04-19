import { DataTypes, Model } from "sequelize";
import { sequelize } from "../index.js";

export class Tags extends Model {
    declare id: number;
    declare tag: string;
}

Tags.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tag: {
            type: DataTypes.STRING(25),
            allowNull: false,
            unique: true,
        },
    },
    {
        timestamps: false,
        sequelize,
        tableName: "tags",
    }
);
