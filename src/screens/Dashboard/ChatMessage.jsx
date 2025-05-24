import React from 'react';
import ChatbotIcon from '../../components/Common/ChatbotIcon';

function ChatMessage({ chat }) {
  return (
    <div
      className={`mb-0 message ${
        chat.role === 'model' ? 'bot' : 'user'
      }-message`}
    >
      {chat.role === 'model' && <ChatbotIcon />}
      <span className="message-text ">{chat.text}</span>
    </div>
  );
}

export default ChatMessage;
