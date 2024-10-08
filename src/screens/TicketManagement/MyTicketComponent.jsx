import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Dropdown } from 'react-bootstrap';
import { _base } from '../../settings/constants';
import Alert from '../../components/Common/Alert';
import ErrorLogService from '../../services/ErrorLogService';
import MyTicketService from '../../services/TicketService/MyTicketService';
import UserService from '../../services/MastersService/UserService';
import DepartmentService from '../../services/MastersService/DepartmentService';
import StatusService from '../../services/MastersService/StatusService';
import ReportService from '../../services/ReportService/ReportService';
import PageHeader from '../../components/Common/PageHeader';
import Select from 'react-select';
import { ExportToExcel } from '../../components/Utilities/Table/ExportToExcel';
import DepartmentMappingService from '../../services/MastersService/DepartmentMappingService';
import * as Validation from '../../components/Utilities/Validation';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './custome.css';
import { Spinner } from 'react-bootstrap';

import { ExportAllTicketsToExcel } from '../../components/Utilities/Table/ExportAllTicketsToExcel';
import { useSelector, useDispatch } from 'react-redux';

import { getRoles } from '../Dashboard/DashboardAction';
import TableLoadingSkelton from '../../components/custom/loader/TableLoadingSkelton';

export default function MyTicketComponent() {
  const [notify, setNotify] = useState(null);
  // const [data, setData] = useState(null);
  const [userDropdown, setUserDropdown] = useState(null);
  const [customerUserDropdown, setCustomerUserDropdown] = useState(null);

  const [user, setUser] = useState('');

  const [statusData, setStatusData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);

  const [searchResult, setSearchResult] = useState();
  const [searchResultData, setSearchResultData] = useState();

  const [searchResultExport, setSearchResultExport] = useState();

  const [unpassedTickets, setUnpassedTickets] = useState(null);

  const [assignedToMe, setAssignedToMe] = useState(null);

  const [yourTask, setYourTask] = useState(null);

  const [createdByMe, setCreatedByMe] = useState(null);

  const [departmentwiseTicket, setDepartmentwiseTicket] = useState(null);

  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 17)
  );

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const [remarkModal, setRemarkModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const [confirmationModal, setConfirmationModal] = useState({
    showModals: false,
    modalsData: '',
    modalsHeader: ''
  });

  const [locationState, setLocationState] = useState(null);
  const location = useLocation();

  const account_for = localStorage.getItem('account_for');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [assignUserDropdown, setAssignUserDropdown] = useState(null);
  const [toDateRequired, setToDateRequired] = useState(false);
  const showLoaderModal = false;
  // const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [assignedToMeData, setAssignedToMeData] = useState();
  const [selectAllNames, setSelectAllNames] = useState(false);
  const [createdByMeData, setCreatedByMeData] = useState();
  const [departmentWiseData, setDepartmentWiseData] = useState();
  const [yourTaskData, setYourTaskData] = useState();
  const [unpassedData, setUnpassedData] = useState();

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowss, setSelectedRowss] = useState([]);
  const [statusValue, setStatusValue] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [entryUser, setEntryUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [ticket, setTicket] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assignedDepartmentValue, setAssignedDepartment] = useState('');
  const [entryDepartment, setEntryDepartment] = useState();
  const [key, setKey] = useState('Assigned_To_Me');
  const selectInputRef = useRef();
  const selectAssignUserRef = useRef();
  const selectEntryDeptRef = useRef();
  const selectUserRef = useRef();
  const selectStatusRef = useRef();
  const selectFromDateRef = useRef();
  const selectToDateRef = useRef();
  const selectTicketRef = useRef();
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  const timeString = `${currentDate
    .getHours()
    .toString()
    .padStart(2, '0')}${currentDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;
  const formattedTimeString = `${timeString.slice(0, 2)}:${timeString.slice(
    2,
    4
  )}:${timeString.slice(4, 6)}`;
  const handleDepartment = (e) => {
    const deptUser = [];
    for (var i = 0; i < e.length; i++) {
      const select = user
        // eslint-disable-next-line no-loop-func
        .filter((d) => d.department_id === e[i].value)
        .map((d) => ({ value: d.id, label: d.first_name + ' ' + d.last_name }));
      for (var j = 0; j < select.length; j++) {
        deptUser.push(select[j]);
      }
    }
    setUserDropdown(deptUser);
    // setUserName(null);

    setEntryDepartment(e);
  };

  const handleSelectAllNamesChange = () => {
    setSelectAllNames(!selectAllNames);
    setSelectedRowss(
      selectAllNames
        ? []
        : unpassedTickets && unpassedTickets.map((row) => row.id)
    );
  };

  const handleConfirmationModal = (e, data) => {
    var d = {};
    setConfirmationModal(null);
    if (data) {
      d = { showModals: true, modalsData: data, modalsHeader: 'Solve Ticket' };
    } else {
      d = { showModals: false, modalsData: '', modalsHeader: 'Solve Ticket' };
    }
    setConfirmationModal(d);
  };

  const handleSolveTicketModal = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setNotify(null);

    var id = form.get('id');

    await new MyTicketService()
      .verifyTicketConfirmationOtp(id, form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setNotify({ type: 'success', message: res.data.message });
            setConfirmationModal({
              showModal: false,
              modalData: '',
              modalHeader: ''
            });
            loadData();
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        }
      });
  };

  const handleModal = (data) => {
    setModal(data);
  };

  const handleRemarkModal = (data) => {
    setRemarkModal(data);
  };

  const actionComponent = (data, type) => {
    if (type === 'SEARCH_RESULT') {
      if (searchResult && searchResult.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${'dropdown-basic_' + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              {data.created_by === localStorage.getItem('id') ||
                data.assign_to_user_id === localStorage.getItem('id') ||
                (data.status_name !== 'Solved' &&
                  data.passed_status !== 'REJECT' &&
                  localStorage.getItem('account_for' === 'SELF')) ||
                (data?.projectowner?.filter(
                  (d) => d.user_id === localStorage.getItem('id')
                ) && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Edit/` + data.id}
                      className="btn btn-sm btn-warning text-white"
                      style={{ width: '100%', zIndex: '100' }}
                    >
                      <i className="icofont-ui-edit"></i> Edit
                    </Link>
                  </li>
                ))}

              <li>
                {' '}
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{' '}
              </li>

              {data.created_by !== localStorage.getItem('id') &&
                data.basket_configured === 0 &&
                localStorage.getItem('account_for') === 'SELF' &&
                data.status_name !== 'Solved' &&
                data.passed_status !== 'REJECT' &&
                data.passed_status !== 'UNPASS' && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Basket/` + data.id}
                      className="btn btn-sm btn-primary text-white"
                      style={{ width: '100%', zIndex: 100 }}
                    >
                      <i className="icofont-bucket2"></i>Basket
                    </Link>
                  </li>
                )}

              {(data.created_by !== localStorage.getItem('id') &&
                data.basket_configured > 0 &&
                data.status_name !== 'Solved' &&
                localStorage.getItem('account_for' === 'SELF')) ||
                (data?.projectowner?.filter(
                  (d) => d.user_id === localStorage.getItem('id')
                ) && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Task/` + data.id}
                      className="btn btn-sm btn-outline-primary"
                      style={{ width: '100%', zIndex: 100 }}
                    >
                      <i className="icofont-tasks"></i> Task
                    </Link>
                  </li>
                ))}

              <li>
                <Link
                  to={`/${_base}/TicketHistory/` + data.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{ width: '100%', zIndex: 100 }}
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
            {data.created_by === sessionStorage.getItem('id') ||
              (data.assign_to_user_id === sessionStorage.getItem('id') &&
                data.status_name !== 'Solved' && (
                  <Link
                    to={`/${_base}/Ticket/Edit/` + data.id}
                    className="btn btn-sm btn-warning text-white"
                    style={{ width: '90px' }}
                  >
                    <i className="icofont-ui-edit"></i> Edit
                  </Link>
                ))}

            <Link
              to={`/${_base}/Ticket/View/` + data.id}
              className="btn btn-sm btn-info text-white"
              style={{ width: '90px' }}
            >
              <i className="icofont-external-link "></i> View
            </Link>

            <Link
              to={`/${_base}/TicketHistory/` + data.id}
              className="btn btn-sm btn-primary text-white"
              style={{ width: '90px' }}
            >
              <i className="icofont-history"></i> History
            </Link>
          </div>
        );
      }
    }
    if (type === 'YOUR_TASK') {
      if (yourTask && yourTask.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${'dropdown-basic_' + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              {data.created_by === localStorage.getItem('id') ||
                (data.assign_to_user_id === localStorage.getItem('id') && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Edit/` + data.id}
                      className="btn btn-sm btn-warning text-white"
                      style={{ width: '100%', zIndex: '100' }}
                    >
                      <i className="icofont-ui-edit"></i> Edit
                    </Link>
                  </li>
                ))}
              <li>
                {' '}
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{' '}
              </li>

              {
                (data.created_by = localStorage.getItem('id') &&
                  localStorage.getItem('account_for') === 'SELF' &&
                  data.basket_configured > 0 && (
                    <li>
                      <Link
                        to={`/${_base}/Ticket/Task/` + data.id}
                        className="btn btn-sm btn-outline-primary"
                        style={{ width: '100%', zIndex: 100 }}
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
            {data.created_by === localStorage.getItem('id') ||
              (data.assign_to_user_id === localStorage.getItem('id') && (
                <Link
                  to={`/${_base}/Ticket/Edit/` + data.id}
                  className="btn btn-sm btn-warning text-white"
                  style={{ width: '90px' }}
                >
                  <i className="icofont-ui-edit"></i> Edit
                </Link>
              ))}
            <Link
              to={`/${_base}/Ticket/View/` + data.id}
              className="btn btn-sm btn-info text-white"
              style={{ width: '90px' }}
            >
              <i className="icofont-external-link "></i> View
            </Link>

            {localStorage.getItem('account_for') === 'SELF' && (
              <Link
                to={`/${_base}/Ticket/Task/` + data.id}
                className="btn btn-sm btn-outline-primary"
                style={{ width: '90px' }}
              >
                <i className="icofont-tasks"></i> Task
              </Link>
            )}
          </div>
        );
      }
    }
    if (type === 'ASSIGNED_TO_ME') {
      if (assignedToMe && assignedToMe.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1" align>
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${'dropdown-basic_' + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              <li>
                <Link
                  to={`/${_base}/Ticket/Edit/` + data.id}
                  className="btn btn-sm btn-warning text-white"
                  style={{ width: '100%', zIndex: '100' }}
                >
                  <i className="icofont-ui-edit"></i> Edit
                </Link>
              </li>
              {/* } */}
              <li>
                {' '}
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{' '}
              </li>

              <li>
                <Link
                  to={`/${_base}/TicketHistory/` + data.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-history"></i> History
                </Link>
              </li>

              {((data.created_by !== localStorage.getItem('id') &&
                data.basket_configured === 0) ||
                (data.assign_to_user_id === localStorage.getItem('id') &&
                  data.basket_configured === 0)) &&
                localStorage.getItem('account_for') === 'SELF' && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Basket/` + data.id}
                      className="btn btn-sm btn-primary text-white"
                      style={{ width: '100%', zIndex: 100 }}
                    >
                      <i className="icofont-bucket2"></i>Basket
                    </Link>
                  </li>
                )}

              {((data.created_by !== localStorage.getItem('id') &&
                data.basket_configured > 0) ||
                (data.assign_to_user_id === localStorage.getItem('id') &&
                  data.basket_configured > 0)) &&
                localStorage.getItem('account_for') === 'SELF' && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Task/` + data.id}
                      className="btn btn-sm btn-outline-primary"
                      style={{ width: '100%', zIndex: 100 }}
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
              style={{ width: '90px' }}
            >
              <i className="icofont-history"></i> History
            </Link>

            {((data.created_by !== localStorage.getItem('id') &&
              data.basket_configured === 0) ||
              (data.assign_to_user_id === localStorage.getItem('id') &&
                data.basket_configured === 0)) &&
              localStorage.getItem('account_for') === 'SELF' && (
                <Link
                  to={`/${_base}/Ticket/Basket/` + data.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{ width: '90px' }}
                >
                  <i className="icofont-bucket2"></i>Basket
                </Link>
              )}

            <Link
              to={`/${_base}/Ticket/Edit/` + data.id}
              className="btn btn-sm btn-warning text-white"
              style={{ width: '90px' }}
            >
              <i className="icofont-ui-edit"></i> Edit
            </Link>

            <Link
              to={`/${_base}/Ticket/View/` + data.id}
              className="btn btn-sm btn-info text-white"
              style={{ width: '90px' }}
            >
              <i className="icofont-external-link "></i> View
            </Link>
            {localStorage.getItem('account_for') === 'SELF' && (
              <Link
                to={`/${_base}/Ticket/Task/` + data.id}
                className="btn btn-sm btn-outline-primary"
                style={{ width: '90px' }}
              >
                <i className="icofont-tasks"></i> Task
              </Link>
            )}
          </div>
        );
      }
    }
    if (type === 'ADDED_BY_ME') {
      if (createdByMe && createdByMe.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              drop="side"
              as="button"
              variant=""
              id={`${'dropdown-basic_' + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu as="ul" className="border-0 shadow p-1 ">
              <li>
                {' '}
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{' '}
              </li>
              {data.created_by !== localStorage.getItem('id') &&
                data.basket_configured > 0 &&
                localStorage.getItem('account_for') === 'SELF' && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Task/` + data.id}
                      className="btn btn-sm btn-outline-primary"
                      style={{ width: '100%', zIndex: 100 }}
                    >
                      <i className="icofont-tasks"></i> Task
                    </Link>
                  </li>
                )}
              <li>
                <Link
                  to={`/${_base}/TicketHistory/` + data.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-history"></i> History
                </Link>
              </li>
              <li>
                <button
                  className=" btn btn-sm  btn-secondary text-white"
                  style={{ width: '100%', zIndex: 100 }}
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

              <Link
                to={`/${_base}/Ticket/View/` + data.id}
                className="btn btn btn-info text-white"
              >
                <i className="icofont-external-link "></i> View
              </Link>

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

    if (type === 'UNPASSED_TICKET') {
      if (unpassedTickets && unpassedTickets.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${'dropdown-basic_' + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              {data.created_by === localStorage.getItem('id') ||
                (data.assign_to_user_id === localStorage.getItem('id') && (
                  <li>
                    <Link
                      to={`/${_base}/Ticket/Edit/` + data.id}
                      className="btn btn-sm btn-warning text-white"
                      style={{ width: '100%', zIndex: 100 }}
                    >
                      <i className="icofont-ui-edit"></i> Edit
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{' '}
              </li>

              <li>
                <button
                  className="btn btn-success text-white"
                  style={{ width: '100%', zIndex: 100 }}
                  onClick={(e) => {
                    handleRemarkModal({
                      showModal: true,
                      modalData: data,
                      modalHeader: 'Enter Remark',
                      status: 'PASS'
                    });
                  }}
                >
                  <i className="icofont-checked"></i> Pass
                </button>
              </li>
              <li>
                <button
                  className="btn btn-danger  text-white"
                  style={{ width: '100%', zIndex: 100 }}
                  onClick={(e) => {
                    handleRemarkModal({
                      showModal: true,
                      modalData: data,
                      modalHeader: 'Enter Remark',
                      status: 'REJECT'
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
                  modalHeader: 'Enter Remark',
                  status: 'PASS'
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
                  modalHeader: 'Enter Remark',
                  status: 'REJECT'
                });
              }}
            >
              <i className="icofont-close-squared-alt"></i> Reject
            </button>
          </div>
        );
      }
    }

    if (type === 'DEPARTMENTWISE_TICKET') {
      if (departmentwiseTicket && departmentwiseTicket.length > 0) {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${'dropdown-basic_' + data.id}`}
              className="btn btn-primary text-white"
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              <li>
                <Link
                  to={`/${_base}/Ticket/Edit/` + data.id}
                  className="btn btn-sm btn-warning text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-ui-edit"></i> Edit
                </Link>
              </li>
              <li>
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-external-link "></i> View
                </Link>{' '}
              </li>
              <li>
                <Link
                  to={`/${_base}/TicketHistory/` + data.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-history"></i> History
                </Link>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  };

  const searchResultColumns = [
    {
      name: 'Action',
      button: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${
        searchResult ? (searchResult.length > 0 ? '4rem' : '20.625rem') : 'auto'
      }`,
      cell: (row) => actionComponent(row, 'SEARCH_RESULT')
    },

    { name: 'Sr', width: '4rem', cell: (row, index) => index + 1 },
    {
      name: 'Ticket Id',
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true
    },
    {
      name: 'Description',
      width: '130px',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <div
            onClick={(e) => {
              handleModal({ showModal: true, modalData: row, modalHeader: '' });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span>
                    {' '}
                    {row.description && row.description.length < 20
                      ? row.description
                      : row.description.substring(0, 20) + '....'}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </div>
        </div>
      )
    },
    {
      name: 'Ticket Date',
      selector: (row) => row.ticket_date,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Expected Solve Date',
      maxWidth: 'auto',
      selector: (row) => row.expected_solve_date,
      sortable: true
    },
    {
      name: 'Priority',
      cell: (row) => (
        <div>
          {row.priority === 'Very High' && (
            <span style={{ width: '60px' }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === 'High' && (
            <span style={{ width: '60px' }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === 'Medium' && (
            <span style={{ width: '60px' }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === 'Low' && (
            <span style={{ width: '60px' }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true
    },
    { name: 'Type', cell: (row) => row.query_type_name, sortable: true },
    { name: 'Passed Status', cell: (row) => row.passed_status, sortable: true },
    { name: 'Status', cell: (row) => row.status_name, sortable: true },
    {
      name: 'Assign To Dept',
      cell: (row) => row.assign_to_department,
      sortable: true
    },
    { name: 'Assinged To', cell: (row) => row.assign_to_user, sortable: true },
    { name: 'Created By', cell: (row) => row.created_by_name, sortable: true },
    {
      name: 'Solved Date',
      maxWidth: 'auto',
      selector: (row) => row.ticket_solved_date,
      sortable: true
    },
    {
      name: 'Solved By',
      maxWidth: 'auto',
      selector: (row) => row.ticket_solved_by,
      sortable: true
    }
  ];
  const yourTaskColumns = [
    {
      name: 'Action',
      button: true,
      // width: '170px',
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${
        yourTask ? (yourTask.length > 0 ? '4rem' : '20.625rem') : 'auto'
      }`,
      cell: (row) => actionComponent(row, 'YOUR_TASK')
    },
    {
      name: 'Sr',
      width: '170px',
      center: true,
      cell: (row, index) => index + 1
    },
    {
      name: 'Ticket Id',
      width: '170px',
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true
    },
    {
      name: 'Description',
      width: '170px',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <div
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: 'Description'
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {' '}
                    {row.description && row.description.length < 20
                      ? row.description
                      : row.description.substring(0, 20) + '....'}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </div>
        </div>
      )
    },
    {
      name: 'Ticket Date',
      selector: (row) => row.ticket_date,
      sortable: true,
      width: '170px'
    },
    {
      name: 'Expected Solve Date',
      selector: (row) => row.expected_solve_date,
      sortable: true,
      width: '170px'
    },
    {
      name: 'Priority',
      width: '170px',
      cell: (row) => (
        <div>
          {row.priority === 'Very High' && (
            <span style={{ width: '60px' }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === 'High' && (
            <span style={{ width: '60px' }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === 'Medium' && (
            <span style={{ width: '60px' }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === 'Low' && (
            <span style={{ width: '60px' }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true
    },
    {
      name: 'Type',
      width: '170px',
      cell: (row) => row.query_type_name,
      sortable: true
    },
    { name: 'Status', cell: (row) => row.status_name, sortable: true },
    {
      name: 'Assign To Dept',
      width: '170px',
      cell: (row) => row.assign_to_department,
      sortable: true
    },
    {
      name: 'Assinged To',
      width: '170px',
      cell: (row) => row.assign_to_user,
      sortable: true
    },
    { name: 'Created By', cell: (row) => row.created_by_name, sortable: true }
  ];

  const assignedToMeColumns = [
    {
      name: 'Action',
      button: true,
      // width: '80px',

      width: `${
        assignedToMe ? (assignedToMe.length > 0 ? '4rem' : '20.625rem') : 'auto'
      }`,
      cell: (row) => actionComponent(row, 'ASSIGNED_TO_ME')
    },
    { name: 'Sr', width: '80px', cell: (row, index) => index + 1 },
    {
      name: 'Ticket Id',
      width: '150px',
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true
    },
    {
      name: 'Description',
      width: '150px',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <div
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: 'Edit Country'
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {' '}
                    {row.description && row.description.length < 20
                      ? row.description
                      : row.description.substring(0, 20) + '....'}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </div>
        </div>
      )
    },
    {
      name: 'Ticket Date',
      selector: (row) => row.ticket_date,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Expected Solve Date',
      width: '150px',
      selector: (row) => row.expected_solve_date,
      sortable: true
    },
    {
      name: 'Priority',
      width: '150px',
      cell: (row) => (
        <div>
          {row.priority === 'Very High' && (
            <span style={{ width: '60px' }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === 'High' && (
            <span style={{ width: '60px' }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === 'Medium' && (
            <span style={{ width: '60px' }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === 'Low' && (
            <span style={{ width: '60px' }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true
    },
    {
      name: 'Type',
      width: '150px',
      cell: (row) => row.query_type_name,
      sortable: true
    },
    {
      name: 'Status',
      width: '150px',

      cell: (row) => row.status_name,
      sortable: true
    },
    {
      name: 'Assign To Dept',
      width: '150px',
      cell: (row) => row.assign_to_department,
      sortable: true
    },
    {
      name: 'Assinged To',
      width: '150px',

      cell: (row) => row.assign_to_user,
      sortable: true
    },
    {
      name: 'Created By',
      width: '150px',

      cell: (row) => row.created_by_name,
      sortable: true
    }
  ];

  const createdByMeColumns = [
    {
      name: 'Action',
      button: true,
      // width: '150px',
      ignoreRowClick: true,
      width: `${
        createdByMe ? (createdByMe.length > 0 ? '4rem' : '20.625rem') : 'auto'
      }`,
      cell: (row) => actionComponent(row, 'ADDED_BY_ME')
    },

    {
      name: 'Sr',
      width: '150px',
      center: true,
      cell: (row, index) => index + 1
    },
    {
      name: 'Ticket Id',
      width: '150px',
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true
    },
    {
      name: 'Description',
      width: '150px',

      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <div
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: 'Edit Country'
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {' '}
                    {row.description && row.description.length < 20
                      ? row.description
                      : row.description.substring(0, 20) + '....'}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </div>
        </div>
      )
    },
    {
      name: 'Ticket Date',
      selector: (row) => row.ticket_date,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Expected Solve Date',
      selector: (row) => row.expected_solve_date,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Priority',
      width: '150px',
      cell: (row) => (
        <div>
          {row.priority === 'Very High' && (
            <span className="badge bg-danger" style={{ width: '60px' }}>
              {row.priority}
            </span>
          )}
          {row.priority === 'High' && (
            <span style={{ width: '60px' }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === 'Medium' && (
            <span className="badge bg-info" style={{ width: '60px' }}>
              {row.priority}
            </span>
          )}
          {row.priority === 'Low' && (
            <span style={{ width: '60px' }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true
    },
    {
      name: 'Type',
      width: '150px',
      cell: (row) => row.query_type_name,
      sortable: true
    },
    {
      name: 'Passed Status',
      width: '150px',

      cell: (row) => row.passed_status,
      sortable: true
    },
    { name: 'Status', cell: (row) => row.status_name, sortable: true },
    {
      name: 'Assign To Dept',
      width: '150px',
      cell: (row) => row.assign_to_department,
      sortable: true
    },
    {
      name: 'Assinged To',
      width: '150px',
      cell: (row) => row.assign_to_user,
      sortable: true
    },
    {
      name: 'Created By',
      width: '150px',
      cell: (row) => row.created_by_name,
      sortable: true
    }
  ];

  const handleCheckboxChangee = (row) => {
    setSelectedRowss((prevSelectedRows) => {
      if (prevSelectedRows.includes(row.id)) {
        return prevSelectedRows.filter((selectedRow) => selectedRow !== row.id);
      } else {
        return [...prevSelectedRows, row.id];
      }
    });
  };

  const unpassedColumns = [
    {
      name: 'Action',
      // width: '150px',
      button: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${
        unpassedTickets
          ? unpassedTickets.length > 0
            ? '4rem'
            : '20.625rem'
          : 'auto'
      }`,
      cell: (row) => actionComponent(row, 'UNPASSED_TICKET')
    },

    {
      name: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleSelectAllNamesChange}
        >
          <input
            type="checkbox"
            checked={selectAllNames}
            onChange={() => setSelectAllNames(!selectAllNames)}
            style={{ marginRight: '5px' }}
          />
          Select All
        </div>
      ),
      selector: 'selectAll',
      width: '150px',
      center: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={selectedRowss.includes(row.id)}
            onChange={() => handleCheckboxChangee(row)}
            style={{ marginRight: '5px' }}
          />
        </div>
      )
    },

    {
      name: 'Sr',
      width: '150px',
      center: true,
      cell: (row, index) => index + 1
    },
    {
      name: 'Ticket Id',
      width: '150px',
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true
    },
    {
      name: 'Description',
      width: '150px',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <div
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: 'Edit Country'
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {' '}
                    {row.description && row.description.length < 20
                      ? row.description
                      : row.description.substring(0, 20) + '....'}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </div>
        </div>
      )
    },
    {
      name: 'Ticket Date',
      width: '150px',
      selector: (row) => row.ticket_date
    },
    {
      name: 'Expected Solve Date',
      width: '150px',
      selector: (row) => row.expected_solve_date,
      sortable: true
    },
    {
      name: 'Priority',
      width: '150px',
      cell: (row) => (
        <div>
          {row.priority === 'Very High' && (
            <span style={{ width: '60px' }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === 'High' && (
            <span style={{ width: '60px' }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === 'Medium' && (
            <span style={{ width: '60px' }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === 'Low' && (
            <span style={{ width: '60px' }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true
    },
    {
      name: 'Type',
      width: '150px',
      cell: (row) => row.query_type_name,
      sortable: true
    },
    {
      name: 'Status',
      width: '150px',

      cell: (row) => row.status_name,
      sortable: true
    },
    {
      name: 'Assign To Dept',
      width: '150px',
      cell: (row) => row.assign_to_department,
      sortable: true
    },
    {
      name: 'Assinged To',
      width: '150px',
      cell: (row) => row.assign_to_user,
      sortable: true
    },
    {
      name: 'Created By',
      width: '150px',

      cell: (row) => row.created_by_name,
      sortable: true
    },
    {
      name: 'Solved Date',
      width: '150px',
      maxWidth: 'auto',
      selector: (row) => row.ticket_solved_date,
      sortable: true
    },
    {
      name: 'Solved By',
      width: '150px',
      maxWidth: 'auto',
      selector: (row) => row.ticket_solved_by,
      sortable: true
    }
  ];

  const departmentwisetTicketColumns = [
    {
      name: 'Action',
      button: true,
      // width: '170px',
      center: true,
      ignoreRowClick: true,
      allowOverflow: false,
      width: `${
        departmentwiseTicket
          ? departmentwiseTicket.length > 0
            ? '4rem'
            : '20.625rem'
          : 'auto'
      }`,
      cell: (row) => actionComponent(row, 'DEPARTMENTWISE_TICKET')
    },
    {
      name: 'Sr',
      width: '170px',
      center: true,
      cell: (row, index) => index + 1
    },
    {
      name: 'Ticket Id',
      width: '170px',
      cell: (row) => (
        <Link to={`/${_base}/Ticket/View/` + row.id}>
          <span className="fw-bold text-secondary">{row.ticket_id}</span>
        </Link>
      ),
      sortable: true
    },
    {
      name: 'Description',
      width: '150px',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <div
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: 'Edit Country'
              });
            }}
          >
            {row.description && (
              <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {' '}
                    {row.description && row.description.length < 20
                      ? row.description
                      : row.description.substring(0, 20) + '....'}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </div>
        </div>
      )
    },
    {
      name: 'Ticket Date',
      selector: (row) => row.ticket_date,
      sortable: true,
      width: '170px'
    },
    {
      name: 'Expected Solve Date',
      selector: (row) => row.expected_solve_date,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Priority',
      width: '170px',
      cell: (row) => (
        <div>
          {row.priority === 'Very High' && (
            <span style={{ width: '60px' }} className="badge bg-danger">
              {row.priority}
            </span>
          )}
          {row.priority === 'High' && (
            <span style={{ width: '60px' }} className="badge bg-warning">
              {row.priority}
            </span>
          )}
          {row.priority === 'Medium' && (
            <span style={{ width: '60px' }} className="badge bg-info">
              {row.priority}
            </span>
          )}
          {row.priority === 'Low' && (
            <span style={{ width: '60px' }} className="badge bg-success">
              {row.priority}
            </span>
          )}
        </div>
      ),
      sortable: true
    },
    {
      name: 'Type',
      width: '150px',

      cell: (row) => row.query_type_name,
      sortable: true
    },
    { name: 'Status', cell: (row) => row.status_name, sortable: true },
    {
      name: 'Assign To Dept',
      width: '150px',
      cell: (row) => row.assign_to_department,
      sortable: true
    },
    {
      name: 'Assinged To',
      width: '150px',

      cell: (row) => row.assign_to_user,
      sortable: true
    },
    { name: 'Created By', cell: (row) => row.created_by_name, sortable: true }
  ];

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';

    await new UserService()
      .getUserForMyTickets(inputRequired)
      .then((res) => {
        if (res.status === 200) {
          const tempData = [];
          const temp = res.data.data.filter((d) => d.is_active === 1);
          if (res.data.status === 1) {
            // const data = res.data.data.filter(
            //   (d) => d.is_active == 1 && d.account_for === 'SELF'
            // );
            setUser(temp);
          }
          for (const key in temp) {
            tempData.push({
              value: temp[key].id,
              label: temp[key].first_name + ' ' + temp[key].last_name
            });
          }
          const select = res.data.data
            .filter((d) => d.is_active === 1 && d.account_for === 'SELF')
            .map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name
            }));

          const select1 = res.data.data
            .filter((d) => d.is_active === 1)
            .map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name
            }));

          const select2 = res.data.data
            .filter((d) => d.is_active === 1 && d.account_for === 'CUSTOMER')
            .map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name
            }));

          setUserData(null);
          const aa = tempData.sort(function (a, b) {
            return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
          });
          setUserData(aa);
          setAssignUserDropdown(select);
          setUserDropdown(select1);
          setCustomerUserDropdown(select2);
        }
      })
      .catch((error) => {
        const { response } = error;
        const { ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'Status',
          'Get_Status',
          'INSERT',
          errorObject.data.message
        );
      });

    await new DepartmentService().getDepartment().then((res) => {
      if (res.status === 200) {
        const tempData = [];
        const temp = res.data.data;
        for (const key in temp) {
          if (temp[key].department) {
            tempData.push({
              value: temp[key].id,
              label: temp[key].department
            });
          }
        }
        setDepartmentData(null);
        setDepartmentData(tempData);
      }
    });

    await new StatusService().getStatus().then((res) => {
      if (res.status === 200) {
        const tempData = [];
        const temp = res.data.data;

        for (const key in temp) {
          if (temp[key].id) {
            tempData.push({
              value: temp[key].id,
              label: temp[key].status,
              ticket_solved_date: temp[key].ticket_solved_date,
              ticket_solved_by: temp[key].ticket_solved_by
            });
          }
        }
        setStatusData(null);
        setStatusData(tempData);
      }
    });

    await new DepartmentMappingService()
      .getDepartmentMappingByEmployeeId(localStorage.getItem('id'))
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);

          if (res.data.status === 1) {
            if (res.status === 200) {
              if (res.data.status === 1) {
                // setUserDepartment(res.data.data);
              }
            }
          }
        }
        if (res.status === 200) {
          setIsLoading(false);

          const tempData = [];
          const temp = res.data.data;
          for (const key in temp) {
            if (temp[key].is_active === 1) {
              tempData.push([temp[key].ticket_show_type]);
            }
          }
          // setTicketShowType(null);
          // setTicketShowType(tempData);
        }
      });

    await new MyTicketService().getUserTicketsTest().then((res) => {
      if (res.status === 200) {
        if (res?.data?.status === 1) {
          setAssignedToMeData(res.data.data);
          setAssignedToMe(
            res?.data?.data?.data?.filter((d) => d.passed_status !== 'REJECT')
          );
          const dataAssignToMe = res.data.data.data;

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
                ? 'YES'
                : 'NO',
              Ref_id: dataAssignToMe[key].cuid,
              from_department_name: dataAssignToMe[key].from_department_name,
              id: dataAssignToMe[key].id,
              Status: dataAssignToMe[key].is_active ? 'Active' : 'Deactive',
              module_name: dataAssignToMe[key].module_name,
              Passed_Status: dataAssignToMe[key].passed_status,
              Passed_Status_Changed_At:
                dataAssignToMe[key].passed_status_changed_at,
              Passed_Status_Changed_By_Name:
                dataAssignToMe[key].passed_status_changed_by_name,
              Passed_Status_Remark: dataAssignToMe[key].passed_status_remark,
              project_name: dataAssignToMe[key].project_name,
              Status_name: dataAssignToMe[key].status_name,
              sub_module_name: dataAssignToMe[key].sub_module_name,
              Template_id: dataAssignToMe[key].template_id,
              Tenant_id: dataAssignToMe[key].tenant_id,
              ticket_solved_date: dataAssignToMe[key].ticket_solved_date,
              ticket_solved_by: dataAssignToMe[key].ticket_solved_by
            });
          }

          setIsLoading(false);
        }
      }
    });
    dispatch(getRoles());
  }, [dispatch]);

  const handlePassTicketForm = async (e) => {
    try {
      e.preventDefault();
      setNotify(null);

      const formData = new FormData(e.target);

      if (remarkModal && Array.isArray(remarkModal.modalData)) {
        selectedRowss.forEach((id, index) => {
          formData.append(`id[${index}]`, id);
        });
      } else {
        formData.append('id[]', remarkModal.modalData.id);
      }

      const response = await new MyTicketService().passTicket(formData);

      if (response.status === 200) {
        const { status, message } = response.data;

        if (status === 1) {
          setRemarkModal({ showModal: false, modalData: '', modalHeader: '' });
          loadData();
          setSelectedRows([]);
          setSelectedRowss([]);
          setUnpassedTickets();
          setSelectAllNames(false);
          const forms = {
            limit: 10,
            typeOf: 'UnPassed',
            page: 1
          };
          setNotify({ type: 'success', message });
          await new MyTicketService().getUserTicketsTest(forms).then((res) => {
            if (res.status === 200) {
              if (res?.data?.status === 1) {
                setUnpassedData(res.data.data);
                setUnpassedTickets(res.data.data.data);
                setIsLoading(false);
              }
            }
          });
        } else {
          setNotify({ type: 'danger', message });
        }
      } else {
        setNotify({ type: 'danger', message: 'Request Error !!!' });
      }
    } catch (error) {
      setNotify({ type: 'danger', message: 'An error occurred.' });
    }
  };

  const handleForm = useCallback(async (e) => {
    try {
      if (e) {
        e.preventDefault();
        const form = document.getElementById('your_form_id');
        const formData = new FormData(form);

        // Check if any form field is filled
        let isAnyFieldFilled = false;
        for (let [, value] of formData.entries()) {
          if (value) {
            isAnyFieldFilled = true;
            break;
          }
        }

        // If no field is filled, show an alert
        if (!isAnyFieldFilled) {
          alert('Please fill at least one field.');
          return; // Exit the function early
        }

        // Proceed with form submission or further processing
        // ...
      }

      if (e) {
        e.preventDefault();

        const form = document.getElementById('your_form_id');
        const formData = new FormData(form);

        await new ReportService()
          .getTicketReport(formData)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status === 1) {
                setSearchResult(null);

                setSearchResult(res.data.data.data);
                setSearchResultData(res.data.data);
                setKey('Search_Result');
                setIsLoading(false);

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
                      ? 'YES'
                      : 'NO',
                    Ref_id: temp[key].cuid,
                    from_department_name: temp[key].from_department_name,
                    id: temp[key].id,
                    Status: temp[key].is_active ? 'Active' : 'Deactive',
                    module_name: temp[key].module_name,
                    Passed_Status: temp[key].passed_status,
                    Passed_Status_Changed_At:
                      temp[key].passed_status_changed_at,
                    Passed_Status_Changed_By_Name:
                      temp[key].passed_status_changed_by_name,
                    Passed_Status_Remark: temp[key].passed_status_remark,
                    project_name: temp[key].project_name,
                    Status_name: temp[key].status_name,
                    sub_module_name: temp[key].sub_module_name,
                    Template_id: temp[key].template_id,
                    Tenant_id: temp[key].tenant_id,
                    ticket_solved_date: temp[key].ticket_solved_date,
                    ticket_solved_by: temp[key].ticket_solved_by
                  });
                }
                setKey('Search_Result');
                setSearchResultExport(searchResultExport);
              } else {
                alert('No Data Found');
              }
            } else {
              new ErrorLogService().sendErrorLog(
                'UserTask',
                'Get_UserTask',
                'INSERT',
                res.message
              );
            }
          })
          .catch((error) => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog(
              'UserTask',
              'Get_UserTask',
              'INSERT',
              errorObject.data.message
            );
            setIsLoading(false);
          });
      }
    } catch (error) {
      // Handle errors that may occur during the getTicketReport call
      // You can add additional error handling logic here, such as displaying an error message to the user.
    }
  }, []);
  const passTicketHandler = () => {};
  const handleChangeStatus = (e) => {
    setStatusValue(e);
  };
  const handleChangeAssignedUser = (e) => {
    setAssignedUser(e);
  };
  const handleChangeEntryUser = (e) => {
    setEntryUser(e);
  };

  const handleClearData = (e) => {
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
      document.getElementById('from_date').value = '';
    }
    if (selectToDateRef.current.value != null) {
      document.getElementById('to_date').value = '';
    }
    if (selectTicketRef.current.value != null) {
      document.getElementById('ticket_id').value = '';
    }
  };

  const handleFromDate = (e) => {
    setStartDate(e.target.value);
    if (e.target.value) {
      setToDateRequired(true);
    } else {
      setToDateRequired(false);
    }
  };

  const handleToDate = (e) => {
    setToDate(e.target.value);
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
    let isAnyFieldFilled = false;
    for (let [value] of formData.entries()) {
      if (value) {
        isAnyFieldFilled = true;
        break;
      }
    }

    // If no field is filled, show an alert
    if (!isAnyFieldFilled) {
      alert('Please fill at least one field.');
      return; // Exit the function early
    }

    var filterExport = [];

    if (toDate < startDate) {
      alert('Please select Date After From date');
    } else {
      onClosePopup();
      await new ReportService()
        .getTicketReport(formData)
        .then((res) => {
          if (res?.status === 200) {
            if (res?.data?.status === 1) {
              setSearchResult(null);
              setSearchResult(res.data.data.data);
              setIsLoading(false);
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
                  ticket_solved_date: temp[key].ticket_solved_date,
                  ticket_solved_by: temp[key].ticket_solved_by
                });
              }
              setKey('Search_Result');
              setSearchResultExport(searchResultExport);
              setIsLoading(false);

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
                    ? 'YES'
                    : 'NO',
                  Ref_id: temp[key].cuid,
                  from_department_name: temp[key].from_department_name,
                  id: temp[key].id,
                  Status: temp[key].is_active ? 'Active' : 'Deactive',
                  module_name: temp[key].module_name,
                  Passed_Status: temp[key].passed_status,
                  Passed_Status_Changed_At: temp[key].passed_status_changed_at,
                  Passed_Status_Changed_By_Name:
                    temp[key].passed_status_changed_by_name,
                  Passed_Status_Remark: temp[key].passed_status_remark,
                  project_name: temp[key].project_name,
                  Status_name: temp[key].status_name,
                  sub_module_name: temp[key].sub_module_name,
                  Template_id: temp[key].template_id,
                  ticket_solved_date: temp[key].ticket_solved_date,
                  ticket_solved_by: temp[key].ticket_solved_by,
                  Tenant_id: temp[key].tenant_id
                });
              }
              setKey('Search_Result');
              setSearchResultExport(filterExport);
            }
          } else {
            new ErrorLogService().sendErrorLog(
              'UserTask',
              'Get_UserTask',
              'INSERT',
              res.message
            );
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            'UserTask',
            'Get_UserTask',
            'INSERT',
            errorObject.data.message
          );
        });
    }
  };

  const handleAssignedDepartment = (e) => {
    const deptAssignedUser = [];
    for (let i = 0; i < e.length; i++) {
      const select = user
        .filter((d) => d.department_id === e[i].value)
        .map((d) => ({ value: d.id, label: d.first_name + ' ' + d.last_name }));

      for (var j = 0; j < select.length; j++) {
        deptAssignedUser.push(select[j]);
      }
    }
    setAssignUserDropdown(null);
    setAssignUserDropdown(deptAssignedUser);
    setAssignedDepartment(e);
  };

  const handleAssignedToMeTab = async (k, e) => {
    setIsLoading(true);
    e.preventDefault();
    var form;
    if (k === 'Assigned_To_Me') {
      form = {
        limit: 10,
        typeOf: 'Assigned_To_Me',
        page: 1,
        filter: ''
      };
      await new MyTicketService().getUserTicketsTest(form).then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          if (res.data.status === 1) {
            setAssignedToMe(
              res?.data?.data?.data?.filter((d) => d.passed_status !== 'REJECT')
            );
          }
        }
      });
    } else if (k === 'created_by_me') {
      const forms = {
        limit: 10,
        typeOf: 'CreatedByMe',
        page: 1
      };
      await new MyTicketService().getUserTicketsTest(forms).then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setCreatedByMeData(res.data.data);

          setCreatedByMe(
            res?.data?.data?.data?.filter((d) => d.passed_status !== 'REJECT')
          );
        }
      });
    } else if (k === 'departmenyourTaskt') {
      const forms = {
        limit: 10,
        typeOf: 'DepartmentWise',
        page: 1
      };
      await new MyTicketService().getUserTicketsTest(forms).then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          if (res?.data?.status === 1) {
            setDepartmentWiseData(res.data.data);

            setDepartmentwiseTicket(
              res?.data?.data?.data?.filter((d) => d.passed_status !== 'REJECT')
            );
          }
        }
      });
    } else if (k === 'your_task') {
      const forms = {
        limit: 10,
        typeOf: 'YouTask',
        page: 1
      };

      await new MyTicketService().getUserTicketsTest(forms).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setYourTaskData(res.data.data);

            setYourTask();
            setIsLoading(false);

            setYourTask(res.data.data.data);
            // res?.data?.data?.data?.filter((d) => d.passed_status !== "REJECT")
          }
        }
      });
    } else if (k === 'unpassed_columns') {
      const forms = {
        limit: 10,
        typeOf: 'UnPassed',
        page: 1
      };

      await new MyTicketService().getUserTicketsTest(forms).then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          if (res?.data?.status === 1) {
            setUnpassedData(res?.data?.data);

            setUnpassedTickets(res?.data?.data?.data);
          }
        }
      });
    } else if (k === 'Search_Result') {
      const forms = {
        limit: 10,
        typeOf: 'SearchResult',
        page: 1,
        ticket_id: ticketId
      };

      await new ReportService().getTicketReport(forms).then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          if (res?.data?.status === 1) {
            setSearchResult(res?.data?.data);

            setSearchResult(res?.data?.data?.data);
          }
        }
      });
    }
  };

  const handleAssignedToMeRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type === 'LIMIT') {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: 'AssignToMe',
        page: 1 // Resetting to the first page when limit changes
      };
    } else if (type === 'MINUS') {
      form = {
        typeOf: 'AssignToMe',
        page: assignedToMeData.current_page - 1
      };
    } else if (type === 'PLUS') {
      form = {
        typeOf: 'AssignToMe',
        page: assignedToMeData.current_page + 1
      };
    }

    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setAssignedToMe(
            res?.data?.data?.data.filter((d) => d.passed_status !== 'REJECT')
          );
          setIsLoading(false);
          if (type === 'PLUS' && res.data.data.data.length > 0) {
            setAssignedToMeData({
              ...assignedToMeData,
              current_page: assignedToMeData.current_page + 1
            });
          }
        }
      }
    });
  };

  const handleSearchChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type === 'LIMIT') {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: 'SearchResult',
        page: 1,
        ticket_id: ticketId

        // Resetting to the first page when limit changes
      };
    } else if (type === 'MINUS') {
      form = {
        typeOf: 'SearchResult',
        page: searchResultData?.current_page - 1,
        ticket_id: ticketId
      };
    } else if (type === 'PLUS') {
      form = {
        typeOf: 'SearchResult',
        page: searchResultData?.current_page + 1,
        ticket_id: ticketId
      };
    }

    await new ReportService().getTicketReport(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setSearchResult(
            res?.data?.data?.data.filter((d) => d.passed_status !== 'REJECT')
          );
          setIsLoading(false);
          if (type === 'PLUS' && res.data.data.data.length > 0) {
            setSearchResultData({
              ...searchResultData,
              current_page: searchResultData.current_page + 1
            });
          }
        }
      }
    });
  };

  const handleCreatedByMeRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type === 'LIMIT') {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: 'CreatedByMe',
        page: createdByMeData.current_page
      };
    } else if (type === 'MINUS') {
      form = {
        typeOf: 'CreatedByMe',
        page: createdByMeData.current_page - 1
      };
    } else if (type === 'PLUS') {
      form = {
        typeOf: 'CreatedByMe',
        page: createdByMeData.current_page + 1
      };
    }

    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setCreatedByMe(
            res?.data?.data?.data.filter((d) => d.passed_status !== 'REJECT')
          );

          setIsLoading(false);

          if (type === 'PLUS' && res.data.data.data.length > 0) {
            setCreatedByMeData({
              ...createdByMeData,
              current_page: createdByMeData.current_page + 1
            });
          }
        }
      }
    });
  };

  const handleDepartmentWiseRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type === 'LIMIT') {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: 'DepartmentWise',
        page: departmentWiseData.current_page
      };
    } else if (type === 'MINUS') {
      form = {
        typeOf: 'DepartmentWise',
        page: departmentWiseData.current_page - 1
      };
    } else if (type === 'PLUS') {
      form = {
        typeOf: 'DepartmentWise',
        page: departmentWiseData.current_page + 1
      };
    }

    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setDepartmentwiseTicket(
            res.data.data.data.filter((d) => d.passed_status !== 'REJECT')
          );
          setIsLoading(false);

          if (type === 'PLUS' && res.data.data.data.length > 0) {
            setDepartmentWiseData({
              ...departmentWiseData,
              current_page: departmentWiseData.current_page + 1
            });
          }
          setIsLoading(false);
        }
      }
    });
  };

  const handleYourTaskRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type === 'LIMIT') {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: 'YouTask',
        page: yourTaskData.current_page
      };
    } else if (type === 'MINUS') {
      form = {
        typeOf: 'YouTask',
        page: yourTaskData.current_page - 1
      };
    } else if (type === 'PLUS') {
      form = {
        typeOf: 'YouTask',
        page: yourTaskData.current_page + 1
      };
    }

    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setYourTask(
            res.data.data.data.filter((d) => d.passed_status !== 'REJECT')
          );
          setIsLoading(false);
          if (type === 'PLUS' && res.data.data.data.length > 0) {
            setYourTaskData({
              ...yourTaskData,
              current_page: yourTaskData.current_page + 1
            });
          }
        }
      }
    });
  };

  const handleUnpassedRowChanged = async (e, type) => {
    e.preventDefault();
    var form;
    if (type === 'LIMIT') {
      const limit = parseInt(e.target.value);
      form = {
        limit: limit,
        typeOf: 'UnPassed',
        page: unpassedData.current_page
      };
    } else if (type === 'MINUS') {
      form = {
        typeOf: 'UnPassed',
        page: unpassedData.current_page - 1
      };
    } else if (type === 'PLUS') {
      form = {
        typeOf: 'UnPassed',
        page: unpassedData.current_page + 1
      };
    } else {
      return;
    }

    await new MyTicketService().getUserTicketsTest(form).then((res) => {
      if (res.status === 200) {
        if (res?.data?.status === 1) {
          setUnpassedTickets(res.data.data.data);
          setIsLoading(false);
          setUnpassedData({
            ...unpassedData,
            current_page: res.data.data.current_page
          });
        }
      }
    });
  };

  const customStyles = {
    table: {
      style: {
        height: '100vh'
      }
    }
  };

  useEffect(() => {
    setLocationState(location.state);
    const timeoutId = setTimeout(() => {
      const a = null;
      setLocationState(a);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [location.state]);

  useEffect(() => {
    const listener = (e) => {
      if (e && e.code === 'Enter') {
        e.preventDefault();
        // handleForm(e);
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handleForm]);

  useEffect(() => {
    setNotify(null);
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  const [ticketId, setTicketId] = useState();

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="My Tickets" />

      {locationState && <Alert alertData={locationState} />}
      {notify && <Alert alertData={notify} />}
      <div className="card mt-2 " style={{ zIndex: 10 }}>
        <div className="card-body">
          <form onSubmit={handleForm} id="your_form_id">
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
                  onChange={(e) => {
                    setTicketId(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    Validation.CharactersNumbersOnlyWithComma(e);
                  }}
                />
              </div>

              <div className="col-md-3">
                <label className="">
                  <b>Select User :</b>
                </label>
                {userData && (
                  <Select
                    options={userData}
                    isMulti={true}
                    id="assign_to_user_id[]"
                    name="assign_to_user_id[]"
                  />
                )}
              </div>
              {localStorage.getItem('account_for') === 'SELF' && (
                <>
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
                </>
              )}

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
                  style={{ marginTop: '20px', fontWeight: '600' }}
                >
                  <i className="icofont-search-1 "></i> Search
                </button>
                <button
                  className="btn btn-sm btn-info text-white"
                  type="button"
                  onClick={() => window.location.reload(false)}
                  style={{ marginTop: '20px', fontWeight: '600' }}
                >
                  <i className="icofont-refresh text-white"></i> Reset
                </button>
                <button
                  className="btn btn-sm btn-primary text-white"
                  type="button"
                  id="openFilter"
                  styleName={
                    account_for === 'CUSTOMER'
                      ? { display: 'none' }
                      : { display: 'block' }
                  }
                  onClick={handleShow}
                  style={{ marginTop: '20px', fontWeight: '600' }}
                >
                  {' '}
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
                      required={toDateRequired}
                      min={startDate}
                    />
                  </div>
                </div>
                {/* ********************************* */}

                {/* *****************Entry Department,Entry User **************** */}
                {/* {localStorage.getItem("account_for") === "SELF" && ( */}
                <>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label className="">
                        <b>Assigned Department :</b>
                      </label>
                      {departmentData && (
                        <Select
                          options={departmentData}
                          isMulti={true}
                          ref={selectInputRef}
                          id="assign_to_department_id[]"
                          name="assign_to_department_id[]"
                          onChange={handleAssignedDepartment}
                          defaultValue={assignedDepartmentValue}
                        />
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="">
                        <b>Assigned User :</b>
                      </label>
                      <Select
                        options={assignUserDropdown}
                        isMulti={true}
                        id="assign_to_user_id[]"
                        name="assign_to_user_id[]"
                        ref={selectAssignUserRef}
                        onChange={handleChangeAssignedUser}
                        defaultValue={assignedUser}
                      />
                    </div>
                  </div>
                  {/* ********************************* **************** */}

                  {/* *****************Entry Department,Entry User **************** */}
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label className="">
                        <b>Entry Department :</b>
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

                    <div className="col-md-6">
                      <label className="">
                        <b>Entry User :</b>
                      </label>
                      <Select
                        // options={ userDropdown}
                        options={
                          localStorage.getItem('account_for') === 'SELF'
                            ? userDropdown
                            : customerUserDropdown
                        }
                        isMulti={true}
                        ref={selectUserRef}
                        id="user_id[]"
                        name="user_id[]"
                        onChange={handleChangeEntryUser}
                        defaultValue={entryUser}
                      />
                    </div>
                  </div>
                </>
                {/* )} */}
                {/********************************** ****************************/}

                {/* ***************************Status**************** */}
                <div className="col-md-12">
                  <label className="mt-2">
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
                style={{ marginTop: '20px', fontWeight: '600' }}
              >
                <i className="icofont-search-1 "></i> Search
              </button>
              <button
                className="btn btn-sm btn-info text-white"
                type="button"
                onClick={handleClearData}
                style={{ marginTop: '20px', fontWeight: '600' }}
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
                  !searchResult ? 'Assigned_To_Me' : 'Search_Result'
                }
                transition={false}
                id="noanim-tab-example1"
                activeKey={key}
                onSelect={(k, e) => {
                  setKey(k);
                  handleAssignedToMeTab(k, e);
                }}
                className=" tab-body-header rounded d-inline-flex"
              >
                {searchResult && (
                  <Tab
                    eventKey="Search_Result"
                    title="Search Result"
                    activeKey={'Search_Result'}
                  >
                    <div className="card mb-3 mt-3">
                      <div className="card-body">
                        {searchResultExport && (
                          <ExportToExcel
                            className="btn btn-sm btn-danger mt-3"
                            apiData={searchResultExport}
                            typeOf="SearchResult"
                            fileName={`Export Filter Result ${formattedDate} ${formattedTimeString}`}
                          />
                        )}
                        {isLoading ? (
                          <TableLoadingSkelton />
                        ) : searchResult && searchResult?.length > 0 ? (
                          <DataTable
                            columns={searchResultColumns}
                            data={searchResult}
                            customStyles={customStyles}
                            defaultSortField="title"
                            paginations
                            fixedHeader={true}
                            fixedHeaderScrollHeight={'500px'}
                            selectableRows={false}
                            className="table msyDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                            highlightOnHover={true}
                          />
                        ) : (
                          <div className="text-center mt-4">
                            <p>No data found</p>
                          </div>
                        )}
                      </div>
                      <div className="back-to-top pull-right mt-2 mx-2 d-flex justify-content-end">
                        <label className="mx-2">rows per page</label>
                        <select
                          onChange={(e) => {
                            handleSearchChanged(e, 'LIMIT');
                          }}
                          className="mx-2"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="30">30</option>
                          <option value="40">40</option>
                        </select>
                        {searchResultData && (
                          <small>
                            {searchResultData.from}-{searchResultData.to} of{' '}
                            {searchResultData.total}
                          </small>
                        )}
                        <button
                          onClick={(e) => {
                            handleSearchChanged(e, 'MINUS');
                          }}
                          className="mx-2"
                        >
                          <i className="icofont-arrow-left"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            handleSearchChanged(e, 'PLUS');
                          }}
                        >
                          <i className="icofont-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </Tab>
                )}
                {localStorage.getItem('account_for') === 'SELF' && (
                  <Tab eventKey="Assigned_To_Me" title="Assigned To me">
                    <div className="card mb-3 mt-3">
                      <div className="card-body">
                        {assignedToMe && (
                          <ExportAllTicketsToExcel
                            className="btn btn-sm btn-danger mt-3"
                            fileName="Assign To Me"
                            typeOf="AssignToMe"
                          />
                        )}
                        {isLoading && <TableLoadingSkelton />}

                        {!isLoading &&
                        assignedToMe &&
                        assignedToMe?.length > 0 ? (
                          <DataTable
                            customStyles={customStyles}
                            columns={assignedToMeColumns}
                            data={assignedToMe}
                            defaultSortField="title"
                            fixedHeader={true}
                            fixedHeaderScrollHeight={'500px'}
                            selectableRows={false}
                            highlightOnHover={true}
                            responsive={true}
                          />
                        ) : (
                          !isLoading && (
                            <div className="text-center mt-4">
                              <p>No data found</p>
                            </div>
                          )
                        )}

                        <div className="back-to-top pull-right mt-2 mx-2">
                          <label className="mx-2">rows per page</label>
                          <select
                            onChange={(e) => {
                              handleAssignedToMeRowChanged(e, 'LIMIT');
                            }}
                            className="mx-2"
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                          </select>
                          {assignedToMeData && (
                            <small>
                              {assignedToMeData.from}-{assignedToMeData.to} of{' '}
                              {assignedToMeData.total}
                            </small>
                          )}
                          <button
                            onClick={(e) => {
                              handleAssignedToMeRowChanged(e, 'MINUS');
                            }}
                            className="mx-2"
                          >
                            <i className="icofont-arrow-left"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              handleAssignedToMeRowChanged(e, 'PLUS');
                            }}
                          >
                            <i className="icofont-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Tab>
                )}

                <Tab eventKey="created_by_me" title="Created By Me">
                  <div className="card mb-3 mt-3">
                    <div className="card-body">
                      {createdByMe && (
                        <ExportAllTicketsToExcel
                          className="btn btn-sm btn-danger mt-3"
                          fileName="Created By Me"
                          typeOf="CreatedByMe"
                        />
                      )}
                      {isLoading ? (
                        <TableLoadingSkelton />
                      ) : createdByMe && createdByMe?.length > 0 ? (
                        <DataTable
                          customStyles={customStyles}
                          columns={createdByMeColumns}
                          data={createdByMe}
                          defaultSortField="title"
                          fixedHeader={true}
                          fixedHeaderScrollHeight={'500px'}
                          selectableRows={false}
                          highlightOnHover={true}
                          responsive={true}
                        />
                      ) : (
                        <div className="text-center">
                          <p>No data found</p>
                        </div>
                      )}

                      <div className="back-to-top pull-right mt-6 mx-2">
                        <label className="mx-2">rows per page</label>
                        <select
                          onChange={(e) => {
                            handleCreatedByMeRowChanged(e, 'LIMIT');
                          }}
                          className="mx-2"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="30">30</option>
                          <option value="40">40</option>
                        </select>
                        {createdByMeData && (
                          <small>
                            {createdByMeData.from}-{createdByMeData.to} of{' '}
                            {createdByMeData.total}
                          </small>
                        )}
                        <button
                          onClick={(e) => {
                            handleCreatedByMeRowChanged(e, 'MINUS');
                          }}
                          className="mx-2"
                        >
                          <i className="icofont-arrow-left"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            handleCreatedByMeRowChanged(e, 'PLUS');
                          }}
                        >
                          <i className="icofont-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Tab>
                {localStorage.getItem('account_for') === 'SELF' && (
                  <Tab
                    eventKey="departmenyourTaskt"
                    title="Departmentwise Tickets"
                  >
                    <div className="card mb-3 mt-3">
                      <div className="card-body">
                        {departmentwiseTicket && (
                          <ExportAllTicketsToExcel
                            className="btn btn-sm btn-danger mt-3"
                            fileName="Departmentwise Ticket"
                            typeOf="DepartmentWise"
                          />
                        )}
                        {isLoading ? (
                          <TableLoadingSkelton />
                        ) : departmentwiseTicket &&
                          departmentwiseTicket?.length > 0 ? (
                          <DataTable
                            columns={departmentwisetTicketColumns}
                            customStyles={customStyles}
                            data={departmentwiseTicket}
                            defaultSortField="title"
                            fixedHeader={true}
                            fixedHeaderScrollHeight={'500px'}
                            selectableRows={false}
                            highlightOnHover={true}
                          />
                        ) : (
                          <div className="text-center">
                            <p>No data found</p>
                          </div>
                        )}

                        <div className="back-to-top pull-right mt-2 mx-2">
                          <label className="mx-2">rows per page</label>
                          <select
                            onChange={(e) => {
                              handleDepartmentWiseRowChanged(e, 'LIMIT');
                            }}
                            className="mx-2"
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                          </select>
                          {departmentWiseData && (
                            <small>
                              {departmentWiseData.from}-{departmentWiseData.to}{' '}
                              of {departmentWiseData.total}
                            </small>
                          )}
                          <button
                            onClick={(e) => {
                              handleDepartmentWiseRowChanged(e, 'MINUS');
                            }}
                            className="mx-2"
                          >
                            <i className="icofont-arrow-left"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              handleDepartmentWiseRowChanged(e, 'PLUS');
                            }}
                          >
                            <i className="icofont-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Tab>
                )}

                {localStorage.getItem('account_for') === 'SELF' && (
                  <Tab eventKey="your_task" title="Your Task">
                    <div className="card mb-3 mt-3">
                      <div className="card-body">
                        {yourTask && (
                          <ExportAllTicketsToExcel
                            className="btn btn-sm btn-danger mt-3"
                            fileName="Your Task"
                            typeOf="YouTask"
                          />
                        )}
                        {isLoading ? (
                          <TableLoadingSkelton />
                        ) : yourTask && yourTask.length > 0 ? (
                          <DataTable
                            columns={yourTaskColumns}
                            data={yourTask}
                            customStyles={customStyles}
                            defaultSortField="title"
                            fixedHeader={true}
                            fixedHeaderScrollHeight={'500px'}
                            selectableRows={false}
                            highlightOnHover={true}
                          />
                        ) : (
                          <div className="text-center">
                            <p>No data found</p>
                          </div>
                        )}

                        <div className="back-to-top pull-right mt-2 mx-2">
                          <label className="mx-2">rows per page</label>
                          <select
                            onChange={(e) => {
                              handleYourTaskRowChanged(e, 'LIMIT');
                            }}
                            className="mx-2"
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                          </select>
                          {yourTaskData && (
                            <small>
                              {yourTaskData.from}-{yourTaskData.to} of{' '}
                              {yourTaskData.total}
                            </small>
                          )}
                          <button
                            onClick={(e) => {
                              handleYourTaskRowChanged(e, 'MINUS');
                            }}
                            className="mx-2"
                          >
                            <i className="icofont-arrow-left"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              handleYourTaskRowChanged(e, 'PLUS');
                            }}
                          >
                            <i className="icofont-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Tab>
                )}

                <Tab eventKey="unpassed_columns" title="Unpassed Ticket">
                  <div className="card mb-3 mt-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="row">
                          <div className="col-md-6 mb-1">
                            {unpassedTickets && (
                              <ExportAllTicketsToExcel
                                className="btn btn-danger btn-block"
                                fileName="Unpassed Ticket"
                                typeOf="UnPassed"
                              />
                            )}

                            {!isLoading && unpassedTickets && (
                              <>
                                <button
                                  className="btn btn-success btn-block text-white"
                                  onClick={(e) => {
                                    passTicketHandler();
                                    const selectedData = unpassedTickets.filter(
                                      (row) => selectedRowss.includes(row.id)
                                    );
                                    handleRemarkModal({
                                      showModal: true,
                                      modalData: selectedData,
                                      modalHeader: 'Enter Remark',
                                      status: 'PASS'
                                    });
                                  }}
                                  disabled={
                                    !selectAllNames &&
                                    selectedRowss?.length <= 0
                                      ? true
                                      : false
                                  }
                                >
                                  <i className="icofont-checked"></i> Pass
                                </button>
                                <button
                                  className="btn btn-danger btn-block text-white"
                                  onClick={(e) => {
                                    const selectedData = unpassedTickets.filter(
                                      (row) => selectedRowss.includes(row.id)
                                    );
                                    handleRemarkModal({
                                      showModal: true,
                                      modalData: selectedData,
                                      modalHeader: 'Enter Remark',
                                      status: 'REJECT'
                                    });
                                  }}
                                  disabled={
                                    !selectAllNames &&
                                    selectedRowss?.length <= 0
                                      ? true
                                      : false
                                  }
                                >
                                  <i className="icofont-close-squared-alt"></i>{' '}
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {isLoading ? (
                        <TableLoadingSkelton />
                      ) : unpassedTickets && unpassedTickets?.length > 0 ? (
                        <DataTable
                          columns={unpassedColumns}
                          data={unpassedTickets}
                          customStyles={customStyles}
                          defaultSortField="title"
                          fixedHeader={true}
                          fixedHeaderScrollHeight={'500px'}
                          selectableRows={false}
                          highlightOnHover={true}
                        />
                      ) : (
                        <div className="text-center mt-4">
                          <p>No data found</p>
                        </div>
                      )}

                      <div className="back-to-top pull-right mt-2 mx-2">
                        <label className="mx-2">rows per page</label>
                        <select
                          onChange={(e) => {
                            handleUnpassedRowChanged(e, 'LIMIT');
                          }}
                          className="mx-2"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="30">30</option>
                          <option value="40">40</option>
                        </select>
                        {unpassedData && (
                          <small>
                            {unpassedData.from}-{unpassedData.to} of{' '}
                            {unpassedData.total}
                          </small>
                        )}
                        <button
                          onClick={(e) => {
                            handleUnpassedRowChanged(e, 'MINUS');
                          }}
                          className="mx-2"
                        >
                          <i className="icofont-arrow-left"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            handleUnpassedRowChanged(e, 'PLUS');
                          }}
                        >
                          <i className="icofont-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
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
                    style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}
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
                        modalData: '',
                        modalHeader: ''
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
          height: '60%'
        }}
        scrollable={true}
        onHide={(e) => {
          handleModal({
            showModal: false,
            modalData: '',
            modalHeader: ''
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
              handleModal({ showModal: false, modalData: '', modalHeader: '' });
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
            modalData: '',
            modalHeader: '',
            status: remarkModal.status
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {remarkModal.status === 'PASS' ? 'PASS TICKET ' : 'REJECT TICKET'}
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
              {selectedRows &&
                selectedRows.length === 0 &&
                selectedRowss &&
                selectedRowss.length === 0 && (
                  <input
                    type="hidden"
                    className="form-control form-control-sm"
                    id="id[]"
                    name="id[]"
                    defaultValue={remarkModal.modalData.id}
                  />
                )}
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Ticket Id :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    defaultValue={
                      remarkModal && Array.isArray(remarkModal.modalData)
                        ? remarkModal.modalData.map((i) => i.ticket_id)
                        : remarkModal.modalData.ticket_id
                    }
                    readOnly={
                      remarkModal?.modalData?.length <= 0 ? false : true
                    }
                    required
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
                    maxLength={1000}
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersSpeicalOnlyforPassTicket(e);
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
                  modalData: '',
                  modalHeader: ''
                });
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
