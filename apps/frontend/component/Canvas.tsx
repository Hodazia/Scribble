'use client'

import { useState,useEffect,useRef } from "react"
import { initDraw } from "@/draw/Game";
import { Tool } from "@/draw/type";
import { Pencil,PenIcon, Circle,Eraser,MousePointer,Hand,RectangleHorizontal } from "lucide-react";
import { WS_BACKEND } from "@/config";

export default function Canvas({roomId,socket}: {roomId: string,socket:WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>('rectangle')
    // const [socket,setsocket] = useState<WebSocket | null>(null)

    useEffect(() => {
      if(canvasRef.current)
      {
       initDraw(canvasRef.current,selectedTool,roomId,socket)
      }
        
    }, [canvasRef,selectedTool])

    if(!socket)
    {
        return <div>Connecting to server</div>
    }

    return <div>
      <canvas
      ref={canvasRef}
      width={1200} height={1200}
      style={{ backgroundColor: 'black'}}/>
      <div className="absolute flex m-2 top-0 left-1/4 gap-1 border-1 border-gray-400 rounded-2xl p-2 text-white">
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
            <PenIcon />
        </button>
    </div>
    </div>
}