import { Request, Response } from "express";
import { typesenseClient } from "../db/typesense/index.js";
import { SearchResponse } from "typesense/lib/Typesense/Documents.js";

type TagDocument = {
    id: string;
    tag: string;
};

export const tagController = async (
    req: Request<unknown, unknown, unknown, { tag: string }>,
    res: Response
) => {
    try {
        const { tag } = req.query;
        const result = (await typesenseClient
            .collections("tags")
            .documents()
            .search({
                q: tag,
                query_by: "tag",
                prefix: true,
                per_page: 10,
            })) as SearchResponse<TagDocument>;
        res.send(result.hits?.map((hit) => hit.document.tag));
    } catch (error) {
        console.error("Get Tag Error:", error);
        res.status(500).send();
    }
};
