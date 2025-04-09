import { DataTypes, Model } from "sequelize";
import { User } from "./User";
import { Theme } from "./Theme";
import { sequelize } from "./index.js";

export class Form extends Model {
    declare id: number;
    declare ownerId: number;
    declare title: string;
    declare description: string;
    declare img: string;
    declare isPublic: boolean;
    declare themeId: number;
    declare likes: number;
}

Form.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            field: "owner_id",
        },
        title: {
            type: DataTypes.STRING(40),
            defaultValue: "",
        },
        description: {
            type: DataTypes.STRING(512),
            defaultValue: "",
        },
        img: {
            type: DataTypes.TEXT(),
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: "is_public",
        },
        themeId: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            references: { model: Theme, key: "id" },
            field: "theme_id",
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        tableName: "form",
        timestamps: false,
        sequelize,
    }
);
