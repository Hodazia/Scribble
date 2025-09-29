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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Simple as{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              1, 2, 3
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes. No complex setup, no learning curve. Just pure collaboration.
          </p>
        </motion.div>

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
                  <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent z-0" />
                )}
                
                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full text-white font-bold text-xl mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-border rounded-xl mb-6 group-hover:border-primary/30 transition-all duration-300"
                  >
                    <step.icon className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Ready in under 30 seconds
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;