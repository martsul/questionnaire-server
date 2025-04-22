import { Request, Response } from "express";
import { HomePageService } from "../service/home-page-service.js";

export const homePageController = async (req: Request, res: Response) => {
    try {
        const homePageService = new HomePageService();
        const a = await homePageService.get();
        res.send(a);
    } catch (error) {
        res.status(500).send()
        console.error(error)
    }
};
