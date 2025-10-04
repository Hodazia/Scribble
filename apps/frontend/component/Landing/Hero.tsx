'use client'
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
// import heroImage from "@/assets/hero-canvas.jpg";
import landing from "@/public/assets/landing.png"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Hero = () => {
  const router = useRouter();
  return (
  <section className="relative min-h-screen w-full flex flex-col 
  items-center justify-center overflow-hidden text-white">
      {/* Grid-like background */}
      <div className="absolute inset-0 opacity-10" />

      {/* Content Container */}
      <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col items-center text-center space-y-10">
        
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight ${playfair.className}`}
        >
          Collaborate <span className="text-indigo-400">Visually.</span>
          <br /> Create Together.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed"
        >
          A real-time collaborative canvas for teams to sketch, ideate, chat and design together — anywhere.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl text-lg font-semibold"
            onClick={() => router.push("/signin")}
          >
            Start Drawing
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            className="group border border-indigo-400/40 text-indigo-200 hover:bg-indigo-600 hover:text-white px-8 py-6 rounded-xl text-lg font-semibold"
            onClick={() => router.push("/signup")}
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Try Live Demo
          </Button>
        </motion.div>

        {/* Collaboration Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-slate-400 text-sm mt-2"
        >
          🚀 Instant collaboration
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3 }}
          className="relative mt-10 w-full 
           rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.25)]
            border border-white/10"
        >
          <Image
            src={landing}
            alt="CollabCanvas collaborative whiteboard in action"
            className="w-full h-auto object-cover rounded-2xl"
            priority
          />

          {/* Floating badges */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 text-white text-sm px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            3 users online
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md border border-white/10 text-white text-sm px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            Live cursors
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;