import React, { useEffect, useState } from 'react';
import ChatbotIcon from '../../components/Common/ChatbotIcon';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { flagBotMessage } from '../../redux/services/chatBot';
import { useDispatch } from 'react-redux';
import FeedbackModal from '../../components/FeedbackModal';

function ChatMessage({ chat, project_id }) {
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('Copy');
  const [feedbackModal, setFeedbackModal] = React.useState(false);

  const handleThumbClick = (type) => {
    if (feedback === type) return;
    if (type === 'up') {
      setFeedback(type);
      dispatch(
        flagBotMessage({
          formData: {
            project_id: project_id,
            uuid: chat?.text?.chat_entry_uuid || 0,
            flagging: type === 'up' ? 1 : 0
          }
        })
      );
    } else {
      setFeedbackModal(true);
    }
  };

  const handleCopy = () => {
    if (chat?.role === 'model' && chat?.text?.answer) {
      const textArea = document.createElement('textarea');
      textArea.value = chat?.text?.answer;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTooltipMessage('Copied!');

        setTimeout(() => {
          setIsCopied(false);
          setTooltipMessage('Copy');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text using execCommand: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      <div
        className={`mb-0 message ${
          chat?.role === 'model' ? 'bot' : 'user'
        }-message`}
      >
        {chat?.role === 'model' && <ChatbotIcon />}
        <span className="message-text">
          {chat?.role === 'model' ? chat?.text.answer : chat.text}
        </span>
      </div>

      {chat?.role === 'model' && (
        <div
          style={{ display: 'flex', gap: 0, paddingLeft: 50, marginTop: -4 }}
        >
          <Tooltip title="This answer worked for me" arrow placement="bottom">
            <IconButton
              onClick={() => handleThumbClick('up')}
              size="small"
              sx={{ color: feedback === 'up' ? '#198754' : 'default' }}
            >
              {feedback === 'up' ? (
                <ThumbUpIcon sx={{ fontSize: '15px' }} />
              ) : (
                <ThumbUpOffAltIcon sx={{ fontSize: '15px' }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip
            title="This answer didn't solve my problem"
            arrow
            placement="bottom"
          >
            <IconButton
              onClick={() => handleThumbClick('down')}
              size="small"
              sx={{ color: feedback === 'down' ? '#fc5a69' : 'default' }}
            >
              {feedback === 'down' ? (
                <ThumbDownIcon sx={{ fontSize: '15px' }} />
              ) : (
                <ThumbDownOffAltIcon sx={{ fontSize: '15px' }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title={tooltipMessage} arrow placement="bottom">
            <IconButton onClick={handleCopy}>
              {isCopied ? (
                <CheckIcon sx={{ fontSize: '15px', color: '#198754' }} />
              ) : (
                <ContentCopyIcon sx={{ fontSize: '15px' }} />
              )}
            </IconButton>
          </Tooltip>
        </div>
      )}
      {feedbackModal && (
        <FeedbackModal
          onClose={() => setFeedbackModal(false)}
          open={feedbackModal}
          setFeedback={setFeedback}
          chat={chat}
          project_id={project_id}
        />
      )}
    </>
  );
}
export default ChatMessage;
