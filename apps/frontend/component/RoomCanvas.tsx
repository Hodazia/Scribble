"use client";

import { WS_BACKEND } from "@/config";
import { initDraw } from "@/draw/Game";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZzR2eWF6MzAwMDBvZnJzMHE2MXRmOXYiLCJpYXQiOjE3NTkyNTQ2NDZ9.g6RcLAcVGbyKLS66QPXJF8JVXAy8Gy3Y3kWO16rUmWA`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }
        
    }, [])
   
    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}