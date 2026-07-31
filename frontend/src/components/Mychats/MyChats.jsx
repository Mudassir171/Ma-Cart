import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

const MyChats = () => {
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([
    { sender: 'seller', text: 'Hello! How can I help you with this product?' },
    { sender: 'user', text: 'Hi, is this available in a larger size?' }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([...messages, { sender: 'user', text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-emerald-900 text-white p-4 rounded-t-2xl flex items-center gap-3 shadow-md">
        <ChatIcon />
        <h1 className="text-lg font-bold">My Chats & Support</h1>
      </div>

      <div className="bg-white border border-emerald-100 rounded-b-2xl shadow-sm h-[450px] flex flex-col justify-between p-4">
        {/* Messages Container */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center text-sm mt-20">
              No conversations found. Start chatting with a seller!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-800 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-700 transition"
          />
          <button 
            type="submit" 
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <span>Send</span>
            <SendIcon sx={{ fontSize: "16px" }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyChats;