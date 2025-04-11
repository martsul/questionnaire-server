import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";

export class Tag extends Model {
    declare id: number;
    declare tag: string;
}

Tag.init(
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
        indexes: [
            {
                fields: ["tag"],
                using: "GIN",
                operator: "gin_trgm_ops",
            },
        ],
    }
);
