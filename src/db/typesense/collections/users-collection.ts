import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections.js";

export const usersCollection: CollectionCreateSchema = {
    name: "users",
    fields: [
        { name: "id", type: "string" },
        { name: "name", type: "string" },
        { name: "email", type: "string" },
    ],
};
