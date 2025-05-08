import { testBDConnection } from "../helpers/test-bd-connection.js";
import { initAssociations } from "./associations.js";
import { initCollections } from "./typesense/init-collections.js";
import { syncTypesense } from "./typesense/sync-typesense.js";
// import { seedDatabase } from "../helpers/seed-database.js";

export const dbInit = async () => {
    await testBDConnection();
    // await seedDatabase();
    initAssociations();
    await initCollections();
    await syncTypesense();
}; 
