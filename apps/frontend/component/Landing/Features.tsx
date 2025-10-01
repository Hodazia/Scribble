'use client'
import { motion } from "framer-motion";
import { Brush, Users, Lock, Cloud, MessageCircle, History } from "lucide-react";

const features = [
  {
    icon: Brush,
    title: "Real-time Collaboration",
    description: "See every stroke as it happens. Watch ideas come to life together with seamless real-time synchronization.",
  },
  {
    icon: MessageCircle,
    title: "Live Presence & Chat", 
    description: "Communicate while creating. See who's online, chat in real-time, and collaborate naturally.",
  },
  {
    icon: Lock,
    title: "Private Workspaces",
    description: "Secure rooms with access control. Keep your team's work private and invite only who you trust.",
  },
  {
    icon: Cloud,
    title: "Cloud Save & Export",
    description: "Never lose your work. Auto-save to the cloud and export in multiple formats for easy sharing.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Organize your teams, manage permissions, and collaborate across departments seamlessly.",
  },
  {
    icon: History,
    title: "Version History",
    description: "Track changes over time. Revert to previous versions and see how your ideas evolved.",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-xl bg-fuchsia-500/10" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full blur-2xl bg-cyan-400/10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-indigo-100">
            Everything you need to{" "}
            <span className="">
              collaborate
            </span>
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Powerful features designed for modern teams. From real-time drawing to secure collaboration, 
            we've got everything covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <div className="rounded-2xl p-8 h-full bg-white/5 border border-white/10 shadow-[0_0_24px_rgba(2,132,199,0.15)] hover:shadow-[0_0_28px_rgba(236,72,153,0.25)] transition-all duration-300">
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4
                   ">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl text-indigo-400 mb-3">{feature.title}</h3>
                  <p className="text-indigo-200 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;