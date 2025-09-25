'use client'

import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // TODO: replace hardcoded token with real auth
    const ws = new WebSocket(
      `ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZnpuZDE4ZTAwMDJvZjByMGExcWNwNTYiLCJpYXQiOjE3NTg4MTg5MzB9.ADTbkpDzLcjJSnt-DpCgxJU3FRsf-VnHdGNOQOzP7WQ`
    );

    ws.onopen = () => {
      console.log("✅ WS connected");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("❌ WS disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!socket) {
    return <div>Connecting to the server...</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
