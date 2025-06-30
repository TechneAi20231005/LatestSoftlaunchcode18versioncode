import React, { useState, useEffect, useRef } from 'react';
import '../ConsolidatedView/CustomerFeedback.scss';
import ConversationDisplay from './ConversationDisplay';
import { Container, CircularProgress, Backdrop } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  reviewerNotificationListByChatId,
  submitFeedback
} from '../../redux/services/chatBot/';
import { _base } from '../../settings/constants.js';

const CustomerFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const reviewerNotification = useSelector(
    (state) =>
      state?.chatBotSlice?.reviewerNotificationListByChatId
        ?.flagged_entries?.[0] || []
  );
  const isLoading = useSelector(
    (state) => state?.chatBotSlice.isLoading.reviewerNotificationListByChatId
  );
  const dispatch = useDispatch();
  const textareaRef = useRef(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const chat_id = searchParams.get('chat_id');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = {
      project_id: id,
      chat_entry_uuid: chat_id,
      user_name: localStorage.getItem('first_name') || 'Friend',
      user_id: localStorage.getItem('id') || 0,
      updates: feedback
    };
    if (feedback?.trim()) {
      dispatch(
        submitFeedback({
          formData,
          onSuccessHandler: () => {
            setIsSubmitted(true);
            setIsConfirmed(false);
            navigate(`/${_base}/ReviewerNotificationList`);
          },
          onErrorHandler: () => {
            setIsConfirmed(false);
            setIsSubmitted(false);
          }
        })
      );
    }
  };

  const handleReset = () => {
    setFeedback('');
    setIsSubmitted(false);
    setIsConfirmed(false);
  };

  useEffect(() => {
    dispatch(
      reviewerNotificationListByChatId({ project_id: id, chat_id: chat_id })
    );
  }, [searchParams]);

  const scrollToTextarea = () => {
    if (textareaRef?.current) {
      textareaRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      textareaRef?.current?.focus();
      textareaRef?.current?.classList.add('highlight-textarea');

      setTimeout(() => {
        textareaRef?.current?.classList.remove('highlight-textarea');
      }, 1500);
    }
  };

  return (
    <div className="feedback-container">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <header className="feedback-header">
        <h1>Feedback Review</h1>
      </header>

      <main className="feedback-main">
        <ConversationDisplay
          data={reviewerNotification}
          setFeedback={setFeedback}
          isConfirmed={isConfirmed}
          setIsConfirmed={setIsConfirmed}
          scrollToTextarea={scrollToTextarea}
        />

        <section className="feedback-form-section">
          <h2>Reviewer Feedback</h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label
                  htmlFor="reviewer-feedback"
                  style={{ fontWeight: 600, fontSize: '0.9rem' }}
                  className="form-label"
                >
                  Your Assessment and Recommendations
                </label>
                <p className="form-instructions">
                  Please evaluate the Connect bot's response and provide
                  suggestions for improvement. Consider accuracy, helpfulness,
                  tone, and completeness.
                </p>
                <textarea
                  id="reviewer-feedback"
                  ref={textareaRef}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback here..."
                  className="feedback-textarea"
                  rows={5}
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
                  disabled={feedback?.trim().length < 10}
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
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CustomerFeedback;
