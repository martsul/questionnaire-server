import { Request, Response } from "express";
import { Answers } from "../db/tables/Answers.js";
import { Users } from "../db/tables/Users.js";
import { Questions } from "../db/tables/Questions.js";

const requestAnswers = async (resultId: number) => {
    return await Answers.findAll({
        where: { resultId, inStatistic: true },
        attributes: ["answer", "createdAt", "inStatistic"],
        include: [
            {
                model: Users,
                attributes: ["name"],
            },
            {
                model: Questions,
                attributes: ["id", "title", "type", "description", "answers"],
            },
        ],
        order: [[{ model: Questions, as: "Question" }, "index", "ASC"]],
    });
};

const formatQuestions = (
    answers: Awaited<ReturnType<typeof requestAnswers>>
) => {
    const ids = new Set();
    return answers
        .map((a) => ({
            id: a.Question.id,
            title: a.Question.title,
            type: a.Question.type,
            description: a.Question.description,
            answers: a.Question.answers,
            inStatistic: true,
        }))
        .filter((a) => {
            if (ids.has(a.id)) {
                return false;
            }
            ids.add(a.id);
            return true;
        });
};

const formatAnswers = (answers: Awaited<ReturnType<typeof requestAnswers>>) => {
    const questions = formatQuestions(answers);
    return {
        user: answers[0].User.name,
        createdAt: answers[0].createdAt,
        answers: answers.map((a) => ({
            answer: a.answer,
            questionId: a.Question.id,
        })),
        questions,
    };
};

export const getAnswerController = async (
    req: Request<any, any, any, { answerId: number }>,
    res: Response
) => {
    try {
        const { answerId } = req.query;
        const answers = await requestAnswers(answerId);
        const formattedAnswers = formatAnswers(answers);
        res.send(formattedAnswers);
    } catch (error) {
        res.status(404).send();
        console.error(error);
    }
};
