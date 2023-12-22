import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Dropdown,Button,ButtonGroup } from "react-bootstrap"
import { _base } from "../../settings/constants";
import Alert from "../../components/Common/Alert";
import ErrorLogService from "../../services/ErrorLogService";
import MyTicketService from "../../services/TicketService/MyTicketService"
import UserService from '../../services/MastersService/UserService'
import ReportService from "../../services/ReportService/ReportService";
import PageHeader from "../../components/Common/PageHeader";
import Select from 'react-select';
import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
import UserDropdown from "../Masters/UserMaster/UserDropdown"
import DepartmentDropdown from "../Masters/DepartmentMaster/DepartmentDropdown"
import StatusDropdown from "../Masters/StatusMaster/StatusDropdown"
import DepartmentMappingService from "../../services/MastersService/DepartmentMappingService";

export default function MyTicketComponentCopy({ location }) {
    const [notify, setNotify] = useState(null);
    const [data, setData] = useState(null);
    const [unpassedTickets, setUnpassedTickets] = useState(null);
    const [assignedToMe, setAssignedToMe] = useState(null);
    const [createdByMe, setCreatedByMe] = useState(null);
    const [exportData, setExportData] = useState(null);
    const [modal,setModal] = useState({showModal:false,modalData:"",modalHeader:""});
    const [remarkModal,setRemarkModal] = useState({showModal:false,modalData:"",modalHeader:""});

    const handleModal = (data) =>{
        setModal(data);
    }
    
    const handleRemarkModal = (data) =>{
        setRemarkModal(data);
    }


    const actionComponent = (data,type) =>{
        if(type === "ALL_TICKETS")
        {
        return  <Dropdown className="d-inline-flex m-1" >
                    <Dropdown.Toggle as="button" variant="" id={`${"dropdown-basic_" + data.id}`} className="btn btn-primary text-white"                       >
                        <i className="icofont-listine-dots"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="border-0 shadow p-1">
                        {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') &&
                            <li><Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white" 
                                style={{ width: "100%",zIndex:'100'}}>
                                <i className="icofont-ui-edit"></i>  Edit</Link></li>
                        }      
                        <li> <Link to={`/${_base}/Ticket/View/` + data.id} className="btn btn-sm btn-info text-white" style={{ width: "100%" ,zIndex:100}}>
                                <i className="icofont-external-link "></i> View</Link> </li>

                        {data.created_by != localStorage.getItem('id') && data.basket_configured === 0 &&
                            <li><Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%",zIndex:100 }}>
                                <i className="icofont-bucket2"></i>Basket</Link></li>
                        }

                        {data.created_by != localStorage.getItem('id') && data.basket_configured > 0 &&
                            <li><Link to={`/${_base}/Ticket/Task/` + data.id} className="btn btn-sm btn-outline-primary" style={{ width: "100%",zIndex:100 }}>
                                <i className="icofont-tasks"></i> Task</Link></li>
                        }
                    </Dropdown.Menu>
                </Dropdown>
         }
         if(type === "ASSIGNED_TO_ME")
         {  
            if(assignedToMe && assignedToMe.length > 3) 
            {
            return <Dropdown className="d-inline-flex m-1" >
                <Dropdown.Toggle as="button" variant="" id={`${"dropdown-basic_" + data.id}`} className="btn btn-primary text-white"                       >
                    <i className="icofont-listine-dots"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu as="ul" className="border-0 shadow p-1">
                {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') &&
                    <li><Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white" 
                        style={{ width: "100%",zIndex:'100'}}>
                        <i className="icofont-ui-edit"></i>  Edit</Link></li>
                }      
                <li> <Link to={`/${_base}/Ticket/View/` + data.id} className="btn btn-sm btn-info text-white" style={{ width: "100%" ,zIndex:100}}>
                        <i className="icofont-external-link "></i> View</Link> </li>

                {data.created_by != localStorage.getItem('id') && data.basket_configured === 0 &&
                    <li><Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%",zIndex:100 }}>
                        <i className="icofont-bucket2"></i>Basket</Link></li>
                }

                {data.created_by != localStorage.getItem('id') && data.basket_configured > 0 &&
                    <li><Link to={`/${_base}/Ticket/Task/` + data.id} className="btn btn-sm btn-outline-primary" style={{ width: "100%",zIndex:100 }}>
                        <i className="icofont-tasks"></i> Task</Link></li>
                }
            </Dropdown.Menu>
        </Dropdown>
            }else{
             return   <div className="d-flex justify-content-between">
                    
                    <Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white" 
                            >
                        <i className="icofont-ui-edit"></i>  Edit</Link>

                <Link to={`/${_base}/Ticket/View/` + data.id} className="btn btn-sm btn-info text-white" >
                    <i className="icofont-external-link "></i> View</Link>    
                    <button className="btn btn-success text-white" 
                         onClick={(e)=>{ 
                            handleRemarkModal({showModal:true,modalData:data,modalHeader:'Enter Remark'}) 
                        }}
                    >
                    <i className="icofont-checked"></i> Pass
                    </button>  
                </div>
            }
        }
        if(type === "ADDED_BY_ME")
        {  
           if(createdByMe && createdByMe.length > 3) 
           {
           return <Dropdown className="d-inline-flex m-1" >
               <Dropdown.Toggle as="button" variant="" id={`${"dropdown-basic_" + data.id}`} className="btn btn-primary text-white"                       >
                   <i className="icofont-listine-dots"></i>
               </Dropdown.Toggle>
               <Dropdown.Menu as="ul" className="border-0 shadow p-1">
               {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') &&
                   <li><Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white" 
                       style={{ width: "100%",zIndex:'100'}}>
                       <i className="icofont-ui-edit"></i>  Edit</Link></li>
               }      
               <li> <Link to={`/${_base}/Ticket/View/` + data.id} className="btn btn-sm btn-info text-white" style={{ width: "100%" ,zIndex:100}}>
                       <i className="icofont-external-link "></i> View</Link> </li>

               {data.created_by != localStorage.getItem('id') && data.basket_configured === 0 &&
                   <li><Link to={`/${_base}/Ticket/Basket/` + data.id} className="btn btn-sm btn-primary text-white" style={{ width: "100%",zIndex:100 }}>
                       <i className="icofont-bucket2"></i>Basket</Link></li>
               }

               {data.created_by != localStorage.getItem('id') && data.basket_configured > 0 &&
                   <li><Link to={`/${_base}/Ticket/Task/` + data.id} className="btn btn-sm btn-outline-primary" style={{ width: "100%",zIndex:100 }}>
                       <i className="icofont-tasks"></i> Task</Link></li>
               }
           </Dropdown.Menu>
       </Dropdown>
           }else{
            return   <div className="d-flex justify-content-between">
                    <Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white">
                        <i className="icofont-ui-edit"></i>  Edit</Link>
                        <Link to={`/${_base}/Ticket/View/` + data.id} className="btn btn-sm btn-info text-white" >
                            <i className="icofont-external-link "></i> View</Link>    
                </div>
           }

        }

        if(type === "UNPASSED_TICKET")
        {  
            if(unpassedTickets && unpassedTickets.length > 3) 
            {
            return    <Dropdown className="d-inline-flex m-1">
                    <Dropdown.Toggle as="button" variant="" id={`${"dropdown-basic_" + data.id}`} className="btn btn-primary text-white">
                        <i className="icofont-listine-dots"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="border-0 shadow p-1">
                        {data.created_by == localStorage.getItem('id') || data.assign_to_user_id == localStorage.getItem('id') &&
                            <li><Link to={`/${_base}/Ticket/Edit/` + data.id} className="btn btn-sm btn-warning text-white" 
                                style={{ width: "100%",zIndex:100}}>
                                <i className="icofont-ui-edit"></i>  Edit</Link></li>
                        }                    
                        <li><Link to={`/${_base}/Ticket/View/` + data.id} className="btn btn-sm btn-info text-white" style={{ width: "100%" ,zIndex:100}}>
                            <i className="icofont-external-link "></i> View</Link> </li>

                        <li>
                            <button className="btn btn-success text-white" style={{ width: "100%" ,zIndex:100}}
                                 onClick={(e)=>{ 
                                    handleRemarkModal({showModal:true,modalData:data,modalHeader:'Enter Remark'}) 
                                }}
                            >
                            <i className="icofont-checked"></i> Pass
                            </button>
                        </li>    
                    </Dropdown.Menu>
                </Dropdown>
                }else{
                return <div className="d-flex justify-content-between">
                        <Link to={`/${_base}/Ticket/View/` + data.id} className="btn btn-sm btn-info text-white" >
                            <i className="icofont-external-link "></i> View</Link>    
                            <button className="btn btn-success text-white" 
                                 onClick={(e)=>{ 
                                    handleRemarkModal({showModal:true,modalData:data,modalHeader:'Enter Remark'}) 
                                }}
                            >
                            <i className="icofont-checked"></i> Pass
                            </button>  
                    </div>
                }
        }

    }

    const columns = [
        {
            name: 'Action', button: true, ignoreRowClick: true, allowOverflow: false,
            width:`${data ? (data.length > 3 ? 'auto' : '250px') : 'auto'}`,
            cell: row => actionComponent(row,"ALL_TICKETS") 
           
        },
        { name: 'Sr', selector: row => row.counter, sortable: true, width: "70px" },
        { name: 'Ticket Id', cell: row => <Link to={`/${_base}/Ticket/View/` + row.id} ><span className='fw-bold text-secondary'>{row.ticket_id}</span></Link>, sortable: true, },
        { name: "Description",width: "400px",selector: (row)=>{},sortable: false, 
            cell:(row)=>
            <div className="btn-group" role="group" aria-label="Basic outlined example">
                <a href="#" 
                    onClick={(e)=>{ 
                        handleModal({showModal:true,modalData:row,modalHeader:'Edit Country'}) 
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
        { name: 'Type', cell: row => row.type_id, sortable: true, },
        { name: 'Status', cell: row => row.status_name, sortable: true, },
        { name: 'Assign To Dept', cell: row => row.assign_to_department, sortable: true, },
        { name: 'Assinged To', cell: row => row.assign_to_user, sortable: true, },
        { name: 'Created By', cell: row => row.created_by, sortable: true, },
    ];


    const assignedToMeColumns = [{
            name: 'Action', button: true, ignoreRowClick: true, allowOverflow: false,
            width:`${assignedToMe ? (assignedToMe.length > 3 ? 'auto' : '250px') : 'auto'}`,
            cell: row => actionComponent(row,"ASSIGNED_TO_ME") 
           
        },
        { name: 'Sr', selector: row => row.counter, sortable: true, width: "70px" },
        { name: 'Ticket Id', cell: row => <Link to={`/${_base}/Ticket/View/` + row.id} ><span className='fw-bold text-secondary'>{row.ticket_id}</span></Link>, sortable: true, },
        { name: "Description",width: "400px",selector: (row)=>{},sortable: false, 
            cell:(row)=>
            <div className="btn-group" role="group" aria-label="Basic outlined example">
                <a href="#" 
                    onClick={(e)=>{ 
                        handleModal({showModal:true,modalData:row,modalHeader:'Edit Country'}) 
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
        { name: 'Type', cell: row => row.type_id, sortable: true, },
        { name: 'Status', cell: row => row.status_name, sortable: true, },
        { name: 'Assign To Dept', cell: row => row.assign_to_department, sortable: true, },
        { name: 'Assinged To', cell: row => row.assign_to_user, sortable: true, },
        { name: 'Created By', cell: row => row.created_by, sortable: true, },
    ];

    const addedByMeColumns = [
        {
            name: 'Action', button: true, ignoreRowClick: true, allowOverflow: false,
            width:`${createdByMe ? (createdByMe.length > 3 ? 'auto' : '250px') : 'auto'}`,
            cell: row => actionComponent(row,"ADDED_BY_ME") 
        },

        { name: 'Sr', selector: row => row.counter, sortable: true, width: "70px" },
        { name: 'Ticket Id', cell: row => <Link to={`/${_base}/Ticket/View/` + row.id} ><span className='fw-bold text-secondary'>{row.ticket_id}</span></Link>, sortable: true, },
        { name: "Description",width: "400px",selector: (row)=>{},sortable: false, 
            cell:(row)=>
            <div className="btn-group" role="group" aria-label="Basic outlined example">
                <a href="#" 
                    onClick={(e)=>{ 
                        handleModal({showModal:true,modalData:row,modalHeader:'Edit Country'}) 
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
        { name: 'Type', cell: row => row.type_id, sortable: true, },
        { name: 'Status', cell: row => row.status_name, sortable: true, },
        { name: 'Assign To Dept', cell: row => row.assign_to_department, sortable: true, },
        { name: 'Assinged To', cell: row => row.assign_to_user, sortable: true, },
        { name: 'Created By', cell: row => row.created_by, sortable: true, },
    ];


    const unpassedColumns = [
        {
            name: 'Action', button: true, ignoreRowClick: true, allowOverflow: false,
            width:`${unpassedTickets ? (unpassedTickets.length > 3 ? 'auto' : '250px') : 'auto'}`,
            cell: row => actionComponent(row,"UNPASSED_TICKET")       
        },
        { name: 'Sr', selector: row => row.counter, sortable: true, width: "70px" },
        { name: 'Ticket Id', cell: row => <Link to={`/${_base}/Ticket/View/` + row.id} ><span className='fw-bold text-secondary'>{row.ticket_id}</span></Link>, sortable: true, },
        { name: "Description",width: "400px",selector: (row)=>{},sortable: false, 
            cell:(row)=>
            <div className="btn-group" role="group" aria-label="Basic outlined example">
                <a href="#" 
                    onClick={(e)=>{ 
                        handleModal({showModal:true,modalData:row,modalHeader:'Edit Country'}) 
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
        { name: 'Type', cell: row => row.type_id, sortable: true, },
        { name: 'Status', cell: row => row.status_name, sortable: true, },
        { name: 'Assign To Dept', cell: row => row.assign_to_department, sortable: true, },
        { name: 'Assinged To', cell: row => row.assign_to_user, sortable: true, },
        { name: 'Created By', cell: row => row.created_by, sortable: true, },
    ];

    const [userDepartment,setUserDepartment]= useState();
    const [setDepartmentwiseTicket,setUserDepartmentwiseTicket]= useState();


    const loadData = async () => {
        await new DepartmentMappingService().getDepartmentMappingByEmployeeId(localStorage.getItem('id')).then((res) => {
            if (res.status === 200) {
                if(res.data.status==1){
                    setUserDepartment(res.data.data);
                }
            }
        })
        const tempData = [];
        const unpassedTicketsTemp =[];
        const exportData = [];
        const assignedToMeTemp =[];
        const createdByMeTemp =[];
        const tempUserDepartment=[]; 
        const tempDepartmentwiseTicket = [];
        if(userDepartment){
                userDepartment.map(d=>
                      tempUserDepartment.push(d.department_id)
                )
        }

        await new MyTicketService().getUserTickets().then(res => {
            if (res.status === 200) {
                var counter = 1;

                //Unpassed Ticket
                const unpassedTickets = res.data.unpassedTickets;
                for (const key in unpassedTickets) {
                    var temp = {
                        counter: counter++,
                        id: unpassedTickets[key].id,
                        cuid: unpassedTickets[key].cuid,
                        ticket_id: unpassedTickets[key].ticket_id,
                        description: unpassedTickets[key].description,
                        ticket_date: unpassedTickets[key].ticket_date,
                        description: unpassedTickets[key].description,
                        from_department: unpassedTickets[key].from_department_name,
                        assign_to_department: unpassedTickets[key].assign_to_department,
                        assign_to_department_id: unpassedTickets[key].assign_to_department_id,
                        assign_to_user: unpassedTickets[key].assign_to_user,
                        expected_solve_date: unpassedTickets[key].expected_solve_date,
                        priority: unpassedTickets[key].priority,
                        status_name: unpassedTickets[key].status_name,
                        type_id: unpassedTickets[key].type_id,
                        assign_to_user_id: unpassedTickets[key].assign_to_user_id,
                        created_by: unpassedTickets[key].created_by_name,
                        pasing_status: unpassedTickets[key].passed_status,
                        basket_configured: unpassedTickets[key].basket_configured
                    }
                    unpassedTicketsTemp.push(temp);
                }
               
                //Passed Ticket
                const data = res.data.myTickets;
                var counter = 1;
                for (const key in data) {
                    var temp = {
                        counter: counter++,
                        id: data[key].id,
                        cuid: data[key].cuid,
                        ticket_id: data[key].ticket_id,
                        description: data[key].description,
                        ticket_date: data[key].ticket_date,
                        description: data[key].description,
                        assign_to_department: data[key].assign_to_department,
                        assign_to_department_id: data[key].assign_to_department_id,
                        assign_to_user: data[key].assign_to_user,
                        expected_solve_date: data[key].expected_solve_date,
                        priority: data[key].priority,
                        status_name: data[key].status_name,
                        type_id: data[key].type_id,
                        assign_to_user_id: data[key].assign_to_user_id,
                        created_by: data[key].created_by_name,
                        pasing_status: data[key].passed_status,
                        basket_configured: data[key].basket_configured
                    }
                    tempData.push(temp);
                    var exportTempData = {
                        ticket_id: data[key].ticket_id,
                        cuid: data[key].cuid,
                        ticket_date: data[key].ticket_date,
                        expected_solve_date: data[key].expected_solve_date,
                        assign_to_department: data[key].assign_to_department,
                        assign_to_user: data[key].assign_to_user,
                        type_id: data[key].type_id,
                        priority: data[key].priority,
                        status_name: data[key].status_name,
                        description: data[key].description,
                        created_by: data[key].created_by
                    }
                    exportData.push(exportTempData);
                }

                //Assign to Me Ticket
                const assign_to_me_ticket = res.data.myTickets;
                var counter = 1;
                for (const key in assign_to_me_ticket) {
                    if(localStorage.getItem('id')==data[key].assign_to_user_id){
                        var temp = {
                            counter: counter++,
                            id: data[key].id,
                            cuid: data[key].cuid,
                            ticket_id: data[key].ticket_id,
                            description: data[key].description,
                            ticket_date: data[key].ticket_date,
                            description: data[key].description,
                            assign_to_department: data[key].assign_to_department,
                            assign_to_department_id: data[key].assign_to_department_id,
                            assign_to_user: data[key].assign_to_user,
                            expected_solve_date: data[key].expected_solve_date,
                            priority: data[key].priority,
                            status_name: data[key].status_name,
                            type_id: data[key].type_id,
                            assign_to_user_id: data[key].assign_to_user_id,
                            created_by: data[key].created_by_name,
                            pasing_status: data[key].passed_status,
                            basket_configured: data[key].basket_configured
                        }
                        assignedToMeTemp.push(temp);
                    }
                }

                //Assign to Me Ticket
                const createdByMe = res.data.myTickets;
                var counter = 1;
                for (const key in createdByMe) {
                    if(localStorage.getItem('id')==data[key].created_by){
                         var temp = {
                             counter: counter++,
                             id: data[key].id,
                             cuid: data[key].cuid,
                             ticket_id: data[key].ticket_id,
                             description: data[key].description,
                             ticket_date: data[key].ticket_date,
                             description: data[key].description,
                             assign_to_department: data[key].assign_to_department,
                             assign_to_department_id: data[key].assign_to_department_id,
                             assign_to_user: data[key].assign_to_user,
                             expected_solve_date: data[key].expected_solve_date,
                             priority: data[key].priority,
                             status_name: data[key].status_name,
                             type_id: data[key].type_id,
                             assign_to_user_id: data[key].assign_to_user_id,
                             created_by: data[key].created_by_name,
                             pasing_status: data[key].passed_status,
                             basket_configured: data[key].basket_configured
                         }
                         createdByMeTemp.push(temp);
                     }
                 }

                setData(null)
                setData(tempData);

                setUnpassedTickets(null);
                setUnpassedTickets(unpassedTicketsTemp);

                setExportData(null);
                setExportData(exportData);

                setAssignedToMe(null);
                setAssignedToMe(assignedToMeTemp);
                
                setCreatedByMe(null);
                setCreatedByMe(createdByMeTemp);
           
            }
        });
    }

    const handlePassTicketForm = async(e) => {
        setNotify(null);
        e.preventDefault();
        const formData = new FormData(e.target);
        await new MyTicketService().passTicket(formData).then(res => {
            if(res.status===200){
                if(res.data.status==1){
                    setRemarkModal({showModal:false,modalData:"",modalHeader:""});
                    loadData();
                    setNotify({type: 'success', message:res.data.message});
                }else{
                    setNotify({type: 'danger', message:res.data.message});
                }
            }else{
                setNotify({type: 'danger', message:"Request Error !!!"});
            }
        })
    }   


     const handleForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        var flag = 1;
        await new ReportService().getTicketReport(formData).then(res => {

            if (res.status === 200) {
                let counter = 1;
                const tempData = [];
                const exportData = []
                const data = res.data.data
                for (const key in data) {
                    var temp = {
                        counter: counter++,
                        id: data[key].id,
                        cuid: data[key].cuid,
                        ticket_id: data[key].ticket_id,
                        ticket_date: data[key].ticket_date,
                        description: data[key].description,
                        assign_to_department: data[key].assign_to_department,
                        assign_to_department_id: data[key].assign_to_department_id,
                        assign_to_user: data[key].assign_to_user,
                        expected_solve_date: data[key].expected_solve_date,
                        priority: data[key].priority,
                        status_name: data[key].status_name,
                        type_id: data[key].type_id,
                        assign_to_user_id: data[key].assign_to_user_id,
                        created_by: data[key].created_by
                    }
                    tempData.push(temp);

                    var exportTempData = {
                        ticket_id: data[key].ticket_id,
                        cuid: data[key].cuid,
                        ticket_date: data[key].ticket_date,
                        expected_solve_date: data[key].expected_solve_date,
                        assign_to_department: data[key].assign_to_department,
                        assign_to_user: data[key].assign_to_user,
                        type_id: data[key].type_id,
                        priority: data[key].priority,
                        status_name: data[key].status_name,
                        description: data[key].description,
                        created_by: data[key].created_by
                    }
                    exportData.push(exportTempData);
                }
                setData(null);
                setData(tempData);
                setExportData(null);
                setExportData(exportData);
            } else {
                new ErrorLogService().sendErrorLog("UserTask", "Get_UserTask", "INSERT", res.message);
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog("UserTask", "Get_UserTask", "INSERT", errorObject.data.message);
        })
    }
    const test = "<h1>hi</h1>";
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
                                <input type="text" className="form-control form-control-sm" id="ticket_id" name="ticket_id" />
                            </div>
                            <div className="col-md-3">
                                <label className="">
                                    <b>Select User :</b>
                                </label>
                                <UserDropdown id="assign_to_user_id" name="assign_to_user_id" />
                            </div>

                            <div className="col-md-3">
                                <label className="">
                                    <b>Select Department :</b>
                                </label>
                                <DepartmentDropdown id="assign_to_department_id" name="assign_to_department_id" />
                            </div>

                            <div className="col-md-3">
                                <label className="">
                                    <b>Select Type :</b>
                                </label>
                                <select className="form-control form-control-sm" id="type_id" name="type_id" >
                                    <option value="">Select Type</option>
                                    <option value="New">New</option>
                                    <option value="Change">Change</option>
                                    <option value="Bug">Bug</option>
                                    <option value="Error">Error</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="">
                                    <b>Select Status :</b>
                                </label>
                                <StatusDropdown id="status_id" name="status_id"
                                />
                            </div>

                            <div className='col-md-2'>
                                <button className='btn btn-sm btn-warning text-white' type="submit" style={{ marginTop: '20px',fontWeight: '600' }}>
                                    <i className="icofont-search-1 "></i> Search
                                </button>
                                <button className='btn btn-sm btn-info text-white' type="button" onClick={() => window.location.reload(false)}
                                    style={{ marginTop: '20px',fontWeight: '600' }}><i className="icofont-refresh text-white"></i> Reset
                                </button>
                            </div>
                            <div className="col-md-7" style={{ textAlign: 'right'}}>
                                <ExportToExcel className="btn btn-sm btn-danger mt-3" apiData={exportData} fileName="TicketData"/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className='card mt-2'>
                <div className='card-body'>
                    <div className="row clearfix g-3">
                        <div className="col-sm-12">
                        <Tabs defaultActiveKey="All_Tickets" transition={false} id="noanim-tab-example1" 
                              className=" tab-body-header rounded d-inline-flex">
                            <Tab eventKey="All_Tickets" title="All Ticket">
                                <div className="card mb-3 mt-3">
                                    <div className="card-body">
                                    {data && <DataTable
                                        columns={columns}
                                        data={data}
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
                            <Tab eventKey="Assigned_To_You" title="Assigned To Me">
                                <div className="card mb-3 mt-3">
                                        {assignedToMe && <DataTable
                                        columns={assignedToMeColumns}
                                        data={assignedToMe}
                                        defaultSortField="title"
                                        pagination
                                        selectableRows={false}
                                        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                        highlightOnHover={true}
                                    />
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="Created_By_Me" title="Added By Me">
                                <div className="card mb-3 mt-3">
                                        {createdByMe && <DataTable
                                        columns={addedByMeColumns}
                                        data={createdByMe}
                                        defaultSortField="title"
                                        pagination
                                        selectableRows={false}
                                        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                        highlightOnHover={true}
                                    />
                                    }
                                </div>
                            </Tab>
                            
                            <Tab eventKey="Departmentswise" title="Departmentswise">
                                <Tabs defaultActiveKey={userDepartment && userDepartment[0].department } transition={false} id="noanim-tab-example2" className=" tab-body-header rounded d-inline-flex">
  
                                        {userDepartment && userDepartment.map((d,i)=>{ 
                                            return <Tab eventKey={d.department} title={d.department}>
                                                <div className="card mb-3 mt-3">   
                                                {data && <DataTable
                                                    columns={columns}
                                                    data={data.filter(t=>t.assign_to_department_id==d.department_id)}
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

                            <Tab eventKey="Unpassed_Ticket" title="Unpassed Ticket">
                                <div className="card mb-3 mt-3">
                                        {unpassedTickets && <DataTable
                                        columns={unpassedColumns}
                                        data={unpassedTickets}
                                        defaultSortField="title"
                                        pagination
                                        selectableRows={false}
                                        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                        highlightOnHover={true}
                                    />
                                    }
                                </div>
                            </Tab>            
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
            
            <Modal centered show={modal.showModal} 
                    onHide={(e)=>{handleModal({
                                                showModal:false,
                                                modalData:"",
                                                modalHeader:""
                                            }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">Description-{modal.modalData.ticket_id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modal.modalData.description}    
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger text-white"
                                onClick={()=>{ handleModal({showModal:false,modalData:"",modalHeader:"" })}} >
                            Close
                        </button>
                    </Modal.Footer>
            </Modal>

            <Modal centered show={remarkModal.showModal} 
                    onHide={(e)=>{handleRemarkModal({
                                                showModal:false,
                                                modalData:"",
                                                modalHeader:""
                                            }) }}>
                    <Modal.Header closeButton>          
                        <Modal.Title className="fw-bold">Pass Ticket</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handlePassTicketForm} method="post">
                    <Modal.Body>
                        <div className="deadline-form">
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
                                    <label className="form-label font-weight-bold">Remark :</label>
                                       <input type="text" 
                                       name="remark"
                                       id="remark"
                                       className="form-control form-control-sm" 
                                       required
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
                                onClick={()=>{ handleRemarkModal({showModal:false,modalData:"",modalHeader:"" })}} >
                            Close
                        </button>
                    </Modal.Footer>
                </form>   
            </Modal>
        </div>
    )
}

