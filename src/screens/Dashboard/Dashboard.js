import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import { getData } from '../../services/DashboardService';
import Chart from 'react-apexcharts';

import * as time from '../../components/Utilities/Functions';
import {
  postTimerData,
  getRegularizationTime,
  getRegularizationTimeHistory
} from '../../services/TicketService/TaskService';
import { _base } from '../../settings/constants';
import './DashboardStyle.css';

import { getNotification } from '../../services/NotificationService/NotificationService';
import Dropdown from 'react-bootstrap/Dropdown';
import ApproveRequestModal from '../TicketManagement/TaskManagement/components/ApproveRequestModal';
import TimeRegularizationHistory from '../TicketManagement/TaskManagement/components/TimeRegularizationHistory';

export default function HrDashboard() {
  const history = useNavigate();

  const [approvedNotifications, setApprovedNotifications] = useState();
  const [notifications, setNotifications] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [allRequest, setAllRequest] = useState();
  const [count, setCount] = useState();
  const [dailyTask, setDailyTask] = useState();
  const [upcomingTask, setUpcomingTask] = useState();
  const [previousTask, setPreviousTask] = useState();
  const [notificationHeight, setNotificationHeight] = useState(200);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const [approveRequestModal, setApproveRequestModal] = useState({
    show: false,
    data: null
  });

  const [historyModal, setHistoryModal] = useState({
    show: false,
    data: null
  });

  const [regularizationRequest, setRegularizationRequest] = useState([]);
  const [ticketID, setTicketID] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationId, setNotificationId] = useState();

  const [chartData, setChartData] = useState({
    series: [0, 0, 0],
    Chart: {
      height: 'auto'
    },
    options: {
      chart: {
        type: 'donut'
      },
      labels: ['Pending Task', 'Working Tasks', 'Completed Task'],

      colors: ['#ff1843', '#ffc107', '#198754', '#FBFBFB'],

      dataLables: {
        style: {
          textColor: 'white',
          colors: ['#333', '#fff']
        }
      }
    }
  });
  const checkTokenExpiration = () => {
    const tokenExpirationTime = localStorage.getItem('jwt_token_expiration');
    const currentTime = new Date().getTime();

    if (tokenExpirationTime && currentTime > tokenExpirationTime) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_token_expiration');
      sessionStorage.clear();
      history(`${process.env.PUBLIC_URL}/`);
    }
  };

  async function get() {
    const id = sessionStorage.getItem('id');
    await getData(id).then((res) => {
      if (res.status === 200) {
        setCount(res.data.data.count);
        setDailyTask(res.data.data.dailyTask);
        setPreviousTask(res.data.data.previousTask);
        setUpcomingTask(res.data.data.upcomingTask);
        const updatedChartData = {
          ...chartData,
          series: [
            res.data.data.count.pendingTask ? res.data.data.count.pendingTask : 0,
            res.data.data.count.workingTask,
            res.data.data.count.completedTask
          ]
        };
        setChartData(updatedChartData);
      }
    });
  }

  const handleTimer = async (e, ticket_id, ticket_task_id, status) => {
    var data = {
      tenant_id: localStorage.getItem('tenant_id'),
      ticket_id: ticket_id,
      ticket_task_id: ticket_task_id,
      user_id: localStorage.getItem('id'),
      status: status,
      time: time.getDateTime()
    };
    await postTimerData(data).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          get();
        } else {
          checkTokenExpiration();
        }
      }
    });
  };

  const loadNotifcation = () => {
    getNotification().then((res) => {
      if (res.status === 200 && res.data.status === 1) {
        setNotifications(null);
        setApprovedNotifications(null);
        if (res.data.data !== null) {
          if (res?.data?.data?.result) {
            var length = res.data.data.result.length;

            setNotifications(res.data.data.result);

            setApprovedNotifications(res?.data?.data?.result?.filter((d) => d?.status === 1));

            setAllRequest(res?.data?.data?.result?.filter((d) => d?.status !== 0));

            if (parseInt(length) > 0 && parseInt(length) <= 5) {
            }
          }
        }
      }
    });
  };
  const handleShowApproveRequestModal = () => {
    const data = null;
    setApproveRequestModal({ show: true, data: data });
  };
  const handleCloseApproveRequestModal = () => {
    const data = null;
    setApproveRequestModal({ show: false, data: data });
  };

  const handleHistoryModal = () => {
    setIsLoading(null);
    setIsLoading(true);
    new getRegularizationTimeHistory()

      .then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.status) {
          setIsLoading(false);

          if (res.data.data) {
            const temp = res.data.data
              ?.filter((d) => d?.status_remark !== 'PENDING')
              ?.map((d) => ({
                id: d.id,
                created_by_name: d.created_by_name,
                from_date: d.from_date,
                to_date: d.to_date,
                from_time: d.from_time,
                to_time: d.to_time,
                remark: d.remark,
                is_checked: 0,
                regularization_time_status: d.regularization_time_status,
                task_name: d.task_name,
                ticket_id_name: d.ticket_id_name,
                actual_time: d.actual_time,
                task_hours: d.task_hours,
                scheduled_time: d.scheduled_time,
                status: d.status_remark
              }));

            // Assuming setDataa is a function to set the state
            setHistoryData(temp);
          }
        } else {
        }
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message to the user
      });
    const data = null;

    setHistoryModal({ show: true, data: data });
  };
  const handleCloseHistoryModal = () => {
    const data = null;
    setHistoryModal({ show: false, data: data });
  };

  const handleRegularizationRequest = (cuurentData) => {
    setIsLoading(null);
    setIsLoading(true);
    setTicketID(cuurentData.ticketID ? cuurentData.ticketID : cuurentData);
    setNotificationId(cuurentData.notificationid);
    new getRegularizationTime(ticketID).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
        const temp = res?.data?.data
          ?.filter((d) => d.status_remark === 'PENDING')
          .map((d) => ({
            id: d.id,
            created_by_name: d.created_by_name,
            from_date: d.from_date,
            to_date: d.to_date,
            from_time: d.from_time,
            to_time: d.to_time,
            remark: d.remark,
            is_checked: 0,
            regularization_time_status: d.regularization_time_status,
            task_name: d.task_name,
            ticket_id_name: d.ticket_id_name,
            actual_time: d.actual_time,
            task_hours: d.task_hours,
            scheduled_time: d.scheduled_time,
            status: d.status_remark
          }));

        setRegularizationRequest(temp);
      }
    });
  };

  useEffect(() => {
    get();
    loadNotifcation();
  }, []);

  useEffect(() => {
    const account_for = localStorage.getItem('account_for');

    if (account_for === 'CUSTOMER') {
      window.location.href = `${process.env.PUBLIC_URL}/Ticket`;
    }
  }, []);

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between align-items-center">
        <PageHeader headerTitle="Dashboard" />

        <div className="regularization-button">
          {(historyModal.show || approveRequestModal.show) === false && (
            <Dropdown
              className="notifications"
              onClick={() => {
                loadNotifcation();
              }}
            >
              <Dropdown.Toggle as="a" className="nav-link dropdown-toggle pulse">
                <div className="me-3 regularization-toggle">
                  <div>
                    <button class=" badge bg-primary p-2">Regularization</button>
                    {approvedNotifications?.length > 0 && (
                      <div className="notification-circle">{approvedNotifications.length}</div>
                    )}
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="rounded-lg shadow border-0 dropdown-animation dropdown-menu-sm-end p-0 m-0">
                <div className="card border-0 custom-card-width">
                  <div className="card-header border-0 p-3">
                    <h5 className="mb-0 font-weight-light d-flex justify-content-between">
                      <span>
                        Regularization Request :{' '}
                        {showApprovedOnly === true ? (
                          <span>Approved Only By Me</span>
                        ) : (
                          <span>View All Request</span>
                        )}
                      </span>
                      <div
                        onClick={(e) => {
                          handleHistoryModal();
                        }}
                      >
                        {notifications && (
                          <button className="fw-bold badge bg-warning p-2">
                            <i class="icofont-history"></i>
                            History
                          </button>
                        )}
                      </div>
                      {!notifications && <span className="badge text-white">0</span>}
                    </h5>
                  </div>
                  <div className="tab-content card-body custom-card-body">
                    {showApprovedOnly ? (
                      <div className="tab-pane fade show active">
                        <ul
                          className="list-unstyled list mb-0"
                          style={{ height: `${notificationHeight}px` }}
                        >
                          {approvedNotifications &&
                            approvedNotifications.length > 0 &&
                            approvedNotifications.map((ele, index) => {
                              const date = ele.created_at.split(' ')[0];
                              const time = ele.created_at.split(' ')[1];

                              const parts = ele.url.split('/'); // Split the string by '/'
                              const ticketID = parts[parts.length - 1]; // Get the last part of the array
                              const notificationid = ele.id;
                              return (
                                <li className="py-2 mb-1 border-bottom" key={index}>
                                  <div
                                    className="flex-fill ms-2"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                      handleShowApproveRequestModal();
                                      handleRegularizationRequest({
                                        ticketID,
                                        notificationid
                                      });
                                    }}
                                  >
                                    {ele.url && (
                                      <p className="d-flex justify-content-between mb-0">
                                        <span className="font-weight-bold">
                                          <span className="fw-bold badge bg-primary p-2">
                                            {' '}
                                            {`Date : ${date}`}
                                          </span>
                                          <span
                                            className="fw-bold badge bg-danger p-2"
                                            style={{ marginLeft: '10px' }}
                                          >
                                            {' '}
                                            {`Time : ${time}`}
                                          </span>
                                          <br />
                                          <div>{ele.message}</div>
                                        </span>
                                      </p>
                                    )}

                                    {!ele.url && (
                                      <p className="d-flex justify-content-between mb-0">
                                        <span className="font-weight-bold">
                                          {ele.message}
                                          {date}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    ) : (
                      <div className="tab-pane fade show active">
                        <ul
                          className="list-unstyled list mb-0"
                          style={{ height: `${notificationHeight}px` }}
                        >
                          {allRequest &&
                            allRequest.length > 0 &&
                            allRequest.map((ele, index) => {
                              const date = ele.created_at.split(' ')[0];
                              const time = ele.created_at.split(' ')[1];

                              const parts1 = ele?.url?.split('/'); // Split the string by '/'
                              const ticketID1 = parts1 && parts1[parts1?.length - 1];

                              return (
                                <li className="py-2 mb-1 border-bottom" key={index}>
                                  <div
                                    className="flex-fill ms-2"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                      handleShowApproveRequestModal();
                                      handleRegularizationRequest(ticketID1);
                                    }}
                                  >
                                    {ele.url && (
                                      <p className="d-flex justify-content-between mb-0">
                                        <span className="font-weight-bold">
                                          <span className="fw-bold badge bg-primary p-2">
                                            {' '}
                                            {`Date : ${date}`}
                                          </span>
                                          <span className="fw-bold badge bg-danger p-2 mx-3">
                                            {' '}
                                            {`Time : ${time}`}
                                          </span>
                                          <br />
                                          {ele.message}
                                        </span>
                                      </p>
                                    )}

                                    {!ele.url && (
                                      <p className="d-flex justify-content-between mb-0">
                                        <span className="font-weight-bold">
                                          {ele.message}
                                          {date}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="row m-0 custom-footer">
                    <div
                      className={`col-4 card-footer text-center border-top-0  ${
                        !showApprovedOnly ? 'bg-info' : 'white'
                      }`}
                      style={{ width: '50%', height: '50px' }}
                      onClick={() => setShowApprovedOnly(false)}
                    >
                      <div className="btn-group h-100">
                        <Link to={`/${_base}/Dashboard`}>View All Request</Link>
                      </div>
                    </div>

                    <div
                      className={`col-4 card-footer text-center border-top-0 ${
                        showApprovedOnly ? 'bg-info' : 'white'
                      }`}
                      style={{ width: '50%', height: '50px' }}
                      onClick={() => setShowApprovedOnly(true)}
                    >
                      <div className="btn-group h-100">
                        <Link to={`/${_base}/Dashboard`}>Approved Only By Me</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          )}

          <>
            {approveRequestModal && (
              <ApproveRequestModal
                show={approveRequestModal.show}
                hide={handleCloseApproveRequestModal}
                data={regularizationRequest && regularizationRequest}
                ticketId={ticketID}
                isLoading={isLoading}
                notificationId={notificationId}
              />
            )}
          </>

          <>
            {historyModal && regularizationRequest && (
              <TimeRegularizationHistory
                show={historyModal.show}
                hide={handleCloseHistoryModal}
                data={historyData}
                isLoading={isLoading}
              />
            )}
          </>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
                  <i className="bi bi-journal-check fs-4"></i>
                </div>
                <div className="flex-fill ms-4">
                  <div className="">
                    <strong>Pending Task</strong>
                  </div>
                  <div>{count && <h5 className="mb-0 ">{count.pendingTask}</h5>}</div>
                </div>
                <a title="view-members" className="btn btn-link text-decoration-none  rounded-1">
                  <i className="icofont-hand-drawn-right fs-2 text-white"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
                  <i className="bi bi-journal-check fs-4"></i>
                </div>
                <div className="flex-fill ms-4">
                  <div className="">
                    <strong>Working Task</strong>
                  </div>
                  <div>{count && <h5 className="mb-0 ">{count.workingTask}</h5>}</div>
                </div>
                <a title="view-members" className="btn btn-link text-decoration-none  rounded-1">
                  <i className="icofont-hand-drawn-right fs-2 text-white"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
                  <i className="bi bi-journal-check fs-4"></i>
                </div>
                <div className="flex-fill ms-4">
                  <div className="">
                    <strong>Completed Task</strong>
                  </div>
                  <div>{count && <h5 className="mb-0 ">{count.completedTask}</h5>}</div>
                </div>
                <a title="view-members" className="btn btn-link text-decoration-none  rounded-1">
                  <i className="icofont-hand-drawn-right fs-2 text-white"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
                  <i className="bi bi-journal-check fs-4"></i>
                </div>
                <div className="flex-fill ms-4">
                  <div className="">
                    <strong>Total Task</strong>
                  </div>
                  <div>{count && <h5 className="mb-0 ">{count.totalTask}</h5>}</div>
                </div>
                <a title="view-members" className="btn btn-link text-decoration-none  rounded-1">
                  <i className="icofont-hand-drawn-right fs-2 text-white"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>{' '}
      <div className="row g-3 mb-3 row-deck mt-2">
        <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
          <div className="card">
            <div className="card-header border-bottom text-white bg-primary">
              <h5 className="">My Tasks</h5>
            </div>
            <div className="card-body p-0">
              <div className="flex-grow-1 task-list">
                {dailyTask &&
                  dailyTask.length > 0 &&
                  dailyTask.map((ele, index) => {
                    if (ele.time_status == 'STOP') {
                      return (
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: '#EBF5FB' }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                              <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                <h6 className="fw-bold mb-0 small-14" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + '....'}
                                </h6>
                              </Link>
                            </div>
                          </div>
                          {ele.status !== 'COMPLETED' && (
                            <button
                              type="button"
                              className="task-button"
                              title="Stop Task"
                              onClick={(e) => handleTimer(e, ele.ticket_id, ele.id, 'STOP')}
                            >
                              <i className="icofont-ui-pause task-icon-stop"></i>
                            </button>
                          )}

                          {ele && ele.total_worked && (
                            <span className="badge bg-danger p-2 task-badge">
                              {ele.total_worked}
                            </span>
                          )}

                          {ele && ele.task_hours && (
                            <span className="badge bg-danger p-2 task-badge">{ele.task_hours}</span>
                          )}

                          {ele && ele && ele.status == 'TO_DO' ? (
                            <span className="badge bg-danger p-2 task-badge">{ele.status}</span>
                          ) : ele.status == 'IN_PROGRESS' ? (
                            <span className="badge bg-warning p-2 task-badge">{ele.status}</span>
                          ) : (
                            <span className="badge bg-success p-2 task-badge">{ele.status}</span>
                          )}
                          <div className="time-block text-truncate ">
                            {ele.priority === 'Very High' && (
                              <span className="badge bg-danger p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'High' && (
                              <span className="badge bg-warning p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Medium' && (
                              <span className="badge bg-info p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Low' && (
                              <span className="badge bg-success p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}

                {previousTask &&
                  dailyTask.length > 0 &&
                  dailyTask.map((ele, index) => {
                    if (ele.time_status == 'START') {
                      return (
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: '#EBF5FB' }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                              <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                {ele.task_name ? (
                                  <h6 className="fw-bold mb-0 small-14" title={ele.task_name}>
                                    {index + 1}. {ele.main_ticket_id}-
                                    {ele.task_name.length < 20
                                      ? ele.task_name
                                      : ele.task_name.substring(0, 20) + '....'}
                                  </h6>
                                ) : (
                                  'NO DATA'
                                )}
                              </Link>
                            </div>
                          </div>
                          {ele.status != 'COMPLETED' && (
                            <button
                              type="button"
                              className="task-butto"
                              title="Start Task"
                              onClick={(e) => handleTimer(e, ele.ticket_id, ele.id, 'START')}
                            >
                              <i className="icofont-ui-play task-icon-start"></i>
                            </button>
                          )}
                          {ele && ele && ele.status == 'TO_DO' ? (
                            <span className="badge bg-danger p-2 task-badge ">{ele.status}</span>
                          ) : ele.status == 'IN_PROGRESS' ? (
                            <span className="badge bg-warning p-2 task-badge ">{ele.status}</span>
                          ) : (
                            <span className="badge bg-success p-2 task-badge ">{ele.status}</span>
                          )}

                          <div className="time-block text-truncate">
                            {ele.priority === 'Very High' && (
                              <span className="badge bg-danger p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'High' && (
                              <span className="badge bg-danger p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Medium' && (
                              <span className="badge bg-info p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Low' && (
                              <span className="badge bg-success p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
          <div className="card ">
            <div className="card-header border-bottom bg-primary text-white">
              <h5 className="">Pending Tasks</h5>
            </div>
            <div className="card-body p-0">
              <div
                className="flex-grow-1 task-list"
                // style={{ height: "250px", overflowY: "scroll" }}
              >
                {previousTask &&
                  previousTask.length > 0 &&
                  previousTask.map((ele, index) => {
                    if (ele.time_status == 'STOP') {
                      return (
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap task-item-stop"
                          // style={{ backgroundColor: "#EBF5FB" }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                              <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                <h6 className="fw-bold mb-0 small-14" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + '....'}
                                </h6>
                              </Link>
                            </div>
                          </div>

                          {ele.status != 'COMPLETED' && (
                            <button
                              type="button"
                              className="task-button"
                              title="Stop Task"
                              onClick={(e) => handleTimer(e, ele.ticket_id, ele.id, 'STOP')}
                            >
                              <i className="icofont-ui-pause task-icon-stop"></i>
                            </button>
                          )}

                          {ele && ele.total_worked && (
                            <span className="badge bg-danger p-2 task-badge">
                              {ele.total_worked}
                            </span>
                          )}

                          {ele && ele.task_hours && (
                            <span className="badge bg-danger p-2 task-badge">{ele.task_hours}</span>
                          )}

                          {ele && ele && ele.status == 'TO_DO' ? (
                            <span className="badge bg-danger p-2 task-badge">{ele.status}</span>
                          ) : ele.status == 'IN_PROGRESS' ? (
                            <span className="badge bg-warning p-2 task-badge">{ele.status}</span>
                          ) : (
                            <span className="badge bg-success p-2 task-badge">{ele.status}</span>
                          )}
                          <span className="badge bg-primary p-2 task-badge">{ele.end_date}</span>

                          <div className="time-block text-truncate  ">
                            {ele.priority === 'Very High' && (
                              <span className="badge bg-danger task-priority">{ele.priority}</span>
                            )}

                            {ele.priority === 'High' && (
                              <span className="badge bg-danger p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Medium' && (
                              <span className="badge bg-info p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Low' && (
                              <span className="badge bg-success p-2 task-priority">
                                {ele.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}

                {previousTask &&
                  previousTask.length > 0 &&
                  previousTask.map((ele, index) => {
                    if (ele.time_status == 'START') {
                      return (
                        <div className="py-2 text-white d-flex align-items-center border-bottom flex-wrap task-item-start">
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                              <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                <h6 className="fw-bold mb-0 small-14" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + '....'}
                                </h6>
                              </Link>
                            </div>
                          </div>
                          {ele.status != 'COMPLETED' && (
                            <button
                              type="button"
                              className="task-button"
                              title="Start Task"
                              onClick={(e) => handleTimer(e, ele.ticket_id, ele.id, 'START')}
                            >
                              <i className="icofont-ui-play task-icon-start"></i>
                            </button>
                          )}
                          {ele && ele && ele.status == 'TO_DO' ? (
                            <span className="badge bg-danger p-2 task-status">{ele.status}</span>
                          ) : ele.status == 'IN_PROGRESS' ? (
                            <span className="badge bg-warning p-2 task-status">{ele.status}</span>
                          ) : (
                            <span className="badge bg-success p-2 task-status">{ele.status}</span>
                          )}
                          <span className="badge bg-primary p-2 task-status">{ele.end_date}</span>
                          <div className="time-block text-truncate">
                            {ele.priority === 'Very High' && (
                              <span className="badge bg-danger p-2 " style={{ width: '80px' }}>
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'High' && (
                              <span className="badge bg-danger p-2" style={{ width: '80px' }}>
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Medium' && (
                              <span className="badge bg-info p-2" style={{ width: '80px' }}>
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Low' && (
                              <span className="badge bg-success p-2" style={{ width: '80px' }}>
                                {ele.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-3 row-deck ">
        <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
          <div className="card ">
            <div className="card-header border-bottom text-white bg-primary">
              <h5 className=" ">Work Analysis</h5>
            </div>
            <div className="card-body p-0">
              <div className="flex-grow-1 task-list">
                {chartData && chartData.series && (
                  <Chart
                    options={chartData.options}
                    series={chartData?.series}
                    type="donut"
                    height="250"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
          <div className="card ">
            <div className="card-header border-bottom bg-primary text-white">
              <h5 className="">Upcoming Tasks</h5>
            </div>
            <div className="card-body p-0">
              <div className="flex-grow-1 task-list">
                {upcomingTask &&
                  upcomingTask.map((ele, index) => {
                    if (ele.time_status == 'STOP') {
                      return (
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: '#EBF5FB' }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                              <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                <h6 className="fw-bold mb-0 small-14">
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + '....'}
                                </h6>
                              </Link>
                            </div>
                          </div>
                          {ele.status != 'COMPLETED' && (
                            <button
                              type="button"
                              className="task-button"
                              title="Stop Task"
                              onClick={(e) => handleTimer(e, ele.ticket_id, ele.id, 'STOP')}
                            >
                              <i className="icofont-ui-pause task-icon-stop"></i>
                            </button>
                          )}
                          {ele && ele && ele.status == 'TO_DO' ? (
                            <span className="badge bg-danger p-2 task-badge">{ele.status}</span>
                          ) : ele.status == 'IN_PROGRESS' ? (
                            <span className="badge bg-warning p-2 task-badge">{ele.status}</span>
                          ) : (
                            <span className="badge bg-success p-2 task-badge">{ele.status}</span>
                          )}
                          <span className="badge bg-primary p-2 task-badge">{ele.end_date}</span>
                          <div className="time-block text-truncate">
                            {ele.priority === 'Very High' && (
                              <span className="badge bg-danger p-2">{ele.priority}</span>
                            )}
                            {ele.priority === 'High' && (
                              <span className="badge bg-danger p-2">{ele.priority}</span>
                            )}
                            {ele.priority === 'Medium' && (
                              <span className="badge bg-info p-2">{ele.priority}</span>
                            )}
                            {ele.priority === 'Low' && (
                              <span className="badge bg-success p-2">{ele.priority}</span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}

                {upcomingTask &&
                  upcomingTask.map((ele, index) => {
                    if (ele.time_status == 'START') {
                      return (
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: '#EBF5FB' }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                              <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                <h6 className="fw-bold mb-0 small-14" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + '....'}
                                </h6>
                              </Link>
                            </div>
                          </div>
                          {ele.status != 'COMPLETED' && (
                            <button
                              type="button"
                              className="task-button"
                              title="Start Task"
                              onClick={(e) => handleTimer(e, ele.ticket_id, ele.id, 'START')}
                            >
                              <i className="icofont-ui-play task-icon-start"></i>
                            </button>
                          )}
                          {ele && ele && ele.status == 'TO_DO' ? (
                            <span className="badge bg-danger p-2 task-badge">{ele.status}</span>
                          ) : ele.status == 'IN_PROGRESS' ? (
                            <span className="badge bg-warning p-2 task-badge">{ele.status}</span>
                          ) : (
                            <span className="badge bg-success p-2 task-badge">{ele.status}</span>
                          )}
                          <span className="badge bg-primary p-2 task-badge">{ele.end_date}</span>
                          <div className="time-block text-truncate">
                            {ele.priority === 'Very High' && (
                              <span className="badge bg-danger p-2" style={{ width: '80px' }}>
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'High' && (
                              <span className="badge bg-danger p-2" style={{ width: '80px' }}>
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Medium' && (
                              <span className="badge bg-info p-2" style={{ width: '80px' }}>
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === 'Low' && (
                              <span className="badge bg-success p-2" style={{ width: '80px' }}>
                                {ele.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
