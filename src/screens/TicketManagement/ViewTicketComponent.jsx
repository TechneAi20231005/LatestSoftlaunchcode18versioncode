// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { _base, userSessionData } from "../../settings/constants";
// import { Spinner, Modal } from "react-bootstrap";
// import Alert from "../../components/Common/Alert";
// import Attachment from "../../components/Common/Attachment";
// import { _attachmentUrl } from "../../settings/constants";
// import { getAttachment } from "../../services/OtherService/AttachmentService";
// import ErrorLogService from "../../services/ErrorLogService";
// import MyTicketService from "../../services/TicketService/MyTicketService";
// import ReportService from "../../services/ReportService/ReportService";
// import PageHeader from "../../components/Common/PageHeader";
// import DatePicker from 'react-date-picker';

// import {
//   getCurrentDate,
//   getDateTime,
// } from "../../components/Utilities/Functions";
// import StatusCard from "../../components/Ticket/StatusCard";
// import TicketChat from "../../components/Ticket/TicketChat";
// import Chart from "react-apexcharts";
// // import Chart from "react-google-charts"
// import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
// import CommentsData from "./CommentData";

// //TAGGING
// import { EditorState } from "draft-js";
// import Editor from "draft-js-plugins-editor";
// // import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
// import createMentionPlugin, {defaultSuggestionsFilter,} from "@draft-js-plugins/mention";
// import "draft-js/dist/Draft.css";
// import "draft-js-mention-plugin/lib/plugin.css";
// import mentions from "./mentions";
// import { convertToHTML } from "draft-convert";
// import editorStyles from "./SimpleMentionEditor.module.css";

// import DesignationService from "../../services/MastersService/DesignationService";
// import Select from "react-select";
// import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";

// const mentionPlugin = createMentionPlugin();
// const { MentionSuggestions } = mentionPlugin;
// const plugins = [mentionPlugin];

// export default function ViewTicketComponent({ match }) {
//   const history = useNavigate();
//   const ticketId = match.params.id;
//   const [notify, setNotify] = useState(null);
//   const [rangeBar, SetRangeBar] = useState(null);
//   const [showLoaderModal, setShowLoaderModal] = useState(false);
//   const [dateValue, setDateValue] = useState(new Date())

//   const [suggestions, setSuggestions] = useState(mentions);
//   const [editorState, setEditorState] = useState(() =>
//     EditorState.createEmpty()
//   );
//   const editor = useRef(null);

//   const onSearchChange = ({ value }) => {
//     setSuggestions(defaultSuggestionsFilter(value, mentions));
//   };

//   const [idCount, setIdCount] = useState();

//   const onAddMention = (e) => {
//     setIdCount((idCount) => [...idCount, e.id]);
//   };

//   const focusEditor = () => {
//     editor.current.focus();
//   };
//   const [commentData, setCommentData] = useState({
//     ticketId: ticketId,
//     userId: localStorage.getItem("id"),
//     comments: [],
//   });
//   const [ba, setBa] = useState(null);
//   const [dev, setDev] = useState(null);
//   const [tester, setTester] = useState(null);
//   const [convertedContent, setConvertedContent] = useState(null);

//   const [data, setData] = useState(null);
//   const [attachment, setAttachment] = useState(null);
//   const [checkRole, setCheckRole] = useState(null);
//   const roleId = sessionStorage.getItem("role_id");
//   const [isSolved, setIsSolved] = useState(false);
//   const current = new Date();
//   const todayDate = `${current.getFullYear()}-${
//     current.getMonth() + 1 < 10
//       ? "0" + current.getMonth() + 1
//       : current.getMonth() + 1
//   }-${current.getDate()}`;
//   const [chart, setChart] = useState(null);
//   const [allUsers, setAllUsers] = useState();
//   const [allUsersString, setAllUsersString] = useState();
//   const [rows, setRows]= useState()
//   const [chartDataa,setChartData]=useState()
//   const loadData = async () => {
//     // setShowLoaderModal(true);
//     // setCommentData(null);
//     const allTempUser = mentions.map((d) => d.name);
//     var tempString = "";
//     allTempUser.forEach((d) => {
//       tempString = tempString + d;
//     });


//     await new MyTicketService().getGanttChart(match.params.id).then((res) => {
//       setChartData(res.data.data["series"])
//       // console.log("==>",res.data.data["series"]);/
//     })
// // console.log("chart==",chartDataa)
//     setAllUsers(allTempUser);
//     setAllUsersString(tempString);
//     //console.log(allTempUser);
//     await new MyTicketService().getTicketById(ticketId).then((res) => {
//       setRows(res.data.data.dynamic_form);
//       // console.log("dynamic",res.data.data)
//       setShowLoaderModal(null);
//       if (allUsersString) {
//         // setShowLoaderModal(false);
//       } else {
//       }
//       if (res.status === 200) {
//         // setShowLoaderModal(false)
//         const data = res.data.data;
//         if (data.status_id == 3) {
//           setIsSolved(true);
//         }
//         setData(null);
//         setData(data);

//         new ReportService()
//           .getTimeLineReport({ ticket_id: res.data.data.ticket_id })
//           .then((res) => {
//             if (res.status === 200) {
//               // setShowLoaderModal(false)
//               const data = res.data.data;
//               setChart(null);
//               setChart(data);
//             }
//           });



//           // new ReportService()
//           // .getTimeLineReportHoursWise({ ticket_id: res.data.data.ticket_id })
//           // .then((res) => {
//           //   if (res.status === 200) {
//           //     // setShowLoaderModal(false)
//           //     const data = res.data.data;
//           //     // setChart(null);
//           //     // setChart(data);
//           //   }
//           // });

//         handleAttachment("GetAttachment", ticketId);
//       }
//     });



//     await new ManageMenuService().getRole(roleId).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           const getRoleId = sessionStorage.getItem("role_id");
//           setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//         }
//       }
//     });

//     // await new DesignationService().getdesignatedDropdown().then((res) => {
//     //     if (res.status === 200) {
//     //         if (res.data.status == 1) {
//     //             const deta = res.data.data
//     //             setBa(deta.BA.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
//     //             setDev(deta.DEV.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
//     //             setTester(deta.TESTER.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
//     //         }
//     //     }
//     // })
//   };

//   const loadComments = async () => {
//     // setShowLoaderModal(true);

//     await new MyTicketService().getComments(match.params.id).then((res) => {
//       // setShowLoaderModal(null);

//       if (res.status === 200) {
//         // setShowLoaderModal(false)
//         // setCommentData(null);
//         setCommentData(res.data.data);
//       }
//     });
//   };


//   const handleAttachment = (type, ticket_id, attachmentId = null) => {
//     getAttachment(ticket_id, "TICKET").then((res) => {
//       if (res.status === 200) {
//         const data = res.data.data;
//         const temp = [];
//         data.forEach((d) => {
//           if (
//             userSessionData.account_for === "CUSTOMER" &&
//             d.show_to_customer === 1
//           ) {
//             temp.push(d);
//           } else {
//             temp.push(d);
//           }
//         });

//         setAttachment(data);
//       }
//     });
//   };

//   const handleForm = async (e) => {
//     e.preventDefault();

//     const convertContentToHTML = () => {
//       //console.log("Edi:"+editorState.getCurrentContent());
//       // let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
//       // var comment = currentContentAsHTML;
//       //console.log("HTML :"+comment);

//       // var ticket_id = ticketId;
//       // var comment1 = currentContentAsHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "").replace("\r\n", "<br />");
//       // console.log("com1 :"+comment1);
//       // var comment = comment1.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
//       // // var comment = currentContentAsHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
//       // console.log("com2 :"+comment);
//       let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());

//       var ticket_id = ticketId;
//       var comment1 = currentContentAsHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
//             var comment = comment1.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
//       // var comment = currentContentAsHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
//       // var mentions_id = idCount.reduce((acc, curr) => `${acc}${curr},`, '');

//       var mentions_id = idCount.reduce((acc, curr) => `${acc}${curr},`, "");
//       if (comment != "") {
//         new MyTicketService()
//           .postComment({ ticket_id, comment, mentions_id })
//           .then((res) => {
//             if (res.status === 200) {
//               // setShowLoaderModal(false) 
//               loadComments();
//               // setCommentData({
//               // ...commentData,
//               //     comments: [{
//               //         cmt: comment,
//               //         time: getDateTime(),
//               //         user_id: localStorage.getItem("name"),
//               //     },
//               //     ...commentData.comments,
//               //     ],
//               //     });
//               setEditorState(EditorState.createEmpty());
//             }
//           });
//       }
//     };
//     convertContentToHTML();
//   };

  





//   //ganttChart dummy data



//   const [selectedUser, setSelectedUser] = useState('both'); // Initialize the selected user


// //   const chartData = {
// //     [
// //     {
// //       "name": "Vaishnavi2 Khandwe1",
// //       "data": [
// //         {
// //           "x": "Testing Customer View task 1- vaishak12",
// //           "y": [
// //             "14:00:00",
// //             "14:06:45"
// //           ]
// //         },
// //         {
// //           "x": "Testing Customer View task 1- vaishak12",
// //           "y": [
// //             "14:00:00",
// //             "16:41:26"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:44:37"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:46:21"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:49:22"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:53:58"
// //           ]
// //         }
// //       ]
// //     },
// //     {
// //       "name": "Taau satpiyd",
// //       "data": [
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:44:37"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:46:21"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:49:22"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:53:58"
// //           ]
// //         }
// //       ]
// //     },
// //     {
// //       "name": "Tau satpute",
// //       "data": [
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:44:37"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:53:58"
// //           ]
// //         }
// //       ]
// //     },
// //     {
// //       "name": "PreetiCust BokadeCust",
// //       "data": [
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:44:37"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:46:21"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:49:22"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:53:58"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:54:33"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:54:55"
// //           ]
// //         }
// //       ]
// //     },
// //     {
// //       "name": "RW20 Percentage",
// //       "data": [
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:52:22"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:52:38"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:53:13"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:53:20"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:53:36"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:53:58"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:54:20"
// //           ]
// //         },
// //         {
// //           "x": "TT1158-Retest the Task report- defect",
// //           "y": [
// //             "17:00:00",
// //             "17:54:33"
// //           ]
// //         }
// //       ]
// //     }
// //   ]
// // }

//   // const chartData = {
//   //   user1: [
//   //     {
//   //       x: 'Priyanka - Task 1',
//   //       y: [
//   //         {
//   //           from: 1,
//   //           to: 3,
//   //           color: '#42f486' // color for the first 2 hours (completed)
//   //         },
//   //         {
//   //           from: 3,
//   //           to: 4,
//   //           color: '#ff8f43' // color for the next 1 hour (pending)
//   //         },
//   //       ],
//   //     },
//   //   ],
//   //   user2: [
//   //     {
//   //       x: 'Asmita - Task 2',
//   //       y: [
//   //         {
//   //           from: 1,
//   //           to: 4,
//   //           color: '#42f486' // color for the first 2 hours (completed)
//   //         },
//   //         {
//   //           from: 4,
//   //           to: 5,
//   //           color: '#ff8f43', // color for the next 1 hour (pending)
//   //           pattern: {
//   //             style: 'diagonal',
//   //             width: 6,
//   //             strokeWidth: 2,
//   //             strokeColor: '#ff8f43',
//   //           },
//   //         },
//   //       ],
//   //     },
//   //   ],

//   //   user3: [
//   //       {
//   //         x: 'Priyanka - Task 3',
//   //         y: [
//   //           {
//   //             from: 1,
//   //             to: 2,
//   //             color: '#42f486' // color for the first 2 hours (completed)
//   //           },
//   //           {
//   //             from: 2,
//   //             to: 3,
//   //             color: '#ff8f43', // color for the next 1 hour (pending)
//   //             pattern: {
//   //               style: 'diagonal',
//   //               width: 6,
//   //               strokeWidth: 2,
//   //               strokeColor: '#ff8f43',
//   //             },
//   //           },
//   //         ],
//   //         status:"completed"
//   //       },
//   //     ],


//   //     user4: [
//   //       {
//   //         x: 'Asmita-Task 4',
//   //         y: [
//   //           {
//   //             from: 1,
//   //             to: 5,
//   //             color: '#42f486' // color for the first 2 hours (completed)
//   //           },
//   //           // {
//   //           //   from: 5,
//   //           //   to: 6,
//   //           //   color: '#ff8f43', // color for the next 1 hour (pending)
//   //           //   pattern: {
//   //           //     style: 'diagonal',
//   //           //     width: 6,
//   //           //     strokeWidth: 2,
//   //           //     strokeColor: '#ff8f43',
//   //           //   },
//   //           // },
//   //         ],
//   //         status: 'Completed',

//   //       },
//   //     ],
//   // };

//   // const chartOptions = {
//   //   chart: {
//   //     height: 400,
//   //     type: 'rangeBar'
//   //   },
//   //   plotOptions: {
//   //     bar: {
//   //       horizontal: true,
//   //       distributed: true // display bars evenly distributed along the y-axis
//   //     }
//   //   },
//   //   xaxis: {
//   //     type: 'numeric',
//   //     tickAmount: 24,
//   //     min: 0,
//   //     max: 24,
//   //     labels: {
//   //       formatter: (value) => `${value} hr `, // format the x-axis labels to show hours
//   //     },
//   //     tooltip: {
//   //       enabled: false
//   //     }
//   //   },
//   //   yaxis: {
//   //     type: 'category',
//   //   },
//   //   fill: {
//   //     type: 'solid',
//   //     colors: ['#42f486', '#ff8f43'] // specify colors for completed and pending tasks
//   //   },
//   //   // Add other chart options as needed
//   // };

//   const chartOptions = {
//     chart: {
//       height: 400,
//       type: 'rangeBar',
//     },
//     plotOptions: {
//       bar: {
//         horizontal: true,
//         distributed: true, // display bars evenly distributed along the y-axis
//       },
//     },
//     xaxis: {
//       type: 'numeric',
//       tickAmount: 24,
//       min: 0,
//       max: 24,
//       labels: {
//         formatter: (value) => `${value} hr`, // format the x-axis labels to show hours
//       },
//       tooltip: {
//         enabled: false,
//       },
//     },
//     yaxis: {
//       type: 'category',
//     },
//     fill: {
//       type: 'solid',
//       colors: ['#42f486', '#ff8f43'], // specify colors for completed and pending tasks
//     },
//     // Add other chart options as needed
//   };

//   // const getTaskSeries = () => {
//   //   if (selectedUser === 'both') {
//   //     return Object.keys(chartData).flatMap((user) =>
//   //       chartData[user].map((task) => ({
//   //         name: `${user} - ${task.x}`,
//   //         data: task.y.map((duration) => ({
//   //           x: task.x,
//   //           y: [duration.from, duration.to],
//   //           fillColor: duration.color,
//   //           pattern: duration.pattern,
//   //         })),
//   //       }))
//   //     );
//   //   } else {
//   //     return chartData[selectedUser].map((task) => ({
//   //       name: `${selectedUser} - ${task.x}`,
//   //       data: task.y.map((duration) => ({
//   //         x: task.x,
//   //         y: [duration.from, duration.to],
//   //         fillColor: duration.color,
//   //         pattern: duration.pattern,
//   //       })),
//   //     }));
//   //   }
//   // };



//   // const ganttChartData = [
//   //   [
//   //     { type: 'string', label: 'Task ID' },
//   //     { type: 'string', label: 'Task Name' },
//   //     { type: 'date', label: 'Start Date' },
//   //     { type: 'date', label: 'End Date' },
//   //     { type: 'number', label: 'Duration' },
//   //     { type: 'number', label: 'Percent Complete' },
//   //     { type: 'string', label: 'Dependencies' },
//   //   ],
//   //   [
//   //     'Research',
//   //     'Find sources',
//   //     new Date(2023, 0, 1),
//   //     new Date(2023, 0, 5),
//   //     null,
//   //     100,
//   //     null,
//   //   ],
//   //   [
//   //     'Write',
//   //     'Write paper',
//   //     null,
//   //     new Date(2023, 0, 9),
//   //     3 * 24 * 60 * 60 * 1000,
//   //     25,
//   //     'Research,Outline',
//   //   ],
//   //   [
//   //     'Cite',
//   //     'Create bibliography',
//   //     null,
//   //     new Date(2023, 0, 7),
//   //     1 * 24 * 60 * 60 * 1000,
//   //     20,
//   //     'Research',
//   //   ],
//   //   [
//   //     'Complete',
//   //     'Hand in paper',
//   //     null,
//   //     new Date(2023, 0, 10),
//   //     1 * 24 * 60 * 60 * 1000,
//   //     0,
//   //     'Cite,Write',
//   //   ],
//   //   [
//   //     'Outline',
//   //     'Outline paper',
//   //     null,
//   //     new Date(2023, 0, 6),
//   //     1 * 24 * 60 * 60 * 1000,
//   //     100,
//   //     'Research',
//   //   ],
//   // ]




// useEffect(async () => {
//   loadData();
//   loadComments();
  
// }, [commentData]);

// useEffect(()=>{
//   if(checkRole && checkRole[15].can_read === 0){
//     // alert("Rushi")

//     window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
//   }
// },[checkRole])
//   return (
//     <div className="container-xxl">
//       {/* {chartDataa && JSON.stringify(chartDataa)} */}
//       <PageHeader headerTitle={`Ticket - ${data ? data.ticket_id : ""}`} />

//       {notify && <Alert alertData={notify} />}

//       <div className="row g-3 mt-2">
//         <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12">
//           <div className="row g-3 mb-3">
//             <div className="col-md-3">
//               <StatusCard
//                 progress={data ? data.status_name : ""}
//                 progressBg="bg-warning"
//                 iconClass="icofont-optic fs-4"
//                 iconbg="bg-lightyellow"
//                 title="Status"
//               />
//             </div>

//             <div className="col-md-3">
//               <StatusCard
//                 progress={data ? data.created_by_name : ""}
//                 progressBg="bg-info"
//                 iconClass="icofont-user fs-4"
//                 iconbg="bg-lightblue"
//                 title="Created By"
//               />
//             </div>
      
      
//             <div className="col-md-3">
//               <StatusCard
//                 progress={data ? data.created_at : ""}
//                 progressBg="bg-info"
//                 iconClass="icofont-user fs-4"
//                 iconbg="bg-lightblue"
//                 title="Created At"
//               />
//             </div>
            

//             <div className="col-md-3">
//               <StatusCard
//                 progress={data ? data.priority : ""}
//                 progressBg="bg-danger"
//                 details=""
//                 iconClass="icofont-price fs-4"
//                 iconbg="bg-lightgreen"
//                 title="Priority"
//               />
//             </div>
//             <div className="col-md-4">
//               <StatusCard
//                 progress={data ? data.passed_status : ""}
//                 progressBg="bg-success"
//                 iconClass="icofont-user fs-4"
//                 iconbg="bg-lightblue"
//                 title="Passing Status"
//               />
//             </div>


//             <div className="col-md-4">
//               <StatusCard
//                 progress={data ? data.type_name : ""}
//                 progressBg="bg-success"
//                 iconClass="icofont-user fs-4"
//                 iconbg="bg-lightblue"
//                 title="Ticket Type"
//               />
//             </div>




//           </div>
//           {rows && rows.length > 0 &&
//                             <div className='card mt-2'>
//                                 <div className='card-body'>
//                                     <div className="row">
//                                         {rows.map((data, index) => {
//                                           // console.log("dd",rows)
//                                             var range = "";
//                                             return <div
//                                                 className={`${data.inputWidth} mt-2`}>
//                                                 <label><b>{data.inputLabel} :</b></label>
//                                                 {data.inputType === 'text' &&
//                                                     <input
//                                                         type={data.inputType}
//                                                         id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                         name={data.inputName}
//                                                         defaultValue={data.inputDefaultValue}
//                                                         readOnly
//                                                         className="form-control form-control-sm"
//                                                     />
//                                                 }
//                                                 {data.inputType === 'textarea' &&
//                                                     <textarea
//                                                         id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                         name={data.inputName}
//                                                         className="form-control form-control-sm"
//                                                         defaultValue={data.inputDefaultValue}
                                                  
//                                                         />
//                                                 }
//                                                 {data.inputType === 'date' &&
//                                                     <div className='form-control'>
//                                                         <DatePicker
//                                                             // onChange={onChangeDate} 
//                                                             value={dateValue}
//                                                             format={data.inputFormat}
//                                                             style={{ width: '100%' }}
//                                                         />
//                                                     </div>
//                                                 }
//                                                 {data.inputType === 'time' &&
//                                                     <input
//                                                         type={data.inputType}
//                                                         id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                         name={data.inputName}
//                                                         defaultValue={data.inputDefaultValue}
//                                                         className="form-control form-control-sm"
//                                                     />
//                                                 }
//                                                 {data.inputType === 'number' &&
//                                                     <input
//                                                         type={data.inputType}
//                                                         id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                         name={data.inputName}
//                                                         defaultValue={data.inputDefaultValue}
//                                                         min={data.inputAddOn.inputRange ? range[0] : ''}
//                                                         max={data.inputAddOn.inputRange ? range[1] : ''}
//                                                         className="form-control form-control-sm"
//                                                     />
//                                                 }
//                                                 {data.inputType === 'decimal' &&
//                                                     <input
//                                                         type="number"
//                                                         id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                         name={data.inputName}
//                                                         defaultValue={data.inputDefaultValue}
//                                                         min={data.inputAddOn.inputRange ? range[0] : ''}
//                                                         max={data.inputAddOn.inputRange ? range[1] : ''}
//                                                         className="form-control form-control-sm"
//                                                     />
//                                                 }
//                                                 {data.inputType === 'select' &&
//                                                     <input
//                                                         type="text"
//                                                         // defaultValue={selectedDropdown ? selectedDropdown[data.inputName] : ""}
//                                                         // defaultValue={data.inputDefaultValue ? data.inputAddOn.inputDataSourceData.filter(d => d.value == data.inputDefaultValue) : ""}
//                                                         defaultValue={data.inputDefaultValue}
//                                                         // options={data.inputAddOn.inputDataSourceData}
//                                                         // id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                         name={data.inputName}
//                                                         // onChange={e => { dynamicDependancyHandle(data.inputName, e, data.inputAddOn.inputOnChangeSource) }}
//                                                         className="form-control form-control-sm"
//                                                         required={data.inputMandatory ? true : false}
//                                                         readOnly
//                                                     />
//                                                 }
//                                             </div>
//                                         })
//                                         }

//                                     </div>
//                                 </div>
//                             </div>
//                         }




//           <div className="row g-3 mb-3 mt-2">
//             <div className="col-md-12">
//               <div className="card mb-3">
//                 <div className="card-body">
//                   <h6 className="fw-bold mb-3 text-danger">Description</h6>
//                   <p>{data ? data.description : ""}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="row g-3 ">
//             <div className="col-lg-6 col-md-6">
//               {/* <AttechedCard data={BugImageAttechedData} /> */}
//             </div>
//           </div>

//           <div className="row mb-3">
//             <div className="col-md-12">
//               <div className="card mb-3">
//                 <div className="card-body">
//                   <h6 className="fw-bold mb-3 text-danger">Attachments</h6>
//                   {/* <Attachment refId={data ? data.id : ""}/> */}
//                   {attachment && (
//                     <div className="flex-grow-1">
//                       {attachment.map((data, i) => {
//                         return (
//                           <div
//                             key={"cuhdus" + i}
//                             className=" d-flex align-items-center border-bottom"
//                           >
//                             <div className="d-flex ms-3 align-items-center flex-fill">
//                               <span
//                                 className={`avatar lg fw-bold  rounded-circle text-center d-flex align-items-center justify-content-center`}
//                               >
//                                 {i + 1}
//                               </span>
//                               <div className="d-flex flex-column ">
//                                 <h6 className="fw-bold mb-0 small-14">
//                                   {data.name}
//                                 </h6>
//                               </div>
//                             </div>
//                             <div className="mr-1">
//                               {/* <a href={`${_attachmentUrl}${data.path}`}
//                                                     target='_blank'
//                                                     download="ABC.png"
//                                                     className='btn btn-primary btn-sm'
//                                                 >
//                                                     <i class="icofont-download"></i> View
//                                                 </a> */}

//                               <a
//                                 href={`${_attachmentUrl}${data.path}`}
//                                 target="_blank"
//                                 download
//                                 className="btn btn-primary btn-sm"
//                               >
//                                 <i class="icofont-download"></i> Download
//                               </a>
//                             </div>
//                             {/* <button type="button" className="btn btn-sm btn-primary">Download</button> */}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>{" "}
//         {/*  COL */}
//         <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12">
//           <div className="card">
//             <div className="card-body card-body-height py-4">
//               <div className="row">
//                 <div className="col-lg-12 col-md-12">
//                   <h6 className="mb-0 fw-bold mb-3">Ticket Chat</h6>
//                   <div className="card mb-2">
//                     <div className="card-body">
//                       <div className="post" id="post">
//                         <form onSubmit={handleForm}>
//                           <div
//                             className={editorStyles.editor}
//                             onClick={() => {
//                               focusEditor();
//                             }}
//                           >
//                             <Editor
//                               ref={editor}
//                               editorState={editorState}
//                               plugins={plugins}
//                               onChange={(editorState) =>
//                                 setEditorState(editorState)
//                               }
//                               placeholder={"Comment here..."}
//                               id="comment"
//                             />
//                             <MentionSuggestions
//                               onSearchChange={onSearchChange}
//                               suggestions={suggestions}
//                               onAddMention={onAddMention}
//                             />
//                           </div>

//                           <div className="py-3">
//                             {/* <a href="#!" className="px-3 " title="upload images"><i className="icofont-ui-camera"></i></a>
//                                                     <a href="#!" className="px-3 " title="upload video"><i className="icofont-video-cam"></i></a>
//                                                     <a href="#!" className="px-3 " title="Send for signuture"><i className="icofont-pen-alt-2"></i></a> */}
//                             <button
//                               type="submit"
//                               className="btn btn-primary float-sm-end  mt-2 mt-sm-0"
//                             >
//                               Send
//                             </button>
//                           </div>
//                         </form>
//                       </div>
//                     </div>
//                   </div>
//                   <ul className="list-unstyled res-set">
//                     <li className="card mb-2">
//                       <div className="card-body">
//                         {allUsers &&
//                           allUsersString &&
//                           commentData &&
//                           commentData.comments.map((ele, i) => {
//                             return (
//                               <div key={i}>
//                                 <div className="d-flex mt-3 pt-3 border-top">
//                                   {/* <img
//                                                     className="avatar rounded-circle"
//                                                     src="assets/images/xs/avatar2.jpg"
//                                                     alt=""
//                                                     /> */}
//                                   <span className="flex-fill ms-3 text-truncate">
//                                     <h4
//                                       className="mb-0"
//                                       style={{
//                                         whiteSpace: "pre-line",
//                                         overflowWrap: "break-word",
//                                         fontSize: "14px",
//                                       }}
//                                     >
//                                       <CommentsData
//                                         data={ele.cmt}
//                                         allUsers={allUsers}
//                                         allUsersString={allUsersString}
//                                       />
//                                     </h4>

//                                     <span className="text-muted d-flex justify-content-between">
//                                       <span>{ele.user_id} </span>
//                                       <small className="msg-time">
//                                         {ele.time}
//                                       </small>
//                                     </span>
//                                   </span>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                       </div>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row mb-3">
//           <div className="col-md-12">
//             <div className="card mb-3">
//               <div className="card-body">
//                 <h6 className="fw-bold mb-3 text-danger">Timeline</h6>

//                 {/* {chart && (
//                   <Chart
//                     options={chart.options}
//                     series={chart.series}
//                     type="rangeBar"
//                     height={chart.options.chart.height}
//                   />
                
//                 )} */}


// <div>
//       <div  style={{display:'block',flexDirection:'column' ,}}>
//         <label className="mx-2" >
//           <input
//           className="mx-1" 
//             type="radio"
//             value="both"
//             checked={selectedUser === 'both'}
//             onChange={(e) => setSelectedUser(e.target.value)}
//           />
//           Both
//         </label>
//         <label className="mx-2" >
//           <input
//           className="mx-1"
//             type="radio"
//             value="user1"
//             checked={selectedUser === 'user1'}
//             onChange={(e) => setSelectedUser(e.target.value)}
//           />
//           User 1
//         </label>
//         <label className="mx-2" >
//           <input
//           className="mx-1"
//             type="radio"
//             value="user2"
//             checked={selectedUser === 'user2'}
//             onChange={(e) => setSelectedUser(e.target.value)}
//           />
//           User 2
//         </label>
//       </div>
//       <Chart
//         options={chartOptions}
//         data={chartDataa}
//         // series={getTaskSeries()}
//         type="rangeBar"
//         height={chartOptions.chart.height}
//       />
//     </div> 


// {/* {console.log("series",chart.series)} */}
// {/* {console.log("chart",chart.options.chart.height)} */}

// {/* <Chart
//           width={'700px'}
//           height={'410px'}
//           chartType="Gantt"
//           loader={<div>Loading Chart</div>}
//           data={ganttChartData}
//           rootProps={{ 'data-testid': '1' }}
//         /> */}

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Modal show={showLoaderModal} centered>
//         <Modal.Body className="text-center">
//           <Spinner animation="grow" variant="primary" />
//           <Spinner animation="grow" variant="secondary" />
//           <Spinner animation="grow" variant="success" />
//           <Spinner animation="grow" variant="danger" />
//           <Spinner animation="grow" variant="warning" />
//           <Spinner animation="grow" variant="info" />
//           <Spinner animation="grow" variant="dark" />
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }
