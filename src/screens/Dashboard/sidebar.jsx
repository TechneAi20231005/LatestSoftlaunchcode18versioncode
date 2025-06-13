import React from 'react';
import { Bot, X, Menu } from 'lucide-react';

const Sidebar = ({
  isOpen,
  onToggle,
  projects,
  activeProject,
  onProjectClick
}) => {
  return (
    <div
      className={`chatbot-sidebar ${
        isOpen ? 'chatbot-sidebar-open' : 'chatbot-sidebar-closed'
      }`}
    >
      <div className="chatbot-sidebar-header">
        <div className="chatbot-sidebar-title">
          <Bot className="chatbot-sidebar-logo" />
          <span>AI Assistant</span>
        </div>
        <button className="chatbot-sidebar-toggle" onClick={onToggle}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="chatbot-sidebar-content">
          <div className="chatbot-projects-section">
            <h3>Recent Projects</h3>
            <div className="chatbot-projects-list">
              {projects.map((project) => {
                const IconComponent = project.icon;
                return (
                  <div
                    key={project.id}
                    className={`chatbot-project-item ${
                      activeProject?.id === project.id ? 'active' : ''
                    }`}
                    onClick={() => onProjectClick(project)}
                  >
                    <div className="chatbot-project-icon">
                      <IconComponent />
                    </div>
                    <div className="chatbot-project-details">
                      <div className="chatbot-project-name">{project.name}</div>
                      <div className="chatbot-project-last-message">
                        {project.lastMessage}
                      </div>
                      <div className="chatbot-project-timestamp">
                        {project.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
