import { IncomingMessage } from "http";
import { CustomWebSocket } from "../types/custom-websoket.js";
import { Comments } from "../db/tables/Comments.js";
import { ClientComment } from "../types/client-comment.js";
import { Users } from "../db/tables/Users.js";
import { UnknownUserError } from "../errors/unknown-user-error.js";
import { BlockUserError } from "../errors/block-user-error.js";

const commentsConnections = new Map<string, Set<CustomWebSocket>>();

export class WsCommentsService {
    #formId: string;
    #ws: CustomWebSocket;

    constructor(ws: CustomWebSocket, request: IncomingMessage) {
        this.#formId = (request.url as string).split("=").slice(-1)[0];
        this.#ws = ws;
        ws.isAlive = true;
        ws.formId = +this.#formId;
        this.#updateConnections();
        this.#handlerConnect();
    }

    pong = () => {
        this.#ws.isAlive = true;
    };

    message = async (data: string) => {
        try {
            const convertData: ClientComment = JSON.parse(data);
            if (convertData.userId) {
                await this.#checkUser(convertData.userId);
                await Comments.bulkCreate([convertData]);
                this.#notifyUsers();
            }
        } catch (error) {
            console.error("Ws Message Error:", error);
        }
    };

    error = (error: Error) => {
        console.error("WebSocket error:", error);
    };

    close = () => {
        commentsConnections.get(this.#formId)!.delete(this.#ws);
        console.log("Connection Close");
    };

    async #checkUser(id: number) {
        const user = await this.#findUser(id);
        if (!user) throw new UnknownUserError();
        if (user.isBlocked) throw new BlockUserError();
    }

    async #findUser(id: number) {
        return await Users.findOne({ where: { id } });
    }

    async #notifyUsers() {
        const noDuplicateUsers = commentsConnections.get(this.#formId);
        if (noDuplicateUsers) {
            const users = Array.from(noDuplicateUsers);
            const comments = await this.#getComments();
            users.forEach((u) => u.send(comments));
        }
    }

    async #handlerConnect() {
        const comments = await this.#getComments();
        this.#ws.send(comments);
    }

    #updateConnections() {
        if (!commentsConnections.has(this.#formId)) {
            commentsConnections.set(this.#formId, new Set());
        }
        commentsConnections.get(this.#formId)!.add(this.#ws);
    }

    async #getComments() {
        const comments = await Comments.findAll({
            where: { formId: this.#formId },
            attributes: ["id", "text", "createdAt"],
            include: { model: Users, attributes: ["name"] },
            order: [["createdAt", "ASC"]],
        });
        return JSON.stringify(comments);
    }
}
