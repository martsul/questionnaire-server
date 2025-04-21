import { Tags } from "../db/tables/Tags.js";
import { Users } from "../db/tables/Users.js";
import { tagsUpdate } from "../db/typesense/hooks/tags-update.js";
import { usersUpdate } from "../db/typesense/hooks/users-update.js";
import { typesenseClient } from "../db/typesense/index.js";

const getTagsDocument = async () => {
    const tags = await Tags.findAll({ attributes: ["id", "tag"] });
    return tags.map((tag) => ({
        id: `${tag.id}`,
        tag: tag.tag,
    }));
};

const getUsersDocument = async () => {
    const users = await Users.findAll({ attributes: ["id", "name", "email"] });
    return users.map((user) => ({
        id: `${user.id}`,
        name: user.name,
        email: user.email,
    }));
};

const getDocuments = async () => {
    const tagsDocuments = await getTagsDocument();
    const usersDocuments = await getUsersDocument();
    return { tagsDocuments, usersDocuments };
};

const importTags = async (documents: { id: string; tag: string }[]) => {
    await typesenseClient
        .collections("tags")
        .documents()
        .import(documents, { action: "upsert" });
};

const importUsers = async (
    documents: {
        id: string;
        name: string;
        email: string;
    }[]
) => {
    await typesenseClient
        .collections("users")
        .documents()
        .import(documents, { action: "upsert" });
};

const autoUpdate = () => {
    usersUpdate();
    tagsUpdate();
};

export const syncTypesense = async () => {
    try {
        const { tagsDocuments, usersDocuments } = await getDocuments();
        await importTags(tagsDocuments);
        await importUsers(usersDocuments);
        autoUpdate()
        console.log("Data synced to Typesense");
    } catch (error) {
        console.error("Typesesnse Sync Error", error);
    }
};
