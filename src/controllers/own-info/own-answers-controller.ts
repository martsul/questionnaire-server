import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { OwnService } from "../../service/own-serivce.js";
import { handlerError } from "../../helpers/handler-error.js";

export const ownAnswersController = async (
    req: Request,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { userId } = res.locals;
        const ownService = new OwnService(userId);
        const answers = await ownService.getAnswers();
        res.send(answers);
    } catch (error) {
        console.error(error);
        handlerError(error,res)
    }
};
