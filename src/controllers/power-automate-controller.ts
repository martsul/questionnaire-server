import { Request, Response } from "express";
import { handlerError } from "../helpers/handler-error.js";
import { config } from "dotenv";
import { transporter } from "../mailer/index.js";

config();

type Body = {
    reportedBy: string;
    priority: string;
    summary: string;
    formTitle: string;
    link: string;
};

const sendEmail = async (body: Body) => {
    await transporter.sendMail({
        from: `"Quiz App" <${process.env.MAILER_EMAIL}>`,
        to: process.env.SUPPORT_EMAIL,
        text: JSON.stringify(body, null, 2),
    });
};

export const powerAutomateController = async (
    req: Request<unknown, unknown, Body>,
    res: Response
) => {
    try {
        await sendEmail(req.body);
        res.send("ok");
    } catch (error) {
        console.error("Power Automate Error:", error);
        handlerError(error, res);
    }
};
