import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const MyChats = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([
    { sender: 'seller', text: 'Hello! Welcome to MA-CART. How can I help you today?' },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    const userText = newMessage;
    // 1. User ka message UI par foran show kar dein
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setNewMessage("");
    setLoading(true);

    try {
      // 2. Apne backend API ko request bhejein (jahan Gemini AI configured hai)
      const { data } = await axios.post("/api/v1/chat", { message: userText });
      
      // 3. AI ka response UI par show kar dein
      const aiReply = data.reply || data.aiChat?.message || "I am here to help you with MA-CART!";
      setMessages((prev) => [...prev, { sender: 'seller', text: aiReply }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      // Agar backend ready nahi hai toh fallback ke tor par yeh message dikh jayega
      setMessages((prev) => [...prev, { sender: 'seller', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Popup Dialog Box */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-green-100 flex flex-col">
        
        {/* Header - Green Theme */}
        <div className="bg-green-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-green-700 p-2 rounded-xl">
              <ChatIcon sx={{ fontSize: "20px" }} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide">MA-CART AI Assistant</h2>
              <p className="text-[11px] text-green-200">Ask anything about products & orders</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-green-200 hover:text-white bg-green-900/40 hover:bg-green-900 p-2 rounded-xl transition cursor-pointer"
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </button>
        </div>

        {/* Chat Body - White Background */}
        <div className="p-4 sm:p-6 bg-white flex flex-col justify-between h-[400px]">
          {/* Messages Container */}
          <div className="overflow-y-auto flex-1 space-y-3 pr-2">
            {messages.length === 0 ? (
              <div className="text-gray-400 text-center text-sm mt-28">
                No conversations found. Start chatting!
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-green-700 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-400 px-4 py-2.5 rounded-2xl text-xs italic">
                  AI is typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-gray-100 mt-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask something about MA-CART..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-700 transition"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Sending..." : "Send"}</span>
              <SendIcon sx={{ fontSize: "16px" }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyChats;