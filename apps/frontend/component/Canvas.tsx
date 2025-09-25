'use client'

import { useState, useEffect, useRef } from "react";

// tools
type ShapeType = "circle" | "rect" | "line";

// shape model
type Shape = {
  id?: number;
  type: ShapeType;
  x: number;
  y: number;
  w?: number;
  h?: number;
  radius?: number;
};

// draw helper
function drawShape(ctx: CanvasRenderingContext2D, shape: Shape, isPreview = false) {
  ctx.beginPath();
  if (shape.type === "circle" && shape.radius) {
    ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
    ctx.strokeStyle = isPreview ? "green" : "red";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  if (shape.type === "rect" && shape.w !== undefined && shape.h !== undefined) {
    ctx.rect(shape.x, shape.y, shape.w, shape.h);
    ctx.strokeStyle = isPreview ? "green" : "blue";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  if (shape.type === "line" && shape.w !== undefined && shape.h !== undefined) {
    ctx.moveTo(shape.x, shape.y);
    ctx.lineTo(shape.w, shape.h);
    ctx.strokeStyle = isPreview ? "green" : "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<ShapeType>("circle");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<Shape | null>(null);

  // join/leave room
  useEffect(() => {
    const joinMsg = JSON.stringify({ type: "join_room", roomId });
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(joinMsg);
    } else {
      socket.onopen = () => socket.send(joinMsg);
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "leave_room", roomId }));
      }
    };
  }, [roomId, socket]);

  // handle server events
  useEffect(() => {
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "chat") {
        const parsed = JSON.parse(msg.message);
        if (parsed.action === "create") {
          setShapes((prev) => [...prev, { ...parsed.shape, id: parsed.id }]);
        } else if (parsed.action === "update") {
          setShapes((prev) =>
            prev.map((s) => (s.id === parsed.id ? { ...s, ...parsed.shape } : s))
          );
        }
      }
    };
  }, [socket]);

  // redraw on shapes/preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((s) => drawShape(ctx, s));
    if (preview) drawShape(ctx, preview, true);
  }, [shapes, preview]);

  // handle mouse events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDrawing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing || !startPos) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (tool === "circle") {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        setPreview({ type: "circle", x: startPos.x, y: startPos.y, radius });
      } else if (tool === "rect") {
        setPreview({ type: "rect", x: startPos.x, y: startPos.y, w: x - startPos.x, h: y - startPos.y });
      } else if (tool === "line") {
        setPreview({ type: "line", x: startPos.x, y: startPos.y, w: x, h: y });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDrawing || !startPos) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let newShape: Shape | null = null;
      if (tool === "circle") {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        newShape = { type: "circle", x: startPos.x, y: startPos.y, radius };
      } else if (tool === "rect") {
        newShape = { type: "rect", x: startPos.x, y: startPos.y, w: x - startPos.x, h: y - startPos.y };
      } else if (tool === "line") {
        newShape = { type: "line", x: startPos.x, y: startPos.y, w: x, h: y };
      }

      if (newShape) {
        setShapes((prev) => [...prev, newShape]);

        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "chat",
              roomId,
              message: JSON.stringify({ shape: newShape }), // backend will wrap it into action=create
            })
          );
        }
      }

      setIsDrawing(false);
      setStartPos(null);
      setPreview(null);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDrawing, startPos, tool, socket, roomId]);

  // auto resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-2 justify-center bg-gray-200 text-blue-400">
        <div className="p-2 bg-black flex gap-2">
          <button onClick={() => setTool("circle")}>Circle</button>
          <button onClick={() => setTool("rect")}>Rectangle</button>
          <button onClick={() => setTool("line")}>Line</button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ backgroundColor: "#d9d8d4", display: "block" }} />
    </div>
  );
}
