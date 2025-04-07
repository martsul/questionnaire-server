import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
    throw new Error("Missing database configuration in environment variables");
}

export const sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
        },
    },
});
