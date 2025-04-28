import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { FormService } from "../../service/form-service.js";

export const postFormController = async (
    req: Request,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        console.log(res.locals.userId)
        const formService = new FormService(res.locals.userId);
        const form = await formService.create()
        res.send(form)
    } catch (error) {
        console.error("Create Form Error:", error);
        res.status(500).send();
    }
};
