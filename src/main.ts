import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router/index.js";
import { cloudConnect } from "./db/cloud-connect.js";
import { Server } from "http";
import { wsInit } from "./ws/index.js";
import { dbInit } from "./db/db-init.js";
import { corsOptions } from "./helpers/origin-options.js";

dotenv.config();

const PORT = Number(process.env.PORT || 10000);

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api", router);

(async () => {
    try {
        cloudConnect();
        await dbInit();
        const server: Server = app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });
        wsInit(server);
    } catch (error) {
        console.error(error);
    }
})();
