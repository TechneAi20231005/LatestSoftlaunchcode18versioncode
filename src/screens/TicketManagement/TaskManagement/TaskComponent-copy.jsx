import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dropdown, Modal } from "react-bootstrap";
import PageHeader from "../../../components/Common/PageHeader";
import { _attachmentUrl, userSessionData } from "../../../settings/constants";
import Alert from "../../../components/Common/Alert";
import ErrorLogService from "../../../services/ErrorLogService";
import MyTicketService from "../../../services/TicketService/MyTicketService";
import BasketService from "../../../services/TicketService/BasketService";
import {
  getTaskData,
  getTaskPlanner,
  getRegularizationTime,
  getTaskHistory,
  getTaskRegularizationTime,
} from "../../../services/TicketService/TaskService";
import { getAttachment } from "../../../services/OtherService/AttachmentService";
import Select from "react-select";
import { UserDropdown } from "../../Masters/UserMaster/UserComponent";
import TicketDescription from "./components/TicketDescription";
import BasketDetails from "./components/BasketDetails";
import TaskData from "./components/TaskData";
import TaskModal from "./components/TaskModal";
import PlannerModal from "./components/PlannerModal";
import StartStopModal from "./components/StartStopModal";
import ApproveRequestModal from "./components/ApproveRequestModal";
import ApproveTaskRequestModal from "./components/ApproveTaskRequestModal";
import axios from "axios";
import ModuleSetting from "../../../services/SettingService/ModuleSetting";
import { _base } from "../../../settings/constants";
import TestCasesService from "../../../services/TicketService/TestCaseService";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Spinner } from "react-bootstrap";

export default function TaskComponent({ match }) {
  const [notify, setNotify] = useState(null);
  // console.log("match",match)
  const {ticketId} = useParams();
  const history = useNavigate();

  const [moduleSetting, setModuleSetting] = useState();
  //Ticket Related
  const [ticketData, setTicketData] = useState();
  const [attachment, setAttachment] = useState();
  const [expectedSolveDate, setExpectedSolveDate] = useState();
  const [ticketStartDate, setTicketStartDate] = useState();
  const getTicketData = async () => {
    await new MyTicketService()
      .getTicketById(ticketId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setTicketData(res.data.data);
            setTicketStartDate(res.data.data.ticket_date);
            setExpectedSolveDate(res.data.data.expected_solve_date);
            getAttachment(res.data.data.id, "TICKET").then((resp) => {
              if (resp.status === 200) {
                setAttachment(resp.data.data);
              }
            });
          }
        }
      })
      .catch((error) => {
        const { response } = error;

        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          "Task",
          "Get_Ticket",
          "INSERT",
          errorObject.data.message
        );
      });
  };

  //Basket Modal Related
  const [basketModal, setBasketModal] = useState(false);

  const [basketData, setBasketData] = useState(null);
  const [showBasketModal, setShowBasketModal] = useState(false);

  const handleCloseBasketModal = () => {
    setShowBasketModal(false);
  };

  const handleShowBasketModal = async (id) => {
    setBasketData(null);
    if (id) {
      await new BasketService()
        .getBasketById(id)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              setBasketData(null);
              var temp = res.data.data;
              setBasketData(temp);
            }
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            "Task",
            "Get_Basket",
            "INSERT",
            errorObject.data.message
          );
        });
    } else {
      setBasketData(null);
    }
    setShowBasketModal(true);
  };

  var sortingArr;
  function sortFunc(a, b) {
    return sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id);
  }

  //Basket & Task Data
  const [ownership, setOwnership] = useState([]);
  const [data, setData] = useState();
  const [basketIdArray, setBasketIdArray] = useState();
  const [isReviewer, setIsReviewer] = useState(null);
  const [taskHistory, setTaskHistory] = useState()
  const [tasksData, setTasksData] = useState()
  const [allTaskList, setAllTaskList] = useState([]); //Defined as empty array
  // const [isRegularised, setIsRegularised] = useState([]);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const getBasketData = async () => {

    const tempAllTaskList = [];
    const taskDataa = [];
    const tasksDataa = [];
    setIsLoading(true);

    await new BasketService()

      .getBasketTaskData(ticketId)

      .then((res) => {

        if (res.status === 200) {
          setShowLoaderModal(false);
          setIsLoading(false)

          if (res.data.status === 1) {
            setIsLoading(false)

            const temp = res.data.data
            sortingArr = res.data.basket_id_array;
            setIsReviewer(res.data.is_reviewer);
            setOwnership(res.data.data);
            setBasketIdArray(res.data.basket_id_array);
            // setIsRegularised(res.data.is_regularized)
            setData(null);
            res.data.data.sort(sortFunc);
            setData(res.data.data);



            res.data.data.map((tasks, index) => {
              tasks.taskData.forEach((d, i) => {
                let taskOwnerNames = d.taskOwners.map(owner => owner.taskOwnerName).join(', ');
                tasksDataa.push({
                  ticket_id_name: d.ticket_id_name,
                  Task_Names: d.task_name,
                  Task_Hours: d.task_hours,
                  Start_Date: d.start_date,
                  End_Date: d.end_date,
                  Status: d.status,
                  Priority: d.priority,
                  Total_Worked: d.total_worked,
                  Basket_Name: tasks.basket_name,
                  taskOwnerNames: taskOwnerNames,

                })
              })

            })


            setTasksData(tasksDataa);
            res.data.data.forEach((dataa) => {
              dataa.taskData.forEach((task) => {
                tempAllTaskList.push({ value: task.id, label: task.task_name });
              });
            });
            setAllTaskList([]);
            setAllTaskList(tempAllTaskList);

            setIsLoading(false); // Loading finished
          }
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          "Task",
          "Get_Basket_Data",
          "INSERT",
          errorObject.data.message
        );
        setIsLoading(false);
      });

  };


  //Task Related
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalData, setTaskModalData] = useState(null);
  const handleShowTaskModal = async (ticket_id, ticket_basket_id, id) => {
    var temp = {
      id: null,
      ticket_basket_id: ticket_basket_id,
      ticket_id: ticket_id,
      task_name: null,
      task_hours: null,
      priority: null,
      description: null,
      status: "TO_DO",
      assign_to_user_id: null,
      total_time: null,
      attachment: null,
    };
    if (id) {
      await getTaskData(id).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            temp = res.data.data;
            setTaskModalData(temp);
          }
        }
      });

      await getTaskHistory(id).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setTaskHistory(res.data.data)
          }
        }
      })
    } else {
      setTaskModalData(temp);
    }
    setShowTaskModal(true);
  };
  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
  };

  /*  ********************************* PLANNER ************************************** */
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
            data: res.data.data,
          });
        }
      });
    }
    setShowPlannerModal(true);
  };

  const handleClosePlannerModal = () => {
    setShowPlannerModal(false);
  };

  /*  ********************************* Group Activity ************************************** */
  //Suyash 30/5/22
  const [groupActivityModal, setGroupActivityModal] = useState(false);
  const [groupActivityModalData, setGroupActivityModalData] = useState();


  const handleShowGroupModal = (e, taskOwners, taskId, dataa) => {
    setGroupActivityModal(true);
    setGroupActivityModalData(null);

    const temp = [];





    taskOwners.forEach((user) => {
      let t = user;
      t = { ...t, status: null };
      temp.push(t);
    });
    const data = { taskOwners: temp, taskId: taskId, all: dataa };
    setGroupActivityModalData(data);
  };

  const hideGroupActivityModal = () => {
    // setGroupActivityModalData([]);
    setGroupActivityModal(false);
  };


  /*  ********************************* Approval Request ************************************** */
  //Suyash 31/5/22
  const [approvalRequest, setApprovalRequest] = useState({});
  // const regularizationRequest = () => {

  //     // axios
  //     //     .get("http://15.207.120.175/TSDDummy/public/api/apporvalRequestTime/" + localStorage.getItem('id'))
  //     //     .then(function (response) {
  //     //         // handle success
  //     //         console.log(response);
  //     //         setApprovalRequest(response.data);
  //     //         // navigate("/list", { replace: true });
  //     //     })
  //     //     .catch(function (error) {
  //     //         // handle error
  //     //         console.log(error);  console.log(startDate)

  //     //     })
  // }

  const handleRequestSubmit = (id, taskId) => {
    // if (window.confirm("Are you sure you want to proceed?")) {
    //     axios
    //         .post("http://15.207.120.175/TSDDummy/public/api/apporvalRequestTime/" + id)
    //         .then(function (response) {
    //             requestTime();
    //             // setApprovalRequest(response.data.data);
    //             // navigate("/Ticket/Task/"+taskId, { replace: true });
    //         })
    //         .catch(function (error) {
    //             // handle error
    //             console.log(error);
    //         })
    //         .then(function () {
    //             // always executed
    //         });
    //     // console.log(products);
    // }
  };

  const [regularizationRequest, setRegularizationRequest] = useState(0);
  const [taskRegularizationRequest, setTaskRegularizationRequest] = useState(0);

  const handleRegularizationRequest = () => {
    new getRegularizationTime(ticketId).then((res) => {
      setRegularizationRequest(res.data.data);
    });
  };

  const handleTaskRegularizationRequest = () => {
    new getTaskRegularizationTime().then((res) => {
      setTaskRegularizationRequest(res.data.data);
    });
  };
  const [approveRequestModal, setApproveRequestModal] = useState({
    show: false,
    data: null,
  });



  const handleShowApproveRequestModal = () => {
    const data = null;
    setApproveRequestModal({ show: true, data: data });
  };
  const handleShowApproveTaskRequestModal = () => {
    const data = null;
    setApproveTaskRequestModal({ show: true, data: data });
  };
  const handleCloseApproveRequestModal = () => {
    const data = null;
    setApproveRequestModal({ show: false, data: data });
  };
  const handleCloseApproveTaskRequestModal = () => {
    const data = null;
    setApproveTaskRequestModal({ show: false, data: data });
  };



  const [approveTaskRequestModal, setApproveTaskRequestModal] = useState({
    show: false,
    data: null,
  });


  // const handleShowApproveTaskRequestModal = () => {
  //   const data = null;
  //   setApproveTaskRequestModal({ show: true, data: data });
  // };
  // const handleCloseApproveTaskRequestModal = () => {
  //   const data = null;
  //   setApproveTaskRequestModal({ show: false, data: data });
  // };



  const [taskDropdown, setTaskDropdown] = useState();

  const loadData = async () => {
    await new ModuleSetting().getSettingByName("Ticket", "Task").then((res) => {

      if (res.status == 200) {
        if (res.data.status == 1) {
          setModuleSetting(res.data.data);
        }
      }
    });
    await new TestCasesService().getTaskBytTicket(ticketId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data;
          setTaskDropdown(
            temp.map((d) => ({ value: d.id, label: d.task_name }))
          );
        }
      }
    });
  };

  const [buttonType, setButtontype] = useState();
  const [basketList, setBasketList] = useState(null);
  const pushForward = async (e) => {
    var sendArray = {
      user_id: parseInt(userSessionData.userId),
      ticket_id: parseInt(ticketId),
      basket_id_array: basketIdArray,
    };

    // var sendArray = [];
    // sendArray["user_id"] = parseInt(userSessionData.userId);
    // sendArray["ticket_id"] = parseInt(ticketId);
    // sendArray["basket_id_array"] = basketIdArray;

    await new BasketService().pushForward(sendArray).then((res) => {
      loadData();
      getBasketData();
      getTicketData();
      handleRegularizationRequest();
    });
  };

  var dragId;
  var dropId;
  var basketIdArray1;
  var basketIdArray2;
  const dragStartHandler = (e, card) => {
    dragId = card.id;
  };

  const dragEndhandler = async (e, card) => {
    e.preventDefault();
  };

  const dragOverHandler = (e) => {
    // const form = new FormData(e.target);

    e.preventDefault();
  };

  const dropHandler = async (e, card) => {
    e.preventDefault();
    dropId = card.id;

    basketIdArray1 = basketIdArray;
    var drag = basketIdArray1.indexOf(dragId);
    var drop = basketIdArray1.indexOf(dropId);
    if (drag > -1) {
      basketIdArray1.splice(drag, 1);
    }
    basketIdArray1.splice(drop, 0, dragId);
    basketIdArray2 = basketIdArray1.join();
    setBasketIdArray(basketIdArray2);
    pushForward();
    // basketIdArray.map((d)=> ({value: d,label:"basket_array_id" }))
    // await new BasketService().pushForward(basketIdArray).then((res) => {
    // loadData();
    // getBasketData();
    // getTicketData();
    // handleRegularizationRequest();
    // });

    // console.log(basketIdArray1);
  };
  const [showDetails, setShowDetails] = useState(false);
  const detailsHandler = () => {
    setShowDetails(prev => !prev);
  }


  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // This arrangement can be altered based on how we want the date's format to appear.
  let currentDate = `${day}-${month}-${year}`;

  useEffect(() => {
    loadData();
    getBasketData();
    getTicketData();
    handleRegularizationRequest();
    handleTaskRegularizationRequest();
  }, []);

  // created by Asmita Margaje 
  // Define a functional component named LoaderComponent
  function LoaderComponent() {
    return (
      // Container to center-align the spinner and loading text
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        {/* Spinner element with custom styling */}
        <Spinner animation="border" role="status" style={{ width: '100px', height: '100px', borderWidth: '5px', color: '#484c7f', marginBottom: '10px' }}>
          {/* Visually hidden loading text for accessibility */}
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        {/* Loading text displayed below the spinner */}
        <div style={{ color: '#484c7f', fontSize: '16px', fontWeight: 'bold' }}>Loading...</div>
      </div>
    );
  }


  return (
    <div className="container-xxl">
      {/* {ownership && JSON.stringify(ownership)} */}
      <PageHeader headerTitle="Manage Task" />
      {notify && <Alert alertData={notify} />}

      {/* Ticket Description */}
      <div className="card mt-2">
        <div className="card-body">

          {ticketData && (
            <div >

              <div className="d-flex align-items-center justify-content-between">
                <h5>
                  <strong>
                    Ticket - {ticketData.ticket_id} {' '}
                    <i onClick={detailsHandler} style={{ cursor: 'pointer' }}>
                      {showDetails ? (
                        <OverlayTrigger placement='right' overlay={<Tooltip>Hide Details</Tooltip>}>
                          <i className="icofont-eye" style={{ fontSize: "27px" }}></i>
                        </OverlayTrigger>
                      ) : (
                        <OverlayTrigger placement='right' overlay={<Tooltip>Show Details</Tooltip>}>
                          <i className="icofont-eye-blocked" style={{ fontSize: "27px" }}></i>
                        </OverlayTrigger>
                      )}
                    </i>
                  </strong>
                </h5>

                <Dropdown className="d-inline-flex m-1" style={{ alignSelf: 'flex-end' }}>
                  <Dropdown.Toggle
                    as="button"
                    variant=""
                    className="btn btn-outline-primary p-1"
                  >
                    <i className="icofont-navigation-menu"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu as="ul" className="border-0 shadow p-2 dropdown-menu-columns">
                    <li>
                      <ExportToExcel
                        className="btn btn-sm btn-danger btn-custom  w-100"
                        buttonTitle="Export All Task Data"
                        fileName="Task Data"

                        apiData={tasksData}
                      />
                    </li>
                    <li>

                      {ownership && (ownership === "TICKET" || ownership === "PROJECT") && (
                        <button
                          className="btn btn-sm btn-info text-white btn-custom w-100"
                          onClick={(e) => {
                            handleShowBasketModal(null);
                          }}
                        >
                          Create Basket
                        </button>
                      )}
                    </li>
                    <li>
                      <Link to={`/${_base}/getAllTestCases/` + ticketId}>
                        <button className="btn btn-sm btn-warning text-white btn-custom w-100">
                          All Test Cases
                        </button>
                      </Link>
                    </li>
                    <li>
                      {ownership && ownership !== "TASK" && (
                        <button
                          className="btn btn-sm btn-danger text-white"
                          onClick={(e) => {
                            handleShowApproveRequestModal();
                          }}
                        >
                          Time Regularization
                          {regularizationRequest && (
                            <span className="badge bg-primary p-2">
                              {regularizationRequest.length}
                            </span>
                          )}
                        </button>
                      )}
                    </li>
                    <li>

                      {/* {ownership && ownership !== "TASK" && ( */}
                      <button
                        className="btn btn-sm btn-danger text-white"
                        onClick={(e) => {
                          handleShowApproveTaskRequestModal();
                        }}
                      >

                        Task Regularization Request
                        {taskRegularizationRequest && (
                          <span className="badge bg-primary p-2">
                            {taskRegularizationRequest.length}
                          </span>
                        )}
                      </button>
                      {/* )} */}
                    </li>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div div className="d-flex flex-column" >
                {showDetails && <div class="p-0 m-0">
                  <p className="p-0 m-0"><strong>Details :</strong></p>
                  <p>{ticketData.description}</p>

                  <div className="d-flex">
                    {ticketData.attachment && ticketData.attachment.map((attachment, index) => {
                      return <div key={index} className="justify-content-start"
                        style={{ marginRight: '20px', padding: '5px', maxWidth: '250px' }}>
                        <div className="card" style={{ backgroundColor: '#EBF5FB' }}>
                          <div className="card-header">
                            {attachment.name}
                            <div className="d-flex justify-content-center p-0 mt-1">
                              <a href={`${_attachmentUrl}/${attachment.path}`}
                                target='_blank'
                                className='btn btn-primary btn-sm p-1'>
                                View
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    })}
                  </div>


                </div>
                }




              </div>

              {/* <TicketDescription data={ticketData} attachment={attachment} /> */}

            </div>
          )}

          {/* <div className="d-flex justify-content-end">
  <div className="d-inline-flex m-2">
    {ownership && ownership !== "TASK" && (
      <button
        className="btn btn-sm btn-danger text-white"
        onClick={(e) => {
          handleShowApproveRequestModal();
        }}
      >
        Regularization Request
        {regularizationRequest && (
          <span className="badge bg-primary p-2">
            {regularizationRequest.length}
          </span>
        )}
      </button>
    )}
  </div>
</div> */}

        </div>
      </div>

      <div className="row col-12">
        {approvalRequest.data &&
          approvalRequest.data.map((item, i) => {
            return (
              <div className="col-2">
                <div
                  className="col-3"
                  style={{ marginRight: "5px", padding: "0px", width: "250px" }}
                >
                  <div className="card" style={{ backgroundColor: "#EBF5FB" }}>
                    <div className="card-header">
                      <p style={{ fontSize: "12px" }}>
                        <p>
                          User : {item.first_name} {item.last_name}
                        </p>
                        <p>Date : {item.date}</p>
                        <p>From : {item.from_time}</p>
                        <p>To : {item.to_time}</p>
                      </p>
                      <div className="d-flex justify-content-end p-0">
                        <button
                          className="btn btn-danger text-white btn-sm p-0 px-1"
                          type="button"
                          onClick={(e) => {
                            handleRequestSubmit(item.id, item.ticket_task_id);
                          }}
                        >
                          <i
                            className="icofont-ui-check"
                            style={{ fontSize: "12px" }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div>

        {isLoading == true ? <LoaderComponent /> : <>
          <div className="row  flex-row flex-nowrap g-3 py-xxl-4 overflow-auto">
            {data &&
              data.map((ele, index) => {
                return (
                  <div
                    draggable={true}
                    onDragStart={(e) => dragStartHandler(e, ele)}
                    onDragLeave={(e) => dragEndhandler(e)}
                    onDragEnd={(e) => dragEndhandler(e, ele)}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDrop={(e) => dropHandler(e, ele)}
                    id={`basket_${index}`}
                    key={`basket_${index}`}
                    className="col-lg-4 col-md-4 col-sm-4 col-4"
                  >
                    <div className="p-0 m-0 d-flex justify-content-between">
                      <h5>
                        <strong> {ele.basket_name}</strong>
                      </h5>
                      <span
                        className="badge bg-success text-end mt-2 p-1 px-3"
                        style={{ fontSize: "14px" }}
                      >
                        {ele.total_worked ? ele.total_worked : 0}/
                        {ele.total_hours}
                      </span>
                    </div>
                    {/* {ele.basket_owner==localStorage.getItem('id') &&  */}
                    {/* {data && JSON.stringify(ele.ownership)} */}
                    <div className="p-0 m-0 d-flex justify-content-between mt-1">
                    
                      {/* {ownership && JSON.stringify(ownership)} */}

                      {
  ownership && ownership.some(i => i.ownership === "TICKET"  || i.ownership === "BASKET" || i.ownership === "PROJECT") && (
    <button
      type="button"
      key={`newTaskBtn_${index}`}
      className="btn btn-danger btn-sm text-white"
      style={{ padding: "10px 10px" }}
      name="newTaskButton"
      onClick={(e) => {
        handleShowTaskModal(ele.ticket_id, ele.id, null);
      }}
    >
      <i
        className="icofont-plus"
        style={{ fontSize: "10px", marginRight: "4px" }}
      ></i>
      New Task
    </button>
  )
}

{/* {ownership && ownership.map((i) => {

return (
  i.ownership == "TICKET" || i.ownership == "BASKET") && (

    <button
      type="button"
      key={`newTaskBtn_${index}`}
      className="btn btn-danger btn-sm text-white"
      style={{ padding: "10px 10px" }}
      name="newTaskButton"
      onClick={(e) => {
        handleShowTaskModal(ele.ticket_id, ele.id, null);
      }}
    >
      <i
        className="icofont-plus"
        style={{ fontSize: "10px", marginRight: "4px" }}
      ></i>
      New Task
    </button>
  )
})} */}

                      <form
                        method="post"
                        onSubmit={(e) => {
                          pushForward(e);
                        }}
                        encType="multipart/form-data"
                      >
                        <div>
                          <input
                            type="hidden"
                            id="basket_id"
                            name="basket_id"
                            value={ele.id}
                          />
                          <input
                            type="hidden"
                            id="basket_id_array"
                            name="basket_id_array"
                            value={basketIdArray}
                          />
                          {/* <button
                          onClick={(e) => {
                            setButtontype("LEFT");
                          }}
                          type="submit"
                          name="LEFT"
                          id="LEFT"
                          value="LEFT"
                          className="btn btn-primary"
                        >
                          <i className="icofont-arrow-left"></i>
                        </button>
                        <button
                          type="submit"
                          name="RIGHT"
                          id="RIGHT"
                          value="RIGHT"
                          className="btn btn-primary"
                          onClick={(e) => {
                            setButtontype("RIGHT");
                          }}
                        >
                          <i className="icofont-arrow-right"></i>
                        </button> */}
                        </div>
                      </form>
                      {/* <span>{ele.basket_owner} - {localStorage.getItem('id')}</span> */}
                      {/* {ownership } */}
                      {
  ownership && ownership.some(i => i.ownership === "TICKET" || i.ownership === "BASKET" || i.ownership === "PROJECT") && (
    <button
      type="button"
      className="btn btn-primary text-white btn-sm"
      style={{ padding: "10px 10px" }}
      onClick={(e) => {
        // Handle the click event here
        handleShowBasketModal(ele.id);
      }}
    >
      <i
        className="icofont-ui-edit"
        style={{ fontSize: "13px", marginRight: "4px" }}
      ></i>
      Edit Basket
    </button>
  )
}

                    </div>
                    {/* } */}


                    <div className="ticket-container" key={ele.id}>
                      <div className="ticket">
                        {ele.taskData &&
                          ele.taskData.map((task) => {
                            return (
                              <TaskData
                                key={task.id.toString()}
                                data={task}
                                loadBasket={getBasketData}
                                ownership={ownership}
                                // isRegularised={isRegularised}
                                onShowTaskModal={handleShowTaskModal}
                                onCloseTaskModal={handleCloseTaskModal}
                                openPlannerModal={handleShowPlannerModal}
                                openGroupModal={handleShowGroupModal}
                                moduleSetting={moduleSetting}
                                isReviewer={isReviewer}
                                expectedSolveDate={expectedSolveDate}
                                ticketStartDate={ticketStartDate}
                              />
                            );
                          })}
                      </div>
                    </div>

                  </div>
                );
              })}

            {ticketData && (
              <BasketDetails
                ticketId={ticketId}
                show={showBasketModal}
                hide={handleCloseBasketModal}
                data={basketData}
                loadData={getBasketData}
              />
            )}

            {showTaskModal && (
              <TaskModal
                data={taskModalData}
                show={showTaskModal}
                ownership={ownership}
                loadBasket={getBasketData}
                allTaskList={allTaskList}
                taskDropdown={taskDropdown}
                close={handleCloseTaskModal}
                moduleSetting={moduleSetting}
                expectedSolveDate={expectedSolveDate}
                ticketStartDate={ticketStartDate}
              />
            )}

            {showPlannerModal && (
              <PlannerModal
                show={handleShowPlannerModal}
                handleClose={handleClosePlannerModal}
                plannerData={plannerData}
                moduleSetting={moduleSetting}
              />
            )}

            {groupActivityModalData && (
              <StartStopModal
                show={groupActivityModal}
                hide={hideGroupActivityModal}
                data={groupActivityModalData}
                loadBasket={getBasketData}
              />
            )}

            {/* {regularizationRequest && ( */}
              <ApproveRequestModal
                show={approveRequestModal.show}
                hide={handleCloseApproveRequestModal}
                data={regularizationRequest && regularizationRequest}
                ticketId={ticketId}
              />
            {/* )} */}

            {taskRegularizationRequest && (
              <ApproveTaskRequestModal
                show={approveTaskRequestModal.show}
                hide={handleCloseApproveTaskRequestModal}
                data={taskRegularizationRequest}

              />)}

          </div>
        </>}
      </div>
      <div>
        {/* <LoaderComponent /> */}
        {/* {isLoading === true ?<LoaderComponent/>:null} */}

      </div>

    </div>
  );
}






// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Dropdown, Modal } from "react-bootstrap";
// import PageHeader from "../../../components/Common/PageHeader";
// import { _attachmentUrl, userSessionData } from "../../../settings/constants";
// import Alert from "../../../components/Common/Alert";
// import ErrorLogService from "../../../services/ErrorLogService";
// import MyTicketService from "../../../services/TicketService/MyTicketService";
// import BasketService from "../../../services/TicketService/BasketService";
// import {
//   getTaskData,
//   getTaskPlanner,
//   getRegularizationTime,
//   getTaskHistory,
//   getTaskRegularizationTime,
// } from "../../../services/TicketService/TaskService";
// import { getAttachment } from "../../../services/OtherService/AttachmentService";
// import Select from "react-select";
// import { UserDropdown } from "../../Masters/UserMaster/UserComponent";
// import TicketDescription from "./components/TicketDescription";
// import BasketDetails from "./components/BasketDetails";
// import TaskData from "./components/TaskData";
// import TaskModal from "./components/TaskModal";
// import PlannerModal from "./components/PlannerModal";
// import StartStopModal from "./components/StartStopModal";
// import ApproveRequestModal from "./components/ApproveRequestModal";
// import ApproveTaskRequestModal from "./components/ApproveTaskRequestModal";
// import axios from "axios";
// import ModuleSetting from "../../../services/SettingService/ModuleSetting";
// import { _base } from "../../../settings/constants";
// import TestCasesService from "../../../services/TicketService/TestCaseService";
// import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Tooltip from 'react-bootstrap/Tooltip';
// import { Spinner } from "react-bootstrap";

// export default function TaskComponent({ match }) {
//   const [notify, setNotify] = useState(null);
//   const ticketId = match.params.id;
 
//   const history = useNavigate();

//   const [moduleSetting, setModuleSetting] = useState();
//   //Ticket Related
//   const [ticketData, setTicketData] = useState();
//   const [attachment, setAttachment] = useState();
//   const [expectedSolveDate, setExpectedSolveDate] = useState();
//   const [ticketStartDate, setTicketStartDate] = useState();
//   const [buttonType, setButtontype] = useState();
//   const [basketList, setBasketList] = useState(null);
//    //Basket Modal Related
//    const [basketModal, setBasketModal] = useState(false);
//    const [basketData, setBasketData] = useState(null);
//    const [showBasketModal, setShowBasketModal] = useState(false);
//     //Basket & Task Data
//   const [ownership, setOwnership] = useState([]);
//   const [data, setData] = useState();
//   const [basketIdArray, setBasketIdArray] = useState();
//   const [isReviewer, setIsReviewer] = useState(null);
//   const [taskHistory, setTaskHistory] = useState()
//   const [tasksData, setTasksData] = useState()
//   const [allTaskList, setAllTaskList] = useState([]); //Defined as empty array
//   // const [isRegularised, setIsRegularised] = useState([]);
//   const [showLoaderModal, setShowLoaderModal] = useState(false);
//  //Task Related
//  const [showTaskModal, setShowTaskModal] = useState(false);
//  const [taskModalData, setTaskModalData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [approvalRequest, setApprovalRequest] = useState({});
//   const getTicketData = async () => {
//     await new MyTicketService()
//       .getTicketById(ticketId)
//       .then((res) => {
//         if (res.status === 200) {
//           if (res.data.status === 1) {
//             setTicketData(res.data.data);
//             setTicketStartDate(res.data.data.ticket_date);
//             setExpectedSolveDate(res.data.data.expected_solve_date);
//             getAttachment(res.data.data.id, "TICKET").then((resp) => {
//               if (resp.status === 200) {
//                 setAttachment(resp.data.data);
//               }
//             });
//           }
//         }
//       })
//       .catch((error) => {
//         const { response } = error;

//         const { request, ...errorObject } = response;
//         new ErrorLogService().sendErrorLog(
//           "Task",
//           "Get_Ticket",
//           "INSERT",
//           errorObject.data.message
//         );
//       });
//   };

 

//   const handleCloseBasketModal = () => {
//     setShowBasketModal(false);
//   };

//   const handleShowBasketModal = async (id) => {
//     setBasketData(null);
//     if (id) {
//       await new BasketService()
//         .getBasketById(id)
//         .then((res) => {
//           if (res.status === 200) {
//             if (res.data.status === 1) {
//               setBasketData(null);
//               var temp = res.data.data;
//               setBasketData(temp);
//             }
//           }
//         })
//         .catch((error) => {
//           const { response } = error;
//           const { request, ...errorObject } = response;
//           new ErrorLogService().sendErrorLog(
//             "Task",
//             "Get_Basket",
//             "INSERT",
//             errorObject.data.message
//           );
//         });
//     } else {
//       setBasketData(null);
//     }
//     setShowBasketModal(true);
//   };

//   var sortingArr;
//   function sortFunc(a, b) {
//     return sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id);
//   }

 

//   const getBasketData = async () => {

//     const tempAllTaskList = [];
//     const taskDataa = [];
//     const tasksDataa = [];
//     setIsLoading(true);

//     await new BasketService()

//       .getBasketTaskData(ticketId)

//       .then((res) => {

//         if (res.status === 200) {
//           setShowLoaderModal(false);
//           setIsLoading(false)

//           if (res.data.status === 1) {
//             setIsLoading(false)

//             const temp = res.data.data
//             sortingArr = res.data.basket_id_array;
//             setIsReviewer(res.data.is_reviewer);
//             setOwnership(res.data.data);
//             setBasketIdArray(res.data.basket_id_array);
//             // setIsRegularised(res.data.is_regularized)
//             setData(null);
//             res.data.data.sort(sortFunc);
//             setData(res.data.data);



//             res.data.data.map((tasks, index) => {
//               tasks.taskData.forEach((d, i) => {
//                 let taskOwnerNames = d.taskOwners.map(owner => owner.taskOwnerName).join(', ');
//                 tasksDataa.push({
//                   ticket_id_name: d.ticket_id_name,
//                   Task_Names: d.task_name,
//                   Task_Hours: d.task_hours,
//                   Start_Date: d.start_date,
//                   End_Date: d.end_date,
//                   Status: d.status,
//                   Priority: d.priority,
//                   Total_Worked: d.total_worked,
//                   Basket_Name: tasks.basket_name,
//                   taskOwnerNames: taskOwnerNames,

//                 })
//               })

//             })


//             setTasksData(tasksDataa);
//             res.data.data.forEach((dataa) => {
//               dataa.taskData.forEach((task) => {
//                 tempAllTaskList.push({ value: task.id, label: task.task_name });
//               });
//             });
//             setAllTaskList([]);
//             setAllTaskList(tempAllTaskList);

//             setIsLoading(false); // Loading finished
//           }
//         }
//       })
//       .catch((error) => {
//         const { response } = error;
//         const { request, ...errorObject } = response;
//         new ErrorLogService().sendErrorLog(
//           "Task",
//           "Get_Basket_Data",
//           "INSERT",
//           errorObject.data.message
//         );
//         setIsLoading(false);
//       });

//   };


 
//   const handleShowTaskModal = async (ticket_id, ticket_basket_id, id) => {
//     var temp = {
//       id: id,
//       ticket_basket_id: ticket_basket_id,
//       ticket_id: ticket_id,
//       task_name: null,
//       task_hours: null,
//       priority: null,
//       description: null,
//       status: "TO_DO",
//       assign_to_user_id: null,
//       total_time: null,
//       attachment: null,
//     };
//     if (id) {
//       // console.log("id",id)
//       await getTaskData(id).then((res) => {
//         console.log("res",id)
//         console.log("res",ticketId)

//         if (res.status === 200) {
//           if (res.data.status === 1) {
//             temp = res.data.data;
//             setTaskModalData(temp);
//           }
//         }
//       });

//       await getTaskHistory(id).then((res) => {
//         if (res.status === 200) {
//           if (res.data.status === 1) {
//             setTaskHistory(res.data.data)
//           }
//         }
//       })
//     } else {
//       setTaskModalData(temp);
//     }
//     setShowTaskModal(true);
//   };
//   const handleCloseTaskModal = () => {
//     setShowTaskModal(false);
//   };


// console.log("temp",taskModalData)
//   /*  ********************************* PLANNER ************************************** */
//   const [showPlannerModal, setShowPlannerModal] = useState(false);
//   const [plannerData, setPlannerData] = useState(null);
//   const handleShowPlannerModal = async (
//     taskId,
//     ticket_basket_id,
//     ticket_id
//   ) => {
//     if (taskId) {
//       await getTaskPlanner(taskId).then((res) => {
//         if (res.status === 200) {
//           setPlannerData(null);
//           setPlannerData({
//             taskId: taskId,
//             ticket_basket_id: ticket_basket_id,
//             ticket_id: ticket_id,
//             data: res.data.data,
//           });
//         }
//       });
//     }
//     setShowPlannerModal(true);
//   };

//   const handleClosePlannerModal = () => {
//     setShowPlannerModal(false);
//   };

//   /*  ********************************* Group Activity ************************************** */
//   //Suyash 30/5/22
//   const [groupActivityModal, setGroupActivityModal] = useState(false);
//   const [groupActivityModalData, setGroupActivityModalData] = useState();


//   const handleShowGroupModal = (e, taskOwners, taskId, dataa) => {
//     setGroupActivityModal(true);
//     setGroupActivityModalData(null);

//     const temp = [];

//     taskOwners.forEach((user) => {
//       let t = user;
//       t = { ...t, status: null };
//       temp.push(t);
//     });
//     const data = { taskOwners: temp, taskId: taskId, all: dataa };
//     setGroupActivityModalData(data);
//   };

//   const hideGroupActivityModal = () => {
//     // setGroupActivityModalData([]);
//     setGroupActivityModal(false);
//   };




//   const [regularizationRequest, setRegularizationRequest] = useState(0);
//   const [taskRegularizationRequest, setTaskRegularizationRequest] = useState(0);

//   const handleRegularizationRequest = () => {
//     new getRegularizationTime(ticketId).then((res) => {
//       setRegularizationRequest(res.data.data);
//     });
//   };

//   const handleTaskRegularizationRequest = () => {
//     new getTaskRegularizationTime().then((res) => {
//       setTaskRegularizationRequest(res.data.data);
//     });
//   };
//   const [approveRequestModal, setApproveRequestModal] = useState({
//     show: false,
//     data: null,
//   });



//   const handleShowApproveRequestModal = () => {
//     const data = null;
//     setApproveRequestModal({ show: true, data: data });
//   };
//   const handleShowApproveTaskRequestModal = () => {
//     const data = null;
//     setApproveTaskRequestModal({ show: true, data: data });
//   };
//   const handleCloseApproveRequestModal = () => {
//     const data = null;
//     setApproveRequestModal({ show: false, data: data });
//   };
//   const handleCloseApproveTaskRequestModal = () => {
//     const data = null;
//     setApproveTaskRequestModal({ show: false, data: data });
//   };



//   const [approveTaskRequestModal, setApproveTaskRequestModal] = useState({
//     show: false,
//     data: null,
//   });


//   // const handleShowApproveTaskRequestModal = () => {
//   //   const data = null;
//   //   setApproveTaskRequestModal({ show: true, data: data });
//   // };
//   // const handleCloseApproveTaskRequestModal = () => {
//   //   const data = null;
//   //   setApproveTaskRequestModal({ show: false, data: data });
//   // };



//   const [taskDropdown, setTaskDropdown] = useState();

//   const loadData = async () => {
//     await new ModuleSetting().getSettingByName("Ticket", "Task").then((res) => {

//       if (res.status == 200) {
//         if (res.data.status == 1) {
//           setModuleSetting(res.data.data);
//         }
//       }
//     });
//     await new TestCasesService().getTaskBytTicket(ticketId).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           const temp = res.data.data;
//           setTaskDropdown(
//             temp.map((d) => ({ value: d.id, label: d.task_name }))
//           );
//         }
//       }
//     });
//   };

 
//   const pushForward = async (e) => {
//     var sendArray = {
//       user_id: parseInt(userSessionData.userId),
//       ticket_id: parseInt(ticketId),
//       basket_id_array: basketIdArray,
//     };

//     await new BasketService().pushForward(sendArray).then((res) => {
//       loadData();
//       getBasketData();
//       getTicketData();
//       handleRegularizationRequest();
//     });
//   };

//   var dragId;
//   var dropId;
//   var basketIdArray1;
//   var basketIdArray2;
//   const dragStartHandler = (e, card) => {
//     dragId = card.id;
//   };

//   const dragEndhandler = async (e, card) => {
//     e.preventDefault();
//   };

//   const dragOverHandler = (e) => {
//     // const form = new FormData(e.target);

//     e.preventDefault();
//   };

//   const dropHandler = async (e, card) => {
//     e.preventDefault();
//     dropId = card.id;

//     basketIdArray1 = basketIdArray;
//     var drag = basketIdArray1.indexOf(dragId);
//     var drop = basketIdArray1.indexOf(dropId);
//     if (drag > -1) {
//       basketIdArray1.splice(drag, 1);
//     }
//     basketIdArray1.splice(drop, 0, dragId);
//     basketIdArray2 = basketIdArray1.join();
//     setBasketIdArray(basketIdArray2);
//     pushForward();
//     // basketIdArray.map((d)=> ({value: d,label:"basket_array_id" }))
//     // await new BasketService().pushForward(basketIdArray).then((res) => {
//     // loadData();
//     // getBasketData();
//     // getTicketData();
//     // handleRegularizationRequest();
//     // });

//     // console.log(basketIdArray1);
//   };
//   const [showDetails, setShowDetails] = useState(false);
//   const detailsHandler = () => {
//     setShowDetails(prev => !prev);
//   }


//   const date = new Date();

//   let day = date.getDate();
//   let month = date.getMonth() + 1;
//   let year = date.getFullYear();

//   // This arrangement can be altered based on how we want the date's format to appear.
//   let currentDate = `${day}-${month}-${year}`;

//   useEffect(() => {
//     loadData();
//     getBasketData();
//     getTicketData();
//     handleRegularizationRequest();
//     handleTaskRegularizationRequest();
//   }, []);

//   // created by Asmita Margaje
//   // Define a functional component named LoaderComponent
//   function LoaderComponent() {
//     return (
//       // Container to center-align the spinner and loading text
//       <div style={{ textAlign: 'center', marginTop: '50px' }}>
//         {/* Spinner element with custom styling */}
//         <Spinner animation="border" role="status" style={{ width: '100px', height: '100px', borderWidth: '5px', color: '#484c7f', marginBottom: '10px' }}>
//           {/* Visually hidden loading text for accessibility */}
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//         {/* Loading text displayed below the spinner */}
//         <div style={{ color: '#484c7f', fontSize: '16px', fontWeight: 'bold' }}>Loading...</div>
//       </div>
//     );
//   }


//   return (
//     <div className="container-xxl">
//       {/* {ownership && JSON.stringify(ownership)} */}
//       <PageHeader headerTitle="Manage Task" />
//       {notify && <Alert alertData={notify} />}

//       {/* Ticket Description */}
//       <div className="card mt-2">
//         <div className="card-body">

//           {ticketData && (
//             <div >

//               <div className="d-flex align-items-center justify-content-between">
//                 <h5>
//                   <strong>
//                     Ticket - {ticketData.ticket_id} {' '}
//                     <i onClick={detailsHandler} style={{ cursor: 'pointer' }}>
//                       {showDetails ? (
//                         <OverlayTrigger placement='right' overlay={<Tooltip>Hide Details</Tooltip>}>
//                           <i className="icofont-eye" style={{ fontSize: "27px" }}></i>
//                         </OverlayTrigger>
//                       ) : (
//                         <OverlayTrigger placement='right' overlay={<Tooltip>Show Details</Tooltip>}>
//                           <i className="icofont-eye-blocked" style={{ fontSize: "27px" }}></i>
//                         </OverlayTrigger>
//                       )}
//                     </i>
//                   </strong>
//                 </h5>

//                 <Dropdown className="d-inline-flex m-1" style={{ alignSelf: 'flex-end' }}>
//                   <Dropdown.Toggle
//                     as="button"
//                     variant=""
//                     className="btn btn-outline-primary p-1"
//                   >
//                     <i className="icofont-navigation-menu"></i>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu as="ul" className="border-0 shadow p-2 dropdown-menu-columns">
//                     <li>
//                       <ExportToExcel
//                         className="btn btn-sm btn-danger btn-custom  w-100"
//                         buttonTitle="Export All Task Data"
//                         fileName="Task Data"

//                         apiData={tasksData}
//                       />
//                     </li>
//                     <li>

//                       {ownership && (ownership === "TICKET" || ownership === "PROJECT") && (
//                         <button
//                           className="btn btn-sm btn-info text-white btn-custom w-100"
//                           onClick={(e) => {
//                             handleShowBasketModal(null);
//                           }}
//                         >
//                           Create Basket
//                         </button>
//                       )}
//                     </li>
//                     <li>
//                       <Link to={`/${_base}/getAllTestCases/` + ticketId}>
//                         <button className="btn btn-sm btn-warning text-white btn-custom w-100">
//                           All Test Cases
//                         </button>
//                       </Link>
//                     </li>
//                     <li>
//                       {ownership && ownership !== "TASK" && (
//                         <button
//                           className="btn btn-sm btn-danger text-white"
//                           onClick={(e) => {
//                             handleShowApproveRequestModal();
//                           }}
//                         >
//                           Time Regularization
//                           {regularizationRequest && (
//                             <span className="badge bg-primary p-2">
//                               {regularizationRequest.length}
//                             </span>
//                           )}
//                         </button>
//                       )}
//                     </li>
//                     <li>

//                       {/* {ownership && ownership !== "TASK" && ( */}
//                       <button
//                         className="btn btn-sm btn-danger text-white"
//                         onClick={(e) => {
//                           handleShowApproveTaskRequestModal();
//                         }}
//                       >

//                         Task Regularization Request
//                         {taskRegularizationRequest && (
//                           <span className="badge bg-primary p-2">
//                             {taskRegularizationRequest.length}
//                           </span>
//                         )}
//                       </button>
//                       {/* )} */}
//                     </li>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//               <div div className="d-flex flex-column" >
//                 {showDetails && <div class="p-0 m-0">
//                   <p className="p-0 m-0"><strong>Details :</strong></p>
//                   <p>{ticketData.description}</p>

//                   <div className="d-flex">
//                     {ticketData.attachment && ticketData.attachment.map((attachment, index) => {
//                       return <div key={index} className="justify-content-start"
//                         style={{ marginRight: '20px', padding: '5px', maxWidth: '250px' }}>
//                         <div className="card" style={{ backgroundColor: '#EBF5FB' }}>
//                           <div className="card-header">
//                             {attachment.name}
//                             <div className="d-flex justify-content-center p-0 mt-1">
//                               <a href={`${_attachmentUrl}/${attachment.path}`}
//                                 target='_blank'
//                                 className='btn btn-primary btn-sm p-1'>
//                                 View
//                               </a>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     })}
//                   </div>


//                 </div>
//                 }
//               </div>
//             </div>
//           )}

//           {/* <div className="d-flex justify-content-end">
//   <div className="d-inline-flex m-2">
//     {ownership && ownership !== "TASK" && (
//       <button
//         className="btn btn-sm btn-danger text-white"
//         onClick={(e) => {
//           handleShowApproveRequestModal();
//         }}
//       >
//         Regularization Request
//         {regularizationRequest && (
//           <span className="badge bg-primary p-2">
//             {regularizationRequest.length}
//           </span>
//         )}
//       </button>
//     )}
//   </div>
// </div> */}

//         </div>
//       </div>

     
//       <div> 

//         {/* {isLoading == true ? <LoaderComponent /> : <> */}
//           <div className="row  flex-row flex-nowrap g-3 py-xxl-4 overflow-auto">
//             {data &&
//               data.map((ele, index) => {
//                 return (
//                   <div
//                     draggable={true}
//                     onDragStart={(e) => dragStartHandler(e, ele)}
//                     onDragLeave={(e) => dragEndhandler(e)}
//                     onDragEnd={(e) => dragEndhandler(e, ele)}
//                     onDragOver={(e) => dragOverHandler(e)}
//                     onDrop={(e) => dropHandler(e, ele)}
//                     id={`basket_${index}`}
//                     key={`basket_${index}`}
//                     className="col-lg-4 col-md-4 col-sm-4 col-4"
//                   >
//                     <div className="p-0 m-0 d-flex justify-content-between">
//                       <h5>
//                         <strong> {ele.basket_name}</strong>
//                       </h5>
//                       <span
//                         className="badge bg-success text-end mt-2 p-1 px-3"
//                         style={{ fontSize: "14px" }}
//                       >
//                         {ele.total_worked ? ele.total_worked : 0}/
//                         {ele.total_hours}
//                       </span>
//                     </div>
//                     {/* {ele.basket_owner==localStorage.getItem('id') &&  */}
//                     {/* {data && JSON.stringify(ele.ownership)} */}
//                     <div className="p-0 m-0 d-flex justify-content-between mt-1">
//                       {/* {ownership && JSON.stringify(ownership)} */}

//                       {
//   ownership && ownership.some(i => i.ownership === "TICKET" || i.ownership === "BASKET") && (
//     <button
//       type="button"
//       key={`newTaskBtn_${index}`}
//       className="btn btn-danger btn-sm text-white"
//       style={{ padding: "10px 10px" }}
//       name="newTaskButton"
//       onClick={(e) => {
//         handleShowTaskModal(ele.ticket_id, ele.id, null);
//       }}
//     >
//       <i
//         className="icofont-plus"
//         style={{ fontSize: "10px", marginRight: "4px" }}
//       ></i>
//       New Task
//     </button>
//   )
// }

// {/* {ownership && ownership.map((i) => {

// return (
//   i.ownership == "TICKET" || i.ownership == "BASKET") && (

//     <button
//       type="button"
//       key={`newTaskBtn_${index}`}
//       className="btn btn-danger btn-sm text-white"
//       style={{ padding: "10px 10px" }}
//       name="newTaskButton"
//       onClick={(e) => {
//         handleShowTaskModal(ele.ticket_id, ele.id, null);
//       }}
//     >
//       <i
//         className="icofont-plus"
//         style={{ fontSize: "10px", marginRight: "4px" }}
//       ></i>
//       New Task
//     </button>
//   )
// })} */}

//                       <form
//                         method="post"
//                         onSubmit={(e) => {
//                           pushForward(e);
//                         }}
//                         encType="multipart/form-data"
//                       >
//                         <div>
//                           <input
//                             type="hidden"
//                             id="basket_id"
//                             name="basket_id"
//                             value={ele.id}
//                           />
//                           <input
//                             type="hidden"
//                             id="basket_id_array"
//                             name="basket_id_array"
//                             value={basketIdArray}
//                           />
//                           {/* <button
//                           onClick={(e) => {
//                             setButtontype("LEFT");
//                           }}
//                           type="submit"
//                           name="LEFT"
//                           id="LEFT"
//                           value="LEFT"
//                           className="btn btn-primary"
//                         >
//                           <i className="icofont-arrow-left"></i>
//                         </button>
//                         <button
//                           type="submit"
//                           name="RIGHT"
//                           id="RIGHT"
//                           value="RIGHT"
//                           className="btn btn-primary"
//                           onClick={(e) => {
//                             setButtontype("RIGHT");
//                           }}
//                         >
//                           <i className="icofont-arrow-right"></i>
//                         </button> */}
//                         </div>
//                       </form>
//                       {/* <span>{ele.basket_owner} - {localStorage.getItem('id')}</span> */}
//                       {
//   ownership && ownership.some(i => i.ownership === "TICKET" || i.ownership === "BASKET") && (
//     <button
//       type="button"
//       className="btn btn-primary text-white btn-sm"
//       style={{ padding: "10px 10px" }}
//       onClick={(e) => {
//         // Handle the click event here
//         handleShowBasketModal(ele.id);
//       }}
//     >
//       <i
//         className="icofont-ui-edit"
//         style={{ fontSize: "13px", marginRight: "4px" }}
//       ></i>
//       Edit Basket
//     </button>
//   )
// }

//                     </div>
//                     {/* } */}


//                     <div className="ticket-container" key={ele.id}>
//                       <div className="ticket">
//                         {ele.taskData &&
//                           ele.taskData.map((task) => {
//                             return (
//                               <TaskData
//                                 key={task.id.toString()}
//                                 data={task}
//                                 loadBasket={getBasketData}
//                                 ownership={ownership}
//                                 // isRegularised={isRegularised}
//                                 onShowTaskModal={handleShowTaskModal}
//                                 onCloseTaskModal={handleCloseTaskModal}
//                                 openPlannerModal={handleShowPlannerModal}
//                                 openGroupModal={handleShowGroupModal}
//                                 moduleSetting={moduleSetting}
//                                 isReviewer={isReviewer}
//                                 expectedSolveDate={expectedSolveDate}
//                                 ticketStartDate={ticketStartDate}
//                               />
//                             );
//                           })}
//                       </div>
//                     </div>

//                   </div>
//                 );
//               })}

//             {ticketData && (
//               <BasketDetails
//                 ticketId={ticketId}
//                 show={showBasketModal}
//                 hide={handleCloseBasketModal}
//                 data={basketData}
//                 loadData={getBasketData}
//               />
//             )}

//             {showTaskModal && (
//               <TaskModal
//                 data={taskModalData}
//                 show={showTaskModal}
//                 ownership={ownership}
//                 loadBasket={getBasketData}
//                 allTaskList={allTaskList}
//                 taskDropdown={taskDropdown}
//                 close={handleCloseTaskModal}
//                 moduleSetting={moduleSetting}
//                 expectedSolveDate={expectedSolveDate}
//                 ticketStartDate={ticketStartDate}
//               />
//             )}

//             {showPlannerModal && (
//               <PlannerModal
//                 show={handleShowPlannerModal}
//                 handleClose={handleClosePlannerModal}
//                 plannerData={plannerData}
//                 moduleSetting={moduleSetting}
//               />
//             )}

//             {groupActivityModalData && (
//               <StartStopModal
//                 show={groupActivityModal}
//                 hide={hideGroupActivityModal}
//                 data={groupActivityModalData}
//                 loadBasket={getBasketData}
//               />
//             )}

//             {regularizationRequest && (
//               <ApproveRequestModal
//                 show={approveRequestModal.show}
//                 hide={handleCloseApproveRequestModal}
//                 data={regularizationRequest}
//                 ticketId={ticketId}
//               />
//             )}

//             {taskRegularizationRequest && (
//               <ApproveTaskRequestModal
//                 show={approveTaskRequestModal.show}
//                 hide={handleCloseApproveTaskRequestModal}
//                 data={taskRegularizationRequest}

//               />)}

//           </div>
//         {/* </>} */}
//       </div>
//       <div>
//         {/* <LoaderComponent /> */}
//         {/* {isLoading === true ?<LoaderComponent/>:null} */}

//       </div>

//     </div>
//   );
// }
