import { config } from "dotenv";
import { Request, Response } from "express";
import { GithubService } from "../../service/github-service.js";
import { TokensService } from "../../service/tokens-service.js";
import { convertUserData } from "../convert-user-data.js";
config();

type Query = { code: string };

export const githubCallbackController = async (
    req: Request<unknown, unknown, unknown, Query>,
    res: Response
) => {
    try {
        const githubService = new GithubService();
        const githubToken = await githubService.getToken(req.query.code);

        res.redirect(
            (process.env.CLIENT_URL as string) + `/github/${githubToken}`
        );
    } catch (error) {
        console.error("Github Callback Error:", error);
        res.redirect(process.env.CLIENT_URL as string);
    }
};
