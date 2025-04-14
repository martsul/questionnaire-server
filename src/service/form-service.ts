import { Form } from "../db/Form.js";
import { Theme } from "../db/Theme.js";
import { User } from "../db/User.js";
import { v2 as cloudinary } from "cloudinary";
import { ClientImg } from "../types/client-img.js";
import { UpdateFormData } from "../types/update-form-data.js";
import { Tag } from "../db/Tag.js";
import { Op } from "sequelize";
import { FormTag } from "../db/Form-Tag.js";
import { FormUser } from "../db/Form-User.js";
import { UsersCollection } from "../types/users-collection.js";

type Data = { id: number };

export class FormService {
    async create(data: Data) {
        return await Form.create({ ownerId: data.id });
    }

    async get(data: Data) {
        const form = await this.#findForm(data.id);
        const themes = await this.#getThemes();
        return this.#convertGet(form, themes);
    }

    async #getThemes() {
        return (await Theme.findAll({ attributes: ["theme"] })).map(
            (t) => t.theme
        );
    }

    async #findForm(id: number) {
        return await Form.findByPk(id, {
            attributes: { exclude: ["themeId"] },
            include: [
                { model: Theme, attributes: ["theme"] },
                { model: User, as: "owner", attributes: ["name"] },
                {
                    model: Tag,
                    as: "tags",
                    attributes: ["tag"],
                    through: { attributes: [] },
                },
                {
                    model: User,
                    as: "users",
                    attributes: ["name", "id", "email"],
                    through: { attributes: [] },
                },
            ],
        });
    }

    #convertGet(result: Form | null, themes: string[]) {
        if (!result) return result;
        return {
            head: {
                id: result.id,
                ownerId: result.ownerId,
                title: result.title,
                description: result.description,
                img: result.img,
                isPublic: result.isPublic,
                likes: result.likes,
                createdAt: result.createdAt,
                theme: result.Theme.theme,
                owner: result.owner,
                themes,
            },
            tags: result.tags.map((t) => t.tag),
            users: result.users,
        };
    }

    async #findOldImg(formId: number) {
        return await Form.findOne({
            where: { id: formId },
            attributes: ["img"],
        });
    }

    async #deleteOldImg(imgSrc: string | undefined) {
        if (imgSrc) {
            const imgId = imgSrc.split("/").slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(imgId, {
                resource_type: "image",
                invalidate: true,
            });
        }
    }

    async #uploadImg(imgData: ClientImg) {
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

    async #getImgSrc(imgData: ClientImg, formId: number) {
        const imgSrc = await this.#findOldImg(formId);
        await this.#deleteOldImg(imgSrc?.img);
        const newSrc = await this.#uploadImg(imgData);
        return newSrc;
    }

    async #getThemeId(theme: string) {
        const result = await Theme.findOne({
            where: { theme: theme },
            attributes: ["id"],
        });
        if (result) {
            return result.id;
        }
        throw new Error("Incorrect Theme");
    }

    async #formUpdateQuery(
        data: UpdateFormData,
        themeId: number,
        imgSrc: string
    ) {
        await Form.update(
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
        const imgSrc = await this.#getImgSrc(data.img, data.formId);
        await this.#formUpdateQuery(data, themeId, imgSrc);
    }

    async #findTags(tags: string[]) {
        return await Tag.findAll({ where: { tag: { [Op.in]: tags } } });
    }

    async #createTags(tags: string[]) {
        const formatTags = tags.map((t) => ({ tag: t }));
        await Tag.bulkCreate(formatTags, { ignoreDuplicates: true });
    }

    async #addTags(tagsId: Tag[], formId: number) {
        const covetedTags = tagsId.map((t) => ({ tagId: t.id, formId }));
        await FormTag.bulkCreate(covetedTags, { ignoreDuplicates: true });
    }

    async #deleteTags(tagsId: Tag[], formId: number) {
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

    async #addUsers(users: User["id"][], formId: number) {
        const covertUsers = users.map((u) => ({ userId: u, formId }));
        await FormUser.bulkCreate(covertUsers, { ignoreDuplicates: true });
    }

    async #deleteUsers(users: User["id"][], formId: number) {
        await FormUser.destroy({
            where: {
                formId: formId,
                userId: {
                    [Op.notIn]: users,
                },
            },
        });
    }

    async #updateUsers(users: UsersCollection, formId: number) {
        await this.#addUsers(Object.keys(users).map(Number), formId);
        await this.#deleteUsers(Object.keys(users).map(Number), formId);
    }

    async update(data: UpdateFormData) {
        console.log(data)
        await this.#updateTags(data.tags, data.formId);
        await this.#updateUsers(data.users, data.formId);
        await this.#updateForm(data);
    }
}
