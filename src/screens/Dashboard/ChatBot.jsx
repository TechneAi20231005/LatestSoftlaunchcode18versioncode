import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.scss';
import ChatbotIcon from '../../components/Common/ChatbotIcon';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ChatIcon from '@mui/icons-material/Chat';
import ChatbotTypingDots from './ChatbotTypingDots';
function ChatBot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  useEffect(() => {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [chatHistory]);
  return (
    <div className={`containers ${showChatbot ? 'show-chatbot' : ''}`}>
      <IconButton
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span>
          <ChatIcon />
        </span>
      </IconButton>
      {/* <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button> */}
      <div className="chatbot-popup">
        {/* chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text mb-0">Connect AI</h2>
          </div>

          <IconButton onClick={() => setShowChatbot((prev) => !prev)}>
            <span>
              <KeyboardArrowDownIcon fontSize="large" />
            </span>
          </IconButton>

          {/* <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button> */}
        </div>
        {/* chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <span className="message-text">
              Hey There 🤚 <br /> How can I help you today?
            </span>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* chatbot loader */}
        {/* <div className="text-primary">
          hello doits

        </div> */}
        {/* chatbot Footer */}
        <div className="chat-footer">
          <ChatForm setChatHistory={setChatHistory} chatHistory={chatHistory} />
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
