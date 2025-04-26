import { Response } from "express";
import { AuthorizationError } from "../errors/authorization-error.js";

export const handlerError = (error: unknown, res: Response) => {
    if (error instanceof AuthorizationError) {
        res.status(401).send("Unauthorized")
    }
    res.status(400).send()
};
