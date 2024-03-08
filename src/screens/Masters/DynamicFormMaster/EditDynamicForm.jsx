// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ErrorLogService from "../../../services/ErrorLogService";
// import { Link } from 'react-router-dom';
// import { _base } from '../../../settings/constants';
// import AddOn from './AddOn';
// import { masterURL } from '../../../settings/constants';
// import { getData } from '../../../services/DynamicService/DynamicService';
// import DynamicFormService from '../../../services/MastersService/DynamicFormService';
// import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
// import Alert from "../../../components/Common/Alert";
// // import RenderDynamicForm from '../../TicketComponent/RenderDynamicForm';
// // import Alert from '../../NotificationComponent/Alert';
// import { Astrick } from "../../../components/Utilities/Style";
// import Select from 'react-select';
// import DatePicker from 'react-date-picker';
// import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService'

// function EditDynamicForm({ match }) {

//     const [showAlert, setShowAlert] = useState({ show: false, type: null, message: null });
//     const history = useNavigate();
//     const [data, setData] = useState();

//     const roleId = sessionStorage.getItem("role_id")
//     const [checkRole, setCheckRole] = useState(null)

//     const [notify, setNotify] = useState(null);
//     const mainJson = {
//     inputWidth: null,
//     inputType: null,
//     inputName: null,
//     inputLabel: null,
//     inputFormat: null,
//     inputDefaultValue: null,
//     inputAddOn: {
//         inputRange: null,
//         inputDataSource: null,
//         inputDataSourceData: null,
//         inputDateRange: null,
//     }
//     };

//     const [rows, setRows] = useState([mainJson]);

//     const [formShow, setFormShow] = useState(false);

//     const [index, setIndex] = useState({ index: 0 });

//     const [dropdown, setDropdown] = useState({ index: 0 });

//     const [inputDataSource, setInputDataSource] = useState();
//     console.log(inputDataSource)

//     const handleChange = idx => async (e) => {
//     setIndex({ index: idx })

//     // alert(e.target.value);
//     const notAllowed = ["ref_id", 'created_at', 'updated_at', 'attachment', 'query_type_id', 'query_type', 'object_id', 'tenant_id', 'ticket_id', 'user_id',
//         'confirmation_required', 'project_id', 'module_id', 'submodule_id', 'cuid', 'ticket_date', 'expected_solve_date', 'assign_to_department_id',
//         'assign_to_user_id', 'type_id', 'priority', 'status_id', 'description', 'from_department_id', 'remark', 'is_active', 'created_by', 'updated_by',
//         'passed_status', 'passed_status_changed_by', 'passed_status_changed_at', 'passed_status_remark', 'ticket_confirmation_otp', 'ticket_confirmation_otp_created_at'
//     ];

//     if (!notAllowed.includes(e.target.value.replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, '_').toLowerCase())) {
//         if (e.target.name === "inputWidth") {
//             rows[idx].inputWidth = e.target.value;
//         }
//         // else if(e.target.name==="inputName")
//         // {
//         //     rows[idx].inputName=e.target.value;
//         // }
//         else if (e.target.name === "inputType") {
//             rows[idx].inputType = e.target.value;

//             if (e.target.value == "date") {
//                 rows[idx].inputFormat = "y-MM-dd";
//             } else {
//                 rows[idx].inputFormat = null;
//             }
//         }
//         else if (e.target.name === "inputLabel") {
//             rows[idx].inputLabel = e.target.value;
//             rows[idx].inputName = e.target.value.replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, '_').toLowerCase();
//         }
//         else if (e.target.name === "inputFormat") {
//             rows[idx].inputFormat = e.target.value;
//         }
//         else if (e.target.name === "inputDefaultValue") {
//             rows[idx].inputDefaultValue = e.target.value;
//         }
//         else if (e.target.name === "inputDataOption") {
//             rows[idx].inputOption = e.target.value;
//         }
//         else if (e.target.name === "inputRange") {
//             rows[idx].inputAddOn.inputRange = e.target.value;
//         }
//         else if (e.target.name === "inputRangeMin") {
//             rows[idx].inputAddOn.inputRangeMin = e.target.value;
//         }
//         else if (e.target.name === "inputRangeMax") {
//             rows[idx].inputAddOn.inputRangeMax = e.target.value;
//         }
//         else if (e.target.name === "inputDataSource") {
//             // const test=e.target.value.split('|');
//             // const _URL=masterURL.dynamicFormDropdownMaster[test[0]];
//             // console.log(_URL)
//             // const _Value=test[1];
//             // const _Label=test[2];

//             // getData(_URL).then(res =>{
//             //     console.log(res)
//             //     const tempData=[];
//             //     for (const key in res.data) {
//             //         const t=res.data[key];
//             //         tempData.push({
//             //             value: t[_Value],
//             //             label: t[_Label]
//             //         })
//             //     }
//             //     rows[idx].inputAddOn.inputDataSourceData=tempData
//             // });
//             // rows[idx].inputAddOn.inputDataSource=e.target.value;

//             const test = e.target.value;
//             rows[idx].inputAddOn.inputDataSource = test;

//             await new DynamicFormDropdownMasterService().getDropdownById(test).then((res) => {
//                 if (res.status == 200) {
//                     if (res.data.status == 1) {
//                         const temp = [];
//                         res.data.data.dropdown.forEach(d => {
//                             temp.push({ 'label': d.label, 'value': d.id });
//                         })
//                         rows[idx].inputAddOn.inputDataSourceData = temp;
//                         setInputDataSource(temp)
//                     }
//                 }
//             })
//         }
//     } else {
//         alert("Not Allowed to use entered Keywork");
//         rows[idx].inputLabel = "";
//     }
//     // const rows = [...rows];
//     // rows[idx] = {
//     //     [name]: value
//     // };
//     // setRows({
//     //     rows
//     // });
//     };

//     // loadDynamicData = (_URL) =>{
//     // getData(_URL).then(res =>{
//     //     let counter=1;
//     //     for (const key in res.data) {
//     //         tempData.push({
//     //           counter:counter++,
//     //           id: res.data[key].id,
//     //           city: res.data[key].city
//     //         })
//     //     }
//     //     setData(tempData);
//     // });
//     // }

//     const handleAddRow = async () => {
//     setShowAlert({ show: false, type: null, message: null });
//     let flag = 1;
//     let last = rows.length - 1;

//     if (!rows[last].inputType || !rows[last].inputLabel || !rows[last].inputName) {
//         flag = 0;
//         setShowAlert({ show: false, type: null, message: null });
//     }

//     const item = {
//         inputWidth: null,
//         inputType: null,
//         inputName: null,
//         inputLabel: null,
//         inputFormat: null,
//         inputDefaultValue: null,
//         inputAddOn: {
//             inputRange: null,
//             inputDataSource: null,
//             inputDataSourceData: null,
//             inputDateRange: null,
//         }
//     };

//     if (flag === 1) {
//         await setRows([...rows, item]);
//     } else {
//         setShowAlert({ show: true, type: "warning", message: "Please Fill Previous Row Values" });
//     }
//     };

//     const handleRemoveSpecificRow = (idx) => () => {
//     if (idx > 0) {
//         setRows(
//             rows.filter((_, i) => i !== idx)
//         );
//     }
//     }

//     const handldeFormShow = () => {
//     setFormShow(
//         formShow === true ? false : true
//     )
//     }

//     const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = {
//         template_name: e.target.template_name.value,
//         is_active: e.target.is_active.value,
//         remark: e.target.remark.value,
//         data: JSON.stringify(rows)
//     }

//     await new DynamicFormService().updateDynamicForm(formId, data).then(res => {
//         console.log(res)
//         if (res.status === 200) {
//             if (res.data.status === 1) {
//                 history({
//                     pathname: `/${_base}/DynamicForm`,
//                     state: { alert: { type: 'success', message: res.data.message } }
//                 });
//             } else {
//                 setNotify({ type: 'danger', message: res.data.message });
//             }
//         } else {
//             setNotify({ type: 'danger', message: res.message });
//             new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
//         }
//     });
//     }

//     const loadData = async () => {
//     await new DynamicFormDropdownMasterService().getAllDropdown().then((res) => {
//         if (res.status === 200) {
//             if (res.data.status === 1) {
//                 // const temp=[];
//                 // res.data.data.forEach(d=>{
//                 //     temp.push({'label':d.dropdown_name,'value':d.id});
//                 // })
//                 // setDropdown(temp);
//                 setDropdown(res.data.data.map((d) => ({ label: d.dropdown_name, value: d.id })))
//             }
//         }
//     })
//     await new DynamicFormService().getDynamicFormById(formId).then(res => {
//         if (res.status === 200) {
//             if (res.data.data) {
//                 setData(res.data.data)
//                 setRows(JSON.parse(res.data.data.data))
//             }
//         }
//     })

//     await new ManageMenuService().getRole(roleId).then((res) => {
//         if (res.status === 200) {
//             if (res.data.status == 1) {
//                 const getRoleId = sessionStorage.getItem("role_id");
//                 setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
//             }
//         }
//     })
//     }

//     const [dateValue, setDateValue] = useState(new Date())
//     const onChangeDate = (value) => {
//     setDateValue(new Date(value))
//     }

//     useEffect(() => {
//     loadData();
//     }, [])
//     return (
//     <>

//         <div className="body d-flex py-3">

//             <div className="container-xxl">
//                 <div className="row clearfix g-3">
//                     <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
//                         {/*************** HEADING ***************/}
//                         <div className="card">
//                             <div className="card-header d-flex justify-content-between bg-transparent
//                             border-bottom-0">
//                                 <h2 className="mb-0 fw-bold "> Edit Dynamic Form</h2>
//                             </div>
//                         </div>
//                         {notify && <Alert alertData={notify} />}
//                         {/*************** TABLE ***************/}
//                         <div className='card mt-2'>
//                             <div className='card-body'>
//                                 <form onSubmit={handleSubmit}>
//                                     <div className='row'>
//                                         <div className='col-md-2'>
//                                             <label><b>Form Name : <Astrick color="red" size="13px" /></b></label>
//                                         </div>
//                                         <div className='col-md-4'>
//                                             <input type="text" className='form-control form-control-sm'
//                                                 name='template_name' id='template_name'
//                                                 required
//                                                 defaultValue={data && data.template_name}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-group row mt-3">
//                                         <label className="col-sm-2 col-form-label">
//                                             <b>Remark: </b>
//                                         </label>
//                                         <div className="col-sm-4">
//                                             <input type="text" className="form-control form-control-sm"
//                                                 id="remark"
//                                                 name="remark"
//                                                 defaultValue={data ? data.remark : null}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-group row mt-3">
//                                         <label className="col-sm-2 col-form-label">
//                                             <b>Status : <Astrick color="red" size="13px" /></b>
//                                         </label>
//                                         <div className="col-sm-10">
//                                             <div className="row">
//                                                 <div className="col-md-2">
//                                                     <div className="form-check">
//                                                         <input className="form-check-input" type="radio" name="is_active" id="is_active_1"
//                                                             value="1"
//                                                             defaultChecked={data && data.is_active === 1}
//                                                         />
//                                                         <label className="form-check-label" htmlFor="is_active_1">
//                                                             Active
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-1">
//                                                     <div className="form-check">
//                                                         <input className="form-check-input" type="radio" name="is_active" id="is_active_0" value="0"
//                                                             defaultChecked={data && data.is_active === 0}
//                                                         />
//                                                         <label className="form-check-label" htmlFor="is_active_0">
//                                                             Deactive
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className='table-responsive'>
//                                         <table
//                                             className="table table-bordered mt-3 table-responsive"
//                                             id="tab_logic"
//                                         >
//                                             <thead>
//                                                 <tr>
//                                                     <th className="text-center" style={{ width: "5%" }}> Sr No. </th>
//                                                     <th className="text-center" style={{ width: "15%" }}> Type </th>
//                                                     {/* <th className="text-center"> Width </th> */}
//                                                     {/* <th className="text-center"> Name </th> */}
//                                                     <th className="text-center" style={{ width: "20%" }}> Label </th>
//                                                     <th className="text-center" style={{ width: "20%" }}> Def. Value </th>
//                                                     <th className="text-center" style={{ width: "10%" }}>Format</th>
//                                                     <th className="text-center"> Add-Ons</th>
//                                                     <th className="text-center" style={{ width: "10%" }}> Action</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {rows && rows.map((item, idx) => (
//                                                     <tr id={`addr_${idx}`} key={idx}>
//                                                         <td>{idx + 1}</td>
//                                                         <td>
//                                                             <select className="form-control form-control-sm" required
//                                                                 name="inputType" defaultValue={item.inputType}
//                                                                 onChange={handleChange(idx)}
//                                                                 value={rows[idx].inputType}
//                                                             >
//                                                                 <option value=''>Select Type</option>
//                                                                 <option value="text">TEXT</option>
//                                                                 <option value="textarea">TEXTAREA</option>
//                                                                 <option value="number">NUMBER</option>
//                                                                 <option value="number">DECIMAL</option>
//                                                                 <option value="date">DATE</option>
//                                                                 <option value="datetime-local">DATE TIME</option>
//                                                                 <option value="time">TIME</option>
//                                                                 <option value="select">SELECT</option>
//                                                                 <option value="select-master">SELECT-MASTER</option>

//                                                             </select>
//                                                         </td>
//                                                         {/* <td>
//                                                     <select className="form-control form-control-sm" required
//                                                      name="inputWidth" defaultValue={item.inputWidth}
//                                                      onChange={handleChange(idx)}
//                                                      >
//                                                         <option>Select Width</option>
//                                                         <option value="col-sm-2">Very Small</option>
//                                                         <option value="col-sm-4" selected>Small</option>
//                                                         <option value="col-sm-6">Medium</option>
//                                                         <option value="col-sm-8">Large</option>
//                                                         <option value="col-sm-10">X-Large</option>
//                                                         <option value="col-sm-12">XX-Large</option>
//                                                     </select>
//                                                 </td>
//                                                 <td>
//                                                     <input
//                                                         type="text"
//                                                         name="inputName"
//                                                         defaultValue={item.inputName}
//                                                         onChange={handleChange(idx)}
//                                                         className="form-control form-control-sm"
//                                                         required
//                                                     />
//                                                 </td> */}
//                                                         <td>
//                                                             <input
//                                                                 type="text"
//                                                                 name="inputLabel"
//                                                                 defaultValue={item.inputLabel}
//                                                                 onChange={handleChange(idx)}
//                                                                 className="form-control form-control-sm"
//                                                                 required
//                                                             />
//                                                         </td>
//                                                         <td>
//                                                             <input
//                                                                 type="text"
//                                                                 name="inputDefaultValue"
//                                                                 defaultValue={item.inputDefaultValue}
//                                                                 onChange={handleChange(idx)}
//                                                                 className="form-control form-control-sm"
//                                                             />
//                                                         </td>
//                                                         <td>
//                                                             {rows[idx].inputType == "date" &&
//                                                                 <select className="form-control form-control-sm" required
//                                                                     name="inputFormat"
//                                                                     onChange={handleChange(idx)}
//                                                                     value={rows[idx].inputFormat}
//                                                                 >
//                                                                     <option>Select Format</option>
//                                                                     <option value="y-MM-dd">yyyy-mm-dd</option>
//                                                                     <option value="dd-MM-y">dd-mm-yyyy</option>
//                                                                 </select>
//                                                             }
//                                                         </td>

//                                                         <td>
//                                                             {rows && <AddOn id={idx} data={rows[idx]} onGetChange={handleChange(idx)}
//                                                                 dropdown={dropdown}
//                                                                 key={Math.random()}
//                                                             />}
//                                                         </td>

//                                                         <td>
//                                                             {idx === 0 &&
//                                                                 <button type="button" className="btn btn-sm btn-outline-primary pull-left"
//                                                                     onClick={handleAddRow}><i className="icofont-plus-circle"></i></button>
//                                                             }
//                                                             {rows.length === idx + 1 && idx !== 0 &&
//                                                                 <button type="button" className="btn btn-outline-danger btn-sm"
//                                                                     onClick={handleRemoveSpecificRow(idx)} >
//                                                                     <i className="icofont-ui-delete"></i>
//                                                                 </button>
//                                                             }
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>

//                                     </div>

//                                     {!formShow && rows && rows.length > 0 &&
//                                         <button type="button" className="btn btn-sm btn-info pull-left text-white"
//                                             onClick={handldeFormShow}
//                                         >
//                                             View Form
//                                         </button>
//                                     }
//                                     {formShow && rows && <button type="button" className="btn btn-sm btn-danger pull-left text-white"
//                                         onClick={handldeFormShow}>
//                                         Hide Form
//                                     </button>
//                                     }

//                                     <div className='pull-right'>
//                                         {checkRole && checkRole[12].can_update === 1 ?
//                                             <button type="submit" className="btn btn-sm btn-primary">Submit</button> : ""}
//                                         <Link to={`/${_base}/DynamicForm`} className="btn btn-sm btn-danger text-white">Cancel</Link>
//                                     </div>

//                                 </form>

//                             </div>   {/* Card Body */}
//                         </div>{/* Card */}
//                     </div>

//                     {formShow && rows &&
//                         <div className="row">
//                             {
//                                 rows.map((data, index) => {
//                                     if (data.inputType && data.inputName && data.inputLabel) {
//                                         if (data.inputAddOn.inputRange) {
//                                             var range = data.inputAddOn.inputRange.split("|")
//                                         } else if (data.inputAddOn.inputDateRange) {
//                                             var range = data.inputAddOn.inputDateRange.split("|")
//                                         }

//                                         return <div key={index} className={`${data.inputWidth} mt-2`} >
//                                             <label><b>{data.inputLabel} : </b></label>

//                                             {data.inputType === 'text' &&
//                                                 <input
//                                                     type={data.inputType}
//                                                     id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                     name={data.inputName}
//                                                     defaultValue={data.inputDefaultValue}
//                                                     className="form-control form-control-sm"
//                                                 />
//                                             }
//                                             {data.inputType === 'textarea' &&
//                                                 <textarea
//                                                     id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                     name={data.inputName}
//                                                     className="form-control form-control-sm"
//                                                 >{data.inputDefaultValue}</textarea>
//                                             }
//                                             {/* {data.inputType === 'date' &&
//                                                 <input
//                                                     type={data.inputType}
//                                                     id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                     name={data.inputName}
//                                                     defaultValue={data.inputDefaultValue}
//                                                     min={data.inputAddOn.inputDateRange ? range[0] : ''}
//                                                     max={data.inputAddOn.inputDateRange ? range[1] : ''}
//                                                     className="form-control form-control-sm"
//                                                 />
//                                             } */}

//                                             {data.inputType === 'date' &&
//                                                 <div className='form-control'>
//                                                     <DatePicker onChange={onChangeDate} value={dateValue} format={data.inputFormat}

//                                                         style={{ width: '100%' }}
//                                                     />
//                                                 </div>
//                                             }

//                                             {data.inputType === 'datetime-local' &&
//                                                 <input
//                                                     type={data.inputType}
//                                                     id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                     name={data.inputName}
//                                                     defaultValue={data.inputDefaultValue}
//                                                     min={data.inputAddOn.inputDateRange ? range[0] : ''}
//                                                     max={data.inputAddOn.inputDateRange ? range[1] : ''}
//                                                     className="form-control form-control-sm"
//                                                 />
//                                             }

//                                             {data.inputType === 'time' &&
//                                                 <input
//                                                     type={data.inputType}
//                                                     id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                     name={data.inputName}
//                                                     defaultValue={data.inputDefaultValue}
//                                                     min={data.inputAddOn.inputDateRange ? range[0] : ''}
//                                                     max={data.inputAddOn.inputDateRange ? range[1] : ''}
//                                                     className="form-control form-control-sm"
//                                                 />
//                                             }

//                                             {data.inputType === 'number' &&
//                                                 <input
//                                                     type="number"
//                                                     id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                     name={data.inputName}
//                                                     defaultValue={data.inputDefaultValue}
//                                                     min={data.inputAddOn.inputRange ? range[0] : ''}
//                                                     max={data.inputAddOn.inputRange ? range[1] : ''}
//                                                     className="form-control form-control-sm"
//                                                 />
//                                             }

//                                             {data.inputType === 'select' &&
//                                                 <select
//                                                     id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                     name={data.inputName}
//                                                     className="form-control form-control-sm"

//                                                 >
//                                                     <option>Select {data.inputName}</option>
//                                                     {data.inputAddOn.inputDataSourceData &&
//                                                         data.inputAddOn.inputDataSourceData.map((option) => {
//                                                             return <option value={option.value}>{option.label}</option>
//                                                         })
//                                                     }
//                                                 </select>

//                                                 // <Select
//                                                 //     options={inputDataSource}
//                                                 //     isMulti
//                                                 //     id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
//                                                 //     name={data.inputName}
//                                                 //     className="form-control form-control-sm"
//                                                 //     required={true}
//                                                 //     value={data.inputName}
//                                                 // />
//                                             }
//                                         </div>
//                                     }
//                                 })
//                             }

//                         </div>
//                     }

//                 </div> {/*ROW*/}
//             </div>{/*CONTAINER*/}
//         </div>{/*BODY*/}
//     </>
//     )
// }

// export default EditDynamicForm

// import React, { useState, useEffect, useRef } from 'react'
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import { useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'
// import { _base } from '../../../settings/constants'
// import ErrorLogService from "../../../services/ErrorLogService";
// import AddOn from './AddOn';
// import { masterURL } from '../../../settings/constants'
// import { getData } from '../../../services/DynamicService/DynamicService'
// import DynamicFormService from '../../../services/MastersService/DynamicFormService';
// import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
// // import RenderDynamicForm from '../../TicketComponent/RenderDynamicForm';
// import Alert from "../../../components/Common/Alert";
// import { Astrick } from "../../../components/Utilities/Style";
// import Select from 'react-select';
// import { Checkbox } from 'react-bootstrap';
// import DatePicker from 'react-date-picker';
// import *  as Validation from '../../../components/Utilities/Validation';
// import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
// import inputData from './data.json'

// function EditDynamicForm({ match }) {
//     const [notify, setNotify] = useState(null);
//     const history = useNavigate();
//     const [data, setData] = useState(null);

//     const [inputData, setInputData] = useState([{ "type": "text", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false }, { "type": "textarea", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "cols": 3 }, { "type": "number", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "minlength": null, "maxlength": null, "min": null, "max": null }, { "type": "date", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "min": null, "max": null, "format": null }, { "type": "datetime", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "min": null, "max": null, "format": null }, { "type": "time", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "minlength": null, "maxlength": null, "min": null, "max": null, "format": null }, { "type": "select", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "dropdownSourceName": null, "dropdownSourceData": null, "whomToChange": null }]);

//     // const inputData = [{ "type": "text", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false }, { "type": "textarea", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "cols": 3 }, { "type": "number", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "minlength": null, "maxlength": null, "min": null, "max": null }, { "type": "date", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "min": null, "max": null, "format": null }, { "type": "datetime", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "min": null, "max": null, "format": null }, { "type": "time", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "minlength": null, "maxlength": null, "min": null, "max": null, "format": null }, { "type": "select", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "dropdownSourceName": null, "dropdownSourceData": null, "whomToChange": null }];
//     const [dynamicForm, setDynamicForm] = useState([]);
//     const [currentForm, setCurrentForm] = useState(null);

//     const [dropdown, setDropdown] = useState();
//     const loadData = async () => {
//         // formId
//         if (formId) {
//             await new DynamicFormService().getDynamicFormById(formId).then(res => {
//                 if (res.status === 200) {
//                     if (res.data.data) {
//                         setData(res.data.data)
//                         setDynamicForm(res.data.data.data)
//                     }
//                 }
//             })
//         }
//         await new DynamicFormDropdownMasterService().getAllDropdown().then((res) => {
//             if (res.status == 200) {
//                 if (res.data.status == 1) {
//                     setDropdown(res.data.data.map((d) => ({ label: d.dropdown_name, value: d.id })))
//                 }
//             }
//         })
//     }

//     const [showDynamicFormModal, setShowDynamicFormModal] = useState({ display: false, index: null, data: null });

//     const handleDynamicModal = (e, display, index = null, data = null) => {
//         setCurrentForm();
//         if (data) {
//             setCurrentForm(data);
//         }
//         setShowDynamicFormModal({ display: display, index: index, data: data });
//     }

//     const handleDeleteAll = (i) => {
//         const newFields = dynamicForm.filter((d, i) => i !== i);
//         setDynamicForm(newFields);

//     };

//     const handleDelete = (i) => {
//         const newInputFields = [...dynamicForm];
//         newInputFields.splice(i, 1);
//         setDynamicForm(newInputFields);
//     };

//     const handleSelectedDropdown = e => {
//         setCurrentForm(prev => null);
//         setCurrentForm(inputData.filter((d) => d.type === e.target.value)[0]);

//     }

//     const addToForm = e => {

//         e.preventDefault();

//         // setCurrentForm(null)
//         if (currentForm.label === null) {
//             alert("Please enter the label name")

//         } else {
//             setDynamicForm(prev => [...prev, currentForm])
//             setCurrentForm();
//         }
//         handleClearData();

//     }

//     const selectTyperef = useRef();

//     const handleClearData = (e) => {

//         if (selectTyperef.current.value != null) {
//             document.getElementById('selectType').value = "";
//         }
//     }

//     const handleEditModal = (e, index, data) => {
//         // alert(index);
//         // setCurrentForm();
//         // setCurrentForm(data);
//         // setShowDynamicFormModal(true,index,data)
//     }
//     const EditForm = (index) => {
//         dynamicForm[index] = currentForm;
//         handleDynamicModal(false, null, null)
//     }

//     const handleInputChange = e => {
//         const { name, value } = e.target;
//         setCurrentForm({
//             ...currentForm,
//             [name]: value
//         })
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const data = {
//             template_name: e.target.template_name.value,
//             dynamicForm: dynamicForm
//         }
//         if (formId) {
//             // alert(formId);
//             await new DynamicFormService().updateDynamicForm(formId, data).then(res => {
//                 if (res.status === 200) {
//                     if (res.data.status === 1) {
//                         history({
//                             pathname: `/${_base}/DynamicForm`,
//                             state: { alert: { type: 'success', message: res.data.message } }
//                         });
//                     } else {
//                         setNotify({ type: 'danger', message: res.data.message });
//                     }
//                 } else {
//                     setNotify({ type: 'danger', message: res.message });
//                     new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
//                 }
//             });
//         } else {
//             await new DynamicFormService().postDynamicForm(data).then(res => {
//                 if (res.status === 200) {
//                     if (res.data.status === 1) {
//                         history({
//                             pathname: `/${_base}/DynamicForm`,
//                             state: { alert: { type: 'success', message: res.data.message } }
//                         });
//                     } else {
//                         setNotify({ type: 'danger', message: res.data.message });
//                     }
//                 } else {
//                     setNotify({ type: 'danger', message: res.message });
//                     new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
//                 }
//             });
//         }
//     }

//     useEffect(() => {
//         loadData();
//     }, [])
//     return (
//         <>
//             <div className="body d-flex py-3">
//                 <div className="container-xxl">
//                     <div className="row clearfix g-3">
//                         <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
//                             {/*************** HEADING ***************/}
//                             <div className="card">
//                                 <div className="card-header d-flex justify-content-between bg-transparent
//                                 border-bottom-0">
//                                     <h2 className="mb-0 fw-bold ">Dynamic Form</h2>
//                                     {/* <Link to="Country/Create/" className="btn btn-dark btn-sm btn-set-task w-sm-100">
//                                         <i className="icofont-plus-circle me-2 fs-6" />
//                                         Add
//                                     </Link> */}
//                                 </div>
//                             </div>
//                             {notify && <Alert alertData={notify} />}

//                             <Modal show={showDynamicFormModal.display}
//                                 onHide={e => handleDynamicModal(e, false, null, null)}
//                                 size="lg"
//                             >
//                                 <Modal.Header closeButton>
//                                     <Modal.Title>
//                                         {showDynamicFormModal.data ? "Edit Field" : "Add New Field"}
//                                     </Modal.Title>
//                                 </Modal.Header>
//                                 <Modal.Body>
//                                     {/* {currentForm && JSON.stringify(currentForm)} */}
//                                     <select
//                                         className='form-control form-control-sm'
//                                         onChange={handleSelectedDropdown}
//                                         ref={selectTyperef}
//                                         id="selectType"
//                                         defaultValue={showDynamicFormModal.data ? showDynamicFormModal.data.type : "Select"}

//                                     >
//                                         <option>Select Type</option>
//                                         {inputData.map((d, i) => {
//                                             return <option  key={i} value={d.type}>{d.type.toUpperCase()}</option>
//                                         })}
//                                     </select>
//                                     {currentForm &&
//                                         <div className='row'>
//                                             {currentForm.hasOwnProperty('label') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Label Name : <Astrick color="red" size="13px" /></b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="label"
//                                                         defaultValue={currentForm.label}
//                                                         onInput={e => handleInputChange(e)}
//                                                         onKeyPress={e => {
//                                                             Validation.CharacterWithSpace(e)
//                                                         }}
//                                                         required

//                                                     />
//                                                 </div>
//                                             }

//                                             {/* {currentForm.hasOwnProperty('name') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Name :</b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="name"
//                                                         defaultValue={currentForm.name}
//                                                         onInput={e=>handleInputChange(e)}
//                                                     />
//                                                 </div>
//                                             } */}

//                                             {currentForm.hasOwnProperty('value') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Default Value :</b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="defalutValue"
//                                                         defaultValue={currentForm.defalutValue}
//                                                         onInput={e => handleInputChange(e)}
//                                                         // onKeyPress={e => {
//                                                         //     Validation.CharacterWithSpace(e)
//                                                         // }}
//                                                     />
//                                                 </div>
//                                             }

//                                             {currentForm.hasOwnProperty('placeholder') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Placeholder :</b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="placeholder"
//                                                         defaultValue={currentForm.placeholder}
//                                                         onInput={e => handleInputChange(e)}
//                                                         // onKeyPress={e => {
//                                                         //     Validation.CharacterWithSpace(e)
//                                                         // }}
//                                                     />
//                                                 </div>
//                                             }
//                                             {currentForm.hasOwnProperty('required') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Required :</b></label>
//                                                     <select className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="required"
//                                                         defaultValue={currentForm.required}
//                                                         onChange={e => handleInputChange(e)}
//                                                     >
//                                                         <option value="FALSE">No</option>
//                                                         <option value="TRUE">Yes</option>
//                                                     </select>
//                                                 </div>
//                                             }
//                                             {currentForm.hasOwnProperty('readonly') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Readonly :</b></label>
//                                                     <select className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="readonly"
//                                                         onChange={e => handleInputChange(e)}
//                                                         defaultValue={currentForm.readonly}
//                                                     >
//                                                         <option value="FALSE">No</option>
//                                                         <option value="TRUE">Yes</option>
//                                                     </select>
//                                                 </div>
//                                             }

//                                             {currentForm.hasOwnProperty('disabled') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Disabled :</b></label>
//                                                     <select className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="disabled"
//                                                         defaultValue={currentForm.disabled}
//                                                         onChange={e => handleInputChange(e)}
//                                                     >
//                                                         <option value="NO">No</option>
//                                                         <option value="YES">Yes</option>
//                                                     </select>
//                                                 </div>
//                                             }
//                                             {currentForm.hasOwnProperty('cols') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Cols :</b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="cols"
//                                                         defaultValue={currentForm.cols}
//                                                         onInput={e => handleInputChange(e)}
//                                                         maxLength={1}
//                                                         onKeyPress={e => {
//                                                             Validation.NumbersOnly(e)
//                                                         }}
//                                                     />
//                                                 </div>
//                                             }
//                                             {currentForm.hasOwnProperty('minlength') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Min Length :</b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="minlength"
//                                                         defaultValue={currentForm.minlength}
//                                                         onInput={e => handleInputChange(e)}
//                                                         onKeyPress={e => {
//                                                             Validation.NumbersOnly(e)
//                                                         }}
//                                                     />
//                                                 </div>
//                                             }
//                                             {currentForm.hasOwnProperty('maxlength') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Max Length :</b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="maxlength"
//                                                         defaultValue={currentForm.maxlength}
//                                                         onInput={e => handleInputChange(e)}
//                                                         onKeyPress={e => {
//                                                             Validation.NumbersOnly(e)
//                                                         }}
//                                                     />
//                                                 </div>
//                                             }
//                                             {currentForm.hasOwnProperty('min') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Min Value :</b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="min"
//                                                         defaultValue={currentForm.min}
//                                                         onInput={e => handleInputChange(e)}
//                                                         onKeyPress={e => {
//                                                             Validation.NumbersOnly(e)
//                                                         }}
//                                                     />
//                                                 </div>
//                                             }
//                                             {currentForm.hasOwnProperty('max') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Max Value :</b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="max"
//                                                         defaultValue={currentForm.max}
//                                                         onInput={e => handleInputChange(e)}
//                                                         onKeyPress={e => {
//                                                             Validation.NumbersOnly(e)
//                                                         }}
//                                                     />
//                                                 </div>
//                                             }

//                                             {currentForm.hasOwnProperty('format') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Enter Format :</b></label>
//                                                     <input className="form-control form-control-sm"
//                                                         type="text"
//                                                         name="format"
//                                                         defaultValue={currentForm.format}
//                                                         onInput={e => handleInputChange(e)}
//                                                     />
//                                                 </div>
//                                             }
//                                             {currentForm.hasOwnProperty('dropdownSourceName') && dropdown &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Dropdown Source :</b></label>
//                                                     <select className="form-control form-control-sm"
//                                                         name="dropdownSourceName"
//                                                         defaultValue={currentForm.dropdownSourceName}
//                                                         onChange={e => handleInputChange(e)}
//                                                     >
//                                                         <option value="">Select Source</option>
//                                                         {dropdown && dropdown.map((d, i) => {
//                                                             return <option value={d.value}>{d.label}</option>
//                                                         })}
//                                                     </select>
//                                                 </div>
//                                             }

//                                             {/* {currentForm.hasOwnProperty('dropdownSourceData') &&
//                                                 <div className='col-md-3'>
//                                                 <label><b>Dropdown Source Data:</b></label>
//                                                 <select className="form-control form-control-sm"
//                                                     name="dropdownSourceData"
//                                                     defaultValue={currentForm.dropdownSourceData}
//                                                     onChange={e=>handleInputChange(e)}
//                                                     >
//                                                 </select>
//                                             </div>
//                                             } */}

//                                             {currentForm.hasOwnProperty('whomToChange') &&
//                                                 <div className='col-md-3'>
//                                                     <label><b>Make Change In :</b></label>
//                                                     <select className="form-control form-control-sm"
//                                                         name="whomToChange"
//                                                         defaultValue={currentForm.whomToChange}
//                                                         onChange={e => handleInputChange(e)}
//                                                     >
//                                                         <option value="">Select Child</option>
//                                                         {dynamicForm &&
//                                                             dynamicForm.filter(d => d.type == "select" && d.name != currentForm.name)
//                                                                 .map((d, i) => {
//                                                                     return <option key={i} value={d.name}>{d.label}</option>
//                                                                 })
//                                                         }
//                                                     </select>
//                                                 </div>
//                                             }
//                                         </div>
//                                     }
//                                 </Modal.Body>
//                                 <Modal.Footer>
//                                     <button type="button" className="btn btn-sm btn-danger" onClick={e => handleDynamicModal(e, false, null, null)}>
//                                         Close
//                                     </button>
//                                     {(showDynamicFormModal.data) ?
//                                         <button type="button" className="btn btn-sm btn-secondary" onClick={(e) => EditForm(showDynamicFormModal.index)}>
//                                             Edit From
//                                         </button>
//                                         :
//                                         <button type="button" className="btn btn-sm btn-info" onClick={(e) => addToForm(e)}>
//                                             Add To From
//                                         </button>

//                                     }
//                                 </Modal.Footer>
//                             </Modal>

//                             {/*************** TABLE ***************/}
//                             <div className='card mt-2'>
//                                 <div className='card-body'>
//                                     <form onSubmit={handleSubmit}>
//                                         <div className='row'>
//                                             <div className='col-md-2'>
//                                                 <label><b>Form Name :<Astrick color="red" size="13px" /></b></label>
//                                             </div>
//                                             <div className='col-md-4'>
//                                                 <input type="text" className='form-control form-control-sm'
//                                                     name='template_name' id='template_name'
//                                                     defaultValue={data ? data.template_name : ""}
//                                                     required
//                                                     onKeyPress={e => {
//                                                         Validation.CharactersNumbersOnly(e)
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className='row'>
//                                             <div className='col-md-12 text-right' style={{ textAlign: "right" }}>
//                                                 <button type="button" className="btn btn-sm btn-primary"
//                                                     onClick={e => handleDynamicModal(e, true, null, null)}>
//                                                     Add New Field
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {/* {dynamicForm && JSON.stringify(dynamicForm)} */}

//                                         <div class="row" >
//                                             {dynamicForm && dynamicForm.map((d, i) => {
//                                                 if (d.type == "text") {
//                                                     return <div class="col-md-4" key={Math.random()}>
//                                                         <label><b>{d.label} : </b></label>
//                                                         <input type="text"
//                                                             className="form-control"
//                                                             id={d.id}
//                                                             name={d.label.replace(' ', '_').toLowerCase()}
//                                                             defaultValue={d.defalutValue}
//                                                             // readOnly={(d.readonly) ? false : true}
//                                                             readOnly={d.readonly == "TRUE"}
//                                                         // placeholder={d.placeholder}
//                                                         // required={d.required}
//                                                         // readonly={d.readonly}
//                                                         // disabled={d.disabled}
//                                                         />

//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>

//                                                     </div>
//                                                 }
//                                                 if (d.type == "textarea") {
//                                                     return <div class="col-md-4">
//                                                         <label><b>{d.label} :</b></label>
//                                                         <textarea
//                                                             className="form-control"
//                                                             id={d.id}
//                                                             name={d.name}
//                                                             defaultValue={d.defaultValue}
//                                                             placeholder={d.placeholder}
//                                                             // required={d.required}
//                                                             // readonly={d.readonly}
//                                                             // disabled={d.disabled}
//                                                             cols={d.cols}
//                                                         />
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>

//                                                     </div>
//                                                 }
//                                                 if (d.type == "number") {
//                                                     return <div class="col-md-4">
//                                                         <label><b>{d.label} :</b></label>
//                                                         <input type="number"
//                                                             className="form-control"
//                                                             id={d.id}
//                                                             name={d.name}
//                                                             defaultValue={d.defaultValue}
//                                                             placeholder={d.placeholder}
//                                                             // required={d.required}
//                                                             // readonly={d.readonly}
//                                                             // disabled={d.disabled}
//                                                             minLength={d.minlength}
//                                                             maxLength={d.maxlength}
//                                                             min={d.min}
//                                                             max={d.max}
//                                                         />
//                                                         {/* <button type="button" className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button> */}
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>
//                                                     </div>
//                                                 }
//                                                 if (d.type == "date") {
//                                                     return <div class="col-md-4">
//                                                         <label><b>{d.label} :</b></label>
//                                                         <input type="date"
//                                                             className="form-control"
//                                                             id={d.id}
//                                                             name={d.name}
//                                                             defaultValue={d.defaultValue}
//                                                             placeholder={d.placeholder}
//                                                             // required={d.required}
//                                                             // readonly={d.readonly}
//                                                             // disabled={d.disabled}
//                                                             min={d.min}
//                                                             max={d.max}
//                                                         />
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                     </div>

//                                                 }

//                                                 if (d.type == "datetime") {
//                                                     return <div class="col-md-4">
//                                                         <label><b>{d.label} :</b></label>
//                                                         <input type="datetime"
//                                                             className="form-control"
//                                                             id={d.id}
//                                                             name={d.name}
//                                                             defaultValue={d.defaultValue}
//                                                             placeholder={d.placeholder}
//                                                             // required={d.required}
//                                                             // readonly={d.readonly}
//                                                             // disabled={d.disabled}
//                                                             min={d.min}
//                                                             max={d.max}
//                                                             format={d.format}
//                                                         />
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                     </div>
//                                                 }
//                                                 if (d.type == "time") {
//                                                     return <div class="col-md-4">
//                                                         <label><b>{d.label} :</b></label>
//                                                         <input type="time"
//                                                             className="form-control"
//                                                             id={d.id}
//                                                             name={d.name}
//                                                             defaultValue={d.defaultValue}
//                                                             placeholder={d.placeholder}
//                                                             // required={d.required}
//                                                             // readonly={d.readonly}
//                                                             // disabled={d.disabled}
//                                                             min={d.min}
//                                                             max={d.max}
//                                                             format={d.format}
//                                                         />
//                                                     </div>
//                                                 }
//                                                 if (d.type == "select") {
//                                                     return <div class="col-md-4">
//                                                         <label><b>{d.label} :</b></label>
//                                                         <Select className="form-control"
//                                                             id={d.id}
//                                                             name={d.name}
//                                                             defaultValue={d.defaultValue}
//                                                         // required={d.required}
//                                                         // readonly={d.readonly}
//                                                         // disabled={d.disabled}
//                                                         />
//                                                         <div className="mt-5">
//                                                             <button type="button" className="btn btn-sm btn-primary" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                         </div>
//                                                     </div>
//                                                 }
//                                             })
//                                             }
//                                         </div>
//                                         {dynamicForm && dynamicForm.length > 0 &&

//                                             <div className="mt-4">
//                                                 <button type="submit" className='btn btn-sm btn-primary'>Submit</button>
//                                                 <button type="button" className='btn btn-sm btn-primary' onClick={() => handleDeleteAll()} >Clear All Field</button>

//                                             </div>

//                                         }

//                                     </form>

//                                 </div>   {/* Card Body */}
//                             </div>{/* Card */}
//                         </div>

//                     </div> {/*ROW*/}
//                 </div>{/*CONTAINER*/}
//             </div>{/*BODY*/}
//         </>
//     )
// }

// export default EditDynamicForm

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorLogService from "../../../services/ErrorLogService";
import { Link } from "react-router-dom";
import { _base } from "../../../settings/constants";
import AddOn from "./AddOn";
import { masterURL } from "../../../settings/constants";
import { getData } from "../../../services/DynamicService/DynamicService";
import DynamicFormService from "../../../services/MastersService/DynamicFormService";
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
import Alert from "../../../components/Common/Alert";
// import RenderDynamicForm from '../../TicketComponent/RenderDynamicForm';
// import Alert from '../../NotificationComponent/Alert';
import { Astrick } from "../../../components/Utilities/Style";
import Select from "react-select";
import DatePicker from "react-date-picker";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import { getAllRoles, getCityData, getCountryDataSort, getCustomerData, getRoles, getStateDataSort } from "../../Dashboard/DashboardAction";
import {
  dynamicFormData,
  getAllDropDownData,
} from "../DynamicFormDropdown/Slices/DynamicFormDropDownAction";

import *  as Validation from '../../../components/Utilities/Validation';
import UserService from "../../../services/MastersService/UserService";
import { getDesignationData } from "../DesignationMaster/DesignationAction";
import { getStatusData } from "../StatusMaster/StatusComponentAction";
import QueryTypeService from "../../../services/MastersService/QueryTypeService";

function EditDynamicForm({ match }) {
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: null,
    message: null,
  });
  const { id } = useParams();
  const formId = id;
  const history = useNavigate();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 12)
  );
  // const dropdown=useSelector(DynamicFormDropDownSlice=>DynamicFormDropDownSlice.dynamicFormDropDown.dropDownData)

  const dropdown = useSelector(
    (DynamicFormDropDownSlice) =>
      DynamicFormDropDownSlice.dynamicFormDropDown.sortDropDown
  );

  const sortDropDownData =
    dropdown && dropdown.map((d) => ({ value: d.id, lable: d.dropdown_name }));
  console.log("sort", sortDropDownData);
  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null);

  const [notify, setNotify] = useState(null);
  const mainJson = {
    inputWidth: null,
    inputType: null,
    inputName: null,
    inputLabel: null,
    inputFormat: null,
    inputDefaultValue: null,
    inputAddOn: {
      inputRange: null,
      inputDataSource: null,
      inputDataSourceData: null,
      inputDateRange: null,
    },
  };

  const [rows, setRows] = useState([mainJson]);
  const [isInputMandatory, setIsInputMandatory] = useState(false);

  console.log("isinput", isInputMandatory);

  const [formShow, setFormShow] = useState(false);

  const [index, setIndex] = useState({ index: 0 });

  // const [dropdown, setDropdown] = useState({ index: 0 });

  const [inputDataSource, setInputDataSource] = useState();
  const [inputLabelValue, setInputLabelValue] = useState();


  const [labelErr, setLabelErr] = useState(null);
  const [selectedValueErr, setSelectedValueErr] = useState("");
  const [selectedNumberErr, setSelectedNumbereErr] = useState(null);

  const [selectedValue, setSelectedValue] = useState();
  const [minNuber, setMinNuber] = useState();
  const [maxNuber, setMaxNuber] = useState();
  const [userData, setUserData] = useState(null);
  const [radioSelect, setRadioSelect] = useState();

  console.log("min", minNuber);
  console.log("max", maxNuber);

console.log("min",inputLabelValue)
console.log("max",maxNuber)

console.log("se",selectedNumberErr)
const [labelNames, setLabelNames] = useState([]);


const roleDropdown = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getAllRoles
      ?.filter((d) => d.is_active === 1)
      .map((d) => ({
        value: d.id,
        label: d.role,
      }))
  );

  const departmentDropdown = useSelector(
    (DepartmentMasterSlice) =>
      DepartmentMasterSlice.department.sortDepartmentData
  );

  const CountryData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.filteredCountryData
  );

  const CustomerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getCustomerData
  );

  

  const AllcityDropDownData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.sortedCityData
  );

  const designationDropdown = useSelector(
    (DesignationSlice) =>
      DesignationSlice.designationMaster.sortedDesignationData
  );

  const stateDropdown = useSelector(
    (DashbordSlice) => DashbordSlice.dashboard.filteredStateData
  );

  // const dropdown = useSelector(
  //   (DynamicFormDropDownSlice) =>
  //     DynamicFormDropDownSlice.dynamicFormDropDown.sortDropDown
  // );

  const statusData=useSelector(statusMasterSlice=>statusMasterSlice.statusMaster.filterStatusData.filter((d) => d.is_active == 1)
  .map((d) => ({ value: d.id, label: d.status })))


const dataSourceOptions = [
  { value: "", label: "Select Data Source" },
  { value: "user", label: "User Master" },
  { value: "department", label: "Department Master" },
  { value: "role", label: "Role Master" },
  { value: "country", label: "Country Master" },
  { value: "state", label: "State Master" },
  { value: "city", label: "City Master" },
  { value: "designation", label: "Designation Master" },
  { value: "customer", label: "Customer Master" },
  { value: "status", label: "Status Master" },
  { value: "query", label: "Query Type Master" },


  


];
console.log("roleData==>",roleDropdown)



const handleChange = (idx, type) => async (e) => {
  // setFormShow(formShow == true ? false : true);
  console.log("eee",e.target)
 
  if (e.target.name === "inputLabel") {
    setInputLabelValue(e.target.value);
  }

 

  if (selectedValue) {
    setSelectedValueErr("");
  } else {
    setSelectedValueErr("Select Data Source");
  }

  setFormShow(false);

  setIndex({ index: idx });

  const { name, value } = e.target;

  const notAllowed = [
    "ref_id",
    "created_at",
    "updated_at",
    "attachment",
    "query_type_id",
    "query_type",
    "object_id",
    "tenant_id",
    "ticket_id",
    "user_id",
    "confirmation_required",
    "project_id",
    "module_id",
    "submodule_id",
    "cuid",
    "ticket_date",
    "expected_solve_date",
    "assign_to_department_id",
    "assign_to_user_id",
    "type_id",
    "priority",
    "status_id",
    "description",
    "from_department_id",
    "remark",
    "is_active",
    "created_by",
    "updated_by",
    "passed_status",
    "passed_status_changed_by",
    "passed_status_changed_at",
    "passed_status_remark",
    "ticket_confirmation_otp",
    "ticket_confirmation_otp_created_at",
  ];

  if (
    !notAllowed.includes(
      e.target.value
        .replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, "_")
        .toLowerCase()
    )
  ) {
    if (e.target.name === "inputWidth") {
      rows[idx].inputWidth = e.target.value;
    } else if (e.target.name === "inputType") {
      rows[idx].inputType = e.target.value;
      if (e.target.value == "date") {
        rows[idx].inputFormat = "y-MM-dd";
      } else {
        rows[idx].inputFormat = null;
      }
    } else if (e.target.name === "inputLabel") {
      rows[idx].inputLabel = e.target.value;
      rows[idx].inputName = e.target.value
        .replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, "_")
        .toLowerCase();

      labelNames[idx] = rows[idx].inputName;
    } else if (e.target.name === "inputDefaultValue") {
      rows[idx].inputDefaultValue = e.target.value;
    } else if (e.target.name === "inputMandatory") {
      rows[idx].inputMandatory = e.target.checked;
    } else if (e.target.name === "inputMultiple") {
      rows[idx].inputMultiple = e.target.checked;
    } else if (e.target.name === "inputDataOption") {
      rows[idx].inputOption = e.target.value;
    } else if (e.target.name == "inputRange") {
      rows[idx].inputAddOn.inputRange = e.target.value;
    } else if (e.target.name == "inputRangeMin") {
      rows[idx].inputAddOn.inputRangeMin = e.target.value;
    } else if (e.target.name == "inputRangeMax") {
      // if (rows[idx].inputAddOn.inputRangeMin > e.target.value) {
      //   alert("Please select grater value");
      //   return false;
      // }
      rows[idx].inputAddOn.inputRangeMax = e.target.value;
    } else if (e.target.name == "datetime-local") {
      rows[idx].inputAddOn.inputDateTime = e.target.value;
    } else if (e.target.name == "inputFormat") {
      rows[idx].inputFormat = e.target.value;
    }
    // setFormShow(formShow == true ? false : true);
    // const test1 = e.target.value;
    // rows[idx].inputAddOn.inputRadio = test1;

    // if (e.target.name === "inputWidth") {
    //   rows[idx].inputWidth = e.target.value;
    // } else if (e.target.name === "inputName") {
    //   rows[idx].inputName = e.target.value;
    // } else if (e.target.name === "inputType") {
    //   rows[idx].inputType = e.target.value;
    // } else if (e.target.name === "inputLabel") {
    //   rows[idx].inputLabel = e.target.value;
    // } else if (e.target.name === "inputDefaultValue") {
    //   rows[idx].inputDefaultValue = e.target.value;
    // } else if (e.target.name === "inputDataOption") {
    //   rows[idx].inputOption = e.target.value;
    // } else if (e.target.name == "inputRange") {
    //   rows[idx].inputAddOn.inputRange = e.target.value;
    // } else if (e.target.name == "inputDataSource")

    // {
    //   const test = e.target.value.split("|");
    //   const _URL = masterURL[test[0]];
    //   const _Value = test[1];
    //   const _Label = test[2];

    //   getData(_URL).then((res) => {
    //     let counter = 1;
    //     const tempData = [];
    //     for (const key in res.data) {
    //       const t = res.data[key];
    //       tempData.push({
    //         value: t[_Value],
    //         label: t[_Label],
    //       });
    //     }

    //     rows[idx].inputAddOn.inputDataSourceData = tempData;
    //   });
    //   rows[idx].inputAddOn.inputDataSource = e.target.value;
    // }

    // const tempUserData = [];

    // const inputRequired =
    //   "id,employee_id,first_name,last_name,middle_name,is_active";
    // await new UserService().getUserForMyTickets(inputRequired).then((res) => {
    //   if (res.status === 200) {
    //     const data = res.data.data.filter((d) => d.is_active === 1);
    //     for (const key in data) {
    //       tempUserData.push({
    //         value: data[key].id,
    //         label:
    //           data[key].first_name +
    //           " " +
    //           data[key].last_name +
    //           " (" +
    //           data[key].id +
    //           ")",
    //       });
    //     }
    //     const aa = tempUserData.sort(function (a, b) {
    //       return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
    //     });
    //     setUserData(aa);
    //   }
    // });


    if (e.target.name === "inputDataSource" && e.target.value === "user") {
      const tempUserData = [];
      const test1 = e.target.value;
      rows[idx].inputAddOn.inputDataSourceData = test1;
      const inputRequired =
        "id,employee_id,first_name,last_name,middle_name,is_active";
      await new UserService()
        .getUserForMyTickets(inputRequired)
        .then((res) => {
          if (res.status === 200) {
            const data = res.data.data.filter((d) => d.is_active === 1);

            // const dropNames = res.data.data;
            // setRadioSelect(data.master.dropdown_name);
            // const temp = [];
            // res.data.data.forEach((d) => {
            //   temp.push({ label: d.label, value: d.id });
            // });
            // rows[idx].inputAddOn.inputRadio = temp;
            // setInputDataSource(temp);

            for (const key in data) {
              tempUserData.push({
                value: data[key].id,
                label:
                  data[key].first_name +
                  " " +
                  data[key].last_name +
                  " (" +
                  data[key].id +
                  ")",
              });
            }
            const aa = tempUserData.sort(function (a, b) {
              return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
            });
            setUserData(aa);
            rows[idx].inputAddOn.inputDataSourceData = aa;
            setInputDataSource(aa);
          }
        });
    } else if (
      e.target.name === "inputDataSource" &&
      e.target.value === "city"
    ) {
      rows[idx].inputAddOn.inputDataSourceData = AllcityDropDownData;
      setInputDataSource(AllcityDropDownData);
      console.log("allC",AllcityDropDownData)
    } else if (
      e.target.name === "inputDataSource" &&
      e.target.value === "role"
    ) {
      rows[idx].inputAddOn.inputDataSourceData = roleDropdown;
      setInputDataSource(roleDropdown);
      console.log("roleDataE==>",e.target.name)
      console.log("roleDataEN==>",roleDropdown)
      console.log("rowsF",rows)


    } else if (
      e.target.name === "inputDataSource" &&
      e.target.value === "country"
    ) {
      rows[idx].inputAddOn.inputDataSourceData = CountryData;
      setInputDataSource(CountryData);
    } else if (
      e.target.name === "inputDataSource" &&
      e.target.value === "state"
    ) {
      rows[idx].inputAddOn.inputDataSourceData = stateDropdown;
      setInputDataSource(stateDropdown);
    } else if (
      e.target.name === "inputDataSource" &&
      e.target.value === "designation"
    ) {
      rows[idx].inputAddOn.inputDataSourceData = designationDropdown;
      setInputDataSource(designationDropdown);
    }else if (
      e.target.name === "inputDataSource" &&
      e.target.value === "customer"
    ) {
      rows[idx].inputAddOn.inputDataSourceData = CustomerData;
      setInputDataSource(CustomerData);
    }
    else if (
      e.target.name === "inputDataSource" &&
      e.target.value === "status"
    ) {
      rows[idx].inputAddOn.inputDataSourceData = statusData;
      setInputDataSource(statusData);
    }else if(  e.target.name === "inputDataSource" &&
    e.target.value === "query"){
      await new QueryTypeService().getQueryType().then((res) => {
        if (res.status === 200) {
          const data = res.data.data.filter((d) => d.is_active == 1)
          .map((d) => ({ value: d.id, label: d.query_type_name }))
         
          rows[idx].inputAddOn.inputDataSourceData = data;
          console.log("ttt",data)
      setInputDataSource(data);
        }
    }
      )}

    // else if (e.target.name == "inputRadio") {
    // setFormShow(formShow == true ? false : true);
    const test = e.target.value;
    console.log("testNew", rows[idx].inputAddOn.inputRadio);
    console.log("testNew=", selectedValue);
  const dropDownID = selectedValue && selectedValue


  const newValue = e.target.name
  if (newValue === "inputOnChangeSource") {
    const dropDownValue = e.target.value
    setSelectedValue(dropDownValue);
  
    rows[idx].inputAddOn.inputRadio = test;
   await new DynamicFormDropdownMasterService()
      .getDropdownById(dropDownValue)
      .then((res) => {
        console.log("res==>",res)
        console.log("res==>",dropDownID)

        if (res.status == 200) {
          if (res.data.status == 1) {
            const dropNames = res.data.data;
            setRadioSelect(dropNames.master.dropdown_name);
            const temp = [];
            res.data.data.dropdown.forEach((d) => {
              temp.push({ label: d.label, value: d.id });
            });
            rows[idx].inputAddOn.inputRadio = temp;
            setInputDataSource(temp);

          }
        }
      });
  }
};
}


  // const handleChange = (idx) => async (e) => {
  //   setIndex({ index: idx });
  //   console.log("ss==>",selectedValue)

  //   // if(e.target.name === "inputMandatory"){
  //   //  const newValue = e.target.checked;
  //   //  setIsInputMandatory(newValue);
  //   // }



  //   if (e.target.name === "inputMandatory" && e.target.checked === true) {
  //   setIsInputMandatory(true);
  // } else {
  //   setIsInputMandatory(false);
  // }


  // if (e.target.name === "inputRangeMin" ) {
  //  setMinNuber(e.target.value)
  // } else {
  //   setMinNuber("");
  // }

  // if (e.target.name === "inputRangeMax" ) {
  //   setMaxNuber(e.target.value)
  //  } else {
  //    setMaxNuber("");
  //  }

  // if (minNuber > maxNuber ) {

  //   setSelectedNumbereErr("Value should be grater than min number");
  // } else {
  //   setSelectedNumbereErr("");
  // }

   
  //   if (e.target.name === "inputLabel") {
  //     setInputLabelValue(e.target.value);
  //   }
  //   if (e.target.name === "inputOnChangeSource") {
  //     setSelectedValue(e.target.value);
  //   }

  //   if (selectedValue) {
  //     setSelectedValueErr("");
  //   } else {
  //     setSelectedValueErr("Select Data Source");
  //   }
     
  //   setFormShow(false);

  //   // alert(e.target.value);
  //   const notAllowed = [
  //     "ref_id",
  //     "created_at",
  //     "updated_at",
  //     "attachment",
  //     "query_type_id",
  //     "query_type",
  //     "object_id",
  //     "tenant_id",
  //     "ticket_id",
  //     "user_id",
  //     "confirmation_required",
  //     "project_id",
  //     "module_id",
  //     "submodule_id",
  //     "cuid",
  //     "ticket_date",
  //     "expected_solve_date",
  //     "assign_to_department_id",
  //     "assign_to_user_id",
  //     "type_id",
  //     "priority",
  //     "status_id",
  //     "description",
  //     "from_department_id",
  //     "remark",
  //     "is_active",
  //     "created_by",
  //     "updated_by",
  //     "passed_status",
  //     "passed_status_changed_by",
  //     "passed_status_changed_at",
  //     "passed_status_remark",
  //     "ticket_confirmation_otp",
  //     "ticket_confirmation_otp_created_at",
  //   ];

  //   if (
  //     !notAllowed.includes(
  //       e.target.value
  //         .replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, "_")
  //         .toLowerCase()
  //     )
  //   ) {
  //     if (e.target.name === "inputWidth") {
  //       rows[idx].inputWidth = e.target.value;
  //     }
  //     // else if(e.target.name==="inputName")
  //     // {
  //     //     rows[idx].inputName=e.target.value;
  //     // }
  //     else if (e.target.name === "inputType") {
  //       rows[idx].inputType = e.target.value;

  //       if (e.target.value == "date") {
  //         rows[idx].inputFormat = "y-MM-dd";
  //       } else {
  //         rows[idx].inputFormat = null;
  //       }
  //     } else if (e.target.name === "inputLabel") {
  //       rows[idx].inputLabel = e.target.value;
  //       rows[idx].inputName = e.target.value
  //         .replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, "_")
  //         .toLowerCase();
  //     } else if (e.target.name === "inputFormat") {
  //       rows[idx].inputFormat = e.target.value;
  //     } else if (e.target.name === "inputDefaultValue") {
  //       rows[idx].inputDefaultValue = e.target.value;
  //     } else if (e.target.name === "inputDataOption") {
  //       rows[idx].inputOption = e.target.value;
  //     } else if (e.target.name === "inputRange") {
  //       rows[idx].inputAddOn.inputRange = e.target.value;
  //     } else if (e.target.name === "inputRangeMin") {
  //       rows[idx].inputAddOn.inputRangeMin = e.target.value;
  //     } else if (e.target.name === "inputRangeMax") {
  //       rows[idx].inputAddOn.inputRangeMax = e.target.value;
  //     } else if (e.target.name === "inputDataSource") {
  //       // const test=e.target.value.split('|');
  //       // const _URL=masterURL.dynamicFormDropdownMaster[test[0]];
  //       // console.log(_URL)
  //       // const _Value=test[1];
  //       // const _Label=test[2];

  //       // getData(_URL).then(res =>{
  //       //     console.log(res)
  //       //     const tempData=[];
  //       //     for (const key in res.data) {
  //       //         const t=res.data[key];
  //       //         tempData.push({
  //       //             value: t[_Value],
  //       //             label: t[_Label]
  //       //         })
  //       //     }
  //       //     rows[idx].inputAddOn.inputDataSourceData=tempData
  //       // });
  //       // rows[idx].inputAddOn.inputDataSource=e.target.value;


      

  //       // const test = e.target.value;
  //       // const newValue = e.target.name
  //       // if (newValue === "inputOnChangeSource") {
  //       //   const dropDownValue = e.target.value
  //       //   setSelectedValue(dropDownValue);
  //       // rows[idx].inputAddOn.inputDataSource = test;
  //       // }
  //       // console.log("tt==>",test)
  //       // await new DynamicFormDropdownMasterService()
  //       //   .getDropdownById(test)
  //       //   .then((res) => {
  //       //     console.log("cc==",res)
  //       const test = e.target.value;
  //       console.log("testNew", rows[idx].inputAddOn.inputRadio);
  //       console.log("testNew=", selectedValue);
  //     // const dropDownID = selectedValue && selectedValue
  
  
  //     const newValue = e.target.name
  //     console.log("newValue",newValue)
  //     if (newValue === "inputOnChangeSource") {
  //       const dropDownValue = e.target.value
  //       setSelectedValue(dropDownValue);
      
  //       rows[idx].inputAddOn.inputRadio = test;
  //     console.log("dropDownValue",dropDownValue)
  //      await new DynamicFormDropdownMasterService()
  //         .getDropdownById(dropDownValue)
  //         .then((res) => {
  //           console.log("res==>",res)
  
  //           if (res.status == 200) {
  //             if (res.data.status == 1) {
  //               const temp = [];
  //               res.data.data.dropdown.forEach((d) => {
  //                 temp.push({ label: d.label, value: d.id });
  //               });
  //               rows[idx].inputAddOn.inputDataSourceData = temp;
  //               setInputDataSource(temp);
  //             }
  //           }
  //         });
  //     }
  //   } 
  // }
  //   // else {
  //   //   alert("Not Allowed to use entered Keywork");
  //   //   rows[idx].inputLabel = "";
  //   // }

  
  

  

    
  //   // const rows = [...rows];
  //   // rows[idx] = {
  //   //     [name]: value
  //   // };
  //   // setRows({
  //   //     rows
  //   // });
  // };

  // loadDynamicData = (_URL) =>{
  // getData(_URL).then(res =>{
  //     let counter=1;
  //     for (const key in res.data) {
  //         tempData.push({
  //           counter:counter++,
  //           id: res.data[key].id,
  //           city: res.data[key].city
  //         })
  //     }
  //     setData(tempData);
  // });
  // }

  const handleAddRow = async () => {
    setShowAlert({ show: false, type: null, message: null });
    let flag = 1;
    let last = rows.length - 1;

    if (
      !rows[last].inputType ||
      !rows[last].inputLabel ||
      !rows[last].inputName
    ) {
      flag = 0;
      setShowAlert({ show: false, type: null, message: null });
    }

    const item = {
      inputWidth: null,
      inputType: null,
      inputName: null,
      inputLabel: null,
      inputFormat: null,
      inputDefaultValue: null,
      inputAddOn: {
        inputRange: null,
        inputDataSource: null,
        inputDataSourceData: null,
        inputDateRange: null,
      },
    };

    if (flag === 1) {
      setRows([...rows, item]);
      setRows([...rows, mainJson]);
    } else {
      setShowAlert({
        show: true,
        type: "warning",
        message: "Please Fill Previous Row Values",
      });
    }
  };

  // const handleRemoveSpecificRow = (idx) => () => {
  //   if (idx > 0) {
  //     setRows(rows.filter((_, i) => i !== idx));
  //   }
  // };

  const handleRemoveSpecificRow = (index) => async () => {
    const updatedAssign = [...rows];

    updatedAssign.splice(index, 1);

    // Update the state
    setRows(updatedAssign);
    //   }
    // });
  };

 
console.log("inputLabelValue",rows.map((i)=>i.inputLabel))
  const handldeFormShow = () => {
    const hasEmptyLabel = rows.some(row => row.inputLabel === '')
    console.log("has",hasEmptyLabel)
    if (hasEmptyLabel) {
      setLabelErr("Label Is Required");
    } else {
      setLabelErr("");
    }
    setFormShow(formShow === true ? false : true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      template_name: e.target.template_name.value,
      is_active: e.target.is_active.value,
      remark: e.target.remark.value,
      data: JSON.stringify(rows),
    };
    console.log("rowsH",rows)

    await new DynamicFormService()
      .updateDynamicForm(formId, data)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            dispatch(dynamicFormData());
            // history({
            //   pathname: `/${_base}/DynamicForm`,

            // },{ state: { alert: { type: "success", message: res.data.message } }}

            // );

            setNotify({ type: "success", message: res.data.message });
            setTimeout(() => {
              navigate(`/${_base}/DynamicForm`, {
                state: {
                  alert: { type: "success", message: res.data.message },
                },
              });
            }, 3000);
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          setNotify({ type: "danger", message: res.message });
          new ErrorLogService().sendErrorLog(
            "User",
            "Create_User",
            "INSERT",
            res.message
          );
        }
      });
  };

  const loadData = async () => {
    // await new DynamicFormDropdownMasterService()
    //   .getAllDropdown()
    //   .then((res) => {
    //     if (res.status === 200) {
    //       if (res.data.status === 1) {
    //         // const temp=[];
    //         // res.data.data.forEach(d=>{
    //         //     temp.push({'label':d.dropdown_name,'value':d.id});
    //         // })
    //         // setDropdown(temp);
    //         setDropdown(
    //           res.data.data.map((d) => ({
    //             label: d.dropdown_name,
    //             value: d.id,
    //           }))
    //         );
    //       }
    //     }
    //   });
    dispatch(dynamicFormData());

    await new DynamicFormService()
      .getDynamicFormById(formId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
          console.log("res==>",res.data.data)
            setData(res.data.data);
            setRows(res.data.data.data)
            // setIsInputMandatory(res.data.data.data.isInputMandatory?.map((i)=>i.inputMandatory))
            console.log("dataIS",res.data.data.data?.map((i)=>i.inputMandatory))
          }
        }
      })
    

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId)
    //       );
    //     }
    //   }
    // });
  }

  const [dateValue, setDateValue] = useState(new Date());
  const onChangeDate = (value) => {
    setDateValue(new Date(value));
  };

  useEffect(() => {
    loadData();
    if (!checkRole.length) {
      dispatch(getRoles());
    }

    if (!dropdown.length) {
      dispatch(getAllDropDownData());
    }

    if (!designationDropdown.length) {
      dispatch(getDesignationData());
    }

    if (!AllcityDropDownData.length) {
      dispatch(getCityData());
    }

    dispatch(getCountryDataSort());
    if (!stateDropdown.length) {
      dispatch(getStateDataSort());
    }
    dispatch(getCustomerData())
    dispatch(getStatusData())
    dispatch(getAllRoles());

  }, []);

  console.log("role",roleDropdown)
  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <>
      <div className="body d-flex py-3">
        <div className="container-xxl">
          <div className="row clearfix g-3">
            <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
              {/*************** HEADING ***************/}
              <div className="card">
                <div
                  className="card-header d-flex justify-content-between bg-transparent
                            border-bottom-0"
                >
                  <h2 className="mb-0 fw-bold "> Edit Dynamic Form</h2>
                </div>
              </div>
              {notify && <Alert alertData={notify} />}
              {/*************** TABLE ***************/}
              <div className="card mt-2">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-2">
                        <label>
                          <b>
                            Form Name : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="template_name"
                          id="template_name"
                          required
                          defaultValue={data && data.template_name}
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>Remark: </b>
                      </label>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="remark"
                          name="remark"
                          defaultValue={data ? data.remark : null}
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Status : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <div className="col-sm-10">
                        <div className="row">
                          <div className="col-md-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="is_active"
                                id="is_active_1"
                                value="1"
                                defaultChecked={data && data.is_active === 1}
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
                                id="is_active_0"
                                value="0"
                                defaultChecked={data && data.is_active === 0}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="is_active_0"
                              >
                                Deactive
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="table-responsive">
                      <table
                        className="table table-bordered mt-3 table-responsive"
                        id="tab_logic"
                      >
                        <thead>
                          <tr>
                            <th className="text-center" style={{ width: "5%" }}>
                              {" "}
                              Sr No.{" "}
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "15%" }}
                            >
                              {" "}
                              Type{" "}
                            </th>
                          
                            <th
                              className="text-center"
                              style={{ width: "20%" }}
                            >
                              {" "}
                              Label{" "}
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "20%" }}
                            >
                              {" "}
                              Def. Value{" "}
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              Format
                            </th>
                            <th className="text-center"> Add-Ons</th>
                            <th
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              {" "}
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows &&
                            rows.map((item, idx) => (
                              <tr id={`addr_${idx}`} key={idx}>
                                <td>{idx + 1}</td>
                                <td>
                                  <select
                                    className="form-control form-control-sm"
                                    required
                                    name="inputType"
                                    defaultValue={item.inputType}
                                    onChange={handleChange(idx)}
                                    value={rows[idx].inputType}
                                  >
                                    <option value="">Select Type</option>
                                    <option value="text">TEXT</option>
                                    <option value="textarea">TEXTAREA</option>
                                    <option value="number">NUMBER</option>
                                    <option value="number">DECIMAL</option>
                                    <option value="date">DATE</option>
                                    <option value="datetime-local">
                                      DATE TIME
                                    </option>
                                    <option value="time">TIME</option>
                                    <option value="select">SELECT</option>
                                    <option value="select-master">
                                      SELECT-MASTER
                                    </option>
                                  </select>
                                </td>
                               
                                <td>
                                  <input
                                    type="text"
                                    name="inputLabel"
                                    defaultValue={item.inputLabel}
                                    onChange={handleChange(idx)}
                                    className="form-control form-control-sm"
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="inputDefaultValue"
                                    defaultValue={item.inputDefaultValue}
                                    onChange={handleChange(idx)}
                                    className="form-control form-control-sm"
                                  />
                                </td>
                                <td>
                                  {rows[idx].inputType == "date" && (
                                    <select
                                      className="form-control form-control-sm"
                                      required
                                      name="inputFormat"
                                      onChange={handleChange(idx)}
                                      value={rows[idx].inputFormat}
                                    >
                                      <option>Select Format</option>
                                      <option value="y-MM-dd">
                                        yyyy-mm-dd
                                      </option>
                                      <option value="dd-MM-y">
                                        dd-mm-yyyy
                                      </option>
                                    </select>
                                  )}
                                </td>

                                <td>
                                  {rows && (
                                    <AddOn
                                      id={idx}
                                      data={rows[idx]}
                                      onGetChange={handleChange(idx)}
                                      dropdown={dropdown}
                                      key={Math.random()}
                                    />
                                  )}
                                </td>

                                <td>
                                  {idx === 0 && (
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-primary pull-left"
                                      onClick={handleAddRow}
                                    >
                                      <i className="icofont-plus-circle"></i>
                                    </button>
                                  )}
                                  {rows.length === idx + 1 && idx !== 0 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={handleRemoveSpecificRow(idx)}
                                    >
                                      <i className="icofont-ui-delete"></i>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div> */}


<div className='table-responsive'>
                                            <table
                                                className="table table-bordered mt-3 table-responsive"
                                                id="tab_logic"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th className="text-center" style={{ width: "5%" }}> Sr No. </th>
                                                        <th className="text-center" style={{ width: "15%" }}> Type </th>
                                                        <th className="text-center"> Width </th>
                                                        <th className="text-center" style={{ width: "10%" }}> Label </th>
                                                        <th className="text-center" style={{ width: "10%" }}> Def. Value </th>
                                                        <th className="text-center" style={{ width: "10%" }}> Mandatory </th>
                                                        <th className="text-center" style={{ width: "10%" }}> Multiple</th>
                                                        <th className="text-center" style={{ width: "10%" }}> Format</th>
                                                        <th className="text-center" style={{ width: "20%" }}> Add-Ons</th>
                                                        <th className="text-center" style={{ width: "10%" }} > Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rows && rows.map((item, idx) => (
                                                    
                                                        <tr id={`addr_${idx}`} key={idx}>
                                                        {/* // <tr id={`addr_${item.id}`} key={item.id}> */}
                                                            <td>{idx + 1}</td>
                                                            <td>
                                                                <select 
                                                                className="form-control form-control-sm" 
                                                                required
                                                                name="inputType" 
                                                                value={item.inputType}
                                                                onChange={handleChange(idx)}
                                                                >
                                                                    <option value=''>Select Type</option>
                                                                    <option value="text">TEXT</option>
                                                                    <option value="textarea">TEXTAREA</option>
                                                                    <option value="number">NUMBER</option>
                                                                    <option value="decimal">DECIMAL</option>
                                                                    <option value="date">DATE</option>
                                                                    <option value="datetime-local">DATE TIME</option>
                                                                    <option value="time">TIME</option>
                                                                    <option value="select">SELECT</option>
                                                                    <option value="radio">RADIO</option>
                                                                    <option value="checkbox">CHECKBOX</option>
                                                                    <option value="select-master">SELECT MASTER</option>
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <select className="form-control form-control-sm" required
                                                                    name="inputWidth" 
                                                                    value={item.inputWidth}
                                                                    onChange={handleChange(idx)}
                                                                >
                                                                    <option>Select Width</option>
                                                                    <option value="col-sm-2">Very Small</option>
                                                                    <option value="col-sm-4" selected>Small</option>
                                                                    <option value="col-sm-6">Medium</option>
                                                                    <option value="col-sm-8">Large</option>
                                                                    <option value="col-sm-10">X-Large</option>
                                                                    <option value="col-sm-12">XX-Large</option>
                                                                </select>
                                                            </td>
                                                            {/* <td>
                                                        <input
                                                            type="text"
                                                            name="inputName"
                                                            defaultValue={item.inputName}
                                                            onChange={handleChange(idx)}
                                                            className="form-control form-control-sm"
                                                            required
                                                        />
                                                    </td> */}
                                <td>
                                  <input
                                    type="text"
                                    name="inputLabel"
                                    value={item.inputLabel}
                                    onChange={handleChange(idx)}
                                    className="form-control form-control-sm"
                                    required
                                    onKeyPress={(e) => {
                                      Validation.CharactersNumbersOnly(e);
                                    }}
                                  />
                                  {labelErr && (
                                    <p
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      {labelErr}
                                    </p>
                                  )}
                                </td>
                                <td>
                                  {/* <input
                                                                    type="text"
                                                                    name="inputDefaultValue"
                                                                    value={item.inputDefaultValue}
                                                                    onChange={handleChange(idx)}
                                                                    className="form-control form-control-sm"
                                                                    onKeyPress={e => {
                                                                        Validation.CharactersNumbersOnly(e)
                                                                    }}
                                                                /> */}

                                  {item.inputType === "date" ||
                                  item.inputType === "time" ? (
                                    <input
                                      type={
                                        item.inputType === "date"
                                          ? "date"
                                          : "time"
                                      }
                                      name="inputDefaultValue"
                                      value={item.inputDefaultValue}
                                      onChange={handleChange(idx)}
                                      className="form-control form-control-sm"
                                      onKeyPress={(e) => {
                                        Validation.CharactersNumbersSpeicalOnly(
                                          e
                                        );
                                      }}
                                    />
                                  ) : (
                                    <input
                                      type={
                                        item.inputType === "datetime-local"
                                          ? "datetime-local"
                                          : "text"
                                      }
                                      name="inputDefaultValue"
                                      value={item.inputDefaultValue}
                                      onChange={handleChange(idx)}
                                      className="form-control form-control-sm"
                                      onKeyPress={(e) => {
                                        item.inputType === "number" ||
                                        item.inputType === "decimal"
                                          ? Validation.NumbersSpecialOnlyDecimal(
                                              e
                                            )
                                          : Validation.CharactersNumbersSpeicalOnly(
                                              e
                                            );
                                      }}
                                    />
                                  )}
                                </td>

                                {console.log("man==", item.inputMandatory)}
                                <td>
                                  {/* <input
                                    type="checkbox"
                                    name="inputMandatory"
                                    id="inputMandatory"
                                    // value={isInputMandatory}
                                    defaultChecked={item.inputMandatory}
                                    onChange={handleChange(idx)}
                                    className="center"
                                  /> */}
                                  {console.log("item",item)}
                                    <input
                                                                    type="checkbox"
                                                                    name="inputMandatory"
                                                                    id="inputMandatory"
                                                                    defaultChecked={item.inputMandatory}
                                                                    onChange={handleChange(idx)}

                                                                />

                                </td>

                                                            {/* {console.log("man==",item )}
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    name="inputMandatory"
                                                                    id="inputMandatory"
                                                                    // value={isInputMandatory}
                                                                    defaultChecked={item.inputMandatory}
                                                                    onChange={handleChange(idx)}
                                                                    className="center"
                                                                />
                                                            </td> */}
                                                           
                                                            <td>
                                                                {(item.inputType === "select-master"  || item.inputType === "checkbox" || item.inputType === "select" ) &&
                                                                <input
                                                                    type="checkbox"
                                                                    name="inputMultiple"
                                                                    id="inputMultiple"
                                                                    defaultChecked={item.inputMultiple}
                                                                    onChange={handleChange(idx)}

                                                                />
                                                                } 
                                                            </td>
                                                            <td>
                                                                {rows[idx].inputType == "date" &&
                                                                    <select className="form-control form-control-sm" required
                                                                        name="inputFormat"
                                                                        onChange={handleChange(idx)}
                                                                        value={rows[idx].inputFormat}
                                                                    >
                                                                        <option>Select Format</option>
                                                                        <option value="y-MM-dd">yyyy-mm-dd</option>
                                                                        <option value="dd-MM-y">dd-mm-yyyy</option>
                                                                    </select>
                                                                }
                                                            </td>
                                                            {/* <td>
                                                                {rows &&

                                                                    // <AddOn id={idx} 
                                                                    //     // labelNames={labelNames}
                                                                    //     data={rows[idx]} 
                                                                    //     // radioSelect={radioSelect}
                                                                    //     // checkboxSelect={checkboxSelect}
                                                                    //     onGetChange={handleChange(idx)} 
                                                                    //     dropdown={dropdown}
                                                                    //     key={Math.random()}/>}
                                                                    <AddOn
                                                                    id={idx}
                                                                    data={rows[idx]}
                                                                    onGetChange={handleChange(idx)}
                                                                    dropdown={dropdown}
                                                                    key={Math.random()}
                                                                  />
                                                                }

                                                            </td> */}

                                {console.log("value", rows)}

                                <td>
                                  {rows[idx].inputType == "radio" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        onChange={handleChange(idx)}
                                        id="inputOnChangeSource"
                                        name="inputOnChangeSource"
                                        defaultValue={
                                          rows &&
                                          rows[idx]?.inputAddOn?.inputDataSource
                                        }

                                        // defaultValue={sortDropDownData&& sortDropDownData.filter((d)=>d.value === parseInt(rows&& rows[idx]?.inputAddOn?.inputDataSource)) }
                                      >
                                        <option>Select Data Source</option>

                                        {dropdown &&
                                          dropdown.map((d, i) => {
                                            return (
                                              <option
                                                value={d.id}
                                                selected={
                                                  parseInt(
                                                    rows &&
                                                      rows[idx]?.inputAddOn
                                                        ?.inputDataSource
                                                  ) === d.value
                                                }
                                              >
                                                {d.dropdown_name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                      {/* {!selectedValue && (
                                        <small style={{ color: "red" }}>
                                          <b>Select Data Source</b>
                                        </small>
                                      )} */}
                                      {/* <small style={{ color: "red" }}>
                                        <b>Select Data Source</b>
                                      </small> */}
                                    </span>
                                  )}

                                  {rows[idx].inputType == "checkbox" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        // onChange={props.onGetChange}
                                        onChange={handleChange(idx)}
                                        id="inputOnChangeSource"
                                        name="inputOnChangeSource"
                                        defaultValue={
                                          rows &&
                                          rows[idx]?.inputAddOn?.inputDataSource
                                        }
                                      >
                                        <option>Select Data Source</option>

                                        {dropdown &&
                                          dropdown.map((d, i) => {
                                            return (
                                              <option
                                                value={d.id}
                                                selected={
                                                  parseInt(
                                                    rows &&
                                                      rows[idx]?.inputAddOn
                                                        ?.inputDataSource
                                                  ) === d.value
                                                }
                                              >
                                                {d.dropdown_name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                      {/* {!selectedValue && (
                                        <small style={{ color: "red" }}>
                                          <b>Select Data Source</b>
                                        </small>
                                      )} */}
                                    </span>
                                  )}

                                  {rows[idx].inputType == "select-master" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        // onChange={props.onGetChange}
                                        // defaultValue={
                                        //   rows &&
                                        //   rows[idx]?.inputAddOn?.inputDataSource
                                        // }
                                        // onChange={(e) => {
                                        //     props.onGetChange(e.target.value); // Call onGetChange with the selected value
                                        // }}

                                        onChange={handleChange(idx)}
                                        id="inputDataSource"
                                        name="inputDataSource"
                                        // value={props.selectData}
                                      >
                                        {dataSourceOptions.map((option) => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                        {/* <option>Select Data Source</option>
                                        <option value="user">
                                          User Master
                                        </option>
                                        <option value="department">
                                          Department Master
                                        </option>
                                        <option value="role">
                                          Role Master
                                        </option> */}
                                        {/* <option value="department|id|department">Department Master</option> */}
                                        {/* <option value="role|id|role">Role Master</option> */}
                                      </select>
                                      {/* <small style={{ color: "red" }}>
                                        <b>Select Data Source</b>
                                      </small> */}
                                    </span>
                                  )}

                                  {rows[idx].inputType == "select" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        // onChange={props.onGetChange}
                                        onChange={handleChange(idx)}
                                        id="inputOnChangeSource"
                                        name="inputOnChangeSource"
                                        defaultValue={
                                          rows &&
                                          rows[idx]?.inputAddOn?.inputDataSource
                                        }
                                      >
                                        <option>Select Data Source</option>

                                        {dropdown &&
                                          dropdown.map((d, i) => {
                                            return (
                                              <option
                                                value={d.id}
                                                selected={
                                                  parseInt(
                                                    rows &&
                                                      rows[idx]?.inputAddOn
                                                        ?.inputDataSource
                                                  ) === d.value
                                                }
                                              >
                                                {d.dropdown_name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                      {/* {!selectedValue && (
                                        <small style={{ color: "red" }}>
                                          <b>Select Data Source</b>
                                        </small>
                                      )} */}
                                    </span>
                                  )}

                                  {console.log("dds", rows)}

                                  {rows[idx].inputType === "number" && (
                                    //             <span>
                                    //             <input
                                    //             type="text"
                                    //             placeholder='Eg. 0|100'
                                    //             className="form-control form-control-sm"
                                    //             onChange={handleChange(idx)}
                                    // defaultValue={rows[idx].inputAddOn.inputRange}
                                    //             id="inputRange"
                                    //             name="inputRange"
                                    //             min={rows[idx].inputAddOn.inputRange }
                                    //             max={rows[idx].inputAddOn.inputRange }
                                    //             />
                                    //             <small style={{'color':'red'}}><b>Min|Max(Range)</b></small>
                                    //             </span>
                                    <div className="d-flex justify-content-between">
                                      <div class="form-group">
                                        <label>Min Number:</label>
                                        <input
                                          type="number"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMin"
                                          name="inputRangeMin"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                          min={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Max Number:</label>
                                        <input
                                          type="number"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMax"
                                          name="inputRangeMax"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                          max={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                        />
                                        {parseFloat(
                                          rows[idx].inputAddOn.inputRangeMin
                                        ) >
                                          parseFloat(
                                            rows[idx].inputAddOn.inputRangeMax
                                          ) && (
                                          <div className="text-danger">
                                            {" "}
                                            Max number should be greater than
                                            Min number
                                          </div>
                                        )}

                                        {/* {selectedNumberErr && (
                                          <p
                                            style={{
                                              color: "red",
                                            }}
                                          >
                                            {selectedNumberErr}
                                          </p>
                                        )} */}


                                      </div>
                                    </div>
                                  )}

                                  {rows[idx].inputType === "decimal" && (
                                    <div className="d-flex justify-content-between">
                                      <div class="form-group">
                                        <label>Min Number:</label>
                                        <input
                                          type="number"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMin"
                                          name="inputRangeMin"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                          min={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Max Number:</label>
                                        <input
                                          type="number"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMax"
                                          name="inputRangeMax"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                          max={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                        />
                                         {parseFloat(
                                        rows[idx].inputAddOn.inputRangeMin
                                      ) >
                                        parseFloat(
                                          rows[idx].inputAddOn.inputRangeMax
                                        ) && (
                                        <div className="text-danger">
                                         Max number should be greater than Min number
                                        </div>
                                      )}
                                      </div>
                                      
                                    </div>
                                  )}
                                 

                                  {rows[idx].inputType === "date" && (
                                    <span>
                                      <input
                                        type="text"
                                        onChange={handleChange(idx)}
                                        id="inputDateRange"
                                        name="inputDateRange"
                                        placeholder="Eg. 2022-01-01|2022-02-01"
                                        className="form-control form-control-sm"
                                        min={
                                          rows[idx].inputAddOn.inputDateRange
                                        }
                                        max={
                                          rows[idx].inputAddOn.inputDateRange
                                        }
                                      />
                                      <small style={{ color: "red" }}>
                                        <b>Min|Max (YYYY-MM-DD)</b>
                                      </small>
                                    </span>
                                  )}

                                  {rows[idx].inputType === "time" && (
                                    <div
                                      className="d-flex justify-content-between"
                                      key={rows[idx].key}
                                    >
                                      <div class="form-group">
                                        <label>Min Time:</label>
                                        <input
                                          type="time"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMin"
                                          name="inputRangeMin"
                                          className="form-control form-control-sm"
                                          // defaultValue={props.data.inputAddOn.inputRangeMin}
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                          min={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                          // max={props.data.inputAddOn.inputRangeMax ? props.data.inputAddOn.inputRangeMax : ''}
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Max Time:</label>
                                        <input
                                          type="time"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMax"
                                          name="inputRangeMax"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                          // defaultValue={props.data.inputAddOn.inputRangeMax}
                                          // min={props.data.inputAddOn.inputRangeMin ? props.data.inputAddOn.inputRangeMin : ''}
                                          max={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {rows[idx].inputType === "datetime-local" && (
                                    <div className="d-flex justify-content-between">
                                      <div class="form-group">
                                        <label>Date-time:</label>
                                        <input
                                          type="datetime-local"
                                          onChange={handleChange(idx)}
                                          defaultValue={
                                            rows[idx].inputAddOn.inputDateTime
                                          }
                                          id="datetime-local"
                                          name="datetime-local"
                                          className="form-control form-control-sm"
                                          min={
                                            rows[idx].inputAddOn.inputDateTime
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
                                </td>

                                {/* <td>
                                                                {idx == 0 &&
                                                                    <button type="button" className="btn btn-sm btn-outline-primary pull-left"
                                                                        onClick={handleAddRow}><i className="icofont-plus-circle"></i></button>
                                                                }
                                                                {rows.length == idx + 1 && idx != 0 &&
                                                                    <button type="button" className="btn btn-outline-danger btn-sm"
                                                                        onClick={handleRemoveSpecificRow(idx)} >
                                                                        <i className="icofont-ui-delete"></i>
                                                                    </button>
                                                                }
                                                            </td> */}

                                {/* <td>
                                                                {idx == 0 &&
                                                                    <button type="button" className="btn btn-sm btn-outline-primary pull-left"
                                                                        onClick={handleAddRow}><i className="icofont-plus-circle"></i></button>
                                                                }
                                                             
{idx !== 1 && (
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveSpecificRow(idx)}>
                    <i className="icofont-ui-delete"></i>
                </button>)}
                                                            </td> */}

                                <td>
                                  {idx == 0 && (
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-primary pull-left"
                                      onClick={handleAddRow}
                                    >
                                      <i className="icofont-plus-circle"></i>
                                    </button>
                                  )}

                                  {idx != 0 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={handleRemoveSpecificRow(idx)}
                                    >
                                      <i className="icofont-ui-delete"></i>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {!formShow && rows && rows.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-info pull-left text-white"
                        onClick={handldeFormShow}
                      >
                        View Form
                      </button>
                    )}
                    {formShow && rows && (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger pull-left text-white"
                        onClick={handldeFormShow}
                      >
                        Hide Form
                      </button>
                    )}

                    <div className="pull-right">
                      <button type="submit" className="btn btn-sm btn-primary">
                        Submit
                      </button>
                      <Link
                        to={`/${_base}/DynamicForm`}
                        className="btn btn-sm btn-danger text-white"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>{" "}
                {/* Card Body */}
              </div>
              {/* Card */}
            </div>

            {formShow && rows && (
              <div className="row">
                {rows.map((data, index) => {
                  {console.log("dataF==>",rows)}
                  if (data.inputType && data.inputName && data.inputLabel) {
                    if (data.inputAddOn.inputRange) {
                      var range = data.inputAddOn.inputRange.split("|");
                    } else if (data.inputAddOn.inputDateRange) {
                      var range = data.inputAddOn.inputDateRange.split("|");
                    }

                    return (
                      <div key={index} className={`${data.inputWidth} mt-2`}>
                        <label>
                          <b>
                            {data.inputLabel} :
                            {data.inputMandatory === true ? (
                              <Astrick color="red" size="13px" />
                            ) : (
                              ""
                            )}
                          </b>
                        </label>

                        {data.inputType === "text" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            className="form-control form-control-sm"
                          />
                        )}

                        {data.inputType === "textarea" && (
                          <textarea
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            className="form-control form-control-sm"
                          >
                            {data.inputDefaultValue}
                          </textarea>
                        )}

                        {data.inputType === "date" && (
                          // <div className="form-control" style={{ width: "100%", position: "relative" }}>
                          //   <DatePicker
                          //     selected={dateValue}
                          //     onChange={onChangeDate}
                          //     dateFormat={data.inputFormat}
                          //     style={{
                          //       width: "100%",
                          //       borderRadius: "4px",
                          //       border: "1px solid #ccc",
                          //       padding: "8px",
                          //       fontSize: "16px",
                          //       boxSizing: "border-box",
                          //     }}
                          //     className="custom-datepicker"
                          //   />
                          // </div>

                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            min={data.inputAddOn.inputDateRange ? range[0] : ""}
                            max={data.inputAddOn.inputDateRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}

                        {data.inputType === "datetime-local" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            min={data.inputAddOn.inputDateRange ? range[0] : ""}
                            max={data.inputAddOn.inputDateRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}

                        {data.inputType === "time" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            min={data.inputAddOn.inputDateRange ? range[0] : ""}
                            max={data.inputAddOn.inputDateRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}
                        {data.inputType === "number" && (
                          <input
                            type="text"
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            // defaultValue={data.inputAddOn.inputRange}
                            defaultValue={data.inputAddOn.inputRange}
                            min={data.inputAddOn.inputRange ? range[0] : ""}
                            max={data.inputAddOn.inputRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}
                        

                        {console.log("input==>",data)}

                        {
                          data.inputType === "select" && (
                            <select
                              id={
                                data.inputName
                                  ? data.inputName
                                      .replace(/ /g, "_")
                                      .toLowerCase()
                                  : ""
                              }
                              // defaultValue={data.inputAddOn.inputDataSource}
                              name={data.inputName}
                              className="form-control form-control-sm"
                            >
                                                          <option> {data.inputDefaultValue}</option>
                            {data.inputAddOn.inputRadio &&
                              data.inputAddOn.inputRadio.map((option) => {
                                return (
                                  <option
                                    selected={
                                      parseInt(
                                        data &&
                                          data?.inputAddOn?.inputDataSource
                                      ) === option.value
                                    }
                                    
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                );
                              })}
                            
                            </select>
                          )
                  }


                        {data?.inputType === "radio" && (
                          <div className="row mt-3">
                            {/* {data &&
                              data?.inputAddOn?.inputRadio.map((i, index) => (
                                <div key={index} className="col">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="is_active"
                                      id={`is_active_${index}`}
                                      value="1"
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`is_active_${index}`}
                                    >
                                      {i.label}
                                    </label>
                                  </div>
                                </div>
                              ))} */}
                          </div>
                        )}

                        {data.inputType === "checkbox" && (
                          <div className="row mt-3">
                            {data &&
                              data.inputAddOn.inputRadio.map((i, index) => (
                                <div key={index} className="col">
                                  <div className="form-check">
                                    <input
                                      className="sm-1"
                                      type="checkbox"
                                      style={{
                                        marginRight: "8px",
                                        marginLeft: "10px",
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`is_active_${index}`}
                                    >
                                      {i.label}
                                    </label>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        {data.inputType === "decimal" && (
                          <div className="d-flex justify-content-between">
                            <div class="form-group">
                              <label>Min Number:</label>
                              <input
                                type="number"
                                // onChange={handleChange(idx)}

                                id="inputRangeMin"
                                name="inputRangeMin"
                                className="form-control form-control-sm"
                                defaultValue={data.inputAddOn.inputRangeMin}
                                min={data.inputAddOn.inputRangeMin}
                              />
                            </div>
                            <div className="form-group">
                              <label>Max Number:</label>
                              <input
                                type="number"
                                // onChange={handleChange(idx)}

                                id="inputRangeMax"
                                name="inputRangeMax"
                                className="form-control form-control-sm"
                                defaultValue={data.inputAddOn.inputRangeMax}
                                max={data.inputAddOn.inputRangeMax}
                              />
                            </div>
                          </div>
                        )}

                        {/* {data.inputType === "select-master" && (
                          <select
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            defaultValue={data.inputAddOn.inputDataSource}
                            name={data.inputName}
                            className="form-control form-control-sm"
                          >
                            <option> {data.inputName}</option>
                            {data.inputAddOn.inputDataSourceData &&
                              data.inputAddOn.inputDataSourceData.map(
                                (option) => {
                                  return (
                                    <option
                                      selected={
                                        parseInt(
                                          data &&
                                            data?.inputAddOn
                                              ?.inputDataSourceData
                                        ) === option.value
                                      }
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  );
                                }
                              )}
                          </select>
                        )} */}

                        {console.log("daat55",data)}
                        {console.log("rows==>",rows)}


{data.inputType === "select-master" && (
                          <select
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            defaultValue={data.inputAddOn.inputDataSource}
                            name={data.inputName}
                            className="form-control form-control-sm"
                          >
                            <option> {data.inputName}</option>
                            {data.inputAddOn.inputDataSourceData &&
                              data.inputAddOn.inputDataSourceData.map(
                                (option) => {
                                  return (
                                    <option
                                      selected={
                                        parseInt(
                                          data &&
                                            data?.inputAddOn
                                              ?.inputDataSourceData
                                        ) === option.value
                                      }
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  );
                                }
                              )}
                          </select>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>{" "}
          {/*ROW*/}
        </div>
        {/*CONTAINER*/}
      </div>
      {/*BODY*/}
    </>
  );
}

export default EditDynamicForm;
