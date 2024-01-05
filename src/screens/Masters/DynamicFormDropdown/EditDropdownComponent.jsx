// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import { Modal } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import { _base } from "../../../settings/constants";
// import ErrorLogService from "../../../services/ErrorLogService";
// import StatusService from "../../../services/MastersService/StatusService";
// import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
// import PageHeader from "../../../components/Common/PageHeader";
// import Select from 'react-select';
// import Alert from "../../../components/Common/Alert";
// import DataTableExtensions from "react-data-table-component-extensions";
// import "react-data-table-component-extensions/dist/index.css";
// import { Astrick } from "../../../components/Utilities/Style";
// import *  as Validation from '../../../components/Utilities/Validation';

// export default function EditDropdownComponent({ match }) {

//     const history = useNavigate();
//     const [master, setMaster] = useState();
//     //const [data, setData] = useState([{ id: null, label: null, value: null }]);setData

//     const [data, setData] = useState({ dropdown_name: null, dropdown_values: [{ id: null, label: null, value: null }] });

//     const [notify, setNotify] = useState(null);

//     const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });

//     const handleChange = (e, idx) => {
//         setData(prev => {
//             const a = { ...prev }
//             a['dropdown_values'][idx].label = e.target.value;
//             a['dropdown_values'][idx].value = e.target.value;
//             return a;
//         })
//     }

//     const handleModal = (data) => {
//         setModal(data);
//     }


//     const loadData = async () => {
//         await new DynamicFormDropdownMasterService().getDropdownById(match.params.id).then(res => {
//             if (res.status === 200) {
//                 if (res.data.status === 1) {
//                     setMaster(res.data.data.master);
//                     //setData(res.data.data.dropdown);
//                     var x = [];
//                     for (var i = 0; i < res.data.data.dropdown.length; i++) {
//                         x.push({
//                             id: res.data.data.dropdown[i].id,
//                             label: res.data.data.dropdown[i].label,
//                             value: res.data.data.dropdown[i].value
//                         })
//                     }

//                     setData({
//                         dropdown_name: res.data.data.master.dropdown_name,
//                         is_active: res.data.data.master.is_active,
//                         dropdown_values: x
//                     });

//                 } else {
//                     setNotify({ type: 'danger', message: res.data.message });
//                 }
//             } else {
//                 setNotify({ type: 'danger', message: res.message });
//                 new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
//             }
//         }).catch(error => {
//             // const { response } = error;
//             // const { request, ...errorObject } = response;
//             // new ErrorLogService().sendErrorLog("Status", "Get_Status", "INSERT", errorObject.data.message);
//         })
//     }


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('dropdown_name', data.dropdown_name);
//         formData.append('is_active',data.is_active);

//         for(var i=0;i<data.dropdown_values.length;i++){
//             formData.append('dropdown_id['+i+']',data.dropdown_values[i].id);            
//             formData.append('dropdown_values['+i+']',data.dropdown_values[i].label);
//         }



//         await new DynamicFormDropdownMasterService().updateDropdown(match.params.id,formData).then(res => {
//             if (res.status === 200) {
//                 if (res.data.status === 1) {
//                     history({
//                         pathname: `/${_base}/DynamicFormDropdown`,
//                         state: { alert: { type: 'success', message: res.data.message } }
//                     });
//                 } else {
//                     setNotify({ type: 'danger', message: res.data.message });
//                 }
//             } else {
//                 setNotify({ type: 'danger', message: res.message });
//                 new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
//             }
//         }).catch(error => {
//             const { response } = error;
//             const { request, ...errorObject } = response;
//             new ErrorLogService().sendErrorLog("Status", "Get_Status", "INSERT", errorObject.data.message);
//         })
//     }




//     // const handleAddRow = () => {
//     //     setData(prevState => [...prevState, { label: null, value: null }])
//     // }
//     // const handleRemoveSpecificRow = (idx) => () => {

//     //     const temp = [];

//     //     data.forEach((d, i) => {
//     //         if (i != idx) {
//     //             temp.push(d)
//     //         }
//     //     })
//     //     setData(null);
//     //     setData(temp);

//     //     // if(idx > 0){
//     //     //     setData(
//     //     //         data.filter((_, i) => i !== idx)
//     //     //     );
//     //     // }
//     // }


//     const handleAddRow = () => {
//         if (data && data.dropdown_values.length) {
//           var x = {id: null, label: null, value: null };
//           setData(prev => {
//             const a = { ...prev };
//             const lastItem = a.dropdown_values[a.dropdown_values.length - 1];
//             if (lastItem && lastItem.label === null && lastItem.value === null) {
//               // If the last item is empty, don't add a new index
//               alert("Previous index is empty. Fill it before adding a new index.");
//               return a;
//             } else {
//               const newDropdownValues = [...a.dropdown_values, x];
//               a.dropdown_values = newDropdownValues;
//               return a;
//             }
//           });
//         } else {
//           alert("NO data");
//         }
//       };

//     const handleRemoveSpecificRow = (e, idx) => {
//         if (idx > 0) {
//             var i = data.dropdown_values.filter((_, i) => i !== idx);

//             setData(prev => {
//                 const a = { ...prev }
//                 a['dropdown_values'] = i;
//                 return a;
//             })

//         }
//     }

//     const handleAutoChange = (e, index) => {
//         setData(prev => {
//             const newPrev = { ...prev }
//             newPrev[e.target.name] = e.target.value
//             return newPrev
//         })
//     }

//     const handleDropDownAutoChange = (e, index) => {
//       setData(prev => {
//             const newPrev = { ...prev }
//             newPrev.dropdown_values[index].label = e.target.value
//             return newPrev
//         })
//     }

//     useEffect(() => {
//         loadData();
//     }, [])

//     return (
//         <div className="container-xxl">
//             {notify && <Alert alertData={notify} />}
//             <PageHeader headerTitle="Edit Dropdown" />

//             <div className='card mt-2'>
//                 <div className='card-body'>
//                     <form onSubmit={handleSubmit}>
//                         {/* {data && JSON.stringify(data)} */}
//                         <div className='row'>
//                             <div className='col-md-2'>
//                                 <label><b>Dropdown Name :<Astrick color="red" size="13px" /></b></label>
//                             </div>
//                             <div className='col-md-4'>

//                                 <input type="hidden" className='form-control form-control-sm'
//                                     name='id'
//                                     id='id'
//                                     onKeyPress={e => { Validation.CharactersNumbersOnly(e) }}
//                                     defaultValue={master && master.id}
//                                 />

//                                 <input type="text" className='form-control form-control-sm'
//                                     name='dropdown_name' id='dropdown_name'
//                                     required
//                                     onChange={e => handleAutoChange(e)}
//                                     defaultValue={master && master.dropdown_name}

//                                 />
//                             </div>
//                         </div>
//                         <div className="form-group row mt-3">
//                             <label className="col-sm-2 col-form-label">
//                                 <b>Status :</b>
//                             </label>
//                             <div className="col-sm-4">
//                                 <div className="row">
//                                     <div className="col-md-2">
//                                         <div className="form-check">
//                                             <input className="form-check-input" type="radio" name="is_active" id="is_active_1"
//                                                 value="1"
//                                                 defaultChecked={(master && master.status == 1) ? true : ((!master) ? true : false)}
//                                                 onChange={e => handleAutoChange(e)}
//                                             />
//                                             <label className="form-check-label" htmlFor="status">
//                                                 Active
//                                             </label>
//                                         </div>
//                                     </div> &nbsp; &nbsp;
//                                     <div className="col-md-1">
//                                         <div className="form-check">
//                                             <input className="form-check-input" type="radio" name="is_active" id="is_active_0" value="0"
//                                                 // readOnly={(modal.modalData) ? false : true }
//                                                 defaultChecked={master && master.status == 0 ? true : false}
//                                                 onChange={e => handleAutoChange(e)}
//                                             />
//                                             <label className="form-check-label" htmlFor="is_active_0">
//                                                 Deactive
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className='table-responsive'>
//                             <table
//                                 className="table table-bordered mt-3 table-responsive"
//                                 id="tab_logic"
//                             >
//                                 <thead>
//                                     <tr>
//                                         <th className="text-center"> # </th>
//                                         {/* <th className="text-center"> Value </th> */}
//                                         <th className="text-center"> Label </th>
//                                         <th className="text-center"> Action </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {data && data.dropdown_values.length && data.dropdown_values.map((item, idx) => (
//                                         <tr id={`addr_${idx}`} key={idx}>
//                                             <td>{idx + 1}
//                                                 <input
//                                                     type="hidden"
//                                                     name="dropdown_id[]"
//                                                     className="form-control form-control-sm" defaultValue={item.id}
//                                                 />
//                                             </td>
//                                             {/* <td>
//                                                 <input
//                                                     type="text"
//                                                     name="value[]"
//                                                     className="form-control form-control-sm"
//                                                     required
//                                                     defaultValue={item.value}
//                                                     onChange={e => handleDropDownAutoChange(e, idx)}


//                                                 />
//                                             </td> */}
//                                             <td>
//                                                 <input
//                                                     type="text"
//                                                     name="label[]"
//                                                     className="form-control form-control-sm"
//                                                     defaultValue={item.label}
//                                                     onInput={e=>handleChange(e,idx)}
//                                                 />
//                                             </td>
//                                             <td>
//                                                 {idx == 0 &&
//                                                     <button type="button" className="btn btn-sm btn-outline-primary pull-left"
//                                                         onClick={handleAddRow}><i className="icofont-plus-circle"></i></button>
//                                                 }
//                                                 {idx != 0 &&
//                                                     <button type="button" className="btn btn-outline-danger btn-sm"
//                                                     onClick={e => handleRemoveSpecificRow(e, idx)} >
//                                                         <i className="icofont-ui-delete"></i>
//                                                     </button>
//                                                 }
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div className='pull-right'>
//                             <button type="submit" className="btn btn-sm btn-primary">Update</button>
//                             <Link to={`/${_base}/DynamicForm`} className="btn btn-sm btn-danger text-white">Cancel</Link>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     )
// }





import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import StatusService from "../../../services/MastersService/StatusService";
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from 'react-select';
import Alert from "../../../components/Common/Alert";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { Astrick } from "../../../components/Utilities/Style";
import *  as Validation from '../../../components/Utilities/Validation';
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";

export default function EditDropdownComponent({ match }) {

    const history = useNavigate();
    const {id}=useParams()
    const [master, setMaster] = useState();
    const [data, setData] = useState([{ id: null, label: null, value: null }]);
    const [notify, setNotify] = useState(null);
    const roleId = sessionStorage.getItem("role_id")
    const [checkRole, setCheckRole] = useState(null)
    const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });

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
            // const { response } = error;
            // const { request, ...errorObject } = response;
            // new ErrorLogService().sendErrorLog("Status", "Get_Status", "INSERT", errorObject.data.message);
        })

        await new ManageMenuService().getRole(roleId).then((res) => {
            if (res.status === 200) {
              // setShowLoaderModal(false);
      
              if (res.data.status == 1) {
                const getRoleId = sessionStorage.getItem("role_id");
                setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
              }
            }
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
                        state: { alert: { type: 'success', message: res.data.message } }
                    });
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

        // if(idx > 0){
        //     setData(
        //         data.filter((_, i) => i !== idx)
        //     );
        // }
    }

    useEffect(() => {
        loadData();
    }, [])

    useEffect(()=>{
        if(checkRole && checkRole[36].can_update === 0){
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
                                                    className="form-control form-control-sm" defaultValue={item.id}
                                                />

                                            </td>
                                            {/* <td>
                                                <input
                                                    type="text"
                                                    name="value[]"
                                                    className="form-control form-control-sm"
                                                    required
                                                    defaultValue={item.value}
                                                />
                                            </td> */}
                                            <td>
                                                <input
                                                    type="text"
                                                    name="label[]"
                                                    className="form-control form-control-sm"
                                                    defaultValue={item.label}
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
                            <Link to={`/${_base}/DynamicForm`} className="btn btn-sm btn-danger text-white">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}