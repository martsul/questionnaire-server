import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { SfPutInfo } from "../../types/sf-put-info.js";
import { SalesforceService } from "../../service/salesforce-service.js";
import { handlerError } from "../../helpers/handler-error.js";

export const putSalesforceController = async (
    req: Request<unknown, unknown, SfPutInfo>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const salesforceService = new SalesforceService(res.locals.userId);
        await salesforceService.updateInfo(req.body);
        res.send("put");
    } catch (error) {
        console.error("Put SF Error", error);
        handlerError(error, res);
    }
};
