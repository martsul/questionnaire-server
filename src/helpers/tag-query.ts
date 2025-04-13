import { QueryTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { ResponseTags } from "../types/response-tags.js";

export const tagQuery = async (tag: string) => {
    return await sequelize.query(
        `
        SELECT tag, ts_rank(tag_vector, to_tsquery('english', :tsquery) || to_tsquery('spanish', :tsquery)) AS rank
        FROM tags
        WHERE tag_vector @@ (to_tsquery('english', :tsquery) || to_tsquery('spanish', :tsquery))
        ORDER BY rank DESC
        LIMIT 10;
    `,
        {
            replacements: { tsquery: tag },
            type: QueryTypes.SELECT,
        }
    ) as ResponseTags[];
};
