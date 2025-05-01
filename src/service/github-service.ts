import { Users } from "../db/tables/Users.js";
import { GithubToken } from "../types/github-token.js";
import { GithubUser } from "../types/github-user.js";
import { GithubEmail } from "./github-email.js";
import { NetworkUserData } from "./network-user-data.js";
import { hash } from "bcrypt-ts";

export class GithubService {
    async getUser(token: string) {
        const userData = await this.#getUserData(token);
        return await this.#findOrCreateUser(userData);
    }

    async getToken(code: string) {
        return await this.#getToken(code);
    }

    async #findOrCreateUser(userData: NetworkUserData) {
        const password = await hash(`${userData.id}`, 3);
        const [user] = await Users.findOrCreate({
            where: { email: userData.email },
            defaults: {
                name: userData.login,
                password,
                email: userData.email,
            },
        });
        return user;
    }

    async #getUserData(token: string) {
        const user = await this.#getUser(token);
        const email = await this.#getUserEmail(token);
        return { ...user, email };
    }

    async #getUser(token: string) {
        const userResponse = await this.#userQuery(token);
        return (await userResponse.json()) as GithubUser;
    }

    async #userQuery(token: string) {
        return await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
    }

    async #getUserEmail(token: string) {
        const emailResponse = await this.#userEmailQuery(token);
        const email: GithubEmail[] = await emailResponse.json();
        return email[0].email;
    }

    async #userEmailQuery(token: string) {
        return await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
    }

    async #getToken(code: string) {
        const response = await this.#queryToken(code);
        const tokenData: GithubToken = await response.json();
        return tokenData.access_token;
    }

    async #queryToken(code: string) {
        return await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            }),
        });
    }
}
