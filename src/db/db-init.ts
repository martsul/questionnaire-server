import { testBDConnection } from "../helpers/test-bd-connection.js";
import { initAssociations } from "./associations.js";

export const dbInit = async () => {
    await testBDConnection();
    initAssociations();
}