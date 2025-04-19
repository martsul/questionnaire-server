import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections.js";

export const usersCollection: CollectionCreateSchema = {
    name: "users",
    fields: [
        { name: "id", type: "int32" },
        { name: "name", type: "string" },
        { name: "email", type: "string" },
    ],
};
