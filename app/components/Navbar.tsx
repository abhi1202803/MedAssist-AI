"use client";
import { useTheme } from "../providers/ThemeProvider";
import { Stethoscope, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full bg-gradient-to-br from-black to-teal-800 dark:from-teal-700 dark:to-white shadow-lg sticky top-0 z-50 border-b border-teal-900 dark:border-teal-100 transition-colors duration-500">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 relative">
        
        {/* Left Spacer (for balance) */}
        <div className="w-10 sm:w-16" />

        {/* Center Logo */}
        <motion.div
          whileHover={{
            scale: 1.05,
            color: "#5eead4",
            textShadow: "0 0 12px #5eead4",
          }}
          transition={{ duration: 0.3 }}
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center cursor-pointer"
        >
          <Stethoscope className="w-7 h-7 sm:w-9 sm:h-9 mr-2 text-teal-400 dark:text-black" />
          <h1 className="text-lg sm:text-xl font-semibold text-teal-400 dark:text-black">
            medirag
          </h1>
        </motion.div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full transition"
          >
            {theme === "dark" ? (
              <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-black hover:text-teal-500" />
            ) : (
              <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-teal-500" />
            )}
          </button>

          <a
            href="https://github.com/abhi1202803/MedAssist-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white dark:text-black hover:text-teal-500 dark:hover:text-teal-500 transition"
          >
            <FaGithub className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>
        </div>
      </div>
    </nav>
  );
}
