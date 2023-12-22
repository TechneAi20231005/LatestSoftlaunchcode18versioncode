import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {_base} from '../../../settings/constants'
import { Modal,Table } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import ErrorLogService from "../../../services/ErrorLogService";
import CityService from "../../../services/MastersService/CityService";
import PageHeader from "../../../components/Common/PageHeader";
import CountryDropdown from "../CountryMaster/CountryDropdown"
// import { StateDropdown } from "../StateMaster/StateComponent"
import { Astrick } from "../../../components/Utilities/Style";
import *  as Validation from '../../../components/Utilities/Validation';
import Alert from "../../../components/Common/Alert";
import UserService from "../../../services/MastersService/UserService";
import DepartmentService from "../../../services/MastersService/DepartmentService";
import StateDropdown from "../StateMaster/StateDropdown";
import DepartmentMappingService from "../../../services/MastersService/DepartmentMappingService";


function CreateDepartmentMappingComponent() {

    const history = useNavigate();
    const [data, setData] = useState({employee_id:null,departments:null});
    const options=[{'value':"MY_TICKETS", 'label':"My Tickets"},{'value':"DEPARTMENT_TICKETS", 'label':"Department Tickets"}]
    const mappingData={department_id:null,ticket_show_type:null,is_default:0};
    const [rows,setRows] = useState([mappingData]);

    const [departmentData,setDepartmentData] = useState(null);
    const [userData,setUserData] = useState(null);
    const [notify, setNotify] = useState();
    const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });
    

    const handleModal = (data) => {
        setModal(data);
    }
    
    
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
                        employee_name: temp[key].employee_name,
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

    const handleForm = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        setNotify(null);
            await new DepartmentMappingService().postDepartmentMapping(form).then(res => {
                if (res.status === 200) {
                    if (res.data.status === 1) {
                        history.push({
                            pathname:`/${_base}/DepartmentMapping`,
                            state: {alert : {type: 'success', message:res.data.message} }
                        });
                    } else {
                        setNotify({ type: 'danger', message: res.data.message })
                    }
                } else {
                    new ErrorLogService().sendErrorLog("DepartmentMapping", "Create_DepartmentMapping", "INSERT", res.message);
                }
            }).catch(error => {
                const { response } = error;
                const { request, ...errorObject } = response;
                new ErrorLogService().sendErrorLog("DepartmentMapping", "Create_DepartmentMapping", "INSERT", errorObject.data.message);
            })
        
    }
    const employeeHandle = async(e) =>{
        setRows([mappingData]);
        await new DepartmentMappingService().getDepartmentMappingByEmployeeId(e.value).then(res =>{
            if(res.status === 200){
                if(res.data.status === 1){
                    const temp=[];
                    res.data.data.forEach(d=>{
                        temp.push({department_id:d.department_id,ticket_show_type:d.ticket_show_type,is_default:d.is_default});
                    })
                    setRows(null);
                    setRows(temp);
                } 
            }
        });
        setData(prev=>({...prev,employee_id:e.value}));
    }


    const handleAddRow = async()=>{
        setNotify(null)
        let flag=1;
        // let last=rows.length-1;

        // if(!rows[last].department_id ){
        //     flag=0;
        //     setNotify({ type: 'danger', message: "Complete Previous Record" })
        // }

        if(flag===1)
       { 
            await setRows([...rows, mappingData]);
       }else{
        setNotify({ type: 'danger', message: "Complete Previous Record" })
       }
    }
    
    const handleRemoveSpecificRow = (idx) => () => {
        if(idx > 0){
            setRows(
                rows.filter((_, i) => i !== idx)
            );
        }
    }
    
    const departmentHandler = (id,e) =>{

        // let temp_state = [...data.departments];
        // let actualIndex=null;	
        // temp_state.forEach((ele,index)=>{
        //     if(ele.id==id){
        //         actualIndex=index;
        //     }
        // })
        // let temp_element = { ...menus.menu[actualIndex] };
        // // console.log(temp_element);
        // setMenus(prev=>({...prev,'menu':temp_state}));   

    }

    const ticketShowHandler = (id,e) =>{
        
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container-xxl">
            {notify && <Alert alertData={notify} />}
            <PageHeader headerTitle="Create Department Mapping" />

            <div className='card mt-2'>
                <div className='card-body'>
                    <div className="row clearfix g-3">
                        <form onSubmit={handleForm} method="post">
                        <div className="col-sm-12">

                           <div className="row g-3 mb-3">
                                <div className="col-sm-2">
                                <label className="form-label font-weight-bold">Select Employee :<Astrick color="red" size="13px" /></label>
                                </div>
                                <div className="col-sm-3">                                        
                                    <Select
                                        options={userData}
                                        id="employee_id"
                                        name="employee_id"
                                        require
                                        onChange={employeeHandle}
                                    />
                                </div>
                            </div>

                            {data && data.employee_id && <div className="">
                                <table
                                    className="table table-bordered table-responsive mt-5"
                                    id="tab_logic"
                                >
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{width:"100px"}}> # </th>
                                            <th className="text-center" style={{width:"300px"}}> Department</th>
                                            <th className="text-center" style={{width:"300px"}}> Ticket Type Show </th>
                                            <th className="text-center" style={{width:"300px"}}> Make Default </th>
                                            <th className="text-center" style={{width:"100px"}}> Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {rows && rows.map((item, idx) => (
                                        <tr>
                                            <td className="text-center">{idx+1}</td>
                                            <td>                                                
                                                <Select options={departmentData} 
                                                    id={`department_id_`+idx}
                                                    name='department_id[]'
                                                    onChange={e=>departmentHandler(idx,e)}
                                                    defaultValue={item.department_id && departmentData.filter(d=>d.value==item.department_id)}
                                                />
                                            </td>
                                            <td>
                                            <Select 
                                                options={options}
                                                id={`ticket_show_type_id_`+idx}
                                                name='ticket_show_type[]'
                                                onChange={e=>ticketShowHandler(idx,e)}   
                                                defaultValue={item.ticket_show_type && options.filter(d=>d.value==item.ticket_show_type)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <input type="radio" id={`is_default_`+idx} name="is_default[]" 
                                                    value="1" 
                                                    defaultChecked={item.is_default==1}
                                                    />
                                            </td>

                                            <td>
                                                { idx==0 &&
                                                        <button type="button" className="btn btn-sm btn-outline-primary pull-left"
                                                            onClick={handleAddRow}><i className="icofont-plus-circle"></i></button>
                                                }   
                                                {rows.length==idx+1 && idx!=0 &&
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

                                <div className="" style={{textAlign: 'right'}}>
                                    <button type="submit" className="btn btn-sm btn-primary">Submit</button>    
                                    <Link to={`/${_base+"/DepartmentMapping"}`} className="btn btn-sm btn-danger text-white">Cancel</Link>
                                </div>                                   
                            </div> }



                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateDepartmentMappingComponent;
