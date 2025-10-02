// 

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoomCard } from "@/component/RoomCard";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import { HTTP_BACKEND } from "../../config";

interface Room {
  id: number;
  slug: string;
  admin: { name: string };
}

export default function Create() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await fetch(`${HTTP_BACKEND}/api/v1/rooms/get-rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch rooms: ${response.statusText}`);
        }

        const data: Room[] = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [router]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setCreateError("No token found - please sign in again");
      setCreateLoading(false);
      return;
    }

    try {
      const response = await fetch(`${HTTP_BACKEND}/api/v1/rooms/create-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRoomName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create room");
      }

      const newRoom: Room = { id: data.roomId, slug: newRoomName, admin: { name: "You" } };
      setRooms([...rooms, newRoom]);

      setShowCreateModal(false);
      setNewRoomName("");
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-200">
        Loading rooms...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Rooms</h1>

        {/* Floating Action Buttons */}
        <div className="flex gap-4">
          {/* Create Room Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            title="Create new room"
            className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center 
              text-white shadow-md shadow-indigo-500/30 
              hover:bg-white hover:text-indigo-600 transition transform hover:scale-110"
          >
            <FaPlus size={20} />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center 
              text-white shadow-md shadow-red-500/30 
              hover:bg-white hover:text-red-600 transition transform hover:scale-110"
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </div>

      {/* Subheader */}
      <div className="text-center text-indigo-300 text-lg mb-6">
        Create or join the rooms!
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-sm border border-indigo-500/20">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4 text-center">
              Create a Room
            </h2>
            {createError && (
              <p className="text-red-400 mb-4 text-center">{createError}</p>
            )}
            <form onSubmit={handleCreateRoom}>
              <div className="mb-4">
                <label
                  className="block text-indigo-300 mb-2 font-medium"
                  htmlFor="roomName"
                >
                  Room Name
                </label>
                <input
                  type="text"
                  id="roomName"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-indigo-500/30 text-white rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg 
                    hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Handling */}
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {/* Empty State */}
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <p className="text-indigo-300 text-lg mb-4">
            No rooms yet — create one to start collaborating!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-indigo-600 rounded-lg text-white font-medium 
              hover:bg-indigo-700 transition shadow-md shadow-indigo-500/30"
          >
            Create Room
          </button>
        </div>
      ) : (
        <div
          className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 
          mt-6
          "
        >
          {rooms.map((room) => (
            <div
              key={room.id}
              className="
                bg-white/10 backdrop-blur-md 
                rounded-2xl p-4 shadow-md border border-white/10 
                hover:shadow-indigo-500/30 transition duration-300 
                hover:-translate-y-1 hover:scale-[1.02]
              "
            >
              <RoomCard
                roomId={room.id}
                slug={room.slug}
                adminName={room.admin.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
