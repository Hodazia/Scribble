'use client'
import { motion } from "framer-motion";
import { Plus, Users2, Palette } from "lucide-react";

const steps = [
  {
    icon: Plus,
    title: "Create a Room",
    description: "Start a new collaborative workspace in seconds. No setup required, just click and create.",
    step: "01",
  },
  {
    icon: Users2,
    title: "Invite Your Team",
    description: "Share your room link or invite teammates directly. Control access and permissions easily.",
    step: "02",
  },
  {
    icon: Palette,
    title: "Start Drawing Together",
    description: "Collaborate in real-time. Draw, sketch, annotate, and brainstorm as one unified team.",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative z-10 py-24 text-indigo-200 ">
      <div className=" mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-extrabold">
              Simple as {" "}
              <span className="text-indigo-400">1, 2, 3</span>
            </h2>
            <p className="mt-4 text-lg lg:text-2xl text-indigo-200
             max-w-2xl mx-auto">
              Get started in minutes. No complex setup, no learning curve. 
              Just pure collaboration.
            </p>
          </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                className="relative group"
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-indigo-400/30 to-transparent z-0" />
                )}
                
                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full text-white font-bold text-xl mb-6 shadow-lg transition-all duration-300 bg-indigo-700/60 ring-1 ring-indigo-400/30">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 border border-white/10 bg-white/5 group-hover:border-white/20 transition-all duration-300"
                  >
                    <step.icon className="w-8 h-8 text-cyan-300" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-semibold mb-4 text-indigo-300">{step.title}</h3>
                  <p className="text-indigo-200 leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Call to Action */}
            <div className="mt-16 flex justify-center">
              <div className="inline-flex items-center gap-3 text-sm lg:text-base text-indigo-200">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                Ready in under 30 minutes
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;