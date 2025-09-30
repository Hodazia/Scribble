// // =============================
// // SERVER-SIDE (Node.js with ws)
// // =============================

// // 1. Import the WebSocket and WebSocketServer classes
// // To run this, you need to install the 'ws' library: npm install ws
// const WebSocket = require('ws');
// const http = require('http');

// Create a simple HTTP server to attach the WebSocket server to.
// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('WebSocket server is running!\n');
// });

// // Create a WebSocket server instance on top of the HTTP server.
// // The default port for ws is 8080.
// const wss = new WebSocket.Server({ server });

// console.log('Server is starting...');

// // The 'connection' event is the first event triggered on the server.
// // It fires whenever a new client successfully connects.
// // `ws` is the specific WebSocket object for that new client.
// wss.on('connection', ws => {
//     console.log('A new client has connected.');

//     // ------------------------------------
//     // Server-side events for a single client
//     // ------------------------------------

//     // The 'message' event is triggered when the server receives data from the client.
//     ws.on('message', message => {
//         // The message is a Buffer, so convert it to a string for display.
//         const receivedMessage = message.toString();
//         console.log(`Received message from client: ${receivedMessage}`);

//         // Send a message back to the same client.
//         ws.send(`Server received your message: "${receivedMessage}"`);

//         // Example: Broadcast the message to all other connected clients.
//         wss.clients.forEach(client => {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 client.send(`New message from another user: "${receivedMessage}"`);
//             }
//         });
//     });

//     // The 'close' event is triggered when a client disconnects.
//     ws.on('close', () => {
//         console.log('Client has disconnected.');
//     });

//     // The 'error' event is triggered if there's an error with the connection.
//     ws.on('error', error => {
//         console.error('An error occurred:', error);
//     });
// });

// // Start the server on port 8080.
// server.listen(8080, () => {
//     console.log('WebSocket server started on http://localhost:8080');
// });

// // =============================
// // CLIENT-SIDE (Vanilla JavaScript in HTML)
// // =============================
// // Save this code as an HTML file (e.g., index.html) and open it in a browser.
// // Note: For WSS (secure WebSockets), change 'ws://' to 'wss://'.
// /*
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>WebSocket Client</title>
//     <script src="https://cdn.tailwindcss.com"></script>
//     <style>
//       @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
//       body { font-family: 'Inter', sans-serif; }
//     </style>
// </head>
// <body class="bg-gray-100 flex items-center justify-center min-h-screen">

//     <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
//         <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">WebSocket Client</h1>
        
//         <div id="status" class="bg-blue-100 text-blue-800 text-center py-2 px-4 rounded-lg mb-4">
//             Connecting...
//         </div>

//         <form id="message-form" class="flex gap-2 mb-4">
//             <input 
//                 id="message-input" 
//                 type="text" 
//                 placeholder="Type a message..." 
//                 class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button 
//                 type="submit" 
//                 id="send-button"
//                 class="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition-colors"
//             >
//                 Send
//             </button>
//         </form>

//         <div id="messages" class="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2">
//             <!-- Messages will be appended here -->
//         </div>
//     </div>

//     <script>
//         const statusDiv = document.getElementById('status');
//         const messagesDiv = document.getElementById('messages');
//         const messageInput = document.getElementById('message-input');
//         const messageForm = document.getElementById('message-form');

//         // Create a new WebSocket connection to the server.
//         // Replace 'localhost' with your server's address if it's different.
//         const ws = new WebSocket('ws://localhost:8080');

//         // ------------------------------------
//         // Client-side events
//         // ------------------------------------

//         // The 'open' event is triggered when the connection is successfully established.
//         ws.addEventListener('open', () => {
//             console.log('Connected to the WebSocket server.');
//             statusDiv.textContent = 'Connected!';
//             statusDiv.classList.remove('bg-blue-100');
//             statusDiv.classList.add('bg-green-100', 'text-green-800');
//         });

//         // The 'message' event is triggered when the client receives data from the server.
//         ws.addEventListener('message', event => {
//             console.log('Message from server:', event.data);
//             const messageElement = document.createElement('div');
//             messageElement.textContent = event.data;
//             messageElement.className = 'bg-gray-200 p-2 rounded-md';
//             messagesDiv.appendChild(messageElement);
//             messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the bottom
//         });

//         // The 'close' event is triggered when the connection is closed.
//         ws.addEventListener('close', () => {
//             console.log('Disconnected from the WebSocket server.');
//             statusDiv.textContent = 'Disconnected.';
//             statusDiv.classList.remove('bg-green-100');
//             statusDiv.classList.add('bg-red-100', 'text-red-800');
//         });

//         // The 'error' event is triggered if there's an error with the connection.
//         ws.addEventListener('error', error => {
//             console.error('WebSocket Error:', error);
//             statusDiv.textContent = 'Connection Error.';
//             statusDiv.classList.remove('bg-blue-100');
//             statusDiv.classList.add('bg-red-100', 'text-red-800');
//         });

//         // Handle form submission to send a message to the server.
//         messageForm.addEventListener('submit', event => {
//             event.preventDefault(); // Prevent the form from reloading the page
//             const message = messageInput.value;

//             if (message.trim() !== '') {
//                 // Use the send() method to send the message to the server.
//                 ws.send(message);
                
//                 // Display the sent message locally
//                 const sentMessageElement = document.createElement('div');
//                 sentMessageElement.textContent = `You: ${message}`;
//                 sentMessageElement.className = 'bg-indigo-100 p-2 rounded-md text-right';
//                 messagesDiv.appendChild(sentMessageElement);
//                 messagesDiv.scrollTop = messagesDiv.scrollHeight;
                
//                 messageInput.value = ''; // Clear the input field
//             }
//         });
//     </script>
// </body>
// </html>
// */


// an alternative to index.ts websocket server
/*
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { parse } from "url";
import { prismaclient } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";

interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

interface WSMessage {
  type: "join_room" | "leave_room" | "draw_event" | "chat_message";
  roomId?: number;
  message?: string;
}

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 8080 });
let users: User[] = [];

function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded?.id) return null;
    return decoded.id;
  } catch {
    return null;
  }
}

function broadcast(roomId: number, sender: WebSocket, data: any) {
  users.forEach((user) => {
    if (user.ws !== sender && user.rooms.includes(String(roomId))) {
      user.ws.send(JSON.stringify(data));
    }
  });
}

async function handleDrawEvent(userId: string, ws: WebSocket, msg: any) {
  const { roomId, message } = msg;
  const parsed = JSON.parse(message);

  if (parsed.action === "update") {
    await prismaclient.chat.update({
      where: { id: parsed.id },
      data: { message: JSON.stringify({ shape: parsed.shape }) },
    });
  } else {
    const chat = await prismaclient.chat.create({
      data: {
        roomId: Number(roomId),
        userId,
        message: JSON.stringify({ shape: parsed.shape }),
      },
    });
    parsed.id = chat.id;
  }

  broadcast(roomId, ws, {
    type: "draw_event",
    roomId,
    message: JSON.stringify(parsed),
  });
}

async function handleChatMessage(userId: string, ws: WebSocket, msg: any) {
  const { roomId, message } = msg;
  if (!roomId || !message) return;

  // Save message in DB
  await prismaclient.message.create({
    data: { roomId, userId, message },
  });

  // Broadcast to other users
  broadcast(roomId, ws, { type: "chat_message", roomId, message, userId });
}

wss.on("connection", (ws, request) => {
  const { query } = parse(request.url || "", true);
  const token = typeof query.token === "string" ? query.token : "";
  const userId = verifyToken(token);

  if (!userId) return ws.close();

  const currentUser: User = { userId, rooms: [], ws };
  users.push(currentUser);

  ws.on("message", async (raw) => {
    try {
      const msg: WSMessage = JSON.parse(raw.toString());
      if (!msg.type) return;

      switch (msg.type) {
        case "join_room":
          currentUser.rooms.push(String(msg.roomId));
          break;
        case "leave_room":
          currentUser.rooms = currentUser.rooms.filter((r) => r !== String(msg.roomId));
          break;
        case "draw_event":
          await handleDrawEvent(userId, ws, msg);
          break;
        case "chat_message":
          await handleChatMessage(userId, ws, msg);
          break;
        default:
          ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
      }
    } catch (err) {
      console.error("Error:", err);
      ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
  });

  ws.on("close", () => {
    users = users.filter((u) => u.ws !== ws);
  });
});


*/