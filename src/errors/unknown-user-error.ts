export class UnknownUserError extends Error {
    constructor() {
        super("User Not Founded");
    }
}
