import React, { useEffect, useRef, useState, startTransition } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Dropdown, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/Common/PageHeader';
import { _attachmentUrl, userSessionData } from '../../../settings/constants';
import Alert from '../../../components/Common/Alert';
import ErrorLogService from '../../../services/ErrorLogService';
import MyTicketService from '../../../services/TicketService/MyTicketService';
import BasketService from '../../../services/TicketService/BasketService';
import {
  getTaskData,
  getTaskPlanner,
  getRegularizationTime,
  getTaskHistory,
  getTaskRegularizationTime
} from '../../../services/TicketService/TaskService';
import { getAttachment } from '../../../services/OtherService/AttachmentService';
import BasketDetails from './components/BasketDetails';
import TaskData from './components/TaskData';
import TaskModal from './components/TaskModal';
import ApproveRequestModal from './components/ApproveRequestModal';
import ApproveTaskRequestModal from './components/ApproveTaskRequestModal';
import ModuleSetting from '../../../services/SettingService/ModuleSetting';
import { _base } from '../../../settings/constants';
import TestCasesService from '../../../services/TicketService/TestCaseService';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { Astrick } from '../../../components/Utilities/Style';
import SprintService from '../../../services/TicketService/SprintService';
import DataTable from 'react-data-table-component';
import CardLoadingSkeleton from '../../../components/custom/loader/CardLoadingSkeleton';

export default function TaskComponent({ match }) {
  const [notify, setNotify] = useState(null);
  const { id } = useParams();
  const ticketId = id;
  const history = useNavigate();

  const [moduleSetting, setModuleSetting] = useState();
  //Ticket Related
  const [ticketData, setTicketData] = useState();
  const [attachment, setAttachment] = useState();
  const [expectedSolveDate, setExpectedSolveDate] = useState();
  const [ticketStartDate, setTicketStartDate] = useState();
  const [currentTaskStatus, setCurrentTaskStatus] = useState('PENDING');

  //Basket Modal Related
  const [basketModal, setBasketModal] = useState(false);
  const [basketData, setBasketData] = useState(null);
  const [showBasketModal, setShowBasketModal] = useState(false);

  // SPrint State  Planning
  const [sprintModal, setSprintModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [sprintInput, setSprintInput] = useState({
    sprintName: '',
    sprintDescription: '',
    startDate: '',
    endDate: ''
  });
  const sprintDropDownRef = useRef();
  const [sprintData, setSprintdata] = useState([]);
  const [sprintCardData, setSprintCardData] = useState([]);
  const [sprintDropDown, setSprintDropDown] = useState([]);
  const [currentSprintIndex, setCurrentSprintIndex] = useState(null);
  const [sprintReport, setSprintReport] = useState([]);
  const [showSprintReport, setShowSprintReport] = useState(false);
  const [exportSprintData, setExportSprintData] = useState([]);
  const [sprintFirstDate, setSprintFirstDate] = useState('');
  const [sprintLastDate, setSprintLastDate] = useState('');

  const getTicketData = async () => {
    await new MyTicketService()
      .getTicketById(ticketId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setTicketData(res.data.data);
            setTicketStartDate(res.data.data.ticket_date);
            setExpectedSolveDate(res.data.data.expected_solve_date);
            // getAttachment(res.data.data.id, "TICKET").then((resp) => {
            //   if (resp.status === 200) {
            //     setAttachment(resp.data.data);
            //   }
            // });
          }
        }
      })
      .catch((error) => {
        const { response } = error;

        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'Task',
          'Get_Ticket',
          'INSERT',
          errorObject.data.message
        );
      });
  };

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
              var temp = res?.data?.data;
              setBasketData(temp);
            }
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            'Task',
            'Get_Basket',
            'INSERT',
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
  const [taskHistory, setTaskHistory] = useState();
  const [tasksData, setTasksData] = useState();
  const [allTaskList, setAllTaskList] = useState([]); //Defined as empty array
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [basketStartDate, setBasketStartDate] = useState();

  const getBasketData = async (sprint_id, task_status) => {
    const tempAllTaskList = [];
    const taskDataa = [];
    const tasksDataa = [];
    const sprintId = sprint_id ? sprint_id : 0;
    toast.clearWaitingQueue();
    const toastId = toast.loading('Fetching Latest Api Data... (0 sec)');

    let counter = 0;
    const interval = setInterval(() => {
      counter += 1;
      toast.update(toastId, {
        render: `Fetching Latest Api Data... (${counter} sec)`
      });
    }, 1000);
    // setIsLoading(true);
    try {
      await new BasketService()
        .getBasketTaskData(ticketId, sprintId, task_status)
        .then((res) => {
          if (res.status === 200) {
            setShowLoaderModal(false);
            setIsLoading(false);
            if (res.data.status === 1) {
              setIsLoading(false);

              const temp = res.data.data;
              sortingArr = res.data.basket_id_array;
              setIsReviewer(res.data.is_reviewer);
              setOwnership(res.data.ownership);
              setBasketIdArray(res.data.basket_id_array);
              // setIsRegularised(res.data.is_regularized)
              setData(null);
              res.data.data.sort(sortFunc);

              res.data.data.map((tasks, index) => {
                setBasketStartDate(tasks.start_date);
                tasks.taskData.forEach((d, i) => {
                  let taskOwnerNames = d.taskOwners
                    .map((owner) => owner.taskOwnerName)
                    .join(', ');
                  tasksDataa.push({
                    ticket_id_name: d.ticket_id_name,
                    Task_Names: d.task_name,
                    Task_Hours: d.task_hours,
                    Start_Date: d.task_start_date,
                    End_Date: d.task_end_date,
                    Status: d.status,
                    Priority: d.priority,
                    Total_Worked: d.total_worked,
                    Basket_Name: tasks.basket_name,
                    taskOwnerNames: taskOwnerNames,

                    task_type: d.parent_name
                  });
                });
              });
              startTransition(() => {
                setData(res.data.data);
                setTasksData(tasksDataa);
              });

              res.data.data.forEach((dataa) => {
                dataa.taskData.forEach((task) => {
                  tempAllTaskList.push({
                    value: task.id,
                    label: task.task_name
                  });
                });
              });
              setAllTaskList([]);
              setAllTaskList(tempAllTaskList);

              setIsLoading(false); // Loading finished
            }
          }
        });
    } catch (error) {
      toast.update(toastId, {
        render: 'Error fetching data!',
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      clearInterval(interval);
      if (toastId) {
        toast.update(toastId, {
          render: 'Data fetched successfully!',
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 3000
        });
      }
    }
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
      status: 'TO_DO',
      assign_to_user_id: null,
      total_time: null,
      attachment: null,
      parent_name: null
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
            setTaskHistory(res.data.data);
          }
        }
      });
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

  const handleRequestSubmit = (id, taskId) => {};

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
    data: null
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
    data: null
  });

  const [taskDropdown, setTaskDropdown] = useState();

  const handleSprintModal = (data) => {
    setSprintModal(data);
  };

  const loadData = async () => {
    await new ModuleSetting().getSettingByName('Ticket', 'Task').then((res) => {
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

    await new SprintService().getSprintByTicketId(ticketId).then((res) => {
      if (res?.data?.status === 1) {
        const { data } = res?.data;
        const { first_sprint_start_date, last_sprint_end_date } =
          res?.data?.sprint_date;
        setSprintdata(data);
        let temp = res?.data?.data?.map((data) => ({
          label: data.name,
          value: data.id
        }));
        setSprintDropDown(temp);
        setSprintFirstDate(first_sprint_start_date);
        setSprintLastDate(last_sprint_end_date);
      }
    });
  };

  const [buttonType, setButtontype] = useState();
  const [basketList, setBasketList] = useState(null);
  const pushForward = async (e) => {
    var sendArray = {
      user_id: parseInt(userSessionData.userId),
      ticket_id: parseInt(ticketId),
      basket_id_array: basketIdArray
    };

    await new BasketService().pushForward(sendArray).then((res) => {});
  };

  // sprint form handling
  const sprintInputChangeHandler = (e) => {
    setSprintInput((prevSate) => ({
      ...prevSate,
      [e.target.name]: e.target.value
    }));
  };

  const sprintFormHandle = async () => {
    const tenantId = localStorage.getItem('tenant_id');
    const ticket_id = data[0]?.ticket_id;
    const { startDate, endDate } = sprintInput;

    if (!startDate || !endDate) {
      setNotify({
        type: 'danger',
        message: 'Date is missing !!!'
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setNotify({
        type: 'danger',
        message: 'End Date should be greater than start date'
      });
      return;
    }

    const payload = {
      tenant_id: tenantId,
      ticket_id,
      name: sprintInput.sprintName,
      description: sprintInput.sprintDescription,
      start_date: startDate,
      end_date: endDate
    };

    try {
      const res = await new SprintService().postSprintForTicket(payload);
      if (res?.data?.status) {
        setNotify({ type: 'success', message: res?.data?.message });
        setSprintModal({
          showModal: false,
          modalData: '',
          modalHeader: ''
        });
        setSprintCardData([]);
        setSprintDropDown([]);
        setSprintInput({
          sprintName: '',
          sprintDescription: '',
          startDate: '',
          endDate: ''
        });

        const sprintRes = await new SprintService().getSprintByTicketId(
          ticketId
        );
        if (sprintRes?.data?.status) {
          setSprintdata(sprintRes?.data?.data);
          const temp = sprintRes?.data?.data?.map((data) => ({
            label: data.name,
            value: data.id
          }));
          setSprintDropDown(temp);
        } else {
          setNotify({ type: 'danger', message: sprintRes?.data?.message });
        }
      } else {
        setNotify({ type: 'danger', message: res?.data?.message });
      }
    } catch (error) {
      setNotify({
        type: 'danger',
        message: 'An error occurred while processing your request.'
      });
    }
  };

  const sprintDropDownHandler = async (selectedOption) => {
    // setDisableNextBtn(false);
    // setDisablePrevBtn(false);
    setSprintCardData(sprintData);
    setSelectedOption((prevStateOption) => {
      if (selectedOption === prevStateOption) {
        setSprintCardData([]);
        getBasketData(0, currentTaskStatus);
        return null;
      }
      setSprintCardData((prevState) => {
        let filteredArray = prevState?.filter(
          (sprint) => sprint.id === selectedOption?.value
        );
        return filteredArray;
      });

      getBasketData(selectedOption?.value, currentTaskStatus);
      return selectedOption;
    });
  };

  const showNext = async () => {
    // setDisableNextBtn(false);
    // setDisablePrevBtn(false);
    let currentSprintCard = [...sprintCardData];
    let currentIndex = sprintData.findIndex(
      (sprint) => sprint.id === currentSprintCard[0].id
    );

    console.log('selected option', sprintData[currentIndex + 1]);
    setCurrentSprintIndex(currentIndex);
    if (currentIndex !== -1 && currentIndex + 1 < sprintData?.length) {
      let payload = {
        value: sprintData[currentIndex + 1]?.id,
        label: sprintData[currentIndex + 1]?.name
      };
      setSprintCardData([sprintData[currentIndex + 1]]);
      setSelectedOption(payload);
      await getBasketData(sprintData[currentIndex + 1]?.id, currentTaskStatus);
    } else {
      // setDisableNextBtn(true);
    }
  };

  const showPrevious = async () => {
    // setDisableNextBtn(false);
    // setDisablePrevBtn(false);
    let currentSprintCard = [...sprintCardData];
    let currentIndex = sprintData.findIndex(
      (sprint) => sprint.id === currentSprintCard[0].id
    );
    setCurrentSprintIndex(currentIndex);

    if (currentIndex !== -1 && currentIndex - 1 >= 0) {
      let payload = {
        value: sprintData[currentIndex - 1]?.id,
        label: sprintData[currentIndex - 1]?.name
      };
      setSelectedOption(payload);
      setSprintCardData([sprintData[currentIndex - 1]]);
      await getBasketData(sprintData[currentIndex - 1]?.id, currentTaskStatus);
    } else {
      // setDisablePrevBtn(true);
    }
  };

  const getSprintReport = async (sprintId) => {
    await new SprintService()
      .getSprintReportById(ticketId, sprintId)
      .then((res) => {
        if (res?.data?.status) {
          let temp = res?.data?.data;
          setSprintReport(temp);
          setShowSprintReport(true);
          let exportSprintReport = [];
          let count = 0;
          for (let i = 0; i < temp.length; i++) {
            count++;
            temp[i].counter = count;
            exportSprintReport.push({
              'Sr no': count,
              'sprint Name': temp[i]?.sprint_name,
              'Sprint Start date': temp[i]?.sprint_start_date,
              'Sprint End Date': temp[i]?.sprint_end_date,
              'Task Name': temp[i]?.task_name,
              'Task Users': temp[i]?.task_owner,
              'Task Start Date': temp[i]?.task_start_Date,
              'Task End Date': temp[i]?.task_delivery_scheduled,
              'Task actual completed date': temp[i]?.task_completed_at,
              'Task scheduled hours': temp[i]?.task_scheduled_Hours,
              'Task actual hours played': temp[i]?.task_actual_worked,
              'Task status': temp[i]?.task_status,
              'Actual status': temp[i]?.task_actual_status
            });
          }
          setExportSprintData([...exportSprintReport]);
        }
      });
  };

  const viewSprint = (sprintCard) => {
    setShowSprintReport(false);
    setSprintModal({
      showModal: true,
      modalData: sprintCard,
      modalHeader: 'View'
    });
  };

  const updateSprint = async (sprintCard) => {
    setShowSprintReport(false);
    const tenantId = localStorage.getItem('tenant_id');
    const ticket_id = data[0]?.ticket_id;
    let sprint_id = sprintModal?.modalData?.id;
    const { startDate, endDate } = sprintInput;
    if (!startDate || !endDate) {
      setNotify({
        type: 'danger',
        message: 'Date is missing !!!'
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setNotify({
        type: 'danger',
        message: 'Start Date should be greater than end date'
      });
      return;
    }
    const payload = {
      tenant_id: tenantId,
      ticket_id,
      name: sprintInput?.sprintName,
      description: sprintInput?.sprintDescription,
      start_date: sprintInput?.startDate,
      end_date: sprintInput?.endDate
    };

    await new SprintService()
      .updateSprintDetail(payload, sprint_id)
      .then(async (res) => {
        if (res?.data?.status === 1) {
          setNotify({ type: 'success', message: res?.data?.message });
          setSprintModal({
            showModal: false,
            modalData: '',
            modalHeader: ''
          });
          setSprintInput({
            sprintName: '',
            sprintDescription: '',
            startDate: '',
            endDate: ''
          });
          await new SprintService()
            .getSprintByTicketId(ticketId)
            .then((res) => {
              if (res?.data?.status) {
                setSprintdata(res?.data?.data);
                let temp = res?.data?.data?.map((data) => ({
                  label: data.name,
                  value: data.id
                }));
                setSprintDropDown(temp);
                let showUpdatedData = res?.data?.data?.filter(
                  (sprint) => sprint.id === sprint_id
                );
                setSprintCardData(showUpdatedData);
              }
            });
        } else {
          setNotify({ type: 'danger', message: res?.data?.message });
        }
      });
  };

  const column = [
    {
      name: 'Sr no',
      selector: (row) => row.counter,
      sortable: true,
      width: '5%'
    },
    {
      name: 'Sprint Name',
      selector: (row) => row?.sprint_name,
      sortable: true,
      width: '10%'
    },
    {
      name: 'Sprint Start Date',
      selector: (row) => row?.sprint_start_date,
      sortable: true,
      width: '8%'
    },
    {
      name: 'Sprint End Date',
      selector: (row) => row?.sprint_end_date,
      sortable: true,
      width: '8%'
    },
    {
      name: 'Task Name',
      selector: (row) => row?.task_name,
      sortable: true,
      width: '15%'
    },
    {
      name: 'Task User',
      selector: (row) => row?.task_owner,
      sortable: true,
      width: '10%'
    },
    {
      name: 'Task Start Date',
      selector: (row) => row?.task_start_Date,
      sortable: true,
      width: '8%'
    },
    {
      name: 'Task End Date',
      selector: (row) => row?.task_delivery_scheduled,
      sortable: true,
      width: '8%'
    },

    {
      name: 'Task actual completion date',
      selector: (row) => row?.task_completed_at,
      sortable: true,
      width: '10%'
    },
    {
      name: 'Task schedule hours',
      selector: (row) => row?.task_scheduled_Hours,
      sortable: true,
      width: '8%'
    },
    {
      name: 'Task actual hours played',
      selector: (row) => row?.task_actual_worked,
      sortable: true,
      width: '8%'
    },
    {
      name: 'Task status',
      selector: (row) => row?.task_status,
      sortable: true,
      width: '10%'
    },
    {
      name: 'Task actual status',
      selector: (row) => row?.task_actual_status,
      sortable: true,
      width: '10%'
    }
  ];

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
  };
  const [showDetails, setShowDetails] = useState(false);
  const detailsHandler = () => {
    setShowDetails((prev) => !prev);
  };
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // This arrangement can be altered based on how we want the date's format to appear.
  let currentDate = `${day}-${month}-${year}`;
  const goToSprintCalendarGraph = (module) => {
    let linkURL = `/${_base}/Ticket/Task/${ticketId}`;
    localStorage.setItem('PreviosTab', linkURL);
    module === 'calendar'
      ? window.open(`${linkURL}/sprint-calendar`, '_blank')
      : window.open(
          `${linkURL}/sprint-graph/${sprintFirstDate}to${sprintLastDate}`,
          '_blank'
        );
  };

  const handleTaskStatusFilter = (e) => {
    setCurrentTaskStatus(e.target.value);
    getBasketData(
      selectedOption?.value ? selectedOption?.value : 0,
      e.target.value
    );
  };

  useEffect(() => {
    getBasketData(
      selectedOption?.value ? selectedOption?.value : 0,
      currentTaskStatus
    );
    loadData();
    getTicketData();
  }, []);

  function LoaderComponent() {
    return (
      // Container to center-align the spinner and loading text
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        {/* Spinner element with custom styling */}
        <Spinner
          animation="border"
          role="status"
          style={{
            width: '100px',
            height: '100px',
            borderWidth: '5px',
            color: '#484c7f',
            marginBottom: '10px'
          }}
        >
          {/* Visually hidden loading text for accessibility */}
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        {/* Loading text displayed below the spinner */}
        <div style={{ color: '#484c7f', fontSize: '16px', fontWeight: 'bold' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Manage Task" />
      {notify && <Alert alertData={notify} />}

      <div className="card mt-2">
        <div className="card-body">
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="col-3">
                <strong>
                  Ticket -{' '}
                  {tasksData &&
                    tasksData?.length > 0 &&
                    tasksData[0].ticket_id_name}
                  <i onClick={detailsHandler} style={{ cursor: 'pointer' }}>
                    {showDetails ? (
                      <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip>Hide Details</Tooltip>}
                      >
                        <i
                          className="icofont-eye"
                          style={{ fontSize: '27px' }}
                        ></i>
                      </OverlayTrigger>
                    ) : (
                      <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip>Show Details</Tooltip>}
                      >
                        <i
                          className="icofont-eye-blocked"
                          style={{ fontSize: '27px' }}
                        ></i>
                      </OverlayTrigger>
                    )}
                  </i>
                </strong>
              </h5>

              <div className="col-9 col-md-4  d-flex align-items-center justify-content-between">
                <div className=" col-10">
                  {sprintDropDown?.length > 0 && (
                    <Select
                      className=""
                      name="sprint_data"
                      id="sprint_data"
                      options={sprintDropDown}
                      onChange={sprintDropDownHandler}
                      value={selectedOption}
                      ref={sprintDropDownRef}
                      // defaultValue={}
                    />
                  )}
                </div>

                {/* Hamburger Menu for manage task */}
                <div className="col-2 text-end">
                  <Dropdown onClick={handleRegularizationRequest}>
                    <Dropdown.Toggle
                      as="button"
                      variant=""
                      className="btn btn-outline-primary p-1"
                    >
                      <i className="icofont-navigation-menu"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      as="ul"
                      className="border-0 shadow p-2 dropdown-menu-columns"
                    >
                      <li>
                        <ExportToExcel
                          className="btn btn-sm btn-danger btn-custom  w-100"
                          buttonTitle="Export All Task Data"
                          fileName="Task Data"
                          apiData={tasksData}
                        />
                      </li>
                      <li>
                        {ownership &&
                          (ownership === 'TICKET' ||
                            ownership === 'PROJECT') && (
                            <button
                              className="btn btn-sm btn-primary text-white btn-custom w-100"
                              onClick={(e) => {
                                handleShowBasketModal(null);
                              }}
                            >
                              Create Basket
                            </button>
                          )}
                      </li>
                      {/* Add Sprint Button  in hamburger*/}

                      <li>
                        <button
                          className="btn btn-sm btn-primary text-white btn-custom w-100"
                          onClick={(e) => {
                            handleSprintModal({
                              showModal: true,
                              modalData: '',
                              modalHeader: 'Add'
                            });
                          }}
                          disabled={
                            ownership !== 'TICKET' && ownership !== 'PROJECT'
                          }
                        >
                          + Sprint
                        </button>
                      </li>
                      <li>
                        <Link to={`/${_base}/getAllTestCases/` + ticketId}>
                          <button className="btn btn-sm btn-info text-white btn-custom w-100">
                            All Test Cases
                          </button>
                        </Link>
                      </li>

                      {/* <li>
                        {ownership && ownership !== "TASK" && (
                          <button
                            // className="btn btn-sm btn-danger text-white"
                            className="btn btn-sm text-white"
                            style={{ backgroundColor: "#d63384" }}
                            onClick={(e) => {
                              handleShowApproveRequestModal();
                              handleRegularizationRequest();
                            }}
                          >
                            Time Regularization Request
                            {regularizationRequest && (
                              <span className="badge bg-primary p-2">
                                {regularizationRequest?.length > 0
                                  ? regularizationRequest?.length
                                  : ""}
                              </span>
                            )}
                          </button>
                        )}
                      </li> */}
                      <li>
                        <button
                          className="btn btn-sm btn-warning  text-white"
                          onClick={(e) => {
                            handleShowApproveTaskRequestModal();
                            handleTaskRegularizationRequest();
                          }}
                        >
                          Task Regularization Request
                          {taskRegularizationRequest && (
                            <span className="badge bg-warning p-2">
                              {/* {taskRegularizationRequest.length > 0 ? taskRegularizationRequest.length : ""} */}
                            </span>
                          )}
                        </button>
                        {/* )} */}
                      </li>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>

            <div div className="d-flex flex-column">
              {showDetails && (
                <div className="p-0 m-0">
                  <p className="p-0 m-0">
                    <strong>Details :</strong>
                  </p>
                  <p>{ticketData && ticketData.description}</p>

                  <div className="d-flex">
                    {ticketData &&
                      ticketData.attachment &&
                      ticketData.attachment.map((attachment, index) => {
                        return (
                          <div
                            key={index}
                            className="justify-content-start"
                            style={{
                              marginRight: '20px',
                              padding: '5px',
                              maxWidth: '250px'
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: '#EBF5FB' }}
                            >
                              <div className="card-header">
                                {attachment.name}
                                <div className="d-flex justify-content-center p-0 mt-1">
                                  <a
                                    // href={`${_attachmentUrl}/${attachment.path}`}
                                    target="_blank"
                                    className="btn btn-primary btn-sm p-1"
                                  >
                                    View
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Sprint data view */}
      {sprintCardData?.length > 0 && (
        <div className=" card mt-2">
          <div className="card-body">
            <div className="d-flex justify-content-around align-items-center p-2">
              <div className={'col-2 text-end'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  role="button"
                  onClick={showPrevious}
                >
                  <rect
                    x="0.75"
                    y="0.25"
                    width="23.5"
                    height="23.5"
                    rx="11.75"
                    fill="#F9FBFD"
                  />
                  <rect
                    x="0.75"
                    y="0.25"
                    width="23.5"
                    height="23.5"
                    rx="11.75"
                    stroke="#A9A9A9"
                    stroke-width="0.5"
                  />
                  <path
                    d="M15 6.5L10 11.5L15 16.5"
                    stroke="#484C7F"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div className="col-8 text-center">
                <span className=" fs-4 text-primary fw-bold">
                  {sprintCardData[0]?.name}
                </span>
              </div>
              <div
                className={'col-2 text-start'}
                onClick={showNext}
                // disable={disableNextBtn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  role="button"
                >
                  <rect
                    x="0.75"
                    y="0.25"
                    width="23.5"
                    height="23.5"
                    rx="11.75"
                    fill="#F9FBFD"
                  />
                  <rect
                    x="0.75"
                    y="0.25"
                    width="23.5"
                    height="23.5"
                    rx="11.75"
                    stroke="#A9A9A9"
                    stroke-width="0.5"
                  />
                  <path
                    d="M10 16.5L15 11.5L10 6.5"
                    stroke="#484C7F"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <hr className="border  opacity-50"></hr>
            <div className="d-flex justify-content-end align-items-center py-4">
              <div className="fs-6">
                <label>From Date:</label>
                <span className="m-2 bg-body border border-1 pt-2 pb-2 px-5 rounded-2">
                  {sprintCardData[0]?.start_date}
                </span>
              </div>
              <div className="fs-6">
                <label>To Date:</label>
                <span className="m-2 bg-body border border-1 pt-2 pb-2 px-5 rounded-2">
                  {sprintCardData[0]?.end_date}
                </span>
              </div>
              <div className="fs-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  onClick={() => goToSprintCalendarGraph('calendar')}
                >
                  <rect width="28" height="28" rx="8" fill="#484C7F" />
                  <path
                    d="M19.6 7.6H18V6.8C18 6.58783 17.9157 6.38434 17.7657 6.23431C17.6157 6.08429 17.4122 6 17.2 6C16.9878 6 16.7843 6.08429 16.6343 6.23431C16.4843 6.38434 16.4 6.58783 16.4 6.8V7.6H11.6V6.8C11.6 6.58783 11.5157 6.38434 11.3657 6.23431C11.2157 6.08429 11.0122 6 10.8 6C10.5878 6 10.3843 6.08429 10.2343 6.23431C10.0843 6.38434 10 6.58783 10 6.8V7.6H8.4C7.76348 7.6 7.15303 7.85286 6.70294 8.30294C6.25286 8.75303 6 9.36348 6 10V19.6C6 20.2365 6.25286 20.847 6.70294 21.2971C7.15303 21.7471 7.76348 22 8.4 22H19.6C20.2365 22 20.847 21.7471 21.2971 21.2971C21.7471 20.847 22 20.2365 22 19.6V10C22 9.36348 21.7471 8.75303 21.2971 8.30294C20.847 7.85286 20.2365 7.6 19.6 7.6ZM20.4 19.6C20.4 19.8122 20.3157 20.0157 20.1657 20.1657C20.0157 20.3157 19.8122 20.4 19.6 20.4H8.4C8.18783 20.4 7.98434 20.3157 7.83431 20.1657C7.68429 20.0157 7.6 19.8122 7.6 19.6V14H20.4V19.6ZM20.4 12.4H7.6V10C7.6 9.78783 7.68429 9.58434 7.83431 9.43431C7.98434 9.28429 8.18783 9.2 8.4 9.2H10V10C10 10.2122 10.0843 10.4157 10.2343 10.5657C10.3843 10.7157 10.5878 10.8 10.8 10.8C11.0122 10.8 11.2157 10.7157 11.3657 10.5657C11.5157 10.4157 11.6 10.2122 11.6 10V9.2H16.4V10C16.4 10.2122 16.4843 10.4157 16.6343 10.5657C16.7843 10.7157 16.9878 10.8 17.2 10.8C17.4122 10.8 17.6157 10.7157 17.7657 10.5657C17.9157 10.4157 18 10.2122 18 10V9.2H19.6C19.8122 9.2 20.0157 9.28429 20.1657 9.43431C20.3157 9.58434 20.4 9.78783 20.4 10V12.4Z"
                    fill="white"
                  />
                </svg>

                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    onClick={() => goToSprintCalendarGraph('graph')}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.90734 4.90701C2.83334 6.98384 2.83334 10.3215 2.83334 16.9997C2.83334 23.6778 2.83334 27.0169 4.90734 29.0909C6.98417 31.1663 10.3218 31.1663 17 31.1663C23.6782 31.1663 27.0173 31.1663 29.0913 29.0909C31.1667 27.0183 31.1667 23.6778 31.1667 16.9997C31.1667 10.3215 31.1667 6.98242 29.0913 4.90701C27.0187 2.83301 23.6782 2.83301 17 2.83301C10.3218 2.83301 6.98275 2.83301 4.90734 4.90701ZM24.8993 14.8463C25.0717 14.6291 25.1523 14.353 25.1239 14.077C25.0955 13.8011 24.9603 13.5473 24.7472 13.3697C24.5341 13.1921 24.26 13.1049 23.9835 13.1267C23.707 13.1485 23.45 13.2776 23.2673 13.4863L20.7216 16.5407C20.1974 17.1711 19.873 17.555 19.6081 17.7944C19.5392 17.8621 19.4615 17.9202 19.3772 17.9673L19.3616 17.9743L19.3503 17.9687L19.346 17.9673C19.2612 17.9203 19.1831 17.8621 19.1137 17.7944C18.8488 17.5536 18.5258 17.1711 18.0002 16.5407L17.5865 16.0448C17.1218 15.4853 16.7011 14.9823 16.3101 14.6282C15.8837 14.2428 15.3468 13.9 14.6384 13.9C13.9301 13.9 13.3946 14.2428 12.9668 14.6282C12.5758 14.9823 12.1564 15.4853 11.6918 16.0448L9.09925 19.153C9.00995 19.2603 8.94265 19.3841 8.9012 19.5173C8.85974 19.6506 8.84493 19.7907 8.85763 19.9297C8.88327 20.2104 9.01936 20.4694 9.23596 20.6497C9.45257 20.8301 9.73194 20.917 10.0126 20.8913C10.2933 20.8657 10.5523 20.7296 10.7327 20.513L13.2784 17.4587C13.8026 16.8283 14.127 16.4443 14.3919 16.2049C14.4608 16.1373 14.5385 16.0791 14.6228 16.0321L14.6328 16.0278L14.6384 16.025L14.654 16.0321C14.7388 16.0791 14.817 16.1372 14.8863 16.2049C15.1513 16.4458 15.4743 16.8283 15.9998 17.4587L16.4135 17.9545C16.8796 18.5141 17.2989 19.017 17.6899 19.3712C18.1163 19.7565 18.6533 20.0993 19.3616 20.0993C20.0699 20.0993 20.6054 19.7565 21.0333 19.3712C21.4243 19.017 21.8436 18.5141 22.3083 17.9545L24.8993 14.8463Z"
                      fill="#484C7F"
                    />
                  </svg>
                </span>

                <button
                  className="border-0 p-0 ms-1"
                  disabled={ownership !== 'PROJECT'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    role="button"
                    onClick={() => {
                      setSprintInput({
                        sprintName: sprintCardData[0]?.name,
                        sprintDescription: sprintCardData[0]?.description,
                        startDate: sprintCardData[0]?.start_date,
                        endDate: sprintCardData[0]?.end_date
                      });
                      setSprintModal({
                        showModal: true,
                        modalData: sprintCardData[0],
                        modalHeader: 'Update'
                      });
                    }}
                  >
                    <g clip-path="url(#clip0_399_8555)">
                      <rect width="28" height="28" rx="8" fill="#484C7F" />
                      <path
                        d="M9.43889 10.251H8.62593C8.1947 10.251 7.78114 10.4223 7.47622 10.7272C7.1713 11.0321 6.99999 11.4457 6.99999 11.8769V19.1936C6.99999 19.6248 7.1713 20.0384 7.47622 20.3433C7.78114 20.6482 8.1947 20.8195 8.62593 20.8195H15.9426C16.3739 20.8195 16.7874 20.6482 17.0923 20.3433C17.3973 20.0384 17.5686 19.6248 17.5686 19.1936V18.3806"
                        stroke="white"
                        stroke-width="1.5098"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.7556 8.62602L19.1945 11.0649M20.3205 9.91457C20.6407 9.59439 20.8206 9.16013 20.8206 8.70732C20.8206 8.25451 20.6407 7.82025 20.3205 7.50006C20.0003 7.17988 19.566 7 19.1132 7C18.6604 7 18.2262 7.17988 17.906 7.50006L11.0649 14.3168V16.7557H13.5038L20.3205 9.91457Z"
                        stroke="white"
                        stroke-width="1.5098"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_399_8555">
                        <rect width="28" height="28" rx="8" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <span className="ms-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    role="button"
                    onClick={() => viewSprint(sprintCardData[0])}
                  >
                    <g clip-path="url(#clip0_399_8561)">
                      <rect width="28" height="28" rx="8" fill="#484C7F" />
                      <path
                        d="M6.16 14.0005C6.89695 12.5549 8.01924 11.3412 9.40282 10.4935C10.7864 9.64588 12.3774 9.19727 14 9.19727C15.6226 9.19727 17.2136 9.64588 18.5972 10.4935C19.9808 11.3412 21.103 12.5549 21.84 14.0005C21.103 15.4461 19.9808 16.6597 18.5972 17.5074C17.2136 18.3551 15.6226 18.8037 14 18.8037C12.3774 18.8037 10.7864 18.3551 9.40282 17.5074C8.01924 16.6597 6.89695 15.4461 6.16 14.0005ZM14 17.2005C14.8487 17.2005 15.6626 16.8633 16.2627 16.2632C16.8629 15.6631 17.2 14.8492 17.2 14.0005C17.2 13.1518 16.8629 12.3378 16.2627 11.7377C15.6626 11.1376 14.8487 10.8005 14 10.8005C13.1513 10.8005 12.3374 11.1376 11.7373 11.7377C11.1371 12.3378 10.8 13.1518 10.8 14.0005C10.8 14.8492 11.1371 15.6631 11.7373 16.2632C12.3374 16.8633 13.1513 17.2005 14 17.2005ZM14 15.6005C13.5757 15.6005 13.1687 15.4319 12.8686 15.1318C12.5686 14.8318 12.4 14.4248 12.4 14.0005C12.4 13.5761 12.5686 13.1692 12.8686 12.8691C13.1687 12.569 13.5757 12.4005 14 12.4005C14.4243 12.4005 14.8313 12.569 15.1314 12.8691C15.4314 13.1692 15.6 13.5761 15.6 14.0005C15.6 14.4248 15.4314 14.8318 15.1314 15.1318C14.8313 15.4319 14.4243 15.6005 14 15.6005Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_399_8561">
                        <rect width="28" height="28" rx="8" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <span className="ms-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    role="button"
                    onClick={() => getSprintReport(sprintCardData[0]?.id)}
                  >
                    <g clip-path="url(#clip0_399_8568)">
                      <rect width="28" height="28" rx="8" fill="#484C7F" />
                      <path
                        d="M14.8333 11.5003H19.4167L14.8333 6.91699V11.5003ZM9 5.66699H15.6667L20.6667 10.667V20.667C20.6667 21.109 20.4911 21.5329 20.1785 21.8455C19.8659 22.1581 19.442 22.3337 19 22.3337H9C8.55797 22.3337 8.13405 22.1581 7.82149 21.8455C7.50893 21.5329 7.33333 21.109 7.33333 20.667V7.33366C7.33333 6.40866 8.075 5.66699 9 5.66699ZM9.83333 20.667H11.5V15.667H9.83333V20.667ZM13.1667 20.667H14.8333V14.0003H13.1667V20.667ZM16.5 20.667H18.1667V17.3337H16.5V20.667Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_399_8568">
                        <rect width="28" height="28" rx="8" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row col-12">
        {approvalRequest.data &&
          approvalRequest.data.map((item, i) => {
            return (
              <div className="col-2">
                <div
                  className="col-3"
                  style={{ marginRight: '5px', padding: '0px', width: '250px' }}
                >
                  <div className="card" style={{ backgroundColor: '#EBF5FB' }}>
                    <div className="card-header">
                      <p style={{ fontSize: '12px' }}>
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
                            style={{ fontSize: '12px' }}
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
      {showSprintReport ? (
        <div className="text-end">
          <ExportToExcel
            className="my-3 py-2 btn btn-sm btn-danger"
            apiData={exportSprintData}
            fileName="Sprint Report"
          />
          {<DataTable columns={column} data={sprintReport} />}
        </div>
      ) : (
        <div>
          <Card className="mt-2">
            <CardBody className="text-end">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input cp"
                  type="radio"
                  name="task_status"
                  id="task_status_inprogress"
                  value="PENDING"
                  onChange={handleTaskStatusFilter}
                  checked={currentTaskStatus === 'PENDING'}
                />
                <label
                  className={`form-check-label cp ${
                    currentTaskStatus === 'PENDING'
                      ? ' text-primary fw-bold'
                      : ''
                  }`}
                  for="task_status_inprogress"
                >
                  In Progress
                </label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input cp"
                  type="radio"
                  name="task_status"
                  id="task_status_completed"
                  value="COMPLETED"
                  onChange={handleTaskStatusFilter}
                  checked={currentTaskStatus === 'COMPLETED'}
                />
                <label
                  className={`form-check-label cp ${
                    currentTaskStatus === 'COMPLETED'
                      ? ' text-primary fw-bold'
                      : ''
                  }`}
                  for="task_status_completed"
                >
                  Completed
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input cp"
                  type="radio"
                  name="task_status"
                  id="task_status_all"
                  value="all"
                  onChange={handleTaskStatusFilter}
                  checked={currentTaskStatus === 'all'}
                />
                <label
                  className={`form-check-label cp ${
                    currentTaskStatus === 'all' ? ' text-primary fw-bold' : ''
                  }`}
                  for="task_status_all"
                >
                  All
                </label>
              </div>
            </CardBody>
          </Card>
          {isLoading == true ? (
            <CardLoadingSkeleton />
          ) : (
            <>
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
                        className="col-lg-4 col-md-12 col-sm-12"
                      >
                        <div className="p-0 m-0 d-flex justify-content-between">
                          <h5>
                            <strong> {ele.basket_name}</strong>
                          </h5>
                          <span
                            className="badge bg-success text-end mt-2 p-1 px-3"
                            style={{ fontSize: '14px' }}
                          >
                            {ele.total_worked ? ele.total_worked : 0}/
                            {ele?.total_hours}
                          </span>
                        </div>

                        <div className="p-0 m-0 d-flex justify-content-between mt-1">
                          {ele &&
                            (ele.ownership === 'TICKET' ||
                              ele.ownership === 'BASKET' ||
                              ele.ownership === 'PROJECT') && (
                              <button
                                type="button"
                                key={`newTaskBtn_${index}`}
                                className="btn btn-danger btn-sm text-white"
                                style={{ padding: '10px 10px' }}
                                name="newTaskButton"
                                onClick={(e) => {
                                  handleShowTaskModal(
                                    ele.ticket_id,
                                    ele.id,
                                    null
                                  );
                                }}
                              >
                                <i
                                  className="icofont-plus"
                                  style={{
                                    fontSize: '10px',
                                    marginRight: '4px'
                                  }}
                                ></i>
                                New Task
                              </button>
                            )}

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
                            </div>
                          </form>

                          {ele &&
                            (ele.ownership === 'TICKET' ||
                              ele.ownership === 'BASKET' ||
                              ele.ownership === 'PROJECT') && (
                              <button
                                type="button"
                                className="btn btn-primary text-white btn-sm"
                                style={{ padding: '10px 10px' }}
                                onClick={(e) => {
                                  getTicketData();

                                  // Handle the click event here
                                  handleShowBasketModal(ele.id);
                                }}
                              >
                                <i
                                  className="icofont-ui-edit"
                                  style={{
                                    fontSize: '13px',
                                    marginRight: '4px'
                                  }}
                                ></i>
                                Edit Basket
                              </button>
                            )}
                        </div>

                        <div className="ticket-container" key={ele.id}>
                          <div className="ticket">
                            {ele.taskData &&
                              ele.taskData.map((task) => {
                                return (
                                  <TaskData
                                    key={task.id.toString()}
                                    data={task}
                                    date={basketStartDate}
                                    loadBasket={() =>
                                      getBasketData(
                                        selectedOption?.value
                                          ? selectedOption?.value
                                          : 0,
                                        currentTaskStatus
                                      )
                                    }
                                    onShowTaskModal={handleShowTaskModal}
                                    isReviewer={isReviewer}
                                  />
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {showTaskModal && (
                  <TaskModal
                    data={taskModalData}
                    show={showTaskModal}
                    ownership={ownership}
                    loadBasket={() =>
                      getBasketData(
                        selectedOption?.value ? selectedOption?.value : 0,
                        currentTaskStatus
                      )
                    }
                    allTaskList={allTaskList}
                    taskDropdown={taskDropdown}
                    close={handleCloseTaskModal}
                    sprintId={sprintCardData[currentSprintIndex]?.id || 0}
                    moduleSetting={moduleSetting}
                    expectedSolveDate={expectedSolveDate}
                    ticketStartDate={ticketStartDate}
                  />
                )}
                {ticketData && (
                  <BasketDetails
                    ticketId={ticketId}
                    show={showBasketModal}
                    hide={handleCloseBasketModal}
                    data={basketData}
                    loadData={() =>
                      getBasketData(
                        selectedOption?.value ? selectedOption?.value : 0,
                        currentTaskStatus
                      )
                    }
                  />
                )}

                {approveRequestModal && (
                  <ApproveRequestModal
                    show={approveRequestModal.show}
                    hide={handleCloseApproveRequestModal}
                    data={regularizationRequest && regularizationRequest}
                    ticketId={ticketId}
                  />
                )}

                {taskRegularizationRequest && (
                  <ApproveTaskRequestModal
                    show={approveTaskRequestModal.show}
                    hide={handleCloseApproveTaskRequestModal}
                    data={taskRegularizationRequest}
                  />
                )}

                {/* Sprint Modal */}

                <Modal
                  show={sprintModal.showModal}
                  onHide={() =>
                    handleSprintModal({
                      showModal: false,
                      modalData: '',
                      modalHeader: ''
                    })
                  }
                  centered
                  size="lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <b>Sprint Details</b>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form className="">
                      <div className="mb-3">
                        <label
                          for="exampleFormControlInput1"
                          className="form-label"
                        >
                          <b>Sprint Name</b>
                          <span>
                            <Astrick color="red" /> :
                          </span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleFormControlInput1"
                          name="sprintName"
                          placeholder="Enter Sprint name"
                          disabled={sprintModal?.modalHeader == 'View'}
                          defaultValue={sprintModal?.modalData?.name}
                          onChange={(e) => sprintInputChangeHandler(e)}
                          maxlength={50}
                          required={true}
                        />
                      </div>
                      <div>
                        <label
                          for="exampleFormControlInput1"
                          className="form-label"
                        >
                          <b>Sprint Description </b>
                          <span>
                            <Astrick color="red" /> :
                          </span>
                        </label>
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            name="sprintDescription"
                            placeholder="Sprint Descriptions. . ."
                            style={{ height: '40%' }}
                            id="floatingTextarea2"
                            disabled={sprintModal?.modalHeader === 'View'}
                            onChange={(e) => sprintInputChangeHandler(e)}
                            defaultValue={sprintModal?.modalData?.description}
                            maxlength={1000}
                            required={true}
                          ></textarea>
                          <label for="floatingTextarea2">Description</label>
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col-6">
                          <label className="col-form-label">
                            <b>
                              Start Date
                              <Astrick color="red" size="13px" /> :
                            </b>
                          </label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            name="startDate"
                            id="startDate"
                            disabled={sprintModal?.modalHeader === 'View'}
                            onChange={(e) => sprintInputChangeHandler(e)}
                            defaultValue={sprintModal?.modalData?.start_date}
                            onKeyDown={(e) => e.preventDefault()}
                            min={ticketStartDate}
                            max={expectedSolveDate}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label className="col-form-label">
                            <b>
                              End Date
                              <Astrick color="red" size="13px" /> :
                            </b>
                          </label>

                          <input
                            type="date"
                            className="form-control form-control-sm"
                            name="endDate"
                            id="endDate"
                            disabled={sprintModal?.modalHeader === 'View'}
                            onChange={(e) => sprintInputChangeHandler(e)}
                            defaultValue={sprintModal?.modalData?.end_date}
                            min={ticketStartDate}
                            max={expectedSolveDate}
                            onKeyDown={(e) => e.preventDefault()}
                            required
                          />
                        </div>
                      </div>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <button
                      className={
                        sprintModal?.modalHeader === 'View'
                          ? 'd-none'
                          : 'px-4 btn btn-sm  text-white btn-custom'
                      }
                      style={{ backgroundColor: '#484C7F' }}
                      onClick={
                        sprintModal.modalHeader === 'Update'
                          ? updateSprint
                          : sprintFormHandle
                      }
                    >
                      {sprintModal.modalHeader === 'Update' ? 'Update' : 'Save'}
                    </button>
                    <button
                      className="btn btn-sm btn-warning px-4 text-white"
                      onClick={() => {
                        setSprintModal({ ...sprintModal, showModal: false });
                      }}
                    >
                      Cancel
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
