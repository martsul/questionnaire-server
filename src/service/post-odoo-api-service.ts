import { Op } from "sequelize";
import { Answers } from "../db/tables/Answers.js";
import { Forms } from "../db/tables/Forms.js";
import { OdooTokens } from "../db/tables/Odoo-Tokens.js";
import { Users } from "../db/tables/Users.js";
import { UnknownOdooApi } from "../errors/unknown-odoo-api.js";

export class PostOdooApiService {
    #api: string;

    constructor(api: string) {
        this.#api = api;
    }

    async getForms() {
        const user = await this.#findUserByApi();
        const results = await this.#findResults(user.id);
        return results;
    }

    async #findUserByApi() {
        const token = await OdooTokens.findOne({
            where: { api: this.#api },
            include: { model: Users, attributes: ["id", "isAdmin", "name"] },
        });
        if (!token) throw new UnknownOdooApi();
        return token.User;
    }

    async #findResults(ownerId: number) {
        const forms = await this.#findForms(ownerId);
        const answers = await this.#findAnswers(forms.map((form) => form.id));
        return { forms, answers };
    }

    async #findAnswers(formIds: number[]) {
        return await Answers.findAll({
            where: { formId: { [Op.in]: formIds } },
        });
    }

    async #findForms(ownerId: number) {
        return await Forms.findAll({
            where: { ownerId },
            attributes: ["id", "title"],
        });
    }
}
