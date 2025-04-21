import { Request, Response } from "express";
import { AnswerRequestBody } from "../types/answer-request-body.js";
import { sequelize } from "../db/index.js";
import { Answers } from "../db/tables/Answers.js";
import { Transaction } from "sequelize";
import { Questions } from "../db/tables/Questions.js";

type ConvertedData = {
    formId: number;
    userId: number;
    resultId: number;
    questionId: string;
    answer: string;
    inStatistic: boolean;
};

const getInStatistic = async (ids: string[]) => {
    const questions = await Questions.findAll({
        where: { id: ids },
        attributes: ["id", "inStatistic"],
    });
    return new Map(questions.map((q) => [q.id, q.inStatistic]));
};

const findResultId = async (transaction: Transaction) => {
    const maxResult: number | null = await Answers.max("resultId", {
        transaction,
    });
    return maxResult ? maxResult + 1 : 1;
};

const convertData = async (
    data: AnswerRequestBody,
    resultId: number
): Promise<ConvertedData[]> => {
    const { formId, userId, answers } = data;
    const convertedData: ConvertedData[] = [];
    const inStatisticAnswers = await getInStatistic(Object.keys(answers));
    Object.keys(answers).forEach((questionId) => {
        if (Array.isArray(answers[questionId])) {
            answers[questionId].forEach((answer) => {
                convertedData.push({
                    formId,
                    userId,
                    resultId,
                    questionId,
                    answer,
                    inStatistic: inStatisticAnswers.get(questionId) as boolean,
                });
            });
        } else {
            convertedData.push({
                formId,
                userId,
                resultId,
                questionId,
                answer: answers[questionId],
                inStatistic: inStatisticAnswers.get(questionId) as boolean,
            });
        }
    });
    return convertedData;
};

export const postAnswerController = async (
    req: Request<any, any, AnswerRequestBody>,
    res: Response
) => {
    try {
        await sequelize.transaction(async (transaction) => {
            const resultId = await findResultId(transaction);
            const convertedData = await convertData(req.body, resultId);
            await Answers.bulkCreate(convertedData, { transaction });
            res.send("ok");
        });
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
