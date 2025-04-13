import { Request, Response } from "express";
import { themeQuery } from "../helpers/theme-query";

export const themeController = async (req: Request, res: Response) => {
    try {
        const { theme } = req.query;
        const result = await themeQuery(theme as string);
        res.send(result.map((e) => e.theme));
    } catch (error) {
        res.status(500).send();
    }
};
