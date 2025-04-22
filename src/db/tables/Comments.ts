import { DataTypes, Model } from "sequelize";
import { sequelize } from "../index.js";
import { Users } from "./Users.js"; 
import { Forms } from "./Forms.js";

export class Comments extends Model {
    declare id: number;
    declare userId: number;
    declare formId: number;
    declare text: string;
    declare createdAt: Date;
}

Comments.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        text: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn("NOW"),
        },
    },
    {
        updatedAt: false,
        sequelize,
        tableName: "comments",
    }
);
