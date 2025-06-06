import { DataTypes, Model, Sequelize } from "sequelize";
import { Users } from "./Users.js";
import { Themes } from "./Themes.js";
import { sequelize } from "../index.js";
import { Questions } from "./Questions.js";
import { Tags } from "./Tags.js";
import { Comments } from "./Comments.js";
import { FormUser } from "./Form-User.js";

export class Forms extends Model {
    declare id: number;
    declare ownerId: number;
    declare title: string;
    declare description: string;
    declare img: string;
    declare isPublic: boolean;
    declare themeId: number;
    declare owner: { name: string };
    declare tags: { tag: string }[];
    declare users: { name: string; id: number; email: string }[];
    declare numberResponse: number;
    declare creator: string;
    declare Theme: Themes;
    declare Tags: Tags[];
    declare Questions: Questions[];
    declare Comments: Comments[];
    declare FormUsers: FormUser[];
    declare User: Users;
}

Forms.init(
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
                model: Users,
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
            references: { model: Themes, key: "id" },
            field: "theme_id",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn("NOW"),
        },
    },
    {
        updatedAt: false,
        tableName: "forms",
        sequelize,
    }
);
