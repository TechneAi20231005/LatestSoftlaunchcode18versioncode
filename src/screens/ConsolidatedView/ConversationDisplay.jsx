import { Stack, Tooltip, Zoom, Grow, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconButton } from '@mui/material';
import DemoProfileImg from '../../assets/images/profile_av.png';
import SVGComponentChatBot from '../../components/custom/ChatBotSvg';

const ConversationDisplay = ({
  data,
  setFeedback,
  isConfirmed,
  setIsConfirmed,
  scrollToTextarea
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  let mappedData = data?.flagging?.[0];
  let conversation = data;

  const handleConfirm = () => {
    if (mappedData?.remarks) {
      setIsConfirmed(true);
      setFeedback(mappedData?.remarks);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
      scrollToTextarea?.();
    }
  };

  return (
    <section className="conversation-section">
      <h2>Interaction Details</h2>

      {/* Issue Information Box */}
      <div className="issue-info-box">
        <div className="issue-header">
          <h3>Issue Information</h3>
          <div className="timestamp">
            {(() => {
              const date = new Date(data?.timestamp);
              return isNaN(date.getTime())
                ? new Date().toLocaleString()
                : date.toLocaleString();
            })()}
          </div>
        </div>

        <div className="issue-badge">
          <span className="badge-label">Issue Type:</span>
          <span className="badge-value">{mappedData?.type}</span>
        </div>

        <div className="customer-remark">
          <span className="remark-label">Remark:</span>
          <span className="remark-text">{mappedData?.remarks}</span>
          <Tooltip
            componentsProps={{
              tooltip: {
                sx: {
                  width: 'fit-content'
                }
              }
            }}
            arrow
            placement="top"
            title={
              isConfirmed
                ? 'Approval confirmed!'
                : 'Click to confirm your approval and apply the update.'
            }
          >
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <IconButton
                onClick={handleConfirm}
                disabled={isConfirmed}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: !isConfirmed ? 'scale(1.1)' : 'none'
                  }
                }}
              >
                <CheckCircleIcon
                  sx={{
                    color: isConfirmed ? 'green' : 'gray',
                    transition: 'all 0.3s ease',
                    fontSize: isConfirmed ? '1.8rem' : '1.5rem'
                  }}
                />
              </IconButton>

              {/* Confirmation animation */}
              {showConfirmation && (
                <Grow in={showConfirmation}>
                  <div
                    style={{
                      position: 'absolute',
                      top: -30,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'green',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Approved!
                  </div>
                </Grow>
              )}
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Conversation Messages Box */}
      <div className="conversation-box">
        <div className="conversation-header">
          <h3>Conversation Messages</h3>
        </div>

        <div className="conversation-flow">
          <Stack gap={1} className="customer-message">
            <div className="message-header">
              <img
                className="avatars customer-avatar"
                src={DemoProfileImg}
                alt="User"
              />
              {/* <div className="avatar customer-avatar">U</div> */}
              <span className="sender-label">User</span>
            </div>
            <div className="message-content">
              {conversation?.question || ''}
            </div>
          </Stack>

          <Stack gap={1} className="bot-message">
            <div className="message-header">
              <div className="avatars bot-avatar">
                <SVGComponentChatBot />
              </div>
              <span className="sender-label">Connect Bot</span>
            </div>
            <div className="message-content">{conversation?.answer || ''}</div>
          </Stack>
        </div>
      </div>
    </section>
  );
};

export default ConversationDisplay;
