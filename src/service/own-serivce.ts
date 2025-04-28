import { Sequelize } from "sequelize";
import { Answers } from "../db/tables/Answers.js";
import { Users } from "../db/tables/Users.js";
import { Forms } from "../db/tables/Forms.js";

export class OwnService {
    #userId: number;

    constructor(userId: number) {
        this.#userId = userId;
    }

    async getAnswers() {
        return await Answers.findAll({
            where: { userId: this.#userId },
            attributes: [
                ["result_id", "answerId"],
                "formId",
                "createdAt",
                [Sequelize.col("Form.title"), "title"],
            ],
            group: [
                "answerId",
                "formId",
                "User.name",
                "Form.title",
                "Answers.created_at",
            ],
            include: [
                { model: Users, attributes: [] },
                { model: Forms, attributes: [] },
            ],
            order: [["answerId", "ASC"]],
        });
    }

    async getForms() {
        return await Forms.findAll({
            where: { ownerId: this.#userId },
            attributes: ["id", "title", "isPublic"],
        });
    }
}
