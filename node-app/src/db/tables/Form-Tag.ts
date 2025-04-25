import { DataTypes, Model } from "sequelize";
import { sequelize } from "../index.js";
import { Forms } from "./Forms.js";
import { Tags } from "./Tags.js";

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
                model: Forms,
                key: "id",
            },
            onDelete: "CASCADE",
            field: "form_id",
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Tags,
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
        indexes: [
            {
                unique: true,
                fields: ["form_id", "tag_id"],
            },
        ],
    }
);

FormTag.removeAttribute("id");
