import express, { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { prismaclient } from "@repo/db/client";
import { Request,Response } from "express";
import { handleCreateRoom } from "../controller/room.controller";

const router: Router = express.Router();

router.post("/create-room", protectedRoute, handleCreateRoom);
router.get("/chats/:roomId", async (
    req: Request,
    res: Response
  ) => {
    const roomId = Number(req.params.roomId);
    console.log(req.params.roomId);
    if (Number.isNaN(roomId)) {
      return res.status(400).send("Invalid roomId");
    }
  
      // Wrap async logic in a synchronous handler
      (async () => {
          try {
            // get the latest 50 chats,
            /*
          The output response will be something like this!
          [
    {
        "id": 6,
        "userId": "cmg4vyaz30000ofrs0q61tf9v",
        "message": "{\"shape\":{\"type\":\"rect\",\"x\":30,\"y\":30}}",
        "roomId": 2
    },
    {
        "id": 5,
        "userId": "cmg4vyaz30000ofrs0q61tf9v",
        "message": "{\"shape\":{\"type\":\"rect\",\"x\":10,\"y\":20}}",
        "roomId": 2
    },
    {
        "id": 4,
        "userId": "cmg4vyaz30000ofrs0q61tf9v",
        "message": "{\"shape\":{\"type\":\"rect\",\"x\":10,\"y\":20}}",
        "roomId": 2
    }
]
                */
              const messages = await prismaclient.chat.findMany({
                  where: { roomId:roomId },
                  orderBy: { id: "desc" },
                  take: 50,
              });
            // const chats = await prismaclient.chat.findMany({
            //     where: { roomId },
            //     orderBy: { id: "desc" },
            //     take: 50,
            // });
              res.json({
                messages
            });
          } catch (e) {
                console.log(e);
                res.json({
                    messages: []
                })
          }
      })();})


// Get room by slug
router.get("/room/:slug", (req: Request, res: Response) => {
    const slug = req.params.slug;

    // Wrap async logic in a synchronous handler
    (async () => {
        try {
            const room = await prismaclient.room.findUnique({
                where: { slug },
            });
            if (!room) {
                res.status(404).send("Room not found");
                return;
            }
            res.json(room);
        } catch (e) {
            res.status(500).send("Failed to fetch room");
        }
    })();
});

// Get all rooms (protected)
router.get("/get-rooms", protectedRoute, (req: Request, res: Response) => {
    prismaclient.room
        .findMany({
            include: {
                admin: {
                    select: { name: true },
                },
            },
        })
        .then((rooms) => res.json(rooms))
        .catch((e) => res.status(500).send("Failed to fetch rooms"));
});

/**
 * GET /messages/:roomId
 * Fetch the latest 50 user chat messages for a given room.
 */
router.get("/messages/:roomId", protectedRoute,async (req:Request,res:Response) => {
    const roomId = Number(req.params.roomId);
    console.log(req.params.roomId);
    if (Number.isNaN(roomId)) {
      return res.status(400).send("Invalid roomId");
    }

    try {
        // Fetch latest 50 messages (descending order)
    const messages = await prismaclient.messages.findMany({
        where: { roomId },
        orderBy: { id: "desc" },
        take: 50,
        select: {
          id: true,
          userId: true,
          content: true,
          roomId: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
  /*
      Example output:
      [
        {
          "id": 12,
          "userId": "cmg4vyaz30000ofrs0q61tf9v",
          "content": "Hey everyone!",
          "roomId": 2,
          "createdAt": "2025-10-02T10:10:00.000Z",
          "user": {
            "name": "Ziaul Hoda",
            "image": "https://cdn.userpics.com/pic.png"
          }
        },
        ...
      ]
    */
      res.json({ messages });
    }
    catch(e)
    {
        console.error("Error fetching messages:", e);
        res.status(500).json({ messages: [], error: "Failed to fetch messages" });
    }
    
})
/*
one route to store the copied and pasted images in the cloudinary!
once stored in the cloudinary , get back its file url in the response

POST /rooms/uploadimage


*/
export default router;