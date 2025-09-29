import { Request, Response } from "express";

import { prismaclient } from "@repo/db/client";
import { RoomSchema } from "@repo/common-zod/types";


interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}


/*
We will get the room name from the req.body!

*/
export const handleCreateRoom = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    //
    const parsed = RoomSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: parsed.error.format(),
      });
    }

    // const newRoom = await prismaclient.room.create({ data: { adminId: userId } });
    const room = await prismaclient.room.create({
        data: {
            slug: parsed.data.name,  // a room name
            adminId: userId // who created the room
        }
    })

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
      roomId:room.id
    });
  } catch (error) {
    console.error("Create Room error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};