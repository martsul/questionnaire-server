import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router/index.js";
import { testBDConnection } from "./helpers/test-bd-connection.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

const app = express();

app.use(express.json());
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
        await testBDConnection();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
})();
