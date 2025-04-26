import { formsCollection } from "./collections/forms-collections.js";
import { tagsCollection } from "./collections/tags-collection.js";
import { usersCollection } from "./collections/users-collection.js";
import { typesenseClient } from "./index.js";

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
        await typesenseClient
            .collections("forms")
            .delete()
            .catch(() => {});
        await typesenseClient.collections().create(tagsCollection);
        await typesenseClient.collections().create(usersCollection);
        await typesenseClient.collections().create(formsCollection);
    } catch (error) {
        await initCollections();
        console.error("Error Init Collection", error);
    }
};
