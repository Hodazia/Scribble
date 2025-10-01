'use client'
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Palette, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();


  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b "
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white">
              <Palette className="w-5 h-5 " />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">Scribble</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ y: -2 }}
                className="text-slate-300 hover:text-white transition-colors font-medium hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.45)]"
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button className="bg-indigo-700 text-white hover:bg-white
            hover:text-indigo-600 rounded-lg shadow-md
            border border-white/10"
            onClick={() => router.push("/auth/signin")}
            >
              Sign In
            </Button>
            <Button className="
             bg-indigo-700 text-white hover:bg-white rounded-lg
            hover:text-indigo-600 shadow-md"
            onClick={() => router.push("/auth/signup")}
            >
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-200 hover:text-white"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl"
          >
            <nav className="py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-slate-300
                   hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4 pt-4 space-y-2">
                <Button variant="ghost" className="w-full
                bg-indigo-700 text-white hover:bg-white
                hover:text-indigo-600"
                onClick={() => router.push("/auth/signin")}>
                  Sign In
                </Button>
                <Button variant="default" className="w-full 
                bg-indigo-700 text-white hover:bg-white
                hover:text-indigo-600
                "
                onClick={() => router.push("/auth/signup")}>
                  Get Started Free
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;