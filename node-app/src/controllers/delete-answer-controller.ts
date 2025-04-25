import { Request, Response } from "express";
import { Answers } from "../db/tables/Answers.js";
import { Op } from "sequelize";

export const deleteAnswerController = async (
    req: Request<unknown, unknown, { ids: number[] }>,
    res: Response
) => {
    try {
        const answerIds = req.body.ids;
        await Answers.destroy({ where: { resultId: { [Op.in]: answerIds } } });
        res.send();
    } catch (error) {
        res.status(500).send();
        console.error(error);
    }
};
