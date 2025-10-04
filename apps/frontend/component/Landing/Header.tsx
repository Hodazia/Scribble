// 

'use client'

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Palette, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Compact + float the header when scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Wrapper that morphs to a floating rounded container on scroll */}
      <div
        className={[
          "transition-all duration-500 mx-auto",
          scrolled ? "max-w-6xl px-3 pt-3" : "max-w-none px-0 pt-0",
        ].join(" ")}
      >
        <div
          className={[
            "container mx-auto",
            "transition-all duration-500",
            scrolled
              ? // FLOATING BAR (same colors, just chrome)
                "rounded-2xl border border-white/10 p-1 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
              : // EDGE-TO-EDGE (initial)
                "border-transparent bg-black border-white/10 border rounded-2xl"
          ].join(" ")}
        >
          <div
            className={[
              "flex items-center justify-between",
              "transition-[height,padding] duration-500",
              scrolled ? "h-14 px-4" : "h-16 px-4"
            ].join(" ")}
          >
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white">
                <Palette className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                Scribble
              </span>
            </motion.button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>

            {/* Desktop CTAs (same colors) */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                className="bg-indigo-700 text-white hover:bg-white hover:text-indigo-700 rounded-lg shadow-md border border-white/10"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </Button>
              <Button
                className="bg-indigo-700 text-white hover:bg-white hover:text-indigo-700 rounded-lg shadow-md"
                onClick={() => router.push("/signup")}
              >
                Get Started Free
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="lg:hidden p-2 text-slate-200 hover:text-white"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile sheet (inherits the same dark palette) */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={[
                "lg:hidden transition-all duration-300 overflow-hidden",
                scrolled
                  ? "rounded-b-2xl border-t border-white/10 bg-black/60 backdrop-blur-xl"
                  : "border-t border-white/10 bg-black/40 backdrop-blur-xl"
              ].join(" ")}
            >
              <nav className="py-4 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-slate-300 hover:text-white transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="px-4 pt-4 space-y-2">
                  <Button
                    className="w-full bg-indigo-700 text-white hover:bg-white hover:text-indigo-700 rounded-lg border border-white/10"
                    onClick={() => router.push("/auth/signin")}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-indigo-700 text-white hover:bg-white hover:text-indigo-700 rounded-lg"
                    onClick={() => router.push("/auth/signup")}
                  >
                    Get Started Free
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
