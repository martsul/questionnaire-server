export const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message;
    } else {
        return "Unknown Error";
    }
};
