

// this is a server component and the RoomCanvas is a client component,
// canvas is white by default

import Canvas from "@/component/Canvas";
import { RoomCanvas } from "@/component/RoomCanvas";

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
  
/*

it has to be authenticated so that only authenticated user can enter this page,
like canvas/123 , roomId is an integer, it is a id autoincrement
not a slug!

*/

export default async function CanvasPage({
  params,
}: {params: Promise<{roomId: string}>})
{
  const { roomId } = await params;
  console.log("Rendering canvas for roomId:", roomId); // Debug log
  

    return <div>
      <RoomCanvas roomId={roomId}/>
    </div>
}