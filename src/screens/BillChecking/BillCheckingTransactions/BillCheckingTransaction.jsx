import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Collapse, Dropdown, Stack } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';

import Alert from '../../../components/Common/Alert';
import { Field, Form, Formik } from 'formik';
import CityService from '../../../services/MastersService/CityService';
import { Link, useLocation } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import BillCheckingService from '../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService';
import BillCheckingTransactionService from '../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService';
import DropdownService from '../../../services/Bill Checking/Bill Checking Transaction/DropdownService';

import UserService from '../../../services/MastersService/UserService';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { useDispatch, useSelector } from 'react-redux';

import {
  billTypeDataDropDowm,
  getUpdatedAuthoritiesData,
  statusDropDownData
} from '../Slices/BillCheckingTransactionAction';

import { getRoles } from '../../Dashboard/DashboardAction';
import { getVendorMasterData } from '../Slices/VendorMasterAction';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import CustomTab from '../../../components/custom/tabs/CustomTab';
import { billCheckingTransactionValidation } from './BillCheckingTransactionValidation';
import {
  CustomInput,
  CustomReactSelect
} from '../../../components/custom/inputs/CustomInputs';
import { getUserForMyTicketsData } from '../../TicketManagement/MyTicketComponentAction';

function BillCheckingTransaction() {
  const location = useLocation();
  const [data, setData] = useState([]);

  const [notify, setNotify] = useState();
  const [exportData, setExportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentTab, setCurrentTab] = useState('filter_by_bill');
  const tabsLabel = [
    {
      label: 'Filter By Bill',
      value: 'filter_by_bill'
    },
    { label: 'Filter By Date', value: 'filter_by_date' },
    { label: 'Filter By Amount', value: 'filter_by_amount' }
  ];

  const dispatch = useDispatch();
  const AllBillCheckingData = useSelector(
    (BillCheckingTransactionSlice) =>
      BillCheckingTransactionSlice.billChecking.sortedBillCheckingData
  );
  const authorities = useSelector(
    (BillCheckingTransactionSlice) =>
      BillCheckingTransactionSlice.billChecking.authoritiesData
  );
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 42)
  );
  const billTypeDropdown = useSelector(
    (BillCheckingTransactionSlice) =>
      BillCheckingTransactionSlice.billChecking.billTypeDataDropDowm
  );
  const vendorDropdown = useSelector(
    (VendorMasterSlice) =>
      VendorMasterSlice.vendorMaster.vendorMasterDropDownNew
  );

  const statusDropdown = useSelector(
    (BillCheckingTransactionSlice) =>
      BillCheckingTransactionSlice.billChecking.statusDropDownData
  );

  const userDropdown = useSelector(
    (MyTicketComponentSlice) =>
      MyTicketComponentSlice.myTicketComponent.getUserForMyTicket
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(data, searchTerm);
    setFilteredData(filteredList);
  }, [data, searchTerm]);

  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(data);
  };

  const selectInputRef = useRef();
  const selectVendorRef = useRef();
  const selectVendorNameRef = useRef();
  const selectBillStatusRef = useRef();
  const selectBillTypeRef = useRef();
  const selectAssignToRef = useRef();
  const selectFromBillRef = useRef();
  const selectToBillRef = useRef();
  const selectFromReceivedRef = useRef();
  const selectToReceivedRef = useRef();
  const selectFromPaymentRef = useRef();
  const selectToPaymentRef = useRef();
  const selectFromBillAmountRef = useRef();

  const selectToBillAmountRef = useRef();
  const selectFromHoldAmountRef = useRef();

  const selectToHoldAmountRef = useRef();
  const selectIsOriginalBillRef = useRef();

  const [isOriginalBillReceived, setIsOriginalBillReceived] = useState(false);

  const [datee, setDatee] = useState();

  const [receivedate, setReceive] = useState();

  const [fromBillAmount, setFromBillAmount] = useState('');
  const [toBillAmount, setToBillAmount] = useState('');
  const [toBillAmountErr, setToBillAmountErr] = useState('');

  const [fromHoldlAmount, setFromHoldAmount] = useState('');
  const [toHoldAmount, setToHoldAmount] = useState('');
  const [toHoldAmountErr, setToHoldAmountErr] = useState('');
  const [isToReceiveRequired, setIsToReceiveRequired] = useState(false);

  const [toRecive, setToReceive] = useState('');
  const [isToPaymentRequired, setIsPaymentRequired] = useState(false);

  const [toPaymentDate, setToPaymentDate] = useState('');

  const [fromBillDate, setFromBillDate] = useState('');
  const [toBillDate, setToBillDate] = useState('');
  const [isToBillDateRequired, setIsToBillDateRequired] = useState(false);

  const handleCheckboxChange = () => {
    setIsOriginalBillReceived(!isOriginalBillReceived);
  };

  const handleClearData = (e) => {
    setFromBillDate('');
    setToBillDate('');
    setToReceive('');
    setReceive('');
    setToPaymentDate('');
    setDatee('');
    setIsToBillDateRequired(false);
    setIsToReceiveRequired(false);
    setIsPaymentRequired(false);
    if (selectInputRef.current.value != null) {
      selectToBillRef.current.value = '';
      document.getElementById('id').value = '';
    }
    if (selectVendorRef.current.value != null) {
      document.getElementById('vendor_bill_no').value = '';
    }
    if (selectVendorNameRef.current.commonProps.hasValue != null) {
      selectVendorNameRef.current.clearValue();
      selectVendorNameRef.current.clearValue();
    }

    if (selectBillStatusRef.current.commonProps.hasValue != null) {
      selectBillStatusRef.current.clearValue();
      selectBillStatusRef.current.clearValue();
    }

    if (selectBillTypeRef.current.commonProps.hasValue != null) {
      selectBillTypeRef.current.clearValue();
      selectBillTypeRef.current.clearValue();
    }

    if (selectAssignToRef.current.commonProps.hasValue != null) {
      selectAssignToRef.current.clearValue();
      selectAssignToRef.current.clearValue();
    }

    if (selectFromBillRef.current.value != null) {
      document.getElementById('from_bill_date').value = '';
    }

    if (selectToBillRef.current.value != null) {
      document.getElementById('to_bill_date').value = '';
    }

    if (selectFromReceivedRef.current.value != null) {
      document.getElementById('from_received_date').value = '';
    }

    if (selectToReceivedRef.current.value != null) {
      document.getElementById('to_received_date').value = '';
    }

    if (selectFromPaymentRef.current.value != null) {
      document.getElementById('from_payment_date').value = '';
    }

    if (selectToPaymentRef.current.value != null) {
      document.getElementById('to_payment_date').value = '';
    }

    if (selectFromBillAmountRef.current.value != null) {
      document.getElementById('from_bill_amount').value = '';
    }

    if (selectToBillAmountRef.current.value != null) {
      document.getElementById('to_bill_amount').value = '';
    }

    if (selectFromHoldAmountRef.current.value != null) {
      document.getElementById('from_hold_amount').value = '';
    }

    if (selectToHoldAmountRef.current.value != null) {
      document.getElementById('to_hold_amount').value = '';
    }

    setIsOriginalBillReceived(false);
    loadData();
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const columns = [
    {
      name: 'Action',
      width: '280px',
      selector: (row) => {},
      sortable: false,
      cell: (row) => {
        return (
          <Dropdown className="d-inline-flex m-1">
            <Dropdown.Toggle
              as="button"
              variant=""
              id={`${'dropdown-basic_' + data?.id}`}
              className="btn btn-primary text-white"
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.875rem',
                marginRight: '5px'
              }}
            >
              <i className="icofont-listine-dots"></i>
            </Dropdown.Toggle>

            {row &&
              ((row.level === parseInt(row.total_level) &&
                row.is_assign_to === 1) ||
                row.is_editable_for_creator === 1 ||
                (row.is_rejected === 1 && row.is_editable_for_creator === 1) ||
                (authorities &&
                  authorities.All_Update_Bill === true &&
                  row.is_assign_to !== 1) ||
                (row.level !== parseInt(row.total_level) &&
                  row.is_approver == 1)) &&
              row.is_active === 1 && (
                // <li>
                <Link
                  to={`/${_base}/EditBillCheckingTransaction/` + row.id}
                  className="btn btn-sm btn-primary text-white"
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <i className="icofont-edit"></i>
                  {/* Edit */}
                </Link>
                // </li>
              )}

            <Dropdown.Menu as="ul" className="border-0 shadow p-1">
              <li>
                <Link
                  to={`/${_base}/ViewBillTransaction/` + row.id}
                  className="btn btn-sm btn-info text-white"
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <i className="icofont-eye"></i> View
                </Link>
              </li>

              {(row &&
                ((row.level === parseInt(row.total_level) &&
                  row.is_assign_to === 1) ||
                  row.is_editable_for_creator === 1 ||
                  (row.is_rejected === 1 &&
                    row.is_editable_for_creator === 1) ||
                  (authorities &&
                    authorities.All_Update_Bill === true &&
                    row.is_assign_to !== 1) ||
                  (row.level !== parseInt(row.total_level) &&
                    row.is_approver === 1)) &&
                row.is_active === 1) ||
                (row['Is cancelled'] === 0 && (
                  <li>
                    <Link
                      to={`/${_base}/BillCheckingHistory/` + row.id}
                      className="btn btn-sm btn-danger text-white"
                      style={{ width: '100%', zIndex: 100 }}
                    >
                      <i className="icofont-history"></i> History
                    </Link>
                  </li>
                ))}

              {((row.is_assign_to === 1 && row.level === row.total_level) ||
                row.is_active === 0) && (
                <li>
                  <Link
                    to={`/${_base}/PaymentHistory/` + row.id}
                    className="btn btn-sm btn-warning text-white"
                    style={{ width: '100%', zIndex: 100 }}
                  >
                    <i className="icofont-tasks"></i> Payment History
                  </Link>
                </li>
              )}

              {row.is_assign_to === 1 && row.level === row.total_level && (
                <>
                  <li>
                    <Link
                      to={`/${_base}/PaymentDetails/` + row.id}
                      className="btn btn-sm btn-primary text-white"
                      style={{ width: '100%', zIndex: 100 }}
                    >
                      <i className="icofont-price"></i> Payment Details
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={`/${_base}/AssignedPerson/` + row.id}
                      className="btn btn-sm btn-secondary text-white"
                      style={{ width: '100%', zIndex: 100 }}
                    >
                      <i className="icofont-user-suited"></i> Assigned Person{' '}
                    </Link>
                  </li>
                </>
              )}
              {authorities &&
                authorities.Is_Cancle_Bill === true &&
                row.is_active === 1 && (
                  <li>
                    <button
                      className="btn btn-sm btn-danger text-white"
                      onClick={(e) => {
                        handleCancelBill(e, row.id);
                      }}
                      style={{ width: '100%', zIndex: 100 }}
                    >
                      <i class="icofont-ui-close"></i> Cancel{' '}
                    </button>
                  </li>
                )}
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    },

    { name: 'Sr', selector: (row) => row.counter, sortable: true },
    {
      name: 'Bill Id',
      id: 'billId',
      selector: (row) => row['Bill ID'],
      sortable: true
    },
    {
      name: 'Vendor Name',
      width: '220px',
      selector: (row) => row['Vendor Name'],
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row['Vendor Name'] && (
            <OverlayTrigger overlay={<Tooltip>{row['Vendor Name']} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row['Vendor Name'] && row['Vendor Name'].length < 120
                    ? row['Vendor Name']
                    : row['Vendor Name'].substring(0, 120) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Payment Date',
      selector: (row) => row['Payment Date'],
      sortable: true
    },
    { name: 'Bill No.', selector: (row) => row['Bill No'], sortable: true },
    {
      name: 'Actual Payment Date.',
      selector: (row) => row['Actual Payment Date'],
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
          style={{ width: '100%' }}
        >
          {row['Actual Payment Date'] && (
            <OverlayTrigger
              overlay={<Tooltip>{row['Actual Payment Date']} </Tooltip>}
            >
              <div>
                <span className="ms-1">
                  {' '}
                  {row['Actual Payment Date'].substring(0, 10) + '...'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Bill Amount',
      selector: (row) => row['Bill Amount'],
      sortable: true
    },
    {
      name: 'Net Payment',
      selector: (row) => row['Net Payment'],
      sortable: true
    },
    {
      name: 'Bill Status',
      selector: (row) => row['Bill Status'],
      sortable: true
    },

    {
      name: 'Bil Type',
      selector: (row) => row['Bill Type'],
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.bill_type_name && (
            <OverlayTrigger overlay={<Tooltip>{row.bill_type_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.bill_type_name && row.bill_type_name.length < 10
                    ? row.bill_type_name
                    : row.bill_type_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Assign From',
      selector: (row) => row['Assign From'],
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
                <span className="ms-1"> {row.created_by}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Assign To',
      selector: (row) => row['Assign To'],
      sortable: true
    },

    {
      name: 'Levels Of Approval',
      selector: (row) => row.total_level,
      sortable: true
    },

    {
      name: 'Approved By',
      selector: (row) => row['Approved By'],
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.approvedBy && (
            <OverlayTrigger overlay={<Tooltip>{row.approvedBy} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.approvedBy && row.approvedBy.length < 10
                    ? row.approvedBy
                    : row.approvedBy.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Pending From',
      selector: (row) => row['Pending From'],
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.level_approver && (
            <OverlayTrigger overlay={<Tooltip>{row.level_approver} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.level_approver && row.level_approver.length < 10
                    ? row.level_approver
                    : row.level_approver.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Rejected By',
      selector: (row) => row['Rejected By'],
      sortable: true
    },

    {
      name: 'Taxable Amount',
      selector: (row) => row['Taxable Amount'],
      sortable: true
    },
    {
      name: 'Debit Advance',
      selector: (row) => row['Debit Advance'],
      sortable: true
    },

    {
      name: 'Is Original Bill',
      selector: (row) => row['Is Original Bill'],
      sortable: true
    },

    {
      name: 'Internal Audit',
      selector: (row) => row['Internal Audit'],
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.audit_remark && (
            <OverlayTrigger overlay={<Tooltip>{row.audit_remark} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.audit_remark && row.audit_remark.length < 10
                    ? row.audit_remark
                    : row.audit_remark.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'External Audit',
      selector: (row) => row['External Audit'],
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.external_audit_remark && (
            <OverlayTrigger
              overlay={<Tooltip>{row.external_audit_remark} </Tooltip>}
            >
              <div>
                <span className="ms-1">
                  {' '}
                  {row.external_audit_remark &&
                  row.external_audit_remark.length < 10
                    ? row.external_audit_remark
                    : row.external_audit_remark.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    { name: 'Bill Date', selector: (row) => row['Bill date'], sortable: true },
    {
      name: 'Recieved Date',
      selector: (row) => row['Recieved Date'],
      sortable: true
    },

    {
      name: 'Hold Amount',
      selector: (row) => (row['Hold Amount'] != null ? row['Hold Amount'] : 0),
      sortable: true
    },
    {
      name: 'Paid Amount',
      selector: (row) => (row['Paid Amount'] != null ? row['Paid Amount'] : 0),
      sortable: true
    },

    {
      name: 'Is Canceled',

      selector: (row) => row['Is Canceled'],

      sortable: true,

      cell: (row) => (
        <div>
          {row.is_active === 0 && <span className="badge bg-primary">YES</span>}

          {row.is_active === 1 && <span className="badge bg-danger">NO</span>}
        </div>
      )
    },

    {
      name: 'Is TCS applicable',
      selector: (row) => row['Is TCS applicable'],
      sortable: false,
      cell: (row) => (
        <div>
          {row['Is TCS applicable'] === 1 && (
            <span className="badge bg-primary">YES</span>
          )}
          {row['Is TCS applicable'] === 0 && (
            <span className="badge bg-danger">NO</span>
          )}
        </div>
      )
    },

    {
      name: 'Created At',
      selector: (row) => row['Created At'],
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
                  {' '}
                  {row.created_at && row.created_at.length < 10
                    ? row.created_at
                    : row.created_at.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Created By',
      selector: (row) => row['Created By'],
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
                <span className="ms-1"> {row.created_by}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Updated At',
      selector: (row) => row['Updated At'],
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
                  {' '}
                  {row.updated_at && row.updated_at.length < 10
                    ? row.updated_at
                    : row.updated_at.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Updated By',
      selector: (row) => row['Updated By'],
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
                <span className="ms-1"> {row.updated_by}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    }
  ];

  const handleCancelBill = async (e, id) => {
    var response = window.confirm('Are you sure you want to Cancel this Bill?');

    if (response) {
      try {
        await new BillCheckingService().cancelBill(id).then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              setNotify({ type: 'success', message: res.data.message });

              loadData();
            } else {
              setNotify({ type: 'danger', message: res.data.message });
            }
          }
        });
      } catch (error) {}
    }
  };

  const loadData = async (e) => {
    const data = [];
    var temprory = [];
    setIsLoading(null);

    setIsLoading(true);

    await new BillCheckingService().getBillCheckData().then((res) => {
      if (res.status === 200) {
        setIsLoading(false);

        let counter = 1;

        const temp = res.data.data;
        var tempData = [];
        for (const key in temp) {
          data.push({
            counter: counter++,
            id: temp[key].id,
            'Bill ID': temp[key].bc_id,
            'Vendor Name': temp[key].vendor_id_name,
            template_name: temp[key].template_name,
            employee_name: temp[key].employee_name,

            'Payment Date': temp[key].payment_date,
            'Bill No': temp[key].vendor_bill_no,
            'Actual Payment Date': temp[key].actual_payment_date,
            'Bill Amount': temp[key].bill_amount,
            'Net Payment': temp[key].net_payment,
            is_active: temp[key].is_active,
            'Is TCS applicable': temp[key].is_tcs_applicable,
            bill_type_name: temp[key].bill_type_name,
            assign_to_name: temp[key].assign_to_name,
            'Taxable Amount': temp[key].taxable_amount,
            'Debit Advance': temp[key].debit_advance,
            'Bill date': temp[key].bill_date,
            'Bill Status': temp[key].payment_status,
            'Is Original Bill':
              temp[key].is_original_bill_needed === 1 ? 'Yes' : 'No',

            'Recieved Date': temp[key].received_date,
            'Hold Amount': temp[key].hold_amount,
            'Paid Amount': temp[key].actual_paid,
            created_at: temp[key].created_at,
            created_by: temp[key].created_by,
            updated_at: temp[key].updated_at,

            updated_by: temp[key].updated_by,
            'Rejected By': temp[key].rejectedBy,

            is_approver: temp[key].is_approver,
            'Assign To': temp[key].assign_to_name,
            is_assign_to: temp[key].is_assign_to,
            level: temp[key].level,
            total_level: temp[key].total_level,
            last_approved_by: temp[key].last_approved_by,
            approvedBy: temp[key].approvedBy,
            'Pending From': temp[key].level_approver,
            audit_remark: temp[key].audit_remark,
            external_audit_remark: temp[key].external_audit_remark,

            levels_of_approval: temp[key].level + 1,

            level_approver: temp[key].level_approver,
            is_editable_for_creator: temp[key].is_editable_for_creator,
            is_rejected: temp[key].is_rejected,
            'Is cancelled': temp[key].is_active
          });
        }
        for (const key in temp) {
          tempData.push({
            SrNo: tempData.length + 1,
            'Bill ID': temp[key].bc_id,
            'Vendor Name': temp[key].vendor_id_name,
            'Payment Date': temp[key].payment_date,
            'Bill No': temp[key].vendor_bill_no,
            'Actual Payment Date': temp[key].actual_payment_date,
            'Bill Amount': temp[key].bill_amount,
            'Net Payment': temp[key].net_payment,
            'Bill Status': temp[key].payment_status,
            bill_type_name: temp[key].bill_type_name,
            'Assign From': temp[key].created_by,
            'Assign To': temp[key].assign_to_name,
            levels_of_approval: temp[key].level + 1,
            'Approve By': temp[key].approvedBy,
            'Pending From': temp[key].level_approver,

            'Rejected By': temp[key].rejectedBy,
            'Taxable Amount': temp[key].taxable_amount,
            'Debit Advance': temp[key].debit_advance,

            'Is Original Bill':
              temp[key].is_original_bill_needed === 1 ? 'Yes' : 'No',
            'Internal Audit': temp[key].audit_remark,
            'External Audit': temp[key].external_audit_remark,

            'Bill date': temp[key].bill_date,
            'Received Date': temp[key].received_date,

            'Hold Amount': temp[key].hold_amount,
            'Paid Amount': temp[key].actual_paid,
            'Is cancelled': temp[key].is_active === 0 ? 'Yes' : 'No',

            'Is TCS applicable':
              temp[key].is_tcs_applicable === 1 ? 'Yes' : 'No',

            'Created at': temp[key].created_at,
            'Created by': temp[key].created_by,
            'Updated At': temp[key].updated_at,
            'Updated By': temp[key].updated_by
          });

          setExportData(tempData);
        }
        setData(null);
        setData(data);
        res.data.data.filter((d) => d.id).map((d) => temprory.push(d.id));
      }
    });

    dispatch(getUpdatedAuthoritiesData());
    dispatch(billTypeDataDropDowm());

    dispatch(getVendorMasterData());

    await new DropdownService().getMappedEmp().then((res) => {
      if (res.status === 200) {
        setIsLoading(false);

        if (res.data.status === 1) {
          setIsLoading(false);
        }
      }
    });

    dispatch(statusDropDownData());

    await new CityService().getCity().then((res) => {
      if (res.status === 200) {
      }
    });

    dispatch(getRoles());
  };

  const handleFilter = async (formData) => {
    setNotify(null);

    await new BillCheckingTransactionService()
      .filterBillCheckingData(formData)
      .then((res) => {
        if (res.data.status === 1) {
          const tempData = [];
          let counter = 1;
          const temp = res.data.data;

          for (const key in temp) {
            tempData.push({
              'Sr No': counter++,
              id: temp[key].id,

              'Bill ID': temp[key].bc_id,
              'Vendor Name': temp[key].vendor_id_name,
              'Payment Date': temp[key].payment_date,
              'Bill No': temp[key].vendor_bill_no,
              'Actual Payment Date': temp[key].payment_date,
              'Bill Amount': temp[key].bill_amount,
              'Net Amount': temp[key].net_payment,

              'Bill Status': temp[key].payment_status,
              'Net Payment': temp[key].net_payment,
              bill_type_name: temp[key].bill_type_name,
              'Assign From': temp[key].created_by,
              'Assign To': temp[key].assign_to_name,
              'Levels of approval': temp[key].level + 1,
              approvedBy: temp[key].approvedBy,
              'Pending From': temp[key].level_approver,

              'Taxable Amount': temp[key].taxable_amount,
              'Debit Advance': temp[key].debit_advance,

              'Is Original Bill':
                temp[key].is_original_bill_needed === 1 ? 'Yes' : 'No',

              'Bill date': temp[key].bill_date,
              'Recieved Date': temp[key].received_date,
              'Hold Amount': temp[key].hold_amount,
              'Paid Amount': temp[key].actual_paid,
              'Is cancelled': temp[key].is_active,
              is_active: temp[key].is_active,
              'Is TCS applicable':
                temp[key].is_tcs_applicable === 1 ? 'Yes' : 'No',
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,

              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by
            });
          }
          setData(null);

          setExportData(null);
          setExportData(tempData);
          setData(tempData);
        } else {
          setNotify({ type: 'danger', message: res.data.message });
        }
      });
  };

  const addEditFunctionInitialValue = {
    id: '',
    vendor_bill_no: '',
    vendor_name: [],
    bill_status: [],
    bill_type: '',
    assign_to: [],
    from_bill_date: '',
    to_bill_date: '',
    from_received_date: '',
    to_received_date: '',
    from_payment_date: '',
    to_payment_date: '',
    from_bill_amount: '',
    to_bill_amount: '',
    from_hold_amount: '',
    to_hold_amount: ''
  };

  const [showFilterFields, setShowFilterFields] = useState(false);

  useEffect(() => {
    loadData();
    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';
    dispatch(getUserForMyTicketsData(inputRequired));
    if (location && location.state) {
      setNotify(location.state.alert);
    }
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch, searchTerm]);

  const onSubmit = (values) => {
    const filteredValues = {
      id: values.id || '',
      vendor_bill_no: values.vendor_bill_no || '',
      vendor_name: values.vendor_name.length > 0 ? values.vendor_name : [''],
      bill_status:
        Array?.isArray(values?.bill_status) && values?.bill_status.length > 0
          ? values?.bill_status
          : [''],
      bill_type: values.bill_type.length > 0 ? values.bill_type : [''],
      assign_to: values.assign_to.length > 0 ? values.assign_to : [''],
      from_bill_date: values.from_bill_date || '',
      to_bill_date: values.to_bill_date || '',
      from_received_date: values.from_received_date || '',
      to_received_date: values.to_received_date || '',
      from_payment_date: values.from_payment_date || '',
      to_payment_date: values.to_payment_date || '',
      from_bill_amount: values.from_bill_amount || '',
      to_bill_amount: values.to_bill_amount || '',
      from_hold_amount: values.from_hold_amount || '',
      to_hold_amount: values.to_hold_amount || '',
      is_original_bill_needed: values.is_original_bill_needed || false
    };

    const formData = new FormData();
    Object?.entries(filteredValues)?.forEach(([key, value]) => {
      if (Array?.isArray(value)) {
        value?.forEach((val) => formData?.append(`${key}[]`, val));
      } else {
        formData?.append(key, value);
      }
    });

    handleFilter(formData);
  };

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader
        headerTitle="Bill Checking Transaction"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <Link
                to={`/${_base + '/CreateBillCheckingTransaction'}`}
                className="btn btn-dark btn-set-task w-sm-100"
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add Data
              </Link>

              <button
                className="btn btn-danger text-white"
                onClick={(e) => {
                  if (e.type === 'click') {
                    if (showFilterFields) {
                      setShowFilterFields(false);
                    } else {
                      setShowFilterFields(true);
                    }
                  }
                }}
              >
                Filter <i className="icofont-filter" />
              </button>
            </div>
          );
        }}
      />

      <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by Bill Id ...."
        exportFileName="Bill checking  Master Record"
        showExportButton={true}
        exportData={exportData}
      />

      <Formik
        initialValues={addEditFunctionInitialValue}
        validationSchema={billCheckingTransactionValidation}
        onSubmit={onSubmit}
      >
        {({ dirty, setFieldValue, handleChange, values }) => (
          <Form>
            {showFilterFields === true && (
              <Collapse in={showFilterFields}>
                <>
                  <CustomTab
                    tabsData={tabsLabel}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                  />
                  <Collapse in={currentTab === 'filter_by_bill'}>
                    <div className="row mb-3 row_gap_3">
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>Bill ID:</label>
                        <Field
                          component={CustomInput}
                          className="form-control"
                          name="id"
                          placeholder="Enter Bill Id"
                          innerRef={selectInputRef}
                        />
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>Vendor Bill No:</label>
                        <Field
                          component={CustomInput}
                          className="form-control"
                          name="vendor_bill_no"
                          placeholder="Enter Vendor Bill No"
                          innerRef={selectVendorRef}
                        />
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>Vendor Name:</label>
                        {vendorDropdown && (
                          <Field
                            name="vendor_name"
                            component={CustomReactSelect}
                            isMulti
                            options={vendorDropdown}
                            placeholder="Vendor Name"
                            innerRef={selectVendorNameRef}
                          />
                        )}
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>Bill Status:</label>
                        {statusDropdown && (
                          <Field
                            name="bill_status"
                            component={CustomReactSelect}
                            isMulti
                            options={statusDropdown}
                            placeholder="Bill Status"
                            innerRef={selectBillStatusRef}
                          />
                        )}
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>Bill Type:</label>
                        {billTypeDropdown && (
                          <Field
                            name="bill_type"
                            component={CustomReactSelect}
                            isMulti
                            options={billTypeDropdown}
                            placeholder="Bill Type"
                            innerRef={selectBillTypeRef}
                          />
                        )}
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2 ">
                        <label>Assigned To:</label>
                        {userDropdown && (
                          <Field
                            id="assign_to"
                            name="assign_to"
                            component={CustomReactSelect}
                            isMulti
                            options={userDropdown}
                            placeholder="Assign To"
                            innerRef={selectAssignToRef}
                          />
                        )}
                      </div>
                    </div>
                  </Collapse>

                  <Collapse in={currentTab === 'filter_by_date'}>
                    <div className="row  row_gap_3">
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>From Bill Date:</label>
                        <Field
                          type="date"
                          component={CustomInput}
                          className="form-control"
                          name="from_bill_date"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>To Bill Date:</label>
                        <Field
                          type="date"
                          component={CustomInput}
                          className="form-control"
                          name="to_bill_date"
                          min={values.from_bill_date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>From Received Date:</label>

                        <Field
                          type="date"
                          component={CustomInput}
                          className="form-control"
                          name="from_received_date"
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue('to_received_date', '');
                          }}
                        />
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>To Received Date:</label>

                        <Field
                          type="date"
                          component={CustomInput}
                          className="form-control"
                          name="to_received_date"
                          min={values.from_received_date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>From Payment Date:</label>
                        <Field
                          type="date"
                          component={CustomInput}
                          className="form-control"
                          name="from_payment_date"
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue('to_payment_date', '');
                          }}
                        />{' '}
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>To Payment Date:</label>

                        <Field
                          type="date"
                          component={CustomInput}
                          className="form-control"
                          name="to_payment_date"
                          min={values.from_payment_date}
                          onChange={handleChange}
                        />
                      </div>
                      <h6 className="mt-1 text-danger">
                        Note:- If you are selecting any from date selection,
                        then to date is Mandatory
                      </h6>
                    </div>
                  </Collapse>

                  <Collapse in={currentTab === 'filter_by_amount'}>
                    <div className="row mb-3 row_gap_3">
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>From Bill Amount:</label>
                        <Field
                          type="text"
                          component={CustomInput}
                          className="form-control form-control-sm"
                          name="from_bill_amount"
                          placeholder="From Bill Amount"
                          maxLength={13}
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue('to_bill_amount', '');
                          }}
                        />
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>To Bill Amount:</label>
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          component={CustomInput}
                          name="to_bill_amount"
                          placeholder="To Bill Amount"
                          maxLength={13}
                          min={values.from_bill_amount}
                          onChange={handleChange}
                        />
                        <small
                          style={{
                            color: 'red'
                          }}
                        >
                          {toBillAmountErr}
                        </small>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>From Hold Amount:</label>
                        <Field
                          type="text"
                          component={CustomInput}
                          className="form-control"
                          name="from_hold_amount"
                          placeholder="From Hold Amount"
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue('to_hold_amount', '');
                          }}
                        />
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <label>To Hold Amount:</label>
                        <Field
                          type="text"
                          component={CustomInput}
                          className="form-control"
                          name="to_hold_amount"
                          placeholder="To Hold Amount"
                          min={values.from_bill_amount}
                          onChange={handleChange}
                        />
                        <small
                          style={{
                            color: 'red'
                          }}
                        >
                          {toHoldAmountErr}
                        </small>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-4">
                        <label className="cp">
                          <Field
                            type="checkbox"
                            className="sm-1 mx-2"
                            name="is_original_bill_needed"
                            onChange={handleCheckboxChange}
                            checked={isOriginalBillReceived}
                            innerRef={selectIsOriginalBillRef}
                          />
                          Is Original bill Received:
                        </label>
                      </div>
                    </div>
                  </Collapse>
                  <div className="d-flex justify-content-end align-items-end">
                    <button
                      className="btn btn-warning text-white"
                      type="submit"
                    >
                      <i className="icofont-search-1 "></i> Search
                    </button>
                    <button
                      className="btn btn-info text-white"
                      type="button"
                      onClick={handleClearData}
                    >
                      <i className="icofont-refresh text-white"></i> Reset
                    </button>
                  </div>
                </>
              </Collapse>
            )}
          </Form>
        )}
      </Formik>

      {AllBillCheckingData && (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          progressComponent={<TableLoadingSkelton />}
          progressPending={isLoading}
          selectableRows={false}
          defaultSortAsc={false}
          fixedHeader={true}
          fixedHeaderScrollHeight="900px"
          className="mt-3"
          highlightOnHover={true}
        />
      )}
    </div>
  );
}

export default BillCheckingTransaction;
