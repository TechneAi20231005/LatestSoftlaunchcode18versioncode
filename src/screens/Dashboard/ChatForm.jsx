import React, { useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import { Tooltip } from '@mui/material';

function ChatForm({ setChatHistory }) {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState('');
  const [showSend, setShowSend] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSend(e.target.value.trim() !== '');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = '';
    setChatHistory((history) => [
      ...history,
      { role: 'user', text: userMessage }
    ]);
    setInputValue('');
    setShowSend(false);
    setTimeout(() => {
      setChatHistory((history) => [
        ...history,
        { role: 'model', text: 'Thinking' }
      ]);
    }, 600);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        value={inputValue}
        onChange={handleInputChange}
        required
      />
       <Tooltip placement='top' title={showSend ? "Send" : "Voice Input"} arrow>
      <IconButton>
        {showSend ? <SendIcon fontSize='small'/> : <MicIcon  fontSize='medium'/>}
      </IconButton>
      </Tooltip>
    </form>
  );
}

export default ChatForm;
