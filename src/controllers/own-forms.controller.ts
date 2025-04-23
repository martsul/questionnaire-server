import { Request, Response } from "express";
import { Forms } from "../db/tables/Forms.js";

export const ownFormsController = async (
    req: Request<any, any, any, { ownerId: number }>,
    res: Response
) => {
    try {
        const { ownerId } = req.query;
        const forms = await Forms.findAll({
            where: { ownerId },
            attributes: ["id", "title", "isPublic"],
        });
        res.send(forms);
    } catch (error) {
        res.status(500).send();
        console.error(error);
    }
};
