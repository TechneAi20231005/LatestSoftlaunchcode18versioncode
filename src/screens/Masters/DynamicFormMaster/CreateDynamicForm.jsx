import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { _base } from '../../../settings/constants'
import ErrorLogService from "../../../services/ErrorLogService";
import AddOn from './AddOn';
import { dynamicURL } from '../../../settings/constants'
import { getData } from '../../../services/DynamicService/DynamicService'
import DynamicFormService from '../../../services/MastersService/DynamicFormService';
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
// import RenderDynamicForm from '../../TicketComponent/RenderDynamicForm';
import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import *  as Validation from '../../../components/Utilities/Validation';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";


function CreateDynamicForm() {
    const [notify, setNotify] = useState(null);
    const history = useNavigate();
    const mainJson = {
        inputWidth: "col-sm-6",
        inputType: null,
        inputName: null,
        inputLabel: null,
        inputFormat: null,
        inputDefaultValue: null,
        inputMandatory: null,
        inputMultiple: null,
        inputAddOn:{
            inputRange: null,
            inputRangeMin: null,
            inputRangeMax: null,
            inputDataSource: null,
            inputDataSourceData: null,
            inputDateRange: null,
            inputDateTime: null,
            inputRadio: null,
            inputCheckbox:null,
            inputOnChangeSource:null,
        }
    };

    const [rows, setRows] = useState([mainJson]);
    const [labelNames, setLabelNames] = useState([]);

    const [formShow, setFormShow] = useState(false);

    const [index, setIndex] = useState({ index: 0 });

    const [dropdown, setDropdown] = useState({ index: 0 });

    const [inputDataSource, setInputDataSource] = useState();
    const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);
    const [radioSelect, setRadioSelect] = useState()
    const [checkboxSelect, setCheckboxSelect] = useState()

    const handleChange = idx => async (e) => {
        setIndex({ index: idx })
        const { name, value } = e.target;
        const notAllowed = ["ref_id", 'created_at', 'updated_at', 'attachment', 'query_type_id', 'query_type', 'object_id', 'tenant_id', 'ticket_id', 'user_id',
            'confirmation_required', 'project_id', 'module_id', 'submodule_id', 'cuid', 'ticket_date', 'expected_solve_date', 'assign_to_department_id',
            'assign_to_user_id', 'type_id', 'priority', 'status_id', 'description', 'from_department_id', 'remark', 'is_active', 'created_by', 'updated_by',
            'passed_status', 'passed_status_changed_by', 'passed_status_changed_at', 'passed_status_remark', 'ticket_confirmation_otp', 'ticket_confirmation_otp_created_at'
        ];

        if (!notAllowed.includes(e.target.value.replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, '_').toLowerCase())) {
            if (e.target.name === "inputWidth") {
                rows[idx].inputWidth = e.target.value;
            }
            else if (e.target.name === "inputType") {
                rows[idx].inputType = e.target.value;
                if (e.target.value == "date") {
                    rows[idx].inputFormat = "y-MM-dd";
                } else {
                    rows[idx].inputFormat = null;
                }



            }
            else if (e.target.name === "inputLabel") {
                rows[idx].inputLabel = e.target.value;
                rows[idx].inputName = e.target.value.replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, '_').toLowerCase();

                labelNames[idx]=rows[idx].inputName;
            }
            else if (e.target.name === "inputDefaultValue") {
                rows[idx].inputDefaultValue = e.target.value;
            }
            else if (e.target.name === "inputMandatory") {
                rows[idx].inputMandatory = e.target.checked;
            }
            else if (e.target.name === "inputMultiple") {
                rows[idx].inputMultiple = e.target.checked;
            }
            else if (e.target.name === "inputDataOption") {
                rows[idx].inputOption = e.target.value;
            }
            else if (e.target.name == "inputRange") {
                rows[idx].inputAddOn.inputRange = e.target.value;
            }
            else if (e.target.name == "inputRangeMin") {
                rows[idx].inputAddOn.inputRangeMin = e.target.value;
            }
            else if (e.target.name == "inputRangeMax") {
                if (rows[idx].inputAddOn.inputRangeMin > e.target.value) {
                    alert("Please select grater value");
                    return false;
                }
                rows[idx].inputAddOn.inputRangeMax = e.target.value;
            }
            else if (e.target.name == "datetime-local") {
                rows[idx].inputAddOn.inputDateTime = e.target.value;
            }
            else if (e.target.name == "inputFormat") {
                rows[idx].inputFormat = e.target.value;
            }
            else if (e.target.name == "inputRadio") {
                setFormShow(
                    formShow == true ? false : true
                ) 
                const test = e.target.value;
                rows[idx].inputAddOn.inputRadio = test;

                await new DynamicFormDropdownMasterService().getDropdownById(test).then((res) => {
                    if (res.status == 200) {
                        if (res.data.status == 1) {
                            const dropNames = res.data.data
                            setRadioSelect(dropNames.master.dropdown_name)
                            const temp = [];
                            res.data.data.dropdown.forEach(d => {
                                temp.push({ 'label': d.label, 'value': d.id });
                            })
                            rows[idx].inputAddOn.inputRadio = temp;
                            // setInputDataSource(temp)
                        }
                    }
                })
            }
            else if (e.target.name == "inputCheckbox") {
                setFormShow(
                    formShow == true ? false : true
                ) 
                const test = e.target.value;
                rows[idx].inputAddOn.inputCheckbox = test;

                await new DynamicFormDropdownMasterService().getDropdownById(test).then((res) => {
                    if (res.status == 200) {
                        if (res.data.status == 1) {
                            const dropNames = res.data.data
                            setCheckboxSelect(dropNames.master.dropdown_name)
                            const temp = [];
                            res.data.data.dropdown.forEach(d => {
                                temp.push({ 'label': d.label, 'value': d.id });
                            })
                            rows[idx].inputAddOn.inputCheckbox = temp;
                            // setInputDataSource(temp)
                        }
                    }
                })
            }

            else if (e.target.name == "inputDataSource") {
            //     var test = e.target.value.split('|');
            //     const _URL = dynamicURL[test[0]];
            //    const newURL=(_URL+test[2])
            //     const _Value = test[1];
            //     const _Label = test[2];
            //     // console.log(_Value)
            //     // console.log(_Label)

            //     getData(newURL).then(res => {
            //         let counter = 1;
            //         var tempData = [];
            //         res.data.map((d,i)=>{
            //             tempData.push({ 'label': d.department, 'value': d.id });
            //         })
            //         // for (const key in res.data) {
            //         //     const t = res.data[key];
            //         //     tempData.push({
            //         //         value: t[_Value],
            //         //         label: t[_Label]
            //         //     })
            //         // }
            //         rows[idx].inputAddOn.inputDataSourceData = tempData
            //     });
            //     rows[idx].inputAddOn.inputDataSource = e.target.value;
            //             console.log(e.target.value);
            //     //  test = e.target.value;
            //     rows[idx].inputAddOn.inputDataSource = test;
            //     console.log(e.target.name);
            //     // if(test){
            //     //     await new DynamicFormDropdownMasterService().getDropdownById(test).then((res) => {
            //     //         if (res.status == 200) {
            //     //             if (res.data.status == 1) {
            //     //                 const temp = [];
            //     //                 res.data.data.dropdown.forEach(d => {
            //     //                     temp.push({ 'value': d.id,'label': d.label });
            //     //                 })
            //     //                 rows[idx].inputAddOn.inputDataSourceData = temp;
            //     //                 setInputDataSource(temp)
            //     //             }
            //     //         }
            //     //     })
            //     // }
            } else if (e.target.name == "inputOnChangeSource") {
                rows[idx].inputAddOn.inputOnChangeSource = e.target.value;
            }
        } else {
            alert("Not Allowed to use entered Keywork");
            rows[idx].inputLabel = "";
        }
        // const rows = [...rows];
        // rows[idx] = {
        //     [name]: value
        // };
        // setRows({
        //     rows
        // });
    };

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
        setNotify(null)
        let flag = 1;
        let last = rows.length - 1;

        if (!rows[last].inputType || !rows[last].inputLabel) {
            flag = 0;
            setNotify(null)
        }

        const item = {
            inputWidth: "col-sm-6",
            inputType: null,
            inputName: null,
            inputLabel: null,
            inputFormat: null,
            inputDefaultValue: null,
            inputMandatory: null,
            inputMultiple: null,
            inputAddOn: {
                inputRange: null,
                inputRangeMin: null,
                inputRangeMax: null,
                inputDataSource: null,
                inputDataSourceData: null,
                inputDateRange: null,
                inputDateTime: null,
                inputRadio: null,
                inputCheckbox:null,
                inputOnChangeSource:null,
            }
        };

        if (flag === 1) {
            await setRows([...rows, item]);
        } else {
            setNotify({ type: 'danger', message: "Fill Complete Details !!!" })
        }
    };

    const handleRemoveSpecificRow = (idx) => () => {
        if (idx > 0) {
            setRows(
                rows.filter((_, i) => i !== idx)
            );
        }
    }

    const handldeFormShow = () => {
        setFormShow(
            formShow == true ? false : true
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const data=new FormData(e.target);
        const data = {
            template_name: e.target.template_name.value,
            data: JSON.stringify(rows)
        }
        // var a = JSON.stringify(Object.fromEntries(data))
        // console.log(a)
        await new DynamicFormService().postDynamicForm(data).then(res => {
            if (res.status === 200) {
                if (res.data.status === 1) {
                    history.push({
                        pathname: `/${_base}/DynamicForm`,
                        state: { alert: { type: 'success', message: res.data.message } }
                    });
                } else {
                    setNotify({ type: 'danger', message: res.data.message });
                }
            } else {
                setNotify({ type: 'danger', message: res.message });
                new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
            }
        });
    }

    const loadData = async () => {
        await new DynamicFormDropdownMasterService().getAllDropdown().then((res) => {
            if (res.status == 200) {
                if (res.data.status == 1) {
                    // const temp=[];
                    // res.data.data.forEach(d=>{
                    //     temp.push({'label':d.dropdown_name,'value':d.id});
                    // })
                    // setDropdown(temp);

                    setDropdown(res.data.data.map((d) => ({ label: d.dropdown_name, value: d.id })))
                }
            }
        })
        
        await new ManageMenuService().getRole(roleId).then((res) => {
            if (res.status === 200) {
            //   setShowLoaderModal(false);
              if (res.data.status == 1) {
                const getRoleId = sessionStorage.getItem("role_id");
                setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
              }
            }
          });

    }

    const [dateValue, setDateValue] = useState(new Date())
    const onChangeDate = (value) => {
        setDateValue(new Date(value))
    }


    useEffect(() => {
        loadData();
    }, [rows])


    useEffect(() => {
        if(checkRole && checkRole[13].can_create === 0){
            // alert("Rushi")

            window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
          }

    }, [checkRole])


    return (
        <>
            <div className="body d-flex py-3">
                <div className="container-xxl">
                    <div className="row clearfix g-3">
                        <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
                            {/*************** HEADING ***************/}
                            <div className="card">
                                <div className="card-header d-flex justify-content-between bg-transparent
                                border-bottom-0">
                                    <h2 className="mb-0 fw-bold ">Dynamic Form</h2>
                                    {/* <Link to="Country/Create/" className="btn btn-dark btn-sm btn-set-task w-sm-100">
                                        <i className="icofont-plus-circle me-2 fs-6" />
                                        Add
                                    </Link> */}
                                </div>
                            </div>
                            {notify && <Alert alertData={notify} />}

                            {/*************** TABLE ***************/}
                            <div className='card mt-2'>
                                <div className='card-body'>
                                    <form onSubmit={handleSubmit}>
                                        <div className='row'>
                                            <div className='col-md-2'>
                                                <label><b>Form Name :<Astrick color="red" size="13px" /></b></label>
                                            </div>
                                            <div className='col-md-4'>
                                                <input type="text" className='form-control form-control-sm'
                                                    name='template_name' id='template_name'
                                                    required
                                                    onKeyPress={e => {
                                                        Validation.CharactersNumbersOnly(e)
                                                    }}
                                                />
                                            </div>
                                        </div>

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
                                                            <td>{idx + 1}</td>
                                                            <td>
                                                                <select 
                                                                className="form-control form-control-sm" 
                                                                required
                                                                name="inputType" 
                                                                defaultValue={item.inputType}
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
                                                                    {/* <option value="select-master">SELECT MASTER</option> */}
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <select className="form-control form-control-sm" required
                                                                    name="inputWidth" defaultValue={item.inputWidth}
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
                                                                    defaultValue={item.inputLabel}
                                                                    onChange={handleChange(idx)}
                                                                    className="form-control form-control-sm"
                                                                    required
                                                                    onKeyPress={e => {
                                                                        Validation.CharactersNumbersOnly(e)
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    name="inputDefaultValue"
                                                                    defaultValue={item.inputDefaultValue}
                                                                    onChange={handleChange(idx)}
                                                                    className="form-control form-control-sm"
                                                                    onKeyPress={e => {
                                                                        Validation.CharactersNumbersOnly(e)
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    name="inputMandatory"
                                                                    defaultValue={item.inputMandatory}
                                                                    onChange={handleChange(idx)}
                                                                    className="center"
                                                                />
                                                            </td>
                                                            <td>
                                                                {rows[idx].inputType == "select" &&
                                                                <input
                                                                    type="checkbox"
                                                                    name="inputMultiple"
                                                                    defaultValue={item.inputMultiple}
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

                                                            <td>
                                                                {rows &&

                                                                    <AddOn id={idx} 
                                                                        labelNames={labelNames}
                                                                        data={rows[idx]} 
                                                                        radioSelect={radioSelect}
                                                                        checkboxSelect={checkboxSelect}
                                                                        onGetChange={handleChange(idx)} 
                                                                        dropdown={dropdown}
                                                                        key={Math.random()}/>}
                                                                {/* {rows && <AddOn id={idx}
                                                                 data={rows[idx]}
                                                                onGetChange={handleChange(idx)} dropdown={dropdown}
                                                                key={Math.random()}
                                                                />
                                                                } */}

                                                            </td>

                                                            <td>
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
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>


                                        {!formShow && rows && rows.length > 0 &&
                                            <button type="button" className="btn btn-sm btn-info pull-left text-white"
                                                onClick={handldeFormShow}
                                            >
                                                View Form
                                            </button>
                                        }
                                        {formShow && rows && <button type="button" className="btn btn-sm btn-danger pull-left text-white"
                                            onClick={handldeFormShow}>
                                            Hide Form
                                        </button>
                                        }

                                        <div className='float-end'>
                                            <button type="submit" className="btn btn-sm btn-primary">Submit</button>
                                            <Link to={`/${_base}/DynamicForm`} className="btn btn-sm btn-danger text-white">Cancel</Link>
                                        </div>


                                    </form>

                                </div>   {/* Card Body */}
                            </div>{/* Card */}
                        </div>

                        {formShow && rows &&
                            <div className="row">
                                {
                                    rows.map((data, index) => {
                                        if (data.inputType && data.inputName && data.inputLabel) {
                                            if (data.inputAddOn.inputRange) {
                                                var range = data.inputAddOn.inputRange.split("|")
                                            } else if (data.inputAddOn.inputDateRange) {
                                                var range = data.inputAddOn.inputDateRange.split("|")
                                            }

                                            return <div key={index} className={`${data.inputWidth} mt-2`} >
                                                <label><b>{data.inputLabel} : </b></label>

                                                {data.inputType === 'text' &&
                                                    <input
                                                        type={data.inputType}
                                                        id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                                        name={data.inputName}
                                                        defaultValue={data.inputDefaultValue}
                                                        className="form-control form-control-sm"
                                                    />
                                                }
                                                {data.inputType === 'textarea' &&
                                                    <textarea
                                                        id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                                        name={data.inputName}
                                                        className="form-control form-control-sm"
                                                    >{data.inputDefaultValue}</textarea>
                                                }

                                                {/* {data.inputType === 'date' &&                                                    
                                                    <input
                                                        type={data.inputType}
                                                        id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                                        name={data.inputName}
                                                        format="yyyy/mm/dd"
                                                        defaultValue={data.inputDefaultValue}
                                                        min={data.inputAddOn.inputRangeMin}
                                                        max={data.inputAddOn.inputRangeMax}
                                                        className="form-control form-control-sm"
                                                    />
                                                } */}

                                                {data.inputType === 'date' &&
                                                    <div className='form-control'>
                                                        <DatePicker onChange={onChangeDate} value={dateValue} format={data.inputFormat}

                                                            style={{ width: '100%' }}
                                                        />
                                                    </div>
                                                }

                                                {data.inputType === 'datetime-local' &&
                                                    <input
                                                        type={data.inputType}
                                                        id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                                        name={data.inputName}
                                                        defaultValue={data.inputDefaultValue}
                                                        min={data.inputAddOn.inputDateRange ? range[0] : ''}
                                                        max={data.inputAddOn.inputDateRange ? range[1] : ''}
                                                        className="form-control form-control-sm"
                                                    />
                                                }

                                                {data.inputType === 'time' &&
                                                    <input
                                                        type={data.inputType}
                                                        id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                                        name={data.inputName}
                                                        defaultValue={data.inputDefaultValue}
                                                        min={data.inputAddOn.inputRangeMin}
                                                        max={data.inputAddOn.inputRangeMax}
                                                        className="form-control form-control-sm"
                                                    />
                                                }

                                                {data.inputType === 'number' &&
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                                        name={data.inputName}
                                                        defaultValue={data.inputDefaultValue}
                                                        min={data.inputAddOn.inputRangeMin}
                                                        max={data.inputAddOn.inputRangeMax}
                                                        className="form-control form-control-sm"
                                                    />
                                                }

                                                {data.inputType === 'select' &&
                                                    // <select
                                                    //     id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                                    //     name={data.inputName}
                                                    //     className="form-control form-control-sm"

                                                    // >
                                                    //     <option>Select {data.inputName}</option>
                                                    //     {
                                                    //         data.inputAddOn.inputDataSourceData &&
                                                    //         data.inputAddOn.inputDataSourceData.map((option) => {
                                                    //             return <option value={option.value}>{option.label}</option>
                                                    //         })
                                                    //     }
                                                    // </select>

                                                    <Select
                                                        options={inputDataSource}
                                                        isMulti
                                                        id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                                        name={data.inputName}
                                                        className="form-control form-control-sm"
                                                        required={true}
                                                    />
                                                }

                                        {data.inputType === "select-master" &&

                                                    <Select
                                                        options={data.inputAddOn.inputDataSourceData}
                                                        isMulti
                                                        id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                                        name={data.inputName}
                                                        className="form-control form-control-sm"
                                                        required={true}
                                                    />
                                                }



                                                {data.inputType == "radio" && data.inputAddOn.inputRadio ? data.inputAddOn.inputRadio.map((d) => {
                                                    return <div>
                                                        <input type="radio"
                                                        />
                                                        <label for={d.value}>{d.label}</label>
                                                    </div>
                                                }) : ''
                                                }
                                                  {data.inputType == "checkbox" && data.inputAddOn.inputCheckbox ?  data.inputAddOn.inputCheckbox.map((d) => {
                                                    return <div>
                                                        <input type="checkbox"
                                                        />
                                                        <label for={d.value}>{d.label}</label>
                                                    </div>
                                                }) : ''
                                                }

                                            </div>
                                        }
                                    })
                                }

                            </div>
                        }
                    </div> {/*ROW*/}
                </div>{/*CONTAINER*/}
            </div>{/*BODY*/}
        </>
    )
}


export default CreateDynamicForm


// import React, { useState, useEffect } from 'react'
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

// function CreateDynamicForm({ match }) {
//     const [notify, setNotify] = useState(null);
//     const history = useNavigate();
//     const [data, setData] = useState(null);
//     const inputData = [{ "type": "text", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false }, { "type": "textarea", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "cols": 3 }, { "type": "number", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "minlength": null, "maxlength": null, "min": null, "max": null }, { "type": "date", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "min": null, "max": null, "format": null }, { "type": "datetime", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "min": null, "max": null, "format": null }, { "type": "time", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "minlength": null, "maxlength": null, "min": null, "max": null, "format": null }, { "type": "select", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "dropdownSourceName": null, "dropdownSourceData": [], "whomToChange": null }];
//     const [dynamicForm, setDynamicForm] = useState([]);
//     const [currentForm, setCurrentForm] = useState();

//     const [dropdown, setDropdown] = useState();
//     const loadData = async () => {
//         // match.params.id
//         if (match.params.id) {
//             await new DynamicFormService().getDynamicFormById(match.params.id).then(res => {
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

//         setCurrentForm(null)
//         if (currentForm.label === null) {
//             alert("Please enter the label name")

//         } else {
//             setDynamicForm(prev => [...prev, currentForm])
//             setCurrentForm();
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

//     const handleInputChange = async (e) => {
//         let temp = []
//         const { name, value } = e.target;
//         setCurrentForm({
//             ...currentForm,
//             [name]: value
//         })
//         if (value && name == "dropdownSourceName") {
//             await new DynamicFormDropdownMasterService().getDropdownById(value).then((res) => {
//                 if (res.status === 200) {
//                     if (res.data.status == 1) {
//                         const options = res.data.data.dropdown.map(d => ({ value: d.id, label: d.label }));
//                         currentForm.dropdownSourceData = options
//                         setCurrentForm(prevForm => ({
//                             ...prevForm,
//                             dropdownSourceData: options
//                         }));
//                     }
//                 }
//             })
//             loadData()
//         }



//     }





//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const data = {
//             template_name: e.target.template_name.value,
//             dynamicForm: dynamicForm
//         }
//         if (match.params.id) {
//             alert(match.params.id);
//             await new DynamicFormService().updateDynamicForm(match.params.id, data).then(res => {
//                 if (res.status === 200) {
//                     if (res.data.status === 1) {
//                         history.push({
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
//                         history.push({
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

//     const [selectedId, setSelectedId] = useState()
//     useEffect(() => {
//         loadData();
//         var selected = []
//         selected = dynamicForm.map(d => d.dropdownSourceName)
//         setSelectedId(selected);
//     }, [dynamicForm], selectedId)
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
//                                     <select
//                                         className='form-control form-control-sm'
//                                         onChange={handleSelectedDropdown}
//                                         defaultValue={showDynamicFormModal.data ? showDynamicFormModal.data.type : ""}

//                                     >
//                                         <option>Select Type</option>
//                                         {inputData.map((d, i) => {
//                                             return <option value={d.type}>{d.type.toUpperCase()}</option>
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
//                                                         onChange={(e, index) => handleInputChange(e, index)}
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
//                                                         {selectedId && dropdown &&
//                                                             dropdown.filter(d => selectedId.includes(JSON.stringify(d.value))).map((d, i) => {
//                                                                 return <option key={d.name} value={d.name}>{d.label}</option>
//                                                             })
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
//                                         <button type="button" className="btn btn-sm btn-warning" onClick={(e) => addToForm(e)}>
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
//                                                     return <div class="col-md-4 mt-3" key={Math.random()}>
//                                                         <label><b>{d.label} : </b></label>
//                                                         <input type="text"
//                                                             className="form-control"
//                                                             id={d.id}
//                                                             name={d.label.replace(' ', '_').toLowerCase()}
//                                                             defaultValue={d.defalutValue}
//                                                             // readOnly={(d.readonly) ? false : true}
//                                                             readOnly={d.readonly == "TRUE"}
//                                                             placeholder={d.placeholder}
//                                                         // required={d.required}
//                                                         // readonly={d.readonly}
//                                                         // disabled={d.disabled}
//                                                         />

//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>


//                                                     </div>
//                                                 }
//                                                 if (d.type == "textarea") {
//                                                     return <div class="col-md-4 mt-3">
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
//                                                     return <div class="col-md-4 mt-3">
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
//                                                         {/* <button type="button" className="btn btn-sm btn-primary" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button> */}
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>


//                                                     </div>
//                                                 }
//                                                 if (d.type == "date") {
//                                                     return <div class="col-md-4 mt-3">
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
//                                                     return <div class="col-md-4 mt-3">
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
//                                                         {/* <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button> */}
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>

//                                                     </div>
//                                                 }
//                                                 if (d.type == "time") {
//                                                     return <div class="col-md-4 mt-3">
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

//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>

//                                                     </div>
//                                                 }
//                                                 if (d.type == "select") {
//                                                     return <div class="col-md-4 mt-3">
//                                                         <label><b>{d.label} :</b></label>
//                                                         <Select className="form-control"
//                                                             id={d.id}
//                                                             name={d.name}
//                                                             defaultValue={d.defaultValue}
//                                                             options={d.dropdownSourceData}
//                                                         // required={d.required}
//                                                         // readonly={d.readonly}
//                                                         // disabled={d.disabled}
//                                                         />

//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
//                                                         <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>

//                                                         {/* <button type="button" className="btn btn-sm btn-primary" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button> */}
//                                                     </div>

//                                                 }
//                                             })
//                                             }
//                                         </div>
//                                         {dynamicForm.length > 0 &&

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


// export default CreateDynamicForm
