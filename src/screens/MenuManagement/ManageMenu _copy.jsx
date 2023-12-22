import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { _base } from '../../settings/constants';
import ErrorLogService from "../../services/ErrorLogService";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import PageHeader from "../../components/Common/PageHeader";
import Select from 'react-select';
import *  as Validation from '../../components/Utilities/Validation';
import Alert from "../../components/Common/Alert";
import { Astrick } from '../../components/Utilities/Style';

import { CustomerDropdown } from '../Masters/CustomerMaster/CustomerComponent';
import { RoleDropdown } from '../Masters/RoleMaster/RoleComponent';

const ManageMenu_copy = () => {
    const history = useNavigate();
    const [notify, setNotify] = useState(null);

    const [accountFor, setAccountFor] = useState();

    const [menus, setMenus] = useState();

    const [data, setData] = useState();

    const loadData = async () => {
        await new ManageMenuService().getAllMenu().then(res => {
            if (res.status === 200) {
                if (res.data.status === 1) {
                    setMenus(null)
                    setMenus(res.data.data)
                }
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog("Status", "Create_Status", "INSERT", errorObject.data.message);
        })
    }

    const [inputList, setInputList] = useState([
        {
            can_read: "",
            can_update: "",
            can_create: "",
            can_delete: "",
            can_print: "",
            can_export: "",
        },
      ]);

    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };

    const handleForm = async(e) => {
        e.preventDefault();
        const form=new FormData(e.target);

        var formObj = {};
        for (var pair of form.entries()) {
        formObj[pair[0]] = pair[1]
        }
        
        await new ManageMenuService().postData(form).then(res=>{
            if(res.status===200){
                if(res.data.status===1){
                    document.getElementById("MenuMangementForm").reset();
                    history.push({
                        pathname:`/${_base}/MenuManage`,
                        // state: {alert : {type: 'success', message:res.data.message} }
                    });
                }else{
                    setNotify({type: 'danger', message:res.data.message});
                }
            }else{
                setNotify({type: 'danger', message:res.message});
                new ErrorLogService().sendErrorLog("Menu_Management","Create_Menu","INSERT",res.message);
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response; 
            new ErrorLogService().sendErrorLog("Status","Create_Status","INSERT",errorObject.data.message);
        })
    }

    const checkRole = async (e) => {
  
        await new ManageMenuService().getRole(e.target.value).then(res => {
            if (res.status === 200) {
                if (res.data.status === 1) {
                    // setData(null)
                    // setData(res.data.data)
                    // console.log(res.data.data[0]);

                    const data=res.data.data;


                }else{
                    setData(null)
                }
            }
        }).catch(error => {
            // const { response } = error;
            // const { request, ...errorObject } = response;
            // new ErrorLogService().sendErrorLog("Status", "Create_Status", "INSERT", errorObject.data.message);
        })
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Menu Management" />
            {notify && <Alert alertData={notify} />}
            <div className="row clearfix g-3">
                <div className="col-sm-12">
                    <form onSubmit={handleForm} id="MenuMangementForm" encType='multipart/form-data' method="post">
                        <div className='card'>
                            <div className='card-header bg-primary text-white p-2'>
                                <h5>Menu Management</h5>
                            </div>
                            <div className='card-body'>

                                <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label">
                                        <b>Select Role : <Astrick color='red' /></b>
                                    </label>
                                    <div className="col-sm-4">
                                        <RoleDropdown id="role_id" name="role_id" getChangeValue={(e) => checkRole(e)} required="true"/>
                                    </div>
                                </div>

                                <div className="form-group row mt-3">
                                    <div className="table-responsive" >
                                        <div className="table-responsive">
                                            <table className="table table-striped custom-table">
                                                <thead>
                                                    <tr>
                                                        <th>Menu</th>
                                                        <th>Sub Menu</th>
                                                        <th className="text-center">Read</th>
                                                        <th className="text-center">Write</th>
                                                        <th className="text-center">Edit</th>
                                                        <th className="text-center">Delete</th>
                                                        <th className="text-center">Import</th>
                                                        <th className="text-center">Export</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {!data && menus && menus.map((ele, index) => {
                                                        return <tr key={index}>
                                                            <td className="fw-bold">{ele.name}</td>
                                                        
                                                            {/* <input type="hidden" name="module[]" value={ele.id} /> */}
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_read[]" value={ele.id} 
                                                                    // checked={data && data[index]['menu_id'] == ele.id && data[index].can_read == '1' ? 'true' : null } id={`flexCheckDefault${index}`} onChange={(e) => handleInputChange(e, index)} 
                                                                />
                                                            </td>
                                                            <td>
                                                            </td>
                                                            {/* <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_create[]" value={ele.id} checked={data && data[index].menu_id == ele.id && data[index].can_create == '1' ? 'true' : null } id={`flexCheckDefault${index}`} onChange={(e) => handleInputChange(e, index)} />
                                                            </td>
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_update[]" value={ele.id} id={`flexCheckDefault${index}`} checked={data && data[index].menu_id == ele.id && data[index].can_update == '1' ? 'true' : null } onChange={(e) => handleInputChange(e, index)} />
                                                            </td>
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_delete[]" value={ele.id} id={`flexCheckDefault${index}`} checked={data && data[index].menu_id == ele.id && data[index].can_delete == '1' ? 'true' : null } onChange={(e) => handleInputChange(e, index)} />
                                                            </td>
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_print" value={ele.id} id={`flexCheckDefault${index}`} onChange={(e) => handleInputChange(e, index)} />
                                                            </td>
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_export" value={ele.id} id={`flexCheckDefault${index}`} onChange={(e) => handleInputChange(e, index)} />
                                                            </td> */}
                                                        </tr>
                                                    })}
                                                    {data && menus && menus.map((ele, index) => {
                                                        return <tr key={index}>
                                                            <td className="fw-bold">{ele.name}</td>
                                                        
                                                            {/* <input type="hidden" name="module[]" value={ele.id} /> */}
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_read[]" value={ele.id} 
                                                                    checked={data && data[index].menu_id == ele.id && data[index].can_read == '1' ? 'true' : null } id={`flexCheckDefault${index}`} onChange={(e) => handleInputChange(e, index)} 
                                                                />
                                                            </td>
                                                            <td>
                                                            </td>
                                                            {/* <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_create[]" value={ele.id} checked={data && data[index].menu_id == ele.id && data[index].can_create == '1' ? 'true' : null } id={`flexCheckDefault${index}`} onChange={(e) => handleInputChange(e, index)} />
                                                            </td>
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_update[]" value={ele.id} id={`flexCheckDefault${index}`} checked={data && data[index].menu_id == ele.id && data[index].can_update == '1' ? 'true' : null } onChange={(e) => handleInputChange(e, index)} />
                                                            </td>
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_delete[]" value={ele.id} id={`flexCheckDefault${index}`} checked={data && data[index].menu_id == ele.id && data[index].can_delete == '1' ? 'true' : null } onChange={(e) => handleInputChange(e, index)} />
                                                            </td>
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_print" value={ele.id} id={`flexCheckDefault${index}`} onChange={(e) => handleInputChange(e, index)} />
                                                            </td>
                                                            <td className="text-center">
                                                                <input className="form-check-input" type="checkbox" name="can_export" value={ele.id} id={`flexCheckDefault${index}`} onChange={(e) => handleInputChange(e, index)} />
                                                            </td> */}
                                                        </tr>
                                                    })}


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>  {/* CARD BODY */}
                        </div> {/* CARD */}

                        <div className="mt-3" style={{ 'textAlign': 'right' }}>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                            <Link to={`/${_base}/User`}
                                className="btn btn-danger text-white">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ManageMenu_copy