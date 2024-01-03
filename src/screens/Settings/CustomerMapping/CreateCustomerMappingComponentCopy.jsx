import React, { useState, useEffect } from 'react'
import {Link,useNavigate} from 'react-router-dom';
import CustomerMappingService from '../../../services/SettingService/CustomerMappingService'
import { _base } from '../../../settings/constants'

import ErrorLogService from "../../../services/ErrorLogService";
import UserService from "../../../services/MastersService/UserService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import Select from 'react-select';

import { CustomerDropdown } from '../../Masters/CustomerMaster/CustomerComponent'
import { CustomerTypeDropdown } from '../../Masters/CustomerTypeMaster/CustomerTypeComponent'
import { ProjectDropdown } from '../../ProjectManagement/ProjectMaster/ProjectComponent'
import { ModuleDropdown } from '../../ProjectManagement/ModuleMaster/ModuleComponent'
import { SubModuleDropdown } from '../../ProjectManagement/SubModuleMaster/SubModuleComponent'
import { TemplateDropdown } from '../../Masters/TemplateMaster/TemplateComponent'
import { DepartmentDropdown } from '../../Masters/DepartmentMaster/DepartmentComponent'
import { QueryTypeDropdown } from '../../Masters/QueryTypeMaster/QueryTypeComponent'
import { DynamicFormDropdown } from '../../Masters/DynamicFormMaster/DynamicFormComponent'

export default function CreateCustomerMappingComponentCopy({ location }) {

    const history = useNavigate();
    const [notify, setNotify] = useState();

    const [departmentId, setDepartmentId] = useState();

    const [data, setData] = useState({
        customer_type_id: null, customer_id: null, project_id: null, module_id: null, sub_module_id: null, query_type_id: null,
        form_id: null, department_id: null, template_id: null, priority: null, approach: null, user_policy: null
    });

    const [userData, setUserData] = useState();


    const [approach, setApproach] = useState();

    const handleChange = (value, name) => {
        if (name == "customer_type_id" && value) {
            setData({ ...data, customer_type_id: value, customer_id: null, project_id: null, module_id: null, sub_module_id: null });
        } else if (name == "customer_id" && value) {
            setData({ ...data, customer_type_id: null, customer_id: value });
        } else if (name == "project_id" && value) {
            setData({ ...data, customer_type_id: null, project_id: value.value });
        } else if (name == "module_id" && value) {
            setData({ ...data, customer_type_id: null, module_id: value.value });
        }
        else if (name == "sub_module_id" && value) {
            setData({ ...data, customer_type_id: null, sub_module_id: value.value });
        }
        else {
            setData({ ...data, [name]: value });
        }
    }

    const handleDependent = (e, name) => {
        setData({ ...data, [name]: e.value });
    }

    const handleForm = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        // for (var pair of form) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }
        await new CustomerMappingService().postCustomerMapping(form).then(res => {
            if(res.status===200){
                if(res.data.status===1){
                    history({
                        pathname:`/${_base}/CustomerMapping`,
                        state: {alert : {type: 'success', message:res.data.message} }
                    });
                }else{
                    alert(res.data.message);
                    setNotify({type: 'danger', message:res.data.message});
                }
            }else{
                setNotify({type: 'danger', message:res.message});
                new ErrorLogService().sendErrorLog("Customer","Create_Customer","INSERT",res.message);
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response; 
            new ErrorLogService().sendErrorLog("Status","Create_Status","INSERT",errorObject.data.message);
        })
    }

    const handleApproch = (e) => {
        var value = e.target.value;
        setApproach(value);
    }

    const selectUser = async (e) => {
        setDepartmentId(e.target.value)
        const tempUser = [];
        await new UserService().getUser().then(res => {
            if (res.status === 200) {
                const temp = res.data.data
                for (const key in temp) {
                    if (temp[key].department_id == e.target.value) {
                        tempUser.push({
                            value: temp[key].id,
                            label: temp[key].first_name + " " + temp[key].last_name,
                        })
                    }
                }
                setUserData(null);
                setUserData(tempUser);
            }
        })
    }

    const [rationTotal,setRationTotal] = useState(0);
    const checkRatio = (e) =>{
        let rationTotalTemp = parseInt(e.target.value)+rationTotal;
        setRationTotal(rationTotalTemp);
    }

    useEffect(() => {
        // loadData();
    }, [])

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Create Customer Mapping" />
            {notify && <Alert alertData={notify} />}

            <div className="row clearfix g-3">
                <div className="col-sm-12">

                    <div className='card mt-2'>

                        <div className='card-body'>

                            <form onSubmit={handleForm} method="post" encType='multipart/form-data'>
                                
                                <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label">
                                        <b>Select Customer Type :</b>
                                    </label>
                                    <div className="col-sm-4">
                                        <CustomerTypeDropdown
                                            id="customer_type_id"
                                            name="customer_type_id"
                                            placeholder=""
                                            defaultValue={data.customer_type_id}
                                            required={true}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    
                                </div>

                              
                                <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label">
                                        <b>Select Query Type :</b>
                                    </label>
                                    <div className="col-sm-4">
                                        <QueryTypeDropdown
                                            id="query_type_id"
                                            name="query_type_id"
                                            placeholder=""
                                            required={true}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label">
                                        <b>Select Form :</b>
                                    </label>
                                    <div className="col-sm-4">
                                        <DynamicFormDropdown
                                            id="dynamic_form_id"
                                            name="dynamic_form_id"
                                            placeholder=""
                                            required={true}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label">
                                        <b>Select Template :</b>
                                    </label>
                                    <div className="col-sm-4">
                                        <TemplateDropdown
                                            id="template_id"
                                            name="template_id"
                                            placeholder=""
                                            required={true}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label">
                                        <b>Priority :</b>
                                    </label>
                                    <div className="col-sm-4">
                                        <select className="form-control form-control-sm" id="priority" name="priority" required={true}>
                                            <option value="">Select Priority</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Very High">Very High</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label">
                                        <b>Approach :</b>
                                    </label>
                                    <div className="col-sm-4">
                                        <select className="form-control form-control-sm" id="approach" name="approach" required={true} onChange={(e) => { handleApproch(e) }}>
                                            <option value="">Select Approach</option>
                                            <option value="RR">Departmentwise Round Robin</option>
                                            <option value="HLT">User Having Less Ticket</option>
                                            <option value="SP">Single Person</option>
                                            <option value="RW">Ratio Wise</option>
                                        </select>
                                    </div>

                                </div>

                                <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label">
                                        <b>Select Department :</b>
                                    </label>
                                    <div className="col-sm-4">
                                        <DepartmentDropdown
                                            id="department_id"
                                            name="department_id"
                                            placeholder=""
                                            required={true}
                                            getChangeValue={(e) => { selectUser(e) }}
                                        />
                                    </div>
                                </div>

                                {approach && approach == 'RR' &&
                                    <div className="form-group row mt-3">
                                        <label className="col-sm-2 col-form-label">
                                            <b>Select User :</b>
                                        </label>
                                        <div className="col-sm-4">
                                            <Select
                                                isMulti
                                                isSearchable={true}
                                                name="user_id[]"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                options={userData}
                                                required
                                                style={{ zIndex: "100" }}
                                            />
                                        </div>
                                    </div>
                                }

                                {approach && approach == 'HLT' &&
                                    <div className="form-group row mt-3">
                                        <label className="col-sm-2 col-form-label">
                                            <b>Select User :</b>
                                        </label>
                                        <div className="col-sm-4">
                                            <select className="form-control form-control-sm"
                                                id="user[]"
                                                name="user[]"
                                                required
                                                isMulti
                                            >
                                                <option defaultValue="">Select</option>
                                                {departmentId && userData && userData.map((ele, i) => {
                                                    return <option value={ele.id} key={i}>{ele.name}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                }

                                {approach && approach == 'SP' &&
                                    <div className="form-group row mt-3">
                                        <label className="col-sm-2 col-form-label">
                                            <b>Select User :</b>
                                        </label>
                                        <div className="col-sm-4">
                                            <select className="form-control form-control-sm"
                                                id="user"
                                                name="user"
                                                required
                                            >
                                                <option defaultValue="">Select</option>
                                                {departmentId && userData && userData.map((ele, i) => {
                                                    return <option value={ele.value} key={i}>{ele.label}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                }

                                {approach && approach == 'RW' &&
                                    <>
                                        {userData && departmentId && userData.map((ele, i) => {
                                            return <div className="form-group row mt-3">
                                                <label className="col-sm-2 col-form-label">
                                                    <b>User and Ratio:</b>
                                                </label>
                                                <div className="col-sm-4">
                                                    <input type="text" className="form-control col-sm-4" value={ele.label} />
                                                    <input type="hidden" value={ele.value} name="user[]"/>
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="text" className="form-control col-sm-2" name="ratio[]" onChange={checkRatio}/>
                                                </div>
                                            </div>
                                        }
                                        )}

                                        <h6>{rationTotal}</h6>
                                    </>
                                }

                                {/* <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label">
                                        <b>User Policy :</b>
                                    </label>
                                    <div className="col-sm-4">
                                        <input className="form-control form-control-sm"
                                            id="user_policy"
                                            name="user_policy"
                                        />
                                    </div>
                                </div> */}

                                <div className="mt-3" style={{ 'textAlign': 'right' }}>
                                    <button type="submit" className="btn btn-primary">Submit</button>


                                </div>
                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
