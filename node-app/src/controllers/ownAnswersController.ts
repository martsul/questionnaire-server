import { Request, Response } from "express";
import { Answers } from "../db/tables/Answers.js";
import { Sequelize } from "sequelize";
import { Users } from "../db/tables/Users.js";
import { Forms } from "../db/tables/Forms.js";

export const ownAnswersController = async (
    req: Request<unknown, unknown, unknown, { userId: number }>,
    res: Response
) => {
    try {
        const { userId } = req.query;
        const answers = await Answers.findAll({
            where: { userId },
            attributes: [
                ["result_id", "answerId"],
                "formId",
                "createdAt",
                [Sequelize.col("Form.title"), "title"],
            ],
            group: ["answerId", "formId", "User.name", "Form.title", "Answers.created_at"],
            include: [
                { model: Users, attributes: [] },
                { model: Forms, attributes: [] },
            ],
            order: [["answerId", "ASC"]]
        });
        res.send(answers);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
