import { DataTypes, Model } from "sequelize";
import { sequelize } from "../index.js";

export class Themes extends Model {
    declare id: number;
    declare theme: string;
}

Themes.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        theme: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
    },
    { tableName: "themes", timestamps: false, sequelize }
);
