import { cast, col, fn, Op } from "sequelize";
import { Answers } from "../db/tables/Answers.js";
import { Forms } from "../db/tables/Forms.js";
import { OdooTokens } from "../db/tables/Odoo-Tokens.js";
import { Users } from "../db/tables/Users.js";
import { UnknownOdooApi } from "../errors/unknown-odoo-api.js";
import { Questions } from "../db/tables/Questions.js";
import { AggregatedAnswers } from "../types/aggregated-answers.js";
import { CountingAnswers } from "../types/counting-answers.js";

export class PostOdooApiService {
    #api: string;

    constructor(api: string) {
        this.#api = api;
    }

    async getForms() {
        const user = await this.#findUserByApi();
        const results = await this.#findResults(user);
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

    async #findResults(user: Users) {
        const forms = await this.#findForms(user.id);
        const answers = await this.#findAnswers(forms.map((form) => form.id));
        const convertedResult = this.#convertResult(forms, answers, user.name);
        return convertedResult;
    }

    async #convertResult(
        forms: Forms[],
        answers: [Answers[], Answers[], Answers[]],
        ownerName: string
    ) {
        const convertedAggregatedAnswers = this.#convertAggregatedAnswers(
            answers[1],
            answers[2]
        );
        const countingAnswers = this.#convertCountingAnswers(
            answers[0],
            convertedAggregatedAnswers
        );
        return this.#convertForm(forms, countingAnswers, ownerName);
    }

    #convertForm(
        forms: Forms[],
        countingAnswers: CountingAnswers,
        ownerName: string
    ) {
        return forms.map((form) => ({
            title: form.title,
            ownerName,
            questions: countingAnswers[form.id],
        }));
    }

    #convertCountingAnswers(
        answers: Answers[],
        aggregatedAnswers: AggregatedAnswers
    ) {
        const countingAnswers: CountingAnswers = {};
        answers.forEach((a) => {
            const answer = {
                answerCount: a.get().answerCount,
                type: a.Question.type,
                title: a.Question.title,
                answers: aggregatedAnswers[a.questionId],
            };
            if (countingAnswers[a.formId]) {
                countingAnswers[a.formId].push(answer);
            } else {
                countingAnswers[a.formId] = [answer];
            }
        });
        return countingAnswers;
    }

    #convertAggregatedAnswers(numberAnswer: Answers[], textAnswers: Answers[]) {
        const aggregatedAnswers: AggregatedAnswers = {};
        numberAnswer.forEach((answer) =>
            this.#convertNumberAnswers(answer, aggregatedAnswers)
        );
        textAnswers.forEach((answer) =>
            this.#convertTextAnswer(answer, aggregatedAnswers)
        );
        return aggregatedAnswers;
    }

    #convertTextAnswer(
        textAnswer: Answers,
        aggregatedAnswers: AggregatedAnswers
    ) {
        const answer = { count: textAnswer.count, answer: textAnswer.answer };
        const aggregatedAnswer = aggregatedAnswers[textAnswer.questionId];
        if (Array.isArray(aggregatedAnswer) && aggregatedAnswer.length < 3) {
            aggregatedAnswer.push(answer);
        } else if (!Array.isArray(aggregatedAnswer)) {
            aggregatedAnswers[textAnswer.questionId] = [answer];
        }
    }

    #convertNumberAnswers(
        numberAnswer: Answers,
        aggregatedAnswers: AggregatedAnswers
    ) {
        const answer = {
            min: numberAnswer.min,
            max: numberAnswer.max,
            average: numberAnswer.average,
        };
        aggregatedAnswers[numberAnswer.questionId] = answer;
    }

    async #findAnswers(formIds: number[]) {
        return await Promise.all([
            this.#answerCounting(formIds),
            this.#numberAnswerCounting(formIds),
            this.#popularAnswerCounting(formIds),
        ]);
    }

    async #popularAnswerCounting(formId: number[]) {
        return await Answers.findAll({
            where: { formId, answer: { [Op.ne]: "" } },
            raw: true,
            include: {
                model: Questions,
                attributes: [],
                where: { type: { [Op.ne]: "number" } },
            },
            attributes: ["questionId", "answer", [fn("COUNT", "*"), "count"]],
            order: [[fn("COUNT", "*"), "DESC"]],
            group: [
                "questionId",
                "answer",
                "Question.id",
                "Question.title",
                "Question.type",
            ],
        });
    }

    async #answerCounting(formId: number[]) {
        return await Answers.findAll({
            where: {
                formId,
                answer: { [Op.ne]: "" },
            },
            attributes: [
                "questionId",
                "formId",
                [fn("COUNT", col("question_id")), "answerCount"],
            ],
            include: [
                {
                    model: Questions,
                    attributes: ["type", "title", "index"],
                    as: "Question",
                },
            ],
            group: [
                "questionId",
                "formId",
                "Question.type",
                "Question.title",
                "Question.id",
                "Question.index",
            ],
            order: [["Question", "index", "ASC"]],
        });
    }

    async #numberAnswerCounting(formId: number[]) {
        return await Answers.findAll({
            where: {
                formId,
                answer: { [Op.regexp]: "^([0-9]+(.[0-9]*)?|(.[0-9]+))$" },
            },
            include: [
                { model: Questions, attributes: [], where: { type: "number" } },
            ],
            raw: true,
            attributes: [
                "questionId",
                [
                    fn(
                        "ROUND",
                        cast(
                            fn("AVG", cast(col("answer"), "NUMERIC")),
                            "NUMERIC"
                        ),
                        2
                    ),
                    "average",
                ],
                [fn("MIN", cast(col("answer"), "FLOAT")), "min"],
                [fn("MAX", cast(col("answer"), "FLOAT")), "max"],
            ],
            group: ["questionId"],
        });
    }

    async #findForms(ownerId: number) {
        return await Forms.findAll({
            where: { ownerId },
            attributes: ["id", "title"],
        });
    }
}
