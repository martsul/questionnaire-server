import { Request, Response } from "express";
import { Forms } from "../../db/tables/Forms.js";
import { ResponseLocals } from "../../types/response-locals.js";
import { OwnService } from "../../service/own-serivce.js";

export const ownFormsController = async (
    req: Request,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { userId } = res.locals;
        const ownService = new OwnService(userId)
        const forms = await ownService.getForms()
        res.send(forms);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
