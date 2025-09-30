import axios from "axios";
import { Shape } from "./type";
import { Tool } from "./type";
import { HTTP_BACKEND } from "@/config";
// import getExistingShapes from "./httpfetch";

export async function initDraw(canvas:HTMLCanvasElement,selectedTool:Tool,roomId:string,socket:WebSocket)
{
    const ctx = canvas.getContext('2d');
    // let existingShapes : Shape[] = [];
    const shapes = await getExistingShapes(roomId)
    console.log("The shapes i get from the be is ", shapes);
    let existingShapes: Shape[]  = shapes;

        if(!ctx)
        {
          return
        }

        socket.onmessage = (event) => {
          console.log("The event data from the socket client ", event.data);
          const message = JSON.parse(event.data);
  
          if (message.type == "chat") {
              const parsedShape = JSON.parse(message.message)
              existingShapes.push(parsedShape.shape)
              clearCanvas(existingShapes, ctx, canvas);
          }
      }

        // ctx?.strokeRect(10,10,100,100);
        // ctx?.strokeRect(30,40,130,140);
        // ctx.fillStyle =  'rgba(255,0,3,0.5)';
        //let's run a loop and create a rectangle

        //creating random rects
        // for (var i = 0; i < 3; i++) {
        //   var x = Math.random() * canvasRef.current.width;
        //   var y = Math.random() * canvasRef.current.height;
        //   ctx.strokeRect(x, y, x+50,y+50);
        //   ctx.strokeStyle = "#ae2131";
        // }

        clearCanvas(existingShapes,ctx,canvas);
        let startX = 0;
        let startY = 0;
        let clicked = false;

        canvas.addEventListener("mousedown", (e) => {
          console.log(e.clientX);
          console.log(e.clientY);

          const rect = canvas.getBoundingClientRect();
          startX = e.clientX - rect.left;
          startY = e.clientY - rect.top;
          clicked = true;
        })

        canvas.addEventListener("mousemove", (e)=> {
            if(clicked)
            {
              const rect = canvas.getBoundingClientRect();
              const currentX = e.clientX - rect.left;
              const currentY = e.clientY - rect.top;
              const width = currentX - startX;
              const height = currentY - startY;
              // ctx.clearRect(0, 0, canvas.width, canvas.height);
              // ctx.fillStyle = "rgba(0, 0, 0)"
              // ctx.fillRect(0, 0, canvas.width, canvas.height);
              clearCanvas(existingShapes, ctx, canvas);
              ctx.strokeStyle = "rgba(255, 255, 255)"
              ctx.strokeRect(startX, startY, width, height);
            }
          

        })

        canvas.addEventListener("mouseup", (e) => {
            clicked = false
            const rect = canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;
            const width = endX - startX;
            const height = endY - startY;
          const shape: Shape = {
            type: "rectangle",
            x: startX,
            y: startY,
            height:height,
            width:width
        }
        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId
        }))

        //   ctx.clearRect(0, 0, canvas.width, canvas.height);
        //   ctx.strokeRect(startX,startY,newx,newy);
        //   ctx.strokeStyle = '#a12c21';

          //only at mouseup u should send the message else no!
          
        })
      
}

function clearCanvas(existingShapes:Shape[],ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement)
{
// clear the canvas and render all the exising shapes
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle = 'rgba(0,0,0)'
ctx.fillRect(0,0,canvas.width,canvas.height);
existingShapes.map((shape) => {
  if (shape.type === "rectangle") {
      ctx.strokeStyle = "rgba(255, 255, 255)"
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  }
})
}

async function getExistingShapes(roomId:string)
{
    // in a particular room what are the chats or shapes available
    // returns an array of chats or shapes
    const res = await axios.get(`${HTTP_BACKEND}/api/v1/rooms/chats/${roomId}`);
    const message = await res.data.messages;

    const shapes = message.map((x:{message:string}) =>{
        const parsedmessage = JSON.parse(x.message)
        console.log("parsed message contains ", parsedmessage);
        return parsedmessage.shape;
    })
    //
    return shapes;

}