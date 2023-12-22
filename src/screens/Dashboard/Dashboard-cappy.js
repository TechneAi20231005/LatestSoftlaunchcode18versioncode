import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import { getData } from "../../services/DashboardService";
import Chart from "react-apexcharts";
// import dateFormat from "dateformat";
import { awsData } from "../../components/Data/test.json";
import * as time from "../../components/Utilities/Functions";
import {
  postTimerData,
  deleteTask,
} from "../../services/TicketService/TaskService";
import Collapse from "react-bootstrap/Collapse";
import ListGroup from "react-bootstrap/ListGroup";

export default function HrDashboard(props, ele) {
  const data = props.data;
  var v1 = 50;
  var v2 = 50;
  const [count, setCount] = useState();
  const [dailyTask, setDailyTask] = useState();
  const [upcomingTask, setUpcomingTask] = useState();
  const [previousTask, setPreviousTask] = useState();
  const [totalTask, setTotalTask] = useState();
  const [completedTask, setCompletedTask] = useState();

  const [isPendingTaskOpen, setPendingTaskOpen] = useState(false);
  const [isWorkingTaskOpen, setWorkingTaskOpen] = useState(false);
  const [isTotalTaskOpen, setTotalTaskOpen] = useState(false);
  const [isCompleteTaskOpen, setCompleteTaskOpen] = useState(false);

  const handlePendingTaskToggle = () => {
    setPendingTaskOpen(!isPendingTaskOpen);
  };

  const handleWorkingTaskToggle = () => {
    setWorkingTaskOpen(!isWorkingTaskOpen);
  };
  const handleTotalTaskToggle = () => {
    setTotalTaskOpen(!isTotalTaskOpen);
  };

  const handleCompleteTask = () => {
    setCompleteTaskOpen(!isCompleteTaskOpen);
  };

  const [chartData, setChartData] = useState({
    series: [
      {
        data: []
      }
    ],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        }
      }
    },
    chart: {
      height: "400",
      type: "bar"
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '15%',
        endingShape: 'rounded'
      }
    },
    // xaxis: {
    //   categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    // },
    options: {
      chart: {
        height: 350
      },
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      colors: ["#237E1B", "#FBFBFB"], // Default colors for all bars

      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val === 0 ? '' : val;
        }
      }
    }
  });
  


  const [radarData, setRadarData]= useState({
    options: {
      chart: {
          type: 'polarArea',
          dropShadow: {
              enabled: true,
              blur: 1,
              left: 1,
              top: 1
          }
      },

      colors: ['#ffd55d', '#0d6efd', '#ff7f81'],
      stroke: {
          width: 0
      },
      fill: {
          opacity: 1
      },
      markers: {
          size: 0
      },
      labels: ['2011', '2012', '2013', '2014', '2015', '2016']
  },
  responsive: [{
    breakpoint: 380,
    options: {
      chart: {
        width: 100
      },
      legend: {
        position: 'bottom'
      }
    }
  }],
  series: [80, 50, 30, 40, 100, 20],


  })

  

  async function get() {
    await getData(localStorage.getItem("id")).then((res) => {
      if (res.status === 200 && res.data.status === 1) {
        setCount(res.data.data.count);
        setDailyTask(res.data.data.dailyTask);
        setPreviousTask(res.data.data.previousTask);
        setUpcomingTask(res.data.data.upcomingTask);
        setTotalTask(res.data.data.totalTask);
        setCompletedTask(res.data.completeTask);
  
        setChartData(prevData => {
          return {
            ...prevData,
            options: {
              ...prevData.options,
              colors: ["#237E1B", "#FBFBFB", "#FF0000", "#0000FF", "#FFFF00"] // Assigning colors for each bar
            },
            series: [{
              data: [res.data.data.pieCharData.pendingTask, res.data.data.pieCharData.workingTask, res.data.data.pieCharData.completedTask, 4, 5,6,7,8,9]

            }],
           
          };
        });
      }
    });
  
  }

  const [timerState, setTimerState] = useState();

  const handleTimer = async (e, ticket_id, ticket_task_id, status) => {
    var data = {
      tenant_id: localStorage.getItem("tenant_id"),
      ticket_id: ticket_id,
      ticket_task_id: ticket_task_id,
      user_id: localStorage.getItem("id"),
      status: status,
      time: time.getDateTime(),
    };

    await postTimerData(data).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          get();
        } else {
          alert("Failed");
        }
      }
    });
  };



  useEffect(() => {
    get();
  }, []);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Dashboard" />
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
                    <strong style={{ fontSize: "12px" }}>Pending Task</strong>
                  </div>
                  <div>
                    {count && <h5 className="mb-0 ">{count.pendingTask}</h5>}
                  </div>
                </div>
                <a
                  title="view-members"
                  className="btn btn-link text-decoration-none  rounded-1"
                >
                  <button
                    onClick={(e) => handlePendingTaskToggle()}
                    className="btn btn-outline-warning btn-sm "
                    aria-controls="pendingTaskCollapse"
                    aria-expanded={isPendingTaskOpen}
                  >
                    <i className="icofont-hand-drawn-right fs-2 text-white"></i>
                  </button>
                </a>
              </div>
              {previousTask &&
                previousTask.length > 0 &&
                previousTask.map((ele, index) => {
                  return (
                    <Collapse
                      in={isPendingTaskOpen}
                      id="pendingTaskCollapse"
                      className="mt-2"
                    >
                      <div key={ele.id}>
                        <ListGroup
                          className="list-group mb-2"
                          style={{ textAlign: "left" }}
                        >
                          <Link to={`Ticket/Task/${ele.ticket_id}`}>
                            <ListGroup.Item>
                              {" "}
                              <h6
                                className="fw-bold mb-0 small-14"
                                title={ele.task_name}
                              >
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 20
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 20) + "...."}
                              </h6>{" "}
                            </ListGroup.Item>
                          </Link>
                        </ListGroup>
                      </div>
                    </Collapse>
                  );
                })}
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
                    <strong style={{ fontSize: "12px" }}>Working Task</strong>
                  </div>
                  <div>
                    {count && <h5 className="mb-0 ">{count.workingTask}</h5>}
                  </div>
                </div>
                <a
                  title="view-members"
                  className="btn btn-link text-decoration-none  rounded-1"
                >
                  <button
                    onClick={(e) => handleWorkingTaskToggle()}
                    className="btn btn-outline-warning btn-sm "
                    aria-controls="workingTaskCollapse"
                    aria-expanded={setWorkingTaskOpen}
                  >
                    <i className="icofont-hand-drawn-right fs-2 text-white"></i>
                  </button>
                </a>
              </div>

              {dailyTask &&
                dailyTask.length > 0 &&
                dailyTask.map((ele, index) => {
                  return (
                    <Collapse
                      in={isWorkingTaskOpen}
                      id="workingTaskCollapse"
                      className="mt-2"
                    >
                      <div key={ele.id}>
                        <ListGroup
                          className="list-group mb-2"
                          style={{ textAlign: "left" }}
                        >
                          <Link to={`Ticket/Task/${ele.ticket_id}`}>
                            <ListGroup.Item>
                              {" "}
                              <h6
                                className="fw-bold mb-0 small-14"
                                title={ele.task_name}
                              >
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 20
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 20) + "...."}
                              </h6>{" "}
                            </ListGroup.Item>
                          </Link>
                        </ListGroup>
                      </div>
                    </Collapse>
                  );
                })}
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
                    <strong style={{ fontSize: "12px" }}>Completed Task</strong>
                  </div>
                  <div>
                    {count && <h5 className="mb-0 ">{count.completedTask}</h5>}
                  </div>
                </div>
                <a
                  title="view-members"
                  className="btn btn-link text-decoration-none  rounded-1"
                >
                  <button
                    onClick={(e) => handleCompleteTask()}
                    className="btn btn-outline-warning btn-sm "
                    aria-controls="workingTaskCollapse"
                    aria-expanded={setCompleteTaskOpen}
                  >
                    <i className="icofont-hand-drawn-right fs-2 text-white"></i>
                  </button>
                </a>
              </div>

              {completedTask &&
                completedTask.length > 0 &&
                completedTask.map((ele, index) => {
                  return (
                    <Collapse
                      in={isCompleteTaskOpen}
                      id="workingTaskCollapse"
                      className="mt-2"
                    >
                      <div key={ele.id}>
                        <ListGroup
                          className="list-group mb-2"
                          style={{ textAlign: "left" }}
                        >
                          <Link to={`Ticket/Task/${ele.ticket_id}`}>
                            <ListGroup.Item>
                              {" "}
                              <h6
                                className="fw-bold mb-0 small-14"
                                title={ele.task_name}
                              >
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 20
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 20) + "...."}
                              </h6>{" "}
                            </ListGroup.Item>
                          </Link>
                        </ListGroup>
                      </div>
                    </Collapse>
                  );
                })}
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
                    <strong style={{ fontSize: "12px" }}>Total Task</strong>
                  </div>
                  <div>
                    {count && <h5 className="mb-0 ">{count.totalTask}</h5>}
                  </div>
                </div>
                <a
                  title="view-members"
                  className="btn btn-link text-decoration-none  rounded-1"
                >
                  <button
                    // onClick={(e) => handleTotalTaskToggle()}
                    className="btn btn-outline-warning btn-sm "
                    aria-controls="workingTaskCollapse"
                    // aria-expanded={setTotalTaskOpen}
                  >
                    <i className="icofont-hand-drawn-right fs-2 text-white"></i>
                  </button>
                </a>
              </div>

              {totalTask &&
                totalTask.length > 0 &&
                totalTask.map((ele, index) => {
                  return (
                    <Collapse
                      in={isTotalTaskOpen}
                      id="workingTaskCollapse"
                      className="mt-2"
                    >
                      <div key={ele.id}>
                        <ListGroup
                          className="list-group mb-2"
                          style={{ textAlign: "left" }}
                        >
                          <Link to={`Ticket/Task/${ele.ticket_id}`}>
                            <ListGroup.Item>
                              {" "}
                              <h6
                                className="fw-bold mb-0 small-14"
                                title={ele.task_name}
                              >
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 20
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 20) + "...."}
                              </h6>{" "}
                            </ListGroup.Item>
                          </Link>
                        </ListGroup>
                      </div>
                    </Collapse>
                  );
                })}
            </div>
          </div>
        </div>
      </div>{" "}
      {/*ROW*/}
      <div className="row g-3 mb-3 row-deck mt-2">
      <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-4" style={{ borderRadius:"10px"}}>
          <div className="card  ">
            <div className="card-header border-bottom"                           
>
              <h5 className="fw-bold">Today's Tasks</h5>
            </div>
            <div className="card-body">
              <div
                className="flex-grow-1 mem-list"
                style={{ height: "350px", 
              
                }}
              >
                {dailyTask &&
                  dailyTask.length > 0 &&
                  dailyTask.map((ele, index) => {
                    if (ele.time_status == "STOP") {
                      return (
                        <div
                        key={ele.id}
                        className="py-1 text-white d-flex align-items-center border-bottom flex-wrap"
                      >
                    <div className="card " style={{ borderRadius: "10px",
                      boxShadow: "13px 13px 21px -8px rgba(89,89,89,1)", height:"70px"}}>
                        <div className="d-flex align-items-center flex-fill">
                          <div className="d-flex flex-column ps-1">
                            <Link to={`Ticket/Task/${ele.ticket_id}`}>
                              {ele && ele.priority == "Medium" && (
                              <h6 className="fw-bold mb-0 small-14 text-info" title={ele.task_name}>
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 40
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 40) + "...."}
                              </h6>
                              )}
                               {ele && ele.priority == "Veri High" && (
                              <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 40
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 40) + "...."}
                              </h6>
                              )}
                                {ele && ele.priority == "High" && (
                              <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 40
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 40) + "...."}
                              </h6>
                              )}
                                {ele && ele.priority == "Low" && (
                              <h6 className="fw-bold mb-0 small-14 text-success" title={ele.task_name}>
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 40
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 40) + "...."}
                              </h6>
                              )}
                            </Link>
                          </div>
                        </div>
                          <div className="card-body ">
                          <div className=" timeline ti-danger border-bottom ">
              
                            <div className="d-flex flex-wrap">
                              {/* Buttons */}
                              {ele.status !== "COMPLETED" && (
                                <button
                              
                                  type="button"
                                  style={{
                                    border: "none",
                                    height: "18px",
                                    width: "35px",
                                    padding: "0px",
                                    marginTop:"2px"
                                  }}
                                  title="Stop Task"
                                  onClick={(e) =>
                                    handleTimer(e, ele.ticket_id, ele.id, "STOP")
                                  }
                                >
                                  <i
                                    className="icofont-ui-pause"
                                    style={{
                                      fontSize: "15px",
                                      color: "#1ABC9C",
                                      margin: "0",
                                      height:"8px"
                                    }}
                                  ></i>
                                </button>
                              )}
              
                              {/* Badges */}
                              <div>
                                {ele && ele.status === "TO_DO" ? (
                                  <small style={{ width: "80px", marginRight:"1rem" }} className="badge bg-danger p-1">
                                    {ele.status}
                                  </small>
                                ) : ele.status === "IN_PROGRESS" ? (
                                  <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-warning p-1">
                                    {ele.status}
                                  </span>
                                ) : (
                                  <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-success p-1">
                                    {ele.status}
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="badge bg-primary p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                  {ele.end_date}
                                </span>
                              </div>
                              <div>
                                <span className="badge bg-primary p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                  {ele.end_}
                                </span>
                              </div>
                              {/* <div className="time-block text-truncate">
                                {ele.priority === "Very High" && (
                                  <span className="badge bg-danger p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                    {ele.priority}
                                  </span>
                                )}
                                {ele.priority === "High" && (
                                  <span className="badge bg-danger p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                    {ele.priority}
                                  </span>
                                )}
                                {ele.priority === "Medium" && (
                                  <span className="badge bg-info p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                    {ele.priority}
                                  </span>
                                )}
                                {ele.priority === "Low" && (
                                  <span className="badge bg-success p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                    {ele.priority}
                                  </span>
                                )}
                              </div> */}
                            </div>
                          </div>
                       </div>
                        </div>
                      </div>
                      );
                    }
                  })}

                {dailyTask &&
                  dailyTask.length > 0 &&
                  dailyTask.map((ele, index) => {
                    if (ele.time_status == "START") {
                      return (
                        <div
          key={ele.id}
          className="py-1 text-white d-flex align-items-center border-bottom flex-wrap"
        >
      <div className="card " style={{ borderRadius: "10px",
        boxShadow: "13px 13px 21px -8px rgba(89,89,89,1)", height:"70px"}}>
          <div className="d-flex align-items-center flex-fill">
            <div className="d-flex flex-column ps-1">
              <Link to={`Ticket/Task/${ele.ticket_id}`}>
                {ele && ele.priority == "Medium" && (
                <h6 className="fw-bold mb-0 small-14 text-info" title={ele.task_name}>
                  {index + 1}. {ele.main_ticket_id}-
                  {ele.task_name.length < 40
                    ? ele.task_name
                    : ele.task_name.substring(0, 40) + "...."}
                </h6>
                )}
                 {ele && ele.priority == "Veri High" && (
                <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                  {index + 1}. {ele.main_ticket_id}-
                  {ele.task_name.length < 40
                    ? ele.task_name
                    : ele.task_name.substring(0, 40) + "...."}
                </h6>
                )}
                  {ele && ele.priority == "High" && (
                <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                  {index + 1}. {ele.main_ticket_id}-
                  {ele.task_name.length < 40
                    ? ele.task_name
                    : ele.task_name.substring(0, 40) + "...."}
                </h6>
                )}
                  {ele && ele.priority == "Low" && (
                <h6 className="fw-bold mb-0 small-14 text-success" title={ele.task_name}>
                  {index + 1}. {ele.main_ticket_id}-
                  {ele.task_name.length < 40
                    ? ele.task_name
                    : ele.task_name.substring(0, 40) + "...."}
                </h6>
                )}
              </Link>
            </div>
          </div>
            <div className="card-body ">
            <div className=" timeline ti-danger border-bottom ">

              <div className="d-flex flex-wrap">
                {/* Buttons */}
                {ele.status !== "COMPLETED" && (
                  <button
                
                    type="button"
                    style={{
                      border: "none",
                      height: "18px",
                      width: "35px",
                      padding: "0px",
                      marginTop:"2px"
                    }}
                    title="Start Task"
                    onClick={(e) =>
                      handleTimer(e, ele.ticket_id, ele.id, "START")
                    }
                  >
                    <i
                      className="icofont-ui-play"
                      style={{
                        fontSize: "15px",
                        color: "#1ABC9C",
                        margin: "0",
                        height:"8px"
                      }}
                    ></i>
                  </button>
                )}

                {/* Badges */}
                <div>
                  {ele && ele.status === "TO_DO" ? (
                    <small style={{ width: "80px", marginRight:"1rem" }} className="badge bg-danger p-1">
                      {ele.status}
                    </small>
                  ) : ele.status === "IN_PROGRESS" ? (
                    <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-warning p-1">
                      {ele.status}
                    </span>
                  ) : (
                    <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-success p-1">
                      {ele.status}
                    </span>
                  )}
                </div>
                <div>
                  <span className="badge bg-primary p-1" style={{ width: "80px", marginRight:"1rem" }}>
                    {ele.end_date}
                  </span>
                </div>
                {/* <div className="time-block text-truncate">
                  {ele.priority === "Very High" && (
                    <span className="badge bg-danger p-1" style={{ width: "80px", marginRight:"1rem" }}>
                      {ele.priority}
                    </span>
                  )}
                  {ele.priority === "High" && (
                    <span className="badge bg-danger p-1" style={{ width: "80px", marginRight:"1rem" }}>
                      {ele.priority}
                    </span>
                  )}
                  {ele.priority === "Medium" && (
                    <span className="badge bg-info p-1" style={{ width: "80px", marginRight:"1rem" }}>
                      {ele.priority}
                    </span>
                  )}
                  {ele.priority === "Low" && (
                    <span className="badge bg-success p-1" style={{ width: "80px", marginRight:"1rem" }}>
                      {ele.priority}
                    </span>
                  )}
                </div> */}
              </div>
            </div>
         </div>
          </div>
        </div>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-4" >
          <div className="card" style={{backgroundColor:"#f3f3f3"}}>
            <div className="card-header"    style={{ borderBottom: "1px solid #000" }}                       
>
              <h5 className="fw-bold">Pending Tasks</h5>
            </div>
            <div className="card-body">
              <div
                className="flex-grow-1 mem-list"
                style={{ height: "350px", 
              
                }}
              >
                {previousTask &&
                  previousTask.length > 0 &&
                  previousTask.map((ele, index) => {
                    if (ele.time_status == "STOP") {
                      return (
                        <div
                        key={ele.id}
                        className="py-1 text-white d-flex align-items-center border-bottom flex-wrap"
                      >
                    <div className="card " style={{ borderRadius: "10px",
                      boxShadow: "13px 13px 21px -8px rgba(89,89,89,1)", height:"70px"}}>
                        <div className="d-flex align-items-center flex-fill">
                          <div className="d-flex flex-column ps-1">
                            <Link to={`Ticket/Task/${ele.ticket_id}`}>
                              {ele && ele.priority == "Medium" && (
                              <h6 className="fw-bold mb-0 small-14 text-info" title={ele.task_name}>
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 40
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 40) + "...."}
                              </h6>
                              )}
                               {ele && ele.priority == "Veri High" && (
                              <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 40
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 40) + "...."}
                              </h6>
                              )}
                                {ele && ele.priority == "High" && (
                              <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 40
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 40) + "...."}
                              </h6>
                              )}
                                {ele && ele.priority == "Low" && (
                              <h6 className="fw-bold mb-0 small-14 text-success" title={ele.task_name}>
                                {index + 1}. {ele.main_ticket_id}-
                                {ele.task_name.length < 40
                                  ? ele.task_name
                                  : ele.task_name.substring(0, 40) + "...."}
                              </h6>
                              )}
                            </Link>
                          </div>
                        </div>
                          <div className="card-body ">
                          <div className=" timeline ti-danger border-bottom ">
              
                            <div className="d-flex flex-wrap">
                              {/* Buttons */}
                              {ele.status !== "COMPLETED" && (
                                <button
                              
                                  type="button"
                                  style={{
                                    border: "none",
                                    height: "18px",
                                    width: "35px",
                                    padding: "0px",
                                    marginTop:"2px"
                                  }}
                                  title="Stop Task"
                                  onClick={(e) =>
                                    handleTimer(e, ele.ticket_id, ele.id, "STOP")
                                  }
                                >
                                  <i
                                    className="icofont-ui-pause"
                                    style={{
                                      fontSize: "15px",
                                      color: "#1ABC9C",
                                      margin: "0",
                                      height:"8px"
                                    }}
                                  ></i>
                                </button>
                              )}
              
                              {/* Badges */}
                              <div>
                                {ele && ele.status === "TO_DO" ? (
                                  <small style={{ width: "80px", marginRight:"1rem" }} className="badge bg-danger p-1">
                                    {ele.status}
                                  </small>
                                ) : ele.status === "IN_PROGRESS" ? (
                                  <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-warning p-1">
                                    {ele.status}
                                  </span>
                                ) : (
                                  <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-success p-1">
                                    {ele.status}
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="badge bg-primary p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                  {ele.end_date}
                                </span>
                              </div>

                              <span style={{   color:"black"}}className="fw-bold p-1">

                              {ele.total_worked} / {ele.task_hours+":00"}

                            </span>
                            </div>
                          </div>
                       </div>
                        </div>
                      </div>
                    );
                    }
                  })}

{previousTask &&
  previousTask.length > 0 &&
  previousTask.map((ele, index) => {
    if (ele.time_status === "START") {
      return (
        <div
          key={ele.id}
          className="py-1 text-white d-flex align-items-center border-bottom flex-wrap"
        >
      <div className="card " style={{ borderRadius: "10px",
        boxShadow: "13px 13px 21px -8px rgba(89,89,89,1)", height:"70px"}}>
          <div className="d-flex align-items-center flex-fill">
            <div className="d-flex flex-column ps-1">
              <Link to={`Ticket/Task/${ele.ticket_id}`}>
                {ele && ele.priority == "Medium" && (
                <h6 className="fw-bold mb-0 small-14 text-info" title={ele.task_name}>
                  {index + 1}. {ele.main_ticket_id}-
                  {ele.task_name.length < 40
                    ? ele.task_name
                    : ele.task_name.substring(0, 40) + "...."}
                </h6>
                )}
                 {ele && ele.priority == "Veri High" && (
                <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                  {index + 1}. {ele.main_ticket_id}-
                  {ele.task_name.length < 40
                    ? ele.task_name
                    : ele.task_name.substring(0, 40) + "...."}
                </h6>
                )}
                  {ele && ele.priority == "High" && (
                <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                  {index + 1}. {ele.main_ticket_id}-
                  {ele.task_name.length < 40
                    ? ele.task_name
                    : ele.task_name.substring(0, 40) + "...."}
                </h6>
                )}
                  {ele && ele.priority == "Low" && (
                <h6 className="fw-bold mb-0 small-14 text-success" title={ele.task_name}>
                  {index + 1}. {ele.main_ticket_id}-
                  {ele.task_name.length < 40
                    ? ele.task_name
                    : ele.task_name.substring(0, 40) + "...."}
                </h6>
                )}
              </Link>
            </div>
          </div>
            <div className="card-body ">
            <div className=" timeline ti-danger border-bottom ">

              <div className="d-flex flex-wrap">
                {/* Buttons */}
                {ele.status !== "COMPLETED" && (
                  <button
                
                    type="button"
                    style={{
                      border: "none",
                      height: "18px",
                      width: "35px",
                      padding: "0px",
                      marginTop:"2px"
                    }}
                    title="Start Task"
                    onClick={(e) =>
                      handleTimer(e, ele.ticket_id, ele.id, "START")
                    }
                  >
                    <i
                      className="icofont-ui-play"
                      style={{
                        fontSize: "15px",
                        color: "#1ABC9C",
                        margin: "0",
                        height:"8px"
                      }}
                    ></i>
                  </button>
                )}

                {/* Badges */}
                <div>
                  {ele && ele.status === "TO_DO" ? (
                    <small style={{ width: "80px", marginRight:"1rem" }} className="badge bg-danger p-1">
                      {ele.status}
                    </small>
                  ) : ele.status === "IN_PROGRESS" ? (
                    <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-warning p-1">
                      {ele.status}
                    </span>
                  ) : (
                    <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-success p-1">
                      {ele.status}
                    </span>
                  )}
                </div>
                <div>
                  <span className="badge bg-primary p-1" style={{ width: "80px", marginRight:"1rem" }}>
                    {ele.end_date}
                  </span>
                </div>
                            <span style={{  color:"black" }}className="p-1 fw-bold">

                              {ele.total_worked} / {ele.task_hours+":00"}

                            </span>
              </div>
            </div>
         </div>
          </div>
        </div>
      );
    }
  })}



              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-4" style={{ borderRadius:"10px"}}>
          <div className="card">
            <div className="card-header border-bottom"                           
>
              <h5 className="fw-bold">Upcoming Tasks</h5>
            </div>
            <div className="card-body">
              <div
                className="flex-grow-1 mem-list"
                style={{ height: "350px", 
              
                }}
              >
                
                <div className="card-body">
                  {upcomingTask &&
                    upcomingTask.map((ele, index) => {
                      if (ele.time_status == "STOP") {
                        return (
                          <div
                          key={ele.id}
                          className="py-1 text-white d-flex align-items-center border-bottom flex-wrap"
                        >
                      <div className="card " style={{ borderRadius: "10px",
                        boxShadow: "13px 13px 21px -8px rgba(89,89,89,1)", height:"70px"}}>
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-1">
                              <Link to={`Ticket/Task/${ele.ticket_id}`}>
                                {ele && ele.priority == "Medium" && (
                                <h6 className="fw-bold mb-0 small-14 text-info" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 40
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 40) + "...."}
                                </h6>
                                )}
                                 {ele && ele.priority == "Veri High" && (
                                <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 40
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 40) + "...."}
                                </h6>
                                )}
                                  {ele && ele.priority == "High" && (
                                <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 40
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 40) + "...."}
                                </h6>
                                )}
                                  {ele && ele.priority == "Low" && (
                                <h6 className="fw-bold mb-0 small-14 text-success" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 40
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 40) + "...."}
                                </h6>
                                )}
                              </Link>
                            </div>
                          </div>
                            <div className="card-body ">
                            <div className=" timeline ti-danger border-bottom ">
                
                              <div className="d-flex flex-wrap">
                                {/* Buttons */}
                                {ele.status !== "COMPLETED" && (
                                  <button
                                
                                    type="button"
                                    style={{
                                      border: "none",
                                      height: "18px",
                                      width: "35px",
                                      padding: "0px",
                                      marginTop:"2px"
                                    }}
                                    title="Stop Task"
                                    onClick={(e) =>
                                      handleTimer(e, ele.ticket_id, ele.id, "STOP")
                                    }
                                  >
                                    <i
                                      className="icofont-ui-pause"
                                      style={{
                                        fontSize: "15px",
                                        color: "#1ABC9C",
                                        margin: "0",
                                        height:"8px"
                                      }}
                                    ></i>
                                  </button>
                                )}
                
                                {/* Badges */}
                                <div>
                                  {ele && ele.status === "TO_DO" ? (
                                    <small style={{ width: "80px", marginRight:"1rem" }} className="badge bg-danger p-1">
                                      {ele.status}
                                    </small>
                                  ) : ele.status === "IN_PROGRESS" ? (
                                    <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-warning p-1">
                                      {ele.status}
                                    </span>
                                  ) : (
                                    <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-success p-1">
                                      {ele.status}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <span className="badge bg-primary p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                    {ele.end_date}
                                  </span>
                                </div>
                                <div>
                                  <span className="badge bg-primary p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                    {ele.end_}
                                  </span>
                                </div>
                                {/* <div className="time-block text-truncate">
                                  {ele.priority === "Very High" && (
                                    <span className="badge bg-danger p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                      {ele.priority}
                                    </span>
                                  )}
                                  {ele.priority === "High" && (
                                    <span className="badge bg-danger p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                      {ele.priority}
                                    </span>
                                  )}
                                  {ele.priority === "Medium" && (
                                    <span className="badge bg-info p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                      {ele.priority}
                                    </span>
                                  )}
                                  {ele.priority === "Low" && (
                                    <span className="badge bg-success p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                      {ele.priority}
                                    </span>
                                  )}
                                </div> */}
                              </div>
                            </div>
                         </div>
                          </div>
                        </div>
                        );
                      }
                    })}
                </div>
                <div className="card mt-2">
                  {upcomingTask &&
                    upcomingTask.map((ele, index) => {
                      if (ele.time_status == "START") {
                        return (
                          <div
                          key={ele.id}
                          className="py-1 text-white d-flex align-items-center border-bottom flex-wrap"
                        >
                      <div className="card " style={{ borderRadius: "10px",
                        boxShadow: "13px 13px 21px -8px rgba(89,89,89,1)", height:"70px"}}>
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-1">
                              <Link to={`Ticket/Task/${ele.ticket_id}`}>
                                {ele && ele.priority == "Medium" && (
                                <h6 className="fw-bold mb-0 small-14 text-info" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 40
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 40) + "...."}
                                </h6>
                                )}
                                 {ele && ele.priority == "Veri High" && (
                                <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 40
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 40) + "...."}
                                </h6>
                                )}
                                  {ele && ele.priority == "High" && (
                                <h6 className="fw-bold mb-0 small-14 text-danger" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 40
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 40) + "...."}
                                </h6>
                                )}
                                  {ele && ele.priority == "Low" && (
                                <h6 className="fw-bold mb-0 small-14 text-success" title={ele.task_name}>
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 40
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 40) + "...."}
                                </h6>
                                )}
                              </Link>
                            </div>
                          </div>
                            <div className="card-body ">
                            <div className=" timeline ti-danger border-bottom ">
                
                              <div className="d-flex flex-wrap">
                                {/* Buttons */}
                                {ele.status !== "COMPLETED" && (
                                  <button
                                
                                    type="button"
                                    style={{
                                      border: "none",
                                      height: "18px",
                                      width: "35px",
                                      padding: "0px",
                                      marginTop:"2px"
                                    }}
                                    title="Start Task"
                                    onClick={(e) =>
                                      handleTimer(e, ele.ticket_id, ele.id, "START")
                                    }
                                  >
                                    <i
                                      className="icofont-ui-play"
                                      style={{
                                        fontSize: "15px",
                                        color: "#1ABC9C",
                                        margin: "0",
                                        height:"8px"
                                      }}
                                    ></i>
                                  </button>
                                )}
                
                                {/* Badges */}
                                <div>
                                  {ele && ele.status === "TO_DO" ? (
                                    <small style={{ width: "80px", marginRight:"1rem" }} className="badge bg-danger p-1">
                                      {ele.status}
                                    </small>
                                  ) : ele.status === "IN_PROGRESS" ? (
                                    <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-warning p-1">
                                      {ele.status}
                                    </span>
                                  ) : (
                                    <span style={{ width: "80px", marginRight:"1rem" }} className="badge bg-success p-1">
                                      {ele.status}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <span className="badge bg-primary p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                    {ele.end_date}
                                  </span>
                                </div>
                                {/* <div className="time-block text-truncate">
                                  {ele.priority === "Very High" && (
                                    <span className="badge bg-danger p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                      {ele.priority}
                                    </span>
                                  )}
                                  {ele.priority === "High" && (
                                    <span className="badge bg-danger p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                      {ele.priority}
                                    </span>
                                  )}
                                  {ele.priority === "Medium" && (
                                    <span className="badge bg-info p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                      {ele.priority}
                                    </span>
                                  )}
                                  {ele.priority === "Low" && (
                                    <span className="badge bg-success p-1" style={{ width: "80px", marginRight:"1rem" }}>
                                      {ele.priority}
                                    </span>
                                  )}
                                </div> */}
                              </div>
                            </div>
                         </div>
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
      <div className="row g-3 mb-3 row-deck ">
        <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-6">
          <div className="card ">
            <div className="card-header border-bottom ">
              <h5 className="fw-bold ">Monthly Analysis </h5>
              {/* <h4 className="mb-0 fw-bold ">

                                                                </h4> */}
            </div>
            <div className="card-body p-0">
              <div
                className="flex-grow-1"
                style={{ height: "450px" }}
              >
                
               {chartData && chartData.series.length>0 &&(
                  <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type={chartData.chart.type}
                    height={chartData.chart.height}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-6">
          <div className="card ">
            <div className="card-header border-bottom ">
              <h5 className="fw-bold ">Weekly Analysis</h5>
              {/* <h4 className="mb-0 fw-bold ">

                                                                </h4> */}
            </div>
            <div className="card-body p-0">
              <div
                className="flex-grow-1"
                style={{ height: "450px" }}
              >
                
               {radarData && radarData.series.length>0 &&(
                  <Chart
                    options={radarData.options}
                    series={radarData.series}
                    type={radarData.options.chart.type}
                    height="450"
                    // height={radarData.chart.height}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
