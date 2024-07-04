import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';

import Alert from '../../../components/Common/Alert';

import CityService from '../../../services/MastersService/CityService';
import { Link, useLocation } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import BillCheckingService from '../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService';
import BillCheckingTransactionService from '../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService';
import DropdownService from '../../../services/Bill Checking/Bill Checking Transaction/DropdownService';

import UserService from '../../../services/MastersService/UserService';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import { UseDispatch, useDispatch, useSelector } from 'react-redux';

import {
  BillcheckingpostData,
  billTypeDataDropDowm,
  cancelBillCheckData,
  getBillcheckingData,
  getUpdatedAuthoritiesData,
  postBillcheckingData,
  statusDropDownData
} from '../Slices/BillCheckingTransactionAction';

import { getRoles } from '../../Dashboard/DashboardAction';
import { getVendorMasterData } from '../Slices/VendorMasterAction';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';

function BillCheckingTransaction() {
  const location = useLocation();
  const [data, setData] = useState([]);

  const [notify, setNotify] = useState();
  const [exportData, setExportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

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

  const searchRef = useRef();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = () => {
    const filteredList = customSearchHandler(data, searchTerm);
    setFilteredData(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(data);
  };

  //columns

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

  const handleCheckboxChange = () => {
    // Toggle the state of isOriginalBillReceived
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
  };

  const [city, setCity] = useState();

  const [cityDropdown, setCityDropdown] = useState();

  const [assignToDropdown, setAssignToDropdown] = useState();

  const [userDropdown, setUserDropdown] = useState();

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
              ((row.level == parseInt(row.total_level) &&
                row.is_assign_to == 1) ||
                row.is_editable_for_creator == 1 ||
                (row.is_rejected == 1 && row.is_editable_for_creator == 1) ||
                (authorities &&
                  authorities.All_Update_Bill === true &&
                  row.is_assign_to != 1) ||
                (row.level != parseInt(row.total_level) &&
                  row.is_approver == 1)) &&
              row.is_active == 1 && (
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
                ((row.level == parseInt(row.total_level) &&
                  row.is_assign_to == 1) ||
                  row.is_editable_for_creator == 1 ||
                  (row.is_rejected == 1 && row.is_editable_for_creator == 1) ||
                  (authorities &&
                    authorities.All_Update_Bill === true &&
                    row.is_assign_to != 1) ||
                  (row.level != parseInt(row.total_level) &&
                    row.is_approver == 1)) &&
                row.is_active == 1) ||
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

              {((row.is_assign_to == 1 && row.level == row.total_level) ||
                row.is_active == 0) && (
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

              {row.is_assign_to == 1 && row.level == row.total_level && (
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
                row.is_active == 1 && (
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
    // Display a confirmation dialog
    var response = window.confirm('Are you sure you want to Cancel this Bill?');

    if (response) {
      try {
        await new BillCheckingService().cancelBill(id).then((res) => {
          if (res.status === 200) {
            if (res.data.status == 1) {
              setNotify({ type: 'success', message: res.data.message });

              loadData();
            } else {
              setNotify({ type: 'danger', message: res.data.message });
            }
          }
        });
      } catch (error) {
        // Handle any potential errors during cancellation
      }
    }
  };

  const loadData = async (e) => {
    const data = [];
    var temprory = [];
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

    const inputRequired = 'id,employee_id,first_name,last_name,middle_name';

    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status == 200) {
        setIsLoading(false);

        if (res.data.status == 1) {
          setIsLoading(false);

          const temp = res.data.data;

          setUserDropdown(
            temp.map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name
            }))
          );
        }
      }
    });

    dispatch(getUpdatedAuthoritiesData());
    dispatch(billTypeDataDropDowm());

    dispatch(getVendorMasterData());

    await new DropdownService().getMappedEmp().then((res) => {
      if (res.status === 200) {
        setIsLoading(false);

        if (res.data.status == 1) {
          setIsLoading(false);

          setAssignToDropdown(
            res.data.data.map((d) => ({
              value: d.id,
              label: d.employee_name
            }))
          );
        }
      }
    });

    dispatch(statusDropDownData());

    await new CityService().getCity().then((res) => {
      if (res.status === 200) {
        setCity(res.data.data);
        setCityDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.city
          }))
        );
      }
    });

    dispatch(getRoles());
  };

  const handleFilter = async (e) => {
    setNotify(null);
    e.preventDefault();
    const formData = new FormData(e.target);

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
                temp[key].is_original_bill_needed == 1 ? 'Yes' : 'No',

              'Bill date': temp[key].bill_date,
              'Recieved Date': temp[key].received_date,
              'Hold Amount': temp[key].hold_amount,
              'Paid Amount': temp[key].actual_paid,
              'Is cancelled': temp[key].is_active,
              is_active: temp[key].is_active,
              'Is TCS applicable':
                temp[key].is_tcs_applicable == 1 ? 'Yes' : 'No',
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

  const [fromPaymentDate, setFromPaymentDate] = useState('');

  const [datee, setDatee] = useState();

  const [receivedate, setReceive] = useState();

  const [fromBillAmount, setFromBillAmount] = useState('');
  const [toBillAmount, setToBillAmount] = useState('');
  const [toBillAmountErr, setToBillAmountErr] = useState('');

  const [fromHoldlAmount, setFromHoldAmount] = useState('');
  const [toHoldAmount, setToHoldAmount] = useState('');
  const [toHoldAmountErr, setToHoldAmountErr] = useState('');

  const handleToBillAmount = (e) => {
    const value = e.target.value;
    setToBillAmount(value);

    // Check if toBillAmount is less than fromBillAmount
    if (parseFloat(value) < parseFloat(fromBillAmount)) {
      setToBillAmountErr(
        'To bill amount should be greater than from bill amount'
      );
    } else {
      setToBillAmountErr('');
    }
  };

  const handleFromBillAmount = (e) => {
    const value = e.target.value;
    setFromBillAmount(value);

    // Check if fromBillAmount is greater than toBillAmount
    if (parseFloat(value) > parseFloat(toBillAmount)) {
      setToBillAmountErr(
        'To bill amount should be greater than from bill amount'
      );
    } else {
      setToBillAmountErr('');
    }
  };

  const handleToHoldAmount = (e) => {
    const value = e.target.value;
    setToHoldAmount(value);

    // Check if toBillAmount is less than fromBillAmount
    if (parseFloat(value) < parseFloat(fromHoldlAmount)) {
      setToHoldAmountErr(
        'To hold amount should be greater than from hold amount'
      );
    } else {
      setToHoldAmountErr('');
    }
  };

  const handleFromHoldAmount = (e) => {
    const value = e.target.value;
    setFromHoldAmount(value);

    // Check if fromBillAmount is greater than toBillAmount
    if (parseFloat(value) > parseFloat(toHoldAmount)) {
      setToHoldAmountErr(
        'To hold amount should be greater than from hold amount'
      );
    } else {
      setToHoldAmountErr('');
    }
  };
  const [isToReceiveRequired, setIsToReceiveRequired] = useState(false);

  const [toRecive, setToReceive] = useState('');
  const [isToPaymentRequired, setIsPaymentRequired] = useState(false);

  const [toPaymentDate, setToPaymentDate] = useState('');

  const handleFromDate = (e) => {
    setDatee(e.target.value);
    setIsPaymentRequired(!!e.target.value);
    setToPaymentDate('');
  };
  const handleReceiveDate = (e) => {
    setReceive(e.target.value);

    setIsToReceiveRequired(!!e.target.value);
    // Optionally, you can also reset the "To Bill Date" when the "From Bill Date" changes
    setToReceive('');
  };

  const [fromBillDate, setFromBillDate] = useState('');
  const [toBillDate, setToBillDate] = useState('');
  const [isToBillDateRequired, setIsToBillDateRequired] = useState(false);

  const handleBillDate = (e) => {
    const selectedDate = e.target.value;
    setFromBillDate(selectedDate);
    setIsToBillDateRequired(!!selectedDate);
    // Optionally, you can also reset the "To Bill Date" when the "From Bill Date" changes
    setToBillDate('');
  };

  const [showFilterFields, setShowFilterFields] = useState(false);

  useEffect(() => {
    loadData();

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
  }, [searchTerm]);

  function LoaderComponent() {
    return (
      // Container to center-align the spinner and loading text
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        {/* Spinner element with custom styling */}
        <Spinner
          animation="border"
          role="status"
          style={{
            width: '100px',
            height: '100px',
            borderWidth: '5px',
            color: '#484c7f',
            marginBottom: '10px'
          }}
        >
          {/* Visually hidden loading text for accessibility */}
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        {/* Loading text displayed below the spinner */}
        <div style={{ color: '#484c7f', fontSize: '16px', fontWeight: 'bold' }}>
          Loading...
        </div>
      </div>
    );
  }

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
                  if (e.type == 'click') {
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
              {/* <ExportToExcel
                className="btn btn-danger"
                apiData={exportData}
                fileName="Bill Checking Data"
              /> */}
            </div>
          );
        }}
      />

      {/* SEARCH FILTER */}
      {showFilterFields && (
        <div className="container-xxl">
          <form method="post" onSubmit={handleFilter}>
            <div className="card mt-2" style={{ zIndex: 10 }}>
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-sm-1">
                    <label>
                      <b>Bill ID:</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="id"
                      id="id"
                      ref={selectInputRef}
                    />
                  </div>

                  <div className="col-sm-2">
                    <label>
                      <b>Vendor Bill No:</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="vendor_bill_no"
                      id="vendor_bill_no"
                      ref={selectVendorRef}
                    />
                  </div>

                  <div className="col-sm-2">
                    <label>
                      <b>Vendor Name:</b>
                    </label>
                    {vendorDropdown && (
                      <Select
                        id="vendor_name"
                        name="vendor_name[]"
                        isMulti
                        options={vendorDropdown}
                        ref={selectVendorNameRef}
                        placeholder="Vendor Name"
                      />
                    )}
                  </div>
                  <div className="col-sm-2">
                    <label>
                      <b>Bill Status:</b>
                    </label>
                    {statusDropdown && (
                      <Select
                        id="bill_status"
                        name="bill_status[]"
                        isMulti
                        options={statusDropdown}
                        placeholder="bill_status"
                        ref={selectBillStatusRef}
                      />
                    )}
                  </div>
                  <div className="col-sm-2">
                    <label>
                      <b>Bill Type:</b>
                    </label>
                    {billTypeDropdown && (
                      <Select
                        options={billTypeDropdown}
                        id="bill_type"
                        isMulti
                        name="bill_type[]"
                        placeholder="Bill Type"
                        ref={selectBillTypeRef}
                      />
                    )}
                  </div>

                  <div className="col-sm-2 ">
                    <label>
                      <b>Assigned To:</b>
                    </label>
                    {userDropdown && (
                      <Select
                        options={userDropdown}
                        id="assign_to"
                        name="assign_to[]"
                        isMulti
                        placeholder="Assign To"
                        ref={selectAssignToRef}
                      />
                    )}
                  </div>

                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>From Bill Date:</b>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="from_bill_date"
                      id="from_bill_date"
                      onChange={(e) => handleBillDate(e)}
                      max={formattedDate}
                      ref={selectFromBillRef}
                      value={fromBillDate}
                    />
                  </div>

                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>To Bill Date:</b>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="to_bill_date"
                      id="to_bill_date"
                      min={fromBillDate}
                      required={isToBillDateRequired}
                      max={formattedDate}
                      ref={selectToBillRef}
                      value={toBillDate}
                      onChange={(e) => setToBillDate(e.target.value)}
                    />
                  </div>

                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>From Received Date:</b>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="from_received_date"
                      id="from_received_date"
                      ref={selectFromReceivedRef}
                      value={receivedate}
                      onChange={(e) => handleReceiveDate(e)}
                    />
                  </div>
                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>To Received Date:</b>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="to_received_date"
                      id="to_received_date"
                      min={receivedate}
                      ref={selectToReceivedRef}
                      value={toRecive}
                      required={isToReceiveRequired}
                      onChange={(e) => setToReceive(e.target.value)}
                    />
                  </div>

                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>From Payment Date:</b>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="from_payment_date"
                      id="from_payment_date"
                      value={datee}
                      onChange={(e) => handleFromDate(e)}
                      ref={selectFromPaymentRef}
                    />
                  </div>
                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>To Payment Date:</b>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="to_payment_date"
                      id="to_payment_date"
                      min={datee}
                      ref={selectToPaymentRef}
                      required={isToPaymentRequired}
                      value={toPaymentDate}
                      onChange={(e) => setToPaymentDate(e.target.value)}
                    />
                  </div>

                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>From Bill Amount:</b>
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="from_bill_amount"
                      name="from_bill_amount"
                      maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
                      onChange={(e) => handleFromBillAmount(e)}
                      ref={selectFromBillAmountRef}
                      onKeyPress={(e) => {
                        const allowedKeys = [
                          '0',
                          '1',
                          '2',
                          '3',
                          '4',
                          '5',
                          '6',
                          '7',
                          '8',
                          '9',
                          '.',
                          'Backspace'
                        ];
                        const inputValue = e.key;

                        if (!allowedKeys.includes(inputValue)) {
                          e.preventDefault();
                        }

                        const currentInput = e.target.value;
                        const decimalIndex = currentInput.indexOf('.');

                        if (
                          decimalIndex !== -1 &&
                          currentInput.length - decimalIndex > 2
                        ) {
                          e.preventDefault();
                        }

                        if (
                          currentInput.length >= 10 &&
                          inputValue !== '.' &&
                          decimalIndex === -1
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>To Bill Amount:</b>
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="to_bill_amount"
                      name="to_bill_amount"
                      maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
                      onChange={(e) => handleToBillAmount(e)}
                      ref={selectToBillAmountRef}
                      onKeyPress={(e) => {
                        const allowedKeys = [
                          '0',
                          '1',
                          '2',
                          '3',
                          '4',
                          '5',
                          '6',
                          '7',
                          '8',
                          '9',
                          '.',
                          'Backspace'
                        ];
                        const inputValue = e.key;

                        if (!allowedKeys.includes(inputValue)) {
                          e.preventDefault();
                        }

                        const currentInput = e.target.value;
                        const decimalIndex = currentInput.indexOf('.');

                        if (
                          decimalIndex !== -1 &&
                          currentInput.length - decimalIndex > 2
                        ) {
                          e.preventDefault();
                        }

                        if (
                          currentInput.length >= 10 &&
                          inputValue !== '.' &&
                          decimalIndex === -1
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <small
                      style={{
                        color: 'red'
                      }}
                    >
                      {toBillAmountErr}
                    </small>
                  </div>
                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>From Hold Amount:</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="from_hold_amount"
                      id="from_hold_amount"
                      ref={selectFromHoldAmountRef}
                      onKeyPress={(e) => {
                        const allowedKeys = [
                          '0',
                          '1',
                          '2',
                          '3',
                          '4',
                          '5',
                          '6',
                          '7',
                          '8',
                          '9',
                          '.',
                          'Backspace'
                        ];
                        const inputValue = e.key;

                        if (!allowedKeys.includes(inputValue)) {
                          e.preventDefault();
                        }

                        const currentInput = e.target.value;
                        const decimalIndex = currentInput.indexOf('.');

                        if (
                          decimalIndex !== -1 &&
                          currentInput.length - decimalIndex > 2
                        ) {
                          e.preventDefault();
                        }

                        if (
                          currentInput.length >= 10 &&
                          inputValue !== '.' &&
                          decimalIndex === -1
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => handleFromHoldAmount(e)}
                    />
                  </div>
                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>To Hold Amount:</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="to_hold_amount"
                      id="to_hold_amount"
                      ref={selectToHoldAmountRef}
                      onKeyPress={(e) => {
                        const allowedKeys = [
                          '0',
                          '1',
                          '2',
                          '3',
                          '4',
                          '5',
                          '6',
                          '7',
                          '8',
                          '9',
                          '.',
                          'Backspace'
                        ];
                        const inputValue = e.key;

                        if (!allowedKeys.includes(inputValue)) {
                          e.preventDefault();
                        }

                        const currentInput = e.target.value;
                        const decimalIndex = currentInput.indexOf('.');

                        if (
                          decimalIndex !== -1 &&
                          currentInput.length - decimalIndex > 2
                        ) {
                          e.preventDefault();
                        }

                        if (
                          currentInput.length >= 10 &&
                          inputValue !== '.' &&
                          decimalIndex === -1
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => handleToHoldAmount(e)}
                    />
                    <small
                      style={{
                        color: 'red'
                      }}
                    >
                      {toHoldAmountErr}
                    </small>
                  </div>
                  <div className="col-sm-2 mt-4">
                    <label>
                      <b>Is Original bill Received:</b>
                    </label>
                    <input
                      type="checkbox"
                      className="sm-1 mx-2"
                      id="is_original_bill_needed"
                      name="is_original_bill_needed"
                      onChange={handleCheckboxChange}
                      checked={isOriginalBillReceived}
                      ref={selectIsOriginalBillRef}
                    />
                  </div>

                  <div className="col-md-2 mt-4">
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
                  <span className="fw-bold mt-2" style={{ color: 'red' }}>
                    Note:- If you are selecting any from date selection, then to
                    date is Mandatory
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      {/* Search Filter  */}

      {/* <div className="container-xxl mt-2">
        <div className="card card-body">
          <div className="row">
            <div className="col-md-10">
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search By Bill ID...."
                onClick={(e) => handleSearch(e)}
                // onKeyDown={handleKeyDown}
                ref={searchRef}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-sm btn-warning text-white"
                type="button"
                onClick={handleSearch}
                style={{ marginTop: '0px', fontWeight: '600' }}
              >
                <i className="icofont-search-1 "></i> Search
              </button>
              <button
                className="btn btn-sm btn-info text-white"
                type="button"
                // onClick={handleClearSearchData}
                onClick={() => window.location.reload(false)}
                style={{ marginTop: '0px', fontWeight: '600' }}
              >
                <i className="icofont-refresh text-white"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div> */}
      <SearchBoxHeader
        showInput={true}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by Bill Id ...."
        exportFileName="Bill checking  Master Record"
        showExportButton={true}
        exportData={exportData}
      />
      {/* DATA TABLE */}
      <div className="container-xxl">
        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              {isLoading == true ? (
                <LoaderComponent />
              ) : (
                <div className="col-sm-12">
                  {AllBillCheckingData && (
                    <DataTable
                      columns={columns}
                      data={filteredData}
                      pagination
                      selectableRows={false}
                      defaultSortAsc={false}
                      fixedHeader={true}
                      fixedHeaderScrollHeight="900px"
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover={true}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillCheckingTransaction;
