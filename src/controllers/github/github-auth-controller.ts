import { config } from "dotenv";
import { Request, Response } from "express";
config();

export const githubAuthController = (req: Request, res: Response) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user:email`;
    res.redirect(redirectUri);
};
