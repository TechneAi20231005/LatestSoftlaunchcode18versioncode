// // import React, { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import PageHeader from "../../components/Common/PageHeader";
// // import { getData } from "../../services/DashboardService";
// // import Chart from "react-apexcharts";
// // import dateFormat from "dateformat";
// // import { awsData } from "../../components/Data/test.json";
// // import * as time from "../../components/Utilities/Functions";
// // import {
// //   postTimerData,
// //   deleteTask,
// // } from "../../services/TicketService/TaskService";

// // export default function HrDashboard(props) {
// //   const data = props.data;
// //   var v1 = 50;
// //   var v2 = 50;
// //   const [count, setCount] = useState();
// //   const [dailyTask, setDailyTask] = useState();
// //   const [upcomingTask, setUpcomingTask] = useState();
// //   const [previousTask, setPreviousTask] = useState();

// //   const [chartData, setChartData] = useState({
// //     series: [50, 59, 40,],
// //     Chart: {
// //       height: "auto",
// //     },
// //     options:{
// //       chart:{
// //         type:'donut',
// //       },
// //       labels: ["Pending Task", "Working Tasks", "Completed Task"],

// //       colors:['#DC4C64','#E4A11B','#198754','#FBFBFB'],

// //     dataLables:{
// //       style:{
// //         textColor:"white",
// //         colors:['#333', '#fff'],
// //       }
// //     }
// //   },
// //     // theme: {
// //     //   // mode: "dark",
// //     //   palette: "palette7",
// //     //   // monochrome: {
// //     //   //   enabled: false,
// //     //   //   shadeTo: "light",
// //     //   //   color:"black",
// //     //   //   shadeIntensity: 0.65,
// //     //   // },
// //     // },
// //     // plotOptions: {
// //     //   pie: {
// //     //     // expandOnClick: true,
// //     //     donut: {
// //     //       size: "65%",

// //     //       labels: {
// //     //         show: true,
// //     //         // total: {
// //     //         //   show: true,
// //     //         //   showAlways: true,
// //     //         // },
// //     //       },
// //     //     },
// //     //   },

// //     // },
// //   });

// //   async function get() {
// //     await getData(localStorage.getItem("id")).then((res) => {
// //       if (res.status == 200) {
// //         setCount(res.data.data.count);

// //         setDailyTask(res.data.data.dailyTask);
// //         setPreviousTask(res.data.data.previousTask);
// //         setUpcomingTask(res.data.data.upcomingTask);

// //         const temp = chartData;

// //         temp.series[0] = res.data.data.pieCharData.pendingTask;
// //         temp.series[1] = res.data.data.pieCharData.workingTask;
// //         temp.series[2] = res.data.data.pieCharData.completedTask;

// //         setChartData(null);
// //         setChartData(temp);
// //       }
// //     });
// //   }

// //   const [timerState, setTimerState] = useState();

// //   const handleTimer = async (e, ticket_id, ticket_task_id, status) => {
// //     var data = {
// //       tenant_id: localStorage.getItem("tenant_id"),
// //       ticket_id: ticket_id,
// //       ticket_task_id: ticket_task_id,
// //       user_id: localStorage.getItem("id"),
// //       status: status,
// //       time: time.getDateTime(),
// //     };
// //     //console.log(data);
// //     await postTimerData(data).then((res) => {
// //       if (res.status === 200) {
// //         if (res.data.status === 1) {
// //           get();
// //         } else {
// //           alert("Failed");
// //         }
// //       }
// //     });
// //   };

// //   useEffect(() => {
// //     get();
// //   }, []);

// //   return (
// //     <div className="container-xxl">
// //       <PageHeader headerTitle="Dashboard" />
// //       <div className="row">
// //         <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
// //           <div className="card bg-danger text-white">
// //             <div className="card-body">
// //               <div className="d-flex align-items-center">
// //                 <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
// //                   <i className="bi bi-journal-check fs-4"></i>
// //                 </div>
// //                 <div className="flex-fill ms-4">
// //                   <div className="">
// //                     <strong style={{ fontSize: "12px" }}>Pending Task</strong>
// //                   </div>
// //                   <div>
// //                     {count && <h5 className="mb-0 ">{count.pendingTask}</h5>}
// //                   </div>
// //                 </div>
// //                 <a
// //                   title="view-members"
// //                   className="btn btn-link text-decoration-none  rounded-1"
// //                 >
// //                   <i className="icofont-hand-drawn-right fs-2 text-white"></i>
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
// //           <div className="card bg-warning text-white">
// //             <div className="card-body">
// //               <div className="d-flex align-items-center">
// //                 <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
// //                   <i className="bi bi-journal-check fs-4"></i>
// //                 </div>
// //                 <div className="flex-fill ms-4">
// //                   <div className="">
// //                     <strong style={{ fontSize: "12px" }}>Working Task</strong>
// //                   </div>
// //                   <div>
// //                     {count && <h5 className="mb-0 ">{count.workingTask}</h5>}
// //                   </div>
// //                 </div>
// //                 <a
// //                   title="view-members"
// //                   className="btn btn-link text-decoration-none  rounded-1"
// //                 >
// //                   <i className="icofont-hand-drawn-right fs-2 text-white"></i>
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
// //           <div className="card bg-success text-white">
// //             <div className="card-body">
// //               <div className="d-flex align-items-center">
// //                 <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
// //                   <i className="bi bi-journal-check fs-4"></i>
// //                 </div>
// //                 <div className="flex-fill ms-4">
// //                   <div className="">
// //                     <strong style={{ fontSize: "12px" }}>Completed Task</strong>
// //                   </div>
// //                   <div>
// //                     {count && <h5 className="mb-0 ">{count.completedTask}</h5>}
// //                   </div>
// //                 </div>
// //                 <a
// //                   title="view-members"
// //                   className="btn btn-link text-decoration-none  rounded-1"
// //                 >
// //                   <i className="icofont-hand-drawn-right fs-2 text-white"></i>
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
// //           <div className="card bg-info text-white">
// //             <div className="card-body">
// //               <div className="d-flex align-items-center">
// //                 <div className="avatar lg  rounded-1 no-thumbnail bg-lightyellow color-defult">
// //                   <i className="bi bi-journal-check fs-4"></i>
// //                 </div>
// //                 <div className="flex-fill ms-4">
// //                   <div className="">
// //                     <strong style={{ fontSize: "12px" }}>Total Task</strong>
// //                   </div>
// //                   <div>
// //                     {count && <h5 className="mb-0 ">{count.totalTask}</h5>}
// //                   </div>
// //                 </div>
// //                 <a
// //                   title="view-members"
// //                   className="btn btn-link text-decoration-none  rounded-1"
// //                 >
// //                   <i className="icofont-hand-drawn-right fs-2 text-white"></i>
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>{" "}
// //       {/*ROW*/}
// //       <div className="row g-3 mb-3 row-deck mt-2">
// //         <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
// //           <div className="card">
// //             <div className="card-header border-bottom text-white bg-primary">
// //               <h5 className="">My Tasks</h5>
// //             </div>
// //             <div className="card-body p-0">
// //               <div
// //                 className="flex-grow-1"
// //                 style={{ height: "250px", overflowY: "scroll" }}
// //               >
// //                 {dailyTask && dailyTask.length > 0 &&
// //                   dailyTask.map((ele, index) => {
// //                     if (ele.time_status == "STOP") {
// //                       return (
// //                         <div
// //                         key={ele.id}
// //                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
// //                           style={{ backgroundColor: "#EBF5FB" }}
// //                         >
// //                           <div className="d-flex align-items-center flex-fill">
// //                             <div className="d-flex flex-column ps-3">
// //                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
// //                                 <h6

// //                                   className="fw-bold mb-0 small-14"
// //                                   title={ele.task_name}
// //                                 >
// //                                   {index + 1}. {ele.main_ticket_id}-
// //                                   {ele.task_name.length < 20
// //                                     ? ele.task_name
// //                                     : ele.task_name.substring(0, 20) + "...."}
// //                                 </h6>
// //                               </Link>
// //                             </div>
// //                           </div>
// //                           {ele.status != "COMPLETED" && (
// //                             <button

// //                               type="button"
// //                               style={{
// //                                 border: "none",
// //                                 borderRadius: "25%",
// //                                 height: "35px",
// //                                 width: "35px",
// //                                 textAlign: "center",
// //                                 margin: "0px",
// //                                 padding: "0px",
// //                               }}
// //                               title="Stop Task"
// //                               onClick={(e) =>
// //                                 handleTimer(e, ele.ticket_id, ele.id, "STOP")
// //                               }
// //                             >
// //                               <i
// //                                 className="icofont-ui-pause"
// //                                 style={{
// //                                   fontSize: "20px",
// //                                   color: "#EC7063",
// //                                   margin: "auto",
// //                                 }}
// //                               ></i>
// //                             </button>
// //                           )}
// //                           {ele && ele && ele.status == "TO_DO" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-danger p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : ele.status == "IN_PROGRESS" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-warning p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-success p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           )}
// //                           <div className="time-block text-truncate ">
// //                             {ele.priority === "Very High" && (
// //                               <span

// //                                 className="badge bg-danger p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "High" && (
// //                               <span

// //                                 className="badge bg-warning p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Medium" && (
// //                               <span

// //                                 className="badge bg-info p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Low" && (
// //                               <span

// //                                 className="badge bg-success p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       );
// //                     }
// //                   })}

// //                 {dailyTask && dailyTask.length > 0 &&
// //                   dailyTask.map((ele, index) => {
// //                     if (ele.time_status == "START") {
// //                       return (
// //                         <div
// //                         key={ele.id}
// //                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
// //                           style={{ backgroundColor: "#EBF5FB" }}
// //                         >
// //                           <div className="d-flex align-items-center flex-fill">
// //                             <div className="d-flex flex-column ps-3">
// //                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
// //                                {ele.task_name ? <h6

// //                                   className="fw-bold mb-0 small-14"
// //                                   title={ele.task_name}
// //                                 >
// //                                   {index + 1}. {ele.main_ticket_id}-
// //                                   {ele.task_name.length < 20
// //                                     ? ele.task_name
// //                                     : ele.task_name.substring(0, 20) + "...."}
// //                                 </h6>: "NO DATA"}
// //                               </Link>
// //                             </div>
// //                           </div>
// //                           {ele.status != "COMPLETED" && (
// //                             <button

// //                               type="button"
// //                               style={{
// //                                 border: "none",
// //                                 borderRadius: "25%",
// //                                 height: "35px",
// //                                 width: "35px",
// //                                 textAlign: "center",
// //                                 margin: "0px",
// //                                 padding: "0px",
// //                               }}
// //                               title="Start Task"
// //                               onClick={(e) =>
// //                                 handleTimer(e, ele.ticket_id, ele.id, "START")
// //                               }
// //                             >
// //                               <i
// //                                 className="icofont-ui-play"
// //                                 style={{
// //                                   fontSize: "20px",
// //                                   color: "#1ABC9C",
// //                                   margin: "auto",
// //                                 }}
// //                               ></i>
// //                             </button>
// //                           )}
// //                           {ele && ele && ele.status == "TO_DO" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-danger p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : ele.status == "IN_PROGRESS" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-warning p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-success p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           )}

// //                           <div className="time-block text-truncate">
// //                             {ele.priority === "Very High" && (
// //                               <span

// //                                 className="badge bg-danger p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "High" && (
// //                               <span

// //                                 className="badge bg-danger p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Medium" && (
// //                               <span

// //                                 className="badge bg-info p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Low" && (
// //                               <span

// //                                 className="badge bg-success p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       );
// //                     }
// //                   })}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
// //           <div className="card ">
// //             <div className="card-header border-bottom bg-primary text-white">
// //               <h5 className="">Pending Tasks</h5>
// //             </div>
// //             <div className="card-body p-0">
// //               <div
// //                 className="flex-grow-1"
// //                 style={{ height: "250px", overflowY: "scroll" }}
// //               >
// //                 {previousTask && previousTask.length > 0 &&
// //                   previousTask.map((ele, index) => {
// //                     if (ele.time_status == "STOP") {
// //                       return (
// //                         <div
// //                         key={ele.id}
// //                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
// //                           style={{ backgroundColor: "#EBF5FB" }}
// //                         >
// //                           <div className="d-flex align-items-center flex-fill">
// //                             <div className="d-flex flex-column ps-3">
// //                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
// //                                 <h6

// //                                   className="fw-bold mb-0 small-14"
// //                                   title={ele.task_name}
// //                                 >
// //                                   {index + 1}. {ele.main_ticket_id}-
// //                                   {ele.task_name.length < 20
// //                                     ? ele.task_name
// //                                     : ele.task_name.substring(0, 20) + "...."}
// //                                 </h6>
// //                               </Link>
// //                             </div>
// //                           </div>

// //                           {ele.status != "COMPLETED" && (
// //                             <button

// //                               type="button"
// //                               style={{
// //                                 border: "none",
// //                                 borderRadius: "25%",
// //                                 height: "35px",
// //                                 width: "35px",
// //                                 textAlign: "center",
// //                                 margin: "0px",
// //                                 padding: "0px",
// //                               }}
// //                               title="Stop Task"
// //                               onClick={(e) =>
// //                                 handleTimer(e, ele.ticket_id, ele.id, "STOP")
// //                               }
// //                             >
// //                               <i
// //                                 className="icofont-ui-pause"
// //                                 style={{
// //                                   fontSize: "20px",
// //                                   color: "#EC7063",
// //                                   margin: "auto",
// //                                 }}
// //                               ></i>
// //                             </button>
// //                           )}

// //                           {ele && ele && ele.status == "TO_DO" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-danger p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : ele.status == "IN_PROGRESS" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-warning p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-success p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           )}
// //                           <span

// //                             className="badge bg-primary p-2"
// //                             style={{ width: "100px", marginRight: "5px" }}
// //                           >
// //                             {ele.end_date}
// //                           </span>

// //                           <div className="time-block text-truncate  ">
// //                             {ele.priority === "Very High" && (
// //                               <span

// //                                 className="badge bg-danger"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}

// //                             {ele.priority === "High" && (
// //                               <span

// //                                 className="badge bg-danger p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Medium" && (
// //                               <span

// //                                 className="badge bg-info p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Low" && (
// //                               <span

// //                                 className="badge bg-success p-2"
// //                                 style={{ width: "100px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       );
// //                     }
// //                   })}

// //                 {previousTask && previousTask.length > 0 &&
// //                   previousTask.map((ele, index) => {
// //                     if (ele.time_status == "START") {
// //                       return (
// //                         <div
// //                         key={ele.id}
// //                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
// //                           style={{ backgroundColor: "#EBF5FB" }}
// //                         >
// //                           <div className="d-flex align-items-center flex-fill">
// //                             <div className="d-flex flex-column ps-3">
// //                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
// //                                 <h6

// //                                   className="fw-bold mb-0 small-14"
// //                                   title={ele.task_name}
// //                                 >
// //                                   {index + 1}. {ele.main_ticket_id}-
// //                                   {ele.task_name.length < 20
// //                                     ? ele.task_name
// //                                     : ele.task_name.substring(0, 20) + "...."}
// //                                 </h6>
// //                               </Link>
// //                             </div>
// //                           </div>
// //                           {ele.status != "COMPLETED" && (
// //                             <button

// //                               type="button"
// //                               style={{
// //                                 border: "none",
// //                                 borderRadius: "25%",
// //                                 height: "35px",
// //                                 width: "35px",
// //                                 textAlign: "center",
// //                                 margin: "0px",
// //                                 padding: "0px",
// //                               }}
// //                               title="Start Task"
// //                               onClick={(e) =>
// //                                 handleTimer(e, ele.ticket_id, ele.id, "START")
// //                               }
// //                             >
// //                               <i
// //                                 className="icofont-ui-play"
// //                                 style={{
// //                                   fontSize: "20px",
// //                                   color: "#1ABC9C",
// //                                   margin: "auto",
// //                                 }}
// //                               ></i>
// //                             </button>
// //                           )}
// //                           {ele && ele && ele.status == "TO_DO" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-danger p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : ele.status == "IN_PROGRESS" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-warning p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-success p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           )}
// //                           <span

// //                             className="badge bg-primary p-2"
// //                             style={{ width: "80px", marginRight: "5px" }}
// //                           >
// //                             {ele.end_date}
// //                           </span>
// //                           <div className="time-block text-truncate">
// //                             {ele.priority === "Very High" && (
// //                               <span

// //                                 className="badge bg-danger p-2"
// //                                 style={{ width: "80px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "High" && (
// //                               <span

// //                                 className="badge bg-danger p-2"
// //                                 style={{ width: "80px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Medium" && (
// //                               <span

// //                                 className="badge bg-info p-2"
// //                                 style={{ width: "80px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Low" && (
// //                               <span

// //                                 className="badge bg-success p-2"
// //                                 style={{ width: "80px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       );
// //                     }
// //                   })}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       <div className="row g-3 mb-3 row-deck ">
// //         <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
// //           <div className="card ">
// //             <div className="card-header border-bottom text-white bg-primary">
// //               <h5 className=" ">Work Analysis</h5>
// //               {/* <h4 className="mb-0 fw-bold ">

// //                                               </h4> */}
// //             </div>
// //             <div className="card-body p-0">
// //               <div
// //                 className="flex-grow-1"
// //                 style={{ height: "250px", overflowY: "scroll" }}
// //               >
// //                 {chartData &&
// //                   chartData.series &&
// //                   chartData.series.length > 0 && (
// //                     <Chart
// //                       options={chartData.options}
// //                       series={chartData.series}
// //                       type="donut"
// //                       height="250"
// //                     />
// //                   )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
// //           <div className="card ">
// //             <div className="card-header border-bottom bg-primary text-white">
// //               <h5 className="">Upcoming Tasks</h5>
// //             </div>
// //             <div className="card-body p-0">
// //               <div
// //                 className="flex-grow-1"
// //                 style={{ height: "250px", overflowY: "scroll" }}
// //               >
// //                 {upcomingTask &&
// //                   upcomingTask.map((ele, index) => {
// //                     if (ele.time_status == "STOP") {
// //                       return (
// //                         <div
// //                         key={ele.id}
// //                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
// //                           style={{ backgroundColor: "#EBF5FB" }}
// //                         >
// //                           <div className="d-flex align-items-center flex-fill">
// //                             <div className="d-flex flex-column ps-3">
// //                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
// //                                 <h6

// //                                 className="fw-bold mb-0 small-14">
// //                                   {index + 1}. {ele.main_ticket_id}-
// //                                   {ele.task_name.length < 20
// //                                     ? ele.task_name
// //                                     : ele.task_name.substring(0, 20) + "...."}
// //                                 </h6>
// //                               </Link>
// //                             </div>
// //                           </div>
// //                           {ele.status != "COMPLETED" && (
// //                             <button

// //                               type="button"
// //                               style={{
// //                                 border: "none",
// //                                 borderRadius: "25%",
// //                                 height: "35px",
// //                                 width: "35px",
// //                                 textAlign: "center",
// //                                 margin: "0px",
// //                                 padding: "0px",
// //                               }}
// //                               title="Stop Task"
// //                               onClick={(e) =>
// //                                 handleTimer(e, ele.ticket_id, ele.id, "STOP")
// //                               }
// //                             >
// //                               <i
// //                                 className="icofont-ui-pause"
// //                                 style={{
// //                                   fontSize: "20px",
// //                                   color: "#EC7063",
// //                                   margin: "auto",
// //                                 }}
// //                               ></i>
// //                             </button>
// //                           )}
// //                           {ele && ele && ele.status == "TO_DO" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-danger p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : ele.status == "IN_PROGRESS" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-warning p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-success p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           )}
// //                           <span

// //                             className="badge bg-primary p-2"
// //                             style={{ width: "100px", marginRight: "5px" }}
// //                           >
// //                             {ele.end_date}
// //                           </span>
// //                           <div className="time-block text-truncate">
// //                             {ele.priority === "Very High" && (
// //                               <span

// //                               className="badge bg-danger p-2">
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "High" && (
// //                               <span
// //                               className="badge bg-danger p-2">
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Medium" && (
// //                               <span
// //                               className="badge bg-info p-2">
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Low" && (
// //                               <span className="badge bg-success p-2">
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       );
// //                     }
// //                   })}

// //                 {upcomingTask &&
// //                   upcomingTask.map((ele, index) => {
// //                     if (ele.time_status == "START") {
// //                       return (
// //                         // <div
// //                         //   className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
// //                         //   style={{ backgroundColor: "#EBF5FB" }}
// //                         // >
// //                         //   <div className="d-flex align-items-center flex-fill">
// //                         //     <div className="d-flex flex-column ps-3">
// //                         //       <Link to={`Ticket/Task/${ele.ticket_id}`}>
// //                         //         <h6 className="fw-bold mb-0 small-14">
// //                         //           {index + 1}. {ele.main_ticket_id}-
// //                         //           {ele.task_name.length < 20
// //                         //             ? ele.task_name
// //                         //             : ele.task_name.substring(0, 20) + "...."}
// //                         //         </h6>
// //                         //       </Link>
// //                         //     </div>
// //                         //   </div>
// //                         //   {ele.status != "COMPLETED" && (
// //                         //     <button
// //                         //       type="button"
// //                         //       style={{
// //                         //         border: "none",
// //                         //         borderRadius: "25%",
// //                         //         height: "35px",
// //                         //         width: "35px",
// //                         //         textAlign: "center",
// //                         //         margin: "0px",
// //                         //         padding: "0px",
// //                         //       }}
// //                         //       title="Start Task"
// //                         //       onClick={(e) =>
// //                         //         handleTimer(e, ele.ticket_id, ele.id, "START")
// //                         //       }
// //                         //     >
// //                         //       <i
// //                         //         className="icofont-ui-play"
// //                         //         style={{
// //                         //           fontSize: "20px",
// //                         //           color: "#1ABC9C",
// //                         //           margin: "auto",
// //                         //         }}
// //                         //       ></i>
// //                         //     </button>
// //                         //   )}
// //                         //   {ele && ele && ele.status == "TO_DO" ? (
// //                         //     <span
// //                         //       style={{ width: "80px", marginRight: "5px" }}
// //                         //       className="badge bg-danger p-2"
// //                         //     >
// //                         //       {ele.status}
// //                         //     </span>
// //                         //   ) : ele.status == "IN_PROGRESS" ? (
// //                         //     <span
// //                         //       style={{ width: "80px", marginRight: "5px" }}
// //                         //       className="badge bg-warning p-2"
// //                         //     >
// //                         //       {ele.status}
// //                         //     </span>
// //                         //   ) : (
// //                         //     <span
// //                         //       style={{ width: "80px", marginRight: "5px" }}
// //                         //       className="badge bg-success p-2"
// //                         //     >
// //                         //       {ele.status}
// //                         //     </span>
// //                         //   )}
// //                         //   <span
// //                         //     className="badge bg-primary p-2"
// //                         //     style={{ width: "100px", marginRight: "5px" }}
// //                         //   >
// //                         //     {ele.end_date}
// //                         //   </span>
// //                         //   <div className="time-block text-truncate">
// //                         //     {ele.priority === "Very High" && (
// //                         //       <span
// //                         //         className="badge bg-danger p-2"
// //                         //         style={{ width: "100px" }}
// //                         //       >
// //                         //         {ele.priority}
// //                         //       </span>
// //                         //     )}
// //                         //     {ele.priority === "High" && (
// //                         //       <span
// //                         //         className="badge bg-danger p-2"
// //                         //         style={{ width: "100px" }}
// //                         //       >
// //                         //         {ele.priority}
// //                         //       </span>
// //                         //     )}
// //                         //     {ele.priority === "Medium" && (
// //                         //       <span
// //                         //         className="badge bg-info p-2"
// //                         //         style={{ width: "100px" }}
// //                         //       >
// //                         //         {ele.priority}
// //                         //       </span>
// //                         //     )}
// //                         //     {ele.priority === "Low" && (
// //                         //       <span
// //                         //         className="badge bg-success p-2"
// //                         //         style={{ width: "100px" }}
// //                         //       >
// //                         //         {ele.priority}
// //                         //       </span>
// //                         //     )}
// //                         //   </div>
// //                         // </div>
// //                         <div
// //                         key={ele.id}
// //                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
// //                           style={{ backgroundColor: "#EBF5FB" }}
// //                         >
// //                           <div className="d-flex align-items-center flex-fill">
// //                             <div className="d-flex flex-column ps-3">
// //                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
// //                                 <h6

// //                                   className="fw-bold mb-0 small-14"
// //                                   title={ele.task_name}
// //                                 >
// //                                   {index + 1}. {ele.main_ticket_id}-
// //                                   {ele.task_name.length < 20
// //                                     ? ele.task_name
// //                                     : ele.task_name.substring(0, 20) + "...."}
// //                                 </h6>
// //                               </Link>
// //                             </div>
// //                           </div>
// //                           {ele.status != "COMPLETED" && (
// //                             <button

// //                               type="button"
// //                               style={{
// //                                 border: "none",
// //                                 borderRadius: "25%",
// //                                 height: "35px",
// //                                 width: "35px",
// //                                 textAlign: "center",
// //                                 margin: "0px",
// //                                 padding: "0px",
// //                               }}
// //                               title="Start Task"
// //                               onClick={(e) =>
// //                                 handleTimer(e, ele.ticket_id, ele.id, "START")
// //                               }
// //                             >
// //                               <i
// //                                 className="icofont-ui-play"
// //                                 style={{
// //                                   fontSize: "20px",
// //                                   color: "#1ABC9C",
// //                                   margin: "auto",
// //                                 }}
// //                               ></i>
// //                             </button>
// //                           )}
// //                           {ele && ele && ele.status == "TO_DO" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-danger p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : ele.status == "IN_PROGRESS" ? (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-warning p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           ) : (
// //                             <span

// //                               style={{ width: "80px", marginRight: "5px" }}
// //                               className="badge bg-success p-2"
// //                             >
// //                               {ele.status}
// //                             </span>
// //                           )}
// //                           <span

// //                             className="badge bg-primary p-2"
// //                             style={{ width: "80px", marginRight: "5px" }}
// //                           >
// //                             {ele.end_date}
// //                           </span>
// //                           <div className="time-block text-truncate">
// //                             {ele.priority === "Very High" && (
// //                               <span

// //                                 className="badge bg-danger p-2"
// //                                 style={{ width: "80px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "High" && (
// //                               <span

// //                                 className="badge bg-danger p-2"
// //                                 style={{ width: "80px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Medium" && (
// //                               <span

// //                                 className="badge bg-info p-2"
// //                                 style={{ width: "80px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                             {ele.priority === "Low" && (
// //                               <span

// //                                 className="badge bg-success p-2"
// //                                 style={{ width: "80px" }}
// //                               >
// //                                 {ele.priority}
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       );
// //                     }
// //                   })}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import PageHeader from "../../components/Common/PageHeader";
// import { getData } from "../../services/DashboardService";
// import Chart from "react-apexcharts";
// // import dateFormat from "dateformat";
// import { awsData } from "../../components/Data/test.json";
// import * as time from "../../components/Utilities/Functions";
// import {
//   postTimerData,
//   deleteTask,
// } from "../../services/TicketService/TaskService";
// import Collapse from "react-bootstrap/Collapse";
// import ListGroup from "react-bootstrap/ListGroup";
// import { _base } from "../../settings/constants";
// import Alert from "../../components/Common/Alert";

// export default function HrDashboard(props) {
//   const data = props.data;
//   var v1 = 50;
//   var v2 = 50;
//   const [count, setCount] = useState();
//   const [dailyTask, setDailyTask] = useState();
//   const [upcomingTask, setUpcomingTask] = useState();
//   const [previousTask, setPreviousTask] = useState();
//   const [totalTask, setTotalTask] = useState();
//   const [completedTask, setCompletedTask] = useState();

//   const [isPendingTaskOpen, setPendingTaskOpen] = useState(false);
//   const [isWorkingTaskOpen, setWorkingTaskOpen] = useState(false);
//   const [isTotalTaskOpen, setTotalTaskOpen] = useState(false);
//   const [isCompleteTaskOpen, setCompleteTaskOpen] = useState(false);
//   const [notify, setNotify] = useState()

//   const handlePendingTaskToggle = () => {
//     setPendingTaskOpen(!isPendingTaskOpen);
//     setWorkingTaskOpen(false);
//     setTotalTaskOpen(false);
//     setCompleteTaskOpen(false);
//   };

//   const handleWorkingTaskToggle = () => {
//     setWorkingTaskOpen(!isWorkingTaskOpen);
//     setPendingTaskOpen(false);
//     setTotalTaskOpen(false);
//     setCompleteTaskOpen(false);
//   };
//   const handleTotalTaskToggle = () => {
//     setTotalTaskOpen(!isTotalTaskOpen);
//     setWorkingTaskOpen(false);
//     setPendingTaskOpen(false);
//     setCompleteTaskOpen(false);
//   };

//   const handleCompleteTask = () => {
//     setCompleteTaskOpen(!isCompleteTaskOpen);
//   };

//   const [chartData, setChartData] = useState({
//     series: [50, 59, 40],
//     Chart: {
//       height: "auto",
//     },
//     options: {
//       chart: {
//         type: "donut",
//       },
//       labels: ["Pending Task", "Working Tasks", "Completed Task"],

//       colors: ["#DC4C64", "#E4A11B", "#198754", "#FBFBFB"],

//       dataLables: {
//         style: {
//           textColor: "white",
//           colors: ["#333", "#fff"],
//         },
//       },
//     },
//   });

//   async function get() {
//     await getData(localStorage.getItem("id")).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status === 1) {
//           console.log("data", res.data.data)
//           setCount(res.data.data.count);

//           setDailyTask(res.data.data.dailyTask);
//           setPreviousTask(res.data.data.previousTask);
//           setUpcomingTask(res.data.data.upcomingTask);
//           setTotalTask(res.data.data.totalTask);
//           setCompletedTask(res.data.completeTask);

//           const temp = chartData;

//           temp.series[0] = res.data.data.pieCharData.pendingTask;
//           temp.series[1] = res.data.data.pieCharData.workingTask;
//           temp.series[2] = res.data.data.pieCharData.completedTask;

//           setChartData(null);
//           setChartData(temp);
//         }
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
//     var tokenExpirationTime = localStorage.getItem("jwt_token_expiration");
//     var currentTime = new Date().getTime();
//     setNotify(null)
//     await postTimerData(data).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status === 1) {
//           get();
//         } else {
//           setNotify({type:"danger", message:res.data.status+" "+"please retry login"})
//         }
//       }
//     });
//   };

//   useEffect(() => {
//     get();
//   }, []);

//   return (
//     <div className="container-xxl">
//                   {notify && <> <Alert alertData={notify} /> </>}

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
//                     {count && <h5 className="mb-0 ">{count.pendingTask}</h5>}
//                   </div>
//                 </div>
//                 <a
//                   title="view-members"
//                   className="btn btn-link text-decoration-none  rounded-1"
//                 >
//                   <Link to={`/${_base}/InsightsTasks`}>
//                     <i className="icofont-hand-drawn-right fs-2 text-white"></i>
//                   </Link>
//                 </a>
//               </div>
//               {previousTask &&
//                 previousTask.length > 0 &&
//                 previousTask.map((ele, index) => {
//                   return (
//                     <Collapse
//                       in={isPendingTaskOpen}
//                       id="pendingTaskCollapse"
//                       className="mt-2"
//                     >
//                       <div key={ele.id}>
//                         <ListGroup
//                           className="list-group mb-2"
//                           style={{ textAlign: "left" }}
//                         >
//                           <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                             <ListGroup.Item
//                               style={{
//                                 width: "300px",
//                                 position: "relative",
//                                 zIndex: "2",
//                                 color: "black",
//                                 maxHeight: "200px",
//                                 // overflowY: "auto",
//                               }}
//                             >

//                               <h6
//                                 className="fw-bold mb-0 small-14"
//                                 title={ele.task_name}
//                               >
//                                 {index + 1}. {ele.main_ticket_id}-
//                                 {ele.task_name.length < 20
//                                   ? ele.task_name
//                                   : ele.task_name.substring(0, 20) + "...."}
//                               </h6>
//                             </ListGroup.Item>
//                           </Link>
//                         </ListGroup>
//                       </div>
//                     </Collapse>
//                   );
//                 })}
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
//                     {count && <h5 className="mb-0 ">{count.completedTask}</h5>}
//                   </div>
//                 </div>
//                 <a
//                   title="view-members"
//                   className="btn btn-link text-decoration-none  rounded-1"
//                 >
//                   <button
//                     onClick={(e) => handleCompleteTask()}
//                     className="btn btn-outline-warning btn-sm "
//                     aria-controls="workingTaskCollapse"
//                     aria-expanded={setCompleteTaskOpen}
//                   >
//                     <Link to={`/${_base}/InsightsCompletedTask`}>
//                       <i className="icofont-hand-drawn-right fs-2 text-white"></i>
//                     </Link>
//                   </button>
//                 </a>
//               </div>

//               {completedTask &&
//                 completedTask.length > 0 &&
//                 completedTask.map((ele, index) => {
//                   return (
//                     <Collapse
//                       in={isCompleteTaskOpen}
//                       id="workingTaskCollapse"
//                       className="mt-2"
//                     >
//                       <div key={ele.id}>
//                         <ListGroup
//                           className="list-group mb-2"
//                           style={{ textAlign: "left" }}
//                         >
//                           <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                             <ListGroup.Item>
//                               <h6
//                                 className="fw-bold mb-0 small-14"
//                                 title={ele.task_name}
//                               >
//                                 {index + 1}. {ele.main_ticket_id}-
//                                 {ele.task_name.length < 20
//                                   ? ele.task_name
//                                   : ele.task_name.substring(0, 20) + "...."}
//                               </h6>
//                             </ListGroup.Item>
//                           </Link>
//                         </ListGroup>
//                       </div>
//                     </Collapse>
//                   );
//                 })}
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
//                     {count && <h5 className="mb-0 ">{count.workingTask}</h5>}
//                   </div>
//                 </div>
//                 <a
//                   title="view-members"
//                   className="btn btn-link text-decoration-none  rounded-1"
//                 >
//                   <button
//                     onClick={(e) => handleWorkingTaskToggle()}
//                     className="btn btn-outline-warning btn-sm "
//                     aria-controls="workingTaskCollapse"
//                     aria-expanded={setWorkingTaskOpen}
//                   >
//                     <i className="icofont-hand-drawn-right fs-2 text-white"></i>
//                   </button>
//                 </a>
//               </div>

//               {dailyTask &&
//                 dailyTask.length > 0 &&
//                 dailyTask.map((ele, index) => {
//                   return (
//                     <Collapse
//                       in={isWorkingTaskOpen}
//                       id="workingTaskCollapse"
//                       className="mt-2"
//                     >
//                       <div key={ele.id}>
//                         <ListGroup
//                           className="list-group mb-2"
//                           style={{ textAlign: "left" }}
//                         >
//                           <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                             <ListGroup.Item>
//                               {" "}
//                               <h6
//                                 className="fw-bold mb-0 small-14"
//                                 title={ele.task_name}
//                               >
//                                 {index + 1}. {ele.main_ticket_id}-
//                                 {ele.task_name.length < 20
//                                   ? ele.task_name
//                                   : ele.task_name.substring(0, 20) + "...."}
//                               </h6>{" "}
//                             </ListGroup.Item>
//                           </Link>
//                         </ListGroup>
//                       </div>
//                     </Collapse>
//                   );
//                 })}
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
//                   <button
//                     // onClick={(e) => handleTotalTaskToggle()}
//                     className="btn btn-outline-warning btn-sm "
//                     aria-controls="workingTaskCollapse"
//                   // aria-expanded={setTotalTaskOpen}
//                   >
//                     <i className="icofont-hand-drawn-right fs-2 text-white"></i>
//                   </button>
//                 </a>
//               </div>

//               {totalTask &&
//                 totalTask.length > 0 &&
//                 totalTask.map((ele, index) => {
//                   return (
//                     <Collapse
//                       in={isTotalTaskOpen}
//                       id="workingTaskCollapse"
//                       className="mt-2"
//                     >
//                       <div key={ele.id}>
//                         <ListGroup
//                           className="list-group mb-2"
//                           style={{ textAlign: "left" }}
//                         >
//                           <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                             <ListGroup.Item>
//                               {" "}
//                               <h6
//                                 className="fw-bold mb-0 small-14"
//                                 title={ele.task_name}
//                               >
//                                 {index + 1}. {ele.main_ticket_id}-
//                                 {ele.task_name.length < 20
//                                   ? ele.task_name
//                                   : ele.task_name.substring(0, 20) + "...."}
//                               </h6>{" "}
//                             </ListGroup.Item>
//                           </Link>
//                         </ListGroup>
//                       </div>
//                     </Collapse>
//                   );
//                 })}
//             </div>
//           </div>
//         </div>
//       </div>{" "}
//       {/*ROW*/}
//       <div className="row g-3 mb-3 row-deck mt-2">
//         <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6">
//           <div className="card">
//             <div className="card-header border-bottom text-white bg-primary">
//               <h5 className="">My Tasks</h5>
//             </div>
//             <div className="card-body p-0">
//               <div
//                 className="flex-grow-1"
//                 style={{ height: "250px", }}
//               >
//                 {dailyTask &&
//                   dailyTask.length > 0 &&
//                   dailyTask.map((ele, index) => {
//                     if (ele.time_status == "STOP") {
//                       return (
//                         <div
//                           key={ele.id}
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

//                 {dailyTask &&
//                   dailyTask.length > 0 &&
//                   dailyTask.map((ele, index) => {
//                     if (ele.time_status == "START") {
//                       return (
//                         <div
//                           key={ele.id}
//                           className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                           style={{ backgroundColor: "#EBF5FB" }}
//                         >
//                           <div className="d-flex align-items-center flex-fill">
//                             <div className="d-flex flex-column ps-3">
//                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
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
//               <h5 className="">Pending Tasks  </h5>
//             </div>
//             <div className="card-body p-0">
//               <div
//                 className="flex-grow-1 custom-scrollable-container"
//                 style={{ height: "250px", overflowY: "scroll" }}
//               >
//                 {previousTask &&
//                   previousTask.length > 0 &&
//                   previousTask.map((ele, index) => {
//                     if (ele.time_status == "STOP") {
//                       return (
//                         <>
//                           <div className="d-flex align-items-center flex-fill mt-2"
//                             style={{ backgroundColor: "#EBF5FB" }}>
//                             <div className="d-flex flex-column ps-3">
//                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                                 <h6
//                                   className="fw-bold mb-0 small-14"
//                                   title={ele.task_name}
//                                 >
//                                   {index + 1}. {ele.main_ticket_id}-
//                                   {ele.task_name.length < 30
//                                     ? ele.task_name
//                                     : ele.task_name.substring(0, 30) + "...."}
//                                 </h6>
//                               </Link>
//                             </div>
//                           </div>
//                           <div
//                             key={ele.id}
//                             // className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"

//                             // style={{ backgroundColor: "#EBF5FB" }}
//                             className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                             style={{ backgroundColor: "#EBF5FB", }}
//                           >

//                             {ele.status != "COMPLETED" && (
//                               <button
//                                 type="button"
//                                 style={{
//                                   border: "none",
//                                   borderRadius: "25%",
//                                   height: "35px",
//                                   width: "35px",
//                                   textAlign: "center",
//                                   margin: "0px",
//                                   padding: "0px",
//                                 }}
//                                 title="Stop Task"
//                                 onClick={(e) =>
//                                   handleTimer(e, ele.ticket_id, ele.id, "STOP")
//                                 }
//                               >
//                                 <i
//                                   className="icofont-ui-pause"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: "#EC7063",
//                                     margin: "auto",
//                                   }}
//                                 ></i>
//                               </button>
//                             )}

//                             {ele && ele.total_worked && (
//                               <span
//                                 // style={{ width: "80px", marginRight: "5px" }}
//                                 // className="badge bg-danger p-2"
//                                 className="text-danger fw-bold mx-2"

//                               >
//                                / {ele.total_worked} /
//                               </span>
//                             )}

//                             {ele && ele.task_hours && (
//                               <span
//                                 // style={{ width: "80px", marginRight: "5px" }}
//                                 // className="badge bg-danger p-2"
//                                 className="text-danger fw-bold mx-2"
//                               >
//                               / {ele.task_hours} /
//                               </span>
//                             )}

//                             {ele && ele && ele.status == "TO_DO" ? (
//                               <span
//                                 style={{ width: "80px", marginRight: "5px" }}
//                                 className="badge bg-danger p-2"
//                               >
//                                 / {ele.status} /
//                               </span>
//                             ) : ele.status == "IN_PROGRESS" ? (
//                               <span
//                                 className="text-warning fw-bold mx-2"

//                               // style={{ width: "80px", marginRight: "5px" }}
//                               // className="badge bg-warning p-2"
//                               >
//                                 / {ele.status} /
//                               </span>
//                             ) : (
//                               <span
//                                 style={{ width: "80px", marginRight: "5px" }}
//                                 className="badge bg-success p-2"
//                               >
//                                 / {ele.status} /
//                               </span>
//                             )}
//                             <span
//                               className="text-primary fw-bold mx-2"
//                             // className="badge bg-primary p-2"
//                             // style={{ width: "100px", marginRight: "5px" }}
//                             >
//                               /  {ele.end_date} /
//                             </span>

//                             <div className="time-block text-truncate  ">
//                               {ele.priority === "Very High" && (
//                                 <span
//                                   className="badge bg-danger"
//                                   style={{ width: "100px" }}
//                                 >
//                                  / {ele.priority} /
//                                 </span>
//                               )}

//                               {ele.priority === "High" && (
//                                 <span
//                                   className="badge bg-danger p-2"
//                                   style={{ width: "100px" }}
//                                 >
//                                  / {ele.priority} /
//                                 </span>
//                               )}
//                               {ele.priority === "Medium" && (
//                                 <span
//                                   className="text-info fw-bold mx-2"

//                                 // className="badge bg-info p-2"
//                                 // style={{ width: "100px" }}
//                                 >
//                                   / {ele.priority} /
//                                 </span>
//                               )}
//                               {ele.priority === "Low" && (
//                                 <span
//                                   className="text-info fw-bold mx-2"
//                                 // className="badge bg-success p-2"
//                                 // style={{ width: "100px" }}
//                                 >
//                                   / {ele.priority} /
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           {/* <hr style={{color:"black"}}/> */}
//                         </>
//                       );
//                     }
//                   })}

//                 {previousTask &&
//                   previousTask.length > 0 &&
//                   previousTask.map((ele, index) => {
//                     if (ele.time_status == "START") {
//                       return (
//                         <>
//                           <div className="d-flex align-items-center flex-fill mt-2"
//                             style={{ backgroundColor: "#EBF5FB" }}>
//                             <div className="d-flex flex-column ps-3">
//                               <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                                 <h6
//                                   // style={{fontSize:"15px"}}
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

//                           <div
//                             key={ele.id}
//                             className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                             style={{ backgroundColor: "#EBF5FB",justifyContent: "flex-start"  }}
//                           >
//                             {/* <div className="d-flex align-items-center flex-fill">

//                             </div> */}
//                             {ele.status != "COMPLETED" && (
//                               <button
//                                 type="button"
//                                 style={{
//                                   border: "none",
//                                   borderRadius: "25%",
//                                   height: "35px",
//                                   width: "35px",
//                                   textAlign: "center",
//                                   margin: "0px",
//                                   padding: "0px",
//                                 }}
//                                 title="Start Task"
//                                 onClick={(e) =>
//                                   handleTimer(e, ele.ticket_id, ele.id, "START")
//                                 }
//                               >
//                                 <i
//                                   className="icofont-ui-play"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: "#1ABC9C",
//                                     margin: "auto",
//                                   }}
//                                 ></i>
//                               </button>
//                             )}
//                             {ele && ele.total_worked && (
//                               <span
//                                 // style={{ width: "80px", marginRight: "5px" }}
//                                 // className="badge bg-danger p-2"
//                                 className="text-danger fw-bold mx-2"

//                               >
//                                 / {ele.total_worked} /
//                               </span>
//                             )}

//                             {ele && ele.task_hours && (
//                               <span
//                                 // style={{ width: "80px", marginRight: "5px" }}
//                                 // className="badge bg-danger p-2"
//                                 className="text-danger fw-bold mx-2"
//                               >
//                                / {ele.task_hours} /
//                               </span>
//                             )}
//                             {ele && ele && ele.status == "TO_DO" ? (
//                               <span
//                                 // style={{ width: "80px", marginRight: "5px" }}
//                                 // className="badge bg-danger p-2"
//                                 className="text-danger fw-bold mx-2"
//                               >
//                                 / {ele.status}
//                               </span>
//                             ) : ele.status == "IN_PROGRESS" ? (
//                               <span
//                                 // style={{ width: "80px", marginRight: "5px" }}
//                                 // className="badge bg-warning p-2"
//                                 className="text-danger fw-bold mx-2"
//                               >
//                                / {ele.status} /
//                               </span>
//                             ) : (
//                               <span
//                                 // style={{ width: "80px", marginRight: "5px" }}
//                                 // className="badge bg-success p-2"
//                                 className="text-danger fw-bold mx-2"
//                               >
//                                 / {ele.status} /
//                               </span>
//                             )}
//                             <span
//                               // className="badge bg-primary p-2"
//                               // style={{ width: "80px", marginRight: "5px" }}
//                               className="text-danger fw-bold mx-2"
//                             >
//                               / {ele.end_date} /
//                             </span>
//                             <div className="time-block text-truncate">
//                               {ele.priority === "Very High" && (
//                                 <span
//                                   // className="badge bg-danger p-2"
//                                   // style={{ width: "80px" }}
//                                   className="text-danger fw-bold mx-2"
//                                 >
//                                   / {ele.priority} /
//                                 </span>
//                               )}
//                               {ele.priority === "High" && (
//                                 <span
//                                   // className="badge bg-danger p-2"
//                                   // style={{ width: "80px" }}
//                                   className="text-danger fw-bold mx-2"
//                                 >
//                                   / {ele.priority} /
//                                 </span>
//                               )}
//                               {ele.priority === "Medium" && (
//                                 <span
//                                   // className="badge bg-info p-2"
//                                   // style={{ width: "80px" }}
//                                   className="text-danger fw-bold mx-2"
//                                 >
//                                   / {ele.priority} /
//                                 </span>
//                               )}
//                               {ele.priority === "Low" && (
//                                 <span
//                                   // className="badge bg-success p-2"
//                                   // style={{ width: "80px" }}
//                                   className="text-danger fw-bold mx-2"
//                                 >
//                                  / {ele.priority} /
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </>
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
//                 style={{ height: "250px", }}
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
//                 style={{ height: "250px",  }}
//               >
//                 {upcomingTask &&
//                   upcomingTask.map((ele, index) => {
//                     if (ele.time_status == "STOP") {
//                       return (
//                         <div
//                           key={ele.id}
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

//                 {upcomingTask &&
//                   upcomingTask.map((ele, index) => {
//                     if (ele.time_status == "START") {
//                       return (
//                         // <div
//                         //   className="py-2 text-white d-flex align-items-center border-bottom flex-wrap"
//                         //   style={{ backgroundColor: "#EBF5FB" }}
//                         // >
//                         //   <div className="d-flex align-items-center flex-fill">
//                         //     <div className="d-flex flex-column ps-3">
//                         //       <Link to={`Ticket/Task/${ele.ticket_id}`}>
//                         //         <h6 className="fw-bold mb-0 small-14">
//                         //           {index + 1}. {ele.main_ticket_id}-
//                         //           {ele.task_name.length < 20
//                         //             ? ele.task_name
//                         //             : ele.task_name.substring(0, 20) + "...."}
//                         //         </h6>
//                         //       </Link>
//                         //     </div>
//                         //   </div>
//                         //   {ele.status != "COMPLETED" && (
//                         //     <button
//                         //       type="button"
//                         //       style={{
//                         //         border: "none",
//                         //         borderRadius: "25%",
//                         //         height: "35px",
//                         //         width: "35px",
//                         //         textAlign: "center",
//                         //         margin: "0px",
//                         //         padding: "0px",
//                         //       }}
//                         //       title="Start Task"
//                         //       onClick={(e) =>
//                         //         handleTimer(e, ele.ticket_id, ele.id, "START")
//                         //       }
//                         //     >
//                         //       <i
//                         //         className="icofont-ui-play"
//                         //         style={{
//                         //           fontSize: "20px",
//                         //           color: "#1ABC9C",
//                         //           margin: "auto",
//                         //         }}
//                         //       ></i>
//                         //     </button>
//                         //   )}
//                         //   {ele && ele && ele.status == "TO_DO" ? (
//                         //     <span
//                         //       style={{ width: "80px", marginRight: "5px" }}
//                         //       className="badge bg-danger p-2"
//                         //     >
//                         //       {ele.status}
//                         //     </span>
//                         //   ) : ele.status == "IN_PROGRESS" ? (
//                         //     <span
//                         //       style={{ width: "80px", marginRight: "5px" }}
//                         //       className="badge bg-warning p-2"
//                         //     >
//                         //       {ele.status}
//                         //     </span>
//                         //   ) : (
//                         //     <span
//                         //       style={{ width: "80px", marginRight: "5px" }}
//                         //       className="badge bg-success p-2"
//                         //     >
//                         //       {ele.status}
//                         //     </span>
//                         //   )}
//                         //   <span
//                         //     className="badge bg-primary p-2"
//                         //     style={{ width: "100px", marginRight: "5px" }}
//                         //   >
//                         //     {ele.end_date}
//                         //   </span>
//                         //   <div className="time-block text-truncate">
//                         //     {ele.priority === "Very High" && (
//                         //       <span
//                         //         className="badge bg-danger p-2"
//                         //         style={{ width: "100px" }}
//                         //       >
//                         //         {ele.priority}
//                         //       </span>
//                         //     )}
//                         //     {ele.priority === "High" && (
//                         //       <span
//                         //         className="badge bg-danger p-2"
//                         //         style={{ width: "100px" }}
//                         //       >
//                         //         {ele.priority}
//                         //       </span>
//                         //     )}
//                         //     {ele.priority === "Medium" && (
//                         //       <span
//                         //         className="badge bg-info p-2"
//                         //         style={{ width: "100px" }}
//                         //       >
//                         //         {ele.priority}
//                         //       </span>
//                         //     )}
//                         //     {ele.priority === "Low" && (
//                         //       <span
//                         //         className="badge bg-success p-2"
//                         //         style={{ width: "100px" }}
//                         //       >
//                         //         {ele.priority}
//                         //       </span>
//                         //     )}
//                         //   </div>
//                         // </div>
//                         <div
//                           key={ele.id}
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

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import { getData } from "../../services/DashboardService";
import Chart from "react-apexcharts";
import * as time from "../../components/Utilities/Functions";
import {
  postTimerData,
  deleteTask,
} from "../../services/TicketService/TaskService";

export default function Dashboard(props) {
  const history = useNavigate();
  console.log(history);
  const data = props.data;
  var v1 = 50;
  var v2 = 50;
  const [count, setCount] = useState();
  const [dailyTask, setDailyTask] = useState();
  const [upcomingTask, setUpcomingTask] = useState();
  const [previousTask, setPreviousTask] = useState();

  const [chartData, setChartData] = useState({
    series: [50, 59, 40],
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
      console.log("hii");
      // Token has expired, log out the user
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("jwt_token_expiration");
      sessionStorage.clear();
      history(`${process.env.PUBLIC_URL}/`);
    }
  };

  async function get() {
    await getData(localStorage.getItem("id")).then((res) => {
      if (res.status == 200) {
        setCount(res.data.data.count);

        setDailyTask(res.data.data.dailyTask);
        setPreviousTask(res.data.data.previousTask);
        setUpcomingTask(res.data.data.upcomingTask);

        const temp = chartData;

        temp.series[0] = res.data.data.pieCharData.pendingTask;
        temp.series[1] = res.data.data.pieCharData.workingTask;
        temp.series[2] = res.data.data.pieCharData.completedTask;

        setChartData(null);
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
                              <Link to={`Ticket/Task/${ele.ticket_id}`}>
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
