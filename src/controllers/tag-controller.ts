import { Request, Response } from "express";
import { sequelize } from "../db/index.js";
import { QueryTypes } from "sequelize";
import { ResponseTags } from "../types/response-tags.js";

export const tagController = async (req: Request, res: Response) => {
    try {
        const { tag } = req.query;
        const result: ResponseTags[] = await sequelize.query(
            `
        SELECT tag, similarity(tag, :searchTerm) AS sim
        FROM tags
        WHERE tag % :searchTerm
        ORDER BY sim DESC
        `,
            {
                replacements: { searchTerm: tag },
                type: QueryTypes.SELECT,
            }
        );
        const convertResult = result.map((e) => e.tag);
        res.send(convertResult);
    } catch (error) {
        console.log(error);
    }
};
