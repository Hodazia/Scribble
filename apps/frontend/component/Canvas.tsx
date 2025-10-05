'use client'

import { useState,useEffect,useRef } from "react"
import { initDraw } from "@/draw/Game";
import { Tool } from "@/draw/type";
import { Pencil,Clipboard, Minus, Circle,Eraser,MousePointer,Hand,RectangleHorizontal} from "lucide-react";
// import { WS_BACKEND } from "@/config";

export default function Canvas({roomId,socket}: {roomId: string,socket:WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>('rectangle')
    const selectedColorRef = useRef<string>("#ffffff"); // default color white
    // const [socket,setsocket] = useState<WebSocket | null>(null)

      // This ref is read by the drawing engine, so we don't have to re-init
    const toolRef = useRef<Tool>("rectangle");
    useEffect(() => {
        toolRef.current = selectedTool;
    }, [selectedTool]);

    useEffect(() => {
        const handleResize = () => {
          if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            initDraw(canvasRef.current, toolRef, selectedColorRef,  roomId, socket);
          }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, [roomId, socket]);

      
    useEffect(() => {
      if(canvasRef.current)
      {
       initDraw(canvasRef.current,toolRef,selectedColorRef,roomId,socket)
      }
        
    }, [canvasRef,roomId,socket])

    if(!socket)
    {
        return <div>Connecting to server</div>
    }

    return <div>
      <canvas
      ref={canvasRef}
      width={window.innerWidth} 
      height={window.innerHeight}
      style={{ backgroundColor: '#111',
        cursor: selectedTool === "hand" ? "grab" : "crosshair",
      }}
        className="fixed top-0 left-0 w-full h-full"
      />
      <div className="absolute flex m-2 top-1/40 left-1/3 gap-1 border-1 border-gray-400 rounded-2xl p-2 text-white">
        <button 
            onClick={() => setSelectedTool("hand")}
            className={selectedTool === "hand" ? "bg-zinc-600 text-red-400 p-2 rounded-xl cursor-pointer" : "hover:bg-zinc-600 p-2 rounded-xl cursor-pointer"}
        >
            <Hand />
        </button>
        <button 
            onClick={() => setSelectedTool("select")}
            className={selectedTool === "select" ? "bg-zinc-600 text-red-400 p-2 rounded-xl cursor-pointer" : "hover:bg-zinc-600 p-2 rounded-xl cursor-pointer"}
        >
            <MousePointer/>
        </button>
        <button 
            onClick={() => setSelectedTool("eraser")}
            className={selectedTool === "eraser" ? "bg-zinc-600 text-red-400 p-2 rounded-xl cursor-pointer" : "hover:bg-zinc-600 p-2 rounded-xl cursor-pointer"}
        >
            <Eraser />
        </button>
        <button 
            onClick={() => setSelectedTool("rectangle")}
            className={selectedTool === "rectangle" ? "bg-zinc-600 text-red-400 p-2 rounded-xl cursor-pointer" : "hover:bg-zinc-600 p-2 rounded-xl cursor-pointer"}
        >
            <RectangleHorizontal />
        </button>
        <button 
            onClick={() => setSelectedTool("circle")}
            className={selectedTool === "circle" ? "bg-zinc-600 text-red-400 p-2 rounded-xl cursor-pointer" : "hover:bg-zinc-600 p-2 rounded-xl cursor-pointer"}
        >
            <Circle />
        </button>
        <button 
            onClick={() => setSelectedTool("line")}
            className={selectedTool === "line" ? "bg-zinc-600 text-red-400 p-2 rounded-xl cursor-pointer" : "hover:bg-zinc-600 p-2 rounded-xl cursor-pointer"}
        >
            <Minus />
        </button>
        <button
        onClick={() => setSelectedTool("pencil")}
        className={selectedTool === "pencil" ? "bg-zinc-600 text-red-400 p-2 rounded-xl" : "hover:bg-zinc-600 p-2 rounded-xl"}
        >
        <Pencil /> {/* or any freehand icon */}
        </button>

        {/* <button
        onClick={() => setSelectedTool("text")}
        className={selectedTool === "text" ? "bg-zinc-600 text-red-400 p-2 rounded-xl" : "hover:bg-zinc-600 p-2 rounded-xl"}
        >
        <TypeOutline />
        </button> */}
        <button
        onClick={() => setSelectedTool("paste")}
        className={selectedTool === "paste" ? "bg-zinc-600 text-red-400 p-2 rounded-xl" : "hover:bg-zinc-600 p-2 rounded-xl"}
        >
        <Clipboard />
        </button>
        {/* Color Picker */}
        <input
          type="color"
          defaultValue={selectedColorRef.current}
          onChange={(e) => (selectedColorRef.current = e.target.value)}
          className="w-8 h-8 border-0 rounded cursor-pointer ml-2"
        />
    </div>
    </div>
}