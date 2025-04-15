import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Users } from "../db/Users.js";
import { AuthorizationError } from "../errors/authorization-error.js";
import { TokensService } from "../service/tokens-service.js";

config();

const getId = (refreshToken: string) => {
    const result = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;
    return result.id as number;
};

const findUser = async (id: number) => {
    const user = await Users.findOne({
        where: { id },
        raw: true,
        attributes: ["name", "email", "id", "isAdmin"],
    });
    if (!user) {
        throw new AuthorizationError();
    }
    return user;
};

export const refreshController = async (req: Request, res: Response) => {
    try {
        const id = getId(req.cookies.refreshToken);
        const user = await findUser(id);
        const tokens = new TokensService(user);
        await tokens.save();
        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 2592000000,
            httpOnly: true,
        });
        res.json(tokens);
    } catch (error) {
        res.status(401).send("Unauthorized");
    }
};
