import { QueryTypes } from "sequelize";
import { sequelize } from "../db";
import { ResponseTheme } from "../types/response-theme";

export const themeQuery = async (theme: string) => {
    return await sequelize.query(
        `
        SELECT theme, ts_rank(theme_vector, to_tsquery('english', :tsquery) || to_tsquery('spanish', :tsquery)) AS rank
        FROM theme
        WHERE theme_vector @@ (to_tsquery('english', :tsquery) || to_tsquery('spanish', :tsquery))
        ORDER BY rank DESC
        LIMIT 10;
    `,
        {
            replacements: { tsquery: theme },
            type: QueryTypes.SELECT,
        }
    ) as ResponseTheme[];
};
