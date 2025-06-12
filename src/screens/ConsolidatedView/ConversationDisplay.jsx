import { Stack } from '@mui/material';
import React from 'react';

const ConversationDisplay = ({ data }) => {
  return (
    <section className="conversation-section">
      <h2>Interaction Details</h2>

      {/* Issue Information Box */}
      <div className="issue-info-box">
        <div className="issue-header">
          <h3>Issue Information</h3>
          <div className="timestamp">
            {new Date(data.timestamp).toLocaleString()}
          </div>
        </div>

        <div className="issue-badge">
          <span className="badge-label">Issue Type:</span>
          <span className="badge-value">{data.issueType}</span>
        </div>

        <div className="customer-remark">
          <span className="remark-label">Customer Remark:</span>
          <span className="remark-text">{data.customerRemark}</span>
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
              <div className="avatar customer-avatar">U</div>
              <span className="sender-label">User</span>
            </div>
            <div className="message-content">{data.customerQuestion}</div>
          </Stack>

          <Stack gap={1} className="bot-message">
            <div className="message-header">
              <div className="avatar bot-avatar">🤖</div>
              <span className="sender-label">Support Bot</span>
            </div>
            <div className="message-content">{data.botResponse}</div>
          </Stack>
        </div>
      </div>
    </section>
  );
};

export default ConversationDisplay;
