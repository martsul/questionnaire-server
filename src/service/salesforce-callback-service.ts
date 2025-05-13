import { config } from "dotenv";
import { SfUser } from "../types/sf-user.js";
import { Users } from "../db/tables/Users.js";
import { UnknownUserError } from "../errors/unknown-user-error.js";
import { SfAccount } from "../types/sf-account.js";

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
        const contact = await this.#registerAccountAndContact(result, user);
        await this.#updateDbUser(result.refresh_token, contact?.id);
    }

    async #registerAccountAndContact(sfUser: SfUser, userData: Users) {
        const account = await this.#createAccount(
            sfUser.access_token,
            sfUser.instance_url,
            userData
        );
        return await this.#createContact(
            sfUser.access_token,
            sfUser.instance_url,
            userData,
            account.id
        );
    }

    async #createAccount(
        accessToken: string,
        instanceUrl: string,
        user: Users
    ) {
        const response = await this.#queryCreateAccount(
            accessToken,
            instanceUrl,
            user
        );
        if (!response.ok) {
            throw new Error("Create Account Error");
        }
        return (await response.json()) as SfAccount;
    }

    async #queryCreateAccount(
        accessToken: string,
        instanceUrl: string,
        user: Users
    ) {
        return await fetch(
            `${instanceUrl}/services/data/v60.0/sobjects/Account`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Name: `${user.name}'s Account`,
                }),
            }
        );
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
        user: Users,
        accountId: string
    ) {
        if (user.salesforceRegistered) return;
        const response = await this.#queryCreateContact(
            accessToken,
            instanceUrl,
            user,
            accountId
        );
        if (!response.ok) {
            throw new Error("Create Contact Error");
        }
        return await response.json();
    }

    async #queryCreateContact(
        accessToken: string,
        instanceUrl: string,
        user: Users,
        accountId: string
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
                    AccountId: accountId,
                }),
            }
        );
    }

    async #updateDbUser(refreshToken: string, sfId?: string) {
        const updateData = this.#getUpdateData(refreshToken, sfId);
        await Users.update(updateData, { where: { id: this.#userId } });
    }

    #getUpdateData(refreshToken: string, sfId?: string) {
        return sfId
            ? {
                  salesforceRegistered: true,
                  salesforceRefreshToken: refreshToken,
                  sfId,
              }
            : {
                  salesforceRefreshToken: refreshToken,
              };
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
