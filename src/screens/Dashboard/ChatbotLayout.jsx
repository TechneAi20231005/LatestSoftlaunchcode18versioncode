import React, { useState } from 'react';
import { MessageCircle, Settings, Archive, Star } from 'lucide-react';
import Sidebar from './sidebar';
import ChatPanel from './ChatPanel';
import './ChatbotLayout.scss';

const hardcodedProjects = [
  {
    id: '1',
    name: 'E-commerce Platform',
    lastMessage: 'How can I improve the checkout process?',
    timestamp: '2 min ago',
    icon: MessageCircle
  },
  {
    id: '2',
    name: 'Personal Portfolio',
    lastMessage: 'What colors should I use for my portfolio?',
    timestamp: '1 hour ago',
    icon: Star
  },
  {
    id: '3',
    name: 'Task Management App',
    lastMessage: 'Help me design the dashboard layout',
    timestamp: '3 hours ago',
    icon: Settings
  },
  {
    id: '4',
    name: 'Blog Website',
    lastMessage: 'Can you suggest a content structure?',
    timestamp: '1 day ago',
    icon: Archive
  }
];

const hardcodedMessages = {
  1: [
    {
      id: '1',
      type: 'user',
      content:
        'I need help designing an e-commerce platform. What are the key components I should focus on?',
      timestamp: '10:30 AM'
    },
    {
      id: '2',
      type: 'bot',
      content:
        'For an e-commerce platform, focus on these key components: 1) User-friendly navigation and search, 2) Secure payment processing, 3) Product catalog with detailed descriptions, 4) Shopping cart and checkout process, 5) User account management, 6) Order tracking system. Would you like me to elaborate on any of these?',
      timestamp: '10:31 AM'
    },
    {
      id: '3',
      type: 'user',
      content: 'How can I improve the checkout process?',
      timestamp: '10:45 AM'
    },
    {
      id: '4',
      type: 'bot',
      content:
        'To improve the checkout process: 1) Minimize steps (aim for 2-3 steps max), 2) Offer guest checkout option, 3) Display security badges and SSL certificates, 4) Show clear pricing breakdown, 5) Provide multiple payment options, 6) Include progress indicators, 7) Auto-fill shipping information when possible. Consider implementing one-click checkout for returning customers!',
      timestamp: '10:46 AM'
    }
  ],
  2: [
    {
      id: '1',
      type: 'user',
      content:
        "I'm building a personal portfolio website. What sections should I include?",
      timestamp: '9:15 AM'
    },
    {
      id: '2',
      type: 'bot',
      content:
        'A great portfolio should include: 1) Hero section with your name and tagline, 2) About me section, 3) Skills and expertise, 4) Project showcase with case studies, 5) Contact information, 6) Optional: Blog/articles, testimonials, resume download. Keep it clean and focused on your best work!',
      timestamp: '9:16 AM'
    },
    {
      id: '3',
      type: 'user',
      content: 'What colors should I use for my portfolio?',
      timestamp: '9:30 AM'
    }
  ],
  3: [
    {
      id: '1',
      type: 'user',
      content:
        "I'm creating a task management application. What features are essential?",
      timestamp: '8:00 AM'
    },
    {
      id: '2',
      type: 'bot',
      content:
        'Essential features for a task management app: 1) Task creation and editing, 2) Priority levels and due dates, 3) Categories/tags for organization, 4) Progress tracking, 5) Search and filtering, 6) User collaboration features, 7) Notifications and reminders, 8) Dashboard with overview. Start with core features and expand gradually!',
      timestamp: '8:01 AM'
    },
    {
      id: '3',
      type: 'user',
      content: 'Help me design the dashboard layout',
      timestamp: '8:15 AM'
    }
  ],
  4: [
    {
      id: '1',
      type: 'user',
      content:
        'I want to create a blog website. What should be the main focus?',
      timestamp: 'Yesterday'
    },
    {
      id: '2',
      type: 'bot',
      content:
        'For a successful blog website, focus on: 1) Clean, readable design, 2) Easy navigation and search, 3) Content categorization, 4) SEO optimization, 5) Social sharing buttons, 6) Comment system, 7) About page and author bio, 8) Newsletter subscription. Content quality and consistency are key!',
      timestamp: 'Yesterday'
    },
    {
      id: '3',
      type: 'user',
      content: 'Can you suggest a content structure?',
      timestamp: 'Yesterday'
    }
  ]
};

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProjectClick = (project) => {
    setActiveProject(project);
    setMessages(hardcodedMessages[project.id] || []);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputMessage('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content:
            "Thanks for your message! I'm here to help you with your project. Could you provide more details about what you'd like to accomplish?",
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        projects={hardcodedProjects}
        activeProject={activeProject}
        onProjectClick={handleProjectClick}
      />
      <ChatPanel
        sidebarOpen={sidebarOpen}
        onSidebarToggle={toggleSidebar}
        activeProject={activeProject}
        messages={messages}
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default Index;
