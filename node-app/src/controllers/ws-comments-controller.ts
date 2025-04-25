import { IncomingMessage } from "http";
import { CustomWebSocket } from "../types/custom-websoket.js";
import { WsCommentsService } from "../service/ws-comments-service.js";

export const wsCommentsController = (
    ws: CustomWebSocket,
    request: IncomingMessage
) => {
    try {
        console.log("connect");
        const wsCommentsService = new WsCommentsService(ws, request);
        ws.on("pong", wsCommentsService.pong);
        ws.on("message", wsCommentsService.message);
        ws.on("error", wsCommentsService.error);
        ws.on("close", wsCommentsService.close);
    } catch (error) {
        console.error("WS Error", error);
    }
};
