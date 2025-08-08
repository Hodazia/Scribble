// export??

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}


export function initDraw(canvas:HTMLCanvasElement)
{

    const context = canvas.getContext('2d');
    let existingshapes:Shape [] = [];
    console.log("Context is ", context);
    if(!context)
    {
        return
    }
    let clicked =false;
            let startX=0;
            let startY=0;

            context.fillStyle = 'rgba(0,0,0)';
            context.fillRect(0,0,canvas.height,canvas.width);
            canvas.addEventListener("mousedown",(e) => {
                clicked=true;
                startX = e.clientX;
                startY = e.clientY;
            })

            canvas.addEventListener("mouseup",(e) => {
                clicked=false;
                const width = e.clientX - startX;
                const height = e.clientY - startY;
                existingshapes.push({
                    type: "rect",
                    x: startX,
                    y: startY,
                    width: width,
                    height: height
                })
            })

            canvas.addEventListener("mousemove",(e) => {
                if(clicked)
                {
                    const width = e.clientX - startX;
                    const height = e.clientY - startY;
                    clearCanvas(existingshapes,context,canvas)
                    context.strokeRect(startX,startY,width,height);
                    context.strokeStyle = "green"

                }
                console.log(e.clientX);
                console.log(e.clientY);
            })

            
            //context.fillRect(10,20,100,200);
            //context.strokeRect(10,10,100,100);

            //context.strokeStyle = 'green'
}

function clearCanvas(existingshapes:Shape[],context:CanvasRenderingContext2D,canvas:HTMLCanvasElement)
{

    // to clear the canvas and render all the previous shapes too,

    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "rgba(0,0,0)";
    context.fillRect(0,0,canvas.width,canvas.height);

    // only show the previous rectangle at the moment for now, 
    existingshapes.map((shape)=> {
        if(shape.type=="rect")
        {
            context.strokeStyle = "rgba(255,255,255)";
            context.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }
    }
)
}