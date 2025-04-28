import { Op, Sequelize } from "sequelize";
import { Answers } from "../db/tables/Answers.js";
import { Forms } from "../db/tables/Forms.js";
import { Users } from "../db/tables/Users.js";
import { Questions } from "../db/tables/Questions.js";

export class StatisticService {
    #userId: number;
    #formId: number;

    constructor(userId: number, formId: number) {
        this.#userId = userId;
        this.#formId = formId;
    }

    async getStatistic() {
        const canGet: boolean = await this.#checkGetPass();
        if (!canGet) throw new Error("User Has No Rights");
        return await this.#getStatistic();
    }

    async #getStatistic() {
            return await Answers.findAll({
                where: { formId:this.#formId, answer: { [Op.not]: "" } },
                attributes: [
                    "questionId",
                    "answer",
                    [
                        Sequelize.fn("COUNT", Sequelize.col("Answers.answer")),
                        "answerCount",
                    ],
                ],
                include: { model: Questions, attributes: ["title"] },
                group: [
                    "Question.title",
                    "Answers.answer",
                    "Question.id",
                    "Answers.question_id",
                ],
                order: [[{ model: Questions, as: "Question" }, "index", "ASC"]],
            });
    }

    async #checkGetPass() {
        const isAdmin = await this.#checkIsAdmin();
        const isOwner = await this.#checkIsOwner();
        return isAdmin || isOwner;
    }

    async #checkIsAdmin() {
        const user = await Users.findOne({ where: { id: this.#userId } });
        return Boolean(user?.isAdmin);
    }

    async #checkIsOwner() {
        const form = await Forms.findOne({ where: { id: this.#formId } });
        return Boolean(form?.ownerId === this.#userId);
    }
}
