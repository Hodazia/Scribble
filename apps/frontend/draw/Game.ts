import axios from "axios";
import { Shape, Tool } from "./type";
import { HTTP_BACKEND } from "@/config";

export type ToolRef = React.MutableRefObject<Tool>;

type ShapeWithId = {
  id: number;
  shape: Shape;
};

export function initDraw(
  canvas: HTMLCanvasElement,
  selectedToolRef: ToolRef,
  roomId: string,
  socket: WebSocket
) {
  const maybectx = canvas.getContext("2d");
  if (!maybectx) return;
  if (!(maybectx instanceof CanvasRenderingContext2D)) return;
  const ctx = maybectx;

  let shapes: ShapeWithId[] = [];
  let isDown = false;
  let startX = 0,
    startY = 0;
  let panX = 0,
    panY = 0;
  let lastPanX = 0,
    lastPanY = 0;
  let selectedId: number | null = null;
  let hoverId: number | null = null;
  let currentPoints: { x: number; y: number }[] = [];
  let moveStart: { x: number; y: number } | null = null;
  // paste tool related state
  let pasteTarget: { x: number; y: number } | null = null; // where image will be pasted


  // ---- Coordinate helpers
  const worldToScreen = (x: number, y: number) => [x + panX, y + panY];
  const screenToWorld = (x: number, y: number) => [x - panX, y - panY];

  // ---- Draw all shapes
  function drawAll(preview?: Shape | null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";

    for (const { id, shape } of shapes) {
      drawShape(shape, id === selectedId);
    }

    if (preview) {
      ctx.save();
      ctx.setLineDash([6, 6]);
      drawShape(preview, false);
      ctx.restore();
    }
  }

  // ---- Draw shape logic
  function drawShape(shape: Shape, highlight: boolean) {
    ctx.beginPath();
    if (highlight) {
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.7)";
      ctx.shadowBlur = 10;
    }

    if (shape.type === "rectangle") {
      const [sx, sy] = worldToScreen(shape.x, shape.y);
      ctx.strokeRect(sx, sy, shape.width, shape.height);
    } else if (shape.type === "circle") {
      const [sx, sy] = worldToScreen(shape.x, shape.y);
      ctx.arc(sx + shape.radius, sy + shape.radius, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "line") {
      const [x1, y1] = worldToScreen(shape.x1, shape.y1);
      const [x2, y2] = worldToScreen(shape.x2, shape.y2);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    } else if (shape.type === "pencil") {
      const pts = shape.points;
      if (pts.length > 1) {
        ctx.beginPath();
        const [sx, sy] = worldToScreen(pts[0].x, pts[0].y);
        ctx.moveTo(sx, sy);
        for (let i = 1; i < pts.length; i++) {
          const [px, py] = worldToScreen(pts[i].x, pts[i].y);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }   else if (shape.type === "image") {
      const [sx, sy] = worldToScreen(shape.x, shape.y);
      const img = new Image();
      img.src = shape.src;
      img.onload = () => {
        ctx.drawImage(img, sx, sy, shape.width, shape.height);
      };
      ctx.drawImage(img, sx, sy, shape.width, shape.height);
    }

    if (highlight) ctx.restore();
    ctx.closePath();
  }

  // ---- Hit testing
  function hitTest(px: number, py: number): number | null {
    const [x, y] = screenToWorld(px, py);
    const T = 6;
    for (let i = shapes.length - 1; i >= 0; i--) {
      const { id, shape } = shapes[i];
      if (shape.type === "rectangle") {
        if (
          x >= shape.x - T &&
          x <= shape.x + shape.width + T &&
          y >= shape.y - T &&
          y <= shape.y + shape.height + T
        )
          return id;
      } else if (shape.type === "circle") {
        const cx = shape.x + shape.radius;
        const cy = shape.y + shape.radius;
        const d = Math.hypot(x - cx, y - cy);
        if (d <= shape.radius + T) return id;
      } else if (shape.type === "line") {
        const d = pointToSegmentDistance(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
        if (d <= T) return id;
      }else if (shape.type === "image") {
        if (
          x >= shape.x &&
          x <= shape.x + shape.width &&
          y >= shape.y &&
          y <= shape.y + shape.height
        )
          return id;
      }
    }
    return null;
  }

  // ---- Paste Image Logic (Cloudinary + Base64 fallback)
  async function uploadImageToBackend(blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("file", blob);
    try {
      const res = await fetch(`${HTTP_BACKEND}/api/v1/upload/images`, {
        method: "POST",
        body: formData,
        credentials: "include", // include auth cookies for protected route
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.warn("Backend upload failed, falling back to base64:", err);
      return await blobToBase64(blob);
    }
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // 🔵 Add helper to add image to canvas
  // Add image to canvas + broadcast
  function addImageToCanvas(src: string, x: number, y: number) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const maxWidth = 400;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const newShape: Shape = {
        type: "image",
        x,
        y,
        width: img.width * scale,
        height: img.height * scale,
        src,
      };

      const tempId = Date.now();
      shapes.push({ id: tempId, shape: newShape });
      drawAll();

      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ action: "create", shape: newShape }),
        })
      );
    };
  }


  // 🔵 Expose a function globally or return it for Toolbar to call
  // (your Toolbar can call this via ref or external function)
  // ---- Paste Tool Clipboard Handler
   // ---- Clipboard paste handler
   window.addEventListener("paste", async (event: ClipboardEvent) => {
    const tool = selectedToolRef.current;
    if (tool !== "paste" || !pasteTarget) return;
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const blob = item.getAsFile();
        if (blob) {
          const src = await uploadImageToBackend(blob);
          addImageToCanvas(src, pasteTarget.x, pasteTarget.y);
          pasteTarget = null;
          break;
        }
      }
    }
  });


  function pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const A = px - x1,
      B = py - y1,
      C = x2 - x1,
      D = y2 - y1;
    const dot = A * C + B * D;
    const len = C * C + D * D;
    const t = Math.max(0, Math.min(1, len ? dot / len : 0));
    const xx = x1 + t * C,
      yy = y1 + t * D;
    return Math.hypot(px - xx, py - yy);
  }

  // ---- Network updates
  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type !== "chat") return;
    const { shape, id, action } = JSON.parse(msg.message);

    if (action === "create") shapes.push({ id, shape });
    else if (action === "update") {
      const idx = shapes.findIndex((s) => s.id === id);
      if (idx >= 0) shapes[idx] = { id, shape };
    } else if (action === "delete") {
      shapes = shapes.filter((s) => s.id !== id);
      if (selectedId === id) selectedId = null;
    }

    drawAll();
  };

  // ---- Fetch initial shapes
  (async () => {
    shapes = await getExistingShapes(roomId);
    drawAll();
  })();

  // ---- Mouse events
  const onMouseDown = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const tool = selectedToolRef.current;

    isDown = true;
    [startX, startY] = screenToWorld(sx, sy);
    [lastPanX, lastPanY] = [sx, sy];

    // Paste Tool: set target for Ctrl+V placement
    if (tool === "paste") {
        pasteTarget = { x: startX, y: startY };
        alert("Now press Ctrl+V to paste your copied image here.");
        return;
        }
    
    
    if (tool === "pencil") {
      currentPoints = [{ x: startX, y: startY }];
      return;
    }

    if (tool === "select" || tool === "eraser") {
      selectedId = hitTest(sx, sy);
      drawAll();
      if (tool === "eraser" && selectedId != null) {
        const id = selectedId;
        selectedId = null;
        shapes = shapes.filter((s) => s.id !== id);
        socket.send(
          JSON.stringify({
            type: "chat",
            roomId,
            message: JSON.stringify({ action: "delete", id }),
          })
        );
        drawAll();
      } else if (tool === "select" && selectedId != null) {
        moveStart = { x: startX, y: startY };
      }
      return;
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const tool = selectedToolRef.current;
    const [wx, wy] = screenToWorld(sx, sy);

    if (tool === "hand") {
      const dx = sx - lastPanX;
      const dy = sy - lastPanY;
      panX += dx;
      panY += dy;
      [lastPanX, lastPanY] = [sx, sy];
      drawAll();
      return;
    }

    if (tool === "pencil") {
      currentPoints.push({ x: wx, y: wy });
      drawAll({ type: "pencil", points: currentPoints });
      return;
    }

    if (tool === "rectangle") {
      drawAll({
        type: "rectangle",
        x: startX,
        y: startY,
        width: wx - startX,
        height: wy - startY,
      });
      return;
    }

    if (tool === "circle") {
      const radius = Math.hypot(wx - startX, wy - startY) / 2;
      drawAll({
        type: "circle",
        x: startX,
        y: startY,
        radius,
      });
      return;
    }

    if (tool === "line") {
      drawAll({
        type: "line",
        x1: startX,
        y1: startY,
        x2: wx,
        y2: wy,
      });
      return;
    }

    if (tool === "select" && selectedId != null && moveStart) {
      const dx = wx - moveStart.x;
      const dy = wy - moveStart.y;
      const s = shapes.find((sh) => sh.id === selectedId);
      if (s) {
        const moved = moveShape(s.shape, dx, dy);
        drawAll(moved);
      }
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDown) return;
    isDown = false;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const [wx, wy] = screenToWorld(sx, sy);
    const tool = selectedToolRef.current;

    if (tool === "pencil" && currentPoints.length > 1) {
      const newShape: Shape = { type: "pencil", points: currentPoints };
      currentPoints = [];
      const tempId = Date.now();
      shapes.push({ id: tempId, shape: newShape });
      drawAll();
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ action: "create", shape: newShape }),
        })
      );
      return;
    }

    if (tool === "select" && selectedId != null && moveStart) {
      const s = shapes.find((sh) => sh.id === selectedId);
      if (s) {
        const dx = wx - moveStart.x;
        const dy = wy - moveStart.y;
        const moved = moveShape(s.shape, dx, dy);
        s.shape = moved;
        drawAll();
        socket.send(
          JSON.stringify({
            type: "chat",
            roomId,
            message: JSON.stringify({
              action: "update",
              id: s.id,
              shape: moved,
            }),
          })
        );
      }
      moveStart = null;
      return;
    }

    let newShape: Shape | null = null;
    if (tool === "rectangle") {
      newShape = {
        type: "rectangle",
        x: startX,
        y: startY,
        width: wx - startX,
        height: wy - startY,
      };
    } else if (tool === "circle") {
      const radius = Math.hypot(wx - startX, wy - startY) / 2;
      newShape = { type: "circle", x: startX, y: startY, radius };
    } else if (tool === "line") {
      newShape = { type: "line", x1: startX, y1: startY, x2: wx, y2: wy };
    }

    if (newShape) {
      const tempId = Date.now();
      shapes.push({ id: tempId, shape: newShape });
      drawAll();
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ action: "create", shape: newShape }),
        })
      );
    }
  };

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", () => (isDown = false));

  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
  };

  function moveShape(s: Shape, dx: number, dy: number): Shape {
    if (s.type === "rectangle") return { ...s, x: s.x + dx, y: s.y + dy };
    if (s.type === "circle") return { ...s, x: s.x + dx, y: s.y + dy };
    if (s.type === "line")
      return {
        ...s,
        x1: s.x1 + dx,
        y1: s.y1 + dy,
        x2: s.x2 + dx,
        y2: s.y2 + dy,
      };
    if (s.type === "pencil")
      return { ...s, points: s.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) };
    if (s.type === "text") return { ...s, x: s.x + dx, y: s.y + dy };
    return s;
  }
}

// ---- Helper to fetch shapes
async function getExistingShapes(roomId: string): Promise<ShapeWithId[]> {
  const res = await axios.get(`${HTTP_BACKEND}/api/v1/rooms/chats/${roomId}`);
  const messages: { id: number; message: string }[] = res.data.messages;
  return messages.map((m) => {
    const parsed = JSON.parse(m.message);
    return { id: m.id, shape: parsed.shape as Shape };
  });
}
