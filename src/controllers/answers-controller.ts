import { Request, Response } from "express";
import { ResponseLocals } from "../types/response-locals.js";
import { AnswersService } from "../service/answers-service.js";
import { handlerError } from "../helpers/handler-error.js";

export const answersController = async (
    req: Request<unknown, unknown, unknown, { formId: number }>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { formId } = req.query;
        const { userId } = res.locals;
        const answersService = new AnswersService(userId, formId);
        const answers = await answersService.getAnswers();
        res.send(answers);
    } catch (error) {
        console.error("Answers Error:", error);
        handlerError(error, res);
    }
};
