import React, { act, useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllHistoryByProjectId,
  getAllProject,
  postBotMessages
} from '../redux/services/chatBot';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { _base } from '../settings/constants';
import { CircularProgress, IconButton, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import FeedbackModal from '../components/FeedbackModal';

function Chattile() {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const abortControllerRef = useRef(null);
  const [txtMessage, setTxtMessage] = useState('');
  const [activeTab, setActiveTab] = useState(1);
  const { getAllProject: chatProjects, isLoading } = useSelector(
    (state) => state?.chatBotSlice
  );
  const chatHistory = useSelector(
    (state) => state?.chatBotSlice?.getAllHistoryByProjectId
  );
  const chatEndRef = useRef(null);
  const [feedback, setFeedback] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('Copy');
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackStates, setFeedbackStates] = useState({});
  const [copiedStates, setCopiedStates] = useState({});
  const [selectedFeedbackMessage, setSelectedFeedbackMessage] = useState(null);

  useEffect(() => {
    if (activeTab === 2) {
      dispatch(
        getAllHistoryByProjectId({
          project_id: null,
          user_id: localStorage.getItem('id') || 14
        })
      );
    }
  }, [activeTab, dispatch]);

  const handleThumbClick = (data, type) => {
    if (type === 'up') {
      setFeedbackStates((prev) => ({
        ...prev,
        [data.uuid]: 'up'
      }));
    } else if (type === 'down') {
      let chat = {
        text: {
          chat_entry_uuid: data.uuid
        }
      };
      setSelectedFeedbackMessage(chat); // Save full message
      setFeedbackModal(true); // Open modal
    }
  };
  const handleCopy = (uuid, textToCopy) => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      setCopiedStates((prev) => ({
        ...prev,
        [uuid]: true
      }));

      setTimeout(() => {
        setCopiedStates((prev) => ({
          ...prev,
          [uuid]: false
        }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }

    document.body.removeChild(textArea);
  };

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('chatHistory').scrollTo({
        top: document.getElementById('chatHistory').scrollHeight + 100,
        behavior: 'smooth'
      });
    }, 10);
  }, []);

  useEffect(() => {
    if (projectId) {
      dispatch(
        getAllHistoryByProjectId({
          project_id: activeTab === 1 ? projectId : null,
          user_id: localStorage.getItem('id') || 14
        })
      );
    } else {
      // if (chatProjects?.length > 0) {
      dispatch(
        getAllHistoryByProjectId({
          project_id: activeTab === 1 ? chatProjects[0]?.project_id : null,
          user_id: localStorage.getItem('id') || 14
        })
      );
      //}
    }
  }, [projectId, dispatch, chatProjects, activeTab]);

  const onChangeMessageText = (e) => {
    setTxtMessage(e);
  };

  const onMessgeSend = () => {
    if (txtMessage !== '') {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const selectedProjectId =
        activeTab === 2 ? '' : projectId || chatProjects[0]?.project_id;
      dispatch(
        postBotMessages({
          formData: {
            project_id: selectedProjectId,
            question: txtMessage,
            user_id: localStorage.getItem('id'),
            user_name: localStorage.getItem('first_name') || 'Friend',
            flagging: 1
          },
          signal: controller.signal
        })
      ).then((res) => {
        dispatch(
          getAllHistoryByProjectId({
            project_id: selectedProjectId,
            user_id: localStorage.getItem('id') || 14
          })
        );
      });

      setTxtMessage('');
      setTimeout(() => {
        document.getElementById('chatHistory').scrollTo({
          top: document.getElementById('chatHistory').scrollHeight + 100,
          behavior: 'smooth'
        });
      }, 10);

      setTimeout(() => {
        //onBackMessage();
        document.getElementById('chatHistory').scrollTo({
          top: document.getElementById('chatHistory').scrollHeight + 100,
          behavior: 'smooth'
        });
      }, 1500);
    }
  };

  function tabEvents(e, id) {
    e.preventDefault();
    document.getElementById('tab1').classList.remove('active');
    document.getElementById('tab2').classList.remove('active');
    document.getElementById('tab3').classList.remove('active');
    document.getElementById('tab' + id).classList.add('active');

    document.getElementById('tab-conatain1').classList.remove('active');
    document.getElementById('tab-conatain1').classList.add('show');
    document.getElementById('tab-conatain2').classList.remove('active');
    document.getElementById('tab-conatain2').classList.add('show');
    document.getElementById('tab-conatain3').classList.remove('active');
    document.getElementById('tab-conatain3').classList.add('show');
    document.getElementById('tab-conatain' + id).classList.add('active');
    document.getElementById('tab-conatain' + id).classList.add('show');
  }

  function onClickToggle(e) {
    e.preventDefault();
    var ele = document.getElementById('chatMenuList');
    if (ele) {
      if (ele.classList.contains('open')) {
        ele.classList.remove('open');
      } else {
        ele.classList.add('open');
      }
    }
  }

  const onSearchHandler = (searchTerm) => {
    if (searchTerm?.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();

      setFilteredChatProjects(
        chatProjects?.filter((item) =>
          item?.project_name?.toLowerCase().includes(lowerSearch)
        )
      );
    } else {
      setFilteredChatProjects(chatProjects);
    }
  };

  useEffect(() => {
    dispatch(getAllProject());
  }, [dispatch]);

  const transformedChatHistory =
    chatHistory?.chat_entries?.flatMap((entry) => [
      {
        type: 'send',
        message: entry.question,
        time: new Date(entry.timestamp).toLocaleTimeString(),
        images: [],
        uuid: entry.uuid
      },
      {
        type: 'received',
        message: entry.answer,
        time: new Date(entry.timestamp).toLocaleTimeString(),
        images: [],
        uuid: entry.uuid
      }
    ]) || [];

  console.log(transformedChatHistory, 'transformedChatHistory');

  const [filteredChatProjects, setFilteredChatProjects] =
    useState(chatProjects);

  useEffect(() => {
    setFilteredChatProjects(chatProjects);
  }, [chatProjects]);

  return (
    <div className="col-12 d-flex">
      <div
        id="chatMenuList"
        className="card card-chat border-right border-top-0 border-bottom-0 order-0 w380 "
      >
        <div className="px-4 pt-3 pt-md-4">
          <div className="input-group mb-3">
            <input
              type="text"
              style={{ background: '#EEEEEE' }}
              className="form-control mb-1"
              disabled={activeTab === 2}
              placeholder="Search..."
              onChange={(e) => {
                onSearchHandler(e.target.value);
              }}
            />
          </div>

          {/* //tabs  */}
          <div className="nav nav-pills justify-content-between text-center mb-3">
            <a
              className={`flex-fill nav-link ${
                activeTab === 1 ? 'active' : ''
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(1);
              }}
            >
              Project Wise Query
            </a>
            <a
              className={`flex-fill nav-link ${
                activeTab === 2 ? 'active' : ''
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(2);
              }}
            >
              Chat With Me
            </a>
          </div>
        </div>
        {activeTab === 1 ? (
          <div className="tab-content border-top">
            <div
              className="tab-pane fade show active"
              id="tab-conatain1"
              role="tabpanel"
            >
              <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
                {isLoading?.getAllProject ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <li
                      key={'skeleton-' + i}
                      className="list-group-item px-md-4 py-3 py-md-4"
                    >
                      <div className="d-flex">
                        <div
                          className="avatar rounded-circle bg-secondary placeholder"
                          style={{ width: 40, height: 40 }}
                        />
                        <div className="flex-fill ms-3 w-100">
                          <div className="d-flex justify-content-between mb-2">
                            <div
                              className="placeholder bg-secondary"
                              style={{ width: '40%', height: '14px' }}
                            ></div>
                            <div
                              className="placeholder bg-secondary"
                              style={{ width: '20%', height: '12px' }}
                            ></div>
                          </div>
                          <div
                            className="placeholder bg-secondary"
                            style={{ width: '60%', height: '12px' }}
                          ></div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : filteredChatProjects?.length === 0 ? (
                  <li className="list-group-item text-center py-5 text-muted">
                    No chat projects found.
                  </li>
                ) : (
                  filteredChatProjects?.map((d, i) => (
                    <li
                      key={'545' + i}
                      className={`list-group-item px-md-4 py-3 py-md-4 open`}
                      style={{
                        opacity: i !== 0 ? 0.5 : 1,
                        cursor: i !== 0 ? 'not-allowed' : 'auto'
                      }}
                      title={i !== 0 ? 'Coming soon' : ''}
                    >
                      <Link
                        to={
                          i === 0 ? `/${_base}/ChatApp/${d.project_id}` : '/#'
                        }
                        className="d-flex"
                        style={{
                          pointerEvents: i !== 0 ? 'none' : 'auto',
                          alignItems: 'center',
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <i className="icofont-files-stack"></i>
                        <div className="flex-fill ms-3 text-truncate">
                          <h6 className="d-flex justify-content-between mb-0">
                            <span
                              className={`fw-bold ${
                                i !== 0 ? 'text-muted' : ''
                              }`}
                            >
                              {d.project_name}
                            </span>
                            <small
                              className="msg-time text-muted"
                              style={{ fontSize: '0.7rem' }}
                            >
                              {d.lastSeen || '10:45AM'}
                            </small>
                          </h6>
                        </div>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center mt-4">
            <h5>🤖 Start chatting with Connect AI</h5>
            <p className="text-muted">
              You can ask any general questions and AI will assist you.
            </p>
          </div>
        )}
      </div>
      <div className="card card-chat-body border-0 order-1 w-100 px-4 px-md-5 py-3 py-md-4">
        <div className="chat-header d-flex justify-content-between align-items-center border-bottom pb-3">
          <div className="d-flex align-items-center">
            <div
              onClick={() => {
                window.history.back();
              }}
              role="button"
              className="cursor-pointer"
            >
              <i className="icofont-arrow-left fs-4"></i>
            </div>
            <div className="ms-3">
              <div className="d-flex align-items-center gap-2 text-truncate">
                <i className="icofont-files-stack"></i>
                <h6
                  className="mb-0 fw-bolder"
                  style={{
                    fontSize: '1rem'
                  }}
                >
                  {activeTab === 2
                    ? 'Chat With Connect AI'
                    : chatHistory?.project_name ||
                      'Connect 2.0 - Ticketing system'}
                </h6>
              </div>
              {/* <small className="text-muted">
                Last seen: {chatData[activeChatIndex].lastSeen}
              </small> */}
            </div>
          </div>
          <div className="d-flex">
            <a
              className="nav-link py-2 px-3 text-muted d-none d-lg-block"
              href="#!"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="We are Still Working on It!."
            >
              <i className="fa fa-info-circle"></i>
            </a>
          </div>
        </div>
        {/* chat history */}
        <ul
          id="chatHistory"
          className="chat-history list-unstyled mb-0 py-lg-5 py-md-4 py-3 flex-grow-1"
        >
          {isLoading?.getAllHistoryByProjectId ? (
            <Stack alignItems={'center'}>
              <CircularProgress size={25} />
            </Stack>
          ) : transformedChatHistory?.length === 0 ? (
            <li className="text-center text-muted py-5">
              <i className="fa fa-comment-slash mb-2 fs-3 d-block"></i>
              <div>No messages found</div>
            </li>
          ) : (
            transformedChatHistory?.map((data, i) => (
              <li
                key={data.uuid + data.type}
                className={
                  data.type === 'received'
                    ? 'mb-3 d-flex flex-row align-items-end'
                    : 'mb-3 d-flex flex-row-reverse align-items-end'
                }
              >
                <div
                  className={`max-width-70 ${
                    data.type === 'received' ? '' : 'text-end'
                  }`}
                >
                  {/* User Info */}
                  <div className="user-info mb-1 d-flex gap-2 align-items-center">
                    {data.type === 'received' && (
                      <i className="icofont-files-stack"></i>
                    )}
                    <span className="text-muted small">{data.time}</span>
                  </div>

                  {/* Message Box */}
                  <div
                    style={{ background: data?.type === 'send' && '#484c7f' }}
                    className="card border-0 p-3"
                  >
                    <div
                      className="message"
                      style={{
                        color: data?.type === 'send' && 'white',
                        textAlign: 'center'
                      }}
                    >
                      {data.message}
                      <p className="mb-0">
                        {data.images?.map((imgSrc, j) => (
                          <img
                            key={data.uuid + '_img' + j}
                            className="w120 img-thumbnail"
                            src={imgSrc}
                            alt=""
                          />
                        ))}
                      </p>
                    </div>
                  </div>

                  {/* Feedback & Copy (only for received) */}
                  {data?.type === 'received' && (
                    <div style={{ padding: '5px 5px' }}>
                      {/* Thumbs Up */}
                      <Tooltip
                        title="This answer worked for me"
                        arrow
                        placement="bottom"
                      >
                        <IconButton
                          onClick={() => handleThumbClick(data, 'up')}
                          size="small"
                          sx={{
                            color:
                              feedbackStates[data.uuid] === 'up'
                                ? '#198754'
                                : 'default'
                          }}
                        >
                          {feedbackStates[data.uuid] === 'up' ? (
                            <ThumbUpIcon sx={{ fontSize: '15px' }} />
                          ) : (
                            <ThumbUpOffAltIcon sx={{ fontSize: '15px' }} />
                          )}
                        </IconButton>
                      </Tooltip>

                      {/* Thumbs Down */}
                      <Tooltip
                        title="This answer didn't solve my problem"
                        arrow
                        placement="bottom"
                      >
                        <IconButton
                          onClick={() => handleThumbClick(data, 'down')}
                          size="small"
                          sx={{
                            color:
                              feedbackStates[data.uuid] === 'down'
                                ? '#fc5a69'
                                : 'default'
                          }}
                        >
                          {feedbackStates[data.uuid] === 'down' ? (
                            <ThumbDownIcon sx={{ fontSize: '15px' }} />
                          ) : (
                            <ThumbDownOffAltIcon sx={{ fontSize: '15px' }} />
                          )}
                        </IconButton>
                      </Tooltip>

                      {/* Copy Button */}
                      <Tooltip
                        title={copiedStates[data.uuid] ? 'Copied!' : 'Copy'}
                        arrow
                        placement="bottom"
                      >
                        <IconButton
                          onClick={() => handleCopy(data.uuid, data.message)}
                        >
                          {copiedStates[data.uuid] ? (
                            <CheckIcon
                              sx={{ fontSize: '15px', color: '#198754' }}
                            />
                          ) : (
                            <ContentCopyIcon sx={{ fontSize: '15px' }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>

        <div
          className="chat-message position-relative"
          style={{ maxWidth: '100%' }}
        >
          <textarea
            type="text"
            style={{
              background: '#EEEEEE',
              paddingRight: '70px',
              resize: 'none'
            }} // paddingRight prevents overlap with button
            className="form-control"
            rows={2}
            value={txtMessage}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();

                onMessgeSend(e);
              }
            }}
            placeholder="Enter text here..."
            onChange={(e) => onChangeMessageText(e.target.value)}
          ></textarea>

          <IconButton
            className=" position-absolute"
            type="button"
            style={{
              bottom: '12px',
              right: '10px',
              zIndex: 1
              // background: '#484c7f'
            }}
            onClick={onMessgeSend}
          >
            <SendIcon sx={{ color: '#484c7f' }} />
          </IconButton>
        </div>
      </div>
      {feedbackModal && (
        <FeedbackModal
          open={feedbackModal}
          onClose={() => {
            setFeedbackModal(false);
            setSelectedFeedbackMessage(null);
          }}
          chat={selectedFeedbackMessage}
          project_id={
            activeTab === 2 ? '' : projectId || chatProjects[0]?.project_id
          }
          setFeedbackStates={setFeedbackStates}
          setSelectedFeedbackMessage={setSelectedFeedbackMessage}
        />
      )}
    </div>
  );
}

export default Chattile;
