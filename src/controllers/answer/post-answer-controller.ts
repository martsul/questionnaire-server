import { Request, Response } from "express";
import { AnswerRequestBody } from "../../types/answer-request-body.js"; 
import { ResponseLocals } from "../../types/response-locals.js"; 
import { AnswerService } from "../../service/answer-service.js"; 

export const postAnswerController = async (
    req: Request<unknown, unknown, AnswerRequestBody>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { userId } = res.locals;
        const answerService = new AnswerService(userId);
        await answerService.postAnswer(
            req.body.answers,
            req.body.formId
        );
        res.send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};
