import { testBDConnection } from "../helpers/test-bd-connection.js";
import { initAssociations } from "./associations.js";
import { initCollections } from "../helpers/init-collections.js";
import { syncTypesense } from "../helpers/sync-typesense.js";

export const dbInit = async () => {
    await testBDConnection();
    initAssociations();
    await initCollections();
    await syncTypesense();
};
