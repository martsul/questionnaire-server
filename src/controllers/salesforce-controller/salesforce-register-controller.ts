import { config } from "dotenv";
import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { handlerError } from "../../helpers/handler-error.js";

config();

export const salesforceRegisterController = (
    req: Request,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { userId } = res.locals;
        const redirectUri = encodeURIComponent(
            process.env.SF_REDIRECT_URI as string
        );
        const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${process.env.SF_CLIENT_ID}&redirect_uri=${redirectUri}&scope=refresh_token%20api&state=${userId}`;
        res.send(authUrl);
    } catch (error) {
        console.error("SF Register Error:", error);
        handlerError(error, res);
    }
};
