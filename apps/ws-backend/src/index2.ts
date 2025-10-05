/*
this code is for practice only!


*/

import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({port: 8081});

interface Users {
    ws: WebSocket,
    rooms:number[],
    id:string
}

/*
{
    type:'join_room"
    roomId:12
}

{
    type:'chat'
    message:'hey there !'
    roomId:12
}

*/
let users:Users[] = [];
wss.on("connection", function connection(socket:WebSocket)  {
    console.log("Websocket connection is established! ");

      // Assign unique user id
  const userId = Math.random().toString(36).substring(2, 10);
  users.push({ ws: socket, rooms: [], id: userId });
  socket.send(
    JSON.stringify({
      type: "connected",
      message: "Connection established successfully!",
      userId,
    })
  );

    socket.on("message", function message(data:any)  {
        /*
        
        so we do the below line of code!
        extract the current user with the websocket connection!
        
        */
        const user = users.find((x) => x.ws === socket);
        if (!user) return;
        try {
            const parsedData =
                typeof data === "string"
                    ? JSON.parse(data)
                    : JSON.parse(data.toString());

            if (parsedData.type === "join_room") {
                const { roomId } = parsedData;
                if (!user.rooms.includes(roomId)) {
                    user.rooms.push(roomId);
                  }
        
                  console.log(`🟢 User ${user.id} joined room ${roomId}`);
                  socket.send(
                    JSON.stringify({
                      type: "join_confirm",
                      roomId,
                      message: `Joined room ${roomId}`,
                    })
                  );
            }

            if (parsedData.type === "leave_room") {
		            const { roomId } = parsedData;
                user.rooms = user.rooms.filter((r) => r !== roomId);
                console.log(`🔴 User ${user.id} left room ${roomId}`);
                socket.send(
                  JSON.stringify({
                    type: "leave_confirm",
                    roomId,
                    message: `Left room ${roomId}`,
                  })
                );
            }

            if(parsedData.type == "chat")
            {
                const message = parsedData.message;
                const roomId = parsedData.roomId;
                
                // Broadcast message to all users in the room except sender
                users.forEach((user) => {
                    if(user.rooms.includes(roomId) && user.ws!=socket)
                    {
                        user.ws.send(
                            JSON.stringify({
                                type: "chat",
                                message: message,
                                roomId,
                            })
                        );
                    }
                })
            }
        }
        catch(error)
        {
            console.error("Error processing message:");
            socket.send(
                JSON.stringify({
                    type: "error",
                    message: "Failed to process message",
                })
            );
        }
    }
    )
})