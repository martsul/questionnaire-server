import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router/index.js";
import { testBDConnection } from "./helpers/test-bd-connection.js";
import { initAssociations } from "./db/associations.js";
import { v2 as cloudinary } from "cloudinary";
import { Tag } from "./db/Tag.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

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
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });

        await testBDConnection();
        initAssociations();


        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
})();
