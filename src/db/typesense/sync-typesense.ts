import { TypesenseService } from "../../service/typesense-service.js";

export const syncTypesense = async () => {
    const typesenseService = new TypesenseService();
    try {
        await typesenseService.sync();
        typesenseService.autoUpdate();
        console.log("Data synced to Typesense");
    } catch (error) {
        console.error("Typesesnse Sync Error", error);
    }
};
