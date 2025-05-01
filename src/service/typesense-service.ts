import { WhereOptions } from "sequelize";
import { Comments } from "../db/tables/Comments.js";
import { Forms } from "../db/tables/Forms.js";
import { Questions } from "../db/tables/Questions.js";
import { Tags } from "../db/tables/Tags.js";
import { Themes } from "../db/tables/Themes.js";
import { Users } from "../db/tables/Users.js";
import { typesenseClient } from "../db/typesense/index.js";
import { FormDocument } from "../types/form-document.js";
import { error } from "console";

export class TypesenseService {
    #convertForms(forms: Forms[]) {
        return forms.map((f) => {
            return {
                id: `${f.id}`,
                title: f.title,
                description: f.description,
                theme: f.Theme.theme,
                tags: f.Tags?.map((t) => t.tag) || [],
                questionTitles: f.Questions?.map((q) => q.title) || [],
                questionDescriptions:
                    f.Questions?.map((q) => q.description) || [],
                questionAnswers:
                    f.Questions?.flatMap((q) => {
                        try {
                            return JSON.parse(q.answers) || [];
                        } catch {
                            return [];
                        }
                    }) || [],
                comments: f.Comments?.map((c) => c.text),
            };
        });
    }

    async #getTagsDocument() {
        const tags = await Tags.findAll({ attributes: ["id", "tag"] });
        return tags.map((tag) => ({
            id: `${tag.id}`,
            tag: tag.tag,
        }));
    }

    async #getUsersDocument() {
        const users = await Users.findAll({
            attributes: ["id", "name", "email"],
        });
        return users.map((user) => ({
            id: `${user.id}`,
            name: user.name,
            email: user.email,
        }));
    }

    async #getFormsDocument() {
        return await Forms.findAll({
            attributes: ["id", "title", "description"],
            include: [
                { model: Themes, attributes: ["theme"] },
                { model: Tags, attributes: ["tag"], as: "Tags" },
                { model: Comments, attributes: ["text"] },
                {
                    model: Questions,
                    attributes: ["title", "description", "answers"],
                },
            ],
        });
    }

    async #getFormDocument(id: number) {
        return await Forms.findOne({
            where: { id },
            attributes: ["id", "title", "description"],
            include: [
                { model: Themes, attributes: ["theme"] },
                { model: Tags, attributes: ["tag"], as: "Tags" },
                { model: Comments, attributes: ["text"] },
                {
                    model: Questions,
                    attributes: ["title", "description", "answers"],
                },
            ],
        });
    }

    async #getDocuments() {
        const tagsDocuments = await this.#getTagsDocument();
        const usersDocuments = await this.#getUsersDocument();
        const formsDocuments = await this.#getFormsDocument();
        return {
            tagsDocuments,
            usersDocuments,
            formsDocuments: this.#convertForms(formsDocuments),
        };
    }

    async #importForms(documents: FormDocument[]) {
        await typesenseClient
            .collections("forms")
            .documents()
            .import(documents, { action: "upsert" });
    }

    async #importTags(documents: { id: string; tag: string }[]) {
        await typesenseClient
            .collections("tags")
            .documents()
            .import(documents, { action: "upsert" });
    }

    async #importUsers(
        documents: {
            id: string;
            name: string;
            email: string;
        }[]
    ) {
        await typesenseClient
            .collections("users")
            .documents()
            .import(documents, { action: "upsert" });
    }

    #usersAutoUpdate() {
        this.#usersCreate();
        this.#usersDestroy();
    }

    #usersDestroy() {
        Users.afterDestroy((user) => {
            typesenseClient
                .collections("users")
                .documents(`${user.id}`)
                .delete()
                .catch((e) => console.error("Users Destroy Error:", e));
        });
    }

    #usersCreate() {
        Users.afterCreate((user) => {
            typesenseClient
                .collections("users")
                .documents()
                .create({
                    id: `${user.id}`,
                    name: user.name,
                    email: user.email,
                })
                .catch((e) => console.error("Create Users Error:", e));
        });
    }

    #tagsAutoUpdate() {
        Tags.afterBulkCreate((tags) => {
            const convertedTags = this.#convertTags(tags);
            if (convertedTags.length) {
                typesenseClient
                    .collections("tags")
                    .documents()
                    .import(convertedTags)
                    .catch((e) => {
                        console.error("Tag Create Error:", e);
                    });
            }
        });
    }

    #convertTags(tags: readonly Tags[]) {
        return tags
            .filter((tag) => tag.id !== null)
            .map((tag) => ({
                id: `${tag.id}`,
                tag: tag.tag,
            }));
    }

    #formsCreate() {
        Forms.afterCreate(async (form) => {
            const formDocument = await this.#getFormDocument(form.id);
            if (formDocument) {
                const convertedForm = this.#convertForms([formDocument])[0];
                typesenseClient
                    .collections("forms")
                    .documents()
                    .create(convertedForm)
                    .catch((e) => {
                        console.error("Form Create Error:", e);
                    });
            }
        });
    }

    #formsUpdate() {
        Forms.afterBulkUpdate(async (form) => {
            const { id } = form.where as { id: number };
            const formDocument = await this.#getFormDocument(id);
            if (formDocument) {
                const convertedForm = this.#convertForms([formDocument])[0];
                typesenseClient
                    .collections("forms")
                    .documents()
                    .upsert(convertedForm)
                    .catch((e) => {
                        console.error("Form Update Error:", e);
                    });
            }
        });
    }

    #formsDestroy() {
        Forms.afterDestroy((form) => {
            typesenseClient
                .collections("forms")
                .documents(`${form.id}`)
                .delete()
                .catch((e) => {
                    console.error("Form Destroy Error:", e);
                });
        });
    }

    #formsAutoUpdate() {
        this.#formsCreate();
        this.#formsUpdate();
        this.#formsDestroy();
    }

    autoUpdate() {
        this.#usersAutoUpdate();
        this.#tagsAutoUpdate();
        this.#formsAutoUpdate();
    }

    async sync() {
        const { formsDocuments, tagsDocuments, usersDocuments } =
            await this.#getDocuments();
        await this.#importTags(tagsDocuments);
        await this.#importUsers(usersDocuments);
        await this.#importForms(formsDocuments);
    }
}
