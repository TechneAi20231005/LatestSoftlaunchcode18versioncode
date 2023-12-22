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

function EditUserComponentcopy({ match }) {
    const history = useNavigate();
    const [notify, setNotify] = useState(null);
    const userId = match.params.id ? match.params.id : null;

    const [data, setData] = useState(null);
    const [accountFor, setAccountFor] = useState("SELF");

    const [department, setDepartment] = useState(null);
    const [userDepartment, setUserDepartment] = useState(null);
    const [departmentDropdown, setDepartmentDropdown] = useState(null);
    const [defaultDepartmentDropdown, setDefaultDepartmentDropdown] = useState();
    const [defaultDepartment, setDefaultDepartment] = useState();

    const [role, setRole] = useState(null);
    const [roleDropdown, setRoleDropdown] = useState(null);

    const [dataa, setDataa] = useState({ employee_id: null, departments: null });
    const [departmentData, setDepartmentData] = useState();
    const options = [{ 'value': "MY_TICKETS", 'label': "My Tickets" }, { 'value': "DEPARTMENT_TICKETS", 'label': "Department Tickets" }]
    const mappingData = { department_id: null, ticket_show_type: null, is_default: 0 };
    const [rows, setRows] = useState([mappingData]);

    const [designation, setDesignation] = useState(null);
    const [designationDropdown, setDesignationDropdown] = useState(null);
    const handleDependent = (e, name) => {
        setData({
            ...data,
            [name]: e.value
        });
    }

    const handleChangeAccountFor = (e) => {
        setAccountFor(e.target.value);
    }

    const handleForm = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        await new UserService().updateUser(userId, form).then(res => {
            // if (res.status === 200) {   
            //     if (res.data.status === 1) {
            //         history.push({
            //             pathname: `/${_base}/User`,
            //             state: { alert: { type: 'success', message: res.data.message } }
            //         });
            //     } else {
            //         setNotify({ type: 'danger', message: res.data.message });
            //     }
            // } else {
            //     setNotify({ type: 'danger', message: res.message });
            //     new ErrorLogService().sendErrorLog("Customer", "Create_Customer", "INSERT", res.message);
            // }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog("Status", "Create_Status", "INSERT", errorObject.data.message);
        })
    }
    const loadData = async () => {

        // 


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
        const data = [];
        await new UserService().getUserById(userId).then(res => {
            if (res.status === 200) {
                if (res.data.status == 1) {
                    const temp = res.data.data
                    const tempDept = temp.department.map(d => ({ value: d.department_id, label: d.department_name }));
                    setDefaultDepartmentDropdown(tempDept);

                    const tempUserDept = temp.department.map(d => ({ value: d.department_id, label: d.department_name }));
                    setUserDepartment(tempUserDept);

                    const tempDefaultDept = temp.department.filter(d => d.is_default == 1).map(d => ({ value: d.department_id, label: d.department_name }));
                    setDefaultDepartment(tempDefaultDept);

                    setData(null);
                    setData(temp);

                } else {

                }
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog("Status", "Get_Status", "INSERT", errorObject.data.message);
        })

        await new DepartmentMappingService().getDepartmentMappingByEmployeeId(userId).then(res => {
            if (res.status === 200) {
                if (res.data.status === 1) {
                    const temp = [];
                    res.data.data.forEach(d => {
                        temp.push({ department_id: d.department_id, ticket_show_type: d.ticket_show_type, is_default: d.is_default });
                    })
                    setRows(null);
                    setRows(temp);
                } else {
                    setRows([mappingData]);
                }
            } else {
                setRows([mappingData]);
            }
        });
        setDataa(prev => ({ ...prev, employee_id: userId }));
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

    const handleDeparmentChange = (e) => {
        setDefaultDepartmentDropdown(e)
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Edit User" />
            {notify && <Alert alertData={notify} />}


            <form onSubmit={handleForm} encType='multipart/form-data' method="post">
                <Tabs defaultActiveKey="All_Tickets" transition={false} id="noanim-tab-example1" className=" tab-body-header rounded d-inline-flex">
                    <Tab eventKey="All_Tickets" title="User Details">

                        {data && <div className="row clearfix g-3">
                            <div className="col-sm-12">

                                <div className='card'>
                                    {/* <div className='card-header bg-primary text-white p-2'>
                                <h5>User Details</h5>
                            </div> */}
                                    <div className='card-body'>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Account For :<Astrick color='red' /></b>
                                            </label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm"
                                                    id="account_for"
                                                    name="account_for"
                                                    value={accountFor}
                                                    readOnly={true}
                                                >
                                                    <option value="SELF">SELF</option>
                                                    <option value="CUSTOMER">CUSTOMER</option>
                                                </select>
                                            </div>
                                        </div>

                                        {accountFor && accountFor === "CUSTOMER" &&
                                            <div className="form-group row mt-3">
                                                <label className="col-sm-2 col-form-label">
                                                    <b>Select Customer:<Astrick color='red' /></b>
                                                </label>
                                                <div className="col-sm-4">
                                                    <CustomerDropdown
                                                        id="customer_id"
                                                        name="customer_id"
                                                        defaultValue={data.customer_id}
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
                                                    defaultValue={data.first_name}
                                                    onKeyPress={e => { Validation.CharactersOnly(e) }}
                                                />
                                            </div>
                                            <div className="col-sm-3">
                                                <input type="text" className="form-control form-control-sm"
                                                    id="middle_name"
                                                    name="middle_name"
                                                    placeholder="Middle Name"
                                                    defaultValue={data.middle_name}
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
                                                    defaultValue={data.last_name}
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
                                                    defaultValue={data.email_id}
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
                                                    defaultValue={data.contact_no}
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
                                                    defaultValue={data.whats_app_contact_no}
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
                                                    defaultValue={data.user_name}
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
                                                />
                                            </div>
                                        </div>


                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Select Role : <Astrick color='red' /></b>
                                            </label>
                                            <div className="col-sm-4">
                                                {roleDropdown &&
                                                    <Select
                                                        id="role_id"
                                                        name="role_id"
                                                        options={roleDropdown}
                                                        defaultValue={data && roleDropdown && roleDropdown.filter(d => d.value == data.role_id)}
                                                    />
                                                }

                                            </div>

                                            <label className="col-sm-2 col-form-label" style={{ 'textAlign': 'right' }}>
                                                <b>Select Designation : <Astrick color='red' /></b>
                                            </label>
                                            {designationDropdown &&
                                                <div className="col-sm-4">
                                                    <Select
                                                        id="designation_id"
                                                        name="designation_id"
                                                        options={designationDropdown}
                                                        defaultValue={data && designationDropdown && designationDropdown.filter(d => d.value == data.designation_id)}
                                                    />
                                                </div>
                                            }
                                        </div>


                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Status : <Astrick color='red' /></b>
                                            </label>
                                            <div className="col-sm-10">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="is_active" id="is_active_1"
                                                                value="1"
                                                                defaultChecked={data && data.is_active === 1 ? true : false}
                                                            />
                                                            <label className="form-check-label" htmlFor="is_active_1">
                                                                Active
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="is_active" id="is_active_0" value="0"
                                                                defaultChecked={data && data.is_active === 0 ? true : false}
                                                            />
                                                            <label className="form-check-label" htmlFor="is_active_0">
                                                                Deactive
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
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
                                                    id="address" name="address"
                                                    defaultValue={data.address} />
                                            </div>
                                        </div>

                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>Pincode : </b>
                                            </label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm"
                                                    id="pincode"
                                                    name="pincode"
                                                    defaultValue={data.pincode}
                                                    minLength={6}
                                                    maxLength={6}
                                                    onKeyPress={e => { Validation.NumbersOnly(e) }}
                                                />
                                            </div>

                                            <label className="col-sm-2 col-form-label" style={{ 'textAlign': 'right' }}>
                                                <b>Country : </b>
                                            </label>
                                            <div className="col-sm-4">
                                                <CountryDropdown
                                                    id="country_id"
                                                    name="country_id"
                                                    defaultValue={data.country_id}
                                                    onChange={handleDependent}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row mt-3">
                                            <label className="col-sm-2 col-form-label">
                                                <b>State : </b>
                                            </label>
                                            <div className="col-sm-4">
                                                <StateDropdown
                                                    id="state_id"
                                                    name="state_id"
                                                    countryId={data.country_id}
                                                    defaultValue={data.state_id}
                                                    onChange={handleDependent}
                                                />
                                            </div>

                                            <label className="col-sm-2 col-form-label" style={{ 'textAlign': 'right' }}>
                                                <b>City : </b>
                                            </label>

                                            <div className="col-sm-4">
                                                <CityDropdown
                                                    id="city_id"
                                                    name="city_id"
                                                    countryId={data.country_id}
                                                    stateId={data.state_id}
                                                    defaultValue={data.city_id}
                                                    onChange={handleDependent}
                                                />
                                            </div>
                                        </div>

                                    </div>{/* CARD BODY*/}
                                </div>{/* CARD */}
                            </div>
                        </div>}
                    </Tab>
                    <Tab eventKey="Created_By_Me" title="Departments">
                        <div className='card'>
                            <div className='card-body'>

                                {dataa && dataa.employee_id && <div className="">
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
                                                            // onChange={e=>departmentHandler(idx,e)}
                                                            defaultValue={item && item.department_id && departmentData.filter(d => d.value == item.department_id)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Select
                                                            options={options}
                                                            id={`ticket_show_type_id_` + idx}
                                                            name='ticket_show_type[]'
                                                            // onChange={e=>ticketShowHandler(idx,e)}   
                                                            defaultValue={item && item.ticket_show_type && options.filter(d => d.value == item.ticket_show_type)}
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <input type="radio"
                                                            id={`is_default_` + idx}
                                                            name="is_default[]"
                                                            value="1"
                                                            defaultChecked={item && item.is_default == 1 ? true : false}
                                                        />
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
                        Update
                    </button>
                    <Link to={`/${_base}/User`}
                        className="btn btn-danger text-white">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default EditUserComponentcopy
