import React, { useState, useEffect } from 'react'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { _base } from '../../../settings/constants'
import ErrorLogService from "../../../services/ErrorLogService";
import AddOn from './AddOn';
import { masterURL } from '../../../settings/constants'
import { getData } from '../../../services/DynamicService/DynamicService'
import DynamicFormService from '../../../services/MastersService/DynamicFormService';
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
// import RenderDynamicForm from '../../TicketComponent/RenderDynamicForm';
import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";
import Select from 'react-select';
import { Checkbox } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import *  as Validation from '../../../components/Utilities/Validation';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';


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
            inputOnChangeSource:null,
        }
    };

    const [rows, setRows] = useState([mainJson]);
    const [labelNames, setLabelNames] = useState([]);

    const [formShow, setFormShow] = useState(false);

    const [index, setIndex] = useState({ index: 0 });

    const [dropdown, setDropdown] = useState({ index: 0 });

    const [inputDataSource, setInputDataSource] = useState();

    const handleChange = idx => async (e) => {

        setIndex({ index: idx })
        const { name, value } = e.target;

        // alert(e.target.value);
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
                console.log(rows[idx].inputAddOn.inputRangeMin)
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
                const test = e.target.value;
                rows[idx].inputAddOn.inputRadio = test;

                await new DynamicFormDropdownMasterService().getDropdownById(test).then((res) => {
                    if (res.status == 200) {
                        if (res.data.status == 1) {
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
            else if (e.target.name == "inputDataSource") {
                // console.log(e.target.value)
                // const test = e.target.value.split('|');
                // console.log(test)
                // const _URL = masterURL[test[0]];
                // console.log(_URL)
                // const _Value = test[1];
                // const _Label = test[2];
                // console.log(_Value)
                // console.log(_Value)

                // getData(_URL).then(res => {
                //     let counter = 1;
                //     const tempData = [];
                //     for (const key in res.data) {
                //         const t = res.data[key];
                //         tempData.push({
                //             value: t[_Value],
                //             label: t[_Label]
                //         })
                //     }
                //     rows[idx].inputAddOn.inputDataSourceData = tempData
                // });
                // rows[idx].inputAddOn.inputDataSource = e.target.value;

                const test = e.target.value;
                rows[idx].inputAddOn.inputDataSource = test;
                if(test){
                    await new DynamicFormDropdownMasterService().getDropdownById(test).then((res) => {
                        console.log(res.data.data.dropdown)
                        if (res.status == 200) {
                            if (res.data.status == 1) {
                                const temp = [];
                                res.data.data.dropdown.forEach(d => {
                                    temp.push({ 'value': d.id,'label': d.label });
                                })
                                rows[idx].inputAddOn.inputDataSourceData = temp;
                                setInputDataSource(temp)
                            }
                        }
                    })
                }
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
                    history({
                        pathname: `/${_base}/DynamicForm`,
                      
                    },{ state: { alert: { type: "success", message: res.data.message } }}
                    );
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
    }

    const [dateValue, setDateValue] = useState(new Date())
    const onChangeDate = (value) => {
        setDateValue(new Date(value))
    }
    useEffect(() => {
        loadData();
    }, [rows])

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
                                                                <select className="form-control form-control-sm" required
                                                                    name="inputType" defaultValue={item.inputType}
                                                                    onChange={handleChange(idx)}
                                                                >
                                                                    <option value=''>Select Type</option>
                                                                    <option value="text">TEXT</option>
                                                                    <option value="textarea">TEXTAREA</option>
                                                                    <option value="number">NUMBER</option>
                                                                    <option value="number">DECIMAL</option>
                                                                    <option value="date">DATE</option>
                                                                    <option value="datetime-local">DATE TIME</option>
                                                                    <option value="time">TIME</option>
                                                                    <option value="select">SELECT</option>
                                                                    <option value="radio">RADIO</option>
                                                                    <option value="select-master">SELECT MASTER</option>
                                                                    <option value="checkbox">CHECKBOX</option>
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
                                                                <input
                                                                    type="checkbox"
                                                                    name="inputMultiple"
                                                                    defaultValue={item.inputMultiple}
                                                                    onChange={handleChange(idx)}

                                                                />
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
                                                                        onGetChange={handleChange(idx)} 
                                                                        dropdown={dropdown}
                                                                        key={Math.random()}/>}
                                                                {rows && <AddOn id={idx}
                                                                 data={rows[idx]}
                                                                onGetChange={handleChange(idx)} dropdown={dropdown}
                                                                key={Math.random()}
                                                                />
                                                                }
                                                            
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

                                                {data.inputAddOn.inputRadio ? data.inputAddOn.inputRadio.map((d) => {
                                                    return <div>
                                                        <input type="radio"
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