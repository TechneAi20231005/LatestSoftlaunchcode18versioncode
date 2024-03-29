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
import { current } from "@reduxjs/toolkit";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";

export default function MyTicketComponent() {
  const location = useLocation()

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

  const [confirmationModal, setConfirmationModal] = useState({
    showModals: false,
    modalsData: "",
    modalsHeader: "",
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [todate, setTodate] = useState([]);
  const [fromdate, setFromdate] = useState([]);

  const [todateformat, setTodateformat] = useState("");
  const [fromdateformat, setFromdateformat] = useState("");

  const [assignUserDropdown, setAssignUserDropdown] = useState(null);
  const [toDateRequired, setToDateRequired] = useState(false);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

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

            <Link
              to={`/${_base}/Ticket/Task/` + data.id}
              className="btn btn-sm btn-outline-primary"
              style={{ width: "90px" }}
            >
              <i className="icofont-tasks"></i> Task
            </Link>
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
                  data.basket_configured === 0)) && (
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
                  data.basket_configured > 0)) && (
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
                data.basket_configured === 0)) && (
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

            <Link
              to={`/${_base}/Ticket/Task/` + data.id}
              className="btn btn-sm btn-outline-primary"
              style={{ width: "90px" }}
            >
              <i className="icofont-tasks"></i> Task
            </Link>
          </div>
        );
      }
    }
    if (type === "ADDED_BY_ME") {
      if (createdByMe && createdByMe.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              drop="up"
              as="button"
              variant=""
              id={`${"dropdown-basic_" + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
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
      // } else {

      //     return <div className="d-flex justify-content-between" style={{ width: "100%" }}>
      //         <Link to={`/${_base}/Ticket/View/` + data.id} className="btn btn-sm btn-info text-white" >
      //             <i className="icofont-external-link "></i> View</Link>

      //     </div>
      // }
    }
  };

  const searchResultColumns = [
    {
      name: "Action",
      button: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${
        searchResult ? (searchResult.length > 0 ? "4rem" : "20.625rem") : "auto"
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
      selector: (row) => {},
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
  ];
  const yourTaskColumns = [
    {
      name: "Action",
      button: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${
        yourTask ? (yourTask.length > 0 ? "4rem" : "20.625rem") : "auto"
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
      selector: (row) => {},
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
  ];

  const assignedToMeColumns = [
    {
      name: "Action",
      button: true,

      width: `${
        assignedToMe ? (assignedToMe.length > 0 ? "4rem" : "30rem") : "auto"
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
      selector: (row) => {},
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
  ];

  const createdByMeColumns = [
    {
      name: "Action",
      button: true,
      ignoreRowClick: true,
      width: `${
        createdByMe ? (createdByMe.length > 0 ? "4rem" : "20.625rem") : "auto"
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
      selector: (row) => {},
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
  ];

  const unpassedColumns = [
    {
      name: "Action",
      button: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${
        unpassedTickets
          ? unpassedTickets.length > 0
            ? "4rem"
            : "20.625rem"
          : "auto"
      }`,
      cell: (row) => actionComponent(row, "UNPASSED_TICKET"),
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
      selector: (row) => {},
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
  ];

  const departmentwisetTicketColumns = [
    {
      name: "Action",
      button: true,
      center: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${
        departmentwiseTicket
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
      selector: (row) => {},
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
  ];

  const loadData = async () => {
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    setIsLoading(true)
    
    await new UserService()
      .getUser()
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
          // setShowLoaderModal(false);

          if (res.data.status == 1) {
            if (res.status === 200) {
              if (res.data.status == 1) {
                setUserDepartment(res.data.data);
              }
            }
          }
        }
        if (res.status === 200) {
          // setShowLoaderModal(false);

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
      if (res.status === 200) {
        // setShowLoaderModal(false);
        setIsLoading(false)
        setCreatedByMe(
          res.data.createdByMe.filter((d) => d.passed_status !== "REJECT")
        );
        const dataCreatedByMe = res.data.createdByMe;
        var counter = 1;
        var tempCreatedByMeExport = [];
        for (const key in dataCreatedByMe) {
          tempCreatedByMeExport.push({
            Sr: counter++,
            TICKET_ID: dataCreatedByMe[key].ticket_id,
            TICKET_DATE: dataCreatedByMe[key].ticket_date,
            EXPECTED_SOLVE_DATE: dataCreatedByMe[key].expected_solve_date,
            ASSIGN_TO_DEPARTMENT: dataCreatedByMe[key].assign_to_department,
            ASSIGN_TO_USER: dataCreatedByMe[key].assign_to_user,
            QUERY_TYPE_NAME: dataCreatedByMe[key].query_type_name,
            PRIORITY: dataCreatedByMe[key].priority,
            STATUS: dataCreatedByMe[key].status_name,
            DESCRIPTION: dataCreatedByMe[key].description,
            CREATED_BY: dataCreatedByMe[key].created_by_name,

            Basket_Configured: dataCreatedByMe[key].basket_configured,
            Confirmation_Required: dataCreatedByMe[key].confirmation_required
              ? "YES"
              : "NO",
            Ref_id: dataCreatedByMe[key].cuid,
            from_department_name: dataCreatedByMe[key].from_department_name,
            id: dataCreatedByMe[key].id,
            Status: dataCreatedByMe[key].is_active ? "Active" : "Deactive",
            module_name: dataCreatedByMe[key].module_name,
            Passed_Status: dataCreatedByMe[key].passed_status,
            Passed_Status_Changed_At:
              dataCreatedByMe[key].passed_status_changed_at,
            Passed_Status_Changed_By_Name:
              dataCreatedByMe[key].passed_status_changed_by_name,
            Passed_Status_Remark: dataCreatedByMe[key].passed_status_remark,
            project_name: dataCreatedByMe[key].project_name,
            // query_type_name: dataCreatedByMe[key].query_type_name,
            Status_name: dataCreatedByMe[key].status_name,
            sub_module_name: dataCreatedByMe[key].sub_module_name,
            Template_id: dataCreatedByMe[key].template_id,
            Tenant_id: dataCreatedByMe[key].tenant_id,
          });
        }
        setCreatedByMeExport(tempCreatedByMeExport);

        setYourTask(
          res.data.yourTask.filter((d) => d.passed_status !== "REJECT")
        );
        const tempYourTask = res.data.yourTask;
        var counter = 1;
        var tempYourTaskExport = [];
        for (const key in tempYourTask) {
          tempYourTaskExport.push({
            Sr: counter++,
            TICKET_ID: tempYourTask[key].ticket_id,
            TICKET_DATE: tempYourTask[key].ticket_date,
            EXPECTED_SOLVE_DATE: tempYourTask[key].expected_solve_date,
            ASSIGN_TO_DEPARTMENT: tempYourTask[key].assign_to_department,
            ASSIGN_TO_USER: tempYourTask[key].assign_to_user,
            QUERY_TYPE_NAME: tempYourTask[key].query_type_name,
            PRIORITY: tempYourTask[key].priority,
            STATUS: tempYourTask[key].status_name,
            DESCRIPTION: tempYourTask[key].description,
            CREATED_BY: tempYourTask[key].created_by_name,

            Basket_Configured: tempYourTask[key].basket_configured,
            Confirmation_Required: tempYourTask[key].confirmation_required
              ? "YES"
              : "NO",
            Ref_id: tempYourTask[key].cuid,
            from_department_name: tempYourTask[key].from_department_name,
            id: tempYourTask[key].id,
            Status: tempYourTask[key].is_active ? "Active" : "Deactive",
            module_name: tempYourTask[key].module_name,
            Passed_Status: tempYourTask[key].passed_status,
            Passed_Status_Changed_At:
              tempYourTask[key].passed_status_changed_at,
            Passed_Status_Changed_By_Name:
              tempYourTask[key].passed_status_changed_by_name,
            Passed_Status_Remark: tempYourTask[key].passed_status_remark,
            project_name: tempYourTask[key].project_name,
            // query_type_name: dataCreatedByMe[key].query_type_name,
            Status_name: tempYourTask[key].status_name,
            sub_module_name: tempYourTask[key].sub_module_name,
            Template_id: tempYourTask[key].template_id,
            Tenant_id: tempYourTask[key].tenant_id,
          });
        }
        setYourTaskExport(tempYourTaskExport);

        setUnpassedTickets(res.data.unpassedTickets);
        const tempUnpassedTickets = res.data.unpassedTickets;
        var counter = 1;
        var tempUnpassedTicketsExport = [];
        for (const key in tempUnpassedTickets) {
          tempUnpassedTicketsExport.push({
            Sr: counter++,
            TICKET_ID: tempUnpassedTickets[key].ticket_id,
            TICKET_DATE: tempUnpassedTickets[key].ticket_date,
            EXPECTED_SOLVE_DATE: tempUnpassedTickets[key].expected_solve_date,
            ASSIGN_TO_DEPARTMENT: tempUnpassedTickets[key].assign_to_department,
            ASSIGN_TO_USER: tempUnpassedTickets[key].assign_to_user,
            QUERY_TYPE_NAME: tempUnpassedTickets[key].query_type_name,
            PRIORITY: tempUnpassedTickets[key].priority,
            STATUS: tempUnpassedTickets[key].status_name,
            DESCRIPTION: tempUnpassedTickets[key].description,
            CREATED_BY: tempUnpassedTickets[key].created_by_name,

            Basket_Configured: tempUnpassedTickets[key].basket_configured,
            Confirmation_Required: tempUnpassedTickets[key]
              .confirmation_required
              ? "YES"
              : "NO",
            Ref_id: tempUnpassedTickets[key].cuid,
            from_department_name: tempUnpassedTickets[key].from_department_name,
            id: tempUnpassedTickets[key].id,
            Status: tempUnpassedTickets[key].is_active ? "Active" : "Deactive",
            module_name: tempUnpassedTickets[key].module_name,
            Passed_Status: tempUnpassedTickets[key].passed_status,
            Passed_Status_Changed_At:
              tempUnpassedTickets[key].passed_status_changed_at,
            Passed_Status_Changed_By_Name:
              tempUnpassedTickets[key].passed_status_changed_by_name,
            Passed_Status_Remark: tempUnpassedTickets[key].passed_status_remark,
            project_name: tempUnpassedTickets[key].project_name,
            // query_type_name: dataCreatedByMe[key].query_type_name,
            Status_name: tempUnpassedTickets[key].status_name,
            sub_module_name: tempUnpassedTickets[key].sub_module_name,
            Template_id: tempUnpassedTickets[key].template_id,
            Tenant_id: tempUnpassedTickets[key].tenant_id,
          });
        }
        setUnpassedTicketsExport(tempUnpassedTicketsExport);

        setAssignedToMe(
          res.data.assignedToMe.filter((d) => d.passed_status !== "REJECT")
        );
        const dataAssignToMe = res.data.assignedToMe;
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
          });
        }

        setAssignedToMeExport(tempAssignToMeExport);

        setDepartmentwiseTicket(
          res.data.departmentwiseTickets.filter(
            (d) => d.passed_status !== "REJECT"
          )
        );
        const dataDepartmentwiseTicket = res.data.departmentwiseTickets;
        var counter = 1;
        var tempDepartmentwiseTicketExport = [];
        for (const key in dataDepartmentwiseTicket) {
          tempDepartmentwiseTicketExport.push({
            Sr: counter++,
            TICKET_ID: dataDepartmentwiseTicket[key].ticket_id,
            TICKET_DATE: dataDepartmentwiseTicket[key].ticket_date,
            EXPECTED_SOLVE_DATE:
              dataDepartmentwiseTicket[key].expected_solve_date,
            ASSIGN_TO_DEPARTMENT:
              dataDepartmentwiseTicket[key].assign_to_department,
            ASSIGN_TO_USER: dataDepartmentwiseTicket[key].assign_to_user,
            QUERY_TYPE_NAME: dataDepartmentwiseTicket[key].query_type_name,
            PRIORITY: dataDepartmentwiseTicket[key].priority,
            STATUS: dataDepartmentwiseTicket[key].status_name,
            DESCRIPTION: dataDepartmentwiseTicket[key].description,
            CREATED_BY: dataDepartmentwiseTicket[key].created_by_name,

            Basket_Configured: dataDepartmentwiseTicket[key].basket_configured,
            Confirmation_Required: dataDepartmentwiseTicket[key]
              .confirmation_required
              ? "YES"
              : "NO",
            Ref_id: dataDepartmentwiseTicket[key].cuid,
            from_department_name:
              dataDepartmentwiseTicket[key].from_department_name,
            id: dataDepartmentwiseTicket[key].id,
            Status: dataDepartmentwiseTicket[key].is_active
              ? "Active"
              : "Deactive",
            module_name: dataDepartmentwiseTicket[key].module_name,
            Passed_Status: dataDepartmentwiseTicket[key].passed_status,
            Passed_Status_Changed_At:
              dataDepartmentwiseTicket[key].passed_status_changed_at,
            Passed_Status_Changed_By_Name:
              dataDepartmentwiseTicket[key].passed_status_changed_by_name,
            Passed_Status_Remark:
              dataDepartmentwiseTicket[key].passed_status_remark,
            project_name: dataDepartmentwiseTicket[key].project_name,
            // query_type_name: dataCreatedByMe[key].query_type_name,
            Status_name: dataDepartmentwiseTicket[key].status_name,
            sub_module_name: dataDepartmentwiseTicket[key].sub_module_name,
            Template_id: dataDepartmentwiseTicket[key].template_id,
            Tenant_id: dataDepartmentwiseTicket[key].tenant_id,
          });
        }
        setDepartmentwiseTicketExport(tempDepartmentwiseTicketExport);
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
    setNotify(null);
    e.preventDefault();

    const formData = new FormData(e.target);
    await new MyTicketService().passTicket(formData).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setRemarkModal({ showModal: false, modalData: "", modalHeader: "" });
          loadData();
          setNotify({ type: "success", message: res.data.message });
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      } else {
        setNotify({ type: "danger", message: "Request Error !!!" });
      }
    });
  };

  const handleForm = async (e) => {
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
        setIsLoading(false)
      });
  };




  const [statusValue, setStatusValue] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [entryUser, setEntryUser] = useState("");

  const handleChangeStatus = (e) => {
    setStatusValue(e);
  };
  const handleChangeAssignedUser = (e) => {
    setAssignedUser(e);
  };
  const handleChangeEntryUser = (e) => {
    setEntryUser(e);
  };

  const disableDate = () => {
    const date = new Date();
    const result = date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    var listString = result.split("-").reverse();
    return Array.from(listString).join("-");
  };

  const selectInputRef = useRef();
  const selectAssignUserRef = useRef();
  const selectEntryDeptRef = useRef();
  const selectUserRef = useRef();
  const selectStatusRef = useRef();
  const selectFromDateRef = useRef();
  const selectToDateRef = useRef();
  const selectTicketRef = useRef();

  // const ticketIdRef = useRef();
  // const onClear = () => {
  //     if(selectInputRef.current.props.value != null)
  //     selectInputRef.current.clearValue();
  //     alert('hii')

  //   };

  const handleClearData = (e) => {
    // console.log(document.getElementById("ticket_idd").value);
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

    // selectFromDateRef.current.defaultValue= ""
    // ticketIdRef.current.clearValue();
    // if (selectFromDateRef.current.value != null) {
    //     document.getElementById('from_date').value = "";
    // }
    // if (selectFromDateRef.current.value != null) {
    //     document.getElementById("from_date").value=""
    // }

    // else if (document.getElementById('to_date').value != null) {
    //     document.getElementById('to_date').value = "";
    // } else if (document.getElementById("ticket_idd").value != null) {
    //     document.getElementById('ticket_idd').value = "";
    // }
    // document.getElementById('assign_to_user_id[]').value = "";
  };
  const [startDate, setStartDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ticket, setTicket] = useState("");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  const handleFromDate = (e) => {
    setStartDate(e.target.value);
    if (e.target.value) {
      setToDateRequired(true);
    } else {
      setToDateRequired(false);
    }
    // const gettodatevalue = e.target.value;
    // const setdateformat = gettodatevalue.split('-');
    // const settoyear = setdateformat[0];
    // const settomonth = setdateformat[1];
    // const settodate = setdateformat[2];
    // const settodateformat = settoyear + "" + settomonth + "" + settodate;
    // setTodate(gettodatevalue);
    // setTodateformat(settodateformat);
  };

  const handleToDate = (e) => {
    setToDate(e.target.value);
    // const getfromdatevalue = e.target.value;
    // const setfromformat = getfromdatevalue.split("-");
    // const setfromyear = setfromformat[0];
    // const setfrommonth = setfromformat[1];
    // const setfromdate = setfromformat[2];
    // const setfromformatdate = setfromyear + "" + setfrommonth + "" + setfromdate;
    // setFromdate(getfromdatevalue);
    // setFromdateformat(setfromformatdate);
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
  const formRef = useRef();

  const handleRef = (e) => {
    formRef.current.reset();
  };

  // const handleDepartment = (e) => {
  //     console.log(e.value)
  //     const select = user.filter(d => d.department_id == e.value)
  //         .map(d => ({ value: d.id, label: d.first_name + " " + d.last_name }))
  //     setUserDropdown(select);
  //     console.log(select)
  //     setUserName(null);

  // }
  const [entryDepartment, setEntryDepartment] = useState();

  const handleDepartment = (e) => {
    const deptUser = [];
    for (var i = 0; i < e.length; i++) {
      const select = user.filter((d) => d.department_id == e[i].value).map((d) => ({ value: d.id, label: d.first_name + " " + d.last_name }));
      for (var j = 0; j < select.length; j++) {
        deptUser.push(select[j]);
      }
    }
    setUserDropdown(deptUser);
    setUserName(null);

    setEntryDepartment(e);
  };

  const [assignedDepartmentValue, setAssignedDepartment] = useState("");

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

  const [key, setKey] = useState("Assigned_To_Me");
  useEffect(() => {
    loadData();
    if (location && location.state) {
      setNotify(location.state.alert);
    }
  }, []);

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


  useEffect(()=>{
    if(checkRole && checkRole[15].can_read === 0){
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
    }
  },[checkRole])

  const handleAssignedToMeTab = (e) =>{
  }

  function LoaderComponent() {
    return (
      // Container to center-align the spinner and loading text
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        {/* Spinner element with custom styling */}
        <Spinner animation="border" role="status" style={{ width: '100px', height: '100px', borderWidth: '5px', color: '#484c7f', marginBottom: '10px' }}>
          {/* Visually hidden loading text for accessibility */}
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        {/* Loading text displayed below the spinner */}
        <div style={{ color: '#484c7f', fontSize: '16px', fontWeight: 'bold' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="My Tickets" />
      {/* <LoadingSpinner/> */}
      {notify && <Alert alertData={notify} />}
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
                    Validation.CharactersNumbersOnly(e);
                  }}
                />
              </div>
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
          ref={formRef}
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
                      <b>Entry Department    :</b>
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
                {/********************************** ****************************/}

                {/* ***************************Status**************** */}
                <div className="col-md-12">
                  <label className="">
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
                onSelect={(k) => {setKey(k) ;handleAssignedToMeTab(k)}}
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
                            pagination
                            fixedHeader={true}
                            fixedHeaderScrollHeight={"500px"}
                            selectableRows={false}
                            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                            highlightOnHover={true}
                          />
                        )}
                      </div>
                    </div>
                  </Tab>
                )}

                <Tab  eventKey="Assigned_To_Me" title="Assigned To me">
                  <div className="card mb-3 mt-3">
                    <div className="card-body">
                      {assignedToMeExport && (
                        <ExportToExcel
                          className="btn btn-sm btn-danger mt-3"
                          apiData={assignedToMeExport}
                          fileName="Assign To Me"
                        />
                      )}

                      {assignedToMe && (
                        <DataTable
                          columns={assignedToMeColumns}
                          data={assignedToMe}
                          defaultSortField="title"
                          pagination
                          fixedHeader={true}
                          fixedHeaderScrollHeight={"700px"}
                          selectableRows={false}
                          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                          highlightOnHover={true}
                        />
                      )}
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="created_by_me" title="Created By Me">
                  <div className="card mb-3 mt-3">
                    <div className="card-body">
                      {createdByMeExport && (
                        <ExportToExcel
                          className="btn btn-sm btn-danger mt-3"
                          apiData={createdByMeExport}
                          fileName="Created By Me"
                        />
                      )}
                      {createdByMe && (
                        <DataTable
                          columns={createdByMeColumns}
                          data={createdByMe}
                          defaultSortField="title"
                          pagination
                          fixedHeader={true}
                          fixedHeaderScrollHeight={"500px"}
                          selectableRows={false}
                          highlightOnHover={true}
                        />
                      )}
                    </div>
                  </div>
                </Tab>

                <Tab
                  eventKey="departmenyourTaskt"
                  title="Departmentwise Tickets"
                >
                  <div className="card mb-3 mt-3">
                    <div className="card-body">
                      {departmentwiseTicketExport && (
                        <ExportToExcel
                          className="btn btn-sm btn-danger mt-3"
                          apiData={departmentwiseTicketExport}
                          fileName="Departmentwise Ticket"
                        />
                      )}
                      {departmentwiseTicket && (
                        <DataTable
                          columns={departmentwisetTicketColumns}
                          data={departmentwiseTicket}
                          defaultSortField="title"
                          pagination
                          fixedHeader={true}
                          fixedHeaderScrollHeight={"500px"}
                          selectableRows={false}
                          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                          highlightOnHover={true}
                        />
                      )}
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="your_task" title="Your Task">
                  <div className="card mb-3 mt-3">
                    <div className="card-body">
                      {yourTaskExport && (
                        <ExportToExcel
                          className="btn btn-sm btn-danger mt-3"
                          apiData={yourTaskExport}
                          fileName="Your Task"
                        />
                      )}
                      {yourTask && (
                        <DataTable
                          columns={yourTaskColumns}
                          data={yourTask}
                          defaultSortField="title"
                          pagination
                          fixedHeader={true}
                          fixedHeaderScrollHeight={"500px"}
                          selectableRows={false}
                          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                          highlightOnHover={true}
                        />
                      )}
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="unpassed_columns" title="Unpassed Ticket">
                  <div className="card mb-3 mt-3">
                    <div className="card-body">
                      {unpassedTicketsExport && (
                        <ExportToExcel
                          className="btn btn-sm btn-danger mt-3"
                          apiData={unpassedTicketsExport}
                          fileName="Unpassed Ticket"
                        />
                      )}
                      {unpassedTickets && (
                        <DataTable
                          columns={unpassedColumns}
                          data={unpassedTickets}
                          defaultSortField="title"
                          pagination
                          fixedHeader={true}
                          fixedHeaderScrollHeight={"500px"}
                          selectableRows={false}
                          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                          highlightOnHover={true}
                        />
                      )}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* <Modal show={showLoaderModal} centered>
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
              <input
                type="hidden"
                className="form-control form-control-sm"
                id="id"
                name="id"
                defaultValue={remarkModal.modalData.id}
              />
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Ticket Id :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    defaultValue={remarkModal.modalData.ticket_id}
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

   {isLoading === true &&  <LoaderComponent/> }

    </div>
  );
}
