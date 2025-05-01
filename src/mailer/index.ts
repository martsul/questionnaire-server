import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

export const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true, 
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
    },
});
