import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Dropdown, Button, ButtonGroup } from "react-bootstrap"
import { userSessionData, _base } from "../../settings/constants";
import Alert from "../../components/Common/Alert";
import ErrorLogService from "../../services/ErrorLogService";

import MyTicketService from "../../services/TicketService/MyTicketService"
import UserService from '../../services/MastersService/UserService'
import DepartmentService from '../../services/MastersService/DepartmentService'
import StatusService from '../../services/MastersService/StatusService'
import ReportService from "../../services/ReportService/ReportService";
import PageHeader from "../../components/Common/PageHeader";
import Select from 'react-select';
import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
import DepartmentMappingService from "../../services/MastersService/DepartmentMappingService";
import *  as Validation from '../../components/Utilities/Validation';

export default function MyTicketComponent( ) {
    const location = useLocation()

    const [notify, setNotify] = useState(null);
    const [data, setData] = useState(null);

    const [statusData,setStatusData] = useState(null);
    const [userData,setUserData] = useState(null);
    const [departmentData,setDepartmentData] = useState(null);

    const [searchResult,setSearchResult]= useState();
    const [searchResultExport,setSearchResultExport]= useState();

    const [allTicketsData, setAllTicketsData] = useState(null);
    const [allTicketsDataExport, setAllTicketsDataExport] = useState(null);

    const [unpassedTicketsData, setUnpassedTicketsData] = useState(null);
    const [unpassedTicketsDataExport, setUnpassedTicketsDataExport] = useState(null);

    const [userDepartment, setUserDepartment] = useState();

    const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });
    const [remarkModal, setRemarkModal] = useState({ showModal: false, modalData: "", modalHeader: "" });

    const handleModal = (data) => {
        setModal(data);
    }


    const handleRemarkModal = (data) => {
        setRemarkModal(data);
    }

    var allTicketsSr=1;
    var unpassedTicketsSr=1;

    const allTicketsColumns = [
        {
            name: 'Action', button: true, ignoreRowClick: true, allowOverflow: false,
            width:`${allTicketsData ? (allTicketsData.length > 3 ? 'auto' : '250px') : 'auto'}`,
            cell: row => 
                <Dropdown className="d-inline-flex m-1">
                    <Dropdown.Toggle as="button" variant="" id={`${"dropdown-basic_" + row.id}`} className="btn btn-primary text-white">
                        <i className="icofont-listine-dots"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="border-0 shadow p-1">
            
                        <li>
                            <Link to={`/${_base}/Ticket/View/` + row.id} className="btn btn-sm btn-info text-white" style={{ width: "100%" ,zIndex:100}}>
                            <i className="icofont-external-link "></i> View</Link>
                        </li>

                        {/* {(row.created_by == localStorage.getItem('id') || row.assign_to_user_id == localStorage.getItem('id')) &&
                            <li><Link to={`/${_base}/Ticket/Edit/` + row.id} className="btn btn-sm btn-warning text-white" 
                                style={{ width: "100%",zIndex:100}}>
                                <i className="icofont-ui-edit"></i>  Edit</Link>
                            </li>
                        }                     */}
                        
                        {   (row.created_by == localStorage.getItem('id') && row.passed_status != "PASS") ||
                            (row.assign_to_user_id==localStorage.getItem('id') && row.passed_status == "PASS") &&
                            <li>
                                <Link to={`/${_base}/Ticket/Edit/` + row.id} className="btn btn-sm btn-warning text-white"
                                    style={{ width: "100%", zIndex: 100 }}>
                                    <i className="icofont-ui-edit"></i>  Edit
                                </Link>
                            </li>
                            
                        }
                        <li>
                            <Link to = {`/${_base}/getTicketHistory/`+ row.id} className="btn btn-sm btn-warning text-white">
                            <i className="icofont-ui-history"></i>   History
                            </Link>
                        </li>

                        {row.assign_to_user_id == localStorage.getItem('id')  && row.basket_configured == 0 &&
                            <li>
                                <Link to={`/${_base}/Ticket/Basket/` + row.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%",zIndex:100 }}>
                                <i className="icofont-bucket2"></i>Basket</Link>
                            </li>
                        }    
                
                        {row.created_by != localStorage.getItem('id') && row.basket_configured > 0 &&
                            <li><Link to={`/${_base}/Ticket/Task/` + row.id} className="btn btn-sm btn-outline-primary" style={{ width: "100%",zIndex:100 }}>
                                <i className="icofont-tasks"></i> Task</Link></li>
                        }

                    </Dropdown.Menu>
                </Dropdown>
        },
        { name: 'Sr',  width: "70px",cell:row => allTicketsSr++},
        { name: 'Ticket Id', cell: row => <Link to={`/${_base}/Ticket/View/` + row.id} ><span className='fw-bold text-secondary'>{row.ticket_id}</span></Link>, sortable: true, },
        {
            name: "Description", width: "400px", selector: (row) => { }, sortable: false,
            cell: (row) =>
                <div className="btn-group" role="group" aria-label="Basic outlined example">
                    <a href="#"
                        onClick={(e) => {
                            handleModal({ showModal: true, modalData: row, modalHeader: 'Description' })
                        }}
                    >
                        {row.description}
                    </a>
                </div>
        },
        { name: 'Ticket Date', selector: row => row.ticket_date, sortable: true, width: "120px" },
        { name: 'Expected Solve Date', selector: row => row.expected_solve_date, sortable: true },
        {
            name: 'Priority', cell: row =>
                <div>
                    {row.priority === "Very High" && <span className="badge bg-danger">{row.priority}</span>}
                    {row.priority === "High" && <span className="badge bg-warning">{row.priority}</span>}
                    {row.priority === "Medium" && <span className="badge bg-info">{row.priority}</span>}
                    {row.priority === "Low" && <span className="badge bg-success">{row.priority}</span>}
                </div>
            ,
            sortable: true,
        },
        { name: 'Status', cell: row => row.status_name, sortable: true, },
        { name: 'Assign To Dept', cell: row => row.assign_to_department, sortable: true, },
        { name: 'Assinged To', cell: row => row.assign_to_user, sortable: true, },
        { name: 'From Department', cell: row => row.from_department_name, sortable: true, },
        { name: 'Created By', cell: row => row.created_by_name, sortable: true, },
    ];


     const unpassedColumns = [
        {
            name: 'Action', button: true, ignoreRowClick: true, allowOverflow: false,
            width:`${unpassedTicketsData ? (unpassedTicketsData.length > 3 ? 'auto' : '250px') : 'auto'}`,
            cell: row =>
                        <Dropdown className="d-inline-flex m-1">
                            <Dropdown.Toggle as="button" variant="" id={`${"dropdown-basic_" + row.id}`} className="btn btn-primary text-white">
                                <i className="icofont-listine-dots"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as="ul" className="border-0 shadow p-1">


                                <li>
                                    <Link to={`/${_base}/Ticket/View/` + row.id} className="btn btn-sm btn-info text-white" style={{ width: "100%", zIndex: 100 }}>
                                    <i className="icofont-external-link "></i> View</Link> 
                                </li>

                                {row.created_by == localStorage.getItem('id') &&
                                    <li>
                                        <Link to={`/${_base}/Ticket/Edit/` + row.id} className="btn btn-sm btn-warning text-white"
                                            style={{ width: "100%", zIndex: 100 }}>
                                            <i className="icofont-ui-edit"></i>  Edit
                                        </Link>
                                    </li>
                                }

                                <li>
                                    <button className="btn btn-success text-white" style={{ width: "100%", zIndex: 100 }}
                                        onClick={(e) => {
                                            handleRemarkModal({ showModal: true, modalData: row, modalHeader: 'Enter Remark',status:"PASS", })
                                        }}
                                    >
                                        <i className="icofont-checked"></i> Pass
                                    </button>
                                </li>

                                <li>
                                    <button className="btn btn-danger  text-white" style={{ width: "100%", zIndex: 100 }}
                                        onClick={(e) => {
                                            handleRemarkModal({ showModal: true, modalData: row, modalHeader: 'Enter Remark',status:"REJECT" })
                                        }}
                                    >
                                        <i className="icofont-close-squared-alt"></i> Reject
                                    </button>
                                </li>
                            </Dropdown.Menu>
                        </Dropdown>
        },
        { name: 'Sr',  width: "70px",cell: row => unpassedTicketsSr++   },
        { name: 'Ticket Id', cell: row => <Link to={`/${_base}/Ticket/View/` + row.id} ><span className='fw-bold text-secondary'>{row.ticket_id}</span></Link>, sortable: true, },
        {
            name: "Description", width: "400px", selector: (row) => { }, sortable: false,
            cell: (row) =>
                <div className="btn-group" role="group" aria-label="Basic outlined example">
                    <a href="#"
                        onClick={(e) => {
                            handleModal({ showModal: true, modalData: row, modalHeader: 'Edit Country' })
                        }}
                    >
                        {row.description}
                    </a>
                </div>
        },
        { name: 'Ticket Date', selector: row => row.ticket_date, sortable: true, width: "120px" },
        {
            name: 'Priority', cell: row =>
                <div>
                    {row.priority === "Very High" && <span className="badge bg-danger">{row.priority}</span>}
                    {row.priority === "High" && <span className="badge bg-warning">{row.priority}</span>}
                    {row.priority === "Medium" && <span className="badge bg-info">{row.priority}</span>}
                    {row.priority === "Low" && <span className="badge bg-success">{row.priority}</span>}
                </div>
            ,
            sortable: true,
        },
        { name: 'Assign To Dept', cell: row => row.assign_to_department, sortable: true, },
        { name: 'Assinged To', cell: row => row.assign_to_user, sortable: true, },
        { name: 'From Department', cell: row => row.from_department_name, sortable: true, },
        { name: 'Created By', cell: row => row.created_by_name, sortable: true, },
    ];


    const loadData = async () => {

        await new UserService().getUser().then(res=>{
            if(res.status===200){
                const tempData=[];
                const temp=res.data.data
           
                for (const key in temp) {
                    tempData.push({
                        value: temp[key].id,
                        label: temp[key].first_name + " " + temp[key].last_name+" ("+ data[key].id +")" 
                    })
                }
                setUserData(null);
                setUserData(tempData);
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response; 
            new ErrorLogService().sendErrorLog("Status","Get_Status","INSERT",errorObject.data.message);
         })

         await new DepartmentService().getDepartment().then(res=>{
            if(res.status===200){
                const tempData=[];
                const temp=res.data.data
                
                for (const key in temp) {
                    if(temp[key].is_active==1){
                        tempData.push({
                            value: temp[key].id,
                            label: temp[key].department,
                        })
                    }
                }
                setDepartmentData(null);
                setDepartmentData(tempData);
            }
        })  

        await new StatusService().getStatus().then(res=>{
            if(res.status===200){
                const tempData=[];
                const temp=res.data.data
                
                for (const key in temp) {
                    if(temp[key].is_active==1){
                        tempData.push({
                            value: temp[key].id,
                            label: temp[key].status,
                        })
                    }
                }
                setStatusData(null);
                setStatusData(tempData);
            }
        })


        await new DepartmentMappingService().getDepartmentMappingByEmployeeId(localStorage.getItem('id')).then((res) => {
            if (res.status === 200) {
                if (res.data.status == 1) {

                    if (res.status === 200) {
                        if (res.data.status == 1) {
                            setUserDepartment(res.data.data);
                        }
                    }
                }
            }
        })

        const form=new FormData();
        form.append('user_id', userSessionData.userId);
        form.append('tenant_id', userSessionData.tenantId);
        await new MyTicketService().getAllTicketNew(form).then(res => {
            if (res.status === 200) {
                setAllTicketsData(res.data.data.allTickets);
                const allTicketsDataExportTemp=makeExportData(res.data.data.allTickets);
                setAllTicketsDataExport(allTicketsDataExportTemp)    


                setUnpassedTicketsData(res.data.data.unpassedTickets);
                const unpassedTicketsDataexportTemp=makeExportData(res.data.data.unpassedTickets);
                setUnpassedTicketsDataExport(unpassedTicketsDataexportTemp);
            }
        });
    }

    const makeExportData = (data)=>{
        const tempData=[];
        var counter=1;
        for(const key in data){
            tempData.push({
                sr:counter++,
                ticket_id: data[key].ticket_id,
                cuid: data[key].cuid,
                confirmation_required:data[key].confirmation_required == 1 ? "YES" : "NO",
                ticket_date: data[key].ticket_date,
                expected_solve_date: data[key].expected_solve_date,
                from_department: data[key].from_department_name,
                assign_to_department: data[key].assign_to_department,
                assign_to_user: data[key].assign_to_user,
                priority: data[key].priority,
                status: data[key].status_name,
                description: data[key].description,
                created_by: data[key].created_by_name,
                pass_status:data[key].passed_status,
                pass_status_change_by:data[key].passed_status_change_by_name,
                pass_at:data[key].passed_status_changed_at,
                pass_remark:data[key].passed_remark
            })
        }
        return tempData;
    }

    const handlePassTicketForm = async (e) => {
        setNotify(null);
        e.preventDefault();
        const formData = new FormData(e.target);
        await new MyTicketService().passTicket(formData).then(res => {
            if (res.status === 200) {
                if (res.data.status == 1) {
                    setRemarkModal({ showModal: false, modalData: "", modalHeader: "" });
                    loadData();
                    setNotify({ type: 'success', message: res.data.message });
                } else {
                    setNotify({ type: 'danger', message: res.data.message });
                }
            } else {
                setNotify({ type: 'danger', message: "Request Error !!!" });
            }
        })
    }


    const handleForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        var flag = 1;
        if(formData.get('ticket_id') || formData.get('assign_to_user_id[]') || formData.get('assign_to_department_id[]') || formData.get('status_id[]')){
            formData.append('is_search',true);
            formData.append('user_id', userSessionData.userId);
            formData.append('tenant_id', userSessionData.tenantId);
            await new MyTicketService().getAllTicketNew(formData).then(res => {
                if (res.status === 200) {
                    setAllTicketsData(null);
                    
                    setAllTicketsData(res.data.data.allTickets);
                    const allTicketsDataExportTemp=makeExportData(res.data.data.allTickets);
                    setAllTicketsDataExport(allTicketsDataExportTemp)    


                    setUnpassedTicketsData(res.data.data.unpassedTickets);
                    const unpassedTicketsDataexportTemp=makeExportData(res.data.data.unpassedTickets);
                    setUnpassedTicketsDataExport(unpassedTicketsDataexportTemp);
                }
            });
        }else{
            alert("Fill form before search !!!");
        }



        // await new ReportService().getTicketReport(formData).then(res => {
        //     if (res.status === 200) {

        //         if(res.data.status==1){
        //                 setSearchResult(null);
        //                 setSearchResult(res.data.data);  
        //                 const temp=res.data.data;
        //                 var counter = 1;
        //                 var searchResultExport=[];
        //                 for (const key in temp)
        //                 {
        //                     searchResultExport.push({
        //                         TICKET_ID: temp[key].ticket_id,
        //                         CUID: temp[key].cuid,
        //                         TICKET_DATE: temp[key].ticket_date,
        //                         EXPECTED_SOLVE_DATE: temp[key].expected_solve_date,
        //                         ASSIGN_TO_DEPARTMENT: temp[key].assign_to_department,
        //                         ASSIGN_TO_USER: temp[key].assign_to_user,
        //                         TYPE: temp[key].type_id,
        //                         PRIORITY: temp[key].priority,
        //                         STATUS: temp[key].status_name,
        //                         DESCRIPTION: temp[key].description,
        //                         CREATED_BY: temp[key].created_by_name
        //                     })
        //                 }   
        //                 setKey('Search_Result');
        //                 setSearchResultExport(searchResultExport);
        //             }else{  
        //                 alert("No Data Found");
        //             }
        //         }else {
        //             new ErrorLogService().sendErrorLog("UserTask", "Get_UserTask", "INSERT", res.message);
        //     }
        // }).catch(error => {
        //     const { response } = error;
        //     const { request, ...errorObject } = response;
        //     new ErrorLogService().sendErrorLog("UserTask", "Get_UserTask", "INSERT", errorObject.data.message);
        // })
    }

    const [key, setKey] = useState('Assigned_To_Me');
    useEffect(() => {
        loadData();
        if (location && location.state) {
            setNotify(location.state.alert);
        }
    }, [])

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="My Tickets" />
            {notify && <Alert alertData={notify} />}
            
            <div className='card mt-2' style={{ zIndex: 10 }}>
                <div className='card-body'>
                    <form onSubmit={handleForm}>
                        <div className="row">
                            <div className="col-md-3">
                                <label className="">
                                    <b>Ticket Id :</b>
                                </label>
                                <input type="text" className="form-control form-control-sm" id="ticket_id" name="ticket_id" 
                                    onKeyPress={e => { Validation.CharactersNumbersSpeicalOnly(e) }}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="">
                                    <b>Select User :</b>
                                </label>
                                {/* <UserDropdown id="assign_to_user_id" name="assign_to_user_id"/> */}
                                {userData &&
                                    <Select
                                        options={userData}
                                        isMulti={true}
                                        id="assign_to_user_id[]" 
                                        name="assign_to_user_id[]"
                                    />
                                }
                            </div>

                            <div className="col-md-3">
                                <label className="">
                                    <b>Select Department :</b>
                                </label>
                                {departmentData &&
                                    <Select
                                        options={departmentData}
                                        isMulti={true}
                                        id="assign_to_department_id[]" 
                                        name="assign_to_department_id[]"
                                    />
                                }
                            </div>

                            <div className="col-md-3">
                                <label className="">
                                    <b>Select Status :</b>
                                </label>
                                {statusData &&
                                    <Select
                                        options={statusData}
                                        isMulti={true}
                                        id="status_id[]" 
                                        name="status_id[]"
                                    />
                                }
                            </div>

                            <div className='col-md-2'>
                                <button className='btn btn-sm btn-warning text-white' type="submit" style={{ marginTop: '20px',fontWeight: '600' }}>
                                    <i className="icofont-search-1 "></i> Search
                                </button>
                                <button className='btn btn-sm btn-info text-white' type="button" onClick={() => window.location.reload(false)}
                                    style={{ marginTop: '20px',fontWeight: '600' }}><i className="icofont-refresh text-white"></i> Reset
                                </button>
                            </div>
                            {/* <div className="col-md-7" style={{ textAlign: 'right'}}>
                                <ExportToExcel className="btn btn-sm btn-danger mt-3" apiData={exportData} fileName="TicketData"/>
                            </div> */}
                        </div>
                    </form>
                </div>
            </div>

            <div className='mt-2'>
                <div className=''>
                    <div className="row  g-3">
                        <div className="col-sm-12">
                            <Tabs 
                                defaultActiveKey="AllTickets"
                                transition={false} 
                                id="noanim-tab-example1"
                                className=" tab-body-header rounded d-inline-flex">
                                <Tab eventKey="AllTickets" title="All Tickets">
                                    <div className="card mb-3 mt-3">
                                        <div className="card-body">
                                            {allTicketsDataExport && 
                                                <ExportToExcel 
                                                className="btn btn-sm btn-danger mt-3" 
                                                apiData={allTicketsDataExport} 
                                                fileName="ALL TICKETS"/>
                                            }
                                            {allTicketsData && <DataTable
                                                columns={allTicketsColumns}
                                                data={allTicketsData}
                                                defaultSortField="title"
                                                pagination
                                                selectableRows={false}
                                                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                                highlightOnHover={true}
                                            />
                                            }
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="unpassed_columns" title="Unpassed Ticket">
                                    <div className="card mb-3 mt-3">
                                        <div className="card-body">
                                            {unpassedTicketsDataExport && 
                                                <ExportToExcel 
                                                className="btn btn-sm btn-danger mt-3" 
                                                apiData={unpassedTicketsDataExport} 
                                                fileName="UNPASS TICKETS"/>
                                            }
                                            {unpassedTicketsData && <DataTable
                                                columns={unpassedColumns}
                                                data={unpassedTicketsData}
                                                defaultSortField="title"
                                                pagination
                                                selectableRows={false}
                                                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                                highlightOnHover={true}
                                            />
                                            }
                                        </div>
                                    </div>
                                </Tab>

                                <Tab eventKey="department_tickets" title="Department Ticket">

                                    <Tabs defaultActiveKey={userDepartment && userDepartment[0].department } 
                                        transition={false} id="noanim-tab-example2" 
                                        className=" tab-body-header rounded d-inline-flex mt-2">
                                        
                                        {userDepartment && userDepartment.map((d,i)=>{ 
                                            return <Tab eventKey={d.department} title={d.department}>
                                                <div className="card mb-3 mt-3">   
                                                    {allTicketsData && <DataTable
                                                        columns={allTicketsColumns}
                                                        data={allTicketsData.filter(t=>t.assign_to_department_id==d.department_id)}
                                                        defaultSortField="title"
                                                        pagination
                                                        selectableRows={false}
                                                        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                                        highlightOnHover={true}
                                                        />
                                                    }
                                                </div>
                                            </Tab>
                                        })}                                        
                                    </Tabs>

                                </Tab>

                            </Tabs>
                        </div>
                    </div>
                </div>

            </div>  



            <Modal centered show={modal.showModal}
                onHide={(e) => {
                    handleModal({
                        showModal: false,
                        modalData: "",
                        modalHeader: ""
                    })
                }}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Description-{modal.modalData.ticket_id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modal.modalData.description}

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-danger text-white"
                        onClick={() => { handleModal({ showModal: false, modalData: "", modalHeader: "" }) }} >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={remarkModal.showModal}
                onHide={(e) => {
                    handleRemarkModal({
                        showModal: false,
                        modalData: "",
                        modalHeader: "",
                        status:remarkModal.status
                    })
                }}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{remarkModal.status=="PASS" ? "PASS TICKET "  : "REJECT TICKET"}</Modal.Title>
                </Modal.Header>
                <form onSubmit={handlePassTicketForm} method="post">
                    <Modal.Body>
                        <div className="deadline-form">
                            <input type="hidden"
                                className="form-control form-control-sm"
                                id="pass_status"
                                name="pass_status"
                                value={remarkModal.status}
                            />
                            <input type="hidden"
                                className="form-control form-control-sm"
                                id="id"
                                name="id"
                                defaultValue={remarkModal.modalData.id}
                            />
                            <div className="row g-3 mb-3">
                                <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Ticket Id :</label>
                                    <input type="text"
                                        className="form-control form-control-sm"
                                        defaultValue={remarkModal.modalData.ticket_id}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Remark :*</label>
                                    <input type="text"
                                        name="remark"
                                        id="remark"
                                        className="form-control form-control-sm"
                                        required
                                        onKeyPress={e => { Validation.CharactersNumbersSpeicalOnly(e) }}
                                    />
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-info text-white">
                            Submit
                        </button>
                        <button type="button" className="btn btn-danger text-white"
                            onClick={() => { handleRemarkModal({ showModal: false, modalData: "", modalHeader: "" }) }} >
                            Cancel
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

