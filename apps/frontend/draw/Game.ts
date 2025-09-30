import axios from "axios";
import { Shape } from "./type";
import { Tool } from "./type";
import { HTTP_BACKEND } from "@/config";


export async function initDraw(canvas:HTMLCanvasElement,selectedTool:Tool,roomId:string)
{
    const ctx = canvas.getContext('2d');
    // let existingShapes : Shape[] = [];
    let existingShapes: Shape[] = await getExistingShapes(roomId)

        if(!ctx)
        {
          return
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

          startX = e.clientX;
          startY = e.clientY;
          clicked = true;
        })

        canvas.addEventListener("mousemove", (e)=> {
            if(clicked)
            {
            const newx = e.clientX - startX;
            const newy = e.clientY - startY;

            //   ctx.clearRect(0, 0, canvas.width, canvas.height);
            clearCanvas(existingShapes,ctx,canvas);
            if(selectedTool=='rectangle')
            {
                ctx.strokeRect(startX,startY,newx,newy);
            }
            else if(selectedTool=='circle')
            {
                // ctx.strokeStyle = '#a12c21';
            const radius = Math.sqrt(newx*newx + newy*newy);
            ctx.beginPath();
            ctx.arc(startX, startY,radius, 0, Math.PI * 2);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
            }
            
            }
          

        })

        canvas.addEventListener("mouseup", (e) => {
            clicked = false
          const newx = e.clientX - startX;
          const newy = e.clientY - startY;

          if(selectedTool=="rectangle")
          {
            existingShapes.push({
                type:"rectangle",
                x:startX,
                y:startY,
                width:newx,
                height:newy
              })
          }
          else if(selectedTool=="circle")
          {
            const radius = Math.sqrt(newx * newx + newy * newy);
            
            existingShapes.push({
                type:"circle",
                x:startX,
                y:startY,
                radius:radius,
              })
          }

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
ctx.fillRect(0,0,canvas.height,canvas.width);
existingShapes.map((shape) => {
    if(shape.type=="rectangle")
    {
        ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        ctx.strokeStyle = "blue"
    }
    else if(shape.type=="circle")
    {
        //draw an arc , calculate the radius
        // (x,y) -> (xn,yn), optional

        // const radius = Math.sqrt(
        //     Math.pow(shape.x - shape.startPos.x, 2) + Math.pow(y - startPos.y, 2)
        //     );

        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "red";
        // ctx.fillStyle = "blue"; // set fill color
        // ctx.fill(); // ✅ fills the circle
        ctx.lineWidth = 2;
        ctx.stroke();
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
        return parsedmessage;
    })
    //
    return shapes;

}