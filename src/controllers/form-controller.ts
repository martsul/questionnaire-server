import { Request, Response } from "express";
import { FormControllerAction } from "../types/form-controller-action";
import { FormService } from "../service/form-service";
import { Theme } from "../db/Theme";

export const fromController = (action: FormControllerAction) => {
    return async (req: Request, res: Response) => {
        try {
            const ownerId = req.body.id as number;
            const formService = new FormService();
            const result = await formService[action](ownerId);
            res.send(result)
        } catch (error) {
            res.status(500).send()
            console.log(error);
        }
    };
};
