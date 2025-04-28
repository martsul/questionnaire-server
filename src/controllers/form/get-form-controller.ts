import { Request, Response } from "express";
import { FormService } from "../../service/form-service.js";

type Query = { formId: number; userId: number };

export const getFormController = async (
    req: Request<unknown, unknown, unknown, Query>,
    res: Response
) => {
    try {
        const formService = new FormService(NaN);
        const form = await formService.get(req.query);
        res.send(form)
    } catch (error) {
        console.error("Get Form Error:", error);
        res.status(500).send(error);
    }
};
