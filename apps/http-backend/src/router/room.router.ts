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
              const chats = await prismaclient.chat.findMany({
                //@ts-ignore
                  where: { roomId },
                  orderBy: { id: "desc" },
                  take: 50,
              });
            // const chats = await prismaclient.chat.findMany({
            //     where: { roomId },
            //     orderBy: { id: "desc" },
            //     take: 50,
            // });
              res.json(chats);
          } catch (e) {
              res.status(500).send("Failed to fetch chats");
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


export default router;