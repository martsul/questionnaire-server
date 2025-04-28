import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { FormService } from "../../service/form-service.js";

type Body = { ids: number[] };

export const deleteFormController = async (
    req: Request<unknown, unknown, Body>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const formService = new FormService(res.locals.userId);
        await formService.delete(req.body);
        res.send();
    } catch (error) {
        console.error("Delete Form Error:", error);
        res.status(500).send();
    }
};
