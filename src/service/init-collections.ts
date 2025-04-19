import { tagsCollection } from "../db/typesense/collections/tags-collection.js";
import { usersCollection } from "../db/typesense/collections/users-collection.js";
import { typesenseClient } from "../db/typesense/index.js";

export const initCollections = async () => {
    try {
        await typesenseClient
            .collections("tags")
            .delete()
            .catch(() => {});
        await typesenseClient
            .collections("users")
            .delete()
            .catch(() => {});
        await typesenseClient.collections().create(tagsCollection);
        await typesenseClient.collections().create(usersCollection);
    } catch (error) {
        console.error("Error Init Collection", error);
    }
};
