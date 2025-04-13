import { QueryTypes } from "sequelize";
import { sequelize } from "../db";
import { ResponseUser } from "../types/response-user";

export const userQuery = async (query: string, filter: "email" | "name") => {
    const vector = `${filter}_vector`;

    console.log;

    return (await sequelize.query(
        `
        SELECT id, name, email, 
        ts_rank(${vector}, to_tsquery('english', :tsquery )) AS rank
        FROM "user"
        WHERE ${vector} @@ to_tsquery('english', :tsquery)
        ORDER BY rank DESC
        LIMIT 10;
    `,
        {
            replacements: { tsquery: query || "*" },
            type: QueryTypes.SELECT,
        }
    )) as ResponseUser[];
};
