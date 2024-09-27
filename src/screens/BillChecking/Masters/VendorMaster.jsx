import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import ErrorLogService from '../../../services/ErrorLogService';
import CountryService from '../../../services/MastersService/CountryService';
import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';
import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';
import StateService from '../../../services/MastersService/StateService';
import CityService from '../../../services/MastersService/CityService';
import {
  getAttachment,
  deleteAttachment
} from '../../../services/OtherService/AttachmentService';
import {
  _pincodeUrl,
  attachmentUrl,
  userSessionData
} from '../../../settings/constants';
import VendorMasterService from '../../../services/Bill Checking/Masters/VendorMasterService';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { _attachmentUrl } from '../../../settings/constants';
import PaymentTemplateService from '../../../services/Bill Checking/Masters/PaymentTemplateService';
import BillCheckingTransactionService from '../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import { Table } from 'react-bootstrap';
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { toast } from 'react-toastify';

function VendorMaster({ match }) {
  const [data, setData] = useState([]);
  const [panattachment, setPanAttachment] = useState([]);
  const [adharattachment, setAdharattachment] = useState([]);
  const [MSMEselectedFiles, setMSMESelectedFiles] = useState([]);
  const [passBookSelectedFiles, setPassBookSelectedFiles] = useState([]);
  const [chequeAttachmentSelectedFiles, setChequeAttachmentSelectedFiles] =
    useState([]);
  const [vendorId, setVendorId] = useState(null);
  const [attachment, setAttachment] = useState();
  const roleId = sessionStorage.getItem('role_id');
  const [checkRole, setCheckRole] = useState(null);
  const [uppercase, SetUpperCase] = useState();
  const [Panuppercase, SetPanUpeeerCase] = useState();
  const [ifscodeUppercase, setIfsccodeUppercase] = useState();
  const [succes, setSucces] = useState();
  const [error, setError] = useState(null);

  const [notify, setNotify] = useState(null);
  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const [bulkModal, setBulkModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const handleBulkModal = (data) => {
    setBulkModal(data);
  };

  const searchRef = useRef();
  const aadharAttachmentRef = useRef(null);
  function SearchInputData(data, search) {
    const lowercaseSearch = search.toLowerCase();

    return data.filter((d) => {
      for (const key in d) {
        if (
          typeof d[key] === 'string' &&
          d[key].toLowerCase().includes(lowercaseSearch)
        ) {
          return true;
        }
      }
      return false;
    });
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleModal = (data) => {
    if (data) {
      if (data.modalData.consider_in_payment == 'PETTY_CASH') {
        setConsiderInPay(true);
      } else {
        setConsiderInPay(false);
      }
    }

    setModal(data);
  };

  const [country, setCountry] = useState();
  const [authorities, SetAuthorities] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [CountryDropdown, setCountryDropdown] = useState();

  const [stateDropdown, setStateDropdown] = useState();
  const [cityDropdown, setCityDropdown] = useState();

  const [payment, setPayment] = useState();
  const [paymentDropdown, setPaymentDropdown] = useState();
  const [deta, setDeta] = useState();
  const fileInputRef = useRef(null);
  const gstInputRef = useRef(null);
  const msmeInputRef = useRef(null);
  const passbookInputRef = useRef(null);
  const chequeInputRef = useRef(null);
  const panAttachmentRef = useRef(null);
  const columns = [
    {
      name: 'Action',
      className: 'font-weight-bold',
      selector: (row) => {},

      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#depedit"
            onClick={(e) => {
              setVendorId(row?.id);
              setConsider(row?.consider_in_payment);
              setPanAttachment(row?.pan_attachment);
              setAdharattachment(row?.adhar_attachment);
              setMSMESelectedFiles(row?.msme_attachment);
              setPassBookSelectedFiles(row?.bank_passbook_attachment);
              setGstAttachment(row?.gst_attachment);
              setChequeAttachmentSelectedFiles(row?.cheque_attachment);
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: 'Edit Vendor'
              });
              setError(null);
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
          {/* <Link
            to={`/${_base}/ViewVendorDetails/` + row?.id}
            className="btn btn-sm btn-primary text-white"
            style={{ borderRadius: '50%', height: '30px', marginLeft: '5px' }}
          >
            <i className="icofont-eye-alt"></i>
          </Link> */}

          {_base && row && row?.id && (
            <Link
              to={`/${_base}/ViewVendorDetails/${row?.id}`}
              className="btn btn-sm btn-primary text-white"
              style={{ borderRadius: '50%', height: '30px', marginLeft: '5px' }}
            >
              <i className="icofont-eye-alt"></i>
            </Link>
          )}
        </div>
      )
    },
    { name: 'ID', id: 'id', selector: (row) => row.id, sortable: true },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: false,

      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span style={{ width: '60px' }} className="badge bg-primary">
              Active
            </span>
          )}
          {row.is_active === 0 && (
            <span style={{ width: '60px' }} className="badge bg-danger">
              Deactive
            </span>
          )}
        </div>
      )
    },

    {
      name: 'Vendor Name',
      selector: (row) => row.vendor_name,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.vendor_name && (
            <OverlayTrigger overlay={<Tooltip>{row.vendor_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.vendor_name && row.vendor_name.length < 30
                    ? row.vendor_name
                    : row.vendor_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Address',
      selector: (row) => row.address,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.address && (
            <OverlayTrigger overlay={<Tooltip>{row.address} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.address && row.address.length < 30
                    ? row.address
                    : row.address.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    { name: 'Country', selector: (row) => row.country, sortable: true },
    { name: 'State', selector: (row) => row.state, sortable: true },
    { name: 'City', selector: (row) => row.city, sortable: true },
    { name: 'Pincode', selector: (row) => row.pincode, sortable: true },
    { name: 'Mobile', selector: (row) => row.mobile_no, sortable: true },

    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.email && (
            <OverlayTrigger overlay={<Tooltip>{row.email} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.email && row.email.length < 20
                    ? row.email
                    : row.email.substring(0, 15) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Aadhaar',
      selector: (row) => row.adhar_no,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.adhar_no && (
            <OverlayTrigger overlay={<Tooltip>{row.adhar_no} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.adhar_no && row.adhar_no.length < 20
                    ? row.adhar_no
                    : row.adhar_no.substring(0, 15) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: ' PAN ',
      selector: (row) => row.pan_no,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.pan_no && (
            <OverlayTrigger overlay={<Tooltip>{row.pan_no} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.pan_no && row.pan_no.length < 20
                    ? row.pan_no
                    : row.pan_no.substring(0, 15) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    { name: ' MSME NO ', selector: (row) => row.msme_no, sortable: true },

    {
      name: ' GST NO ',
      selector: (row) => row.gst_no,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.gst_no && (
            <OverlayTrigger overlay={<Tooltip>{row.gst_no} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.gst_no && row.gst_no.length < 20
                    ? row.gst_no
                    : row.gst_no.substring(0, 15) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    { name: ' Bank Name ', selector: (row) => row.bank_name, sortable: true },
    {
      name: ' Bank Branch Name ',
      selector: (row) => row.bank_branch_name,
      sortable: true
    },

    {
      name: ' Account No ',
      selector: (row) => row.account_no,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.account_no && (
            <OverlayTrigger overlay={<Tooltip>{row.account_no} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.account_no && row.account_no.length < 20
                    ? row.account_no
                    : row.account_no.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: ' IFSC Code ',
      selector: (row) => row.ifsc_code,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.ifsc_code && (
            <OverlayTrigger overlay={<Tooltip>{row.ifsc_code} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.ifsc_code && row.ifsc_code.length < 20
                    ? row.ifsc_code
                    : row.ifsc_code.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: ' Benificiary Name ',
      selector: (row) => row.beneficiary_name,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.beneficiary_name && (
            <OverlayTrigger
              overlay={<Tooltip>{row.beneficiary_name} </Tooltip>}
            >
              <div>
                <span className="ms-1">
                  {' '}
                  {row.beneficiary_name && row.beneficiary_name.length < 20
                    ? row.beneficiary_name
                    : row.beneficiary_name.substring(0, 15) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: ' Consider In Pay ',
      selector: (row) => row.consider_in_payment,
      sortable: true
    },
    {
      name: 'ERP Account Name ',
      selector: (row) => row.acme_account_name,
      sortable: true
    },
    {
      name: ' Ref Number ',
      selector: (row) => row.reference_number,
      sortable: true
    },
    {
      name: ' Card Number ',
      selector: (row) => row.card_number,
      sortable: true
    },
    { name: ' Narration ', selector: (row) => row.narration, sortable: true },

    {
      name: ' Template Name ',
      selector: (row) => row.template_name,
      sortable: true,
      width: '160px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.template_name && (
            <OverlayTrigger overlay={<Tooltip>{row.template_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.template_name && row.template_name.length < 20
                    ? row.template_name
                    : row.template_name.substring(0, 15) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: ' Created At ',
      width: '200px',
      selector: (row) => row.created_at,
      sortable: true
    },
    {
      name: ' Created By ',
      width: '200px',
      selector: (row) => row.created_by_name,
      sortable: true
    },
    {
      name: ' Updated At ',
      width: '200px',
      selector: (row) => row.updated_at,
      sortable: true
    },
    {
      name: ' Updated By ',
      width: '200px',
      selector: (row) => row.updated_by_name,
      sortable: true
    }
  ];

  const loadData = async () => {
    setIsLoading(null);
    setIsLoading(true);
    setNotify(null);
    setError(null);

    const data = [];
    await new VendorMasterService().getVendors().then((res) => {
      if (res.status === 200) {
        setIsLoading(false);

        let counter = 1;
        const temp = res.data.data;
        for (const key in temp) {
          data.push({
            id: temp[key].id,
            counter: counter++,
            vendor_name: temp[key].vendor_name,
            address: temp[key].address,
            is_active: temp[key].is_active,
            remark: temp[key].remark,

            created_at: temp[key].created_at,
            created_by_name: temp[key].created_by_name,

            updated_at: temp[key].updated_at,
            updated_by_name: temp[key].updated_by_name,

            country: temp[key].country,
            state: temp[key].state,
            city: temp[key].city,

            pincode: temp[key].pincode,
            mobile_no: temp[key].mobile_no,
            email: temp[key].email,

            adhar_no: temp[key].adhar_no,
            pan_no: temp[key].pan_no,

            msme_no: temp[key].msme_no,
            gst_no: temp[key].gst_no,
            acme_account_name: temp[key].acme_account_name,

            consider_in_payment: temp[key].consider_in_payment,
            bank_name: temp[key].bank_name,
            account_no: temp[key].account_no,
            ifsc_code: temp[key].ifsc_code,
            payment_template: temp[key].payment_template,
            template_name: temp[key].template_name,
            pan_attachment: temp[key].pan_attachment,
            gst_attachment: temp[key].gst_attachment,
            adhar_attachment: temp[key].adhar_attachment,
            msme_attachment: temp[key].msme_attachment,
            bank_passbook_attachment: temp[key].bank_passbook_attachment,
            cheque_attachment: temp[key].cheque_attachment,
            bank_branch_name: temp[key].bank_branch_name,
            beneficiary_name: temp[key].beneficiary_name,
            acme_account_name: temp[key].acme_account_name,
            reference_number: temp[key].reference_number,
            card_number: temp[key].card_number,
            narration: temp[key].narration
          });
        }
        setData(null);
        setData(data);
        setDeta(res.data.access);
      }
    });

    await new BillCheckingTransactionService()
      .getUpdatedAuthorities()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            SetAuthorities(res.data.data);
          }
        }
      });

    await new VendorMasterService().getActiveCountry().then((res) => {
      if (res.status === 200) {
        setCountry(res.data.data);
        setCountryDropdown(
          res.data.data
            .filter((d) => d.is_active === 1)
            .map((d) => ({
              value: d.id,
              label: d.country.charAt(0).toUpperCase() + d.country.slice(1)
            }))
        );
      }
    });

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });

    await new VendorMasterService().getActiveState().then((res) => {
      if (res.status === 200) {
        setState(res.data.data);
        setStateDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.state
          }))
        );
      }
    });

    await new VendorMasterService().getActiveCity().then((res) => {
      if (res.status === 200) {
        setCity(res.data.data);
        setCityDropdown(
          res.data.data
            .filter((d) => d.is_active === 1)
            .map((i) => ({
              value: i.id,
              label: i.city
            }))
        );
      }
    });

    await new VendorMasterService().getActivePaymentTemplate().then((res) => {
      if (res.status === 200) {
        setPayment(res.data.data);
        setPaymentDropdown(
          res.data.data
            ?.filter((d) => d.is_active === 1)
            .map((i) => ({ value: i.id, label: i.template_name }))
        );
      }
    });
  };
  const considerInRef = useRef();
  const countryRef = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const [considerInPay, setConsiderInPay] = useState();
  const [considerInPayment, setConsiderInPayment] = useState(false);
  const [consider, setConsider] = useState('YES');

  const handleConsideredInPay = (e) => {
    setConsider(e.target.value);
    setConsiderInPayment(e.target.value);

    if (
      e.target.value === 'NO' ||
      (considerInRef &&
        considerInRef.current &&
        considerInRef.current.commonProps &&
        considerInRef.current.commonProps.hasValue === true)
    ) {
      if (considerInRef.current) {
        considerInRef.current.clearValue();
      }
      setConsiderInPayment(true);
    } else {
      setConsiderInPayment(false);
    }

    if (e.target.value === 'PETTY_CASH') {
      setConsiderInPay(true);
    } else {
      setConsiderInPay(false);
    }
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setError(null);
    setNotify(null);
    var flag = 1;
    var msg = '';

    if (panattachment?.length > 0) {
      for (let i = 0; i < panattachment.length; i++) {
        if (panattachment[i]?.file) {
          form.append(`pan_attachment[${i}]`, panattachment[i].file);
        }
      }
    }
    if (inputState.VendorNameErr) {
      alert('Invalid Vendor Name');
      return;
    }
    if (inputState.contactNoErr) {
      alert('Invalid contact Number');
      return;
    }
    if (inputState.emailError) {
      alert('Invalid Email');
      return;
    }
    if (inputState.AddressErr) {
      alert('Invaild Address');
      return;
    }
    if (inputState.PinCodeErr) {
      alert('Invalid Pincode');
      return;
    }
    if (inputState.AdharNumErr) {
      alert('Invalid Adhaar Number ');
      return;
    }
    if (inputState.PanNumberErr) {
      alert('Invalid Pan Number ');
      return;
    }

    if (inputState.GSTNumberErr) {
      alert('Invalid GST Number ');
      return;
    }

    if (inputState.BankNameErr) {
      alert('Invalid Bank Name ');
      return;
    }
    if (inputState.BranchNameErr) {
      alert('Invalid Bank Branch Name ');
      return;
    }

    if (inputState.AccountNumberErr) {
      alert('Invalid Account Number ');
      return;
    }

    if (inputState.ifscCodeErr) {
      alert('Invalid IFSC Number ');
      return;
    }

    if (inputState.BeneficiaryErr) {
      alert('Invalid Beneficiary Name ');
      return;
    }

    if (inputState.ERPAccErr) {
      alert('Invalid ERP Acc Name ');
      return;
    }
    if (inputState.CardNumberError) {
      alert('Invalid Card Nubmer');
    }
    if (inputState.RefNumberError) {
      alert('Invalid Referance Nubmer');
    }

    if (!id) {
      if (
        considerInRef &&
        considerInRef.current &&
        considerInRef.current.commonProps &&
        considerInRef.current.commonProps.hasValue === false &&
        considerInPayment === false
      ) {
        alert('please select the template');
        e.preventDefault();
        flag = 0;
      }
      if (countryRef && countryRef.current.commonProps.hasValue == false) {
        alert('please select the country');
        e.preventDefault();
        flag = 0;
      }
      if (stateRef && stateRef.current.commonProps.hasValue == false) {
        alert('please select the state');
        e.preventDefault();
        flag = 0;
      }
      if (cityRef && cityRef.current.commonProps.hasValue == false) {
        alert('please select the city');
        e.preventDefault();
        flag = 0;
      }

      if (flag == 1) {
        await new VendorMasterService()
          .createVendor(form)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status === 1) {
                // setNotify({ type: 'success', message: res.data.message });
                toast.success(res.data.message, {
                  position: 'top-right'
                });
                setModal({ showModal: false, modalData: '', modalHeader: '' });
                setPanAttachment([]);
                loadData();
              } else {
                // setError({ type: 'danger', message: res.data.message });
                toast.error(res.data.message, {
                  position: 'top-right'
                });
                setModal({ showModal: true, modalData: '', modalHeader: '' });
              }
            } else {
              // setError({ type: 'danger', message: res.data.message });
              toast.error(res.data.message, {
                position: 'top-right'
              });
              setModal({ showModal: true, modalData: '', modalHeader: '' });

              new ErrorLogService().sendErrorLog(
                'Vendor',
                'Create_Vendor',
                'INSERT',
                res.message
              );
            }
          })
          .catch((error) => {
            const { response } = error;
            const { request, ...errorObject } = response;
            // setError({ type: 'danger', message: 'Request Error !!!' });
            toast.error('Request Error !!!', {
              position: 'top-right'
            });

            new ErrorLogService().sendErrorLog(
              'Vendor',
              'Create_Vendor',
              'INSERT',
              errorObject.data.message
            );
          });
      }
    } else {
      if (
        considerInRef &&
        considerInRef.current &&
        considerInRef.current.commonProps &&
        considerInRef.current.commonProps.hasValue === false &&
        modal.modalData.consider_in_payment !== 'NO'
      ) {
        alert('please select the template');
        e.preventDefault();
        flag = 0;
      }
      if (countryRef && countryRef.current.commonProps.hasValue == false) {
        alert('please select the country');
        e.preventDefault();
        flag = 0;
      }
      if (stateRef && stateRef.current.commonProps.hasValue == false) {
        alert('please select the state');
        e.preventDefault();
        flag = 0;
      }
      if (cityRef && cityRef.current.commonProps.hasValue == false) {
        alert('please select the city');
        e.preventDefault();
        flag = 0;
      }
      if (flag === 1) {
        setNotify(null);
        await new VendorMasterService()
          .updateVendor(id, form)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status === 1) {
                // setNotify({ type: 'success', message: res.data.message });
                toast.success(res.data.message, {
                  position: 'top-right'
                });
                setModal({ showModal: false, modalData: '', modalHeader: '' });
                loadData();
              } else {
                // setError({ type: 'danger', message: res.data.message });
                toast.error(res.data.message, {
                  position: 'top-right'
                });
              }
            } else {
              // setError({ type: 'danger', message: res.data.message });
              toast.error(res.data.message, {
                position: 'top-right'
              });
              new ErrorLogService().sendErrorLog(
                'Vendor',
                'Create_Vendor',
                'INSERT',
                res.message
              );
            }
          })
          .catch((error) => {
            const { response } = error;
            const { request, ...errorObject } = response;
            setError({ type: 'danger', message: 'Request Error !!!' });
            new ErrorLogService().sendErrorLog(
              'Vendor',
              'Create_Vendor',
              'INSERT',
              errorObject.data.message
            );
          });
      }
    }
  };
  const vendorRef = useRef();
  const [erp, setErp] = useState();

  const handleErp = (e) => {
    var erpValue = document.getElementById('vendor_name');
    document.getElementById('acme_account_name').value = erpValue.value;
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  function validateIFSCCode(ifscCode) {
    const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return regex.test(ifscCode);
  }

  function valToUpper(e) {
    e.target.value = e.target.value.toUpperCase();
  }

  const loadAttachment = async (id) => {
    setError(null);
    if (id) {
      await getAttachment(id, 'BILL_CHECK').then((res) => {
        if (res.status === 200) {
          setAttachment(null);
          setAttachment(res.data.data);
        }
      });
    } else {
      setAttachment(null);
    }
  };

  const [gstAttachment, setGstAttachment] = useState([]);
  const uploadGstAttachmentHandler = async (
    e,
    type,
    id = null,
    attachmentId
  ) => {
    if (type === 'UPLOAD') {
      if (
        gstAttachment?.length + (gstInputRef?.current?.files?.length || 0) >
        2
      ) {
        gstInputRef.current.value = '';
        alert('Cannot attach more than 2 attachments');
        return;
      }
      const files = gstInputRef?.current?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let tempSelectedFile = {
            file: files[i],
            fileName: files[i].name,
            tempUrl: URL.createObjectURL(files[i])
          };
          setGstAttachment((prevState) => [...prevState, tempSelectedFile]);
        }
      } else {
      }
    } else if (type === 'DELETE') {
      gstInputRef.current.value = '';
      let filteredFileArray = gstAttachment.filter(
        (item, index) => id !== index
      );
      setGstAttachment(filteredFileArray);
      if (attachmentId) {
        await new VendorMasterService().deleteAttachmentById(attachmentId);
        await new VendorMasterService()
          .getVendorMasterById(vendorId)
          .then((response) => {
            if (response?.data?.data?.status === 1) {
              setGstAttachment(response?.data?.data?.data?.gst_attachment);
            }
          });
      }
    }
  };
  const handleDeleteAttachment = (e, type, id) => {
    deleteAttachment(id).then((res) => {
      if (res.status === 200) {
        loadAttachment();
      }
    });
  };
  const uploadPanAttachmentHandler = async (
    e,
    type,
    id = null,
    attachmentId
  ) => {
    if (type === 'UPLOAD') {
      if (
        panattachment?.length +
          (panAttachmentRef?.current?.files?.length || 0) >
        2
      ) {
        panAttachmentRef.current.value = '';
        alert('Cannot attach more than 2 attachments');

        return;
      }
      const files = panAttachmentRef?.current?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let tempSelectedFile = {
            file: files[i],
            fileName: files[i].name,
            tempUrl: URL.createObjectURL(files[i])
          };
          setPanAttachment((prevState) => [...prevState, tempSelectedFile]);
        }
      } else {
      }
    } else if (type === 'DELETE') {
      panAttachmentRef.current.value = '';
      let filteredFileArray = panattachment.filter(
        (item, index) => id !== index
      );
      setPanAttachment(filteredFileArray);
      if (attachmentId) {
        await new VendorMasterService().deleteAttachmentById(attachmentId);
        await new VendorMasterService()
          .getVendorMasterById(vendorId)
          .then((response) => {
            if (response?.data?.data?.status === 1) {
              setPanAttachment(response?.data?.data?.data?.pan_attachment);
            }
          });
      }
    }
  };
  const uploadAdharAttachmentHandler = async (
    e,
    type,
    id = null,
    attachmentId
  ) => {
    if (type === 'UPLOAD') {
      if (
        adharattachment?.length +
          (aadharAttachmentRef?.current?.files?.length || 0) >
        2
      ) {
        aadharAttachmentRef.current.value = '';
        alert('Cannot attach more than 2 attachments');
        return;
      }
      const files = aadharAttachmentRef?.current?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let tempSelectedFile = {
            file: files[i],
            fileName: files[i].name,
            tempUrl: URL.createObjectURL(files[i])
          };
          setAdharattachment((prevState) => [...prevState, tempSelectedFile]);
        }
      } else {
      }
    } else if (type === 'DELETE') {
      aadharAttachmentRef.current.value = '';
      let filteredFileArray = adharattachment.filter(
        (item, index) => id !== index
      );
      setAdharattachment(filteredFileArray);
      if (attachmentId) {
        await new VendorMasterService().deleteAttachmentById(attachmentId);
        await new VendorMasterService()
          .getVendorMasterById(vendorId)
          .then((response) => {
            if (response?.data?.data?.status === 1) {
              setAdharattachment(response?.data?.data?.data?.adhar_attachment);
            }
          });
      }
    }
  };

  const uploadMSMEAttachmentHandler = async (
    e,
    type,
    id = null,
    attachmentId
  ) => {
    if (type === 'UPLOAD') {
      if (
        MSMEselectedFiles?.length +
          (msmeInputRef?.current?.files?.length || 0) >
        2
      ) {
        msmeInputRef.current.value = '';
        alert('Cannot attach more than 2 attachments');

        return;
      }
      const files = msmeInputRef?.current?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let tempSelectedFile = {
            file: files[i],
            fileName: files[i].name,
            tempUrl: URL.createObjectURL(files[i])
          };
          setMSMESelectedFiles((prevState) => [...prevState, tempSelectedFile]);
        }
      } else {
      }
    } else if (type === 'DELETE') {
      msmeInputRef.current.value = '';
      let filteredFileArray = MSMEselectedFiles.filter(
        (item, index) => id !== index
      );
      setMSMESelectedFiles(filteredFileArray);
      if (attachmentId) {
        await new VendorMasterService().deleteAttachmentById(attachmentId);
        await new VendorMasterService()
          .getVendorMasterById(vendorId)
          .then((response) => {
            if (response?.data?.data?.status === 1) {
              setMSMESelectedFiles(response?.data?.data?.data?.msme_attachment);
            }
          });
      }
    }
  };

  const uploadPassBookAttachmentHandler = async (
    e,
    type,
    id = null,
    attachmentId
  ) => {
    if (type === 'UPLOAD') {
      if (
        passBookSelectedFiles?.length +
          (passbookInputRef?.current?.files?.length || 0) >
        2
      ) {
        passbookInputRef.current.value = '';
        alert('Cannot attach more than 2 attachments');

        return;
      }
      const files = passbookInputRef?.current?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let tempSelectedFile = {
            file: files[i],
            fileName: files[i].name,
            tempUrl: URL.createObjectURL(files[i])
          };
          setPassBookSelectedFiles((prevState) => [
            ...prevState,
            tempSelectedFile
          ]);
        }
      } else {
      }
    } else if (type === 'DELETE') {
      passbookInputRef.current.value = '';
      let filteredFileArray = passBookSelectedFiles.filter(
        (item, index) => id !== index
      );
      setPassBookSelectedFiles(filteredFileArray);
      if (attachmentId) {
        await new VendorMasterService().deleteAttachmentById(attachmentId);
        await new VendorMasterService()
          .getVendorMasterById(vendorId)
          .then((response) => {
            if (response?.data?.data?.status === 1) {
              setPassBookSelectedFiles(
                response?.data?.data?.data?.bank_passbook_attachment
              );
            }
          });
      }
    }
  };

  const uploadPassChequeAttachmentHandler = async (
    e,
    type,
    id = null,
    attachmentId
  ) => {
    if (type === 'UPLOAD') {
      if (
        chequeAttachmentSelectedFiles?.length +
          (chequeInputRef?.current?.files?.length || 0) >
        2
      ) {
        chequeInputRef.current.value = '';
        alert('Cannot attach more than 2 attachments');
        return;
      }
      const files = chequeInputRef?.current?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let tempSelectedFile = {
            file: files[i],
            fileName: files[i].name,
            tempUrl: URL.createObjectURL(files[i])
          };
          setChequeAttachmentSelectedFiles((prevState) => [
            ...prevState,
            tempSelectedFile
          ]);
        }
      } else {
      }
    } else if (type === 'DELETE') {
      chequeInputRef.current.value = '';
      let filteredFileArray = chequeAttachmentSelectedFiles.filter(
        (item, index) => id !== index
      );
      setChequeAttachmentSelectedFiles(filteredFileArray);
      if (attachmentId) {
        await new VendorMasterService().deleteAttachmentById(attachmentId);
        await new VendorMasterService()
          .getVendorMasterById(vendorId)
          .then((response) => {
            if (response?.data?.data?.status === 1) {
              setChequeAttachmentSelectedFiles(
                response?.data?.data?.data?.cheque_attachment
              );
            }
          });
      }
    }
  };
  const [emailError, setEmailError] = useState(null);

  const [mailError, setMailError] = useState(false);
  const [bankNameError, setBankNameError] = useState('');

  const [inputState, setInputState] = useState({
    emailErr: '',
    VendorNameErr: '',
    AddressErr: '',
    PinCodeErr: '',
    AdharNumErr: '',
    PanNumberErr: '',
    GSTNumberErr: '',
    MSMENumberErr: '',
    BankNameErr: '',
    BranchNameErr: '',
    AccountNumberErr: '',
    ifscCodeErr: '',
    BeneficiaryErr: '',
    ERPAccErr: '',
    bankNameError: '',
    branchNameError: '',
    CardNumberError: '',
    RefNumberError: ''
  });

  const handleEmail = (e) => {
    const email = e.target.value;
    const emailRegex =
      // /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
      /^([a-zA-Z\d\.-]+)@([a-zA-Z\d-]+)\.([a-zA-Z]{2,8})(\.[a-zA-Z]{2,8})?$/;

    if (email === '') {
      setEmailError('');
      setMailError(false);
    } else if (emailRegex.test(email) === false) {
      setEmailError('Invalid Email');
      setMailError(true);
    } else {
      setEmailError('');
      setMailError(false);
    }
  };

  const [contactValid, setContactValid] = useState(false);

  const [contactNumber, setContactNumber] = useState(null);

  const url = `${_attachmentUrl}/${modal.modalData.pan_attachment}`;
  const fileName = url.split('/').pop();

  const handleContactValidation = (e) => {
    const contactValidation = e.target.value;

    if (contactValidation.length === 0) {
      setInputState({
        ...state,
        contactNoErr: ''
      });
      return;
    }
    if (
      contactValidation.charAt(0) == '9' ||
      contactValidation.charAt(0) == '8' ||
      contactValidation.charAt(0) == '7' ||
      contactValidation.charAt(0) == '6' ||
      contactValidation.charAt(0) == '4'
    ) {
      setInputState({ ...state, contactNoErr: '' });
      setContactValid(false);
    } else {
      setContactValid(true);
    }

    if (contactValidation.includes('000000000')) {
      setInputState({
        ...state,
        contactNoErr: 'System not accepting 9 Consecutive Zeros here.'
      });
      setContactValid(true);
    }

    if (contactValidation.length < 10) {
      if (contactValidation.length === 0) {
        setInputState({
          ...state,
          contactNoErr: 'please enter Mobile Number'
        });
        setContactValid(true);
      }
      setInputState({
        ...state,
        contactNoErr: 'Invalid Mobile Number'
      });
      setContactValid(true);
    }

    if (contactValidation.length < 11) {
      setContactNumber(contactValidation);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCountryChange = (e) => {
    if (stateRef.current.commonProps.hasValue != null) {
      stateRef.current.clearValue();
    }
    if (cityRef.current.commonProps.hasValue != null) {
      cityRef.current.clearValue();
    }
    if (e) {
      const a = state.filter((d) => d.country_id == e.value);
      setStateDropdown((prev) => null);
      setStateDropdown(a.map((d) => ({ value: d.id, label: d.state })));
    }
  };

  const handleStateChange = (e) => {
    if (cityRef.current.commonProps.hasValue != null) {
      cityRef.current.clearValue();
    }
    if (e) {
      const a = city.filter((d) => d.state_id == e.value);
      const aa = a.filter((i) => i.is_active == 1);

      setCityDropdown((prev) => null);
      setCityDropdown(aa.map((d) => ({ value: d.id, label: d.city })));
    }
  };

  const validFileTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf'
  ];

  const maxLengthCheck = (e, type) => {
    if (type == 'ADHAR') {
      if (e.target.files.length > 2) {
        alert('You Can Upload Only 2 Attachments');
        document.getElementById('adhar_attachment').value = null;
      }
    }

    if (type == 'PAN') {
      if (e.target.files.length > 2) {
        alert('You Can Upload Only 2 Attachments');
        document.getElementById('pan_attachment').value = null;
        setPanAttachment([]);
      }
    }

    if (type == 'MSME') {
      if (e.target.files.length > 2) {
        alert('You Can Upload Only 2 Attachments');
        document.getElementById('msme_attachment').value = null;
        setMSMESelectedFiles([]);
      }
    }
    if (type == 'GST') {
      if (e.target.files.length > 2) {
        alert('You Can Upload Only 2 Attachments');
        document.getElementById('gst_attachment').value = null;
        setGstAttachment([]);
      }
    }
    if (type == 'PASSBOOK') {
      if (e.target.files.length > 2) {
        alert('You Can Upload Only 2 Attachments');
        document.getElementById('bank_passbook_attachment').value = null;
        setPassBookSelectedFiles([]);
      }
    }

    if (type == 'CHEQUE') {
      if (e.target.files.length > 2) {
        alert('You Can Upload Only 2 Attachments');
        document.getElementById('cheque_attachment').value = null;
        setChequeAttachmentSelectedFiles([]);
      }
    }
  };

  // Expandable Component to render attachments
  const ExpandedComponent = ({ data }) => (
    <pre>
      <Table style={{ width: '30%' }}>
        <thead>
          <tr>
            <th>Sr</th>
            <th>Attachment Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td style={{ fontWeight: 'bold' }}>Adhaar Attachment</td>

            {data?.adhar_attachment?.length ? (
              <td>
                {data?.adhar_attachment.map((attachment, index) => (
                  <a
                    key={index}
                    href={`${_attachmentUrl}/${attachment?.path}`}
                    target="_blank"
                    className="btn btn-primary btn-sm p-1 mr-1"
                    style={{ marginBottom: '5px' }}
                  >
                    <i
                      className="icofont-eye"
                      style={{ fontSize: '15px', height: '15px' }}
                    ></i>
                  </a>
                ))}
              </td>
            ) : (
              <p>NA</p>
            )}
          </tr>
          <tr>
            <td>2</td>
            <td style={{ fontWeight: 'bold' }}>PAN Attachment</td>
            {data.pan_attachment && data.pan_attachment.length > 0 ? (
              <td>
                {data.pan_attachment.map((attachment, index) => (
                  <a
                    key={index}
                    href={`${_attachmentUrl}/${attachment?.path}`}
                    target="_blank"
                    className="btn btn-primary btn-sm p-1 mr-1"
                    style={{ marginBottom: '5px' }}
                  >
                    <i
                      className="icofont-eye"
                      style={{ fontSize: '15px', height: '15px' }}
                    ></i>
                  </a>
                ))}
              </td>
            ) : (
              <td>NA</td>
            )}
          </tr>
          <tr>
            <td>3</td>
            <td style={{ fontWeight: 'bold' }}>GST Attachment</td>
            {data.gst_attachment && data.gst_attachment.length > 0 ? (
              <td>
                {data.gst_attachment.map((attachment, index) => (
                  <a
                    key={index}
                    href={`${_attachmentUrl}/${attachment?.path}`}
                    target="_blank"
                    className="btn btn-primary btn-sm p-1 mr-1"
                    style={{ marginBottom: '5px' }}
                  >
                    <i
                      className="icofont-eye"
                      style={{ fontSize: '15px', height: '15px' }}
                    ></i>
                  </a>
                ))}
              </td>
            ) : (
              <td>NA</td>
            )}
          </tr>

          <tr>
            <td>4</td>
            <td style={{ fontWeight: 'bold' }}>MSME Attachment</td>
            {data.msme_attachment && data.msme_attachment.length > 0 ? (
              <td>
                {data.msme_attachment.map((attachment, index) => (
                  <a
                    key={index}
                    href={`${_attachmentUrl}/${attachment?.path}`}
                    target="_blank"
                    className="btn btn-primary btn-sm p-1 mr-1"
                    style={{ marginBottom: '5px' }}
                  >
                    <i
                      className="icofont-eye"
                      style={{ fontSize: '15px', height: '15px' }}
                    ></i>
                  </a>
                ))}
              </td>
            ) : (
              <td>NA</td>
            )}
          </tr>

          <tr>
            <td>5</td>
            <td style={{ fontWeight: 'bold' }}>Pasbook Attachment</td>
            {data?.bank_passbook_attachment?.length ? (
              <td>
                {data?.bank_passbook_attachment.map((attachment, index) => (
                  <a
                    key={index}
                    href={`${_attachmentUrl}/${attachment?.path}`}
                    target="_blank"
                    className="btn btn-primary btn-sm p-1 mr-1"
                    style={{ marginBottom: '5px' }}
                  >
                    <i
                      className="icofont-eye"
                      style={{ fontSize: '15px', height: '15px' }}
                    ></i>
                  </a>
                ))}
              </td>
            ) : (
              <p>NA</p>
            )}
          </tr>
          <tr>
            <td>6</td>
            <td style={{ fontWeight: 'bold' }}>Cheque Attachment</td>

            {data?.cheque_attachment ? (
              <td>
                {data?.cheque_attachment.map((attachment, index) => (
                  <a
                    key={index}
                    href={`${_attachmentUrl}/${attachment?.path}`}
                    target="_blank"
                    className="btn btn-primary btn-sm p-1 mr-1"
                    style={{ marginBottom: '5px' }}
                  >
                    <i
                      className="icofont-eye"
                      style={{ fontSize: '15px', height: '15px' }}
                    ></i>
                  </a>
                ))}
              </td>
            ) : (
              <p>NA</p>
            )}
          </tr>
        </tbody>
      </Table>
    </pre>
  );

  const downloadFormat = async (e) => {
    e.preventDefault();
    await new VendorMasterService().downloadBulkFormat().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          URL = `${_attachmentUrl}` + res.data.data;

          window.open(URL, '_blank').focus();
        }
      }
    });
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    const file = e.target.elements.attachment.files[0]; // Access the file from the event target

    if (!file) {
      alert('Please choose a file.');
      return;
    }

    const form = new FormData();
    form.append('attachment', file);
    form.append('created_by', userSessionData.userId);

    setError(null);
    await new VendorMasterService().bulkUploadVendor(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          handleBulkModal({ showModal: false });
          // setNotify({ type: 'success', message: res.data.message });
          toast.success(res.data.message, {
            position: 'top-right',
            autoClose: 10000
          });
          loadData();
        } else if (res.data.status == 2) {
          toast.error(res.data.message, {
            position: 'top-right',
            autoClose: 10000
          });
        } else {
          toast.error(res.data.message, {
            position: 'top-right',
            autoClose: 10000
          });
          URL = `${_attachmentUrl}` + res.data.data;
          window.open(URL, '_blank')?.focus();
        }
      }
    });
  };

  return (
    <>
      {notify && <Alert alertData={notify} />}

      <div className="container-xxl">
        <PageHeader
          headerTitle="Vendor Master"
          renderRight={() => {
            return (
              <div className="col-auto d-flex w-sm-100">
                <button
                  className="btn btn-dark btn-set-task w-sm-100"
                  onClick={() => {
                    setNotify(null);
                    handleModal({
                      showModal: true,
                      modalData: '',
                      modalHeader: 'Add Vendor'
                    });

                    setPanAttachment([]);
                    setAdharattachment([]);
                    setMSMESelectedFiles([]);
                    setPassBookSelectedFiles([]);
                    setChequeAttachmentSelectedFiles([]);
                    setMSMESelectedFiles([]);
                    setPassBookSelectedFiles([]);
                    setChequeAttachmentSelectedFiles([]);
                    setGstAttachment([]);
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Vendor
                </button>
                <button
                  className="btn btn-warning btn-set-task w-sm-100"
                  onClick={(e) => {
                    downloadFormat(e);
                  }}
                >
                  <i className="icofont-download me-2 fs-6"></i>Download Format
                </button>
                <button
                  className="btn btn-dark btn-set-task w-sm-100"
                  onClick={() => {
                    handleBulkModal({
                      showModal: true,
                      modalData: '',
                      modalHeader: 'Bulk Upload Vendor'
                    });
                  }}
                >
                  <i className="icofont-upload me-2 fs-6"></i>Bulk Upload
                </button>
              </div>
            );
          }}
        />
        {/* SEARCH FILTER */}
        <SearchBoxHeader
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          handleReset={handleReset}
          placeholder="Search by authority name...."
          showExportButton={false}
        />

        {/* DATA TABLE */}
        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {data && (
                  <DataTable
                    columns={columns}
                    data={filteredData && filteredData}
                    defaultSortFieldId="id"
                    expandableRows={true}
                    pagination
                    expandableRowsComponent={ExpandedComponent}
                    progressComponent={<TableLoadingSkelton />}
                    progressPending={isLoading}
                    selectableRows={false}
                    defaultSortAsc={false}
                    className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline "
                    highlightOnHover={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ADD VENDOR */}
        <Modal
          centered
          show={modal.showModal}
          size="xl"
          onHide={(e) => {
            handleModal({
              showModal: false,
              modalData: '',
              modalHeader: ''
            });
          }}
        >
          <form
            method="post"
            onSubmit={handleForm(modal.modalData ? modal.modalData.id : '')}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert alertData={error} />}
              <div className="deadline-form">
                <div className="row g-3 mb-3">
                  <div className="col-sm-4">
                    <label className="form-label font-weight-bold">
                      Vendor Name:
                      <Astrick color="red" size="13px" />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="vendor_name"
                      name="vendor_name"
                      maxLength={50}
                      minLength={3}
                      onKeyUp={(e) => {
                        handleErp(e);
                      }}
                      defaultValue={
                        modal.modalData ? modal.modalData.vendor_name : ''
                      }
                      required={true}
                    />
                  </div>
                  {modal.modalData && modal.modalData && (
                    <div className="col-md-4 mt-2">
                      <label className=" col-form-label">
                        <b>
                          Vendor ID : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control"
                        id="id"
                        name="id"
                        defaultValue={modal.modalData ? modal.modalData.id : ''}
                        required
                        disabled
                      />
                    </div>
                  )}

                  <div className="col-sm-4">
                    <label className="form-label font-weight-bold">
                      Mobile No :<Astrick color="red" size="13px" />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="mobile_no"
                      name="mobile_no"
                      required={true}
                      maxLength="10"
                      onChange={handleContactValidation}
                      defaultValue={
                        modal.modalData ? modal.modalData.mobile_no : ''
                      }
                      onKeyPress={(e) => {
                        Validation.MobileNumbersOnly(e);
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: 'red'
                        }}
                      >
                        {inputState.contactNoErr}
                      </small>
                    )}
                  </div>

                  <div className={modal?.modalData ? 'col-sm-3' : 'col-sm-4'}>
                    <label className="form-label font-weight-bold">
                      Email Id :<Astrick color="red" size="13px" />
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      id="email"
                      name="email"
                      defaultValue={
                        modal.modalData ? modal.modalData.email : ''
                      }
                      onChange={handleEmail}
                      onKeyPress={(e) => {
                        handleEmail(e);
                      }}
                      required={true}
                    />

                    {inputState && (
                      <small
                        style={{
                          color: 'red'
                        }}
                      >
                        {emailError}
                      </small>
                    )}
                  </div>

                  <div className={modal?.modalData ? 'col-sm-3' : 'col-sm-3'}>
                    <label className="form-label font-weight-bold">
                      Address :<Astrick color="red" size="13px" />
                    </label>
                    <textarea
                      type="text"
                      className="form-control form-control"
                      rows="2"
                      id="address"
                      name="address"
                      placeholder="Enter maximum 50 character"
                      maxLength={50}
                      required={true}
                      defaultValue={
                        modal.modalData ? modal.modalData.address : ''
                      }
                      onChange={(event) => {
                        if (event.target.value === '') {
                          setInputState({
                            ...state,
                            AddressErr: 'Address Required'
                          });
                        } else {
                          setInputState({ ...state, AddressErr: '' });
                        }
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: 'red'
                        }}
                      >
                        {inputState.AddressErr}
                      </small>
                    )}
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label font-weight-bold">
                      Country :<Astrick color="red" size="13px" />
                    </label>

                    {CountryDropdown && data ? (
                      <Select
                        id="country"
                        name="country"
                        options={CountryDropdown}
                        ref={countryRef}
                        onChange={handleCountryChange}
                        defaultValue={
                          modal.modalData && modal.modalData.country !== Number
                            ? CountryDropdown.filter(
                                (d) => d.label === modal.modalData.country
                              )
                            : CountryDropdown.filter(
                                (d) =>
                                  d.value === parseInt(modal.modalData.country)
                              )
                        }
                        required={true}
                      />
                    ) : (
                      <p>...Loading</p>
                    )}
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label font-weight-bold">
                      State :<Astrick color="red" size="13px" />
                    </label>
                    {stateDropdown && (
                      <Select
                        id="state"
                        name="state"
                        options={stateDropdown}
                        onChange={handleStateChange}
                        ref={stateRef}
                        defaultValue={
                          modal.modalData && modal.modalData.country !== Number
                            ? stateDropdown.filter(
                                (d) => d.label == modal.modalData.state
                              )
                            : stateDropdown.filter(
                                (d) =>
                                  d.value == parseInt(modal.modalData.state)
                              )
                        }
                        required={true}
                      />
                    )}
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label font-weight-bold">
                      City :<Astrick color="red" size="13px" />
                    </label>
                    {cityDropdown && (
                      <Select
                        id="city"
                        name="city"
                        ref={cityRef}
                        options={cityDropdown}
                        defaultValue={
                          modal.modalData && modal.modalData.country !== Number
                            ? cityDropdown.filter(
                                (d) => d.label == modal.modalData.city
                              )
                            : cityDropdown.filter(
                                (d) => d.value == parseInt(modal.modalData.city)
                              )
                        }
                        required={true}
                      />
                    )}
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label font-weight-bold">
                      Pincode :<Astrick color="red" size="13px" />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="pincode"
                      name="pincode"
                      maxLength={6}
                      defaultValue={
                        modal.modalData ? modal.modalData.pincode : ''
                      }
                      onKeyPress={(e) => {
                        Validation.NumbersOnly(e);
                      }}
                      required={true}
                      onPaste={(e) => {
                        e.preventDefault();
                        return false;
                      }}
                      onCopy={(e) => {
                        e.preventDefault();
                        return false;
                      }}
                      onChange={(event) => {
                        const pincode = event.target.value.trim();

                        const pincodeRegex = /^\d{6}$/; // regular expression to match 6 digits

                        if (pincode === '') {
                          setInputState({
                            ...state,
                            PinCodeErr: ''
                          });
                        } else if (!pincodeRegex.test(pincode)) {
                          setInputState({
                            ...state,
                            PinCodeErr: ' Enter a 6 digit pin code.'
                          });
                        } else {
                          setInputState({ ...state, PinCodeErr: '' });
                        }
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: 'red'
                        }}
                      >
                        {inputState.PinCodeErr}
                      </small>
                    )}
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label font-weight-bold">
                      Aadhaar No :
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="adhar_no"
                      name="adhar_no"
                      maxLength="12"
                      defaultValue={
                        modal.modalData ? modal.modalData.adhar_no : ''
                      }
                      onChange={(event) => {
                        const aadharNum = event.target.value.trim();

                        if (aadharNum === 'NA' || aadharNum === 'na') {
                          // Allow "NA" case-insensitively
                          setInputState({
                            ...state,
                            AdharNumErr: ''
                          });
                        } else if (!aadharNum) {
                          setInputState({
                            ...state,
                            AdharNumErr: ''
                          });
                        } else if (/[^0-9]/.test(aadharNum)) {
                          setInputState({
                            ...state,
                            AdharNumErr:
                              'Aadhar number should contain digits only.'
                          });
                        } else if (aadharNum.length < 12) {
                          setInputState({
                            ...state,
                            AdharNumErr:
                              'Aadhar number should be 12 digits long.'
                          });
                        } else if (/0{5,}/.test(aadharNum)) {
                          setInputState({
                            ...state,
                            AdharNumErr:
                              'Aadhar number should not contain more than 4 consecutive zeros.'
                          });
                        } else if (/^[01]/.test(aadharNum)) {
                          setInputState({
                            ...state,
                            AdharNumErr:
                              'Aadhar number should not start with 0 or 1.'
                          });
                        } else {
                          setInputState({ ...state, AdharNumErr: '' });
                        }
                      }}
                    />

                    {inputState.AdharNumErr && (
                      <small style={{ color: 'red' }}>
                        {inputState.AdharNumErr}
                      </small>
                    )}
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label">
                      <b>Aadhaar Attachment :</b>
                    </label>

                    <input
                      type="file"
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      name="adhar_attachment[]"
                      id="adhar_attachment"
                      className="form-control"
                      ref={aadharAttachmentRef}
                      multiple
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];

                        // Check if the file type is one of the allowed types
                        if (
                          selectedFile.type === 'image/jpg' ||
                          selectedFile.type === 'image/jpeg' ||
                          selectedFile.type === 'image/png' ||
                          selectedFile.type === 'application/pdf'
                        ) {
                          // File type is allowed
                        } else {
                          // Check if the file type is BMP
                          if (selectedFile.type === 'image/bmp') {
                            alert(
                              'Invalid file format. BMP files are not allowed.'
                            );
                          } else {
                            alert(
                              'Invalid file format. Only jpg, jpeg, png, and pdf are allowed.'
                            );
                          }
                          e.target.value = ''; // Clear the input to prevent the user from submitting an invalid file
                        }
                        // Check if attachment is required and input field is empty

                        uploadAdharAttachmentHandler(e, 'UPLOAD', '');
                        maxLengthCheck(e, 'PAN');
                      }}
                      capture="camera"
                    />

                    {/* aadhar attachment display */}
                    {adharattachment &&
                      adharattachment.map((attachment, index) => {
                        const splittedArray = attachment?.path
                          ? attachment?.path?.split('/')
                          : null;
                        return (
                          <div
                            key={index}
                            className="justify-content-end px-0"
                            style={{
                              marginRight: '20px',
                              padding: '5px',
                              maxWidth: '250px'
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: '#EBF5FB' }}
                            >
                              <div className="card-header p-1">
                                <div className="d-flex justify-content-between align-items-center p-0 ">
                                  <a
                                    href={
                                      attachment?.path
                                        ? `${_attachmentUrl}/${attachment?.path}`
                                        : `${attachment.tempUrl}`
                                    }
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i class="icofont-ui-zoom-out"></i>
                                  </a>
                                  <span className="fw-6 fw-bold">
                                    {attachment?.path
                                      ? splittedArray[splittedArray.length - 1]
                                      : attachment.fileName}
                                  </span>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-1"
                                    type="button"
                                    onClick={(e) => {
                                      uploadAdharAttachmentHandler(
                                        e,
                                        'DELETE',
                                        index,
                                        attachment?.id ? attachment?.id : null
                                      );
                                    }}
                                  >
                                    <i
                                      class="icofont-ui-delete"
                                      style={{ fontSize: '15px' }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="col-sm-3 ">
                    <label className="form-label font-weight-bold">
                      PAN No :<Astrick color="red" size="13px" />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="pan_no"
                      name="pan_no"
                      maxLength="10"
                      onInput={(event) => {
                        const input = event.target;
                        input.value = input.value.toUpperCase();
                      }}
                      defaultValue={
                        modal.modalData ? modal.modalData.pan_no : ''
                      }
                      required={true}
                      onChange={(event) => {
                        const panNumber = event.target.value.trim();
                        event.target.value = panNumber;

                        if (panNumber === '') {
                          setInputState({
                            ...state,
                            PanNumberErr: ''
                          });
                        } else if (panNumber === 'NA') {
                          setInputState({
                            ...state,
                            PanNumberErr: '' // Clear error message for "NA"
                          });
                        } else if (panNumber.length !== 10) {
                          setInputState({
                            ...state,
                            PanNumberErr: 'Invalid PAN number length.'
                          });
                        } else if (
                          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)
                        ) {
                          setInputState({
                            ...state,
                            PanNumberErr: 'Invalid PAN number format.'
                          });
                        } else {
                          setInputState({ ...state, PanNumberErr: '' });
                        }
                      }}
                    />
                    {inputState.PanNumberErr && (
                      <small style={{ color: 'red' }}>
                        {inputState.PanNumberErr}
                      </small>
                    )}
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label" htmlFor="attachment">
                      <b>
                        PAN Attachment :<Astrick color="red" size="13px" />
                      </b>
                    </label>

                    <input
                      type="file"
                      name="pan_attachment"
                      id="pan_attachment"
                      multiple={true}
                      required={panattachment.length > 0 ? false : true}
                      className="form-control"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (
                          selectedFile.type === 'image/jpg' ||
                          selectedFile.type === 'image/jpeg' ||
                          selectedFile.type === 'image/png' ||
                          selectedFile.type === 'application/pdf'
                        ) {
                          // File type is allowed
                        } else {
                          // Check if the file type is BMP
                          if (selectedFile.type === 'image/bmp') {
                            alert(
                              'Invalid file format. BMP files are not allowed.'
                            );
                          } else {
                            alert(
                              'Invalid file format. Only jpg, jpeg, png, and pdf are allowed.'
                            );
                          }
                          e.target.value = '';
                          panAttachmentRef.current.value = '';
                        }

                        uploadPanAttachmentHandler(e, 'UPLOAD', '');
                        maxLengthCheck(e, 'PAN');
                      }}
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      ref={panAttachmentRef}
                      capture="camera"
                    />

                    {/* Pan attachment display */}
                    {panattachment &&
                      panattachment.map((attachment, index) => {
                        const splittedArray = attachment?.path
                          ? attachment?.path?.split('/')
                          : null;
                        return (
                          <div
                            key={index}
                            className="justify-content-end px-0"
                            style={{
                              marginRight: '20px',
                              padding: '5px',
                              maxWidth: '250px'
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: '#EBF5FB' }}
                            >
                              <div className="p-1 card-header">
                                <div className="d-flex justify-content-between align-items-center p-0 ">
                                  <a
                                    href={
                                      attachment?.path
                                        ? `${_attachmentUrl}/${attachment?.path}`
                                        : `${attachment.tempUrl}`
                                    }
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 py-0 px-1"
                                  >
                                    <i className="icofont-ui-zoom-out"></i>
                                  </a>
                                  <span className="fw-6 fw-bold">
                                    {attachment?.path
                                      ? splittedArray[splittedArray.length - 1]
                                      : attachment.fileName}
                                  </span>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-1"
                                    type="button"
                                    onClick={(e) => {
                                      uploadPanAttachmentHandler(
                                        e,
                                        'DELETE',
                                        index,
                                        attachment?.id ? attachment?.id : null
                                      );
                                    }}
                                  >
                                    <i
                                      class="icofont-ui-delete"
                                      style={{ fontSize: '15px' }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="col-sm-3 mt-3">
                    <label className="form-label font-weight-bold">
                      GST No :
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="gst_no"
                      name="gst_no"
                      maxLength="15"
                      defaultValue={
                        modal.modalData ? modal.modalData.gst_no : ''
                      }
                      onChange={(event) => {
                        event.target.value = event.target.value.toUpperCase();
                        const gstNumber = event.target.value;
                        const gstNumberRegex =
                          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;

                        if (!gstNumber) {
                          setInputState({
                            ...state,
                            GSTNumberErr: ''
                          });
                        } else if (gstNumber === 'NA') {
                          setInputState({
                            ...state,
                            GSTNumberErr: ''
                          });
                        } else if (gstNumber.length !== 15) {
                          setInputState({
                            ...state,
                            GSTNumberErr:
                              'GST number should be 15 characters long.'
                          });
                        } else if (!gstNumberRegex.test(gstNumber)) {
                          setInputState({
                            ...state,
                            GSTNumberErr: 'Invalid GST number format.'
                          });
                        } else {
                          setInputState({ ...state, GSTNumberErr: '' });
                        }
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: 'red'
                        }}
                      >
                        {inputState.GSTNumberErr}
                      </small>
                    )}
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label">
                      <b> GST Attachment : </b>
                    </label>

                    <input
                      type="file"
                      name="gst_attachment[]"
                      id="gst_attachment"
                      multiple={true}
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      className="form-control"
                      ref={gstInputRef}
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];

                        // Check if the file type is one of the allowed types
                        if (
                          selectedFile.type === 'image/jpg' ||
                          selectedFile.type === 'image/jpeg' ||
                          selectedFile.type === 'image/png' ||
                          selectedFile.type === 'application/pdf'
                        ) {
                          // File type is allowed
                        } else {
                          // Check if the file type is BMP
                          if (selectedFile.type === 'image/bmp') {
                            alert(
                              'Invalid file format. BMP files are not allowed.'
                            );
                          } else {
                            alert(
                              'Invalid file format. Only jpg, jpeg, png, and pdf are allowed.'
                            );
                          }
                          e.target.value = '';
                          gstInputRef.current.value = ''; // Clear the input to prevent the user from submitting an invalid file
                        }

                        uploadGstAttachmentHandler(e, 'UPLOAD', '');
                        maxLengthCheck(e, 'GST');
                      }}
                    />

                    {/* Gst attachment display */}

                    {gstAttachment &&
                      gstAttachment.map((attachment, index) => {
                        const splittedArray = attachment?.path
                          ? attachment?.path?.split('/')
                          : null;
                        return (
                          <div
                            key={index}
                            className="justify-content-end px-0"
                            style={{
                              marginRight: '20px',
                              padding: '5px',
                              maxWidth: '250px'
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: '#EBF5FB' }}
                            >
                              <div className="p-1 card-header">
                                <div className="d-flex justify-content-between align-items-center p-0">
                                  <a
                                    href={
                                      attachment?.path
                                        ? `${_attachmentUrl}/${attachment?.path}`
                                        : `${attachment.tempUrl}`
                                    }
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i class="icofont-ui-zoom-out"></i>
                                  </a>
                                  <span className="fw-6 fw-bold">
                                    {attachment?.path
                                      ? splittedArray[splittedArray.length - 1]
                                      : attachment.fileName}
                                  </span>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-1"
                                    type="button"
                                    onClick={(e) => {
                                      uploadGstAttachmentHandler(
                                        e,
                                        'DELETE',
                                        index,
                                        attachment?.id ? attachment?.id : null
                                      );
                                    }}
                                  >
                                    <i
                                      class="icofont-ui-delete"
                                      style={{ fontSize: '15px' }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="col-sm-3 ">
                    <label className="form-label font-weight-bold">
                      MSME No :
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="msme_no"
                      name="msme_no"
                      maxLength={12}
                      ref={fileInputRef}
                      defaultValue={
                        modal.modalData ? modal.modalData.msme_no : ''
                      }
                      onInput={(event) => {
                        const input = event.target;
                        input.value = input.value.toUpperCase();
                      }}
                      onKeyPress={(e) => {
                        if (!/^([A-Za-z0-9]{1})$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        const msmeNo = event.target.value;
                        if (msmeNo.length > 0) {
                          setInputState({
                            ...state,
                            MSMENumberErr: ''
                          });
                        } else if (msmeNo.length < 19) {
                          setInputState({
                            ...state,
                            MSMENumberErr: 'Invalid MSME No.'
                          });
                        } else if (
                          /^([A-Za-z]{5}\d{2}[A-Za-z0-9]{1,2}\d{7})|^(\d{20})$/.test(
                            msmeNo
                          )
                        ) {
                          setInputState({
                            ...state,
                            MSMENumberErr: 'Invalid MSME No.'
                          });
                        } else if (
                          !/^([A-Za-z]{5}\d{2}\d{2}\d{7})|^(\d{19})$/.test(
                            msmeNo
                          )
                        ) {
                          setInputState({
                            ...state,
                            MSMENumberErr: 'Invalid Udyam No.'
                          });
                        } else {
                          setInputState({
                            ...state,
                            MSMENumberErr: ''
                          });
                        }
                      }}
                    />
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label" htmlFor="msme_attachment">
                      <b> MSME Attachment : </b>
                    </label>

                    <input
                      type="file"
                      name="msme_attachment[]"
                      id="msme_attachment"
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      className="form-control"
                      ref={msmeInputRef}
                      multiple={true}
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];

                        if (
                          selectedFile.type === 'image/jpg' ||
                          selectedFile.type === 'image/jpeg' ||
                          selectedFile.type === 'image/png' ||
                          selectedFile.type === 'application/pdf'
                        ) {
                          // File type is allowed
                        } else {
                          // Check if the file type is BMP
                          if (selectedFile.type === 'image/bmp') {
                            alert(
                              'Invalid file format. BMP files are not allowed.'
                            );
                          } else {
                            alert(
                              'Invalid file format. Only jpg, jpeg, png, and pdf are allowed.'
                            );
                          }
                          e.target.value = '';
                          msmeInputRef.current.value = ''; // Clear the input to prevent the user from submitting an invalid file
                        }

                        uploadMSMEAttachmentHandler(e, 'UPLOAD', '');
                        maxLengthCheck(e, 'MSME');
                      }}
                    />

                    {/* msme attachment display */}
                    {MSMEselectedFiles &&
                      MSMEselectedFiles.map((attachment, index) => {
                        const splittedArray = attachment?.path
                          ? attachment?.path?.split('/')
                          : null;
                        return (
                          <div
                            key={index}
                            className="justify-content-start px-0"
                            style={{
                              marginRight: '20px',
                              padding: '5px',
                              maxWidth: '250px'
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: '#EBF5FB' }}
                            >
                              <div className="p-1 card-header">
                                <div className="d-flex justify-content-between align-items-center p-0 ">
                                  <a
                                    href={
                                      attachment?.path
                                        ? `${_attachmentUrl}/${attachment?.path}`
                                        : `${attachment.tempUrl}`
                                    }
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i class="icofont-ui-zoom-out"></i>
                                  </a>
                                  <span className="fw-6 fw-bold">
                                    {attachment?.path
                                      ? splittedArray[splittedArray.length - 1]
                                      : attachment.fileName}
                                  </span>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-1"
                                    type="button"
                                    onClick={(e) => {
                                      uploadMSMEAttachmentHandler(
                                        e,
                                        'DELETE',
                                        index,
                                        attachment?.id ? attachment?.id : null
                                      );
                                    }}
                                  >
                                    <i
                                      class="icofont-ui-delete"
                                      style={{ fontSize: '15px' }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="col-sm-3 mt-3">
                    <label className="form-label font-weight-bold">
                      Bank Name :<Astrick color="red" size="13px" />
                    </label>
                    {modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-controlF-sm"
                        id="bank_name"
                        name="bank_name"
                        maxLength={50}
                        onKeyPress={(e) => {
                          Validation.CharacterWithSpace(e);
                        }}
                        readOnly={
                          authorities &&
                          authorities.Edit_Vendor_Master_Bank_Details === false
                            ? true
                            : false
                        }
                        defaultValue={
                          modal.modalData ? modal.modalData.bank_name : ''
                        }
                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === '') {
                            setInputState({
                              bankNameError: ''
                            });
                          } else if (
                            !value.match(
                              /^[A-Za-z\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                            )
                          ) {
                            setInputState({
                              bankNameError: 'Invalid Bank Name'
                            });
                          } else if (value.length > 50) {
                            setInputState({
                              bankNameError:
                                'Bank name can be up to 50 characters long.'
                            });
                          } else {
                            setInputState('');
                          }
                        }}
                        required={true}
                      />
                    )}
                    {!modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="bank_name"
                        name="bank_name"
                        maxLength={50}
                        onKeyPress={(e) => {
                          Validation.CharacterWithSpace(e);
                        }}
                        required={true}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === '') {
                            setInputState({
                              bankNameError: ''
                            });
                          } else if (
                            !value.match(
                              /^[A-Za-z\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                            )
                          ) {
                            setInputState({
                              bankNameError: 'Invalid Bank Name'
                            });
                          } else if (value.length > 50) {
                            setInputState({
                              bankNameError:
                                'Bank name can be up to 50 characters long.'
                            });
                          } else {
                            setInputState('');
                          }
                        }}
                      />
                    )}
                    {inputState.bankNameError && (
                      <small style={{ color: 'red' }}>
                        {inputState.bankNameError}
                      </small>
                    )}
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label" htmlFor="attachment">
                      <b>Passbook Attachment :</b>
                    </label>
                    {
                      <input
                        type="file"
                        name="bank_passbook_attachment[]"
                        id="bank_passbook_attachment"
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                        className="form-control"
                        multiple={true}
                        ref={passbookInputRef}
                        disabled={
                          modal.modalData.bank_passbook_attachment &&
                          authorities &&
                          authorities.Edit_Vendor_Master_Bank_Details === false
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          if (
                            selectedFile.type === 'image/jpg' ||
                            selectedFile.type === 'image/jpeg' ||
                            selectedFile.type === 'image/png' ||
                            selectedFile.type === 'application/pdf'
                          ) {
                          } else {
                            if (selectedFile.type === 'image/bmp') {
                              alert(
                                'Invalid file format. BMP files are not allowed.'
                              );
                            } else {
                              alert(
                                'Invalid file format. Only jpg, jpeg, png, and pdf are allowed.'
                              );
                            }
                            e.target.value = '';
                            passbookInputRef.current.value = ''; // Clear the input to prevent the user from submitting an invalid file
                          }
                          uploadPassBookAttachmentHandler(e, 'UPLOAD', '');
                          maxLengthCheck(e, 'PASSBOOK');
                        }}
                      />
                    }

                    {/* passbook attachment display */}

                    {passBookSelectedFiles &&
                      passBookSelectedFiles.map((attachment, index) => {
                        const splittedArray = attachment?.path
                          ? attachment?.path?.split('/')
                          : null;
                        return (
                          <div
                            key={index}
                            className="justify-content-start px-0"
                            style={{
                              marginRight: '20px',
                              padding: '5px',
                              maxWidth: '250px'
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: '#EBF5FB' }}
                            >
                              <div className="p-1 card-header">
                                <div className="d-flex justify-content-between align-items-center p-0 ">
                                  <a
                                    href={
                                      attachment?.path
                                        ? `${_attachmentUrl}/${attachment?.path}`
                                        : `${attachment.tempUrl}`
                                    }
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i class="icofont-ui-zoom-out"></i>
                                  </a>
                                  <span className="fw-6 fw-bold">
                                    {attachment?.path
                                      ? splittedArray[splittedArray.length - 1]
                                      : attachment.fileName}
                                  </span>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-1"
                                    type="button"
                                    onClick={(e) => {
                                      uploadPassBookAttachmentHandler(
                                        e,
                                        'DELETE',
                                        index,
                                        attachment?.id ? attachment?.id : null
                                      );
                                    }}
                                  >
                                    <i
                                      class="icofont-ui-delete"
                                      style={{ fontSize: '15px' }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="col-sm-3 mt-3">
                    <label className="form-label font-weight-bold">
                      Account No :<Astrick color="red" size="13px" />
                    </label>
                    {modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="account_no"
                        name="account_no"
                        readOnly={
                          authorities &&
                          authorities.Edit_Vendor_Master_Bank_Details === false
                            ? true
                            : false
                        }
                        defaultValue={
                          modal.modalData ? modal.modalData.account_no : ''
                        }
                        onKeyPress={(e) => {
                          Validation.CardNumbersOnly(e);
                        }}
                        onChange={(event) => {
                          const inputVal = event.target.value;
                          const regex = /^[a-zA-Z0-9]{1,25}$|^NA$/; // Allow alphanumeric or "NA" with a maximum length of 25 characters
                          if (inputVal === '') {
                            setInputState({
                              ...state,
                              AccountNumberErr: ''
                            });
                          } else if (inputVal === 'NA') {
                            setInputState({
                              ...state,
                              AccountNumberErr: ''
                            });
                          } else if (inputVal.length < 10) {
                            setInputState({
                              ...state,
                              AccountNumberErr: 'invalid account Number'
                            });
                          } else if (!regex.test(inputVal)) {
                            setInputState({
                              ...state,
                              AccountNumberErr:
                                'Account Number should be alphanumeric and maximum length should be 25 characters.'
                            });
                          } else {
                            setInputState({ ...state, AccountNumberErr: '' });
                          }
                        }}
                        required={true}
                        maxLength="25"
                      />
                    )}

                    {!modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="account_no"
                        name="account_no"
                        onKeyPress={(e) => {
                          Validation.CardNumbersOnly(e);
                        }}
                        onChange={(event) => {
                          const inputVal = event.target.value;
                          const regex = /^[a-zA-Z0-9]{1,25}$|^NA$/; // Allow alphanumeric or "NA" with a maximum length of 25 characters
                          if (inputVal === '') {
                            setInputState({
                              ...state,
                              AccountNumberErr: ''
                            });
                          } else if (inputVal === 'NA') {
                            setInputState({
                              ...state,
                              AccountNumberErr: ''
                            });
                          } else if (inputVal.length < 10) {
                            setInputState({
                              ...state,
                              AccountNumberErr: 'invalid Acc Number'
                            });
                          } else if (!regex.test(inputVal)) {
                            setInputState({
                              ...state,
                              AccountNumberErr: 'Invalid Account Number.'
                            });
                          } else {
                            setInputState({ ...state, AccountNumberErr: '' });
                          }
                        }}
                        required={true}
                        maxLength="25"
                      />
                    )}

                    {inputState && (
                      <small
                        style={{
                          color: 'red'
                        }}
                      >
                        {inputState.AccountNumberErr}
                      </small>
                    )}
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label">
                      <b>Cheque Attachment :</b>
                    </label>

                    <input
                      type="file"
                      name="cheque_attachment[]"
                      id="cheque_attachment"
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      className="form-control"
                      ref={chequeInputRef}
                      multiple={true}
                      disabled={
                        modal.modalData.cheque_attachment &&
                        authorities &&
                        authorities.Edit_Vendor_Master_Bank_Details === false
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];

                        // Check if the file type is one of the allowed types
                        if (
                          selectedFile.type === 'image/jpg' ||
                          selectedFile.type === 'image/jpeg' ||
                          selectedFile.type === 'image/png' ||
                          selectedFile.type === 'application/pdf'
                        ) {
                          // File type is allowed
                        } else {
                          // Check if the file type is BMP
                          if (selectedFile.type === 'image/bmp') {
                            alert(
                              'Invalid file format. BMP files are not allowed.'
                            );
                          } else {
                            alert(
                              'Invalid file format. Only jpg, jpeg, png, and pdf are allowed.'
                            );
                          }
                          e.target.value = ''; // Clear the input to prevent the user from submitting an invalid file
                        }
                        uploadPassChequeAttachmentHandler(e, 'UPLOAD', '');
                        maxLengthCheck(e, 'CHEQUE');
                      }}
                    />

                    {/* cheque attachment display */}

                    {chequeAttachmentSelectedFiles &&
                      chequeAttachmentSelectedFiles.map((attachment, index) => {
                        const splittedArray = attachment?.path
                          ? attachment?.path?.split('/')
                          : null;
                        return (
                          <div
                            key={index}
                            className="justify-content-start px-0"
                            style={{
                              marginRight: '20px',
                              padding: '5px',
                              maxWidth: '250px'
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: '#EBF5FB' }}
                            >
                              <div className="p-1 card-header">
                                <div className="d-flex justify-content-between align-items-center p-0">
                                  <a
                                    href={
                                      attachment?.path
                                        ? `${_attachmentUrl}/${attachment?.path}`
                                        : `${attachment.tempUrl}`
                                    }
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i class="icofont-ui-zoom-out"></i>
                                  </a>
                                  <span className="fw-6 fw-bold">
                                    {attachment?.path
                                      ? splittedArray[splittedArray.length - 1]
                                      : attachment.fileName}
                                  </span>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-1"
                                    type="button"
                                    onClick={(e) => {
                                      uploadPassChequeAttachmentHandler(
                                        e,
                                        'DELETE',
                                        index,
                                        attachment?.id ? attachment?.id : null
                                      );
                                    }}
                                  >
                                    <i
                                      class="icofont-ui-delete"
                                      style={{ fontSize: '15px' }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="col-sm-3 mt-3">
                    <label className="form-label font-weight-bold">
                      IFSC Code :<Astrick color="red" size="13px" />
                    </label>
                    {modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="ifsc_code"
                        name="ifsc_code"
                        maxLength="11"
                        readOnly={
                          authorities &&
                          authorities.Edit_Vendor_Master_Bank_Details === false
                            ? true
                            : false
                        }
                        onInput={(event) => {
                          const input = event.target;
                          input.value = input.value.toUpperCase();
                        }}
                        defaultValue={modal.modalData.ifsc_code.toUpperCase()}
                        onKeyPress={(e) => {
                          Validation.CharactersNumbersOnlyForPan(e);
                        }}
                        required={true}
                        onChange={(event) => {
                          const inputVal = event.target.value.toUpperCase();

                          setIfsccodeUppercase(inputVal);

                          const regex = /^[A-Z0-9]{1,25}$/; // alphanumeric with max length of 25
                          if (inputVal === '') {
                            setInputState({
                              ...state,
                              ifscCodeErr: ''
                            });
                          } else if (inputVal === 'NA') {
                            setInputState({
                              ...state,
                              ifscCodeErr: ''
                            });
                          } else if (!regex.test(inputVal)) {
                            setInputState({
                              ...state,
                              ifscCodeErr: 'Invalid IFSC  Number.'
                            });
                          } else {
                            setInputState({ ...state, ifscCodeErr: '' });
                          }
                        }}
                      />
                    )}
                    {!modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="ifsc_code"
                        name="ifsc_code"
                        maxLength="11"
                        value={
                          ifscodeUppercase && ifscodeUppercase
                            ? ifscodeUppercase
                            : ''
                        }
                        onBlur={(e) => {
                          const isValid = validateIFSCCode(e.target.value);
                          if (!isValid) {
                          }
                        }}
                        onKeyPress={(e) => {
                          Validation.CharactersNumbersOnlyForPan(e);
                        }}
                        required={true}
                        onChange={(event) => {
                          const inputVal = event.target.value.toUpperCase();
                          setIfsccodeUppercase(inputVal);

                          const regex = /^[A-Z]{4}[A-Z0-9]{7}$/i; // alphanumeric with max length of 11
                          if (inputVal === '' || inputVal === 'NA') {
                            setInputState({
                              ...state,
                              ifscCodeErr: ''
                            });
                          } else if (inputVal === 'NA') {
                            setInputState({
                              ...state,
                              ifscCodeErr: ''
                            });
                          } else if (!regex.test(inputVal)) {
                            setInputState({
                              ...state,
                              ifscCodeErr: 'Invalid  IFSC Code.'
                            });
                          } else {
                            setInputState({ ...state, ifscCodeErr: '' });
                          }
                        }}
                      />
                    )}
                    {inputState && (
                      <small
                        style={{
                          color: 'red'
                        }}
                      >
                        {inputState.ifscCodeErr}
                      </small>
                    )}
                  </div>

                  <div className="col-sm-3 mt-3">
                    <label className="form-label font-weight-bold">
                      Beneficiary Name :<Astrick color="red" size="13px" />
                    </label>
                    {modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="beneficiary_name"
                        readOnly={
                          authorities &&
                          authorities.Edit_Vendor_Master_Bank_Details === false
                            ? true
                            : false
                        }
                        name="beneficiary_name"
                        maxLength={50}
                        defaultValue={
                          modal.modalData
                            ? modal.modalData.beneficiary_name
                            : ''
                        }
                        onChange={(event) => {
                          const enteredValue = event.target.value;
                          const regex = /^[A-Za-z ]*$/; // regex to allow only letters, numbers, and spaces

                          if (enteredValue === '') {
                            setInputState({
                              ...state,
                              BeneficiaryErr: ''
                            });
                          } else if (!regex.test(enteredValue)) {
                            setInputState({
                              ...state,
                              BeneficiaryErr: 'Invalid name'
                            });
                          } else {
                            setInputState({ ...state, BeneficiaryErr: '' });
                          }
                        }}
                        required={true}
                      />
                    )}
                    {!modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="beneficiary_name"
                        name="beneficiary_name"
                        maxLength={50}
                        required={true}
                        onChange={(event) => {
                          const enteredValue = event.target.value;
                          const regex = /^[A-Za-z ]*$/;

                          if (enteredValue === '') {
                            setInputState({
                              ...state,
                              BeneficiaryErr: ''
                            });
                          } else if (!regex.test(enteredValue)) {
                            setInputState({
                              ...state,
                              BeneficiaryErr: 'Invalid name.'
                            });
                          } else {
                            setInputState({ ...state, BeneficiaryErr: '' });
                          }
                        }}
                      />
                    )}

                    {inputState && (
                      <small
                        style={{
                          color: 'red'
                        }}
                      >
                        {inputState.BeneficiaryErr}
                      </small>
                    )}
                  </div>
                  <div className="col-sm-3 mt-3">
                    <label className="form-label font-weight-bold">
                      Bank Branch Name :<Astrick color="red" size="13px" />
                    </label>
                    {modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="bank_branch_name"
                        name="bank_branch_name"
                        maxLength={25}
                        onKeyPress={(e) => {
                          Validation.CharacterWithSpace(e);
                        }}
                        readOnly={
                          authorities &&
                          authorities.Edit_Vendor_Master_Bank_Details === false
                            ? true
                            : false
                        }
                        defaultValue={
                          modal.modalData
                            ? modal.modalData.bank_branch_name
                            : ''
                        }
                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === '') {
                            setInputState({
                              branchNameError: ''
                            });
                          } else if (
                            !value.match(
                              // /^[A-Za-z0-9\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                              /^(?=.*[A-Za-z])[A-Za-z0-9\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                            )
                          ) {
                            setInputState({
                              branchNameError: 'Invalid Branch Name'
                            });
                          } else if (value.length > 25) {
                            setInputState({
                              branchNameError:
                                'Bank name can be up to 50 characters long.'
                            });
                          } else {
                            setInputState('');
                          }
                        }}
                        required={true}
                      />
                    )}
                    {!modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="bank_branch_name"
                        name="bank_branch_name"
                        maxLength={25}
                        onKeyPress={(e) => {
                          Validation.CharacterWithSpace(e);
                        }}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === '') {
                            setInputState({
                              branchNameError: ''
                            });
                          } else if (
                            !value.match(
                              // /^[A-Za-z0-9\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                              /^(?=.*[A-Za-z])[A-Za-z0-9\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                            )
                          ) {
                            setInputState({
                              branchNameError: 'Invalid Branch Name'
                            });
                          } else if (value.length > 25) {
                            setInputState({
                              branchNameError:
                                'Bank name can be up to 50 characters long.'
                            });
                          } else {
                            setInputState('');
                          }
                        }}
                        required={true}
                      />
                    )}
                    {inputState.branchNameError && (
                      <small style={{ color: 'red' }}>
                        {inputState.branchNameError}
                      </small>
                    )}
                  </div>

                  {/* <div className="col-sm-3 ">
                    <label className="form-label font-weight-bold">
                      Consider In Payment :<Astrick color="red" size="13px" />
                    </label>
                    <select
                      type="text"
                      className="form-control form-control-sm"
                      id="consider_in_payment"
                      name="consider_in_payment"
                      maxLength="20"
                      onChange={(e) => {
                        handleConsideredInPay(e);
                      }}
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnlyForPan(e);
                      }}
                      defaultValue={modal.modalData.consider_in_payment}
                    >
                      <option value="">SELECT...</option>
                      <option
                        selected={
                          modal.modalData.consider_in_payment == "YES" ||
                          modal.modalData.consider_in_payment == "yes" ||
                          modal.modalData.consider_in_payment == "Yes"
                        }
                        value="YES"
                      >
                        YES
                      </option>
                      <option
                        selected={
                          modal.modalData.consider_in_payment == "NO" ||
                          modal.modalData.consider_in_payment == "no" ||
                          modal.modalData.consider_in_payment == "No"
                        }
                        value="NO"
                      >
                        NO
                      </option>
                      <option
                        selected={
                          modal.modalData.consider_in_payment == "PETTY CASH" ||
                          modal.modalData.consider_in_payment == "petty cash" ||
                          modal.modalData.consider_in_payment == "Petty Cash"
                        }
                        value="PETTY_CASH"
                      >
                        PETTY CASH
                      </option>
                    </select>
                  </div> */}

                  <div className="col-sm-3">
                    <label className="form-label font-weight-bold">
                      Consider In Payment :<Astrick color="red" size="13px" />
                    </label>
                    <select
                      type="text"
                      className="form-control form-control-sm"
                      id="consider_in_payment"
                      name="consider_in_payment"
                      maxLength="20"
                      onChange={(e) => {
                        handleConsideredInPay(e);
                      }}
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnlyForPan(e);
                      }}
                      defaultValue={modal.modalData.consider_in_payment?.toUpperCase()}
                    >
                      <option value="">SELECT...</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                      <option value="PETTY_CASH">PETTY CASH</option>
                    </select>
                  </div>

                  <div className="col-sm-3 mt-3">
                    <label className="form-label font-weight-bold">
                      ERP Acc Name :<Astrick color="red" size="13px" />
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="acme_account_name"
                      name="acme_account_name"
                      value={erp}
                      readOnly={
                        (authorities &&
                          authorities.Update_ERP_Account_Name === false) ||
                        modal?.modalHeader === 'Add Vendor'
                          ? true
                          : false
                      }
                      defaultValue={
                        modal.modalData ? modal.modalData.acme_account_name : ''
                      }
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersSpeicalOnly(e);
                      }}
                      onChange={(event) => {
                        if (event.target.value === '') {
                          setInputState({
                            ...state,
                            ERPAccErr: 'Please enter ERP Acc Name'
                          });
                        } else {
                          setInputState({ ...state, ERPAccErr: '' });
                        }
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: 'red'
                        }}
                      >
                        {inputState.ERPAccErr}
                      </small>
                    )}
                  </div>
                  {consider === 'YES' && paymentDropdown && (
                    <div className="col-sm-3 mt-3">
                      <label className="form-label font-weight-bold">
                        Template :<Astrick color="red" size="13px" />
                      </label>

                      <Select
                        id="payment_template"
                        name="payment_template"
                        options={paymentDropdown}
                        ref={considerInRef}
                        defaultValue={
                          modal.modalData &&
                          paymentDropdown.filter(
                            (d) => d.value == modal.modalData.payment_template
                          )
                        }
                      />
                    </div>
                  )}

                  {consider && consider === 'PETTY_CASH' && considerInPay && (
                    <div className="col-sm-3 mt-3">
                      <label className="form-label font-weight-bold">
                        Card Number :
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="card_number"
                        name="card_number"
                        maxLength={16}
                        defaultValue={
                          modal.modalData ? modal.modalData.card_number : ''
                        }
                        onKeyPress={(e) => {
                          Validation.CardNumbersOnly(e);
                        }}
                        onChange={(event) => {
                          if (event.target.value === '') {
                            setInputState({
                              ...state,
                              CardNumberError: ''
                            });
                          } else if (event.target.value === 'NA') {
                            setInputState({
                              ...state,
                              CardNumberError: ''
                            });
                          } else if (event.target.value.length < 16) {
                            setInputState({
                              ...state,
                              CardNumberError:
                                'Card Number Should be 16 characters'
                            });
                          } else {
                            setInputState({
                              ...state,
                              CardNumberError: '' // Clear the error if the length is 16 or greater
                            });
                          }
                        }}
                      />
                      {inputState.CardNumberError && (
                        <div className="text-danger">
                          {inputState.CardNumberError}
                        </div>
                      )}
                    </div>
                  )}
                  {consider && consider === 'PETTY_CASH' && considerInPay && (
                    <div className="col-sm-3 mt-4">
                      <label className="form-label font-weight-bold">
                        Ref Number :
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="reference_number"
                        name="reference_number"
                        maxLength={25}
                        defaultValue={
                          modal.modalData
                            ? modal.modalData.reference_number
                            : ''
                        }
                        onChange={(event) => {
                          if (event.target.value === '') {
                            setInputState({
                              ...state,
                              RefNumberError: ''
                            });
                          } else if (event.target.value === 'NA') {
                            setInputState({
                              ...state,
                              RefNumberError: ''
                            });
                          } else if (event.target.value.length < 10) {
                            setInputState({
                              ...state,
                              RefNumberError:
                                'Ref Number Should be 25 characters'
                            });
                          } else {
                            setInputState({
                              ...state,
                              RefNumberError: '' // Clear the error if the length is 16 or greater
                            });
                          }
                        }}
                        onKeyPress={(e) => {
                          Validation.CardNumbersOnly(e);
                        }}
                      />

                      {inputState.RefNumberError && (
                        <div className="text-danger">
                          {inputState.RefNumberError}
                        </div>
                      )}
                    </div>
                  )}
                  {consider && consider === 'PETTY_CASH' && considerInPay && (
                    <div className="col-sm-3">
                      <label className="form-label font-weight-bold">
                        Narrations :
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="narration"
                        name="narration"
                        maxLength={50}
                        defaultValue={
                          modal.modalData ? modal.modalData.narration : ''
                        }
                        onKeyPress={(e) => {
                          Validation.NarrationAlphanumeric(e);
                        }}
                      />
                    </div>
                  )}

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
                            id="is_active"
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
                            id="is_active"
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
                            htmlFor="is_active"
                          >
                            Deactive
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {!modal.modalData && (
                <button
                  type="submit"
                  className="btn btn-primary text-white"
                  style={{ backgroundColor: '#484C7F' }}
                >
                  Save
                </button>
              )}
              {modal.modalData && (
                <button
                  type="submit"
                  className="btn btn-primary text-white"
                  style={{ backgroundColor: '#484C7F' }}
                >
                  Update
                </button>
              )}
              <button
                type="button"
                className="btn btn-danger text-white"
                onClick={() => {
                  setNotify(null);
                  handleModal({
                    showModal: false,
                    modalData: '',
                    modalHeader: ''
                  });
                }}
              >
                Close
              </button>
            </Modal.Footer>
          </form>
        </Modal>

        <Modal
          centered
          show={bulkModal.showModal}
          size="sm"
          onHide={(e) => {
            handleBulkModal({
              showModal: false,
              modalData: '',
              modalHeader: ''
            });
          }}
        >
          {' '}
          <Modal.Header>
            <Modal.Title className="fw-bold">
              {bulkModal.modalHeader}
            </Modal.Title>
          </Modal.Header>
          <form method="post" onSubmit={handleBulkUpload}>
            <Modal.Body>
              <div className="deadline-form">
                <div className="row ">
                  <input
                    type="hidden"
                    name="created_by"
                    value={userSessionData.userId}
                  />
                  <label className="form-label font-weight-bold">
                    Upload Excel/CSV File:
                    <Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="file"
                    name="attachment"
                    id="attachment"
                    accept=".xlsx, .xls, .csv"
                    className="form-control"
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: '#484C7F' }}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-danger text-white"
                onClick={() => {
                  handleBulkModal({
                    showModal: false,
                    modalData: '',
                    modalHeader: ''
                  });
                }}
              >
                Close
              </button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  );
}

export { VendorMaster };
