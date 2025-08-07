import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import {JWT_SECRET} from "@repo/backend-common/config"
// we will have a global JWT_SECRET, in the packages folder
// create a new web socket server with a port of 8080
const wss = new  WebSocketServer({ port: 8080 });

wss.on("connection", (ws,request) => {
    console.log("web socket connection is made ");
    // extract the url of the website it will contain http://localhost:3000/?token=2342r

    const url = request.url;
    if(!url)
    {
        return
    }


    const queryParams = new URLSearchParams(url.split('?')[1]);

    const token = queryParams.get("token");
    if (!token) throw new Error("Token not provided");

    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    const userId = decoded.id;

    if (!userId) 
        {
            //throw new Error("Invalid token")
            ws.close();
        ;}

    ws.on("message", (msg) => {
        console.log("Message received is ", msg);
        ws.send("greetings i have received ur message ");
    })
})
