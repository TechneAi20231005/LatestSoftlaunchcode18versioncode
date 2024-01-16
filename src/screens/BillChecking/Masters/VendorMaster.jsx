import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import CountryService from "../../../services/MastersService/CountryService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Alert from "../../../components/Common/Alert";
import StateService from "../../../services/MastersService/StateService";
import CityService from "../../../services/MastersService/CityService";
import {
  getAttachment,
  deleteAttachment,
} from "../../../services/OtherService/AttachmentService";
import { _pincodeUrl, userSessionData } from "../../../settings/constants";
import VendorMasterService from "../../../services/Bill Checking/Masters/VendorMasterService";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { _attachmentUrl } from "../../../settings/constants";
import PaymentTemplateService from "../../../services/Bill Checking/Masters/PaymentTemplateService";
import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import { Link } from "react-router-dom";
import { _base } from "../../../settings/constants";
import { Table } from "react-bootstrap";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";

function VendorMaster({ match }) {
  const [data, setData] = useState(null);
  const [attachment, setAttachment] = useState();
  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);
  const [uppercase, SetUpperCase] = useState();
  const [Panuppercase, SetPanUpeeerCase] = useState();
  const [ifscodeUppercase, setIfsccodeUppercase] = useState();
  const [succes, setSucces] = useState();
  const [error, setError] = useState();

  const [notify, setNotify] = useState();
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [bulkModal, setBulkModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const handleBulkModal = (data) => {
    setBulkModal(data);
  };

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

  const handleModal = (data) => {
    if (data) {
      if (data.modalData.consider_in_payment == "PETTY_CASH") {
        setConsiderInPay(true);
      } else {
        setConsiderInPay(false);
      }
    }
    //setConsiderInPay(null)
    // setConsiderInPay(data? data.modalData.consider_in_payment: "")
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

  const columns = [
    {
      name: "Action",
      className: "font-weight-bold",
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
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: "Edit Vendor",
              });
              setError(null);
              setMSMESelectedFiles(null);
              setSelectedFiles(null);
              setChequeAttachmentSelectedFiles(null);
              setPassBookSelectedFiles(null);
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
          <Link
            to={`/${_base}/ViewVendorDetails/` + row.id}
            className="btn btn-sm btn-primary text-white"
            style={{ borderRadius: "50%", height: "30px", marginLeft: "5px" }}
          >
            <i className="icofont-eye-alt"></i>
          </Link>
        </div>
      ),
    },
    { name: "ID", id: "id", selector: (row) => row.id, sortable: true },
    {
      name: "Status",
      selector: (row) => row.is_active,
      sortable: false,

      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span style={{ width: "60px" }} className="badge bg-primary">
              Active
            </span>
          )}
          {row.is_active === 0 && (
            <span style={{ width: "60px" }} className="badge bg-danger">
              Deactive
            </span>
          )}
        </div>
      ),
    },
    { name: "Vendor Name", selector: (row) => row.vendor_name, sortable: true },

    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
      width: "160px",

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
                  {" "}
                  {row.address && row.address.length < 30
                    ? row.address
                    : row.address.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    { name: "Country", selector: (row) => row.country, sortable: true },
    { name: "State", selector: (row) => row.state, sortable: true },
    { name: "City", selector: (row) => row.city, sortable: true },
    { name: "Pincode", selector: (row) => row.pincode, sortable: true },
    { name: "Mobile", selector: (row) => row.mobile_no, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Aadhaar", selector: (row) => row.adhar_no, sortable: true },
    { name: " PAN ", selector: (row) => row.pan_no, sortable: true },
    { name: " MSME NO ", selector: (row) => row.msme_no, sortable: true },
    { name: " GST NO ", selector: (row) => row.gst_no, sortable: true },
    { name: " Bank Name ", selector: (row) => row.bank_name, sortable: true },
    {
      name: " Bank Branch Name ",
      selector: (row) => row.bank_branch_name,
      sortable: true,
    },
    { name: " Account No ", selector: (row) => row.account_no, sortable: true },
    { name: " IFSC Code ", selector: (row) => row.ifsc_code, sortable: true },
    {
      name: " Benificiary Name ",
      selector: (row) => row.beneficiary_name,
      sortable: true,
    },
    {
      name: " Consider In Pay ",
      selector: (row) => row.consider_in_payment,
      sortable: true,
    },
    {
      name: "ACME Account_Name ",
      selector: (row) => row.acme_account_name,
      sortable: true,
    },
    {
      name: " Ref Number ",
      selector: (row) => row.reference_number,
      sortable: true,
    },
    {
      name: " Card Number ",
      selector: (row) => row.card_number,
      sortable: true,
    },
    { name: " Narration ", selector: (row) => row.narration, sortable: true },
    {
      name: " Template Name ",
      selector: (row) => row.template_name,
      sortable: true,
    },
    {
      name: " Created At ",
      width: "200px",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: " Created By ",
      width: "200px",
      selector: (row) => row.created_by_name,
      sortable: true,
    },
    {
      name: " Updated At ",
      width: "200px",
      selector: (row) => row.updated_at,
      sortable: true,
    },
    {
      name: " Updated By ",
      width: "200px",
      selector: (row) => row.updated_by_name,
      sortable: true,
    },
  ];

  const loadData = async () => {
    const data = [];
    await new VendorMasterService().getVendors().then((res) => {
      if (res.status === 200) {
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
            narration: temp[key].narration,
          });
        }
        setData(null);
        setData(data);
        setDeta(res.data.access);
      }
    });

    // await new VendorMasterService().getVendorMasterById().then((res)=>{
    //     if(res.status === 200){
    //         if(res,data.status == 1){
    //             setData(res.data.data)
    //         }
    //     }
    // })

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
          res.data.data.map((d) => ({
            value: d.id,
            label: d.country.charAt(0).toUpperCase() + d.country.slice(1),
          }))
        );
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

    await new VendorMasterService().getActiveState().then((res) => {
      if (res.status === 200) {
        setState(res.data.data);
        setStateDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.state,
          }))
        );
      }
    });

    await new VendorMasterService().getActiveCity().then((res) => {
      if (res.status === 200) {
        setCity(res.data.data);
        setCityDropdown(
          res.data.data.filter((d)=>d.is_active == 1).map((i) => ({
            value: i.id,
            label: i.city,
          }))
        );

          
      }
    });


    await new VendorMasterService().getActivePaymentTemplate().then((res) => {
      if (res.status === 200) {
        setPayment(res.data.data);
        setPaymentDropdown(
          res.data.data
            .filter((d) => d.is_active === 1)
            .map((i) => ({ value: i.id, label: i.template_name }))

          //  res.data.data.filter((d) => d.is_active == 1).map((i)=> ({ value: i.id, label: i.template_name }))
          // res.data.data.map((d) =>
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
  const [consider, setConsider] = useState("YES");

  const handleConsideredInPay = (e) => {
    setConsider(e.target.value);
    setConsiderInPayment(e.target.value);

    if (
      e.target.value === "NO" ||
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

    if (e.target.value === "PETTY_CASH") {
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
    var msg = "";

    if (inputState.VendorNameErr) {
      alert("Invalid Vendor Name");
      return;
    }
    if (inputState.contactNoErr) {
      alert("Invalid contact Number");
      return;
    }
    if (inputState.emailError) {
      alert("Invalid Email");
      return;
    }
    if (inputState.AddressErr) {
      alert("Invaild Address");
      return;
    }
    if (inputState.PinCodeErr) {
      alert("Invalid Pincode");
      return;
    }
    if (inputState.AdharNumErr) {
      alert("Invalid Adhaar Number ");
      return;
    }
    if (inputState.PanNumberErr) {
      alert("Invalid Pan Number ");
      return;
    }

    if (inputState.GSTNumberErr) {
      alert("Invalid GST Number ");
      return;
    }
    // if (inputState.MSMENumberErr) {
      //   alert("Invalid MSME Number ");
      //   return;
    // }
    if (inputState.BankNameErr) {
      alert("Invalid Bank Name ");
      return;
    }
    if (inputState.BranchNameErr) {
      alert("Invalid Bank Branch Name ");
      return;
    }

    if (inputState.AccountNumberErr) {
      alert("Invalid Account Number ");
      return;
    }

    if (inputState.ifscCodeErr) {
      alert("Invalid IFSC Number ");
      return;
    }

    if (inputState.BeneficiaryErr) {
      alert("Invalid Beneficiary Name ");
      return;
    }

    if (inputState.ERPAccErr) {
      alert("Invalid ERP Acc Name ");
      return;
    }
    if (inputState.CardNumberError) {
      alert("Invalid Card Nubmer");
    }
    if (inputState.RefNumberError) {
      alert("Invalid Referance Nubmer");
    }

    if (!id) {
      if (
        considerInRef &&
        considerInRef.current &&
        considerInRef.current.commonProps &&
        considerInRef.current.commonProps.hasValue === false &&
        considerInPayment === false
      ) {
        alert("please select the template");
        e.preventDefault();
        flag = 0;
      }
      if (countryRef && countryRef.current.commonProps.hasValue == false) {
        alert("please select the country");
        e.preventDefault();
        flag = 0;
      }
      if (stateRef && stateRef.current.commonProps.hasValue == false) {
        alert("please select the state");
        e.preventDefault();
        flag = 0;
      }
      if (cityRef && cityRef.current.commonProps.hasValue == false) {
        alert("please select the city");
        e.preventDefault();
        flag = 0;
      }
      if (flag == 1) {
        await new VendorMasterService()
          .createVendor(form)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status === 1) {
                setNotify({ type: "success", message: res.data.message });
                setModal({ showModal: false, modalData: "", modalHeader: "" });
                loadData();
              } else {
                setError({ type: "danger", message: res.data.message });
                setModal({ showModal: true, modalData: "", modalHeader: "" });
              }
            } else {
              setError({ type: "danger", message: res.data.message });
              setModal({ showModal: true, modalData: "", modalHeader: "" });

              new ErrorLogService().sendErrorLog(
                "Vendor",
                "Create_Vendor",
                "INSERT",
                res.message
              );
            }
          })
          .catch((error) => {
            const { response } = error;
            const { request, ...errorObject } = response;
            setError({ type: "danger", message: "Request Error !!!" });
            new ErrorLogService().sendErrorLog(
              "Vendor",
              "Create_Vendor",
              "INSERT",
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
        modal.modalData.consider_in_payment !== "NO"
      ) {
        alert("please select the template");
        e.preventDefault();
        flag = 0;
      }
      if (countryRef && countryRef.current.commonProps.hasValue == false) {
        alert("please select the country");
        e.preventDefault();
        flag = 0;
      }
      if (stateRef && stateRef.current.commonProps.hasValue == false) {
        alert("please select the state");
        e.preventDefault();
        flag = 0;
      }
      if (cityRef && cityRef.current.commonProps.hasValue == false) {
        alert("please select the city");
        e.preventDefault();
        flag = 0;
      }
      if (flag === 1) {
        setNotify(null)
        await new VendorMasterService()
          .updateVendor(id, form)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status === 1) {
                setNotify({ type: "success", message: res.data.message });
                setModal({ showModal: false, modalData: "", modalHeader: "" });
                loadData();
              } else {
                setError({ type: "danger", message: res.data.message });
              }
            } else {
              setError({ type: "danger", message: res.data.message });
              new ErrorLogService().sendErrorLog(
                "Vendor",
                "Create_Vendor",
                "INSERT",
                res.message
              );
            }
          })
          .catch((error) => {
            const { response } = error;
            const { request, ...errorObject } = response;
            setError({ type: "danger", message: "Request Error !!!" });
            new ErrorLogService().sendErrorLog(
              "Vendor",
              "Create_Vendor",
              "INSERT",
              errorObject.data.message
            );
          });
      }
    }
  };
  const vendorRef = useRef();
  const [erp, setErp] = useState();

  const handleErp = (e) => {
    var erpValue = document.getElementById("vendor_name");
    document.getElementById("acme_account_name").value = erpValue.value;
  };

  useEffect(() => {
    loadData();
  }, []);

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
      await getAttachment(id, "BILL_CHECK").then((res) => {
        if (res.status === 200) {
          setAttachment(null);
          setAttachment(res.data.data);
        }
      });
    } else {
      setAttachment(null);
    }
  };

  const [selectedFiles, setSelectedFiles] = useState();
  const uploadAttachmentHandler = (e, type, id = null) => {
    if (type === "UPLOAD") {
      var tempSelectedFile = [];
      for (var i = 0; i < e.target.files.length; i++) {
        tempSelectedFile.push({
          file: e.target.files[i],
          fileName: e.target.files[i].name,
          tempUrl: URL.createObjectURL(e.target.files[i]),
        });
      }
      setSelectedFiles(tempSelectedFile);
    } else if (type === "DELETE") {
      gstInputRef.current.value = "";
      let filteredFileArray = selectedFiles.filter(
        (item, index) => id !== index
      );
      setSelectedFiles(filteredFileArray);
    }
  };
  const handleDeleteAttachment = (e, type, id) => {
    deleteAttachment(id).then((res) => {
      if (res.status === 200) {
        loadAttachment();
      }
    });
  };
  const [panattachment, setPanAttachment] = useState();

  const uploadPanAttachmentHandler = (e, type, id = null) => {
    if (type === "UPLOAD") {
      var tempSelectedFile = [];
      for (var i = 0; i < e.target.files.length; i++) {
        tempSelectedFile.push({
          file: e.target.files[i],
          fileName: e.target.files[i].name,
          tempUrl: URL.createObjectURL(e.target.files[i]),
        });
      }
      setPanAttachment(tempSelectedFile);
    } else if (type === "DELETE") {
      gstInputRef.current.value = "";
      let filteredFileArray = panattachment.filter(
        (item, index) => id !== index
      );
      setPanAttachment(filteredFileArray);
    }
  };

  const [MSMEselectedFiles, setMSMESelectedFiles] = useState();
  const uploadMSMEAttachmentHandler = (e, type, id = null) => {
    if (type === "UPLOAD") {
      var tempSelectedFile1 = [];
      for (var i = 0; i < e.target.files.length; i++) {
        tempSelectedFile1.push({
          file: e.target.files[i],
          fileName: e.target.files[i].name,
          tempUrl: URL.createObjectURL(e.target.files[i]),
        });
      }
      setMSMESelectedFiles(tempSelectedFile1);
    } else if (type === "DELETE") {
      msmeInputRef.current.value = "";
      let filteredFileArray1 = MSMEselectedFiles.filter(
        (item, index) => id !== index
      );
      setMSMESelectedFiles(filteredFileArray1);
    }
  };

  const [passBookSelectedFiles, setPassBookSelectedFiles] = useState();
  const uploadPassBookAttachmentHandler = (e, type, id = null) => {
    if (type === "UPLOAD") {
      var tempSelectedFile1 = [];
      for (var i = 0; i < e.target.files.length; i++) {
        tempSelectedFile1.push({
          file: e.target.files[i],
          fileName: e.target.files[i].name,
          tempUrl: URL.createObjectURL(e.target.files[i]),
        });
      }
      setPassBookSelectedFiles(tempSelectedFile1);
    } else if (type === "DELETE") {
      msmeInputRef.current.value = "";
      let filteredFileArray1 = passBookSelectedFiles.filter(
        (item, index) => id !== index
      );
      setPassBookSelectedFiles(filteredFileArray1);
    }
  };

  const [chequeAttachmentSelectedFiles, setChequeAttachmentSelectedFiles] =
    useState();
  const uploadPassChequeAttachmentHandler = (e, type, id = null) => {
    if (type === "UPLOAD") {
      var tempSelectedFile1 = [];
      for (var i = 0; i < e.target.files.length; i++) {
        tempSelectedFile1.push({
          file: e.target.files[i],
          fileName: e.target.files[i].name,
          tempUrl: URL.createObjectURL(e.target.files[i]),
        });
      }
      setChequeAttachmentSelectedFiles(tempSelectedFile1);
    } else if (type === "DELETE") {
      chequeInputRef.current.value = "";
      let filteredFileArray1 = chequeAttachmentSelectedFiles.filter(
        (item, index) => id !== index
      );
      setChequeAttachmentSelectedFiles(filteredFileArray1);
    }
  };
  const [emailError, setEmailError] = useState(null);

  const [mailError, setMailError] = useState(false);
  const [bankNameError, setBankNameError] = useState("");

  const [inputState, setInputState] = useState({
    emailErr: "",
    VendorNameErr: "",
    AddressErr: "",
    PinCodeErr: "",
    AdharNumErr: "",
    PanNumberErr: "",
    GSTNumberErr: "",
    MSMENumberErr: "",
    BankNameErr: "",
    BranchNameErr: "",
    AccountNumberErr: "",
    ifscCodeErr: "",
    BeneficiaryErr: "",
    ERPAccErr: "",
    bankNameError: "",
    branchNameError: "",
    CardNumberError: "",
    RefNumberError: "",
  });

  const handleEmail = (e) => {
    const email = e.target.value;
    const emailRegex =
      /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    if (email === "") {
      setEmailError("");
      setMailError(false);
    } else if (emailRegex.test(email) === false) {
      setEmailError("Invalid Email");
      setMailError(true);
    } else {
      setEmailError("");
      setMailError(false);
    }
  };

  const [contactValid, setContactValid] = useState(false);

  const [contactNumber, setContactNumber] = useState(null);

  const url = `${_attachmentUrl}/${modal.modalData.pan_attachment}`;
  const fileName = url.split("/").pop();

  const handleContactValidation = (e) => {
    const contactValidation = e.target.value;

    if (contactValidation.length === 0) {
      setInputState({
        ...state,
        contactNoErr: "",
      });
      return;
    }
    if (
      contactValidation.charAt(0) == "9" ||
      contactValidation.charAt(0) == "8" ||
      contactValidation.charAt(0) == "7" ||
      contactValidation.charAt(0) == "6" ||
      contactValidation.charAt(0) == "4"
    ) {
      setInputState({ ...state, contactNoErr: "" });
      setContactValid(false);
    } else {
      setContactValid(true);
    }

    if (contactValidation.includes("000000000")) {
      setInputState({
        ...state,
        contactNoErr: "System not accepting 9 Consecutive Zeros here.",
      });
      setContactValid(true);
    }

    if (contactValidation.length < 10) {
      if (contactValidation.length === 0) {
        setInputState({
          ...state,
          contactNoErr: "please enter Mobile Number",
        });
        setContactValid(true);
      }
      setInputState({
        ...state,
        contactNoErr: "Invalid Mobile Number",
      });
      setContactValid(true);
    }

    if (contactValidation.length < 11) {
      setContactNumber(contactValidation);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
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
    if (e) {
      const a = city.filter((d) => d.state_id == e.value);
      setCityDropdown((prev) => null);
      setCityDropdown(a.map((d) => ({ value: d.id, label: d.city })));
    }
  };

  const validFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  const maxLengthCheck = (e, type) => {
    if (type == "ADHAR") {
      if (e.target.files.length > 2) {
        alert("You Can Upload Only 2 Attachments");
        document.getElementById("adhar_attachment").value = null;
      }
    }

    if (type == "PAN") {
      if (e.target.files.length > 2) {
        alert("You Can Upload Only 2 Attachments");
        document.getElementById("pan_attachment").value = null;
        setPanAttachment(null);
      }
    }

    if (type == "MSME") {
      if (e.target.files.length > 2) {
        alert("You Can Upload Only 2 Attachments");
        document.getElementById("msme_attachment").value = null;
        setMSMESelectedFiles(null);
      }
    }
    if (type == "GST") {
      if (e.target.files.length > 2) {
        alert("You Can Upload Only 2 Attachments");
        document.getElementById("gst_attachment").value = null;
        setSelectedFiles(null);
      }
    }
    if (type == "PASSBOOK") {
      if (e.target.files.length > 2) {
        alert("You Can Upload Only 2 Attachments");
        document.getElementById("bank_passbook_attachment").value = null;
        setPassBookSelectedFiles(null)
      }
    }

    if (type == "CHEQUE") {
      if (e.target.files.length > 2) {
        alert("You Can Upload Only 2 Attachments");
        document.getElementById("cheque_attachment").value = null;
        setChequeAttachmentSelectedFiles(null)
      }
    }
  };

  // Expandable Component to render attachments
  const ExpandedComponent = ({ data }) => (
    <pre>
      <Table style={{ width: "30%" }}>
        <thead>
          <tr>
            <th>Sr</th>
            <th>Attachment Name</th>
            <th>Acton</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td style={{ fontWeight: "bold" }}>Adhaar Attachment</td>

            {data.adhar_attachment ? (
              <td>
                <a
                  href={`${_attachmentUrl}/${data.adhar_attachment}`}
                  target="_blank"
                  className="btn btn-primary btn-sm p-1"
                >
                  <i
                    class="icofont-eye"
                    style={{ fontSize: "15px", height: "15px" }}
                  ></i>
                </a>
              </td>
            ) : (
              <p>NA</p>
            )}
          </tr>
          <tr>
            <td>2</td>
            <td style={{ fontWeight: "bold" }}>PAN Attachment</td>
            {data.pan_attachment ? (
              <td>
                <a
                  href={`${_attachmentUrl}/${data.pan_attachment}`}
                  target="_blank"
                  className="btn btn-primary btn-sm p-1"
                >
                  <i
                    class="icofont-eye"
                    style={{ fontSize: "15px", height: "15px" }}
                  ></i>
                </a>
              </td>
            ) : (
              <p>NA</p>
            )}
          </tr>
          <tr>
            <td>3</td>
            <td style={{ fontWeight: "bold" }}>GST Attachment</td>
            {data.gst_attachment ? (
              <td>
                <a
                  href={`${_attachmentUrl}/${data.gst_attachment}`}
                  target="_blank"
                  className="btn btn-primary btn-sm p-1"
                >
                  <i
                    class="icofont-eye"
                    style={{ fontSize: "15px", height: "15px" }}
                  ></i>
                </a>
              </td>
            ) : (
              <p>NA</p>
            )}
          </tr>
          <tr>
            <td>4</td>
            <td style={{ fontWeight: "bold" }}>MSME Attachment</td>

            {data.msme_attachment ? (
              <td>
                <a
                  href={`${_attachmentUrl}/${data.msme_attachment}`}
                  target="_blank"
                  className="btn btn-primary btn-sm p-1"
                >
                  <i
                    class="icofont-eye"
                    style={{ fontSize: "15px", height: "15px" }}
                  ></i>
                </a>
              </td>
            ) : (
              <p>NA</p>
            )}
          </tr>
          <tr>
            <td>5</td>
            <td style={{ fontWeight: "bold" }}>Pasbook Attachment</td>
            {data.bank_passbook_attachment ? (
              <td>
                <a
                  href={`${_attachmentUrl}/${data.bank_passbook_attachment}`}
                  target="_blank"
                  className="btn btn-primary btn-sm p-1"
                >
                  <i
                    class="icofont-eye"
                    style={{ fontSize: "15px", height: "15px" }}
                  ></i>
                </a>
              </td>
            ) : (
              <p>NA</p>
            )}
          </tr>
          <tr>
            <td>6</td>
            <td style={{ fontWeight: "bold" }}>Cheque Attachment</td>

            {data.cheque_attachment ? (
              <td>
                <a
                  href={`${_attachmentUrl}/${data.cheque_attachment}`}
                  target="_blank"
                  className="btn btn-primary btn-sm p-1"
                >
                  <i
                    class="icofont-eye"
                    style={{ fontSize: "15px", height: "15px" }}
                  ></i>
                </a>
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
    // const form = new FormData(e.target);
    await new VendorMasterService().downloadBulkFormat().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          URL = "http://3.108.206.34/2_Testing/TSNewBackend/" + res.data.data;
          window.open(URL, "_blank").focus();
        }
      }
    });
  };
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setError(null);
    await new VendorMasterService().bulkUploadVendor(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setNotify({ type: "success", message: res.data.message });
          handleBulkModal({ showModal: false });
          loadData();
        } else {
          setError({ type: "danger", message: res.data.message });
          URL = "http://3.108.206.34/2_Testing/TSNewBackend/" + res.data.data;
          window.open(URL, "_blank").focus();
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
                    handleModal({
                      showModal: true,
                      modalData: "",
                      modalHeader: "Add Vendor",
                    });
                    setMSMESelectedFiles(null);
                    setPassBookSelectedFiles(null);
                    setChequeAttachmentSelectedFiles(null);
                    setSelectedFiles(null);
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
                      modalData: "",
                      modalHeader: "Bulk Upload Vendor",
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
        <div className="card card-body">
          <div className="row">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search...."
                onClick={(e) => handleSearch(e)}
                onKeyDown={handleKeyDown}
                ref={searchRef}
              />
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-sm btn-warning text-white"
                type="button"
                onClick={handleSearch}
              >
                <i className="icofont-search-1 "></i> Search
              </button>
              <button
                className="btn btn-sm btn-info text-white"
                type="button"
                onClick={() => window.location.reload(false)}
              >
                <i className="icofont-refresh text-white"></i> Reset
              </button>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {data && (
                  <DataTable
                    columns={columns}
                    data={data}
                    defaultSortFieldId="id"
                    expandableRows={true}
                    pagination
                    expandableRowsComponent={ExpandedComponent}
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
              modalData: "",
              modalHeader: "",
            });
          }}
        >
          <form
            method="post"
            onSubmit={handleForm(modal.modalData ? modal.modalData.id : "")}
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
                        modal.modalData ? modal.modalData.vendor_name : ""
                      }
                      // onChange={(event) => {
                      //   const regex = new RegExp(
                      //     "^[a-zA-Z\\u0900-\\u097F ]+$" // allow English, numbers and Devanagari script
                      //   );
                      //   if (event.target.value === "") {
                      //     setInputState({
                      //       ...state,
                      //       VendorNameErr: "", // Clear the error message when the input is empty
                      //     });
                      //   } else if (event.target.value.length < 3) {
                      //     setInputState({
                      //       ...state,
                      //       VendorNameErr:
                      //         "Vendor Name should be at least 3 characters.",
                      //     });
                      //   } else if (!regex.test(event.target.value)) {
                      //     setInputState({
                      //       ...state,
                      //       VendorNameErr: "Invalid vendor Name.",
                      //     });
                      //   } else {
                      //     setInputState({
                      //       ...state,
                      //       VendorNameErr: "", // Clear the error message when the input is valid
                      //     });
                      //   }
                      // }}
                      required={true}
                    />
                    {/* {inputState.VendorNameErr && (
                      <small style={{ color: "red" }}>
                        {inputState.VendorNameErr}
                      </small>
                    )} */}
                  </div>
                  {modal.modalData && modal.modalData && (
                    <div className="col-md-3 mt-2">
                      <label className=" col-form-label">
                        <b>
                          Vendor ID : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {/* {data && ( */}
                      <input
                        type="text"
                        className="form-control form-control"
                        id="id"
                        name="id"
                        defaultValue={modal.modalData ? modal.modalData.id : ""}
                        required
                        disabled
                      />
                      {/* )} */}
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
                        modal.modalData ? modal.modalData.mobile_no : ""
                      }
                      onKeyPress={(e) => {
                        Validation.MobileNumbersOnly(e);
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: "red",
                        }}
                      >
                        {inputState.contactNoErr}
                      </small>
                    )}
                  </div>

                  <div className="col-sm-4">
                    <label className="form-label font-weight-bold">
                      Email Id :<Astrick color="red" size="13px" />
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      id="email"
                      name="email"
                      defaultValue={
                        modal.modalData ? modal.modalData.email : ""
                      }
                      // onChange={(e) => {
                      //   Validation.EmailOnly(e);
                      // }}
                      onChange={handleEmail}
                      onKeyPress={(e) => {
                        handleEmail(e);
                      }}
                      required={true}
                    />

                    {inputState && (
                      <small
                        style={{
                          color: "red",
                        }}
                      >
                        {emailError}
                      </small>
                    )}
                  </div>

                  {/* <div className="col-sm-4">
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          id="email_id"
                          name="email_id"
                          onChange={handleEmail}
                          placeholder="Please enter valid email address"
                          onKeyPress={(e) => {
                            handleEmail(e);
                          }}
                        />

                        {inputState && (
                          <small
                            style={{
                              color: "red",
                            }}
                          >
                            {emailError}
                          </small>
                        )}
                      </div> */}

                  <div className="col-sm-4">
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
                      // onKeyPress={(e) => {
                      //   Validation.addressFieldOnly(e);
                      // }}
                      // onKeyDown={(e) => {
                      //   if (e.key === "enter") {
                      //     e.preventDefault();
                      //   }
                      // }}
                      required={true}
                      defaultValue={
                        modal.modalData ? modal.modalData.address : ""
                      }
                      onChange={(event) => {
                        if (event.target.value === "") {
                          setInputState({
                            ...state,
                            AddressErr: "Address Required",
                          });
                        } else {
                          setInputState({ ...state, AddressErr: "" });
                        }
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: "red",
                        }}
                      >
                        {inputState.AddressErr}
                      </small>
                    )}
                  </div>

                  <div className="col-sm-2">
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
                                (d) => d.label == modal.modalData.country
                              )
                            : CountryDropdown.filter(
                                (d) =>
                                  d.value == parseInt(modal.modalData.country)
                              )
                        }
                        required={true}
                      />
                    ) : (
                      <p>...Loading</p>
                    )}
                  </div>

                  <div className="col-sm-2">
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

                  <div className="col-sm-2">
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

                  <div className="col-sm-2">
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
                        modal.modalData ? modal.modalData.pincode : ""
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

                        if (pincode === "") {
                          setInputState({
                            ...state,
                            PinCodeErr: "",
                          });
                        } else if (!pincodeRegex.test(pincode)) {
                          setInputState({
                            ...state,
                            PinCodeErr: " Enter a 6 digit pin code.",
                          });
                        } else {
                          setInputState({ ...state, PinCodeErr: "" });
                        }
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: "red",
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
                        modal.modalData ? modal.modalData.adhar_no : ""
                      }
                      // required={true}
                      // onKeyDown={(event) => {
                      //   if (
                      //     !(
                      //       event.keyCode === 8 ||
                      //       event.keyCode === 9 ||
                      //       event.keyCode === 27 ||
                      //       (event.keyCode >= 35 && event.keyCode <= 40) ||
                      //       (event.keyCode >= 48 && event.keyCode <= 57) ||
                      //       (event.keyCode >= 96 && event.keyCode <= 105)
                      //     )
                      //   ) {
                      //     event.preventDefault();
                      //   }
                      // }}
                      onChange={(event) => {
                        const aadharNum = event.target.value.trim();

                        if (aadharNum === "NA" || aadharNum === "na") {
                          // Allow "NA" case-insensitively
                          setInputState({
                            ...state,
                            AdharNumErr: "",
                          });
                        } else if (!aadharNum) {
                          setInputState({
                            ...state,
                            AdharNumErr: "",
                          });
                        } else if (/[^0-9]/.test(aadharNum)) {
                          setInputState({
                            ...state,
                            AdharNumErr:
                              "Aadhar number should contain digits only.",
                          });
                        } else if (aadharNum.length < 12) {
                          setInputState({
                            ...state,
                            AdharNumErr:
                              "Aadhar number should be 12 digits long.",
                          });
                        } else if (/0{5,}/.test(aadharNum)) {
                          setInputState({
                            ...state,
                            AdharNumErr:
                              "Aadhar number should not contain more than 4 consecutive zeros.",
                          });
                        } else if (/^[01]/.test(aadharNum)) {
                          setInputState({
                            ...state,
                            AdharNumErr:
                              "Aadhar number should not start with 0 or 1.",
                          });
                        } else {
                          setInputState({ ...state, AdharNumErr: "" });
                        }
                      }}
                    />

                    {inputState.AdharNumErr && (
                      <small style={{ color: "red" }}>
                        {inputState.AdharNumErr}
                      </small>
                    )}
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label">
                      <b>Aadhaar Attachment :</b>
                    </label>
                    {modal.modalData && modal.modalData.adhar_attachment && (
                      <a
                        href={`${_attachmentUrl}/${modal.modalData.adhar_attachment}`}
                        target="_blank"
                        downlaod
                        className="btn btn-info btn-sm  p-0"
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          console.log("selectedFile", selectedFile);

                          // Check if the file type is one of the allowed types
                          if (
                            selectedFile.type === "image/jpg" ||
                            selectedFile.type === "image/jpeg" ||
                            selectedFile.type === "image/png" ||
                            selectedFile.type === "application/pdf"
                          ) {
                            // File type is allowed
                          } else {
                            // Check if the file type is BMP
                            if (selectedFile.type === "image/bmp") {
                              alert(
                                "Invalid file format. BMP files are not allowed."
                              );
                            } else {
                              alert(
                                "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                              );
                            }
                            e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                          }

                          maxLengthCheck(e, "ADHAR");
                        }}
                      >
                        <i
                          class="icofont-download"
                          style={{ fontSize: "15px" }}
                        >
                          Download
                        </i>
                      </a>
                    )}
                    <input
                      type="file"
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      name="adhar_attachment"
                      id="adhar_attachment"
                      className="form-control"
                      ref={fileInputRef}
                      multiple
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        console.log("selectedFile", selectedFile);

                        // Check if the file type is one of the allowed types
                        if (
                          selectedFile.type === "image/jpg" ||
                          selectedFile.type === "image/jpeg" ||
                          selectedFile.type === "image/png" ||
                          selectedFile.type === "application/pdf"
                        ) {
                          // File type is allowed
                        } else {
                          // Check if the file type is BMP
                          if (selectedFile.type === "image/bmp") {
                            alert(
                              "Invalid file format. BMP files are not allowed."
                            );
                          } else {
                            alert(
                              "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                            );
                          }
                          e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                        }

                        maxLengthCheck(e, "ADHAR");
                      }}
                      capture="camera"
                    />
                  </div>

                  {/* <div className="col-sm-3 ">
                  <label className="form-label font-weight-bold">
                    PAN No :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="pan_no"
                    name="pan_no"
                    maxLength="10"
                    defaultValue={modal.modalData ? modal.modalData.pan_no : ""}
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersOnlyForPan(e);
                    }}
                    required={true}
                    onChange={(event) => {
                      if (event.target.value === "") {
                        setInputState({
                          ...state,
                          PanNumberErr: "Please enter Pancard number.",
                        });
                      } else {
                        setInputState({ ...state, PanNumberErr: "" });
                      }
                    }}
                  />
                  {inputState && (
                    <small
                      style={{
                        color: "red",
                      }}
                    >
                      {inputState.PanNumberErr}
                    </small>
                  )}
                </div> */}

                  {console.log(modal.modalData.pan_no)}

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
                        modal.modalData ? modal.modalData.pan_no : ""
                      }
                      required={true}
                      onChange={(event) => {
                        const panNumber = event.target.value.trim();
                        event.target.value = panNumber;

                        if (panNumber === "") {
                          setInputState({
                            ...state,
                            PanNumberErr: "",
                          });
                        } else if (panNumber === "NA") {
                          setInputState({
                            ...state,
                            PanNumberErr: "", // Clear error message for "NA"
                          });
                        } else if (panNumber.length !== 10) {
                          setInputState({
                            ...state,
                            PanNumberErr: "Invalid PAN number length.",
                          });
                        } else if (
                          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)
                        ) {
                          setInputState({
                            ...state,
                            PanNumberErr: "Invalid PAN number format.",
                          });
                        } else {
                          setInputState({ ...state, PanNumberErr: "" });
                        }
                      }}
                    />
                    {inputState.PanNumberErr && (
                      <small style={{ color: "red" }}>
                        {inputState.PanNumberErr}
                      </small>
                    )}
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label" htmlFor="attachment">
                      <b>
                        PAN Attachment :<Astrick color="red" size="13px" />
                      </b>
                      {modal.modalData && modal.modalData.pan_attachment && (
                        <a
                          href={`${_attachmentUrl}/${modal.modalData.pan_attachment}`}
                          target="_blank"
                          downlaod
                          // required={true}
                          className="btn btn-info btn-sm p-0"
                          accept="image/jpg,image/jpeg,image/png,application/pdf"
                          onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            console.log("selectedFile", selectedFile);

                            // Check if the file type is one of the allowed types
                            if (
                              selectedFile.type === "image/jpg" ||
                              selectedFile.type === "image/jpeg" ||
                              selectedFile.type === "image/png" ||
                              selectedFile.type === "application/pdf"
                            ) {
                              // File type is allowed
                            } else {
                              // Check if the file type is BMP
                              if (selectedFile.type === "image/bmp") {
                                alert(
                                  "Invalid file format. BMP files are not allowed."
                                );
                              } else {
                                alert(
                                  "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                                );
                              }
                              e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                            }

                            uploadPanAttachmentHandler(e, "UPLOAD", "");
                            maxLengthCheck(e, "PAN");
                          }}
                        >
                          <i
                            class="icofont-download"
                            style={{ fontSize: "15px" }}
                          >
                            Download
                          </i>
                          <p>{modal.modalData._attachmentUrl}</p>
                        </a>
                      )}
                    </label>
                    <input
                      href={`${_attachmentUrl}/${modal.modalData.pan_attachment}`}
                      type="file"
                      name="pan_attachment"
                      id="pan_attachment"
                      multiple={true}
                      required={modal.modalData.pan_attachment ? false : true}
                      className="form-control"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        console.log("selectedFile", selectedFile);

                        // Check if the file type is one of the allowed types
                        if (
                          selectedFile.type === "image/jpg" ||
                          selectedFile.type === "image/jpeg" ||
                          selectedFile.type === "image/png" ||
                          selectedFile.type === "application/pdf"
                        ) {
                          // File type is allowed
                        } else {
                          // Check if the file type is BMP
                          if (selectedFile.type === "image/bmp") {
                            alert(
                              "Invalid file format. BMP files are not allowed."
                            );
                          } else {
                            alert(
                              "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                            );
                          }
                          e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                        }

                        uploadPanAttachmentHandler(e, "UPLOAD", "");
                        maxLengthCheck(e, "PAN");
                      }}
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      ref={fileInputRef}
                      capture="camera"
                    />
                  </div>

                  {panattachment &&
                    panattachment.map((attachment, index) => {
                      return (
                        <div
                          key={index}
                          className="justify-content-end"
                          style={{
                            marginRight: "20px",
                            padding: "5px",
                            maxWidth: "250px",
                          }}
                        >
                          <div
                            className="card"
                            style={{ backgroundColor: "#EBF5FB" }}
                          >
                            <div className="card-header">
                              <span>{attachment.fileName}</span>
                              {/* <img
                              src={attachment.tempUrl}
                              style={{ height: "100%", width: "100%" }}
                            />{" "}
                            * */}
                              <div className="d-flex justify-content-between p-0 mt-1">
                                <a
                                  href={`${attachment.tempUrl}`}
                                  target="_blank"
                                  className="btn btn-warning btn-sm p-0 px-1"
                                >
                                  <i class="icofont-ui-zoom-out"></i>
                                </a>
                                <button
                                  className="btn btn-danger text-white btn-sm p-1"
                                  type="button"
                                  onClick={(e) => {
                                    uploadPanAttachmentHandler(
                                      e,
                                      "DELETE",
                                      index
                                    );
                                  }}
                                >
                                  <i
                                    class="icofont-ui-delete"
                                    style={{ fontSize: "15px" }}
                                  ></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

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
                        modal.modalData ? modal.modalData.gst_no : ""
                      }
                      // onKeyPress={(e) => {
                      //   Validation.GSTNumberOnly(e);
                      // }}
                      // required={true}
                      onChange={(event) => {
                        event.target.value = event.target.value.toUpperCase();
                        const gstNumber = event.target.value;
                        const gstNumberRegex =
                          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;

                        if (!gstNumber) {
                          setInputState({
                            ...state,
                            GSTNumberErr: "",
                          });
                        } else if (gstNumber === "NA") {
                          setInputState({
                            ...state,
                            GSTNumberErr: "",
                          });
                        } else if (gstNumber.length !== 15) {
                          setInputState({
                            ...state,
                            GSTNumberErr:
                              "GST number should be 15 characters long.",
                          });
                        } else if (!gstNumberRegex.test(gstNumber)) {
                          setInputState({
                            ...state,
                            GSTNumberErr: "Invalid GST number format.",
                          });
                        } else {
                          setInputState({ ...state, GSTNumberErr: "" });
                        }
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: "red",
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
                    {modal.modalData && modal.modalData.gst_attachment && (
                      <a
                        href={`${_attachmentUrl}/${modal.modalData.gst_attachment}`}
                        target="_blank"
                        downlaod
                        className="btn btn-info btn-sm p-0"
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          console.log("selectedFile", selectedFile);

                          // Check if the file type is one of the allowed types
                          if (
                            selectedFile.type === "image/jpg" ||
                            selectedFile.type === "image/jpeg" ||
                            selectedFile.type === "image/png" ||
                            selectedFile.type === "application/pdf"
                          ) {
                            // File type is allowed
                          } else {
                            // Check if the file type is BMP
                            if (selectedFile.type === "image/bmp") {
                              alert(
                                "Invalid file format. BMP files are not allowed."
                              );
                            } else {
                              alert(
                                "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                              );
                            }
                            e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                          }

                          uploadAttachmentHandler(e, "UPLOAD", "");
                          maxLengthCheck(e, "GST");
                        }}
                      >
                        <i
                          class="icofont-download"
                          style={{ fontSize: "15px" }}
                        >
                          Download
                        </i>
                      </a>
                    )}
                    <input
                      type="file"
                      name="gst_attachment"
                      id="gst_attachment"
                      multiple={true}
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      className="form-control"
                      ref={gstInputRef}
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        console.log("selectedFile", selectedFile);

                        // Check if the file type is one of the allowed types
                        if (
                          selectedFile.type === "image/jpg" ||
                          selectedFile.type === "image/jpeg" ||
                          selectedFile.type === "image/png" ||
                          selectedFile.type === "application/pdf"
                        ) {
                          // File type is allowed
                        } else {
                          // Check if the file type is BMP
                          if (selectedFile.type === "image/bmp") {
                            alert(
                              "Invalid file format. BMP files are not allowed."
                            );
                          } else {
                            alert(
                              "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                            );
                          }
                          e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                        }

                        uploadAttachmentHandler(e, "UPLOAD", "");
                        maxLengthCheck(e, "GST");
                      }}
                    />

                    {/* <div className="d-flex"> */}
                    {selectedFiles &&
                      selectedFiles.map((attachment, index) => {
                        return (
                          <div
                            key={index}
                            className="justify-content-end"
                            style={{
                              marginRight: "20px",
                              padding: "5px",
                              maxWidth: "250px",
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: "#EBF5FB" }}
                            >
                              <div className="card-header">
                                <span>{attachment.fileName}</span>
                                {/* <img
                              src={attachment.tempUrl}
                              style={{ height: "100%", width: "100%" }}
                            />{" "}
                            * */}
                                <div className="d-flex justify-content-between p-0 mt-1">
                                  <a
                                    href={`${attachment.tempUrl}`}
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i class="icofont-ui-zoom-out"></i>
                                  </a>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-1"
                                    type="button"
                                    onClick={(e) => {
                                      uploadAttachmentHandler(
                                        e,
                                        "DELETE",
                                        index
                                      );
                                    }}
                                  >
                                    <i
                                      class="icofont-ui-delete"
                                      style={{ fontSize: "15px" }}
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
                        modal.modalData ? modal.modalData.msme_no : ""
                      }
                      // onKeyPress={e=>validateNumber(e)}
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
                            MSMENumberErr: "",
                          });
                        } else 
if (msmeNo.length < 19) {
                          setInputState({
                            ...state,
                            MSMENumberErr: "Invalid MSME No.",
                          });
                        } else if (
                          /^([A-Za-z]{5}\d{2}[A-Za-z0-9]{1,2}\d{7})|^(\d{20})$/.test(
                            msmeNo
                          )
                        ) {
                          setInputState({
                            ...state,
                            MSMENumberErr: "Invalid MSME No.",
                          });
                        } else if (
                          !/^([A-Za-z]{5}\d{2}\d{2}\d{7})|^(\d{19})$/.test(
                            msmeNo
                          )
                        ) {
                          setInputState({
                            ...state,
                            MSMENumberErr: "Invalid Udyam No.",
                          });
                        } else {
                          setInputState({
                            ...state,
                            MSMENumberErr: "",
                          });
                        }
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: "red",
                        }}
                      >
                        {inputState.MSMENumberErr}
                      </small>
                    )}
                  </div>

                  {/* <div className="col-sm-3">
                    <label className="form-label font-weight-bold">
                      MSME No:
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="msme_no"
                      name="msme_no"
                      maxLength={12}
                      ref={fileInputRef}
                      // value={Panuppercase && Panuppercase ? Panuppercase : ""}
                      defaultValue={
                        modal.modalData ? modal.modalData.msme_no : ""
                      }
                      onKeyPress={(e) => {
                        if (!/^([A-Za-z0-9]{1})$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        const msmeNo = event.target.value

                        if (msmeNo.toLowerCase() === "na") {
                          msmeNo = "NA"; // Convert "na" to "NA"
                        
                        // if (msmeNo === "NA") {
                        //   setInputState({
                        //     ...state,
                        //     MSMENumberErr: " ",
                        //   });
                        // } else if (
                          msmeNo.length === 12 ||
                          msmeNo.length === 19
                        }
                         {
                          // Check for 12 or 19 zeros
                          if (/^0+$/.test(msmeNo)) {
                            setInputState({
                              ...state,
                              MSMENumberErr: "Invalid MSME No.",
                            });
                          } else {
                            setInputState({
                              ...state,
                              MSMENumberErr: "",
                            });
                          }
                        } else if (msmeNo.length < 19) {
                          setInputState({
                            ...state,
                            MSMENumberErr: "Invalid MSME No.",
                          });
                        } else if (
                          /^([A-Za-z]{5}\d{2}[A-Za-z0-9]{1,2}\d{7})|^(\d{20})$/.test(
                            msmeNo
                          )
                        ) {
                          setInputState({
                            ...state,
                            MSMENumberErr: "Invalid MSME No.",
                          });
                        } else if (
                          !/^([A-Za-z]{5}\d{2}\d{2}\d{7})|^(\d{19})$/.test(
                            msmeNo
                          )
                        ) {
                          setInputState({
                            ...state,
                            MSMENumberErr: "Invalid Udyam No.",
                          });
                        } else {
                          setInputState({
                            ...state,
                            MSMENumberErr: "",
                          });
                        }
                      }}
                    />
                    {inputState.MSMENumberErr && (
                      <small style={{ color: "red" }}>
                        {inputState.MSMENumberErr}
                      </small>
                    )}
                  </div> */}

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label" htmlFor="msme_attachment">
                      <b> MSME Attachment : </b>
                    </label>
                    {modal.modalData && modal.modalData.msme_attachment && (
                      <a
                        href={`${_attachmentUrl}/${modal.modalData.msme_attachment}`}
                        target="_blank"
                        downlaod
                        multiple
                        className="btn btn-info btn-sm p-0"
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          console.log("selectedFile", selectedFile);

                          // Check if the file type is one of the allowed types
                          if (
                            selectedFile.type === "image/jpg" ||
                            selectedFile.type === "image/jpeg" ||
                            selectedFile.type === "image/png" ||
                            selectedFile.type === "application/pdf"
                          ) {
                            // File type is allowed
                          } else {
                            // Check if the file type is BMP
                            if (selectedFile.type === "image/bmp") {
                              alert(
                                "Invalid file format. BMP files are not allowed."
                              );
                            } else {
                              alert(
                                "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                              );
                            }
                            e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                          }

                          uploadMSMEAttachmentHandler(e, "UPLOAD", "");
                          maxLengthCheck(e, "MSME");
                        }}
                      >
                        <i
                          class="icofont-download"
                          style={{ fontSize: "15px" }}
                        >
                          Download
                        </i>
                      </a>
                    )}
                    <input
                      type="file"
                      name="msme_attachment"
                      id="msme_attachment"
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      className="form-control"
                      ref={msmeInputRef}
                      multiple={true}
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        console.log("selectedFile", selectedFile);

                        // Check if the file type is one of the allowed types
                        if (
                          selectedFile.type === "image/jpg" ||
                          selectedFile.type === "image/jpeg" ||
                          selectedFile.type === "image/png" ||
                          selectedFile.type === "application/pdf"
                        ) {
                          // File type is allowed
                        } else {
                          // Check if the file type is BMP
                          if (selectedFile.type === "image/bmp") {
                            alert(
                              "Invalid file format. BMP files are not allowed."
                            );
                          } else {
                            alert(
                              "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                            );
                          }
                          e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                        }

                        uploadMSMEAttachmentHandler(e, "UPLOAD", "");
                        maxLengthCheck(e, "MSME");
                      }}
                    />
                    {/* 
                  <p style={{ fontSize: "10px" }}>
                    {" "}
                    Note :-Accept only png, jpeg, jpp and pdf file.
                  </p> */}

                    <div className="d-flex">
                      {MSMEselectedFiles &&
                        MSMEselectedFiles.map((attachment, index) => {
                          return (
                            <div
                              key={index}
                              className="justify-content-start"
                              style={{
                                marginRight: "20px",
                                padding: "5px",
                                maxWidth: "250px",
                              }}
                            >
                              <div
                                className="card"
                                style={{ backgroundColor: "#EBF5FB" }}
                              >
                                <div className="card-header">
                                  <span>{attachment.fileName}</span>
                                  {/* <img
                                src={attachment.tempUrl}
                                style={{ height: "100%", width: "100%" }}
                              />{" "} */}
                                  *
                                  <div className="d-flex justify-content-between p-0 mt-1">
                                    <a
                                      href={`${attachment.tempUrl}`}
                                      target="_blank"
                                      className="btn btn-warning btn-sm p-0 px-1"
                                    >
                                      <i class="icofont-ui-zoom-out"></i>
                                    </a>
                                    <button
                                      className="btn btn-danger text-white btn-sm p-1"
                                      type="button"
                                      onClick={(e) => {
                                        uploadMSMEAttachmentHandler(
                                          e,
                                          "DELETE",
                                          index
                                        );
                                      }}
                                    >
                                      <i
                                        class="icofont-ui-delete"
                                        style={{ fontSize: "15px" }}
                                      ></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="col-sm-3 mt-3">
                    <label className="form-label font-weight-bold">
                      Bank Name :<Astrick color="red" size="13px" />
                    </label>
                    {modal.modalData && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
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
                          modal.modalData ? modal.modalData.bank_name : ""
                        }
                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === "") {
                            setInputState({
                              bankNameError: "",
                            });
                          } else if (
                            !value.match(
                              /^[A-Za-z\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                            )
                          ) {
                            setInputState({
                              bankNameError: "Invalid Bank Name",
                            });
                          } else if (value.length > 50) {
                            setInputState({
                              bankNameError:
                                "Bank name can be up to 50 characters long.",
                            });
                          } else {
                            setInputState("");
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
                          if (value === "") {
                            setInputState({
                              bankNameError: "",
                            });
                          } else if (
                            !value.match(
                              /^[A-Za-z\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                            )
                          ) {
                            setInputState({
                              bankNameError: "Invalid Bank Name",
                            });
                          } else if (value.length > 50) {
                            setInputState({
                              bankNameError:
                                "Bank name can be up to 50 characters long.",
                            });
                          } else {
                            setInputState("");
                          }
                        }}
                      />
                    )}
                    {inputState.bankNameError && (
                      <small style={{ color: "red" }}>
                        {inputState.bankNameError}
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
                        // readOnly={
                        //   deta && deta.Bank_Details == false ? true : false
                        // }
                        defaultValue={
                          modal.modalData
                            ? modal.modalData.bank_branch_name
                            : ""
                        }
                        // onKeyPress={(e) => {
                        //   Validation.CharactersNumbersSpeicalOnly(e);
                        // }}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === "") {
                            setInputState({
                              branchNameError: "",
                            });
                          } else if (
                            !value.match(
                              /^[A-Za-z0-9\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                            )
                          ) {
                            setInputState({
                              branchNameError: "Invalid Branch Name",
                            });
                          } else if (value.length > 25) {
                            setInputState({
                              branchNameError:
                                "Bank name can be up to 50 characters long.",
                            });
                          } else {
                            setInputState("");
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
                        // onKeyPress={(e) => {
                        //   Validation.CharactersNumbersSpeicalOnly(e);
                        // }}
onKeyPress={(e) => {
                          Validation.CharacterWithSpace(e);
                        }}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === "") {
                            setInputState({
                              branchNameError: "",
                            });
                          } else if (
                            !value.match(
                              /^[A-Za-z0-9\s\-&@#$%^*()_+={}[\]:;"'<>,.?/|]+$/
                            )
                          ) {
                            setInputState({
                              branchNameError: "Invalid Branch Name",
                            });
                          } else if (value.length > 25) {
                            setInputState({
                              branchNameError:
                                "Bank name can be up to 50 characters long.",
                            });
                          } else {
                            setInputState("");
                          }
                        }}
                        required={true}
                      />
                    )}
                    {inputState.branchNameError && (
                      <small style={{ color: "red" }}>
                        {inputState.branchNameError}
                      </small>
                    )}
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
                          modal.modalData ? modal.modalData.account_no : ""
                        }
                        onKeyPress={(e) => {
                          Validation.CardNumbersOnly(e);
                        }}
                        onChange={(event) => {
                          const inputVal = event.target.value;
                          const regex = /^[a-zA-Z0-9]{1,25}$|^NA$/; // Allow alphanumeric or "NA" with a maximum length of 25 characters
                          if (inputVal === "") {
                            setInputState({
                              ...state,
                              AccountNumberErr: "",
                            });
                          } else if (inputVal === "NA") {
                            setInputState({
                              ...state,
                              AccountNumberErr: "",
                            });
                          } else if (inputVal.length < 10) {
                            setInputState({
                              ...state,
                              AccountNumberErr: "invalid account Number",
                            });
                          } else if (!regex.test(inputVal)) {
                            setInputState({
                              ...state,
                              AccountNumberErr:
                                "Account Number should be alphanumeric and maximum length should be 25 characters.",
                            });
                          } else {
                            setInputState({ ...state, AccountNumberErr: "" });
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
                          if (inputVal === "") {
                            setInputState({
                              ...state,
                              AccountNumberErr: "",
                            });
                          } else if (inputVal === "NA") {
                            setInputState({
                              ...state,
                              AccountNumberErr: "",
                            });
                          } else if (inputVal.length < 10) {
                            setInputState({
                              ...state,
                              AccountNumberErr: "invalid Acc Number",
                            });
                          } else if (!regex.test(inputVal)) {
                            setInputState({
                              ...state,
                              AccountNumberErr: "Invalid Account Number.",
                            });
                          } else {
                            setInputState({ ...state, AccountNumberErr: "" });
                          }
                        }}
                        required={true}
                        maxLength="25"
                      />
                    )}

                    {inputState && (
                      <small
                        style={{
                          color: "red",
                        }}
                      >
                        {inputState.AccountNumberErr}
                      </small>
                    )}
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
                        // value={
                        //   ifscodeUppercase && ifscodeUppercase
                        //     ? ifscodeUppercase
                        //     : ""
                        // }

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
                          if (inputVal === "") {
                            setInputState({
                              ...state,
                              ifscCodeErr: "",
                            });
                          } else if (inputVal === "NA") {
                            setInputState({
                              ...state,
                              ifscCodeErr: "",
                            });
                          } else if (!regex.test(inputVal)) {
                            setInputState({
                              ...state,
                              ifscCodeErr: "Invalid IFSC  Number.",
                            });
                          } else {
                            setInputState({ ...state, ifscCodeErr: "" });
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
                            : ""
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
                          if (inputVal === "" || inputVal === "NA") {
                            setInputState({
                              ...state,
                              ifscCodeErr: "",
                            });
                          } else if (inputVal === "NA") {
                            setInputState({
                              ...state,
                              ifscCodeErr: "",
                            });
                          } else if (!regex.test(inputVal)) {
                            setInputState({
                              ...state,
                              ifscCodeErr: "Invalid  IFSC Code.",
                            });
                          } else {
                            setInputState({ ...state, ifscCodeErr: "" });
                          }
                        }}
                      />
                    )}
                    {inputState && (
                      <small
                        style={{
                          color: "red",
                        }}
                      >
                        {inputState.ifscCodeErr}
                      </small>
                    )}
                  </div>

                  <div className="col-sm-3 mt-4">
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
                            : ""
                        }
                        onChange={(event) => {
                          const enteredValue = event.target.value;
                          const regex = /^[A-Za-z ]*$/; // regex to allow only letters, numbers, and spaces

                          if (enteredValue === "") {
                            setInputState({
                              ...state,
                              BeneficiaryErr: "",
                            });
                          } else if (!regex.test(enteredValue)) {
                            // check if entered value matches the regex
                            setInputState({
                              ...state,
                              BeneficiaryErr: "Invalid name",
                            });
                          } else {
                            setInputState({ ...state, BeneficiaryErr: "" });
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

                          if (enteredValue === "") {
                            setInputState({
                              ...state,
                              BeneficiaryErr: "",
                            });
                          } else if (!regex.test(enteredValue)) {
                            setInputState({
                              ...state,
                              BeneficiaryErr: "Invalid name.",
                            });
                          } else {
                            setInputState({ ...state, BeneficiaryErr: "" });
                          }
                        }}
                      />
                    )}

                    {inputState && (
                      <small
                        style={{
                          color: "red",
                        }}
                      >
                        {inputState.BeneficiaryErr}
                      </small>
                    )}
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label" htmlFor="attachment">
                      <b>Passbook Attachment :</b>
                    </label>

                    {modal.modalData &&
                      modal.modalData.bank_passbook_attachment && (
                        <a
                          href={`${_attachmentUrl}/${modal.modalData.bank_passbook_attachment}`}
                          target="_blank"
                          downlaod
                          multiple={true}
                          className="btn btn-info btn-sm p-0"
                          accept="image/jpg,image/jpeg,image/png,application/pdf"
                          onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            console.log("selectedFile", selectedFile);

                            // Check if the file type is one of the allowed types
                            if (
                              selectedFile.type === "image/jpg" ||
                              selectedFile.type === "image/jpeg" ||
                              selectedFile.type === "image/png" ||
                              selectedFile.type === "application/pdf"
                            ) {
                              // File type is allowed
                            } else {
                              // Check if the file type is BMP
                              if (selectedFile.type === "image/bmp") {
                                alert(
                                  "Invalid file format. BMP files are not allowed."
                                );
                              } else {
                                alert(
                                  "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                                );
                              }
                              e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                            }
                            uploadPassBookAttachmentHandler(e, "UPLOAD", "");
                            maxLengthCheck(e, "PASSBOOK");
                          }}
                          // onClick={(e)=>{if(userSessionData&&userSessionData.Edit_Vendor_Master_Bank_Details==="false"){
                          //   e.preventDefault()
                          // }}}

                          // disabled={userSessionData&&userSessionData.Edit_Vendor_Master_Bank_Details==="false"?true:false}
                        >
                          <i
                            className="icofont-download"
                            style={{ fontSize: "15px" }}
                          >
                            Download
                          </i>
                        </a>
                      )}
                    {modal.modalData && (
                      <input
                        type="file"
                        name="bank_passbook_attachment"
                        id="bank_passbook_attachment"
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                        ref={fileInputRef}
                        multiple={true}
                        disabled={
                          authorities &&
                          authorities.Edit_Vendor_Master_Bank_Details === false
                            ? true
                            : false
                        }
                       
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          console.log("selectedFile", selectedFile);

                          // Check if the file type is one of the allowed types
                          if (
                            selectedFile.type === "image/jpg" ||
                            selectedFile.type === "image/jpeg" ||
                            selectedFile.type === "image/png" ||
                            selectedFile.type === "application/pdf"
                          ) {
                            // File type is allowed
                          } else {
                            // Check if the file type is BMP
                            if (selectedFile.type === "image/bmp") {
                              alert(
                                "Invalid file format. BMP files are not allowed."
                              );
                            } else {
                              alert(
                                "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                              );
                            }
                            e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                          }
                          uploadPassBookAttachmentHandler(e, "UPLOAD", "");
                          maxLengthCheck(e, "PASSBOOK");
                        }}
                        // disabled={
                        //   deta && deta.Bank_Details == false ? true : false
                        // }
                        className="form-control"
                      />
                    )}

                    {!modal.modalData && (
                      <input
                        type="file"
                        name="bank_passbook_attachment"
                        id="bank_passbook_attachment"
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                        className="form-control"
                        multiple={true}
                        ref={passbookInputRef}
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          console.log("selectedFile", selectedFile);

                          // Check if the file type is one of the allowed types
                          if (
                            selectedFile.type === "image/jpg" ||
                            selectedFile.type === "image/jpeg" ||
                            selectedFile.type === "image/png" ||
                            selectedFile.type === "application/pdf"
                          ) {
                            // File type is allowed
                          } else {
                            // Check if the file type is BMP
                            if (selectedFile.type === "image/bmp") {
                              alert(
                                "Invalid file format. BMP files are not allowed."
                              );
                            } else {
                              alert(
                                "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                              );
                            }
                            e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                          }
                          uploadPassBookAttachmentHandler(e, "UPLOAD", "");
                          maxLengthCheck(e, "PASSBOOK");
                        }}
                      />
                    )}

                    {/* <div className="d-flex"> */}
                    {passBookSelectedFiles &&
                      passBookSelectedFiles.map((attachment, index) => {
                        return (
                          <div
                            key={index}
                            className="justify-content-start"
                            style={{
                              marginRight: "20px",
                              padding: "5px",
                              maxWidth: "250px",
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: "#EBF5FB" }}
                            >
                              <div className="card-header">
                                <span>{attachment.fileName}</span>
                                {/* <img
                                src={attachment.tempUrl}
                                style={{ height: "100%", width: "100%" }}
                              />{" "} */}
                                *
                                <div className="d-flex justify-content-between p-0 mt-1">
                                  <a
                                    href={`${attachment.tempUrl}`}
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i class="icofont-ui-zoom-out"></i>
                                  </a>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-1"
                                    type="button"
                                    onClick={(e) => {
                                      uploadPassBookAttachmentHandler(
                                        e,
                                        "DELETE",
                                        index
                                      );
                                    }}
                                  >
                                    <i
                                      class="icofont-ui-delete"
                                      style={{ fontSize: "15px" }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {/* </div> */}
                    {/* <p style={{ fontSize: "12px" }}>
                    {" "}
                    Note :-Accept only png, jpeg, jpp and pdf file.
                  </p> */}
                  </div>

                  <div className=" col-sm-3 mt-2">
                    <label className="col-form-label">
                      <b>Cheque Attachment :</b>
                    </label>
                    {modal.modalData && modal.modalData.cheque_attachment && (
                      <a
                        href={`${_attachmentUrl}/${modal.modalData.cheque_attachment}`}
                        target="_blank"
                        downlaod
                        className="btn btn-info btn-sm p-0"
                        ref={fileInputRef}
                        multiple={true}
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          console.log("selectedFile", selectedFile);

                          // Check if the file type is one of the allowed types
                          if (
                            selectedFile.type === "image/jpg" ||
                            selectedFile.type === "image/jpeg" ||
                            selectedFile.type === "image/png" ||
                            selectedFile.type === "application/pdf"
                          ) {
                            // File type is allowed
                          } else {
                            // Check if the file type is BMP
                            if (selectedFile.type === "image/bmp") {
                              alert(
                                "Invalid file format. BMP files are not allowed."
                              );
                            } else {
                              alert(
                                "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                              );
                            }
                            e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                          }
                          uploadPassChequeAttachmentHandler(e, "UPLOAD", "");
                          maxLengthCheck(e, "CHEQUE");
                        }}
                      >
                        <i
                          class="icofont-download"
                          style={{ fontSize: "15px" }}
                        >
                          Download
                        </i>
                      </a>
                    )}
                    {modal.modalData && (
                      <input
                        type="file"
                        name="cheque_attachment"
                        ref={chequeInputRef}
                        id="cheque_attachment"
                        multiple={true}
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                        disabled={
                          authorities &&
                          authorities.Edit_Vendor_Master_Bank_Details === false
                            ? true
                            : false
                        }
                        
                        className="form-control"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          console.log("selectedFile", selectedFile);

                          // Check if the file type is one of the allowed types
                          if (
                            selectedFile.type === "image/jpg" ||
                            selectedFile.type === "image/jpeg" ||
                            selectedFile.type === "image/png" ||
                            selectedFile.type === "application/pdf"
                          ) {
                            // File type is allowed
                          } else {
                            // Check if the file type is BMP
                            if (selectedFile.type === "image/bmp") {
                              alert(
                                "Invalid file format. BMP files are not allowed."
                              );
                            } else {
                              alert(
                                "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                              );
                            }
                            e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                          }
                          uploadPassChequeAttachmentHandler(e, "UPLOAD", "");
                          maxLengthCheck(e, "CHEQUE");
                        }}
                      />
                    )}
                    {!modal.modalData && (
                      <input
                        type="file"
                        name="cheque_attachment"
                        id="cheque_attachment"
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                        className="form-control"
                        ref={chequeInputRef}
                        multiple={true}
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          console.log("selectedFile", selectedFile);

                          // Check if the file type is one of the allowed types
                          if (
                            selectedFile.type === "image/jpg" ||
                            selectedFile.type === "image/jpeg" ||
                            selectedFile.type === "image/png" ||
                            selectedFile.type === "application/pdf"
                          ) {
                            // File type is allowed
                          } else {
                            // Check if the file type is BMP
                            if (selectedFile.type === "image/bmp") {
                              alert(
                                "Invalid file format. BMP files are not allowed."
                              );
                            } else {
                              alert(
                                "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                              );
                            }
                            e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                          }
                          uploadPassChequeAttachmentHandler(e, "UPLOAD", "");
                          maxLengthCheck(e, "CHEQUE");
                        }}
                      />
                    )}

                    {/* <div className="d-flex"> */}
                    {chequeAttachmentSelectedFiles &&
                      chequeAttachmentSelectedFiles.map((attachment, index) => {
                        return (
                          <div
                            key={index}
                            // className="justify-content-start"
                            style={{
                              // marginRight: "20px",
                              // padding: "5px",
                              maxWidth: "200px",
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: "#EBF5FB" }}
                            >
                              <div className="card-header">
                                <span>{attachment.fileName}</span>
                                {/* <img
                              src={attachment.tempUrl}
                              style={{ height: "100%", width: "100%" }}
                            />{" "}
                            * */}
                                *
                                <div className="d-flex justify-content-between p-0 mt-1">
                                  <a
                                    href={`${attachment.tempUrl}`}
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i class="icofont-ui-zoom-out"></i>
                                  </a>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-1"
                                    type="button"
                                    onClick={(e) => {
                                      uploadPassChequeAttachmentHandler(
                                        e,
                                        "DELETE",
                                        index
                                      );
                                    }}
                                  >
                                    <i
                                      class="icofont-ui-delete"
                                      style={{ fontSize: "15px" }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {/* </div> */}

                  <div className="col-sm-3 ">
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
                  </div>

                  <div className="col-sm-3 mt-4">
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
                        authorities &&
                        authorities.Update_ERP_Account_Name === false
                          ? true
                          : false
                      }
                      // readOnly={
                      //   deta && deta.Update_ACME_Account_Name == false
                      //     ? true
                      //     : false
                      // }
                      defaultValue={
                        modal.modalData ? modal.modalData.acme_account_name : ""
                      }
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersSpeicalOnly(e);
                      }}
                      onChange={(event) => {
                        if (event.target.value === "") {
                          setInputState({
                            ...state,
                            ERPAccErr: "Please enter ERP Acc Name",
                          });
                        } else {
                          setInputState({ ...state, ERPAccErr: "" });
                        }
                      }}
                    />
                    {inputState && (
                      <small
                        style={{
                          color: "red",
                        }}
                      >
                        {inputState.ERPAccErr}
                      </small>
                    )}
                  </div>
                  {/* {console.log("d",modal.modalData.consider_in_payment)}
                  {modal.modalData.consider_in_payment === "YES" && consider && consider === "YES" ? ( */}
                  {/* <div className="col-sm-3 mt-4">
                      <label className="form-label font-weight-bold">
                        Template :<Astrick color="red" size="13px" />
                      </label>

                      {paymentDropdown && (
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
                      )}
                    </div> */}
                  {/* ) : null} */}

                  {consider === "YES" && paymentDropdown && (
                    <div className="col-sm-3 mt-4">
                      <label className="form-label font-weight-bold">
                        Template :<Astrick color="red" size="13px" />
                      </label>

                      {/* Show the Select component only if consider is "YES" */}

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

                  {consider && consider === "PETTY_CASH" && considerInPay && (
                    <div className="col-sm-3 mt-4">
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
                          modal.modalData ? modal.modalData.card_number : ""
                        }
                        onKeyPress={(e) => {
                          Validation.CardNumbersOnly(e);
                        }}
                        onChange={(event) => {
                          if (event.target.value === "") {
                            setInputState({
                              ...state,
                              CardNumberError: "",
                            });
                          } else if (event.target.value === "NA") {
                            setInputState({
                              ...state,
                              CardNumberError: "",
                            });
                          } else if (event.target.value.length < 16) {
                            setInputState({
                              ...state,
                              CardNumberError:
                                "Card Number Should be 16 characters",
                            });
                          } else {
                            setInputState({
                              ...state,
                              CardNumberError: "", // Clear the error if the length is 16 or greater
                            });
                          }
                        }}
                        // onChange={(event) => {
                        //   if (event.target.value === "") {
                        //     setInputState({
                        //       ...state,
                        //       CardNumberError: "",
                        //     });
                        //   } else if (event.target.value < 16) {
                        //     setInputState({
                        //       ...state,
                        //       CardNumberError: "Card Number Should be  16 length",
                        //     });
                        //   }

                        //   else {
                        //     setInputState({
                        //       ...state,
                        //       CardNumberError: "", // Clear the error if the length is 16
                        //     });
                        //   }
                        // }}
                      />
                      {inputState.CardNumberError && (
                        <div className="text-danger">
                          {inputState.CardNumberError}
                        </div>
                      )}
                    </div>
                  )}
                  {consider && consider === "PETTY_CASH" && considerInPay && (
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
                        // required={true}
                        defaultValue={
                          modal.modalData
                            ? modal.modalData.reference_number
                            : ""
                        }
                        onChange={(event) => {
                          if (event.target.value === "") {
                            setInputState({
                              ...state,
                              RefNumberError: "",
                            });
                          } else if (event.target.value === "NA") {
                            setInputState({
                              ...state,
                              RefNumberError: "",
                            });
                          } else if (event.target.value.length < 10) {
                            setInputState({
                              ...state,
                              RefNumberError:
                                "Ref Number Should be 25 characters",
                            });
                          } else {
                            setInputState({
                              ...state,
                              RefNumberError: "", // Clear the error if the length is 16 or greater
                            });
                          }
                        }}
                        // onKeyPress={(e) => {
                        //   Validation.RefNumbersSpecialAlphanumeric(e);
                        // }}
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
                  {consider && consider === "PETTY_CASH" && considerInPay && (
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
                          modal.modalData ? modal.modalData.narration : ""
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

                  {/* <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Status :<Astrick color="red" size="13px" /></label>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active_1"
                                                    value="1"
                                                    defaultChecked={(modal.modalData && modal.modalData.is_active === 1) ? true : ((!modal.modalData) ? true : false)}
                                                />
                                                <label className="form-check-label" htmlFor="is_active_1">
                                                    Active
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active_0" value="0"
                                                    readOnly={(modal.modalData) ? false : true}
                                                    defaultChecked={(modal.modalData && modal.modalData.is_active === 0) ? true : false}
                                                />
                                                <label className="form-check-label" htmlFor="is_active_0">
                                                    Deactive
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {!modal.modalData && (
                <button
                  type="submit"
                  className="btn btn-primary text-white"
                  style={{ backgroundColor: "#484C7F" }}
                >
                  Save
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
                  handleModal({
                    showModal: false,
                    modalData: "",
                    modalHeader: "",
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
              modalData: "",
              modalHeader: "",
            });
          }}
        >
          {" "}
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
                style={{ backgroundColor: "#484C7F" }}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-danger text-white"
                onClick={() => {
                  handleBulkModal({
                    showModal: false,
                    modalData: "",
                    modalHeader: "",
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
