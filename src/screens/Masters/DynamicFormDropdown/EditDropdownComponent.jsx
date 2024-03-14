





import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';



import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";


import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
import PageHeader from "../../../components/Common/PageHeader";


import Alert from "../../../components/Common/Alert";


import "react-data-table-component-extensions/dist/index.css";
import { Astrick } from "../../../components/Utilities/Style";
import *  as Validation from '../../../components/Utilities/Validation';


import {useDispatch,useSelector } from "react-redux";
import { getRoles } from "../../Dashboard/DashboardAction";
import { dynamicFormDropDownData } from "./Slices/DynamicFormDropDownAction";

export default function EditDropdownComponent({ match }) {

    const history = useNavigate();
    const {id}=useParams()
    const [master, setMaster] = useState();
    const [data, setData] = useState([{ id: null, label: null, value: null }]);
    const [notify, setNotify] = useState(null);
    const roleId = sessionStorage.getItem("role_id")

    
    const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });
const dispatch=useDispatch()

const checkRole = useSelector((DashbordSlice) =>DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 35));


    const handleChange = idx => e => {

    }

    const handleModal = (data) => {
        setModal(data);
    }

    const loadData = async () => {
        await new DynamicFormDropdownMasterService().getDropdownById(id).then(res => {
            if (res.status === 200) {
                if (res.data.status === 1) {
                    setMaster(res.data.data.master);
                    setData(res.data.data.dropdown);
                } else {
                    setNotify({ type: 'danger', message: res.data.message });
                }
            } else {
                setNotify({ type: 'danger', message: res.message });
                new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
            }
        }).catch(error => {
        
            
        })

       
        
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        await new DynamicFormDropdownMasterService().updateDropdown(id,formData).then(res => {
            if (res.status === 200) {
                if (res.data.status === 1) {
                    history({
                        pathname: `/${_base}/DynamicFormDropdown`,
                      
                    },{ state: { alert: { type: "success", message: res.data.message } }}
                    );

      dispatch(dynamicFormDropDownData());

                } else {
                    setNotify({ type: 'danger', message: res.data.message });
                }
            } else {
                setNotify({ type: 'danger', message: res.message });
                new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog("Status", "Get_Status", "INSERT", errorObject.data.message);
        })
    }




    const handleAddRow = () => {
        setData(prevState => [...prevState, { label: null, value: null }])
    }
    const handleRemoveSpecificRow = (idx) => () => {

        const temp = [];

        data.forEach((d, i) => {
            if (i != idx) {
                temp.push(d)
            }
        })
        setData(null);
        setData(temp);

      
        
    }

    
    const [items, setItems] = useState(data); // Initialize items state with data

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        const updatedItems = [...items]; // Create a copy of the state array
        updatedItems[index] = { ...updatedItems[index], label: value }; // Update the label property of the specific item
        setItems(updatedItems); 
        
    };


    useEffect(() => {
        loadData();
        if(!checkRole.length){
            dispatch(getRoles())
          }
    }, [])

    useEffect(()=>{
        if(checkRole && checkRole[0]?.can_update === 0){
          // alert("Rushi")
    
          window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
        }
      },[checkRole])

    return (
        <div className="container-xxl">
            {notify && <Alert alertData={notify} />}
            <PageHeader headerTitle="Edit Dropdown" />

            <div className='card mt-2'>
                <div className='card-body'>
                    <form onSubmit={handleSubmit}>
                        {/* {data && JSON.stringify(data)} */}
                        <div className='row'>
                            <div className='col-md-2'>
                                <label><b>Dropdown Name :<Astrick color="red" size="13px" /></b></label>
                            </div>
                            <div className='col-md-4'>

                                <input type="hidden" className='form-control form-control-sm'
                                    name='id'
                                    id='id'
                                    onKeyPress={e=> {Validation.CharactersNumbersOnly(e)}}
                                    defaultValue={master && master.id}
                                />

                                <input type="text" className='form-control form-control-sm'
                                    name='dropdown_name' id='dropdown_name'
                                    required
                                    defaultValue={master && master.dropdown_name}
                                />
                            </div>
                        </div>


                        <div className="form-group row mt-3">
                            <label className="col-sm-2 col-form-label">
                                <b>Status :</b>
                            </label>
                            <div className="col-sm-4">
                                <div className="row">
                                    <div className="col-md-2">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="is_active" id="is_active_1"
                                                value="1"
                                                defaultChecked={(master && master.is_active) ? true : ((!master) ? true : false)}
                                            />
                                            <label className="form-check-label" htmlFor="is_active_1">
                                                Active
                                            </label>
                                        </div>
                                    </div> &nbsp; &nbsp;
                                    <div className="col-md-1">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="is_active" id="is_active_0" value="0"
                                            // readOnly={(modal.modalData) ? false : true }
                                            defaultChecked={master && master.is_active==1 ? true :false}
                                            />
                                            <label className="form-check-label" htmlFor="is_active_0">
                                                Deactive
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='table-responsive'>
                            <table
                                className="table table-bordered mt-3 table-responsive"
                                id="tab_logic"
                            >
                                <thead>
                                    <tr>
                                        <th className="text-center"> # </th>
                                        {/* <th className="text-center"> Value </th> */}
                                        <th className="text-center"> Label </th>
                                        <th className="text-center"> Action </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.map((item, idx) => (
                                        
                                        <tr id={`addr_${idx}`} key={idx}>
                                            <td>{idx + 1}
                                                <input
                                                    type="hidden"
                                                    name="dropdown_id[]"
                                                    className="form-control form-control-sm" value={item.id}
                                                />

                                            </td>
                                           

                                         
                                         



<td>
<input
        type="text"
        key={idx}
        name="dropdown_values[]"
        id={`dropdown_values_${idx}`}
        className="form-control form-control-sm"
        onKeyPress={e => { Validation.CharactersNumbersSpeicalOnly(e) }}
        value={item.value} 
        
        onChange={(e) => {
          const updatedData = [...data];
          updatedData[idx].value = e.target.value;
          setData(updatedData);
        }}
        required
      />
      </td>


                                            <td>
                                                {idx == 0 &&
                                                    <button type="button" className="btn btn-sm btn-outline-primary pull-left"
                                                        onClick={handleAddRow}><i className="icofont-plus-circle"></i></button>
                                                }
                                                {idx != 0 &&
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
                        </div>

                        <div className='pull-right'>
                            <button type="submit" className="btn btn-sm btn-primary">Update</button>
                            <Link to={`/${_base}/DynamicFormDropdown`} className="btn btn-sm btn-danger text-white">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}