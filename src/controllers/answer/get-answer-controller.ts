import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { AnswerService } from "../../service/answer-service.js";
import { handlerError } from "../../helpers/handler-error.js";

export const getAnswerController = async (
    req: Request<unknown, unknown, unknown, { answerId: number }>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { answerId } = req.query;
        const { userId } = res.locals;
        const answerService = new AnswerService(userId);
        const answer = await answerService.getAnswer(answerId);
        res.send(answer);
    } catch (error) {
        console.error(error);
        handlerError(error, res);
    }
};
