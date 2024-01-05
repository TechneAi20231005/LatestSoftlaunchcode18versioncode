




// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import { Modal } from "react-bootstrap";
// import ErrorLogService from "../../../services/ErrorLogService";
// import CustomerType from "../../../services/MastersService/CustomerTypeService";
// import CustomerService from "../../../services/MastersService/CustomerService";
// import CountryService from "../../../services/MastersService/CountryService";
// import StateService from "../../../services/MastersService/StateService";
// import CityService from "../../../services/MastersService/CityService";
// import PageHeader from "../../../components/Common/PageHeader";
// import Alert from "../../../components/Common/Alert";
// import { Astrick } from "../../../components/Utilities/Style"
// import *  as Validation from '../../../components/Utilities/Validation';
// import { _base } from '../../../settings/constants'
// import Select from 'react-select';
// import DropdownService from "../../../services/Bill Checking/Bill Checking Transaction/DropdownService";
// import BillTransactionService from '../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService'

// import BillCheckingService from "../../../services/Bill Checking/Masters/BillTypeMasterService"
// import VendorMasterService from "../../../services/Bill Checking/Masters/VendorMasterService";
// import DepartmentService from "../../../services/MastersService/DepartmentService";
// import UserService from '../../../services/MastersService/UserService';
// import numWords from "num-words";


// export default function EditBillCheckingTransaction({ match }) {
//   const id = match.params.id

//   const [dropdowns, setDropdowns] = useState();

//   const history = useNavigate();
//   const [notify, setNotify] = useState(null);
//   const [data, setData] = useState(null);
//   const [customerType, setCustomerType] = useState(null);
//   const [dependent, setDependent] = useState({ country_id: null, state_id: null });

//   const [billType, setBillType] = useState(null)
//   const [billTypeDropdown, setBillTypeDropdown] = useState(null)
//   const [vendor, setVendor] = useState(null);
//   const [vendorDropdown, setVendorDropdown] = useState(null);
//   const [department, setDepartment] = useState(null);
//   const [departmentDropdown, setDepartmentDropdown] = useState(null);
//   const [cityDropdown, setCityDropdown] = useState(null);
//   const [user, setUser] = useState(null);
//   const [userDropdown, setUserDropdown] = useState(null);

//   const [constitution, setConstitution] = useState()
//   const [constitutionDropdown, setConstitutionDropdown] = useState()

//   const [sectionDropdown, setSectionDropdown] = useState();
//   const [tdsPercentage, setTdsPercentage] = useState();

//   const [billAmount, setBillAmount] = useState(0)
//   const [netPayment, setNetPayment] = useState(null)

//   const [tdsAmount, setTdsAmount] = useState(null)

//   const [tdsData, setTdsData] = useState(null);



//   const handleTdsChange = (e) => {
//     setTdsData([e.target.value]);
//   }
//   const [showTdsFileds, setShowTdsFileds] = useState(false);
//   const handleTdsApplicable = (e) => {
//     if(e.target.checked ){
//     setShowTdsFileds(e.target.checked);
//     }else{
//         setShowTdsFileds(e.target.checked= false);
//         setTdsPercentage(0)
//     }

// }



//   const [netInWords, setNetInWords] = useState();
//   // const handleAmountWords = (e) => {
//   //   setNetInWords(null);
//   //   setNetInWords(numWords(netPayment));
//   // }

//   const [debit, setDebit] = useState();
//   const [taxable, setTaxable] = useState();
//   const [gst, setGst] = useState();
//   const [roundOff, setRoundOff] = useState();
//   const [tcs, setTcs] = useState();
//   const [tds, setTds] = useState();
//   const [tdsPercent, setTdsPercent] = useState();

//   const handleTaxable = (e) => {
//     setTaxable(e.target.value)

//   }
//   const handleGst = (e) => {
//     setGst(e.target.value)
//   }
//   const handleRoundOff = (e) => {
//     setRoundOff(e.target.value)
//   }
//   const handleTcs = (e) => {
//     setTcs(e.target.value)
//   }

//   const handleTds = (e) => {
//     setTdsPercent(e.target.value)
//   }
//   const handleDebit = (e) => {
//     setDebit(e.target.value)
//   }

//   const handleTdsPercentage = (e) => {
//     const selectedContition = constitution.filter(d => d.id === e.value);
//     setTdsPercentage(selectedContition[0].percentage);

//   }

//   const handleSectionDropDownChange = async (e) => {
//     await new BillTransactionService().getSectionMappingDropdown(e.value).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           console.log(res.data.data);
//           setConstitution(res.data.data)
//           setConstitutionDropdown(res.data.data.map(d => ({ value: d.id, label: d.constitution_name })))

//         }
//       }
//     })
//   }

//   const loadData = async () => {

//     await new BillTransactionService().getBillCheckingById(id).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           console.log(res.data.data);
//           setData(res.data.data)
//         }
//       }
//     })

//     await new BillCheckingService().getBillTypeData().then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           setBillType(res.data.data)
//           console.log(res.data.data);
//           setBillTypeDropdown(res.data.data.map(d => ({ value: d.id, label: d.bill_type })))

//         }
//       }
//     })


//     await new VendorMasterService().getVendors().then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           console.log(res.data.data);
//           setVendor(res.data.data)
//           setVendorDropdown(res.data.data.map(d => ({
//             value: d.id, label: d.vendor_name
//           })))
//         }
//       }
//     })

//     await new DepartmentService().getDepartment().then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           setDepartment(res.data.data)
//           setDepartmentDropdown(res.data.data.map(d => ({ value: d.id, label: d.department })))
//         }
//       }
//     })

//     const inputRequired = "id,employee_id,first_name,last_name,middle_name";
//     await new UserService().getUserForMyTickets(inputRequired).then((res) => {
//             if (res.status === 200) {
//         if (res.data.status == 1) {
//           setUser(res.data.data)
//           setUserDropdown(res.data.data.map(d => ({ value: d.id, label: d.user_name })))
//         }
//       }
//     })
//   }

//   const handleForm = async (e) => {
//     e.preventDefault();
//     const form = new FormData(e.target);
//     setNotify(null)
//     await new BillTransactionService().updateBillChecking(id, form).then(res => {
//       console.log(res);
//       if (res.status === 200) {
//         if (res.data.status === 1) {
//           history({
//             pathname: `/${_base}/BillCheckingTransaction`,
//             state: { alert: { type: 'success', message: res.data.message } }
//           });
//           setNotify({ type: 'success', message: res.data.message })
//           loadData();
//         } else {
//           setNotify({ type: 'danger', message: res.data.message });
//         }
//       } else {
//         setNotify({ type: 'danger', message: res.data.message })
//         new ErrorLogService().sendErrorLog("Payment_template", "Create_Payment_template", "INSERT", res.message);
//       }
//     })
//       .catch(error => {
//         const { response } = error;
//         const { request, ...errorObject } = response;
//         setNotify({ type: 'danger', message: "Request Error !!!" })
//         new ErrorLogService().sendErrorLog("Payment_template", "Create_Payment_template", "INSERT", errorObject.data.message);
//       })
//   }


//   useEffect(() => {
//     loadData();
//   }, [])

//   useEffect(() => {
//     var tdsAmount = 0
//     if (tdsAmount >= 0) {
//       tdsAmount = parseFloat(billAmount) * parseFloat(tdsPercentage) / 100
//       setTdsAmount(tdsAmount);
//     }

//   }, [billAmount, tdsPercentage])

//   useEffect(() => {
//     var billAmount = parseInt(taxable) + parseInt(gst) + parseInt(roundOff) + parseInt(tcs)
//     if (billAmount) {

//       setBillAmount(billAmount)
//     }

//   }, [taxable, gst, roundOff, tcs])

//   useEffect(() => {
//     var netAmount = 0;
//     netAmount = parseInt(billAmount) - parseInt(debit)
//     if (tdsAmount > 0) {
//       netAmount = netAmount - parseInt(tdsAmount)
//     }
//     if (netAmount >= 0) {
//       setNetPayment(netAmount);
//       setNetInWords(prev => numWords(netPayment));
//     }
//   }, [billAmount, debit, tdsAmount])


//   return (

//     <div className="container-xxl">
//       {notify && <Alert alertData={notify} />}

//       <PageHeader />

//       <div className="row clearfix g-3">
//         {data && JSON.stringify(data)}
//         {data &&
//           <div className="col-sm-12">
//             <form method="POST" onSubmit={e => handleForm(e)}>
//               {/* ********* MAIN DATA ********* */}
//               <div className='card mt-2'>
//                 <div className='card-header bg-primary text-white p-2'>
//                   <h5>Edit Data</h5>
//                 </div>

//                 <div className='card-body'>

//                   <div className="form-group row ">
//                     <div className="col-md-3">
//                       <label className=" col-form-label">
//                        <b>Bill Type : <Astrick color="red" size="13px" /></b>
//                        </label>
//                       {billTypeDropdown &&
//                         <Select
//                           type="text"
//                           className="form-control form-control"
//                           options={billTypeDropdown}
//                           id="bill_type"
//                           name="bill_type"
//                           placeholder="Bill Type"
//                           defaultValue={data && billTypeDropdown.filter(d => d.value == data.bill_type)}
//                           required
//                         />
//                       }
//                     </div>

//                     <div className="col-md-3">
//                       <label className="col-form-label">
//                         <b>Assign To : <Astrick color="red" size="13px" /></b>
//                       </label>
//                       {(userDropdown && data) ?
//                         <Select type="text" className="form-control form-control-sm"
//                           id="assign_to"
//                           options={userDropdown}
//                           name="assign_to"
//                           placeholder="Assign To"
//                           required
//                           defaultValue={userDropdown.filter(d => d.value == data.assign_to)}
//                         /> :
//                         <p>Loading....</p>
//                       }
//                     </div>

//                     <div className="col-md-3">
//                       <label className="col-sm-4 col-form-label">
//                         <b>Vendor Name : <Astrick color="red" size="13px" /></b>
//                       </label>
//                       {vendorDropdown &&
//                         <Select className="form-control form-control-sm"
//                           id="vendor_name"
//                           name="vendor_name"
//                           options={vendorDropdown}
//                           required
//                           defaultValue={data && vendorDropdown.filter(d => d.value == data.vendor_name)}

//                         />
//                       }
//                     </div>
//                   </div>

//                   <div className="form-group row mt-3">
//                     {/* <div className="col-md-3">
//                             <label className=" col-form-label">
//                                 <b>Expected Bill Received Date : <Astrick color="red" size="13px" /></b>
//                             </label>
//                             <input type="date" className="form-control form-control-sm"
//                                 id="expected_bill_received_date"
//                                 name="expected_bill_received_date"
//                                 // placeholder="Bill Type"
//                                 // required
//                                 onKeyPress={e => { Validation.CharactersOnly(e) }}
//                             />
//                             </div> */}


//                     <div className="col-md-3 ">
//                       <label className=" col-form-label">
//                         <b>Vendor Bill No : <Astrick color="red" size="13px" /></b>
//                       </label>
//                       <input type="text" className="form-control form-control-sm"
//                         id="vendor_bill_no"
//                         name="vendor_bill_no"
//                         required
//                         defaultValue={data.vendor_bill_no}
//                         onKeyPress={e => { Validation.CharactersNumbersSpeicalOnly(e) }}


//                       />
//                     </div>

//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b> Bill Date: <Astrick color="red" size="13px" /></b>
//                       </label>
//                       <input type="date" className="form-control form-control-sm"
//                         id="bill_date"
//                         name="bill_date"
//                         required
//                         defaultValue={data.bill_date}
//                         max={new Date().toISOString().split("T")[0]}

//                       />
//                     </div>

//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b> Receive Date: <Astrick color="red" size="13px" /></b>
//                       </label>
//                       <input type="date" className="form-control form-control-sm"
//                         id="received_date"
//                         name="received_date"
//                         defaultValue={data.received_date}
//                         readOnly

//                       />
//                     </div>
//                   </div>

//                   <div className=" form-group row mt-3">
//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b> Debite Advance: <Astrick color="red" size="13px" /></b>
//                       </label>


//                       <input type="text"
//                         className="form-control form-control-sm"
//                         id="debit_advance"
//                         name="debit_advance"
//                         onChange={e => handleDebit(e)}
//                         defaultValue={data.debit_advance}
//                         required
//                         onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

//                       />
//                     </div>

//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b> Taxable Amount: <Astrick color="red" size="13px" /></b>
//                       </label>
//                       <input type="text" className="form-control form-control-sm"
//                         id="taxable_amount"
//                         name="taxable_amount"
//                         onChange={e => handleTaxable(e)}
//                         defaultValue={data.taxable_amount}
//                         required
//                         onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}

//                       />
//                     </div>

//                     <div className=" col ">
//                       <input className="sm"
//                         id="igst_amount"
//                         name="igst_amount"
//                         type="checkbox"
//                         onChange={e => { handleGst(e) }}
//                         defaultValue={data.igst_amount}
//                         style={{ marginRight: "8px" }} />
//                       <label className="col-sm-3 col-form-label">
//                         <b>IGST/GST :<Astrick color="red" size="13px" /></b>
//                       </label>

//                       <input type="text" className="form-control form-control-sm"
//                         id="gst_amount"
//                         name="gst_amount"
//                         defaultValue={data.gst_amount}
//                         onChange={e => { handleGst(e) }}
//                         required
//                       />
//                     </div>


//                     <div className=" col ">
//                       <label className="col-sm-3 col-form-label">
//                         <b> Round Off: </b>
//                       </label>
//                       <input type="text" className="form-control form-control-sm"
//                         id="round_off"
//                         name="round_off"
//                         onChange={e => { handleRoundOff(e) }}
//                         required
//                         defaultValue={data.round_off}

//                       />
//                     </div>
//                   </div>

//                   <div className=" form-group row mt-3 ">
//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b> TCS: <Astrick color="red" size="13px" /></b>
//                       </label>
//                       <input type="text" className="form-control form-control-sm"
//                         id="tcs"
//                         name="tcs"
//                         onChange={e => { handleTcs(e) }}
//                         required
//                         defaultValue={data.tcs}

//                       />
//                     </div>


//                     <div className=" col-md-3 ">
//                       <label className="col-form-label">
//                         <b> Bill Amount: <Astrick color="red" size="13px" /></b>
//                       </label>
//                       <input type="text" className="form-control form-control-sm"
//                         id="bill_amount"
//                         name="bill_amount"
//                         defaultValue={data.bill_amount}
//                         // value={billAmount}
//                         readOnly={true}
//                       // required
//                       />
//                     </div>



//                     <div className=" col-md-3 mt-4">
//                       <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
//                         id="is_tds_applicable"
//                         name="is_tds_applicable"
//                         onChange={e => handleTdsApplicable(e)}
//                         // checked={data.is_tds_applicable == 1 ? true : false}

//                       />
//                       <label className="col-form-label">
//                         <b>TDS Applicable: <Astrick color="red" size="13px" /></b>
//                       </label>
//                     </div>
//                   </div>



                
//                   {data.is_tds_applicable ==1 ?showTdsFileds &&  <div className=" form-group row mt-3 ">
//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b>TDS % : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="tds_percentage"
//                                             name="tds_percentage"
//                                             defaultValue={tdsPercentage}
//                                             onChange={e => handleTds(e)}
//                                             readOnly={true}
//                                             onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}
//                                         />
//                                     </div>


//                                     <div className="col-md-3  ">
//                                         <label className="col-form-label">
//                                             <b>TDS section : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         {sectionDropdown &&
//                                             <Select type="text" className="form-control form-control-sm"
//                                                 id="tds_section"
//                                                 name="tds_section"
//                                                 options={sectionDropdown}
//                                                 onChange={e => handleSectionDropDownChange(e)}
//                                             />
//                                         }

//                                     </div>


//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b>TDS Constitutaion : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         {tdsData && tdsData.length > 0 && <span>
//                                             {constitutionDropdown &&
//                                                 <Select 
//                                                     id="tds_constitution"
//                                                     name="tds_constitution"
//                                                     options={constitutionDropdown}
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
//                                                     options={constitutionDropdown}
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
//                                 </div>
//                             :""  }

//                   <div className=" form-group row mt-3 ">
//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b> Net Payment : <Astrick color="red" size="13px" /></b>
//                       </label>
//                       <input type="text" className="form-control form-control-sm"
//                         id="net_payment"
//                         name="net_payment"
//                         value={netPayment}

//                       // required
//                       />
//                       <input type="text" className="form-control form-control-sm"
//                         value={numWords(netPayment).toUpperCase() + " ONLY"}
//                         style={{ border: "none", color: "red", fontSize: "12px", fontWeight: "bold", width: "100% !important", background: "white" }}
//                         readOnly
//                       />

//                     </div>

//                     {/* <div className=" col-md-3 ">
//                                 <label className=" col-form-label">
//                                     <b> Net Payment In Words: <Astrick color="red" size="13px" /></b>
//                                 </label>
//                                 <input type="text" className="form-control form-control-sm"
//                                     id="net_payment_in_word"
//                                     name="net_payment_in_word"
//                                     // onChange ={e=>handleAmountWords(e)}

//                                 />
//                             </div> */}

//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b> Remark: <Astrick color="red" size="13px" /></b>
//                       </label>
//                       <textarea type="text" className="form-control form-control-sm"
//                         id="remark"
//                         name="remark"
//                         // required
//                         rows="4"
//                       />
//                     </div>

//                     <div className=" col-md-3 ">
//                       <label className=" col-form-label">
//                         <b> Audit Remark: <Astrick color="red" size="13px" /></b>
//                       </label>
//                       <textarea type="text" className="form-control form-control-sm"
//                         id="audit_remark"
//                         name="audit_remark"
//                         // required
//                         rows="4"
//                       />
//                     </div>
//                   </div>



//                   <div className=" col-md-3 ">
//                     <label className=" col-form-label">
//                       <b> Invoice Attachment: <Astrick color="red" size="13px" /></b>
//                     </label>
//                     <input type="file" className="form-control form-control-sm"
//                       id="invoice_attachment"
//                       name="invoice_attachment"
//                       // required
//                       rows="4"
//                     />
//                   </div>



//                   <div className="col-sm-6 mt-4">
//                     <label className="form-label font-weight-bold">Statuse :<Astrick color="red" size="13px" /></label>
//                     <div className="row">
//                       <div className="col-md-2">
//                         <div className="form-check">
//                           <input className="form-check-input" type="radio" name="is_active" id="is_active"
//                             value="1"
//                             defaultChecked={true}

//                           />
//                           <label className="form-check-label" htmlFor="is_active_1">
//                             Active
//                           </label>
//                         </div>
//                       </div>
//                       <div className="col-md-1">
//                         <div className="form-check">
//                           <input className="form-check-input" type="radio" name="is_active" id="is_active" value="0"
//                           // readOnly={(modal.modalData) ? false : true}
//                           />
//                           <label className="form-check-label" htmlFor="is_active">
//                             Deactive
//                           </label>
//                         </div>
//                       </div>
//                     </div>


//                   </div>
//                 </div>
//               </div>
//               {/* CARD */}


//               <div className="mt-3" style={{ 'textAlign': 'right' }}>
//                 <button type="submit" className="btn btn-primary">
//                   Update
//                 </button>
//                 <Link to={`/${_base}/BillCheckingTransaction`}
//                   className="btn btn-danger text-white">
//                   Cancel
//                 </Link>
//               </div>
//             </form>

//           </div>
//         }
//       </div>

//     </div>
//     // <div className="container-xxl">
//     //   {notify && <Alert alertData={notify} />}
//     //   <PageHeader />
//     //   <div className="row clearfix g-3">

//     //     {data && JSON.stringify(data)}
//     //     {data &&

//     //       <div className="col-sm-12">
//     //         <form method="POST" onSubmit={e => handleForm(e)}>
//     //           {/* ********* MAIN DATA ********* */}
//     //           <div className='card mt-2'>
//     //             <div className='card-header bg-primary text-white p-2'>
//     //               <h5>Edit Data</h5>
//     //             </div>


//     //             <div className='card-body'>


//     //               <div className="form-group row mt-3">
//     //                 <div className="col-md-3">
//     //                   <label className=" col-form-label">
//     //                     <b>Bill Type : <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   {billTypeDropdown &&
//     //                     <Select
//     //                       type="text"
//     //                       className="form-control form-control"
//     //                       options={billTypeDropdown}
//     //                       id="bill_type"
//     //                       name="bill_type"
//     //                       placeholder="Bill Type"
//     //                       defaultValue={data && billTypeDropdown.filter(d => d.value == data.bill_type)}
//     //                       required
//     //                     />
//     //                   }
//     //                 </div>

//     //                 <div className="col-md-3">
//     //                   <label className="col-form-label">
//     //                     <b>Assign To : <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   {(userDropdown && data) ?
//     //                     <Select type="text" className="form-control form-control-sm"
//     //                       id="assign_to"
//     //                       options={userDropdown}
//     //                       name="assign_to"
//     //                       placeholder="Assign To"
//     //                       required
//     //                       defaultValue={userDropdown.filter(d => d.value == data.assign_to)}
//     //                     /> :
//     //                     <p>Loading....</p>
//     //                   }
//     //                 </div>

//     //                 <div className="col-md-3">
//     //                   <label className="col-sm-4 col-form-label">
//     //                     <b>Vendor Name : <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   {vendorDropdown &&
//     //                     <Select className="form-control form-control-sm"
//     //                       id="vendor_name"
//     //                       name="vendor_name"
//     //                       options={vendorDropdown}
//     //                       required
//     //                       defaultValue={data && vendorDropdown.filter(d => d.value == data.vendor_name)}

//     //                     />
//     //                   }
//     //                 </div>
//     //                 {/* <div className="col-md-3 ">
//     //                                     <label className="col-md-4 col-form-label">
//     //                                         <b>Branch Name : <Astrick color="red" size="13px" /></b>
//     //                                     </label>
//     //                                     {departmentDropdown &&
//     //                                         <Select className="form-control form-control-sm"
//     //                                             id="department_name"
//     //                                             name="department_name"
//     //                                             options={departmentDropdown}
//     //                                         // placeholder="Branch Name"
//     //                                         // required

//     //                                         />
//     //                                     }
//     //                                 </div> */}
//     //               </div>





//     //               <div className="form-group row mt-3">
//     //                 {/* <div className="col-md-3">
//     //                                 <label className=" col-form-label">
//     //                                     <b>Expected Bill Received Date : <Astrick color="red" size="13px" /></b>
//     //                                 </label>
//     //                                 <input type="date" className="form-control form-control-sm"
//     //                                     id="expected_bill_received_date"
//     //                                     name="expected_bill_received_date"
//     //                                     // placeholder="Bill Type"
//     //                                     // required
//     //                                     onKeyPress={e => { Validation.CharactersOnly(e) }}
//     //                                 />
//     //                                 </div> */}


//     //                 <div className="col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b>Vendor Bill No : <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="vendor_bill_no"
//     //                     name="vendor_bill_no"
//     //                     required
//     //                     defaultValue={data.vendor_bill_no}
//     //                   />
//     //                 </div>

//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> Bill Date: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="date" className="form-control form-control-sm"
//     //                     id="bill_date"
//     //                     name="bill_date"
//     //                     required
//     //                     defaultValue={data.bill_date}


//     //                   />
//     //                 </div>

//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> Receive Date: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="date" className="form-control form-control-sm"
//     //                     id="received_date"
//     //                     name="received_date"
//     //                     defaultValue={data.received_date}
//     //                     readOnly

//     //                   />
//     //                 </div>
//     //               </div>

//     //               <div className=" form-group row mt-3">
//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> Debit Advance: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="text"
//     //                     className="form-control form-control-sm"
//     //                     id="debit_advance"
//     //                     name="debit_advance"
//     //                     onChange={e => handleNetPayment(e)}
//     //                     ref={debitRef}
//     //                     required
//     //                     defaultValue={data.debit_advance}

//     //                   />
//     //                 </div>

//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> Taxable Ammount: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="taxable_amount"
//     //                     name="taxable_amount"
//     //                     ref={taxableRef}
//     //                     onChange={e => calculate(e)}
//     //                     required
//     //                     defaultValue={data.taxable_amount}

//     //                   />
//     //                 </div>

//     //                 <div className=" col ">
//     //                   <input className="sm"
//     //                     id="igst_amount"
//     //                     name="igst_amount"
//     //                     type="checkbox"
//     //                     ref={gstRef}
//     //                     onChange={e => calculate(e)}
//     //                     defaultValue={data.gst_amount}
//     //                     style={{ marginRight: "8px" }} />
//     //                   <label className="col-sm-3 col-form-label">
//     //                     <b>IGST/GST :<Astrick color="red" size="13px" /></b>
//     //                   </label>

//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="gst_amount"
//     //                     name="gst_amount"
//     //                     ref={gstRef}
//     //                     onChange={e => calculate(e)}
//     //                     defaultValue={data.gst_amount}

//     //                   />
//     //                 </div>


//     //                 <div className=" col ">
//     //                   <label className="col-sm-3 col-form-label">
//     //                     <b> Round Off: </b>
//     //                   </label>
//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="round_off"
//     //                     name="round_off"
//     //                     ref={round_offRef}
//     //                     onChange={e => calculate(e)}
//     //                     required
//     //                     defaultValue={data.round_off}

//     //                   />
//     //                 </div>
//     //               </div>

//     //               <div className=" form-group row mt-3 ">
//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> TCS: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="tcs"
//     //                     name="tcs"
//     //                     ref={tcsRef}
//     //                     onChange={e => calculate(e)}
//     //                     required
//     //                     defaultValue={data.tcs}

//     //                   />
//     //                 </div>

//     //                 <div className=" col-md-3 ">
//     //                   <label className="col-form-label">
//     //                     <b> Bill Ammount: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="bill_amount"
//     //                     name="bill_amount"
//     //                     // value={billAmount ? billAmount : 0}
//     //                     defaultValue={data.bill_amount}

//     //                   />
//     //                 </div>




//     //                 <div className=" col-md-3 mt-4">
//     //                   <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
//     //                     id="is_tds_applicable"
//     //                     name="is_tds_applicable"
//     //                     onChange={e => handleTdsApplicable(e)}
//     //                     checked={data.is_tds_applicable == 1 ? true : false}


//     //                   />
//     //                   <label className="col-form-label">
//     //                     <b>TDS Applicable: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                 </div>
//     //               </div>



//     //               {showTdsFileds && <div className=" form-group row mt-3 ">
//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b>TDS % : <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="tds_percentage"
//     //                     name="tds_percentage"
//     //                     options={dropdowns}
//     //                     defaultValue={data.tds_percentage}
//     //                     required
//     //                     onKeyPress={e => { Validation.CharactersOnly(e) }}
//     //                   />
//     //                 </div>


//     //                 <div className="col-md-3  ">
//     //                   <label className="col-form-label">
//     //                     <b>TDS section : <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <select type="text" className="form-control form-control-sm"
//     //                     id="tds_section"
//     //                     name="tds_section"
//     //                     options={dropdowns}
//     //                     defaultValue={data.tds_section}
//     //                     onChange={(e) => handleTdsChange(e)}

//     //                   >
//     //                     <option value={"194A"}>194A</option>
//     //                     <option value={"194CA"}>194CA</option>
//     //                     <option value={"194CB"}>194CB</option>
//     //                     <option value={"194J"}>194J</option>
//     //                     <option value={"194I"}>194I</option>
//     //                     <option value={"194H"}>194H</option>
//     //                     <option value={"194IB"}>194IB</option>
//     //                   </select>
//     //                 </div>

//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b>TDS Constitutaion : <Astrick color="red" size="13px" /></b>
//     //                   </label>

//     //                   {tdsData && tdsData.length > 0 && <span>
//     //                     <Select type="text" className="form-control form-control-sm"
//     //                       id="tds_constitution"
//     //                       name="tds_constitution"
//     //                       options={tdsData.map(d => ({ value: d, label: d }))}
//     //                     // defaultValue={data && tdsData.filter(d => d.value == data.tds_constitution)}
//     //                     />
//     //                   </span>
//     //                   }

//     //                   {(!tdsData || tdsData.length == 0) && <span>
//     //                     <Select type="text" className="form-control form-control-sm"
//     //                       id="tds_constitution"
//     //                       name="tds_constitution"
//     //                       // defaultValue={data && tdsData.filter(d => d.value == data.tds_constitution)}
//     //                       options={[
//     //                         { value: null, label: 'Select Constitution' }
//     //                       ]}
//     //                     />
//     //                   </span>
//     //                   }

//     //                 </div>

//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b>TDS Amount : <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="tds_amount"
//     //                     name="tds_amount"
//     //                     readOnly
//     //                     ref={tdsRef}
//     //                     onChange={e => handleNetPayment(e)}
//     //                     onKeyPress={e => { Validation.CharactersOnly(e) }}
//     //                   />
//     //                 </div>
//     //               </div>
//     //               }

//     //               <div className=" form-group row mt-3 ">
//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> Net Payment : <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="net_payment"
//     //                     onChange={e => handleNetPayment(e)}
//     //                     name="net_payment"
//     //                     defaultValue={data.net_payment}
//     //                     // value={netPayment ? netPayment : 0}

//     //                     readOnly
//     //                   />


//     //                   <input type="text" className="form-control form-control-sm"
//     //                     value={numWords(netPayment).toUpperCase() + " ONLY"}
//     //                     style={{ border: "none", color: "red", fontSize: "12px", fontWeight: "bold", width: "100% !important", background: "white" }}
//     //                     readOnly
//     //                   />
//     //                 </div>

//     //                 {/* <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> Net Payment In Words: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <input type="text" className="form-control form-control-sm"
//     //                     id="net_payment_in_word"
//     //                     name="net_payment_in_word"
//     //                     readOnly={true}
//     //                   />
//     //                 </div> */}

//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> Remark History: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <textarea type="text" className="form-control form-control-sm"
//     //                     id="remark"
//     //                     name="remark"
//     //                     rows="4"
//     //                     readOnly
//     //                     defaultValue={data.remark}
//     //                   />
//     //                 </div>

//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> Audit Remark: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <textarea type="text" className="form-control form-control-sm"
//     //                     id="audit_remark"
//     //                     name="audit_remark"
//     //                     rows="4"
//     //                     readOnly
//     //                     defaultValue={data.audit_remark}
//     //                   />
//     //                 </div>

//     //                 <div className=" col-md-3 ">
//     //                   <label className=" col-form-label">
//     //                     <b> External Audit Remark: <Astrick color="red" size="13px" /></b>
//     //                   </label>
//     //                   <textarea type="text" className="form-control form-control-sm"
//     //                     id="external_audit_remark"
//     //                     name="external_audit_remark"
//     //                     rows="4"
//     //                   />
//     //                 </div>
//     //               </div>



//     //               <div className=" col-md-3 ">
//     //                 <label className=" col-form-label">
//     //                   <b> Invoice Attachment: <Astrick color="red" size="13px" /></b>
//     //                 </label>
//     //                 <input type="file" className="form-control form-control-sm"
//     //                   id="invoice_attachment"
//     //                   name="invoice_attachment"
//     //                   required
//     //                   rows="4"
//     //                 />
//     //               </div>



//     //               <div className="col-sm-6 mt-4">
//     //                 <label className="form-label font-weight-bold">Status :<Astrick color="red" size="13px" /></label>
//     //                 <div className="row">
//     //                   <div className="col-md-2">
//     //                     <div className="form-check">
//     //                       <input className="form-check-input" type="radio" name="is_active" id="is_active"
//     //                         value="1"
//     //                         defaultChecked={true}

//     //                       />
//     //                       <label className="form-check-label" htmlFor="is_active_1">
//     //                         Active
//     //                       </label>
//     //                     </div>
//     //                   </div>
//     //                   <div className="col-md-1">
//     //                     <div className="form-check">
//     //                       <input className="form-check-input" type="radio" name="is_active" id="is_active" value="0"
//     //                       // readOnly={(modal.modalData) ? false : true}
//     //                       />
//     //                       <label className="form-check-label" htmlFor="is_active">
//     //                         Deactive
//     //                       </label>
//     //                     </div>
//     //                   </div>
//     //                 </div>


//     //               </div>
//     //             </div>
//     //           </div>
//     //           {/* CARD */}


//     //           <div className="mt-3" style={{ 'textAlign': 'right' }}>
//     //             <button type="submit" className="btn btn-primary">
//     //               Update
//     //             </button>
//     //             <Link to={`/${_base}/BillCheckingTransaction`}
//     //               className="btn btn-danger text-white">
//     //               Cancel
//     //             </Link>
//     //           </div>
//     //         </form>

//     //       </div>
//     //     }
//     //   </div>

//     // </div>
//   )
// }

