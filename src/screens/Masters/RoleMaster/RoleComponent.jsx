import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import RoleService from "../../../services/MastersService/RoleService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Alert from "../../../components/Common/Alert";
import { Link } from "react-router-dom";
import { _base } from "../../../settings/constants";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import RoleMasterSlice from "./RoleMasterSlice";
import { getRoleData, updatedRole } from "./RoleMasterAction";
import { getRoles } from "../../Dashboard/DashboardAction";
import { postRole } from "./RoleMasterAction";
import { handleModalOpen, handleModalClose } from "./RoleMasterSlice";
import DashboardSlice from "../../Dashboard/DashboardSlice";

function RoleComponent({ location }) {
  const dispatch = useDispatch();
  const RoleMasterData = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.getRoleData
  );
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 10)
  );
  console.log("checkRole",checkRole)

  const Notify = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.notify
  );
  const modal = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.modal
  );
  const exportData = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.exportRoleData
  );

  console.log("moadal", exportData);

  const [data, setData] = useState(null);
  const [dataa, setDataa] = useState(null);
  const [notify, setNotify] = useState();

  // const [modal, setModal] = useState({
  //   showModal: false,
  //   modalData: "",
  //   modalHeader: "",
  // });

  // const handleModal = (data) => {
  //   setModal(data);
  // };

  // const [exportData, setExportData] = useState(null);

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

  const [searchTerm, setSearchTerm] = useState('');
  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // };
  const [filteredData, setFilteredData] = useState([]);
  
  const handleSearch = (value) => {
    console.log("fff",filteredData);
  };
  

  const columns = [
    {
      name: "Action",
      selector: (row) => {},
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div className="btn-group-sm" role="group">
          {checkRole && checkRole[0]?.can_update == 1 ? (
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-toggle="modal"
              data-bs-target="#edit"
              onClick={(e) => {
                dispatch(
                  handleModalOpen({
                    showModal: true,
                    modalData: row,
                    modalHeader: "Edit Role",
                  })
                );
              }}
            >
              <i className="icofont-edit text-success"></i>
            </button>
          ) : (
            ""
          )}
          {checkRole && checkRole[0]?.can_create == 1 ? (
            <Link
              to={`/${_base}/MenuManage/` + row.id}
              className="btn btn-primary"
              style={{
                maxWidth: "100%",
                fontSize: "0.75rem",
                borderRadius: "1rem",
              }}
            >
              Add Access
            </Link>
          ) : (
            ""
          )}
        </div>
      ),
    },

    { name: "Sr", selector: (row) => row.counter, sortable: true },
    {
      name: "Role",
      id: "role_id",
      sortable: true,
      selector: (row) => {},
      cell: (row) => (
        <div>
          <OverlayTrigger overlay={<Tooltip>{row.role} </Tooltip>}>
            <div>
              {/* <span className="ms-1"> {row.role}</span> */}
              <span>
                {row.role.length > 12
                  ? row.role.substring(0, 12) + "..."
                  : row.role}
              </span>
            </div>
          </OverlayTrigger>
        </div>
      ),
    },

    {
      name: "Status",
      selector: (row) => row.is_active,
      sortable: true,
      width: "150px",
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
    //   const data = [];
    //   const exportTempData = [];
    //   await new RoleService().getRole().then(res => {
    //       if (res.status === 200) {
    //           let counter = 1;
    //           const temp = res.data.data
    //           for (const key in temp) {
    //               data.push({
    //                   counter: counter++,
    //                   id: temp[key].id,
    //                   role: temp[key].role,
    //                   is_active: temp[key].is_active,
    //                   remark: temp[key].remark,
    //                   created_at: temp[key].created_at,
    //                   created_by: temp[key].created_by,
    //                   updated_at: temp[key].updated_at,
    //                   updated_by: temp[key].updated_by
    //               })
    //           }
    //           setData(null);
    //           setData(data);
    //           setDataa(data)
    //           for (const i in data) {
    //               exportTempData.push({
    //                   Sr: data[i].counter,
    //                   Role: data[i].role,
    //                   Status: data[i].is_active ? 'Active' : 'Deactive',
    //                   Remark:data[i].remark,
    //                   created_at: data[i].created_at,
    //                   created_by: data[i].created_by,
    //                   updated_at: data[i].updated_at,
    //                   updated_by: data[i].updated_by,
    //               })
    //           }
    //     setExportData(null);
    //     setExportData(exportTempData);
    //   }
    // })
    // .catch((error) => {
    //   const { response } = error;
    //   const { request, ...errorObject } = response;
    //   new ErrorLogService().sendErrorLog(
    //     "Department",
    //     "Get_Department",
    //     "INSERT",
    //     errorObject.data.message
    //   );
    // });
    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);

    if (!id) {
      dispatch(postRole(form));
      dispatch(getRoleData());
      // await new RoleService().postRole(form).then((res) => {
      //   console.log("res",res);
      //     if (res.status === 200) {
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
      //         "Role",
      //         "Create_Role",
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
      //       "Role",
      //       "Create_Role",
      //       "INSERT",
      //       errorObject.data.message
      //     );
      //   });
    } else {
      dispatch(updatedRole({ id: id, payload: form }));
      dispatch(getRoleData());
      // await new RoleService().updateRole(id, form)
      //   .then((res) => {
      //     if (res.status === 200) {
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
      //         "Role",
      //         "Edit_Role",
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
      //       "Role",
      //       "Edit_Role",
      //       "INSERT",
      //       errorObject.data.message
      //     );
      //   });
    }
  };

  // //Search As Enter key press
  // useEffect(() => {
  //     const listener = event => {
  //         if (event.code === "Enter") {
  //             console.log("Enter key was pressed. Run your function.");
  //             // callMyFunction();
  //             handleSearch()
  //         }
  //     };
  //     document.addEventListener("keydown", listener);
  //     return () => {
  //         document.removeEventListener("keydown", listener);
  //     };
  // }, [data]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    // if(checkRole && checkRole[9].can_read === 0){
    //   // alert("Rushi")

    //   window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    // }
    loadData();

    const storedAlert = localStorage.getItem("alert");
    if (storedAlert) {
      setNotify(storedAlert);

      localStorage.removeItem("alert");
    } else if (location && location.state && location.state.alert) {
      setNotify(location.state.alert);
      localStorage.setItem("alert", location.state.alert);
    }
  }, [location]);

  useEffect(() => {
    loadData();

    if (!RoleMasterData.length) {
      dispatch(getRoleData());
      dispatch(getRoles());
    }
  }, []);

  return (
    <div className="container-xxl">
      {Notify && <Alert alertData={Notify} />}
      <PageHeader
        headerTitle="Role Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <button
                  className="btn btn-dark btn-set-task w-sm-100"
                  onClick={() => {
                    dispatch(
                      handleModalOpen({
                        showModal: true,
                        modalData: null,
                        modalHeader: "Add Role",
                      })
                    );
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Role
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
              placeholder="Search by Role Name...."
              ref={searchRef}
              // onKeyDown={handleKeyDown}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              fileName="Role master Records"
            />
          </div>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {RoleMasterData && (
                <DataTable
                  columns={columns}
                  data={RoleMasterData.filter(customer => {
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
                  defaultSortField="role_id"
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
          <Modal.Header
            closeButton
            onClick={() => {
              dispatch(
                handleModalClose({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                })
              );
            }}
          >
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Role Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="role"
                    name="role"
                    maxLength={25}
                    required
                    defaultValue={modal.modalData ? modal.modalData.role : ""}
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersOnly(e);
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
            {modal.modalData && checkRole && checkRole[0]?.can_update === 1 ? (
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
              onClick={() => {
                dispatch(
                  handleModalClose({
                    showModal: false,
                    modalData: "",
                    modalHeader: "",
                  })
                );
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

function RoleDropdown(props) {
  const [data, setData] = useState(null);
  useEffect( () => {
    const tempData = [];
     new RoleService().getRole().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        let counter = 1;
        for (const key in data) {
          tempData.push({
            counter: counter++,
            id: data[key].id,
            role: data[key].role,
          });
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
          value={props.defaultValue}
        >
          {props.defaultValue == 0 && (
            <option value={0} selected>
              Select Role
            </option>
          )}
          {props.defaultValue != 0 && <option value={0}>Select Role</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.role}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.role}
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

export { RoleComponent, RoleDropdown };
