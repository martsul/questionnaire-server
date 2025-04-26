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
        useUTC: true,
        ssl: {
            require: true,
        },
    },
    logging: false,
    timezone: "UTC"
});

export const syncDatabase = async () => {
    try {
        await sequelize.sync();
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Error synchronizing database:", error);
    }
};
