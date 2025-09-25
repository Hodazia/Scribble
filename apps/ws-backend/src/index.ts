// import { WebSocketServer, WebSocket } from "ws";
// import jwt from "jsonwebtoken";
// import { JwtPayload } from "jsonwebtoken";
// // import  { prismaclient } from "@repo/db/client"
// import { prismaclient } from "@repo/db/client";
// import {JWT_SECRET} from "@repo/backend-common/config"
// // we will have a global JWT_SECRET, in the packages folder
// // create a new web socket server with a port of 8080




// /*
// {
//     "type":"join_room",
//     "roomId":"chat-room",
//     "message":"hi there"
// }

// we  verify the user by checking and extracting the token present in the url,
// First extract the token and then use checkUser function to verify if the user is signed in or not!


// */
// // create a function, checkUser, 
// function checkUser(token:string): string | null
// {
//     try {
//         const decoded = jwt.verify(token, JWT_SECRET);
    
//         if (typeof decoded == "string") {
//           return null;
//         }
    
//         if (!decoded || !decoded.userId) {
//           return null;
//         }
    
//         return decoded.userId;
//       } catch(e) {
//         return null;
//       }
//       return null;
// }

// const wss = new  WebSocketServer({ port: 8080 });

// interface User {
//     ws: WebSocket,
//     rooms: string[],
//     userId: string
//   }
  
// // each user can belong to many rooms!!, 
//   const users: User[] = [];
// wss.on("connection", (ws,request) => {
//     console.log("web socket connection is made ");
//     // extract the url of the website it will contain http://localhost:8080/?token=2342r

//     const url = request.url;
//     if(!url)
//     {
//         return
//     }


//     const queryParams = new URLSearchParams(url.split('?')[1]);

//     const token = queryParams.get("token");
//     if (!token) throw new Error("Token not provided");

//     const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
//     const userId = decoded.id;

//     if (!userId) 
//         {
//             //throw new Error("Invalid token")
//             ws.close();
//             return 
//         ;}

//         users.push({
//             userId,
//             rooms: [],
//             ws
//           })
//     ws.on("message",async (data) => {
//         console.log("Message received is ", data);
//         // ws.send("greetings i have received ur message ");

//         // the data from the client will be sent as string,we have to parse it
//         let parsedData;
//         if (typeof data !== "string") {
//           parsedData = JSON.parse(data.toString());
//         } else {
//           parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
//         }
    
//         if (parsedData.type === "join_room") {
//           console.log("The parsedData from the client is ", parsedData);
//           const user = users.find(x => x.ws === ws);
//           user?.rooms.push(parsedData.roomId);
//         }

//         if (parsedData.type === "leave_room") {
//             const user = users.find(x => x.ws === ws);
//             if (!user) {
//               return;
//             }
//             user.rooms = user?.rooms.filter(x => x === parsedData.room);
//           }

//           // whenever a chat message comes, put it into the DB
//           /*
          
//           */
//           if (parsedData.type === "chat") {
//             console.log("The parsedData from the client is ", parsedData);
//             const roomId = parsedData.roomId;
//             const message = parsedData.message;


            
//             users.forEach(user => {
//                 if(user.rooms.includes(roomId))
//                 {
//                     user.ws.send(JSON.stringify({
//                         "type":"chat",
//                         "message":message,
//                         roomId
//                     })
//                     )
//                 }
//             })

//             // await prismaclient.chat.create({
//             //     data:{
//             //         roomId,
//             //         message,
//             //         userId
//             //     }
//             // })
//           }

//     })
// })


import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { parse } from "url";
import { prismaclient } from "@repo/db/client";


interface User {
    userId: string;
    rooms: string[];
    ws: WebSocket;
}

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 8080 });
let users: User[] = [];

function checkUser(token: string): string | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (typeof decoded == "string") {
        return null;
      }

      if (!decoded || !decoded.id) {
        return null;
      }

      return decoded.id;
    } catch(e) {
      return null;
    }
    
}

wss.on("connection", function connection(ws: WebSocket, request) {
    // Check the Origin header
    // const origin = request.headers.origin;
    // const allowedOrigin = "https://draw-app-fe.onrender.com";

    // if (origin !== allowedOrigin) {
    //     console.log(`Connection rejected: Origin ${origin} not allowed`);
    //     ws.close(1008, "Origin not allowed");
    //     return;
    // }

    const url = request.url || "";
    if (!url) {
        ws.close();
        return;
    }

    console.log(
      "You are connected to ws server! "
    )

    /*
    so u will get a url like ws://localhost:8080?token=287fgjsdcs
    the token has to be a string only
    
    */
    const parsedToken = parse(url, true).query.token;
    const token = typeof parsedToken === "string" ? parsedToken : "";
    console.log(token);

    // check if the user is verified or not
    const userId = checkUser(token);
    console.log("the userId is ", userId);

    if (userId == null) {
        ws.close();
        return;
    }

    // for the moment 
    users.push({ userId, rooms: [], ws });
    console.log("Active users:", users.map((u) => u.userId));

    ws.on("message", async function message(data) {
        try {
            const parsedData =
                typeof data === "string"
                    ? JSON.parse(data)
                    : JSON.parse(data.toString());

            if (parsedData.type === "join_room") {
                const user = users.find((x) => x.ws === ws);
                if (user && !user.rooms.includes(parsedData.roomId)) {
                  user.rooms.push(parsedData.roomId);
                }
                console.log(`👥 User ${userId} joined room ${parsedData.roomId}`);
            }

            if (parsedData.type === "leave_room") {
                const user = users.find((x) => x.ws === ws);
                if (!user) return;
                user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
                console.log(`👥 User ${userId} left room ${parsedData.roomId}`);
            }

            if (parsedData.type === "chat") {
                const roomSlug = parsedData.roomId;
                const message = parsedData.message;
                const parsedMessage = JSON.parse(message);

                if (!roomSlug || !message) {
                    ws.send(
                        JSON.stringify({
                            type: "error",
                            message: "Invalid inputs",
                        })
                    );
                    return;
                }
                // ✅ Lookup room by slug
              const room = await prismaclient.room.findUnique({
                where: { slug: roomSlug },
              });

              if (!room) {
                ws.send(
                  JSON.stringify({ type: "error", message: `Room ${roomSlug} not found` })
                );
                return
              }

                if (parsedMessage.action === "update") {
                    await prismaclient.chat.update({
                        where: {
                            id: parsedMessage.id,
                        },
                        data: {
                            message: JSON.stringify({
                                shape: parsedMessage.shape,
                            }),
                        },
                    });

                    users.forEach((user) => {
                        if (user.ws !== ws && user.rooms.includes(roomSlug)) {
                            user.ws.send(
                                JSON.stringify({
                                    type: "chat",
                                    message: JSON.stringify({
                                        shape: parsedMessage.shape,
                                        id: parsedMessage.id,
                                        action: "update",
                                    }),
                                    roomId:roomSlug,
                                })
                            );
                        }
                    });
                } else {
                    const chat = await prismaclient.chat.create({
                        data: {
                            roomId: room.id,
                            userId,
                            message: JSON.stringify({
                                shape: parsedMessage.shape,
                            }),
                        },
                    });

                    users.forEach((user) => {
                        if (user.ws !== ws && user.rooms.includes(roomSlug)) {
                            user.ws.send(
                                JSON.stringify({
                                    type: "chat",
                                    message: JSON.stringify({
                                        shape: parsedMessage.shape,
                                        id: chat.id,
                                        action: "create",
                                    }),
                                    roomId:roomSlug,
                                })
                            );
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Error processing message:", e);
            ws.send(
                JSON.stringify({
                    type: "error",
                    message: "Failed to process message",
                })
            );
        }
    });

    ws.on("close", () => {
        users = users.filter((user) => user.ws !== ws);
        console.log("User disconnected, remaining users:", users);
    });
});