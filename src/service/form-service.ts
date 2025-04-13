import { Form } from "../db/Form";
import { Theme } from "../db/Theme";
import { User } from "../db/User";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { ClientImg } from "../types/client-img";
import { UpdateFormData } from "../types/update-form-data";
import { StaticThemes } from "../types/static-themes";
import { UpdateTags } from "../types/update-tags";
import { Tag } from "../db/Tag";
import { Op } from "sequelize";
import { FormTag } from "../db/Form-Tag";
import { UpdateUsers } from "../types/update-users";
import { FormUser } from "../db/Form-User";

type Data = { id: number };

export class FormService {
    async create(data: Data) {
        return await Form.create({ ownerId: data.id });
    }

    async get(data: Data) {
        return this.#convertGet(
            await Form.findByPk(data.id, {
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
            })
        );
    }

    #convertGet(result: Form | null) {
        if (!result) return result;
        const {
            id,
            ownerId,
            title,
            description,
            img,
            isPublic,
            likes,
            createdAt,
            Theme,
            owner,
        } = result;

        return {
            head: {
                id,
                ownerId,
                title,
                description,
                img,
                isPublic,
                likes,
                createdAt,
                Theme,
                owner,
            },
            tags: result.tags.map(t => t.tag),
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

    async #findOrCreateTheme(ownTheme: string = "") {
        return await Theme.findOrCreate({
            where: { theme: ownTheme.toLowerCase() },
            attributes: ["id"],
        });
    }

    async #getThemeId(theme: StaticThemes, ownTheme?: string) {
        const currentTheme = theme === "other" ? ownTheme : theme;
        const [result] = await this.#findOrCreateTheme(currentTheme);
        return result.id;
    }

    async #updateForm(data: UpdateFormData, themeId: number, imgSrc: string) {
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

    async #findTags(tags: string[]) {
        return await Tag.findAll({ where: { tag: { [Op.in]: tags } } });
    }

    async #createTags(tags: string[]) {
        const formatTags = tags.map((t) => ({ tag: t }));
        await Tag.bulkCreate(formatTags, { ignoreDuplicates: true });
    }

    async #addTags(tags: string[], formId: number) {
        const tagsId = await this.#findTags(tags);
        const covetedTags = tagsId.map((t) => ({ tagId: t.id, formId }));
        await FormTag.bulkCreate(covetedTags, { ignoreDuplicates: true });
    }

    async #deleteTags(tags: string[], formId: number) {
        const findTags = await this.#findTags(tags);
        const tagsIds = findTags.map((t) => t.id);
        await FormTag.destroy({
            where: {
                formId,
                tagId: {
                    [Op.in]: tagsIds,
                },
            },
        });
    }

    async #updateTags(tags: UpdateTags, formId: number) {
        const { addTags, deleteTags } = tags;
        await this.#createTags(addTags);
        await this.#addTags(addTags, formId);
        await this.#deleteTags(deleteTags, formId);
    }

    async #addUsers(users: string[], formId: number) {
        const covertUsers = users.map((u) => ({ userId: +u, formId }));
        await FormUser.bulkCreate(covertUsers, { ignoreDuplicates: true });
    }

    async #deleteUsers(users: string[], formId: number) {
        const covertUsers = users.map(Number);
        await FormUser.destroy({
            where: {
                formId: formId,
                userId: {
                    [Op.in]: covertUsers,
                },
            },
        });
    }

    async #updateUsers(users: UpdateUsers, formId: number) {
        const { addUsers, deleteUsers } = users;
        await this.#addUsers(Object.keys(addUsers), formId);
        await this.#deleteUsers(Object.keys(deleteUsers), formId);
    }

    async update(data: UpdateFormData) {
        const themeId = await this.#getThemeId(data.theme, data.ownTheme);
        const imgSrc = await this.#getImgSrc(data.img, data.formId);
        await this.#updateTags(data.tags, data.formId);
        await this.#updateUsers(data.users, data.formId);
        await this.#updateForm(data, themeId, imgSrc);
    }
}
