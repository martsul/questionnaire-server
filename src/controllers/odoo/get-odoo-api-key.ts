import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { OdooApiKeyService } from "../../service/odoo-api-key-service.js";
import { handlerError } from "../../helpers/handler-error.js";

export const getOdooApiKey = async (
    req: Request,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const odooApiKeyService = new OdooApiKeyService(res.locals.userId);
        const api = await odooApiKeyService.getApiKey();
        res.send(api);
    } catch (error) {
        handlerError(error, res);
    }
};
