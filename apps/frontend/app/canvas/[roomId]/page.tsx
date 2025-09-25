"use client"
import { initDraw } from "@/draw/Game";
import { useEffect, useRef, useState } from "react"

// canvas is white by default


export default function Canvas()
{
    // generic?? 
    const canvasref = useRef<HTMLCanvasElement>(null);

    // Track drawing state
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
        null
    );
    useEffect(()=>{
        console.log("Canvas ref is ", canvasref);
        console.log("Canvas current is ", canvasref.current);
        if(canvasref.current)
        {
            const canvas = canvasref.current;
            const ctx = canvas.getContext('2d')

            if(!ctx)
            {
                return
            }

            // ctx.strokeRect(10,20,100,200);
            // ✅ Function to handle click
            const handleClick = (e: MouseEvent) => {
                // Get bounding box of the canvas
                const rect = canvas.getBoundingClientRect();
        
                // Mouse X,Y relative to canvas (not screen)
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
        
                console.log("Mouse clicked at:", x, y);
        
                    // Draw a circle at the clicked position
                    ctx.beginPath();
                    ctx.arc(x, y, 30, 0, Math.PI * 2);
                    ctx.strokeStyle = "#ae2131";
                    ctx.stroke()
                };
            
            // ✅ Handle mouse down → start drawing
            const handleMouseDown = (e: MouseEvent) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setStartPos({ x, y });
                setIsDrawing(true);
            };
        
            // ✅ Handle mouse move → draw preview
            const handleMouseMove = (e: MouseEvent) => {
                if (!isDrawing || !startPos) return;
        
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
        
                const radius = Math.sqrt(
                Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
                );
        
                // Clear canvas and redraw shapes (for now only the preview circle)
                ctx.clearRect(0, 0, canvas.width, canvas.height);
        
                // Draw preview circle
                ctx.beginPath();
                ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.stroke();
            };
        
            // ✅ Handle mouse up → finalize circle
            const handleMouseUp = (e: MouseEvent) => {
                if (!isDrawing || !startPos) return;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
        
                const radius = Math.sqrt(
                Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
                );
        
                // Finalize circle
                ctx.beginPath();
                ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = "red";
                ctx.fillStyle = "blue"; // set fill color
                ctx.fill(); // ✅ fills the circle
                ctx.lineWidth = 2;
                ctx.stroke();
        
                setIsDrawing(false);
                setStartPos(null);
            };
        
            // Attach listeners
            canvas.addEventListener("mousedown", handleMouseDown);
            canvas.addEventListener("mousemove", handleMouseMove);
            canvas.addEventListener("mouseup", handleMouseUp);
        
         // ✅ Add event listener
        // canvas.addEventListener("click", handleClick);
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);
          };
        }
    },[isDrawing,startPos,canvasref])


    return (
        <>
        <div>
            <canvas ref={canvasref} width="1000" height="1000" 
            style={{ backgroundColor: 'white'}}></canvas>
        </div>
        </>

    )
}