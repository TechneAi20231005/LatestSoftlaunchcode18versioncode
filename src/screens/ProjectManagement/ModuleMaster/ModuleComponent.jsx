import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import ModuleService from "../../../services/ProjectManagementService/ModuleService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import Select from "react-select";
import { Spinner } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { moduleMaster } from "./ModuleAction";
import { getRoles } from "../../Dashboard/DashboardAction";
import ModuleSlice from "./ModuleSlice";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
function ModuleComponent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const moduleData = useSelector((ModuleSlice) => ModuleSlice.moduleMaster.moduleMaster);

console.log(moduleData)
  const exportData = useSelector(
    (ModuleSlice) => ModuleSlice?.moduleMaster.exportModuleData
  );
  console.log(exportData)
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 21)
  );

  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const roleId = sessionStorage.getItem("role_id");

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

  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     handleSearch();
  //   }
  // };


  const [searchTerm, setSearchTerm] = useState("");
  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // };
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (value) => {
    console.log("fff", filteredData);
  };


  const columns = [
    {
      name: "Action",
      width: "5%",
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/Module/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      ),
    },
    { name: "Sr", width: "5%", selector: (row) => row.counter, sortable: true },
    {
      name: "Module Name",
      width: "15%",
      selector: (row) => row.module_name,
      sortable: true,
    },
    {
      name: "Project Name",
      width: "15%",
      selector: (row) => row.project_name,
      sortable: true,
    },
    {
      name: "Status",
      width: "10%",
      selector: (row) => row.is_active,
      sortable: false,
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
    {
      name: "Description",
      width: "10%",
      selector: (row) => row.description,
      sortable: true,
    },
    // {
    //   name: "Remark",
    //   width: "10%",
    //   selector: (row) => row.remark,
    //   sortable: true,
    // },

    {
      name: "created at",

      width: "10%",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "created by",

      width: "10%",
      selector: (row) => row.created_by,
      sortable: true,
    },

    

    {
      name: "Updated By",
      width: "10%",
      selector: (row) => row.updated_by,
      sortable: true,
    },
    {
      name: "Updated At",
      width: "10%",
      selector: (row) => row.updated_at,
      sortable: true,
    },
  ];

  const loadData = async () => {
    dispatch(moduleMaster());
    dispatch(getRoles());
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    // const data = [];
    // await new ModuleService().getModule().then(res => {
    //     if (res.status === 200) {
    // setShowLoaderModal(false);

    //         let counter = 1;
    //         const temp = res.data.data
    //         for (const key in temp) {
    //             data.push({
    //                 counter: counter++,
    //                 id: temp[key].id,
    //                 module_name: temp[key].module_name,
    //                 project_name: temp[key].project_name,
    //                 is_active: temp[key].is_active,
    //                 remark: temp[key].remark,
    //                 updated_at: temp[key].updated_at,
    //                 updated_by: temp[key].updated_by,
    //                 description: temp[key].description

    //             })
    //         }
    //         setData(null);
    //         setData(data);
    //     }
    // }).catch(error => {
    //     const { response } = error;
    //     const { request, ...errorObject } = response;
    //     new ErrorLogService().sendErrorLog("Module Master", "Get_Module", "INSERT", errorObject.data.message);
    // })

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //     if (res.status === 200) {
    // setShowLoaderModal(false);

    //         if (res.data.status == 1) {
    //             const getRoleId = sessionStorage.getItem("role_id");
    //             setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
    //         }
    //     }
    // })
  };

  useEffect(() => {
    loadData();
    if (location && location.state) {
      setNotify(location.state.alert);
    }
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader
        headerTitle="Module Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base}/Module/Create`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Module
                </Link>
              ) : (
                ""
              )}
            </div>
          );
        }}
      />

      {/* <div className="card card-body">
        <div className="row">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              placeholder="Search...."
              ref={searchRef}
              onChange={(e) => setSearchTerm(e.target.value)}

              
              // onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-md-2">
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
          </div>
        </div>
      </div> */}

      
<div className="card card-body">
        <div className="row">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Designation Name...."
              ref={searchRef}
              onChange={(e) => setSearchTerm(e.target.value)}
              // onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
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
              apiData={exportData}
              fileName="Module master Records"
            />
          </div>
        </div>
      </div>


      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {moduleData && (
            <DataTable
              columns={columns}
              // data={moduleData}
              data={moduleData.filter((customer) => {
                if (typeof searchTerm === "string") {
                  if (typeof customer === "string") {
                    return customer
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  } else if (typeof customer === "object") {
                    return Object.values(customer).some(
                      (value) =>
                        typeof value === "string" &&
                        value
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
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
  );
}

function ModuleDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(async () => {
    const tempData = [];
    await new ModuleService().getModule().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            counter: counter++,
            id: data[key].id,
            module_name: data[key].module_name,
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
              Select Module
            </option>
          )}
          {props.defaultValue != 0 && <option value="">Select Module</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.module_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.module_name}
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

export { ModuleComponent, ModuleDropdown };
