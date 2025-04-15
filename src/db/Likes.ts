import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";
import { Forms } from "./Forms.js";
import { Users } from "./Users.js";

export class Likes extends Model {
    declare formId: Number;
    declare userId: Number;
}

Likes.init(
    {
        formId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Forms,
                key: "id",
            },
            onDelete: "CASCADE",
            field: "form_id",
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Users,
                key: "id",
            },
            onDelete: "CASCADE",
            field: "user_id",
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: "likes",
        indexes: [
            {
                unique: true,
                fields: ["form_id", "user_id"],
            },
        ],
    }
);

Likes.removeAttribute("id");
