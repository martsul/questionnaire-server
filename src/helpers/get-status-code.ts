import { statusCodes } from "../constants/status-codes.js";

export const getStatusCode = (message: unknown) => {
    return statusCodes.get(message) || 500
};
