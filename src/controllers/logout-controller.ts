import { Request, Response } from "express";

export const logoutController = (req: Request, res: Response) => {
    try {
        res.clearCookie("refreshToken");
        res.send("ok");
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).send("Unknown Error");
    }
};
