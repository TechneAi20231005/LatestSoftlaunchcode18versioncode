// import React, { useEffect, useState, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Modal } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import { _base,  } from "../../../settings/constants";
// import ErrorLogService from "../../../services/ErrorLogService";

// import UserService from "../../../services/MastersService/UserService";
// import PageHeader from "../../../components/Common/PageHeader";

// import Alert from "../../../components/Common/Alert";
// import DataTableExtensions from "react-data-table-component-extensions";
// import "react-data-table-component-extensions/dist/index.css";
// import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
// import CountryService from "../../../services/MastersService/CountryService";
// import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
// import { Spinner } from "react-bootstrap";

// function UserComponent( ) {
//   const location = useLocation()
//   const [data, setData] = useState(null);
//   const [dataa, setDataa] = useState(null);
//   const [notify, setNotify] = useState(null);
//   const [countryDropdown, setCountryDropdown] = useState(null);
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
//       width: "80px",
//       cell: (row) => (
//         <div className="btn-group" role="group">
//           <Link
//             to={`/${_base}/User/Edit/` + row.id}
//             className="btn btn-outline-secondary"
//           >
//             <i className="icofont-edit text-success"></i>
//           </Link>
//         </div>
//       ),
//     },
//     {
//       name: "Sr",
//       selector: (row) => row.counter,
//       sortable: true,
//       width: "60px",
//     },
//     { name: "Account For", selector: (row) => row.account_for, sortable: true },
//     {
//       name: "Customer",
//       selector: (row) => row.customer,
//       sortable: true,
//       width: "150px",
//     },
//     {
//       name: "Name",
//       selector: (row) => row.name,
//       sortable: true,
//       width: "150px",
//     },
//     {
//       name: "Email",
//       selector: (row) => row.email,
//       sortable: true,
//       width: "175px",
//     },
//     {
//       name: "Contact No",
//       selector: (row) => row.contact_no,
//       sortable: true,
//       width: "150px",
//     },
//     {
//       name: "Username",
//       selector: (row) => row.username,
//       sortable: true,
//       width: "150px",
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
//             <span className="badge bg-danger " style={{ width: "4rem" }}>
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
//     setShowLoaderModal(true);
//     const data = [];
//     const exportTempData = [];
//     //  **************************Country load data**************************************
//     await new CountryService().getCountry().then((res) => {
//       if (res.status === 200) {
//         setShowLoaderModal(false);
//         if (res.data.status == 1) {
//           //setCountry(res.data.data.filter(d => d.is_active === 1));
//           setCountryDropdown(res.data.data.filter((d) => d.is_active == 1));
//         }
//       }
//     });

//     await new UserService()
//       .getUser()
//       .then((res) => {
//         setShowLoaderModal(false);
//         if (res.status === 200) {
//           let counter = 1;
//           const temp = res.data.data;
//           for (const key in temp) {
//             data.push({
//               counter: counter++,
//               id: temp[key].id,
//               account_for: temp[key].account_for,
//               customer: temp[key].customer,
//               name:
//                 temp[key].first_name +
//                 " " +
//                 temp[key].middle_name +
//                 " " +
//                 temp[key].last_name,
//               email: temp[key].email_id,
//               contact_no: temp[key].contact_no,
//               WhatsappNo: temp[key].whats_app_contact_no,
//               username: temp[key].user_name,
//               Role: temp[key].role,
//               Designation: temp[key].designation,
//               Address: temp[key].address,
//               Pincode: temp[key].pincode,
//               country_id: temp[key].country,
//               state_id: temp[key].state,
//               city_id: temp[key].city,
//               Department: temp[key].department,
//               Ticket_Show_Type: temp[key].ticket_show_type,
//               Ticket_Passing_Authority: temp[key].ticket_passing_authority,
//               Make_Default: temp[key].is_default,
//               is_active: temp[key].is_active,
//               created_at: temp[key].created_at,
//               created_by: temp[key].created_by,
//               updated_at: temp[key].updated_at,
//               updated_by: temp[key].updated_by,
//             });
//           }
//           setData(null);
//           setData(data);
//           setDataa(data);
//           for (const i in temp) {
//             exportTempData.push({
//               SrNo: exportTempData.length + 1,

//               Account_for: temp[i].account_for,
//               customer_name: temp[i].customer,
//               Name:
//                 temp[i].first_name +
//                 " " +
//                 temp[i].middle_name +
//                 " " +
//                 temp[i].last_name,
//               Email: temp[i].email_id,
//               ContactNo: temp[i].contact_no,
//               WhatsappNo: temp[i].whats_app_contact_no,
//               User_Name: temp[i].user_name,
//               Role: temp[i].role,
//               Designation: temp[i].designation,
//               Address: temp[i].address,
//               Pincode: temp[i].pincode,
//               Country: temp[i].country,
//               State: temp[i].state,
//               City: temp[i].city,
//               Department: temp[i].department,
//               Ticket_Show_Type: temp[i].ticket_show_type,
//               all_department: temp[i].all_department,
//               Ticket_Passing_Authority: temp[i].ticket_passing_authority
//                 ? "Yes"
//                 : "No",
//               Make_Default: temp[i].is_default ? "yes" : "No",
//               Status: temp[i].is_active ? "Active" : "Deactive",
//               created_at: temp[i].created_at,
//               created_by: temp[i].created_by,
//               updated_at: temp[i].updated_at,

//               updated_by: temp[i].updated_by,
//             });
//           }

//           setExportData(null);
//           setExportData(exportTempData);
//         }
//       })
//       .catch((error) => {
//         if (error.response) {
//           const { request, ...errorObject } = error.response;
//           new ErrorLogService().sendErrorLog(
//             "Status",
//             "Get_Status",
//             "INSERT",
//             errorObject.data.message
//           );
//         } else {
//           console.error(error);
//         }

//         });

//     await new ManageMenuService().getRole(roleId).then((res) => {
//       if (res.status === 200) {
//         setShowLoaderModal(false);
//         if (res.data.status == 1) {
//           const getRoleId = sessionStorage.getItem("role_id");
//           setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//         }
//       }
//     });

//     //   await new ManageMenuService().getRole(roleId).then((res) => {
//     //     console.log("res===>",res)
//     //     if (res.status === 200) {
//     //         if (res.data.status == 1) {
//     //             const getRoleId = sessionStorage.getItem("role_id");
//     //             setCheckRole(res.data.data.map(d => d.menu_id == 3 || "3"))
//     //         }
//     //     }
//     // })
//   };

//   //Search As Enter key press
//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       handleSearch();
//     }
//   };
//   const tableData = {
//     columns,
//     data,
//   };
//   var flag = 1;
// useEffect(()=>{
//   loadData();

// },[])
// useEffect(() => {
//   if (location && location.state) {
//     setNotify(location.state);
//   }
//   return () => {
//     setNotify(null);
//   };
// }, [location.state]);

//   useEffect(() => {
//     if (checkRole && checkRole[2].can_read === 0) {
//       // alert("Rushi")

//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
//     }
//   }, [checkRole]);

//   return (
//     <div className="container-xxl">
//       {notify && flag == 1 && <Alert alertData={notify} />}

//       <PageHeader
//         headerTitle="User Master"
//         renderRight={() => {
//           return (
//             <div className="col-auto d-flex w-sm-100">
//               {checkRole && checkRole[3].can_create === 1 ? (
//                 <Link
//                   to={`/${_base + "/User/Create"}`}
//                   className="btn btn-dark btn-set-task w-sm-100"
//                 >
//                   <i className="icofont-plus-circle me-2 fs-6"></i>Add User
//                 </Link>
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
//               placeholder="Search by User Name...."
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
//               fileName="User master Records"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="card mt-2">
//         <div className="card-body">
//           <div className="row clearfix g-3">
//             <div className="col-sm-12">
//               {data && (
//                 <DataTableExtensions {...tableData}>
//                   <DataTable
//                     columns={columns}
//                     data={data}
//                     defaultSortField="title"
//                     pagination
//                     selectableRows={false}
//                     className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//                     highlightOnHover={true}
//                   />
//                 </DataTableExtensions>
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
//     </div>
//   );
// }

// function UserDropdown(props) {
//   const [data, setData] = useState(null);
//   useEffect(async () => {
//     const tempData = [];
//     await new UserService().getUser().then((res) => {
//       if (res.status == 200) {
//         const data = res.data.data;
//         let counter = 1;
//         for (const key in data) {
//           tempData.push({
//             id: data[key].id,
//             name:
//               data[key].first_name +
//               " " +
//               data[key].middle_name +
//               " " +
//               data[key].last_name +
//               " (" +
//               data[key].id +
//               ")",
//           });
//         }
//         setData(tempData);
//       }
//     });
//   }, []);

//   return (
//     <>
//       {data && (
//         // <Select isSearchable={true} className="basic-multi-select"
//         //     classNamePrefix="select"
//         //     name={props.name}
//         //     onChange={props.getChangeValue}
//         //     options={data}
//         // />
//         <select
//           className="form-control form-control-sm"
//           id={props.id}
//           name={props.name}
//           onChange={props.getChangeValue}
//           required={props.required ? true : false}
//           readonly={true}
//         >
//           {props.defaultValue == 0 && (
//             <option value="" selected>
//               Select User
//             </option>
//           )}
//           {props.defaultValue != 0 && <option value="">Select User</option>}
//           {data.map(function (item, i) {
//             if (props.defaultValue && props.defaultValue == item.id) {
//               return (
//                 <option key={i} value={item.id} selected>
//                   {item.name}
//                 </option>
//               );
//             } else {
//               return (
//                 <option key={i} value={item.id}>
//                   {item.name}
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
// export { UserComponent, UserDropdown };



import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { _base, } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";

import UserService from "../../../services/MastersService/UserService";
import PageHeader from "../../../components/Common/PageHeader";

import Alert from "../../../components/Common/Alert";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import CountryService from "../../../services/MastersService/CountryService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { dashboardSlice } from "../../Dashboard/DashbordSlice";
import { getEmployeeData, getRoles } from "../../Dashboard/DashboardAction";
import { departmentData } from "../DepartmentMaster/DepartmentMasterAction";

function UserComponent() {
  const location = useLocation()
  const [data, setData] = useState(null);
  const dispatch = useDispatch()
  const [dataa, setDataa] = useState(null);
  const [notify, setNotify] = useState(null);
  // const [countryDropdown, setCountryDropdown] = useState(null);
  // const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [exportData, setExportData] = useState(null);

  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null);
  const checkRole = useSelector((DashboardSlice) => DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 3));


  const employeeData = useSelector(dashboardSlice => dashboardSlice.dashboard.employeeData);
  // const ExportData = useSelector((dashboardSlice)=>dashboardSlice.dashboard.exportUserData)

  // const Notify = useSelector(
  //   (dashboardSlice) => dashboardSlice.dashboard.notify
  // );
  const handleModal = (data) => {
    setModal(data);
  };

  const searchRef = useRef();

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
  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // };
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (value) => {
  };
  const columns = [
    {
      name: "Action",
      selector: (row) => { },
      sortable: false,
      width: "80px",
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/User/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      ),
    },
    {
      name: "Sr",
      selector: (row) => row.counter,
      sortable: true,
      width: "60px",
    },
    { name: "Account For", selector: (row) => row.account_for, sortable: true },
    {
      name: "Customer",
      selector: (row) => row.customer,
      sortable: true,
      width: "150px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email_id,
      sortable: true,
      width: "175px",
    },
    {
      name: "Contact No",
      selector: (row) => row.contact_no,
      sortable: true,
      width: "150px",
    },
    {
      name: "Username",
      selector: (row) => row.user_name,
      sortable: true,
      width: "150px",
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
            <span className="badge bg-danger " style={{ width: "4rem" }}>
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
    // setShowLoaderModal(true);
    // try {
    // } catch (error) {
    // }

    // await new UserService().getExportTicket().then((res) => {

    //   if (res.status === 200) {
    //     if (res.data.status == 1) {

    //     }
    //   }
    // });


    const exportTempData = [];

    await new UserService().getExportTicket().then((res) => {
      console.log("resExport", res)
      if (res.status == 200) {
        // setExportData(res.data)
        const temp = res.data.data;

        for (const i in temp) {
          exportTempData.push({
            SrNo: exportTempData.length + 1,

            Account_for: temp[i].account_for,
            customer_name: temp[i].customer,
            Name:
              temp[i].first_name +
              " " +
              temp[i].middle_name +
              " " +
              temp[i].last_name,
            Email: temp[i].email_id,
            ContactNo: temp[i].contact_no,
            WhatsappNo: temp[i].whats_app_contact_no,
            User_Name: temp[i].user_name,
            Role: temp[i].role,
            Designation: temp[i].designation,
            Address: temp[i].address,
            Pincode: temp[i].pincode,
            Country: temp[i].country,
            State: temp[i].state,
            City: temp[i].city,
            Department: temp[i].department,
            Ticket_Show_Type: temp[i].ticket_show_type,
            all_department: temp[i].all_department,
            Ticket_Passing_Authority: temp[i].ticket_passing_authority
              ? "Yes"
              : "No",
            Make_Default: temp[i].is_default ? "yes" : "No",
            Status: temp[i].is_active ? "Active" : "Deactive",
            created_at: temp[i].created_at,
            created_by: temp[i].created_by,
            updated_at: temp[i].updated_at,

            updated_by: temp[i].updated_by,
          });
        }

        setExportData(null);
        setExportData(exportTempData);
      }


    });



    // const data = [];
    //  **************************Country load data**************************************
    // await new CountryService().getCountry().then((res) => {
    //   if (res.status === 200) {
    //     setShowLoaderModal(false);
    //     if (res.data.status == 1) {
    //       //setCountry(res.data.data.filter(d => d.is_active === 1));
    //       setCountryDropdown(res.data.data.filter((d) => d.is_active == 1));
    //     }
    //   }
    // });

    // await new UserService()
    //   .getUser()
    //   .then((res) => {
    //     setShowLoaderModal(false);
    //     if (res.status === 200) {
    //       let counter = 1;
    //       const temp = res.data.data;
    //       for (const key in temp) {
    //         data.push({
    //           counter: counter++,
    //           id: temp[key].id,
    //           account_for: temp[key].account_for,
    //           customer: temp[key].customer,
    //           name:
    //             temp[key].first_name +
    //             " " +
    //             temp[key].middle_name +
    //             " " +
    //             temp[key].last_name,
    //           email: temp[key].email_id,
    //           contact_no: temp[key].contact_no,
    //           WhatsappNo: temp[key].whats_app_contact_no,
    //           username: temp[key].user_name,
    //           Role: temp[key].role,
    //           Designation: temp[key].designation,
    //           Address: temp[key].address,
    //           Pincode: temp[key].pincode,
    //           country_id: temp[key].country,
    //           state_id: temp[key].state,
    //           city_id: temp[key].city,
    //           Department: temp[key].department,
    //           Ticket_Show_Type: temp[key].ticket_show_type,
    //           Ticket_Passing_Authority: temp[key].ticket_passing_authority,
    //           Make_Default: temp[key].is_default,
    //           is_active: temp[key].is_active,
    //           created_at: temp[key].created_at,
    //           created_by: temp[key].created_by,
    //           updated_at: temp[key].updated_at,
    //           updated_by: temp[key].updated_by,
    //         });
    //       }
    //       setData(null);
    //       setData(data);
    //       setDataa(data);
    //       for (const i in temp) {
    //         exportTempData.push({
    //           SrNo: exportTempData.length + 1,

    //           Account_for: temp[i].account_for,
    //           customer_name: temp[i].customer,
    //           Name:
    //             temp[i].first_name +
    //             " " +
    //             temp[i].middle_name +
    //             " " +
    //             temp[i].last_name,
    //           Email: temp[i].email_id,
    //           ContactNo: temp[i].contact_no,
    //           WhatsappNo: temp[i].whats_app_contact_no,
    //           User_Name: temp[i].user_name,
    //           Role: temp[i].role,
    //           Designation: temp[i].designation,
    //           Address: temp[i].address,
    //           Pincode: temp[i].pincode,
    //           Country: temp[i].country,
    //           State: temp[i].state,
    //           City: temp[i].city,
    //           Department: temp[i].department,
    //           Ticket_Show_Type: temp[i].ticket_show_type,
    //           all_department: temp[i].all_department,
    //           Ticket_Passing_Authority: temp[i].ticket_passing_authority
    //             ? "Yes"
    //             : "No",
    //           Make_Default: temp[i].is_default ? "yes" : "No",
    //           Status: temp[i].is_active ? "Active" : "Deactive",
    //           created_at: temp[i].created_at,
    //           created_by: temp[i].created_by,
    //           updated_at: temp[i].updated_at,

    //           updated_by: temp[i].updated_by,
    //         });
    //       }

    //       setExportData(null);
    //       setExportData(exportTempData);
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       const { request, ...errorObject } = error.response;
    //       new ErrorLogService().sendErrorLog(
    //         "Status",
    //         "Get_Status",
    //         "INSERT",
    //         errorObject.data.message
    //       );
    //     } else {
    //       console.error(error);
    //     }

    //     });


    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     setShowLoaderModal(false);
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });

    //   await new ManageMenuService().getRole(roleId).then((res) => {
    //     console.log("res===>",res)
    //     if (res.status === 200) {
    //         if (res.data.status == 1) {
    //             const getRoleId = sessionStorage.getItem("role_id");
    //             setCheckRole(res.data.data.map(d => d.menu_id == 3 || "3"))
    //         }
    //     }
    // })
  };

  //Search As Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const tableData = {
    columns,
    data,
    // employeeData
  };
  var flag = 1;
  useEffect(() => {
    loadData();

    dispatch(getEmployeeData())
    dispatch(getRoles())
    dispatch(departmentData())


  }, [])
  useEffect(() => {
    if (location && location.state) {
      setNotify(location.state);
    }
    return () => {
      setNotify(null);
    };
  }, [location.state]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);


  useEffect(() => {
    setFilteredData(employeeData.filter(customer => {
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
    }));
  }, [searchTerm, employeeData]);


  return (
    <div className="container-xxl">
      {/* {notify && flag == 1 && <Alert alertData={notify} />} */}
      {/* {Notify &&  <Alert alertData={Notify} />} */}


      <PageHeader
        headerTitle="User Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base + "/User/Create"}`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add User
                </Link>
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
              placeholder="Search by User Name...."
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
              apiData={exportData && exportData}
              fileName="User master Records"
            />
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {employeeData && (
                // <DataTableExtensions {...tableData}>
                <DataTable
                  columns={columns}
                  // data={employeeData}
                  data={employeeData.filter(customer => {
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
                // </DataTableExtensions>
              )}
              {/* {data && data.length && (
                <DataTableExtensions {...tableData}>
                  <DataTable
                    columns={columns}
                    data={data}
                    defaultSortField="title"
                    pagination
                    selectableRows={false}
                    className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                    highlightOnHover={true}
                  />
                </DataTableExtensions>
              )} */}
            </div>
            {/* 
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
            </Modal> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(async () => {
    const tempData = [];
    await new UserService().getUser().then((res) => {
      if (res.status == 200) {
        const data = res.data.data;
        let counter = 1;
        for (const key in data) {
          tempData.push({
            id: data[key].id,
            name:
              data[key].first_name +
              " " +
              data[key].middle_name +
              " " +
              data[key].last_name +
              " (" +
              data[key].id +
              ")",
          });
        }
        setData(tempData);
      }
    });
  }, []);

  return (
    <>
      {data && (
        // <Select isSearchable={true} className="basic-multi-select"
        //     classNamePrefix="select"
        //     name={props.name}
        //     onChange={props.getChangeValue}
        //     options={data}
        // />
        <select
          className="form-control form-control-sm"
          id={props.id}
          name={props.name}
          onChange={props.getChangeValue}
          required={props.required ? true : false}
          readonly={true}
        >
          {props.defaultValue == 0 && (
            <option value="" selected>
              Select User
            </option>
          )}
          {props.defaultValue != 0 && <option value="">Select User</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.name}
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
export { UserComponent, UserDropdown };

