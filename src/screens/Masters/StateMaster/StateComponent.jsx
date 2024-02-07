// import React, { useEffect, useState, useRef } from "react";
// import { Modal } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import ErrorLogService from "../../../services/ErrorLogService";
// import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
// import StateService from "../../../services/MastersService/StateService";
// import CountryService from "../../../services/MastersService/CountryService";
// import PageHeader from "../../../components/Common/PageHeader";
// import Select from "react-select";

// import { Astrick } from "../../../components/Utilities/Style";
// import * as Validation from "../../../components/Utilities/Validation";
// import Alert from "../../../components/Common/Alert";
// import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
// import { Spinner } from "react-bootstrap";

// function StateComponent() {
//   const [data, setData] = useState(null);
//   const [notify, setNotify] = useState();
//   const [showLoaderModal, setShowLoaderModal] = useState(false);

//   const [modal, setModal] = useState({
//     showModal: false,
//     modalData: "",
//     modalHeader: "",
//   });

//   const [country, setCountry] = useState(null);
//   const [countryDropdown, setCountryDropdown] = useState(null);
//   const [exportData, setExportData] = useState(null);
//   const roleId = sessionStorage.getItem("role_id");
//   const [checkRole, setCheckRole] = useState(null);
//   const [state, setState] = useState(null);

//   const handleModal = (data) => {
//     setModal(data);
//   };

//   const searchRef = useRef();

//   function SearchInputData(data, search) {
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


//   const handleSearch = () => {
//     const SearchValue = searchRef.current.value;
//     const result = SearchInputData(data, SearchValue);
//     setData(result);
//   };

  

//   const columns = [
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
//               handleModal({
//                 showModal: true,
//                 modalData: row,
//                 modalHeader: "Edit State",
//               });
//             }}
//           >
//             <i className="icofont-edit text-success"></i>
//           </button>
//         </div>
//       ),
//       width: "80px",
//     },
//     {
//       name: "Sr",
//       selector: (row) => row.counter,
//       sortable: true,
//       width: "60px",
//     },
//     {
//       name: "State",
//       selector: (row) => row.state,
//       sortable: true,
//       width: "125px",
//     },
//     {
//       name: "Country",
//       selector: (row) => row.country,
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
//       width: "100px",
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
//       width: "175px",
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
//       width: "175px",
//     },
//   ];

//   const loadData = async () => {
//     setShowLoaderModal(null);
//     // setShowLoaderModal(true);
//     const data = [];
//     const exportTempData = [];
//     await new StateService()
//       .getState()
//       .then((res) => {
//         if (res.status === 200) {
//           setShowLoaderModal(false);
//           let counter = 1;
//           const temp = res.data.data;
//           for (const key in temp) {
//             data.push({
//               counter: counter++,
//               id: temp[key].id,
//               state: temp[key].state,
//               country: temp[key].country,
//               country_id: temp[key].country_id,
//               is_active: temp[key].is_active,
//               remark: temp[key].remark,
//               created_at: temp[key].created_at,
//               created_by: temp[key].created_by,
//               updated_at: temp[key].updated_at,
//               updated_by: temp[key].updated_by,
//             });
//           }
//           setData(null);
//           setData(data);
//           setState(data);
//           for (const i in data) {
//             exportTempData.push({
//               Sr: data[i].counter,
//               State: data[i].state,
//               Country: data[i].country,
//               Status: data[i].is_active ? "Active" : "Deactive",
//               Remark:temp[i].remark,
//               created_at: temp[i].created_at,
//               created_by: temp[i].created_by,
//               updated_at: data[i].updated_at,
//               updated_by: data[i].updated_by,
//             });
//           }
//           setExportData(null);
//           setExportData(exportTempData);
//         }
//       })
//       .catch((error) => {
//         const { response } = error;
//         const { request, ...errorObject } = response;
//         new ErrorLogService().sendErrorLog(
//           "State",
//           "Get_State",
//           "INSERT",
//           errorObject.data.message
//         );
//       });

//     await new CountryService().getCountrySort().then((res) => {
//       if (res.status === 200) {
//         setShowLoaderModal(false);
//         if (res.data.status == 1) {
//           setCountry(res.data.data.filter((d) => d.is_active === 1));
//           setCountryDropdown(
//             res.data.data
//               .filter((d) => d.is_active == 1)
//               .map((d) => ({ value: d.id, label: d.country }))
//           );
//         }
//       }
//     });

//     await new ManageMenuService().getRole(roleId).then((res) => {
//       if (res.status === 200) {
//         setShowLoaderModal(false);
//         if (res.data.status == 1) {
//           const getRoleId = sessionStorage.getItem("role_id");
//           setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//         }
//       }
//     });
//   };

//   const handleForm = (id) => async (e) => {
//     e.preventDefault();
//     setNotify(null);
//     const form = new FormData(e.target);
//     var flag = 1;
//     // var a = JSON.stringify(Object.fromEntries(form))
//     // console.log(a)

//     var selectCountry = form.getAll("country_id");
//     if (selectCountry == "0") {
//       flag = 0;
//       //  setNotify(null);
//       alert("Please Select Country");
//       // setNotify({ type: 'danger', message: "Please Select Country" });
//     }

//     if (flag === 1) {
//       if (!id) {
//         await new StateService()
//           .postState(form)
//           .then((res) => {
//             if (res.status === 200) {
//               setShowLoaderModal(false);
//               if (res.data.status === 1) {
//                 setNotify({ type: "success", message: res.data.message });
//                 setModal({ showModal: false, modalData: "", modalHeader: "" });
//                 loadData();
//               } else {
//                 setNotify({ type: "danger", message: res.data.message });
//               }
//             } else {
//               setNotify({ type: "danger", message: res.message });
//               new ErrorLogService().sendErrorLog(
//                 "State",
//                 "Create_State",
//                 "INSERT",
//                 res.message
//               );
//             }
//           })
//           .catch((error) => {
//             const { response } = error;
//             const { request, ...errorObject } = response;
//             setNotify({ type: "danger", message: "Request Error !!!" });
//             new ErrorLogService().sendErrorLog(
//               "State",
//               "Create_State",
//               "INSERT",
//               errorObject.data.message
//             );
//           });
//       } else {
//         await new StateService()
//           .updateState(id, form)
//           .then((res) => {
//             if (res.status === 200) {
//               setShowLoaderModal(false);
//               if (res.data.status === 1) {
//                 setNotify({ type: "success", message: res.data.message });
//                 setModal({ showModal: false, modalData: "", modalHeader: "" });
//                 loadData();
//               } else {
//                 setNotify({ type: "danger", message: res.data.message });
//               }
//             } else {
//               setNotify({ type: "danger", message: res.message });
//               new ErrorLogService().sendErrorLog(
//                 "State",
//                 "Edit_State",
//                 "INSERT",
//                 res.message
//               );
//             }
//           })
//           .catch((error) => {
//             const { response } = error;
//             const { request, ...errorObject } = response;
//             setNotify({ type: "danger", message: "Request Error !!!" });
//             new ErrorLogService().sendErrorLog(
//               "State",
//               "Edit_State",
//               "INSERT",
//               errorObject.data.message
//             );
//           });
//       }
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       handleSearch();
//     }
//   };

//   useEffect(() => {
//     if(checkRole && checkRole[5].can_read === 0){
//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
//     }
//   }, [checkRole]);

//   useEffect(()=>{
// loadData();
//   },[])

//   return (
//     <div className="container-xxl">
//       {notify && <Alert alertData={notify} />}
//       <PageHeader
//         headerTitle="State Master"
//         renderRight={() => {
//           return (
//             <div className="col-auto d-flex w-sm-100">
//               {checkRole && checkRole[5].can_create == 1 ? (
//                 <button
//                   className="btn btn-dark btn-set-task w-sm-100"
//                   onClick={() => {
//                     handleModal({
//                       showModal: true,
//                       modalData: null,
//                       modalHeader: "Add State",
//                     });
//                   }}
//                 >
//                   <i className="icofont-plus-circle me-2 fs-6"></i>Add State
//                 </button>
//               ) : (
//                 ""
//               )}
//             </div>
//           );
//         }}
//       />

//       <div className="card card-body">
//         <div className="row">
//           <div className="col-md-9">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search by State Name...."
//               ref={searchRef}
//               onKeyDown={handleKeyDown}
//             />
//           </div>
//           <div className="col-md-3">
//             <button
//               className="btn btn-sm btn-warning text-white"
//               type="button"
//               onClick={handleSearch}
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
//               fileName="State master Records"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="card mt-2">
//         <div className="card-body">
//           <div className="row clearfix g-3">
//             <div className="col-sm-12">
//               {data && (
//                 <DataTable
//                   columns={columns}
//                   data={data}
//                   defaultSortField="title"
//                   pagination
//                   selectableRows={false}
//                   className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//                   highlightOnHover={true}
//                 />
//               )}
//             </div>
//             <Modal show={showLoaderModal} centered>
//               <Modal.Body className="text-center">
//                 <Spinner animation="grow" variant="primary" />
//                 <Spinner animation="grow" variant="secondary" />
//                 <Spinner animation="grow" variant="success" />
//                 <Spinner animation="grow" variant="danger" />
//                 <Spinner animation="grow" variant="warning" />
//                 <Spinner animation="grow" variant="info" />
//                 <Spinner animation="grow" variant="dark" />
//               </Modal.Body>
//             </Modal>
//           </div>
//         </div>
//       </div>

//       <Modal
//         centered
//         show={modal.showModal}
//         onHide={(e) => {
//           handleModal({
//             showModal: false,
//             modalData: "",
//             modalHeader: "",
//           });
//         }}
//       >
//         <form
//           method="post"
//           onSubmit={handleForm(modal.modalData ? modal.modalData.id : "")}
//         >
//           <Modal.Header closeButton>
//             <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="deadline-form">
//               <div className="row g-3 mb-3">
//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Select Country :<Astrick color="red" size="13px" />
//                   </label>

//                   <Select
//                     options={countryDropdown}
//                     id="country_id"
//                     name="country_id"
//                     defaultValue={
//                       modal.modalData
//                         ? countryDropdown.filter(
//                             (d) => modal.modalData.country_id == d.value
//                           )
//                         : ""
//                     }
//                     required={true}
//                   />
//                 </div>
//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     State Name :<Astrick color="red" size="13px" />
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     id="state"
//                     name="state"
//                     maxLength={25}
//                     required
//                     defaultValue={modal.modalData ? modal.modalData.state : ""}
//                     onKeyPress={(e) => {
//                       Validation.CharacterWithSpace(e);
//                     }}
//                     onPaste={(e) => {
//                       e.preventDefault();
//                       return false;
//                     }}
//                     onCopy={(e) => {
//                       e.preventDefault();
//                       return false;
//                     }}
//                   />
//                 </div>
//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Remark :
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     id="remark"
//                     name="remark"
//                     maxLength={50}
//                     defaultValue={modal.modalData ? modal.modalData.remark : ""}
//                   />
//                 </div>

//                 {modal.modalData && (
//                   <div className="col-sm-12">
//                     <label className="form-label font-weight-bold">
//                       Status :<Astrick color="red" size="13px" />
//                     </label>
//                     <div className="row">
//                       <div className="col-md-2">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="is_active"
//                             id="is_active_1"
//                             value="1"
//                             defaultChecked={
//                               modal.modalData && modal.modalData.is_active === 1
//                                 ? true
//                                 : !modal.modalData
//                                 ? true
//                                 : false
//                             }
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor="is_active_1"
//                           >
//                             Active
//                           </label>
//                         </div>
//                       </div>
//                       <div className="col-md-1">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="is_active"
//                             id="is_active_0"
//                             value="0"
//                             readOnly={modal.modalData ? false : true}
//                             defaultChecked={
//                               modal.modalData && modal.modalData.is_active === 0
//                                 ? true
//                                 : false
//                             }
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor="is_active_0"
//                           >
//                             Deactive
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>


//             {!modal.modalData && (
//               <button
//                 type="submit"
//                 className="btn btn-primary text-white"
//                 style={{ backgroundColor: "#484C7F",width:'80px',padding:"8px" }}
//               >
//                 Add
//               </button>
//             )}
//             {modal.modalData && checkRole && checkRole[5].can_update == 1 ? (
//               <button
//                 type="submit"
//                 className="btn btn-primary text-white"
//                 style={{ backgroundColor: "#484C7F" }}
//               >
//                 Update
//               </button>
//             ) : (
//               ""
//             )}
//             <button
//               type="button"
//               className="btn btn-danger text-white"
//               onClick={() => {
//                 handleModal({
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
//     </div>
//   );
// }

// function StateDropdown(props) {
//   const [data, setData] = useState(null);
//   useEffect(async () => {
//     const tempData = [];
//     await new StateService().getState().then((res) => {
//       if (res.status === 200) {
//         const data = res.data.data;
//         let counter = 1;
//         for (const key in data) {
//           if (data[key].is_active == 1) {
//             tempData.push({
//               counter: counter++,
//               id: data[key].id,
//               state: data[key].state,
//             });
//           }
//         }
//         setData(tempData);
//       }
//     });
//   }, []);

//   return (
//     <>
//       {data && (
//         <select
//           className="form-control form-control-sm"
//           id={props.id}
//           name={props.name}
//           onChange={props.getChangeValue}
//           required={props.required ? true : false}
//         >
//           {props.defaultValue == 0 && (
//             <option value={0} selected>
//               Select State
//             </option>
//           )}
//           {props.defaultValue != 0 && <option value={0}>Select State</option>}
//           {data.map(function (item, i) {
//             if (props.countryId && props.countryId == item.country_id) {
//               return (
//                 <option key={i} value={item.id} selected>
//                   {item.state}
//                 </option>
//               );
//             } else if (props.defaultValue && props.defaultValue == item.id) {
//               return (
//                 <option key={i} value={item.id} selected>
//                   {item.state}
//                 </option>
//               );
//             } else {
//               return (
//                 <option key={i} value={item.id}>
//                   {item.state}
//                 </option>
//               );
//             }
//           })}
//         </select>
//       )}
//       {!data && <p> Loading....</p>}
//     </>
//   );
// }

// export { StateComponent, StateDropdown };


import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import StateService from "../../../services/MastersService/StateService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from "react-select";

import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Alert from "../../../components/Common/Alert";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import { Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { dashboardSlice, handleModalClose } from "../../Dashboard/DashbordSlice";
import { getCountryDataSort, getStateData, postStateData, updateStateData } from "../../Dashboard/DashboardAction";
import { handleModalInStore } from "../../Dashboard/DashbordSlice";
function StateComponent() {
  const [data, setData] = useState(null);
  const [notify, setNotify] = useState();
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  // const [modal, setModal] = useState({
  //   showModal: false,
  //   modalData: "",
  //   modalHeader: "",
  // });

  const [country, setCountry] = useState(null);
  const [countryDropdown, setCountryDropdown] = useState(null);
  const [exportData, setExportData] = useState(null);
  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);
  const [state, setState] = useState(null);

  // const handleModal = (data) => {
  //   setModal(data);
  // };

  const searchRef = useRef();

  const dispatch = useDispatch();
  const stateData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.stateData
  );
  console.log('stateData', stateData)
  const modal = useSelector((dashboardSlice) => dashboardSlice.dashboard.modal);
  const Notify = useSelector( (dashboardSlice) => dashboardSlice.dashboard.notify);
  const CountryData = useSelector((dashboardSlice)=>dashboardSlice.dashboard.filteredCountryData)
  const ExportData = useSelector((dashboardSlice)=>dashboardSlice.dashboard.exportData)
  

  function SearchInputData(data, search) {
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
    const SearchValue = searchRef.current.value;
    const result = SearchInputData(data, SearchValue);
    setData(result);
  };

  const columns = [
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
              dispatch(
                handleModalInStore({
                  showModal: true,
                  modalData: row,
                  modalHeader: "Edit State",
                }))
              // handleModal({
              //   showModal: true,
              //   modalData: row,
              //   modalHeader: "Edit State",
              // });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      ),
      width: "80px",
    },
    {
      name: "Sr",
      selector: (row) => row.counter,
      sortable: true,
      width: "60px",
    },
    {
      name: "State",
      selector: (row) => row.state,
      sortable: true,
      width: "125px",
    },
    {
      name: "Country",
      selector: (row) => row.country,
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
      width: "100px",
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
      width: "175px",
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
      width: "175px",
    },
  ];

  const loadData = async () => {
   
    setShowLoaderModal(null);
    // setShowLoaderModal(true);
    const data = [];
    const exportTempData = [];
    // await new StateService()
    //   .getState()
    //   .then((res) => {
    //     if (res.status === 200) {
    //       setShowLoaderModal(false);
    //       let counter = 1;
    //       const temp = res.data.data;
    //       for (const key in temp) {
    //         data.push({
    //           counter: counter++,
    //           id: temp[key].id,
    //           state: temp[key].state,
    //           country: temp[key].country,
    //           country_id: temp[key].country_id,
    //           is_active: temp[key].is_active,
    //           remark: temp[key].remark,
    //           created_at: temp[key].created_at,
    //           created_by: temp[key].created_by,
    //           updated_at: temp[key].updated_at,
    //           updated_by: temp[key].updated_by,
    //         });
    //       }
    //       setData(null);
    //       setData(data);
    //       setState(data);
    //       for (const i in data) {
    //         exportTempData.push({
    //           Sr: data[i].counter,
    //           State: data[i].state,
    //           Country: data[i].country,
    //           Status: data[i].is_active ? "Active" : "Deactive",
    //           Remark:temp[i].remark,
    //           created_at: temp[i].created_at,
    //           created_by: temp[i].created_by,
    //           updated_at: data[i].updated_at,
    //           updated_by: data[i].updated_by,
    //         });
    //       }
    //       setExportData(null);
    //       setExportData(exportTempData);
    //     }
    //   })
    //   .catch((error) => {
    //     const { response } = error;
    //     const { request, ...errorObject } = response;
    //     new ErrorLogService().sendErrorLog(
    //       "State",
    //       "Get_State",
    //       "INSERT",
    //       errorObject.data.message
    //     );
    //   });

    // await new CountryService().getCountrySort().then((res) => {
    //   if (res.status === 200) {
    //     setShowLoaderModal(false);
    //     if (res.data.status == 1) {
    //       setCountry(res.data.data.filter((d) => d.is_active === 1));
    //       setCountryDropdown(
    //         res.data.data
    //           .filter((d) => d.is_active == 1)
    //           .map((d) => ({ value: d.id, label: d.country }))
    //       );
    //     }
    //   }
    // });

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        setShowLoaderModal(false);
        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
        }
      }
    });
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);
    var flag = 1;
    // var a = JSON.stringify(Object.fromEntries(form))
    // console.log(a)

    var selectCountry = form.getAll("country_id");
    if (selectCountry == "0") {
      flag = 0;
      //  setNotify(null);
      alert("Please Select Country");
      // setNotify({ type: 'danger', message: "Please Select Country" });
    }

    if (flag === 1) {
      if (!id) {
        dispatch(postStateData(form));
        // await new StateService()
        //   .postState(form)
        //   .then((res) => {
        //     if (res.status === 200) {
        //       setShowLoaderModal(false);
        //       if (res.data.status === 1) {
        //         setNotify({ type: "success", message: res.data.message });
        //         setModal({ showModal: false, modalData: "", modalHeader: "" });
        //         loadData();
        //       } else {
        //         setNotify({ type: "danger", message: res.data.message });
        //       }
        //     } else {
        //       setNotify({ type: "danger", message: res.message });
        //       new ErrorLogService().sendErrorLog(
        //         "State",
        //         "Create_State",
        //         "INSERT",
        //         res.message
        //       );
        //     }
        //   })
        //   .catch((error) => {
        //     const { response } = error;
        //     const { request, ...errorObject } = response;
        //     setNotify({ type: "danger", message: "Request Error !!!" });
        //     new ErrorLogService().sendErrorLog(
        //       "State",
        //       "Create_State",
        //       "INSERT",
        //       errorObject.data.message
        //     );
        //   });
      } else {
        dispatch(updateStateData({id:id,payload: form}))
        // await new StateService()
        //   .updateState(id, form)
        //   .then((res) => {
        //     if (res.status === 200) {
        //       setShowLoaderModal(false);
        //       if (res.data.status === 1) {
        //         setNotify({ type: "success", message: res.data.message });
        //         // setModal({ showModal: false, modalData: "", modalHeader: "" });
        //         loadData();
        //       } else {
        //         setNotify({ type: "danger", message: res.data.message });
        //       }
        //     } else {
        //       setNotify({ type: "danger", message: res.message });
        //       new ErrorLogService().sendErrorLog(
        //         "State",
        //         "Edit_State",
        //         "INSERT",
        //         res.message
        //       );
        //     }
        //   })
        //   .catch((error) => {
        //     const { response } = error;
        //     const { request, ...errorObject } = response;
        //     setNotify({ type: "danger", message: "Request Error !!!" });
        //     new ErrorLogService().sendErrorLog(
        //       "State",
        //       "Edit_State",
        //       "INSERT",
        //       errorObject.data.message
        //     );
        //   });
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (checkRole && checkRole[5].can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    loadData();
  // const CountryData = useSelector((dashboardSlice)=>dashboardSlice.dashboard.filteredCountryData)
if(!stateData.length ){
  dispatch(getStateData());
  dispatch(getCountryDataSort())
}

  }, [stateData,dispatch]);



  return (
    <div className="container-xxl">
      {Notify && <Alert alertData={Notify} />}
      <PageHeader
        headerTitle="State Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[5].can_create == 1 ? (
                <button
                  className="btn btn-dark btn-set-task w-sm-100"
                  onClick={() => {
                    dispatch(
                      handleModalInStore({
                        showModal: true,
                        modalData: null,
                        modalHeader: "Add State",
                      })
                    );
                    // handleModal({
                    //   showModal: true,
                    //   modalData: null,
                    //   modalHeader: "Add State",
                    // });
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add State
                </button>
              ) : (
                ""
              )}
            </div>
          );
        }}
      />

      <div className="card card-body">
        <div className="row">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Search by State Name...."
              ref={searchRef}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              onClick={handleSearch}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
            <ExportToExcel
              className="btn btn-sm btn-danger"
              apiData={ExportData}
              fileName="State master Records"
            />
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {stateData && (
                <DataTable
                  columns={columns}
                  data={stateData}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
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
          </div>
        </div>
      </div>

      <Modal
        centered
        show={modal.showModal}
        // onHide={(e) => {
        //   handleModal({
        //     showModal: false,
        //     modalData: "",
        //     modalHeader: "",
        //   });
        // }}
      >
        <form
          method="post"
          onSubmit={handleForm(modal.modalData ? modal.modalData.id : "")}
        >
          <Modal.Header closeButton onClick={() => {dispatch(
                      handleModalClose({
                        showModal: false,
                        modalData: null,
                        modalHeader: "Add State",
                      }))}}>
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Select Country :<Astrick color="red" size="13px" />
                  </label>

                  <Select
                    options={CountryData}
                    id="country_id"
                    name="country_id"
                    defaultValue={
                      modal.modalData
                        ? CountryData.filter(
                            (d) => modal.modalData.country_id == d.value
                          )
                        : ""
                    }
                    required={true}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    State Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="state"
                    name="state"
                    maxLength={25}
                    required
                    defaultValue={modal.modalData ? modal.modalData.state : ""}
                    onKeyPress={(e) => {
                      Validation.CharacterWithSpace(e);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Remark :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="remark"
                    name="remark"
                    maxLength={50}
                    defaultValue={modal.modalData ? modal.modalData.remark : ""}
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
                              modal.modalData && modal.modalData.is_active === 1
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
                              modal.modalData && modal.modalData.is_active === 0
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
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!modal.modalData && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{
                  backgroundColor: "#484C7F",
                  width: "80px",
                  padding: "8px",
                }}
              >
                Add
              </button>
            )}
            {modal.modalData && checkRole && checkRole[5].can_update == 1 ? (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: "#484C7F" }}
              >
                Update
              </button>
            ) : (
              ""
            )}
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {dispatch(
                handleModalClose({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                }))}}
              // onClick={() => {
                // handleModal({
                //   showModal: false,
                //   modalData: "",
                //   modalHeader: "",
                // });
                
              // }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

function StateDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(async () => {
    const tempData = [];
    await new StateService().getState().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        let counter = 1;
        for (const key in data) {
          if (data[key].is_active == 1) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              state: data[key].state,
            });
          }
        }
        setData(tempData);
      }
    });
  }, []);

  return (
    <>
      {data && (
        <select
          className="form-control form-control-sm"
          id={props.id}
          name={props.name}
          onChange={props.getChangeValue}
          required={props.required ? true : false}
        >
          {props.defaultValue == 0 && (
            <option value={0} selected>
              Select State
            </option>
          )}
          {props.defaultValue != 0 && <option value={0}>Select State</option>}
          {data.map(function (item, i) {
            if (props.countryId && props.countryId == item.country_id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.state}
                </option>
              );
            } else if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.state}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.state}
                </option>
              );
            }
          })}
        </select>
      )}
      {!data && <p> Loading....</p>}
    </>
  );
}

export { StateComponent, StateDropdown };

