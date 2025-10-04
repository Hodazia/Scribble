'use client'
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";


import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const CallToAction = () => {
  const router = useRouter();
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-fuchsia-500/10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-2xl bg-cyan-400/10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 text-white/80" />
          </motion.div>
          
          <h2 className={`text-4xl lg:text-6xl font-extrabold 
          text-white mb-6 drop-shadow-[0_0_30px_rgba(168,85,247,0.25)] ${playfair.className}`}>
            Ready to draw together?
          </h2>
          
          <p className="text-xl lg:text-2xl text-indigo-200 mb-12 leading-relaxed">
            Join thousands of teams already collaborating visually. 
            Start creating together in under 30 seconds.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button 
              variant="default" 
              size="lg"
              className="text-white shadow-[0_0_24px_rgba(34,211,238,0.25)] 
              bg-indigo-600 text-white hover:bg-white hover:text-indigo-600
              group"
              onClick={()=>{
                router.push("/signin")
              }}
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;