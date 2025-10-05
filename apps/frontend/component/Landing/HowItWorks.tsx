'use client'
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const features = [
  {
    id: "smart-selection",
    title: "Room selection",
    description: "Once signed in, you will either see a list of rooms to join or you can create your own room!",
    image: "/assets/feat1.png",
  },
  {
    id: "full-customisation",
    title: "The Canvas",
    description: "Once selected the room, create shapes ,draw smoothly on the canvas.",
    image: "/assets/feat2.png",
  },
  {
    id: "brandthetics-clips",
    title: "Collaborative chat",
    description: "You can share which room you are in with your friends and invite them into your room, and not only draw but also chat together!",
    image: "/assets/feat3.png",
  },
  {
    id: "upload-clips",
    title: "Start using Scribble now!",
    description: "Add as many team members, create collab draw chat together!",
    image: "/assets/feat4.png",
  },
];

const HowItWorks = () => {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const router = useRouter();

  return (
    <section className="relative z-10 py-24 text-indigo-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
            How it{" "}
            <span className="text-indigo-400">Works</span>
          </h2>
          <p className="text-lg lg:text-xl text-indigo-200 max-w-3xl mx-auto">
            Powerful features designed for modern teams. From real-time drawing to secure collaboration, 
            we've got everything covered.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Feature Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {features.map((feature) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                whileHover={{ y: -2 }}
                className={`p-6 rounded-xl text-left transition-all duration-300 ${
                  activeFeature === feature.id
                    ? "bg-indigo-700/60 border-2 border-indigo-400/50 shadow-lg"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-indigo-200 leading-relaxed">
                  {feature.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Feature Preview */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 rounded-2xl p-8 border border-white/10"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Image Preview */}
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden bg-black/20">
                  <Image
                    src={features.find(f => f.id === activeFeature)?.image || "/assets/feat1.png"}
                    alt={features.find(f => f.id === activeFeature)?.title || "Feature preview"}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-black/40 text-white backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/10"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live preview
                  </div>
                </motion.div>
              </div>

              {/* Feature Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    {features.find(f => f.id === activeFeature)?.title}
                  </h3>
                  <p className="text-lg text-indigo-200 leading-relaxed">
                    {features.find(f => f.id === activeFeature)?.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors shadow-lg"
                    onClick={()=>{ router.push("/signin")}}
                  >
                    Try it now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Learn more
                  </motion.button>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3 text-sm text-indigo-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Ready to use in under 30 seconds</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;