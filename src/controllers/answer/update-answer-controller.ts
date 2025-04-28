import { Request, Response } from "express";
import { AnswerService } from "../../service/answer-service.js";
import { ResponseLocals } from "../../types/response-locals.js";

type Body = { answerId: number; answers: Record<string, string | string[]> };

export const updateAnswerController = async (
    req: Request<unknown, unknown, Body>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { userId } = res.locals;
        const answerService = new AnswerService(userId);
        await answerService.updateAnswer(req.body.answerId, req.body.answers);
        res.send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
