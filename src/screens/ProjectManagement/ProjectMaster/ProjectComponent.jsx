// import React, { useEffect, useState, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import DataTable from "react-data-table-component";
// import { _base } from "../../../settings/constants";
// import ErrorLogService from "../../../services/ErrorLogService";
// import ProjectService from "../../../services/ProjectManagementService/ProjectService";
// import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
// import PageHeader from "../../../components/Common/PageHeader";
// import Alert from "../../../components/Common/Alert";
// import Select from "react-select";
// import { Spinner } from "react-bootstrap";
// import { Modal } from "react-bootstrap";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
// import { useDispatch, useSelector } from "react-redux";
// import { getprojectData } from "./ProjectMasterAction";
// import ProjectMasterSlice from "./ProjectMasterSlice";
// import { getRoles } from "../../Dashboard/DashboardAction";
// import DashboardSlice from "../../Dashboard/DashboardSlice";
// import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";

// function ProjectComponent() {
//   const location = useLocation();
//   const projectData = useSelector(
//     (ProjectMasterSlice) => ProjectMasterSlice.projectMaster.getproject
//   );
//   const checkRole = useSelector((DashboardSlice) =>
//     DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 11)
//   );

//   const exportData = useSelector(
//     (ProjectMasterSlice) => ProjectMasterSlice.projectMaster.exportProjectData
//   );

//   console.log(exportData)
//   const dispatch = useDispatch();

//   const [notify, setNotify] = useState(null);
//   const [data, setData] = useState(null);
//   const searchRef = useRef();

//   const roleId = sessionStorage.getItem("role_id");
//   // const [checkRole, setCheckRole] = useState(null);
//   const [showLoaderModal, setShowLoaderModal] = useState(false);

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

//   // const handleSearch = () => {
//   //   const SearchValue = searchRef.current.value;
//   //   const result = SearchInputData(data, SearchValue);
//   //   setData(result);
//   // };

//   const [searchTerm, setSearchTerm] = useState("");
//   // const handleSearch = (e) => {
//   //   setSearchTerm(e.target.value);
//   // };
//   const [filteredData, setFilteredData] = useState([]);

//   const handleSearch = (value) => {
//     console.log("fff", filteredData);
//   };

//   // const handleKeyDown = (event) => {
//   //   if (event.key === "Enter") {
//   //     handleSearch();
//   //   }
//   // };

//   const columns = [
//     {
//       name: "Action",
//       selector: (row) => {},
//       sortable: false,
//       width: "150px",
//       cell: (row) => (
//         <div className="btn-group" role="group">
//           <Link
//             to={`/${_base}/Project/Edit/` + row.id}
//             className="btn btn-outline-secondary"
//           >
//             <i className="icofont-edit text-success"></i>
//           </Link>
//         </div>
//       ),
//     },
//     { name: "Sr",  width: "150px", selector: (row) => row.counter, sortable: true },
//     {
//       name: "Project Name",
//       width: "150px",
//       selector: (row) => row.project_name,
//       sortable: true,

//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           {row.project_name && (
//             <OverlayTrigger overlay={<Tooltip>{row.project_name} </Tooltip>}>
//               <div>
//                 <span className="ms-1">
//                   {" "}
//                   {row.project_name && row.project_name.length < 10
//                     ? row.project_name
//                     : row.project_name.substring(0, 10) + "...."}
//                 </span>
//               </div>
//             </OverlayTrigger>
//           )}
//         </div>
//       ),
//     },
//     {
//       name: "Project Reviewer",
//       width: "10%",
//       selector: (row) => row.projectReviewer,
//       sortable: true,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           {row.projectReviewer && (
//             <OverlayTrigger overlay={<Tooltip>{row.projectReviewer} </Tooltip>}>
//               <div>
//                 <span className="ms-1">
//                   {" "}
//                   {row.projectReviewer && row.projectReviewer.length < 10
//                     ? row.projectReviewer
//                     : row.projectReviewer.substring(0, 10) + "...."}
//                 </span>
//               </div>
//             </OverlayTrigger>
//           )}
//         </div>
//       ),
//     },

//     {
//       name: "Description",
//       width: "150px",
//       selector: (row) => row.description,
//       sortable: true,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           {row.description && (
//             <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
//               <div>
//                 <span className="ms-1">
//                   {" "}
//                   {row.description && row.description.length < 10
//                     ? row.description
//                     : row.description.substring(0, 10) + "...."}
//                 </span>
//               </div>
//             </OverlayTrigger>
//           )}
//         </div>
//       ),
//     },
//     {
//       name: "Status",
//       width: "150px",
//       selector: (row) => row.is_active,
//       sortable: true,
//       cell: (row) => (
//         <div>
//           {row.is_active == 1 && (
//             <span className="badge bg-primary">Active</span>
//           )}
//           {row.is_active == 0 && (
//             <span className="badge bg-danger">Deactive</span>
//           )}
//         </div>
//       ),
//     },
//     // { name: 'Assigned BA', selector: row => row.assigned_ba, sortable: true, },
//     // { name: 'Assigned DEV', selector: row => row.assigned_dev, sortable: true, },
//     // { name: 'Assigned TESTER', selector: row => row.assigned_tester, sortable: true, },
//     // {
//     //   name: "Remark",
//     //   width: "10%",
//     //   selector: (row) => row.remark,
//     //   sortable: true,
//     //   cell: (row) => (
//     //     <div
//     //       className="btn-group"
//     //       role="group"
//     //       aria-label="Basic outlined example"
//     //     >
//     //       {row.remark && (
//     //         <OverlayTrigger overlay={<Tooltip>{row.remark} </Tooltip>}>
//     //           <div>
//     //             <span className="ms-1"> {row.remark ? row.remark : ""}</span>
//     //           </div>
//     //         </OverlayTrigger>
//     //       )}
//     //     </div>
//     //   ),
//     // },
//     {
//       name: "created at",
//       width: "150px",
//       selector: (row) => row.created_at,
//       sortable: true,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           {row.created_at && (
//             <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
//               <div>
//                 <span className="ms-1">
//                   {" "}
//                   {row.created_at && row.created_at.length < 10
//                     ? row.created_at
//                     : row.created_at.substring(0, 10) + "...."}
//                 </span>
//               </div>
//             </OverlayTrigger>
//           )}
//         </div>
//       ),
//     },
//     {
//       name: "created By",
//       width: "150px",
//       selector: (row) => row.created_by,
//       sortable: true,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           {row.created_by && (
//             <OverlayTrigger overlay={<Tooltip>{row.created_by} </Tooltip>}>
//               <div>
//                 <span className="ms-1">
//                   {" "}
//                   {row.created_by && row.created_by.length < 10
//                     ? row.created_by
//                     : row.created_by.substring(0, 10) + "...."}
//                 </span>
//               </div>
//             </OverlayTrigger>
//           )}
//         </div>
//       ),
//     },
//     {
//       name: "Updated By",
//       width: "150px",
//       selector: (row) => row.updated_by,
//       sortable: true,

//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           {row.updated_by && (
//             <OverlayTrigger overlay={<Tooltip>{row.updated_by} </Tooltip>}>
//               <div>
//                 <span className="ms-1">
//                   {" "}
//                   {row.updated_by && row.updated_by.length < 20
//                     ? row.updated_by
//                     : row.updated_by.substring(0, 10) + "...."}
//                 </span>
//               </div>
//             </OverlayTrigger>
//           )}
//         </div>
//       ),
//     },
//     {
//       name: "Updated At",
//       width: "150px",
//       selector: (row) => row.updated_at,
//       sortable: true,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           {row.updated_at && (
//             <OverlayTrigger overlay={<Tooltip>{row.updated_at} </Tooltip>}>
//               <div>
//                 <span className="ms-1">
//                   {" "}
//                   {row.updated_at && row.updated_at.length < 20
//                     ? row.updated_at
//                     : row.updated_at.substring(0, 10) + "...."}
//                 </span>
//               </div>
//             </OverlayTrigger>
//           )}
//         </div>
//       ),
//     },
//   ];

//   const loadData = async () => {
//     dispatch(getprojectData());
//     dispatch(getRoles());

//     // setShowLoaderModal(null);
//     // setShowLoaderModal(true);
//     // const data = [];
//     // await new ProjectService()
//     //   .getProject()
//     //   .then((res) => {
//     //     if (res.status === 200) {
//     //       setShowLoaderModal(false);

//     //       let counter = 1;
//     //       const temp = res.data.data;
//     //       for (const key in temp) {
//     //         data.push({
//     //           counter: counter++,
//     //           id: temp[key].id,
//     //           project_name: temp[key].project_name,
//     //           projectReviewer: temp[key].projectReviewer,
//     //           is_active: temp[key].is_active,
//     //           description: temp[key].description,
//     //           remark: temp[key].remark,
//     //           created_at: temp[key].created_at,
//     //           created_by: temp[key].created_by,
//     //           updated_at: temp[key].updated_at,
//     //           updated_by: temp[key].updated_by,
//     //         });
//     //       }
//     //       setData(null);
//     //       setData(data);
//     //     }
//     //   })
//     //   .catch((error) => {
//     //     const { response } = error;
//     //     const { request, ...errorObject } = response;
//     //     new ErrorLogService().sendErrorLog(
//     //       "Project Master",
//     //       "Get_Project",
//     //       "INSERT",
//     //       errorObject.data.message
//     //     );
//     //   });

//     // await new ManageMenuService().getRole(roleId).then((res) => {
//     //   if (res.status === 200) {
//     //     setShowLoaderModal(false);

//     //     if (res.data.status == 1) {
//     //       const getRoleId = sessionStorage.getItem("role_id");
//     //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//     //     }
//     //   }
//     // });
//   };

//   useEffect(() => {
//     loadData();
//     if (location && location.state) {
//       setNotify(location.state.alert);
//     }
//   }, []);

//   useEffect(() => {
//     if (checkRole && checkRole[0]?.can_read === 0) {
//       // alert("Rushi")

//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
//     }
//   }, [checkRole]);

//   return (
//     <div className="container-xxl">
//       {notify && <Alert alertData={notify} />}

//       <PageHeader
//         headerTitle="Project Master"
//         renderRight={() => {
//           return (
//             <div className="col-auto d-flex w-sm-100">
//               {checkRole && checkRole[0]?.can_create === 1 ? (
//                 <Link
//                   to={`/${_base}/Project/Create`}
//                   className="btn btn-dark btn-set-task w-sm-100"
//                 >
//                   <i className="icofont-plus-circle me-2 fs-6"></i>Add Project
//                 </Link>
//               ) : (
//                 ""
//               )}
//             </div>
//           );
//         }}
//       />

//       {/* <div className="card card-body">
//         <div className="row">
//           <div className="col-md-10">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search...."
//               ref={searchRef}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               // onKeyDown={handleKeyDown}
//             />
//           </div>
//           <div className="col-md-2">
//             <button
//               className="btn btn-sm btn-warning text-white"
//               type="button"
//               // onClick={handleSearch}
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
//           </div>
//         </div>
//       </div> */}

// <div className="card card-body">
//         <div className="row">
//           <div className="col-md-9">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search by Designation Name...."
//               ref={searchRef}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               // onKeyDown={handleKeyDown}
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
//               fileName="Project master Records"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="card mt-2">
//         <div className="card-body">
//           <div className="row clearfix g-3">
//             <div className="col-sm-12">
//               {projectData && (
//                 <DataTable
//                   columns={columns}
//                   // data={projectData}
//                   data={projectData.filter((customer) => {
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

// function ProjectDropdown(props) {
//   const [data, setData] = useState(null);
//   useEffect(() => {
//     const tempData = [];
//     new ProjectService().getProject().then((res) => {
//       if (res.status === 200) {
//         let counter = 1;
//         var data = res.data.data;
//         data.filter((d) => d.is_active);
//         for (const key in data) {
//           tempData.push({
//             counter: counter++,
//             id: data[key].id,
//             project_name: data[key].project_name,
//           });
//         }
//         setData(null);
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
//             <option value="" selected>
//               Select Project
//             </option>
//           )}
//           {props.defaultValue != 0 && <option value="">Select Project</option>}
//           {data.map(function (item, i) {
//             if (props.defaultValue && props.defaultValue == item.id) {
//               return (
//                 <option key={i} value={item.id} selected>
//                   {item.project_name}
//                 </option>
//               );
//             } else {
//               return (
//                 <option key={i} value={item.id}>
//                   {item.project_name}
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

// export { ProjectComponent, ProjectDropdown };

import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import ProjectService from "../../../services/ProjectManagementService/ProjectService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import Select from "react-select";
import { Spinner } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";

function ProjectComponent() {
  const location = useLocation();

  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [exportData, setExportData] = useState(null);
  const searchRef = useRef();

  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const columns = [
    {
      name: "Action",
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/Project/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      ),
    },
    { name: "Sr", width: "5%", selector: (row) => row.counter, sortable: true },
    {
      name: "Project Name",
      width: "10%",
      selector: (row) => row.project_name,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.project_name && (
            <OverlayTrigger overlay={<Tooltip>{row.project_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.project_name && row.project_name.length < 10
                    ? row.project_name
                    : row.project_name.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "Project Reviewer",
      width: "10%",
      selector: (row) => row.projectReviewer,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.projectReviewer && (
            <OverlayTrigger overlay={<Tooltip>{row.projectReviewer} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.projectReviewer && row.projectReviewer.length < 10
                    ? row.projectReviewer
                    : row.projectReviewer.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "Description",
      width: "10%",
      selector: (row) => row.description,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.description && (
            <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.description && row.description.length < 10
                    ? row.description
                    : row.description.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "Status",
      width: "10%",
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger">Deactive</span>
          )}
        </div>
      ),
    },
    // { name: 'Assigned BA', selector: row => row.assigned_ba, sortable: true, },
    // { name: 'Assigned DEV', selector: row => row.assigned_dev, sortable: true, },
    // { name: 'Assigned TESTER', selector: row => row.assigned_tester, sortable: true, },
    {
      name: "Remark",
      width: "10%",
      selector: (row) => row.remark,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.remark && (
            <OverlayTrigger overlay={<Tooltip>{row.remark} </Tooltip>}>
              <div>
                <span className="ms-1"> {row.remark ? row.remark : ""}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "created at",
      width: "10%",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.created_at && (
            <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.created_at && row.created_at.length < 10
                    ? row.created_at
                    : row.created_at.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "created By",
      width: "10%",
      selector: (row) => row.created_by,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.created_by && (
            <OverlayTrigger overlay={<Tooltip>{row.created_by} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.created_by && row.created_by.length < 10
                    ? row.created_by
                    : row.created_by.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "Updated By",
      width: "10%",
      selector: (row) => row.updated_by,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.updated_by && (
            <OverlayTrigger overlay={<Tooltip>{row.updated_by} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.updated_by && row.updated_by.length < 20
                    ? row.updated_by
                    : row.updated_by.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "Updated At",
      width: "12%",
      selector: (row) => row.updated_at,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.updated_at && (
            <OverlayTrigger overlay={<Tooltip>{row.updated_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.updated_at && row.updated_at.length < 20
                    ? row.updated_at
                    : row.updated_at.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
  ];

  const loadData = async () => {
    setShowLoaderModal(null);
    setShowLoaderModal(true);
    const data = [];
    await new ProjectService()
      .getProject()
      .then((res) => {
        if (res.status === 200) {
          setShowLoaderModal(false);

          let counter = 1;
          const temp = res.data.data;
          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              project_name: temp[key].project_name,
              projectReviewer: temp[key].projectReviewer,
              is_active: temp[key].is_active,
              description: temp[key].description,
              remark: temp[key].remark,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
            });
          }
          setData(null);
          setData(data);

          let exportData = [];
          let count = 1;
          for (const key in data) {
            exportData.push({
              counter: count++,
              // id: data[key].id,
              project_name: data[key].project_name,
              projectReviewer: data[key].projectReviewer,
              is_active: data[key].is_active ==1 ?"Active":"Deactive",
              description: data[key].description,
              remark: data[key].remark,
              created_at: data[key].created_at,
              created_by: data[key].created_by,
              updated_at: data[key].updated_at,
              updated_by: data[key].updated_by,
            });
          }
          setExportData(exportData);
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          "Project Master",
          "Get_Project",
          "INSERT",
          errorObject.data.message
        );
      });

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

  useEffect(() => {
    loadData();
    if (location && location.state) {
      setNotify(location.state.alert);
    }
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[19].can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader
        headerTitle="Project Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[19].can_create === 1 ? (
                <Link
                  to={`/${_base}/Project/Create`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Project
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
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              placeholder="Search...."
              ref={searchRef}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-md-2">
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
              apiData={exportData}
              fileName="Project master Records"
            />
          </div>
        </div>
      </div>

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
  );
}

function ProjectDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new ProjectService().getProject().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        var data = res.data.data;
        data.filter((d) => d.is_active);
        for (const key in data) {
          tempData.push({
            counter: counter++,
            id: data[key].id,
            project_name: data[key].project_name,
          });
        }
        setData(null);
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
            <option value="" selected>
              Select Project
            </option>
          )}
          {props.defaultValue != 0 && <option value="">Select Project</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.project_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.project_name}
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

export { ProjectComponent, ProjectDropdown };
