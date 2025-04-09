import { Form } from "../db/Form";

export class FormService {
    async create(ownerId: number) {
        return await Form.create({ ownerId });
    }

    async get(formId: number) {}
}
