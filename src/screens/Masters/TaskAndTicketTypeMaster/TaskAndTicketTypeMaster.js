// import React, { useEffect, useState, useRef } from "react";
// import {
//   ButtonComponent,
//   DropdownComponent,
//   SearchComponent,
// } from "../../../components/Utilities/Button/Button";

// import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
// import PageHeader from "../../../components/Common/PageHeader";
// import { Modal } from "react-bootstrap";
// import { Astrick } from "../../../components/Utilities/Style";
// import * as Validation from "../../../components/Utilities/Validation";
// import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";
// import Alert from "../../../components/Common/Alert";
// import DataTable from "react-data-table-component";
// import Select from "react-select";
// import { el } from "date-fns/locale";
// import {
//   handleModalClose,
//   handleModalOpe,
//   handleModalOpen,
// } from "./TaskAndTicketTypeMasterSlice";
// import {
//   getParentDropdown,
//   postTaskandTicket,
//   taskAndTicketMaster,
//   updateTaskAndTicketType,
// } from "./TaskAndTicketTypeMasterAction";
// import { useDispatch, useSelector } from "react-redux";

// import TaskAndTicketTypeMasterSlice from "./TaskAndTicketTypeMasterSlice";

// function TaskAndTicketTypeMaster(props) {
//   const dispatch = useDispatch();
//   const tasktype = useSelector(
//     (TaskAndTicketTypeMasterSlice) =>
//       TaskAndTicketTypeMasterSlice.taskandticket.taskAndTicketMaster
//   );
//   const checkRole = useSelector((DashboardSlice) =>
//     DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 10)
//   );
//   const parentDropDown = useSelector(
//     (TaskAndTicketTypeMasterSlice) =>
//       TaskAndTicketTypeMasterSlice.taskandticket.getParentDropdown
//   );
//   const modal = useSelector(
//     (TaskAndTicketTypeMasterSlice) =>
//       TaskAndTicketTypeMasterSlice.taskandticket.modal
//   );
//   const notify = useSelector(
//     (TaskAndTicketTypeMasterSlice) =>
//       TaskAndTicketTypeMasterSlice.taskandticket.notify
//   );

//   console.log("parentDropDown", parentDropDown);
//   console.log("tasktype", tasktype);
//   const [selectedValue, setSelectedValue] = useState("");
//   // const [notify, setNotify] = useState();
//   const [data, setData] = useState();
//   const [parent, setParent] = useState();
//   const [loading, setLoading] = useState(false);

//   const [exportData, setExportData] = useState(null);

//   const typeRef = useRef(null);
//   const parentRef = useRef(null);
//   const typeNameRef = useRef(null);

//   // const [modal, setModal] = useState({
//   //   showModal: false,
//   //   modalData: "",
//   //   modalHeader: "",
//   // });
//   const dropdownData = [
//     { value: "TASK", label: "TASK" },
//     { value: "TICKET", label: "TICKET" },
//     // Add more options as needed
//   ];
//   const loadData = async () => {
//     dispatch(taskAndTicketMaster());
//     dispatch(getParentDropdown());

//     // const exportTempData = [];

//     // await new TaskTicketTypeService().getAllType().then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       let counter = 1;
//     //       var tempData = [];
//     //       const temp = res.data.data;

//     //       for (const key in temp) {
//     //         tempData.push({
//     //           counter: counter++,
//     //           id: temp[key].id,
//     //           type: temp[key].type,
//     //           parent_id: temp[key].parent_id,

//     //           type_name: temp[key].type_name,
//     //           remark: temp[key].remark,
//     //           is_active: temp[key].is_active,
//     //           created_at: temp[key].created_at,
//     //           created_by: temp[key].created_by,
//     //           updated_at: temp[key].updated_at,
//     //           updated_by: temp[key].updated_by,
//     //         });
//     //       }
//     //       setData(null);
//     //       setData(tempData);

//     //       for (const i in temp) {
//     //         exportTempData.push({
//     //           SrNo: exportTempData.length + 1,

//     //           id: temp[i].id,
//     //           type: temp[i].type,

//     //           parent_name: temp[i].parent_name,
//     //           type_name: temp[i].type_name,
//     //           remark: temp[i].remark,
//     //           is_active: temp[i].is_active,
//     //           created_at: temp[i].created_at,
//     //           created_by: temp[i].created_by,
//     //           updated_at: temp[i].updated_at,
//     //           updated_by: temp[i].updated_by,
//     //         });
//     //       }

//     //       setExportData(null);

//     //       setExportData(exportTempData);
//     //     }
//     //   }
//     // });

//     // await new TaskTicketTypeService().getParent().then((res) => {
//     //   if (res.status === 200) {
//     //     const mappedData = res.data.data.map((d) => ({
//     //       value: d.id,
//     //       label: d.type_name,
//     //     }));
//     //     setParent(mappedData);
//     //   } else {
//     //     console.error("error", res.status);
//     //   }
//     // });
//   };
//   const columns = [
//     // Columns definition..
//     {
//       name: "Action",
//       selector: (row) => {},
//       sortable: false,
//       cell: (row) => (
//         <div className="btn-group" role="group">
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             data-bs-toggle="modal"
//             data-bs-target="#edit"
//             onClick={(e) => {
//               dispatch(
//                 handleModalOpen({
//                   showModal: true,
//                   modalData: row,
//                   modalHeader: "Edit Task/Ticket Type",
//                 })
//               );
//             }}
//           >
//             <i className="icofont-edit text-success"></i>
//           </button>
//         </div>
//       ),
//     },
//     {
//       name: "Sr",
//       selector: (row) => row.counter,
//       sortable: true,
//     },

//     {
//       name: "Type",
//       selector: (row) => row.type,
//       sortable: true,
//       width: "125px",
//     },
//     {
//       name: "Parent",
//       width: "150px",
//       cell: (row) => {
//         if (parentDropDown) {
//           const parent_name =
//             parentDropDown &&
//             parentDropDown

//               ?.filter((d) => d.value == row.parent_id)
//               .map((d) => ({ value: d.value, label: d.label }));
//           return <span>{parent_name[0]?.label}</span>;
//         }
//       },
//     },
//     {
//       name: "Type Name",
//       selector: (row) => row.type_name,
//       sortable: true,
//       width: "125px",
//     },

//     {
//       name: "Status",
//       selector: (row) => row.is_active,
//       sortable: true,
//       cell: (row) => (
//         <div>
//           {row.is_active == 1 && (
//             <span className="badge bg-primary" style={{ width: "4rem" }}>
//               Active
//             </span>
//           )}
//           {row.is_active == 0 && (
//             <span className="badge bg-danger" style={{ width: "4rem" }}>
//               Deactive
//             </span>
//           )}
//         </div>
//       ),
//     },
//     {
//       name: "Created At",
//       selector: (row) => row.created_at,
//       sortable: true,
//       width: "175px",
//     },
//     {
//       name: "Created By",
//       selector: (row) => row.created_by,
//       sortable: true,
//       width: "150px",
//     },
//     {
//       name: "Updated At",
//       selector: (row) => row.updated_at,
//       sortable: true,
//       width: "175px",
//     },
//     {
//       name: "Updated By",
//       selector: (row) => row.updated_by,
//       sortable: true,
//       width: "150px",
//     },
//   ];
//   const searchRef = useRef();

//   function searchInData(data, search) {
//     const lowercaseSearch = search.toLowerCase();

//     return data.filter((d) => {
//       for (const key in d) {
//         if (
//           typeof d[key] === "string" &&
//           d[key].toLowerCase().includes(lowercaseSearch)
//         ) {
//           return true;
//         }
//       }
//       return false;
//     });
//   }

//   const [searchTerm, setSearchTerm] = useState("");
//   // const handleSearch = (e) => {
//   //   setSearchTerm(e.target.value);
//   // };
//   const [filteredData, setFilteredData] = useState([]);

//   const handleSearch = (value) => {
//     console.log("fff", filteredData);
//   };

//   // const handleSearch = () => {
//   //   const searchValue = searchRef.current.value;
//   //   const result = searchInData(data, searchValue);
//   //   setData(result);
//   // };
//   // const handleKeyDown = (event) => {
//   //   if (event.key === "Enter") {
//   //     handleSearch();
//   //   }
//   // };
//   const handleButtonClick = (e) => {
//     // setModal({ showModal: false });
//   };

//   // const handleModal = (data) => {
//   //   setModal(data);
//   // };

//   const handleDropdownChange = (e) => {
//     setSelectedValue(e.target.value);
//   };

//   const handleForm = (id) => async (e) => {
//     e.preventDefault();

//     if (!id) {
//       if (selectedValue === "") {
//         alert("Type is required.");
//         return;
//       }
//     }
//     if (id) {
//       if (modal.modalData.type === "") {
//         alert("Type is required.");
//         return;
//       }
//     }

//     // setNotify(null);
//     const form = new FormData(e.target);
//     if (!id) {
//       dispatch(postTaskandTicket(form));
//       dispatch(taskAndTicketMaster());
//       dispatch(getParentDropdown());

//       // await new TaskTicketTypeService().postType(form).then((res) => {
//       //   if (res.status === 200) {
//       //     if (res.data.status === 1) {
//       //       setNotify({ type: "success", message: res.data.message });
//       //       setModal({ showModal: false });
//       //       loadData();
//       //     } else {
//       //       // setLoading(false);
//       //       setNotify({ type: "danger", message: res.data.message });
//       //     }
//       //   } else {
//       //     // setLoading(false);
//       //     setNotify({ type: "danger", message: res.data.message });
//       //   }
//       // });
//     } else {
//       dispatch(updateTaskAndTicketType({ id: id, payload: form }));
//       dispatch(taskAndTicketMaster());
//       dispatch(getParentDropdown());

//       // await new TaskTicketTypeService()._updateType(id, form).then((res) => {
//       //   if (res.status === 200) {
//       //     if (res.data.status == 1) {
//       //       setNotify({ type: "success", message: res.data.message });
//       //       setModal({ showModal: false });
//       //       loadData();
//       //     } else {
//       //       setNotify({ type: "danger", message: res.data.message });
//       //     }
//       //   } else {
//       //     // setLoading(false);
//       //     setNotify({ type: "danger", message: res.data.message });
//       //   }
//       // });
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   return (
//     <div className="container-xxl">
//       {notify && (
//         <>
//           {" "}
//           <Alert alertData={notify} />{" "}
//         </>
//       )}
//       <PageHeader
//         headerTitle="Ticket And Task Type Master"
//         renderRight={() => {
//           return (
//             <div className="col-auto d-flex w-sm-100">
//               <button
//                 className="btn btn-dark btn-set-task w-sm-100"
//                 onClick={() => {
//                   dispatch(
//                     handleModalOpen({
//                       showModal: true,
//                       modalData: "",
//                       modalHeader: "Add Task/Ticket Type",
//                     })
//                   );
//                   setSelectedValue("");
//                 }}
//               >
//                 <i className="icofont-plus-circle me-2 fs-6"></i>Add
//               </button>
//             </div>
//           );
//         }}
//       />

//       {/* <div>
//         <SearchComponent
//           placeholder="Search ...."
//           // handleKeyDown={handleKeyDown}
//           ref={searchRef}
//           className="btn btn-sm btn-warning text-white"
//           style={{
//             marginTop: "0px",
//             fontWeight: "600",
//             color: "red !important",
//           }}
//           buttonName1="Search"
//           buttonName2="Reset"
//           Searchicon="icofont-search-1 "
//           className2="btn btn-sm btn-info text-white"
//           onClick={() => handleSearch(searchTerm)}
        
//           className3="btn btn-sm btn-danger"
//           fileName="Task and Ticket type file"
//           apiData={exportData}
//         />
//       </div> */}

//       <div className="card card-body">
//         <div className="row">
//           <div className="col-md-9">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search by Templete Name...."
//               ref={searchRef}
//               // onKeyDown={handleKeyDown}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="col-md-3">
//             <button
//               className="btn btn-sm btn-warning text-white"
//               type="button"
//               value={searchTerm}
//               onClick={() => handleSearch(searchTerm)}
//               style={{ marginTop: "0px", fontWeight: "600" }}
//             >
//               <i className="icofont-search-1 "></i> Search
//             </button>
//             <button
//               className="btn btn-sm btn-info text-white"
//               type="button"
//               onClick={() => window.location.reload(false)}
//               style={{ marginTop: "0px", fontWeight: "600" }}
//             >
//               <i className="icofont-refresh text-white"></i> Reset
//             </button>
//             <ExportToExcel
//               className="btn btn-sm btn-danger"
//               apiData={exportData}
//               fileName="Template master Records"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Modal For Add and Edit Data */}
//       <Modal
//         centered
//         show={modal.showModal}
//         // onHide={(e) => {
//         //   ({
//         //     showModal: false,
//         //     modalData: "",
//         //     modalHeader: "",
//         //   });
//         // }}
//       >
//         <Modal.Header
//           closeButton
//           onClick={(e) => {
//             dispatch(
//               handleModalClose({
//                 showModal: false,
//                 // modalData: row,

//                 modalHeader: "Edit Type",
//               })
//             );
//           }}
//         >
//           <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <form
//             method="post"
//             onSubmit={handleForm(modal.modalData ? modal.modalData.id : "")}
//           >
//             <div className="deadline-form">
//               <div className="row g-3 mb-3">
//                 <div className="col-sm-12">
//                   <label
//                     className="form-label font-weight-bold"
//                     readOnly={true}
//                   >
//                     Select type: <Astrick color="red" size="13px" />
//                   </label>
//                   <DropdownComponent
//                     required={true}
//                     name="type"
//                     ref={typeRef}
//                     data={dropdownData}
//                     getInputValue={handleDropdownChange}
//                     className="form-control form-control-sm"
//                     placeholder="select"
//                     selectedValue={modal.modalData && modal.modalData.type}
//                   />
//                 </div>

//                 {selectedValue === "TASK" ||
//                 modal?.modalData?.type === "TASK" ? (
//                   <>
//                     <div className="col-sm-12">
//                       <label
//                         className="form-label font-weight-bold"
//                         readOnly={true}
//                       >
//                         Parent Task Type
//                         <Astrick color="red" size="13px" />
//                       </label>
//                       <Select
//                         options={parentDropDown}
//                         id="parent_id"
//                         name="parent_id"
//                         required
//                         defaultValue={
//                           modal.modalData
//                             ? modal.modalData &&
//                               parentDropDown &&
//                               parentDropDown.filter(
//                                 (d) => d.value == modal.modalData.parent_id
//                               )
//                             : parentDropDown &&
//                               parentDropDown.filter((d) => d.value == 0)
//                         }
//                       />
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     {selectedValue === "TICKET" ||
//                     modal?.modalData?.type === "TICKET" ? (
//                       <div className="col-sm-12">
//                         <label
//                           className="form-label font-weight-bold"
//                           readOnly={true}
//                         >
//                           Parent Ticket Type
//                           <Astrick color="red" size="13px" />
//                         </label>
//                         <Select
//                           options={parentDropDown}
//                           id="parent_id"
//                           name="parent_id"
//                           required
//                           defaultValue={
//                             modal.modalData
//                               ? modal.modalData &&
//                                 parentDropDown &&
//                                 parentDropDown.filter(
//                                   (d) => d.value == modal.modalData.parent_id
//                                 )
//                               : parentDropDown &&
//                                 parentDropDown.filter((d) => d.value[0])
//                           }
//                         />
//                       </div>
//                     ) : (
//                       ""
//                     )}
//                   </>
//                 )}

//                 <>
//                   <div className="col-sm-12">
//                     {selectedValue === "TASK" && selectedValue !== "" && (
//                       <label className="form-label font-weight-bold">
//                         Task Type Name :<Astrick color="red" size="13px" />
//                       </label>
//                     )}
//                     {selectedValue === "TICKET" && selectedValue !== "" && (
//                       <label className="form-label font-weight-bold">
//                         Ticket Type Name :<Astrick color="red" size="13px" />
//                       </label>
//                     )}

//                     {selectedValue === "TASK" ||
//                     modal?.modalData?.type === "TASK" ? (
//                       <input
//                         type="text"
//                         className="form-control form-control-sm"
//                         id="type_name"
//                         name="type_name"
//                         ref={typeNameRef}
//                         required
//                         defaultValue={
//                           modal.modalData && modal?.modalData?.type_name
//                         }
//                       />
//                     ) : (
//                       <>
//                         {selectedValue === "TICKET" ||
//                         modal?.modalData?.type === "TICKET" ? (
//                           <input
//                             type="text"
//                             className="form-control form-control-sm"
//                             id="type_name"
//                             name="type_name"
//                             ref={typeNameRef}
//                             required
//                             defaultValue={
//                               modal.modalData && modal?.modalData?.type_name
//                             }
//                           />
//                         ) : (
//                           ""
//                         )}
//                       </>
//                     )}
//                   </div>
//                   <div className="col-sm-12">
//                     <label className="form-label font-weight-bold">
//                       Remark :
//                     </label>
//                     <textarea
//                       type="text"
//                       rows={4}
//                       className="form-control form-control-sm"
//                       id="remark"
//                       name="remark"
//                       defaultValue={modal.modalData && modal.modalData.remark}
//                     />
//                   </div>
//                   {modal.modalData && (
//                     <div className="col-sm-12">
//                       <label className="form-label font-weight-bold">
//                         Status :<Astrick color="red" size="13px" />
//                       </label>
//                       <div className="row">
//                         <div className="col-md-2">
//                           <div className="form-check">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="is_active"
//                               id="is_active_1"
//                               value="1"
//                               defaultChecked={
//                                 modal.modalData &&
//                                 modal.modalData.is_active === 1
//                                   ? true
//                                   : !modal.modalData
//                                   ? true
//                                   : false
//                               }
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="is_active_1"
//                             >
//                               Active
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-md-1">
//                           <div className="form-check">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="is_active"
//                               id="is_active_0"
//                               value="0"
//                               readOnly={modal.modalData ? false : true}
//                               defaultChecked={
//                                 modal.modalData &&
//                                 modal.modalData.is_active === 0
//                                   ? true
//                                   : false
//                               }
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="is_active_0"
//                             >
//                               Deactive
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               </div>
//             </div>

//             <Modal.Footer>
//               {!modal.modalData && (
//                 <button
//                   type="submit"
//                   className="btn btn-primary text-white"
//                   style={{
//                     backgroundColor: "#484C7F",
//                     width: "80px",
//                     padding: "8px",
//                   }}
//                 >
//                   Submit
//                 </button>
//               )}

//               {modal.modalData && (
//                 <button
//                   type="submit"
//                   className="btn btn-primary text-white"
//                   style={{
//                     backgroundColor: "#484C7F",
//                     width: "80px",
//                     padding: "8px",
//                   }}
//                 >
//                   Update
//                 </button>
//               )}

//               {/* {modal.modalData && checkRole && checkRole[0]?.can_update == 1 ? (
//                 <button
//                   type="submit"
//                   className="btn btn-primary text-white"
//                   style={{ backgroundColor: "#484C7F" }}
//                 >
//                   Update
//                 </button>
//               ) : (
//                 ""
//               )} */}
//               <button
//                 type="button"
//                 className="btn btn-danger text-white"
//                 // onClick={() => {
//                 //   handleModal({
//                 //     showModal: false,
//                 //     modalData: "",
//                 //     modalHeader: "",
//                 //   });
//                 // }}
//                 onClick={() => {
//                   dispatch(
//                     handleModalClose({
//                       showModal: false,
//                       modalData: "",
//                       modalHeader: "",
//                     })
//                   );
//                 }}
//               >
//                 Cancel
//               </button>
//             </Modal.Footer>
//             {/* <Modal.Footer>
//               <ButtonComponent type="submit" text="Submit" />
//               <ButtonComponent
//                 type="button"
//                 buttonColor="danger"
//                 textColor="white"
//                 getClick={handleButtonClick}
//                 text="Cancel"
//               />
//             </Modal.Footer> */}
//           </form>
//         </Modal.Body>
//       </Modal>
//       {/* Modal For Add and Edit Data */}

//       <div className="card mt-2">
//         <div className="card-body">
//           <div className="row clearfix g-3">
//             <div className="col-sm-12">
//               {tasktype && (
//                 <DataTable
//                   columns={columns}
//                   data={tasktype.filter((customer) => {
//                     if (typeof searchTerm === "string") {
//                       if (typeof customer === "string") {
//                         return customer
//                           .toLowerCase()
//                           .includes(searchTerm.toLowerCase());
//                       } else if (typeof customer === "object") {
//                         return Object.values(customer).some(
//                           (value) =>
//                             typeof value === "string" &&
//                             value
//                               .toLowerCase()
//                               .includes(searchTerm.toLowerCase())
//                         );
//                       }
//                     }
//                     return false;
//                   })}
//                   defaultSortField="title"
//                   pagination
//                   selectableRows={false}
//                   className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//                   highlightOnHover={true}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TaskAndTicketTypeMaster;



import React, { useEffect, useState, useRef } from "react";
import {
  ButtonComponent,
  DropdownComponent,
  SearchComponent,
} from "../../../components/Utilities/Button/Button";

import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import PageHeader from "../../../components/Common/PageHeader";
import { Modal } from "react-bootstrap";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";
import Alert from "../../../components/Common/Alert";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { el } from "date-fns/locale";

function TaskAndTicketTypeMaster(props) {
  const [selectedValue, setSelectedValue] = useState("");
  const [notify, setNotify] = useState();
  const [data, setData] = useState();
  const [parent, setParent] = useState();
  const [loading, setLoading] = useState(false);

  const [exportData, setExportData] = useState(null);

  const typeRef = useRef(null);
  const parentRef = useRef(null);
  const typeNameRef = useRef(null);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const dropdownData = [
    { value: "TASK", label: "TASK" },
    { value: "TICKET", label: "TICKET" },
    // Add more options as needed
  ];
  const loadData = async () => {
    const exportTempData = [];

    await new TaskTicketTypeService().getAllType().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          let counter = 1;
          var tempData = [];
          const temp = res.data.data;

          for (const key in temp) {
            tempData.push({
              counter: counter++,
              id: temp[key].id,
              type: temp[key].type,
              parent_id: temp[key].parent_id,

              type_name: temp[key].type_name,
              remark: temp[key].remark,
              is_active: temp[key].is_active,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
            });
          }
          setData(null);
          setData(tempData);

          for (const i in temp) {
            exportTempData.push({
              SrNo: exportTempData.length + 1,

              id: temp[i].id,
              type: temp[i].type,

              parent_name: temp[i].parent_name,
              type_name: temp[i].type_name,
              remark: temp[i].remark,
              is_active: temp[i].is_active,
              created_at: temp[i].created_at,
              created_by: temp[i].created_by,
              updated_at: temp[i].updated_at,
              updated_by: temp[i].updated_by,
            });
          }

          setExportData(null);

          setExportData(exportTempData);
        }
      }
    });

    await new TaskTicketTypeService().getParent().then((res) => {
      if (res.status === 200) {
        const mappedData = res.data.data.map((d) => ({
          value: d.id,
          label: d.type_name,
        }));
        setParent(mappedData);
      } else {
        console.error("error", res.status);
      }
    });
  };
  const columns = [
    // Columns definition..
    {
      name: "Action",
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,

                modalHeader: "Edit Task /Ticket Type",
              });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      ),
    },
    {
      name: "Sr",
      selector: (row) => row.counter,
      sortable: true,
    },

    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: "125px",
    },
    {
      name: "Parent",
      width: "150px",
      cell: (row) => {
        if (parent) {
          const parent_name =
            parent &&
            parent

              ?.filter((d) => d.value == row.parent_id)
              .map((d) => ({ value: d.value, label: d.label }));
          return <span>{parent_name[0]?.label}</span>;
        }
      },
    },
    {
      name: "Type Name",
      selector: (row) => row.type_name,
      sortable: true,
      width: "125px",
    },

    {
      name: "Status",
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary" style={{ width: "4rem" }}>
              Active
            </span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger" style={{ width: "4rem" }}>
              Deactive
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
      width: "175px",
    },
    {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: true,
      width: "150px",
    },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      sortable: true,
      width: "175px",
    },
    {
      name: "Updated By",
      selector: (row) => row.updated_by,
      sortable: true,
      width: "150px",
    },
  ];
  const searchRef = useRef();

  function searchInData(data, search) {
    const lowercaseSearch = search.toLowerCase();

    return data.filter((d) => {
      for (const key in d) {
        if (
          typeof d[key] === "string" &&
          d[key].toLowerCase().includes(lowercaseSearch)
        ) {
          return true;
        }
      }
      return false;
    });
  }

  const handleSearch = () => {
    const searchValue = searchRef.current.value;
    const result = searchInData(data, searchValue);
    setData(result);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const handleButtonClick = (e) => {
    setModal({ showModal: false });
  };

  const handleModal = (data) => {
    setModal(data);
  };

  const handleDropdownChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();

    if (!id) {
      if (selectedValue === "") {
        alert("Type is required.");
        return;
      }
    }
    if (id) {
      if (modal.modalData.type === "") {
        alert("Type is required.");
        return;
      }
    }

    setNotify(null);
    const form = new FormData(e.target);
    if (!id) {
      await new TaskTicketTypeService().postType(form).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setNotify({ type: "success", message: res.data.message });
            setModal({ showModal: false });
            loadData();
          } else {
            // setLoading(false);
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          // setLoading(false);
          setNotify({ type: "danger", message: res.data.message });
        }
      });
    } else {
      // console.log("loading" ,loading)
      // setSelectedValue(modal?.modalData?.type);
      await new TaskTicketTypeService()._updateType(id, form).then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setNotify({ type: "success", message: res.data.message });
            setModal({ showModal: false });
            loadData();
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          // setLoading(false);
          setNotify({ type: "danger", message: res.data.message });
        }
      });
    }
    // setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container-xxl">
      {notify && (
        <>
          {" "}
          <Alert alertData={notify} />{" "}
        </>
      )}
      <PageHeader
        headerTitle="Ticket And Task Type Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <button
                className="btn btn-dark btn-set-task w-sm-100"
                onClick={() => {
                  handleModal({
                    showModal: true,
                    modalData: "",
                    modalHeader: "Add Task/Ticket Type",
                  });
                  setSelectedValue("");
                }}
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add
              </button>
            </div>
          );
        }}
      />

      <div>
        <SearchComponent
          placeholder="Search ...."
          handleKeyDown={handleKeyDown}
          ref={searchRef}
          className="btn btn-sm btn-warning text-white"
          style={{
            marginTop: "0px",
            fontWeight: "600",
            color: "red !important",
          }}
          buttonName1="Search"
          buttonName2="Reset"
          Searchicon="icofont-search-1 "
          className2="btn btn-sm btn-info text-white"
          handleSearch={handleSearch}
          className3="btn btn-sm btn-danger"
          fileName="Task and Ticket type file"
          apiData={exportData}
        />
      </div>

      {/* Modal For Add and Edit Data */}
      <Modal
        centered
        show={modal.showModal}
        onHide={(e) => {
          handleModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            method="post"
            onSubmit={handleForm(modal.modalData ? modal.modalData.id : "")}
          >
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label
                    className="form-label font-weight-bold"
                    readOnly={true}
                  >
                    Select type: <Astrick color="red" size="13px" />
                  </label>
                  <DropdownComponent
                    required={true}
                    name="type"
                    ref={typeRef}
                    data={dropdownData}
                    getInputValue={handleDropdownChange}
                    className="form-control form-control-sm"
                    placeholder="select"
                    selectedValue={modal.modalData && modal.modalData.type}
                  />
                </div>

                {selectedValue === "TASK" ||
                modal?.modalData?.type === "TASK" ? (
                  <>
                    <div className="col-sm-12">
                      <label
                        className="form-label font-weight-bold"
                        readOnly={true}
                      >
                        Parent Task Type 
                        <Astrick color="red" size="13px" />
                      </label>
                      <Select
                        options={parent}
                        id="parent_id"
                        name="parent_id"
                        required
                        defaultValue={
                          modal.modalData
                            ? (modal.modalData &&
                              parent &&
                              parent.filter(
                                (d) => d.value == modal.modalData.parent_id
                              )
                            ):( parent && parent.filter((d) => d.value == 0))
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {selectedValue === "TICKET" ||
                    modal?.modalData?.type === "TICKET" ? (
                      <div className="col-sm-12">
                        <label
                          className="form-label font-weight-bold"
                          readOnly={true}
                        >
                          Parent Ticket Type
                          <Astrick color="red" size="13px" />
                        </label>
                        <Select
                          options={parent}
                          id="parent_id"
                          name="parent_id"
                          required
                          defaultValue={
                            modal.modalData
                              ? modal.modalData &&
                                parent &&
                                parent.filter(
                                  (d) => d.value == modal.modalData.parent_id
                                )
                              : parent && parent.filter((d) => d.value[0])
                          }
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                )}

                <>
                  <div className="col-sm-12">
                    {selectedValue === "TASK" && selectedValue !== "" && (
                      <label className="form-label font-weight-bold">
                        Task Type Name :<Astrick color="red" size="13px" />
                      </label>
                    )}
                    {selectedValue === "TICKET" && selectedValue !== "" && (
                      <label className="form-label font-weight-bold">
                        Ticket Type Name :<Astrick color="red" size="13px" />
                      </label>
                    )}

                    {selectedValue === "TASK" ||
                    modal?.modalData?.type === "TASK" ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="type_name"
                        name="type_name"
                        ref={typeNameRef}
                        required
                        defaultValue={
                          modal.modalData && modal?.modalData?.type_name
                        }
                      />
                    ) : (
                      <>
                        {selectedValue === "TICKET" ||
                        modal?.modalData?.type === "TICKET" ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="type_name"
                            name="type_name"
                            ref={typeNameRef}
                            required
                            defaultValue={
                              modal.modalData && modal?.modalData?.type_name
                            }
                          />
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </div>
                  <div className="col-sm-12">
                    <label className="form-label font-weight-bold">
                      Remark :
                    </label>
                    <textarea
                      type="text"
                      rows={4}
                      className="form-control form-control-sm"
                      id="remark"
                      name="remark"
                      defaultValue={modal.modalData && modal.modalData.remark}
                    />
                  </div>
                  {modal.modalData && (
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Status :<Astrick color="red" size="13px" />
                      </label>
                      <div className="row">
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_1"
                              value="1"
                              defaultChecked={
                                modal.modalData &&
                                modal.modalData.is_active === 1
                                  ? true
                                  : !modal.modalData
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_1"
                            >
                              Active
                            </label>
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_0"
                              value="0"
                              readOnly={modal.modalData ? false : true}
                              defaultChecked={
                                modal.modalData &&
                                modal.modalData.is_active === 0
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_0"
                            >
                              Deactive
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              </div>
            </div>
            <Modal.Footer>
              <ButtonComponent type="submit" text="Submit" />
              <ButtonComponent
                type="button"
                buttonColor="danger"
                textColor="white"
                getClick={handleButtonClick}
                text="Cancel"
              />
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
      {/* Modal For Add and Edit Data */}

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {data && (
                <DataTable
                  columns={columns}
                  data={data}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAndTicketTypeMaster;
