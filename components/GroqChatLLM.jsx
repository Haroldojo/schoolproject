"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader, MessageSquare } from "lucide-react";

export default function GroqChatLLM() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/groqChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling Groq API:", error);
      const errorMessage = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message}.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-[400px] max-h-[600px] w-full max-w-md bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Groq Chat LLM</h1>
            <p className="text-xs text-gray-300">Powered by Llama 3.1 70B</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 text-sm"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-300">
            <MessageSquare className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
            <p>Ask me anything and I'll help you out!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[70%] p-4 rounded-2xl break-words whitespace-pre-wrap text-sm ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-white/10 backdrop-blur-lg text-gray-100 border border-white/20"
              }`}
            >
              {message.content}
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20">
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-gray-300 text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/20 bg-white/5 backdrop-blur-lg p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 min-w-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none max-h-28 min-h-[3rem]"
              rows={1}
              style={{ height: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-400 text-center">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
