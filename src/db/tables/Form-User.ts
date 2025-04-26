import { DataTypes, Model } from "sequelize";
import { sequelize } from "../index.js";
import { Forms } from "./Forms.js";
import { Users } from "./Users.js";

export class FormUser extends Model {
    declare formId: number;
    declare userId: number;
}

FormUser.init(
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
        tableName: "form_user",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["form_id", "user_id"],
            },
        ],
    }
);

FormUser.removeAttribute("id");
