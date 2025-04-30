import { Response } from "express";
import { getStatusCode } from "./get-status-code.js";
import { getErrorMessage } from "./get-error-message.js";

export const handlerError = (error: unknown, res: Response) => {
    const message = getErrorMessage(error);
    const status = getStatusCode(message);
    res.status(status).send(message);
};
