import React from 'react';
import { Menu, Bot, User, Send } from 'lucide-react';

const ChatPanel = ({
  sidebarOpen,
  onSidebarToggle,
  activeProject,
  messages,
  inputMessage,
  onInputChange,
  onSendMessage,
  onKeyPress
}) => {
  const showDefaultMessage = !activeProject || messages.length === 0;

  return (
    <div
      className={`chat-panel ${
        sidebarOpen ? 'chat-with-sidebar' : 'chat-full-width'
      }`}
    >
      <div className="chat-header">
        {!sidebarOpen && (
          <button className="mobile-sidebar-toggle" onClick={onSidebarToggle}>
            <Menu />
          </button>
        )}
        <div className="chat-title">
          <div className="project-info">
            <h2>{activeProject ? activeProject.name : 'AI Assistant'}</h2>
            <span className="project-status">
              {activeProject ? 'Active Project' : 'No Project Selected'}
            </span>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {showDefaultMessage ? (
          <div className="default-message">
            <div className="default-message-avatar">
              <Bot />
            </div>
            <div className="default-message-content">
              <div className="default-message-text">
                Welcome! Please select a project from the sidebar to start
                chatting, or feel free to ask me any questions about your
                current project.
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'user' ? <User /> : <Bot />}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message here..."
            className="chat-input"
          />
          <button
            onClick={onSendMessage}
            className="send-button"
            disabled={!inputMessage.trim()}
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
