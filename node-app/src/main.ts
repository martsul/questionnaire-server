import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router/index.js";
import { cloudConnect } from "./db/cloud-connect.js";
import { Server } from "http";
import { wsInit } from "./ws/index.js";
import { dbInit } from "./db/db-init.js";
import { Users } from "./db/tables/Users.js";
import { where } from "sequelize";

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use("/api", router);

(async () => {
    try {
        cloudConnect();
        await dbInit();
        const server: Server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        wsInit(server);
    } catch (error) {
        console.error(error);
    }
})();
