import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { UpdateFormData } from "../../types/update-form-data.js";
import { FormService } from "../../service/form-service.js";

export const updateFormController = async (
    req: Request<unknown, unknown, UpdateFormData>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const formService = new FormService(res.locals.userId);
        await formService.update(req.body);
        res.send();
    } catch (error) {
        console.error("Update Form Error:", error);
        res.status(500).send(error);
    }
};
