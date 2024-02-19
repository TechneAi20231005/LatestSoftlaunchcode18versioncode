// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { _base } from '../../settings/constants';
// import ErrorLogService from "../../services/ErrorLogService";
// import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
// import PageHeader from "../../components/Common/PageHeader";
// import Select from 'react-select';
// import *  as Validation from '../../components/Utilities/Validation';
// import Alert from "../../components/Common/Alert";
// import { Astrick } from '../../components/Utilities/Style';
// import RoleService from "../../services/MastersService/RoleService";

// import { CustomerDropdown } from '../Masters/CustomerMaster/CustomerComponent';
// import { RoleDropdown } from '../Masters/RoleMaster/RoleComponent';
// import { useDispatch, useSelector } from "react-redux";
// import { getAllMenu, getRoleData, postMenuData } from "../Masters/RoleMaster/RoleMasterAction";
// import RoleMasterSlice from "../Masters/RoleMaster/RoleMasterSlice";


// const ManageMenu = ({match}) => {

//     const filterData=useSelector(RoleMasterSlice=>RoleMasterSlice.rolemaster)

   

//     const {id} =useParams()
//     const dispatch=useDispatch()
//     const roleId =id
//     const navigate = useNavigate();
//     const [notify, setNotify] = useState(null);
//     const [accountFor, setAccountFor] = useState();

//     const [menus, setMenus] = useState({ role_id: roleId, menu: null });
    
//     const [data, setData] = useState();

//     const [roleDropdown, setRoleDropdown] = useState(null)

//     const loadData = async () => {

//         //1. CAll ROLE API
//         // dispatch(getRoleData())

        
//         // await new RoleService().getRole().then(res => {
//         //     if (res.status === 200) {
//         //         console.log(res);
//         //         setRoleDropdown(res.data.data.filter(d => d.is_active === 1).map(d => ({ value: d.id, label: d.role })))
//         //     }
//         // }).catch(error => {
//         //     const { response } = error;
//         //     const { request, ...errorObject } = response;
//         //     new ErrorLogService().sendErrorLog("Department", "Get_Department", "INSERT", errorObject.data.message);
//         // })

//         dispatch(getAllMenu())
//         await new ManageMenuService().getAllMenu().then(res => {
//             if (res.status === 200) {
//                 if (res.data.status === 1) {
//                     const data = res.data.data;
//                     let menu = [];
//                     data.forEach(d => {
//                         menu.push({ 'id': d.id, 'name': d.name, 'can_read': 0, 'can_create': 0, 'can_update': 0, 
                    
//                     });
//                     })
//                  new ManageMenuService().getRole(roleId).then(res1 => {
                   
//                         if (res1.status === 200) {
//                             if (res1.data.status == 1) 
//                             {
//                                 const data1 = res1.data.data;
//                                 let menu1 = menu;
//                                 data1.forEach((d, i1) => {
//                                     menu1.forEach((m, i2) => {
//                                         if (d.menu_id === m.id) {
//                                             menu[i2].can_read = d.can_read;
//                                             menu[i2].can_create = d.can_create;
//                                             menu[i2].can_update = d.can_update;
                                            
//                                         }
//                                     })
//                                 })
// //                               
//                                 setMenus(prev => ({ ...prev, 'menu': menu }));
//                             } else {
//                                                     setMenus(prev => ({ ...prev, 'menu': menu }));
//                                 setNotify({ type: 'danger', message: res.data.message });
//                                 setNotify(null)
//                             }
//                         }
//                     })            

                    
//                 }
//             }
//         }).catch(error => {
//             const { response } = error;
//             const { request, ...errorObject } = response;
//             new ErrorLogService().sendErrorLog("Status", "Create_Status", "INSERT", errorObject.data.message);
//         })


//         // setNotify(null)
//         // //setMenus(prev => ({ ...prev, 'role_id': roleId }));
//         // await new ManageMenuService().getRole(roleId).then(res => {
//         //     // console.log(e.value)
//         //     if (res.status === 200) {
//         //         if (res.data.status == 1) {
//         //             const data = res.data.data;
//         //             console.log("MENU",data);
//         //             let menu = menus.menu;
//         //             console.log(menu);
//         //             data.forEach((d, i1) => {
//         //                 menu.forEach((m, i2) => {
//         //                     if (d.menu_id === m.id) {
//         //                         menu[i2].can_read = d.can_read;
//         //                         menu[i2].can_create = d.can_create;
//         //                         menu[i2].can_update = d.can_update;
//         //                         menu[i2].can_delete = d.can_delete;
//         //                     }
//         //                 })
//         //             })
//         //             setMenus(prev => ({ ...prev, 'menu': null }));
//         //             setMenus(prev => ({ ...prev, 'menu': menu }));
//         //         } else {
//         //             setNotify({ type: 'danger', message: res.data.message });
//         //             setNotify(null)
//         //         }
//         //     }
//         // }).catch(error => {
//         //     const { response } = error;
//         //     const { request, ...errorObject } = response;
//         //     new ErrorLogService().sendErrorLog("Menu_Mangement", "Create_Menu", "INSERT", errorObject.data.message);
//         // })
//     }

 
//     const handleForm = async (e) => {
//         e.preventDefault();


//         dispatch(postMenuData(menus)).then((res)=>{
//             if(res.payload.data.status==1&&res.payload.status==200){
//                 navigate(`/${_base}/Role`)

//             }
          
//         })

    
//         // await new ManageMenuService().postData(menus).then(res => {
//         //     setNotify(null);
//         //     if (res.status === 200) {
//         //         if (res.data.status == 1) {
               
//         //             document.getElementById("MenuMangementForm").reset();
//         //             loadData();
//         //             history({
//         //                 pathname:`/${_base}/Role`,
                      
                        
//         //             },{  state: {alert : {id: Math.random(), type: 'success', message:res.data.message} }});
//         //         } else {
//         //             setNotify({ type: 'danger', message: res.data.message });
//         //         }
//         //     } else {
//         //         setNotify({ type: 'danger', message: res.message });
//         //         new ErrorLogService().sendErrorLog("Menu_Management", "Create_Menu", "INSERT", res.message);
//         //     }
//         // }).catch(error => {
//         //     const { response } = error;
//         //     const { request, ...errorObject } = response;
//         //     new ErrorLogService().sendErrorLog("Menu_Management", "Create_Menu", "INSERT", errorObject.data.message);
//         // })
//     }

//     // const checkRole = async (e) => {
//     //     setNotify(null)
//     //     setMenus(prev => ({ ...prev, 'role_id': e.value }));
//     //     // if(menus.role_id)
//     //     // {   
//     //     await new ManageMenuService().getRole(e.value).then(res => {
//     //         console.log(e.value)
//     //         if (res.status === 200) {
//     //             if (res.data.status === 1) {
//     //                 // setData(null)
//     //                 // setData(res.data.data)
//     //                 const data = res.data.data;
//     //                 let menu = menus.menu;
//     //                 data.forEach((d, i1) => {
//     //                     menu.forEach((m, i2) => {
//     //                         if (d.menu_id === m.id) {
//     //                             menu[i2].can_read = d.can_read;
//     //                             menu[i2].can_create = d.can_create;
//     //                             menu[i2].can_update = d.can_update;
//     //                             menu[i2].can_delete = d.can_delete;
//     //                         }
//     //                     })
//     //                 })
//     //                 setMenus(prev => ({ ...prev, 'menu': null }));
//     //                 setMenus(prev => ({ ...prev, 'menu': menu }));
//     //             } else {
//     //                 setNotify({ type: 'danger', message: res.data.message });
//     //             }
//     //         }
//     //     }).catch(error => {
//     //         const { response } = error;
//     //         const { request, ...errorObject } = response;
//     //         new ErrorLogService().sendErrorLog("Menu_Mangement", "Create_Menu", "INSERT", errorObject.data.message);
//     //     })
//     //     // }else{
//     //     //     setNotify({type: 'warning', message:"Select Role Before Process !!!"});
//     //     // }
//     // }

//     const selectAllRow = (index) => {
//         const menu = menus;
//         // menu.forEach((m,i)=>{
//         //     if(e.target.value==m.id){
//         //         menu[i].can_read=1;
//         //         menu[i].can_create=1;
//         //         menu[i].can_update=1;
//         //         menu[i].can_delete=1;
//         //     }
//         // }) 
//         // menus[index] = {...menus[index], can_read:1};
//         // this.setState({ markers });  
//         // setMenus(prev=>([...prev,menus]))
//         // setMenus(null);
//         // setMenus(menu);
//     }
//     const checkBoxHandle = (id, key, e) => {
//         let temp_state = [...menus.menu];
//         let actualIndex = null;
//         temp_state.forEach((ele, index) => {
//             if (ele.id == id) {
//                 actualIndex = index;
//             }
//         })

//         let temp_element = { ...menus.menu[actualIndex] };
//         // console.log(temp_element);
//         if (key == 'can_create') {
//             temp_element.can_create = temp_element.can_create == 1 ? 0 : 1;
//         }
//         if (key == 'can_read') {
//             temp_element.can_read = temp_element.can_read == 1 ? 0 : 1;
//         }
//         if (key == 'can_update') {
//             temp_element.can_update = temp_element.can_update == 1 ? 0 : 1;
//         }
//         // if (key == 'can_delete') {
//         //     temp_element.can_delete = temp_element.can_delete == 1 ? 0 : 1;
//         // }
//         temp_state[actualIndex] = temp_element;

//         setMenus(prev => ({ ...prev, 'menu': temp_state }));
//     }

//     const selectAll = (id = null, e) => {

//         if (id) {
//             let temp_state = [...menus.menu];

//             let actualIndex = null;
//             temp_state.forEach((ele, index) => {
//                 if (ele.id == id) {
//                     actualIndex = index;
//                 }
//             })
//             let temp_element = { ...menus.menu[actualIndex] };
//             temp_element.can_create = e.target.checked == true ? 1 : 0;
//             temp_element.can_read = e.target.checked == true ? 1 : 0;
//             temp_element.can_update = e.target.checked == true ? 1 : 0;
//             temp_element.can_delete = e.target.checked == true ? 1 : 0;
//             temp_state[actualIndex] = temp_element;
//             setMenus(prev => ({ ...prev, 'menu': temp_state }));
//         } else {
//             let temp_state = [...menus.menu];

//             temp_state.forEach((ele, index) => {

//                 let temp_element = { ...menus.menu[index] };
//                 temp_element.can_create = e.target.checked == true ? 1 : 0;
//                 temp_element.can_read = e.target.checked == true ? 1 : 0;
//                 temp_element.can_update = e.target.checked == true ? 1 : 0;
//                 temp_element.can_delete = e.target.checked == true ? 1 : 0;
//                 temp_state[index] = temp_element;
//                 setMenus(prev => ({ ...prev, 'menu': temp_state }));
//             })
//         }
//     }






    


//     useEffect(() => {
//         loadData();
//         //    setNotify(null);
//     }, [])



//     return (
//         <div className="container-xxl">
//             <PageHeader/>
//             {notify && <Alert alertData={notify} />}
//             <div className="row clearfix g-3">
//                 <div className="col-sm-12">
//                     <form onSubmit={handleForm} id="MenuMangementForm" encType='multipart/form-data' method="post">
//                         <div className='card'>
//                             <div className='card-header bg-primary text-white p-2'>
//                                 <h5>Menu Management</h5>
//                             </div>
//                             <div className='card-body'>
//                                     <input type="hidden"
//                                     value={roleId}
//                                     />
//                                 {/* <div className="form-group row mt-3">
//                                     <label className="col-sm-2 col-form-label">
//                                         <b>Select Role : <Astrick color='red' /></b>
//                                     </label>
//                                     <input 
//                                     type="text"
//                                     readOnly
                                    
//                                     /> */}
//                                         {/* <RoleDropdown id="role_id" name="role_id" getChangeValue={(e) => checkRole(e)} required="true" /> */}
//                                         {/* {roleDropdown &&
//                                             <Select
//                                                 options={roleDropdown}
//                                                 id="role_id"
//                                                 name="role_id"
//                                             />
//                                         } */}
//                                 {/* </div> */}
//                                 {/* {menus && JSON.stringify(menus)} */}
//                                 {menus  &&
//                                     <div className="form-group row ">
//                                         <div className="table-responsive" >
//                                             <div className="table-responsive">
//                                                 <table className="table custom-table">
//                                                     <thead>
//                                                         <tr>
//                                                             <th>Menu</th>
//                                                             <th className="text-center">
//                                                                 Select All
//                                                             </th>
//                                                             <th className="text-center">Read</th>
//                                                             <th className="text-center">Create</th>
//                                                             <th className="text-center">Update</th>
//                                                             {/* <th className="text-center">Delete</th> */}
//                                                         </tr>
//                                                         <tr>
//                                                             <th></th>
//                                                             <th className="text-center " >
//                                                                 <input 
//                                                                 className="mb-0 mr-4" type="checkbox" id={`select_all`}
//                                                                     defaultValue={1}
//                                                                     onChange={e => selectAll(null, e)}
//                                                                 />
//                                                             </th>
//                                                             <th className="text-center"></th>
//                                                             <th className="text-center"></th>
//                                                             <th className="text-center"></th>
//                                                             {/* <th className="text-center"></th> */}
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {menus.menu && menus.menu.map((ele, index) => {
             
//                                                             return <tr key={index}>
//                                                                 <td className="fw-bold">
//                                                                     <input className="form-control" type="hidden" id={`can_read_` + index} name="module_id[]"
//                                                                         defaultValue={ele.id} />{ele.name}
//                                                                 </td>

//                                                                 <td className="text-center">
//                                                                     <input className="form-check-input" type="checkbox" id={`select_row_` + index}
//                                                                         defaultValue={1}
//                                                                         onChange={e => selectAll(ele.id, e)}
//                                                                     />
//                                                                 </td>

//                                                                 <td className="text-center">
//                                                                     <input className="form-check-input" type="checkbox" id={`can_read_` + index} name="can_read[]"
//                                                                         defaultValue={ele.can_read} checked={ele.can_read == 1 ? true : false}
//                                                                         onChange={e => checkBoxHandle(ele.id, 'can_read', e)}
//                                                                     />
//                                                                 </td>
//                                                                 <td className="text-center">
//                                                                     <input className="form-check-input" type="checkbox" id={`can_create_` + index} name="can_create[]"
//                                                                         value={ele.can_create} checked={ele.can_create == 1 ? true : false}
//                                                                         onChange={e => checkBoxHandle(ele.id, 'can_create', e)}
//                                                                     />
//                                                                 </td>
//                                                                 <td className="text-center">
//                                                                     <input className="form-check-input" type="checkbox" name="can_update[]"
//                                                                         value={ele.can_update} checked={ele.can_update == 1 ? true : false}
//                                                                         onChange={e => checkBoxHandle(ele.id, 'can_update', e)}
//                                                                     />
//                                                                 </td>
//                                                                 {/* <td className="text-center">
//                                                                     <input className="form-check-input" type="checkbox" name="can_delete[]"
//                                                                         value={ele.can_delete} checked={ele.can_delete == 1}
//                                                                         onChange={e => checkBoxHandle(ele.id, 'can_delete', e)}
//                                                                     />
//                                                                 </td> */}
//                                                             </tr>
//                                                         })}


//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 }
//                             </div>  {/* CARD BODY */}
//                         </div> {/* CARD */}

//                         <div className="mt-3" style={{ 'textAlign': 'right' }}>
//                             <button type="submit" className="btn btn-primary">
//                                 Submit
//                             </button>
//                             <Link to={`/${_base}/MenuManage`}
//                                 className="btn btn-danger text-white">
//                                 Cancel
//                             </Link>
//                         </div>
//                     </form>
//                 </div>
//             </div >
//         </div >
//     )
// }

// export default ManageMenu;







