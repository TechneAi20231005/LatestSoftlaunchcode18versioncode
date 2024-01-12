// // import React, { useEffect, useState, useRef } from "react";
// // import { Link, useHistory } from 'react-router-dom';
// // import { Modal } from "react-bootstrap";
// // import ErrorLogService from "../../../services/ErrorLogService";

// // import PageHeader from "../../../components/Common/PageHeader";
// // import Alert from "../../../components/Common/Alert";
// // import { Astrick } from "../../../components/Utilities/Style"
// // import *  as Validation from '../../../components/Utilities/Validation';
// // import { _base } from '../../../settings/constants'
// // import { _attachmentUrl } from '../../../settings/constants'
// // import { getAttachment, deleteAttachment } from "../../../services/OtherService/AttachmentService";
// // import Select from 'react-select';
// // import DropdownService from "../../../services/Bill Checking/Bill Checking Transaction/DropdownService";
// // import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService"
// // import DepartmentService from "../../../services/MastersService/DepartmentService";
// // import UserService from '../../../services/MastersService/UserService';
// // import numWords from "num-words";
// // import BillTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService"

// // export default function CreateBillCheckingTransaction({ match }) {

// //     const id = match.params.id

// //     const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });
// //     const history = useHistory();
// //     const [notify, setNotify] = useState(null);
// //     const [data, setData] = useState(null);
// //     const [customerType, setCustomerType] = useState(null);
// //     const [dependent, setDependent] = useState({ country_id: null, state_id: null });
// //     const [attachment, setAttachment] = useState()
// //     const [billType, setBillType] = useState(null)
// //     const [billTypeDropdown, setBillTypeDropdown] = useState(null)
// //     const [vendor, setVendor] = useState(null);
// //     const [vendorDropdown, setVendorDropdown] = useState(null);
// //     const [department, setDepartment] = useState(null);
// //     const [departmentDropdown, setDepartmentDropdown] = useState(null);
// //     const [cityDropdown, setCityDropdown] = useState(null);
// //     const [user, setUser] = useState(null);
// //     const [userDropdown, setUserDropdown] = useState(null);

// //     const [constitution, setConstitution] = useState()
// //     const [constitutionDropdown, setConstitutionDropdown] = useState()

// //     const [sectionDropdown, setSectionDropdown] = useState();
// //     const [tdsPercentage, setTdsPercentage] = useState();

// //     const [billAmount, setBillAmount] = useState(0)
// //     const [netPayment, setNetPayment] = useState(null)

// //     const [tdsAmount, setTdsAmount] = useState(null)

// //     const [tdsData, setTdsData] = useState(null);

// //     const sectionRef = useRef();
// //     const tdsPercentageRef = useRef();
// //     // const resetSectionHandle = () =>{
// //     //     sectionRef.current.reset();
// //     // }

// //     const handleTdsChange = (e) => {
// //         setTdsData([e.target.value]);
// //     }
// //     const [showTdsFileds, setShowTdsFileds] = useState(false);
// //     const handleTdsApplicable = (e) => {
// //         if (e.target.checked) {
// //             setShowTdsFileds(e.target.checked);
// //         } else {
// //             setShowTdsFileds(e.target.checked = false);
// //             sectionRef.current.value = "";
// //             setTdsPercentage(null)
// //             setTdsAmount(0)
// //         }

// //     }

// //     const [netInWords, setNetInWords] = useState();
// //     const handleAmountWords = (e) => {
// //         setNetInWords(null);
// //         setNetInWords(numWords(netPayment));
// //     }

// //     const [debit, setDebit] = useState();
// //     const [taxable, setTaxable] = useState();
// //     const [gst, setGst] = useState();
// //     const [roundOff, setRoundOff] = useState();
// //     const [tcs, setTcs] = useState();
// //     const [tds, setTds] = useState();
// //     const [tdsPercent, setTdsPercent] = useState();
// //     const [deta, setDeta] = useState();
// //     const [showFiles, setShowFiles] = useState();
// //     const [authority, setAuthority] = useState();

// //     const handleTaxable = (e) => {
// //         setTaxable(e.target.value)

// //     }
// //     const handleGst = (e) => {
// //         setGst(e.target.value)
// //     }
// //     const handleRoundOff = (e) => {
// //         setRoundOff(e.target.value)
// //     }
// //     const handleTcs = (e) => {
// //         setTcs(e.target.value)
// //     }

// //     const handleTds = (e) => {
// //         setTdsPercent(e.target.value)
// //     }
// //     const handleDebit = (e) => {
// //         setDebit(e.target.value)
// //     }

// //     const handleTdsPercentage = (e) => {
// //         const selectedContition = constitution.filter(d => d.id === e.value);
// //         setTdsPercentage(selectedContition[0].percentage);

// //     }

// //     const handleSectionDropDownChange = async (e) => {
// //         await new BillCheckingTransactionService().getSectionMappingDropdown(e.value).then((res) => {
// //             if (res.status === 200) {
// //                 if (res.data.status == 1) {
// //                     setTdsPercentage(0)
// //                     setConstitutionDropdown(null)
// //                     setConstitution(res.data.data)
// //                     setConstitutionDropdown(res.data.data.map(d => ({ value: d.id, label: d.constitution_name })))

// //                 }
// //             }
// //         })
// //     }

// //     const [assignTo, setAssignTo] = useState();
// //     const [assignToDropdown, setAssignToDropdown] = useState();
// //     const handleAssignToPerson = async (e) => {
// //         await new DropdownService().getMappedEmp(e.value).then((res) => {
// //             if (res.status === 200) {
// //                 if (res.data.status == 1) {
// //                     setAssignTo(res.data.data)
// //                     setAssignToDropdown(null);
// //                     setAssignToDropdown(res.data.data.map(d => ({ value: d.id, label: d.employee_name })))
// //                 }
// //             }
// //         })
// //     }

// //     const  handleReset = () =>{

// //     }
// //     const handleFilter = async (e) => {
// //         e.preventDefault();
// //         const formData = new FormData(e.target);
// //         await new BillTransactionService().getBillCheckData(formData).then((res) => {
// //           if (res.status === 200) {
// //             const tempData = [];
// //             let counter = 1;
// //             const temp = res.data.data
// //             for (const key in temp) {
// //               tempData.push({
// //                 id: counter++,
// //                 task_name: temp[key].task_name,
// //                 tester_status: temp[key].tester_status,
// //                 ba_status: temp[key].ba_status,
// //                 developer_status: temp[key].developer_status,
// //                 priority: temp[key].priority,
// //                 severity: temp[key].severity,

// //               })
// //               setData(null)
// //               setData(tempData);
// //             }
// //           }

// //         })
// //       }

// //     const loadData =  async () => {

// //         await new BillCheckingTransactionService()._getBillTypeDataDropdown().then((res) => {
// //             if (res.status === 200) {
// //                 if (res.data.status == 1) {
// //                     setBillType(res.data.data)
// //                     setDeta(res.data.data)
// //                     setBillTypeDropdown(res.data.data.map(d => ({ value: d.id, label: d.bill_type })))

// //                 }
// //             }
// //         })

// //         await new BillCheckingTransactionService().getBillCreateAuthority().then((res) => {
// //             if (res.status === 200) {
// //                 if (res.data.status == 1) {
// //                     setAuthority(res.data.access)

// //                 }
// //             }
// //         })

// //         await new BillCheckingTransactionService().getSectionDropdown().then((res) => {
// //             if (res.status === 200) {
// //                 if (res.data.status == 1) {
// //                     setSectionDropdown(res.data.data.map(d => ({ value: d.id, label: d.section_name })))
// //                     setConstitutionDropdown(res.data.data.map(d => ({ value: d.id, label: d.constitution_name })))
// //                 }
// //             }
// //         })

// //         await new BillCheckingTransactionService().getVendorsDropdown().then((res) => {
// //             if (res.status === 200) {
// //                 if (res.data.status == 1) {
// //                     setVendor(res.data.data)
// //                     setVendorDropdown(res.data.data.map(d => ({
// //                         value: d.id, label: d.vendor_name
// //                     })))
// //                 }
// //             }
// //         })

// //         await new DepartmentService().getDepartment().then((res) => {
// //             if (res.status === 200) {
// //                 if (res.data.status == 1) {
// //                     setDepartment(res.data.data)
// //                     setDepartmentDropdown(res.data.data.map(d => ({ value: d.id, label: d.department })))
// //                 }
// //             }
// //         })

// //         await new UserService().getUser().then((res) => {
// //             if (res.status === 200) {
// //                 if (res.data.status == 1) {
// //                     setUser(res.data.data)
// //                     setUserDropdown(res.data.data.map(d => ({ value: d.id, label: d.user_name })))
// //                 }
// //             }
// //         })

// //     }

// //     const handleModal = (data) => {
// //         setModal(data);
// //     }
// //     const handleImageClick = (e) => {
// //         setModal({ showModal: true, modalData: "", modalHeader: "" })
// //     }

// //     const handleForm = async (e) => {
// //         e.preventDefault();

// //         const form = new FormData(e.target);
// //         setNotify(null)
// //         form.delete("attachment[]");

// //         if (selectedFiles) {
// //             for (var i = 0; i < selectedFiles.length; i++) {
// //                 form.append('attachment[' + i + ']', selectedFiles[i].file);
// //             }
// //         }

// //         await new BillCheckingTransactionService().createData(form).then(res => {

// //             if (res.status === 200) {
// //                 if (res.data.status === 1) {
// //                     history({
// //                         pathname: `/${_base}/BillCheckingTransaction`,
// //                         state: { alert: { type: 'success', message: res.data.message } }
// //                     });
// //                     loadData();
// //                 } else {
// //                     setNotify({ type: 'danger', message: res.data.message });
// //                 }
// //             } else {
// //                 setNotify({ type: 'danger', message: res.data.message })
// //                 new ErrorLogService().sendErrorLog("BillCheckingTransaction", "BillCheckingTransaction", "INSERT", res.message);
// //             }
// //         })
// //             .catch(error => {
// //                 const { response } = error;
// //                 const { request, ...errorObject } = response;
// //                 setNotify({ type: 'danger', message: "Request Error !!!" })
// //                 new ErrorLogService().sendErrorLog("BillCheckingTransaction", "BillCheckingTransaction", "INSERT", errorObject.data.message);
// //             })
// //     }

// //     const fileInputRef = useRef(null);
// //     const handleShowFiles = (e) => {

// //         const selectedFiles = e.target.files
// //         const selectedFilesArray = Array.from(selectedFiles)

// //         const imagesArray = selectedFilesArray.map((file) => {
// //             return (
// //                 URL.createObjectURL(file)
// //             )
// //         })
// //         setShowFiles(imagesArray)
// //         // e.preventDefault();
// //         // var fileObj = [];
// //         // var fileArray = [];
// //         // fileObj.push(e.target.files)
// //         // document.getElementById("imgTest").innerHTML = "";
// //         // for (let i = 0; i < fileObj[0].length; i++) {
// //         //     fileArray.push(URL.createObjectURL(fileObj[0][i]))
// //         //     // encodeImageFileAsURL(i)
// //         // }
// //         // setShowFiles({ fileArray })
// //     }
// //     const [igst, setIgst] = useState(false)
// //     const[gstType, setGstType]= useState(false)
// //     const handleIgst = (e, type) => {

// //         if (e.target.checked) {
// //             setIgst(e.target.checked)
// //             setGstType(true)
// //         } else {
// //             setIgst(e.target.checked = false)
// //             setGstType((prev)=> null)
// //             setGstType(false)

// //         }
// //     }

// //     const date = new Date();
// //     const futureDate = date.getDate();
// //     date.setDate(futureDate);
// //     const defaultValue = date.toLocaleDateString('en-CA');

// //     useEffect(() => {
// //         loadData();
// //     }, [])

// //     useEffect(() => {
// //         var tdsAmount = 0
// //         if (tdsAmount >= 0) {
// //             tdsAmount = parseFloat(taxable ? taxable : 0) * parseFloat(tdsPercentage ? tdsPercentage : 0) / 100
// //             setTdsAmount(Math.ceil(tdsAmount));
// //         }

// //     }, [billAmount, tdsPercentage])

// //     useEffect(() => {
// //         var billAmount = parseFloat(taxable ? taxable : 0) + parseFloat(gst ? gst : 0) + parseFloat(roundOff ? roundOff : 0) + parseFloat(tcs ? tcs : 0)
// //         if (billAmount) {

// //             setBillAmount(parseFloat(billAmount).toFixed(2))
// //         }

// //         {console.log("billAmount",billAmount)}

// //     }, [taxable, gst, roundOff, tcs, billAmount, tdsPercentage])

// //     useEffect(() => {
// //         var netPayment = 0
// //         netPayment = parseFloat(billAmount ? billAmount : 0) - (parseFloat(debit ? debit : 0))
// //         setNetPayment(Math.round(netPayment))
// //         if (tdsAmount > 0) {
// //             netPayment = netPayment - parseFloat(tdsAmount)
// //             setNetPayment(Math.round(netPayment));

// //         }
// //         if (netPayment >= 0) {
// //             setNetPayment(Math.round(netPayment));
// //             setNetInWords(prev => numWords(netInWords));
// //         }
// //     }, [billAmount, debit, tdsAmount, netPayment, tdsPercentage])
// //     const loadAttachment = async () => {
// //         setNotify(null);
// //         if (id) {
// //             await getAttachment(id, "BILL_CHECK").then(res => {
// //                 if (res.status === 200) {
// //                     setAttachment(null);
// //                     setAttachment(res.data.data);
// //                 }
// //             })
// //         } else {
// //             setAttachment(null);
// //         }
// //     }

// //     const [selectedFiles,setSelectedFiles] = useState();
// //     const uploadAttachmentHandler = (e, type, id = null) => {
// //         if (type === "UPLOAD") {
// //             var tempSelectedFile = [];
// //             for (var i = 0; i < e.target.files.length; i++) {
// //                 tempSelectedFile.push({ file: e.target.files[i], fileName: e.target.files[i].name, tempUrl: URL.createObjectURL(e.target.files[i]) });
// //             }
// //             setSelectedFiles(tempSelectedFile);
// //         } else if (type === "DELETE") {
// //             let filteredFileArray = selectedFiles.filter((item, index) => id !== index);
// //             setSelectedFiles(filteredFileArray);
// //         }
// //     }
// //     const handleDeleteAttachment = (e, id) => {
// //         deleteAttachment(id).then((res) => {
// //             if (res.status === 200) {
// //                 loadAttachment();
// //             }
// //         })
// //     }

// //     return (
// //         <div className="container-xxl">
// //             {notify && <Alert alertData={notify} />}

// //             <PageHeader />

// //             <div className="row clearfix g-3">
// //                 <div className="col-sm-12">
// //                     <form method="POST" onSubmit={e => handleForm(e)}>
// //                         {/* ********* MAIN DATA ********* */}
// //                         <div className='card mt-2'>
// //                             <div className='card-header bg-primary text-white p-2'>
// //                                 <h5>Add Data</h5>
// //                             </div>

// //                             <div className='card-body'>

// //                                 <div className="form-group row ">
// //                                     <div className="col-md-3">
// //                                         <label className=" col-form-label">
// //                                             <b>Bill Type : <Astrick color="red" size="13px" /></b>
// //                                         </label>

// //                                         {billTypeDropdown &&
// //                                             <Select
// //                                                 type="text"
// //                                                 className="form-control form-control"
// //                                                 options={billTypeDropdown}
// //                                                 onChange={e => handleAssignToPerson(e)}
// //                                                 id="bill_type"
// //                                                 name="bill_type"
// //                                                 placeholder="Bill Type"
// //                                                 required
// //                                             />
// //                                         }
// //                                     </div>

// //                                     <div className="col-md-3">
// //                                         <label className="col-form-label">
// //                                             <b>Assign To : <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         {assignToDropdown &&
// //                                             <Select className="form-control form-control"
// //                                                 options={assignToDropdown}
// //                                                 id="assign_to"
// //                                                 name="assign_to"
// //                                                 placeholder="Assign To"
// //                                                 required
// //                                             />
// //                                         }
// //                                     </div>

// //                                     <div className="col-md-3">
// //                                         <label className="col-form-label">
// //                                             <b>Vendor Name : <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         {vendorDropdown &&
// //                                             <Select className="form-control form-control-sm"
// //                                                 id="vendor_name"
// //                                                 name="vendor_name"
// //                                                 options={vendorDropdown}
// //                                                 required

// //                                             />
// //                                         }
// //                                     </div>
// //                                     {/* <div className="col-md-3 ">
// //                                         <label className="col-md-4 col-form-label">
// //                                             <b>Branch Name : <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         {departmentDropdown &&
// //                                             <Select className="form-control form-control-sm"
// //                                                 id="department_name"
// //                                                 name="department_name"
// //                                                 options={departmentDropdown}
// //                                             // placeholder="Branch Name"
// //                                             // required

// //                                             />
// //                                         }
// //                                     </div> */}
// //                                 </div>

// //                                 <div className="form-group row mt-3">
// //                                     {/* <div className="col-md-3">
// //                                     <label className=" col-form-label">
// //                                         <b>Expected Bill Received Date : <Astrick color="red" size="13px" /></b>
// //                                     </label>
// //                                     <input type="date" className="form-control form-control-sm"
// //                                         id="expected_bill_received_date"
// //                                         name="expected_bill_received_date"
// //                                         // placeholder="Bill Type"
// //                                         // required
// //                                         onKeyPress={e => { Validation.CharactersOnly(e) }}
// //                                     />
// //                                     </div> */}

// //                                     <div className="col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b>Vendor Bill No : <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="text" className="form-control form-control-sm"
// //                                             id="vendor_bill_no"
// //                                             name="vendor_bill_no"
// //                                             required
// //                                             maxLength={25}
// //                                             onKeyPress={e => { Validation.CharactersNumbersSpeicalOnly(e) }}

// //                                         />
// //                                     </div>

// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b> Bill Date: <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         {authority &&
// //                                         <input type="date" className="form-control form-control-sm"
// //                                             id="bill_date"
// //                                             name="bill_date"
// //                                             min ={authority.Audit_Remark == true ? new Date().getFullYear() - 1+"-04-01":new Date().getFullYear()+"-04-01"}
// //                                             required
// //                                             // max={new Date().toISOString().split("T")[0]}

// //                                         />
// //                                     }
// //                                     </div>

// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b> Received Date: <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="date" className="form-control form-control-sm"
// //                                             id="received_date"
// //                                             name="received_date"
// //                                             value={defaultValue}
// //                                             readOnly

// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 <div className=" form-group row mt-3">
// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b> Debit Advance : <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="number"
// //                                             step="any"
// //                                             className="form-control form-control-sm"
// //                                             id="debit_advance"
// //                                             name="debit_advance"
// //                                             onChange={e => handleDebit(e)}

// //                                             required
// //                                             onKeyPress={e => { Validation.NumbersSpecialOnlyDecimal(e) }}

// //                                         />
// //                                     </div>

// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b> Taxable Amount: <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="number" className="form-control form-control-sm"
// //                                             id="taxable_amount"
// //                                             name="taxable_amount"
// //                                             step="any"
// //                                             onChange={e => handleTaxable(e)}
// //                                             defaultValue={0}

// //                                             required
// //                                             onKeyPress={e => { Validation.NumbersSpecialOnlyDecimal(e) }}

// //                                         />
// //                                     </div>

// //                                     <div className=" col ">
// //                                         <input className="sm"
// //                                             id="igst_type"
// //                                             name="igst_type"
// //                                             type="checkbox"
// //                                             onChange={e => { handleIgst(e) }}
// //                                             style={{ marginRight: "8px" }}
// //                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

// //                                         />
// //                                         <label className="col-sm-3 col-form-label">
// //                                             <b>IGST/GST :<Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         {gstType == true &&
// //                                         <input type="number" className="form-control form-control-sm"
// //                                             id="igst_amount"
// //                                             name="igst_amount"
// //                                             step="any"
// //                                             required
// //                                             onChange={handleGst}
// //                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

// //                                         />
// //                                             }
// //                                      {gstType == false &&
// //                                          <input type="number" className="form-control form-control-sm"
// //                                             id="gst_amount"
// //                                             name="gst_amount"
// //                                             step="any"
// //                                             required
// //                                              onChange={handleGst}
// //                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

// //                                         />
// //                                         }
// //                                     </div>

// //                                     <div className=" col ">
// //                                         <label className="col-sm-3 col-form-label">
// //                                             <b> Round Off: </b>
// //                                         </label>
// //                                         <input type="number" className="form-control form-control-sm"
// //                                             id="round_off"
// //                                             name="round_off"
// //                                             step="any"
// //                                             onChange={e => { handleRoundOff(e) }}
// //                                             // required
// //                                             defaultValue={0}

// //                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 <div className=" form-group row mt-3 ">
// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b> TCS: <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="number" className="form-control form-control-sm"
// //                                             id="tcs"
// //                                             name="tcs"
// //                                             step="any"
// //                                             onChange={e => { handleTcs(e) }}
// //                                             required
// //                                              defaultValue={0}

// //                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

// //                                         />
// //                                     </div>

// //                                     <div className=" col-md-3 ">
// //                                         <label className="col-form-label">
// //                                             <b> Bill Amount: <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="number" className="form-control form-control-sm"
// //                                             id="bill_amount"
// //                                             name="bill_amount"
// //                                             value={billAmount}
// //                                              defaultValue={0}

// //                                             readOnly={true}
// //                                         />
// //                                     </div>

// //                                     <div className=" col-md-2 mt-4">
// //                                         <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
// //                                             id="is_tds_applicable"
// //                                             name="is_tds_applicable"
// //                                             onChange={e => handleTdsApplicable(e)}
// //                                         />
// //                                         <label className="col-form-label">
// //                                             <b>TDS Applicable:</b>
// //                                         </label>
// //                                     </div>
// //                                     <div className=" col-md mt-4">
// //                                         {authority &&
// //                                             <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
// //                                                 id="is_tcs_applicable"
// //                                                 name="is_tcs_applicable"
// //                                                 disabled={authority.TCS_Applicable === false ? true : false}

// //                                             />
// //                                         }
// //                                         <label className="col-form-label">
// //                                             <b>TCS Applicable:</b>
// //                                         </label>
// //                                     </div>

// //                                     <div className=" col-md mt-4">

// //                                         <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
// //                                             id="is_original_bill_needed"
// //                                             name="is_original_bill_needed"
// //                                             disabled={data && data.access.Update_Bill ? false : true}
// //                                         />
// //                                         <label className="col-form-label">
// //                                             <b>Original Bill Needed</b>
// //                                         </label>
// //                                     </div>

// //                                 </div>

// //                                 {showTdsFileds && <div className=" form-group row mt-3 ">
// //                                     <div className="col-md-3  ">
// //                                         <label className="col-form-label">
// //                                             <b>TDS section : </b>
// //                                         </label>
// //                                         {sectionDropdown &&
// //                                             <Select type="text" className="form-control form-control-sm"
// //                                                 id="tds_section"
// //                                                 name="tds_section"
// //                                                 options={sectionDropdown}
// //                                                 ref={sectionRef}
// //                                                 onChange={e => handleSectionDropDownChange(e)}
// //                                             />
// //                                         }

// //                                     </div>

// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b>TDS Constitution : </b>
// //                                         </label>
// //                                         {tdsData && tdsData.length > 0 && <span>
// //                                             {constitutionDropdown &&
// //                                                 <Select
// //                                                     id="tds_constitution"
// //                                                     name="tds_constitution"
// //                                                     options={constitutionDropdown ? constitutionDropdown : null}
// //                                                     onChange={handleTdsPercentage}
// //                                                 />
// //                                             }
// //                                         </span>
// //                                         }

// //                                         {(!tdsData || tdsData.length == 0) && <span>
// //                                             {constitutionDropdown &&
// //                                                 <Select type="text" className="form-control form-control-sm"
// //                                                     id="tds_constitution"
// //                                                     name="tds_constitution"
// //                                                     options={constitutionDropdown ? constitutionDropdown : null}
// //                                                     onChange={handleTdsPercentage}
// //                                                 />
// //                                             }
// //                                         </span>
// //                                         }

// //                                     </div>

// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b>TDS Amount : <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="text" className="form-control form-control-sm"
// //                                             id="tds_amount"
// //                                             name="tds_amount"
// //                                             value={tdsAmount}
// //                                             defaultValue={0}
// //                                             readOnly={true}
// //                                         />
// //                                     </div>

// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b>TDS % : <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="text" className="form-control form-control-sm"
// //                                             id="tds_percentage"
// //                                             name="tds_percentage"
// //                                             defaultValue={tdsPercentage}
// //                                             readOnly
// //                                             ref={tdsPercentageRef}
// //                                             onChange={e => handleTds(e)}
// //                                         />
// //                                     </div>
// //                                 </div>
// //                                 }

// //                                 <div className=" form-group row mt-3 ">
// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b> Net Payment : <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="text" className="form-control form-control-sm"
// //                                             id="net_payment"
// //                                             name="net_payment"
// //                                             value={netPayment}

// //                                         // required
// //                                         />
// //                                         {/* <input type="text" className="form-control form-control-sm"
// //                                             value={numWords(netPayment).toUpperCase() + " ONLY"}
// //                                             style={{ border: "none", color: "red", fontSize: "12px", fontWeight: "bold", width: "100% !important", background: "white" }}
// //                                             readOnly
// //                                         /> */}

// //                                     </div>

// //                                     {/* <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b> Net Payment In Words: <Astrick color="red" size="13px" /></b>
// //                                         </label>
// //                                         <input type="text" className="form-control form-control-sm"
// //                                             id="net_payment_in_word"
// //                                             name="net_payment_in_word"
// //                                             // onChange ={e=>handleAmountWords(e)}

// //                                         />
// //                                     </div> */}

// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b> Remark:</b>
// //                                         </label>
// //                                         <textarea type="text" className="form-control form-control-sm"
// //                                             id="remark"
// //                                             name="remark"
// //                                             rows="4"
// //                                         />
// //                                     </div>

// //                                     <div className=" col-md-3 ">
// //                                         <label className=" col-form-label">
// //                                             <b> Audit Remark: </b>
// //                                         </label>
// //                                         {authority &&
// //                                             <textarea type="text" className="form-control form-control-sm"
// //                                                 id="audit_remark"
// //                                                 name="audit_remark"
// //                                                 rows="4"
// //                                                 readOnly={authority.Audit_Remark === false ? true : false}
// //                                             />
// //                                         }
// //                                     </div>
// //                                 </div>

// //                                 {/* <div className=" col-md-3 ">
// //                                     <label className=" col-form-label">
// //                                         <b> Invoice Attachment: <Astrick color="red" size="13px" /></b>
// //                                     </label>
// //                                     <input type="file" className="form-control form-control-sm"
// //                                         id="attachment"
// //                                         name="attachment[]"
// //                                         onChange={e => handleShowFiles(e)}
// //                                         multiple
// //                                         ref={fileInputRef}
// //                                         rows="4"
// //                                     />
// //                                 </div>
// //                                 <div className="d-flex justify-content-start">
// //                                         {showFiles && showFiles.map((image, i) => {
// //                                             return <div key={Math.random()} className="" style={{height:"200px",width:"300px",marginLeft:"20px !important"}}>
// //                                                 <img className="col-md mt-2" src={image} width="100%" height="100%" onClick={e =>handleImageClick(e, 'UPLOAD')} />
// //                                                      <button className ="btn btn p-0 mt-2" style={{marginLeft:"50%"}}onClick={() => {
// //                                                     setShowFiles(showFiles.filter(d => d !== image))
// //                                                 }}>

// //                                              <i className="icofont-close-line" style={{fontWeight:"bold" , fontSize:"20px"}} ></i>
// //                                                 </button>

// //                                             </div>
// //                                         })}
// //                                     </div> */}

// //                                 <div className='card mt-2'>
// //                                     <div className='card-body'>
// //                                         <div className="col-sm-4 mt-3">
// //                                             <label className=" col-form-label">
// //                                                 <b>Upload Attachment :<Astrick color="red" size="13px" /> </b>
// //                                             </label>
// //                                             <input type="file"
// //                                                 id="attachment"
// //                                                 name="attachment[]"
// //                                                 ref={fileInputRef}
// //                                                 multiple
// //                                                 required
// //                                                 onChange={(e) => { uploadAttachmentHandler(e, "UPLOAD", '') }}
// //                                             />
// //                                         </div>
// //                                     </div>
// //                                     {/* <Attachment
// //                                             data={attachment}
// //                                             refId={id}
// //                                             handleAttachment={handleAttachment}
// //                                         /> */}
// //                                 </div>
// //                                 <div className="d-flex">
// //                                     {selectedFiles && selectedFiles.map((attachment, index) => {
// //                                         return <div key={index} className="justify-content-start"
// //                                             style={{ marginRight: '20px', padding: '5px', maxWidth: '250px' }}>
// //                                             <div className="card" style={{ backgroundColor: '#EBF5FB' }}>
// //                                                 <div className="card-header">
// //                                                     <span>
// //                                                         {attachment.fileName}
// //                                                     </span>

// //                                                     {/* <img src={attachment.tempUrl}
// //                                                             style={{height: '100%', width: '100%'}}
// //                                                         /> * */}
// //                                                     <div className="d-flex justify-content-between p-0 mt-1">
// //                                                         <a href={`${attachment.tempUrl}`}
// //                                                             target='_blank'
// //                                                             className='btn btn-warning btn-sm p-0 px-1'>
// //                                                             <i class="icofont-ui-zoom-out"></i>
// //                                                         </a>
// //                                                         <button className='btn btn-danger text-white btn-sm p-1'
// //                                                             type="button"
// //                                                             onClick={e => {
// //                                                                 uploadAttachmentHandler(e, "DELETE", index)
// //                                                             }}
// // >

// //                                                             <i class="icofont-ui-delete" style={{ fontSize: '15px' }}></i>
// //                                                         </button>
// //                                                     </div>
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     })}
// //                                 </div>

// //                                 {/* <div className="col-sm-6 mt-4">
// //                                     <label className="form-label font-weight-bold">Status :<Astrick color="red" size="13px" /></label>
// //                                     <div className="row">
// //                                         <div className="col-md-2">
// //                                             <div className="form-check">
// //                                                 <input className="form-check-input" type="radio" name="is_active" id="is_active"
// //                                                     value="1"
// //                                                     defaultChecked={true}

// //                                                 />
// //                                                 <label className="form-check-label" htmlFor="is_active_1">
// //                                                     Active
// //                                                 </label>
// //                                             </div>
// //                                         </div>
// //                                         <div className="col-md-1">
// //                                             <div className="form-check">
// //                                                 <input className="form-check-input" type="radio" name="is_active" id="is_active" value="0"
// //                                                 // readOnly={(modal.modalData) ? false : true}
// //                                                 />
// //                                                 <label className="form-check-label" htmlFor="is_active">
// //                                                     Deactive
// //                                                 </label>
// //                                             </div>
// //                                         </div>
// //                                     </div>

// //                                 </div> */}
// //                             </div>
// //                         </div>
// //                         {/* CARD */}

// //                         <div className="mt-3" style={{ 'textAlign': 'right' }}>
// //                             <button type="submit" className="btn btn-primary">
// //                                 Save
// //                             </button>
// //                             <Link to={`/${_base}/BillCheckingTransaction`}
// //                                 className="btn btn-danger text-white">
// //                                 Close
// //                             </Link>
// //                         </div>
// //                     </form>
// //                     <Modal size="xl" centered show={modal.showModal}
// //                         onHide={(e) => {
// //                             handleModal({
// //                                 showModal: false,
// //                                 modalData: "",
// //                                 modalHeader: ""
// //                             })
// //                         }}>
// //                         <Modal.Header closeButton />
// //                         <Modal.Body style={{ alignItems: "center" }}>

// //                             {showFiles && showFiles.map((d, i) => {
// //                                 return (
// //                                     <div className="row">
// //                                         <img className="col-md mt-2" src={d} />
// //                                     </div>
// //                                 )
// //                             })}

// //                         </Modal.Body>

// //                     </Modal>

// //                 </div>

// //             </div>

// //         </div>
// //     )
// // }

// import React, { useEffect, useState, useRef } from "react";
// import { Link, useHistory } from "react-router-dom";
// import { Modal } from "react-bootstrap";
// import ErrorLogService from "../../../services/ErrorLogService";

// import PageHeader from "../../../components/Common/PageHeader";
// import Alert from "../../../components/Common/Alert";
// import { Astrick } from "../../../components/Utilities/Style";
// import * as Validation from "../../../components/Utilities/Validation";
// import { _base, userSessionData } from "../../../settings/constants";
// import { _attachmentUrl } from "../../../settings/constants";
// import {
//   getAttachment,
//   deleteAttachment,
// } from "../../../services/OtherService/AttachmentService";
// import Select from "react-select";
// import DropdownService from "../../../services/Bill Checking/Bill Checking Transaction/DropdownService";
// import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
// import DepartmentService from "../../../services/MastersService/DepartmentService";
// import UserService from "../../../services/MastersService/UserService";
// import numWords from "num-words";
// import BillTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
// import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";

// export default function CreateBillCheckingTransaction({ match }) {
//   const id = match.params.id;

//   const [modal, setModal] = useState({
//     showModal: false,
//     modalData: "",
//     modalHeader: "",
//   });
//   const history = useHistory();
//   const [notify, setNotify] = useState(null);
//   const [data, setData] = useState(null);
//   const [customerType, setCustomerType] = useState(null);
//   const [dependent, setDependent] = useState({
//     country_id: null,
//     state_id: null,
//   });
//   const [attachment, setAttachment] = useState();
//   const [billType, setBillType] = useState(null);
//   const [billTypeDropdown, setBillTypeDropdown] = useState(null);
//   const [vendor, setVendor] = useState(null);
//   const [vendorDropdown, setVendorDropdown] = useState(null);
//   const [department, setDepartment] = useState(null);
//   const [departmentDropdown, setDepartmentDropdown] = useState(null);
//   const [cityDropdown, setCityDropdown] = useState(null);
//   const [user, setUser] = useState(null);
//   const [userDropdown, setUserDropdown] = useState(null);

//   const [constitution, setConstitution] = useState();
//   const [constitutionDropdown, setConstitutionDropdown] = useState();

//   const [sectionDropdown, setSectionDropdown] = useState();
//   const [tdsPercentage, setTdsPercentage] = useState();

//   const [billAmount, setBillAmount] = useState(0);
//   const [netPayment, setNetPayment] = useState(null);

//   const [tdsAmount, setTdsAmount] = useState(null);

//   const [tdsData, setTdsData] = useState(null);

//   const roleId = sessionStorage.getItem("role_id");
//   const [checkRole, setCheckRole] = useState(null);

//   const sectionRef = useRef();
//   const tdsPercentageRef = useRef();
//   // const resetSectionHandle = () =>{
//   //     sectionRef.current.reset();
//   // }

//   const handleTdsChange = (e) => {
//     setTdsData([e.target.value]);
//   };
//   const [showTdsFileds, setShowTdsFileds] = useState(false);
//   const handleTdsApplicable = (e) => {
//     if (e.target.checked) {
//       setShowTdsFileds(e.target.checked);
//     } else {
//       setShowTdsFileds((e.target.checked = false));
//       sectionRef.current.value = "";
//       setTdsPercentage(null);
//       setTdsAmount(0);
//     }
//   };

//   const [showTcsFileds, setShowTcsFileds] = useState(false);

//   const [isTcsApplicable, setIsTcsApplicable] = useState(false);

//   // Step 2: Create an event handler to update the state
//   const handleTcsApplicable = (e) => {
//     setIsTcsApplicable(e.target.checked);
//   };

//   const [netInWords, setNetInWords] = useState();
//   const handleAmountWords = (e) => {
//     setNetInWords(null);
//     setNetInWords(numWords(netPayment));
//   };

//   const [debit, setDebit] = useState();
//   const [taxable, setTaxable] = useState();
//   const [gst, setGst] = useState();
//   const [roundOff, setRoundOff] = useState();
//   const [tcs, setTcs] = useState();
//   const [tds, setTds] = useState();
//   const [tdsPercent, setTdsPercent] = useState();
//   const [deta, setDeta] = useState();
//   const [showFiles, setShowFiles] = useState();
//   const [authority, setAuthority] = useState();

//   const handleTaxable = (e) => {
//     setTaxable(e.target.value);
//   };
//   const handleGst = (e) => {
//     setGst(e.target.value);
//   };
//   const handleRoundOff = (e) => {
//     setRoundOff(e.target.value);
//   };
//   const handleTcs = (e) => {
//     setTcs(e.target.value);
//   };

//   const handleTds = (e) => {
//     setTdsPercent(e.target.value);
//   };
//   const handleDebit = (e) => {
//     setDebit(e.target.value);
//   };

//   const handleTdsPercentage = (e) => {
//     const selectedContition = constitution.filter((d) => d.id === e.value);
//     setTdsPercentage(selectedContition[0].percentage);
//   };

//   const handleSectionDropDownChange = async (e) => {
//     await new BillCheckingTransactionService()
//       .getSectionMappingDropdown(e.value)
//       .then((res) => {
//         if (res.status === 200) {
//           if (res.data.status == 1) {
//             setTdsPercentage(0);
//             setConstitutionDropdown(null);
//             setConstitution(res.data.data);
//             setConstitutionDropdown(
//               res.data.data.map((d) => ({
//                 value: d.id,
//                 label: d.constitution_name,
//               }))
//             );
//           }
//         }
//       });
//   };

//   const [assignTo, setAssignTo] = useState();
//   const [assignToDropdown, setAssignToDropdown] = useState();

//   const handleAssignToPerson = async (e) => {
//     await new DropdownService().getMappedEmp(e.value).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           setAssignTo(res.data.data);
//           setAssignToDropdown(null);
//           setAssignToDropdown(
//             res.data.data.map((d) => ({ value: d.id, label: d.employee_name }))
//           );
//         }
//       }
//     });
//   };

//   const handleReset = () => { };
//   const handleFilter = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     await new BillTransactionService()
//       .getBillCheckData(formData)
//       .then((res) => {
//         if (res.status === 200) {
//           const tempData = [];
//           let counter = 1;
//           const temp = res.data.data;
//           for (const key in temp) {
//             tempData.push({
//               id: counter++,
//               task_name: temp[key].task_name,
//               tester_status: temp[key].tester_status,
//               ba_status: temp[key].ba_status,
//               developer_status: temp[key].developer_status,
//               priority: temp[key].priority,
//               severity: temp[key].severity,
//             });
//             setData(null);
//             setData(tempData);
//           }
//         }
//       });
//   };

//   const loadData = async () => {
//     await new BillCheckingTransactionService()
//       ._getBillTypeDataDropdown()
//       .then((res) => {
//         if (res.status === 200) {
//           if (res.data.status == 1) {
//             setBillType(res.data.data);
//             setDeta(res.data.data);
//             setBillTypeDropdown(
//               res.data.data.map((d) => ({ value: d.id, label: d.bill_type }))
//             );
//           }
//         }
//       });

//     await new BillCheckingTransactionService()
//       .getBillCreateAuthority()
//       .then((res) => {
//         if (res.status === 200) {
//           if (res.data.status == 1) {
//             setAuthority(res.data.access);
//           }
//         }
//       });

//     await new ManageMenuService().getRole(roleId).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           const getRoleId = sessionStorage.getItem("role_id");
//           setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//         }
//       }
//     });

//     await new BillCheckingTransactionService()
//       .getSectionDropdown()
//       .then((res) => {
//         if (res.status === 200) {
//           if (res.data.status == 1) {
//             setSectionDropdown(
//               res.data.data.map((d) => ({ value: d.id, label: d.section_name }))
//             );
//             setConstitutionDropdown(
//               res.data.data.map((d) => ({
//                 value: d.id,
//                 label: d.constitution_name,
//               }))
//             );
//           }
//         }
//       });

//     await new BillCheckingTransactionService()
//       .getVendorsDropdown()
//       .then((res) => {
//         if (res.status === 200) {
//           if (res.data.status == 1) {
//             const temp = res.data.data.filter(d => d.is_active == 1)
//             setVendor(res.data.data);
//             setVendorDropdown(
//               temp.map((d) => ({
//                 value: d.id,
//                 label: d.vendor_name,
//               }))
//             );
//           }
//         }
//       });

//     await new DepartmentService().getDepartment().then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           setDepartment(res.data.data);
//           setDepartmentDropdown(
//             res.data.data.map((d) => ({ value: d.id, label: d.department }))
//           );
//         }
//       }
//     });

//     await new UserService().getUser().then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           const temp = res.data.data.filter(d => d.is_active == 1)
//           setUser(res.data.data);
//           setUserDropdown(
//             temp.map((d) => ({ value: d.id, label: d.user_name }))
//           );
//         }
//       }
//     });
//   };

//   const handleModal = (data) => {
//     setModal(data);
//   };
//   const handleImageClick = (e) => {
//     setModal({ showModal: true, modalData: "", modalHeader: "" });
//   };

//   const handleForm = async (e) => {
//     e.preventDefault();

//     const form = new FormData(e.target);
//     setNotify(null);
//     form.delete("attachment[]");

//     if (selectedFiles) {
//       for (var i = 0; i < selectedFiles.length; i++) {
//         form.append("attachment[" + i + "]", selectedFiles[i].file);
//       }
//     }
//     await new BillCheckingTransactionService()
//       .createData(form)
//       .then((res) => {
//         if (res.status === 200) {
//           if (res.data.status === 1) {
//             history({
//               pathname: `/${_base}/BillCheckingTransaction`,
//               state: { alert: { type: "success", message: res.data.message } },
//             });
//             loadData();
//           } else {
//             setNotify({ type: "danger", message: res.data.message });
//           }
//         } else {
//           setNotify({ type: "danger", message: res.data.message });
//           new ErrorLogService().sendErrorLog(
//             "BillCheckingTransaction",
//             "BillCheckingTransaction",
//             "INSERT",
//             res.message
//           );
//         }
//       })
//       .catch((error) => {
//         const { response } = error;
//         const { request, ...errorObject } = response;
//         setNotify({ type: "danger", message: "Request Error !!!" });
//         new ErrorLogService().sendErrorLog(
//           "BillCheckingTransaction",
//           "BillCheckingTransaction",
//           "INSERT",
//           errorObject.data.message
//         );
//       });
//   };

//   const fileInputRef = useRef(null);
//   const handleShowFiles = (e) => {
//     const selectedFiles = e.target.files;
//     const selectedFilesArray = Array.from(selectedFiles);

//     const imagesArray = selectedFilesArray.map((file) => {
//       return URL.createObjectURL(file);
//     });
//     setShowFiles(imagesArray);
//     // e.preventDefault();
//     // var fileObj = [];
//     // var fileArray = [];
//     // fileObj.push(e.target.files)
//     // document.getElementById("imgTest").innerHTML = "";
//     // for (let i = 0; i < fileObj[0].length; i++) {
//     //     fileArray.push(URL.createObjectURL(fileObj[0][i]))
//     //     // encodeImageFileAsURL(i)
//     // }
//     // setShowFiles({ fileArray })
//   };
//   const [igst, setIgst] = useState(false);
//   const handleIgst = (e) => {
//     if (e.target.checked) {
//       setIgst(e.target.checked);
//     } else {
//       setIgst((e.target.checked = false));
//     }
//   };

//   const date = new Date();
//   const futureDate = date.getDate();
//   date.setDate(futureDate);
//   const defaultValue = date.toLocaleDateString("en-CA");

//   useEffect(() => {
//     loadData();
//   }, []);

//   useEffect(() => {
//     var tdsAmount = 0;
//     if (tdsAmount >= 0) {
//       tdsAmount =
//         (parseFloat(taxable ? taxable : 0) *
//           parseFloat(tdsPercentage ? tdsPercentage : 0)) /
//         100;
//       setTdsAmount(Math.ceil(tdsAmount));
//     }
//   }, [billAmount, tdsPercentage]);

//   useEffect(() => {
//     var billAmount =
//       parseFloat(taxable ? taxable : 0) +
//       parseFloat(gst ? gst : 0) +
//       parseFloat(roundOff ? roundOff : 0) +
//       parseFloat(tcs ? tcs : 0);
//     if (billAmount) {
//       setBillAmount(parseFloat(billAmount).toFixed(2));
//     }
//   }, [taxable, gst, roundOff, tcs, billAmount, tdsPercentage]);

//   const loadAttachment = async () => {
//     setNotify(null);
//     if (id) {
//       await getAttachment(id, "BILL_CHECK").then((res) => {
//         if (res.status === 200) {
//           setAttachment(null);
//           setAttachment(res.data.data);
//         }
//       });
//     } else {
//       setAttachment(null);
//     }
//   };

//   const [selectedFiles, setSelectedFiles] = useState([]);
//   // const uploadAttachmentHandler = (e, type, id = null) => {
//   //   if (type === "UPLOAD") {
//   //     var tempSelectedFile = [];
//   //     for (var i = 0; i < e.target.files.length; i++) {
//   //       tempSelectedFile.push({
//   //         file: e.target.files[i],
//   //         fileName: e.target.files[i].name,
//   //         tempUrl: URL.createObjectURL(e.target.files[i]),
//   //       });
//   //     }
//   //     setSelectedFiles(tempSelectedFile);
//   //   } else if (type === "DELETE") {
//   //     let filteredFileArray = selectedFiles.filter(
//   //       (item, index) => id !== index
//   //     );
//   //     setSelectedFiles(filteredFileArray);
//   //   }
//   //     e.target.value= ""
//   // };

//   // const uploadAttachmentHandler = (e, type, id = null) => {
//   //   if (type === "UPLOAD") {
//   //     var tempSelectedFile = [...selectedFiles]; // Create a copy of the existing files
//   //     for (var i = 0; i < e.target.files.length; i++) {
//   //       tempSelectedFile.push({
//   //         file: e.target.files[i],
//   //         fileName: e.target.files[i].name,
//   //         tempUrl: URL.createObjectURL(e.target.files[i]),
//   //       });
//   //     }
//   //     setSelectedFiles(tempSelectedFile);
//   //   } else if (type === "DELETE") {
//   //     let filteredFileArray = selectedFiles.filter((item, index) => id !== index);
//   //     setSelectedFiles(filteredFileArray);
//   //   }
//   //   e.target.value = "";
//   // };

//   const validFileTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

//   const uploadAttachmentHandler = (e, type, id = null) => {
//     if (type === "UPLOAD") {
//       var tempSelectedFile = [...selectedFiles]; // Create a copy of the existing files

//       // Check if the total number of files will not exceed 10
//       if (tempSelectedFile.length + e.target.files.length <= 10) {
//         for (var i = 0; i < e.target.files.length; i++) {
//           const file = e.target.files[i];
//           const fileType = file.type;

//           // Check if the file type is valid (PNG, JPG, JPEG, or PDF)
//           if (validFileTypes.includes(fileType)) {
//             tempSelectedFile.push({
//               file: file,
//               fileName: file.name,
//               tempUrl: URL.createObjectURL(file),
//             });
//           } else {
//             // Handle the case where an invalid file type is selected (e.g., show an error message)
//             alert("Invalid file type. Please select PNG, JPG, JPEG, or PDF files.");
//           }
//         }
//         setSelectedFiles(tempSelectedFile);
//       } else {
//         // Handle the case where the maximum number of files is exceeded (e.g., show an error message)
//         alert("Maximum 10 files can be uploaded.");
//       }
//     } else if (type === "DELETE") {
//       let filteredFileArray = selectedFiles.filter((item, index) => id !== index);
//       setSelectedFiles(filteredFileArray);
//     }
//     e.target.value = "";
//   };

//   const handleDeleteAttachment = (e, id) => {

//     // deleteAttachment(id).then((res) => {
//     //   if (res.status === 200) {
//     setSelectedFiles(prevSelectedFiles => prevSelectedFiles.filter((item, index) => id !== index));
//     loadAttachment();
//     // }
//     // });
//   };

//   // maximum length check for attachments
//   const maxLengthCheck = (e) => {
//     if (e.target.files.length > 5) {
//       alert("You Can Upload Only 5 Attachments");
//       document.getElementById("attachment").value = null;
//     }
//   };

//   const [billAmountValues, setBillAmountValues] = useState({
//     tcs: "",
//     bill_amount: "",
//     net_payment: "",
//     debit_advance: "",
//     taxable_amount: "",
//     igst_amount: "",
//     gst_amount: "",
//     round_off: "",
//   });

//   function handleInputChange(event) {
//     const { name, value } = event.target;
//     if (/^\d+(\.\d{0,2})?$/.test(value)) {
//       // setValue(inputValue);
//       setBillAmountValues({ ...billAmountValues, [name]: value });
//     } else if (value === "") {
//       setBillAmountValues({ ...billAmountValues, [name]: "" });
//     }
//   }

//   function handleRoundOffChange(event) {
//     const { name, value } = event.target;
//     let input = value;
//     // Remove any non-numeric, decimal point, or negative sign characters
//     input = input.replace(/[^0-9.-]/g, "");
//     // Check if the input has more than one dot
//     if ((input.match(/\./g) || []).length > 1) {
//       // If so, remove all dots after the first one
//       input = input.replace(/\.(?=.*\.)/g, "");
//     }
//     // Check if the input has more than 2 decimal places
//     if (input.indexOf(".") !== -1 && input.split(".")[1].length > 2) {
//       // If so, round the input to 2 decimal places
//       input = parseFloat(input).toFixed(2);
//     }
//     // Check if the input has more than one negative sign
//     if ((input.match(/-/g) || []).length > 1) {
//       // If so, remove all negative signs after the first one
//       input = input.replace(/-(?=.*-)/g, "");
//     }
//     event.target.value = input;
//     setBillAmountValues({ ...billAmountValues, [name]: input });
//   }

//   // calculate Bill Amount value
//   const billValue =
//     parseFloat(
//       billAmountValues.taxable_amount ? billAmountValues.taxable_amount : 0
//     ) +
//     parseFloat(billAmountValues.gst_amount ? billAmountValues.gst_amount : 0) +
//     parseFloat(billAmountValues.round_off ? billAmountValues.round_off : 0) +
//     parseFloat(billAmountValues.tcs ? billAmountValues.tcs : 0);

//   const BillValue =
//     parseFloat(
//       billAmountValues.taxable_amount ? billAmountValues.taxable_amount : 0
//     ) +
//     parseFloat(billAmountValues.gst_amount ? billAmountValues.gst_amount : 0) +
//     parseFloat(billAmountValues.round_off ? billAmountValues.round_off : 0)

//   const BillAmount = billValue.toFixed(2);
//   const BillAmount1 = BillValue.toFixed(2)

//   // calculate tds amount value
//   const tdsAmountValue =
//     (parseFloat(
//       billAmountValues.taxable_amount ? billAmountValues.taxable_amount : 0
//     ) *
//       parseFloat(tdsPercentage)) /
//     100;

//   const tdsValue = Math.ceil(tdsAmountValue);

//   // calculate net payment amount value
//   useEffect(() => {
//     var netPayment = 0;
//     netPayment =
//       parseFloat(BillAmount ? BillAmount : 0) -
//       parseFloat(
//         billAmountValues.debit_advance ? billAmountValues.debit_advance : 0
//       );
//     setNetPayment(Math.round(netPayment));
//     if (tdsValue > 0) {
//       netPayment = netPayment - parseFloat(tdsValue);
//       setNetPayment(Math.round(netPayment));
//     }
//     if (netPayment >= 0) {
//       setNetPayment(Math.round(netPayment));
//       setNetInWords((prev) => numWords(netInWords));
//     }
//   }, [
//     BillAmount,
//     billAmountValues.debit_advance,
//     tdsValue,
//     netPayment,
//     tdsPercentage,
//   ]);

//   useEffect(() => {
//     if (checkRole && checkRole[45].can_create === 0) {
//       // alert("Rushi")

//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
//     }
//   }, [checkRole])

//   return (
//     <div className="container-xxl">
//       {notify && <Alert alertData={notify} />}

//       <PageHeader />

//       <div className="row clearfix g-3">
//         <div className="col-sm-12">
//           <form method="POST" onSubmit={(e) => handleForm(e)}>
//             {/* ********* MAIN DATA ********* */}
//             <div className="card mt-2">
//               <div className="card-header bg-primary text-white p-2">
//                 <h5>Create Bill</h5>
//               </div>

//               <div className="card-body">
//                 <div className="form-group row ">
//                   <div className="col-md-3">
//                     <label className=" col-form-label">
//                       <b>
//                         Bill Type : <Astrick color="red" size="13px" />
//                       </b>
//                     </label>

//                     {billTypeDropdown && (
//                       <Select
//                         type="text"
//                         className="form-control form-control"
//                         options={billTypeDropdown}
//                         onChange={(e) => handleAssignToPerson(e)}
//                         id="bill_type"
//                         name="bill_type"
//                         placeholder="Bill Type"
//                         required
//                       />
//                     )}
//                   </div>

//                   <div className="col-md-3">
//                     <label className="col-form-label">
//                       <b>
//                         Assign To : <Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     {assignToDropdown && (
//                       <Select
//                         className="form-control form-control"
//                         options={assignToDropdown}
//                         id="assign_to"
//                         name="assign_to"
//                         placeholder="Assign To"
//                         required
//                       />
//                     )}
//                   </div>

//                   <div className="col-md-3">
//                     <label className="col-form-label">
//                       <b>
//                         Vendor Name : <Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     {vendorDropdown && (
//                       <Select
//                         className="form-control form-control-sm"
//                         id="vendor_name"
//                         name="vendor_name"
//                         options={vendorDropdown}
//                         required
//                       />
//                     )}
//                   </div>
//                   {/* <div className="col-md-3 ">
//                                         <label className="col-md-4 col-form-label">
//                                             <b>Branch Name : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         {departmentDropdown &&
//                                             <Select className="form-control form-control-sm"
//                                                 id="department_name"
//                                                 name="department_name"
//                                                 options={departmentDropdown}
//                                             // placeholder="Branch Name"
//                                             // required

//                                             />
//                                         }
//                                     </div> */}
//                 </div>

//                 <div className="form-group row mt-3">
//                   {/* <div className="col-md-3">
//                                     <label className=" col-form-label">
//                                         <b>Expected Bill Received Date : <Astrick color="red" size="13px" /></b>
//                                     </label>
//                                     <input type="date" className="form-control form-control-sm"
//                                         id="expected_bill_received_date"
//                                         name="expected_bill_received_date"
//                                         // placeholder="Bill Type"
//                                         // required
//                                         onKeyPress={e => { Validation.CharactersOnly(e) }}
//                                     />
//                                     </div> */}

//                   <div className="col-md-3 ">
//                     <label className=" col-form-label">
//                       <b>
//                         Vendor Bill No : <Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control form-control-sm"
//                       id="vendor_bill_no"
//                       name="vendor_bill_no"
//                       required
//                       maxLength={25}
//                       onKeyPress={(e) => {
//                         Validation.CharactersNumbersSpeicalOnly(e);
//                       }}
//                     />
//                   </div>

//                   <div className=" col-md-3 ">
//                     <label className=" col-form-label">
//                       <b>
//                         {" "}
//                         Bill Date: <Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     {authority && (
//                       <input
//                         type="date"
//                         className="form-control form-control-sm"
//                         id="bill_date"
//                         name="bill_date"
//                         // min={
//                         //   authority.Audit_Remark == true
//                         //     ? new Date().getFullYear() - 1 + "-04-01"
//                         //     : new Date().getFullYear() + "-04-01"
//                         // }
//                         min={new Date().getFullYear() + "-04-01"}
//                         required
//                       // max={new Date().toISOString().split("T")[0]}
//                       />
//                     )}
//                   </div>

//                   <div className=" col-md-3 ">
//                     <label className=" col-form-label">
//                       <b>
//                         {" "}
//                         Received Date: <Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     <input
//                       type="date"
//                       className="form-control form-control-sm"
//                       id="received_date"
//                       name="received_date"
//                       defaultValue={defaultValue}
//                       readOnly
//                     // readOnly={userSessionData.Received_Date === false ? true : false}
//                     />
//                   </div>
//                 </div>

//                 <div className=" form-group row mt-3">
//                   <div className=" col-md-3 ">
//                     <label className=" col-form-label">
//                       <b>
//                         {" "}
//                         Debit Advance: <Astrick color="red" size="13px" />
//                       </b>
//                     </label>

//                     {/* <input
//                       type="text"
//                       step="any"
//                       className="form-control form-control-sm"
//                       id="debit_advance"
//                       name="debit_advance"
//                       maxLength={13}
//                       // onChange={e => handleDebit(e)}
//                       value={billAmountValues.debit_advance}
//                       onChange={handleInputChange}
//                       // value={value} onChange={handleChange}
//                       required
//                       onKeyPress={(e) => {
//                         Validation.NumbersSpeicalOnlyDot(e);
//                       }}
//                     /> */}
//                     <input
//                       type="text"
//                       step="any"
//                       className="form-control form-control-sm"
//                       id="debit_advance"
//                       name="debit_advance"
//                       maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
//                       value={billAmountValues.debit_advance}
//                       onChange={handleInputChange}
//                       required
//                       onKeyPress={(e) => {
//                         const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];
//                         const inputValue = e.key;

//                         if (!allowedKeys.includes(inputValue)) {
//                           e.preventDefault();
//                         }

//                         const currentInput = e.target.value;
//                         const decimalIndex = currentInput.indexOf('.');

//                         if (decimalIndex !== -1 && (currentInput.length - decimalIndex) > 2) {
//                           e.preventDefault();
//                         }

//                         if (currentInput.length >= 10 && inputValue !== '.' && decimalIndex === -1) {
//                           e.preventDefault();
//                         }
//                       }}
//                     />

//                   </div>

//                   <div className=" col-md-3 ">
//                     <label className=" col-form-label">
//                       <b>
//                         {" "}
//                         Taxable Amount: <Astrick color="red" size="13px" />
//                       </b>
//                     </label>

//                     {/* <input
//                       type="number"
//                       className="form-control form-control-sm"
//                       id="taxable_amount"
//                       name="taxable_amount"
//                       step="any"
//                       maxLength={10}
//                       // onChange={e => handleTaxable(e)}
//                       value={billAmountValues.taxable_amount}
//                       onChange={handleInputChange}
//                       required
//                       onKeyPress={(e) => {
//                         Validation.NumbersSpeicalOnlyDot(e);
//                       }}

//                       onInput={(e) => {
//                         if (e.target.value.length > 13) {
//                           e.target.value = e.target.value.slice(0, 13);
//                         }
//                       }}
//                     /> */}

//                     <input
//                       type="text"
//                       className="form-control form-control-sm"
//                       id="taxable_amount"
//                       name="taxable_amount"
//                       maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
//                       value={billAmountValues.taxable_amount}
//                       onChange={handleInputChange}
//                       required
//                       onKeyPress={(e) => {
//                         const inputValue = e.key;
//                         const currentInput = e.target.value;
//                         const decimalIndex = currentInput.indexOf('.');

//                         if (!/^\d$/.test(inputValue) && inputValue !== '.' && inputValue !== 'Backspace') {
//                           e.preventDefault();
//                         }

//                         if (decimalIndex !== -1 && (currentInput.length - decimalIndex) > 2) {
//                           e.preventDefault();
//                         }

//                         if (currentInput.length >= 10 && inputValue !== '.' && decimalIndex === -1) {
//                           e.preventDefault();
//                         }
//                       }}

//                       onInput={(e) => {
//                         const value = e.target.value;
//                         const parts = value.split('.');

//                         if (parts.length > 1) {
//                           // Ensure only 2 decimal places
//                           parts[1] = parts[1].slice(0, 2);
//                         }

//                         e.target.value = parts.join('.');

//                         if (value.length > 13) {
//                           e.target.value = value.slice(0, 13);
//                         }
//                       }}
//                     />

//                   </div>

//                   <div className=" col ">
//                     <input
//                       className="sm"
//                       id="igst_amount"
//                       name="igst_amount"
//                       type="checkbox"
//                       // onChange={e => { handleIgst(e) }}
//                       value={billAmountValues.igst_amount}
//                       onChange={handleInputChange}
//                       style={{ marginRight: "8px" }}
//                       onKeyPress={(e) => {
//                         Validation.NumbersSpeicalOnlyDot(e);
//                       }}
//                     />
//                     <label className="col-sm-3 col-form-label">
//                       <b>
//                         IGST/GST :<Astrick color="red" size="13px" />
//                       </b>
//                     </label>

//                     {/* <input
//                       type="number"
//                       className="form-control form-control-sm"
//                       id="gst_amount"
//                       name="gst_amount"
//                       step="any"
//                       value={billAmountValues.gst_amount}
//                       onChange={handleInputChange}
//                       // onChange={e => { handleGst(e) }}
//                       required
//                       onKeyPress={(e) => {
//                         Validation.NumbersSpeicalOnlyDot(e);
//                       }}
//                       onInput={(e) => {
//                         if (e.target.value.length > 13) {
//                           e.target.value = e.target.value.slice(0, 13);
//                         }
//                       }}
//                     /> */}

//                     <input
//                       type="text"
//                       className="form-control form-control-sm"
//                       id="gst_amount"
//                       name="gst_amount"
//                       maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
//                       value={billAmountValues.gst_amount}
//                       onChange={handleInputChange}
//                       required
//                       onKeyPress={(e) => {
//                         const inputValue = e.key;
//                         const currentInput = e.target.value;
//                         const decimalIndex = currentInput.indexOf('.');

//                         if (!/^\d$/.test(inputValue) && inputValue !== '.' && inputValue !== 'Backspace') {
//                           e.preventDefault();
//                         }

//                         if (decimalIndex !== -1 && (currentInput.length - decimalIndex) > 2) {
//                           e.preventDefault();
//                         }

//                         if (currentInput.length >= 10 && inputValue !== '.' && decimalIndex === -1) {
//                           e.preventDefault();
//                         }
//                       }}

//                       onInput={(e) => {
//                         const value = e.target.value;
//                         const parts = value.split('.');

//                         if (parts.length > 1) {
//                           // Ensure only 2 decimal places
//                           parts[1] = parts[1].slice(0, 2);
//                         }

//                         e.target.value = parts.join('.');

//                         if (value.length > 13) {
//                           e.target.value = value.slice(0, 13);
//                         }
//                       }}
//                     />

//                   </div>

//                   <div className=" col ">
//                     <label className="col-sm-3 col-form-label">
//                       <b> Round Off: </b>
//                     </label>

//                     {/* <input
//                       type="number"
//                       className="form-control form-control-sm"
//                       id="round_off"
//                       name="round_off"
//                       step="any"
//                       // onChange={e => { handleRoundOff(e) }}
//                       value={billAmountValues.round_off}
//                       onChange={e => handleRoundOffChange(e)}
//                       required
//                       // onKeyPress={(e) => {
//                       //   Validation.NumbersSpeicalOnlyDot(e);
//                       // }}
//                       onInput={(e) => {
//                         if (e.target.value.length > 13) {
//                           e.target.value = e.target.value.slice(0, 13);
//                         }
//                       }}
//                     /> */}

// <input
//                       type="text"
//                       step="any"
//                       className="form-control form-control-sm"
//                       id="round_off"
//                       name="round_off"
//                       maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
//                       value={billAmountValues.round_off}
//                       onChange={e => handleRoundOffChange(e)}
//                       required
//                       onKeyPress={(e) => {
//                         const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];
//                         const inputValue = e.key;

//                         if (!allowedKeys.includes(inputValue)) {
//                           e.preventDefault();
//                         }

//                         const currentInput = e.target.value;
//                         const decimalIndex = currentInput.indexOf('.');

//                         if (decimalIndex !== -1 && (currentInput.length - decimalIndex) > 2) {
//                           e.preventDefault();
//                         }

//                         if (currentInput.length >= 10 && inputValue !== '.' && decimalIndex === -1) {
//                           e.preventDefault();
//                         }
//                       }}
//                     />

//                   </div>
//                 </div>

//                 <div className=" form-group row mt-3 ">
//                 {isTcsApplicable === true ?
//                   <div className=" col-md-3 ">
//                   <label className=" col-form-label">
//                     <b>
//                       {" "}
//                       TCS Amount: <Astrick color="red" size="13px" />
//                     </b>
//                   </label>

//                   <input
//                     type="number"
//                     className="form-control form-control-sm"
//                     id="tcs"
//                     name="tcs"
//                     step="any"
//                     // onChange={e => { handleTcs(e) }}
//                     value={billAmountValues.tcs}
//                     onChange={handleInputChange}
//                     required
//                     onKeyPress={(e) => {
//                       Validation.NumbersSpeicalOnlyDot(e);
//                     }}
//                   />
//                 </div> :
//                   <div className=" col-md-3 ">
//                   <label className=" col-form-label">
//                     <b>
//                       {" "}
//                       TCS Amount: <Astrick color="red" size="13px" />
//                     </b>
//                   </label>

//                   <input
//                     type="number"
//                     className="form-control form-control-sm"
//                     id="tcs"
//                     name="tcs"
//                     step="any"
//                     // onChange={e => { handleTcs(e) }}
//                     defaultValue={0}
//                     readOnly={true}
//                     // value={billAmountValues.tcs}
//                     onChange={handleInputChange}
//                     required
//                     onKeyPress={(e) => {
//                       Validation.NumbersSpeicalOnlyDot(e);
//                     }}
//                   />
//                 </div>
//               }

//                   <div className=" col-md-3 ">
//                     <label className="col-form-label">
//                       <b>
//                         {" "}
//                         Bill Amount: <Astrick color="red" size="13px" />
//                       </b>
//                     </label>

//                     <input
//                       type="number"
//                       className="form-control form-control-sm"
//                       id="bill_amount"
//                       name="bill_amount"
//                       // value={billAmount}
//                       // onChange={handleInputChange}
//                       value={BillAmount > 0 && isTcsApplicable === true ? BillAmount : BillAmount1}

//                       readOnly={true}
//                     />
//                   </div>

//                   <div className=" col-md-2 mt-4">
//                     <input
//                       className="sm-1"
//                       type="checkbox"
//                       style={{ marginRight: "8px", marginLeft: "10px" }}
//                       id="is_tds_applicable"
//                       name="is_tds_applicable"
//                       onChange={(e) => handleTdsApplicable(e)}
//                     />
//                     <label className="col-form-label">
//                       <b>TDS Applicable:</b>
//                     </label>
//                   </div>
//                   <div className=" col-md mt-4">
//                     {authority && (
//                       <input
//                         className="sm-1"
//                         type="checkbox"
//                         style={{ marginRight: "8px", marginLeft: "10px" }}
//                         id="is_tcs_applicable"
//                         name="is_tcs_applicable"
//                         onChange={(e) => handleTcsApplicable(e)}

//                         disabled={
//                           userSessionData.TCS_Applicable === "false"
//                             ? true
//                             : false
//                         }
//                       />
//                     )}
//                     <label className="col-form-label">
//                       <b>TCS Applicable:</b>
//                     </label>
//                   </div>

//                   <div className=" col-md mt-4">
//                     <input
//                       className="sm-1"
//                       type="checkbox"
//                       style={{ marginRight: "8px", marginLeft: "10px" }}
//                       id="is_original_bill_needed"
//                       name="is_original_bill_needed"
//                     // disabled={data && data.access.Update_Bill ? false : true}
//                     />
//                     <label className="col-form-label">
//                       <b>Original Bill Needed</b>
//                     </label>
//                   </div>
//                 </div>

//                 {showTdsFileds && (
//                   <div className=" form-group row mt-3 ">
//                     <div className="col-md-3  ">
//                       <label className="col-form-label">
//                         <b>TDS section : </b>
//                       </label>
//                       {sectionDropdown && (
//                         <Select
//                           type="text"
//                           className="form-control form-control-sm"
//                           id="tds_section"
//                           name="tds_section"
//                           options={sectionDropdown}
//                           ref={sectionRef}
//                           onChange={(e) => handleSectionDropDownChange(e)}
//                         />
//                       )}
//                     </div>

//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b>TDS Constitution : </b>
//                       </label>
//                       {tdsData && tdsData.length > 0 && (
//                         <span>
//                           {constitutionDropdown && (
//                             <Select
//                               id="tds_constitution"
//                               name="tds_constitution"
//                               options={
//                                 constitutionDropdown
//                                   ? constitutionDropdown
//                                   : null
//                               }
//                               onChange={handleTdsPercentage}
//                             />

//                           )}
//                         </span>
//                       )}

//                       {(!tdsData || tdsData.length == 0) && (
//                         <span>
//                           {/* {constitutionDropdown && (
//                             <Select
//                               type="text"
//                               className="form-control form-control-sm"
//                               id="tds_constitution"
//                               name="tds_constitution"
//                               options={
//                                 constitutionDropdown
//                                   ? constitutionDropdown
//                                   : null
//                               }
//                               onChange={handleTdsPercentage}
//                             value={constitutionDropdown.length == 1 && constitutionDropdown[0]}

//                             />

//                           )} */}

//                           {constitutionDropdown && (
//                             (constitutionDropdown.length > 1) ? (
//                               <Select
//                                 id="tds_constitution"
//                                 name="tds_constitution"
//                                 options={constitutionDropdown}
//                                 onChange={handleTdsPercentage}
//                               />
//                             ) : (
//                               <Select
//                                 id="tds_constitution"
//                                 name="tds_constitution"
//                                 onChange={handleTdsPercentage}
//                                 value={constitutionDropdown[0]}
//                               />

//                             )
//                           )}
//                         </span>
//                       )}
//                     </div>

//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b>
//                           TDS % : <Astrick color="red" size="13px" />
//                         </b>
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control form-control-sm"
//                         id="tds_percentage"
//                         name="tds_percentage"
//                         defaultValue={tdsPercentage}
//                         readOnly
//                         ref={tdsPercentageRef}
//                         onChange={(e) => handleTds(e)}
//                       />
//                     </div>

//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b>
//                           TDS Amount : <Astrick color="red" size="13px" />
//                         </b>
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control form-control-sm"
//                         id="tds_amount"
//                         name="tds_amount"
//                         // value={tdsAmount}
//                         value={tdsValue}
//                         readOnly={true}
//                       />
//                     </div>

//                   </div>
//                 )}

//                 <div className=" form-group row mt-3 ">
//                   <div className=" col-md-3 ">
//                     <label className=" col-form-label">
//                       <b>
//                         {" "}
//                         Net Payment : <Astrick color="red" size="13px" />
//                       </b>
//                     </label>

//                     <input
//                       type="number"
//                       className="form-control form-control-sm"
//                       id="net_payment"
//                       name="net_payment"
//                       value={netPayment}
//                       // value={billAmountValues.net_payment}
//                       // value={NetPaymentAmount}
//                       // onChange={handleInputChange}
//                       // onChange={handleInputChange}
//                       readOnly={true}

//                     // required
//                     />

//                     {/* <input type="text" className="form-control form-control-sm"
//                                             value={numWords(netPayment).toUpperCase() + " ONLY"}
//                                             style={{ border: "none", color: "red", fontSize: "12px", fontWeight: "bold", width: "100% !important", background: "white" }}
//                                             readOnly
//                                         /> */}
//                   </div>

//                   {/* <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Net Payment In Words: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="net_payment_in_word"
//                                             name="net_payment_in_word"
//                                             // onChange ={e=>handleAmountWords(e)}

//                                         />
//                                     </div> */}

//                   <div className=" col-md-3 ">
//                     <label className=" col-form-label">
//                       <b> Remark:</b>
//                     </label>
//                     <textarea
//                       type="text"
//                       className="form-control form-control-sm"
//                       id="remark"
//                       name="remark"
//                       rows="4"
//                       maxLength={1000}
//                     />
//                   </div>

//                   <div className=" col-md-3 ">
//                     <label className=" col-form-label">
//                       <b> Remark History:</b>
//                     </label>
//                     <textarea
//                       type="text"
//                       className="form-control form-control-sm"
//                       id="remark"
//                       name="remark"
//                       rows="4"
//                     />
//                   </div>

//                   <div className=" col-md-3 ">
//                     <label className=" col-form-label">
//                       <b> Audit Remark: </b>
//                     </label>
//                     {authority && (
//                       <textarea
//                         type="text"
//                         className="form-control form-control-sm"
//                         id="audit_remark"
//                         name="audit_remark"
//                         rows="4"
//                         maxLength={1000}
//                       // readOnly={
//                       //   authority.Audit_Remark === false ? true : false
//                       // }
//                       />
//                     )}
//                   </div>
//                 </div>

//                 {/* <div className=" col-md-3 ">
//                                     <label className=" col-form-label">
//                                         <b> Invoice Attachment: <Astrick color="red" size="13px" /></b>
//                                     </label>
//                                     <input type="file" className="form-control form-control-sm"
//                                         id="attachment"
//                                         name="attachment[]"
//                                         onChange={e => handleShowFiles(e)}
//                                         multiple
//                                         ref={fileInputRef}
//                                         rows="4"
//                                     />
//                                 </div>
//                                 <div className="d-flex justify-content-start">
//                                         {showFiles && showFiles.map((image, i) => {
//                                             return <div key={Math.random()} className="" style={{height:"200px",width:"300px",marginLeft:"20px !important"}}>
//                                                 <img className="col-md mt-2" src={image} width="100%" height="100%" onClick={e =>handleImageClick(e, 'UPLOAD')} />
//                                                      <button className ="btn btn p-0 mt-2" style={{marginLeft:"50%"}}onClick={() => {
//                                                     setShowFiles(showFiles.filter(d => d !== image))
//                                                 }}>

//                                              <i className="icofont-close-line" style={{fontWeight:"bold" , fontSize:"20px"}} ></i>
//                                                 </button>

//                                             </div>
//                                         })}
//                                     </div> */}

//                 <div className="card mt-2">
//                   <div className="card-body">
//                     <div className="col-sm-4 mt-3">
//                       <label className=" col-form-label">
//                         <b>
//                           Upload Attachment :<Astrick color="red" size="13px" />{" "}
//                         </b>
//                       </label>
//                       <input
//                         type="file"
//                         id="attachment"
//                         name="attachment[]"
//                         ref={fileInputRef}
//                         multiple
//                         required={selectedFiles && selectedFiles.length < 0 ? true : false}
//                         onChange={(e) => {
//                           uploadAttachmentHandler(e, "UPLOAD", "");
//                           maxLengthCheck(e)

//                         }}
//                       />
//                     </div>
//                   </div>
//                   {/* <Attachment
//                                             data={attachment}
//                                             refId={id}
//                                             handleAttachment={handleAttachment}
//                                         /> */}
//                 </div>
//                 <div className="d-flex">
//                   {selectedFiles && selectedFiles.map((attachment, index) => {
//                     return <div key={index} className="justify-content-start"
//                       style={{ marginRight: '20px', padding: '5px', maxWidth: '250px' }}>
//                       <div className="card" style={{ backgroundColor: '#EBF5FB' }}>
//                         <div className="card-header">
//                           <span>
//                             {attachment.fileName}
//                           </span>

//                           <img src={attachment.tempUrl}
//                             style={{ height: '100%', width: '100%' }}
//                           /> *
//                           <div className="d-flex justify-content-between p-0 mt-1">
//                             <a href={`${attachment.tempUrl}`}
//                               target='_blank'
//                               className='btn btn-warning btn-sm p-0 px-1'>
//                               <i className="icofont-download" style={{ fontSize: '10px', height: '15px' }}></i>
//                             </a>
//                             <button className='btn btn-danger text-white btn-sm p-1'
//                               type="button"
//                               onClick={e => { handleDeleteAttachment(e, index) }}>

//                               <i class="icofont-ui-delete" style={{ fontSize: '15px' }}></i>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   })}
//                 </div>

//                 {/* <div className="col-sm-6 mt-4">
//                                     <label className="form-label font-weight-bold">Status :<Astrick color="red" size="13px" /></label>
//                                     <div className="row">
//                                         <div className="col-md-2">
//                                             <div className="form-check">
//                                                 <input className="form-check-input" type="radio" name="is_active" id="is_active"
//                                                     value="1"
//                                                     defaultChecked={true}

//                                                 />
//                                                 <label className="form-check-label" htmlFor="is_active_1">
//                                                     Active
//                                                 </label>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-1">
//                                             <div className="form-check">
//                                                 <input className="form-check-input" type="radio" name="is_active" id="is_active" value="0"
//                                                 // readOnly={(modal.modalData) ? false : true}
//                                                 />
//                                                 <label className="form-check-label" htmlFor="is_active">
//                                                     Deactive
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div> */}
//               </div>
//             </div>
//             {/* CARD */}

//             <div className="mt-3" style={{ textAlign: "right" }}>
//               <button type="submit" className="btn btn-primary">
//                 Submit
//               </button>
//               <Link
//                 to={`/${_base}/BillCheckingTransaction`}
//                 className="btn btn-danger text-white"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>
//           <Modal
//             size="xl"
//             centered
//             show={modal.showModal}
//             onHide={(e) => {
//               handleModal({
//                 showModal: false,
//                 modalData: "",
//                 modalHeader: "",
//               });
//             }}
//           >
//             <Modal.Header closeButton />
//             <Modal.Body style={{ alignItems: "center" }}>
//               {showFiles &&
//                 showFiles.map((d, i) => {
//                   return (
//                     <div className="row">
//                       <div
//                         className="card"
//                         style={{ backgroundColor: "#EBF5FB" }}
//                       >
//                         <img className="col-md mt-2" src={d} />
//                       </div>
//                     </div>
//                   );
//                 })}
//             </Modal.Body>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState, useRef } from "react";
// import { Link, useHistory } from 'react-router-dom';
// import { Modal } from "react-bootstrap";
// import ErrorLogService from "../../../services/ErrorLogService";

// import PageHeader from "../../../components/Common/PageHeader";
// import Alert from "../../../components/Common/Alert";
// import { Astrick } from "../../../components/Utilities/Style"
// import *  as Validation from '../../../components/Utilities/Validation';
// import { _base } from '../../../settings/constants'
// import { _attachmentUrl } from '../../../settings/constants'
// import { getAttachment, deleteAttachment } from "../../../services/OtherService/AttachmentService";
// import Select from 'react-select';
// import DropdownService from "../../../services/Bill Checking/Bill Checking Transaction/DropdownService";
// import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService"
// import DepartmentService from "../../../services/MastersService/DepartmentService";
// import UserService from '../../../services/MastersService/UserService';
// import numWords from "num-words";
// import BillTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService"

// export default function CreateBillCheckingTransaction({ match }) {

//     const id = match.params.id

//     const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });
//     const history = useHistory();
//     const [notify, setNotify] = useState(null);
//     const [data, setData] = useState(null);
//     const [customerType, setCustomerType] = useState(null);
//     const [dependent, setDependent] = useState({ country_id: null, state_id: null });
//     const [attachment, setAttachment] = useState()
//     const [billType, setBillType] = useState(null)
//     const [billTypeDropdown, setBillTypeDropdown] = useState(null)
//     const [vendor, setVendor] = useState(null);
//     const [vendorDropdown, setVendorDropdown] = useState(null);
//     const [department, setDepartment] = useState(null);
//     const [departmentDropdown, setDepartmentDropdown] = useState(null);
//     const [cityDropdown, setCityDropdown] = useState(null);
//     const [user, setUser] = useState(null);
//     const [userDropdown, setUserDropdown] = useState(null);

//     const [constitution, setConstitution] = useState()
//     const [constitutionDropdown, setConstitutionDropdown] = useState()

//     const [sectionDropdown, setSectionDropdown] = useState();
//     const [tdsPercentage, setTdsPercentage] = useState();

//     const [billAmount, setBillAmount] = useState(0)
//     const [netPayment, setNetPayment] = useState(null)

//     const [tdsAmount, setTdsAmount] = useState(null)

//     const [tdsData, setTdsData] = useState(null);

//     const sectionRef = useRef();
//     const tdsPercentageRef = useRef();
//     // const resetSectionHandle = () =>{
//     //     sectionRef.current.reset();
//     // }

//     const handleTdsChange = (e) => {
//         setTdsData([e.target.value]);
//     }
//     const [showTdsFileds, setShowTdsFileds] = useState(false);
//     const handleTdsApplicable = (e) => {
//         if (e.target.checked) {
//             setShowTdsFileds(e.target.checked);
//         } else {
//             setShowTdsFileds(e.target.checked = false);
//             sectionRef.current.value = "";
//             setTdsPercentage(null)
//             setTdsAmount(0)
//         }

//     }

//     const [netInWords, setNetInWords] = useState();
//     const handleAmountWords = (e) => {
//         setNetInWords(null);
//         setNetInWords(numWords(netPayment));
//     }

//     const [debit, setDebit] = useState();
//     const [taxable, setTaxable] = useState();
//     const [gst, setGst] = useState();
//     const [roundOff, setRoundOff] = useState();
//     const [tcs, setTcs] = useState();
//     const [tds, setTds] = useState();
//     const [tdsPercent, setTdsPercent] = useState();
//     const [deta, setDeta] = useState();
//     const [showFiles, setShowFiles] = useState();
//     const [authority, setAuthority] = useState();

//     const handleTaxable = (e) => {
//         setTaxable(e.target.value)

//     }
//     const handleGst = (e) => {
//         setGst(e.target.value)
//     }
//     const handleRoundOff = (e) => {
//         setRoundOff(e.target.value)
//     }
//     const handleTcs = (e) => {
//         setTcs(e.target.value)
//     }

//     const handleTds = (e) => {
//         setTdsPercent(e.target.value)
//     }
//     const handleDebit = (e) => {
//         setDebit(e.target.value)
//     }

//     const handleTdsPercentage = (e) => {
//         const selectedContition = constitution.filter(d => d.id === e.value);
//         setTdsPercentage(selectedContition[0].percentage);

//     }

//     const handleSectionDropDownChange = async (e) => {
//         await new BillCheckingTransactionService().getSectionMappingDropdown(e.value).then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setTdsPercentage(0)
//                     setConstitutionDropdown(null)
//                     setConstitution(res.data.data)
//                     setConstitutionDropdown(res.data.data.map(d => ({ value: d.id, label: d.constitution_name })))

//                 }
//             }
//         })
//     }

//     const [assignTo, setAssignTo] = useState();
//     const [assignToDropdown, setAssignToDropdown] = useState();
//     const handleAssignToPerson = async (e) => {
//         await new DropdownService().getMappedEmp(e.value).then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setAssignTo(res.data.data)
//                     setAssignToDropdown(null);
//                     setAssignToDropdown(res.data.data.map(d => ({ value: d.id, label: d.employee_name })))
//                 }
//             }
//         })
//     }

//     const  handleReset = () =>{

//     }
//     const handleFilter = async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         await new BillTransactionService().getBillCheckData(formData).then((res) => {
//           if (res.status === 200) {
//             const tempData = [];
//             let counter = 1;
//             const temp = res.data.data
//             for (const key in temp) {
//               tempData.push({
//                 id: counter++,
//                 task_name: temp[key].task_name,
//                 tester_status: temp[key].tester_status,
//                 ba_status: temp[key].ba_status,
//                 developer_status: temp[key].developer_status,
//                 priority: temp[key].priority,
//                 severity: temp[key].severity,

//               })
//               setData(null)
//               setData(tempData);
//             }
//           }

//         })
//       }

//     const loadData =  async () => {

//         await new BillCheckingTransactionService()._getBillTypeDataDropdown().then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setBillType(res.data.data)
//                     setDeta(res.data.data)
//                     setBillTypeDropdown(res.data.data.map(d => ({ value: d.id, label: d.bill_type })))

//                 }
//             }
//         })

//         await new BillCheckingTransactionService().getBillCreateAuthority().then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setAuthority(res.data.access)

//                 }
//             }
//         })

//         await new BillCheckingTransactionService().getSectionDropdown().then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setSectionDropdown(res.data.data.map(d => ({ value: d.id, label: d.section_name })))
//                     setConstitutionDropdown(res.data.data.map(d => ({ value: d.id, label: d.constitution_name })))
//                 }
//             }
//         })

//         await new BillCheckingTransactionService().getVendorsDropdown().then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setVendor(res.data.data)
//                     setVendorDropdown(res.data.data.map(d => ({
//                         value: d.id, label: d.vendor_name
//                     })))
//                 }
//             }
//         })

//         await new DepartmentService().getDepartment().then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setDepartment(res.data.data)
//                     setDepartmentDropdown(res.data.data.map(d => ({ value: d.id, label: d.department })))
//                 }
//             }
//         })

//         await new UserService().getUser().then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setUser(res.data.data)
//                     setUserDropdown(res.data.data.map(d => ({ value: d.id, label: d.user_name })))
//                 }
//             }
//         })

//     }

//     const handleModal = (data) => {
//         setModal(data);
//     }
//     const handleImageClick = (e) => {
//         setModal({ showModal: true, modalData: "", modalHeader: "" })
//     }

//     const handleForm = async (e) => {
//         e.preventDefault();

//         const form = new FormData(e.target);
//         setNotify(null)
//         form.delete("attachment[]");

//         if (selectedFiles) {
//             for (var i = 0; i < selectedFiles.length; i++) {
//                 form.append('attachment[' + i + ']', selectedFiles[i].file);
//             }
//         }

//         await new BillCheckingTransactionService().createData(form).then(res => {

//             if (res.status === 200) {
//                 if (res.data.status === 1) {
//                     history({
//                         pathname: `/${_base}/BillCheckingTransaction`,
//                         state: { alert: { type: 'success', message: res.data.message } }
//                     });
//                     loadData();
//                 } else {
//                     setNotify({ type: 'danger', message: res.data.message });
//                 }
//             } else {
//                 setNotify({ type: 'danger', message: res.data.message })
//                 new ErrorLogService().sendErrorLog("BillCheckingTransaction", "BillCheckingTransaction", "INSERT", res.message);
//             }
//         })
//             .catch(error => {
//                 const { response } = error;
//                 const { request, ...errorObject } = response;
//                 setNotify({ type: 'danger', message: "Request Error !!!" })
//                 new ErrorLogService().sendErrorLog("BillCheckingTransaction", "BillCheckingTransaction", "INSERT", errorObject.data.message);
//             })
//     }

//     const fileInputRef = useRef(null);
//     const handleShowFiles = (e) => {

//         const selectedFiles = e.target.files
//         const selectedFilesArray = Array.from(selectedFiles)

//         const imagesArray = selectedFilesArray.map((file) => {
//             return (
//                 URL.createObjectURL(file)
//             )
//         })
//         setShowFiles(imagesArray)
//         // e.preventDefault();
//         // var fileObj = [];
//         // var fileArray = [];
//         // fileObj.push(e.target.files)
//         // document.getElementById("imgTest").innerHTML = "";
//         // for (let i = 0; i < fileObj[0].length; i++) {
//         //     fileArray.push(URL.createObjectURL(fileObj[0][i]))
//         //     // encodeImageFileAsURL(i)
//         // }
//         // setShowFiles({ fileArray })
//     }
//     const [igst, setIgst] = useState(false)
//     const[gstType, setGstType]= useState(false)
//     const handleIgst = (e, type) => {

//         if (e.target.checked) {
//             setIgst(e.target.checked)
//             setGstType(true)
//         } else {
//             setIgst(e.target.checked = false)
//             setGstType((prev)=> null)
//             setGstType(false)

//         }
//     }

//     const date = new Date();
//     const futureDate = date.getDate();
//     date.setDate(futureDate);
//     const defaultValue = date.toLocaleDateString('en-CA');

//     useEffect(() => {
//         loadData();
//     }, [])

//     useEffect(() => {
//         var tdsAmount = 0
//         if (tdsAmount >= 0) {
//             tdsAmount = parseFloat(taxable ? taxable : 0) * parseFloat(tdsPercentage ? tdsPercentage : 0) / 100
//             setTdsAmount(Math.ceil(tdsAmount));
//         }

//     }, [billAmount, tdsPercentage])

//     useEffect(() => {
//         var billAmount = parseFloat(taxable ? taxable : 0) + parseFloat(gst ? gst : 0) + parseFloat(roundOff ? roundOff : 0) + parseFloat(tcs ? tcs : 0)
//         if (billAmount) {

//             setBillAmount(parseFloat(billAmount).toFixed(2))
//         }

//         {console.log("billAmount",billAmount)}

//     }, [taxable, gst, roundOff, tcs, billAmount, tdsPercentage])

//     useEffect(() => {
//         var netPayment = 0
//         netPayment = parseFloat(billAmount ? billAmount : 0) - (parseFloat(debit ? debit : 0))
//         setNetPayment(Math.round(netPayment))
//         if (tdsAmount > 0) {
//             netPayment = netPayment - parseFloat(tdsAmount)
//             setNetPayment(Math.round(netPayment));

//         }
//         if (netPayment >= 0) {
//             setNetPayment(Math.round(netPayment));
//             setNetInWords(prev => numWords(netInWords));
//         }
//     }, [billAmount, debit, tdsAmount, netPayment, tdsPercentage])
//     const loadAttachment = async () => {
//         setNotify(null);
//         if (id) {
//             await getAttachment(id, "BILL_CHECK").then(res => {
//                 if (res.status === 200) {
//                     setAttachment(null);
//                     setAttachment(res.data.data);
//                 }
//             })
//         } else {
//             setAttachment(null);
//         }
//     }

//     const [selectedFiles,setSelectedFiles] = useState();
//     const uploadAttachmentHandler = (e, type, id = null) => {
//         if (type === "UPLOAD") {
//             var tempSelectedFile = [];
//             for (var i = 0; i < e.target.files.length; i++) {
//                 tempSelectedFile.push({ file: e.target.files[i], fileName: e.target.files[i].name, tempUrl: URL.createObjectURL(e.target.files[i]) });
//             }
//             setSelectedFiles(tempSelectedFile);
//         } else if (type === "DELETE") {
//             let filteredFileArray = selectedFiles.filter((item, index) => id !== index);
//             setSelectedFiles(filteredFileArray);
//         }
//     }
//     const handleDeleteAttachment = (e, id) => {
//         deleteAttachment(id).then((res) => {
//             if (res.status === 200) {
//                 loadAttachment();
//             }
//         })
//     }

//     return (
//         <div className="container-xxl">
//             {notify && <Alert alertData={notify} />}

//             <PageHeader />

//             <div className="row clearfix g-3">
//                 <div className="col-sm-12">
//                     <form method="POST" onSubmit={e => handleForm(e)}>
//                         {/* ********* MAIN DATA ********* */}
//                         <div className='card mt-2'>
//                             <div className='card-header bg-primary text-white p-2'>
//                                 <h5>Add Data</h5>
//                             </div>

//                             <div className='card-body'>

//                                 <div className="form-group row ">
//                                     <div className="col-md-3">
//                                         <label className=" col-form-label">
//                                             <b>Bill Type : <Astrick color="red" size="13px" /></b>
//                                         </label>

//                                         {billTypeDropdown &&
//                                             <Select
//                                                 type="text"
//                                                 className="form-control form-control"
//                                                 options={billTypeDropdown}
//                                                 onChange={e => handleAssignToPerson(e)}
//                                                 id="bill_type"
//                                                 name="bill_type"
//                                                 placeholder="Bill Type"
//                                                 required
//                                             />
//                                         }
//                                     </div>

//                                     <div className="col-md-3">
//                                         <label className="col-form-label">
//                                             <b>Assign To : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         {assignToDropdown &&
//                                             <Select className="form-control form-control"
//                                                 options={assignToDropdown}
//                                                 id="assign_to"
//                                                 name="assign_to"
//                                                 placeholder="Assign To"
//                                                 required
//                                             />
//                                         }
//                                     </div>

//                                     <div className="col-md-3">
//                                         <label className="col-form-label">
//                                             <b>Vendor Name : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         {vendorDropdown &&
//                                             <Select className="form-control form-control-sm"
//                                                 id="vendor_name"
//                                                 name="vendor_name"
//                                                 options={vendorDropdown}
//                                                 required

//                                             />
//                                         }
//                                     </div>
//                                     {/* <div className="col-md-3 ">
//                                         <label className="col-md-4 col-form-label">
//                                             <b>Branch Name : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         {departmentDropdown &&
//                                             <Select className="form-control form-control-sm"
//                                                 id="department_name"
//                                                 name="department_name"
//                                                 options={departmentDropdown}
//                                             // placeholder="Branch Name"
//                                             // required

//                                             />
//                                         }
//                                     </div> */}
//                                 </div>

//                                 <div className="form-group row mt-3">
//                                     {/* <div className="col-md-3">
//                                     <label className=" col-form-label">
//                                         <b>Expected Bill Received Date : <Astrick color="red" size="13px" /></b>
//                                     </label>
//                                     <input type="date" className="form-control form-control-sm"
//                                         id="expected_bill_received_date"
//                                         name="expected_bill_received_date"
//                                         // placeholder="Bill Type"
//                                         // required
//                                         onKeyPress={e => { Validation.CharactersOnly(e) }}
//                                     />
//                                     </div> */}

//                                     <div className="col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b>Vendor Bill No : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="vendor_bill_no"
//                                             name="vendor_bill_no"
//                                             required
//                                             maxLength={25}
//                                             onKeyPress={e => { Validation.CharactersNumbersSpeicalOnly(e) }}

//                                         />
//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Bill Date: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         {authority &&
//                                         <input type="date" className="form-control form-control-sm"
//                                             id="bill_date"
//                                             name="bill_date"
//                                             min ={authority.Audit_Remark == true ? new Date().getFullYear() - 1+"-04-01":new Date().getFullYear()+"-04-01"}
//                                             required
//                                             // max={new Date().toISOString().split("T")[0]}

//                                         />
//                                     }
//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Received Date: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="date" className="form-control form-control-sm"
//                                             id="received_date"
//                                             name="received_date"
//                                             value={defaultValue}
//                                             readOnly

//                                         />
//                                     </div>
//                                 </div>

//                                 <div className=" form-group row mt-3">
//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Debit Advance : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="number"
//                                             step="any"
//                                             className="form-control form-control-sm"
//                                             id="debit_advance"
//                                             name="debit_advance"
//                                             onChange={e => handleDebit(e)}

//                                             required
//                                             onKeyPress={e => { Validation.NumbersSpecialOnlyDecimal(e) }}

//                                         />
//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Taxable Amount: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="number" className="form-control form-control-sm"
//                                             id="taxable_amount"
//                                             name="taxable_amount"
//                                             step="any"
//                                             onChange={e => handleTaxable(e)}
//                                             defaultValue={0}

//                                             required
//                                             onKeyPress={e => { Validation.NumbersSpecialOnlyDecimal(e) }}

//                                         />
//                                     </div>

//                                     <div className=" col ">
//                                         <input className="sm"
//                                             id="igst_type"
//                                             name="igst_type"
//                                             type="checkbox"
//                                             onChange={e => { handleIgst(e) }}
//                                             style={{ marginRight: "8px" }}
//                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

//                                         />
//                                         <label className="col-sm-3 col-form-label">
//                                             <b>IGST/GST :<Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         {gstType == true &&
//                                         <input type="number" className="form-control form-control-sm"
//                                             id="igst_amount"
//                                             name="igst_amount"
//                                             step="any"
//                                             required
//                                             onChange={handleGst}
//                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

//                                         />
//                                             }
//                                      {gstType == false &&
//                                          <input type="number" className="form-control form-control-sm"
//                                             id="gst_amount"
//                                             name="gst_amount"
//                                             step="any"
//                                             required
//                                              onChange={handleGst}
//                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

//                                         />
//                                         }
//                                     </div>

//                                     <div className=" col ">
//                                         <label className="col-sm-3 col-form-label">
//                                             <b> Round Off: </b>
//                                         </label>
//                                         <input type="number" className="form-control form-control-sm"
//                                             id="round_off"
//                                             name="round_off"
//                                             step="any"
//                                             onChange={e => { handleRoundOff(e) }}
//                                             // required
//                                             defaultValue={0}

//                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

//                                         />
//                                     </div>
//                                 </div>

//                                 <div className=" form-group row mt-3 ">
//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> TCS: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="number" className="form-control form-control-sm"
//                                             id="tcs"
//                                             name="tcs"
//                                             step="any"
//                                             onChange={e => { handleTcs(e) }}
//                                             required
//                                              defaultValue={0}

//                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

//                                         />
//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className="col-form-label">
//                                             <b> Bill Amount: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="number" className="form-control form-control-sm"
//                                             id="bill_amount"
//                                             name="bill_amount"
//                                             value={billAmount}
//                                              defaultValue={0}

//                                             readOnly={true}
//                                         />
//                                     </div>

//                                     <div className=" col-md-2 mt-4">
//                                         <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
//                                             id="is_tds_applicable"
//                                             name="is_tds_applicable"
//                                             onChange={e => handleTdsApplicable(e)}
//                                         />
//                                         <label className="col-form-label">
//                                             <b>TDS Applicable:</b>
//                                         </label>
//                                     </div>
//                                     <div className=" col-md mt-4">
//                                         {authority &&
//                                             <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
//                                                 id="is_tcs_applicable"
//                                                 name="is_tcs_applicable"
//                                                 disabled={authority.TCS_Applicable === false ? true : false}

//                                             />
//                                         }
//                                         <label className="col-form-label">
//                                             <b>TCS Applicable:</b>
//                                         </label>
//                                     </div>

//                                     <div className=" col-md mt-4">

//                                         <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
//                                             id="is_original_bill_needed"
//                                             name="is_original_bill_needed"
//                                             disabled={data && data.access.Update_Bill ? false : true}
//                                         />
//                                         <label className="col-form-label">
//                                             <b>Original Bill Needed</b>
//                                         </label>
//                                     </div>

//                                 </div>

//                                 {showTdsFileds && <div className=" form-group row mt-3 ">
//                                     <div className="col-md-3  ">
//                                         <label className="col-form-label">
//                                             <b>TDS section : </b>
//                                         </label>
//                                         {sectionDropdown &&
//                                             <Select type="text" className="form-control form-control-sm"
//                                                 id="tds_section"
//                                                 name="tds_section"
//                                                 options={sectionDropdown}
//                                                 ref={sectionRef}
//                                                 onChange={e => handleSectionDropDownChange(e)}
//                                             />
//                                         }

//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b>TDS Constitution : </b>
//                                         </label>
//                                         {tdsData && tdsData.length > 0 && <span>
//                                             {constitutionDropdown &&
//                                                 <Select
//                                                     id="tds_constitution"
//                                                     name="tds_constitution"
//                                                     options={constitutionDropdown ? constitutionDropdown : null}
//                                                     onChange={handleTdsPercentage}
//                                                 />
//                                             }
//                                         </span>
//                                         }

//                                         {(!tdsData || tdsData.length == 0) && <span>
//                                             {constitutionDropdown &&
//                                                 <Select type="text" className="form-control form-control-sm"
//                                                     id="tds_constitution"
//                                                     name="tds_constitution"
//                                                     options={constitutionDropdown ? constitutionDropdown : null}
//                                                     onChange={handleTdsPercentage}
//                                                 />
//                                             }
//                                         </span>
//                                         }

//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b>TDS Amount : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="tds_amount"
//                                             name="tds_amount"
//                                             value={tdsAmount}
//                                             defaultValue={0}
//                                             readOnly={true}
//                                         />
//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b>TDS % : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="tds_percentage"
//                                             name="tds_percentage"
//                                             defaultValue={tdsPercentage}
//                                             readOnly
//                                             ref={tdsPercentageRef}
//                                             onChange={e => handleTds(e)}
//                                         />
//                                     </div>
//                                 </div>
//                                 }

//                                 <div className=" form-group row mt-3 ">
//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Net Payment : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="net_payment"
//                                             name="net_payment"
//                                             value={netPayment}

//                                         // required
//                                         />
//                                         {/* <input type="text" className="form-control form-control-sm"
//                                             value={numWords(netPayment).toUpperCase() + " ONLY"}
//                                             style={{ border: "none", color: "red", fontSize: "12px", fontWeight: "bold", width: "100% !important", background: "white" }}
//                                             readOnly
//                                         /> */}

//                                     </div>

//                                     {/* <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Net Payment In Words: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="net_payment_in_word"
//                                             name="net_payment_in_word"
//                                             // onChange ={e=>handleAmountWords(e)}

//                                         />
//                                     </div> */}

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Remark:</b>
//                                         </label>
//                                         <textarea type="text" className="form-control form-control-sm"
//                                             id="remark"
//                                             name="remark"
//                                             rows="4"
//                                         />
//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Audit Remark: </b>
//                                         </label>
//                                         {authority &&
//                                             <textarea type="text" className="form-control form-control-sm"
//                                                 id="audit_remark"
//                                                 name="audit_remark"
//                                                 rows="4"
//                                                 readOnly={authority.Audit_Remark === false ? true : false}
//                                             />
//                                         }
//                                     </div>
//                                 </div>

//                                 {/* <div className=" col-md-3 ">
//                                     <label className=" col-form-label">
//                                         <b> Invoice Attachment: <Astrick color="red" size="13px" /></b>
//                                     </label>
//                                     <input type="file" className="form-control form-control-sm"
//                                         id="attachment"
//                                         name="attachment[]"
//                                         onChange={e => handleShowFiles(e)}
//                                         multiple
//                                         ref={fileInputRef}
//                                         rows="4"
//                                     />
//                                 </div>
//                                 <div className="d-flex justify-content-start">
//                                         {showFiles && showFiles.map((image, i) => {
//                                             return <div key={Math.random()} className="" style={{height:"200px",width:"300px",marginLeft:"20px !important"}}>
//                                                 <img className="col-md mt-2" src={image} width="100%" height="100%" onClick={e =>handleImageClick(e, 'UPLOAD')} />
//                                                      <button className ="btn btn p-0 mt-2" style={{marginLeft:"50%"}}onClick={() => {
//                                                     setShowFiles(showFiles.filter(d => d !== image))
//                                                 }}>

//                                              <i className="icofont-close-line" style={{fontWeight:"bold" , fontSize:"20px"}} ></i>
//                                                 </button>

//                                             </div>
//                                         })}
//                                     </div> */}

//                                 <div className='card mt-2'>
//                                     <div className='card-body'>
//                                         <div className="col-sm-4 mt-3">
//                                             <label className=" col-form-label">
//                                                 <b>Upload Attachment :<Astrick color="red" size="13px" /> </b>
//                                             </label>
//                                             <input type="file"
//                                                 id="attachment"
//                                                 name="attachment[]"
//                                                 ref={fileInputRef}
//                                                 multiple
//                                                 required
//                                                 onChange={(e) => { uploadAttachmentHandler(e, "UPLOAD", '') }}
//                                             />
//                                         </div>
//                                     </div>
//                                     {/* <Attachment
//                                             data={attachment}
//                                             refId={id}
//                                             handleAttachment={handleAttachment}
//                                         /> */}
//                                 </div>
//                                 <div className="d-flex">
//                                     {selectedFiles && selectedFiles.map((attachment, index) => {
//                                         return <div key={index} className="justify-content-start"
//                                             style={{ marginRight: '20px', padding: '5px', maxWidth: '250px' }}>
//                                             <div className="card" style={{ backgroundColor: '#EBF5FB' }}>
//                                                 <div className="card-header">
//                                                     <span>
//                                                         {attachment.fileName}
//                                                     </span>

//                                                     {/* <img src={attachment.tempUrl}
//                                                             style={{height: '100%', width: '100%'}}
//                                                         /> * */}
//                                                     <div className="d-flex justify-content-between p-0 mt-1">
//                                                         <a href={`${attachment.tempUrl}`}
//                                                             target='_blank'
//                                                             className='btn btn-warning btn-sm p-0 px-1'>
//                                                             <i class="icofont-ui-zoom-out"></i>
//                                                         </a>
//                                                         <button className='btn btn-danger text-white btn-sm p-1'
//                                                             type="button"
//                                                             onClick={e => {
//                                                                 uploadAttachmentHandler(e, "DELETE", index)
//                                                             }}
// >

//                                                             <i class="icofont-ui-delete" style={{ fontSize: '15px' }}></i>
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     })}
//                                 </div>

//                                 {/* <div className="col-sm-6 mt-4">
//                                     <label className="form-label font-weight-bold">Status :<Astrick color="red" size="13px" /></label>
//                                     <div className="row">
//                                         <div className="col-md-2">
//                                             <div className="form-check">
//                                                 <input className="form-check-input" type="radio" name="is_active" id="is_active"
//                                                     value="1"
//                                                     defaultChecked={true}

//                                                 />
//                                                 <label className="form-check-label" htmlFor="is_active_1">
//                                                     Active
//                                                 </label>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-1">
//                                             <div className="form-check">
//                                                 <input className="form-check-input" type="radio" name="is_active" id="is_active" value="0"
//                                                 // readOnly={(modal.modalData) ? false : true}
//                                                 />
//                                                 <label className="form-check-label" htmlFor="is_active">
//                                                     Deactive
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div> */}
//                             </div>
//                         </div>
//                         {/* CARD */}

//                         <div className="mt-3" style={{ 'textAlign': 'right' }}>
//                             <button type="submit" className="btn btn-primary">
//                                 Save
//                             </button>
//                             <Link to={`/${_base}/BillCheckingTransaction`}
//                                 className="btn btn-danger text-white">
//                                 Close
//                             </Link>
//                         </div>
//                     </form>
//                     <Modal size="xl" centered show={modal.showModal}
//                         onHide={(e) => {
//                             handleModal({
//                                 showModal: false,
//                                 modalData: "",
//                                 modalHeader: ""
//                             })
//                         }}>
//                         <Modal.Header closeButton />
//                         <Modal.Body style={{ alignItems: "center" }}>

//                             {showFiles && showFiles.map((d, i) => {
//                                 return (
//                                     <div className="row">
//                                         <img className="col-md mt-2" src={d} />
//                                     </div>
//                                 )
//                             })}

//                         </Modal.Body>

//                     </Modal>

//                 </div>

//             </div>

//         </div>
//     )
// }

import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ErrorLogService from "../../../services/ErrorLogService";

import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import { _base, userSessionData } from "../../../settings/constants";
import { _attachmentUrl } from "../../../settings/constants";
import {
  getAttachment,
  deleteAttachment,
} from "../../../services/OtherService/AttachmentService";
import Select from "react-select";
import DropdownService from "../../../services/Bill Checking/Bill Checking Transaction/DropdownService";
import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import DepartmentService from "../../../services/MastersService/DepartmentService";
import UserService from "../../../services/MastersService/UserService";
import BillTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import axios from "axios";

export default function CreateBillCheckingTransaction({ match }) {
  // const id = match.params.id;
  const { id } = useParams();
  const [isOriginal, setIsOriginal] = useState(0);

  const [ip, setIp] = useState("");
  const [billAmountValues, setBillAmountValues] = useState({
    tcs: "",
    bill_amount: "",
    net_payment: "",
    debit_advance: "",
    taxable_amount: "",
    igst_amount: "",
    gst_amount: "",
    round_off: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const featchData = async () => {
    try {
      const res = await axios.get("https://api.ipify.org/?format=json");
      setIp(res.data.ip);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };




  // const featchData=async()=>{
  //   try{

  //     const res=await axios.get("https://api.ipify.org/?format=json");
  //     setIp(res.data.ip)

  //   }catch(error){
  //     console.error("Error fetching data:", error)


  //   }

  // }

  useEffect(()=>{
    featchData()

  },[])


  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const [dependent, setDependent] = useState({
    country_id: null,
    state_id: null,
  });
  const [attachment, setAttachment] = useState();
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

  const [billAmount, setBillAmount] = useState(0);
  const [netPayment, setNetPayment] = useState(null);

  const [tdsAmount, setTdsAmount] = useState(null);

  const [tdsData, setTdsData] = useState(null);

  const [authorities, SetAuthorities] = useState();
  const [roundOffError, setRoundOffError] = useState("");

  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);
  const [showTcsFileds, setShowTcsFileds] = useState(false);

  const [isTcsApplicable, setIsTcsApplicable] = useState(0);
  const [isoriginalBill, setIsOriginalBill] = useState(false);
  const sectionRef = useRef();
  const tdsPercentageRef = useRef();
  // const resetSectionHandle = () =>{
  //     sectionRef.current.reset();
  // }

  const handleTdsChange = (e) => {
    setTdsData([e.target.value]);
  };
  const [showTdsFileds, setShowTdsFileds] = useState(false);
  const handleTdsApplicable = (e) => {
    if (e.target.checked) {
      setShowTdsFileds(e.target.checked);
    } else {
      setShowTdsFileds((e.target.checked = false));
      sectionRef.current.value = "";
      setTdsPercentage(null);
      setTdsAmount(0);
    }
  };

  const [igst, setIgst] = useState(0);

  // Step 2: Create an event handler to update the state
  // const handleTcsApplicable = (e) => {
  //   setIsTcsApplicable(e.target.checked);
  // };
  const [assignTo, setAssignTo] = useState();
  const [assignToDropdown, setAssignToDropdown] = useState();

  const [debit, setDebit] = useState();
  const [taxable, setTaxable] = useState();
  const [gst, setGst] = useState();
  const [roundOff, setRoundOff] = useState();
  const [tcs, setTcs] = useState();
  const [tds, setTds] = useState();
  const [tdsPercent, setTdsPercent] = useState();
  const [deta, setDeta] = useState();
  const [showFiles, setShowFiles] = useState();
  const [authority, setAuthority] = useState();
  const handleTcsApplicable = (e) => {
    if (e) {
      if (e.target.checked) {
        setIsTcsApplicable(1);
      } else {
        setIsTcsApplicable(0);
      }
    }
  };

  const handleOriginalBillNeed = (e) => {
    const newValue = e.target.checked ? 1 : 0;
    setIsOriginalBill(newValue);
  };

  const handleTaxable = (e) => {
    setTaxable(e.target.value);
  };
  const handleGst = (e) => {
    setGst(e.target.value);
  };
  const handleRoundOff = (e) => {
    setRoundOff(e.target.value);
  };
  const handleTcs = (e) => {
    setTcs(e.target.value);
  };

  const handleTds = (e) => {
    setTdsPercent(e.target.value);
  };
  const handleDebit = (e) => {
    setDebit(e.target.value);
  };

  const handleTdsPercentage = (e) => {
    const selectedContition = constitution.filter((d) => d.id === e.value);
    setTdsPercentage(selectedContition[0].percentage);
  };

  const handleSectionDropDownChange = async (e) => {
    await new BillCheckingTransactionService()
      .getSectionMappingDropdown(e.value)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setTdsPercentage(0);
            setConstitutionDropdown(null);
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

  const handleAssignToPerson = async (e) => {
    await new DropdownService().getMappedEmp(e.value).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setAssignTo(res.data.data);
          setAssignToDropdown(null);
          setAssignToDropdown(
            res.data.data.map((d) => ({ value: d.id, label: d.employee_name }))
          );
        }
      }
    });
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const handleFilter = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await new BillTransactionService()
      .getBillCheckData(formData)
      .then((res) => {
        if (res.status === 200) {
          const tempData = [];
          let counter = 1;
          const temp = res.data.data;
          for (const key in temp) {
            tempData.push({
              id: counter++,
              task_name: temp[key].task_name,
              tester_status: temp[key].tester_status,
              ba_status: temp[key].ba_status,
              developer_status: temp[key].developer_status,
              priority: temp[key].priority,
              severity: temp[key].severity,
            });
            setData(null);
            setData(tempData);
          }
        }
      });
  };

  const loadData = async () => {
    await new BillCheckingTransactionService()
      ._getBillTypeDataDropdown()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            const temp = res.data.data.filter((d) => d.is_active === 1);
            setBillType(res.data.data);
            setDeta(res.data.data);
            setBillTypeDropdown(
              temp.map((d) => ({ value: d.id, label: d.bill_type }))
            );
          }
        }
      });

    await new BillCheckingTransactionService()
      .getBillCreateAuthority()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setAuthority(res.data.access);
          }
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

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
        }
      }
    });

    await new BillCheckingTransactionService()
      .getSectionDropdown()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setSectionDropdown(
              res.data.data.map((d) => ({ value: d.id, label: d.section_name }))
            );
            setConstitutionDropdown(
              res.data.data.map((d) => ({
                value: d.id,
                label: d.constitution_name,
              }))
            );
          }
        }
      });

    await new BillCheckingTransactionService()
      .getVendorsDropdown()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            const temp = res.data.data.filter((d) => d.is_active == 1);
            setVendor(res.data.data);
            setVendorDropdown(
              temp.map((d) => ({
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
          const temp = res.data.data.filter((d) => d.is_active == 1);
          setUser(res.data.data);
          setUserDropdown(
            temp.map((d) => ({ value: d.id, label: d.user_name }))
          );
        }
      }
    });
  };

  const handleModal = (data) => {
    setModal(data);
  };
  const handleImageClick = (e) => {
    setModal({ showModal: true, modalData: "", modalHeader: "" });
  };

  const handleForm = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    setNotify(null);
    // form.delete("attachment[]");
    form.append("client_ip_address", ip);

    if (showTdsFileds === true) {
      form.append("is_tds_applicable", 1);
    } else {
      form.append("is_tds_applicable", 0);
    }
    if (igst === 1) {
      form.append("is_igst_applicable", 1);
    } else {
      form.append("is_igst_applicable", 0);
    }
    if (isTcsApplicable === 1) {
      form.append("is_tcs_applicable", 1);
    } else {
      form.append("is_tcs_applicable", 0);
    }

    if (isOriginal === 1) {
      form.append("is_original_bill_needed", 1);
    } else {
      form.append("is_original_bill_needed", 0);
    }

    if (selectedFiles) {
      selectedFiles.forEach((file, index) => {
        form.append(`attachment[${index}]`, file.file, file.file.name);
      });
    }

    // if (document.getElementById("is_original_bill_needed").value == "on") {
    //   form.append("is_original_bill_needed", 1);
    // } else {
    //   form.append("is_original_bill_needed", 0);
    // }
    // console.log(selectedFiles);
    // if (selectedFiles) {
    //   for (var i = 0; i < selectedFiles?.length; i++) {
    //     console.log(selectedFiles[i]);
    //     form.append(`attachment`, selectedFiles[i]);
    //   }
    // }
    await new BillCheckingTransactionService()
      .createData(form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {

            history({
              pathname: `/${_base}/BillCheckingTransaction`,
              state: { alert: { type: "success", message: res.data.message } },
            });
            loadData();
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          setNotify({ type: "danger", message: res.data.message });
          // new ErrorLogService().sendErrorLog(
          //   "BillCheckingTransaction",
          //   "BillCheckingTransaction",
          //   "INSERT",
          //   res.message
          // );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: "danger", message: "Request Error !!!" });
        // new ErrorLogService().sendErrorLog(
        //   "BillCheckingTransaction",
        //   "BillCheckingTransaction",
        //   "INSERT",
        //   errorObject.data.message
        // );
      });
  };

  const fileInputRef = useRef(null);
  const handleShowFiles = (e) => {
    const selectedFiles = e.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    
    setShowFiles(imagesArray);
  };
  const handleIgst = (e) => {
    if (e) {
      if (e.target.checked) {
        setIgst(1);
      } else {
        setIgst(0);
      }
    }
  };

  const handleIsOriginal = (e) => {
    if (e) {
      if (e.target.checked) {
        setIsOriginal(1);
      } else {
        setIsOriginal(0);
      }
    }
  };
  const date = new Date();
  const futureDate = date.getDate();
  date.setDate(futureDate);
  const defaultValue = date.toLocaleDateString("en-CA");

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    featchData();
  }, []);
  useEffect(() => {
    var tdsAmount = 0;
    if (tdsAmount >= 0) {
      tdsAmount =
        (parseFloat(taxable ? taxable : 0) *
          parseFloat(tdsPercentage ? tdsPercentage : 0)) /
        100;
      setTdsAmount(Math.ceil(tdsAmount));
    }
  }, [billAmount, tdsPercentage]);

  useEffect(() => {
    var billAmount =
      parseFloat(taxable ? taxable : 0) +
      parseFloat(gst ? gst : 0) +
      parseFloat(roundOff ? roundOff : 0) +
      parseFloat(tcs ? tcs : 0);
    if (billAmount) {
      setBillAmount(parseFloat(billAmount).toFixed(2));
    }
  }, [taxable, gst, roundOff, tcs, billAmount, tdsPercentage]);

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
  //     let filteredFileArray = selectedFiles.filter(
  //       (item, index) => id !== index
  //     );
  //     setSelectedFiles(filteredFileArray);
  //   }
  //     e.target.value= ""
  // };

  // const uploadAttachmentHandler = (e, type, id = null) => {
  //   if (type === "UPLOAD") {
  //     var tempSelectedFile = [...selectedFiles]; // Create a copy of the existing files
  //     for (var i = 0; i < e.target.files.length; i++) {
  //       tempSelectedFile.push({
  //         file: e.target.files[i],
  //         fileName: e.target.files[i].name,
  //         tempUrl: URL.createObjectURL(e.target.files[i]),
  //       });
  //     }
  //     setSelectedFiles(tempSelectedFile);
  //   } else if (type === "DELETE") {
  //     let filteredFileArray = selectedFiles.filter((item, index) => id !== index);
  //     setSelectedFiles(filteredFileArray);
  //   }
  //   e.target.value = "";
  // };

  const validFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  // const uploadAttachmentHandler = (e, type, id = null) => {
  //   if (type === "UPLOAD") {
  //     var tempSelectedFile = [...selectedFiles]; // Create a copy of the existing files

  //     // Check if the total number of files will not exceed 10
  //     if (tempSelectedFile.length + e.target.files.length <= 10) {
  //       for (var i = 0; i < e.target.files.length; i++) {
  //         const file = e.target.files[i];
  //         const fileType = file.type;

  //         // Check if the file type is valid (PNG, JPG, JPEG, or PDF)
  //         if (validFileTypes.includes(fileType)) {
  //           tempSelectedFile.push({
  //             file: file,
  //             fileName: file.name,
  //             tempUrl: URL.createObjectURL(file),
  //           });
  //         } else {
  //           // Handle the case where an invalid file type is selected (e.g., show an error message)
  //           alert("Invalid file type. Please select PNG, JPG, JPEG, or PDF files.");
  //         }
  //       }
  //       setSelectedFiles(tempSelectedFile);
  //     } else {
  //       // Handle the case where the maximum number of files is exceeded (e.g., show an error message)
  //       alert("Maximum 10 files can be uploaded.");
  //     }
  //   } else if (type === "DELETE") {
  //     let filteredFileArray = selectedFiles.filter((item, index) => id !== index);
  //     setSelectedFiles(filteredFileArray);
  //   }
  //   e.target.value = "";
  // };

  // const uploadAttachmentHandler = (e, type, id = null) => {
  //   if (type === "UPLOAD") {
  //     var tempSelectedFile = [...selectedFiles]; // Create a copy of the existing files

  //     // Check if the total number of files will not exceed 10
  //     if (tempSelectedFile.length + e.target.files.length <= 10) {
  //       for (var i = 0; i < e.target.files.length; i++) {
  //         const file = e.target.files[i];
  //         const fileType = file.type;
  //         const fileSize = file.size; // Get the file size in bytes

  //         // Check if the file type is valid (PNG, JPG, JPEG, or PDF)
  //         if (validFileTypes.includes(fileType)) {
  //           // Check if the file size is less than or equal to 5MB (5 * 1024 * 1024 bytes)
  //           if (fileSize <= 5 * 1024 * 1024) {
  //             tempSelectedFile.push({
  //               file: file,
  //               fileName: file.name,
  //               tempUrl: URL.createObjectURL(file),
  //             });
  //           } else {
  //             // Handle the case where the file size exceeds 5MB (e.g., show an error message)
  //             alert("File size exceeds 5MB. Please select a smaller file.");
  //           }
  //         } else {
  //           // Handle the case where an invalid file type is selected (e.g., show an error message)
  //           alert("Invalid file type. Please select PNG, JPG, JPEG, or PDF files.");
  //         }
  //       }
  //       setSelectedFiles(tempSelectedFile);
  //     } else {
  //       // Handle the case where the maximum number of files is exceeded (e.g., show an error message)
  //       alert("Maximum 10 files can be uploaded.");
  //     }
  //   } else if (type === "DELETE") {
  //     let filteredFileArray = selectedFiles.filter((item, index) => id !== index);
  //     setSelectedFiles(filteredFileArray);
  //   }
  //   e.target.value = "";
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

      if (tempSelectedFile.length <= 10) {
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

  const handleDeleteAttachment = (e, id) => {
    // deleteAttachment(id).then((res) => {
    //   if (res.status === 200) {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((item, index) => id !== index)
    );
    loadAttachment();
    // }
    // });
  };

  // maximum length check for attachments
  const maxLengthCheck = (e) => {
    if (e.target.files.length > 5) {
      alert("You Can Upload Only 5 Attachments");
      document.getElementById("attachment").value = null;
    }
  };

  function handleInputChange(event, type) {
    const { name, value } = event.target;
    // console.log(igst);
    // if (type ==="IGST" &&event.target.checked == true) {
    //   setIgst(1);
    // } else {
    //   setIgst(0);
    // }
    if (/^\d+(\.\d{0,2})?$/.test(value)) {
      // setValue(inputValue);
      setBillAmountValues({ ...billAmountValues, [name]: value });
    } else if (value === "") {
      setBillAmountValues({ ...billAmountValues, [name]: "" });
    }
  }

  // function handleRoundOffChange(event) {
  //   const { name, value } = event.target;
  //   let input = value;
  //   // Remove any non-numeric, decimal point, or negative sign characters
  //   input = input.replace(/[^0-9.-]/g, "");
  //   // Check if the input has more than one dot
  //   if ((input.match(/\./g) || []).length > 1) {
  //     // If so, remove all dots after the first one
  //     input = input.replace(/\.(?=.*\.)/g, "");
  //   }
  //   // Check if the input has more than 2 decimal places
  //   if (input.indexOf(".") !== -1 && input.split(".")[1].length > 2) {
  //     // If so, round the input to 2 decimal places
  //     input = parseFloat(input).toFixed(2);
  //   }
  //   // Check if the input has more than one negative sign
  //   if ((input.match(/-/g) || []).length > 1) {
  //     // If so, remove all negative signs after the first one
  //     input = input.replace(/-(?=.*-)/g, "");
  //   }
  //   event.target.value = input;
  //   setBillAmountValues({ ...billAmountValues, [name]: input });
  // }

  function handleRoundOffChange(event) {
    const { name, value } = event.target;

    // Allow only '-' if it's the only character
    if (value === "-") {
      event.target.value = value;
    } else {
      // Remove any non-numeric, decimal point, or negative sign characters
      let input = value.replace(/[^0-9.-]/g, "");

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
      } else if (input.indexOf("-") > 0) {
        // If there's a negative sign not at the beginning, remove it
        input = input.replace("-", "");
      }

      event.target.value = input;
    }

    setBillAmountValues({ ...billAmountValues, [name]: event.target.value });
  }

  const billValue =
    parseFloat(
      billAmountValues.taxable_amount ? billAmountValues.taxable_amount : 0
    ) +
    parseFloat(billAmountValues.gst_amount ? billAmountValues.gst_amount : 0) +
    parseFloat(billAmountValues.round_off ? billAmountValues.round_off : 0) +
    parseFloat(billAmountValues.tcs ? billAmountValues.tcs : 0);

  const BillValue =
    parseFloat(
      billAmountValues.taxable_amount ? billAmountValues.taxable_amount : 0
    ) +
    parseFloat(billAmountValues.gst_amount ? billAmountValues.gst_amount : 0) +
    parseFloat(billAmountValues.round_off ? billAmountValues.round_off : 0);

  const BillAmount = billValue.toFixed(2);
  const BillAmount1 = BillValue.toFixed(2);

  // calculate tds amount value
  const tdsAmountValue =
    (parseFloat(
      billAmountValues.taxable_amount ? billAmountValues.taxable_amount : 0
    ) *
      parseFloat(tdsPercentage)) /
    100;

  const tdsValue = Math.ceil(tdsAmountValue);

  useEffect(() => {
    let netPayment = 0;

    if (isTcsApplicable === 1) {
      netPayment =
        parseFloat(BillAmount ? BillAmount : 0) -
        parseFloat(
          billAmountValues.debit_advance ? billAmountValues.debit_advance : 0
        );
    } else {
      netPayment =
        parseFloat(BillAmount1 ? BillAmount1 : 0) -
        parseFloat(
          billAmountValues.debit_advance ? billAmountValues.debit_advance : 0
        );
    }

    setNetPayment(Math.round(netPayment));

    if (tdsValue > 0) {
      netPayment = netPayment - parseFloat(tdsValue);
      setNetPayment(Math.round(netPayment));
    }
  }, [
    BillAmount,
    BillAmount1,
    billAmountValues.debit_advance,
    tdsValue,
    isTcsApplicable, // Add isTcsApplicable to the dependency array if it's not part of the state.
  ]);

  useEffect(() => {
    if (checkRole && checkRole[45].can_create === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  // const [billAmountValues, setBillAmountValues] = useState({
  //   round_off: '',
  // });

  const handleRoundOffChangee = (e) => {
    const inputValue = e.target.value;
    // Your other validation logic here

    // Example: Validate that the value is a valid number
    if (!/^-?\d*\.?\d{0,2}$/.test(inputValue)) {
      setRoundOffError("Invalid input");
    } else {
      setRoundOffError("");
    }

    // Update the state with the new value
    setBillAmountValues({
      ...billAmountValues,
      round_off: inputValue,
    });
  };

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <form method="POST" onSubmit={(e) => handleForm(e)}>
            {/* ********* MAIN DATA ********* */}
            <div className="card mt-2">
              <div className="card-header bg-primary text-white p-2">
                <h5>Create Bill</h5>
              </div>
              <div className="card-body">
                <div className="form-group row ">
                  <div className="col-md-3">
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
                        onChange={(e) => handleAssignToPerson(e)}
                        id="bill_type"
                        name="bill_type"
                        placeholder="Bill Type"
                        required
                      />
                    )}
                  </div>

                  <div className="col-md-3">
                    <label className="col-form-label">
                      <b>
                        Assign To : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {assignToDropdown && (
                      <Select
                        className="form-control form-control"
                        options={assignToDropdown}
                        id="assign_to"
                        name="assign_to"
                        placeholder="Assign To"
                        required
                      />
                    )}
                  </div>

                  <div className="col-md-3">
                    <label className="col-form-label">
                      <b>
                        Vendor Name : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {vendorDropdown && (
                      <Select
                        className="form-control form-control-sm"
                        id="vendor_name"
                        name="vendor_name"
                        options={vendorDropdown}
                        required
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
                      maxLength={25}
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersSpeicalOnly(e);
                      }}
                    />
                  </div>

                  <div className=" col-md-3 ">
                    <label className=" col-form-label">
                      <b>
                        {" "}
                        Bill Date: <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {authority && (
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        id="bill_date"
                        name="bill_date"
                        // min={
                        //   authority.Audit_Remark == true
                        //     ? new Date().getFullYear() - 1 + "-04-01"
                        //     : new Date().getFullYear() + "-04-01"
                        // }
                        // min={new Date().getFullYear() + "-04-01"}
                        max={formattedDate}
                        required
                        // max={new Date().toISOString().split("T")[0]}
                      />
                    )}
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
                      defaultValue={defaultValue}
                      readOnly={
                        authorities && authorities.Received_Date === false
                          ? true
                          : false
                      }
                    />
                  </div>
                </div>

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
                      step="any"
                      className="form-control form-control-sm"
                      id="debit_advance"
                      name="debit_advance"
                      maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
                      value={billAmountValues.debit_advance}
                      onChange={handleInputChange}
                      required
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
                  </div>

                  <div className=" col-md-3 ">
                    <label className=" col-form-label">
                      <b>
                        {" "}
                        Taxable Amount: <Astrick color="red" size="13px" />
                      </b>
                    </label>

                    {/* <input
                      type="number"
                      className="form-control form-control-sm"
                      id="taxable_amount"
                      name="taxable_amount"
                      step="any"
                      maxLength={10}
                      // onChange={e => handleTaxable(e)}
                      value={billAmountValues.taxable_amount}
                      onChange={handleInputChange}
                      required
                      onKeyPress={(e) => {
                        Validation.NumbersSpeicalOnlyDot(e);
                      }}

                      onInput={(e) => {
                        if (e.target.value.length > 13) {
                          e.target.value = e.target.value.slice(0, 13);
                        }
                      }}
                    /> */}

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="taxable_amount"
                      name="taxable_amount"
                      maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
                      value={billAmountValues.taxable_amount}
                      onChange={handleInputChange}
                      required
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

                      // onInput={(e) => {
                      //   const value = e.target.value;
                      //   const parts = value.split('.');

                      //   if (parts.length > 1) {
                      //     // Ensure only 2 decimal places
                      //     parts[1] = parts[1].slice(0, 2);
                      //   }

                      //   e.target.value = parts.join('.');

                      //   if (value.length > 13) {
                      //     e.target.value = value.slice(0, 13);
                      //   }
                      // }}
                    />
                  </div>

                  <div className=" col ">
                    <input
                      className="sm"
                      id="is_igst_applicable"
                      type="checkbox"
                      onChange={(e) => {
                        handleIgst(e);
                      }}
                      style={{ marginRight: "8px" }}
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
                      maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
                      value={billAmountValues.gst_amount}
                      onChange={(e) => handleInputChange(e)}
                      required
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
                      onInput={(e) => {
                        const value = e.target.value;
                        const parts = value.split(".");

                        if (parts.length > 1) {
                          // Ensure only 2 decimal places
                          parts[1] = parts[1].slice(0, 2);
                        }

                        e.target.value = parts.join(".");

                        if (value.length > 13) {
                          e.target.value = value.slice(0, 13);
                        }
                      }}
                    />
                  </div>

                  <div className=" col ">
                    <label className="col-sm-3 col-form-label">
                      <b> Round Off: </b>
                    </label>

                    {/* <input
                      type="number"
                      className="form-control form-control-sm"
                      id="round_off"
                      name="round_off"
                      step="any"
                      // onChange={e => { handleRoundOff(e) }}
                      value={billAmountValues.round_off}
                      onChange={e => handleRoundOffChange(e)}
                      required
                      // onKeyPress={(e) => {
                      //   Validation.NumbersSpeicalOnlyDot(e);
                      // }}
                      onInput={(e) => {
                        if (e.target.value.length > 13) {
                          e.target.value = e.target.value.slice(0, 13);
                        }
                      }}
                    /> */}

                    {/* <input
                      type="text"
                      step="any"
                      className="form-control form-control-sm"
                      id="round_off"
                      name="round_off"
                      maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
                      value={billAmountValues.round_off}
                      onChange={e => handleRoundOffChange(e)}
                      required
                      onKeyPress={(e) => {
                        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];
                        const inputValue = e.key;

                        if (!allowedKeys.includes(inputValue)) {
                          e.preventDefault();
                        }

                        const currentInput = e.target.value;
                        const decimalIndex = currentInput.indexOf('.');

                        if (decimalIndex !== -1 && (currentInput.length - decimalIndex) > 2) {
                          e.preventDefault();
                        }

                        if (currentInput.length >= 10 && inputValue !== '.' && decimalIndex === -1) {
                          e.preventDefault();
                        }
                      }}
                    /> */}
                    {/* <input
                      type="text"
                      step="any"
                      className="form-control form-control-sm"
                      id="round_off"
                      name="round_off"
                      maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
                      value={billAmountValues.round_off}
                      onChange={e => handleRoundOffChange(e)}
                      required
                      onKeyPress={(e) => {
                        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', '-'];
                        const inputValue = e.key;

                        if (!allowedKeys.includes(inputValue)) {
                          e.preventDefault();
                        }

                        const currentInput = e.target.value;
                        const decimalIndex = currentInput.indexOf('.');

                        // Allow '-' only at the beginning of the input
                        if (inputValue === '-' && e.target.selectionStart !== 0) {
                          e.preventDefault();
                        }

                        if (decimalIndex !== -1 && (currentInput.length - decimalIndex) > 2) {
                          e.preventDefault();
                        }

                        if (currentInput.length >= 10 && inputValue !== '.' && decimalIndex === -1) {
                          e.preventDefault();
                        }
                      }}
                    /> */}

                    {/* <input
  type="text"
  step="any"
  className="form-control form-control-sm"
  id="round_off"
  name="round_off"
  maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
  value={billAmountValues.round_off}
  onChange={e => handleRoundOffChange(e)}
  required
  onKeyPress={(e) => {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', '-'];
    const inputValue = e.key;
    const currentInput = e.target.value;
    const decimalIndex = currentInput.indexOf('.');

    // Allow '-' only at the beginning of the input
    if (inputValue === '-' && e.target.selectionStart !== 0) {
      e.preventDefault();
    }

    if (decimalIndex !== -1 && (currentInput.length - decimalIndex) > 2) {
      e.preventDefault();
    }

    if (currentInput.length >= 10 && inputValue !== '.' && decimalIndex === -1) {
      e.preventDefault();
    }

    if (!allowedKeys.includes(inputValue)) {
      e.preventDefault();
    }
  }}
  onBlur={(e) => {
    const value = e.target.value;
    if (value === '-') {
      // Display an error message or take appropriate action.
      alert("Value cannot be just a '-' sign.");
    }
  }}
/> */}

                    <input
                      type="text"
                      step="any"
                      className="form-control form-control-sm"
                      id="round_off"
                      name="round_off"
                      maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
                      value={billAmountValues.round_off}
                      onChange={(e) => handleRoundOffChange(e)}
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
                      onBlur={(e) => {
                        const value = e.target.value;

                        // Check if the value is a valid number
                        const isValidNumber = !isNaN(parseFloat(value));

                        if (!isValidNumber) {
                          // Display an error message or take appropriate action.
                          alert(
                            "Invalid round off value. Please enter a valid number."
                          );
                          // You might also reset the value or set an error state in your application.
                        }
                      }}
                    />

                    {/* <input
  type="text"
  step="any"
  className="form-control form-control-sm"
  id="round_off"
  name="round_off"
  maxLength={13} // 10 digits + 1 decimal point + 2 decimal places
  value={billAmountValues.round_off}
  onChange={(e) => handleRoundOffChange(e)}
  required
  onKeyPress={(e) => {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', '-'];
    const inputValue = e.key;
    const currentInput = e.target.value;
    const decimalIndex = currentInput.indexOf('.');

    // Allow '-' only at the beginning of the input
    if (inputValue === '-' && e.target.selectionStart !== 0) {
      e.preventDefault();
    }

    // Prevent multiple '-' characters
    if (inputValue === '-' && currentInput.includes('-')) {
      e.preventDefault();
    }

    // Allow only one decimal point
    if (inputValue === '.' && currentInput.includes('.')) {
      e.preventDefault();
    }

    // Limit input length
    if (currentInput.length >= 10 && inputValue !== '.' && decimalIndex === -1) {
      e.preventDefault();
    }

    // Limit decimal places to 2
    if (decimalIndex !== -1 && currentInput.length - decimalIndex > 2) {
      e.preventDefault();
    }

    // Allow other allowed keys
    if (!allowedKeys.includes(inputValue)) {
      e.preventDefault();
    }
  }}
/> */}

                    {/* {roundOffError && <div className="invalid-feedback">{roundOffError}</div>} */}
                  </div>
                </div>

                <div className=" form-group row mt-3 ">
                  <div className=" col-md-3 ">
                    <label className=" col-form-label">
                      <b>
                        {" "}
                        TCS Amount:{" "}
                        {isTcsApplicable == 1 && (
                          <Astrick color="red" size="13px" />
                        )}
                      </b>
                    </label>

                    {isTcsApplicable == 1 ? (
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="tcs"
                        name="tcs"
                        step="any"
                        // onChange={e => { handleTcs(e) }}
                        value={billAmountValues.tcs}
                        onChange={handleInputChange}
                        required={isTcsApplicable == 1 ? true : false}
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />
                    ) : (
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="tcs"
                        name="tcs"
                        step="any"
                        // onChange={e => { handleTcs(e) }}
                        value={billAmountValues.tcs}
                        readOnly={true}
                        onChange={handleInputChange}
                        required={isTcsApplicable == 1 ? true : false}
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />
                    )}
                  </div>

                  <div className=" col-md-3 ">
                    <label className="col-form-label">
                      <b>
                        {" "}
                        Bill Amount: <Astrick color="red" size="13px" />
                      </b>
                    </label>

                    <input
                      type="number"
                      className="form-control form-control-sm"
                      id="bill_amount"
                      name="bill_amount"
                      // value={billAmount}
                      // onChange={handleInputChange}
                      value={
                        BillAmount > 0 && isTcsApplicable == 1
                          ? BillAmount
                          : BillAmount1
                      }
                      readOnly={true}
                    />
                  </div>

                  <div className=" col-md-2 mt-4">
                    <input
                      className="sm-1"
                      type="checkbox"
                      style={{ marginRight: "8px", marginLeft: "10px" }}
                      id="is_tds_applicable"
                      name="is_tds_applicable"
                      onChange={(e) => handleTdsApplicable(e)}
                    />
                    <label className="col-form-label">
                      <b>TDS Applicable:</b>
                    </label>
                  </div>
                  <div className=" col-md mt-4">
                    {authority && (
                      <input
                        className="sm-1"
                        type="checkbox"
                        style={{ marginRight: "8px", marginLeft: "10px" }}
                        id="is_tcs_applicable"
                        // name="is_tcs_applicable"
                        onChange={(e) => {
                          handleTcsApplicable(e);
                        }}
                        disabled={
                          authorities && authorities.TCS_Applicable === false
                            ? true
                            : false
                        }
                      />
                    )}
                    <label className="col-form-label">
                      <b>TCS Applicable:</b>
                    </label>
                  </div>

                  <div className=" col-md mt-4">
                    <input
                      className="sm-1"
                      type="checkbox"
                      style={{ marginRight: "8px", marginLeft: "10px" }}
                      id="is_original_bill_needed"
                      // name="is_original_bill_needed"
                      onChange={(e) => {
                        handleIsOriginal(e);
                      }}
                      disabled={
                        authorities &&
                        authorities.Original_Bill_Needed === false
                          ? true
                          : false
                      }
                    />
                    <label className="col-form-label">
                      <b>Original Bill Needed</b>
                    </label>
                  </div>
                </div>

                {showTdsFileds && (
                  <div className=" form-group row mt-3 ">
                    <div className="col-md-3  ">
                      <label className="col-form-label">
                        <b>TDS section : </b>{" "}
                        <Astrick color="red" size="13px" />
                      </label>
                      {sectionDropdown && (
                        <Select
                          type="text"
                          className="form-control form-control-sm"
                          id="tds_section"
                          name="tds_section"
                          options={sectionDropdown}
                          ref={sectionRef}
                          required
                          onChange={(e) => handleSectionDropDownChange(e)}
                        />
                      )}
                    </div>

                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>TDS Constitution : </b>{" "}
                        <Astrick color="red" size="13px" />
                      </label>
                      {tdsData && tdsData.length > 0 && (
                        <span>
                          {constitutionDropdown && (
                            <Select
                              id="tds_constitution"
                              name="tds_constitution"
                              options={
                                constitutionDropdown
                                  ? constitutionDropdown
                                  : null
                              }
                              onChange={handleTdsPercentage}
                            />
                          )}
                        </span>
                      )}

                      {(!tdsData || tdsData.length == 0) && (
                        <span>
                          {constitutionDropdown && (
                            <Select
                              type="text"
                              className="form-control form-control-sm"
                              id="tds_constitution"
                              name="tds_constitution"
                              options={
                                constitutionDropdown
                                  ? constitutionDropdown
                                  : null
                              }
                              onChange={handleTdsPercentage}
                              // value={constitutionDropdown.length == 1 && constitutionDropdown[0]}
                            />
                          )}

                          {/* {constitutionDropdown && (
                            (constitutionDropdown.length > 1) ? (
                              <Select
                                id="tds_constitution"
                                name="tds_constitution"
                                options={constitutionDropdown}
                                onChange={handleTdsPercentage}
                              />
                            ) : (
                              <Select
                                id="tds_constitution"
                                name="tds_constitution"
                                onChange={handleTdsPercentage}
                                // value={constitutionDropdown[0]}
                              />

                            )
                          )} */}
                        </span>
                      )}
                    </div>

                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          TDS % : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="tds_percentage"
                        name="tds_percentage"
                        defaultValue={tdsPercentage}
                        readOnly
                        ref={tdsPercentageRef}
                        onChange={(e) => handleTds(e)}
                      />
                    </div>

                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          TDS Amount : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="tds_amount"
                        name="tds_amount"
                        // value={tdsAmount}
                        value={tdsValue}
                        readOnly={true}
                      />
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
                      type="number"
                      className="form-control form-control-sm"
                      id="net_payment"
                      name="net_payment"
                      value={netPayment}
                      // value={billAmountValues.net_payment}
                      // value={NetPaymentAmount}
                      // onChange={handleInputChange}
                      // onChange={handleInputChange}
                      readOnly={true}

                      // required
                    />

                    {/* <input type="text" className="form-control form-control-sm"
                                            value={numWords(netPayment).toUpperCase() + " ONLY"}
                                            style={{ border: "none", color: "red", fontSize: "12px", fontWeight: "bold", width: "100% !important", background: "white" }}
                                            readOnly
                                        /> */}
                  </div>

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

                  <div className=" col-md-3 ">
                    <label className=" col-form-label">
                      <b> Remark:</b>
                    </label>
                    <textarea
                      type="text"
                      className="form-control form-control-sm"
                      id="narration"
                      name="narration"
                      rows="4"
                      maxLength={1000}
                    />
                  </div>

                  <div className=" col-md-3 ">
                    <label className=" col-form-label">
                      <b> Remark History:</b>
                    </label>
                    <textarea
                      type="text"
                      className="form-control form-control-sm"
                      id="remark"
                      name="remark"
                      rows="4"
                      readOnly={true}
                    />
                  </div>

                  <div className=" col-md-3 ">
                    <label className=" col-form-label">
                      <b> Audit Remark: </b>
                    </label>
                    {authority && (
                      <textarea
                        type="text"
                        className="form-control form-control-sm"
                        id="audit_remark"
                        name="audit_remark"
                        rows="4"
                        maxLength={1000}
                        // readOnly={
                        //   authority.Audit_Remark === false ? true : false
                        // }
                      />
                    )}
                  </div>
                </div>

                {/* <div className=" col-md-3 ">
                                    <label className=" col-form-label">
                                        <b> Invoice Attachment: <Astrick color="red" size="13px" /></b>
                                    </label>
                                    <input type="file" className="form-control form-control-sm"
                                        id="attachment"
                                        name="attachment[]"
                                        onChange={e => handleShowFiles(e)}
                                        multiple
                                        ref={fileInputRef}
                                        rows="4"
                                    />
                                </div>
                                <div className="d-flex justify-content-start">
                                        {showFiles && showFiles.map((image, i) => {
                                            return <div key={Math.random()} className="" style={{height:"200px",width:"300px",marginLeft:"20px !important"}}>
                                                <img className="col-md mt-2" src={image} width="100%" height="100%" onClick={e =>handleImageClick(e, 'UPLOAD')} />
                                                     <button className ="btn btn p-0 mt-2" style={{marginLeft:"50%"}}onClick={() => {
                                                    setShowFiles(showFiles.filter(d => d !== image))
                                                }}>
                                             
                                             <i className="icofont-close-line" style={{fontWeight:"bold" , fontSize:"20px"}} ></i>
                                                </button>

                                               
                                            </div>
                                        })}
                                    </div> */}

                <div className="card mt-2">
                  <div className="card-body">
                    <div className="col-sm-4 mt-3">
                      <label className=" col-form-label">
                        <b>
                          Upload Attachment :<Astrick color="red" size="13px" />{" "}
                        </b>
                      </label>
                      <input
                        type="file"
                        id="attachment"
                        name="attachment"
                        ref={fileInputRef}
                        multiple
                        required={
                          selectedFiles && selectedFiles?.length < 0
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          // uploadAttachmentHandler(e, "UPLOAD", "");
                          maxLengthCheck(e);
                        }}
                      />
                    </div>
                  </div>
                  {/* <Attachment
                                            data={attachment}
                                            refId={id}
                                            handleAttachment={handleAttachment}
                                        /> */}
                </div>
                <div className="d-flex">
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
                              <img
                                src={attachment.tempUrl}
                                style={{ height: "100%", width: "100%" }}
                              />{" "}
                              *
                              <div className="d-flex justify-content-between p-0 mt-1">
                                <a
                                  href={`${attachment.tempUrl}`}
                                  target="_blank"
                                  className="btn btn-warning btn-sm p-0 px-1"
                                >
                                  <i
                                    className="icofont-download"
                                    style={{ fontSize: "10px", height: "15px" }}
                                  ></i>
                                </a>
                                <button
                                  className="btn btn-danger text-white btn-sm p-1"
                                  type="button"
                                  onClick={(e) => {
                                    handleDeleteAttachment(e, index);
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

                {/* <div className="col-sm-6 mt-4">
                                    <label className="form-label font-weight-bold">Status :<Astrick color="red" size="13px" /></label>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active"
                                                    value="1"
                                                    defaultChecked={true}

                                                />
                                                <label className="form-check-label" htmlFor="is_active_1">
                                                    Active
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active" value="0"
                                                // readOnly={(modal.modalData) ? false : true}
                                                />
                                                <label className="form-check-label" htmlFor="is_active">
                                                    Deactive
                                                </label>
                                            </div>
                                        </div>
                                    </div>


                                </div> */}
              </div>
            </div>
            {/* CARD */}

            <div className="mt-3" style={{ textAlign: "right" }}>
              <button type="submit" className="btn btn-primary">
                Submit
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
                      <div
                        className="card"
                        style={{ backgroundColor: "#EBF5FB" }}
                      >
                        <img className="col-md mt-2" src={d} />
                      </div>
                    </div>
                  );
                })}
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}
