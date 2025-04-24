import { TypesenseService } from "../service/typesense-service.js";

export const syncTypesense = async () => {
    try {
        const typesenseService = new TypesenseService()
        await typesenseService.sync();
        typesenseService.autoUpdate()
        console.log("Data synced to Typesense");
    } catch (error) {
        console.error("Typesesnse Sync Error", error);
        await syncTypesense()
    }
};
