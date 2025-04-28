import { Request, Response } from "express";
import { likeRequest } from "../types/like-request.js";
import { Likes } from "../db/tables/Likes.js";
import { ResponseLocals } from "../types/response-locals.js";

const updateLike = async (isLiked: boolean, formId: number, userId: number) => {
    if (isLiked) {
        await Likes.destroy({ where: { userId, formId } });
    } else {
        await Likes.bulkCreate([{ userId, formId }], {
            ignoreDuplicates: true,
        });
    }
};

export const likeController = async (
    req: Request<unknown, unknown, likeRequest>,
    res: Response<unknown, ResponseLocals>
) => {
    try {
        const { formId, isLiked } = req.body;
        const { userId } = res.locals;
        await updateLike(isLiked, formId, userId);
        res.send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
