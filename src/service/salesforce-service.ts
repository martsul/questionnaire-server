import { Users } from "../db/tables/Users.js";
import { SfAuthError } from "../errors/sf-auth-error.js";
import { UnknownUserError } from "../errors/unknown-user-error.js";
import { SfPutInfo } from "../types/sf-put-info.js";
import { SfUser } from "../types/sf-user.js";

export class SalesforceService {
    #userId: number;

    constructor(userId: number) {
        this.#userId = userId;
    }

    async updateInfo(info: SfPutInfo) {
        const user = await this.#findUser();
        this.#checkAuth(user);
        const authData = await this.#getAuthData(user.salesforceRefreshToken);
        const response = await this.#updateInfo(
            authData.instance_url,
            authData.access_token,
            user.sfId,
            info
        );
        if (!response.ok) throw new Error("Update Contact Error");
    }

    async getUser() {
        const user = await this.#findUser();
        if (!user.salesforceRegistered) {
            return { isRegistered: user.salesforceRegistered, data: null };
        }
        const data = await this.#getUserData(user);
        return { isRegistered: user.salesforceRegistered, data };
    }

    async #updateInfo(
        instanceUrl: string,
        accessToken: string,
        contactId: string,
        updateData: SfPutInfo
    ) {
        return await fetch(
            `${instanceUrl}/services/data/v59.0/sobjects/Contact/${contactId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            }
        );
    }

    async #getUserData(user: Users) {
        const authData = await this.#getAuthData(user.salesforceRefreshToken);
        const userData = await this.#queryUserData(
            authData.access_token,
            authData.instance_url,
            user.sfId
        );
        return userData.records[0];
    }

    async #queryUserData(
        accessToken: string,
        instanceUrl: string,
        userId: string
    ) {
        const response = await fetch(
            `${instanceUrl}/services/data/v60.0/query?q=` +
                encodeURIComponent(
                    `SELECT FirstName, LastName, Email, Phone, Title FROM Contact WHERE Id = '${userId}'`
                ),
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return await response.json();
    }

    async #findUser() {
        const user = await Users.findOne({ where: { id: this.#userId } });
        if (!user) {
            throw new UnknownUserError();
        }
        return user;
    }

    async #checkAuth(user: Users) {
        if (!user.salesforceRegistered || !user.salesforceRefreshToken) {
            throw new SfAuthError();
        }
    }

    async #getAuthData(refreshToken: string) {
        const response = await this.#accessTokenQuery(refreshToken);
        const result: SfUser = await response.json();
        if (!response.ok) throw new SfAuthError();
        return result;
    }

    async #accessTokenQuery(refreshToken: string) {
        const body = this.#getRefreshBody(refreshToken);
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

    #getRefreshBody(refreshToken: string) {
        const params = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: process.env.SF_CLIENT_ID as string,
            client_secret: process.env.SF_CLIENT_SECRET as string,
        });
        return params.toString();
    }
}
