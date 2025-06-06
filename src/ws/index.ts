import { Server } from "http";
import { WebSocketServer } from "ws";
import { wsCommentsController } from "../controllers/ws-comments-controller.js";
import { commentsPingPong } from "../helpers/comments-ping-pong.js";

export const wsInit = (server: Server) => {
    try {
        const wss = new WebSocketServer({ server, path: "/api/comments" });
        wss.on("connection", wsCommentsController);
        commentsPingPong(wss);
    } catch (error) {
        console.error("WS Error:", error)
    }
};
