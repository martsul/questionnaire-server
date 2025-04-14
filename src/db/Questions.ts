import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";

export class Questions extends Model {
    declare id: string;
    declare formId: number;
    declare type: string;
    declare title: string;
    declare description: string;
    declare index: number;
    declare inStatistic: boolean;
    declare answers: string;
}

Questions.init(
    {
        id: { type: DataTypes.STRING(36), unique: true, primaryKey: true },
        formId: { type: DataTypes.INTEGER, field: "form_id" },
        type: { type: DataTypes.STRING(15) },
        title: { type: DataTypes.STRING(40) },
        description: { type: DataTypes.STRING(100) },
        index: { type: DataTypes.INTEGER },
        inStatistic: { type: DataTypes.BOOLEAN, field: "in_statistic" },
        answers: { type: DataTypes.JSON },
    },
    {
        tableName: "questions",
        timestamps: false,
        sequelize,
    }
);
