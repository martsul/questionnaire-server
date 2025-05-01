import { Request, Response } from "express";
import { ResponseLocals } from "../../types/response-locals.js";
import { AnswerService } from "../../service/answer-service.js";

export const deleteAnswerController = async (
    req: Request<unknown, unknown, { ids: number[] }>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { userId } = res.locals;
        const answerIds = req.body.ids;
        const answerService = new AnswerService(userId);
        await answerService.deleteAnswers(answerIds);
        res.send("ok");
    } catch (error) {
        res.status(500).send();
        console.error(error);
    }
};
