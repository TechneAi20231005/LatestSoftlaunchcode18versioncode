import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.scss';
import ChatbotIcon from '../../components/Common/ChatbotIcon';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import ChatIcon from '@mui/icons-material/Chat';
import { useSelector } from 'react-redux';
import { _base, project_id } from '../../settings/constants';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useLocation, useNavigate } from 'react-router-dom';
function ChatBot() {
  // const [chatHistory, setChatHistory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
  const shouldHideChatbot = pathSegments?.includes('ChatApp');
  const chatHistory =
    useSelector((state) => state?.chatBotSlice?.chatHistory) || [];

  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  useEffect(() => {
    chatBodyRef?.current?.scrollTo({
      top: chatBodyRef?.current?.scrollHeight,
      behavior: 'smooth'
    });
  }, [chatHistory]);
  let userName = localStorage.getItem('first_name') || 'Friend';

  if (shouldHideChatbot) {
    return null;
  }
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
      <div className="chatbot-popup">
        {/* chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text mb-0">Connect AI</h2>
          </div>

          <div className="header-actions">
            <IconButton
              title="redirect to full screen chat"
              onClick={() => {
                setShowChatbot(false);
                navigate(`${_base}/ChatApp`);
              }}
            >
              <FullscreenIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => setShowChatbot((prev) => !prev)}>
              <KeyboardArrowDownIcon fontSize="large" />
            </IconButton>
          </div>
        </div>

        {/* chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div
            style={{ animationDelay: '0.9s' }}
            className="message bot-message"
          >
            <ChatbotIcon />
            <span className="message-text">
              Hey There {userName} 🤚 <br /> How can I help you today?
            </span>
          </div>
          {chatHistory?.map((chat, index) => (
            <ChatMessage key={index} chat={chat} project_id={project_id} />
          ))}
        </div>
        {/* chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} project_id={project_id} />
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
