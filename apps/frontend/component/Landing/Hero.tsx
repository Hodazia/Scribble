'use client'
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
// import heroImage from "@/assets/hero-canvas.jpg";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full flex
     items-center justify-center overflow-hidden">
      {/* Background Elements */}

      
      <div className="container mx-auto px-4 relative z-10" >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h1
              className={`text-5xl lg:text-7xl font-extrabold text-indigo-100 tracking-tight ${playfair.className}`}>
                Collaborate{" "}
                <span className="">
                  Visually.
                </span>
                <br />
                Create Together.
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl">
                A real-time collaborative canvas for teams to sketch, ideate, and design together — anywhere.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="group  
              bg-indigo-700 text-white hover:bg-white
              hover:text-indigo-600">
                Start Drawing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button className="group 
              bg-indigo-700 text-white hover:bg-white
              hover:text-indigo-600 border border-white/10">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Try Live Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-8 justify-center 
              lg:justify-start text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                🚀 Instant collaboration
              </span>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(2,132,199,0.15)] ring-1 ring-white/10 hover:ring-white/20 transition-all duration-500">
              {/* <Image
                src={""}
                alt="CollabCanvas collaborative whiteboard in action"
                className="w-full h-auto"
                width={100}
                height={100}
              /> */}
              
              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [-5, 5, -5]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-4 right-4 bg-black/40 text-white backdrop-blur-sm rounded-lg p-3 shadow-[0_0_20px_rgba(168,85,247,0.25)] border border-white/10"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  3 users online
                </div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [10, -10, 10],
                  x: [-5, 5, -5]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute bottom-4 left-4 bg-black/40 text-white backdrop-blur-sm rounded-lg p-3 shadow-[0_0_20px_rgba(59,130,246,0.25)] border border-white/10"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  Live cursors
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;