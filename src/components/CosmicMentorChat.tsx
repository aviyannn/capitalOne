import React, { useState } from "react";

type Message = { sender: "user" | "mentor"; text: string };

const mockResponses = [
  "Welcome to your Cosmic Mentor! 🚀",
  "You're 60% toward your RAV4 goal!",
  "Saving $10 more tomorrow will unlock a new celestial ring.",
];

const CosmicMentorChat: React.FC<{ mockData?: any }> = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "mentor", text: mockResponses[0] },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const idx = messages.length % mockResponses.length;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "mentor", text: mockResponses[idx] },
      ]);
    }, 600);
    setInput("");
  };

  return (
    <div className="fixed bottom-8 right-8 max-w-sm z-20">
      <div className="bg-black bg-opacity-80 rounded-2xl shadow-xl p-6">
        <h3 className="text-blue-300 font-bold mb-2">Cosmic Mentor Chat</h3>
        <div className="flex flex-col gap-2 mb-3 max-h-36 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${
                msg.sender === "mentor" ? "bg-indigo-800 text-white self-start" : "bg-indigo-500 text-white self-end"
              } px-4 py-2 rounded-2xl w-fit max-w-xs`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            className="flex-grow rounded-l-xl px-4 py-2 bg-slate-900 text-white focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your mentor anything..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="rounded-r-xl px-4 py-2 bg-indigo-700 text-white font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CosmicMentorChat;
