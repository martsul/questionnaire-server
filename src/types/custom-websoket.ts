import WebSocket from "ws";

export type CustomWebSocket = WebSocket & {
    isAlive: boolean;
    formId: number;
}