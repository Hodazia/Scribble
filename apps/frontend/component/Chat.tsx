'use client'

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

interface ChatMessage {
  id: number;
  userId: string;
  content: string;
  createdAt?: string;
  user?: {
    name?: string;
    image?: string | null;
  };
}

interface ChatProps {
  roomId: string;
  socket: WebSocket;
}

export default function Chat({ roomId, socket }: ChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 🧠 Decode JWT to get current user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.id);
    } catch {
      console.warn("Invalid JWT token");
    }
  }, []);

  // 🧠 Fetch old messages via API
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await axios.get(`${HTTP_BACKEND}/api/v1/rooms/messages/${roomId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = res.data.messages.reverse();
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    })();
  }, [open, roomId]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🧠 WebSocket listener
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "user_chat") {
        // Ignore self echo
        if (msg.payload.userId !== currentUserId) {
          setMessages((prev) => [...prev, msg.payload]);
        }
      }
    };
    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, currentUserId]);

  // 🧠 Send new message
  const sendMessage = () => {
    if (!input.trim()) return;
    const messagePayload = {
      type: "user_chat",
      roomId,
      payload: { content: input.trim() },
    };
    socket.send(JSON.stringify(messagePayload));

    // Optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        userId: currentUserId || "me",
        content: input.trim(),
        createdAt: new Date().toISOString(),
        user: { name: "You" },
      },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 p-4 rounded-full text-white shadow-xl z-50 transition-all ${
          open ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"
        }`}
        title={open ? "Close Chat" : "Open Chat"}
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-zinc-900/95 backdrop-blur-lg text-white rounded-2xl shadow-lg flex flex-col z-50 border border-zinc-700 overflow-hidden">
          <div className="flex items-center justify-center py-3 border-b border-zinc-700 font-semibold text-lg bg-zinc-800">
            💬 Room Chat
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-80 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
            {messages.map((msg) => {
              const isMine = msg.userId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  {!isMine && (
                    <div className="flex-shrink-0 mr-2">
                      {msg.user?.image ? (
                        <img
                          src={msg.user.image}
                          alt={msg.user.name}
                          className="w-7 h-7 rounded-full border border-zinc-600"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold">
                          {msg.user?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-xl text-sm shadow-md ${
                      isMine
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-zinc-700 text-zinc-100 rounded-bl-none"
                    }`}
                  >
                    {!isMine && (
                      <div className="text-[11px] font-semibold text-indigo-300 mb-1">
                        {msg.user?.name || "Unknown"}
                      </div>
                    )}
                    <div>{msg.content}</div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div className="flex p-2 border-t border-zinc-700 bg-zinc-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-zinc-700 text-white px-3 py-2 text-sm rounded-l-lg outline-none placeholder-zinc-400"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 px-4 rounded-r-lg hover:bg-indigo-700 text-sm font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
