import React, { useEffect, useState } from "react";
import { Modal,Row,Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {_base} from '../../../settings/constants'
import DataTable from "react-data-table-component";
import Select from "react-select";
import ErrorLogService from "../../../services/ErrorLogService";
import CityService from "../../../services/MastersService/CityService";
import PageHeader from "../../../components/Common/PageHeader";
import *  as Validation from '../../../components/Utilities/Validation';
import Alert from "../../../components/Common/Alert";
import UserService from "../../../services/MastersService/UserService";
import DepartmentService from "../../../services/MastersService/DepartmentService";
import DepartmentMappingService from "../../../services/MastersService/DepartmentMappingService";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

function DepartmentMappingComponent() {

    const [data, setData] = useState(null);
    const [departmentData,setDepartmentData] = useState(null);
    const [userData,setUserData] = useState(null);
    const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });
    const [notify, setNotify] = useState();
    const [dependent,setDependent]=useState({country_id:null,state_id:null});
    const ticketViewOption=[{'value':"MY_TICKETS", 'label':"My Tickets"},{'value':"DEPARTMENT_TICKETS", 'label':"Department Tickets"}]
  
    const handleDependent=(e,name)=>{
        setDependent({
            ...dependent,
            [name]: e.value
            });
    }

    const handleModal = (data) => {
        setModal(data);
    }
    
    const columns = [
        {
            name: "Action", selector: (row) => { }, sortable: false,
            cell: (row) =>
                <div className="btn-group" role="group" >
                    <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#edit"
                        onClick={(e) => {
                            handleModal({ showModal: true, modalData: row, modalHeader: 'Edit Department Mapping' })
                        }}
                    ><i className="icofont-edit text-success"></i>
                    </button>
                </div>
        },
        { name: "Sr", selector: (row) => row.counter, sortable: true },
        { name: "Employee", selector: (row) => row.employee_name, sortable: true },
        { name: "Department", selector: (row) => row.department, sortable: true },
        {
            name: "Status", selector: (row) => row.is_active, sortable: false,
            cell: (row) => <div>
                {row.is_active == 1 && <span className="badge bg-primary">Active</span>}
                {row.is_active == 0 && <span className="badge bg-danger">Deactive</span>}
            </div>
        },
        { name: "Ticket Show Type", selector: (row) => row.ticket_show_type, sortable: true },
        { name: "Updated At", selector: (row) => row.updated_at, sortable: true },
        { name: "Updated By", selector: (row) => row.updated_by, sortable: true },
    ];

    const loadData = async () => {
        const data = [];

        new UserService().getUser().then(res =>{
            if (res.status === 200) {
                const temp=[];
                res.data.data.forEach(row =>{
                    temp.push({value:row.id, label:row.first_name+" "+row.last_name});        
                });
                setUserData(temp);
            }
        })

        new DepartmentService().getDepartment().then(res =>{
            if (res.status === 200) {
                const temp=[];
                res.data.data.forEach(row =>{
                    temp.push({value:row.id, label:row.department});        
                });
                setDepartmentData(temp);
            }
        })

        new DepartmentMappingService().getAllDepartmentMapping().then(res =>{
            if (res.status === 200) {
                let counter = 1;
                const temp = res.data.data
                for (const key in temp) {
                    data.push({
                        counter: counter++,
                        id: temp[key].id,
                        employee_id: temp[key].employee_id,
                        employee_name: temp[key].employee_name,
                        department_id: temp[key].department_id,
                        department: temp[key].department,
                        ticket_show_type: temp[key].ticket_show_type.replace("_"," "),
                        is_active: temp[key].is_active,
                        remark: temp[key].remark,
                        updated_at: temp[key].updated_at,
                        updated_by: temp[key].updated_by
                    })
                }
                setData(null);
                setData(data);
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog("City", "Get_City", "INSERT", errorObject.data.message);
        });        
    }

    const handleForm = id => async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        setNotify(null);

        new DepartmentMappingService().updateDepartmentMapping(id,form).then(res => {
                if (res.status === 200) {
                    if (res.data.status) {
                        setModal({ showModal: false, modalData: "", modalHeader: "" });
                        loadData();
                        setNotify(null)
                        setNotify({ type: 'success', message: res.data.message })
                    } else {
                        setNotify(null)
                        setNotify({ type: 'danger', message: res.data.message })
                    }
                } else {
                    setNotify({ type: 'danger', message: res.message });
                    new ErrorLogService().sendErrorLog("Employee_Department_Mapping", "Edit_Employee_Department_Mapping", "INSERT", res.message);
                }
            }).catch(error => {
                const { response } = error;
                const { request, ...errorObject } = response;
                setNotify({ type: 'danger', message: "Request Error !!!" });
                new ErrorLogService().sendErrorLog("Employee_Department_Mapping", "Edit_Employee_Department_Mapping", "INSERT", errorObject.data.message);
            })
    }
    const tableData = {
        columns,
        data
      };
    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container-xxl">
            {notify && <Alert alertData={notify} />}
            <PageHeader headerTitle="Department Mapping Master" renderRight={() => {
                return <div className="col-auto d-flex w-sm-100">
                            <Link to={`/${_base+"/DepartmentMapping/Create"}`} className="btn btn-dark btn-set-task w-sm-100">
                                <i className="icofont-plus-circle me-2 fs-6"></i> Create Mapping
                            </Link>
                        </div>
            }} />

            <div className='card mt-2'>
                <div className='card-body'>
                    <div className="row clearfix g-3">
                        <div className="col-sm-12">
                            {data && 
                                <DataTableExtensions {...tableData}>
                            <DataTable
                                columns={columns}
                                data={data}
                                defaultSortField="title"
                                pagination
                                selectableRows={false}
                                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                highlightOnHover={true}
                            />
                                </DataTableExtensions>
                            }
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
                <form method="post" onSubmit={handleForm(modal.modalData.id)}>

                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="deadline-form">
                            <div className="row g-3 mb-3">
                                <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Employee Name :</label>
                                    <input type="text"
                                    className="form-control form-control-sm"
                                        defaultValue={modal.modalData.employee_name}
                                        readOnly="true"
                                    />
                                </div>

                                <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Deparment Name :</label>
                                    <input type="text"
                                    className="form-control form-control-sm"
                                        defaultValue={modal.modalData.department}
                                        readOnly="true"
                                    />
                                </div>
                              
                                {modal.modalData.ticket_show_type  &&
                                    <div className="col-sm-12">
                                        <label className="form-label font-weight-bold">Deparment Name :</label>
                                        <Select 
                                        options={ticketViewOption}
                                        id='ticket_show_type'
                                        name='ticket_show_type'
                                        defaultValue={ticketViewOption.filter(d=>d.value===modal.modalData.ticket_show_type.replace(" ","_"))}
                                        />
                                    </div>
                                }
                                  <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Status :</label>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active_1"
                                                    value="1"
                                                    defaultChecked={(modal.modalData && modal.modalData.is_active === 1) ? true : ((!modal.modalData) ? true : false)}
                                                />
                                                <label className="form-check-label" htmlFor="is_active_1">
                                                    Active
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active_0" value="0"
                                                    readOnly={(modal.modalData) ? false : true}
                                                    defaultChecked={(modal.modalData && modal.modalData.is_active === 0) ? true : false}
                                                />
                                                <label className="form-check-label" htmlFor="is_active_0">
                                                    Deactive
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary text-white" style={{ backgroundColor: "#484C7F" }}  >
                            Update
                        </button>
                        <button type="button" className="btn btn-danger text-white"
                            onClick={() => { handleModal({ showModal: false, modalData: "", modalHeader: "" }) }} >
                            Cancel
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>

        </div>
    )
}



export default DepartmentMappingComponent;
