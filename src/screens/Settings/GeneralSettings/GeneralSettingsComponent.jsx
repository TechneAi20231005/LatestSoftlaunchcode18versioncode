import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import ErrorLogService from "../../../services/ErrorLogService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import PageHeader from "../../../components/Common/PageHeader";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Alert from "../../../components/Common/Alert";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import { Spinner } from "react-bootstrap";
import UserService from "../../../services/MastersService/UserService";
import GeneralSettingService from "../../../services/SettingService/GeneralSettingService";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useSelector, useDispatch } from "react-redux";
import {
  getGeneralSettingData,
  postGeneralSettingData,
  updateGeneralSettingData,
} from "../SettingAction";
import MyTicketComponentSlice from "../../TicketManagement/MyTicketComponentSlice";
import { getUserForMyTicketsData } from "../../TicketManagement/MyTicketComponentAction";
import { handleModalClose, handleGeneralModal } from "../SettingSlice";

function GeneralSettings() {
  const [data, setData] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [user, setUser] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [notify, setNotify] = useState();
  const [authority, setAuthority] = useState(["Upload ", "Delete", " Restore"]);
  const [generalSetting, setGeneralSetting] = useState([]);
  const [checkRole, setCheckRole] = useState([]);

  const dispatch = useDispatch();

  const getAllgeneralSettingData = useSelector(
    (SettingSlice) => SettingSlice.generalSetting.getAllgeneralSettingData
  );
  const User = useSelector(
    (MyTicketComponentSlice) => MyTicketComponentSlice.myTicketComponent.user
  );
  const Notify = useSelector(
    (SettingSlice) => SettingSlice.generalSetting.notify
  );
  const modal = useSelector(
    (SettingSlice) => SettingSlice.generalSetting.modal
  );

  const [assignedUserModal, setAssignedUserModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const userDetail = useRef();
  const searchRef = useRef();
  const userValue = useRef();

  const useSetting = useRef();
  const useRemark = useRef();

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

  const loadData = async () => {
    const inputRequired = "id,employee_id,first_name,last_name";
    dispatch(getGeneralSettingData());
    dispatch(getUserForMyTicketsData(inputRequired));
    setShowLoaderModal(null);
    const data = [];
    const exportTempData = [];
    const roleId = sessionStorage.getItem("role_id");

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const temp = res.data.data.filter((d) => d.menu_id === 78);

          setCheckRole(temp);
        }
      }
    });

    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        const tempData = [];
        const temp = res.data.data;
        if (res.data.status == 1) {
          const data = res.data.data.sort((a, b) => {
            if (a.first_name && b.first_name) {
              return a.first_name.localeCompare(b.first_name);
            }
            return 0;
          });
          setUser(
            data.map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name,
            }))
          );
        }
      }
    });
    await new GeneralSettingService().getGeneralSetting().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          let data = [...res.data.data];
          let count = 1;
          for (let i = 0; i < data.length; i++) {
            data[i].counter = count++;
          }

          setGeneralSetting(data);
        }
      }
    });
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();

    const userDet = userDetail?.current?.props?.value;
    const usersettingValue = userValue?.current?.value;

    const settingName = useSetting?.current?.value;
    const remark = useRemark?.current?.value;
    let array = [];

    // Add the value 0 to the array
    array.push(0);

    // Assign the array to form.user_id

    let arrayOfId = [];
    for (let i = 0; i < userDet?.length; i++) {
      arrayOfId.push(userDet[i].value);
    }

    const form = {};
    // if (settingName === "Time Regularization after task complete") {
    //   form.user_id = array;
    // } else if (
    //   settingName === "Time Regularization after task complete" &&
    //   arrayOfId?.length > 0
    // ) {
    //   form.user_id = arrayOfId;
    // } else {
    //   form.user_id = arrayOfId;
    // }

    if (
      settingName === "Time Regularization after task complete" &&
      arrayOfId?.length == 0
    ) {
      form.user_id = array;
    } else {
      form.user_id = arrayOfId;
    }

    form.setting_name = settingName;
    form.remark = remark;
    form.value = usersettingValue;
    form.is_active = true;

    setNotify(null);
    if (!id) {
      dispatch(postGeneralSettingData(form));
    } else {
      dispatch(updateGeneralSettingData({ id, payload: form }));
    }
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
      width: "5%",
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              dispatch(
                handleGeneralModal({
                  showModal: true,
                  modalData: row,
                  modalHeader: "Edit Settings",
                })
              );
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
      width: "5%",
    },
    {
      name: "Setting Name",
      selector: (row) => row.setting_name,
      sortable: true,
      width: "10%",
    },
    {
      name: "Assigned User",
      // selector: (row) => row.setting_name,
      sortable: true,
      width: "20%",
      cell: (row) => {
        let arr = [];
        User.filter((el) => {
          if (row.user_id.includes(el.value)) {
            arr.push(el.label);
          }
        });

        return (
          <>
            <OverlayTrigger overlay={<Tooltip>{arr.join(", ")}</Tooltip>}>
              <div>
                <span className="ms-1">
                  {arr.length > 2 ? `${(arr[0], arr[1])}...` : `${arr}`}
                </span>
              </div>
            </OverlayTrigger>
          </>
        );
      },
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
      width: "10%",
    },
    {
      name: "Remark",
      selector: (row) => row.remark,
      sortable: true,
      width: "10%",
    },
    {
      name: "Created at",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "Created by",
      sortable: true,
      cell: (row) => {
        let userList = User.filter(
          (userData) => row.created_by === userData.value
        );
        //   return (
        //     <>
        //       {userList[0].label}
        //     </>
        //   )
        // }
        if (userList && userList.length > 0) {
          return <>{userList[0].label}</>;
        } else {
          return <>{""}</>;
        }
      },
    },
    {
      name: "Updated at",
      selector: (row) => row.updated_at,
      sortable: true,
    },
    {
      name: "Updated by",
      sortable: true,
      cell: (row) => {
        let userList = User.filter(
          (userData) => row.updated_by === userData.value
        );
        if (userList && userList.length > 0) {
          return <>{userList[0].label}</>;
        } else {
          return <>{""}</>;
        }
      },
    },
  ];

  const handleKeyPress = (event) => {
    // Prevent typing more than one character
    if (event.target.value.length >= 1) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container-xxl">
      {Notify && (
        <>
          {" "}
          <Alert alertData={Notify} />{" "}
        </>
      )}
      <PageHeader
        headerTitle="General Settings"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <button
                className="btn btn-dark btn-set-task w-sm-100"
                // onClick={() => {

                //   dispatch(
                //     handleModalInStore({
                //       showModal: true,
                //       modalData: null,
                //       modalHeader: "Add Setting",
                //     })
                //   );
                // }}
                onClick={() => {
                  dispatch(
                    handleGeneralModal({
                      showModal: true,
                      modalData: null,
                      modalHeader: "Add Setting",
                    })
                  );
                }}
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add Setting
              </button>
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
              placeholder="Search by Setting name...."
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
              apiData={exportData}
              fileName="General Settings"
            />
          </div>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {getAllgeneralSettingData && (
                <DataTable
                  columns={columns}
                  data={getAllgeneralSettingData}
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
                  modalData: null,
                  modalHeader: "Add Setting",
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
                    Setting Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="setting_name"
                    name="setting_name"
                    maxLength={50}
                    ref={useSetting}
                    defaultValue={
                      modal.modalData && modal.modalData.setting_name
                    }
                    required
                    readOnly={modal.modalData ? true : false}
                  />
                </div>

                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">Value :</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    id="value"
                    name="value"
                    maxLength={1}
                    onKeyPress={handleKeyPress}
                    ref={userValue}
                    defaultValue={modal.modalData && modal.modalData.value}
                    // readOnly={modal.modalData ? true : false}
                  />
                </div>

                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Select User :<Astrick color="red" size="13px" />
                  </label>
                  {user && (
                    <Select
                      id="user_id"
                      name="user_id[]"
                      ref={userDetail}
                      options={user}
                      // defaultValue={}
                      isMulti
                      defaultValue={
                        modal.modalData &&
                        user?.filter((d) =>
                          modal.modalData.user_id.includes(d.value)
                        )
                      }
                    />
                  )}
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
                    ref={useRemark}
                    defaultValue={modal.modalData ? modal.modalData.remark : ""}
                  />
                </div>
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
            {modal.modalData && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: "#484C7F" }}
              >
                Update
              </button>
            )}
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                // handleModal({
                //   showModal: false,
                //   modalData: "",
                //   modalHeader: "",
                // });
                {
                  dispatch(
                    handleModalClose({
                      showModal: false,
                      modalData: "",
                      modalHeader: "",
                    })
                  );
                }
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

export default GeneralSettings;
