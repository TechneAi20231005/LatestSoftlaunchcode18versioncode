// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import PageHeader from "../../components/Common/PageHeader";
// import { getData } from "../../services/DashboardService";
// import Chart from "react-apexcharts";
// import dateFormat from "dateformat";
// import { awsData } from "../../components/Data/test.json";
// import * as time from "../../components/Utilities/Functions";
// import {
//   postTimerData,
//   deleteTask,
// } from "../../services/TicketService/TaskService";

// import { useSelector, useDispatch } from "react-redux";
// import { _base } from "../../settings/constants";
// import {
//   getAllDashboardData,
//   getAllUserById,
//   getCityData,
//   getCountryData,
//   getCountryDataSort,
//   getCustomerData,
//   getCustomerType,
//   getDynamiucFormData,
//   getEmployeeData,
//   getNotifications,
//   getStateData,
//   getStateDataSort,
// } from "./DashboardAction";
// import { dashboardSlice } from "./DashbordSlice";
// import { getRoles } from "./DashboardAction";
// import { getDesignationData } from "../Masters/DesignationMaster/DesignationAction";
// import {
//   getUserForMyTicketsData,
//   getUserTicketsTest,
// } from "../TicketManagement/MyTicketComponentAction";
// import { getStatusData } from "../Masters/StatusMaster/StatusComponentAction";
// import { departmentData } from "../Masters/DepartmentMaster/DepartmentMasterAction";
// import { getprojectData } from "../ProjectManagement/ProjectMaster/ProjectMasterAction";
// import { moduleMaster } from "../ProjectManagement/ModuleMaster/ModuleAction";
// import {
//   getSubModuleById,
//   subModuleMaster,
// } from "../ProjectManagement/SubModuleMaster/SubModuleMasterAction";
// import SubModuleMasterSlice from "../ProjectManagement/SubModuleMaster/SubModuleMasterSlice";
// import { queryType } from "../Masters/QueryTypeMaster/QueryTypeComponetAction";
// import {
//   getCustomerMappingData,
//   getQueryTypeData,
//   getTemplateData,
//   getcustomerTypeData,
// } from "../Settings/CustomerMapping/Slices/CustomerMappingAction";
// import {
//   dynamicFormData,
//   dynamicFormDropDownData,
//   getAllDropDownData,
// } from "../Masters/DynamicFormDropdown/Slices/DynamicFormDropDownAction";
// import { getRoleData } from "../Masters/RoleMaster/RoleMasterAction";
// import { getCustomerTypeData } from "../Masters/CustomerTypeMaster/CustomerTypeComponentAction";
// import { templateData } from "../Masters/TemplateMaster/TemplateComponetAction";
// import { testingData } from "../Masters/TestingTypeMaster/TestingTypeComponentAction";
// import { getParentDropdown, taskAndTicketMaster } from "../Masters/TaskAndTicketTypeMaster/TaskAndTicketTypeMasterAction";
// import { getBasketByIdData, getBasketTaskData, getmoduleSetting } from "../TicketManagement/TaskManagement/TaskComponentAction";


// export default function HrDashboard(props) {
//   const history = useNavigate();

//   const location = useLocation();
//   const dispatch = useDispatch();
//   const getRolesData = useSelector(
//     (DashboardSlice) => DashboardSlice.dashboard.getRoles
//   );


//   const { id } = useParams()



//   const data = props.data;

//   const [count, setCount] = useState();
//   const [dailyTask, setDailyTask] = useState();
//   const [upcomingTask, setUpcomingTask] = useState();
//   const [previousTask, setPreviousTask] = useState();

//   // const PreviousTask = useSelector(
//   //   (dashboardSlice) => dashboardSlice.dashboard.allDashboardData.previousTask
//   // );
//   // const TotalTask = useSelector(
//   //   (dashboardSlice) => dashboardSlice.dashboard.allDashboardData.totalTask
//   // );
//   // const CompletedTask = useSelector(
//   //   (dashboardSlice) => dashboardSlice.dashboard.allDashboardData.completeTask
//   // );
//   // const UpcomingTask = useSelector(
//   //   (dashboardSlice) => dashboardSlice.dashboard.allDashboardData.upcomingTask
//   // );
//   // const DailyTask = useSelector(
//   //   (dashboardSlice) => dashboardSlice.dashboard.allDashboardData.dailyTask
//   // );
//   // const ChartData = useSelector(
//   //   (dashboardSlice) => dashboardSlice.dashboard.allDashboardData.pieCharData
//   // );
//   // const Count = useSelector(
//   //   (dashboardSlice) => dashboardSlice.dashboard.allDashboardData.count
//   // );

//   const [chartData, setChartData] = useState({
//     series: [2, 5, 7],//Count?.pendingTask, Count?.workingTask, Count?.completedTask
//     Chart: {
//       height: "auto",
//     },
//     options: {
//       chart: {
//         type: "donut",
//       },
//       labels: ["Pending Task", "Working Tasks", "Completed Task"],

//       colors: ["#ff1843", "#ffc107", "#198754", "#FBFBFB"],

//       dataLables: {
//         style: {
//           textColor: "white",
//           colors: ["#333", "#fff"],
//         },
//       },
//     },
//     // theme: {
//     //   // mode: "dark",
//     //   palette: "palette7",
//     //   // monochrome: {
//     //   //   enabled: false,
//     //   //   shadeTo: "light",
//     //   //   color:"black",
//     //   //   shadeIntensity: 0.65,
//     //   // },
//     // },
//     // plotOptions: {
//     //   pie: {
//     //     // expandOnClick: true,
//     //     donut: {
//     //       size: "65%",

//     //       labels: {
//     //         show: true,
//     //         // total: {
//     //         //   show: true,
//     //         //   showAlways: true,
//     //         // },
//     //       },
//     //     },
//     //   },

//     // },
//   });

//   const checkTokenExpiration = () => {
//     const tokenExpirationTime = localStorage.getItem("jwt_token_expiration");
//     const currentTime = new Date().getTime();

//     if (tokenExpirationTime && currentTime > tokenExpirationTime) {
//       // Token has expired, log out the user
//       localStorage.removeItem("jwt_token");
//       localStorage.removeItem("jwt_token_expiration");
//       sessionStorage.clear();
//       history(`${process.env.PUBLIC_URL}/`);
//     }
//   };

//   async function get() {
//     await getData().then((res) => {
//       if (res.status == 200) {
//         setCount(res.data.data.count);

//         setDailyTask(res.data.data.dailyTask);
//         setPreviousTask(res.data.data.PreviousTask);
//         setUpcomingTask(res.data.data.UpcomingTask);

//         const temp = chartData;
//         temp.series[0] = res.data.data.pieCharData.pendingTask;
//         temp.series[1] = res.data.data.pieCharData.workingTask;
//         temp.series[2] = res.data.data.pieCharData.completedTask;

//         setChartData(null);
//         setChartData(temp);
//       }
//     });
//   }

//   const [timerState, setTimerState] = useState();

//   const handleTimer = async (e, ticket_id, ticket_task_id, status) => {
//     var data = {
//       tenant_id: localStorage.getItem("tenant_id"),
//       ticket_id: ticket_id,
//       ticket_task_id: ticket_task_id,
//       user_id: localStorage.getItem("id"),
//       status: status,
//       time: time.getDateTime(),
//     };
//     //console.log(data);
//     await postTimerData(data).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status === 1) {
//           get();
//         } else {
//           checkTokenExpiration();
//         }
//       }
//     });

//   };

//   const loadData = () => {
//     const inputRequired =
//       "id,employee_id,first_name,last_name,middle_name,is_active";
//     dispatch(getCityData());
//     dispatch(getCountryData());
//     dispatch(getStateData());
//     dispatch(getEmployeeData());
//     dispatch(getNotifications());
//     dispatch(getAllDashboardData());
//     dispatch(getRoles());
//     dispatch(getDesignationData());
//     dispatch(getCountryData());
//     dispatch(getStateDataSort());
//     dispatch(getCountryDataSort());
//     dispatch(getCustomerData());
//     dispatch(getCustomerType());
//     dispatch(getAllUserById(localStorage.getItem("id")));
//     dispatch(getUserTicketsTest());
//     dispatch(getUserForMyTicketsData(inputRequired));
//     dispatch(getStatusData());
//     dispatch(departmentData());
//     dispatch(getprojectData());
//     dispatch(moduleMaster());
//     //  dispatch(getSubModuleById())
//     dispatch(subModuleMaster());
//     dispatch(queryType());
//     dispatch(getCustomerMappingData());
//     dispatch(getcustomerTypeData());
//     dispatch(getQueryTypeData());
//     dispatch(getTemplateData());
//     dispatch(dynamicFormDropDownData());
//     dispatch(dynamicFormData());
//     dispatch(getAllDropDownData());
//     dispatch(getDynamiucFormData());
//     dispatch(getCustomerData());
//     dispatch(queryType());




//     // dispatch(getmoduleSetting({module_name:"Ticket",submodule_name:"Task"}))



//     // dispatch(getmoduleSetting("Ticket","Task"))

//     dispatch(getmoduleSetting({ module_name: "Ticket", submodule_name: "Task" }))

//     dispatch(departmentData());
//     dispatch(getRoleData());
//     dispatch(getStatusData())
//     dispatch(getCustomerTypeData())
//     dispatch(templateData())
//     dispatch(testingData());
//     dispatch(taskAndTicketMaster())
//     dispatch(getParentDropdown())
//     //  dispatch(getBasketByIdData(id))
//     // dispatch(getBasketTaskData(ticketId))



//     // dispatch(getAllUserById());
//     dispatch(departmentData());
//     dispatch(getRoleData());
//     dispatch(getStatusData());
//     dispatch(getCustomerTypeData());
//     dispatch(templateData());
//     dispatch(testingData());
//     dispatch(taskAndTicketMaster());
//     dispatch(getParentDropdown());
//     //  dispatch(getBasketByIdData(id))
//   };

//   useEffect(() => {
//     const account_for = localStorage.getItem("account_for");

//     if (account_for === "CUSTOMER") {
//       window.location.href = `${process.env.PUBLIC_URL}/Ticket`
//     }
//     get();
//     loadData();
//   }, []);


//   return (
//     <div className="container-xxl">
//       <PageHeader headerTitle="Dashboard" />
//       <div className="row">
//         <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
//           <div className="card bg-danger text-white">
//             <div className="card-body">
//               <div className="d-flex align-items-center">
//                 <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
//                   <i className="bi bi-journal-check fs-4"></i>
//                 </div>
//                 <div className="flex-fill ms-4">
//                   <div className="">
//                     <strong style={{ fontSize: "12px" }}>Pending Task</strong>
//                   </div>
//                   <div>
//                     {Count && <h5 className="mb-0 ">{Count.pendingTask}</h5>}
//                   </div>
//                 </div>
//                 <a
//                   title="view-members"
//                   className="btn btn-link text-decoration-none  rounded-1"
//                 >
//                   <i className="icofont-hand-drawn-right fs-2 text-white"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
//           <div className="card bg-warning text-white">
//             <div className="card-body">
//               <div className="d-flex align-items-center">
//                 <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
//                   <i className="bi bi-journal-check fs-4"></i>
//                 </div>
//                 <div className="flex-fill ms-4">
//                   <div className="">
//                     <strong style={{ fontSize: "12px" }}>Working Task</strong>
//                   </div>
//                   <div>
//                     {Count && <h5 className="mb-0 ">{Count.workingTask}</h5>}
//                   </div>
//                 </div>
//                 <a
//                   title="view-members"
//                   className="btn btn-link text-decoration-none  rounded-1"
//                 >
//                   <i className="icofont-hand-drawn-right fs-2 text-white"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
//           <div className="card bg-success text-white">
//             <div className="card-body">
//               <div className="d-flex align-items-center">
//                 <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
//                   <i className="bi bi-journal-check fs-4"></i>
//                 </div>
//                 <div className="flex-fill ms-4">
//                   <div className="">
//                     <strong style={{ fontSize: "12px" }}>Completed Task</strong>
//                   </div>
//                   <div>
//                     {Count && <h5 className="mb-0 ">{Count.completedTask}</h5>}
//                   </div>
//                 </div>
//                 <a
//                   title="view-members"
//                   className="btn btn-link text-decoration-none  rounded-1"
//                 >
//                   <i className="icofont-hand-drawn-right fs-2 text-white"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
//           <div className="card bg-info text-white">
//             <div className="card-body">
//               <div className="d-flex align-items-center">
//                 <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
//                   <i className="bi bi-journal-check fs-4"></i>
//                 </div>
//                 <div className="flex-fill ms-4">
//                   <div className="">
//                     <strong style={{ fontSize: "12px" }}>Total Task</strong>
//                   </div>
//                   <div>
//                     {count && <h5 className="mb-0 ">{count.totalTask}</h5>}
//                   </div>
//                 </div>
//                 <a
//                   title="view-members"
//                   className="btn btn-link text-decoration-none  rounded-1"
//                 >
//                   <i className="icofont-hand-drawn-right fs-2 text-white"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>{" "}
//       {/*ROW*/}
//       <div className="row g-3 mb-3 row-deck mt-2">
//         <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
//           <div className="card">
//             <div className="card-header border-bottom text-white bg-primary">
//               <h5 className="">My Tasksss</h5>
//             </div>
//             <div className="card-body p-0">
//               <div
//                 className="flex-grow-1"
//                 style={{ height: "250px", overflowY: "scroll" }}
//               >
//                 {DailyTask &&
//                   DailyTask.length > 0 &&
//                   DailyTask.map((ele, index) => {
//                     if (ele.time_status == "STOP") {
//                       return (
//                         <div
//                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                           style={{ backgroundColor: "#EBF5FB" }}
//                         >
//                           <div className="d-flex align-items-center flex-fill">
//                             <div className="d-flex flex-column ps-3">
//                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                                 <h6
//                                   className="fw-bold mb-0 small-14"
//                                   title={ele.task_name}
//                                 >
//                                   {index + 1}. {ele.main_ticket_id}-
//                                   {ele.task_name.length < 20
//                                     ? ele.task_name
//                                     : ele.task_name.substring(0, 20) + "...."}
//                                 </h6>
//                               </Link>
//                             </div>
//                           </div>
//                           {ele.status !== "COMPLETED" && (
//                             <button
//                               type="button"
//                               style={{
//                                 border: "none",
//                                 borderRadius: "25%",
//                                 height: "35px",
//                                 width: "35px",
//                                 textAlign: "center",
//                                 margin: "0px",
//                                 padding: "0px",
//                               }}
//                               title="Stop Task"
//                               onClick={(e) =>
//                                 handleTimer(e, ele.ticket_id, ele.id, "STOP")
//                               }
//                             >
//                               <i
//                                 className="icofont-ui-pause"
//                                 style={{
//                                   fontSize: "20px",
//                                   color: "#EC7063",
//                                   margin: "auto",
//                                 }}
//                               ></i>
//                             </button>
//                           )}

//                           {ele && ele.total_worked && (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.total_worked}
//                             </span>
//                           )}

//                           {ele && ele.task_hours && (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.task_hours}
//                             </span>
//                           )}

//                           {ele && ele && ele.status == "TO_DO" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : ele.status == "IN_PROGRESS" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-warning p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-success p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           )}
//                           <div className="time-block text-truncate ">
//                             {ele.priority === "Very High" && (
//                               <span
//                                 className="badge bg-danger p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "High" && (
//                               <span
//                                 className="badge bg-warning p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Medium" && (
//                               <span
//                                 className="badge bg-info p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Low" && (
//                               <span
//                                 className="badge bg-success p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     }
//                   })}

//                 {DailyTask &&
//                   DailyTask.length > 0 &&
//                   DailyTask.map((ele, index) => {
//                     if (ele.time_status == "START") {
//                       return (
//                         <div
//                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                           style={{ backgroundColor: "#EBF5FB" }}
//                         >
//                           <div className="d-flex align-items-center flex-fill">
//                             <div className="d-flex flex-column ps-3">
//                               <Link
//                                 to={`/${_base}/Ticket/Task/${ele.ticket_id}`}
//                               >
//                                 {ele.task_name ? (
//                                   <h6
//                                     className="fw-bold mb-0 small-14"
//                                     title={ele.task_name}
//                                   >
//                                     {index + 1}. {ele.main_ticket_id}-
//                                     {ele.task_name.length < 20
//                                       ? ele.task_name
//                                       : ele.task_name.substring(0, 20) + "...."}
//                                   </h6>
//                                 ) : (
//                                   "NO DATA"
//                                 )}
//                               </Link>
//                             </div>
//                           </div>
//                           {ele.status != "COMPLETED" && (
//                             <button
//                               type="button"
//                               style={{
//                                 border: "none",
//                                 borderRadius: "25%",
//                                 height: "35px",
//                                 width: "35px",
//                                 textAlign: "center",
//                                 margin: "0px",
//                                 padding: "0px",
//                               }}
//                               title="Start Task"
//                               onClick={(e) =>
//                                 handleTimer(e, ele.ticket_id, ele.id, "START")
//                               }
//                             >
//                               <i
//                                 className="icofont-ui-play"
//                                 style={{
//                                   fontSize: "20px",
//                                   color: "#1ABC9C",
//                                   margin: "auto",
//                                 }}
//                               ></i>
//                             </button>
//                           )}
//                           {ele && ele && ele.status == "TO_DO" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : ele.status == "IN_PROGRESS" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-warning p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-success p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           )}

//                           <div className="time-block text-truncate">
//                             {ele.priority === "Very High" && (
//                               <span
//                                 className="badge bg-danger p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "High" && (
//                               <span
//                                 className="badge bg-danger p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Medium" && (
//                               <span
//                                 className="badge bg-info p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Low" && (
//                               <span
//                                 className="badge bg-success p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     }
//                   })}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
//           <div className="card ">
//             <div className="card-header border-bottom bg-primary text-white">
//               <h5 className="">Pending Tasks</h5>
//             </div>
//             <div className="card-body p-0">
//               <div
//                 className="flex-grow-1"
//                 style={{ height: "250px", overflowY: "scroll" }}
//               >
//                 {PreviousTask &&
//                   PreviousTask.length > 0 &&
//                   PreviousTask.map((ele, index) => {
//                     if (ele.time_status == "STOP") {
//                       return (
//                         <div
//                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                           style={{ backgroundColor: "#EBF5FB" }}
//                         >
//                           <div className="d-flex align-items-center flex-fill">
//                             <div className="d-flex flex-column ps-3">
//                               {/* <Link to={`Ticket/Task/${ele.ticket_id}`}> */}
//                               <Link
//                                 // to={`/${_base}/Ticket/Task/${ele.ticket_id}`}
//                                 to={`/${_base}/Ticket/Task/` + ele.ticket_id}
//                               >
//                                 <h6
//                                   className="fw-bold mb-0 small-14"
//                                   title={ele.task_name}
//                                 >
//                                   {index + 1}. {ele.main_ticket_id}-
//                                   {ele.task_name.length < 20
//                                     ? ele.task_name
//                                     : ele.task_name.substring(0, 20) + "...."}
//                                 </h6>
//                               </Link>
//                             </div>
//                           </div>

//                           {ele.status != "COMPLETED" && (
//                             <button
//                               type="button"
//                               style={{
//                                 border: "none",
//                                 borderRadius: "25%",
//                                 height: "35px",
//                                 width: "35px",
//                                 textAlign: "center",
//                                 margin: "0px",
//                                 padding: "0px",
//                               }}
//                               title="Stop Task"
//                               onClick={(e) =>
//                                 handleTimer(e, ele.ticket_id, ele.id, "STOP")
//                               }
//                             >
//                               <i
//                                 className="icofont-ui-pause"
//                                 style={{
//                                   fontSize: "20px",
//                                   color: "#EC7063",
//                                   margin: "auto",
//                                 }}
//                               ></i>
//                             </button>
//                           )}

//                           {ele && ele.total_worked && (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.total_worked}
//                             </span>
//                           )}

//                           {ele && ele.task_hours && (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.task_hours}
//                             </span>
//                           )}

//                           {ele && ele && ele.status == "TO_DO" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : ele.status == "IN_PROGRESS" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-warning p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-success p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           )}
//                           <span
//                             className="badge bg-primary p-2"
//                             style={{ width: "100px", marginRight: "5px" }}
//                           >
//                             {ele.end_date}
//                           </span>

//                           <div className="time-block text-truncate  ">
//                             {ele.priority === "Very High" && (
//                               <span
//                                 className="badge bg-danger"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}

//                             {ele.priority === "High" && (
//                               <span
//                                 className="badge bg-danger p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Medium" && (
//                               <span
//                                 className="badge bg-info p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Low" && (
//                               <span
//                                 className="badge bg-success p-2"
//                                 style={{ width: "100px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     }
//                   })}

//                 {PreviousTask &&
//                   PreviousTask.length > 0 &&
//                   PreviousTask.map((ele, index) => {
//                     if (ele.time_status == "START") {
//                       return (
//                         <div
//                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                           style={{ backgroundColor: "#EBF5FB" }}
//                         >
//                           <div className="d-flex align-items-center flex-fill">
//                             <div className="d-flex flex-column ps-3">
//                               <Link
//                                 //  to={`Ticket/Task/${ele.ticket_id}`}
//                                 to={`/${_base}/Ticket/Task/` + ele.ticket_id}
//                               >
//                                 <h6
//                                   className="fw-bold mb-0 small-14"
//                                   title={ele.task_name}
//                                 >
//                                   {index + 1}. {ele.main_ticket_id}-
//                                   {ele.task_name.length < 20
//                                     ? ele.task_name
//                                     : ele.task_name.substring(0, 20) + "...."}
//                                 </h6>
//                               </Link>
//                             </div>
//                           </div>
//                           {ele.status != "COMPLETED" && (
//                             <button
//                               type="button"
//                               style={{
//                                 border: "none",
//                                 borderRadius: "25%",
//                                 height: "35px",
//                                 width: "35px",
//                                 textAlign: "center",
//                                 margin: "0px",
//                                 padding: "0px",
//                               }}
//                               title="Start Task"
//                               onClick={(e) =>
//                                 handleTimer(e, ele.ticket_id, ele.id, "START")
//                               }
//                             >
//                               <i
//                                 className="icofont-ui-play"
//                                 style={{
//                                   fontSize: "20px",
//                                   color: "#1ABC9C",
//                                   margin: "auto",
//                                 }}
//                               ></i>
//                             </button>
//                           )}
//                           {ele && ele && ele.status == "TO_DO" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : ele.status == "IN_PROGRESS" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-warning p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-success p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           )}
//                           <span
//                             className="badge bg-primary p-2"
//                             style={{ width: "80px", marginRight: "5px" }}
//                           >
//                             {ele.end_date}
//                           </span>
//                           <div className="time-block text-truncate">
//                             {ele.priority === "Very High" && (
//                               <span
//                                 className="badge bg-danger p-2"
//                                 style={{ width: "80px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "High" && (
//                               <span
//                                 className="badge bg-danger p-2"
//                                 style={{ width: "80px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Medium" && (
//                               <span
//                                 className="badge bg-info p-2"
//                                 style={{ width: "80px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Low" && (
//                               <span
//                                 className="badge bg-success p-2"
//                                 style={{ width: "80px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     }
//                   })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="row g-3 mb-3 row-deck ">
//         <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
//           <div className="card ">
//             <div className="card-header border-bottom text-white bg-primary">
//               <h5 className=" ">Work Analysis</h5>
//               {/* <h4 className="mb-0 fw-bold ">

//                                                                 </h4> */}
//             </div>
//             <div className="card-body p-0">
//               <div
//                 className="flex-grow-1"
//                 style={{ height: "250px", overflowY: "scroll" }}
//               >
//                 {chartData &&
//                   chartData.series &&
//                   chartData.series.length > 0 && (
//                     <Chart
//                       options={chartData.options}
//                       series={chartData.series}
//                       type="donut"
//                       height="250"
//                     />
//                   )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
//           <div className="card ">
//             <div className="card-header border-bottom bg-primary text-white">
//               <h5 className="">Upcoming Tasks</h5>
//             </div>
//             <div className="card-body p-0">
//               <div
//                 className="flex-grow-1"
//                 style={{ height: "250px", overflowY: "scroll" }}
//               >
//                 {UpcomingTask &&
//                   UpcomingTask.map((ele, index) => {
//                     if (ele.time_status == "STOP") {
//                       return (
//                         <div
//                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                           style={{ backgroundColor: "#EBF5FB" }}
//                         >
//                           <div className="d-flex align-items-center flex-fill">
//                             <div className="d-flex flex-column ps-3">
//                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                                 <h6 className="fw-bold mb-0 small-14">
//                                   {index + 1}. {ele.main_ticket_id}-
//                                   {ele.task_name.length < 20
//                                     ? ele.task_name
//                                     : ele.task_name.substring(0, 20) + "...."}
//                                 </h6>
//                               </Link>
//                             </div>
//                           </div>
//                           {ele.status != "COMPLETED" && (
//                             <button
//                               type="button"
//                               style={{
//                                 border: "none",
//                                 borderRadius: "25%",
//                                 height: "35px",
//                                 width: "35px",
//                                 textAlign: "center",
//                                 margin: "0px",
//                                 padding: "0px",
//                               }}
//                               title="Stop Task"
//                               onClick={(e) =>
//                                 handleTimer(e, ele.ticket_id, ele.id, "STOP")
//                               }
//                             >
//                               <i
//                                 className="icofont-ui-pause"
//                                 style={{
//                                   fontSize: "20px",
//                                   color: "#EC7063",
//                                   margin: "auto",
//                                 }}
//                               ></i>
//                             </button>
//                           )}
//                           {ele && ele && ele.status == "TO_DO" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : ele.status == "IN_PROGRESS" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-warning p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-success p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           )}
//                           <span
//                             className="badge bg-primary p-2"
//                             style={{ width: "100px", marginRight: "5px" }}
//                           >
//                             {ele.end_date}
//                           </span>
//                           <div className="time-block text-truncate">
//                             {ele.priority === "Very High" && (
//                               <span className="badge bg-danger p-2">
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "High" && (
//                               <span className="badge bg-danger p-2">
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Medium" && (
//                               <span className="badge bg-info p-2">
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Low" && (
//                               <span className="badge bg-success p-2">
//                                 {ele.priority}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     }
//                   })}

//                 {UpcomingTask &&
//                   UpcomingTask.map((ele, index) => {
//                     if (ele.time_status == "START") {
//                       return (
//                         <div
//                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                           style={{ backgroundColor: "#EBF5FB" }}
//                         >
//                           <div className="d-flex align-items-center flex-fill">
//                             <div className="d-flex flex-column ps-3">
//                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                                 <h6
//                                   className="fw-bold mb-0 small-14"
//                                   title={ele.task_name}
//                                 >
//                                   {index + 1}. {ele.main_ticket_id}-
//                                   {ele.task_name.length < 20
//                                     ? ele.task_name
//                                     : ele.task_name.substring(0, 20) + "...."}
//                                 </h6>
//                               </Link>
//                             </div>
//                           </div>
//                           {ele.status != "COMPLETED" && (
//                             <button
//                               type="button"
//                               style={{
//                                 border: "none",
//                                 borderRadius: "25%",
//                                 height: "35px",
//                                 width: "35px",
//                                 textAlign: "center",
//                                 margin: "0px",
//                                 padding: "0px",
//                               }}
//                               title="Start Task"
//                               onClick={(e) =>
//                                 handleTimer(e, ele.ticket_id, ele.id, "START")
//                               }
//                             >
//                               <i
//                                 className="icofont-ui-play"
//                                 style={{
//                                   fontSize: "20px",
//                                   color: "#1ABC9C",
//                                   margin: "auto",
//                                 }}
//                               ></i>
//                             </button>
//                           )}
//                           {ele && ele && ele.status == "TO_DO" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-danger p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : ele.status == "IN_PROGRESS" ? (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-warning p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           ) : (
//                             <span
//                               style={{ width: "80px", marginRight: "5px" }}
//                               className="badge bg-success p-2"
//                             >
//                               {ele.status}
//                             </span>
//                           )}
//                           <span
//                             className="badge bg-primary p-2"
//                             style={{ width: "80px", marginRight: "5px" }}
//                           >
//                             {ele.end_date}
//                           </span>
//                           <div className="time-block text-truncate">
//                             {ele.priority === "Very High" && (
//                               <span
//                                 className="badge bg-danger p-2"
//                                 style={{ width: "80px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "High" && (
//                               <span
//                                 className="badge bg-danger p-2"
//                                 style={{ width: "80px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Medium" && (
//                               <span
//                                 className="badge bg-info p-2"
//                                 style={{ width: "80px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                             {ele.priority === "Low" && (
//                               <span
//                                 className="badge bg-success p-2"
//                                 style={{ width: "80px" }}
//                               >
//                                 {ele.priority}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     }
//                   })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

// }

//   const loadData = () => {
//     const inputRequired =
//       "id,employee_id,first_name,last_name,middle_name,is_active";
//     dispatch(getCityData());
//     dispatch(getCountryData());
//     dispatch(getStateData());
//     dispatch(getEmployeeData());
//     dispatch(getNotifications());
//     dispatch(getAllDashboardData());
//     dispatch(getRoles());
//     dispatch(getDesignationData());
//     dispatch(getCountryData());
//     dispatch(getStateDataSort());
//     dispatch(getCountryDataSort());
//     dispatch(getCustomerData());
//     dispatch(getCustomerType());
//     dispatch(getAllUserById(localStorage.getItem("id")));
//     dispatch(getUserTicketsTest());
//     dispatch(getUserForMyTicketsData(inputRequired));
//     dispatch(getStatusData());
//     dispatch(departmentData());
//     dispatch(getprojectData());
//     dispatch(moduleMaster());
//     //  dispatch(getSubModuleById())
//     dispatch(subModuleMaster());
//     dispatch(queryType());
//     dispatch(getCustomerMappingData());
//     dispatch(getcustomerTypeData());
//     dispatch(getQueryTypeData());
//     dispatch(getTemplateData());
//     dispatch(dynamicFormDropDownData());
//     dispatch(dynamicFormData());
//     dispatch(getAllDropDownData());
//     dispatch(getDynamiucFormData());
//     dispatch(getCustomerData());
//     dispatch(queryType());




//     // dispatch(getmoduleSetting({module_name:"Ticket",submodule_name:"Task"}))



//     // dispatch(getmoduleSetting("Ticket","Task"))

//     dispatch(getmoduleSetting({ module_name: "Ticket", submodule_name: "Task" }))

//     dispatch(departmentData());
//     dispatch(getRoleData());
//     dispatch(getStatusData())
//     dispatch(getCustomerTypeData())
//     dispatch(templateData())
//     dispatch(testingData());
//     dispatch(taskAndTicketMaster())
//     dispatch(getParentDropdown())
//     //  dispatch(getBasketByIdData(id))
//     // dispatch(getBasketTaskData(ticketId))



//     // dispatch(getAllUserById());
//     dispatch(departmentData());
//     dispatch(getRoleData());
//     dispatch(getStatusData());
//     dispatch(getCustomerTypeData());
//     dispatch(templateData());
//     dispatch(testingData());
//     dispatch(taskAndTicketMaster());
//     dispatch(getParentDropdown());
//     //  dispatch(getBasketByIdData(id))
//   };
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import { getData } from "../../services/DashboardService";
import Chart from "react-apexcharts";
import dateFormat from "dateformat";
import { awsData } from "../../components/Data/test.json";
import * as time from "../../components/Utilities/Functions";
import {
  postTimerData,
  deleteTask,
} from "../../services/TicketService/TaskService";
import { _base } from "../../settings/constants";
import {
  getAllDashboardData,
  getAllUserById,
  getCityData,
  getCountryData,
  getCountryDataSort,
  getCustomerData,
  getCustomerType,
  getDynamiucFormData,
  getEmployeeData,
  getNotifications,
  getStateData,
  getStateDataSort,
} from "./DashboardAction";
import { dashboardSlice } from "./DashbordSlice";
import { getRoles } from "./DashboardAction";
import { getDesignationData } from "../Masters/DesignationMaster/DesignationAction";
import {
  getUserForMyTicketsData,
  getUserTicketsTest,
} from "../TicketManagement/MyTicketComponentAction";
import { getStatusData } from "../Masters/StatusMaster/StatusComponentAction";
import { departmentData } from "../Masters/DepartmentMaster/DepartmentMasterAction";
import { getprojectData } from "../ProjectManagement/ProjectMaster/ProjectMasterAction";
import { moduleMaster } from "../ProjectManagement/ModuleMaster/ModuleAction";
import {
  getSubModuleById,
  subModuleMaster,
} from "../ProjectManagement/SubModuleMaster/SubModuleMasterAction";
import SubModuleMasterSlice from "../ProjectManagement/SubModuleMaster/SubModuleMasterSlice";
import { queryType } from "../Masters/QueryTypeMaster/QueryTypeComponetAction";
import {
  getCustomerMappingData,
  getQueryTypeData,
  getTemplateData,
  getcustomerTypeData,
} from "../Settings/CustomerMapping/Slices/CustomerMappingAction";
import {
  dynamicFormData,
  dynamicFormDropDownData,
  getAllDropDownData,
} from "../Masters/DynamicFormDropdown/Slices/DynamicFormDropDownAction";
import { getRoleData } from "../Masters/RoleMaster/RoleMasterAction";
import { getCustomerTypeData } from "../Masters/CustomerTypeMaster/CustomerTypeComponentAction";
import { templateData } from "../Masters/TemplateMaster/TemplateComponetAction";
import { testingData } from "../Masters/TestingTypeMaster/TestingTypeComponentAction";
import { getParentDropdown, taskAndTicketMaster } from "../Masters/TaskAndTicketTypeMaster/TaskAndTicketTypeMasterAction";
import { getBasketByIdData, getBasketTaskData, getmoduleSetting } from "../TicketManagement/TaskManagement/TaskComponentAction";
import { useDispatch } from "react-redux";




export default function HrDashboard(props) {
  const history = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const data = props.data;
  var v1 = 50;
  var v2 = 50;
  const [count, setCount] = useState();
  const [dailyTask, setDailyTask] = useState();
  const [upcomingTask, setUpcomingTask] = useState();
  const [previousTask, setPreviousTask] = useState();

  const [chartData, setChartData] = useState({
    series: [0, 0, 0],
    Chart: {
      height: "auto",
    },
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Pending Task", "Working Tasks", "Completed Task"],

      colors: ["#ff1843", "#ffc107", "#198754", "#FBFBFB"],

      dataLables: {
        style: {
          textColor: "white",
          colors: ["#333", "#fff"],
        },
      },
    },
    // theme: {
    //   // mode: "dark",
    //   palette: "palette7",
    //   // monochrome: {
    //   //   enabled: false,
    //   //   shadeTo: "light",
    //   //   color:"black",
    //   //   shadeIntensity: 0.65,
    //   // },
    // },
    // plotOptions: {
    //   pie: {
    //     // expandOnClick: true,
    //     donut: {
    //       size: "65%",

    //       labels: {
    //         show: true,
    //         // total: {
    //         //   show: true,
    //         //   showAlways: true,
    //         // },
    //       },
    //     },
    //   },

    // },
  });
  const checkTokenExpiration = () => {
    const tokenExpirationTime = localStorage.getItem("jwt_token_expiration");
    const currentTime = new Date().getTime();

    if (tokenExpirationTime && currentTime > tokenExpirationTime) {
      // Token has expired, log out the user
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("jwt_token_expiration");
      sessionStorage.clear();
      history(`${process.env.PUBLIC_URL}/`);
    }
  };

  async function get() {
    await getData().then((res) => {
      if (res.status == 200) {
        setCount(res.data.data.count);

        setDailyTask(res.data.data.dailyTask);
        setPreviousTask(res.data.data.previousTask);
        setUpcomingTask(res.data.data.upcomingTask);

        const temp = chartData;
        console.log('temp', temp)
        console.log("res", res.data.data.pieCharData.pendingTask)
        temp.series[0] = res.data.data.pieCharData.pendingTask;
        temp.series[1] = res.data.data.pieCharData.workingTask;
        temp.series[2] = res.data.data.pieCharData.completedTask;

        setChartData(null)
        setChartData(temp);
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
    //console.log(data);
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

  const loadData = () => {
    const inputRequired =
      "id,employee_id,first_name,last_name,middle_name,is_active";
    dispatch(getCityData());
    dispatch(getCountryData());
    dispatch(getStateData());
    dispatch(getEmployeeData());
    dispatch(getNotifications());
    dispatch(getAllDashboardData());
    dispatch(getRoles());
    dispatch(getDesignationData());
    dispatch(getCountryData());
    dispatch(getStateDataSort());
    dispatch(getCountryDataSort());
    dispatch(getCustomerData());
    dispatch(getCustomerType());
    dispatch(getAllUserById(localStorage.getItem("id")));
    dispatch(getUserTicketsTest());
    dispatch(getUserForMyTicketsData(inputRequired));
    dispatch(getStatusData());
    dispatch(departmentData());
    dispatch(getprojectData());
    dispatch(moduleMaster());
    //  dispatch(getSubModuleById())
    dispatch(subModuleMaster());
    dispatch(queryType());
    dispatch(getCustomerMappingData());
    dispatch(getcustomerTypeData());
    dispatch(getQueryTypeData());
    dispatch(getTemplateData());
    dispatch(dynamicFormDropDownData());
    dispatch(dynamicFormData());
    dispatch(getAllDropDownData());
    dispatch(getDynamiucFormData());
    dispatch(getCustomerData());
    dispatch(queryType());
    // dispatch(getmoduleSetting({module_name:"Ticket",submodule_name:"Task"}))
    // dispatch(getmoduleSetting("Ticket","Task"))
    dispatch(getmoduleSetting({ module_name: "Ticket", submodule_name: "Task" }))
    dispatch(departmentData());
    dispatch(getRoleData());
    dispatch(getStatusData())
    dispatch(getCustomerTypeData())
    dispatch(templateData())
    dispatch(testingData());
    dispatch(taskAndTicketMaster())
    dispatch(getParentDropdown())
    //  dispatch(getBasketByIdData(id))
    // dispatch(getBasketTaskData(ticketId))
    // dispatch(getAllUserById());
    dispatch(departmentData());
    dispatch(getRoleData());
    dispatch(getStatusData());
    dispatch(getCustomerTypeData());
    dispatch(templateData());
    dispatch(testingData());
    dispatch(taskAndTicketMaster());
    dispatch(getParentDropdown());
    //  dispatch(getBasketByIdData(id))
  };

  useEffect(() => {
    const account_for = localStorage.getItem("account_for");

    if (account_for === "CUSTOMER") {
      window.location.href = `${process.env.PUBLIC_URL}/Ticket`
    }
    get();
    loadData();
  }, []);

  // useEffect(() => {
  //   setChartData(prevChartData => ({
  //     ...prevChartData,
  //     series: [count?.pendingTask, count?.workingTask, count?.completedTask]
  //   }));
  // }, [count?.pendingTask, count?.workingTask, count?.completedTask])

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
                  <i className="icofont-hand-drawn-right fs-2 text-white"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/*ROW*/}
      <div className="row g-3 mb-3 row-deck mt-2">
        <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
          <div className="card">
            <div className="card-header border-bottom text-white bg-primary">
              <h5 className="">My Tasks</h5>
            </div>
            <div className="card-body p-0">
              <div
                className="flex-grow-1"
                style={{ height: "250px", overflowY: "scroll" }}
              >
                {dailyTask &&
                  dailyTask.length > 0 &&
                  dailyTask.map((ele, index) => {
                    if (ele.time_status == "STOP") {
                      return (
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: "#EBF5FB" }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                            <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                <h6
                                  className="fw-bold mb-0 small-14"
                                  title={ele.task_name}
                                >
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + "...."}
                                </h6>
                              </Link>
                            </div>
                          </div>
                          {ele.status !== "COMPLETED" && (
                            <button
                              type="button"
                              style={{
                                border: "none",
                                borderRadius: "25%",
                                height: "35px",
                                width: "35px",
                                textAlign: "center",
                                margin: "0px",
                                padding: "0px",
                              }}
                              title="Stop Task"
                              onClick={(e) =>
                                handleTimer(e, ele.ticket_id, ele.id, "STOP")
                              }
                            >
                              <i
                                className="icofont-ui-pause"
                                style={{
                                  fontSize: "20px",
                                  color: "#EC7063",
                                  margin: "auto",
                                }}
                              ></i>
                            </button>
                          )}

                          {ele && ele.total_worked && (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.total_worked}
                            </span>
                          )}

                          {ele && ele.task_hours && (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.task_hours}
                            </span>
                          )}

                          {ele && ele && ele.status == "TO_DO" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.status}
                            </span>
                          ) : ele.status == "IN_PROGRESS" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-warning p-2"
                            >
                              {ele.status}
                            </span>
                          ) : (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-success p-2"
                            >
                              {ele.status}
                            </span>
                          )}
                          <div className="time-block text-truncate ">
                            {ele.priority === "Very High" && (
                              <span
                                className="badge bg-danger p-2"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "High" && (
                              <span
                                className="badge bg-warning p-2"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Medium" && (
                              <span
                                className="badge bg-info p-2"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Low" && (
                              <span
                                className="badge bg-success p-2"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
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
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: "#EBF5FB" }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                              <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                {ele.task_name ? (
                                  <h6
                                    className="fw-bold mb-0 small-14"
                                    title={ele.task_name}
                                  >
                                    {index + 1}. {ele.main_ticket_id}-
                                    {ele.task_name.length < 20
                                      ? ele.task_name
                                      : ele.task_name.substring(0, 20) + "...."}
                                  </h6>
                                ) : (
                                  "NO DATA"
                                )}
                              </Link>
                            </div>
                          </div>
                          {ele.status != "COMPLETED" && (
                            <button
                              type="button"
                              style={{
                                border: "none",
                                borderRadius: "25%",
                                height: "35px",
                                width: "35px",
                                textAlign: "center",
                                margin: "0px",
                                padding: "0px",
                              }}
                              title="Start Task"
                              onClick={(e) =>
                                handleTimer(e, ele.ticket_id, ele.id, "START")
                              }
                            >
                              <i
                                className="icofont-ui-play"
                                style={{
                                  fontSize: "20px",
                                  color: "#1ABC9C",
                                  margin: "auto",
                                }}
                              ></i>
                            </button>
                          )}
                          {ele && ele && ele.status == "TO_DO" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.status}
                            </span>
                          ) : ele.status == "IN_PROGRESS" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-warning p-2"
                            >
                              {ele.status}
                            </span>
                          ) : (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-success p-2"
                            >
                              {ele.status}
                            </span>
                          )}

                          <div className="time-block text-truncate">
                            {ele.priority === "Very High" && (
                              <span
                                className="badge bg-danger p-2"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "High" && (
                              <span
                                className="badge bg-danger p-2"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Medium" && (
                              <span
                                className="badge bg-info p-2"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Low" && (
                              <span
                                className="badge bg-success p-2"
                                style={{ width: "100px" }}
                              >
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
                className="flex-grow-1"
                style={{ height: "250px", overflowY: "scroll" }}
              >
                {previousTask &&
                  previousTask.length > 0 &&
                  previousTask.map((ele, index) => {
                    if (ele.time_status == "STOP") {
                      return (
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: "#EBF5FB" }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                            <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                
                                <h6
                                  className="fw-bold mb-0 small-14"
                                  title={ele.task_name}
                                >
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + "...."}
                                </h6>
                              </Link>
                            </div>
                          </div>

                          {ele.status != "COMPLETED" && (
                            <button
                              type="button"
                              style={{
                                border: "none",
                                borderRadius: "25%",
                                height: "35px",
                                width: "35px",
                                textAlign: "center",
                                margin: "0px",
                                padding: "0px",
                              }}
                              title="Stop Task"
                              onClick={(e) =>
                                handleTimer(e, ele.ticket_id, ele.id, "STOP")
                              }
                            >
                              <i
                                className="icofont-ui-pause"
                                style={{
                                  fontSize: "20px",
                                  color: "#EC7063",
                                  margin: "auto",
                                }}
                              ></i>
                            </button>
                          )}

                          {ele && ele.total_worked && (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.total_worked}
                            </span>
                          )}

                          {ele && ele.task_hours && (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.task_hours}
                            </span>
                          )}

                          {ele && ele && ele.status == "TO_DO" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.status}
                            </span>
                          ) : ele.status == "IN_PROGRESS" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-warning p-2"
                            >
                              {ele.status}
                            </span>
                          ) : (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-success p-2"
                            >
                              {ele.status}
                            </span>
                          )}
                          <span
                            className="badge bg-primary p-2"
                            style={{ width: "100px", marginRight: "5px" }}
                          >
                            {ele.end_date}
                          </span>

                          <div className="time-block text-truncate  ">
                            {ele.priority === "Very High" && (
                              <span
                                className="badge bg-danger"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}

                            {ele.priority === "High" && (
                              <span
                                className="badge bg-danger p-2"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Medium" && (
                              <span
                                className="badge bg-info p-2"
                                style={{ width: "100px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Low" && (
                              <span
                                className="badge bg-success p-2"
                                style={{ width: "100px" }}
                              >
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
                    if (ele.time_status == "START") {
                      return (
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: "#EBF5FB" }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                            <Link to={`/${_base}/Ticket/Task/${ele.ticket_id}`}>
                                <h6
                                  className="fw-bold mb-0 small-14"
                                  title={ele.task_name}
                                >
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + "...."}
                                </h6>
                              </Link>
                            </div>
                          </div>
                          {ele.status != "COMPLETED" && (
                            <button
                              type="button"
                              style={{
                                border: "none",
                                borderRadius: "25%",
                                height: "35px",
                                width: "35px",
                                textAlign: "center",
                                margin: "0px",
                                padding: "0px",
                              }}
                              title="Start Task"
                              onClick={(e) =>
                                handleTimer(e, ele.ticket_id, ele.id, "START")
                              }
                            >
                              <i
                                className="icofont-ui-play"
                                style={{
                                  fontSize: "20px",
                                  color: "#1ABC9C",
                                  margin: "auto",
                                }}
                              ></i>
                            </button>
                          )}
                          {ele && ele && ele.status == "TO_DO" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.status}
                            </span>
                          ) : ele.status == "IN_PROGRESS" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-warning p-2"
                            >
                              {ele.status}
                            </span>
                          ) : (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-success p-2"
                            >
                              {ele.status}
                            </span>
                          )}
                          <span
                            className="badge bg-primary p-2"
                            style={{ width: "80px", marginRight: "5px" }}
                          >
                            {ele.end_date}
                          </span>
                          <div className="time-block text-truncate">
                            {ele.priority === "Very High" && (
                              <span
                                className="badge bg-danger p-2"
                                style={{ width: "80px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "High" && (
                              <span
                                className="badge bg-danger p-2"
                                style={{ width: "80px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Medium" && (
                              <span
                                className="badge bg-info p-2"
                                style={{ width: "80px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Low" && (
                              <span
                                className="badge bg-success p-2"
                                style={{ width: "80px" }}
                              >
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
              {/* <h4 className="mb-0 fw-bold ">

                                                                </h4> */}
            </div>
            <div className="card-body p-0">
              <div
                className="flex-grow-1"
                style={{ height: "250px", overflowY: "scroll" }}
              >
                {chartData &&
                  chartData.series &&
                  chartData.series.length > 0 && (
                    <Chart
                      options={chartData.options}
                      series={chartData.series}
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
              <div
                className="flex-grow-1"
                style={{ height: "250px", overflowY: "scroll" }}
              >
                {upcomingTask &&
                  upcomingTask.map((ele, index) => {
                    if (ele.time_status == "STOP") {
                      return (
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: "#EBF5FB" }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                              <Link to={`Ticket/Task/${ele.ticket_id}`}>
                                <h6 className="fw-bold mb-0 small-14">
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + "...."}
                                </h6>
                              </Link>
                            </div>
                          </div>
                          {ele.status != "COMPLETED" && (
                            <button
                              type="button"
                              style={{
                                border: "none",
                                borderRadius: "25%",
                                height: "35px",
                                width: "35px",
                                textAlign: "center",
                                margin: "0px",
                                padding: "0px",
                              }}
                              title="Stop Task"
                              onClick={(e) =>
                                handleTimer(e, ele.ticket_id, ele.id, "STOP")
                              }
                            >
                              <i
                                className="icofont-ui-pause"
                                style={{
                                  fontSize: "20px",
                                  color: "#EC7063",
                                  margin: "auto",
                                }}
                              ></i>
                            </button>
                          )}
                          {ele && ele && ele.status == "TO_DO" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.status}
                            </span>
                          ) : ele.status == "IN_PROGRESS" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-warning p-2"
                            >
                              {ele.status}
                            </span>
                          ) : (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-success p-2"
                            >
                              {ele.status}
                            </span>
                          )}
                          <span
                            className="badge bg-primary p-2"
                            style={{ width: "100px", marginRight: "5px" }}
                          >
                            {ele.end_date}
                          </span>
                          <div className="time-block text-truncate">
                            {ele.priority === "Very High" && (
                              <span className="badge bg-danger p-2">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "High" && (
                              <span className="badge bg-danger p-2">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Medium" && (
                              <span className="badge bg-info p-2">
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Low" && (
                              <span className="badge bg-success p-2">
                                {ele.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}

                {upcomingTask &&
                  upcomingTask.map((ele, index) => {
                    if (ele.time_status == "START") {
                      return (
                        // <div
                        //   className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                        //   style={{ backgroundColor: "#EBF5FB" }}
                        // >
                        //   <div className="d-flex align-items-center flex-fill">
                        //     <div className="d-flex flex-column ps-3">
                        //       <Link to={`Ticket/Task/${ele.ticket_id}`}>
                        //         <h6 className="fw-bold mb-0 small-14">
                        //           {index + 1}. {ele.main_ticket_id}-
                        //           {ele.task_name.length < 20
                        //             ? ele.task_name
                        //             : ele.task_name.substring(0, 20) + "...."}
                        //         </h6>
                        //       </Link>
                        //     </div>
                        //   </div>
                        //   {ele.status != "COMPLETED" && (
                        //     <button
                        //       type="button"
                        //       style={{
                        //         border: "none",
                        //         borderRadius: "25%",
                        //         height: "35px",
                        //         width: "35px",
                        //         textAlign: "center",
                        //         margin: "0px",
                        //         padding: "0px",
                        //       }}
                        //       title="Start Task"
                        //       onClick={(e) =>
                        //         handleTimer(e, ele.ticket_id, ele.id, "START")
                        //       }
                        //     >
                        //       <i
                        //         className="icofont-ui-play"
                        //         style={{
                        //           fontSize: "20px",
                        //           color: "#1ABC9C",
                        //           margin: "auto",
                        //         }}
                        //       ></i>
                        //     </button>
                        //   )}
                        //   {ele && ele && ele.status == "TO_DO" ? (
                        //     <span
                        //       style={{ width: "80px", marginRight: "5px" }}
                        //       className="badge bg-danger p-2"
                        //     >
                        //       {ele.status}
                        //     </span>
                        //   ) : ele.status == "IN_PROGRESS" ? (
                        //     <span
                        //       style={{ width: "80px", marginRight: "5px" }}
                        //       className="badge bg-warning p-2"
                        //     >
                        //       {ele.status}
                        //     </span>
                        //   ) : (
                        //     <span
                        //       style={{ width: "80px", marginRight: "5px" }}
                        //       className="badge bg-success p-2"
                        //     >
                        //       {ele.status}
                        //     </span>
                        //   )}
                        //   <span
                        //     className="badge bg-primary p-2"
                        //     style={{ width: "100px", marginRight: "5px" }}
                        //   >
                        //     {ele.end_date}
                        //   </span>
                        //   <div className="time-block text-truncate">
                        //     {ele.priority === "Very High" && (
                        //       <span
                        //         className="badge bg-danger p-2"
                        //         style={{ width: "100px" }}
                        //       >
                        //         {ele.priority}
                        //       </span>
                        //     )}
                        //     {ele.priority === "High" && (
                        //       <span
                        //         className="badge bg-danger p-2"
                        //         style={{ width: "100px" }}
                        //       >
                        //         {ele.priority}
                        //       </span>
                        //     )}
                        //     {ele.priority === "Medium" && (
                        //       <span
                        //         className="badge bg-info p-2"
                        //         style={{ width: "100px" }}
                        //       >
                        //         {ele.priority}
                        //       </span>
                        //     )}
                        //     {ele.priority === "Low" && (
                        //       <span
                        //         className="badge bg-success p-2"
                        //         style={{ width: "100px" }}
                        //       >
                        //         {ele.priority}
                        //       </span>
                        //     )}
                        //   </div>
                        // </div>
                        <div
                          className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
                          style={{ backgroundColor: "#EBF5FB" }}
                        >
                          <div className="d-flex align-items-center flex-fill">
                            <div className="d-flex flex-column ps-3">
                              <Link to={`Ticket/Task/${ele.ticket_id}`}>
                                <h6
                                  className="fw-bold mb-0 small-14"
                                  title={ele.task_name}
                                >
                                  {index + 1}. {ele.main_ticket_id}-
                                  {ele.task_name.length < 20
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 20) + "...."}
                                </h6>
                              </Link>
                            </div>
                          </div>
                          {ele.status != "COMPLETED" && (
                            <button
                              type="button"
                              style={{
                                border: "none",
                                borderRadius: "25%",
                                height: "35px",
                                width: "35px",
                                textAlign: "center",
                                margin: "0px",
                                padding: "0px",
                              }}
                              title="Start Task"
                              onClick={(e) =>
                                handleTimer(e, ele.ticket_id, ele.id, "START")
                              }
                            >
                              <i
                                className="icofont-ui-play"
                                style={{
                                  fontSize: "20px",
                                  color: "#1ABC9C",
                                  margin: "auto",
                                }}
                              ></i>
                            </button>
                          )}
                          {ele && ele && ele.status == "TO_DO" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-danger p-2"
                            >
                              {ele.status}
                            </span>
                          ) : ele.status == "IN_PROGRESS" ? (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-warning p-2"
                            >
                              {ele.status}
                            </span>
                          ) : (
                            <span
                              style={{ width: "80px", marginRight: "5px" }}
                              className="badge bg-success p-2"
                            >
                              {ele.status}
                            </span>
                          )}
                          <span
                            className="badge bg-primary p-2"
                            style={{ width: "80px", marginRight: "5px" }}
                          >
                            {ele.end_date}
                          </span>
                          <div className="time-block text-truncate">
                            {ele.priority === "Very High" && (
                              <span
                                className="badge bg-danger p-2"
                                style={{ width: "80px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "High" && (
                              <span
                                className="badge bg-danger p-2"
                                style={{ width: "80px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Medium" && (
                              <span
                                className="badge bg-info p-2"
                                style={{ width: "80px" }}
                              >
                                {ele.priority}
                              </span>
                            )}
                            {ele.priority === "Low" && (
                              <span
                                className="badge bg-success p-2"
                                style={{ width: "80px" }}
                              >
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