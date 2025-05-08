import { config } from "dotenv";
import { SfUser } from "../types/sf-user.js";
import { Users } from "../db/tables/Users.js";
import { UnknownUserError } from "../errors/unknown-user-error.js";

config();

export class SalesforceCallbackService {
    #code: string;
    #userId: number;

    constructor(code: string, userId: number) {
        this.#code = code;
        this.#userId = userId;
    }

    async register() {
        const user = await this.#findUser();
        const response = await this.#queryUser();
        const result: SfUser = await response.json();
        const contact = await this.#createContact(
            result.access_token,
            result.instance_url,
            user
        );
        await this.#updateDbUser(result.refresh_token, contact.id);
    }

    async #findUser() {
        const user = await Users.findOne({ where: { id: this.#userId } });
        if (!user) {
            throw new UnknownUserError();
        }
        return user;
    }

    async #createContact(
        accessToken: string,
        instanceUrl: string,
        user: Users
    ) {
        const response = await this.#queryCreateContact(
            accessToken,
            instanceUrl,
            user
        );
        if (!response.ok) {
            throw new Error("Create Contact Error");
        }
        return await response.json();
    }

    async #queryCreateContact(
        accessToken: string,
        instanceUrl: string,
        user: Users
    ) {
        return await fetch(
            `${instanceUrl}/services/data/v60.0/sobjects/Contact`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    LastName: user.name,
                    Email: user.email,
                }),
            }
        );
    }

    async #updateDbUser(refreshToken: string, sfId: string) {
        await Users.update(
            {
                salesforceRegistered: true,
                salesforceRefreshToken: refreshToken,
                sfId,
            },
            { where: { id: this.#userId } }
        );
    }

    async #queryUser() {
        const body = this.#getRequestBody();
        return await fetch(
            "https://login.salesforce.com/services/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
            }
        );
    }

    #getRequestBody() {
        const params = new URLSearchParams({
            grant_type: "authorization_code",
            code: this.#code,
            client_id: process.env.SF_CLIENT_ID as string,
            client_secret: process.env.SF_CLIENT_SECRET as string,
            redirect_uri: process.env.SF_REDIRECT_URI as string,
        });
        return params.toString();
    }
}
