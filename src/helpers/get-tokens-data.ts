import { Response } from "express";
import { tokenDataGuard } from "../guards/token-data-guard";

export const getTokensData = (res: Response) => {
    const tokensData = res.locals.tokensData;
    return tokenDataGuard(tokensData);
};
