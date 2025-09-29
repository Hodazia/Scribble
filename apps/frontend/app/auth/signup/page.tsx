'use client'

import React, { useRef, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, ArrowLeft, Eye, EyeOff, User, Lock} from "lucide-react";
// import { ThemeToggle } from "../components/ThemeToggle";
import { toast } from "sonner";


export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); // Clear previous errors
    
        try {
          const response = await axios.post(`${HTTP_BACKEND}/api/v1/register`, {
            email,
            password,
            name,
          });
    
          if (!response.data || !response.data.success) {
            throw new Error(response.data?.message || "Signup failed");
          }
          toast.success("Account created successfully! ");
    
          router.push("/auth/sign-in");
        } catch (error: any) {
          const errorMsg =
            error.response?.data?.message ||
            "Something went wrong. Please try again.";
    
          if (errorMsg.includes("already exists")) {
            setErrorMessage("An account with this email already exists.");
          } else {
            setErrorMessage(errorMsg);
          }
    
          toast.error("Error ")
        } finally {
          setLoading(false);
        }
      };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* <ThemeToggle /> */}
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-orange-600/20 rounded-full blur-3xl"></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent
         via-transparent to-orange-50/50"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back to home */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </motion.div>

          {/* Logo and title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r 
                from-orange-500 to-orange-600 rounded-full blur-xl
                opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r 
                from-orange-500 to-orange-600 p-3 rounded-full">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-700 mb-2">Join CardVault</h1>
            <p className="text-gray-700">Create your digital brain and start organizing your knowledge</p>
          </motion.div>

          {/* Signup form */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-900">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    className="w-full pl-10 pr-4 py-3 
                    text-black
                    bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Choose a name"
                    required
                    disabled={loading}
                    onChange={(e)=> setName(e.target.value)}
                  />
                </div>
              </div>

             
            {/* Username field */}
            <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-900">
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="email"
                    className="w-full pl-10 pr-4 py-3 bg-white 
                    border border-gray-300 rounded-lg focus:outline-none
                     focus:ring-2 focus:ring-orange-500 focus:border-transparent
                      transition-all text-black duration-200"
                    placeholder="Choose a email"
                    required
                    disabled={loading}
                    onChange={(e)=> setEmail(e.target.value)}
                  />
                </div>
              </div>


              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full pl-10 pr-12 py-3 bg-white border
                    text-black
                    border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Create a password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button 
                type="submit"
                disabled={loading} 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Sign in link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="text-orange-600 hover:text-orange-700 font-medium underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

