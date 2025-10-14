import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";

export default function Chatbot() {
  const { accessToken } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, user: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/ai",
        { message: input },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      const aiMessage = { text: response.data.text, user: false };
setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = { text: "⚠️ Error: Could not get AI response", user: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed w-[1300px] ml-20 bg-gray-850 rounded-2xl shadow-2xl flex flex-col h-[590px] ">
      {/* Header */}
    
      <div className="bg-gray-850 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">💬 SpendFlow </h2>

      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-auto space-y-3 bg-gray-850 flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl break-words max-w-[60%] ${
              msg.user
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white self-end text-right"
                : "bg-gray-700 text-gray-100 self-start text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-gray-700 text-gray-300 p-2 rounded-xl animate-pulse max-w-[50%]">
            AI is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex p-3 w-[80%] items-center ml-30 justify-center rounded-b-2xl gap-2">
        <input
          className="flex-1 p-3 rounded-xl bg-gray-400 text-black font-sm placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
