'use client'

import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { useRouter } from "next/navigation";
import { WS_BACKEND } from "@/config";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const router = useRouter();

  useEffect(() => {
    // TODO: replace hardcoded token with real auth
    const ws = new WebSocket(
      `${WS_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZnpuZDE4ZTAwMDJvZjByMGExcWNwNTYiLCJpYXQiOjE3NTg4MTg5MzB9.ADTbkpDzLcjJSnt-DpCgxJU3FRsf-VnHdGNOQOzP7WQ`
    );

    ws.onopen = () => {
      console.log("✅ WS connected");
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };

    ws.onclose = () => {
      console.log("❌ WS disconnected");
    };

    // Clean up WebSocket connection on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId, router]);
  const handleLeaveRoom = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    setSocket(null);
    router.push("/lobby");
  };

  if (!socket) return <div>Loading...</div>;

  return (
    <div className="relative">
    <Canvas roomId={roomId} socket={socket} />
    <button
      onClick={handleLeaveRoom}
      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
    >
      Leave Room
    </button>
  </div>
  );
}
