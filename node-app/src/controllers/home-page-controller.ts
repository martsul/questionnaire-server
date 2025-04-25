import { Request, Response } from "express";
import { HomePageService } from "../service/home-page-service.js";

export const homePageController = async (req: Request, res: Response) => {
    try {
        const homePageService = new HomePageService();
        const homePageData = await homePageService.get();
        res.send(homePageData);
    } catch (error) {
        console.error(error)
        res.status(500).send()
    }
};
