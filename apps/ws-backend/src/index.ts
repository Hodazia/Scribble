import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import  { prismaclient } from "@repo/db/client"

import {JWT_SECRET} from "@repo/backend-common/config"
// we will have a global JWT_SECRET, in the packages folder
// create a new web socket server with a port of 8080

// create a function, checkUser, 
function checkUser(token:string): string | null
{
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
    
        if (typeof decoded == "string") {
          return null;
        }
    
        if (!decoded || !decoded.userId) {
          return null;
        }
    
        return decoded.userId;
      } catch(e) {
        return null;
      }
      return null;
}

const wss = new  WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
  }
  
  const users: User[] = [];
wss.on("connection", (ws,request) => {
    console.log("web socket connection is made ");
    // extract the url of the website it will contain http://localhost:8080/?token=2342r

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
            return 
        ;}

        users.push({
            userId,
            rooms: [],
            ws
          })
    ws.on("message",async (data) => {
        console.log("Message received is ", data);
        ws.send("greetings i have received ur message ");

        // the data from the client will be sent as string,we have to parse it
        let parsedData;
        if (typeof data !== "string") {
          parsedData = JSON.parse(data.toString());
        } else {
          parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
        }
    
        if (parsedData.type === "join_room") {
          const user = users.find(x => x.ws === ws);
          user?.rooms.push(parsedData.roomId);
        }

        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
              return;
            }
            user.rooms = user?.rooms.filter(x => x === parsedData.room);
          }

          // whenever a chat message comes, put it into the DB
          /*
          
          */
          if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;


            
            users.forEach(user => {
                if(user.rooms.includes(roomId))
                {
                    user.ws.send(JSON.stringify({
                        "type":"chat",
                        "message":message,
                        roomId
                    })
                    )
                }
            })

            await prismaclient.chat.create({
                data:{
                    roomId,
                    message,
                    userId
                }
            })
          }

    })
})
