import { Request, Response } from "express";
import { likeRequest } from "../types/like-request.js";
import { Likes } from "../db/tables/Likes.js";

export const likeController = async (req: Request, res: Response) => {
    try {
        const { userId, formId, isLiked } = req.body as likeRequest;
        if (isLiked) {
            await Likes.destroy({ where: { userId, formId } });
        } else {
            await Likes.bulkCreate([{ userId, formId }], {
                ignoreDuplicates: true,
            });
        }
        res.send();
    } catch (error) {
        console.error(error)
        res.status(500).send();
    }
};
