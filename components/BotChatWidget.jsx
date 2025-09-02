"use client";
import { useState } from "react";
import { Bot } from "lucide-react";
import GroqChatLLM from "./GroqChatLLM";

export default function BotChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button (always visible) */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center shadow-lg cursor-pointer hover:bg-purple-700 transition z-50"
      >
        <Bot className="text-white w-8 h-8" />
      </div>

      {/* Chat Window (appears above button) */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-5 w-[350px] h-[500px] rounded-xl shadow-xl border border-gray-700 
            bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col z-40"
        >
          {/* Header with close button */}
          <div className="p-3 border-b border-gray-600 text-white font-semibold flex justify-between items-center">
            <span>Groq Chat LLM</span>
            <button onClick={() => setIsOpen(false)} className="text-lg">
              ×
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-2">
            <GroqChatLLM />
          </div>
        </div>
      )}
    </>
  );
}
