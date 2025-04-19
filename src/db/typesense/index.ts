import { config } from "dotenv";
import Typesense from "typesense";

config();

export const typesenseClient = new Typesense.Client({
    nodes: [
        { host: "quiz-typesense.onrender.com", port: 443, protocol: "https" },
    ],
    apiKey: process.env.TYPESENSE_API_KEY as string,
});
