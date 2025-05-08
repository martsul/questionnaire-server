import { config } from "dotenv";
import { Request, Response } from "express";
import { SalesforceCallbackService } from "../../service/salesforce-callback-service.js";

config();

type Query = { code: string; state: number };

export const salesforceCallback = async (
    req: Request<unknown, unknown, unknown, Query>,
    res: Response
) => {
    try {
        const { code, state } = req.query;
        const salesforceCallbackService = new SalesforceCallbackService(
            code,
            state
        );
        await salesforceCallbackService.register();
        res.redirect((process.env.CLIENT_URL as string) + "/salesforce");
    } catch (error) {
        console.error("SF Callback Error:", error);
        res.redirect((process.env.CLIENT_URL as string) + "/salesforce");
    }
};
