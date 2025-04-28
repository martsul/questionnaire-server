import { Op, Transaction } from "sequelize";
import { sequelize } from "../db/index.js";
import { Answers } from "../db/tables/Answers.js";
import { FormUser } from "../db/tables/Form-User.js";
import { Forms } from "../db/tables/Forms.js";
import { Questions } from "../db/tables/Questions.js";
import { Users } from "../db/tables/Users.js";

type requestAnswers = Record<string, string | string[]>;

type ConvertedPostData = {
    formId: number;
    userId: number;
    resultId: number;
    questionId: string;
    answer: string;
    inStatistic: boolean;
};

type convertUpdateAnswers = {
    userId: number;
    questionId: string;
    answer: string;
    resultId: number;
    createdAt: Date;
    formId: number;
};

export class AnswerService {
    #userId: number;

    constructor(userId: number) {
        this.#userId = userId;
    }

    async getAnswer(resultId: number) {
        const { isAllAnswers, canGet } = await this.#checkGetPass(resultId);
        if (!canGet) throw new Error("No Access to Get Answer");
        const answers = await this.#queryAnswers(isAllAnswers, resultId);
        return this.#formatAnswers(answers);
    }

    async postAnswer(answers: requestAnswers, formId: number) {
        const canPost: boolean = await this.#checkPostPass(formId);
        if (!canPost) throw new Error("No Access to Post Answer");
        await this.#postAnswer(answers, formId);
    }

    async deleteAnswers(answerIds: number[]) {
        const canDelete: boolean = await this.#checkChangePass(answerIds);
        if (!canDelete) throw new Error("No Access to Delete Answers");
        await Answers.destroy({ where: { resultId: { [Op.in]: answerIds } } });
    }

    async updateAnswer(answerId: number, answers: requestAnswers) {
        const canUpdate: boolean = await this.#checkChangePass([answerId]);
        if (!canUpdate) throw new Error("No Access to Update Answers");
        await this.#updateAnswer(answerId, answers);
    }

    async #updateAnswer(answerId: number, answers: requestAnswers) {
        const answerInfo = await this.#findAnswerInfo(answerId);
        await this.#deleteOldAnswers(answerId);
        await this.#createNewAnswers(answerId, answers, answerInfo);
    }

    async #checkGetPass(resultId: number) {
        const form = await this.#findFormByResultId(resultId);
        const isOwnerForm = this.#checkIsOwnerForm(form);
        const isAdmin = await this.#checkIsAdmin();
        const isOwnerAnswer = await this.#checkIsOwnerAnswer(resultId);
        return {
            canGet: isOwnerForm || isOwnerAnswer || isAdmin,
            isAllAnswers: isAdmin || isOwnerAnswer,
        };
    }

    async #createNewAnswers(
        resultId: number,
        answers: requestAnswers,
        answerDetails: Answers
    ) {
        const convertedAnswers = this.#convertUpdateAnswers(
            resultId,
            answers,
            answerDetails
        );
        await Answers.bulkCreate(convertedAnswers);
    }

    async #deleteOldAnswers(resultId: number) {
        await Answers.destroy({ where: { resultId } });
    }

    async #postAnswer(answers: requestAnswers, formId: number) {
        await sequelize.transaction(async (transaction) => {
            const resultId = await this.#findResultId(transaction);
            const convertedData = await this.#convertPostData(
                answers,
                formId,
                resultId
            );
            await Answers.bulkCreate(convertedData, { transaction });
        });
    }

    async #checkChangePass(resultIds: number[]) {
        const isAdmin = await this.#checkIsAdmin();
        if (isAdmin) return true;
        return await this.#checkOwnerAnswers(resultIds);
    }

    async #checkOwnerAnswers(resultIds: number[]) {
        const answers = await Answers.findAll({
            where: { userId: this.#userId, resultId: { [Op.in]: resultIds } },
            attributes: ["resultId"],
            group: ["resultId"],
        });
        return answers.length === resultIds.length;
    }

    async #checkInStatistic(ids: string[]) {
        const questions = await Questions.findAll({
            where: { id: ids },
            attributes: ["id", "inStatistic"],
        });
        return new Map(questions.map((q) => [q.id, q.inStatistic]));
    }

    async #checkIsAdmin(): Promise<boolean> {
        const userInfo = await Users.findOne({
            where: { id: this.#userId },
            attributes: ["isAdmin"],
        });
        return Boolean(userInfo?.isAdmin);
    }

    async #checkIsOwnerAnswer(resultId: number): Promise<boolean> {
        const answer = await Answers.findOne({
            where: { resultId },
        });
        return answer?.userId === this.#userId;
    }

    async #checkPostPass(formId: number) {
        const isAdmin = await this.#checkIsAdmin();
        const isAccess = await this.#checkIsPostAccess(formId);
        return isAdmin || isAccess;
    }

    async #checkIsPostAccess(formId: number) {
        const form = await this.#findForm(formId);
        const isOwner = this.#checkIsOwnerForm(form);
        const isAvailable = this.#checkIsAvailable(form);
        return isOwner || isAvailable;
    }

    #checkIsAvailable(form: Forms) {
        const isPublic = form.isPublic;
        const isAvailableUser = form.FormUsers.find(
            (fu) => fu.userId === this.#userId
        );
        return isPublic || Boolean(isAvailableUser);
    }

    #checkIsOwnerForm(form: Forms) {
        return form.ownerId === this.#userId;
    }

    #convertUpdateAnswers(
        resultId: number,
        answers: requestAnswers,
        answerDetails: Answers
    ) {
        const convertedAnswers: convertUpdateAnswers[] = [];
        Object.keys(answers).forEach((questionId) => {
            if (Array.isArray(answers[questionId])) {
                answers[questionId].forEach((a) => {
                    convertedAnswers.push(
                        this.#convertUpdateAnswer(
                            resultId,
                            a,
                            answerDetails,
                            questionId
                        )
                    );
                });
            } else {
                convertedAnswers.push(
                    this.#convertUpdateAnswer(
                        resultId,
                        answers[questionId],
                        answerDetails,
                        questionId
                    )
                );
            }
        });
        return convertedAnswers;
    }

    #convertUpdateAnswer(
        resultId: number,
        answer: string,
        answerDetails: Answers,
        questionId: string
    ) {
        return {
            userId: this.#userId,
            questionId,
            answer,
            resultId,
            createdAt: answerDetails.createdAt,
            formId: answerDetails.formId,
            inStatistic: answerDetails.inStatistic
        } as convertUpdateAnswers;
    }

    async #convertPostData(
        answers: requestAnswers,
        formId: number,
        resultId: number
    ) {
        const convertedData: ConvertedPostData[] = [];
        const inStatisticAnswers = await this.#checkInStatistic(
            Object.keys(answers)
        );
        Object.keys(answers).forEach((questionId) => {
            if (Array.isArray(answers[questionId])) {
                answers[questionId].forEach((answer) => {
                    convertedData.push({
                        formId,
                        userId: this.#userId,
                        resultId,
                        questionId,
                        answer,
                        inStatistic: Boolean(
                            inStatisticAnswers.get(questionId)
                        ),
                    });
                });
            } else {
                convertedData.push({
                    formId,
                    userId: this.#userId,
                    resultId,
                    questionId,
                    answer: answers[questionId],
                    inStatistic: Boolean(inStatisticAnswers.get(questionId)),
                });
            }
        });
        return convertedData;
    }

    #formatAnswers(answers: Answers[]) {
        const questions = this.#formatQuestions(answers);
        return {
            user: { name: answers[0].User.name, id: answers[0].User.id },
            createdAt: answers[0].createdAt,
            answers: answers.map((a) => ({
                answer: a.answer,
                questionId: a.Question.id,
            })),
            questions,
        };
    }

    #formatQuestions(answers: Answers[]) {
        const ids = new Set();
        return answers
            .map((a) => ({
                id: a.Question.id,
                title: a.Question.title,
                type: a.Question.type,
                description: a.Question.description,
                answers: a.Question.answers,
                inStatistic: a.inStatistic,
            }))
            .filter((a) => {
                if (ids.has(a.id)) {
                    return false;
                }
                ids.add(a.id);
                return true;
            });
    }

    async #findAnswerInfo(resultId: number) {
        const answer = await Answers.findOne({
            where: { resultId },
            attributes: ["createdAt", "formId", "inStatistic"],
        });
        if (!answer) throw new Error("There is no such Answer");
        return answer;
    }

    async #findResultId(transaction: Transaction) {
        const maxResult: number | null = await Answers.max("resultId", {
            transaction,
        });
        return maxResult ? maxResult + 1 : 1;
    }

    async #findFormByResultId(resultId: number) {
        const answer = await Answers.findOne({
            where: { resultId },
            attributes: [],
            include: { model: Forms },
        });
        if (!answer?.Form) throw new Error("No Answer With This ID");
        return answer.Form;
    }

    async #findForm(formId: number) {
        const form = await Forms.findOne({
            where: { id: formId },
            include: [{ model: FormUser }],
        });
        if (!form) {
            throw new Error("Form Not Found");
        }
        return form;
    }

    async #queryAnswers(isAllAnswers: boolean, resultId: number) {
        const where: any = { resultId };
        if (!isAllAnswers) {
            where.inStatistic = true;
        }
        return await Answers.findAll({
            where,
            attributes: ["answer", "createdAt", "inStatistic"],
            include: [
                {
                    model: Users,
                    attributes: ["name", "id"],
                },
                {
                    model: Questions,
                    attributes: [
                        "id",
                        "title",
                        "type",
                        "description",
                        "answers",
                    ],
                },
            ],
            order: [[{ model: Questions, as: "Question" }, "index", "ASC"]],
        });
    }
}
