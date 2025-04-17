import { DataTypes, Model } from "sequelize";
import { sequelize } from "../index.js";
import { Questions } from "./Questions.js";
import { Users } from "./Users.js";
import { Forms } from "./Forms.js";

export class Answers extends Model {
    declare id: number;
    declare userId: number;
    declare questionId: string;
    declare answer: string;
    declare resultId: number;
    declare createdAt: Date;
    declare formId: number;
    declare User: Users;
    declare answerCount: number;
    declare Question: Questions;
}

Answers.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Users,
                key: "id",
            },
            field: "user_id",
        },
        formId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Forms,
                key: "id",
            },
            field: "form_id",
        },
        questionId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: Questions,
                key: "id",
            },
            onDelete: "CASCADE",
            field: "question_id",
        },
        answer: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        resultId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "result_id",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Date.now(),
            field: "created_at",
        },
    },
    { sequelize, updatedAt: false, tableName: "answers" }
);
