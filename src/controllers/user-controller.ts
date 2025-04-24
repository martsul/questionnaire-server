import { Request, Response } from "express";
import { UserRequestQuery } from "../types/user-request-query.js";
import { typesenseClient } from "../db/typesense/index.js";
import { SearchResponse } from "typesense/lib/Typesense/Documents.js";

type UserDocument = {
    id: string;
    name: string;
    email: string;
};

export const userController = async (
    req: Request<unknown, unknown, unknown, UserRequestQuery>,
    res: Response
) => {
    try {
        const { user, userFilter } = req.query;
        const result = (await typesenseClient
            .collections("users")
            .documents()
            .search({
                q: user,
                query_by: userFilter,
                prefix: true,
                per_page: 10,
            })) as SearchResponse<UserDocument>;
        res.send(result.hits?.map(hit => hit.document));
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
