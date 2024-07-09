import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { _base } from '../../../../settings/constants';
import Avatar from 'react-avatar';
import { Dropdown } from 'react-bootstrap';
import SubtaskModal from './SubtaskModal';
import TaskHistoryModal from './TaskHistoryModal';
import RequestModal from './RequestModal';
import GroupActivityModal from './GroupActivityModal';
import TaskRegularizationModal from './TaskRegularizationModal';
import {
  postTimerData,
  getRegularizationTimeData
} from '../../../../services/TicketService/TaskService';
import * as time from '../../../../components/Utilities/Functions';
import ModuleSetting from '../../../../services/SettingService/ModuleSetting';

import { getTaskPlanner } from '../../../../services/TicketService/TaskService';
import PlannerModal from './PlannerModal';

export default function TaskData(props) {
  var priorityColor = 'bg-default';
  const data = props?.data;
  const date = props.date;
  const isRegularisedData = props.data.regularized_data;
  const allData = props;

  const [loading, setLoading] = useState(false);

  if (data.priority === 'High') {
    priorityColor = 'bg-danger';
  }
  if (data.priority === 'Medium') {
    priorityColor = 'bg-warning';
  }
  if (data.priority === 'Low') {
    priorityColor = 'bg-success';
  }
  if (data.priority === 'Very High') {
    priorityColor = 'bg-danger';
  }

  // if((taskOwners.filter((d)=>d.is_started === "YES")) && userSessionData.id == taskOwners.filter((d)=>d.id))

  //Timer
  const [timerState, setTimerState] = useState(props.data.time_status);
  const handleTimer = async (e) => {
    var data = {
      tenant_id: localStorage.getItem('tenant_id'),
      ticket_id: props.data.ticket_id,
      ticket_basket_id: props.data.ticket_basket_id,
      ticket_task_id: props.data.id,
      user_id: localStorage.getItem('id'),
      status: timerState,
      time: time.getDateTime()
    };
    setLoading(true);

    await postTimerData(data).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setTimerState(res.data.data);
          // window.location.reload(true)
          setLoading(false);
          loadBasket();
        } else {
          // alert('Failed')
        }
      }
    });
  };

  const [moduleSetting, setModuleSetting] = useState();

  const loadData = async () => {
    await new ModuleSetting().getSettingByName('Ticket', 'Task').then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setModuleSetting(res.data.data);
        }
      }
    });
  };

  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [plannerData, setPlannerData] = useState(null);
  const handleShowPlannerModal = async (
    taskId,
    ticket_basket_id,
    ticket_id
  ) => {
    if (taskId) {
      await getTaskPlanner(taskId).then((res) => {
        if (res.status === 200) {
          setPlannerData(null);
          setPlannerData({
            taskId: taskId,
            ticket_basket_id: ticket_basket_id,
            ticket_id: ticket_id,
            data: res.data.data
          });
        }
      });
    }
    setShowPlannerModal(true);
  };

  const handleClosePlannerModal = () => {
    setShowPlannerModal(false);
  };

  //SUBTASK MANAGEMENT
  const [subtaskModal, setSubtaskModal] = useState(false);
  const handleSubtaskModal = (e) => {
    setSubtaskModal((prev) => !prev);
  };

  const [taskHistoryModal, setTaskHistoryModal] = useState(false);
  const handleTaskHistoryModal = (e) => {
    setTaskHistoryModal((prev) => !prev);
  };

  const [taskRegularizationModal, setTaskRegularizationModal] = useState(false);
  const handleTaskRegularizationModal = (e) => {
    setTaskRegularizationModal((prev) => !prev);
  };

  //Group Activity
  const [showGroupActivityModal, setShowGroupActivityModal] = useState(false);
  const showGroupActivity = (e, taskOwners, taskId, dataa) => {
    setShowGroupActivityModal(true);
  };

  const hideGroupActivity = (e, taskOwners, taskId, dataa) => {
    setShowGroupActivityModal(false);
  };

  //Reqeust Time
  const [requestModal, setRequestModal] = useState(false);
  const handleRequestModal = (e) => {
    setRequestModal((prev) => !prev);
  };

  const handleCloseRequestModal = () => {
    setRequestModal(false);
  };

  const loadBasket = () => {
    props.loadBasket();
  };

  const [regularizeTimeData, setRegularizeTimeData] = useState([]);

  const RegularizaLoadData = () => {
    new getRegularizationTimeData(props.data.ticket_id, props.data.id).then(
      (res) => {
        if (res.data.data) {
          setRegularizeTimeData(res.data.data);
        }
      }
    );
  };
  useEffect(() => {
    loadData();

    setTimerState(null);
    if (
      props.data.time_status === 'START' ||
      props.data.time_status === 'Start'
    ) {
      setTimerState('START');
    } else if (
      props.data.time_status === 'STOP' ||
      props.data.time_status === 'Stop'
    ) {
      setTimerState('STOP');
    } else {
      setTimerState('START');
    }
  }, []);
  return (
    <div
      className="dd-handle mt-2"
      style={{
        borderRadius: '10px',
        boxShadow: '13px 13px 21px -8px rgba(89,89,89,1)'
      }}
    >
      <div className="task-info d-flex align-items-center justify-content-between p-0">
        {data.priority && (
          <span className={`badge ${priorityColor} text-end `}>
            {data.priority}
          </span>
        )}
        {data.status && (
          <span className={`badge bg-info text-end `}>
            {data.status.split('_').join(' ')}
          </span>
        )}

        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {data.status === 'COMPLETED' ? (
            <button
              type="button"
              className="btn btn-outline-secondary p-1 px-2"
              onClick={(e) => {
                props.onShowTaskModal(
                  data.ticket_id,
                  data.ticket_basket_id,
                  data.id
                );
              }}
            >
              <i className="icofont-eye-alt text-primary"></i>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-secondary p-1 px-2"
              onClick={(e) => {
                props.onShowTaskModal(
                  data.ticket_id,
                  data.ticket_basket_id,
                  data.id
                );
              }}
            >
              <i className="icofont-edit text-success" />
            </button>
          )}
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-1">
        <div className="lesson_name">
          {data.status !== 'COMPLETED' && (
            <h6 className="mb-0 fw-bold fs-6 mb-2" style={{ fontSize: '10px' }}>
              {' '}
              {data?.task_name?.length < 50
                ? data.task_name
                : data.task_name.substring(0, 40) + '....'}
            </h6>
          )}
          {data.status === 'COMPLETED' && (
            <strike>
              <h6 className="mb-0 fw-bold  fs-6  mb-2">
                {data?.task_name?.length < 50
                  ? data.task_name
                  : data.task_name.substring(0, 40) + '....'}
              </h6>
            </strike>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-start">
        {data?.taskOwners &&
          data.taskOwners.length > 7 &&
          data.taskOwners
            .filter((d, i) => i < 7)
            .map((name, i) => {
              return (
                <Avatar
                  name={name.taskOwnerName}
                  size="30"
                  round={true}
                  textSizeRatio={1.2}
                  title={name.taskOwnerName}
                  key={i}
                />
              );
            })}
        {data.taskOwners && data.taskOwners.length > 7 && (
          <p className="pl-2">Show More</p>
        )}

        {data.taskOwners &&
          data.taskOwners.length < 7 &&
          data.taskOwners.map((name, i) => {
            return (
              <Avatar
                name={name.taskOwnerName}
                size="30"
                round={true}
                textSizeRatio={1.2}
                title={name.taskOwnerName}
                key={i}
              />
            );
          })}
      </div>

      <div className="d-flex justify-content-between mt-1">
        {props.data.taskOwnersId &&
          props.data.taskOwnersId.indexOf(
            parseInt(localStorage.getItem('id'))
          ) >= 0 &&
          props.data.type === 'TASK' &&
          props.data.status !== 'COMPLETED' && (
            <div>
              {(timerState === 'START' || timerState == null) && (
                <button
                  type="button"
                  style={{
                    border: 'none',
                    borderRadius: '25%',
                    height: '35px',
                    width: '35px',
                    textAlign: 'center',
                    margin: '0px',
                    padding: '0px'
                  }}
                  title="Start Task"
                  onClick={handleTimer}
                >
                  {loading ? (
                    <span>
                      <i className="fa fa-spinner fa-spin" />
                    </span>
                  ) : (
                    <i
                      className="icofont-ui-play"
                      style={{
                        fontSize: '20px',
                        color: '#1ABC9C',
                        margin: 'auto'
                      }}
                    ></i>
                  )}
                </button>
              )}

              {(timerState === 'STOP' || timerState == null) && (
                <button
                  type="button"
                  style={{
                    border: 'none',
                    borderRadius: '25%',
                    height: '35px',
                    width: '35px',
                    textAlign: 'center',
                    margin: '0px',
                    padding: '0px'
                  }}
                  title="Start Task"
                  onClick={handleTimer}
                >
                  {loading ? (
                    <span>
                      <i className="fa fa-spinner fa-spin" />
                    </span>
                  ) : (
                    <i
                      className="icofont-ui-pause"
                      style={{
                        fontSize: '20px',
                        color: '#EC7063',
                        margin: 'auto'
                      }}
                    ></i>
                  )}
                </button>
              )}
            </div>
          )}

        {props.data.type === 'GROUP_ACTIVITY' &&
          props.data.status !== 'COMPLETED' && (
            <div>
              {(timerState === 'START' || timerState == null) && (
                <button
                  type="button"
                  style={{
                    border: 'none',
                    borderRadius: '25%',
                    height: '35px',
                    width: '35px',
                    textAlign: 'center',
                    margin: '0px',
                    padding: '0px'
                  }}
                  disabled={
                    !props?.data?.taskOwners.some(
                      (owner) =>
                        owner.id === parseInt(sessionStorage.getItem('id'), 10)
                    )
                  }
                  title="Start Group Activity Task"
                  onClick={(e) =>
                    showGroupActivity(
                      e,
                      props.data.taskOwners,
                      props.data.id,
                      props.data
                    )
                  }
                >
                  <i
                    className="icofont-ui-play"
                    style={{
                      fontSize: '20px',
                      color: '#1ABC9C',
                      margin: 'auto'
                    }}
                  ></i>
                </button>
              )}
              {(timerState === 'STOP' || timerState == null) && (
                <button
                  type="button"
                  style={{
                    border: 'none',
                    borderRadius: '25%',
                    height: '35px',
                    width: '35px',
                    textAlign: 'center',
                    margin: '0px',
                    padding: '0px'
                  }}
                  title="Stop Group Activity"
                  onClick={(e) =>
                    showGroupActivity(
                      e,
                      props.data.taskOwners,
                      props.data.id,
                      props.data
                    )
                  }
                >
                  <i
                    className="icofont-ui-pause"
                    style={{
                      fontSize: '20px',
                      color: '#EC7063',
                      margin: 'auto'
                    }}
                  ></i>
                </button>
              )}
            </div>
          )}

        <div className="d-flex flex-column text-center">
          <span
            className="badge text-end p-1"
            style={{ backgroundColor: '#6495ED' }}
          >
            Total Worked
          </span>
          <div className="bd-highlight" style={{ fontSize: '12px' }}>
            <b>{data.total_worked ? data.total_worked : 'Not Started'}</b>
          </div>
        </div>

        {data.status === 'COMPLETED' ? (
          <>
            <Dropdown className="d-inline-flex m-1">
              <Dropdown.Toggle
                as="button"
                variant=""
                id={`${'dropdown-basic_' + data.id}`}
                className="btn btn-outline-primary p-1"
              >
                <i className="icofont-navigation-menu"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu as="ul" className="border-0 shadow p-2">
                <li onClick={handleSubtaskModal}>
                  <button className="btn btn-sm btn-info text-white w-100">
                    <i className="icofont-listing-number"></i> Subtask
                  </button>
                </li>
                {props.data.time_status !== 'STOP' &&
                  props.data.RegularizationAuthority === 'Yes' && (
                    <li
                      onClick={(e) => {
                        handleRequestModal();
                        RegularizaLoadData();
                      }}
                    >
                      {data &&
                        data.taskOwners.map((d) => {
                          if (d.id === localStorage.getItem('id')) {
                            return (
                              <button
                                className="btn btn-sm text-white w-100"
                                style={{ backgroundColor: '#d63384' }}
                              >
                                <i className="icofont-listing-number"></i> Time
                                Regularization
                              </button>
                            );
                          }
                        })}
                    </li>
                  )}
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : (
          <Dropdown className="d-inline-flex m-1" onClick={loadData}>
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${'dropdown-basic_' + data.id}`}
              className="btn btn-outline-primary p-1"
            >
              <i className="icofont-navigation-menu"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-3">
              {moduleSetting && moduleSetting['Planner'] === 1 && (
                <li
                  onClick={(e) =>
                    handleShowPlannerModal(
                      props.data.id,
                      props.data.ticket_basket_id,
                      props.data.ticket_id
                    )
                  }
                >
                  <button className="btn btn-sm btn-primary text-white w-100">
                    <i className="icofont-calendar"></i> Planner
                  </button>
                </li>
              )}
              {props && props.isReviewer === 0 && (
                <li>
                  <Link
                    to={
                      `/${_base}/TestCases/` +
                      data.ticket_id +
                      '/' +
                      props.data.id
                    }
                  >
                    <button className="btn btn-sm btn-warning text-white w-100">
                      <i className="icofont-files-stack"></i> Test Cases
                    </button>
                  </Link>
                </li>
              )}
              {props && (
                <li>
                  <Link
                    to={
                      `/${_base}/TestCasesReviewerView/` +
                      data.ticket_id +
                      '/' +
                      props.data.id
                    }
                  >
                    <button className="btn btn-sm btn-primary text-white w-100">
                      <i className="icofont-files-stack"></i> Test Cases Review
                    </button>
                  </Link>
                </li>
              )}

              <li onClick={handleSubtaskModal}>
                <button className="btn btn-sm btn-info text-white w-100">
                  <i className="icofont-listing-number"></i> Subtask
                </button>
              </li>

              {props.data.time_status !== 'STOP' && (
                <li
                  onClick={(e) => {
                    handleRequestModal();
                    RegularizaLoadData();
                  }}
                >
                  {data &&
                    data.taskOwners.map((d) => {
                      if (
                        parseInt(d.id) === parseInt(localStorage.getItem('id'))
                      ) {
                        return (
                          <button
                            className="btn btn-sm text-white w-100"
                            style={{ backgroundColor: '#d63384' }}
                          >
                            <i className="icofont-listing-number"></i> Time
                            Regularization
                          </button>
                        );
                      }
                    })}
                </li>
              )}

              <li onClick={handleTaskHistoryModal}>
                <button className="btn btn-sm btn-primary text-white w-100">
                  <i className="icofont-listing-number"></i> Task History
                </button>
              </li>
              <li onClick={handleTaskRegularizationModal}>
                <button className="btn btn-sm btn-danger text-white w-100">
                  <i className="icofont-listing-number"></i> Task Regularization
                </button>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      {showPlannerModal && (
        <PlannerModal
          show={handleShowPlannerModal}
          handleClose={handleClosePlannerModal}
          plannerData={plannerData}
          moduleSetting={moduleSetting}
        />
      )}
      {subtaskModal && (
        <SubtaskModal
          taskId={data.id}
          ticketId={data.ticket_id}
          show={subtaskModal}
          data={data}
          hide={handleSubtaskModal}
        />
      )}

      {requestModal && (
        <RequestModal
          taskId={data.id}
          date={date}
          ticketId={data.ticket_id}
          data={data}
          isRegularisedData={isRegularisedData}
          show={requestModal}
          taskData={loadBasket}
          hide={handleRequestModal}
          regularizeTimeData={regularizeTimeData}
          close={handleCloseRequestModal}
        />
      )}

      {taskHistoryModal && (
        <TaskHistoryModal
          taskId={data.id}
          show={taskHistoryModal}
          data={data}
          hide={handleTaskHistoryModal}
        />
      )}

      {taskRegularizationModal && (
        <TaskRegularizationModal
          taskId={data.id}
          ticketId={data.ticket_id}
          data={data}
          allData={allData}
          show={taskRegularizationModal}
          hide={handleTaskRegularizationModal}
        />
      )}

      <GroupActivityModal
        data={data}
        show={showGroupActivityModal}
        hide={hideGroupActivity}
        loadBasket={loadBasket}
      />
    </div>
  );
}
