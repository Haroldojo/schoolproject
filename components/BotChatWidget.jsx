"use client";
import { useState } from "react";
import { Bot } from "lucide-react";
import GroqChatLLM from "./GroqChatLLM";

export default function BotChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center shadow-lg cursor-pointer hover:bg-purple-700 transition"
        >
          <Bot className="text-white w-8 h-8" />
        </div>

        {isOpen && (
          <div
            className="fixed bottom-16 right-5 w-[350px] h-[500px] rounded-xl shadow-xl border border-gray-700 
                bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col"
            style={{ zIndex: 1000 }}
          >
            {/* Header (optional, stays fixed at top of box) */}
            <div className="p-3 border-b border-gray-600 text-white font-semibold flex justify-between items-center">
              <span>Groq Chat LLM</span>
              <button onClick={() => setIsOpen(false)} className="text-sm">
                ×
              </button>
            </div>

            {/* Messages (only this should scroll) */}
            <div className="flex-1 overflow-y-auto p-2">
              <GroqChatLLM />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
