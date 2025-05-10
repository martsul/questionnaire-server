import { DataTypes, Model } from "sequelize";
import { Users } from "./Users.js";
import { sequelize } from "../index.js";

export class OdooTokens extends Model {
    declare id: number;
    declare api: string;
    declare userId: number;
    declare createdAt: Date;
    declare User: Users;
}

OdooTokens.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Users, key: "id" },
            field: "owner_id",
        },
        api: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
    },
    { sequelize, tableName: "odoo_tokens", updatedAt: false }
);
