import { testBDConnection } from "../helpers/test-bd-connection.js";
import { initAssociations } from "./associations.js";
import { initCollections } from "../helpers/init-collections.js";
import { syncTypesense } from "../helpers/sync-typesense.js";
// import { seedDatabase } from "../helpers/seed-database.js";

export const dbInit = async () => {
    await testBDConnection();
    // await seedDatabase();
    initAssociations();
    await initCollections();
    await syncTypesense();
};
