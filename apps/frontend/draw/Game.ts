// import axios from "axios";
// import { Shape } from "./type";
// import { Tool } from "./type";
// import { HTTP_BACKEND } from "@/config";
// // import getExistingShapes from "./httpfetch";

// export async function initDraw(canvas:HTMLCanvasElement,selectedTool:Tool,roomId:string,socket:WebSocket)
// {
//     const ctx = canvas.getContext('2d');
//     // let existingShapes : Shape[] = [];
//     const shapes = await getExistingShapes(roomId)
//     console.log("The shapes i get from the be is ", shapes);
//     let existingShapes: Shape[]  = shapes;

//         if(!ctx)
//         {
//           return
//         }

//         socket.onmessage = (event) => {
//           console.log("The event data from the socket client ", event.data);
//           const message = JSON.parse(event.data);
  
//           if (message.type == "chat") {
//               const parsedShape = JSON.parse(message.message)
//               existingShapes.push(parsedShape.shape)
//               clearCanvas(existingShapes, ctx, canvas);
//           }
//       }

//         // ctx?.strokeRect(10,10,100,100);
//         // ctx?.strokeRect(30,40,130,140);
//         // ctx.fillStyle =  'rgba(255,0,3,0.5)';
//         //let's run a loop and create a rectangle

//         //creating random rects
//         // for (var i = 0; i < 3; i++) {
//         //   var x = Math.random() * canvasRef.current.width;
//         //   var y = Math.random() * canvasRef.current.height;
//         //   ctx.strokeRect(x, y, x+50,y+50);
//         //   ctx.strokeStyle = "#ae2131";
//         // }

//         clearCanvas(existingShapes,ctx,canvas);
//         let startX = 0;
//         let startY = 0;
//         let clicked = false;

//         canvas.addEventListener("mousedown", (e) => {
//           console.log(e.clientX);
//           console.log(e.clientY);

//           const rect = canvas.getBoundingClientRect();
//           startX = e.clientX - rect.left;
//           startY = e.clientY - rect.top;
//           clicked = true;
//         })

//         canvas.addEventListener("mousemove", (e)=> {
//             if(clicked)
//             {
//               const rect = canvas.getBoundingClientRect();
//               const currentX = e.clientX - rect.left;
//               const currentY = e.clientY - rect.top;
//               const width = currentX - startX;
//               const height = currentY - startY;
//               // ctx.clearRect(0, 0, canvas.width, canvas.height);
//               // ctx.fillStyle = "rgba(0, 0, 0)"
//               // ctx.fillRect(0, 0, canvas.width, canvas.height);
//               clearCanvas(existingShapes, ctx, canvas);
//               ctx.strokeStyle = "rgba(255, 255, 255)"
//               const selectedtool = selectedTool;
//               if(selectedtool=="rectangle")
//               {
//                 ctx.strokeRect(startX, startY, width, height);
//               }
//               else if(selectedtool == "circle")
//               {
//                 const radius = Math.max(width, height) / 2;
//                                 const centerX = startX + radius;
//                 const centerY = startY + radius;
//                 ctx.beginPath();
//                 ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
//                 ctx.stroke();
//                 ctx.closePath(); 
//               }

//             }
          

//         })

//         canvas.addEventListener("mouseup", (e) => {
//             clicked = false
//             const rect = canvas.getBoundingClientRect();
//             const endX = e.clientX - rect.left;
//             const endY = e.clientY - rect.top;
//             const width = endX - startX;
//             const height = endY - startY;
//             const selectedtool = selectedTool;

//             let shape: Shape | null = null;
//             if (selectedtool === "rectangle") {
    
//                 shape = {
//                     type: "rectangle",
//                     x: startX,
//                     y: startY,
//                     height,
//                     width
//                 }
//             } else if (selectedtool === "circle") {
//                 const radius = Math.max(width, height) / 2;
//                 shape = {
//                     type: "circle",
//                     x: startX,
//                     y: startY,
//                     radius: radius
//                 }
//             }
    
//             if (!shape) {
//                 return;
//             }
//         existingShapes.push(shape);

//         socket.send(JSON.stringify({
//             type: "chat",
//             message: JSON.stringify({
//                 shape
//             }),
//             roomId
//         }))

//         //   ctx.clearRect(0, 0, canvas.width, canvas.height);
//         //   ctx.strokeRect(startX,startY,newx,newy);
//         //   ctx.strokeStyle = '#a12c21';

//           //only at mouseup u should send the message else no!
          
//         })
      
// }

// function clearCanvas(existingShapes:Shape[],ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement)
// {
// // clear the canvas and render all the exising shapes
// ctx.clearRect(0,0,canvas.width,canvas.height);
// ctx.fillStyle = 'rgba(0,0,0)'
// ctx.fillRect(0,0,canvas.width,canvas.height);
// existingShapes.map((shape) => {
//   if (shape.type === "rectangle") {
//       ctx.strokeStyle = "rgba(255, 255, 255)"
//       ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//   }
// })
// }

// async function getExistingShapes(roomId:string)
// {
//     // in a particular room what are the chats or shapes available
//     // returns an array of chats or shapes
//     const res = await axios.get(`${HTTP_BACKEND}/api/v1/rooms/chats/${roomId}`);
//     const message = await res.data.messages;

//     const shapes = message.map((x:{message:string}) =>{
//         const parsedmessage = JSON.parse(x.message)
//         console.log("parsed message contains ", parsedmessage);
//         return parsedmessage.shape;
//     })
//     //
//     return shapes;

// }


import axios from "axios";
import { Shape, Tool } from "./type";
import { HTTP_BACKEND } from "@/config";

export type ToolRef = React.MutableRefObject<Tool>;

// Shapes with DB id (so we can update/delete)
type ShapeWithId = {
  id: number;              // chat id from DB
  shape: Shape;
};

export function initDraw(
  canvas: HTMLCanvasElement,
  selectedToolRef: ToolRef,
  roomId: string,
  socket: WebSocket
) {
  const maybeCtx = canvas.getContext("2d");
  if (!(maybeCtx instanceof CanvasRenderingContext2D)) return;
  const ctx = maybeCtx;

  let shapes: ShapeWithId[] = [];
  let isDown = false;
  let startX = 0, startY = 0;
  let panX = 0, panY = 0;       // accumulated pan
  let lastPanX = 0, lastPanY = 0;
  let hoverId: number | null = null;
  let selectedId: number | null = null;
  let currentPoints: { x: number; y: number }[] = [];

  // -------- helpers
  const worldToScreen = (x: number, y: number) => [x + panX, y + panY];
  const screenToWorld = (x: number, y: number) => [x - panX, y - panY];

  function drawAll(preview?: Shape | null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255,255,255,1)";
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

  function drawShape(shape: Shape, highlight: boolean) {
    ctx.beginPath();
    if (highlight) {
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.shadowBlur = 12;
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
    }else if (shape.type === "pencil") {
      ctx.beginPath();
      const pts = shape.points;
      if (pts.length > 1) {
        const [sx, sy] = worldToScreen(pts[0].x, pts[0].y);
        ctx.moveTo(sx, sy);
        for (let i = 1; i < pts.length; i++) {
          const [px, py] = worldToScreen(pts[i].x, pts[i].y);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    } else if (shape.type === "text") {
      const [sx, sy] = worldToScreen(shape.x, shape.y);
      ctx.font = `${shape.fontSize || 20}px Inter, sans-serif`;
      ctx.fillStyle = shape.color || "#fff";
      ctx.fillText(shape.text, sx, sy);
    }
    if (highlight) ctx.restore();
    ctx.closePath();
  }

  function hitTest(px: number, py: number): number | null {
    // screen -> world
    const [x, y] = screenToWorld(px, py);
    // basic hit test with generous tolerance
    const T = 6;
    for (let i = shapes.length - 1; i >= 0; i--) { // topmost first
      const { id, shape } = shapes[i];
      if (shape.type === "rectangle") {
        if (x >= shape.x - T && x <= shape.x + shape.width + T && y >= shape.y - T && y <= shape.y + shape.height + T)
          return id;
      } else if (shape.type === "circle") {
        const cx = shape.x + shape.radius;
        const cy = shape.y + shape.radius;
        const d = Math.hypot(x - cx, y - cy);
        if (Math.abs(d - shape.radius) <= T || d < shape.radius) return id;
      } else if (shape.type === "line") {
        // distance from point to segment
        const d = pointToSegmentDistance(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
        if (d <= T) return id;
      }
    }
    return null;
  }

  function pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
    const dot = A * C + B * D;
    const len = C * C + D * D;
    const t = Math.max(0, Math.min(1, len ? dot / len : 0));
    const xx = x1 + t * C, yy = y1 + t * D;
    return Math.hypot(px - xx, py - yy);
  }

  // -------- network
  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type !== "chat") return;
    const { shape, id, action } = JSON.parse(msg.message);

    if (action === "create") {
      shapes.push({ id, shape });
    } else if (action === "update") {
      const idx = shapes.findIndex((s) => s.id === id);
      if (idx >= 0) shapes[idx] = { id, shape };
    } else if (action === "delete") {
      shapes = shapes.filter((s) => s.id !== id);
      if (selectedId === id) selectedId = null;
    }
    drawAll();
  };

  // initial fetch
  (async () => {
    shapes = await getExistingShapes(roomId);
    drawAll();
  })();

  // -------- events
  const onMouseDown = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const tool = selectedToolRef.current;

    isDown = true;
    [startX, startY] = screenToWorld(sx, sy);
    [lastPanX, lastPanY] = [sx, sy];


    if (tool === "pencil") {
      currentPoints = [{ x: startX, y: startY }];
    }

    if (tool === "text") {
      // prompt user for text entry
      const userText = prompt("Enter text:");
      if (userText && userText.trim()) {
        const newShape: Shape = {
          type: "text",
          x: startX,
          y: startY,
          text: userText.trim(),
          fontSize: 22,
          color: "#fff"
        };
        const tempId = -Date.now();
        shapes.push({ id: tempId, shape: newShape });
        drawAll();
        socket.send(JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ action: "create", shape: newShape })
        }));
      }
      isDown = false;
      return;
    }

    if (tool === "select" || tool === "eraser") {
      selectedId = hitTest(sx, sy);
      drawAll();
      if (tool === "eraser" && selectedId != null) {
        // delete immediately
        const id = selectedId;
        selectedId = null;
        socket.send(JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ action: "delete", id })
        }));
      }
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const tool = selectedToolRef.current;

    // hover highlight for select
    if (!isDown && (tool === "select" || tool === "eraser")) {
      const id = hitTest(sx, sy);
      if (hoverId !== id) {
        hoverId = id;
        selectedId = id;
        drawAll();
      }
      return;
    }

    if (!isDown) return;


    if (tool === "pencil") {
      const [wx, wy] = screenToWorld(sx, sy);
      currentPoints.push({ x: wx, y: wy });
      const preview: Shape = { type: "pencil", points: currentPoints };
      drawAll(preview);
      return;
    }

    if (tool === "hand") {
      // panning is performed in screen space
      const dx = sx - lastPanX;
      const dy = sy - lastPanY;
      panX += dx;
      panY += dy;
      [lastPanX, lastPanY] = [sx, sy];
      drawAll();
      return;
    }

    // live preview for drawing tools
    const [wx, wy] = screenToWorld(sx, sy);
    let preview: Shape | null = null;

    if (tool === "rectangle") {
      preview = { type: "rectangle", x: startX, y: startY, width: wx - startX, height: wy - startY };
    } else if (tool === "circle") {
      const radius = Math.max(Math.abs(wx - startX), Math.abs(wy - startY)) / 2;
      // normalize to top-left x,y (like you had)
      preview = { type: "circle", x: startX, y: startY, radius };
    } else if (tool === "line") {
      preview = { type: "line", x1: startX, y1: startY, x2: wx, y2: wy };
    } else if (tool === "select" && selectedId != null) {
      // simple move of selected shape
      const s = shapes.find((sh) => sh.id === selectedId);
      if (s) {
        const dx = wx - startX, dy = wy - startY;
        preview = moveShape(s.shape, dx, dy);
      }
    }
    drawAll(preview);
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDown) return;
    isDown = false;

    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const [wx, wy] = screenToWorld(sx, sy);
    const tool = selectedToolRef.current;

    let newShape: Shape | null = null;

    if (tool === "rectangle") {
      newShape = { type: "rectangle", x: startX, y: startY, width: wx - startX, height: wy - startY };
    } else if (tool === "circle") {
      const radius = Math.max(Math.abs(wx - startX), Math.abs(wy - startY)) / 2;
      newShape = { type: "circle", x: startX, y: startY, radius };
    } else if (tool === "line") {
      newShape = { type: "line", x1: startX, y1: startY, x2: wx, y2: wy };
    } else if (tool === "select" && selectedId != null) {
      const idx = shapes.findIndex((s) => s.id === selectedId);
      if (idx >= 0) {
        const moved = moveShape(shapes[idx].shape, wx - startX, wy - startY);
        const id = shapes[idx].id;
        socket.send(JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ action: "update", id, shape: moved })
        }));
      }
      drawAll();
      return;
    }

    if (!newShape) {
      drawAll();
      return;
    }

    // Add locally right away
    const tempId = Date.now(); // temporary ID
    shapes.push({ id: tempId, shape: newShape });
    drawAll();

    if (tool === "pencil") {
      if (currentPoints.length < 2) return;
      const newShape: Shape = { type: "pencil", points: currentPoints };
      const tempId = -Date.now();
      shapes.push({ id: tempId, shape: newShape });
      drawAll();
      socket.send(JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify({ action: "create", shape: newShape })
      }));
      currentPoints = [];
      return;
    }
    

    // persist
    socket.send(JSON.stringify({
      type: "chat",
      roomId,
      message: JSON.stringify({ action: "create", shape: newShape })
    }));

    drawAll();
  };

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", () => { isDown = false; });

  // cleanup
  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mouseleave", () => { isDown = false; });
    // optional: null out socket.onmessage if this canvas goes away
  };

  // ---- local helpers
  function moveShape(s: Shape, dx: number, dy: number): Shape {
    if (s.type === "rectangle") return { ...s, x: s.x + dx, y: s.y + dy };
    if (s.type === "circle") return { ...s, x: s.x + dx, y: s.y + dy };
    if (s.type === "line") return { ...s, x1: s.x1 + dx, y1: s.y1 + dy, x2: s.x2 + dx, y2: s.y2 + dy };
    return s;
  }
}

// ------- IO helpers (id-aware)
async function getExistingShapes(roomId: string): Promise<ShapeWithId[]> {
  const res = await axios.get(`${HTTP_BACKEND}/api/v1/rooms/chats/${roomId}`);
  const messages: { id: number; message: string }[] = res.data.messages;
  return messages.map((m) => {
    const parsed = JSON.parse(m.message);
    return { id: m.id, shape: parsed.shape as Shape };
  });
}
