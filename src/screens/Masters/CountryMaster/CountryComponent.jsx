// import React, { useEffect, useState, useRef } from "react";
// import { Modal } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import ErrorLogService from "../../../services/ErrorLogService";
// import CountryService from "../../../services/MastersService/CountryService";
// import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
// import PageHeader from "../../../components/Common/PageHeader";
// import Select from "react-select";
// import { Astrick } from "../../../components/Utilities/Style";
// import * as Validation from "../../../components/Utilities/Validation";
// import Alert from "../../../components/Common/Alert";
// import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
// import DataTableExtensions from "react-data-table-component-extensions";
// import { Spinner } from "react-bootstrap";

// function CountryComponent() {
//   const [data, setData] = useState(null);
//   const [country, setCountry] = useState(null);
//   const [notify, setNotify] = useState();
//   const [showLoaderModal, setShowLoaderModal] = useState(false);

//   const [modal, setModal] = useState({
//     showModal: false,
//     modalData: "",
//     modalHeader: "",
//   });
//   const [exportData, setExportData] = useState(null);

//   const roleId = sessionStorage.getItem("role_id");
//   const [checkRole, setCheckRole] = useState(null);

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
//       width: "100px",
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             data-bs-toggle="modal"
//             data-bs-target="#depedit"
//             onClick={(e) => {
//               handleModal({
//                 showModal: true,
//                 modalData: row,
//                 modalHeader: "Edit Country",
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
//           {row.is_active === 1 && (
//             <span className="badge bg-primary" style={{ width: "4rem" }}>
//               Active
//             </span>
//           )}
//           {row.is_active === 0 && (
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
//     await new CountryService()
//       .getCountry()
//       .then((res) => {
//         if (res.status === 200) {
//           setShowLoaderModal(false);
//           let counter = 1;
//           const temp = res.data.data;
//           for (const key in temp) {
//             data.push({
//               counter: counter++,
//               id: temp[key].id,
//               country: temp[key].country,
//               remark: temp[key].remark,
//               is_active: temp[key].is_active,
//               created_at: temp[key].created_at,
//               created_by: temp[key].created_by,
//               updated_at: temp[key].updated_at,
//               updated_by: temp[key].updated_by,
//             });
//           }

//           setData(null);
//           setData(data);
//           setCountry(data);
//           for (const key in data) {
//             exportTempData.push({
//               Sr: data[key].counter,
//               Country: data[key].country,
//               Status: data[key].is_active ? "Active" : "Deactive",
//               Remark:data[key].remark,

//               created_at: temp[key].created_at,
//               created_by: temp[key].created_by,
//               updated_at: data[key].updated_at,
//               updated_by: data[key].updated_by,
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
//           "Country",
//           "Get_Country",
//           "INSERT",
//           errorObject.data.message
//         );
//       });

//     await new ManageMenuService().getRole(roleId).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           const getRoleId = sessionStorage.getItem("role_id");
//           setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//         }
//       }
//     });
//   };

//   const handleForm = (id) => async (e) => {
//     e.preventDefault();
//     const form = new FormData(e.target);
//     setNotify(null);
//     if (!id) {
//       await new CountryService()
//         .postCountry(form)
//         .then((res) => {
//           setShowLoaderModal(false);

//           if (res.status === 200) {
//             if (res.data.status === 1) {
//               setNotify({ type: "success", message: res.data.message });
//               setModal({ showModal: false, modalData: "", modalHeader: "" });
//               loadData();
//             } else {
//               setNotify({ type: "danger", message: res.data.message });
//             }
//           } else {
//             setNotify({ type: "danger", message: res.data.message });
//             new ErrorLogService().sendErrorLog(
//               "Country",
//               "Create_Country",
//               "INSERT",
//               res.message
//             );
//           }
//         })
//         .catch((error) => {
//           const { response } = error;
//           const { request, ...errorObject } = response;
//           setNotify({ type: "danger", message: "Request Error !!!" });
//           new ErrorLogService().sendErrorLog(
//             "Country",
//             "Create_Country",
//             "INSERT",
//             errorObject.data.message
//           );
//         });
//     } else {
//       await new CountryService()
//         .updateCountry(id, form)
//         .then((res) => {
//           if (res.status === 200) {
//             setShowLoaderModal(false);
//             if (res.data.status === 1) {
//               setNotify({ type: "success", message: res.data.message });
//               setModal({ showModal: false, modalData: "", modalHeader: "" });
//               loadData();
//             } else {
//               setNotify({ type: "danger", message: res.data.message });
//             }
//           } else {
//             setNotify({ type: "danger", message: res.data.message });
//             new ErrorLogService().sendErrorLog(
//               "Country",
//               "Create_Country",
//               "INSERT",
//               res.message
//             );
//           }
//         })
//         .catch((error) => {
//           const { response } = error;
//           const { request, ...errorObject } = response;
//           setNotify({ type: "danger", message: "Request Error !!!" });
//           new ErrorLogService().sendErrorLog(
//             "Country",
//             "Create_Country",
//             "INSERT",
//             errorObject.data.message
//           );
//         });
//     }
//   };

//   const tableData = {
//     columns,
//     data,
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       handleSearch();
//     }
//   };

//   useEffect(() => {
//     if (checkRole && checkRole[4].can_read === 0) {
//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
//     }
    
//   }, [checkRole])


//   useEffect(()=>{
//     loadData()

//   },[])

//   return (
//     <div className="container-xxl">
//       {notify && <Alert alertData={notify} />}
//       <PageHeader
//         headerTitle="Country Master"
//         renderRight={() => {
//           return (
//             <div className="col-auto d-flex w-sm-100">
//               {checkRole && checkRole[4].can_create == 1 ? (
//                 <button
//                   className="btn btn-dark btn-set-task w-sm-100"
//                   onClick={() => {
//                     handleModal({
//                       showModal: true,
//                       modalData: null,
//                       modalHeader: "Add Country",
//                     });
//                   }}
//                 >
//                   <i className="icofont-plus-circle me-2 fs-6"></i>Add Country
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
//               placeholder="Search by Country Name...."
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
//               fileName="Country master Records"
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
//                     Country Name :<Astrick color="red" size="13px" />
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     id="country"
//                     name="country"
//                     maxLength={25}
//                     required
//                     defaultValue={
//                       modal.modalData ? modal.modalData.country : ""
//                     }
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
           

//             {modal.modalData && checkRole && checkRole[4].can_update == 1 ? (
               
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

// function CountryDropdown(props) {
//   const [data, setData] = useState(null);
//   useEffect(async () => {
//     const tempData = [];
//     await new CountryService().getCountry().then((res) => {
//       if (res.status === 200) {
//         let counter = 1;
//         const data = res.data.data;
//         for (const key in data) {
//           if (data[key].is_active == 1) {
//             tempData.push({
//               id: data[key].id,
//               country: data[key].country,
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
//               Select Country
//             </option>
//           )}
//           {props.defaultValue != 0 && <option value={0}>Select Country</option>}
//           {data.map(function (item, i) {
//             if (props.defaultValue && props.defaultValue == item.id) {
//               return (
//                 <option key={i} value={item.id} selected>
//                   {item.country}
//                 </option>
//               );
//             } else {
//               return (
//                 <option key={i} value={item.id}>
//                   {item.country}
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

// export { CountryComponent, CountryDropdown };


import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import CountryService from "../../../services/MastersService/CountryService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Alert from "../../../components/Common/Alert";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import DataTableExtensions from "react-data-table-component-extensions";
import { Spinner } from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux"
import { dashboardSlice, hideNotification } from "../../Dashboard/DashbordSlice";
import { getCountryData, getRoles, postCountryData, updateCountryData } from "../../Dashboard/DashboardAction";
import { handleModalInStore,handleModalClose,loaderModal } from "../../Dashboard/DashbordSlice";

function CountryComponent() {
  const [data, setData] = useState(null);
  const [country, setCountry] = useState(null);
  const [notify, setNotify] = useState();
  // const [showLoaderModal, setShowLoaderModal] = useState(false);

  // const [modal, setModal] = useState({
  //   showModal: false,
  //   modalData: "",
  //   modalHeader: "",
  // });
  const [exportData, setExportData] = useState(null);

  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null);

  // const handleModal = (data) => {
  //   setModal(data);
  // };
  const searchRef = useRef();
const dispatch = useDispatch();
const countryData = useSelector(dashboardSlice=>dashboardSlice.dashboard.countryData)
const Notify = useSelector( (dashboardSlice) => dashboardSlice.dashboard.notify);
const modal = useSelector((dashboardSlice) => dashboardSlice.dashboard.modal);
const showLoadermodal = useSelector((dashboardSlice) => dashboardSlice.dashboard.showLoaderModal);
const ExportData = useSelector((dashboardSlice)=>dashboardSlice.dashboard.exportCountryData)
const checkRole = useSelector((DashboardSlice) =>DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 5));

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


  // const handleSearch = () => {
  //   const SearchValue = searchRef.current.value;
  //   const result = SearchInputData(data, SearchValue);
  //   setData(result);
  // };

  const [searchTerm, setSearchTerm] = useState('');
 
  const [filteredData, setFilteredData] = useState([]);
  const handleSearch = (value) => {
    console.log("fff",filteredData);
  };
  


 
  
  const columns = [
    {
      name: "Action",
      selector: (row) => {},
      sortable: false,
      width: "100px",
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#depedit"
            onClick={(e) => {
            //   handleModal({
            //     showModal: true,
            //     modalData: row,
            //     modalHeader: "Edit Country",
            //   });
            // }}
            dispatch(
              handleModalInStore({
                showModal: true,
                modalData: row,
                modalHeader: "Edit Country",
              })
            );}}
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
          {row.is_active === 1 && (
            <span className="badge bg-primary" style={{ width: "4rem" }}>
              Active
            </span>
          )}
          {row.is_active === 0 && (
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
    // setShowLoaderModal(null);
    // dispatch(getCountryData())
    // setShowLoaderModal(true);
    const data = [];
    const exportTempData = [];
    // await new CountryService()
    //   .getCountry()
    //   .then((res) => {
    //     if (res.status === 200) {
    //       setShowLoaderModal(false);
    //       let counter = 1;
    //       const temp = res.data.data;
    //       for (const key in temp) {
    //         data.push({
    //           counter: counter++,
    //           id: temp[key].id,
    //           country: temp[key].country,
    //           remark: temp[key].remark,
    //           is_active: temp[key].is_active,
    //           created_at: temp[key].created_at,
    //           created_by: temp[key].created_by,
    //           updated_at: temp[key].updated_at,
    //           updated_by: temp[key].updated_by,
    //         });
    //       }

    //       setData(null);
    //       setData(data);
    //       setCountry(data);
    //       for (const key in data) {
    //         exportTempData.push({
    //           Sr: data[key].counter,
    //           Country: data[key].country,
    //           Status: data[key].is_active ? "Active" : "Deactive",
    //           Remark:data[key].remark,

    //           created_at: temp[key].created_at,
    //           created_by: temp[key].created_by,
    //           updated_at: data[key].updated_at,
    //           updated_by: data[key].updated_by,
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
    //       "Country",
    //       "Get_Country",
    //       "INSERT",
    //       errorObject.data.message
    //     );
    //   });

  //   await new ManageMenuService().getRole(roleId).then((res) => {
  //     if (res.status === 200) {
  //       if (res.data.status == 1) {
  //         const getRoleId = sessionStorage.getItem("role_id");
  //         setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
  //       }
  //     }
  //   });
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setNotify(null);
    if (!id) {
      dispatch(postCountryData(form))
    dispatch(getCountryData())

      // await new CountryService()
      //   .postCountry(form)
      //   .then((res) => {
      //     setShowLoaderModal(false);

      //     if (res.status === 200) {
      //       if (res.data.status === 1) {
      //         setNotify({ type: "success", message: res.data.message });
      //         setModal({ showModal: false, modalData: "", modalHeader: "" });
      //         loadData();
      //       } else {
      //         setNotify({ type: "danger", message: res.data.message });
      //       }
      //     } else {
      //       setNotify({ type: "danger", message: res.data.message });
      //       new ErrorLogService().sendErrorLog(
      //         "Country",
      //         "Create_Country",
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
      //       "Country",
      //       "Create_Country",
      //       "INSERT",
      //       errorObject.data.message
      //     );
      //   });
    } else {
      dispatch(updateCountryData({id:id,payload:form}))
  dispatch(getCountryData())

      // await new CountryService()
      //   .updateCountry(id, form)
      //   .then((res) => {
      //     if (res.status === 200) {
      //       // setShowLoaderModal(false);
      //       if (res.data.status === 1) {
      //         setNotify({ type: "success", message: res.data.message });
      //         // setModal({ showModal: false, modalData: "", modalHeader: "" });
      //         loadData();
      //       } else {
      //         setNotify({ type: "danger", message: res.data.message });
      //       }
      //     } else {
      //       setNotify({ type: "danger", message: res.data.message });
      //       new ErrorLogService().sendErrorLog(
      //         "Country",
      //         "Create_Country",
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
      //       "Country",
      //       "Create_Country",
      
      //       "INSERT",
      //       errorObject.data.message
      //     );
      //   });
    }
  };

  const tableData = {
    columns,
    data,
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
    
  }, [checkRole])


  useEffect(()=>{
    loadData()

if(!countryData.length || !checkRole.length){
  dispatch(getCountryData())
dispatch(getRoles())

  }},[])

  // useEffect(() => {
  //   if (Notify) {
  //     const timer = setTimeout(() => {
  //       dispatch(hideNotification());
  //     }, 1500); // Adjust the timeout duration as needed
  //     return () => clearTimeout(timer);
  //   }
  // }, [Notify, dispatch]);

  return (
    <div className="container-xxl">
      {Notify && <Alert alertData={Notify} />}
      <PageHeader
        headerTitle="Country Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create == 1 ? (
                <button
                  className="btn btn-dark btn-set-task w-sm-100"
                  onClick={() => {
                  //   handleModal({
                  //     showModal: true,
                  //     modalData: null,
                  //     modalHeader: "Add Country",
                  //   });
                  // }}
                  dispatch(
                    handleModalInStore({
                      showModal: true,
                      modalData: null,
                      modalHeader: "Add Country",
                    })
                  );}}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Country
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
              placeholder="Search by Country Name...."
              ref={searchRef}
              onKeyDown={handleKeyDown}

              onChange={(e) => setSearchTerm(e.target.value)}

            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              // onClick={handleSearch}
              value={searchTerm} 
              onClick={() => handleSearch(searchTerm)}


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
              fileName="Country master Records"
            />
          </div>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {countryData && (
                <DataTable
                  columns={columns}
                  // data={countryData}
                  data={countryData.filter(customer => {
                    if (typeof searchTerm === 'string') {
                      if (typeof customer === 'string') {
                        return customer.toLowerCase().includes(searchTerm.toLowerCase());
                      } else if (typeof customer === 'object') {
                        return Object.values(customer).some(value =>
                          typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                      }
                    }
                    return false;
                  })}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
            <Modal
            //  show={dispatch(loaderModal({sh}))} 
             centered>
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
          <Modal.Header closeButton  onClick={() => {dispatch(
                handleModalClose({
                  showModal: false,
                  modalData: null,
                  modalHeader: "Add Country",
                }))}}>
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Country Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="country"
                    name="country"
                    maxLength={25}
                    minLength={4}
                    required
                    defaultValue={
                      modal.modalData ? modal.modalData.country : ""
                    }
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
                style={{ backgroundColor: "#484C7F",width:'80px',padding:"8px" }}
              >
                Add
              </button>
            )}
           

            {modal.modalData && checkRole && checkRole[0]?.can_update == 1 ? (
               
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
              // onClick={() => {
              //   handleModal({
              //     showModal: false,
              //     modalData: "",
              //     modalHeader: "",
              //   });
              // }}
              onClick={() => {dispatch(
                handleModalClose({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                }))}}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

function CountryDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(async () => {
    const tempData = [];
    await new CountryService().getCountry().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          if (data[key].is_active == 1) {
            tempData.push({
              id: data[key].id,
              country: data[key].country,
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
              Select Country
            </option>
          )}
          {props.defaultValue != 0 && <option value={0}>Select Country</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.country}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.country}
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

export { CountryComponent, CountryDropdown };

