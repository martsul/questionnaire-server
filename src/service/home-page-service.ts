import { Sequelize } from "sequelize";
import { Answers } from "../db/tables/Answers.js";
import { Forms } from "../db/tables/Forms.js";
import { Users } from "../db/tables/Users.js";
import { LastForm } from "../types/last-form.js";
import { PopularForm } from "../types/popular-form.js";
import { PopularTag } from "../types/popular-tag.js";
import { Tags } from "../db/tables/Tags.js";
import { FormTag } from "../db/tables/Form-Tag.js";

export class HomePageService {
    declare lastForms: LastForm[];
    declare popularForms: PopularForm[];
    declare popularTags: PopularTag[];

    async get() {
        await this.#query();
        return {
            lastForms: this.lastForms,
            popularForms: this.popularForms,
            popularTags: this.popularTags,
        };
    }

    async #query() {
        this.lastForms = await this.#getLastForms();
        this.popularForms = await this.#getPopularForm();
        this.popularTags = await this.#getPopularTags();
    }

    async #getLastForms() {
        return await Forms.findAll({
            attributes: [
                "id",
                "img",
                "title",
                "description",
                [Sequelize.col("owner.name"), "creator"],
            ],
            order: [["createdAt", "ASC"]],
            limit: 10,
            include: [
                {
                    model: Users,
                    attributes: [],
                    as: "owner",
                },
            ],
        });
    }

    async #getPopularForm() {
        return await Forms.findAll({
            attributes: [
                "id",
                "title",
                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.fn(
                            "DISTINCT",
                            Sequelize.col("Answers.result_id")
                        )
                    ),
                    "numberResponse",
                ],
                [Sequelize.col("owner.name"), "creator"],
            ],
            include: [
                {
                    model: Users,
                    attributes: [],
                    as: "owner",
                },
                {
                    model: Answers,
                    attributes: [],
                },
            ],
            group: ["Forms.id", "owner.id"],
            order: [["numberResponse", "DESC"]],
            limit: 5,
            subQuery: false,
        });
    }

    async #getPopularTags() {
        return await Tags.findAll({
            attributes: ["tag", "id"],
            include: [
                {
                    model: FormTag,
                    attributes: [],
                },
            ],
            group: ["Tags.id", "Tags.tag"],
            order: [
                [
                    Sequelize.fn("COUNT", Sequelize.col("FormTags.tag_id")),
                    "DESC",
                ],
            ],
            limit: 25,
            subQuery: false,
        });
    }
}
