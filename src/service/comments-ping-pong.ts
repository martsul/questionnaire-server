import { config } from "dotenv";
import { IncomingMessage } from "http";
import WebSocket, { Server } from "ws";

config();

const wsUpdate = (ws: WebSocket) => {
    if (!(ws as any).isAlive) {
        return ws.terminate();
    }
    (ws as any).isAlive = false;
    ws.ping();
};

export const commentsPingPong = (
    wss: Server<typeof WebSocket, typeof IncomingMessage>
) => {
    const interval = setInterval(() => {
        wss.clients.forEach(wsUpdate);
    }, Number(process.env.PING_INTERVAL));
    wss.on("close", () => {
        clearInterval(interval);
    });
};
