import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import SubModuleService from "../../../services/ProjectManagementService/SubModuleService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import { Modal } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { subModuleMaster } from "./SubModuleMasterAction";
import { getRoles } from "../../Dashboard/DashboardAction";
import { submoduleSlice } from "./SubModuleMasterSlice";

function SubModuleComponent() {
  const dispatch = useDispatch();
  const subModuleMasterdata = useSelector(
    (submoduleSlice) => submoduleSlice.subModuleMaster.subModuleMaster
  );
  const checkRole = useSelector((DashboardSlice) =>DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 22));

  const location = useLocation();

  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);

  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null)
  const [showLoaderModal, setShowLoaderModal] = useState(false);

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
            to={`/${_base}/SubModule/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      ),
    },
    { name: "Sr", selector: (row) => row.counter, sortable: true },
    {
      name: "Sub Module Name",
      selector: (row) => row.sub_module_name,
      sortable: true,
    },
    { name: "Module Name", selector: (row) => row.module_name, sortable: true },
    {
      name: "Project Name",
      selector: (row) => row.project_name,
      sortable: true,
    },
    {
      name: "Status",
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
    { name: "Remark", selector: (row) => row.remark, sortable: true },
    { name: "Updated By", selector: (row) => row.updated_by, sortable: true },
    { name: "Updated At", selector: (row) => row.updated_at, sortable: true },
  ];

  const loadData = async () => {
    dispatch(subModuleMaster());
    dispatch(getRoles());
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    // const data = [];
    // await new SubModuleService().getSubModule().then(res => {
    //     if (res.status === 200) {
    // setShowLoaderModal(false);

    //         let counter = 1;
    //         const temp = res.data.data
    //         for (const key in temp) {
    //             data.push({
    //                 counter: counter++,
    //                 id: temp[key].id,
    //                 sub_module_name: temp[key].sub_module_name,
    //                 module_name: temp[key].module_name,
    //                 project_name: temp[key].project_name,
    //                 is_active: temp[key].is_active,
    //                 remark: temp[key].remark,
    //                 updated_at: temp[key].updated_at,
    //                 updated_by: temp[key].updated_by
    //             })
    //         }
    //         setData(null);
    //         setData(data);
    //     } else {
    //         new ErrorLogService().sendErrorLog("SubModule Master", "Get_SubModule", "INSERT", res.message);
    //     }
    // }).catch(error => {
    //     const { response } = error;
    //     const { request, ...errorObject } = response;
    //     new ErrorLogService().sendErrorLog("SubModule Master", "Get_SubModule", "INSERT", errorObject.data.message);
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
    // if (location && location.state) {
    //     setNotify(location.state.alert);
    // }
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
        headerTitle="Sub-Module Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base}/SubModule/Create`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add
                  Sub-Module
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
          </div>
        </div>
      </div>

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {subModuleMasterdata && (
            <DataTable
              columns={columns}
              data={subModuleMasterdata}
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

function SubModuleDropdown(props) {
  const [data, setData] = useState(null);
  useEffect( () => {
    const tempData = [];
     new SubModuleService().getSubModule().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            counter: counter++,
            id: data[key].id,
            sub_module_name: data[key].sub_module_name,
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
            <option value={0} selected>
              Select Sub Module
            </option>
          )}
          {props.defaultValue != 0 && (
            <option value={0}>Select Sub Module</option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.sub_module_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.sub_module_name}
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

export { SubModuleComponent, SubModuleDropdown };
