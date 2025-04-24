import { Request, Response } from "express";
import { Answers } from "../db/tables/Answers.js";
import { Users } from "../db/tables/Users.js";

export const answersController = async (
    req: Request<unknown, unknown, unknown, { formId: number }>,
    res: Response
) => {
    try {
        const { formId } = req.query;
        const result = await Answers.findAll({
            where: { formId, inStatistic: true },
            attributes: ["createdAt", "resultId"],
            include: { model: Users, attributes: ["name", "email"] },
            group: [
                "resultId",
                "createdAt",
                "User.id",
                "User.name",
                "User.email",
            ],
            order: [["created_at", "ASC"]],
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
        console.error(error);
        res.status(500).send();
    }
};
