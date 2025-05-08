import { ValidationError } from "sequelize";

export const getErrorMessage = (error: unknown) => {
    if (error instanceof ValidationError) {
        return error.errors[0].message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return error ? error : "Unknown Error";
};
