import { Request, Response } from "express";

export const logoutController = (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    res.send();
};
