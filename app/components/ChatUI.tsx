"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { filterMedicalResponse } from "../utils/filter";
import Image from "next/image";


const LiquidEther = dynamic(() => import("../utils/LiquidEther"), {
  ssr: false,
});


const acneInfo = `Test`;


export default function MedicalChatUI() {
  const [isTyping, setIsTyping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello User ! <br/><br/> I’m medirag, your AI medical assistant. <br/> How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://medirag-backend.onrender.com";

  const sendMessage = async () => {
    if(!input.trim()) return;

    const userMsg = {sender: "user", text: input};
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      
      const res = await fetch(`${BASE_URL}/input/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      const botReply = data?.answer || "⚠️ Sorry, no answer could be generated at this time.";
      setMessages((prev) => [...prev, { sender: "bot", text: filterMedicalResponse(botReply)}]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Server error. Please try again later." },
      ])
      console.error("Error fetching medical response:", error);
    }
    finally {
      setIsTyping(false);
    }
  };


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  const etherProps = useMemo(
    () => ({
      colors: ["#5227FF", "#FF9FFC", "#B19EEF"],
      mouseForce: 20,
      cursorSize: 100,
      isViscous: false,
      viscous: 30,
      iterationsViscous: 32,
      iterationsPoisson: 32,
      resolution: 0.5,
      isBounce: false,
      autoDemo: true,
      autoSpeed: 0.5,
      autoIntensity: 2.2,
      takeoverDuration: 0.25,
      autoResumeDelay: 3000,
      autoRampDuration: 0.6,
    }),
    []
  );

  return (
    <div className="relative flex flex-col h-[calc(100vh-4.3rem)] bg-gradient-to-br from-black to-teal-900 dark:from-white dark:to-teal-900 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LiquidEther {...etherProps} />
      </div>


      {/* Chat UI */}
      <div className="flex-1 overflow-y-auto pt-12 px-4 sm:px-8 md:px-16 lg:px-36 space-y-8 relative z-10">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] p-4 sm:p-5 rounded-3xl shadow-lg text-sm sm:text-base break-words prose prose-invert ${
                msg.sender === "user"
                  ? "text-white dark:text-black border bg-black/60 dark:bg-white/70 rounded-br-none"
                  : "text-white dark:text-black border bg-black/60 dark:bg-white/70 rounded-bl-none"
              }`}
            >
                {msg.sender === "bot" && idx > 0 && messages[idx - 1]?.sender === "user" && (
                  <div className="mt-3 mb-4 p-4 border border-white dark:border-black rounded-3xl rounded-bl-none">
                    <p className="text-sm text-teal-300 dark:text-teal-700">
                      <span className="font-semibold text-white dark:text-black mr-2 font-bold ">You :</span>
                      {messages[idx - 1].text.length <= 50
                        ? messages[idx - 1].text
                        : ". . . ?"}
                    </p>
                  </div>
                )}

              {msg.sender === "bot" ? (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              ) : (
                <p>{msg.text}</p>
              )}
              
              <div className="text-xs text-teal-400 dark:text-teal-700 mt-3 text-right">
              {currentTime}
            </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex ml-6 items-center px-6 py-3 rounded-3xl rounded-bl-none bg-black/50 dark:bg-white/70 border border-teal-400 dark:border-black shadow-lg">
              <div className="flex space-x-1 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-4 bg-teal-200 dark:bg-teal-800 rounded-sm"
                    style={{
                      animation: "pulse 0.6s ease-in-out infinite",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  ></span>
                ))}
              </div>
              <span className="ml-3 text-teal-400 dark:text-teal-700 text-sm tracking-wide italic">Typing...</span>
            </div>
          </div>
        )}


        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 px-6 sm:px-8 relative z-10">
        <div className="flex border border-gray-500 dark:border-black/20 items-center max-w-2xl mx-auto rounded-full shadow-inner px-8 py-2 hover:border hover:border-white">
          <input
            type="text"
            placeholder="How do you feel ?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) {
                  return;
                } else {
                  e.preventDefault();
                  sendMessage();
                }
              }
            }}
            className="flex-1 outline-none bg-transparent text-white pr-4"
          />
          <button
            onClick={sendMessage}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="font-bold border border-transparent text-white rounded-full p-2 transition"
          >
            <Image
              src={hovered ? "/send 1.png" : "/send.png"}
              alt="send"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
