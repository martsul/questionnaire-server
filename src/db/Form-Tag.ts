import { timeStamp } from "console";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";
import { Form } from "./Form.js";
import { Tag } from "./Tag.js";

export class FormTag extends Model {
    declare formId: number;
    declare tagId: number;
}

FormTag.init(
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
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Tag,
                key: "id",
            },
            onDelete: "CASCADE",
            field: "tag_id",
        },
    },
    {
        sequelize,
        tableName: "form_tag",
        timestamps: false,
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ["form_id", "tag_id"]
            }
        ],
    }
);


FormTag.removeAttribute("id")