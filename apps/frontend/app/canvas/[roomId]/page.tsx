"use client"
import { initDraw } from "@/draw/Game";
import { useEffect, useRef } from "react"

// canvas is white by default


export default function Canvas()
{
    // generic?? 
    const canvasref = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        console.log("Canvas ref is ", canvasref);
        console.log("Canvas current is ", canvasref.current);
        if(canvasref.current)
        {
            initDraw(canvasref.current);
        }

    },[canvasref])
    return (
        <>
        <div>
            <canvas ref={canvasref} width={1000} height={1000}></canvas>
        </div>
        </>

    )
}