import { Request, Response } from "express";
import { FormControllerAction } from "../types/form-controller-action.js";
import { FormService } from "../service/form-service.js";

export const fromController = (action: FormControllerAction) => {
    return async (req: Request, res: Response) => {
        try {
            const data = req.body || req.query;
            const formService = new FormService();
            const result = await formService[action](data);
            res.json(result);
        } catch (error) {
            res.status(500).send();
            console.log(error);
        }
    };
};
