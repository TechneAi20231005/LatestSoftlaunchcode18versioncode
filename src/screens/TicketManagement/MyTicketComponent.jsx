// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
// import { Modal } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import { Dropdown, Button, ButtonGroup } from "react-bootstrap";
// import { _base } from "../../settings/constants";
// import Alert from "../../components/Common/Alert";
// import ErrorLogService from "../../services/ErrorLogService";
// import MyTicketService from "../../services/TicketService/MyTicketService";
// import UserService from "../../services/MastersService/UserService";
// import DepartmentService from "../../services/MastersService/DepartmentService";
// import StatusService from "../../services/MastersService/StatusService";
// import ReportService from "../../services/ReportService/ReportService";
// import PageHeader from "../../components/Common/PageHeader";
// import Select from "react-select";
// import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
// import DepartmentMappingService from "../../services/MastersService/DepartmentMappingService";
// import * as Validation from "../../components/Utilities/Validation";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
// import "./custome.css";
// import { Spinner } from "react-bootstrap";
// import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
// import { ExportAllTicketsToExcel } from "../../components/Utilities/Table/ExportAllTicketsToExcel";
// import { useDispatch, useSelector } from "react-redux";
// import MyTicketComponentSlice from "./MyTicketComponentSlice";
// import { getStatusData, getUserForMyTicketsData, getUserTicketsTest } from "./MyTicketComponentAction";
// import { dashboardSlice } from "../Dashboard/DashbordSlice";
// import DepartmentMasterSlice from "../Masters/DepartmentMaster/DepartmentMasterSlice";
// import { departmentData } from "../Masters/DepartmentMaster/DepartmentMasterAction";
// import { statusMasterSlice } from "../Masters/StatusMaster/StatusComponentSlice";
// import { getRoles } from "../Dashboard/DashboardAction";
// export default function MyTicketComponent({ location }) {
//   const [notify, setNotify] = useState(null);
//   const [data, setData] = useState(null);
//   const [userDropdown, setUserDropdown] = useState(null);
//   // const [checkRole, setCheckRole] = useState(null);
//   const roleId = sessionStorage.getItem("role_id");

//   // const [type, setType] = useState(null);

//   const [userName, setUserName] = useState("");
//   const [user, setUser] = useState("");

//   // const [statusData, setStatusData] = useState(null);
//   const [userData, setUserData] = useState(null);
//   // const [departmentData, setDepartmentData] = useState(null);

//   const [searchResult, setSearchResult] = useState();
//   const [searchResultExport, setSearchResultExport] = useState();

//   const [unpassedTickets, setUnpassedTickets] = useState(null);
//   const [unpassedTicketsExport, setUnpassedTicketsExport] = useState(null);

//   const [assignedToMe, setAssignedToMe] = useState(null);
//   const [assignedToMeExport, setAssignedToMeExport] = useState(null);

//   const [yourTask, setYourTask] = useState(null);
//   const [yourTaskExport, setYourTaskExport] = useState(null);

//   const [createdByMe, setCreatedByMe] = useState(null);
//   const [createdByMeExport, setCreatedByMeExport] = useState(null);

//   const [departmentwiseTicket, setDepartmentwiseTicket] = useState(null);
//   const [departmentwiseTicketExport, setDepartmentwiseTicketExport] =
//     useState(null);
//   const [ticketShowType, setTicketShowType] = useState(null);

//   // const [filterExport, setFilterExport]=useState(null)

//   const [userDepartment, setUserDepartment] = useState();

//   const [exportData, setExportData] = useState(null);

//   const dispatch = useDispatch();
//   const MyTicketComponentData = useSelector(
//     (MyTicketComponentSlice) => MyTicketComponentSlice
//   );
//   const assignToMeData = useSelector(
//     (MyTicketComponentSlice) =>
//       MyTicketComponentSlice.myTicketComponent.getUserTicketTestData.data
//   );

//   console.log("assign",useSelector(
//     (MyTicketComponentSlice) =>
//       MyTicketComponentSlice.myTicketComponent
//   ))
// const assignedToMeData= useSelector((MyTicketComponentSlice) =>
// MyTicketComponentSlice.myTicketComponent.getUserTicketTestData
// )


// console.log("a",assignedToMeData)
// // const unpassedData= useSelector((MyTicketComponentSlice) =>
// // MyTicketComponentSlice.myTicketComponent.alluserTickettest
// // )

//   const statusData = useSelector(
//     (statusMasterSlice) =>
//     statusMasterSlice.statusMaster.sortStatusData

//   );



// const UserForMyTicketData = useSelector(myTicketComponentSlice=>myTicketComponentSlice.myTicketComponent.getUserForMyTicket)
// const getAssignedUserData = useSelector(myTicketComponentSlice=>myTicketComponentSlice.myTicketComponent.getAssignedUserData)
// const departsmentData = useSelector(DepartmentMasterSlice=>DepartmentMasterSlice.department.sortDepartmentData)
// const checkRole = useSelector((DashboardSlice) =>DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 14));


//   const [modal, setModal] = useState({
//     showModal: false,
//     modalData: "",
//     modalHeader: "",
//   });
//   const [remarkModal, setRemarkModal] = useState({
//     showModal: false,
//     modalData: "",
//     modalHeader: "",
//   });

//   const [bulkRemarkModal, setBulkRemarkModal] = useState({
//     showModal: false,
//     modalData: "",
//     modalHeader: "",
//   });

//   const [confirmationModal, setConfirmationModal] = useState({
//     showModals: false,
//     modalsData: "",
//     modalsHeader: "",
//   });

//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const [todate, setTodate] = useState([]);
//   const [fromdate, setFromdate] = useState([]);

//   const [todateformat, setTodateformat] = useState("");
//   const [fromdateformat, setFromdateformat] = useState("");

//   const [assignUserDropdown, setAssignUserDropdown] = useState(null);
//   const [toDateRequired, setToDateRequired] = useState(false);
//   const [showLoaderModal, setShowLoaderModal] = useState(false);
//   // const [assignedToMeData, setAssignedToMeData] = useState();
//   const [selectAllNames, setSelectAllNames] = useState(false);

//   const handleSelectAllNamesChange = () => {
//     // Toggle the state of 'selectAllNames'
//     setSelectAllNames(!selectAllNames);

//     // If 'selectAllNames' is true, select all rows; otherwise, clear the selection
//     setSelectedRowss(
//       selectAllNames
//         ? []
//         : unpassedTickets && unpassedTickets.map((row) => row.id)
//     );
//   };

//   const handleConfirmationModal = (e, data) => {
//     var d = {};
//     setConfirmationModal(null);
//     if (data) {
//       d = { showModals: true, modalsData: data, modalsHeader: "Solve Ticket" };
//     } else {
//       d = { showModals: false, modalsData: "", modalsHeader: "Solve Ticket" };
//     }
//     setConfirmationModal(d);
//   };

//   const handleSolveTicketModal = async (e) => {
//     e.preventDefault();
//     const form = new FormData(e.target);
//     setNotify(null);

//     var id = form.get("id");

//     await new MyTicketService()
//       .verifyTicketConfirmationOtp(id, form)
//       .then((res) => {
//         // setShowLoaderModal(null);
//         // setShowLoaderModal(false);
//         if (res.status === 200) {
//           if (res.data.status == 1) {
//             setNotify({ type: "success", message: res.data.message });
//             setConfirmationModal({
//               showModal: false,
//               modalData: "",
//               modalHeader: "",
//             });
//             loadData();
//           } else {
//             // setShowLoaderModal(false);
//             setNotify({ type: "danger", message: res.data.message });
//           }
//         }
//       });
//   };
//   const menuStyle = {
//     position: "absolute",
//     bottom: "100%",
//     left: 0,
//     transform: "translateY(-5px)",
//     backgroundColor: "#fff",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//     borderRadius: "4px",
//     padding: "10px",
//   };

//   const handleModal = (data) => {
//     setModal(data);
//   };

//   const handleRemarkModal = (data) => {
//     setRemarkModal(data);
//   };

//   // const handleBulkRemarkModal = (data) => {
//   //   setBulkRemarkModal(data);
//   // };

//   const actionComponent = (data, type) => {
//     if (type === "SEARCH_RESULT") {
//       if (searchResult && searchResult.length > 0) {
//         return (
//           <Dropdown className="d-inline-flex m-1">
//             <Dropdown.Toggle
//               as="button"
//               variant=""
//               id={`${"dropdown-basic_" + data.id}`}
//               className="btn btn-primary text-white"
//             >
//               <i className="icofont-listine-dots"></i>
//             </Dropdown.Toggle>
//             <Dropdown.Menu as="ul" className="border-0 shadow p-1">
//               {data.created_by == localStorage.getItem("id") ||
//                 data.assign_to_user_id == localStorage.getItem("id") ||
//                 (data.status_name != "Solved" && (
//                   <li>
//                     <Link
//                       to={`/${_base}/Ticket/Edit/` + data.id}
//                       className="btn btn-sm btn-warning text-white"
//                       style={{ width: "100%", zIndex: "100" }}
//                     >
//                       <i className="icofont-ui-edit"></i> Edit
//                     </Link>
//                   </li>
//                 ))}

//               <li>
//                 {" "}
//                 <Link
//                   to={`/${_base}/Ticket/View/` + data.id}
//                   className="btn btn-sm btn-info text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-external-link "></i> View
//                 </Link>{" "}
//               </li>

//               {data.created_by != localStorage.getItem("id") &&
//                 data.basket_configured === 0 &&
//                 data.status_name != "Solved" && (
//                   <li>
//                     <Link
//                       to={`/${_base}/Ticket/Basket/` + data.id}
//                       className="btn btn-sm btn-primary text-white"
//                       style={{ width: "100%", zIndex: 100 }}
//                     >
//                       <i className="icofont-bucket2"></i>Basket
//                     </Link>
//                   </li>
//                 )}

//               {data.created_by != localStorage.getItem("id") &&
//                 data.basket_configured > 0 &&
//                 data.status_name != "Solved" && (
//                   <li>
//                     <Link
//                       to={`/${_base}/Ticket/Task/` + data.id}
//                       className="btn btn-sm btn-outline-primary"
//                       style={{ width: "100%", zIndex: 100 }}
//                     >
//                       <i className="icofont-tasks"></i> Task
//                     </Link>
//                   </li>
//                 )}
//               <li>
//                 <Link
//                   to={`/${_base}/TicketHistory/` + data.id}
//                   className="btn btn-sm btn-primary text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-history"></i> History
//                 </Link>
//               </li>
//             </Dropdown.Menu>
//           </Dropdown>
//         );
//       } else {
//         return (
//           <div className="d-flex justify-content-between">
//             {data.created_by == sessionStorage.getItem("id") ||
//               (data.assign_to_user_id == sessionStorage.getItem("id") &&
//                 data.status_name != "Solved" && (
//                   <Link
//                     to={`/${_base}/Ticket/Edit/` + data.id}
//                     className="btn btn-sm btn-warning text-white"
//                     style={{ width: "90px" }}
//                   >
//                     <i className="icofont-ui-edit"></i> Edit
//                   </Link>
//                 ))}

//             <Link
//               to={`/${_base}/Ticket/View/` + data.id}
//               className="btn btn-sm btn-info text-white"
//               style={{ width: "90px" }}
//             >
//               <i className="icofont-external-link "></i> View
//             </Link>

//             <Link
//               to={`/${_base}/TicketHistory/` + data.id}
//               className="btn btn-sm btn-primary text-white"
//               style={{ width: "90px" }}
//             >
//               <i className="icofont-history"></i> History
//             </Link>
//           </div>
//         );
//       }
//     }

//     if (type === "your_task") {
//       if (assignToMeData && assignToMeData.length > 0) {
//         return (
//           <Dropdown className="d-inline-flex m-1">
//             <Dropdown.Toggle
//               as="button"
//               variant=""
//               id={`${"dropdown-basic_" + data.id}`}
//               className="btn btn-primary text-white"
//             >
//               <i className="icofont-listine-dots"></i>
//             </Dropdown.Toggle>
//             <Dropdown.Menu as="ul" className="border-0 shadow p-1">
//               {
//               // data.created_by == localStorage.getItem("id") ||
//                 (data.assign_to_user_id == localStorage.getItem("id") && (
//                   <li>
//                     <Link
//                       to={`/${_base}/Ticket/Edit/` + data.id}
//                       className="btn btn-sm btn-warning text-white"
//                       style={{ width: "100%", zIndex: "100" }}
//                     >
//                       <i className="icofont-ui-edit"></i> Edit
//                     </Link>
//                   </li>
//                 ))}
//               <li>
//                 {" "}
//                 <Link
//                   to={`/${_base}/Ticket/View/` + data.id}
//                   className="btn btn-sm btn-info text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-external-link "></i> View
//                 </Link>{" "}
//               </li>
//               {/*
//                                         {data.created_by != localStorage.getItem('id') && data.basket_configured === 0 &&
//                                             <li><Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%", zIndex: 100 }}>
//                                                 <i className="icofont-bucket2"></i>Basket</Link></li>
//                                         } */}
//               {
//                 // (data.created_by = localStorage.getItem("id") &&
//                 //   data.basket_configured > 0 && (
//                     <li>
//                       <Link
//                         to={`/${_base}/Ticket/Task/` + data.id}
//                         className="btn btn-sm btn-outline-primary"
//                         style={{ width: "100%", zIndex: 100 }}
//                       >
//                         <i className="icofont-tasks"></i> Task
//                       </Link>
//                     </li>
//                   // ))
//               }
//             </Dropdown.Menu>
//           </Dropdown>
//         );
//       } else {
//         return (
//           <div className="d-flex justify-content-between">
//             {data.created_by == localStorage.getItem("id") ||
//               (data.assign_to_user_id == localStorage.getItem("id") && (
//                 <Link
//                   to={`/${_base}/Ticket/Edit/` + data.id}
//                   className="btn btn-sm btn-warning text-white"
//                   style={{ width: "90px" }}
//                 >
//                   <i className="icofont-ui-edit"></i> Edit
//                 </Link>
//               ))}
//             <Link
//               to={`/${_base}/Ticket/View/` + data.id}
//               className="btn btn-sm btn-info text-white"
//               style={{ width: "90px" }}
//             >
//               <i className="icofont-external-link "></i> View
//             </Link>
//             {/*
//                                         {data.created_by != localStorage.getItem('id') && data.basket_configured === 0 &&
//                                             <li><Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%", zIndex: 100 }}>
//                                                 <i className="icofont-bucket2"></i>Basket</Link></li>
//                                         } */}

//             <Link
//               to={`/${_base}/Ticket/Task/` + data.id}
//               className="btn btn-sm btn-outline-primary"
//               style={{ width: "90px" }}
//             >
//               <i className="icofont-tasks"></i> Task
//             </Link>
//           </div>
//         );
//       }
//     }
//     if (type === "ASSIGNED_TO_ME") {
//       if (assignToMeData && assignToMeData.length > 0) {
//         return (
//           <Dropdown className="d-inline-flex m-1" align>
//             <Dropdown.Toggle
//               as="button"
//               variant=""
//               id={`${"dropdown-basic_" + data.id}`}
//               className="btn btn-primary text-white"
//             >
//               <i className="icofont-listine-dots"></i>
//             </Dropdown.Toggle>
//             <Dropdown.Menu as="ul" className="border-0 shadow p-1">
//               {/* {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') && */}
//               <li>
//                 <Link
//                   to={`/${_base}/Ticket/Edit/` + data.id}
//                   className="btn btn-sm btn-warning text-white"
//                   style={{ width: "100%", zIndex: "100" }}
//                 >
//                   <i className="icofont-ui-edit"></i> Edit
//                 </Link>
//               </li>
//               {/* } */}
//               <li>
//                 {" "}
//                 <Link
//                   to={`/${_base}/Ticket/View/` + data.id}
//                   className="btn btn-sm btn-info text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-external-link "></i> View
//                 </Link>{" "}
//               </li>

//               <li>
//                 <Link
//                   to={`/${_base}/TicketHistory/` + data.id}
//                   className="btn btn-sm btn-primary text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-history"></i> History
//                 </Link>
//               </li>

//               {((data.created_by != localStorage.getItem("id") &&
//                 data.basket_configured === 0) ||
//                 (data.assign_to_user_id == localStorage.getItem("id") &&
//                   data.basket_configured === 0)) && (
//                 <li>
//                   <Link
//                     to={`/${_base}/Ticket/Basket/` + data.id}
//                     className="btn btn-sm btn-primary text-white"
//                     style={{ width: "100%", zIndex: 100 }}
//                   >
//                     <i className="icofont-bucket2"></i>Basket
//                   </Link>
//                 </li>
//               )}

//               {((data.created_by != localStorage.getItem("id") &&
//                 data.basket_configured > 0) ||
//                 (data.assign_to_user_id == localStorage.getItem("id") &&
//                   data.basket_configured > 0)) && (
//                 <li>
//                   <Link
//                     to={`/${_base}/Ticket/Task/` + data.id}
//                     className="btn btn-sm btn-outline-primary"
//                     style={{ width: "100%", zIndex: 100 }}
//                   >
//                     <i className="icofont-tasks"></i> Task
//                   </Link>
//                 </li>
//               )}
//             </Dropdown.Menu>
//           </Dropdown>
//         );
//       } else {
//         return (
//           <div className="d-flex justify-content-between ">
//             <Link
//               to={`/${_base}/TicketHistory/` + data.id}
//               className="btn btn-sm btn-warning text-white"
//               style={{ width: "90px" }}
//             >
//               <i className="icofont-history"></i> History
//             </Link>

//             {((data.created_by != localStorage.getItem("id") &&
//               data.basket_configured === 0) ||
//               (data.assign_to_user_id == localStorage.getItem("id") &&
//                 data.basket_configured === 0)) && (
//               <Link
//                 to={`/${_base}/Ticket/Basket/` + data.id}
//                 className="btn btn-sm btn-primary text-white"
//                 style={{ width: "90px" }}
//               >
//                 <i className="icofont-bucket2"></i>Basket
//               </Link>
//             )}

//             <Link
//               to={`/${_base}/Ticket/Edit/` + data.id}
//               className="btn btn-sm btn-warning text-white"
//               style={{ width: "90px" }}
//             >
//               <i className="icofont-ui-edit"></i> Edit
//             </Link>

//             <Link
//               to={`/${_base}/Ticket/View/` + data.id}
//               className="btn btn-sm btn-info text-white"
//               style={{ width: "90px" }}
//             >
//               <i className="icofont-external-link "></i> View
//             </Link>

//             <Link
//               to={`/${_base}/Ticket/Task/` + data.id}
//               className="btn btn-sm btn-outline-primary"
//               style={{ width: "90px" }}
//             >
//               <i className="icofont-tasks"></i> Task
//             </Link>
//           </div>
//         );
//       }
//     }
//     if (type === "ADDED_BY_ME") {
//       if (assignToMeData && assignToMeData.length > 0) {
//         return (
//           <Dropdown className="d-inline-flex m-1">
//             <Dropdown.Toggle
//               drop="up"
//               as="button"
//               variant=""
//               id={`${"dropdown-basic_" + data.id}`}
//               className="btn btn-primary text-white"
//             >
//               <i className="icofont-listine-dots"></i>
//             </Dropdown.Toggle>

//             <Dropdown.Menu as="ul" className="border-0 shadow p-1">
//               {/* {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') &&
//                                                 <li><Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white"
//                                                     style={{ width: "100%", zIndex: '100' }}>
//                                                     <i className="icofont-ui-edit"></i>  Edit</Link></li>
//                                             } */}
//               <li>
//                 {" "}
//                 <Link
//                   to={`/${_base}/Ticket/View/` + data.id}
//                   className="btn btn-sm btn-info text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-external-link "></i> View
//                 </Link>{" "}
//               </li>

//               {/* {data.created_by != localStorage.getItem('id') && data.basket_configured === 0 &&
//                                                 <li><Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%", zIndex: 100 }}>
//                                                     <i className="icofont-bucket2"></i>Basket</Link></li>
//                                             } */}

//               {data.created_by != localStorage.getItem("id") &&
//                 data.basket_configured > 0 && (
//                   <li>
//                     <Link
//                       to={`/${_base}/Ticket/Task/` + data.id}
//                       className="btn btn-sm btn-outline-primary"
//                       style={{ width: "100%", zIndex: 100 }}
//                     >
//                       <i className="icofont-tasks"></i> Task
//                     </Link>
//                   </li>
//                 )}
//               <li>
//                 <Link
//                   to={`/${_base}/TicketHistory/` + data.id}
//                   className="btn btn-sm btn-primary text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-history"></i> History
//                 </Link>
//               </li>
//               <li>
//                 <button
//                   className=" btn btn-sm  btn-secondary text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                   onClick={(e) => handleConfirmationModal(e, data)}
//                 >
//                   Confirm
//                 </button>
//               </li>
//             </Dropdown.Menu>
//           </Dropdown>
//         );
//       } else {
//         return (
//           <>
//             <div className="d-flex justify-content-between">
//               <Link
//                 to={`/${_base}/TicketHistory/` + data.id}
//                 className="btn btn-sm btn-warning text-white"
//               >
//                 <i className="icofont-ui-history"></i> History
//               </Link>
//               {/* <Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white">
//                                             <i className="icofont-ui-edit"></i>  Edit</Link> */}

//               <Link
//                 to={`/${_base}/Ticket/View/` + data.id}
//                 className="btn btn btn-info text-white"
//               >
//                 <i className="icofont-external-link "></i> View
//               </Link>

//               {/* <Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn btn-primary text-white" >
//                                                     <i className="icofont-bucket2"></i>Basket
//                                                 </Link> */}

//               <button
//                 className="btn btn-secondary"
//                 onClick={(e) => handleConfirmationModal(e, data)}
//               >
//                 Confirm
//               </button>
//             </div>
//           </>
//         );
//       }
//     }

//     if (type === "UNPASSED_TICKET") {
//       if (assignToMeData && assignToMeData.length > 0) {
//         return (
//           <Dropdown className="d-inline-flex m-1">
//             <Dropdown.Toggle
//               as="button"
//               variant=""
//               id={`${"dropdown-basic_" + data.id}`}
//               className="btn btn-primary text-white"
//             >
//               <i className="icofont-listine-dots"></i>
//             </Dropdown.Toggle>
//             <Dropdown.Menu as="ul" className="border-0 shadow p-1">
//               {data.created_by == localStorage.getItem("id") ||
//                 (data.assign_to_user_id == localStorage.getItem("id") && (
//                   <li>
//                     <Link
//                       to={`/${_base}/Ticket/Edit/` + data.id}
//                       className="btn btn-sm btn-warning text-white"
//                       style={{ width: "100%", zIndex: 100 }}
//                     >
//                       <i className="icofont-ui-edit"></i> Edit
//                     </Link>
//                   </li>
//                 ))}
//               <li>
//                 <Link
//                   to={`/${_base}/Ticket/View/` + data.id}
//                   className="btn btn-sm btn-info text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-external-link "></i> View
//                 </Link>{" "}
//               </li>

//               <li>
//                 <button
//                   className="btn btn-success text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                   onClick={(e) => {
//                     handleRemarkModal({
//                       showModal: true,
//                       modalData: data,
//                       modalHeader: "Enter Remark",
//                       status: "PASS",
//                     });
//                   }}
//                 >
//                   <i className="icofont-checked"></i> Pass
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className="btn btn-danger  text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                   onClick={(e) => {
//                     handleRemarkModal({
//                       showModal: true,
//                       modalData: data,
//                       modalHeader: "Enter Remark",
//                       status: "REJECT",
//                     });
//                   }}
//                 >
//                   <i className="icofont-close-squared-alt"></i> Reject
//                 </button>
//               </li>
//             </Dropdown.Menu>
//           </Dropdown>
//         );
//       } else {
//         return (
//           <div className="d-flex justify-content-between">
//             <Link
//               to={`/${_base}/Ticket/View/` + data.id}
//               className="btn btn-sm btn-info text-white"
//             >
//               <i className="icofont-external-link "></i> View
//             </Link>
//             <button
//               className="btn btn-success text-white btn-sm"
//               onClick={(e) => {
//                 handleRemarkModal({
//                   showModal: true,
//                   modalData: data,
//                   modalHeader: "Enter Remark",
//                   status: "PASS",
//                 });
//               }}
//             >
//               <i className="icofont-checked"></i> Pass
//             </button>
//             <button
//               className="btn btn-danger btn-sm text-white"
//               onClick={(e) => {
//                 handleRemarkModal({
//                   showModal: true,
//                   modalData: data,
//                   modalHeader: "Enter Remark",
//                   status: "REJECT",
//                 });
//               }}
//             >
//               <i className="icofont-close-squared-alt"></i> Reject
//             </button>
//           </div>
//         );
//       }
//     }

//     if (type === "DEPARTMENTWISE_TICKET") {
//       if (assignToMeData && assignToMeData.length > 0) {
//         return (
//           <Dropdown className="d-inline-flex m-1">
//             <Dropdown.Toggle
//               as="button"
//               variant=""
//               id={`${"dropdown-basic_" + data.id}`}
//               className="btn btn-primary text-white"
//             >
//               <i className="icofont-listine-dots"></i>
//             </Dropdown.Toggle>
//             <Dropdown.Menu as="ul" className="border-0 shadow p-1">
//               {/* {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') && */}
//               <li>
//                 <Link
//                   to={`/${_base}/Ticket/Edit/` + data.id}
//                   className="btn btn-sm btn-warning text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-ui-edit"></i> Edit
//                 </Link>
//               </li>
//               {/* } */}
//               <li>
//                 <Link
//                   to={`/${_base}/Ticket/View/` + data.id}
//                   className="btn btn-sm btn-info text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                 >
//                   <i className="icofont-external-link "></i> View
//                 </Link>{" "}
//               </li>
//             </Dropdown.Menu>
//           </Dropdown>
//         );
//       }
//       // } else {

//       //     return <div className="d-flex justify-content-between" style={{ width: "100%" }}>
//       //         <Link to={`/${_base}/Ticket/View/` + data.id} className="btn btn-sm btn-info text-white" >
//       //             <i className="icofont-external-link "></i> View</Link>

//       //     </div>
//       // }
//     }
//   };

//   const searchResultColumns = [
//     {
//       name: "Action",
//       button: true,
//       ignoreRowClick: true,
//       allowOverflow: false,
//       width: `${
//         searchResult ? (searchResult.length > 0 ? "4rem" : "20.625rem") : "auto"
//       }`,
//       cell: (row) => actionComponent(row, "SEARCH_RESULT"),
//     },

//     { name: "Sr", width: "4rem", cell: (row, index) => index + 1 },
//     {
//       name: "Ticket Id",
//       cell: (row) => (
//         <Link to={`/${_base}/Ticket/View/` + row.id}>
//           <span className="fw-bold text-secondary">{row.ticket_id}</span>
//         </Link>
//       ),
//       sortable: true,
//     },
//     {
//       name: "Description",
//       width: "18.75rem",
//       selector: (row) => {},
//       sortable: false,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           <a
//             href="#"
//             onClick={(e) => {
//               handleModal({ showModal: true, modalData: row, modalHeader: "" });
//             }}
//           >
//             {row.description && (
//               <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
//                 <div>
//                   <span className="ms-1">
//                     {" "}
//                     {row.description && row.description.length < 123
//                       ? row.description
//                       : row.description.substring(0, 123) + "...."}
//                   </span>
//                 </div>
//               </OverlayTrigger>
//             )}
//           </a>
//         </div>
//       ),
//     },
//     {
//       name: "Ticket Date",
//       selector: (row) => row.ticket_date,
//       sortable: true,
//       width: "120px",
//     },
//     {
//       name: "Expected Solve Date",
//       maxWidth: "auto",
//       selector: (row) => row.expected_solve_date,
//       sortable: true,
//     },
//     {
//       name: "Priority",
//       cell: (row) => (
//         <div>
//           {row.priority === "Very High" && (
//             <span style={{ width: "60px" }} className="badge bg-danger">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "High" && (
//             <span style={{ width: "60px" }} className="badge bg-warning">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Medium" && (
//             <span style={{ width: "60px" }} className="badge bg-info">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Low" && (
//             <span style={{ width: "60px" }} className="badge bg-success">
//               {row.priority}
//             </span>
//           )}
//         </div>
//       ),
//       sortable: true,
//     },
//     { name: "Type", cell: (row) => row.query_type_name, sortable: true },
//     { name: "Passed Status", cell: (row) => row.passed_status, sortable: true },
//     { name: "Status", cell: (row) => row.status_name, sortable: true },
//     {
//       name: "Assign To Dept",
//       cell: (row) => row.assign_to_department,
//       sortable: true,
//     },
//     { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
//     { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
//     {
//       name: "Solve Date",
//       maxWidth: "auto",
//       selector: (row) => row.solve_date,
//       sortable: true,
//     },
//   ];
//   const yourTaskColumns = [
//     {
//       name: "Action",
//       button: true,
//       ignoreRowClick: true,
//       allowOverflow: false,
//       width: `${
//         assignToMeData ? (assignToMeData.length > 0 ? "4rem" : "20.625rem") : "auto"
//       }`,
//       cell: (row) => actionComponent(row, "your_task"),
//     },
//     {
//       name: "Sr",
//       width: "4rem",
//       center: true,
//       cell: (row, index) => index + 1,
//     },
//     {
//       name: "Ticket Id",
//       cell: (row) => (
//         <Link to={`/${_base}/Ticket/View/` + row.id}>
//           <span className="fw-bold text-secondary">{row.ticket_id}</span>
//         </Link>
//       ),
//       sortable: true,
//     },
//     {
//       name: "Description",
//       width: "18.75rem",
//       selector: (row) => {},
//       sortable: false,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           <a
//             href="#"
//             onClick={(e) => {
//               handleModal({
//                 showModal: true,
//                 modalData: row,
//                 modalHeader: "Description",
//               });
//             }}
//           >
//             {row.description && (
//               <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
//                 <div>
//                   <span className="ms-1">
//                     {" "}
//                     {row.description && row.description.length < 123
//                       ? row.description
//                       : row.description.substring(0, 123) + "...."}
//                   </span>
//                 </div>
//               </OverlayTrigger>
//             )}
//           </a>
//         </div>
//       ),
//     },
//     {
//       name: "Ticket Date",
//       selector: (row) => row.ticket_date,
//       sortable: true,
//       width: "120px",
//     },
//     {
//       name: "Expected Solve Date",
//       selector: (row) => row.expected_solve_date,
//       sortable: true,
//     },
//     {
//       name: "Priority",
//       cell: (row) => (
//         <div>
//           {row.priority === "Very High" && (
//             <span style={{ width: "60px" }} className="badge bg-danger">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "High" && (
//             <span style={{ width: "60px" }} className="badge bg-warning">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Medium" && (
//             <span style={{ width: "60px" }} className="badge bg-info">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Low" && (
//             <span style={{ width: "60px" }} className="badge bg-success">
//               {row.priority}
//             </span>
//           )}
//         </div>
//       ),
//       sortable: true,
//     },
//     { name: "Type", cell: (row) => row.query_type_name, sortable: true },
//     { name: "Status", cell: (row) => row.status_name, sortable: true },
//     {
//       name: "Assign To Dept",
//       cell: (row) => row.assign_to_department,
//       sortable: true,
//     },
//     { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
//     { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
//   ];

//   const assignedToMeColumns = [
//     {
//       name: "Action",
//       button: true,

//       width: `${
//         assignToMeData ? (assignToMeData.length > 0 ? "4rem" : "30rem") : "auto"
//       }`,
//       cell: (row) => actionComponent(row, "ASSIGNED_TO_ME"),
//     },
//     { name: "Sr", width: "4rem", cell: (row, index) => index + 1 },
//     {
//       name: "Ticket Id",
//       cell: (row) => (
//         <Link to={`/${_base}/Ticket/View/` + row.id}>
//           <span className="fw-bold text-secondary">{row.ticket_id}</span>
//         </Link>
//       ),
//       sortable: true,
//     },
//     {
//       name: "Description",
//       width: "18.75rem",
//       selector: (row) => {},
//       sortable: false,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           <a
//             href="#"
//             onClick={(e) => {
//               handleModal({
//                 showModal: true,
//                 modalData: row,
//                 modalHeader: "Edit Country",
//               });
//             }}
//           >
//             {row.description && (
//               <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
//                 <div>
//                   <span className="ms-1">
//                     {" "}
//                     {row.description && row.description.length < 123
//                       ? row.description
//                       : row.description.substring(0, 123) + "...."}
//                   </span>
//                 </div>
//               </OverlayTrigger>
//             )}
//           </a>
//         </div>
//       ),
//     },
//     {
//       name: "Ticket Date",
//       selector: (row) => row.ticket_date,
//       sortable: true,
//       width: "120px",
//     },
//     {
//       name: "Expected Solve Date",
//       selector: (row) => row.expected_solve_date,
//       sortable: true,
//     },
//     {
//       name: "Priority",
//       cell: (row) => (
//         <div>
//           {row.priority === "Very High" && (
//             <span style={{ width: "60px" }} className="badge bg-danger">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "High" && (
//             <span style={{ width: "60px" }} className="badge bg-warning">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Medium" && (
//             <span style={{ width: "60px" }} className="badge bg-info">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Low" && (
//             <span style={{ width: "60px" }} className="badge bg-success">
//               {row.priority}
//             </span>
//           )}
//         </div>
//       ),
//       sortable: true,
//     },
//     { name: "Type", cell: (row) => row.query_type_name, sortable: true },
//     { name: "Status", cell: (row) => row.status_name, sortable: true },
//     {
//       name: "Assign To Dept",
//       cell: (row) => row.assign_to_department,
//       sortable: true,
//     },
//     { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
//     { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
//   ];

//   const createdByMeColumns = [
//     {
//       name: "Action",
//       button: true,
//       ignoreRowClick: true,
//       width: `${
//         assignToMeData ? (assignToMeData.length > 0 ? "4rem" : "20.625rem") : "auto"
//       }`,
//       cell: (row) => actionComponent(row, "ADDED_BY_ME"),
//     },

//     {
//       name: "Sr",
//       width: "4rem",
//       center: true,
//       cell: (row, index) => index + 1,
//     },
//     {
//       name: "Ticket Id",
//       cell: (row) => (
//         <Link to={`/${_base}/Ticket/View/` + row.id}>
//           <span className="fw-bold text-secondary">{row.ticket_id}</span>
//         </Link>
//       ),
//       sortable: true,
//     },
//     {
//       name: "Description",
//       width: "18.75rem",
//       selector: (row) => {},
//       sortable: false,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           <a
//             href="#"
//             onClick={(e) => {
//               handleModal({
//                 showModal: true,
//                 modalData: row,
//                 modalHeader: "Edit Country",
//               });
//             }}
//           >
//             {row.description && (
//               <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
//                 <div>
//                   <span className="ms-1">
//                     {" "}
//                     {row.description && row.description.length < 123
//                       ? row.description
//                       : row.description.substring(0, 123) + "...."}
//                   </span>
//                 </div>
//               </OverlayTrigger>
//             )}
//           </a>
//         </div>
//       ),
//     },
//     {
//       name: "Ticket Date",
//       selector: (row) => row.ticket_date,
//       sortable: true,
//       width: "120px",
//     },
//     {
//       name: "Expected Solve Date",
//       selector: (row) => row.expected_solve_date,
//       sortable: true,
//     },
//     {
//       name: "Priority",
//       cell: (row) => (
//         <div>
//           {row.priority === "Very High" && (
//             <span className="badge bg-danger" style={{ width: "60px" }}>
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "High" && (
//             <span style={{ width: "60px" }} className="badge bg-warning">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Medium" && (
//             <span className="badge bg-info" style={{ width: "60px" }}>
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Low" && (
//             <span style={{ width: "60px" }} className="badge bg-success">
//               {row.priority}
//             </span>
//           )}
//         </div>
//       ),
//       sortable: true,
//     },
//     { name: "Type", cell: (row) => row.query_type_name, sortable: true },
//     { name: "Passed Status", cell: (row) => row.passed_status, sortable: true },
//     { name: "Status", cell: (row) => row.status_name, sortable: true },
//     {
//       name: "Assign To Dept",
//       cell: (row) => row.assign_to_department,
//       sortable: true,
//     },
//     { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
//     { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
//   ];

//   const [selectedRows, setSelectedRows] = useState([]);
//   const [selectedRowss, setSelectedRowss] = useState([]);

//   // const handleCheckboxChange = (row) => {
//   //   const isSelected = selectedRows.includes(row);
//   //   setSelectedRows((prevSelectedRows) =>
//   //     isSelected
//   //       ? prevSelectedRows.filter((selectedRow) => selectedRow !== row)
//   //       : [...prevSelectedRows, row]
//   //   );
//   // };
//   const handleCheckboxChange = (row) => {
//     setSelectedRows((prevSelectedRows) =>
//       prevSelectedRows.includes(row.id)
//         ? prevSelectedRows.filter((selectedRow) => selectedRow !== row.id)
//         : [...prevSelectedRows, row.id]
//     );
//   };

//   const handleCheckboxChangee = (row) => {
//     setSelectedRowss((prevSelectedRows) => {
//       if (prevSelectedRows.includes(row.id)) {
//         return prevSelectedRows.filter((selectedRow) => selectedRow !== row.id);
//       } else {
//         return [...prevSelectedRows, row.id];
//       }
//     });
//   };

//   const unpassedColumns = [
//     {
//       name: "Action",
//       button: true,
//       ignoreRowClick: true,
//       allowOverflow: false,
//       width: `${
//         assignToMeData
//           ? assignToMeData.length > 0
//             ? "4rem"
//             : "20.625rem"
//           : "auto"
//       }`,
//       cell: (row) => actionComponent(row, "UNPASSED_TICKET"),
//     },
//     // {
//     //   name: "Checkbox",
//     //   selector: "checkbox", // unique key for the column
//     //   width: "4rem",
//     //   center: true,
//     //   cell: (row) => <input type="checkbox" checked={row.isSelected} onChange={() => handleCheckboxChange(row)} />,
//     // },

//     {
//       name: (
//         <div
//           style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
//           onClick={handleSelectAllNamesChange}
//         >
//           <input
//             type="checkbox"
//             checked={selectAllNames}
//             onChange={() => setSelectAllNames(!selectAllNames)}
//             style={{ marginRight: "5px" }}
//           />
//           Select All
//         </div>
//       ),
//       selector: "selectAll",
//       width: "7rem",
//       center: true,
//       cell: (row) => (
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <input
//             type="checkbox"
//             checked={selectedRowss?.includes(row.id)}
//             onChange={() => handleCheckboxChangee(row)}
//             style={{ marginRight: "5px" }}
//           />
//         </div>
//       ),
//     },
//     // {
//     //   name: "Checkbox",
//     //   selector: "checkbox", // unique key for the column
//     //   width: "4rem",
//     //   center: true,
//     //   cell: (row) => (
//     //     <input
//     //       type="checkbox"
//     //       checked={selectedRows.includes(row.id)}
//     //       onChange={() => handleCheckboxChange(row)}
//     //     />
//     //   ),
//     // },

//     {
//       name: "Sr",
//       width: "4rem",
//       center: true,
//       cell: (row, index) => index + 1,
//     },
//     {
//       name: "Ticket Id",
//       cell: (row) => (
//         <Link to={`/${_base}/Ticket/View/` + row.id}>
//           <span className="fw-bold text-secondary">{row.ticket_id}</span>
//         </Link>
//       ),
//       sortable: true,
//     },
//     {
//       name: "Description",
//       width: "18.75rem",
//       selector: (row) => {},
//       sortable: false,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           <a
//             href="#"
//             onClick={(e) => {
//               handleModal({
//                 showModal: true,
//                 modalData: row,
//                 modalHeader: "Edit Country",
//               });
//             }}
//           >
//             {row.description && (
//               <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
//                 <div>
//                   <span className="ms-1">
//                     {" "}
//                     {row.description && row.description.length < 123
//                       ? row.description
//                       : row.description.substring(0, 123) + "...."}
//                   </span>
//                 </div>
//               </OverlayTrigger>
//             )}
//           </a>
//         </div>
//       ),
//     },
//     {
//       name: "Ticket Date",
//       selector: (row) => row.ticket_date,
//       sortable: true,
//       width: "120px",
//     },
//     {
//       name: "Expected Solve Date",
//       selector: (row) => row.expected_solve_date,
//       sortable: true,
//     },
//     {
//       name: "Priority",
//       cell: (row) => (
//         <div>
//           {row.priority === "Very High" && (
//             <span style={{ width: "60px" }} className="badge bg-danger">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "High" && (
//             <span style={{ width: "60px" }} className="badge bg-warning">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Medium" && (
//             <span style={{ width: "60px" }} className="badge bg-info">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Low" && (
//             <span style={{ width: "60px" }} className="badge bg-success">
//               {row.priority}
//             </span>
//           )}
//         </div>
//       ),
//       sortable: true,
//     },
//     { name: "Type", cell: (row) => row.query_type_name, sortable: true },
//     { name: "Status", cell: (row) => row.status_name, sortable: true },
//     {
//       name: "Assign To Dept",
//       cell: (row) => row.assign_to_department,
//       sortable: true,
//     },
//     { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
//     { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
//   ];

//   const departmentwisetTicketColumns = [
//     {
//       name: "Action",
//       button: true,
//       center: true,
//       ignoreRowClick: true,
//       allowOverflow: false,
//       width: `${
//         assignToMeData
//           ? assignToMeData.length > 0
//             ? "4rem"
//             : "20.625rem"
//           : "auto"
//       }`,
//       cell: (row) => actionComponent(row, "DEPARTMENTWISE_TICKET"),
//     },
//     {
//       name: "Sr",
//       width: "4rem",
//       center: true,
//       cell: (row, index) => index + 1,
//     },
//     {
//       name: "Ticket Id",
//       cell: (row) => (
//         <Link to={`/${_base}/Ticket/View/` + row.id}>
//           <span className="fw-bold text-secondary">{row.ticket_id}</span>
//         </Link>
//       ),
//       sortable: true,
//     },
//     {
//       name: "Description",
//       width: "18.75rem",
//       selector: (row) => {},
//       sortable: false,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           <a
//             href="#"
//             onClick={(e) => {
//               handleModal({
//                 showModal: true,
//                 modalData: row,
//                 modalHeader: "Edit Country",
//               });
//             }}
//           >
//             {row.description && (
//               <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
//                 <div>
//                   <span className="ms-1">
//                     {" "}
//                     {row.description && row.description.length < 123
//                       ? row.description
//                       : row.description.substring(0, 123) + "...."}
//                   </span>
//                 </div>
//               </OverlayTrigger>
//             )}
//           </a>
//         </div>
//       ),
//     },
//     {
//       name: "Ticket Date",
//       selector: (row) => row.ticket_date,
//       sortable: true,
//       width: "120px",
//     },
//     {
//       name: "Expected Solve Date",
//       selector: (row) => row.expected_solve_date,
//       sortable: true,
//     },
//     {
//       name: "Priority",
//       cell: (row) => (
//         <div>
//           {row.priority === "Very High" && (
//             <span style={{ width: "60px" }} className="badge bg-danger">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "High" && (
//             <span style={{ width: "60px" }} className="badge bg-warning">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Medium" && (
//             <span style={{ width: "60px" }} className="badge bg-info">
//               {row.priority}
//             </span>
//           )}
//           {row.priority === "Low" && (
//             <span style={{ width: "60px" }} className="badge bg-success">
//               {row.priority}
//             </span>
//           )}
//         </div>
//       ),
//       sortable: true,
//     },
//     { name: "Type", cell: (row) => row.query_type_name, sortable: true },
//     { name: "Status", cell: (row) => row.status_name, sortable: true },
//     {
//       name: "Assign To Dept",
//       cell: (row) => row.assign_to_department,
//       sortable: true,
//     },
//     { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
//     { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
//   ];

//   const loadData = async () => {
//     // setShowLoaderModal(null);
//     // setShowLoaderModal(true);

//     // setIsLoading(true);


//     // await new UserService()
//     //   .getUserForMyTickets(inputRequired)
//     //   .then((res) => {
//     //     if (res.status === 200) {
//     //       const tempData = [];
//     //       const temp = res.data.data;
//     //       if (res.data.status == 1) {
//     //         const data = res.data.data.filter((d) => d.is_active == 1);
//     //         setUser(temp);
//     //       }
//     //       for (const key in temp) {
//     //         tempData.push({
//     //           value: temp[key].id,
//     //           label: temp[key].first_name + " " + temp[key].last_name,
//     //         });
//     //       }
//     //       const select = res.data.data
//     //         .filter((d) => d.is_active == 1)
//     //         .map((d) => ({
//     //           value: d.id,
//     //           label: d.first_name + " " + d.last_name,
//     //         }));

//     //       setUserData(null);
//     //       const aa = tempData.sort(function (a, b) {
//     //         return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
//     //       });
//     //       setUserData(aa);
//     //       setAssignUserDropdown(select);
//     //       setUserDropdown(select);
//     //     }
//     //   })
//     //   .catch((error) => {
//     //     const { response } = error;
//     //     const { request, ...errorObject } = response;
//     //     new ErrorLogService().sendErrorLog(
//     //       "Status",
//     //       "Get_Status",
//     //       "INSERT",
//     //       errorObject.data.message
//     //     );
//     //   });

//     // await new DepartmentService().getDepartment().then((res) => {
//     //   if (res.status === 200) {
//     //     // setShowLoaderModal(false);
//     //     const tempData = [];
//     //     const temp = res.data.data;
//     //     for (const key in temp) {
//     //       if (temp[key].department) {
//     //         tempData.push({
//     //           value: temp[key].id,
//     //           label: temp[key].department,
//     //         });
//     //       }
//     //     }
//     //     setDepartmentData(null);
//     //     setDepartmentData(tempData);
//     //   }
//     // });

//     // await new StatusService().getStatus().then((res) => {
//     //   if (res.status === 200) {
//     //     // setShowLoaderModal(false);

//     //     const tempData = [];
//     //     const temp = res.data.data;

//     //     for (const key in temp) {
//     //       // if (temp[key].is_active == 1) {
//     //       if (temp[key].id) {
//     //         tempData.push({
//     //           value: temp[key].id,
//     //           label: temp[key].status,
//     //         });
//     //       }
//     //     }
//     //     setStatusData(null);
//     //     setStatusData(tempData);

//     //   }
//     // });

//     // await new DepartmentMappingService()
//     //   .getDepartmentMappingByEmployeeId(localStorage.getItem("id"))
//     //   .then((res) => {
//     //     if (res.status === 200) {
//     //       setIsLoading(false);

//     //       if (res.data.status == 1) {
//     //         if (res.status === 200) {
//     //           if (res.data.status == 1) {
//     //             setUserDepartment(res.data.data);
//     //           }
//     //         }
//     //       }
//     //     }
//     //     if (res.status === 200) {
//     //       setIsLoading(false);

//     //       const tempData = [];
//     //       const temp = res.data.data;
//     //       for (const key in temp) {
//     //         if (temp[key].is_active == 1) {
//     //           tempData.push([temp[key].ticket_show_type]);
//     //         }
//     //       }
//     //       setTicketShowType(null);
//     //       setTicketShowType(tempData);
//     //     }
//     //   });


//     // await new MyTicketService().getUserTicketsTest().then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       setAssignedToMeData(res.data.data);
//     //       setAssignedToMe(
//     //         res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//     //       );
//     //       console.log("aa",assignedToMe)
//     //       const dataAssignToMe = res.data.data.data;
//     //       var counter = 1;
//     //       var tempAssignToMeExport = [];
//     //       for (const key in dataAssignToMe) {
//     //         tempAssignToMeExport.push({
//     //           Sr: counter++,
//     //           TICKET_ID: dataAssignToMe[key].ticket_id,
//     //           TICKET_DATE: dataAssignToMe[key].ticket_date,
//     //           EXPECTED_SOLVE_DATE: dataAssignToMe[key].expected_solve_date,
//     //           ASSIGN_TO_DEPARTMENT: dataAssignToMe[key].assign_to_department,
//     //           ASSIGN_TO_USER: dataAssignToMe[key].assign_to_user,
//     //           QUERY_TYPE_NAME: dataAssignToMe[key].query_type_name,
//     //           PRIORITY: dataAssignToMe[key].priority,
//     //           STATUS: dataAssignToMe[key].status_name,
//     //           DESCRIPTION: dataAssignToMe[key].description,
//     //           CREATED_BY: dataAssignToMe[key].created_by_name,

//     //           Basket_Configured: dataAssignToMe[key].basket_configured,
//     //           Confirmation_Required: dataAssignToMe[key].confirmation_required
//     //             ? "YES"
//     //             : "NO",
//     //           Ref_id: dataAssignToMe[key].cuid,
//     //           from_department_name: dataAssignToMe[key].from_department_name,
//     //           id: dataAssignToMe[key].id,
//     //           Status: dataAssignToMe[key].is_active ? "Active" : "Deactive",
//     //           module_name: dataAssignToMe[key].module_name,
//     //           Passed_Status: dataAssignToMe[key].passed_status,
//     //           Passed_Status_Changed_At:
//     //             dataAssignToMe[key].passed_status_changed_at,
//     //           Passed_Status_Changed_By_Name:
//     //             dataAssignToMe[key].passed_status_changed_by_name,
//     //           Passed_Status_Remark: dataAssignToMe[key].passed_status_remark,
//     //           project_name: dataAssignToMe[key].project_name,
//     //           // query_type_name: dataCreatedByMe[key].query_type_name,
//     //           Status_name: dataAssignToMe[key].status_name,
//     //           sub_module_name: dataAssignToMe[key].sub_module_name,
//     //           Template_id: dataAssignToMe[key].template_id,
//     //           Tenant_id: dataAssignToMe[key].tenant_id,
//     //         });
//     //       }

//     //       setAssignedToMeExport(tempAssignToMeExport);
//     //     }
//     //   }
//     // });

//     // await new ManageMenuService().getRole(roleId).then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       const getRoleId = sessionStorage.getItem("role_id");
//     //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//     //     }
//     //   }
//     // });
//   };

//   // const handlePassTicketForm = async (e) => {
//   //   setNotify(null);
//   //   e.preventDefault();

//   //   const formData = new FormData(e.target);
//   //   await new MyTicketService().passTicket(formData).then((res) => {
//   //     if (res.status === 200) {
//   //       if (res.data.status == 1) {
//   //         setRemarkModal({ showModal: false, modalData: "", modalHeader: "" });
//   //         loadData();
//   //         setNotify({ type: "success", message: res.data.message });
//   //       } else {
//   //         setNotify({ type: "danger", message: res.data.message });
//   //       }
//   //     } else {
//   //       setNotify({ type: "danger", message: "Request Error !!!" });
//   //     }
//   //   });
//   // };

//   const handlePassTicketForm = async (e) => {
//     try {
//       e.preventDefault();
//       setNotify(null);

//       const formData = new FormData(e.target);

//       selectedRowss.forEach((id, index) => {
//         formData.append(`id[${index}]`, id);
//       });
//       const response = await new MyTicketService().passTicket(formData);

//       if (response.status === 200) {
//         const { status, message } = response.data;

//         if (status === 1) {
//           setRemarkModal({ showModal: false, modalData: "", modalHeader: "" });
//           // window.location.reload(false)
//           loadData();
//           setSelectedRows([]);
//           setSelectedRowss([]);

//           setNotify({ type: "success", message });
//         } else {
//           setNotify({ type: "danger", message });
//         }
//       } else {
//         setNotify({ type: "danger", message: "Request Error !!!" });
//       }
//     } catch (error) {
//       setNotify({ type: "danger", message: "An error occurred." });
//     }
//   };

//   // bluk ticket pass api calling
//   // console.log("selectedRowss",selectedRowss)

//   // const handleBulkPassTicketForm = async (e) => {
//   //   try {
//   //     e.preventDefault();
//   //     setNotify(null);

//   //     const formData = new FormData(e.target);

//   //      // Append selected IDs to the formData
//   //     //  selectedRowss.forEach((id) => {
//   //     //   formData.append('id', id);
//   //     // })

//   //     {selectAllNames === true ?
//   //      // Append selected IDs to the formData
//   //      formData.append('id[]', String(selectedRowss))
//   //     :
//   //     // Append selected IDs to the formData
//   //     selectedRows.forEach((id) => {
//   //       formData.append('id', id);
//   //     });
//   //   }
//   //     const response = await new MyTicketService().passBulkTicket(formData);
//   //     if (response.status === 200) {
//   //       const { status, message } = response.data;
//   //       if (status === 1) {
//   //         setBulkRemarkModal({ showModal: false, modalData: "", modalHeader: "" });
//   //         // window.location.reload(false)
//   //         loadData();
//   //         setSelectedRows([])

//   //         setNotify({ type: "success", message });
//   //       } else {
//   //         setNotify({ type: "danger", message });
//   //       }
//   //     } else {
//   //       setNotify({ type: "danger", message: "Request Error !!!" });
//   //     }
//   //   } catch (error) {
//   //     console.error("Error handling passTicket form:", error);
//   //     setNotify({ type: "danger", message: "An error occurred." });
//   //   }
//   // };

//   // console.log("remarkModal", remarkModal)

//   const handleForm = async (e) => {
//     // e.preventDefault();
//     // const formData = new FormData(e.target);
//     // var flag = 1;
//     try {
//       e.preventDefault();
//       const formData = new FormData(e.target);
//       var flag = 1;
//       await new ReportService()
//         .getTicketReport(formData)
//         .then((res) => {
//           if (res.status === 200) {
//             if (res.data.status == 1) {
//               setSearchResult(null);
//               setSearchResult(res.data.data);
//               const temp = res.data.data;
//               var counter = 1;
//               var searchResultExport = [];
//               for (const key in temp) {
//                 searchResultExport.push({
//                   Sr: counter++,
//                   TICKET_ID: temp[key].ticket_id,
//                   TICKET_DATE: temp[key].ticket_date,
//                   EXPECTED_SOLVE_DATE: temp[key].expected_solve_date,
//                   ASSIGN_TO_DEPARTMENT: temp[key].assign_to_department,
//                   ASSIGN_TO_USER: temp[key].assign_to_user,
//                   QUERY_TYPE_NAME: temp[key].query_type_name,
//                   PRIORITY: temp[key].priority,
//                   STATUS: temp[key].status_name,
//                   DESCRIPTION: temp[key].description,
//                   CREATED_BY: temp[key].created_by_name,
//                   solve_date: temp[key].solve_date,

//                   Basket_Configured: temp[key].basket_configured,
//                   Confirmation_Required: temp[key].confirmation_required
//                     ? "YES"
//                     : "NO",
//                   Ref_id: temp[key].cuid,
//                   from_department_name: temp[key].from_department_name,
//                   id: temp[key].id,
//                   Status: temp[key].is_active ? "Active" : "Deactive",
//                   module_name: temp[key].module_name,
//                   Passed_Status: temp[key].passed_status,
//                   Passed_Status_Changed_At: temp[key].passed_status_changed_at,
//                   Passed_Status_Changed_By_Name:
//                     temp[key].passed_status_changed_by_name,
//                   Passed_Status_Remark: temp[key].passed_status_remark,
//                   project_name: temp[key].project_name,
//                   // query_type_name: dataCreatedByMe[key].query_type_name,
//                   Status_name: temp[key].status_name,
//                   sub_module_name: temp[key].sub_module_name,
//                   Template_id: temp[key].template_id,
//                   Tenant_id: temp[key].tenant_id,
//                 });
//               }
//               setKey("Search_Result");
//               setSearchResultExport(searchResultExport);
//             } else {
//               alert("No Data Found");
//               // setNotify({ type: 'danger', message: "No data Found" });
//             }
//           } else {
//             new ErrorLogService().sendErrorLog(
//               "UserTask",
//               "Get_UserTask",
//               "INSERT",
//               res.message
//             );
//           }
//         })
//         .catch((error) => {
//           const { response } = error;
//           const { request, ...errorObject } = response;
//           new ErrorLogService().sendErrorLog(
//             "UserTask",
//             "Get_UserTask",
//             "INSERT",
//             errorObject.data.message
//           );
//           setIsLoading(false);
//         });
//     } catch (error) {
//       // Handle errors that may occur during the getTicketReport call
//       console.error("Error:", error);
//       // You can add additional error handling logic here, such as displaying an error message to the user.
//     }
//   };

//   const [statusValue, setStatusValue] = useState("");
//   const [assignedUser, setAssignedUser] = useState("");
//   const [entryUser, setEntryUser] = useState("");

//   const handleChangeStatus = (e) => {
//     setStatusValue(e);
//   };
//   const handleChangeAssignedUser = (e) => {
//     setAssignedUser(e);
//   };
//   const handleChangeEntryUser = (e) => {
//     setEntryUser(e);
//   };

//   const disableDate = () => {
//     const date = new Date();
//     const result = date.toLocaleDateString("es-CL", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });
//     var listString = result.split("-").reverse();
//     return Array.from(listString).join("-");
//   };

//   const selectInputRef = useRef();
//   const selectAssignUserRef = useRef();
//   const selectEntryDeptRef = useRef();
//   const selectUserRef = useRef();
//   const selectStatusRef = useRef();
//   const selectFromDateRef = useRef();
//   const selectToDateRef = useRef();
//   const selectTicketRef = useRef();

//   const handleClearData = (e) => {
//     if (selectInputRef.current.commonProps.hasValue != null) {
//       selectInputRef.current.clearValue();
//     }
//     if (selectAssignUserRef.current.commonProps.hasValue != null) {
//       selectAssignUserRef.current.clearValue();
//       selectUserRef.current.clearValue();
//     }
//     selectEntryDeptRef.current.clearValue();
//     selectStatusRef.current.clearValue();
//     if (selectFromDateRef.current.value != null) {
//       document.getElementById("from_date").value = "";
//     }
//     if (selectToDateRef.current.value != null) {
//       document.getElementById("to_date").value = "";
//     }
//     if (selectTicketRef.current.value != null) {
//       document.getElementById("ticket_id").value = "";
//     }
//   };
//   const [startDate, setStartDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [ticket, setTicket] = useState("");
//   const [value, setValue] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   const handleFromDate = (e) => {
//     setStartDate(e.target.value);
//     if (e.target.value) {
//       setToDateRequired(true);
//     } else {
//       setToDateRequired(false);
//     }
//   };

//   const handleToDate = (e) => {
//     setToDate(e.target.value);
//   };

//   const handleTicket = (e) => {
//     setTicket(e.target.value);
//   };

//   const onClosePopup = () => {
//     setShow(false);
//   };

//   const handleFilterForm = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     var flag = 1;
//     var filterExport = [];

//     if (toDate < startDate) {
//       alert("Please select Date After From date");
//     } else {
//       var flag = 1;
//       onClosePopup();
//       await new ReportService()
//         .getTicketReport(formData)
//         .then((res) => {
//           if (res.status === 200) {
//             if (res.data.status == 1) {
//               setSearchResult(null);
//               setSearchResult(res.data.data);
//               const temp = res.data.data;
//               var counter = 1;
//               var searchResultExport = [];
//               for (const key in temp) {
//                 searchResultExport.push({
//                   counter: counter++,
//                   Re_Id: temp[key].cuid,
//                   TICKET_DATE: temp[key].ticket_date,
//                   EXPECTED_SOLVE_DATE: temp[key].expected_solve_date,
//                   ASSIGN_TO_DEPARTMENT: temp[key].assign_to_department,
//                   ASSIGN_TO_USER: temp[key].assign_to_user,
//                   TYPE: temp[key].type_id,
//                   PRIORITY: temp[key].priority,
//                   solve_date: temp[key].solve_date,
//                   STATUS: temp[key].status_name,
//                   DESCRIPTION: temp[key].description,
//                   CREATED_BY: temp[key].created_by_name,
//                 });
//               }
//               setKey("Search_Result");
//               setSearchResultExport(searchResultExport);

//               for (const key in temp) {
//                 filterExport.push({
//                   Sr: counter++,
//                   TICKET_ID: temp[key].ticket_id,
//                   TICKET_DATE: temp[key].ticket_date,
//                   EXPECTED_SOLVE_DATE: temp[key].expected_solve_date,
//                   ASSIGN_TO_DEPARTMENT: temp[key].assign_to_department,
//                   ASSIGN_TO_USER: temp[key].assign_to_user,
//                   QUERY_TYPE_NAME: temp[key].query_type_name,
//                   PRIORITY: temp[key].priority,
//                   STATUS: temp[key].status_name,
//                   DESCRIPTION: temp[key].description,
//                   CREATED_BY: temp[key].created_by_name,
//                   solve_date:temp[key].solve_date,

//                   Basket_Configured: temp[key].basket_configured,
//                   Confirmation_Required: temp[key].confirmation_required
//                     ? "YES"
//                     : "NO",
//                   Ref_id: temp[key].cuid,
//                   from_department_name: temp[key].from_department_name,
//                   id: temp[key].id,
//                   Status: temp[key].is_active ? "Active" : "Deactive",
//                   module_name: temp[key].module_name,
//                   Passed_Status: temp[key].passed_status,
//                   Passed_Status_Changed_At: temp[key].passed_status_changed_at,
//                   Passed_Status_Changed_By_Name:
//                     temp[key].passed_status_changed_by_name,
//                   Passed_Status_Remark: temp[key].passed_status_remark,
//                   project_name: temp[key].project_name,
//                   // query_type_name: dataCreatedByMe[key].query_type_name,
//                   Status_name: temp[key].status_name,
//                   sub_module_name: temp[key].sub_module_name,
//                   Template_id: temp[key].template_id,
//                   Tenant_id: temp[key].tenant_id,
//                 });
//               }
//               setKey("Search_Result");
//               setSearchResultExport(filterExport);
//             }
//           } else {
//             new ErrorLogService().sendErrorLog(
//               "UserTask",
//               "Get_UserTask",
//               "INSERT",
//               res.message
//             );
//           }
//         })
//         .catch((error) => {
//           const { response } = error;
//           const { request, ...errorObject } = response;
//           new ErrorLogService().sendErrorLog(
//             "UserTask",
//             "Get_UserTask",
//             "INSERT",
//             errorObject.data.message
//           );
//         });
//     }
//   };
//   const formRef = useRef();

//   const handleRef = (e) => {
//     formRef.current.reset();
//   };

//   const [entryDepartment, setEntryDepartment] = useState();

//   const handleDepartment = (e) => {
//     const deptUser = [];
//     for (var i = 0; i < e.length; i++) {
//       const select = user
//         .filter((d) => d.department_id == e[i].value)
//         .map((d) => ({ value: d.id, label: d.first_name + " " + d.last_name }));
//       for (var j = 0; j < select.length; j++) {
//         deptUser.push(select[j]);
//       }
//     }
//     setUserDropdown(deptUser);
//     setUserName(null);

//     setEntryDepartment(e);
//   };

//   const [assignedDepartmentValue, setAssignedDepartment] = useState("");

//   const handleAssignedDepartment = (e) => {
//     const deptAssignedUser = [];
//     for (var i = 0; i < e.length; i++) {
//       const select = user
//         .filter((d) => d.department_id == e[i].value)
//         .map((d) => ({ value: d.id, label: d.first_name + " " + d.last_name }));
//       // const select = user.filter(d => d.is_active == 1).map(d => ({ value: d.id, label: d.first_name + " " + d.last_name }))

//       for (var j = 0; j < select.length; j++) {
//         deptAssignedUser.push(select[j]);
//       }
//     }
//     setAssignUserDropdown(null);
//     setAssignUserDropdown(deptAssignedUser);
//     setAssignedDepartment(e);
//   };

//   useEffect(() => {
//     const listener = (event) => {
//       if (event.code === "Enter") {
//         // callMyFunction();
//         handleForm();
//       }
//     };
//     document.addEventListener("keydown", listener);
//     return () => {
//       document.removeEventListener("keydown", listener);
//     };
//   }, []);

//   const [key, setKey] = useState("Assigned_To_Me");
//   useEffect(() => {
//     loadData();
//     const inputRequired =
//     "id,employee_id,first_name,last_name,middle_name,is_active";
//     if(!statusData.length){
//   dispatch(getStatusData());

//     }
//     // if(!assignToMeData?.length){
//   // dispatch(getUserTicketsTest());}
//   if(!UserForMyTicketData?.length){
//   dispatch(getUserForMyTicketsData(inputRequired))}
//     if(!departsmentData?.length){
//     dispatch(departmentData())}
//     if (location && location.state) {
//       setNotify(location.state.alert);
//     }
//     if(!checkRole?.length){
//       dispatch(getRoles())
//     }
//   }, []);

//   const currentDate = new Date();
//   const formattedDate = `${currentDate.getFullYear()}-${(
//     currentDate.getMonth() + 1
//   )
//     .toString()
//     .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
//   const timeString = `${currentDate
//     .getHours()
//     .toString()
//     .padStart(2, "0")}${currentDate
//     .getMinutes()
//     .toString()
//     .padStart(2, "0")}${currentDate.getSeconds().toString().padStart(2, "0")}`;
//   const formattedTimeString = `${timeString.slice(0, 2)}:${timeString.slice(
//     2,
//     4
//   )}:${timeString.slice(4, 6)}`;

//   useEffect(() => {
//     if (checkRole && checkRole[0]?.can_read === 0) {
//       // alert("Rushi")

//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
//     }
//   }, [checkRole]);
//   const [createdByMeData, setCreatedByMeData] = useState();
//   const [departmentWiseData, setDepartmentWiseData] = useState();
//   const [yourTaskData, setYourTaskData] = useState();
//   const [unpassedData, setUnpassedData] = useState();

//   const handleAssignedToMeTab = async (k, e) => {
//     e.preventDefault();
//     var form;
//     let form1 = {};
//     // var form;

//     form1.limit = 10;
//     form1.typeOf = k;
//     form1.page = 1;
//     dispatch(getUserTicketsTest(form1)).then((res)=>{
//       setUnpassedData({...assignToMeData,current_page:res.payload.data.data.current_page})
//     })

// //     console.log("u=",unpassedData)
//     // await new MyTicketService().getUserTicketsTest(form1).then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       // setAssignedToMe(
//     //       //   res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//     //       // );
//     //       console.log("res.data.data.data",res.data.data.data)
//     //     }
//     //   }
//     // });

//     // if (k == "Assigned_To_Me") {
//     //   form = {
//     //     limit: 10,
//     //     typeOf: "Assigned_To_Me",
//     //     page: 1,
//     //   };
//     //   await new MyTicketService().getUserTicketsTest(form).then((res) => {
//     //     if (res.status === 200) {
//     //       if (res.data.status == 1) {
//     //         setAssignedToMe(
//     //           res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//     //         );
//     //       }
//     //     }
//     //   });
//     // } else if (k == "created_by_me") {
//     //   const forms = {
//     //     limit: 10,
//     //     typeOf: "CreatedByMe",
//     //     page: 1,
//     //   };
//     //   await new MyTicketService().getUserTicketsTest(forms).then((res) => {
//     //     if (res.status === 200) {
//     //       setCreatedByMeData(res.data.data);
//     //       console.log("r", res.data.data);
//     //       setCreatedByMe(
//     //         res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//     //       );
//     //     }
//     //   });
//     // } else if (k == "departmenyourTaskt") {
//     //   const forms = {
//     //     limit: 10,
//     //     typeOf: "DepartmentWise",
//     //     page: 1,
//     //   };
//     //   await new MyTicketService().getUserTicketsTest(forms).then((res) => {
//     //     if (res.status === 200) {
//     //       if (res.data.status == 1) {
//     //         setDepartmentWiseData(res.data.data);
//     //         setDepartmentwiseTicket(
//     //           res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//     //         );
//     //       }
//     //     }
//     //   });
//     // } else if (k == "your_task") {
//     //   const forms = {
//     //     limit: 10,
//     //     typeOf: "YouTask",
//     //     page: 1,
//     //   };

//     //   await new MyTicketService().getUserTicketsTest(forms).then((res) => {
//     //     if (res.status === 200) {
//     //       if (res.data.status == 1) {
//     //         setYourTaskData(res.data.data);
//     //         setYourTask(
//     //           res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//     //         );
//     //       }
//     //     }
//     //   });
//     // } else if (k == "unpassed_columns") {
//     //   const forms = {
//     //     limit: 10,
//     //     typeOf: "UnPassed",
//     //     page: 1,
//     //   };

//       // await new MyTicketService().getUserTicketsTest(forms).then((res) => {
//       //   if (res.status === 200) {
//       //     if (res.data.status == 1) {
//       //       setUnpassedData(res.data.data);

//       //       setUnpassedTickets(res.data.data.data);
//       //       setUnpassedData({...unpassedData,current_page:res.data.data.current_page})
//       //     }
//       //   }
//       // });

//   };

//   const handleAssignedToMeRowChanged = async (e, type) => {
//     e.preventDefault();
//     var form;
//     if (type == "LIMIT") {
//       const limit = parseInt(e.target.value);
//       const typeOf = type;
//       // const currentPage = limit <
//       form = {
//         limit: limit,
//         typeOf: "AssignToMe",
//         page: 1,
//       };
//     } else if (type == "MINUS") {
//       // const limit = parseInt(e.target.value)
//       form = {
//         // limit: limit,
//         typeOf: "AssignToMe",
//         page: assignedToMeData.current_page - 1,
//       };
//     } else if (type == "PLUS") {
//       form = {
//         // limit: limit,
//         typeOf: "AssignToMe",
//         page: assignedToMeData.current_page + 1,
//       };
//     }

//     // await new MyTicketService().getUserTicketsTest(form).then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       var newSr = res.data.data.from;
//     //       setAssignedToMe(
//     //         res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//     //       );
//     //     }
//     //   }
//     // });
//   };
//   {
//   }
//   const handleCreatedByMeRowChanged = async (e, type) => {
//     e.preventDefault();
//     var form;
//     if (type == "LIMIT") {
//       const limit = parseInt(e.target.value);
//       form = {
//         limit: limit,
//         typeOf: "CreatedByMe",
//         page: createdByMeData.current_page,
//       };
//     } else if (type == "MINUS") {
//       // const limit = parseInt(e.target.value)
//       form = {
//         // limit: limit,
//         typeOf: "CreatedByMe",
//         page: createdByMeData.current_page - 1,
//       };
//     } else if (type == "PLUS") {
//       form = {
//         // limit: limit,
//         typeOf: "CreatedByMe",
//         page: createdByMeData.current_page + 1,
//       };
//     }
//     await new MyTicketService().getUserTicketsTest(form).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           setCreatedByMe(
//             res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//           );
//         }
//       }
//     });
//   };

//   const handleDepartmentWiseRowChanged = async (e, type) => {
//     e.preventDefault();
//     var form;
//     if (type == "LIMIT") {
//       const limit = parseInt(e.target.value);
//       form = {
//         limit: limit,
//         typeOf: "DepartmentWise",
//         page: departmentWiseData.current_page,
//       };
//     } else if (type == "MINUS") {
//       // const limit = parseInt(e.target.value)
//       form = {
//         // limit: limit,
//         typeOf: "DepartmentWise",
//         page: departmentWiseData.current_page - 1,
//       };
//     } else if (type == "PLUS") {
//       form = {
//         // limit: limit,
//         typeOf: "DepartmentWise",
//         page: departmentWiseData.current_page + 1,
//       };
//     }

//     await new MyTicketService().getUserTicketsTest(form).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           setDepartmentwiseTicket(
//             res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//           );
//         }
//       }
//     });
//   };

//   const handleYourTaskRowChanged = async (e, type) => {
//     e.preventDefault();
//     var form;
//     if (type == "LIMIT") {
//       const limit = parseInt(e.target.value);
//       form = {
//         limit: limit,
//         typeOf: "YouTask",
//         page: yourTaskData.current_page,
//       };
//     } else if (type == "MINUS") {
//       // const limit = parseInt(e.target.value)
//       form = {
//         // limit: limit,
//         typeOf: "YouTask",
//         page: yourTaskData.current_page - 1,
//       };
//     } else if (type == "PLUS") {
//       form = {
//         // limit: limit,
//         typeOf: "YouTask",
//         page: yourTaskData.current_page + 1,
//       };
//     }

//     await new MyTicketService().getUserTicketsTest(form).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           setYourTask(
//             res.data.data.data.filter((d) => d.passed_status !== "REJECT")
//           );
//         }
//       }
//     });
//   };

//   const handleUnpassedRowChanged = async (e, type) => {
//     e.preventDefault();
//     var form;
//     if (type == "LIMIT") {
//       const limit = parseInt(e.target.value);
//       form = {
//         limit: limit,
//         typeOf: "UnPassed",
//         page: unpassedData.current_page,
//       };
//     } else if (type == "MINUS") {
//       // const limit = parseInt(e.target.value)
//       form = {
//         // limit: limit,
//         typeOf: "UnPassed",
//         page: unpassedData.current_page - 1,
//       };
//     } else if (type == "PLUS") {
//       form = {
//         // limit: limit,
//         typeOf: "UnPassed",
//         page: unpassedData.current_page + 1,
//       };
//     }

//     // await new MyTicketService().getUserTicketsTest(form).then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       setUnpassedTickets(res.data.data.data);
//     //     }
//     //   }
//     // });
//   };

//   return (
//     <div className="container-xxl">
//       <PageHeader headerTitle="My Tickets" />
//       {/* <LoadingSpinner/> */}
//       {notify && <Alert alertData={notify} />}
//       {/* {userData && JSON.stringify(userData)} */}
//       <div className="card mt-2 " style={{ zIndex: 10 }}>
//         <div className="card-body">
//           <form onSubmit={handleForm}>
//             <div className="row">
//               <div className="col-md-3">
//                 <label className="">
//                   <b>Ticket Id :</b>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control form-control-sm"
//                   id="ticket_idd"
//                   name="ticket_id"
//                   onKeyPress={(e) => {
//                     Validation.CharactersNumbersOnly(e);
//                   }}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <label className="">
//                   <b>Select User :</b>
//                 </label>
//                 {/* <UserDropdown id="assign_to_user_id" name="assign_to_user_id"/> */}
//                 {UserForMyTicketData && (
//                   <Select
//                     options={UserForMyTicketData}
//                     isMulti={true}
//                     id="assign_to_user_id[]"
//                     name="assign_to_user_id[]"
//                   />
//                 )}
//               </div>

//               <div className="col-md-3">
//                 <label className="">
//                   <b>Select Department :</b>
//                 </label>
//                 {departsmentData && (
//                   <Select
//                     options={departsmentData}
//                     isMulti={true}
//                     id="assign_to_department_id[]"
//                     name="assign_to_department_id[]"
//                   />
//                 )}
//               </div>


//               <div className="col-md-3">
//                 <label className="">
//                   <b>Select Status :</b>
//                 </label>
//                 {statusData && (
//                   <Select
//                     options={statusData}
//                     isMulti={true}
//                     id="status_id[]"
//                     name="status_id[]"
//                   />
//                 )}
//               </div>

//               <div className="col-md-4">
//                 <button
//                   className="btn btn-sm btn-warning text-white"
//                   type="submit"
//                   style={{ marginTop: "20px", fontWeight: "600" }}
//                 >
//                   <i className="icofont-search-1 "></i> Search
//                 </button>
//                 <button
//                   className="btn btn-sm btn-info text-white"
//                   type="button"
//                   onClick={() => window.location.reload(false)}
//                   style={{ marginTop: "20px", fontWeight: "600" }}
//                 >
//                   <i className="icofont-refresh text-white"></i> Reset
//                 </button>
//                 <button
//                   className="btn btn-sm btn-primary text-white"
//                   type="button"
//                   id="openFilter"
//                   onClick={handleShow}
//                   style={{ marginTop: "20px", fontWeight: "600" }}
//                 >
//                   {" "}
//                   Filter <i className="icofont-filter" />
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>

//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Filter</Modal.Title>
//         </Modal.Header>
//         <form
//           onSubmit={(e) => {
//             handleFilterForm(e);
//           }}
//           ref={formRef}
//         >
//           <Modal.Body>
//             <div className="card mt-2" style={{ zIndex: 10 }}>
//               <div className="card-body">
//                 {/* *****************START DATE, END DATE**************** */}
//                 <div className="row mt-3">
//                   <div className="col-md-6">
//                     <label htmlFor="" className="">
//                       <b>From Date :</b>
//                     </label>
//                     <input
//                       type="date"
//                       className="form-control form-control-sm"
//                       name="from_date"
//                       id="from_date"
//                       onChange={handleFromDate}
//                       defaultValue={startDate}
//                       required={toDateRequired}
//                       ref={selectFromDateRef}
//                       // max={disableDate()}
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label htmlFor="" className="">
//                       <b>To Date :</b>
//                     </label>
//                     <input
//                       type="date"
//                       className="form-control form-control-sm"
//                       name="to_date"
//                       id="to_date"
//                       defaultValue={toDate}
//                       ref={selectToDateRef}
//                       onChange={handleToDate}
//                       // max={disableDate()}
//                       required={toDateRequired}
//                       min={startDate}
//                     />
//                   </div>
//                 </div>
//                 {/* ********************************* */}

//                 {/* *****************Entry Department,Entry User **************** */}
//                 <div className="row mt-3">
//                   <div className="col-md-6">
//                     <label className="">
//                       <b>Assigned Department :</b>
//                     </label>
//                     {departsmentData && (
//                       <Select
//                         options={departsmentData}
//                         // value={deptAssignedUser}

//                         // ref={selectInputRef}
//                         isMulti={true}
//                         ref={selectInputRef}
//                         id="assign_to_department_id[]"
//                         name="assign_to_department_id[]"
//                         onChange={handleAssignedDepartment}
//                         defaultValue={assignedDepartmentValue}
//                       />
//                     )}
//                   </div>
//                   {/* {assignUserDropdown && assignUserDropdown.length > 0 ? <> */}
//                   <div className="col-md-6">
//                     <label className="">
//                       <b>Assigned User :</b>
//                     </label>
//                     {/* {assignUserDropdown && */}
//                     <Select
//                       options={getAssignedUserData}
//                       isMulti={true}
//                       id="assign_to_user_id[]"
//                       name="assign_to_user_id[]"
//                       ref={selectAssignUserRef}
//                       onChange={handleChangeAssignedUser}
//                       defaultValue={assignedUser}
//                     />
//                     {/* } */}
//                   </div>

//                   {/* </> : null} */}
//                 </div>
//                 {/* ********************************* **************** */}

//                 {/* *****************Entry Department,Entry User **************** */}
//                 <div className="row mt-3">
//                   <div className="col-md-6">
//                     <label className="">
//                       <b>Entry Department :</b>
//                     </label>
//                     {departsmentData && (
//                       <Select
//                         options={departsmentData}
//                         isMulti={true}
//                         id="department_id[]"
//                         name="department_id[]"
//                         onChange={handleDepartment}
//                         defaultValue={entryDepartment}
//                         ref={selectEntryDeptRef}
//                       />
//                     )}
//                   </div>

//                   {/* {userDropdown && userDropdown.length > 0 ? <> */}

//                   <div className="col-md-6">
//                     <label className="">
//                       <b>Entry User :</b>
//                     </label>
//                     {/* {userDropdown && */}
//                     <Select
//                       options={getAssignedUserData}
//                       isMulti={true}
//                       ref={selectUserRef}
//                       id="user_id[]"
//                       name="user_id[]"
//                       onChange={handleChangeEntryUser}
//                       defaultValue={entryUser}
//                     />
//                     {/* } */}
//                   </div>
//                   {/* </> : null} */}
//                 </div>
//                 {/********************************** ****************************/}

//                 {/* ***************************Status**************** */}
//                 <div className="col-md-12">
//                   <label className="">
//                     <b>Select Status :</b>
//                   </label>
//                   {statusData && (
//                     <Select
//                       options={statusData}
//                       isMulti={true}
//                       id="status_id[]"
//                       name="status_id[]"
//                       ref={selectStatusRef}
//                       onChange={handleChangeStatus}
//                       defaultValue={statusValue}
//                     />
//                   )}
//                 </div>
//                 {/* ********************************* **************** */}
//                 {/* *****************Ticket Id**************** */}
//                 <div className="row mt-3">
//                   <div className="col-md-12">
//                     <label className="">
//                       <b>Ticket Id :</b>
//                     </label>
//                     <input
//                       type="text"
//                       ref={selectTicketRef}
//                       className="form-control form-control-sm"
//                       id="ticket_id"
//                       name="ticket_id"
//                       defaultValue={ticket}
//                       onChange={handleTicket}
//                       maxLength={30}
//                       onKeyPress={(e) => {
//                         Validation.CharactersNumbersSpeicalOnly(e);
//                       }}
//                     />
//                   </div>
//                 </div>
//                 {/* ***************************************************************/}
//               </div>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <div className="col-md-10">
//               <button
//                 className="btn btn-sm btn-warning text-white"
//                 type="submit"
//                 style={{ marginTop: "20px", fontWeight: "600" }}
//               >
//                 <i className="icofont-search-1 "></i> Search
//               </button>
//               <button
//                 className="btn btn-sm btn-info text-white"
//                 type="button"
//                 onClick={handleClearData}
//                 style={{ marginTop: "20px", fontWeight: "600" }}
//               >
//                 <i className="icofont-refresh text-white"></i> Reset
//               </button>
//             </div>
//           </Modal.Footer>
//         </form>
//       </Modal>

//       <div className="mt-2">
//         <div className="">
//           <div className="row  g-3">
//             <div className="col-sm-12">
//               <Tabs
//                 defaultActiveKey={
//                   !searchResult ? "Assigned_To_Me" : "Search_Result"
//                 }
//                 transition={false}
//                 id="noanim-tab-example1"
//                 activeKey={key}
//                 onSelect={(k, e) => {
//                   setKey(k);
//                   handleAssignedToMeTab(k, e);
//                 }}
//                 className=" tab-body-header rounded d-inline-flex"
//               >
//                 {searchResult && (
//                   <Tab
//                     eventKey="Search_Result"
//                     title="Search Result"
//                     activeKey={"Search_Result"}
//                   >
//                     <div className="card mb-3 mt-3">
//                       <div className="card-body">
//                         {searchResultExport && (
//                           <ExportToExcel
//                             className="btn btn-sm btn-danger mt-3"
//                             apiData={searchResultExport}
//                             fileName={`Export Filter Result ${formattedDate} ${formattedTimeString}`}
//                           />
//                         )}
//                         {searchResult && (
//                           <DataTable
//                             columns={searchResultColumns}
//                             data={searchResult}
//                             defaultSortField="title"
//                             pagination
//                             fixedHeader={true}
//                             fixedHeaderScrollHeight={"500px"}
//                             selectableRows={false}
//                             className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//                             highlightOnHover={true}
//                           />
//                         )}
//                       </div>
//                     </div>
//                   </Tab>
//                 )}

//                 <Tab eventKey="Assigned_To_Me" title="Assigned To me">
//                   <div className="card mb-3 mt-3">
//                     <div className="card-body">
//                       {assignedToMe && (
//                         <ExportAllTicketsToExcel
//                           className="btn btn-sm btn-danger mt-3"
//                           fileName="Assign To Me"
//                           typeOf="AssignToMe"
//                         />
//                       )}

//                       {assignToMeData && (
//                         <DataTable
//                           columns={assignedToMeColumns}
//                           data={assignToMeData}
//                           defaultSortField="title"
//                           fixedHeader={true}
//                           fixedHeaderScrollHeight={"700px"}
//                           selectableRows={false}
//                           className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//                           highlightOnHover={true}
//                         />
//                       )}

//                       <div className="back-to-top pull-right mt-2 mx-2">
//                         <label className="mx-2">rows per page</label>
//                         <select
//                           onChange={(e) => {
//                             handleAssignedToMeRowChanged(e, "LIMIT");
//                           }}
//                           className="mx-2"
//                         >
//                           <option value="10">10</option>
//                           <option value="20">20</option>
//                           <option value="30">30</option>
//                           <option value="40">40</option>
//                         </select>
//                         {assignedToMeData  && (
//                           <small>
//                             {assignedToMeData.from}-{assignedToMeData.to} of{" "}
//                             {assignedToMeData.total}
//                           </small>
//                         )}
//                         {console.log("assignedToMeData",assignedToMeData.total)}
//                         <button
//                           onClick={(e) => {
//                             handleAssignedToMeRowChanged(e, "MINUS");
//                           }}
//                           className="mx-2"
//                         >
//                           <i className="icofont-arrow-left"></i>
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             handleAssignedToMeRowChanged(e, "PLUS");
//                           }}
//                         >
//                           <i className="icofont-arrow-right"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </Tab>
//                 <Tab eventKey="CreatedByMe" title="Created By Me">
//                   <div className="card mb-3 mt-3">
//                     <div className="card-body">
//                       {assignToMeData && (
//                         <ExportAllTicketsToExcel
//                           className="btn btn-sm btn-danger mt-3"
//                           fileName="Created By Me"
//                           typeOf="CreatedByMe"
//                         />
//                       )}
//                       {assignToMeData && (
//                         <DataTable
//                           columns={createdByMeColumns}
//                           data={assignToMeData}
//                           defaultSortField="title"
//                           fixedHeader={true}
//                           fixedHeaderScrollHeight={"500px"}
//                           selectableRows={false}
//                           highlightOnHover={true}
//                         />
//                       )}
//                       <div className="back-to-top pull-right mt-2 mx-2">
//                         <label className="mx-2">rows per page</label>
//                         <select
//                           onChange={(e) => {
//                             handleCreatedByMeRowChanged(e, "LIMIT");
//                           }}
//                           className="mx-2"
//                         >
//                           <option value="10">10</option>
//                           <option value="20">20</option>
//                           <option value="30">30</option>
//                           <option value="40">40</option>
//                         </select>
//                         {assignedToMeData && (
//                           <small>
//                             {assignedToMeData.from}-{assignedToMeData.to} of{" "}
//                             {assignedToMeData.total}
//                           </small>
//                         )}
//                         <button
//                           onClick={(e) => {
//                             handleCreatedByMeRowChanged(e, "MINUS");
//                           }}
//                           className="mx-2"
//                         >
//                           <i className="icofont-arrow-left"></i>
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             handleCreatedByMeRowChanged(e, "PLUS");
//                           }}
//                         >
//                           <i className="icofont-arrow-right"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </Tab>

//                 <Tab
//                   eventKey="DepartmentWise"
//                   title="Departmentwise Tickets"
//                 >
//                   <div className="card mb-3 mt-3">
//                     <div className="card-body">
//                       {departmentwiseTicket && (
//                         <ExportAllTicketsToExcel
//                           className="btn btn-sm btn-danger mt-3"
//                           fileName="Departmentwise Ticket"
//                           typeOf="DepartmentWise"
//                         />
//                       )}
//                       {assignToMeData && (
//                         <DataTable
//                           columns={departmentwisetTicketColumns}
//                           data={assignToMeData }
//                           defaultSortField="title"
//                           fixedHeader={true}
//                           fixedHeaderScrollHeight={"500px"}
//                           selectableRows={false}
//                           className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//                           highlightOnHover={true}
//                         />
//                       )}
//                       <div className="back-to-top pull-right mt-2 mx-2">
//                         <label className="mx-2">rows per page</label>
//                         <select
//                           onChange={(e) => {
//                             handleDepartmentWiseRowChanged(e, "LIMIT");
//                           }}
//                           className="mx-2"
//                         >
//                           <option value="10">10</option>
//                           <option value="20">20</option>
//                           <option value="30">30</option>
//                           <option value="40">40</option>
//                         </select>
//                         {assignedToMeData && (
//                           <small>
//                             {assignedToMeData.from}-{assignedToMeData.to} of{" "}
//                             {assignedToMeData.total}
//                           </small>
//                         )}
//                         <button
//                           onClick={(e) => {
//                             handleDepartmentWiseRowChanged(e, "MINUS");
//                           }}
//                           className="mx-2"
//                         >
//                           <i className="icofont-arrow-left"></i>
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             handleDepartmentWiseRowChanged(e, "PLUS");
//                           }}
//                         >
//                           <i className="icofont-arrow-right"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </Tab>

//                 <Tab eventKey="YouTask" title="Your Task">
//                   <div className="card mb-3 mt-3">
//                     <div className="card-body">
//                       {yourTask && (
//                         <ExportAllTicketsToExcel
//                           className="btn btn-sm btn-danger mt-3"
//                           fileName="Your Task"
//                           typeOf="YouTask"
//                         />
//                       )}
//                       {assignToMeData && (
//                         <DataTable
//                           columns={yourTaskColumns}
//                           data={assignToMeData}
//                           defaultSortField="title"
//                           fixedHeader={true}
//                           fixedHeaderScrollHeight={"500px"}
//                           selectableRows={false}
//                           className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//                           highlightOnHover={true}
//                         />
//                       )}
//                       <div className="back-to-top pull-right mt-2 mx-2">
//                         <label className="mx-2">rows per page</label>
//                         <select
//                           onChange={(e) => {
//                             handleYourTaskRowChanged(e, "LIMIT");
//                           }}
//                           className="mx-2"
//                         >
//                           <option value="10">10</option>
//                           <option value="20">20</option>
//                           <option value="30">30</option>
//                           <option value="40">40</option>
//                         </select>
//                         {assignedToMeData && (
//                           <small>
//                             {assignedToMeData.from}-{assignedToMeData.to} of{" "}
//                             {assignedToMeData.total}
//                           </small>
//                         )}
//                         <button
//                           onClick={(e) => {
//                             handleYourTaskRowChanged(e, "MINUS");
//                           }}
//                           className="mx-2"
//                         >
//                           <i className="icofont-arrow-left"></i>
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             handleYourTaskRowChanged(e, "PLUS");
//                           }}
//                         >
//                           <i className="icofont-arrow-right"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </Tab>
//                 <Tab eventKey="UnPassed" title="Unpassed Ticket">
//                   <div className="card mb-3 mt-3">
//                     {/* <div className="card-body">
//                       {unpassedTickets && (
//                         <ExportAllTicketsToExcel
//                           className="btn btn-sm btn-danger mt-3"
//                           fileName="Unpassed Ticket"
//                           typeOf="UnPassed"
//                         />
//                       )}
// <button
//                   className="btn btn-success text-white"
//                   style={{ width: "100%", zIndex: 100 }}
//                   onClick={(e) => {
//                     handleRemarkModal({
//                       showModal: true,
//                       modalData: data,
//                       modalHeader: "Enter Remark",
//                       status: "PASS",
//                     });
//                   }}
//                 >
//                   <i className="icofont-checked"></i> Pass
//                 </button> */}

//                     <div className="card-body">
//                       <div className="row">
//                         {/* <div className="col-md-2 mb-3">
//                           {unpassedTickets && (
//                             <ExportAllTicketsToExcel
//                               className="btn btn-danger btn-block"
//                               fileName="Unpassed Ticket"
//                               typeOf="UnPassed"
//                             />
//                           )}


//                           <button
//                             className="btn btn-success btn-block text-white"

//                             onClick={(e) => {
//                               const selectedData = unpassedTickets.filter((row) => selectedRows.includes(row.id));
//                               handleBulkRemarkModal({
//                                 showModal: true,
//                                 modalData: selectedData,
//                                 modalHeader: "Enter Remark",
//                                 status: "PASS",
//                               });
//                             }}
//                           >
//                             <i className="icofont-checked"></i> Pass
//                           </button>

//                           <button
//                             className="btn btn-success btn-block text-white"

//                             onClick={(e) => {
//                               const selectedData = unpassedTickets.filter((row) => selectedRows.includes(row.id));
//                               handleBulkRemarkModal({
//                                 showModal: true,
//                                 modalData: selectedData,
//                                 modalHeader: "Enter Remark",
//                                 status: "REJECT",
//                               });
//                             }}>
//                             <i className="icofont-close-squared-alt"></i> Reject
//                           </button>

//                         </div> */}
//                         <div className="row">
//                           <div className="col-md-6 mb-1">
//                             {unpassedTickets && (
//                               <ExportAllTicketsToExcel
//                                 className="btn btn-danger btn-block"
//                                 fileName="Unpassed Ticket"
//                                 typeOf="UnPassed"
//                               />
//                             )}

//                             {unpassedTickets && (
//                               <>
//                                 <button
//                                   className="btn btn-success btn-block text-white"
//                                   onClick={(e) => {
//                                     const selectedData = unpassedTickets.filter(
//                                       (row) => selectedRowss?.includes(row.id)
//                                     );
//                                     handleRemarkModal({
//                                       showModal: true,
//                                       modalData: selectedData,
//                                       modalHeader: "Enter Remark",
//                                       status: "PASS",
//                                     });
//                                   }}
//                                 >
//                                   <i className="icofont-checked"></i> Pass
//                                 </button>

//                                 <button
//                                   className="btn btn-danger btn-block text-white"
//                                   onClick={(e) => {
//                                     const selectedData = unpassedTickets.filter(
//                                       (row) => selectedRowss?.includes(row.id)
//                                     );
//                                     handleRemarkModal({
//                                       showModal: true,
//                                       modalData: selectedData,
//                                       modalHeader: "Enter Remark",
//                                       status: "REJECT",
//                                     });
//                                   }}
//                                 >
//                                   <i className="icofont-close-squared-alt"></i>{" "}
//                                   Reject
//                                 </button>
//                                 {/* {selectAllNames === true ?
//                                   <button
//                                     className="btn btn-success btn-block text-white"
//                                     onClick={(e) => {
//                                       const selectedData = unpassedTickets.filter((row) => selectedRowss.includes(row.id));
//                                       handleRemarkModal({
//                                         showModal: true,
//                                         modalData: selectedData,
//                                         modalHeader: "Enter Remark",
//                                         status: "PASS",
//                                       });
//                                     }}
//                                   >
//                                     <i className="icofont-checked"></i> Pass
//                                   </button> :



//                                   <button
//                                     className="btn btn-success btn-block text-white"
//                                     onClick={(e) => {
//                                       const selectedData = unpassedTickets.filter((row) => selectedRows.includes(row.id));
//                                       handleRemarkModal({
//                                         showModal: true,
//                                         modalData: selectedData,
//                                         modalHeader: "Enter Remark",
//                                         status: "PASS",
//                                       });
//                                     }}
//                                   >
//                                     <i className="icofont-checked"></i> Pass
//                                   </button>
//                                 } */}

//                                 {/* {selectAllNames === true ?
//                                   <button
//                                     className="btn btn-danger btn-block text-white"
//                                     onClick={(e) => {
//                                       const selectedData = unpassedTickets.filter((row) => selectedRowss.includes(row.id));
//                                       handleRemarkModal({
//                                         showModal: true,
//                                         modalData: selectedData,
//                                         modalHeader: "Enter Remark",
//                                         status: "REJECT",
//                                       });
//                                     }}
//                                   >
//                                     <i className="icofont-close-squared-alt"></i> Reject
//                                   </button>

//                                   :
//                                   <button
//                                     className="btn btn-danger btn-block text-white"
//                                     onClick={(e) => {
//                                       const selectedData = unpassedTickets.filter((row) => selectedRows.includes(row.id));
//                                       handleRemarkModal({
//                                         showModal: true,
//                                         modalData: selectedData,
//                                         modalHeader: "Enter Remark",
//                                         status: "REJECT",
//                                       });
//                                     }}
//                                   >
//                                     <i className="icofont-close-squared-alt"></i> Reject
//                                   </button>
//                                 } */}
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       </div>



//                       {assignToMeData && (
//                         <DataTable
//                           columns={unpassedColumns}
//                           data={assignToMeData}
//                           defaultSortField="title"
//                           fixedHeader={true}
//                           fixedHeaderScrollHeight={"500px"}
//                           selectableRows={false}
//                           className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//                           highlightOnHover={true}
//                         />
//                       )}
//                       <div className="back-to-top pull-right mt-2 mx-2">
//                         <label className="mx-2">rows per page</label>
//                         <select
//                           onChange={(e) => {
//                             handleUnpassedRowChanged(e, "LIMIT");
//                           }}
//                           className="mx-2"
//                         >
//                           <option value="10">10</option>
//                           <option value="20">20</option>
//                           <option value="30">30</option>
//                           <option value="40">40</option>
//                         </select>
//                         {assignedToMeData && (
//                           <small>
//                             {assignedToMeData.from}-{assignedToMeData.to} of{" "}
//                             {assignedToMeData.total}
//                           </small>
//                         )}

//                         <button
//                           onClick={(e) => {
//                             handleUnpassedRowChanged(e, "MINUS");
//                           }}
//                           className="mx-2"
//                         >
//                           <i className="icofont-arrow-left"></i>
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             handleUnpassedRowChanged(e, "PLUS");
//                           }}
//                         >
//                           <i className="icofont-arrow-right"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </Tab>
//               </Tabs>
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

//       {confirmationModal && (
//         <Modal
//           centered
//           show={confirmationModal && confirmationModal.showModals}
//         >
//           <Modal.Header>
//             <Modal.Title className="fw-bold">Solve Ticket - </Modal.Title>
//           </Modal.Header>

//           {confirmationModal &&
//             confirmationModal &&
//             confirmationModal.modalsData && (
//               <form onSubmit={handleSolveTicketModal} method="POST">
//                 <Modal.Body>
//                   <input
//                     type="hidden"
//                     name="id"
//                     id="id"
//                     defaultValue={confirmationModal.modalsData.id}
//                   />
//                   <h5
//                     className="text-nowrap bd-highlight"
//                     style={{ fontFamily: "sans-serif", fontWeight: "bold" }}
//                   >
//                     Are You Really Want To Solve This Ticket ?
//                   </h5>
//                   <label className="form-label font-weight-bold mt-3">
//                     Remark :*
//                   </label>
//                   <textarea
//                     type="text"
//                     name="remark"
//                     id="remark"
//                     rows="4"
//                     className="form-control form-control-sm"
//                     required
//                     onKeyPress={(e) => {
//                       Validation.CharactersNumbersSpeicalOnly(e);
//                     }}
//                   />
//                 </Modal.Body>
//                 <Modal.Footer>
//                   <button
//                     type="button"
//                     className="btn btn-danger text-white"
//                     onClick={(e) =>
//                       handleConfirmationModal({
//                         e,
//                         showModal: false,
//                         modalData: "",
//                         modalHeader: "",
//                       })
//                     }
//                   >
//                     NO
//                   </button>
//                   <button type="submit" className="btn btn-info text-white">
//                     YES
//                   </button>
//                 </Modal.Footer>
//               </form>
//             )}
//         </Modal>
//       )}

//       <Modal
//         centered
//         show={modal.showModal}
//         style={{
//           height: "60%",
//         }}
//         scrollable={true}
//         onHide={(e) => {
//           handleModal({
//             showModal: false,
//             modalData: "",
//             modalHeader: "",
//           });
//         }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title className="fw-bold">
//             Description-{modal.modalData.ticket_id}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{modal.modalData.description}</Modal.Body>
//         <Modal.Footer>
//           <button
//             type="button"
//             className="btn btn-danger text-white"
//             onClick={() => {
//               handleModal({ showModal: false, modalData: "", modalHeader: "" });
//             }}
//           >
//             Close
//           </button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         centered
//         show={remarkModal.showModal}
//         onHide={(e) => {
//           handleRemarkModal({
//             showModal: false,
//             modalData: "",
//             modalHeader: "",
//             status: remarkModal.status,
//           });
//         }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title className="fw-bold">
//             {remarkModal.status == "PASS" ? "PASS TICKET " : "REJECT TICKET"}
//           </Modal.Title>
//         </Modal.Header>
//         <form onSubmit={handlePassTicketForm} method="post">
//           <Modal.Body>
//             <div className="deadline-form">
//               <input
//                 type="hidden"
//                 className="form-control form-control-sm"
//                 id="pass_status"
//                 name="pass_status"
//                 value={remarkModal.status}
//               />
//               {selectedRows &&
//                 selectedRows.length == 0 &&
//                 selectedRowss &&
//                 selectedRowss.length == 0 && (
//                   <input
//                     type="hidden"
//                     className="form-control form-control-sm"
//                     id="id[]"
//                     name="id[]"
//                     defaultValue={remarkModal.modalData.id}
//                   />
//                 )}
//               <div className="row g-3 mb-3">
//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Ticket Id :
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     // defaultValue={remarkModal.modalData.ticket_id}
//                     defaultValue={
//                       remarkModal && Array.isArray(remarkModal.modalData)
//                         ? remarkModal.modalData.map((i) => i.ticket_id)
//                         : remarkModal.modalData.ticket_id
//                     }
//                     readOnly={true}
//                   />
//                 </div>
//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Remark :*
//                   </label>
//                   <input
//                     type="text"
//                     name="remark"
//                     id="remark"
//                     className="form-control form-control-sm"
//                     required
//                     maxLength={1000}
//                     onKeyPress={(e) => {
//                       Validation.CharactersNumbersSpeicalOnly(e);
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <button type="submit" className="btn btn-info text-white">
//               Submit
//             </button>
//             <button
//               type="button"
//               className="btn btn-danger text-white"
//               onClick={() => {
//                 handleRemarkModal({
//                   showModal: false,
//                   modalData: "",
//                   modalHeader: "",
//                 });
//               }}
//             >
//               Cancel
//             </button>
//           </Modal.Footer>
//         </form>
//       </Modal>

//       {/* bulk ticket pass modal */}

//       {/* <Modal
//         centered
//         show={bulkRemarkModal.showModal}
//         onHide={(e) => {
//           handle({
//             showModal: false,
//             modalData: "",
//             modalHeader: "",
//             status: bulkRemarkModal.status,
//           });
//         }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title className="fw-bold">
//             {bulkRemarkModal.status == "PASS" ? "PASS TICKET " : "REJECT TICKET"}
//           </Modal.Title>
//         </Modal.Header>
//         <form onSubmit={handleBulkPassTicketForm} method="post">
//           <Modal.Body>
//             <div className="deadline-form">
//               <input
//                 type="hidden"
//                 className="form-control form-control-sm"
//                 id="pass_status"
//                 name="pass_status"
//                 value={bulkRemarkModal.status}
//               />

//               <div className="row g-3 mb-3">
//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Ticket Id :
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"

//                     defaultValue={
//                       bulkRemarkModal && Array.isArray(bulkRemarkModal.modalData)
//                         ? bulkRemarkModal.modalData.map((i) => i.ticket_id)
//                         : []
//                     }

//                     readOnly={true}
//                   />
//                 </div>
//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Remark :*
//                   </label>
//                   <input
//                     type="text"
//                     name="remark"
//                     id="remark"
//                     className="form-control form-control-sm"
//                     required
//                     onKeyPress={(e) => {
//                       Validation.CharactersNumbersSpeicalOnly(e);
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <button type="submit" className="btn btn-info text-white">
//               Submit
//             </button>
//             <button
//               type="button"
//               className="btn btn-danger text-white"
//               onClick={() => {
//                 handleBulkRemarkModal({
//                   showModal: false,
//                   modalData: "",
//                   modalHeader: "",
//                 });
//               }}
//             >
//               Cancel
//             </button>
//           </Modal.Footer>
//         </form>
//       </Modal> */}

//       {/* {isLoading === true &&  <LoaderComponent/> } */}
//     </div>
//   );
// }





import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Dropdown, Button, ButtonGroup } from "react-bootstrap";
import { _base } from "../../settings/constants";
import Alert from "../../components/Common/Alert";
import ErrorLogService from "../../services/ErrorLogService";
import MyTicketService from "../../services/TicketService/MyTicketService";
import UserService from "../../services/MastersService/UserService";
import DepartmentService from "../../services/MastersService/DepartmentService";
import StatusService from "../../services/MastersService/StatusService";
import ReportService from "../../services/ReportService/ReportService";
import PageHeader from "../../components/Common/PageHeader";
import Select from "react-select";
import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
import DepartmentMappingService from "../../services/MastersService/DepartmentMappingService";
import * as Validation from "../../components/Utilities/Validation";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "./custome.css";
import { Spinner } from "react-bootstrap";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import { ExportAllTicketsToExcel } from "../../components/Utilities/Table/ExportAllTicketsToExcel";
import { useSelector, useDispatch } from "react-redux";
import TicketSlices, { hideNotification } from "./Slices/TicketSlices";

export default function MyTicketComponent() {
  const location = useLocation();
  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [userDropdown, setUserDropdown] = useState(null);
  const [checkRole, setCheckRole] = useState(null);
  const roleId = sessionStorage.getItem("role_id");

  // const [type, setType] = useState(null);

  const [userName, setUserName] = useState("");
  const [user, setUser] = useState("");

  const [statusData, setStatusData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);

  const [searchResult, setSearchResult] = useState();
  const [searchResultExport, setSearchResultExport] = useState();

  const [unpassedTickets, setUnpassedTickets] = useState(null);
  const [unpassedTicketsExport, setUnpassedTicketsExport] = useState(null);

  const [assignedToMe, setAssignedToMe] = useState(null);
  const [assignedToMeExport, setAssignedToMeExport] = useState(null);

  const [yourTask, setYourTask] = useState(null);
  const [yourTaskExport, setYourTaskExport] = useState(null);

  const [createdByMe, setCreatedByMe] = useState(null);
  const [createdByMeExport, setCreatedByMeExport] = useState(null);

  const [departmentwiseTicket, setDepartmentwiseTicket] = useState(null);
  const [departmentwiseTicketExport, setDepartmentwiseTicketExport] =
    useState(null);
  const [ticketShowType, setTicketShowType] = useState(null);

  // const [filterExport, setFilterExport]=useState(null)

  const [userDepartment, setUserDepartment] = useState();

  const [exportData, setExportData] = useState(null);
  const dispatch = useDispatch()
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const [remarkModal, setRemarkModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [bulkRemarkModal, setBulkRemarkModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [confirmationModal, setConfirmationModal] = useState({
    showModals: false,
    modalsData: "",
    modalsHeader: "",
  });


  const Notify = useSelector(TicketSlices => TicketSlices.ticket.notify)



  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [assignUserDropdown, setAssignUserDropdown] = useState(null);
  const [toDateRequired, setToDateRequired] = useState(false);
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [assignedToMeData, setAssignedToMeData] = useState();
  const [selectAllNames, setSelectAllNames] = useState(false);
  const [createdByMeData, setCreatedByMeData] = useState();
  const [departmentWiseData, setDepartmentWiseData] = useState();
  const [yourTaskData, setYourTaskData] = useState();
  const [unpassedData, setUnpassedData] = useState();

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowss, setSelectedRowss] = useState([]);
  const [statusValue, setStatusValue] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [entryUser, setEntryUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ticket, setTicket] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [assignedDepartmentValue, setAssignedDepartment] = useState("");
  const [entryDepartment, setEntryDepartment] = useState();
  const [key, setKey] = useState("Assigned_To_Me");
  const selectInputRef = useRef();
  const selectAssignUserRef = useRef();
  const selectEntryDeptRef = useRef();
  const selectUserRef = useRef();
  const selectStatusRef = useRef();
  const selectFromDateRef = useRef();
  const selectToDateRef = useRef();
  const selectTicketRef = useRef();
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
  const timeString = `${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}${currentDate.getSeconds().toString().padStart(2, "0")}`;
  const formattedTimeString = `${timeString.slice(0, 2)}:${timeString.slice(
    2,
    4
  )}:${timeString.slice(4, 6)}`;
  const handleDepartment = (e) => {
    const deptUser = [];
    for (var i = 0; i < e.length; i++) {
      const select = user
        .filter((d) => d.department_id == e[i].value)
        .map((d) => ({ value: d.id, label: d.first_name + " " + d.last_name }));
      for (var j = 0; j < select.length; j++) {
        deptUser.push(select[j]);
      }
    }
    setUserDropdown(deptUser);
    setUserName(null);

    setEntryDepartment(e);
  };

  const handleSelectAllNamesChange = () => {
    // Toggle the state of 'selectAllNames'
    setSelectAllNames(!selectAllNames);

    // If 'selectAllNames' is true, select all rows; otherwise, clear the selection
    setSelectedRowss(
      selectAllNames
        ? []
        : unpassedTickets && unpassedTickets.map((row) => row.id)
    );
  };

  const handleConfirmationModal = (e, data) => {
    var d = {};
    setConfirmationModal(null);
    if (data) {
      d = { showModals: true, modalsData: data, modalsHeader: "Solve Ticket" };
    } else {
      d = { showModals: false, modalsData: "", modalsHeader: "Solve Ticket" };
    }
    setConfirmationModal(d);
  };

  const handleSolveTicketModal = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setNotify(null);

    var id = form.get("id");

    await new MyTicketService()
      .verifyTicketConfirmationOtp(id, form)
      .then((res) => {
        // setShowLoaderModal(null);
        // setShowLoaderModal(false);
        if (res.status === 200) {
          if (res.data.status == 1) {
            setNotify({ type: "success", message: res.data.message });
            setConfirmationModal({
              showModal: false,
              modalData: "",
              modalHeader: "",
            });
            loadData();
          } else {
            // setShowLoaderModal(false);
            setNotify({ type: "danger", message: res.data.message });
          }
        }
      });
  };
  const menuStyle = {
    position: "absolute",
    bottom: "100%",
    left: 0,
    transform: "translateY(-5px)",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    borderRadius: "4px",
    padding: "10px",
  };

  const handleModal = (data) => {
    setModal(data);
  };

  const handleRemarkModal = (data) => {
    setRemarkModal(data);
  };

  // const handleBulkRemarkModal = (data) => {
  //   setBulkRemarkModal(data);
  // };

  const actionComponent = (data, type) => {
    if (type === "SEARCH_RESULT") {
      if (searchResult && searchResult.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${"dropdown-basic_" + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              {data.created_by == localStorage.getItem("id") ||
                data.assign_to_user_id == localStorage.getItem("id") ||
                (data.status_name != "Solved" && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Edit/` + data.id}
                      className="btn btn-sm btn-warning text-white"
                      style={{ width: "100%", zIndex: "100" }}
                    >
                      <i className="icofont-ui-edit"></i> Edit
                    </Link>
                  </li>
                ))}

              <li>
                {" "}
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{" "}
              </li>

              {data.created_by != localStorage.getItem("id") &&
                data.basket_configured === 0 &&
                localStorage.getItem("account_for") === "SELF" &&
                data.status_name != "Solved" && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Basket/` + data.id}
                      className="btn btn-sm btn-primary text-white"
                      style={{ width: "100%", zIndex: 100 }}
                    >
                      <i className="icofont-bucket2"></i>Basket
                    </Link>
                  </li>
                )}

              {data.created_by != localStorage.getItem("id") &&
                data.basket_configured > 0 &&
                data.status_name != "Solved" && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Task/` + data.id}
                      className="btn btn-sm btn-outline-primary"
                      style={{ width: "100%", zIndex: 100 }}
                    >
                      <i className="icofont-tasks"></i> Task
                    </Link>
                  </li>
                )}

              <li>
                <Link
                  to={`/${_base}/TicketHistory/` + data.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-history"></i> History
                </Link>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        );
      } else {
        return (
          <div className="d-flex justify-content-between">
            {data.created_by == sessionStorage.getItem("id") ||
              (data.assign_to_user_id == sessionStorage.getItem("id") &&
                data.status_name != "Solved" && (
                  <Link
                    to={`/${_base}/Ticket/Edit/` + data.id}
                    className="btn btn-sm btn-warning text-white"
                    style={{ width: "90px" }}
                  >
                    <i className="icofont-ui-edit"></i> Edit
                  </Link>
                ))}

            <Link
              to={`/${_base}/Ticket/View/` + data.id}
              className="btn btn-sm btn-info text-white"
              style={{ width: "90px" }}
            >
              <i className="icofont-external-link "></i> View
            </Link>

            <Link
              to={`/${_base}/TicketHistory/` + data.id}
              className="btn btn-sm btn-primary text-white"
              style={{ width: "90px" }}
            >
              <i className="icofont-history"></i> History
            </Link>
          </div>
        );
      }
    }

    if (type === "YOUR_TASK") {
      if (yourTask && yourTask.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${"dropdown-basic_" + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              {data.created_by == localStorage.getItem("id") ||
                (data.assign_to_user_id == localStorage.getItem("id") && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Edit/` + data.id}
                      className="btn btn-sm btn-warning text-white"
                      style={{ width: "100%", zIndex: "100" }}
                    >
                      <i className="icofont-ui-edit"></i> Edit
                    </Link>
                  </li>
                ))}
              <li>
                {" "}
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{" "}
              </li>
              {/*
                                        {data.created_by != localStorage.getItem('id') && data.basket_configured === 0 &&
                                            <li><Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%", zIndex: 100 }}>
                                                <i className="icofont-bucket2"></i>Basket</Link></li>
                                        } */}

              {
                (data.created_by = localStorage.getItem("id") &&
                  localStorage.getItem("account_for") === "SELF" &&
                  data.basket_configured > 0 && (
                    <li>
                      <Link
                        to={`/${_base}/Ticket/Task/` + data.id}
                        className="btn btn-sm btn-outline-primary"
                        style={{ width: "100%", zIndex: 100 }}
                      >
                        <i className="icofont-tasks"></i> Task
                      </Link>
                    </li>
                  ))
              }
            </Dropdown.Menu>
          </Dropdown>
        );
      } else {
        return (
          <div className="d-flex justify-content-between">
            {data.created_by == localStorage.getItem("id") ||
              (data.assign_to_user_id == localStorage.getItem("id") && (
                <Link
                  to={`/${_base}/Ticket/Edit/` + data.id}
                  className="btn btn-sm btn-warning text-white"
                  style={{ width: "90px" }}
                >
                  <i className="icofont-ui-edit"></i> Edit
                </Link>
              ))}
            <Link
              to={`/${_base}/Ticket/View/` + data.id}
              className="btn btn-sm btn-info text-white"
              style={{ width: "90px" }}
            >
              <i className="icofont-external-link "></i> View
            </Link>
            {/*
                                        {data.created_by != localStorage.getItem('id') && data.basket_configured === 0 &&
                                            <li><Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%", zIndex: 100 }}>
                                                <i className="icofont-bucket2"></i>Basket</Link></li>
                                        } */}
            {localStorage.getItem("account_for") === "SELF" && (
              <Link
                to={`/${_base}/Ticket/Task/` + data.id}
                className="btn btn-sm btn-outline-primary"
                style={{ width: "90px" }}
              >
                <i className="icofont-tasks"></i> Task
              </Link>
            )}
          </div>
        );
      }
    }
    if (type === "ASSIGNED_TO_ME") {
      if (assignedToMe && assignedToMe.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1" align>
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${"dropdown-basic_" + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              {/* {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') && */}
              <li>
                <Link
                  to={`/${_base}/Ticket/Edit/` + data.id}
                  className="btn btn-sm btn-warning text-white"
                  style={{ width: "100%", zIndex: "100" }}
                >
                  <i className="icofont-ui-edit"></i> Edit
                </Link>
              </li>
              {/* } */}
              <li>
                {" "}
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{" "}
              </li>

              <li>
                <Link
                  to={`/${_base}/TicketHistory/` + data.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-history"></i> History
                </Link>
              </li>

              {((data.created_by != localStorage.getItem("id") &&
                data.basket_configured === 0) ||
                (data.assign_to_user_id == localStorage.getItem("id") &&
                  data.basket_configured === 0)) &&
                localStorage.getItem("account_for") === "SELF" && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Basket/` + data.id}
                      className="btn btn-sm btn-primary text-white"
                      style={{ width: "100%", zIndex: 100 }}
                    >
                      <i className="icofont-bucket2"></i>Basket
                    </Link>
                  </li>
                )}

              {((data.created_by != localStorage.getItem("id") &&
                data.basket_configured > 0) ||
                (data.assign_to_user_id == localStorage.getItem("id") &&
                  data.basket_configured > 0)) &&
                localStorage.getItem("account_for") === "SELF" && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Task/` + data.id}
                      className="btn btn-sm btn-outline-primary"
                      style={{ width: "100%", zIndex: 100 }}
                    >
                      <i className="icofont-tasks"></i> Task
                    </Link>
                  </li>
                )}
            </Dropdown.Menu>
          </Dropdown>
        );
      } else {
        return (
          <div className="d-flex justify-content-between ">
            <Link
              to={`/${_base}/TicketHistory/` + data.id}
              className="btn btn-sm btn-warning text-white"
              style={{ width: "90px" }}
            >
              <i className="icofont-history"></i> History
            </Link>

            {((data.created_by != localStorage.getItem("id") &&
              data.basket_configured === 0) ||
              (data.assign_to_user_id == localStorage.getItem("id") &&
                data.basket_configured === 0)) &&
              localStorage.getItem("account_for") === "SELF" && (
                <Link
                  to={`/${_base}/Ticket/Basket/` + data.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{ width: "90px" }}
                >
                  <i className="icofont-bucket2"></i>Basket
                </Link>
              )}

            <Link
              to={`/${_base}/Ticket/Edit/` + data.id}
              className="btn btn-sm btn-warning text-white"
              style={{ width: "90px" }}
            >
              <i className="icofont-ui-edit"></i> Edit
            </Link>

            <Link
              to={`/${_base}/Ticket/View/` + data.id}
              className="btn btn-sm btn-info text-white"
              style={{ width: "90px" }}
            >
              <i className="icofont-external-link "></i> View
            </Link>
            {localStorage.getItem("account_for") === "SELF" && (
              <Link
                to={`/${_base}/Ticket/Task/` + data.id}
                className="btn btn-sm btn-outline-primary"
                style={{ width: "90px" }}
              >
                <i className="icofont-tasks"></i> Task
              </Link>
            )}
          </div>
        );
      }
    }
    if (type === "ADDED_BY_ME") {
      if (createdByMe && createdByMe.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              drop="side"
              as="button"
              variant=""
              id={`${"dropdown-basic_" + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu as="ul" className="border-0 shadow p-1 ">
              {/* {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') &&
                                                <li><Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white"
                                                    style={{ width: "100%", zIndex: '100' }}>
                                                    <i className="icofont-ui-edit"></i>  Edit</Link></li>
                                            } */}
              <li>
                {" "}
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{" "}
              </li>

              {/* {data.created_by != localStorage.getItem('id') && data.basket_configured === 0 &&
                                                <li><Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%", zIndex: 100 }}>
                                                    <i className="icofont-bucket2"></i>Basket</Link></li>
                                            } */}

              {data.created_by != localStorage.getItem("id") &&
                data.basket_configured > 0 &&
                localStorage.getItem("account_for") === "SELF" && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Task/` + data.id}
                      className="btn btn-sm btn-outline-primary"
                      style={{ width: "100%", zIndex: 100 }}
                    >
                      <i className="icofont-tasks"></i> Task
                    </Link>
                  </li>
                )}
              <li>
                <Link
                  to={`/${_base}/TicketHistory/` + data.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-history"></i> History
                </Link>
              </li>
              <li>
                <button
                  className=" btn btn-sm  btn-secondary text-white"
                  style={{ width: "100%", zIndex: 100 }}
                  onClick={(e) => handleConfirmationModal(e, data)}
                >
                  Confirm
                </button>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        );
      } else {
        return (
          <>
            <div className="d-flex justify-content-between">
              <Link
                to={`/${_base}/TicketHistory/` + data.id}
                className="btn btn-sm btn-warning text-white"
              >
                <i className="icofont-ui-history"></i> History
              </Link>
              {/* <Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white">
                                            <i className="icofont-ui-edit"></i>  Edit</Link> */}

              <Link
                to={`/${_base}/Ticket/View/` + data.id}
                className="btn btn btn-info text-white"
              >
                <i className="icofont-external-link "></i> View
              </Link>

              {/* <Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn btn-primary text-white" >
                                                    <i className="icofont-bucket2"></i>Basket
                                                </Link> */}

              <button
                className="btn btn-secondary"
                onClick={(e) => handleConfirmationModal(e, data)}
              >
                Confirm
              </button>
            </div>
          </>
        );
      }
    }

    if (type === "UNPASSED_TICKET") {
      if (unpassedTickets && unpassedTickets.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${"dropdown-basic_" + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              {data.created_by == localStorage.getItem("id") ||
                (data.assign_to_user_id == localStorage.getItem("id") && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Edit/` + data.id}
                      className="btn btn-sm btn-warning text-white"
                      style={{ width: "100%", zIndex: 100 }}
                    >
                      <i className="icofont-ui-edit"></i> Edit
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{" "}
              </li>

              <li>
                <button
                  className="btn btn-success text-white"
                  style={{ width: "100%", zIndex: 100 }}
                  onClick={(e) => {
                    handleRemarkModal({
                      showModal: true,
                      modalData: data,
                      modalHeader: "Enter Remark",
                      status: "PASS",
                    });
                  }}
                >
                  <i className="icofont-checked"></i> Pass
                </button>
              </li>
              <li>
                <button
                  className="btn btn-danger  text-white"
                  style={{ width: "100%", zIndex: 100 }}
                  onClick={(e) => {
                    handleRemarkModal({
                      showModal: true,
                      modalData: data,
                      modalHeader: "Enter Remark",
                      status: "REJECT",
                    });
                  }}
                >
                  <i className="icofont-close-squared-alt"></i> Reject
                </button>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        );
      } else {
        return (
          <div className="d-flex justify-content-between">
            <Link
              to={`/${_base}/Ticket/View/` + data.id}
              className="btn btn-sm btn-info text-white"
            >
              <i className="icofont-external-link "></i> View
            </Link>
            <button
              className="btn btn-success text-white btn-sm"
              onClick={(e) => {
                handleRemarkModal({
                  showModal: true,
                  modalData: data,
                  modalHeader: "Enter Remark",
                  status: "PASS",
                });
              }}
            >
              <i className="icofont-checked"></i> Pass
            </button>
            <button
              className="btn btn-danger btn-sm text-white"
              onClick={(e) => {
                handleRemarkModal({
                  showModal: true,
                  modalData: data,
                  modalHeader: "Enter Remark",
                  status: "REJECT",
                });
              }}
            >
              <i className="icofont-close-squared-alt"></i> Reject
            </button>
          </div>
        );
      }
    }

    if (type === "DEPARTMENTWISE_TICKET") {
      if (departmentwiseTicket && departmentwiseTicket.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${"dropdown-basic_" + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              {/* {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') && */}
              <li>
                <Link
                  to={`/${_base}/Ticket/Edit/` + data.id}
                  className="btn btn-sm btn-warning text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-ui-edit"></i> Edit
                </Link>
              </li>
              {/* } */}
              <li>
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: "100%", zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{" "}
              </li>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  };

  const searchResultColumns = [
    {
      name: "Action",
      button: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${searchResult ? (searchResult.length > 0 ? "4rem" : "20.625rem") : "auto"
        }`,
      cell: (row) => actionComponent(row, "SEARCH_RESULT"),
    },

    { name: "Sr", width: "4rem", cell: (row, index) => index + 1 },
    {
      name: "Ticket Id",
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Description",
      width: "18.75rem",
      selector: (row) => { },
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <a
            href="#"
            onClick={(e) => {
              handleModal({ showModal: true, modalData: row, modalHeader: "" });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {" "}
                    {row.description && row.description.length < 123
                      ? row.description
                      : row.description.substring(0, 123) + "...."}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </a>
        </div>
      ),
    },
    {
      name: "Ticket Date",
      selector: (row) => row.ticket_date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Expected Solve Date",
      maxWidth: "auto",
      selector: (row) => row.expected_solve_date,
      sortable: true,
    },
    {
      name: "Priority",
      cell: (row) => (
        <div>
          {row.priority === "Very High" && (
            <span style={{ width: "60px" }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === "High" && (
            <span style={{ width: "60px" }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === "Medium" && (
            <span style={{ width: "60px" }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === "Low" && (
            <span style={{ width: "60px" }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    { name: "Type", cell: (row) => row.query_type_name, sortable: true },
    { name: "Passed Status", cell: (row) => row.passed_status, sortable: true },
    { name: "Status", cell: (row) => row.status_name, sortable: true },
    {
      name: "Assign To Dept",
      cell: (row) => row.assign_to_department,
      sortable: true,
    },
    { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
    { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
    {
      name: "Solved Date",
      maxWidth: "auto",
      selector: (row) => row.ticket_solved_date,
      sortable: true,
    },
    {
      name: "Solved By",
      maxWidth: "auto",
      selector: (row) => row.ticket_solved_by,
      sortable: true,
    },
  ];
  const yourTaskColumns = [
    {
      name: "Action",
      button: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${yourTask ? (yourTask.length > 0 ? "4rem" : "20.625rem") : "auto"
        }`,
      cell: (row) => actionComponent(row, "YOUR_TASK"),
    },
    {
      name: "Sr",
      width: "4rem",
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Ticket Id",
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Description",
      width: "18.75rem",
      selector: (row) => { },
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <a
            href="#"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: "Description",
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {" "}
                    {row.description && row.description.length < 123
                      ? row.description
                      : row.description.substring(0, 123) + "...."}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </a>
        </div>
      ),
    },
    {
      name: "Ticket Date",
      selector: (row) => row.ticket_date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Expected Solve Date",
      selector: (row) => row.expected_solve_date,
      sortable: true,
    },
    {
      name: "Priority",
      cell: (row) => (
        <div>
          {row.priority === "Very High" && (
            <span style={{ width: "60px" }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === "High" && (
            <span style={{ width: "60px" }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === "Medium" && (
            <span style={{ width: "60px" }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === "Low" && (
            <span style={{ width: "60px" }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    { name: "Type", cell: (row) => row.query_type_name, sortable: true },
    { name: "Status", cell: (row) => row.status_name, sortable: true },
    {
      name: "Assign To Dept",
      cell: (row) => row.assign_to_department,
      sortable: true,
    },
    { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
    { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
    // {
    //   name: "Solved Date",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_date,
    //   sortable: true,
    // },
    // {
    //   name: "Solved By",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_by,
    //   sortable: true,
    // },
  ];

  const assignedToMeColumns = [
    {
      name: "Action",
      button: true,

      width: `${assignedToMe ? (assignedToMe.length > 0 ? "4rem" : "30rem") : "auto"
        }`,
      cell: (row) => actionComponent(row, "ASSIGNED_TO_ME"),
    },
    { name: "Sr", width: "4rem", cell: (row, index) => index + 1 },
    {
      name: "Ticket Id",
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Description",
      width: "18.75rem",
      selector: (row) => { },
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <a
            href="#"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: "Edit Country",
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {" "}
                    {row.description && row.description.length < 123
                      ? row.description
                      : row.description.substring(0, 123) + "...."}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </a>
        </div>
      ),
    },
    {
      name: "Ticket Date",
      selector: (row) => row.ticket_date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Expected Solve Date",
      selector: (row) => row.expected_solve_date,
      sortable: true,
    },
    {
      name: "Priority",
      cell: (row) => (
        <div>
          {row.priority === "Very High" && (
            <span style={{ width: "60px" }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === "High" && (
            <span style={{ width: "60px" }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === "Medium" && (
            <span style={{ width: "60px" }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === "Low" && (
            <span style={{ width: "60px" }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    { name: "Type", cell: (row) => row.query_type_name, sortable: true },
    { name: "Status", cell: (row) => row.status_name, sortable: true },
    {
      name: "Assign To Dept",
      cell: (row) => row.assign_to_department,
      sortable: true,
    },
    { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
    { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
    // {
    //   name: "Solved Date",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_date,
    //   sortable: true,
    // },
    // {
    //   name: "Solved By",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_by,
    //   sortable: true,
    // },
  ];

  const createdByMeColumns = [
    {
      name: "Action",
      button: true,
      ignoreRowClick: true,
      width: `${createdByMe ? (createdByMe.length > 0 ? "4rem" : "20.625rem") : "auto"
        }`,
      cell: (row) => actionComponent(row, "ADDED_BY_ME"),
    },

    {
      name: "Sr",
      width: "4rem",
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Ticket Id",
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Description",
      width: "18.75rem",
      selector: (row) => { },
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <a
            href="#"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: "Edit Country",
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {" "}
                    {row.description && row.description.length < 123
                      ? row.description
                      : row.description.substring(0, 123) + "...."}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </a>
        </div>
      ),
    },
    {
      name: "Ticket Date",
      selector: (row) => row.ticket_date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Expected Solve Date",
      selector: (row) => row.expected_solve_date,
      sortable: true,
    },
    {
      name: "Priority",
      cell: (row) => (
        <div>
          {row.priority === "Very High" && (
            <span className="badge bg-danger" style={{ width: "60px" }}>
              {row.priority}
            </span>
          )}
          {row.priority === "High" && (
            <span style={{ width: "60px" }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === "Medium" && (
            <span className="badge bg-info" style={{ width: "60px" }}>
              {row.priority}
            </span>
          )}
          {row.priority === "Low" && (
            <span style={{ width: "60px" }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    { name: "Type", cell: (row) => row.query_type_name, sortable: true },
    { name: "Passed Status", cell: (row) => row.passed_status, sortable: true },
    { name: "Status", cell: (row) => row.status_name, sortable: true },
    {
      name: "Assign To Dept",
      cell: (row) => row.assign_to_department,
      sortable: true,
    },
    { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
    { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
    // {
    //   name: "Solved Date",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_date,
    //   sortable: true,
    // },
    // {
    //   name: "Solved By",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_by,
    //   sortable: true,
    // },
  ];

  const handleCheckboxChangee = (row) => {
    setSelectedRowss((prevSelectedRows) => {
      if (prevSelectedRows.includes(row.id)) {
        return prevSelectedRows.filter((selectedRow) => selectedRow !== row.id);
      } else {
        return [...prevSelectedRows, row.id];
      }
    });
  };

  const unpassedColumns = [
    {
      name: "Action",
      button: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${unpassedTickets
        ? unpassedTickets.length > 0
          ? "4rem"
          : "20.625rem"
        : "auto"
        }`,
      cell: (row) => actionComponent(row, "UNPASSED_TICKET"),
    },
    // {
    //   name: "Checkbox",
    //   selector: "checkbox", // unique key for the column
    //   width: "4rem",
    //   center: true,
    //   cell: (row) => <input type="checkbox" checked={row.isSelected} onChange={() => handleCheckboxChange(row)} />,
    // },

    {
      name: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={handleSelectAllNamesChange}
        >
          <input
            type="checkbox"
            checked={selectAllNames}
            onChange={() => setSelectAllNames(!selectAllNames)}
            style={{ marginRight: "5px" }}
          />
          Select All
        </div>
      ),
      selector: "selectAll",
      width: "7rem",
      center: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={selectedRowss.includes(row.id)}
            onChange={() => handleCheckboxChangee(row)}
            style={{ marginRight: "5px" }}
          />
        </div>
      ),
    },
    // {
    //   name: "Checkbox",
    //   selector: "checkbox", // unique key for the column
    //   width: "4rem",
    //   center: true,
    //   cell: (row) => (
    //     <input
    //       type="checkbox"
    //       checked={selectedRows.includes(row.id)}
    //       onChange={() => handleCheckboxChange(row)}
    //     />
    //   ),
    // },

    {
      name: "Sr",
      width: "4rem",
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Ticket Id",
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Description",
      width: "18.75rem",
      selector: (row) => { },
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <a
            href="#"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: "Edit Country",
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {" "}
                    {row.description && row.description.length < 123
                      ? row.description
                      : row.description.substring(0, 123) + "...."}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </a>
        </div>
      ),
    },
    {
      name: "Ticket Date",
      selector: (row) => row.ticket_date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Expected Solve Date",
      selector: (row) => row.expected_solve_date,
      sortable: true,
    },
    {
      name: "Priority",
      cell: (row) => (
        <div>
          {row.priority === "Very High" && (
            <span style={{ width: "60px" }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === "High" && (
            <span style={{ width: "60px" }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === "Medium" && (
            <span style={{ width: "60px" }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === "Low" && (
            <span style={{ width: "60px" }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    { name: "Type", cell: (row) => row.query_type_name, sortable: true },
    { name: "Status", cell: (row) => row.status_name, sortable: true },
    {
      name: "Assign To Dept",
      cell: (row) => row.assign_to_department,
      sortable: true,
    },
    { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
    { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
    // {
    //   name: "Solved Date",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_date,
    //   sortable: true,
    // },
    // {
    //   name: "Solved By",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_by,
    //   sortable: true,
    // },
  ];

  const departmentwisetTicketColumns = [
    {
      name: "Action",
      button: true,
      center: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${departmentwiseTicket
        ? departmentwiseTicket.length > 0
          ? "4rem"
          : "20.625rem"
        : "auto"
        }`,
      cell: (row) => actionComponent(row, "DEPARTMENTWISE_TICKET"),
    },
    {
      name: "Sr",
      width: "4rem",
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Ticket Id",
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Description",
      width: "18.75rem",
      selector: (row) => { },
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <a
            href="#"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: "Edit Country",
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {" "}
                    {row.description && row.description.length < 123
                      ? row.description
                      : row.description.substring(0, 123) + "...."}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </a>
        </div>
      ),
    },
    {
      name: "Ticket Date",
      selector: (row) => row.ticket_date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Expected Solve Date",
      selector: (row) => row.expected_solve_date,
      sortable: true,
    },
    {
      name: "Priority",
      cell: (row) => (
        <div>
          {row.priority === "Very High" && (
            <span style={{ width: "60px" }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === "High" && (
            <span style={{ width: "60px" }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === "Medium" && (
            <span style={{ width: "60px" }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === "Low" && (
            <span style={{ width: "60px" }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    { name: "Type", cell: (row) => row.query_type_name, sortable: true },
    { name: "Status", cell: (row) => row.status_name, sortable: true },
    {
      name: "Assign To Dept",
      cell: (row) => row.assign_to_department,
      sortable: true,
    },
    { name: "Assinged To", cell: (row) => row.assign_to_user, sortable: true },
    { name: "Created By", cell: (row) => row.created_by_name, sortable: true },
    // {
    //   name: "Solved Date",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_date,
    //   sortable: true,
    // },
    // {
    //   name: "Solved By",
    //   maxWidth: "auto",
    //   selector: (row) => row.ticket_solved_by,
    //   sortable: true,
    // },
  ];

  const loadData = async () => {
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    setIsLoading(true);
    const inputRequired =
      "id,employee_id,first_name,last_name,middle_name,is_active";

    await new UserService()
      .getUserForMyTickets(inputRequired)
      .then((res) => {
        if (res.status === 200) {
          const tempData = [];
          const temp = res.data.data;
          if (res.data.status == 1) {
            const data = res.data.data.filter((d) => d.is_active == 1);
            setUser(temp);
          }
          for (const key in temp) {
            tempData.push({
              value: temp[key].id,
              label: temp[key].first_name + " " + temp[key].last_name,
            });
          }
          const select = res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name,
            }));

          setUserData(null);
          const aa = tempData.sort(function (a, b) {
            return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
          });
          setUserData(aa);
          setAssignUserDropdown(select);
          setUserDropdown(select);
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          "Status",
          "Get_Status",
          "INSERT",
          errorObject.data.message
        );
      });

    await new DepartmentService().getDepartment().then((res) => {
      if (res.status === 200) {
        // setShowLoaderModal(false);
        const tempData = [];
        const temp = res.data.data;
        for (const key in temp) {
          if (temp[key].department) {
            tempData.push({
              value: temp[key].id,
              label: temp[key].department,
            });
          }
        }
        setDepartmentData(null);
        setDepartmentData(tempData);
      }
    });

    await new StatusService().getStatus().then((res) => {
      if (res.status === 200) {
        // setShowLoaderModal(false);

        const tempData = [];
        const temp = res.data.data;

        for (const key in temp) {
          // if (temp[key].is_active == 1) {
          if (temp[key].id) {
            tempData.push({
              value: temp[key].id,
              label: temp[key].status,
              ticket_solved_date: temp[key].ticket_solved_date,
              ticket_solved_by: temp[key].ticket_solved_by,
            });
          }
        }
        setStatusData(null);
        setStatusData(tempData);
      }
    });

    await new DepartmentMappingService()
      .getDepartmentMappingByEmployeeId(localStorage.getItem("id"))
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);

          if (res.data.status == 1) {
            if (res.status === 200) {
              if (res.data.status == 1) {
                setUserDepartment(res.data.data);
              }
            }
          }
        }
        if (res.status === 200) {
          setIsLoading(false);

          const tempData = [];
          const temp = res.data.data;
          for (const key in temp) {
            if (temp[key].is_active == 1) {
              tempData.push([temp[key].ticket_show_type]);
            }
          }
          setTicketShowType(null);
          setTicketShowType(tempData);
        }
      });

    await new MyTicketService().getUserTicketsTest().then((res) => {
      console.log("res2", res)
      if (res.status === 200) {
        if (res.data.status == 1) {
          setAssignedToMeData(res.data.data);
          setAssignedToMe(
            res.data.data.data.filter((d) => d.passed_status !== "REJECT")
          );
          const dataAssignToMe = res.data.data.data;
          var counter = 1;
          var tempAssignToMeExport = [];
          for (const key in dataAssignToMe) {
            tempAssignToMeExport.push({
              Sr: counter++,
              TICKET_ID: dataAssignToMe[key].ticket_id,
              TICKET_DATE: dataAssignToMe[key].ticket_date,
              EXPECTED_SOLVE_DATE: dataAssignToMe[key].expected_solve_date,
              ASSIGN_TO_DEPARTMENT: dataAssignToMe[key].assign_to_department,
              ASSIGN_TO_USER: dataAssignToMe[key].assign_to_user,
              QUERY_TYPE_NAME: dataAssignToMe[key].query_type_name,
              PRIORITY: dataAssignToMe[key].priority,
              STATUS: dataAssignToMe[key].status_name,
              DESCRIPTION: dataAssignToMe[key].description,
              CREATED_BY: dataAssignToMe[key].created_by_name,

              Basket_Configured: dataAssignToMe[key].basket_configured,
              Confirmation_Required: dataAssignToMe[key].confirmation_required
                ? "YES"
                : "NO",
              Ref_id: dataAssignToMe[key].cuid,
              from_department_name: dataAssignToMe[key].from_department_name,
              id: dataAssignToMe[key].id,
              Status: dataAssignToMe[key].is_active ? "Active" : "Deactive",
              module_name: dataAssignToMe[key].module_name,
              Passed_Status: dataAssignToMe[key].passed_status,
              Passed_Status_Changed_At:
                dataAssignToMe[key].passed_status_changed_at,
              Passed_Status_Changed_By_Name:
                dataAssignToMe[key].passed_status_changed_by_name,
              Passed_Status_Remark: dataAssignToMe[key].passed_status_remark,
              project_name: dataAssignToMe[key].project_name,
              // query_type_name: dataCreatedByMe[key].query_type_name,
              Status_name: dataAssignToMe[key].status_name,
              sub_module_name: dataAssignToMe[key].sub_module_name,
              Template_id: dataAssignToMe[key].template_id,
              Tenant_id: dataAssignToMe[key].tenant_id,
              ticket_solved_date: dataAssignToMe[key].ticket_solved_date,
              ticket_solved_by: dataAssignToMe[key].ticket_solved_by,
            });
          }

          setAssignedToMeExport(tempAssignToMeExport);
        }
      }
    });
    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
        }
      }
    });
  };

  const handlePassTicketForm = async (e) => {
    try {
      e.preventDefault();
      setNotify(null);

      const formData = new FormData(e.target);

      selectedRowss.forEach((id, index) => {
        formData.append(`id[${index}]`, id);
      });
      const response = await new MyTicketService().passTicket(formData);

      if (response.status === 200) {
        const { status, message } = response.data;

        if (status === 1) {
          setRemarkModal({ showModal: false, modalData: "", modalHeader: "" });
          // window.location.reload(false)
          loadData();
          setSelectedRows([]);
          setSelectedRowss([]);

          setNotify({ type: "success", message });
        } else {
          setNotify({ type: "danger", message });
        }
      } else {
        setNotify({ type: "danger", message: "Request Error !!!" });
      }
    } catch (error) {
      setNotify({ type: "danger", message: "An error occurred." });
    }
  };

  const handleForm = async (e) => {
    // e.preventDefault();
    // const formData = new FormData(e.target);
    // var flag = 1;
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      var flag = 1;
      await new ReportService()
        .getTicketReport(formData)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status == 1) {
              setSearchResult(null);
              setSearchResult(res.data.data);
              const temp = res.data.data;

              var counter = 1;
              var searchResultExport = [];
              for (const key in temp) {
                searchResultExport.push({
                  Sr: counter++,
                  TICKET_ID: temp[key].ticket_id,
                  TICKET_DATE: temp[key].ticket_date,
                  EXPECTED_SOLVE_DATE: temp[key].expected_solve_date,
                  ASSIGN_TO_DEPARTMENT: temp[key].assign_to_department,
                  ASSIGN_TO_USER: temp[key].assign_to_user,
                  QUERY_TYPE_NAME: temp[key].query_type_name,
                  PRIORITY: temp[key].priority,
                  STATUS: temp[key].status_name,
                  DESCRIPTION: temp[key].description,
                  CREATED_BY: temp[key].created_by_name,

                  Basket_Configured: temp[key].basket_configured,
                  Confirmation_Required: temp[key].confirmation_required
                    ? "YES"
                    : "NO",
                  Ref_id: temp[key].cuid,
                  from_department_name: temp[key].from_department_name,
                  id: temp[key].id,
                  Status: temp[key].is_active ? "Active" : "Deactive",
                  module_name: temp[key].module_name,
                  Passed_Status: temp[key].passed_status,
                  Passed_Status_Changed_At: temp[key].passed_status_changed_at,
                  Passed_Status_Changed_By_Name:
                    temp[key].passed_status_changed_by_name,
                  Passed_Status_Remark: temp[key].passed_status_remark,
                  project_name: temp[key].project_name,
                  // query_type_name: dataCreatedByMe[key].query_type_name,
                  Status_name: temp[key].status_name,
                  sub_module_name: temp[key].sub_module_name,
                  Template_id: temp[key].template_id,
                  Tenant_id: temp[key].tenant_id,
                  ticket_solved_date: temp[key].ticket_solved_date,
                  ticket_solved_by: temp[key].ticket_solved_by,
                });
              }
              setKey("Search_Result");
              setSearchResultExport(searchResultExport);
            } else {
              alert("No Data Found");
              // setNotify({ type: 'danger', message: "No data Found" });
            }
          } else {
            new ErrorLogService().sendErrorLog(
              "UserTask",
              "Get_UserTask",
              "INSERT",
              res.message
            );
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            "UserTask",
            "Get_UserTask",
            "INSERT",
            errorObject.data.message
          );
          setIsLoading(false);
        });
    } catch (error) {
      // Handle errors that may occur during the getTicketReport call
      console.error("Error:", error);
      // You can add additional error handling logic here, such as displaying an error message to the user.
    }
  };

  const handleChangeStatus = (e) => {
    setStatusValue(e);
  };
  const handleChangeAssignedUser = (e) => {
    setAssignedUser(e);
  };
  const handleChangeEntryUser = (e) => {
    setEntryUser(e);
  };

  const handleClearData = (e) => {
    if (selectInputRef.current.commonProps.hasValue != null) {
      selectInputRef.current.clearValue();
    }
    if (selectAssignUserRef.current.commonProps.hasValue != null) {
      selectAssignUserRef.current.clearValue();
      selectUserRef.current.clearValue();
    }
    selectEntryDeptRef.current.clearValue();
    selectStatusRef.current.clearValue();
    if (selectFromDateRef.current.value != null) {
      document.getElementById("from_date").value = "";
    }
    if (selectToDateRef.current.value != null) {
      document.getElementById("to_date").value = "";
    }
    if (selectTicketRef.current.value != null) {
      document.getElementById("ticket_id").value = "";
    }
  };

  const handleFromDate = (e) => {
    setStartDate(e.target.value);
    if (e.target.value) {
      setToDateRequired(true);
    } else {
      setToDateRequired(false);
    }
  };

  const handleToDate = (e) => {
    setToDate(e.target.value);
  };

  const handleTicket = (e) => {
    setTicket(e.target.value);
  };

  const onClosePopup = () => {
    setShow(false);
  };

  const handleFilterForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    var flag = 1;
    var filterExport = [];

    if (toDate < startDate) {
      alert("Please select Date After From date");
    } else {
      var flag = 1;
      onClosePopup();
      await new ReportService()
        .getTicketReport(formData)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status == 1) {
              setSearchResult(null);
              setSearchResult(res.data.data);
              const temp = res.data.data;
              var counter = 1;
              var searchResultExport = [];
              for (const key in temp) {
                searchResultExport.push({
                  counter: counter++,
                  Re_Id: temp[key].cuid,
                  TICKET_DATE: temp[key].ticket_date,
                  EXPECTED_SOLVE_DATE: temp[key].expected_solve_date,
                  ASSIGN_TO_DEPARTMENT: temp[key].assign_to_department,
                  ASSIGN_TO_USER: temp[key].assign_to_user,
                  TYPE: temp[key].type_id,
                  PRIORITY: temp[key].priority,
                  STATUS: temp[key].status_name,
                  DESCRIPTION: temp[key].description,
                  CREATED_BY: temp[key].created_by_name,
                  ticket_solved_date: temp[key].ticket_solved_date,
                  ticket_solved_by: temp[key].ticket_solved_by,
                });
              }
              setKey("Search_Result");
              setSearchResultExport(searchResultExport);

              for (const key in temp) {
                filterExport.push({
                  Sr: counter++,
                  TICKET_ID: temp[key].ticket_id,
                  TICKET_DATE: temp[key].ticket_date,
                  EXPECTED_SOLVE_DATE: temp[key].expected_solve_date,
                  ASSIGN_TO_DEPARTMENT: temp[key].assign_to_department,
                  ASSIGN_TO_USER: temp[key].assign_to_user,
                  QUERY_TYPE_NAME: temp[key].query_type_name,
                  PRIORITY: temp[key].priority,
                  STATUS: temp[key].status_name,
                  DESCRIPTION: temp[key].description,
                  CREATED_BY: temp[key].created_by_name,

                  Basket_Configured: temp[key].basket_configured,
                  Confirmation_Required: temp[key].confirmation_required
                    ? "YES"
                    : "NO",
                  Ref_id: temp[key].cuid,
                  from_department_name: temp[key].from_department_name,
                  id: temp[key].id,
                  Status: temp[key].is_active ? "Active" : "Deactive",
                  module_name: temp[key].module_name,
                  Passed_Status: temp[key].passed_status,
                  Passed_Status_Changed_At: temp[key].passed_status_changed_at,
                  Passed_Status_Changed_By_Name:
                    temp[key].passed_status_changed_by_name,
                  Passed_Status_Remark: temp[key].passed_status_remark,
                  project_name: temp[key].project_name,
                  // query_type_name: dataCreatedByMe[key].query_type_name,
                  Status_name: temp[key].status_name,
                  sub_module_name: temp[key].sub_module_name,
                  Template_id: temp[key].template_id,
                  ticket_solved_date: temp[key].ticket_solved_date,
                  ticket_solved_by: temp[key].ticket_solved_by,
                  Tenant_id: temp[key].tenant_id,
                });
              }
              setKey("Search_Result");
              setSearchResultExport(filterExport);
            }
          } else {
            new ErrorLogService().sendErrorLog(
              "UserTask",
              "Get_UserTask",
              "INSERT",
              res.message
            );
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            "UserTask",
            "Get_UserTask",
            "INSERT",
            errorObject.data.message
          );
        });
    }
  };

  const handleAssignedDepartment = (e) => {
    const deptAssignedUser = [];
    for (var i = 0; i < e.length; i++) {
      const select = user
        .filter((d) => d.department_id == e[i].value)
        .map((d) => ({ value: d.id, label: d.first_name + " " + d.last_name }));
      // const select = user.filter(d => d.is_active == 1).map(d => ({ value: d.id, label: d.first_name + " " + d.last_name }))

      for (var j = 0; j < select.length; j++) {
        deptAssignedUser.push(select[j]);
      }
    }
    setAssignUserDropdown(null);
    setAssignUserDropdown(deptAssignedUser);
    setAssignedDepartment(e);
  };

  const handleAssignedToMeTab = async (k, e) => {
    e.preventDefault();
    var form;
    if (k == "Assigned_To_Me") {
      form = {
        limit: 10,
        typeOf: "Assigned_To_Me",
        page: 1,
      };
      await new MyTicketService().getUserTicketsTest(form).then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setAssignedToMe(
              res.data.data.data.filter((d) => d.passed_status !== "REJECT")
            );
          }
        }
      });
    } else if (k == "created_by_me") {
      const forms = {
        limit: 10,
        typeOf: "CreatedByMe",
        page: 1,
      };
      await new MyTicketService().getUserTicketsTest(forms).then((res) => {
        if (res.status === 200) {
          setCreatedByMeData(res.data.data);
          setCreatedByMe(
            res.data.data.data.filter((d) => d.passed_status !== "REJECT")
          );
        }
      });
    } else if (k == "departmenyourTaskt") {
      const forms = {
        limit: 10,
        typeOf: "DepartmentWise",
        page: 1,
      };
      await new MyTicketService().getUserTicketsTest(forms).then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setDepartmentWiseData(res.data.data);
            setDepartmentwiseTicket(
              res.data.data.data.filter((d) => d.passed_status !== "REJECT")
            );
          }
        }
      });
    } else if (k == "your_task") {
      const forms = {
        limit: 10,
        typeOf: "YouTask",
        page: 1,
      };

      await new MyTicketService().getUserTicketsTest(forms).then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setYourTaskData(res.data.data);
            setYourTask(
              res.data.data.data.filter((d) => d.passed_status !== "REJECT")
            );
          }
        }
      });
    } else if (k == "unpassed_columns") {
      const forms = {
        limit: 10,
        typeOf: "UnPassed",
        page: 1,
      };

      await new MyTicketService().getUserTicketsTest(forms).then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setUnpassedData(res.data.data);
            setUnpassedTickets(res.data.data.data);
          }
        }
      });
    }
  };

  const handleAssignedToMeRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type == "LIMIT") {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: "AssignToMe",
        page: 1, // Resetting to the first page when limit changes
      };
    } else if (type == "MINUS") {
      form = {
        typeOf: "AssignToMe",
        page: assignedToMeData.current_page - 1,
      };
    } else if (type == "PLUS") {
      form = {
        typeOf: "AssignToMe",
        page: assignedToMeData.current_page + 1,
      };
    }



    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      console.log("r1", res)
      if (res.status === 200) {
        if (res.data.status == 1) {
          setAssignedToMe(
            res.data.data.data.filter((d) => d.passed_status !== "REJECT")
          );
          if (type == "PLUS" && res.data.data.data.length > 0) {
            setAssignedToMeData({
              ...assignedToMeData,
              current_page: assignedToMeData.current_page + 1,
            });
          }
        }
      }
    });
  };

  const handleCreatedByMeRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type == "LIMIT") {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: "CreatedByMe",
        page: createdByMeData.current_page,
      };
    } else if (type == "MINUS") {
      form = {
        typeOf: "CreatedByMe",
        page: createdByMeData.current_page - 1,
      };
    } else if (type == "PLUS") {
      form = {
        typeOf: "CreatedByMe",
        page: createdByMeData.current_page + 1,
      };
    }


    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setCreatedByMe(
            res.data.data.data.filter((d) => d.passed_status !== "REJECT")
          );
          if (type == "PLUS" && res.data.data.data.length > 0) {
            setCreatedByMeData({
              ...createdByMeData,
              current_page: createdByMeData.current_page + 1,
            });
          }
        }
      }
    });
  };

  const handleDepartmentWiseRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type == "LIMIT") {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: "DepartmentWise",
        page: departmentWiseData.current_page,
      };
    } else if (type == "MINUS") {
      // const limit = parseInt(e.target.value)
      form = {
        // limit: limit,
        typeOf: "DepartmentWise",
        page: departmentWiseData.current_page - 1,
      };
    } else if (type == "PLUS") {
      form = {
        // limit: limit,
        typeOf: "DepartmentWise",
        page: departmentWiseData.current_page + 1,
      };
    }


    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setDepartmentwiseTicket(
            res.data.data.data.filter((d) => d.passed_status !== "REJECT")
          );
          if (type == "PLUS" && res.data.data.data.length > 0) {
            setDepartmentWiseData({
              ...departmentWiseData,
              current_page: departmentWiseData.current_page + 1,
            });
          }
        }
      }
    });
  }

  const handleYourTaskRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type == "LIMIT") {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: "YouTask",
        page: yourTaskData.current_page,
      };
    } else if (type == "MINUS") {
      form = {
        typeOf: "YouTask",
        page: yourTaskData.current_page - 1,
      };
    } else if (type == "PLUS") {
      form = {
        typeOf: "YouTask",
        page: yourTaskData.current_page + 1,
      };
    }


    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setYourTask(
            res.data.data.data.filter((d) => d.passed_status !== "REJECT")
          );
          if (type == "PLUS" && res.data.data.data.length > 0) {
            setYourTaskData({
              ...yourTaskData,
              current_page: yourTaskData.current_page + 1,
            });
          }
        }
      }
    });
  };

  const handleUnpassedRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type == "LIMIT") {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: "UnPassed",
        page: unpassedData.current_page,
      };
    } else if (type == "MINUS") {
      // const limit = parseInt(e.target.value)
      form = {
        typeOf: "UnPassed",
        page: unpassedData.current_page - 1,
      };
    } else if (type == "PLUS") {
      form = {
        typeOf: "UnPassed",
        page: unpassedData.current_page + 1,
      };
    } else {
      return;
    }


    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setUnpassedTickets(res.data.data.data);
          setUnpassedData({
            ...unpassedData,
            current_page: res.data.data.current_page,
          });
        }
      }
    });
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: "120px",
      },
    },
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter") {
        // callMyFunction();
        handleForm();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  useEffect(() => {
    loadData();
    if (location && location.state) {
      setNotify(location.state);
    }
    return () => {
      setNotify(null);
    };
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[15].can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  useEffect(() => {
    if (notify) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 1500); // Adjust the timeout duration as needed
      return () => clearTimeout(timer);
    }
  }, [notify, dispatch]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="My Tickets" />

      {/* <LoadingSpinner/> */}
      {Notify && <Alert alertData={Notify} />}
      {/* {userData && JSON.stringify(userData)} */}
      <div className="card mt-2 " style={{ zIndex: 10 }}>
        <div className="card-body">
          <form onSubmit={handleForm}>
            <div className="row">
              <div className="col-md-3">
                <label className="">
                  <b>Ticket Id :</b>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="ticket_idd"
                  name="ticket_id"
                  onKeyPress={(e) => {
                    Validation.CharactersNumbersOnlyWithComma(e);
                  }}
                />
              </div>
              {localStorage.getItem("account_for") === "SELF" && (
                <>
                  <div className="col-md-3">
                    <label className="">
                      <b>Select User :</b>
                    </label>
                    {/* <UserDropdown id="assign_to_user_id" name="assign_to_user_id"/> */}
                    {userData && (
                      <Select
                        options={userData}
                        isMulti={true}
                        id="assign_to_user_id[]"
                        name="assign_to_user_id[]"
                      />
                    )}
                  </div>

                  <div className="col-md-3">
                    <label className="">
                      <b>Select Department :</b>
                    </label>
                    {departmentData && (
                      <Select
                        options={departmentData}
                        isMulti={true}
                        id="assign_to_department_id[]"
                        name="assign_to_department_id[]"
                      />
                    )}
                  </div>
                </>
              )}

              <div className="col-md-3">
                <label className="">
                  <b>Select Status :</b>
                </label>
                {statusData && (
                  <Select
                    options={statusData}
                    isMulti={true}
                    id="status_id[]"
                    name="status_id[]"
                  />
                )}
              </div>

              <div className="col-md-4">
                <button
                  className="btn btn-sm btn-warning text-white"
                  type="submit"
                  style={{ marginTop: "20px", fontWeight: "600" }}
                >
                  <i className="icofont-search-1 "></i> Search
                </button>
                <button
                  className="btn btn-sm btn-info text-white"
                  type="button"
                  onClick={() => window.location.reload(false)}
                  style={{ marginTop: "20px", fontWeight: "600" }}
                >
                  <i className="icofont-refresh text-white"></i> Reset
                </button>
                <button
                  className="btn btn-sm btn-primary text-white"
                  type="button"
                  id="openFilter"
                  onClick={handleShow}
                  style={{ marginTop: "20px", fontWeight: "600" }}
                >
                  {" "}
                  Filter <i className="icofont-filter" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <form
          onSubmit={(e) => {
            handleFilterForm(e);
          }}
        >
          <Modal.Body>
            <div className="card mt-2" style={{ zIndex: 10 }}>
              <div className="card-body">
                {/* *****************START DATE, END DATE**************** */}
                <div className="row mt-3">
                  <div className="col-md-6">
                    <label htmlFor="" className="">
                      <b>From Date :</b>
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      name="from_date"
                      id="from_date"
                      onChange={handleFromDate}
                      defaultValue={startDate}
                      required={toDateRequired}
                      ref={selectFromDateRef}
                    // max={disableDate()}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="" className="">
                      <b>To Date :</b>
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      name="to_date"
                      id="to_date"
                      defaultValue={toDate}
                      ref={selectToDateRef}
                      onChange={handleToDate}
                      // max={disableDate()}
                      required={toDateRequired}
                      min={startDate}
                    />
                  </div>
                </div>
                {/* ********************************* */}

                {/* *****************Entry Department,Entry User **************** */}
                {localStorage.getItem("account_for") === "SELF" && (
                  <>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label className="">
                          <b>Assigned Department :</b>
                        </label>
                        {departmentData && (
                          <Select
                            options={departmentData}
                            // value={deptAssignedUser}

                            // ref={selectInputRef}
                            isMulti={true}
                            ref={selectInputRef}
                            id="assign_to_department_id[]"
                            name="assign_to_department_id[]"
                            onChange={handleAssignedDepartment}
                            defaultValue={assignedDepartmentValue}
                          />
                        )}
                      </div>
                      {/* {assignUserDropdown && assignUserDropdown.length > 0 ? <> */}
                      <div className="col-md-6">
                        <label className="">
                          <b>Assigned User :</b>
                        </label>
                        {/* {assignUserDropdown && */}
                        <Select
                          options={assignUserDropdown}
                          isMulti={true}
                          id="assign_to_user_id[]"
                          name="assign_to_user_id[]"
                          ref={selectAssignUserRef}
                          onChange={handleChangeAssignedUser}
                          defaultValue={assignedUser}
                        />
                        {/* } */}
                      </div>

                      {/* </> : null} */}
                    </div>
                    {/* ********************************* **************** */}

                    {/* *****************Entry Department,Entry User **************** */}
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label className="">
                          <b>Entry Department :</b>
                        </label>
                        {departmentData && (
                          <Select
                            options={departmentData}
                            isMulti={true}
                            id="department_id[]"
                            name="department_id[]"
                            onChange={handleDepartment}
                            defaultValue={entryDepartment}
                            ref={selectEntryDeptRef}
                          />
                        )}
                      </div>

                      {/* {userDropdown && userDropdown.length > 0 ? <> */}

                      <div className="col-md-6">
                        <label className="">
                          <b>Entry User :</b>
                        </label>
                        {/* {userDropdown && */}
                        <Select
                          options={userDropdown}
                          isMulti={true}
                          ref={selectUserRef}
                          id="user_id[]"
                          name="user_id[]"
                          onChange={handleChangeEntryUser}
                          defaultValue={entryUser}
                        />
                        {/* } */}
                      </div>
                      {/* </> : null} */}
                    </div>
                  </>
                )}
                {/********************************** ****************************/}

                {/* ***************************Status**************** */}
                <div className="col-md-12">
                  <label className="mt-2">
                    <b>Select Status :</b>
                  </label>
                  {statusData && (
                    <Select
                      options={statusData}
                      isMulti={true}
                      id="status_id[]"
                      name="status_id[]"
                      ref={selectStatusRef}
                      onChange={handleChangeStatus}
                      defaultValue={statusValue}
                    />
                  )}
                </div>
                {/* ********************************* **************** */}
                {/* *****************Ticket Id**************** */}
                <div className="row mt-3">
                  <div className="col-md-12">
                    <label className="">
                      <b>Ticket Id :</b>
                    </label>
                    <input
                      type="text"
                      ref={selectTicketRef}
                      className="form-control form-control-sm"
                      id="ticket_id"
                      name="ticket_id"
                      defaultValue={ticket}
                      onChange={handleTicket}
                      maxLength={30}
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersSpeicalOnly(e);
                      }}
                    />
                  </div>
                </div>
                {/* ***************************************************************/}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="col-md-10">
              <button
                className="btn btn-sm btn-warning text-white"
                type="submit"
                style={{ marginTop: "20px", fontWeight: "600" }}
              >
                <i className="icofont-search-1 "></i> Search
              </button>
              <button
                className="btn btn-sm btn-info text-white"
                type="button"
                onClick={handleClearData}
                style={{ marginTop: "20px", fontWeight: "600" }}
              >
                <i className="icofont-refresh text-white"></i> Reset
              </button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>

      <div className="mt-2">
        <div className="">
          <div className="row  g-3">
            <div className="col-sm-12">
              <Tabs
                defaultActiveKey={
                  !searchResult ? "Assigned_To_Me" : "Search_Result"
                }
                transition={false}
                id="noanim-tab-example1"
                activeKey={key}
                onSelect={(k, e) => {
                  setKey(k);
                  handleAssignedToMeTab(k, e);
                }}
                className=" tab-body-header rounded d-inline-flex"
              >
                {searchResult && (
                  <Tab
                    eventKey="Search_Result"
                    title="Search Result"
                    activeKey={"Search_Result"}
                  >
                    <div className="card mb-3 mt-3">
                      <div className="card-body">
                        {searchResultExport && (
                          <ExportToExcel
                            className="btn btn-sm btn-danger mt-3"
                            apiData={searchResultExport}
                            fileName={`Export Filter Result ${formattedDate} ${formattedTimeString}`}
                          />
                        )}
                        {searchResult && (
                          <DataTable
                            columns={searchResultColumns}
                            data={searchResult}
                            defaultSortField="title"
                            paginations
                            fixedHeader={true}
                            fixedHeaderScrollHeight={"500px"}
                            selectableRows={false}
                            className="table msyDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                            highlightOnHover={true}
                          />
                        )}
                      </div>
                    </div>
                  </Tab>
                )}
                {localStorage.getItem("account_for") === "SELF" && (
                  <Tab eventKey="Assigned_To_Me" title="Assigned To me">
                    <div className="card mb-3 mt-3">
                      <div className="card-body">
                        {assignedToMe && (
                          <ExportAllTicketsToExcel
                            className="btn btn-sm btn-danger mt-3"
                            fileName="Assign To Me"
                            typeOf="AssignToMe"
                          />
                        )}
                        {console.log("ass", assignedToMe)}

                        {assignedToMe && (
                          <DataTable
                            columns={assignedToMeColumns}
                            data={assignedToMe}
                            defaultSortField="title"
                            fixedHeader={true}
                            fixedHeaderScrollHeight={"700px"}
                            selectableRows={false}
                            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                            highlightOnHover={true}
                          />
                        )}
                        <div className="back-to-top pull-right mt-2 mx-2">
                          <label className="mx-2">rows per page</label>
                          <select
                            onChange={(e) => {
                              handleAssignedToMeRowChanged(e, "LIMIT");
                            }}
                            className="mx-2"
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                          </select>
                          {assignedToMeData && (
                            <small>
                              {assignedToMeData.from}-{assignedToMeData.to} of{" "}
                              {assignedToMeData.total}
                            </small>
                          )}
                          <button
                            onClick={(e) => {
                              handleAssignedToMeRowChanged(e, "MINUS");
                            }}
                            className="mx-2"
                          >
                            <i className="icofont-arrow-left"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              handleAssignedToMeRowChanged(e, "PLUS");
                            }}
                          >
                            <i className="icofont-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Tab>
                )}

                <Tab eventKey="created_by_me" title="Created By Me">
                  <div className="card mb-3 mt-3">
                    <div className="card-body">
                      {createdByMe && (
                        <ExportAllTicketsToExcel
                          className="btn btn-sm btn-danger mt-3"
                          fileName="Created By Me"
                          typeOf="CreatedByMe"
                        />
                      )}
                      {createdByMe && (
                        <DataTable
                          customStyles={customStyles}
                          columns={createdByMeColumns}
                          data={createdByMe}
                          defaultSortField="title"
                          fixedHeader={true}
                          fixedHeaderScrollHeight={"500px"}
                          selectableRows={false}
                          highlightOnHover={true}
                          responsive={true}
                        />
                      )}
                      <div className="back-to-top pull-right mt-6 mx-2">
                        <label className="mx-2">rows per page</label>
                        <select
                          onChange={(e) => {
                            handleCreatedByMeRowChanged(e, "LIMIT");
                          }}
                          className="mx-2"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="30">30</option>
                          <option value="40">40</option>
                        </select>
                        {createdByMeData && (
                          <small>
                            {createdByMeData.from}-{createdByMeData.to} of{" "}
                            {createdByMeData.total}
                          </small>
                        )}
                        <button
                          onClick={(e) => {
                            handleCreatedByMeRowChanged(e, "MINUS");
                          }}
                          className="mx-2"
                        >
                          <i className="icofont-arrow-left"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            handleCreatedByMeRowChanged(e, "PLUS");
                          }}
                        >
                          <i className="icofont-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Tab>
                {localStorage.getItem("account_for") === "SELF" && (
                  <Tab
                    eventKey="departmenyourTaskt"
                    title="Departmentwise Tickets"
                  >
                    <div className="card mb-3 mt-3">
                      <div className="card-body">
                        {departmentwiseTicket && (
                          <ExportAllTicketsToExcel
                            className="btn btn-sm btn-danger mt-3"
                            fileName="Departmentwise Ticket"
                            typeOf="DepartmentWise"
                          />
                        )}
                        {departmentwiseTicket && (
                          <DataTable
                            columns={departmentwisetTicketColumns}
                            data={departmentwiseTicket}
                            defaultSortField="title"
                            fixedHeader={true}
                            fixedHeaderScrollHeight={"500px"}
                            selectableRows={false}
                            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                            highlightOnHover={true}
                          />
                        )}
                        <div className="back-to-top pull-right mt-2 mx-2">
                          <label className="mx-2">rows per page</label>
                          <select
                            onChange={(e) => {
                              handleDepartmentWiseRowChanged(e, "LIMIT");
                            }}
                            className="mx-2"
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                          </select>
                          {departmentWiseData && (
                            <small>
                              {departmentWiseData.from}-{departmentWiseData.to}{" "}
                              of {departmentWiseData.total}
                            </small>
                          )}
                          <button
                            onClick={(e) => {
                              handleDepartmentWiseRowChanged(e, "MINUS");
                            }}
                            className="mx-2"
                          >
                            <i className="icofont-arrow-left"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              handleDepartmentWiseRowChanged(e, "PLUS");
                            }}
                          >
                            <i className="icofont-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Tab>
                )}

                {localStorage.getItem("account_for") === "SELF" && (
                  <Tab eventKey="your_task" title="Your Task">
                    <div className="card mb-3 mt-3">
                      <div className="card-body">
                        {yourTask && (
                          <ExportAllTicketsToExcel
                            className="btn btn-sm btn-danger mt-3"
                            fileName="Your Task"
                            typeOf="YouTask"
                          />
                        )}
                        {yourTask && (
                          <DataTable
                            columns={yourTaskColumns}
                            data={yourTask}
                            defaultSortField="title"
                            fixedHeader={true}
                            fixedHeaderScrollHeight={"500px"}
                            selectableRows={false}
                            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                            highlightOnHover={true}
                          />
                        )}
                        <div className="back-to-top pull-right mt-2 mx-2">
                          <label className="mx-2">rows per page</label>
                          <select
                            onChange={(e) => {
                              handleYourTaskRowChanged(e, "LIMIT");
                            }}
                            className="mx-2"
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                          </select>
                          {yourTaskData && (
                            <small>
                              {yourTaskData.from}-{yourTaskData.to} of{" "}
                              {yourTaskData.total}
                            </small>
                          )}
                          <button
                            onClick={(e) => {
                              handleYourTaskRowChanged(e, "MINUS");
                            }}
                            className="mx-2"
                          >
                            <i className="icofont-arrow-left"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              handleYourTaskRowChanged(e, "PLUS");
                            }}
                          >
                            <i className="icofont-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Tab>
                )}

                <Tab eventKey="unpassed_columns" title="Unpassed Ticket">
                  <div className="card mb-3 mt-3">
                    {/* <div className="card-body">
                      {unpassedTickets && (
                        <ExportAllTicketsToExcel
                          className="btn btn-sm btn-danger mt-3"
                          fileName="Unpassed Ticket"
                          typeOf="UnPassed"
                        />
                      )}
<button
                  className="btn btn-success text-white"
                  style={{ width: "100%", zIndex: 100 }}
                  onClick={(e) => {
                    handleRemarkModal({
                      showModal: true,
                      modalData: data,
                      modalHeader: "Enter Remark",
                      status: "PASS",
                    });
                  }}
                >
                  <i className="icofont-checked"></i> Pass
                </button> */}

                    <div className="card-body">
                      <div className="row">
                        {/* <div className="col-md-2 mb-3">
                          {unpassedTickets && (
                            <ExportAllTicketsToExcel
                              className="btn btn-danger btn-block"
                              fileName="Unpassed Ticket"
                              typeOf="UnPassed"
                            />
                          )}


                          <button
                            className="btn btn-success btn-block text-white"

                            onClick={(e) => {
                              const selectedData = unpassedTickets.filter((row) => selectedRows.includes(row.id));
                              handleBulkRemarkModal({
                                showModal: true,
                                modalData: selectedData,
                                modalHeader: "Enter Remark",
                                status: "PASS",
                              });
                            }}
                          >
                            <i className="icofont-checked"></i> Pass
                          </button>

                          <button
                            className="btn btn-success btn-block text-white"

                            onClick={(e) => {
                              const selectedData = unpassedTickets.filter((row) => selectedRows.includes(row.id));
                              handleBulkRemarkModal({
                                showModal: true,
                                modalData: selectedData,
                                modalHeader: "Enter Remark",
                                status: "REJECT",
                              });
                            }}>
                            <i className="icofont-close-squared-alt"></i> Reject
                          </button>

                        </div> */}
                        <div className="row">
                          <div className="col-md-6 mb-1">
                            {unpassedTickets && (
                              <ExportAllTicketsToExcel
                                className="btn btn-danger btn-block"
                                fileName="Unpassed Ticket"
                                typeOf="UnPassed"
                              />
                            )}

                            {unpassedTickets && (
                              <>
                                <button
                                  className="btn btn-success btn-block text-white"
                                  onClick={(e) => {
                                    const selectedData = unpassedTickets.filter(
                                      (row) => selectedRowss.includes(row.id)
                                    );
                                    handleRemarkModal({
                                      showModal: true,
                                      modalData: selectedData,
                                      modalHeader: "Enter Remark",
                                      status: "PASS",
                                    });
                                  }}
                                >
                                  <i className="icofont-checked"></i> Pass
                                </button>

                                <button
                                  className="btn btn-danger btn-block text-white"
                                  onClick={(e) => {
                                    const selectedData = unpassedTickets.filter(
                                      (row) => selectedRowss.includes(row.id)
                                    );
                                    handleRemarkModal({
                                      showModal: true,
                                      modalData: selectedData,
                                      modalHeader: "Enter Remark",
                                      status: "REJECT",
                                    });
                                  }}
                                >
                                  <i className="icofont-close-squared-alt"></i>{" "}
                                  Reject
                                </button>
                                {/* {selectAllNames === true ?
                                  <button
                                    className="btn btn-success btn-block text-white"
                                    onClick={(e) => {
                                      const selectedData = unpassedTickets.filter((row) => selectedRowss.includes(row.id));
                                      handleRemarkModal({
                                        showModal: true,
                                        modalData: selectedData,
                                        modalHeader: "Enter Remark",
                                        status: "PASS",
                                      });
                                    }}
                                  >
                                    <i className="icofont-checked"></i> Pass
                                  </button> :



                                  <button
                                    className="btn btn-success btn-block text-white"
                                    onClick={(e) => {
                                      const selectedData = unpassedTickets.filter((row) => selectedRows.includes(row.id));
                                      handleRemarkModal({
                                        showModal: true,
                                        modalData: selectedData,
                                        modalHeader: "Enter Remark",
                                        status: "PASS",
                                      });
                                    }}
                                  >
                                    <i className="icofont-checked"></i> Pass
                                  </button>
                                } */}

                                {/* {selectAllNames === true ?
                                  <button
                                    className="btn btn-danger btn-block text-white"
                                    onClick={(e) => {
                                      const selectedData = unpassedTickets.filter((row) => selectedRowss.includes(row.id));
                                      handleRemarkModal({
                                        showModal: true,
                                        modalData: selectedData,
                                        modalHeader: "Enter Remark",
                                        status: "REJECT",
                                      });
                                    }}
                                  >
                                    <i className="icofont-close-squared-alt"></i> Reject
                                  </button>

                                  :
                                  <button
                                    className="btn btn-danger btn-block text-white"
                                    onClick={(e) => {
                                      const selectedData = unpassedTickets.filter((row) => selectedRows.includes(row.id));
                                      handleRemarkModal({
                                        showModal: true,
                                        modalData: selectedData,
                                        modalHeader: "Enter Remark",
                                        status: "REJECT",
                                      });
                                    }}
                                  >
                                    <i className="icofont-close-squared-alt"></i> Reject
                                  </button>
                                } */}
                              </>
                            )}
                          </div>
                        </div>
                      </div>



                      {unpassedTickets && (
                        <DataTable
                          columns={unpassedColumns}
                          data={unpassedTickets}
                          defaultSortField="title"
                          fixedHeader={true}
                          fixedHeaderScrollHeight={"500px"}
                          selectableRows={false}
                          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                          highlightOnHover={true}
                        />
                      )}
                      <div className="back-to-top pull-right mt-2 mx-2">
                        <label className="mx-2">rows per page</label>
                        <select
                          onChange={(e) => {
                            handleUnpassedRowChanged(e, "LIMIT");
                          }}
                          className="mx-2"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="30">30</option>
                          <option value="40">40</option>
                        </select>
                        {unpassedData && (
                          <small>
                            {unpassedData.from}-{unpassedData.to} of{" "}
                            {unpassedData.total}
                          </small>
                        )}
                        <button
                          onClick={(e) => {
                            handleUnpassedRowChanged(e, "MINUS");
                          }}
                          className="mx-2"
                        >
                          <i className="icofont-arrow-left"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            handleUnpassedRowChanged(e, "PLUS");
                          }}
                        >
                          <i className="icofont-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showLoaderModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="dark" />
        </Modal.Body>
      </Modal>

      {confirmationModal && (
        <Modal
          centered
          show={confirmationModal && confirmationModal.showModals}
        >
          <Modal.Header>
            <Modal.Title className="fw-bold">Solve Ticket - </Modal.Title>
          </Modal.Header>

          {confirmationModal &&
            confirmationModal &&
            confirmationModal.modalsData && (
              <form onSubmit={handleSolveTicketModal} method="POST">
                <Modal.Body>
                  <input
                    type="hidden"
                    name="id"
                    id="id"
                    defaultValue={confirmationModal.modalsData.id}
                  />
                  <h5
                    className="text-nowrap bd-highlight"
                    style={{ fontFamily: "sans-serif", fontWeight: "bold" }}
                  >
                    Are You Really Want To Solve This Ticket ?
                  </h5>
                  <label className="form-label font-weight-bold mt-3">
                    Remark :*
                  </label>
                  <textarea
                    type="text"
                    name="remark"
                    id="remark"
                    rows="4"
                    className="form-control form-control-sm"
                    required
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersSpeicalOnly(e);
                    }}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <button
                    type="button"
                    className="btn btn-danger text-white"
                    onClick={(e) =>
                      handleConfirmationModal({
                        e,
                        showModal: false,
                        modalData: "",
                        modalHeader: "",
                      })
                    }
                  >
                    NO
                  </button>
                  <button type="submit" className="btn btn-info text-white">
                    YES
                  </button>
                </Modal.Footer>
              </form>
            )}
        </Modal>
      )}

      <Modal
        centered
        show={modal.showModal}
        style={{
          height: "60%",
        }}
        scrollable={true}
        onHide={(e) => {
          handleModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            Description-{modal.modalData.ticket_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.modalData.description}</Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-danger text-white"
            onClick={() => {
              handleModal({ showModal: false, modalData: "", modalHeader: "" });
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        centered
        show={remarkModal.showModal}
        onHide={(e) => {
          handleRemarkModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
            status: remarkModal.status,
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {remarkModal.status == "PASS" ? "PASS TICKET " : "REJECT TICKET"}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handlePassTicketForm} method="post">
          <Modal.Body>
            <div className="deadline-form">
              <input
                type="hidden"
                className="form-control form-control-sm"
                id="pass_status"
                name="pass_status"
                value={remarkModal.status}
              />
              {selectedRows &&
                selectedRows.length == 0 &&
                selectedRowss &&
                selectedRowss.length == 0 && (
                  <input
                    type="hidden"
                    className="form-control form-control-sm"
                    id="id[]"
                    name="id[]"
                    defaultValue={remarkModal.modalData.id}
                  />
                )}
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Ticket Id :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    // defaultValue={remarkModal.modalData.ticket_id}
                    defaultValue={
                      remarkModal && Array.isArray(remarkModal.modalData)
                        ? remarkModal.modalData.map((i) => i.ticket_id)
                        : remarkModal.modalData.ticket_id
                    }
                    readOnly={true}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Remark :*
                  </label>
                  <input
                    type="text"
                    name="remark"
                    id="remark"
                    className="form-control form-control-sm"
                    required
                    maxLength={1000}
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersSpeicalOnly(e);
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-info text-white">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                handleRemarkModal({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                });
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* bulk ticket pass modal */}

      {/* <Modal
        centered
        show={bulkRemarkModal.showModal}
        onHide={(e) => {
          handle({
            showModal: false,
            modalData: "",
            modalHeader: "",
            status: bulkRemarkModal.status,
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {bulkRemarkModal.status == "PASS" ? "PASS TICKET " : "REJECT TICKET"}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleBulkPassTicketForm} method="post">
          <Modal.Body>
            <div className="deadline-form">
              <input
                type="hidden"
                className="form-control form-control-sm"
                id="pass_status"
                name="pass_status"
                value={bulkRemarkModal.status}
              />

              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Ticket Id :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                   
                    defaultValue={
                      bulkRemarkModal && Array.isArray(bulkRemarkModal.modalData)
                        ? bulkRemarkModal.modalData.map((i) => i.ticket_id)
                        : []
                    }

                    readOnly={true}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Remark :*
                  </label>
                  <input
                    type="text"
                    name="remark"
                    id="remark"
                    className="form-control form-control-sm"
                    required
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersSpeicalOnly(e);
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-info text-white">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                handleBulkRemarkModal({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                });
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal> */}

      {/* {isLoading === true &&  <LoaderComponent/> } */}
    </div>
  );
}