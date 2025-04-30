import { Forms } from "../db/tables/Forms.js";
import { Themes } from "../db/tables/Themes.js";
import { Users } from "../db/tables/Users.js";
import { v2 as cloudinary } from "cloudinary";
import { ClientImg } from "../types/client-img.js";
import { UpdateFormData } from "../types/update-form-data.js";
import { Tags } from "../db/tables/Tags.js";
import { Op } from "sequelize";
import { FormTag } from "../db/tables/Form-Tag.js";
import { FormUser } from "../db/tables/Form-User.js";
import { Questions } from "../db/tables/Questions.js";
import { QuestionForm } from "../types/question-form.js";
import { Likes } from "../db/tables/Likes.js";
import { RightsError } from "../errors/rights-error.js";
import { UnknownUserError } from "../errors/unknown-user-error.js";

export class FormService {
    #userId: number;

    constructor(userId: number) {
        this.#userId = userId;
    }

    async delete(data: { ids: number[] }) {
        const canDelete = await this.#checkDeletePass(data.ids);
        if (!canDelete) {
            throw new RightsError();
        }
        await Forms.destroy({ where: { id: { [Op.in]: data.ids } } });
    }

    async create() {
        return await Forms.create({ ownerId: this.#userId });
    }

    async get(data: { formId: number; userId: number }) {
        const form = await this.#findForm(data.formId);
        const themes = await this.#getThemes();
        const { likes, isLikes } = await this.#getLikes(
            data.formId,
            data.userId
        );
        return this.#convertGet(form, themes, likes, isLikes);
    }

    async update(data: UpdateFormData) {
        const canUpdate: boolean = await this.#checkUpdatePass(data.formId);
        if (!canUpdate)
            throw new RightsError();
        await this.#update(data);
    }

    async #update(data: UpdateFormData) {
        await this.#deleteOldImg(data.formId, data.img);
        await this.#updateTags(data.tags, data.formId);
        await this.#updateUsers(data.users, data.formId);
        await this.#updateQuestions(data);
        await this.#updateForm(data);
    }

    async #checkUpdatePass(formId: number) {
        const isAdmin = await this.#checkIsAdmin();
        const isOwner = await this.#checkIsOwnerForms([formId]);
        return isAdmin || isOwner;
    }

    async #checkDeletePass(formIds: number[]): Promise<boolean> {
        const isAdmin = await this.#checkIsAdmin();
        if (isAdmin) return true;
        return await this.#checkIsOwnerForms(formIds);
    }

    async #checkIsOwnerForms(formIds: number[]) {
        const forms = await Forms.findAll({
            where: { ownerId: this.#userId, id: { [Op.in]: formIds } },
        });
        return forms.length === formIds.length;
    }

    async #checkIsAdmin() {
        const user = await Users.findOne({ where: { id: this.#userId } });
        if (!user) throw new UnknownUserError();
        return user.isAdmin;
    }

    async #getLikes(formId: number, userId: number) {
        const likes = await Likes.count({ where: { formId } });
        const isLikes = userId
            ? await Likes.findOne({ where: { userId, formId } })
            : false;
        return { likes, isLikes: Boolean(isLikes) };
    }

    #convertGet(
        result: Forms | null,
        themes: string[],
        likes: number,
        isLiked: boolean
    ) {
        if (!result) return result;
        return {
            head: {
                id: result.id,
                ownerId: result.ownerId,
                title: result.title,
                description: result.description,
                img: result.img,
                isPublic: result.isPublic,
                theme: result.Theme.theme,
                owner: result.owner,
                likes,
                isLiked,
                themes,
            },
            tags: result.tags.map((t) => t.tag),
            users: result.users,
            questions: result.Questions,
        };
    }

    async #getThemes() {
        return (await Themes.findAll({ attributes: ["theme"] })).map(
            (t) => t.theme
        );
    }

    async #getThemeId(theme: string) {
        const result = await Themes.findOne({
            where: { theme: theme },
            attributes: ["id"],
        });
        if (result) {
            return result.id;
        }
        throw new Error("Incorrect Theme");
    }

    async #findForm(id: number) {
        return await Forms.findByPk(id, {
            attributes: {
                exclude: ["themeId"],
            },
            include: [
                { model: Questions, attributes: { exclude: ["formId"] } },
                { model: Themes, attributes: ["theme"] },
                {
                    model: Tags,
                    as: "tags",
                    attributes: ["tag"],
                    through: { attributes: [] },
                },
                {
                    model: Users,
                    as: "users",
                    attributes: ["name", "id", "email"],
                    through: { attributes: [] },
                },
            ],
        });
    }

    async #findOldImg(formId: number) {
        return await Forms.findOne({
            where: { id: formId },
            attributes: ["img"],
        });
    }

    async #deleteOldImg(formId: number, newImg: ClientImg) {
        if (typeof newImg === "string" && newImg !== "") return;
        const imgSrc = await this.#findOldImg(formId);
        if (imgSrc?.img) {
            const imgId = imgSrc.img
                .split("/")
                .slice(-2)
                .join("/")
                .split(".")[0];
            await cloudinary.uploader.destroy(imgId, {
                resource_type: "image",
                invalidate: true,
            });
        }
    }

    async #uploadImg(imgData: Record<"img" | "type", string | null>) {
        if (imgData.img) {
            const dataUrl = `data:${imgData.type};base64,${imgData.img}`;
            const uploadResult = await cloudinary.uploader.upload(dataUrl, {
                resource_type: "image",
                public_id: `form_image_${Date.now()}`,
                folder: "forms",
            });
            return uploadResult.secure_url;
        }
        return "";
    }

    async #getImgSrc(imgData: ClientImg) {
        if (typeof imgData === "string") {
            return imgData;
        }
        return await this.#uploadImg(imgData);
    }

    async #formUpdateQuery(
        data: UpdateFormData,
        themeId: number,
        imgSrc: string
    ) {
        await Forms.update(
            {
                title: data.title,
                description: data.description,
                img: imgSrc,
                isPublic: data.isPublic,
                themeId,
            },
            { where: { id: data.formId } }
        );
    }

    async #updateForm(data: UpdateFormData) {
        const themeId = await this.#getThemeId(data.theme);
        const imgSrc = await this.#getImgSrc(data.img);
        await this.#formUpdateQuery(data, themeId, imgSrc);
    }

    async #findTags(tags: string[]) {
        return await Tags.findAll({ where: { tag: { [Op.in]: tags } } });
    }

    async #createTags(tags: string[]) {
        const formatTags = tags.map((t) => ({ tag: t }));
        await Tags.bulkCreate(formatTags, { ignoreDuplicates: true });
    }

    async #addTags(tagsId: Tags[], formId: number) {
        const covetedTags = tagsId.map((t) => ({ tagId: t.id, formId }));
        await FormTag.bulkCreate(covetedTags, { ignoreDuplicates: true });
    }

    async #deleteTags(tagsId: Tags[], formId: number) {
        const convertedTagsId = tagsId.map((t) => t.id);
        await FormTag.destroy({
            where: {
                formId,
                tagId: {
                    [Op.notIn]: convertedTagsId,
                },
            },
        });
    }

    async #updateTagsDb(tags: string[], formId: number) {
        const tagsId = await this.#findTags(tags);
        await this.#addTags(tagsId, formId);
        await this.#deleteTags(tagsId, formId);
    }

    async #updateTags(tags: string[], formId: number) {
        await this.#createTags(tags);
        await this.#updateTagsDb(tags, formId);
    }

    async #addUsers(users: number[], formId: number) {
        const covertUsers = users.map((u) => ({ userId: u, formId }));
        await FormUser.bulkCreate(covertUsers, { ignoreDuplicates: true });
    }

    async #deleteUsers(users: number[], formId: number) {
        await FormUser.destroy({
            where: {
                formId: formId,
                userId: {
                    [Op.notIn]: users,
                },
            },
        });
    }

    async #updateUsers(users: number[], formId: number) {
        await this.#addUsers(users, formId);
        await this.#deleteUsers(users, formId);
    }

    async #updateQuestions(data: UpdateFormData) {
        const questionsIds = data.questions.map((q) => q.id);
        const formatQuestions = data.questions.map((q) => ({
            ...q,
            formId: data.formId,
        }));
        this.#addQuestions(formatQuestions);
        this.#deleteQuestions(questionsIds, data.formId);
    }

    async #addQuestions(questions: QuestionForm[]) {
        await Questions.bulkCreate(questions, {
            updateOnDuplicate: [
                "type",
                "title",
                "description",
                "index",
                "inStatistic",
                "answers",
            ],
        });
    }

    async #deleteQuestions(questionsIds: string[], formId: number) {
        Questions.destroy({
            where: { formId, id: { [Op.notIn]: questionsIds } },
        });
    }
}
