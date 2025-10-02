"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { useState } from "react";

interface RoomCardProps {
  roomId: number; // Add roomId prop
  slug: string;
  adminName: string;
}

export function RoomCard({ roomId, slug, adminName }: RoomCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // Redirect directly to /canvas/[roomId]
    router.push(`/canvas/${roomId}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white backdrop-blur-md 
      hover:shadow-indigo-500/30 
      transition duration-300
      hover:-translate-y-1 
      hover:scale-[1.02]
      text-indigo-600 p-4 rounded-2xl shadow-md
      border border-indigo-300 border-2 cursor-pointer"
      onClick={handleJoin}
    >
      <div className="flex items-center gap-3">
        <FaUsers className="text-indigo-700" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-indigo-500">{slug}</h3>
          <p className="text-gray-400 text-sm">Created by: {adminName}</p>
          {loading && <p className="text-indigo-400 text-sm">Loading...</p>}
        </div>
      </div>
    </motion.div>
  );
}