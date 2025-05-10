import { Request, Response } from "express";
import { handlerError } from "../../helpers/handler-error.js";
import { PostOdooApiService } from "../../service/post-odoo-api-service.js";

type Body = { api: string };

export const postOdooApiKey = async (
    req: Request<unknown, unknown, Body>,
    res: Response
) => {
    try {
        const postOdooApiService = new PostOdooApiService(req.body.api);
        const answers = await postOdooApiService.getForms();
        res.send(answers);
    } catch (error) {
        console.error("Post Odoo Controller Error:", error);
        handlerError(error, res);
    }
};
