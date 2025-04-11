import { Form } from "../db/Form";
import { Theme } from "../db/Theme";
import { User } from "../db/User";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { ClientImg } from "../types/client-img";
import { UpdateFormData } from "../types/update-form-data";
import { StaticThemes } from "../types/static-themes";

type Data = { id: number };

export class FormService {
    async create(data: Data) {
        return await Form.create({ ownerId: data.id });
    }

    async get(data: Data) {
        return await Form.findByPk(data.id, {
            attributes: { exclude: ["themeId"] },
            include: [
                { model: Theme, attributes: ["theme"] },
                { model: User, attributes: ["name"] },
            ],
        });
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

    async update(data: UpdateFormData) {
        const themeId = await this.#getThemeId(data.theme, data.ownTheme);
        const imgSrc = await this.#getImgSrc(data.img, data.formId);
        await this.#updateForm(data, themeId, imgSrc);
    }
}
