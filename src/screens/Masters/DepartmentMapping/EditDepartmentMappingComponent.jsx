import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'
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


function EditDepartmentMappingComponent({match}) {

    const history = useNavigate();
    const [data, setData] = useState({employee_id:null,departments:null});
    const {employee_id}=useParams()
    const mappingData={department_id:null,ticket_show_type:null};

    const [departmentData,setDepartmentData] = useState(null);
    const [userData,setUserData] = useState(null);
    const [notify, setNotify] = useState();
   

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

        new DepartmentMappingService().getDepartmentMappingByEmployeeId(employee_id).then(res =>{
            if (res.status === 200) {
                let counter = 1;
                const data=[];
                const temp = res.data.data
                // for (const key in temp) {
                //     data.push({
                //         department: temp[key].department,
                //         ticket_show_type: temp[key].ticket_show_type.replace("_"," "),
                //         is_active: temp[key].is_active,
                //         remark: temp[key].remark,
                //         updated_at: temp[key].updated_at,
                //         updated_by: temp[key].updated_by
                //     })
                // }
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
                        history({
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
    const employeeHandle = (e) =>{
        setData(prev=>({...prev,employee_id:e.value}));
    }

    const [rows,setRows] = useState([mappingData]);

    const handleAddRow = async()=>{
        setNotify(null)
        let flag=1;
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
            <PageHeader headerTitle="Eidt Department Mapping" />

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

                                {data && data.employee_id && <div className="col-sm-3">
                                    <button className="btn btn-sm btn-primary">Add Deparment</button>
                                </div>}

                            </div>

                            {data && data.employee_id && <div className=""  style={{width:"800px"}}>
                                <table
                                    className="table table-bordered mt-3 table-responsive"
                                    id="tab_logic"
                                >
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{width:"100px"}}> # </th>
                                            <th className="text-center" style={{width:"300px"}}> Department</th>
                                            <th className="text-center" style={{width:"300px"}}> Ticket Type Show </th>
                                            <th className="text-center" style={{width:"100px"}}> Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {rows && rows.map((item, idx) => (
                                        <tr>
                                            <td>{idx+1}</td>
                                            <td>                                                
                                                <Select options={departmentData} 
                                                    id={`department_id_`+idx}
                                                    name='department_id[]'
                                                    onChange={e=>departmentHandler(idx,e)}
                                                />
                                            </td>
                                            <td>
                                            <Select 
                                                options={[{'value':"MY_TICKETS", 'label':"My Tickets"},{'value':"DEPARTMENT_TICKETS", 'label':"Department Tickets"}]}
                                                id={`ticket_show_type_id_`+idx}
                                                name='ticket_show_type[]'
                                                onChange={e=>ticketShowHandler(idx,e)}   
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

export default EditDepartmentMappingComponent;
