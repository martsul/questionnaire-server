import { Request, Response } from "express";
import { ResponseTags } from "../types/response-tags.js";
import { tagQuery } from "../helpers/tag-query.js";

export const tagController = async (req: Request, res: Response) => {
    try {
        const { tag } = req.query;
        const result: ResponseTags[] = await tagQuery(tag as string);
        const convertResult = result.map((e) => e.tag);
        res.send(convertResult);
    } catch (error) {
        res.status(500).send()
        console.log(error);
    }
};
