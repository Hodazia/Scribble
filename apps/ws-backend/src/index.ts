import { WebSocketServer } from "ws";

// create a new web socket server with a port of 8080
const wss = new  WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("web socket connection is made ");

    ws.on("message", (msg) => {
        console.log("Message received is ", msg);
        ws.send("greetings i have received ur message ");
    })
})
