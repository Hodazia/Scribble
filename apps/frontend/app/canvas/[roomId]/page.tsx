
import RoomCanvas from "@/component/RoomCanvas";

// this is a server component and the RoomCanvas is a client component,
// canvas is white by default
/*
this component extracts the roomId from the params and passes it to the RoomCanvas
which again passes it to Canvas component
which is one using canvas API to render circles, rects and so on!
We did this because to extract the roomId is done in server components and the RoomCanvas are
classcomponents

*/
type Circle = {
    x: number;
    y: number;
    radius: number;
  };
  

export default async function CanvasPage({params} : {params: {roomId : string}})
{
    const roomId = (await params).roomId;
    console.log("The roomid is ", roomId);

    return <RoomCanvas  roomId={roomId}/>
}