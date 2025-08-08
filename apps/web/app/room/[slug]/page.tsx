import axios from "axios";
import { BACKEND_URL } from "../../config";

// slug is like this it is a name of the room, not the roomid
//  of the localhost:3000/room/72gfksbvk
// so take that slug anc there is an API, give it to that, and it returns
// the room based on the slug
async function getRoom(slug:string)
{
   const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
   // return the response and its id,
   return response.data.Id

}

export default function ChatRoom({
    params
}:{
    params:{
        slug:string
    }
}){
    const slug = params.slug;
     
}