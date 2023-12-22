import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ErrorLogService from "../../../services/ErrorLogService";
import StatusService from "../../../services/MastersService/StatusService";
import UserService from "../../../services/MastersService/UserService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from 'react-select';
import *  as Validation from '../../../components/Utilities/Validation';
import Alert from "../../../components/Common/Alert";
import { Astrick } from '../../../components/Utilities/Style';

import { CustomerDropdown } from '../CustomerMaster/CustomerComponent';
import { RoleDropdown } from '../RoleMaster/RoleComponent';
import { DesignationDropdown } from '../DesignationMaster/DesignationComponent';
import { DepartmentDropdown } from '../DepartmentMaster/DepartmentComponent';
import { CountryDropdown } from '../CountryMaster/CountryComponent';
import { CityDropdown } from '../CityMaster/CityComponent';
import { StateDropdown } from '../StateMaster/StateComponent';

import DepartmentService from '../../../services/MastersService/DepartmentService';
import RoleService from '../../../services/MastersService/RoleService';
import DesignationService from '../../../services/MastersService/DesignationService';
import DepartmentMappingService from "../../../services/MastersService/DepartmentMappingService";

function CreateUserComponentCopy({ match }) {

    const history = useNavigate();
    const [notify, setNotify] = useState(null);

    const [data, setData] = useState(null);
    const [accountFor, setAccountFor] = useState("SELF");


    const [department, setDepartment] = useState(null);
    const [departmentDropdown, setDepartmentDropdown] = useState(null);

    const [role, setRole] = useState(null);
    const [roleDropdown, setRoleDropdown] = useState(null);

    const [designation, setDesignation] = useState(null);
    const [designationDropdown, setDesignationDropdown] = useState(null);

    const [dataa, setDataa] = useState({ employee_id: null, departments: null });
    const [departmentData, setDepartmentData] = useState();
    const options = [{ 'value': "MY_TICKETS", 'label': "My Tickets" }, { 'value': "DEPARTMENT_TICKETS", 'label': "Department Tickets" }]
    const mappingData = { department_id: null, ticket_show_type: null, is_default: 0 };
    const [rows, setRows] = useState([mappingData]);
    const [dependent, setDependent] = useState({ country_id: null, state_id: null });
    const handleDependent = (e, name) => {
        setDependent({
            ...dependent,
            [name]: e.value
        });
    }

    const handleChangeAccountFor = (e) => {
        setAccountFor(e.target.value);
    }

    const handleForm = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        await new UserService().postUser(form).then(res => {
            // if(res.status===200){
            //     if(res.data.status===1){
            //         history.push({
            //             pathname:`/${_base}/User`,
            //             state: {alert : {type: 'success', message:res.data.message} }
            //         });
            //     }else{
            //         setNotify({type: 'danger', message:res.data.message});
            //     }
            // }else{
            //     setNotify({type: 'danger', message:res.message});
            //     new ErrorLogService().sendErrorLog("Customer","Create_Customer","INSERT",res.message);
            // }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog("Status", "Create_Status", "INSERT", errorObject.data.message);
        })
    }

    const loadData = async () => {
        setRows([mappingData]);
        await new DepartmentService().getDepartment().then(res => {
            if (res.status == 200) {
                const temp = [];
                if (res.data.status == 1) {
                    const data = res.data.data.filter(d => d.is_active == 1);
                    const select = res.data.data.map(d => ({ value: d.id, label: d.department }));
                    setDepartment(data);
                    setDepartmentDropdown(select);

                    res.data.data.forEach(row => {
                        temp.push({ value: row.id, label: row.department });
                    });
                    setDepartmentData(temp);
                }
            }
        })

        await new RoleService().getRole().then(res => {
            if (res.status == 200) {
                if (res.data.status == 1) {
                    const data = res.data.data.filter(d => d.is_active == 1);
                    const select = res.data.data.map(d => ({ value: d.id, label: d.role }));
                    setRole(data);
                    setRoleDropdown(select);
                }
            }
        })

        await new DesignationService().getDesignation().then(res => {
            if (res.status == 200) {
                if (res.data.status == 1) {
                    const data = res.data.data.filter(d => d.is_active == 1);
                    const select = res.data.data.map(d => ({ value: d.id, label: d.designation }));
                    setDesignation(data);
                    setDesignationDropdown(select);
                }
            }
        })

    }

    const [defaultDepartmentDropdown, setDefaultDepartmentDropdown] = useState();
    const handleDeparmentChange = (e) => {
        setDefaultDepartmentDropdown(e)
    }


    const handleAddRow = async () => {
        setNotify(null)
        let flag = 1;
        // let last=rows.length-1;

        // if(!rows[last].department_id ){
        //     flag=0;
        //     setNotify({ type: 'danger', message: "Complete Previous Record" })
        // }

        if (flag === 1) {
            await setRows([...rows, mappingData]);
        } else {
            setNotify({ type: 'danger', message: "Complete Previous Record" })
        }
    }

    const handleRemoveSpecificRow = (idx) => () => {
        if (idx > 0) {
            setRows(
                rows.filter((_, i) => i !== idx)
            );
        }
    }

    const handleCheckInput = (e, id, type) => {

        let temp_state = [...rows];
        let actualIndex = null;
        temp_state.forEach((ele, index) => {
            if (index == id) {
                actualIndex = index;
            }
        })
        let temp_element = { ...rows[actualIndex] };

        temp_state.forEach((d, i) => {
            // if (i != id) {
                temp_state[i].is_default = 0;
            // }
        })



        if (type == "DEPARTMENT") {
            temp_element.department_id = e.value;
        } else if (type == "TICKET_SHOW") {
            temp_element.ticket_show_type = e.value;
        } else if (type == "IS_DEFAULT") {
            temp_element.is_default = e.target.checked == true ? 1 : 0;
        }



        temp_state[actualIndex] = temp_element;
        // console.log(temp_state);
        // setRows([...rows,temp_state]);

        // temp.forEach((d,i) =>{
        //     if(i!=id){
        //         temp[i].is_default=0;
        //     }
        // })
        // setRows(null);      
        setRows(temp_state);
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Create User" />
            {notify && <Alert alertData={notify} />}
            <form onSubmit={handleForm} encType='multipart/form-data' method="post">
                <Tabs defaultActiveKey="All_Tickets" transition={false} id="noanim-tab-example1" className=" tab-body-header rounded d-inline-flex">
                    <Tab eventKey="All_Tickets" title="User Details">
                        <div className="row clearfix g-3">
                            <div className="col-sm-12">

                                <div className='card'>
                                    <div className='card-body'>
                                        {localStorage.getItem('account_for') == "SELF" &&
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">
                                                    <b>Account For :<Astrick color='red' /></b>
                                                </label>
                                                <div className="col-sm-4">
                                                    <select className="form-control form-control-sm"
                                                        id="account_for"
                                                        name="account_for"
                                                        value={accountFor}
                                                        readOnly={false}
                                                        onChange={e => setAccountFor(e.target.value)}
                                                    >
                                                        <option value="SELF">SELF</option>
                                                        <option value="CUSTOMER">CUSTOMER</option>
                                                    </select>
                                                </div>
                                            </div>
                                        }

                                        {accountFor && accountFor === "CUSTOMER" &&
                                            <div className="form-group row mt-3">
                                                <label className="col-sm-2 col-form-label">
                                                    <b>Select Customer:<Astrick color='red' /></b>
                                                </label>
                                                <div className="col-sm-4">
                                                    <CustomerDropdown
                                                        id="customer_id"
                                                        name="customer_id"
                                                        readOnly={true}
                                                    />
                                                </div>
                                            </div>
                                        }

                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Full Name :<Astrick color='red' /></b>
                                            </label>
                                            <div className="col-sm-3">
                                                <input type="text" className="form-control form-control-sm"
                                                    id="first_name"
                                                    name="first_name"
                                                    placeholder="First Name"
                                                    required

                                                    onKeyPress={e => { Validation.CharactersOnly(e) }}
                                                />
                                            </div>
                                            <div className="col-sm-3">
                                                <input type="text" className="form-control form-control-sm"
                                                    id="middle_name"
                                                    name="middle_name"
                                                    placeholder="Middle Name"

                                                    required
                                                    onKeyPress={e => { Validation.CharactersOnly(e) }}
                                                />
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm"
                                                    id="last_name"
                                                    name="last_name"
                                                    placeholder="Last Name"
                                                    required

                                                    onKeyPress={e => { Validation.CharactersOnly(e) }}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Email Address : <Astrick color='red' /></b>
                                            </label>
                                            <div className="col-sm-4">
                                                <input type="email" className="form-control form-control-sm"
                                                    id="email_id"
                                                    name="email_id"
                                                    required
                                                    placeholder="Email Address"

                                                    onKeyPress={e => { Validation.EmailOnly(e) }}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Contact Number : <Astrick color='red' /></b>
                                            </label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm"
                                                    id="contact_no"
                                                    name="contact_no"
                                                    placeholder="Contact Number"

                                                    required
                                                    minLength={10}
                                                    maxLength={10}
                                                    onKeyPress={e => { Validation.NumbersOnly(e) }}
                                                />
                                            </div>

                                            <label className="col-sm-2 col-form-label" style={{ 'textAlign': 'right' }} >
                                                <b>Whats App Number :</b>
                                            </label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm"
                                                    id="whats_app_contact_no"
                                                    name="whats_app_contact_no"
                                                    placeholder="Whats App Contact Number"

                                                    minLength={10}
                                                    maxLength={10}
                                                    onKeyPress={e => { Validation.NumbersOnly(e) }}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Username : <Astrick color='red' /></b>
                                            </label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control"
                                                    id="user_name"
                                                    name="user_name"
                                                    placeholder="Username"

                                                    onKeyPress={e => { Validation.CharactersNumbersOnly(e) }}
                                                    required
                                                />
                                            </div>

                                            <label className="col-sm-2 col-form-label" style={{ 'textAlign': 'right' }}>
                                                <b>Password : </b>
                                            </label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm"
                                                    id="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    minLength={6}
                                                    required
                                                />
                                            </div>
                                        </div>


                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Select Role : <Astrick color='red' /></b>
                                            </label>
                                            <div className="col-sm-4">
                                                {/* <RoleDropdown id="role_id" name="role_id" /> */}
                                                <Select
                                                    id="role_id"
                                                    name="role_id"
                                                    required={true}
                                                    options={roleDropdown}
                                                />
                                            </div>

                                            <label className="col-sm-2 col-form-label" style={{ 'textAlign': 'right' }}>
                                                <b>Select Designation : <Astrick color='red' /></b>
                                            </label>
                                            <div className="col-sm-4">
                                                {/* <DesignationDropdown id="designation_id" name="designation_id" /> */}
                                                <Select
                                                    id="designation_id"
                                                    name="designation_id"
                                                    required={true}
                                                    options={designationDropdown}
                                                />
                                            </div>
                                        </div>

                                    </div>  {/* CARD BODY */}
                                </div> {/* CARD */}

                                {/* ********* ADDRESS ********* */}
                                <div className='card mt-2'>
                                    <div className='card-header bg-primary text-white p-2'>
                                        <h5>Address Details</h5>
                                    </div>
                                    <div className='card-body'>

                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Address : </b>
                                            </label>
                                            <div className="col-sm-10">
                                                <textarea className="form-control form-control-sm"
                                                    id="address" name="address" />

                                            </div>
                                        </div>

                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Pincode :</b>
                                            </label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm"
                                                    id="pincode"
                                                    name="pincode"
                                                    minLength={6}
                                                    maxLength={6}
                                                    onKeyPress={e => { Validation.NumbersOnly(e) }}
                                                />
                                            </div>

                                            <label className="col-sm-2 col-form-label" style={{ 'textAlign': 'right' }}>
                                                <b>Country :</b>
                                            </label>
                                            <div className="col-sm-4">
                                                <CountryDropdown
                                                    id="country_id"
                                                    name="country_id"
                                                    onChange={handleDependent}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>State :</b>
                                            </label>
                                            <div className="col-sm-4">
                                                <StateDropdown
                                                    id="state_id"
                                                    name="state_id"
                                                    countryId={dependent.country_id}
                                                    onChange={handleDependent}
                                                />
                                            </div>

                                            <label className="col-sm-2 col-form-label" style={{ 'textAlign': 'right' }}>
                                                <b>City :</b>
                                            </label>

                                            <div className="col-sm-4">
                                                <CityDropdown
                                                    id="city_id"
                                                    name="city_id"
                                                    countryId={dependent.country_id}
                                                    stateId={dependent.state_id}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="Created_By_Me" title="Departments">
                        <div className='card'>
                            <div className='card-body'>

                                {departmentData && <div className="">
                                    <table
                                        className="table table-bordered table-responsive mt-5"
                                        id="tab_logic"
                                    >
                                        <thead>
                                            <tr>
                                                <th className="text-center" style={{ width: "100px" }}> # </th>
                                                <th className="text-center" style={{ width: "300px" }}> Department</th>
                                                <th className="text-center" style={{ width: "300px" }}> Ticket Type Show </th>
                                                <th className="text-center" style={{ width: "300px" }}> Make Default </th>
                                                <th className="text-center" style={{ width: "100px" }}> Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows && rows.map((item, idx) => (
                                                <tr>
                                                    <td className="text-center">{idx + 1}</td>
                                                    <td>
                                                        <Select options={departmentData}
                                                            id={`department_id_` + idx}
                                                            name='department_id[]'
                                                            onChange={e => handleCheckInput(e, idx, 'DEPARTMENT')}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Select
                                                            options={options}
                                                            id={`ticket_show_type_id_` + idx}
                                                            name='ticket_show_type[]'
                                                            onChange={e => handleCheckInput(e, idx, 'TICKET_SHOW')}
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <input type="checkbox"
                                                            id={`is_default_` + idx}
                                                            name={`is_default[${idx}]`}
                                                            onChange={e => handleCheckInput(e, idx, 'IS_DEFAULT')}
                                                            checked={rows[idx]['is_default'] == 1 ? true :false }
                                                            defaultValue={rows[idx]['is_default'] == 1 ? 1 : 0}
                                                        />
                                                        <br/>
                                                    </td>

                                                    <td>
                                                        {idx == 0 &&
                                                            <button type="button" className="btn btn-sm btn-outline-primary pull-left"
                                                                onClick={handleAddRow}
                                                            ><i className="icofont-plus-circle"></i></button>
                                                        }
                                                        {rows.length == idx + 1 && idx != 0 &&
                                                            <button type="button" className="btn btn-outline-danger btn-sm"
                                                                onClick={handleRemoveSpecificRow(idx)}
                                                            >
                                                                <i className="icofont-ui-delete"></i>
                                                            </button>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div>}

                            </div>
                        </div>

                    </Tab>
                </Tabs>

                <div className="mt-3" style={{ 'textAlign': 'right' }}>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                    <Link to={`/${_base}/User`} className="btn btn-danger text-white">
                        Cancel
                    </Link>
                </div>

            </form>
        </div>
    )
}

export default CreateUserComponentCopy
