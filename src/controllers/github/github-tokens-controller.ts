import { Request, Response } from "express";
import { GithubService } from "../../service/github-service.js";
import { TokensService } from "../../service/tokens-service.js";
import { handlerError } from "../../helpers/handler-error.js";

type Query = { token: string };

export const githubTokensController = async (
    req: Request<unknown, unknown, unknown, Query>,
    res: Response
) => {
    const githubService = new GithubService();
    const user = await githubService.getUser(req.query.token);
    const tokens = new TokensService(user);
    await tokens.save();
    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 2592000000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.send(tokens.accessToken);
    try {
    } catch (error) {
        console.error("Github Tokens Error:", error);
        handlerError(error, res);
    }
};
