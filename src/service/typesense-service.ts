import { Comments } from "../db/tables/Comments.js";
import { Forms } from "../db/tables/Forms.js";
import { Questions } from "../db/tables/Questions.js";
import { Tags } from "../db/tables/Tags.js";
import { Themes } from "../db/tables/Themes.js";
import { Users } from "../db/tables/Users.js";
import { tagsUpdate } from "../db/typesense/hooks/tags-update.js";
import { usersUpdate } from "../db/typesense/hooks/users-update.js";
import { typesenseClient } from "../db/typesense/index.js";
import { FormDocument } from "../types/form-document.js";

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

    autoUpdate() {
        usersUpdate();
        tagsUpdate();
    }

    async sync() {
        const { formsDocuments, tagsDocuments, usersDocuments } =
            await this.#getDocuments();
        await this.#importTags(tagsDocuments);
        await this.#importUsers(usersDocuments);
        await this.#importForms(formsDocuments);
    }
}
