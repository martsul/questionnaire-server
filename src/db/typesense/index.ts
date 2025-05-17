import { config } from "dotenv";
import Typesense from "typesense";

config();

export const typesenseClient = new Typesense.Client({
    nodes: [
        { host: process.env.TYPESENSE_URL as string, port: 443, protocol: "https" },
    ],
    apiKey: process.env.TYPESENSE_API_KEY as string,
});
