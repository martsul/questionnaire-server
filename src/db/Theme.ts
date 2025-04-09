import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";

export class Theme extends Model {
    declare id: number;
    declare theme: string;
}

Theme.init(
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
    { tableName: "theme", timestamps: false, sequelize }
);


