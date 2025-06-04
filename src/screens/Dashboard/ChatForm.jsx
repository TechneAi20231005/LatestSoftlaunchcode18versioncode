import React, { useRef, useState, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { postBotMessages } from '../../redux/services/chatBot';
import {
  addMessageToHistory,
  removeLastMessage
} from '../../redux/slices/chatBotSlice';
import ChatbotTypingDots from './ChatbotTypingDots';
import StopCircleIcon from '@mui/icons-material/StopCircle';
function ChatForm({ chatHistory }) {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const postBotDispatchRef = useRef(null);

  const { chatBotList, isLoading } = useSelector(
    (state) => state?.chatBotSlice
  );

  // console.log(chatBotList, 'chatBotList');
  const [inputValue, setInputValue] = useState('');
  const [showSend, setShowSend] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [tempTranscript, setTempTranscript] = useState('');
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);
  const manuallyStopped = useRef(false); // Track if stopped by user

  useEffect(() => {
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setRecognizing(true);
      setAwaitingConfirmation(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Speech recognized:', transcript);
      setTempTranscript((prev) =>
        prev ? `${prev} ${transcript}` : transcript
      );
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setRecognizing(false);

      // Auto-restart unless user stopped it manually
      if (!manuallyStopped.current) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const handleInputChange = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    const value = textarea.value;
    setInputValue(value);
    setShowSend(value.trim() !== '');
  };
  const [responseCounter, setResponseCounter] = useState(0);
  const abortControllerRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // setChatHistory((history) => [
    //   ...history,
    //   { role: 'user', text: userMessage }
    // ]);
    dispatch(addMessageToHistory({ role: 'user', text: userMessage }));
    setInputValue('');
    setShowSend(false);
    if (inputRef.current) inputRef.current.style.height = '47px';
    const controller = new AbortController();
    abortControllerRef.current = controller;

    dispatch(
      postBotMessages({
        formData: {
          project_id: '683d3fca862043edcb8ebe1d',
          question: userMessage,
          user_id: localStorage.getItem('id'),
          user_name: localStorage.getItem('first_name') || 'Friend',
          flagging: 1
        },
        signal: controller.signal
      })
    );

    // dispatch(
    //   postBotMessages({
    //     formData: {
    //       project_id: '683012a557b73eedd3b7a0d5',
    //       question: userMessage,
    //       user_id: localStorage.getItem('id'),
    //       user_name: localStorage.getItem('first_name') || 'Friend',
    //       flagging: 1
    //     }
    //   })
    // );
    // setTimeout(() => {
    //   setChatHistory((history) => [
    //     ...history,
    //     { role: 'model', text: 'Thinking' }
    //   ]);
    // }, 600);
  };

  // console.log(chatBotList, 'chatBotList');

  // useEffect(() => {
  //   if (chatBotList?.answer) {
  //     setChatHistory((history) => [
  //       ...history,
  //       { role: 'model', text: chatBotList }
  //     ]);
  //   }

  //   // setChatHistory((history) => [
  //   //   ...history,
  //   //   { role: 'model', text: 'Error occurred while sending message' }
  //   // ]);
  // }, [chatBotList]);

  const resizeTextarea = () => {
    const el = inputRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  };

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (recognizing) {
      manuallyStopped.current = true;
      recognition.stop();
    } else {
      manuallyStopped.current = false;
      setTempTranscript('');
      recognition.start();
    }
  };

  const handleAcceptSpeech = () => {
    console.log('Accepting speech:', tempTranscript);
    setInputValue(tempTranscript);
    setShowSend(tempTranscript.trim() !== '');
    setTempTranscript('');
    setAwaitingConfirmation(false);
    manuallyStopped.current = true;
    recognitionRef.current?.stop();
    setTimeout(() => resizeTextarea(), 0);
  };

  const handleRejectSpeech = () => {
    setTempTranscript('');
    setAwaitingConfirmation(false);
    setRecognizing(false);
    manuallyStopped.current = true;
    recognitionRef.current?.stop();
  };
  const handleStopMessage = () => {
    abortControllerRef.current?.abort();

    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage?.role === 'user') {
      dispatch(removeLastMessage());
    }
  };

  return (
    <>
      {isLoading?.chatBotList && <ChatbotTypingDots />}

      <form
        className="chat-form"
        onSubmit={handleFormSubmit}
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <textarea
          ref={inputRef}
          placeholder="Message..."
          className="message-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleFormSubmit(e);
            }
          }}
          rows={1}
          style={{
            width: '100%',
            maxHeight: '120px',
            resize: 'none',
            overflowY: 'auto',
            paddingTop: '13px',
            fontSize: '0.95rem',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            lineHeight: '1.4'
          }}
        />
        {
          isLoading?.chatBotList ? (
            <Tooltip placement="top" title="Stop Message" arrow>
              <IconButton type="submit" onClick={handleStopMessage}>
                <StopCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : showSend ? (
            <Tooltip placement="top" title="Send Message" arrow>
              <IconButton type="submit">
                <SendIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null
          // <Tooltip placement="top" title="Voice Input" arrow>
          //   <IconButton
          //     sx={{ display: recognizing ? 'none' : 'block' }}
          //     type="button"
          //     onClick={handleMicClick}
          //   >
          //     <MicIcon
          //       fontSize="small"
          //       color={recognizing ? 'primary' : 'inherit'}
          //     />
          //   </IconButton>
          // </Tooltip>
        }

        {awaitingConfirmation && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#f5f5f5',
              padding: '6px 12px',
              borderRadius: '10px',
              maxWidth: '80%',
              overflowWrap: 'break-word',
              minHeight: '40px'
            }}
          >
            {recognizing && (
              <div
                // className="frequency-bars"
                style={{ display: 'flex', gap: 2 }}
              >
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div
                    key={i}
                    className="bar"
                    style={{
                      width: 3,
                      height: 13,
                      background: '#1976d2',
                      animation: `pulseBar 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
            <Tooltip placement="top" title="Confirm" arrow>
              <IconButton onClick={handleAcceptSpeech}>
                <CheckIcon color="success" fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip placement="top" title="Cancel" arrow>
              <IconButton onClick={handleRejectSpeech}>
                <CloseIcon color="error" fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </form>
    </>
  );
}

export default ChatForm;
