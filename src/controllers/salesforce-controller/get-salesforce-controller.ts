import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { SalesforceService } from "../../service/salesforce-service.js";
import { handlerError } from "../../helpers/handler-error.js";

export const getSalesforceController = async (
    req: Request,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const salesforceService = new SalesforceService(res.locals.userId);
        const isRegistered = await salesforceService.getUser();
        res.send(isRegistered);
    } catch (error) {
        console.error(error);
        handlerError(error, res);
    }
};
