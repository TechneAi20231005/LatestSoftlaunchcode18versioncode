import React, { useState } from 'react';
import './ChatBot.scss';
import ChatbotIcon from '../../components/Common/ChatbotIcon';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';
function ChatBot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  return (
    <div className={`containers ${showChatbot ? 'show-chatbot' : ''}`}>
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        {/* chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>

          <button className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>
        {/* chatbot Body */}
        <div className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey There 🤚 <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        {/* chatbot Footer */}
        <div className="chat-footer">
          <ChatForm setChatHistory={setChatHistory} />
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
