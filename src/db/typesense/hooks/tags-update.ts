import { Tags } from "../../tables/Tags.js";
import { typesenseClient } from "../index.js";

export const tagsUpdate = () => {
    Tags.afterCreate(async (tag) => {
        await typesenseClient
            .collections("tags")
            .documents()
            .create({
                id: `${tag.id}`,
                tag: tag.tag,
            });
    });

    Tags.afterUpdate(async (tag) => {
        await typesenseClient
            .collections("tags")
            .documents(`${tag.id}`)
            .update({
                id: `${tag.id}`,
                tag: tag.tag,
            });
    });

    Tags.afterDestroy(async (tag) => {
        await typesenseClient
            .collections("tags")
            .documents(`${tag.id}`)
            .delete();
    });
};
