import React, { useState } from 'react';
import '../ConsolidatedView/CustomerFeedback.scss';
import ConversationDisplay from './ConversationDisplay';
import { Container } from '@mui/material';

const CustomerFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sample conversation data
  const conversationData = {
    customerQuestion: 'What are your store hours during the holidays?',
    botResponse:
      "Our store hours during the holiday season are Monday-Saturday 9 AM to 10 PM, and Sunday 10 AM to 8 PM. Please note that we may have special hours on Christmas Eve and New Year's Eve.",
    issueType: 'Incorrect Information',
    customerRemark:
      'The bot provided outdated hours. Our actual holiday hours are different and were updated last week.',
    timestamp: '2024-06-12 14:30:25'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      setIsSubmitted(true);
      console.log('Feedback submitted:', {
        conversation: conversationData,
        reviewerFeedback: feedback,
        submittedAt: new Date().toISOString()
      });
    }
  };

  const handleReset = () => {
    setFeedback('');
    setIsSubmitted(false);
  };

  return (
    <Container maxWidth="md">
      <div className="feedback-container">
        <header className="feedback-header">
          <h1>Feedback Review</h1>
        </header>

        <main className="feedback-main">
          <ConversationDisplay data={conversationData} />

          <section className="feedback-form-section">
            <h2>Reviewer Feedback</h2>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-group">
                  <label htmlFor="reviewer-feedback" className="form-label">
                    Your Assessment and Recommendations
                  </label>
                  <p className="form-instructions">
                    Please evaluate the bot's response and provide suggestions
                    for improvement. Consider accuracy, helpfulness, tone, and
                    completeness.
                  </p>
                  <textarea
                    id="reviewer-feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback here..."
                    className="feedback-textarea"
                    rows={6}
                    required
                    aria-describedby="feedback-help"
                  />
                  <small id="feedback-help" className="form-help">
                    Minimum 10 characters required
                  </small>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={feedback.trim().length < 10}
                  >
                    Submit Feedback
                  </button>
                  <button
                    type="button"
                    className="reset-btn"
                    onClick={handleReset}
                  >
                    Clear
                  </button>
                </div>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Feedback Submitted Successfully</h3>
                <p>
                  Thank you for your review. Your feedback will help improve our
                  customer service.
                </p>
                <button onClick={handleReset} className="new-review-btn">
                  Review Another Interaction
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </Container>
  );
};

export default CustomerFeedback;
