import { OdooTokens } from "../db/tables/Odoo-Tokens.js";
import crypto from "crypto";
import { ApiTimeError } from "../errors/api-time-error.js";

export class OdooApiKeyService {
    #ownerId: number;

    constructor(ownerId: number) {
        this.#ownerId = ownerId;
    }

    async getApiKey() {
        await this.#checkLastCreated();
        const api = crypto.randomBytes(32).toString("hex");
        await this.#saveApi(api);
        return api;
    }

    async #saveApi(api: string) {
        await OdooTokens.create({ api, ownerId: this.#ownerId });
    }

    async #checkLastCreated() {
        const apiKey = await this.#findApiKey();
        if (apiKey) {
            const diffHours =
                (new Date().getTime() - apiKey.createdAt.getTime()) /
                (1000 * 60 * 60);
            if (diffHours < 2) throw new ApiTimeError();
        }
    }

    async #findApiKey() {
        return await OdooTokens.findOne({
            where: { ownerId: this.#ownerId },
            order: [["createdAt", "DESC"]],
        });
    }
}
