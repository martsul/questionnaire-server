import { Answers } from "../db/tables/Answers.js";
import { Forms } from "../db/tables/Forms.js";
import { Users } from "../db/tables/Users.js";

export class AnswersService {
    #userId: number;
    #formId: number;

    constructor(userId: number, formId: number) {
        this.#userId = userId;
        this.#formId = formId;
    }

    async getAnswers() {
        const canGet: boolean = await this.#checkGetPass();
        if (!canGet) throw new Error("User Has No Rights");
        const answers = await this.#getAnswers();
        return this.#convertAnswers(answers);
    }

    #convertAnswers(answers: Answers[]) {
        return answers.map((r) => ({
            resultId: r.resultId,
            createdAt: r.createdAt,
            name: r.User.name,
            email: r.User.email,
        }));
    }

    async #getAnswers() {
        return await Answers.findAll({
            where: { formId: this.#formId, inStatistic: true },
            attributes: ["createdAt", "resultId"],
            include: { model: Users, attributes: ["name", "email"] },
            group: [
                "resultId",
                "createdAt",
                "User.id",
                "User.name",
                "User.email",
            ],
            order: [["created_at", "ASC"]],
        });
    }

    async #checkGetPass() {
        const isAdmin = this.#checkIsAdmin();
        const isOwner = this.#checkIsOwner();
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
