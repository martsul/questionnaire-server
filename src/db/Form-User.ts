import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";
import { Form } from "./Form.js";
import { User } from "./User.js";

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
                model: Form,
                key: "id",
            },
            onDelete: "CASCADE",
            field: "form_id",
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
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
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ["form_id", "user_id"]
            }
        ],
    }
);


FormUser.removeAttribute("id")