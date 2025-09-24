import axios from "axios"
import { BACKEND_URL } from "../app/config"
import { Button } from "@repo/ui/button";


async function getChats(roomId:string)
{
    const response = await axios.get(`${BACKEND_URL}/chats/:${roomId}`);
    return response.data.message
}

export function ChatRoom({id}:{
    id:string
})
{

}