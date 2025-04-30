import { Request, Response } from "express";
import { config } from "dotenv";
import { TokensService } from "../service/tokens-service.js";
import { validateToken } from "../helpers/validate-token.js";
import { User } from "../class/user.js";

config();

export const refreshController = async (req: Request, res: Response) => {
    try {
        const id = validateToken(
            req.cookies.refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        const user = await new User(id).getUser()
        const tokens = new TokensService(user);
        await tokens.save();
        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 2592000000,
            httpOnly: true,
        });
        res.json(tokens.accessToken);
    } catch (error) {
        console.error("Refresh Error:", error);
        res.status(401).send("Unauthorized");
    }
};
