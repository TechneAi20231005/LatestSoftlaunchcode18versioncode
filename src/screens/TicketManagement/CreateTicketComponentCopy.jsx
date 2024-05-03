import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Spinner, Modal } from 'react-bootstrap';
import Alert from '../../components/Common/Alert'
import { _base } from '../../settings/constants';
import ErrorLogService from "../../services/ErrorLogService";
import DynamicFormService from '../../services/MastersService/DynamicFormService';
import MyTicketService from "../../services/TicketService/MyTicketService";
import { _attachmentUrl } from "../../settings/constants";
import ReportService from "../../services/ReportService/ReportService";
import PageHeader from "../../components/Common/PageHeader";
import UserService from '../../services/MastersService/UserService';

import Select from 'react-select';
import { Astrick } from "../../components/Utilities/Style"
import * as Validation from "../../components/Utilities/Validation"


import { getCurrentDate } from "../../components/Utilities/Functions";
import { userSessionData as user } from "../../settings/constants";
import DepartmentService from '../../services/MastersService/DepartmentService'
import QueryTypeService from '../../services/MastersService/QueryTypeService'
import CustomerMappingService from '../../services/SettingService/CustomerMappingService';

import RenderDynamicForm from './TaskManagement/RenderDynamicForm';
import DepartmentMappingService from "../../services/MastersService/DepartmentMappingService";
export default function CreateTicketComponent() {
    const history = useNavigate();
    const [notify, setNotify] = useState(null);

    const ticketData = {
        query_type_id: null,
        ticket_date: null,
        expected_solve_date: null,
        cuid: null,
        ticket_type: null,
        priority: null,
        status: null,
        assign_to_department_id: null,
        assign_to_user_id: null,
        project_id: null,
        module_id: null,
        submodule_id: null
    }

    const [data, setData] = useState();

    const current = new Date();

    const todayDate = `${current.getFullYear()}-${(current.getMonth() + 1 < 10) ? "0" + current.getMonth() + 1 : current.getMonth() + 1}-${current.getDate()}`;

    const [showLoaderModal, setShowLoaderModal] = useState(false);

    const [defaults, setDefaults] = useState(null)

    const [department, setDepartment] = useState(null);
    const [rows, setRows] = useState();

    const [dynamicTicketData, setDynamicTicketData] = useState(null);

    const [queryType, setQueryType] = useState(null);
    const [customerMapping, setCustomerMapping] = useState(null);
    const [selectedCustomerMapping, setSelectedCustomerMapping] = useState(null);

    const [isFileGenerated, setIsFileGenerated] = useState(null);
    const [alldepartmentData, setAllDepartmentData] = useState();

    const [loading, isLoading] = useState(false);

    // const handleDependent = (e, name) => {
    //     setData({
    //         ...data,
    //         [name]: e.value
    //     });
    // }

    const handleForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        var flag = 1
        var a = JSON.stringify(Object.fromEntries(formData))
        var selectCountry = formData.getAll('customer_id')
        if (selectCountry == '') {
            flag = 0
            //setNotify(null);
            //   alert('Please Select Customer')
            //setNotify({ type: 'danger', message: 'Please Select Country' })
        }
        setNotify(null);
        await new MyTicketService().postTicket(formData).then(res => {
            if (res.status === 200) {
                if (res.data.status === 1) {
                    history({
                        pathname: `/${_base}/Ticket`,

                    }, { state: { alert: { type: "success", message: res.data.message } } }
                    );
                } else {
                    var URL = `${_attachmentUrl}` + res.data.data
                    window.open(URL, '_blank').focus();
                    // setNotify({ type: 'danger', message: res.data.message });
                    history({
                        pathname: `/${_base}/Ticket`,
                    }, { state: { alert: { type: "success", message: res.data.message } } }
                    );
                }
            } else {
                setNotify({ type: 'danger', message: res.message });
                new ErrorLogService().sendErrorLog("Ticket", "Create_Ticket", "INSERT", res.message);
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            setNotify({ type: 'danger', message: "Request Error !!!" });
            new ErrorLogService().sendErrorLog("Ticket", "Create_Ticket", "INSERT", errorObject.data.message);
        });
    }

    const handleGetQueryTypeForm = async (e) => {
        var data = customerMapping.filter((val) => val.query_type_id == e.target.value);
        setRows(null);
        if (data && data.length == 0) {
            alert("Dynamic Form is not mapped against this Query Type, Please Map Form first")
            e.preventDefault();
        }
        setRows(data[0].dynamic_form);
        setIsFileGenerated(null);
        setSelectedCustomerMapping(null);
        setSelectedCustomerMapping(data[0]);
    }

    const dynamicChangeHandle = (e) => {
        const { name, value } = e.target;
        setDynamicTicketData((prev) => ({ ...prev, [name]: value }));
    }

    const getCustomerMappingSettings = async (query_type_id = null) => {
        await new CustomerMappingService().getCustomerMappingSettings(query_type_id).then(res => {
            const queryType = [];
            const department = [];

            if (res.data.status === 1) {
                if (res.data.data) {

                    const queryTypeTemp = [];
                    setCustomerMapping(null);
                    setCustomerMapping(res.data.data);
                    res.data.data.forEach(query => {
                        if (query.query_type_id) {
                            queryTypeTemp.push(query.query_type_id);
                        }
                    })
                    //New Array Check Logic
                    // var data = customerMapping.filter((val) => val.eryTypeTempincludes('value1'));
                    new QueryTypeService().getQueryType().then(resp => {
                        if (resp.data.status === 1) {
                            resp.data.data.filter(d => d.is_active == 1).forEach(q => {
                                queryType.push({ 'id': q.id, 'query_type_name': q.query_type_name });
                                // if (queryTypeTemp.includes(q.id)) {
                                //     queryType.push({ 'id': q.id, 'query_type_name': q.query_type_name });
                                // }
                            })
                            setQueryType(queryType)
                        }
                    });

                    new DepartmentService().getDepartment().then((res) => {
                        if (res.status === 200) {
                            if (res.data.status == 1) {
                                const temp = res.data.data
                                setAllDepartmentData(temp.filter(d => d.id).map(d => ({ value: d.id, label: d.department })))
                            }
                        }
                    })

                    const departmentTemp = [];
                    new DepartmentMappingService().getDepartmentMappingByEmployeeId(user.userId).then(respo => {
                        if (respo.data.status === 1) {
                            // setDepartment(respo.data.data.map(d=>({value:d.department_id,label:d.department})));      
                            setDepartment(respo.data.data.map(d => ({ value: d.department_id, label: d.department })));
                        }
                    });
                }
            }

        });
    }


    const [tempDepartment, setTempDepartment] = useState();

    const handleDepartmentChange = (e) => {
        setTempDepartment(null);
        setTempDepartment(e.value);
    }


    const [ticketUploadType, setTicketUploadType] = useState("REGULAR");
    const handleTicketUploadType = (type) => {
        // const a = departmentRef.current.props.value.map((d,i)=>{
        //     setTempDepartment(d.value)
        // })
        if (selectedCustomerMapping && tempDepartment) {
            setTicketUploadType(type);
        } else {
            alert("Select Department and Query Type");

            setTicketUploadType(prev => prev);
        }
    }
    const departmentRef = useRef()


    const handleDownloadFormat = async (e) => {
        setNotify(null);
        if (tempDepartment && selectedCustomerMapping) {
            const formData = new FormData();
            formData.append('customer_mapping_id', selectedCustomerMapping.id);
            await new MyTicketService().getBulkFormat(formData).then(res => {
                if (res.status === 200) {
                    if (res.data.status === 1) {
                        URL = `${_attachmentUrl}` + res.data.data
                        window.open(URL, '_blank').focus();

                        setIsFileGenerated(res.data.data);
                    } else {
                        setNotify({ type: 'danger', message: res.data.message });
                    }
                } else {
                    setNotify({ type: 'danger', message: res.message });
                }
            })
        } else {
            setNotify({ type: 'danger', message: "Select Department & Query Type !!!" });
        }
    }

    useEffect(() => {
        getCustomerMappingSettings();
    }, [])

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Create Ticket" />

            {notify && <Alert alertData={notify} />}

            <form onSubmit={handleForm} method="post" encType='multipart/form-data'>

                <input type="hidden" className="form-control form-control-sm" id="customer_mapping_id" name="customer_mapping_id" value={selectedCustomerMapping && selectedCustomerMapping.id} />


                <div className='card mt-2'>
                    <div className='card-body'>
                        <div className="form-group row ">
                            {/* {alldepartmentData && JSON.stringify(alldepartmentData)} */}
                            <div className="col-sm-3">
                                <label className="col-form-label">
                                    <b>Your Department<Astrick color="red" /> : </b>
                                </label>
                                {department &&
                                    <Select
                                        // defaultValue={department.length == 1 && department}
                                        // defaultValue={alldepartmentData && department.filter(d=> d.id === alldepartmentData.value)}
                                        options={department}
                                        name="from_department_id"
                                        id="from_department_id"
                                        required={true}
                                        ref={departmentRef}
                                        onChange={handleDepartmentChange}
                                    />
                                }
                            </div>
                            {/* {department && JSON.stringify(department)} */}
                            <div className="col-sm-3">
                                <label className="col-form-label">
                                    <b>Ticket Uploading<Astrick color="red" /> : </b>
                                </label>
                                <div class="form-group mt-2">
                                    <label class="fancy-checkbox parsley-error" />
                                    <input type="radio"
                                        key={Math.random()}
                                        required=""
                                        id="ticket_uploading_regular"
                                        name="ticket_uploading"
                                        value="REGULAR"
                                        checked={ticketUploadType === "REGULAR"}
                                        onChange={e => handleTicketUploadType("REGULAR")}
                                    />
                                    <span class="px-2">Regular</span>
                                    <label class="fancy-checkbox parsley-error" />
                                    <input type="radio"
                                        key={Math.random()}
                                        required=""
                                        id="ticket_uploading_bulk_uploading"
                                        name="ticket_uploading"
                                        value="BULK_UPLOADING"
                                        checked={ticketUploadType === "BULK_UPLOADING"}
                                        onChange={e => handleTicketUploadType("BULK_UPLOADING")}
                                    />
                                    <span class="px-2">Bulk Uploading</span>
                                </div>
                            </div>


                            {ticketUploadType === "BULK_UPLOADING" &&
                                <div className="col-sm-3">
                                    <button type="button" className="btn btn-danger mt-4 text-white"
                                        onClick={handleDownloadFormat}
                                    >Generate Bulk Format</button>
                                </div>
                            }

                            {/* {ticketUploadType === "BULK_UPLOADING" && isFileGenerated &&
                                <div className="col-sm-3">
                                    <a href={`${_attachmentUrl}/${isFileGenerated}`}
                                        className="btn btn-success mt-4 text-white"
                                    >Download File</a>
                                </div>
                            } */}
                        </div>


                        <div className="form-group row mt-3">
                            {/* <div className="col-sm-3">
                                <label className="col-form-label">
                                    <b>Query Group<Astrick color="red" /> :</b>
                                </label>
                                <select className="form-control form-control-1sm" name="query_group" id="query_group" required
                                    onChange={e => handleGetQueryTypeForm(e)}
                                >
                                    <option value="">Select Query Type</option>
                                    {queryType && queryType.map(q => {
                                        return <option value={q.id}>{q.query_type_name}</option>;
                                    })}
                                </select>
                            </div> */}

                            <div className="col-sm-3">
                                <label className="col-form-label">
                                    <b>Query Type<Astrick color="red" /> :</b>
                                </label>
                                <select className="form-control form-control-1sm" name="query_type_id" id="query_type_id" required
                                    onChange={e => handleGetQueryTypeForm(e)}
                                >
                                    <option value="">Select Query Type</option>
                                    {queryType && queryType.map(q => {
                                        return <option value={q.id}>{q.query_type_name}</option>;
                                    })}
                                </select>
                            </div>

                            {ticketUploadType === "REGULAR" && selectedCustomerMapping &&
                                <div className="col-sm-3">
                                    <label className="col-form-label">
                                        <b>Confirmation Required :</b>
                                    </label>
                                    <div class="form-group mt-2">
                                        <label class="fancy-checkbox parsley-error" />
                                        <input type="radio" required=""
                                            key={Math.random()}
                                            id="confirmation_required_yes" name="confirmation_required"
                                            defaultValue="1"
                                        // defaultChecked={selectedCustomerMapping.confirmation_required==1}
                                        />
                                        <span class="px-2">YES</span>

                                        <label class="fancy-checkbox parsley-error" />
                                        <input type="radio" required="" key={Math.random()}
                                            id="confirmation_required_no"
                                            name="confirmation_required"
                                            defaultValue="0"
                                            // defaultChecked={selectedCustomerMapping.confirmation_required==0}
                                            defaultChecked="true"
                                        />
                                        <span class="px-2">NO</span>
                                    </div>                            </div>
                            }

                            {ticketUploadType === "REGULAR" && selectedCustomerMapping &&
                                <div className="col-sm-3">
                                    <label className="col-form-label">
                                        <b>Ref Id :</b>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="cuid"
                                        name="cuid"
                                    />
                                </div>
                            }

                            {ticketUploadType === "REGULAR" && selectedCustomerMapping &&
                                <div className="col-sm-3">
                                    <label className="col-form-label">
                                        <b>Priority : <Astrick color="red" size="13px" /></b>
                                    </label>
                                    <select className="form-control form-control-sm" id="priority" name="priority" required={true}
                                        defaultValue={selectedCustomerMapping.priority}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Very High">Very High</option>
                                    </select>
                                </div>
                            }

                        </div>
                    </div>
                </div>

                {ticketUploadType === "BULK_UPLOADING" &&
                    <div className='card mt-2'>
                        <div className='card-body'>
                            <div className="row">
                                <label className="col-form-label">
                                    <b>Upload File<Astrick color="red" /> :</b>
                                </label>
                                <input
                                    type="file"
                                    className="form-control form-control-sm"
                                    id="bulk_upload_file"
                                    name="bulk_upload_file"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                }


                {ticketUploadType === "REGULAR" && rows && rows.length >= 1 &&
                    <div className='card mt-2'>
                        <div className='card-body'>
                            <div className="row">
                                {rows.map((data, index) => {
                                    return <RenderDynamicForm data={data} key={index} dynamicChangeHandle={dynamicChangeHandle} />
                                })
                                }
                            </div>
                        </div>
                    </div>
                }

                {ticketUploadType === "REGULAR" && selectedCustomerMapping &&
                    <div className='card mt-2'>
                        <div className='card-body'>
                            <div className="form-group row">
                                <div className="col-sm-12 mt-3">
                                    <label className=" col-form-label">
                                        <b>Description : <Astrick color="red" size="13px" /></b>
                                    </label>
                                    <textarea className="form-control form-control-sm"
                                        id="description"
                                        name="description"
                                        required
                                        rows="4"
                                    />
                                </div>
                            </div>
                        </div> {/* CARD */}
                    </div>
                }


                {ticketUploadType === "REGULAR" && selectedCustomerMapping &&
                    <div className='card mt-2'>
                        <div className='card-body'>
                            <div className="form-group row">
                                <div className="col-sm-12 mt-3">
                                    <label className=" col-form-label">
                                        <b>Upload Attachment :</b>
                                    </label>
                                    <input type="file" className="form-control form-control-sm"
                                        id="attachment"
                                        name="attachment[]"
                                        multiple
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {selectedCustomerMapping &&
                    <div className="mt-3" style={{ textAlign: 'right' }}>
                        <button type="submit" className='btn btn-sm btn-primary'>
                            Submit
                        </button>
                        <Link to={`/${_base}/Ticket`} className="btn btn-danger btn-sm text-white">
                            Cancel
                        </Link>
                    </div>
                }


            </form>



            <Modal show={showLoaderModal} centered >
                <Modal.Body className="text-center">
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="secondary" />
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="info" />
                    <Spinner animation="grow" variant="dark" />
                </Modal.Body>
            </Modal>

        </div>
    )
}

