import { Request, Response } from "express";
import { ResponseLocals } from "../types/response-locals.js";
import { StatisticService } from "../service/statistic-service.js";
import { handlerError } from "../helpers/handler-error.js";

type RequestQuery = { formId: number };

export const statisticController = async (
    req: Request<unknown, unknown, unknown, RequestQuery>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { formId } = req.query;
        const { userId } = res.locals;
        const statisticService = new StatisticService(userId, formId)
        const statistic = await statisticService.getStatistic()
        res.send(statistic);
    } catch (error) {
        console.error(error);
        handlerError(error, res)
    }
};
