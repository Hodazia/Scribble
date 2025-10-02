"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HTTP_BACKEND } from "@/config"
import { Inter } from "next/font/google";


const inter = Inter({
  subsets: ["latin"], 
  weight: ["400"], // Optional: pick the weights you need
  display: "swap",
});

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isSignin ? "/login" : "/register";
    const body = isSignin
      ? { email, password }
      : { email, password, name };

    console.log(`Sending request to ${HTTP_BACKEND}/api/v1${endpoint}:`, body);

    try {
      const response = await fetch(`${HTTP_BACKEND}/api/v1${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${isSignin ? "sign in" : "sign up"}`);
      }

      const data = await response.json();

      if (isSignin) {
        localStorage.setItem("token", data.token);
        router.push("/create");
      } else {
        router.push("/signin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen ">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl
       shadow-2xl p-8 w-full max-w-sm">
        <h2 className={`text-2xl font-bold text-center text-indigo-300 mb-6 ${inter.className}`}>
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {!isSignin && (
          <div className="p-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full outline-none bg-white text-black placeholder:text-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}
        <div className="p-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none bg-white text-black placeholder:text-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="p-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none bg-white text-black placeholder:text-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 bg-blue-500 text-white py-3 
          rounded-3xl hover:bg-blue-600 
          bg-indigo-600 hover:bg-indigo-700
          transition disabled:opacity-50"
        >
          {loading ? "Loading..." : isSignin ? "Sign In" : "Sign Up"}
        </button>
        <p className="text-center mt-4 text-white">
          {isSignin ? "New user?" : "Already have an account?"}{" "}
          <Link
            href={isSignin ? "/auth/signup" : "/auth/signin"}
            className="text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            {isSignin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}