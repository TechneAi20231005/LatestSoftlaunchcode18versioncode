import React, { useEffect, useRef, useState } from 'react';
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

function Chattile() {
  // const { data } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectId } = useParams();
  //const [chatData, setChatData] = useState([...data]);
  //const [activeChatIndex, setActiveChatIndex] = useState(0);
  const abortControllerRef = useRef(null);
  const [txtMessage, setTxtMessage] = useState('');
  const { getAllProject: chatProjects, isLoading } = useSelector(
    (state) => state?.chatBotSlice
  );
  const chatHistory = useSelector(
    (state) => state?.chatBotSlice?.getAllHistoryByProjectId
  );

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
          project_id: projectId,
          user_id: localStorage.getItem('id') || 14
        })
      );
    } else {
      // if (chatProjects?.length > 0) {
      dispatch(
        getAllHistoryByProjectId({
          project_id: chatProjects[0]?.project_id,
          user_id: localStorage.getItem('id') || 14
        })
      );
      //}
    }
  }, [projectId, dispatch, chatProjects]);

  const onChangeMessageText = (e) => {
    setTxtMessage(e);
  };

  const onMessgeSend = () => {
    if (txtMessage !== '') {
      //    var dd = chatData;
      //    var d = new Date();
      //    var am_pm = 'AM';
      //    if (d.getHours() >= 12) {
      //      am_pm = 'PM';
      //    }
      //  dd[activeChatIndex].messages.push({
      //     message: txtMessage,
      //     type: 'send',
      //     images: [],
      //     time: `${d.getHours()}:${d.getMinutes()} ${am_pm}`
      //     });
      // setChatData([...dd]);
      const controller = new AbortController();
      abortControllerRef.current = controller;
      dispatch(
        postBotMessages({
          formData: {
            project_id: projectId || chatProjects[0]?.project_id,
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
            project_id: projectId || chatProjects[0]?.project_id,
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

  {
    /* const onBackMessage = () => {
    var dd = chatData;
    var d = new Date();
    var am_pm = 'AM';
    if (d.getHours() >= 12) {
      am_pm = 'PM';
    }
    dd[activeChatIndex].messages.push({
      message: 'Hey, I m Fine.',
      type: 'received',
      images: [],
      time: `${d.getHours()}:${d.getMinutes()} ${am_pm}`
    });

    setChatData([...dd]);
  };*/
  }

  {
    /*  const onDeleteMessage = (index) => {
    var dd = chatData;
    dd[activeChatIndex].messages.splice(index, 1);

    setChatData([...dd]);
  };*/
  }

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
      setFilteredChatProjects(
        chatProjects?.filter((item) =>
          item?.project_name
            ?.toLowerCase()
            .startsWith(searchTerm?.toLowerCase())
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
        images: []
      },
      {
        type: 'received',
        message: entry.answer,
        time: new Date(entry.timestamp).toLocaleTimeString(),
        images: []
      }
    ]) || [];

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
              placeholder="Search..."
              onChange={(e) => {
                onSearchHandler(e.target.value);
              }}
            />
          </div>

          <div
            className="nav nav-pills justify-content-between text-center"
            role="tablist"
          >
            <a
              className="flex-fill rounded border-0 nav-link active"
              data-bs-toggle="tab"
              id="tab1"
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                tabEvents(e, 1);
              }}
              role="tab"
              aria-selected="true"
            >
              Chat
            </a>
            <a
              className="flex-fill rounded border-0 nav-link"
              data-bs-toggle="tab"
              id="tab2"
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                tabEvents(e, 2);
              }}
              style={{ pointerEvents: 'none' }}
              role="tab"
              aria-selected="false"
            >
              Groups
            </a>
            <a
              className="flex-fill rounded border-0 nav-link"
              data-bs-toggle="tab"
              id="tab3"
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                tabEvents(e, 3);
              }}
              style={{ pointerEvents: 'none' }}
              role="tab"
              aria-selected="false"
            >
              Contact
            </a>
          </div>
        </div>
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
                      to={i === 0 ? `/${_base}/ChatApp/${d.project_id}` : '/#'}
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
                            className={`fw-bold ${i !== 0 ? 'text-muted' : ''}`}
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
          <div className="tab-pane fade" id="tab-conatain2" role="tabpanel">
            <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
              <li className="list-group-item px-md-4 py-3 py-md-4">
                <a href="#!" className="d-flex">
                  <div className="avatar rounded-circle no-thumbnail">GI</div>
                  <div className="flex-fill ms-3 text-truncate">
                    <h6 className="d-flex justify-content-between mb-0">
                      <span>Design UI</span>{' '}
                      <small className="msg-time">9/10/2020</small>
                    </h6>
                    <span className="text-muted">
                      The point of using Lorem Ipsum
                    </span>
                  </div>
                </a>
              </li>
              <li className="list-group-item px-md-4 py-3 py-md-4">
                <a href="#!" className="d-flex">
                  <div className="avatar rounded-circle no-thumbnail">AD</div>
                  <div className="flex-fill ms-3 text-truncate">
                    <h6 className="d-flex justify-content-between mb-0">
                      <span>Angular Dev Team</span>{' '}
                      <small className="msg-time">22/8/2020</small>
                    </h6>
                    <span className="text-muted">
                      If you are going to use a passage
                    </span>
                  </div>
                </a>
              </li>
              <li className="list-group-item px-md-4 py-3 py-md-4">
                <a href="#!" className="d-flex">
                  <div className="avatar rounded-circle no-thumbnail">AT</div>
                  <div className="flex-fill ms-3 text-truncate">
                    <h6 className="d-flex justify-content-between mb-0">
                      <span>Account Team</span>{' '}
                      <small className="msg-time">11/7/2020</small>
                    </h6>
                    <span className="text-muted">
                      The point of using Lorem Ipsum
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <div className="tab-pane fade" id="tab-conatain3" role="tabpanel">
            <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
              <li className="list-group-item px-md-4 py-3 py-md-4">
                <a href="#!" className="d-flex">
                  <img className="avatar rounded-circle" src={''} alt="" />
                  <div className="flex-fill ms-3 text-truncate">
                    <div className="d-flex justify-content-between mb-0">
                      <h6 className="mb-0">Chris Fox</h6>
                      <div className="text-muted">
                        <i className="fa fa-heart ps-2"></i>
                        <i className="fa fa-trash ps-2"></i>
                      </div>
                    </div>
                    <span className="text-muted">chris.fox@mytask.com</span>
                  </div>
                </a>
              </li>
              <li className="list-group-item px-md-4 py-3 py-md-4">
                <a href="#!" className="d-flex">
                  <img className="avatar rounded-circle" src={''} alt="" />
                  <div className="flex-fill ms-3 text-truncate">
                    <div className="d-flex justify-content-between mb-0">
                      <h6 className="mb-0">Barbara Kelly</h6>
                      <div className="text-muted">
                        <i className="fa fa-heart-o ps-2"></i>
                        <i className="fa fa-trash ps-2"></i>
                      </div>
                    </div>
                    <span className="text-muted">barbara.kelly@mytask.com</span>
                  </div>
                </a>
              </li>
              <li className="list-group-item px-md-4 py-3 py-md-4">
                <a href="#!" className="d-flex">
                  <img className="avatar rounded-circle" src={''} alt="" />
                  <div className="flex-fill ms-3 text-truncate">
                    <div className="d-flex justify-content-between mb-0">
                      <h6 className="mb-0">Brian Swader</h6>
                      <div className="text-muted">
                        <i className="fa fa-heart-o ps-2"></i>
                        <i className="fa fa-trash ps-2"></i>
                      </div>
                    </div>
                    <span className="text-muted">brian.swader@mytask.com</span>
                  </div>
                </a>
              </li>
              <li className="list-group-item px-md-4 py-3 py-md-4">
                <a href="#!" className="d-flex">
                  <img className="avatar rounded-circle" src={''} alt="" />
                  <div className="flex-fill ms-3 text-truncate">
                    <div className="d-flex justify-content-between mb-0">
                      <h6 className="mb-0">Richard Foos</h6>
                      <div className="text-muted">
                        <i className="fa fa-heart ps-2"></i>
                        <i className="fa fa-trash ps-2"></i>
                      </div>
                    </div>
                    <span className="text-muted">richard.foos@mytask.com</span>
                  </div>
                </a>
              </li>
              <li className="list-group-item px-md-4 py-3 py-md-4">
                <a href="#!" className="d-flex">
                  <img className="avatar rounded-circle" src={''} alt="" />
                  <div className="flex-fill ms-3 text-truncate">
                    <div className="d-flex justify-content-between mb-0">
                      <h6 className="mb-0">Frank Camly</h6>
                      <div className="text-muted">
                        <i className="fa fa-heart-o ps-2"></i>
                        <i className="fa fa-trash ps-2"></i>
                      </div>
                    </div>
                    <span className="text-muted">frank.camly@mytask.com</span>
                  </div>
                </a>
              </li>
              <li className="list-group-item px-md-4 py-3 py-md-4">
                <a href="#!" className="d-flex">
                  <img className="avatar rounded-circle" src={''} alt="" />
                  <div className="flex-fill ms-3 text-truncate">
                    <div className="d-flex justify-content-between mb-0">
                      <h6 className="mb-0">Brian Swader</h6>
                      <div className="text-muted">
                        <i className="fa fa-heart-o ps-2"></i>
                        <i className="fa fa-trash ps-2"></i>
                      </div>
                    </div>
                    <span className="text-muted">brianswader@mytask.com</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card card-chat-body border-0 order-1 w-100 px-4 px-md-5 py-3 py-md-4">
        <div className="chat-header d-flex justify-content-between align-items-center border-bottom pb-3">
          <div className="d-flex align-items-center">
            <div
              onClick={() => {
                if (projectId) {
                  navigate(-1);
                }
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
                    fontSize: '0.9rem'
                  }}
                >
                  {chatHistory?.project_name ||
                    'Connect 2.0 - Ticketing system'}
                </h6>
              </div>
              {/* <small className="text-muted">
                Last seen: {chatData[activeChatIndex].lastSeen}
              </small> */}
            </div>
          </div>
          <div className="d-flex">
            <a className="nav-link py-2 px-3 text-muted d-none" href="#!">
              <i className="fa fa-camera"></i>
            </a>
            <a className="nav-link py-2 px-3 text-muted d-none " href="#!">
              <i className="fa fa-video-camera"></i>
            </a>
            <a className="nav-link py-2 px-3 text-muted d-none" href="#!">
              <i className="fa fa-gear"></i>
            </a>
            <a
              className="nav-link py-2 px-3 text-muted d-none d-lg-block"
              href="#!"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="We are Still Working on It!."
            >
              <i className="fa fa-info-circle"></i>
            </a>

            <div className="nav-item list-inline-item d-block d-xl-none">
              <Dropdown className="hide-toggle">
                <Dropdown.Toggle as="a" className="nav-link text-muted">
                  <i className="fa fa-ellipsis-v"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu shadow border-0">
                  <li>
                    <a className="dropdown-item" href="!#">
                      <i className="fa fa-camera"></i> Share Images
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="!#">
                      <i className="fa fa-video-camera"></i> Video Call
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="!#">
                      <i className="fa fa-gear"></i> Settings
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="!#">
                      <i className="fa fa-info-circle"></i> Info
                    </a>
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
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
                key={'messages' + i}
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
                  <div className="user-info mb-1 d-flex gap-2 align-items-center">
                    {data.type === 'received' && (
                      <>
                        {/* <img
                        className="avatar sm rounded-circle me-1"
                        src={DemoProfileImg}
                        alt="avatar"
                      />*/}
                        <i className="icofont-files-stack"></i>
                      </>
                    )}
                    <span className="text-muted small">{data.time}</span>
                  </div>
                  <div
                    style={{
                      background: data?.type === 'send' && '#484c7f'
                    }}
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
                        {data.images.map((d, i) => (
                          <img
                            key={'images' + i}
                            className="w120 img-thumbnail"
                            src={d}
                            alt=""
                          />
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="btn-group"
                  style={{
                    pointerEvents: 'none'
                  }}
                >
                  <Dropdown className="hide-toggle">
                    <Dropdown.Toggle
                      as="a"
                      variant=""
                      className="nav-link py-2 px-3 text-muted"
                    >
                      <i className="fa fa-ellipsis-v"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="border-0 shadow">
                      <li>
                        <a className="dropdown-item" href="#!">
                          Edit
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#!">
                          Share
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#!"
                          onClick={(e) => {
                            e.preventDefault();
                            //  onDeleteMessage(i);
                          }}
                        >
                          Delete
                        </a>
                      </li>
                    </Dropdown.Menu>
                  </Dropdown>
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
    </div>
  );
}

export default Chattile;
