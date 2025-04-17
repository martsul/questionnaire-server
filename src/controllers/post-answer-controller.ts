import { Request, Response } from "express";
import { AnswerRequestBody } from "../types/answer-request-body.js";
import { sequelize } from "../db/index.js";
import { Answers } from "../db/tables/Answers.js";
import { Transaction } from "sequelize";

type ConvertedData = {
    formId: number;
    userId: number;
    resultId: number;
    questionId: string;
    answer: string;
};

const findResultId = async (transaction: Transaction) => {
    const maxResult: number | null = await Answers.max("resultId", {
        transaction,
    });
    return maxResult ? maxResult + 1 : 1;
};

const convertData = (
    data: AnswerRequestBody,
    resultId: number
): ConvertedData[] => {
    const { formId, userId, answers } = data;
    const convertedData: ConvertedData[] = [];
    Object.keys(answers).forEach((questionId) => {
        if (Array.isArray(answers[questionId])) {
            answers[questionId].forEach((answer) => {
                convertedData.push({
                    formId,
                    userId,
                    resultId,
                    questionId,
                    answer,
                });
            });
        } else {
            convertedData.push({
                formId,
                userId,
                resultId,
                questionId,
                answer: answers[questionId],
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
            const convertedData = convertData(req.body, resultId);
            await Answers.bulkCreate(convertedData, { transaction });
            res.send("ok");
        });
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
