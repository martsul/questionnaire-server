import { Request, Response } from "express";
import { Answers } from "../db/tables/Answers.js";
import { Questions } from "../db/tables/Questions.js";
import { Sequelize } from "sequelize";

type RequestQuery = { formId: number };

const answersQuery = async (formId: number) => {
    return await Answers.findAll({
        where: { formId },
        attributes: [
            "questionId",
            "answer",
            [
                Sequelize.fn("COUNT", Sequelize.col("Answers.answer")),
                "answerCount",
            ],
        ],
        include: { model: Questions, attributes: ["title"] },
        group: ["Question.title", "Answers.answer", "Question.id", "Answers.question_id"],
    });
};

export const getStatisticController = async (
    req: Request<any, any, any, RequestQuery>,
    res: Response
) => {
    try {
        const { formId } = req.query;
        const answers = await answersQuery(formId);
        res.send(answers);
    } catch (error) {
        res.status(500).send;
        console.log(error);
    }
};
