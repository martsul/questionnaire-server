import { Request, Response } from "express";
import { Answers } from "../db/tables/Answers.js";
import { Users } from "../db/tables/Users.js";

export const getAnswersController = async (
    req: Request<any, any, any, { formId: number }>,
    res: Response
) => {
    try {
        const { formId } = req.query;
        const result = await Answers.findAll({
            where: { formId },
            attributes: ["createdAt", "resultId"],
            include: { model: Users, attributes: ["name", "email"] },
            group: [
                "resultId",
                "createdAt",
                "User.id",
                "name",
                "email",
                "Answers.id",
            ],
            order: [["id", "ASC"]],
        });
        res.send(
            result.map((r) => ({
                resultId: r.resultId,
                createdAt: r.createdAt,
                name: r.User.name,
                email: r.User.email,
            }))
        );
    } catch (error) {
        res.status(500).send();
        console.log(error);
    }
};
