import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ErrorLogService from "../../../services/ErrorLogService";

import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import { _base, userSessionData } from "../../../settings/constants";
import Select from "react-select";
import DropdownService from "../../../services/Bill Checking/Bill Checking Transaction/DropdownService";
import BillTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";

import DepartmentService from "../../../services/MastersService/DepartmentService";
import UserService from "../../../services/MastersService/UserService";

import {
  getAttachment,
  deleteAttachment,
} from "../../../services/OtherService/AttachmentService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import {
  DropdownComponent,
  ReactSelectComponent,
} from "../../../components/Utilities/Button/Button";
import axios from "axios";

const secretKey = "rushikesh";

export default function CreateBillCheckingTransaction({ match }) {
  var section = 0;
  const { id } = useParams();
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const [ip, setIp] = useState("");
  const [statusValue, setStatusValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Asynchronously fetch data
        const res = await axios.get("https://api.ipify.org/?format=json");
        setIp(res.data.ip);
      } catch (error) {
        // Handle errors if needed
        console.error("Error fetching data:", error);
      }
    };

    // Call the async function immediately
    fetchData();

    // Dependency array remains empty if the effect doesn't depend on any props or state
  }, []);

  const history = useNavigate();

  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const [dependent, setDependent] = useState({
    country_id: null,
    state_id: null,
  });

  const [billType, setBillType] = useState(null);
  const [billTypeDropdown, setBillTypeDropdown] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [vendorDropdown, setVendorDropdown] = useState(null);
  const [department, setDepartment] = useState(null);
  const [departmentDropdown, setDepartmentDropdown] = useState(null);
  const [cityDropdown, setCityDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [userDropdown, setUserDropdown] = useState(null);

  const [constitution, setConstitution] = useState();
  const [constitutionDropdown, setConstitutionDropdown] = useState();

  const [sectionDropdown, setSectionDropdown] = useState();
  const [tdsPercentage, setTdsPercentage] = useState();

  const [billAmount, setBillAmount] = useState(null);
  const [billAmount1, setBillAmount1] = useState(null);

  const [netPayment, setNetPayment] = useState(null);

  const [tdsAmount, setTdsAmount] = useState(0);

  const [tdsData, setTdsData] = useState(null);

  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);

  const handleModal = (data) => {
    setModal(data);
  };
  const handleImageClick = (e) => {
    setModal({ showModal: true, modalData: "", modalHeader: "" });
  };

  const sectionRef = useRef();
  const tdsPercentageRef = useRef();

  const handleTdsChange = (e) => {
    setTdsData([e.target.value]);
  };
  const [showTdsFileds, setShowTdsFileds] = useState(false);
  const handleTdsApplicable = (e) => {
    if (e.target.checked === true) {
      setShowTdsFileds(true);
    } else {
      setShowTdsFileds(false);
      if (sectionRef.current.commonProps.value != null) {
        sectionRef.current.clearValue();
      }
      setTdsPercentage(0);
      setTdsAmount(0);
    }
  };

  const pastFinancialYear = (e) => {
    const date = new Date(`04/31/${new Date().getFullYear() - 1}`);
  };

  

  const [debit, setDebit] = useState();
  const [taxable, setTaxable] = useState();
  const [gst, setGst] = useState();
  const [roundOff, setRoundOff] = useState();
  const [tcs, setTcs] = useState();
  const [tds, setTds] = useState();
  const [tdsPercent, setTdsPercent] = useState();
  const [showFiles, setShowFiles] = useState([]);
  const [attachment, setAttachment] = useState();
  const [authorities, SetAuthorities] = useState();
  const [netPaymentError, setNetPaymentError] = useState();

  const [inputState, setInputState] = useState({
    debitAdvanceErr: "",
    taxableAmountErr: "",
    igstErr: "",
    tcsErr: "",
  });

  const [debitAdvanceErr, setDebitAdvanceErr] = useState(null);
  const [taxableAmountErr, setTaxableAmountErr] = useState(null);
  const [igstErr, setIgstErr] = useState(null);
  const [tcsErr, setTcsErr] = useState(null);
  const [td, setTD] = useState(null);

  // const handleDebitAdvance = (e) => {
  //   const debitValue = e.target.value;
  //   if (debitValue === "") {
  //     setDebitAdvanceErr("Debit Advance Is Required");
  //   } else {
  //     setDebitAdvanceErr("");
  //   }
  // };
  const handleTaxable = (e) => {
    const taxableValue = e.target.value;
    if (taxableValue === "") {
      setTaxableAmountErr("Taxable Amount Is Required");
    } else {
      setTaxableAmountErr("");
    }
    let input = e.target.value;
    // Remove any non-numeric or decimal point characters
    input = input.replace(/[^0-9.]/g, "");
    // Check if the input has more than one dot
    if ((input.match(/\./g) || []).length > 1) {
      // If so, remove all dots after the first one
      input = input.replace(/\.(?=.*\.)/g, "");
    }
    // Check if the input has more than 2 decimal places
    if (input.indexOf(".") !== -1 && input.split(".")[1].length > 2) {
      // If so, round the input to 2 decimal places
      input = parseFloat(input).toFixed(2);
    }
    e.target.value = input;
    setTaxable(input);
  };
  const handleGst = (e) => {
    const igstValue = e.target.value;
    if (igstValue === "") {
      setIgstErr("IGST/GST Amount Is Required");
    } else {
      setIgstErr("");
    }
    let input = e.target.value;
    // Remove any non-numeric or decimal point characters
    input = input.replace(/[^0-9.]/g, "");
    // Check if the input has more than one dot
    if ((input.match(/\./g) || []).length > 1) {
      // If so, remove all dots after the first one
      input = input.replace(/\.(?=.*\.)/g, "");
    }
    // Check if the input has more than 2 decimal places
    if (input.indexOf(".") !== -1 && input.split(".")[1].length > 2) {
      // If so, round the input to 2 decimal places
      input = parseFloat(input).toFixed(2);
    }
    e.target.value = input;
    setGst(input);
  };
  const handleRoundOff = (e) => {
    let input = e.target.value;
    // Remove any non-numeric, decimal point, or negative sign characters
    input = input.replace(/[^0-9.-]/g, "");
    // Check if the input has more than one dot
    if ((input.match(/\./g) || []).length > 1) {
      // If so, remove all dots after the first one
      input = input.replace(/\.(?=.*\.)/g, "");
    }
    // Check if the input has more than 2 decimal places
    if (input.indexOf(".") !== -1 && input.split(".")[1].length > 2) {
      // If so, round the input to 2 decimal places
      input = parseFloat(input).toFixed(2);
    }
    // Check if the input has more than one negative sign
    if ((input.match(/-/g) || []).length > 1) {
      // If so, remove all negative signs after the first one
      input = input.replace(/-(?=.*-)/g, "");
    }
    e.target.value = input;
    setRoundOff(input);
  };
  const handleTcs = (e) => {
    const tcsValue = e.target.value;
    if (tcsValue === "") {
      setTcsErr("TCS Amount Is Required");
    } else {
      setTcsErr("");
    }
    let input = e.target.value;
    // Remove any non-numeric or decimal point characters
    input = input.replace(/[^0-9.]/g, "");
    // Check if the input has more than one dot
    if ((input.match(/\./g) || []).length > 1) {
      // If so, remove all dots after the first one
      input = input.replace(/\.(?=.*\.)/g, "");
    }
    // Check if the input has more than 2 decimal places
    if (input.indexOf(".") !== -1 && input.split(".")[1].length > 2) {
      // If so, round the input to 2 decimal places
      input = parseFloat(input).toFixed(2);
    }
    e.target.value = input;
    setTcs(input);
  };

  const handleTds = (e) => {
    if (e) {
      let input = e.target.value;
      // Remove any non-numeric or decimal point characters
      input = input.replace(/[^0-9.]/g, "");
      // Check if the input has more than one dot
      if ((input.match(/\./g) || []).length > 1) {
        // If so, remove all dots after the first one
        input = input.replace(/\.(?=.*\.)/g, "");
      }
      // Check if the input has more than 2 decimal places
      if (input.indexOf(".") !== -1 && input.split(".")[1].length > 2) {
        // If so, round the input to 2 decimal places
        input = parseFloat(input).toFixed(2);
      }
      e.target.value = input;
      setTdsPercent(input);
    }
  };
  const handleDebit = (e) => {
    const debitValue = e.target.value;
    if (debitValue === "") {
      setDebitAdvanceErr("Debit Advance Is Required");
    } else {
      setDebitAdvanceErr("");
    }
    let input = e.target.value;
    // Remove any non-numeric or decimal point characters
    input = input.replace(/[^0-9.]/g, "");
    // Check if the input has more than one dot
    if ((input.match(/\./g) || []).length > 1) {
      // If so, remove all dots after the first one
      input = input.replace(/\.(?=.*\.)/g, "");
    }
    // Check if the input has more than 2 decimal places
    if (input.indexOf(".") !== -1 && input.split(".")[1].length > 2) {
      // If so, round the input to 2 decimal places
      input = parseFloat(input).toFixed(2);
    }
    e.target.value = input;
    setDebit(input);
  };

  const handleTdsPercentage = (e) => {
    if (e.value) {
      const selectedContition = constitution.filter((d) => d.id === e.value);
      setTdsPercentage(selectedContition[0].percentage);
    }
  };

  const selectTdsPercentageRef = useRef();
  const selecttdsAmountRef = useRef();

  const handleSectionDropDownChange = async (e) => {
    await new BillTransactionService()
      .getSectionMappingDropdown(e.value)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setTdsPercentage(0)
            // setConstitutionDropdown(null);
            setConstitution(res.data.data);
            setConstitutionDropdown(
              res.data.data.map((d) => ({
                value: d.id,
                label: d.constitution_name,
              }))
            );
          }
          if (selecttdsAmountRef.current.value != null) {
            document.getElementById("tds_amount").value = "";
          }
          if (selectTdsPercentageRef.current.value != null) {
            document.getElementById("tds_percentage").value = "";
          }

         
        }
      });
  };

  const handleTDSSectionChange = (e) => {
    // Clear the userDropdown state
    setConstitutionDropdown(null);
    if (selecttdsAmountRef.current.value != null) {
      document.getElementById("tds_amount").value = "";
    }
    if (selectTdsPercentageRef.current.value != null) {
      document.getElementById("tds_percentage").value = "";
    }
  };

  const handleSectionDropDownChange1 = async (section) => {
    await new BillTransactionService()
      .getSectionMappingDropdown(section)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            // setConstitutionDropdown(null);
            setConstitution(res.data.data);
            setConstitutionDropdown(
              res.data.data.map((d) => ({
                value: d.id,
                label: d.constitution_name,
              }))
            );
          }
        }
      });
  };

  const [assignTo, setAssignTo] = useState();
  const [assignToDropdown, setAssignToDropdown] = useState();
  const handleAssignToPerson = async (e) => {
    await new DropdownService().getMappedEmp(e.value).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setAssignTo(res.data.data);
          setUserDropdown(null);
          setUserDropdown(
            res.data.data.map((d) => ({ value: d.id, label: d.employee_name }))
          );
        }
      }
    });
  };

  const handleBillTypeChange = (e) => {
    // Clear the userDropdown state
    setUserDropdown(null);
  };

  const loadData = async () => {
    await new BillTransactionService().getBillCheckingById(id).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setData(res.data.data);
          setIsTcsApplicable(
            res.data.data.is_tcs_applicable == 1 ? true : false
          );
          handleSectionDropDownChange1(res.data.data.tds_section);
          if (res.data.data.is_tds_applicable == 1) {
            setShowTdsFileds(true);
          }
        }
      }
    });
    await new BillTransactionService().getUpdatedAuthorities().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          SetAuthorities(res.data.data);
        }
      }
    });

    await new BillTransactionService()
      ._getBillTypeDataDropdown()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setBillType(res.data.data);
            setBillTypeDropdown(
              res.data.data.map((d) => ({ value: d.id, label: d.bill_type }))
            );
          }
        }
      });

    await new BillTransactionService().getVendorsDropdown().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setVendor(res.data.data);
          setVendorDropdown(
            res.data.data.map((d) => ({
              value: d.id,
              label: d.vendor_name,
            }))
          );
        }
      }
    });

    await new DepartmentService().getDepartment().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setDepartment(res.data.data);
          setDepartmentDropdown(
            res.data.data.map((d) => ({ value: d.id, label: d.department }))
          );
        }
      }
    });

    const inputRequired =
      "id,employee_id,first_name,last_name,middle_name,is_active";
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setUser(res.data.data);
          setUserDropdown(
            res.data.data.map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name,
            }))
          );
        }
      }
    });

    await new BillTransactionService().getSectionDropdown().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setSectionDropdown(
            res.data.data.map((d) => ({ value: d.id, label: d.section_name }))
          );
        }
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

  const RecordRoomUserDropdown = [
    // Add the static option "Record room"
    { value: "record_room", label: "Record room" },
  ];
  const handleStatus = (e, type) => {
    setStatusValue(type);
  };
  const handleForm = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setNotify(null);
    form.delete("attachment[]");

    if (selectedFiles) {
      for (var i = 0; i < selectedFiles.length; i++) {
        form.append("attachment[" + i + "]", selectedFiles[i].file);
      }
    }

    if (statusValue !== null) {
      if (statusValue === 1) {
        form.append("status", 1);
      } else if (statusValue === 2) {
        form.append("status", 2);
      }
    }

    // console.log("isigst",document.getElementById('is_igst_applicable').value)
    if (document.getElementById("is_igst_applicable").checked) {
      form.append("is_igst_applicable", 1);
    } else {
      form.append("is_igst_applicable", 0);
    }
    if (document.getElementById("is_tds_applicable").checked) {
      form.append("is_tds_applicable", 1);
    } else {
      form.append("is_tds_applicable", 0);
    }

    if (document.getElementById("is_tcs_applicable").checked) {
      form.append("is_tcs_applicable", 1);
    } else {
      form.append("is_tcs_applicable", 0);
    }

    if (document.getElementById("is_original_bill_needed").checked) {
      form.append("is_original_bill_needed", 1);
    } else {
      form.append("is_original_bill_needed", 0);
    }

    if (document.getElementById("authorized_by_hod").checked) {
      form.append("authorized_by_hod", 1);
    } else {
      form.append("authorized_by_hod", 0);
    }

    if (document.getElementById("authorized_by_management").checked) {
      form.append("authorized_by_management", 1);
    } else {
      form.append("authorized_by_management", 0);
    }
    form.append("client_ip_address", ip);
    // form.append("is_igst_applicable", (igst === true && data && data.is_igst_applicable === 1) ? 1 : 0);
    // form.append("is_tcs_applicable", isTcsApplicable === true ? 1 : 0);

    await new BillTransactionService()
      .updateBillChecking(id, form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            history(
              {
                pathname: `/${_base}/BillCheckingTransaction`,
              },
              {
                state: {
                  alert: { type: "success", message: res.data.message },
                },
              }
            );
            setNotify({ type: "success", message: res.data.message });
            loadData();
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          setNotify({ type: "danger", message: res.data.message });
          new ErrorLogService().sendErrorLog(
            "Payment_template",
            "Create_Payment_template",
            "INSERT",
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: "danger", message: "Request Error !!!" });
        new ErrorLogService().sendErrorLog(
          "Payment_template",
          "Create_Payment_template",
          "INSERT",
          errorObject.data.message
        );
      });
  };

  const fileInputRef = useRef(null);

  const date = new Date();
  const futureDate = date.getDate();
  date.setDate(futureDate);
  const defaultValue = date.toLocaleDateString("en-CA");
  const loadAttachment = async () => {
    setNotify(null);
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

  const [selectedFiles, setSelectedFiles] = useState([]);

  const validFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  // const uploadAttachmentHandler = (e, type, id = null) => {
  //   if (type === "UPLOAD") {
  //     var tempSelectedFile = [];
  //     for (var i = 0; i < e.target.files.length; i++) {
  //       tempSelectedFile.push({
  //         file: e.target.files[i],
  //         fileName: e.target.files[i].name,
  //         tempUrl: URL.createObjectURL(e.target.files[i]),
  //       });
  //     }
  //     setSelectedFiles(tempSelectedFile);
  //   } else if (type === "DELETE") {
  //     fileInputRef.current.value = "";
  //     let filteredFileArray = selectedFiles.filter(
  //       (item, index) => id !== index
  //     );
  //     setSelectedFiles(filteredFileArray);
  //   }
  // };

  const uploadAttachmentHandler = (e, type, id = null) => {
    if (type === "UPLOAD") {
      var tempSelectedFile = [...selectedFiles]; // Create a copy of the existing files
      var totalSize = 0; // Initialize total size

      // Calculate the total size of all files in tempSelectedFile
      for (var i = 0; i < tempSelectedFile.length; i++) {
        totalSize += tempSelectedFile[i].file.size;
      }

      // Check if the total size of all files does not exceed 5MB
      for (var i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const fileType = file.type;
        const fileSize = file.size; // Get the file size in bytes

        // Check if the file type is valid (PNG, JPG, JPEG, or PDF)
        if (validFileTypes.includes(fileType)) {
          // Check if the total size of all files is less than or equal to 5MB
          if (totalSize + fileSize <= 5 * 1024 * 1024) {
            tempSelectedFile.push({
              file: file,
              fileName: file.name,
              tempUrl: URL.createObjectURL(file),
            });

            totalSize += fileSize; // Update the total size
          } else {
            // Handle the case where the total size exceeds 5MB (e.g., show an error message)
            alert("Total file size exceeds 5MB. Please select smaller files.");
            break; // Stop processing more files
          }
        } else {
          // Handle the case where an invalid file type is selected (e.g., show an error message)
          alert(
            "Invalid file type. Please select PNG, JPG, JPEG, or PDF files."
          );
        }
      }
      // Check if the maximum 10 attachments condition is met

      if (tempSelectedFile?.length + data?.attachment?.length <= 10) {
        fileInputRef.current.value = "";
        setSelectedFiles(tempSelectedFile);
      } else {
        alert("You can only upload a maximum of 10 attachments.");
      }
    } else if (type === "DELETE") {
      let filteredFileArray = selectedFiles.filter(
        (item, index) => id !== index
      );
      setSelectedFiles(filteredFileArray);
    }
    e.target.value = ""; // Reset the input field
  };

  // maximum length check for attachments
  const maxLengthCheck = (e) => {
    if (e.target.files.length > 10) {
      alert("You Can Upload Only 10 Attachments");
      document.getElementById("attachment").value = null;
      setSelectedFiles(null);
    }
  };
  const handleDeleteAttachment = (e, id) => {
    deleteAttachment(id).then((res) => {
      if (res.status === 200) {
        loadAttachment();
        loadData();
      }
    });
  };
  const [igst, setIgst] = useState(false);
  const handleIgst = (e) => {
    setIgst(e.target.checked);
    if (e.target.checked) {
      setIgst(e.target.checked === true);
    } else {
      setIgst((e.target.checked = false));
    }
  };

  const [isTcsApplicable, setIsTcsApplicable] = useState(null);
  const [authorizedByHod, SetauthorizedByHod] = useState(false);
  const [authorizedByManagement, setAuthorizedByManagement] = useState(false);
  const [isoriginalbillneeded, SetIsOriginalBillNeeded] = useState(false);

  // const handleTcsApplicable = (e) => {
  //   setIsTcsApplicable(e.target.checked);
  //   if (e.target.checked) {
  //     setIsTcsApplicable(e.target.checked === true);
  //   } else {
  //     setIsTcsApplicable((e.target.checked = false));
  //   }
  //   const newValue = e.target.checked;

  //   // Update the local state
  //   // setIgst(newValue);
  // };

  const handleTcsApplicable = (e) => {
    const newValue = e.target.checked;
    setIsTcsApplicable(newValue);
  };

  const handleAuthorizedByHod = (e) => {
    SetauthorizedByHod(e.target.checked);
  };

  const handleAuthorizedByManagement = (e) => {
    setAuthorizedByManagement(e.target.checked);
  };

  const handleOriginalBillNeeded = (e) => {
    SetIsOriginalBillNeeded(e.target.checked);
  };

  const currentDate = new Date();
  const oneYearAgo = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  // const currentDateee = new Date();
  // const formattedDate = currentDateee.toISOString().slice(0, 10); // YYYY-MM-DD

  const formattedOneYearAgo = `${oneYearAgo.getFullYear()}-${(
    oneYearAgo.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${oneYearAgo.getDate().toString().padStart(2, "0")}`;

  // var temp=res.data.data;
  // var billAmount=0;
  //     billAmount = parseFloat(temp.taxable_amount) + parseFloat(temp.gst_amount) + parseFloat(temp.round_off) + parseFloat(temp.tcs)
  //     var netPayment = 0;
  //     netPayment = parseFloat(billAmount) - parseFloat(temp.debit_advance);

  //     if (temp.is_tds_applicable!=0)
  //     {
  //         var tdsAmount = (parseFloat(temp.taxable_amount) * parseFloat(temp.tds_percentage))/ 100;
  //         setTdsAmount(Math.ceil(tdsAmount));
  //         if (tdsAmount > 0) {
  //             netPayment = netPayment - parseFloat(Math.ceil(tdsAmount))
  //             setNetPayment(Math.round(netPayment));
  //         }
  //     }
  //     document.getElementById("net_payment").value = Math.round(netPayment)
  //     setNetPayment(Math.round(netPayment));

  //    setBillAmount(parseFloat(billAmount).toFixed(2))

  useEffect(() => {
    var tdsAmount = 0;

    if (data) {
      var billAmount =
        parseFloat(document.getElementById("taxable_amount").value) +
        parseFloat(document.getElementById("gst_amount").value) +
        parseFloat(document.getElementById("round_off").value) +
        parseFloat(document.getElementById("tcs").value);

      var billAmount1 =
        parseFloat(document.getElementById("taxable_amount").value) +
        parseFloat(document.getElementById("gst_amount").value) +
        parseFloat(document.getElementById("round_off").value);

      var netPayment = 0;
      if (isTcsApplicable === true) {
        netPayment =
          parseFloat(billAmount) -
          parseFloat(document.getElementById("debit_advance").value);
      } else {
        netPayment =
          parseFloat(billAmount1) -
          parseFloat(document.getElementById("debit_advance").value);
      }

      setNetPayment(Math.round(netPayment));

      if (document.getElementById("is_tds_applicable").checked) {
        tdsAmount =
          (parseFloat(document.getElementById("taxable_amount").value) *
            parseFloat(document.getElementById("tds_percentage").value)) /
          100;
        setTdsAmount(Math.ceil(tdsAmount));
        if (tdsAmount > 0) {
          netPayment = netPayment - parseFloat(Math.ceil(tdsAmount));
          setNetPayment(Math.round(netPayment));
        }
      }

      document.getElementById("net_payment").value = Math.round(netPayment);
      setNetPayment(Math.round(netPayment));
      if (billAmount != 0) {
        setBillAmount(billAmount.toFixed(2));
        setBillAmount1(billAmount1.toFixed(2));
      }
    }
    if (netPayment < 0) {
      setNetPaymentError("Net bill payment should be positive value");
    } else {
      setNetPaymentError(null); // or setNetPaymentError(""); depending on your preference
    }
    return () => {};
  }, [
    billAmount,
    billAmount1,
    taxable,
    gst,
    roundOff,
    tcs,
    tdsPercentage,
    debit,
    tdsAmount,
    netPayment,
    isTcsApplicable,
  ]);

  // console.log("bill amount1",billAmount1&&billAmount1)
  // console.log("bill amount",billAmount&&billAmount)
  // console.log("tcs",document?.getElementById("tcs")?.value)

  // console.log("tcs99",tcs&&tcs.length)

  // console.log("debit advance",parseFloat(document.getElementById("debit_advance").value))
  // console.log("tds amount",tdsAmount)

  useEffect(() => {
    if (checkRole && checkRole[45].can_update === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
    return () => {};
  }, [checkRole]);

  useEffect(() => {
    loadData();
    return () => {};
  }, []);

  // Get the current date
  const currentDatee = new Date();

  // Calculate the start date of the current financial year (April 1 of the current year)
  //  const startFinancialYear = new Date(currentDatee.getFullYear() -1, 3, 1); // Month is zero-based (3 for April)

  // Calculate the end date of the current financial year (March 31 of the next year)
  const endFinancialYear = new Date(currentDatee.getFullYear(), 2, 31); // Month is zero-based (2 for March)

  const startFinancialYear = new Date(currentDate.getFullYear() - 1, 3, 1);

  const startPastYear = startFinancialYear.getFullYear() - 1;
  const startYear = startFinancialYear.getFullYear();

  const startMonth = String(startFinancialYear.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
  const startDay = String(startFinancialYear.getDate()).padStart(2, "0");

  const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;
  const formattedStartPastDate = `${startPastYear}-${startMonth}-${startDay}`;

  const endYear = endFinancialYear.getFullYear();
  const endMonth = String(endFinancialYear.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
  const endDay = String(endFinancialYear.getDate()).padStart(2, "0");

  // const formattedEndDate = endFinancialYear.toISOString().split('T')[0];
  const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  let recordRoom = userDropdown && userDropdown.filter((d) => d.value === 692);


  return (
    <div className="container-xxl">
      {/* {data && JSON.stringify(data)} */}
      {notify && <Alert alertData={notify} />}
      {/* {data && JSON.stringify(data)} */}

      <PageHeader />

      <div className="row clearfix g-3">
        {data && (
          <div className="col-sm-12">
            <form method="POST" onSubmit={(e) => handleForm(e)}>
              {/* ********* MAIN DATA ********* */}
              <div className="card mt-2">
                <div className="card-header bg-primary text-white p-2">
                  <h5>Edit Data</h5>
                </div>

                <div className="card-body">
                  <div className="form-group row ">
                    <div className="col-md-3">
                      <label className=" col-form-label">
                        <b>
                          Bill ID : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {billTypeDropdown && (
                        <input
                          type="text"
                          className="form-control form-control"
                          id="id"
                          name="id"
                          placeholder="Bill Id"
                          defaultValue={data.bc_id}
                          required
                          readOnly
                        />
                      )}
                    </div>
                    <input
                      type="hidden"
                      name="approver_id"
                      value={userSessionData.userId}
                    />
                    <input
                      type="hidden"
                      name="level"
                      value={data && data.level}
                    />

                    {/* <div className="col-md-3">
                      <label className=" col-form-label">
                        <b>
                          Bill Type : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {billTypeDropdown && (
                        <Select
                          type="text"
                          className="form-control form-control"
                          options={billTypeDropdown}
                          onChange={handleAssignToPerson}
                          defaultValue={
                            data &&
                            billTypeDropdown.filter(
                              (d) => d.value == data.bill_type
                            )
                          }
                          id="bill_type"
                          name="bill_type"
                          placeholder="Bill Type"
                          required
                          isDisabled={data.is_active == 0 ? true : false}
                        />
                      )}
                    </div>

                    {data.is_active == 0 ?
                      <div className="col-md-3">
                        <label className="col-form-label">
                          <b>
                            Assign To : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                   
                   
                        {userDropdown && data ? (
                          <Select
                            type="text"
                            className="form-control form-control-sm"
                            id="assign_to"
                            options={RecordRoomUserDropdown}
                            name="assign_to"
                            placeholder="Assign To"
                            required
                            defaultValue={userDropdown.filter(
                              (d) => d.value == data.assign_to
                            )}
                          />
                        ) : (
                          <p>Loading....</p>
                        )}
                      </div>
                      : <div className="col-md-3">
                        <label className="col-form-label">
                          <b>
                            Assign To : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                       
                       
                        {userDropdown && data ? (
                          <Select
                            type="text"
                            className="form-control form-control-sm"
                            id="assign_to"
                            options={userDropdown}
                            name="assign_to"
                            placeholder="Assign To"
                            required
                            defaultValue={userDropdown.filter(
                              (d) => d.value == data.assign_to
                            )}
                          />
                        ) : (
                          <p>Loading....</p>
                        )}
                      </div>
                    } */}

                    <div className="col-md-3">
                      <input
                        type="hidden"
                        name="bill_type"
                        value={data && data.bill_type}
                      />

                      <label className=" col-form-label">
                        <b>
                          Bill Type : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {billTypeDropdown && (
                        <Select
                          type="text"
                          className="form-control form-control"
                          options={billTypeDropdown}
                          // onChange={handleAssignToPerson}
                          onChange={(e) => {
                            handleAssignToPerson(e);
                            handleBillTypeChange(e); // Call the function to clear the assign to field
                          }}
                          defaultValue={
                            data &&
                            billTypeDropdown.filter(
                              (d) => d.value == data.bill_type
                            )
                          }
                          id="bill_type"
                          name="bill_type"
                          placeholder="Bill Type"
                          isDisabled
                          // isDisabled={
                          //   authorities && authorities.All_Update_Bill === true
                          //     ? false
                          //     : true
                          // }

                          // isDisabled={data.is_active == 0 || data.is_assign_to == 0 ? true : false}
                        />
                      )}
                    </div>

                    <>
                      <div className="col-md-3">
                        {/* {data && data.is_assign_to == 0 && ( */}
                        <input
                          type="hidden"
                          name="assign_to"
                          value={data && data.assign_to}
                        />
                        {/* )} */}

                        <label className="col-form-label">
                          <b>
                            Assign To : <Astrick color="red" size="13px" />
                          </b>
                        </label>

                        {userDropdown && data ? (
                          <Select
                            type="text"
                            className="form-control form-control-sm"
                            id="assign_to"
                            options={userDropdown}
                            name="assign_to"
                            placeholder="Assign To"
                            required
                            isDisabled
                            defaultValue={userDropdown.filter(
                              (d) => d.value == data.assign_to
                            )}
                          />
                        ) : (
                          <p>Loading....</p>
                        )}
                      </div>
                    </>

                    <div className="col-md-3">
                      <label className="col-form-label">
                        <b>
                          Vendor Name : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {data && vendorDropdown && (
                        <Select
                          className="form-control form-control-sm"
                          id="vendor_name"
                          name="vendor_name"
                          options={vendorDropdown}
                          isDisabled={
                            authorities && authorities.Edit_In_Bill === false
                              ? true
                              : false
                          }
                          // isDisabled={
                          //   data && data.access.Update_Bill == false
                          //     ? true
                          //     : false
                          // }
                          required
                          defaultValue={
                            data &&
                            vendorDropdown.filter(
                              (d) => d.value == data.vendor_name
                            )
                          }
                        />
                      )}
                    </div>
                    {/* <div className="col-md-3 ">
                                        <label className="col-md-4 col-form-label">
                                            <b>Branch Name : <Astrick color="red" size="13px" /></b>
                                        </label>
                                        {departmentDropdown &&
                                            <Select className="form-control form-control-sm"
                                                id="department_name"
                                                name="department_name"
                                                options={departmentDropdown}
                                            // placeholder="Branch Name"
                                            // required

                                            />
                                        }
                                    </div> */}
                  </div>
                

                  <div className="form-group row mt-3">
                    {/* <div className="col-md-3">
                                    <label className=" col-form-label">
                                        <b>Expected Bill Received Date : <Astrick color="red" size="13px" /></b>
                                    </label>
                                    <input type="date" className="form-control form-control-sm"
                                        id="expected_bill_received_date"
                                        name="expected_bill_received_date"
                                        // placeholder="Bill Type"
                                        // required
                                        onKeyPress={e => { Validation.CharactersOnly(e) }}
                                    />
                                    </div> */}

                    <div className="col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          Vendor Bill No : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="vendor_bill_no"
                        name="vendor_bill_no"
                        required
                        readOnly={
                          authorities && authorities.Edit_In_Bill === false
                            ? true
                            : false
                        }
                        maxLength={25}
                        onKeyPress={(e) => {
                          Validation.CharactersNumbersSpeicalOnly(e);
                        }}
                        defaultValue={data.vendor_bill_no}
                      />
                    </div>

                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Bill Date: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        id="bill_date"
                        name="bill_date"
                        // minDate="01-01-2023"
                        // maxDate="31-03-2023"
                        min={
                          authorities &&
                          authorities.Past_Financial_Year_Bill_Date === true
                            ? formattedStartPastDate
                            : formattedStartDate
                        }
                        // max={formattedEndDate}

                        max={formattedDate}
                        readOnly={
                          (authorities && authorities?.Edit_In_Bill === true) ||
                          (authorities &&
                            authorities?.Past_Financial_Year_Bill_Date === true)
                            ? false
                            : true
                        }
                        defaultValue={data.bill_date}
                      />
                    </div>
               

                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Received Date: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        id="received_date"
                        name="received_date"
                        defaultValue={data.received_date}
                        readOnly={
                          authorities && authorities.Received_Date === true
                            ? false
                            : true
                        }
                        min={data.bill_date}
                        max="2025-02-24"
                      />
                    </div>
                  </div>

                  {/* {console.log("a",data && data.map((i)=>i.approvers_id))} */}
                  <div className=" form-group row mt-3">
                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Debit Advance: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="debit_advance"
                        name="debit_advance"
                        onChange={(e) => handleDebit(e)}
                        defaultValue={
                          data.debit_advance ? data.debit_advance : 0
                        }
                        required
                        readOnly={
                          // (data.is_assign_to == 1 &&
                          //   authorities &&
                          //   authorities.All_Update_Bill == true) ||
                          data.is_rejected == 1 ||
                          data.created_by == localStorage.getItem("id") ||
                          // (authorities &&
                          //   authorities.All_Update_Bill == true) ||
                          (data.current_user_is_approver == 1 &&
                            authorities &&
                            authorities.All_Update_Bill == true &&
                            data.current_user_is_approver == 0)
                            ? false
                            : true
                        }
                        // readOnly={
                        //   userSessionData.userId != data.created_by ||

                        //   (authorities &&
                        //     authorities.All_Update_Bill === false &&
                        //     data.is_assign_to == 1)
                        //     ? true
                        //     : false
                        // }
                        maxLength={13}
                        // onKeyPress={(e) => {
                        //   Validation.NumbersSpeicalOnlyDot(e);
                        // }}
                        onKeyPress={(e) => {
                          const allowedKeys = [
                            "0",
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            ".",
                            "Backspace",
                          ];
                          const inputValue = e.key;

                          if (!allowedKeys.includes(inputValue)) {
                            e.preventDefault();
                          }

                          const currentInput = e.target.value;
                          const decimalIndex = currentInput.indexOf(".");

                          if (
                            decimalIndex !== -1 &&
                            currentInput.length - decimalIndex > 2
                          ) {
                            e.preventDefault();
                          }

                          if (
                            currentInput.length >= 10 &&
                            inputValue !== "." &&
                            decimalIndex === -1
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {inputState && (
                        <small
                          style={{
                            color: "red",
                          }}
                        >
                          {debitAdvanceErr}
                        </small>
                      )}
                    </div>

                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Taxable Amount: <Astrick color="red" size="13px" />
                        </b>
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        step="0.01"
                        id="taxable_amount"
                        name="taxable_amount"
                        maxLength={13}
                        onChange={(e) => handleTaxable(e)}
                        defaultValue={
                          data.taxable_amount ? data.taxable_amount : 0
                        }
                        required
                        readOnly={
                          // (data.is_assign_to == 1 &&
                          //   authorities &&
                          //   authorities.All_Update_Bill == true) ||
                          data.is_rejected == 1 ||
                          data.created_by == localStorage.getItem("id") ||
                          // (authorities &&
                          //   authorities.All_Update_Bill == true) ||
                          (data.current_user_is_approver == 1 &&
                            authorities &&
                            authorities.All_Update_Bill == true &&
                            data.current_user_is_approver == 0)
                            ? false
                            : true
                        }
                        // readOnly={authorities&&authorities.All_Update_Bill=== false ?true :false ||data.is_active == 0 || !(userSessionData.userId == data.created_by) ? true : false}

                        // readOnly={
                        //   userSessionData.userId == data.created_by ||
                        //   (authorities &&
                        //     authorities.All_Update_Bill === true) ||
                        //   data.is_active == 1
                        //     ? false
                        //     : true
                        // }
                        onKeyPress={(e) => {
                          const inputValue = e.key;
                          const currentInput = e.target.value;
                          const decimalIndex = currentInput.indexOf(".");

                          if (
                            !/^\d$/.test(inputValue) &&
                            inputValue !== "." &&
                            inputValue !== "Backspace"
                          ) {
                            e.preventDefault();
                          }

                          if (
                            decimalIndex !== -1 &&
                            currentInput.length - decimalIndex > 2
                          ) {
                            e.preventDefault();
                          }

                          if (
                            currentInput.length >= 10 &&
                            inputValue !== "." &&
                            decimalIndex === -1
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {inputState && (
                        <small
                          style={{
                            color: "red",
                          }}
                        >
                          {taxableAmountErr}
                        </small>
                      )}
                    </div>

                    {/* <input
                        className="sm"
                        id="is_igst_applicable"
                        name="is_igst_applicable"
                        type="hidden"
value={igst=== true ?1 :0} */}
                    {/* /> */}
                    <div className=" col ">
                      <input
                        className="sm"
                        id="is_igst_applicable"
                        // name="is_igst_applicable"
                        type="checkbox"
                        style={{ marginRight: "8px" }}
                        disabled={
                          (data.is_assign_to == 1 &&
                            authorities &&
                            authorities.All_Update_Bill == true) ||
                          data.is_rejected == 1 ||
                          data.created_by == localStorage.getItem("id") ||
                          (authorities &&
                            authorities.All_Update_Bill == true) ||
                          (data.current_user_is_approver == 1 &&
                            authorities &&
                            authorities.All_Update_Bill == true &&
                            data.current_user_is_approver == 0)
                            ? false
                            : true
                        }
                        defaultChecked={data.is_igst_applicable === 1}
                        onChange={(e) => {
                          handleIgst(e);
                        }}
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />

                      <label className="col-sm-3 col-form-label">
                        <b>
                          IGST/GST :<Astrick color="red" size="13px" />
                        </b>
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="gst_amount"
                        name="gst_amount"
                        maxLength={13}
                        defaultValue={
                          data.is_igst_applicable == 1
                            ? data.igst_amount
                            : data.gst_amount
                        }
                        onChange={(e) => handleGst(e)}
                        required
                        readOnly={
                          // (data.is_assign_to == 1 &&
                          //   authorities &&
                          //   authorities.All_Update_Bill == true) ||
                          data.is_rejected == 1 ||
                          data.created_by == localStorage.getItem("id") ||
                          // (authorities &&
                          //   authorities.All_Update_Bill == true) ||
                          (data.current_user_is_approver == 1 &&
                            authorities &&
                            authorities.All_Update_Bill == true &&
                            data.current_user_is_approver == 0)
                            ? false
                            : true
                        }
                        onKeyPress={(e) => {
                          const inputValue = e.key;
                          const currentInput = e.target.value;
                          const decimalIndex = currentInput.indexOf(".");

                          if (
                            !/^\d$/.test(inputValue) &&
                            inputValue !== "." &&
                            inputValue !== "Backspace"
                          ) {
                            e.preventDefault();
                          }

                          if (
                            decimalIndex !== -1 &&
                            currentInput.length - decimalIndex > 2
                          ) {
                            e.preventDefault();
                          }

                          if (
                            currentInput.length >= 10 &&
                            inputValue !== "." &&
                            decimalIndex === -1
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />

                      {inputState && (
                        <small
                          style={{
                            color: "red",
                          }}
                        >
                          {igstErr}
                        </small>
                      )}
                    </div>

                    <div className=" col ">
                      <label className="col-sm-3 col-form-label">
                        <b> Round Off: </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="round_off"
                        name="round_off"
                        onChange={(e) => handleRoundOff(e)}
                        // readOnly={
                        //   userSessionData.userId == data.created_by ||
                        //   (authorities &&
                        //     authorities.All_Update_Bill === true) ||
                        //   data.is_active == 1
                        //     ? false
                        //     : true
                        // }
                        readOnly={
                          // (data.is_assign_to == 1 &&
                          //   authorities &&
                          //   authorities.All_Update_Bill == true) ||
                          data.is_rejected == 1 ||
                          data.created_by == localStorage.getItem("id") ||
                          // (authorities &&
                          //   authorities.All_Update_Bill == true) ||
                          (data.current_user_is_approver == 1 &&
                            authorities &&
                            authorities.All_Update_Bill == true &&
                            data.current_user_is_approver == 0)
                            ? false
                            : true
                        }
                        defaultValue={data.round_off ? data.round_off : 0}
                        // onKeyPress={(e) => {
                        //   Validation.NumbersSpeicalOnlyDot(e);
                        // }}
                        maxLength={13}
                        onKeyPress={(e) => {
                          const allowedKeys = [
                            "0",
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            ".",
                            "Backspace",
                            "-",
                          ];
                          const inputValue = e.key;
                          const currentInput = e.target.value;
                          const decimalIndex = currentInput.indexOf(".");

                          // Allow '-' only at the beginning of the input
                          if (
                            inputValue === "-" &&
                            e.target.selectionStart !== 0
                          ) {
                            e.preventDefault();
                          }

                          if (
                            decimalIndex !== -1 &&
                            currentInput.length - decimalIndex > 2
                          ) {
                            e.preventDefault();
                          }

                          if (
                            currentInput.length >= 10 &&
                            inputValue !== "." &&
                            decimalIndex === -1
                          ) {
                            e.preventDefault();
                          }

                          if (!allowedKeys.includes(inputValue)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className=" form-group row mt-3 ">
                    {/* <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          TCS: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="tcs"
                        name="tcs"
                        onChange={(e) => handleTcs(e)}
                        required
                        defaultValue={data.tcs ? data.tcs : 0}
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />
                    </div> */}

                

                    {isTcsApplicable === true ? (
                      <div className=" col-md-3 ">
                        <label className=" col-form-label">
                          <b>
                            {" "}
                            TCS Amount:{" "}
                            {isTcsApplicable === true && (
                              <Astrick color="red" size="13px" />
                            )}
                          </b>
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="tcs"
                          name="tcs"
                          step="any"
                          onChange={(e) => handleTcs(e)}
                          // value={data.tcs}

                          defaultValue={isTcsApplicable === true ? data.tcs : 0}
                          // readOnly={isTcsApplicable  ? false : true}
                          // disabled={(data.is_assign_to == 1 && authorities && authorities.All_Update_Bill == true) || data.is_rejected == 1 || data.created_by == localStorage.getItem("id") || (authorities && authorities.All_Update_Bill == true) || (data.current_user_is_approver == 1 && authorities && authorities.All_Update_Bill == true) && data.current_user_is_approver == 0 ||   authorities.TCS_Applicable === true ? false :true}
                          // value={data.tcs}

                          readOnly={
                            authorities &&
                            authorities.TCS_Applicable === false &&
                            authorities &&
                            authorities.All_Update_Bill === false
                              ? true
                              : false
                          }
                          // readOnly={
                          //   data.is_active == 0 && isTcsApplicable === false
                          //     ? true
                          //     : false
                          // }
                          // required={isTcsApplicable === true ? true : false}
                          onKeyPress={(e) => {
                            Validation.NumbersSpeicalOnlyDot(e);
                          }}
                          required={isTcsApplicable === true ? true : false}
                        />

                        {inputState && isTcsApplicable === true && (
                          <small
                            style={{
                              color: "red",
                            }}
                          >
                            {tcsErr}
                          </small>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className=" col-md-3 ">
                          <label className=" col-form-label">
                            <b>
                              {" "}
                              TCS Amount:{" "}
                              {isTcsApplicable === true && (
                                <Astrick color="red" size="13px" />
                              )}
                            </b>
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            id="tcs"
                            name="tcs"
                            step="any"
                            onChange={(e) => handleTcs(e)}
                            readOnly
                            value={0}
                            // value={data.tcs}

                            // defaultValue={isTcsApplicable === true ? data.tcs : 0}
                            // readOnly={isTcsApplicable  ? false : true}
                            // readOnly={(data.is_assign_to == 1 && authorities && authorities.All_Update_Bill == true) || data.is_rejected == 1 || data.created_by == localStorage.getItem("id") || (authorities && authorities.All_Update_Bill == true) || (data.current_user_is_approver == 1 && authorities && authorities.All_Update_Bill == true) && data.current_user_is_approver == 0 ? false :true}
                            // value={data.tcs}

                            // readOnly={
                            //   data.is_active == 0 && isTcsApplicable === false
                            //     ? true
                            //     : false
                            // }
                            // required={isTcsApplicable === true ? true : false}
                            onKeyPress={(e) => {
                              Validation.NumbersSpeicalOnlyDot(e);
                            }}
                            // required={isTcsApplicable === true ? true : false}
                          />

                          {/* {inputState && isTcsApplicable === true && (
                        <small
                          style={{
                            color: "red",
                          }}
                        >
                          {tcsErr}
                        </small>
                      )} */}
                        </div>
                      </>
                    )}

                    <div className=" col-md-3 ">
                      <label className="col-form-label">
                        <b>
                          {" "}
                          Bill Amount: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="bill_amount"
                        name="bill_amount"
                        defaultValue={data.bill_amount ? data.bill_amount : 0}
                        value={
                          billAmount > 0
                            ? // && isTcsApplicable === true
                              billAmount
                            : billAmount1
                        }
                        readOnly={true}
                        // required
                      />
                    </div>
                    <div className=" col-md-3 mt-4">
                      <input
                        className="sm-1"
                        type="checkbox"
                        style={{ marginRight: "8px", marginLeft: "10px" }}
                        id="is_tds_applicable"
                        // name="is_tds_applicable"
                        onChange={(e) => handleTdsApplicable(e)}
                        defaultChecked={
                          data.is_tds_applicable == 1 ? true : false
                        }
                        disabled={
                          (data.is_assign_to == 1 &&
                            authorities &&
                            authorities.All_Update_Bill == true) ||
                          data.is_rejected == 1 ||
                          data.created_by == localStorage.getItem("id") ||
                          (authorities &&
                            authorities.All_Update_Bill == true) ||
                          (data.current_user_is_approver == 1 &&
                            authorities &&
                            authorities.All_Update_Bill == true &&
                            data.current_user_is_approver == 0)
                            ? false
                            : true
                        }
                      />
                      <label className="col-form-label">
                        <b>TDS Applicable:</b>
                      </label>
                    </div>

                    <div className=" col-md mt-4">
                      <input
                        className="sm-1"
                        type="checkbox"
                        style={{ marginRight: "8px", marginLeft: "10px" }}
                        disabled={
                          authorities &&
                          authorities.TCS_Applicable === false &&
                          authorities &&
                          authorities.All_Update_Bill === false
                            ? true
                            : false
                        }
                        id="is_tcs_applicable"
                        // name="is_tcs_applicable"
                        onChange={(e) => handleTcsApplicable(e)}
                        defaultChecked={
                          data.is_tcs_applicable == 1 ? true : false
                        }
                      />
                      <label className="col-form-label">
                        <b>TCS Applicable:</b>
                      </label>
                    </div>
                  </div>
                  {showTdsFileds && (
                    <div className=" form-group row mt-3 ">
                      <div className="col-md-3  ">
                        <input
                          type="hidden"
                          name="tds_section"
                          value={data && data.tds_section}
                        />

                        <label className="col-form-label">
                          <b>TDS section : </b>
                        </label>
                        {sectionDropdown && (
                          <Select
                            type="text"
                            className="form-control form-control-sm"
                            id="tds_section"
                            name="tds_section"
                            placeholder="select..."
                            options={sectionDropdown}
                            ref={sectionRef}
                            isDisabled={
                              // (data.is_assign_to == 1 &&
                              //   authorities &&
                              //   authorities.All_Update_Bill == true) ||
                              data.is_rejected == 1 ||
                              data.created_by == localStorage.getItem("id") ||
                              // (authorities &&
                              //   authorities.All_Update_Bill == true) ||
                              (data.current_user_is_approver == 1 &&
                                authorities &&
                                authorities.All_Update_Bill == true &&
                                data.current_user_is_approver == 0)
                                ? false
                                : true
                            }
                            // onChange={(e) => handleSectionDropDownChange(e)}
                            onChange={(e) => {
                              handleSectionDropDownChange(e);
                              handleTDSSectionChange(e);
                            }}
                            defaultValue={
                              data &&
                              sectionDropdown.filter(
                                (d) => d.value === data.tds_section
                              )
                            }
                          />
                        )}
                      </div>
                      <div className=" col-md-3 ">
                        <input
                          type="hidden"
                          name="tds_constitution"
                          value={data && data.tds_constitution}
                        />
                        <label className=" col-form-label">
                          <b>
                            TDS Constitution :{" "}
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        {/* {tdsData && tdsData.length > 0 && (
                          <span>
                            aahe tds
                            {constitutionDropdown && sectionDropdown &&(
                              <Select
                                id="tds_constitution"
                                name="tds_constitution"
                                key={Math.random()}
                                options={constitutionDropdown}
                                defaultValue={
                                  sectionDropdown &&
                                  constitutionDropdown.filter(
                                    (d) => d.value === data.tds_constitution
                                  )
                                }
                              />
                            )}
                          </span>
                        )} */}

                        {/* {(!tdsData || tdsData.length == 0) && ( */}
                        <span>
                          {constitutionDropdown && data && (
                            // <Select
                            //   className="form-control form-control-sm"
                            //   id="tds_constitution"
                            //   name="tds_constitution"
                            //   options={constitutionDropdown}
                            //   key={Math.random()}
                            //   onChange={e=>{handleTdsPercentage(e)}}
                            //   value={
                            //     data.tds_constitution &&
                            //     constitutionDropdown.filter(
                            //       (d) => d.value === data.tds_constitution
                            //     )
                            //   }
                            // />
                            <Select
                              className="form-control form-control-sm"
                              id="tds_constitution"
                              name="tds_constitution"
                              options={constitutionDropdown}
                              onChange={(e) => handleTdsPercentage(e)}
                              isDisabled={
                                // (data.is_assign_to == 1 &&
                                //   authorities &&
                                //   authorities.All_Update_Bill == true) ||
                                data.is_rejected == 1 ||
                                data.created_by == localStorage.getItem("id") ||
                                // (authorities &&
                                //   authorities.All_Update_Bill == true) ||
                                (data.current_user_is_approver == 1 &&
                                  authorities &&
                                  authorities.All_Update_Bill == true &&
                                  data.current_user_is_approver == 0)
                                  ? false
                                  : true
                              }
                              defaultValue={
                                data.tds_constitution
                                  ? constitutionDropdown.find(
                                      (d) => d.value === data.tds_constitution
                                    )
                                  : null
                              }
                              required={
                                constitutionDropdown &&
                                !constitutionDropdown.length
                                  ? false
                                  : true
                              }
                            />
                          )}
                        </span>
                        {/* )} */}
                      </div>

                      <div className="col-md-3">
                        <label className=" col-form-label">
                          <b>
                            TDS Amount : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="tds_amount"
                          key={Math.random()}
                          ref={selecttdsAmountRef}
                          name="tds_amount"
                          defaultValue={data.tds_amount? data.tds_amount : 0  }
                          // defaultValue={data.tds_amount}
                          value={tdsAmount ? tdsAmount :0}
                          readOnly={true}
                        />
                      </div>

                      {/* {tdsPercentage ?  <div className="col-md-3">
                        <label className=" col-form-label">
                          <b>
                            TDS Amount : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="tds_amount"
                          key={Math.random()}
                          ref={selecttdsAmountRef}
                          name="tds_amount"
                          value={td}
                          // defaultValue={data.tds_amount}
                          // value={tdsAmount}
                          // readOnly={true}
                        />
                      </div> :
                      <div className="col-md-3">
                        <label className=" col-form-label">
                          <b>
                            TDS Amount : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="tds_amount"
                          key={Math.random()}
                          ref={selecttdsAmountRef}
                          name="tds_amount"
                          defaultValue={data.tds_amount && data.tds_amount }
                          // defaultValue={data.tds_amount}
                          // value={tdsAmount}
                          // readOnly={true}
                        />
                      </div>
} */}

                      <div className=" col-md-3 ">
                        <label className=" col-form-label">
                          <b>
                            TDS % : <Astrick color="red" size="13px" />
                          </b>
                        </label>

                        {tdsPercentage && tdsPercentage ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="tds_percentage"
                            name="tds_percentage"
                            // defaultValue={data && data.tds_percentage ? data.tds_percentage : ''}
                            value={tdsPercentage ? tdsPercentage : ""}
                            ref={selectTdsPercentageRef}
                            onChange={(e) => handleTds(e)}
                            readOnly={
                              // (data.is_assign_to == 1 &&
                              //   authorities &&
                              //   authorities.All_Update_Bill == true) ||
                              data.is_rejected == 1 ||
                              data.created_by == localStorage.getItem("id") ||
                              // (authorities &&
                              //   authorities.All_Update_Bill == true) ||
                              (data.current_user_is_approver == 1 &&
                                authorities &&
                                authorities.All_Update_Bill == true &&
                                data.current_user_is_approver == 0)
                                ? false
                                : true
                            }
                          />
                        ) : (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="tds_percentage"
                            name="tds_percentage"
                            defaultValue={
                              data && data.tds_percentage
                                ? data.tds_percentage
                                : ""
                            }
                            // value={tdsPercentage ? tdsPercentage : ''}
                            // ref={tdsPercentageRef}
                            ref={selectTdsPercentageRef}
                            onChange={(e) => handleTds(e)}
                            readOnly={
                              (data.is_assign_to == 1 &&
                                authorities &&
                                authorities.All_Update_Bill == true) ||
                              data.is_rejected == 1 ||
                              data.created_by == localStorage.getItem("id") ||
                              (authorities &&
                                authorities.All_Update_Bill == true) ||
                              (data.current_user_is_approver == 1 &&
                                authorities &&
                                authorities.All_Update_Bill == true &&
                                data.current_user_is_approver == 0)
                                ? false
                                : true
                            }
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className=" form-group row mt-3 ">
                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Net Payment : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="net_payment"
                        name="net_payment"
                        readOnly
                        value={netPayment}
                        defaultValue={data.net_payment ? data.net_payment : 0}

                        // required
                      />
                      <span
                        className="fw-bold"
                        style={{ fontStyle: "italic", color: "red" }}
                      >
                        {data && data.bill_amount_in_words
                          ? data.bill_amount_in_words
                          : ""}
                      </span>

                      {/* <input type="text" className="form-control form-control-sm"
                                                // value={numWords(netPayment)}
                                                // id ="net_payment"
                                                // defaultValue={data.net_payment? toWords.convert(data.net_payment) :"zero"}
                                                // value={netPayment? toWords.convert(parseInt(netPayment)) : "zero" }
                                                style={{ border: "none", color: "red", fontSize: "12px", fontWeight: "bold", width: "100% !important", background: "white" }}
                                                readOnly
                                            /> */}
                    </div>

                    {netPaymentError && (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {netPaymentError}
                      </p>
                    )}

                    {/* <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Net Payment In Words :{" "}
                          <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="bill_amount_in_words"
                        name="bill_amount_in_words"
                        readOnly
                        // value={netPayment}
                        defaultValue={
                          data.bill_amount_in_words
                            ? data.bill_amount_in_words
                            : 0
                        }
                      />
                    </div> */}

                    {/* <div className=" col-md-3 ">
                                        <label className=" col-form-label">
                                            <b> Net Payment In Words: <Astrick color="red" size="13px" /></b>
                                        </label>
                                        <input type="text" className="form-control form-control-sm"
                                            id="net_payment_in_word"
                                            name="net_payment_in_word"
                                            // onChange ={e=>handleAmountWords(e)}

                                        />
                                    </div> */}

                    <div className=" col-md mt-4">
                      <input
                        className="sm-1"
                        type="checkbox"
                        style={{ marginRight: "8px", marginLeft: "10px" }}
                        id="is_original_bill_needed"
                        // name="is_original_bill_needed"
                        onChange={(e) => handleAuthorizedByManagement(e)}
                        defaultChecked={
                          data.is_original_bill_needed == 1 ? true : false
                        }
                        disabled={
                          authorities &&
                          authorities.Original_Bill_Needed === false &&
                          authorities &&
                          authorities.All_Update_Bill === false
                            ? true
                            : false
                        }
                      />
                      <label className="col-form-label">
                        <b>Original Bill Needed</b>
                      </label>
                    </div>
                    {data &&
                      data.approvers_id.length > 0 &&
                      data.approvers_id.includes(
                        parseInt(sessionStorage.getItem("id"))
                      ) && (
                        <>
                          <div className=" col-md mt-4">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="status-approve"
                                    key="1" // Unique key for "approve"
                                    value={1}
                                    checked={statusValue === 1} // Check if 1 (approve) is selected
                                    onChange={(e) => handleStatus(e, 1)} // Set value as 1 for "approve"
                                    disabled={data.is_active === 0}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="status-approve"
                                  >
                                    Approve
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="status-reject"
                                    key="2" // Unique key for "reject"
                                    value={2}
                                    checked={statusValue === 2} // Check if 2 (reject) is selected
                                    onChange={(e) => handleStatus(e, 2)} // Set value as 2 for "reject"
                                    disabled={data.is_active === 0}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="status-reject"
                                  >
                                    Reject
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                    {/* <h1>{data &&JSON.stringify( data.access.Authorized_By_Management  )}</h1>  */}

                    {/* <div className=" col-md mt-4 ">
                                            <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
                                                id="is_tcs_applicable"
                                                name="is_tcs_applicable"
                                                disabled={data && data.access.Authorized_By_Management ? false : true}
                                            />

                                            <label className="col-form-label">
                                                <b>Authorised By Management</b>
                                            </label>
                                        </div> */}

                    {/* <div className=" col-md mt-4">
                                            <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
                                                id="is_tcs_applicable"
                                                name="is_tcs_applicable"
                                                disabled={data && data.access.Cancel_Bill ? false : true}
                                            />
                                            <label className="col-form-label">
                                                <b>Cancel Bill</b>
                                            </label>
                                        </div> */}
                  </div>
                  <div className="form-group row mt-3 ">
                    <div className=" col-md-4 ">
                      <label className=" col-form-label">
                        <b> Remark: </b>
                      </label>
                      <textarea
                        type="text"
                        className="form-control form-control-sm"
                        id="narration"
                        name="narration"
                        rows="4"
                        maxLength={2000}
                        // readOnly={
                        //   authorities && authorities.All_Update_Bill === true
                        //     ? false
                        //     : true
                        // }
                        // defaultValue={data.narration ? data.narration : ""}
                      />
                    </div>
                    <div className=" col-md-4 ">
                      <label className=" col-form-label">
                        <b> Remark History: </b>
                      </label>
                      <textarea
                        type="text"
                        className="form-control form-control-sm"
                        id="remark"
                        name="remark"
                        readOnly
                        style={{ fontWeight: "bold" }}
                        rows="4"
                        defaultValue={data && data.remark_history.join("\n")}
                      />
                    </div>
                    <div className=" col-md-4 ">
                      <label className=" col-form-label">
                        <b>Internal Audit Remark: </b>
                      </label>
                      <textarea
                        type="text"
                        className="form-control form-control-sm"
                        id="audit_remark"
                        name="audit_remark"
                        maxLength={250}
                        // defaultValue={
                        //   data.audit_remark ? data.audit_remark : ""
                        // }
                        readOnly={
                          authorities && authorities.Internal_Audit === false
                            ? true
                            : false
                        }
                        rows="4"
                      />
                    </div>
                    <div className=" col-md-4 ">
                      <label className=" col-form-label">
                        <b> External Audit Remark: </b>
                      </label>
                      <textarea
                        type="text"
                        className="form-control form-control-sm"
                        id="external_remark"
                        name="external_remark"
                        rows="4"
                        maxLength={250}
                        readOnly={
                          authorities && authorities.External_Audit === false
                            ? true
                            : false
                        }
                        // defaultValue={
                        //   data.external_remark ? data.external_remark : ""
                        // }
                      />
                    </div>
                  </div>

                  <div className="card mt-2">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-4 mt-3">
                          <label className=" col-form-label">
                            <b>
                              Upload Attachment :
                              <Astrick color="red" size="13px" />{" "}
                            </b>
                          </label>
                          <input
                            type="file"
                            id="attachment"
                            name="attachment[]"
                            className="form-control"
                            ref={fileInputRef}
                            multiple
                            disabled={
                              (data.is_assign_to == 1 &&
                                authorities &&
                                authorities.All_Update_Bill == true) ||
                              data.is_rejected == 1 ||
                              data.created_by == localStorage.getItem("id") ||
                              (authorities &&
                                authorities.All_Update_Bill == true) ||
                              (data.current_user_is_approver == 1 &&
                                authorities &&
                                authorities.All_Update_Bill == true &&
                                data.current_user_is_approver == 0)
                                ? false
                                : true
                            }
                            onChange={(e) => {
                              uploadAttachmentHandler(e, "UPLOAD", "");
                              maxLengthCheck(e, "UPLOAD");
                            }}
                          />
                        </div>

                        <div className=" col-md-3 mt-4">
                          <input
                            className="sm-1"
                            type="checkbox"
                            style={{ marginRight: "8px", marginLeft: "10px" }}
                            id="authorized_by_management"
                            // name="authorized_by_management"
                            // onChange={(e) => handleTdsApplicable(e)}
                            // defaultChecked={
                            //   data.is_tds_applicable == 1 ? true : false
                            // }

                            onChange={(e) => handleAuthorizedByManagement(e)}
                            defaultChecked={
                              data.authorized_by_management == 1 ? true : false
                            }
                            disabled={
                              authorities &&
                              authorities.Allow_Edit_Authorized_By_Management ===
                                false
                                ? true
                                : false
                            }
                          />
                          <label className="col-form-label">
                            <b>Authorised by management:</b>
                          </label>
                        </div>

                        <div className=" col-md mt-4">
                          <input
                            className="sm-1"
                            type="checkbox"
                            style={{ marginRight: "8px", marginLeft: "10px" }}
                            // disabled={
                            //   data && data.access.TCS_Applicable ? false : true
                            // }
                            id="authorized_by_hod"
                            // name="authorized_by_hod"
                            onChange={(e) => handleAuthorizedByHod(e)}
                            defaultChecked={
                              data.authorized_by_hod == 1 ? true : false
                            }
                            // onChange={(e) => handleTcsApplicable(e)}
                            disabled={
                              authorities &&
                              authorities.Allow_Edit_Authorized_By_HOD === false
                                ? true
                                : false
                            }
                          />
                          <label className="col-form-label">
                            <b>Authorised by HOD :</b>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="d-flex">
                    {selectedFiles &&
                      selectedFiles.map((attachment, index) => {
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
                                <div className="d-flex justify-content-between p-0 mt-1">
                                  <a
                                    href={`${attachment.tempUrl}`}
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i class="icofont-ui-zoom-out"></i>
                                  </a>

                                  <div className="d-flex justify-content-between p-0 mt-1">
                                    <button
                                      disabled={
                                        authorities &&
                                        authorities.Edit_In_Bill === false
                                          ? true
                                          : false
                                      }
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
                          </div>
                        );
                      })}
                  </div> */}

                  <div
                    //  className="d-flex"
                    className="attachments-container"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "100%",
                      maxHeight: "400px", // Example maximum height
                      overflowY: "auto", // Enable vertical scrolling if needed
                    }}
                  >
                    {selectedFiles &&
                      selectedFiles.map((attachment, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              marginRight: "20px",
                              marginBottom: "20px", // Add margin bottom for spacing between attachments
                              width: "100px", // Set a fixed width for consistency
                            }}
                          >
                            <div
                              className="card"
                              style={{
                                backgroundColor: "#EBF5FB",
                                height: "100%", // Set the height of the card to fill the container
                                display: "flex", // Use flexbox to align content vertically
                                flexDirection: "column", // Align content in a column layout
                              }}
                            >
                              <div
                                className="card-header"
                                style={{ padding: "10px", overflow: "hidden" }}
                              >
                                <span
                                  // style={{
                                  //   overflow: "hidden",
                                  //   textOverflow: "ellipsis",
                                  //   whiteSpace: "nowrap",
                                  // }}
                                  style={{
                                    display: "inline-block",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "100%", // Ensure the span does not exceed the container width
                                  }}
                                >
                                  {attachment.fileName}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between p-3">
                                <a
                                  href={`${attachment.tempUrl}`}
                                  target="_blank"
                                  className="btn btn-warning btn-sm p-0 px-1"
                                >
                                  <i className="icofont-ui-zoom-out"></i>
                                </a>
                                <button
                                  disabled={
                                    authorities &&
                                    authorities.Edit_In_Bill === false
                                      ? true
                                      : false
                                  }
                                  className="btn btn-danger text-white btn-sm p-1"
                                  type="button"
                                  onClick={(e) => {
                                    uploadAttachmentHandler(e, "DELETE", index);
                                  }}
                                >
                                  <i
                                    className="icofont-ui-delete"
                                    style={{ fontSize: "15px" }}
                                  ></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {data && data.attachment && (
                    <div
                      // className="d-flex justify-content-start mt-2"
                      // style={{ overflowX: "auto" }}
                      className="attachments-container"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        maxWidth: "100%",
                        maxHeight: "400px", // Example maximum height
                        overflowY: "auto", // Enable vertical scrolling if needed
                      }}
                    >
                      {data &&
                        data.attachment.map((attach, index) => {
                          return (
                            <div
                              key={index}
                              style={{
                                marginRight: "20px",
                                marginBottom: "20px", // Add margin bottom for spacing between attachments
                                width: "100px", // Set a fixed width for consistency
                              }}
                            >
                              <div
                                className="card"
                                style={{
                                  backgroundColor: "#EBF5FB",
                                  height: "100%", // Set the height of the card to fill the container
                                  display: "flex", // Use flexbox to align content vertically
                                  flexDirection: "column", // Align content in a column layout
                                }}
                              >
                                <div
                                  className="card-header"
                                  style={{
                                    padding: "10px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <span
                                    // style={{
                                    //   overflow: "hidden",
                                    //   textOverflow: "ellipsis",
                                    //   whiteSpace: "nowrap",
                                    // }}
                                    style={{
                                      display: "inline-block",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: "100%", // Ensure the span does not exceed the container width
                                    }}
                                  >
                                    {attach.name}
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between p-3">
                                  <a
                                    href={`${attach.path}`}
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                  >
                                    <i className="icofont-ui-zoom-out"></i>
                                  </a>
                                  <button
                                    className="btn btn-danger text-white btn-sm p-0 px-1"
                                    type="button"
                                    disabled={
                                      authorities &&
                                      authorities.Edit_In_Bill === false
                                        ? true
                                        : false
                                    }
                                    onClick={(e) => {
                                      handleDeleteAttachment(e, attach.id);
                                    }}
                                  >
                                    <i
                                      className="icofont-ui-delete"
                                      style={{ fontSize: "12px" }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                            // <div
                            //   className="justify-content-start"
                            //   style={{
                            //     marginRight: "5px",
                            //     padding: "0px",
                            //     width: "auto",
                            //   }}
                            // >
                            //   <div
                            //     className="card"
                            //     style={{ backgroundColor: "#EBF5FB" }}
                            //   >
                            //     <div className="card-header">
                            //       <p style={{ fontSize: "12px" }}>
                            //         <b>{attach.name}</b>
                            //       </p>
                            //       <div className="d-flex justify-content-end p-0">
                            //         <a
                            //           href={`${attach.path}`}
                            //           target="_blank"
                            //           className="btn btn-warning btn-sm p-0 px-1"
                            //         >
                            //           <i
                            //             className="icofont-download"
                            //             style={{
                            //               fontSize: "10px",
                            //               height: "15px",
                            //             }}
                            //           ></i>
                            //         </a>

                            //         <button
                            //           className="btn btn-danger text-white btn-sm p-0 px-1"
                            //           type="button"
                            //           disabled={
                            //             authorities &&
                            //             authorities.Edit_In_Bill === false
                            //               ? true
                            //               : false
                            //           }
                            //           onClick={(e) => {
                            //             handleDeleteAttachment(e, attach.id);
                            //           }}
                            //         >
                            //           <i
                            //             className="icofont-ui-delete"
                            //             style={{ fontSize: "12px" }}
                            //           ></i>
                            //         </button>
                            //       </div>
                            //     </div>
                            //   </div>
                            // </div>
                          );
                        })}
                    </div>
                  )}
                  <div className="col-md mt-3">
                    {data &&
                      Object.entries(data.iteration_data).map(
                        ([iteration, values]) => (
                          <div className="table-responsive" key={iteration}>
                            <h2>Iteration : {iteration}</h2>
                            <table
                              className="table table-bordered mt-3 table-responsive"
                              id="tab_logic"
                            >
                              <thead>
                                <tr>
                                  <th
                                    className="text-center"
                                    style={{ width: "100px" }}
                                  >
                                    Total Approval Level Count
                                  </th>
                                  <th
                                    className="text-center"
                                    style={{ width: "100px" }}
                                  >
                                    {" "}
                                    Level{" "}
                                  </th>

                                  <th
                                    className="text-center"
                                    style={{ width: "300px" }}
                                  >
                                    {" "}
                                    Approvals Name{" "}
                                  </th>

                                  <th
                                    className="text-center"
                                    style={{ width: "300px" }}
                                  >
                                    {" "}
                                    Approvals Required Name
                                  </th>
                                  <th
                                    className="text-center"
                                    style={{ width: "300px" }}
                                  >
                                    {" "}
                                    Approved By{" "}
                                  </th>

                                  <th
                                    className="text-center"
                                    style={{ width: "300px" }}
                                  >
                                    {" "}
                                    Rejected By{" "}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {values &&
                                  Object.entries(values).map(([key, value]) => (
                                    <tr key={key}>
                                      <td>
                                        {value && value.totalApprovalLevelCount}
                                      </td>
                                      <td>{value && value.level}</td>

                                      <td>{value && value.total_approvals}</td>

                                      <td>
                                        {value && value.approvals_required_name}
                                      </td>
                                      <td>{value && value.approvedBy}</td>

                                      <td>{value && value.rejectedBy}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        )
                      )}

                    {/* <div className="table-responsive">
                      <table
                        className="table table-bordered mt-3 table-responsive"
                        id="tab_logic"
                      >
                        <thead>
                          <tr>
                          <th className="text-center"> Iteration </th>


                            <th className="text-center"> Level </th>
                            <th className="text-center"> Total Approval Level Count </th>

                            <th className="text-center">Total Approvals </th>



                            <th className="text-center"> Approvals Required Name</th>
                            <th className="text-center"> Rejected By </th>

                          </tr>
                        </thead>
                        <tbody>

                          {Object.entries(data.iteration_data).map(([iteration, values]) => (
                            Object.entries(values).map(([key, value]) => (


                              <tr key={key}>
                                {/* {data && JSON.stringify(value)} */}
                    {/* <td>{value.iteration}</td>

                                <td>{value.level}</td>
                                <td>{value.totalApprovalLevelCount}</td>

                                <td>{value.total_approvals}</td>


                                <td>{value.approvals_required_name}</td>
                                <td>{value.rejectedBy}</td>



                              </tr>

                            ))
                          ))}

                        </tbody>
                      </table>
                    </div> */}
                  </div>

                  {/* <div className="table-responsive">
                    <table
                      className="table table-bordered mt-3 table-responsive"
                      id="tab_logic"
                    >
                      <thead>
                        <tr>
                          <th className="text-center"> Level </th>
                          <th className="text-center"> Last Approved By </th>

                        </tr>
                      </thead>
                      <tbody>
                       
                          <tr key={index}>


                            <td>{index + 1}</td>
                            <td>

                              <input
                                type="text"
                                className="form-control form-control-sm"
                                defaultValue={data.level}

                              />
                            </td>

                            <td>

<input
  type="text"
  className="form-control form-control-sm"
  defaultValue={data.last_approved_by}

/>
</td>

                          </tr>
                   
                      </tbody>
                    </table>
                  </div>
 */}
                </div>
              </div>
              {/* CARD */}
              <div className="mt-3" style={{ textAlign: "right" }}>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>

                <Link
                  to={`/${_base}/BillCheckingTransaction`}
                  className="btn btn-danger text-white"
                >
                  Cancel
                </Link>
              </div>
            </form>
            <Modal
              size="xl"
              centered
              show={modal.showModal}
              onHide={(e) => {
                handleModal({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                });
              }}
            >
              <Modal.Header closeButton />
              <Modal.Body style={{ alignItems: "center" }}>
                {showFiles &&
                  showFiles.map((d, i) => {
                    return (
                      <div className="row">
                        <img className="col-md mt-2" src={d} />
                      </div>
                    );
                  })}
              </Modal.Body>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}
