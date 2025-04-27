import { Request, Response } from "express";
import { typesenseClient } from "../db/typesense/index.js";
import { SearchResponse } from "typesense/lib/Typesense/Documents.js";
import { FormDocument } from "../types/form-document.js";

type Query = {
    word: string;
    searchBy?: string;
};

const searchFields =
    "title,description,theme,tags,questionTitles,questionDescriptions,questionAnswers,comments";

const find = async (q: string, query_by: string) => {
    return (await typesenseClient.collections("forms").documents().search({
        q,
        query_by,
        prefix: true,
        per_page: 10,
    })) as SearchResponse<FormDocument>;
};

const convertResult = (forms: SearchResponse<FormDocument>) => {
    return forms.hits?.map((hit) => {
        const coincidence = hit.highlights ? hit.highlights[0]?.snippet : "";
        return {
            id: hit.document.id,
            title: hit.document.title,
            coincidence,
        };
    });
};

export const searchFormController = async (
    req: Request<unknown, unknown, unknown, Query>,
    res: Response
) => {
    try {
        const { word, searchBy } = req.query;
        const forms = await find(word, searchBy || searchFields);
        const convertedForms = convertResult(forms);
        res.send(convertedForms);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
