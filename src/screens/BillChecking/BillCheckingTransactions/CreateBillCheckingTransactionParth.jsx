




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

// export default function CreateBillCheckingTransactionParth() {

    
  
//     const [tempData,setTempData]=useState([{bill_type:0,
//                                             assignt_to:0,
//                                             vendor_name:null,
//                                             vendor_bill_no:0,
//                                             bill_date:null,
//                                             receive_date:null,
//                                             debit_avdance:0,
//                                             taxable_amount:0,
//                                             igst_amount:false,
//                                             gst_amount:0,
//                                             round_off:0,
//                                             tcs:0,
//                                             bill_amount:0,
//                                             tds_applicable:false,
//                                             tds_percentage:0,
//                                             tds_section:0,
//                                             tds_constitution:0,
//                                             tds_amount:0,
//                                             net_payment:0
//                                             }])

//     const debitRef = useRef();
//     const taxableRef = useRef();
//     const gstRef = useRef();
//     const round_offRef = useRef();
//     const tcsRef = useRef();
//     const tdsRef = useRef();
//     const tdsPercentRef = useRef();

//     const history = useNavigate();
//     const [notify, setNotify] = useState(null);
//     const [data, setData] = useState(null);
//     const [customerType, setCustomerType] = useState(null);
//     const [dependent, setDependent] = useState({ country_id: null, state_id: null });

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

//     const [dropdowns, setDropdowns] = useState();

//     // const tds = {
//     //     "194A": ["Non Company Deductee"],
//     //     "194CB": ["Company With Surcharge", "Non Company Without Surcharge"],
//     //     "194J": ["Company Without Surcharge", "Non Company Without Surcharge"],
//     //     "194I": ["Company Without Surcharge", "Non Company Without Surcharge"],
//     // };

//     const [tdsData, setTdsData] = useState(null);
//     const handleTdsChange = (e) => {
//         setTdsData([e.target.value]);
//     }
//     const [showTdsFileds, setShowTdsFileds] = useState(false);
//     const handleTdsApplicable = (e) => {
//         setShowTdsFileds(e.target.checked);
//     }
//     const [billAmount, setBillAmount] = useState(null)
//     const [netPayment, setNetPayment] = useState(null)

//     const [tdsAmount, setTdsAmount] = useState(null)

//     const storeData=(e)=>{


//         // if(e.target.name=="igst_amount"){
//         //     setTempData((prevState) => {
//         //         return { ...prevState,[e.target.name]: e.target.checked}
//         //     });
//         // }else{
//         //     setTempData((prevState) => {
//         //         return { ...prevState,[e.target.name]: Number(e.target.value )}
//         //     });
//         // }

//             setTempData((prevState) => {
//                 return { ...prevState,[e.target.name]: Number(e.target.value )}
//             });

        
//         // var billAmount=tempData.taxable_amount+tempData.gst_amount;
       
//         // setTempData(prev=>{
//         //     return { ...prev,'bill_amount': Number(billAmount) }
//         // });

//     }

//     const calculate = (e, type = null) => {

//         // // var tds = 0;

//         // // if (type == "TDSAmount") {
//         // //     tds = e.target.value ? (e.target.value) : 0;
//         // // }else{
//         // //     tds = tdsRef.current.value ? (tdsRef.current.value) : 0;
//         // // }

//         // // var debit = debitRef.current.value ? (debitRef.current.value) : 0;
        
//         // var taxable = taxableRef.current.value ? (taxableRef.current.value) : 0;

//         // var gst = gstRef.current.value ? (gstRef.current.value) : 0;

//         // var round_off = round_offRef.current.value ? (round_offRef.current.value) : 0;

//         // var tcs = tcsRef.current.value ? (tcsRef.current.value) : 0;

//         // // var tdsPercent = tdsPercentRef.current.value ? (tdsPercentRef.current.value) : 0;

//         // var billAmount = (taxable + gst + round_off + tcs)

//         // setBillAmount(billAmount)

//         // // var netAmount = 0;
//         // // alert((billAmount - debit - tds)+ " T");
//         // // netAmount = parseFloat(billAmount - debit - tds)
//         // // console.log(netAmount);
//         // // if (netAmount >= 0) {
//         // //     setNetPayment(netAmount);
//         // //     setNetInWords(prev => numWords(netPayment));
//         // // }
        
//         // // var tdsAmount = 0
//         // // if(tdsAmount >= 0){
//         // // tdsAmount = parseFloat(billAmount * tdsPercent / 100 )
//         // // setTdsAmount(tdsAmount);
//         // // console.log(tdsAmount);
//         // // }
//     }

//     const [netInWords, setNetInWords] = useState();
//     const handleAmountWords = (e) => {
//         setNetInWords(null);
//         setNetInWords(numWords(netPayment));
//     }




//     const loadData = async () => {

//         await new BillCheckingService().getBillTypeData().then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setBillType(res.data.data)
//                     setBillTypeDropdown(res.data.data.map(d => ({ value: d.id, label: d.bill_type })))

//                 }
//             }
//         })

//         await new BillTransactionService().getSectionDropdown().then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     setSectionDropdown(res.data.data.map(d => ({ value: d.id, label: d.section_name })))
//                     setConstitutionDropdown(res.data.data.map(d => ({ value: d.id, label: d.constitution_name })))
//                 }
//             }
//         })

//         await new VendorMasterService().getVendors().then((res) => {
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

//     const handleSectionDropDownChange = async (e) => {
//         await new BillTransactionService().getSectionMappingDropdown(e.value).then((res) => {
//             if (res.status === 200) {
//                 if (res.data.status == 1) {
//                     console.log(res.data.data);
//                     setConstitution(res.data.data)
//                     setConstitutionDropdown(res.data.data.map(d => ({ value: d.id, label: d.constitution_name })))

//                 }
//             }
//         })
//     }

//     const handleTdsPercentage = (e) => {
//         const selectedContition=constitution.filter(d => d.id===e.value);
//         setTdsPercentage(selectedContition[0].percentage);

//     }

//     const handleForm = async (e) => {
//         e.preventDefault();

//         const form = new FormData(e.target);
//         setNotify(null)
//         await new BillTransactionService().createData(form).then(res => {
//             console.log(res);
//             if (res.status === 200) {
//                 if (res.data.status === 1) {
//                     history.push({
//                         pathname: `/${_base}/BillCheckingTransaction`,
//                         state: { alert: { type: 'success', message: res.data.message } }
//                     });
//                     setNotify({ type: 'success', message: res.data.message })
//                     loadData();
//                 } else {
//                     setNotify({ type: 'danger', message: res.data.message });
//                 }
//             } else {
//                 setNotify({ type: 'danger', message: res.data.message })
//                 new ErrorLogService().sendErrorLog("Payment_template", "Create_Payment_template", "INSERT", res.message);
//             }
//         })
//             .catch(error => {
//                 const { response } = error;
//                 const { request, ...errorObject } = response;
//                 setNotify({ type: 'danger', message: "Request Error !!!" })
//                 new ErrorLogService().sendErrorLog("Payment_template", "Create_Payment_template", "INSERT", errorObject.data.message);
//             })
//     }

//     const date = new Date();
//     const futureDate = date.getDate();
//     date.setDate(futureDate);
//     const defaultValue = date.toLocaleDateString('en-CA');


//     useEffect(() => {
//         loadData();
//     }, [])

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

//                             {tempData && JSON.stringify(tempData)}

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
//                                         <Select type="text" className="form-control form-control-sm"
//                                             id="assign_to"
//                                             options={userDropdown}
//                                             name="assign_to"
//                                             placeholder="Assign To"
//                                             required
//                                             onKeyPress={e => { Validation.CharactersOnly(e) }}
//                                         />
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
//                                             onKeyPress={e => { Validation.CharactersNumbersSpeicalOnly(e) }}


//                                         />
//                                     </div>

                                
    


//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Bill Date: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="date" className="form-control form-control-sm"
//                                             id="bill_date"
//                                             name="bill_date"
//                                             required
//                                             max={new Date().toISOString().split("T")[0]}

//                                         />
//                                     </div>


                                  

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Receive Date: <Astrick color="red" size="13px" /></b>
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
//                                             <b> Debit Advance: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text"
//                                             className="form-control form-control-sm"
//                                             id="debit_advance"
//                                             name="debit_advance"
//                                             onChange={e => storeData(e)}
//                                             // defaultValue={tempData.debit_advance}
//                                             required
//                                         // onKeyPress={e => { Validation.NumbersSpeicalOnlyDot(e) }}
//                                         />
//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Taxable Amount: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="taxable_amount"
//                                             name="taxable_amount"
//                                             // defaultValue={tempData.taxable_amount}
//                                             onChange={e => storeData(e)}
//                                         // required
//                                         />
//                                     </div>


//                                     <div className=" col ">
//                                         <input className="sm"
//                                             id="igst_amount"
//                                             name="igst_amount"
//                                             type="checkbox"
//                                             defaultValue={0}
//                                             ref={gstRef}
                                            
//                                             onChange={e =>storeData(e)}
//                                             style={{ marginRight: "8px" }} />
//                                         <label className="col-sm-3 col-form-label">
//                                             <b>IGST/GST :<Astrick color="red" size="13px" /></b>
//                                         </label>

//                                         <input type="text" className="form-control form-control-sm"
//                                             id="gst_amount"
//                                             name="gst_amount"
//                                             ref={gstRef}
//                                             onChange={e => storeData(e)}
//                                         // required
//                                         />
//                                     </div>


      



//                                     <div className=" col ">
//                                         <label className="col-sm-3 col-form-label">
//                                             <b> Round Off: </b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="round_off"
//                                             name="round_off"
//                                             ref={round_offRef}
//                                             onChange={e => { calculate(e); handleAmountWords(e) }}
//                                         // required
//                                         />
//                                     </div>
//                                 </div>
        
//                                 <div className=" form-group row mt-3 ">
//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> TCS: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="tcs"
//                                             name="tcs"
//                                             ref={tcsRef}
//                                             onChange={e => { calculate(e); handleAmountWords(e) }}
//                                         // required
//                                         />
//                                     </div>

                                   
//                                     <div className=" col-md-3 ">
//                                         <label className="col-form-label">
//                                             <b> Bill Amount: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="bill_amount"
//                                             name="bill_amount"
//                                             // defaultValue={tempData.bill_amount}
//                                         // required
//                                         />
//                                     </div>



//                                     <div className=" col-md-3 mt-4">
//                                         <input className="sm-1" type="checkbox" style={{ marginRight: "8px", marginLeft: "10px" }}
//                                             id="tds_applicable"
//                                             name="tds_applicable"
//                                             onChange={e => handleTdsApplicable(e)}
//                                         />
//                                         <label className="col-form-label">
//                                             <b>TDS Applicable: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                     </div>
//                                 </div>

  

//                                 {showTdsFileds && <div className=" form-group row mt-3 ">
//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b>TDS % : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <input type="text" className="form-control form-control-sm"
//                                             id="tds_percentage"
//                                             name="tds_percentage"
//                                             value={tdsPercentage}
//                                             ref ={tdsPercentRef}
//                                             onChange={e => calculate(e)}

//                                             // placeholder="Branch Name"
//                                             // required
//                                             onKeyPress={e => { Validation.CharactersOnly(e) }}
//                                         />
//                                     </div>
//                                     {/* {sectionDropdown && JSON.stringify(sectionDropdown)} */}
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
//                                             // placeholder="Branch Name"
//                                             // required
//                                             // onChange={(e) => handleTdsChange(e)}

//                                             />
//                                         }
//                                         {/* <option value={"194A"}>194A</option>
//                                             <option value={"194CA"}>194CA</option>
//                                             <option value={"194CB"}>194CB</option>
//                                             <option value={"194J"}>194J</option>
//                                             <option value={"194I"}>194I</option>
//                                             <option value={"194H"}>194H</option>
//                                             <option value={"194IB"}>194IB</option> */}

//                                     </div>

//                                 {/* <p>constitution :- {constitution && JSON.stringify(constitution)}</p>
//                                 <hr/>
//                                 <p>constitution :-    {constitutionDropdown && JSON.stringify(constitutionDropdown)} </p> */}


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
//                                             ref={tdsRef}
//                                             onChange={e => calculate(e)}
//                                             onKeyPress={e => { Validation.NumbersOnly(e) }}
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
//                                             value={netPayment ? netPayment : 0}
//                                         // required
//                                         />
//                                         <input type="text" className="form-control form-control-sm"
//                                             value={netPayment ? numWords(netPayment).toUpperCase() + " ONLY" : 0}
//                                             style={{ border: "none", color: "red", fontSize: "12px", fontWeight: "bold", width: "100% !important", background: "white" }}
//                                             disabled
//                                             readOnly
//                                         />

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
//                                             <b> Remark: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <textarea type="text" className="form-control form-control-sm"
//                                             id="remark"
//                                             name="remark"
//                                             // required
//                                             rows="4"
//                                         />
//                                     </div>

//                                     <div className=" col-md-3 ">
//                                         <label className=" col-form-label">
//                                             <b> Audit Remark: <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <textarea type="text" className="form-control form-control-sm"
//                                             id="audit_remark"
//                                             name="audit_remark"
//                                             // required
//                                             rows="4"
//                                         />
//                                     </div>
//                                 </div>



//                                 <div className=" col-md-3 ">
//                                     <label className=" col-form-label">
//                                         <b> Invoice Attachment: <Astrick color="red" size="13px" /></b>
//                                     </label>
//                                     <input type="file" className="form-control form-control-sm"
//                                         id="invoice_attachment"
//                                         name="invoice_attachment"
//                                         // required
//                                         rows="4"
//                                     />
//                                 </div>



//                                 <div className="col-sm-6 mt-4">
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


//                                 </div>
//                             </div>
//                         </div>
//                         {/* CARD */}


//                         <div className="mt-3" style={{ 'textAlign': 'right' }}>
//                             <button type="submit" className="btn btn-primary">
//                                 Submit
//                             </button>
//                             <Link to={`/${_base}/BillCheckingTransaction`}
//                                 className="btn btn-danger text-white">
//                                 Cancel
//                             </Link>
//                         </div>
//                     </form>

//                 </div>

//             </div>

//         </div>
//     )
// }

