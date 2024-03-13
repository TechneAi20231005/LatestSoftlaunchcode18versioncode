// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import ProjectService from "../../../services/ProjectManagementService/ProjectService";
// import CustomerService from "../../../services/MastersService/CustomerService";
// import { _base } from "../../../settings/constants";
// import ErrorLogService from "../../../services/ErrorLogService";
// import Alert from "../../../components/Common/Alert";
// import PageHeader from "../../../components/Common/PageHeader";
// import { CustomerDropdown } from "../../Masters/CustomerMaster/CustomerComponent";
// import { UserDropdown } from "../../Masters/UserMaster/UserComponent";
// import { Astrick } from "../../../components/Utilities/Style";
// import * as Validation from "../../../components/Utilities/Validation";
// import Select from "react-select";
// import DesignationService from "../../../services/MastersService/DesignationService";
// import { useRef } from "react";
// import UserService from "../../../services/MastersService/UserService";
// import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
// import { useDispatch, useSelector } from "react-redux";
// import { getRoles } from "../../Dashboard/DashboardAction";
// import DashboardSlice from "../../Dashboard/DashboardSlice";
// import ProjectMasterSlice from "./ProjectMasterSlice";
// import { postprojectData } from "./ProjectMasterAction";

// // import BaseSelect from "react-select";
// // import {FixRequiredSelect} from '../../../components/Common/RequiredSelect';

// export default function CreateProjectComponent({ match }) {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const checkRole = useSelector((DashboardSlice) =>
//     DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 11)
//   );
//   // const notify = useSelector((ProjectMasterSlice) => ProjectMasterSlice.projectMaster.notify);

//   console.log(checkRole);
//   const [notify, setNotify] = useState(null);
//   const [customer, setCustomer] = useState(null);
//   console.log(customer)
//   const customerRef = useRef("");
//   const fileInputRef = useRef(null);

//   const roleId = sessionStorage.getItem("role_id");
//   // const [checkRole, setCheckRole] = useState(null)
//   const handleForm = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     // setNotify(null);
//     var flag = 1;
//     var a = JSON.stringify(Object.fromEntries(formData));

//     var selectCustomer = formData.getAll("customer_id");
//     var selectOwner = formData.getAll("project_owner[]");
//     if (selectCustomer == "") {
//       flag = 0;
//       //setNotify(null);
//       alert("Please Select Customer");
//       e.preventDefault();
//       //setNotify({ type: 'danger', message: 'Please Select Country' })
//     }
//     if (selectOwner == "") {
//       flag = 0;
//       alert("Please Select Owner");
//     }

//     e.preventDefault();
//     const image = e.target.logo.value;
//     if (!image) {
//       setError("image is required");
//       // return false;
//     } else {
//       // setError(null)
//     }
//     if (!image.match(/\.(jpg|jpeg|png|gif)$/)) {
//       setError("select valid image format.");
//       // return false;
//     } else {
//       // setError(true)
//       setError("");
//       // return true
//     }

//     if (flag === 1) {
//       // dispatch(postprojectData(formData)).then((res) => {
//       //   console.log("res", res);
//       //   if (res?.payload?.data?.status == 1 && res?.payload?.status == 200) {
//       //     navigate(`/${_base}/Project`);
//       //   }
//       //   loadData()
//       // });

//       dispatch(postprojectData(formData)).then((res) => {
//         console.log(res)
//         if (res?.payload?.data?.status === 1 && res?.payload?.status == 200) {
//           setNotify({ type: 'success', message: res?.payload?.data?.message })
//           loadData()
//           setTimeout(() => {
//             navigate(`/${_base}/Project`, {
//               state: { alert: { type: "success", message: res?.payload?.data?.message } },
//             });
//           }, 3000);
//         }else {
//           setNotify({ type: 'danger', message:  res?.payload?.data?.message  })
//       }

//       });

//       //   await new ProjectService().postProject(formData).then((res) => {
//       //     if (res.status === 200) {
//       //       if (res.data.status === 1) {
//       //         history({
//       //           pathname: `/${_base}/Project`,

//       //         },{              state: { alert: { type: 'success', message: res.data.message } }});
//       //       } else {
//       //         setNotify({ type: "danger", message: res.message });
//       //         new ErrorLogService().sendErrorLog(
//       //           "Project",
//       //           "Create_Project",
//       //           "INSERT",
//       //           res.message
//       //         );
//       //       }
//       // }})
//     }
//   };

//   // const handleChange =(e)=>{
//   //   console.log("e==>",e)
//   //   e.preventDefault();
//   //   const image = e.target.logo.value;
//   //   if (!image) {
//   //     setError('image is required');
//   //     return false;
//   //   } else {
//   //     setError(null)
//   //   }
//   //   if (!image.match(/\.(jpg|jpeg|png|gif)$/)) {
//   //     setError('select valid image format.');
//   //     return false;
//   //   } else {
//   //     setError(null)
//   //   }
//   //

//   function handleFileChange(event) {
//     const file = event.target.files[0];
//     if (file.size > 2 * 1024 * 1024) {
//       // File size exceeds 2MB, notify the user and clear the input field
//       alert("File size must be less than 2MB.");
//       event.target.value = null; // Clear the input field
//     }
//   }

//   const [ba, setBa] = useState(null);
//   const [dev, setDev] = useState(null);
//   const [tester, setTester] = useState(null);
//   const [users, setUsers] = useState(null);

//   const loadData = async () => {
//     await new CustomerService().getCustomer().then((res) => {
//       console.log("res",res)
//       if (res.status == 200) {
//         if (res.data.status == 1) {
//           // const data=res.data.data.filter(d=>d.is_active==1);
//           // const select= res.data.data.map(d=> ({ value: d.id, label: d.type_name}));
//           // setCustomerType(data);
//           // setCustomerTypeDropdown(select);
//           setCustomer(
//             res.data.data
//               .filter((d) => d.is_active === 1)
//               .map((d) => ({ value: d.id, label: d.name }))
//           );
//         }
//       }
//     });

//     dispatch(getRoles());

//     // await new ManageMenuService().getRole(roleId).then((res) => {
//     //   if (res.status === 200) {

//     //     if (res.data.status == 1) {
//     //       const getRoleId = sessionStorage.getItem("role_id");
//     //       setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
//     //     }
//     //   }
//     // })

//     // await new DesignationService().getdesignatedDropdown().then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       const deta = res.data.data
//     //       setBa(deta.BA.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name  + " " + "(" + d.id + ")" })));
//     //       setDev(deta.DEV.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
//     //       setTester(deta.TESTER.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
//     //     }
//     //   }
//     // })

//     await new UserService().getUser().then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           const user = res.data.data.filter((d) => d.is_active == 1 && d.account_for == "SELF");
//           setBa(
//             user
//               .filter((d) => d.is_active == 1)
//               .map((d) => ({
//                 value: d.id,
//                 label: d.first_name + " " + d.last_name,
//               }))
//           );
//           user.sort((a, b) => {
//             if (a.first_name && b.first_name) {
//               return a.first_name.localeCompare(b.first_name);
//             }
//             return 0;
//           });
//           setUsers(
//             user.map((d) => ({
//               value: d.id,
//               label: d.first_name + " " + d.last_name + " " + "(" + d.id + ")",
//             }))
//           );
//         }
//       }
//     });
//   };

//   // const Select = props => (
//   //   <FixRequiredSelect
//   //     {...props}
//   //     SelectComponent={BaseSelect}
//   //     options={customer}
//   //   />
//   // );
//   // const handleFocus = (e)=>{
//   //   if(customerRef.current.props.value === null){
//   //   alert("please select customer")
//   //   }
//   // }

//   useEffect(() => {
//     loadData();
//     // console.log(customerRef.current.props.value);
//   }, []);

//   useEffect(() => {
//     if (checkRole && checkRole[0]?.can_create === 0) {
//       // alert("Rushi")

//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
//     }
//   }, [checkRole]);

//   const [error, setError] = useState(false);

//   return (
//     <div className="container-xxl">
//       {notify && <Alert alertData={notify} />}

//       <PageHeader headerTitle="Create Project" />

//       <div className="row clearfix g-3">
//         <div className="col-sm-12">
//           <form onSubmit={handleForm}>
//             <div className="card mt-2">
//               <div className="card-body">
//                 <div className="form-group row mt-2">
//                   <label className="col-sm-2 col-form-label">
//                     <b>
//                       Select Customer : <Astrick color="red" size="13px" />
//                     </b>
//                   </label>
//                   <div className="col-sm-4">
//                     <Select
//                       options={customer}
//                       required
//                       id="customer_id"
//                       name="customer_id"
//                       ref={customerRef}
//                     // onBlur={handleFocus}
//                     />
//                   </div>

//                   <label
//                     className="col-sm-2 col-form-label"
//                     style={{ textAlign: "right" }}
//                   >
//                     <b>
//                       Project Name : <Astrick color="red" size="13px" />
//                     </b>
//                   </label>
//                   <div className="col-sm-4">
//                     <input
//                       type="text"
//                       className="form-control form-control-sm"
//                       id="project_name"
//                       name="project_name"
//                       required={true}
//                       onKeyPress={(e) => {
//                         Validation.addressFieldOnly(e);
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group row mt-2">
//                   <label className="col-sm-2 col-form-label">
//                     <b>
//                       Select Owner : <Astrick color="red" size="13px" />
//                     </b>
//                   </label>
//                   <div className="col-sm-4">
//                     {users && (
//                       <Select
//                         options={users}
//                         id="project_owner"
//                         name="project_owner[]"
//                         // condition="CUSTOMER"
//                         required={true}
//                         isMulti={true}
//                       />
//                     )}
//                   </div>

//                   <label
//                     className="col-sm-2 col-form-label"
//                     style={{ textAlign: "right" }}
//                   >
//                     <b>Project Logo : </b>
//                   </label>
//                   <div className="col-sm-4">
//                     <input
//                       type="file"
//                       className="form-control form-control-sm"
//                       id="logo"
//                       name="logo"
//                       //  accept="image/*"
//                       ref={fileInputRef}
//                       onChange={handleFileChange}
//                     />
//                     <small style={{ color: "#2167d2" }}>
//                       Please upload only .png/.jpeg/.jpg image format
//                     </small>
//                     {error && error ? (
//                       <p style={{ color: "red" }} className="text-error">
//                         {error}
//                       </p>
//                     ) : (
//                       ""
//                     )}
//                   </div>
//                 </div>

//                 <div className="form-group row mt-2">
//                   <label className="col-sm-2 col-form-label">
//                     <b>Reviewer : </b>
//                   </label>
//                   {ba && (
//                     <div className="col-sm-4">
//                       <Select
//                         id="project_reviewer"
//                         name="project_reviewer[]"
//                         options={ba}
//                         isMulti
//                       />
//                     </div>
//                   )}
//                 </div>
//                 {/*
//                 <div className="form-group row mt-2">
//                   <label className="col-sm-2 col-form-label">
//                     <b>Developer : </b>
//                   </label>
//                   {dev &&
//                     <div className="col-sm-4">
//                       <Select id="dev_id" name="dev_id"
//                         options={dev}
//                       />
//                     </div>
//                   }
//                 </div>

//                 <div className="form-group row mt-2">
//                   <label className="col-sm-2 col-form-label">
//                     <b>Tester :</b>
//                   </label>
//                   {tester &&
//                     <div className="col-sm-4">
//                       <Select id="tester_id" name="tester_id"
//                         options={tester}
//                       />
//                     </div>
//                   }
//                 </div> */}

//                 <div className="form-group row mt-2">
//                   <label htmlFor="" className="col-sm-2 col-form-label">
//                     <b>
//                       Description : <Astrick color="red" size="13px" />
//                     </b>
//                   </label>
//                   <div className="col-sm-10">
//                     <textarea
//                       className="form-control form-control-sm"
//                       id="description"
//                       name="description"
//                       rows="6"
//                       required={true}
//                       onKeyPress={(e) => {
//                         Validation.addressFieldOnly(e);
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group row mt-3">
//                   <label className="col-sm-2 col-form-label">
//                     <b>GIT Project URL : </b>
//                   </label>
//                   <div className="col-sm-10">
//                     <input
//                       type="text"
//                       className="form-control form-control-sm"
//                       id="git_url"
//                       name="git_url"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group row mt-3">
//                   <label className="col-sm-2 col-form-label">
//                     <b>API Document Link : </b>
//                   </label>
//                   <div className="col-sm-10">
//                     <input
//                       type="text"
//                       className="form-control form-control-sm"
//                       id="api_document_link"
//                       name="api_document_link"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group row mt-3">
//                   <label className="col-sm-2 col-form-label">
//                     <b>Remark: </b>
//                   </label>
//                   <div className="col-sm-10">
//                     <input
//                       type="text"
//                       className="form-control form-control-sm"
//                       id="remark"
//                       name="remark"
//                     />
//                   </div>
//                 </div>

//                 {/* <div className="form-group row mt-3">
//                   <label className="col-sm-2 col-form-label">
//                     <b>Status : </b>
//                   </label>
//                   <div className="col-sm-10">
//                     <div className="row">
//                       <div className="col-md-2">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="is_active"
//                             id="is_active_1"
//                             value="1"
//                             defaultChecked={true}
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor="is_active_1"
//                           >
//                             Active
//                           </label>
//                         </div>
//                       </div>
//                       <div className="col-md-1">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="is_active"
//                             id="is_active_0"
//                             value="0"
//                             readonly={true}
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor="is_active_0"
//                           >
//                             Deactive
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div> */}
//               </div>{" "}
//               {/* CARD BODY */}
//             </div>
//             {/* CARD */}

//             <div className="mt-3" style={{ textAlign: "right" }}>
//               <button type="submit" className="btn btn-sm btn-primary">
//                 Submit
//               </button>
//               <Link
//                 to={`/${_base}/Project`}
//                 className="btn btn-sm btn-danger text-white"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectService from "../../../services/ProjectManagementService/ProjectService";
import CustomerService from "../../../services/MastersService/CustomerService";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import Alert from "../../../components/Common/Alert";
import PageHeader from "../../../components/Common/PageHeader";
import { CustomerDropdown } from "../../Masters/CustomerMaster/CustomerComponent";
import { UserDropdown } from "../../Masters/UserMaster/UserComponent";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Select from "react-select";
import DesignationService from "../../../services/MastersService/DesignationService";
import { useRef } from "react";
import UserService from "../../../services/MastersService/UserService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";

// import BaseSelect from "react-select";
// import {FixRequiredSelect} from '../../../components/Common/RequiredSelect';

export default function CreateProjectComponent({ match }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  const [customer, setCustomer] = useState(null);
  console.log("customer", customer);
  const customerRef = useRef("");
  const fileInputRef = useRef(null);

  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);
  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setNotify(null);
    var flag = 1;
    var a = JSON.stringify(Object.fromEntries(formData));

    var selectCustomer = formData.getAll("customer_id");
    var selectOwner = formData.getAll("project_owner[]");
    if (selectCustomer == "") {
      flag = 0;
      //setNotify(null);
      alert("Please Select Customer");
      e.preventDefault();
      //setNotify({ type: 'danger', message: 'Please Select Country' })
    }
    if (selectOwner == "") {
      flag = 0;
      alert("Please Select Owner");
    }

    e.preventDefault();
    const image = e.target.logo.value;
    if (!image) {
      setError("image is required");
      // return false;
    } else {
      // setError(null)
    }
    if (!image.match(/\.(jpg|jpeg|png|gif)$/)) {
      setError("select valid image format.");
      // return false;
    } else {
      // setError(true)
      setError("");
      // return true
    }

    if (flag === 1) {
      //   await new ProjectService().postProject(formData).then((res) => {
      //     if (res.status === 200) {
      //       if (res.data.status === 1) {
      //         history({
      //           pathname: `/${_base}/Project`,

      //         },{              state: { alert: { type: 'success', message: res.data.message } }});
      //       }

      //       else {
      //         setNotify({ type: "danger", message: res.message });
      //         new ErrorLogService().sendErrorLog(
      //           "Project",
      //           "Create_Project",
      //           "INSERT",
      //           res.message
      //         );
      //       }
      // }})
      // }

      await new ProjectService()
        .postProject(formData)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              history(
                {
                  pathname: `/${_base}/Project`,
                },
                {
                  state: {
                    alert: { type: "success", message: res.data.message },
                  },
                }
              );
            } else {
              setNotify({ type: "danger", message: res.data.message });
            }
          } else {
            setNotify({ type: "danger", message: res.message });
            new ErrorLogService().sendErrorLog(
              "Module",
              "Create_Module",
              "INSERT",
              res.message
            );
          }
        })
        .catch((error) => {
          if (error.response) {
            const { response } = error;
            const { request, ...errorObject } = response || {};
            setNotify({ type: "danger", message: errorObject.data.message });
            new ErrorLogService().sendErrorLog(
              "Module",
              "Create_Module",
              "INSERT",
              errorObject.data.message
            );
          } else {
            console.error(
              "Error object does not contain expected 'response' property:",
              error
            );
          }
        });
    }
  };

  // const handleChange =(e)=>{
  //   console.log("e==>",e)
  //   e.preventDefault();
  //   const image = e.target.logo.value;
  //   if (!image) {
  //     setError('image is required');
  //     return false;
  //   } else {
  //     setError(null)
  //   }
  //   if (!image.match(/\.(jpg|jpeg|png|gif)$/)) {
  //     setError('select valid image format.');
  //     return false;
  //   } else {
  //     setError(null)
  //   }
  //

  const [ba, setBa] = useState(null);
  const [dev, setDev] = useState(null);
  const [tester, setTester] = useState(null);
  const [users, setUsers] = useState(null);
  console.log("users", users);

  const loadData = async () => {
    await new CustomerService().getCustomer().then((res) => {
      console.log(res);
      if (res.status == 200) {
        if (res.data.status == 1) {
          // const data=res.data.data.filter(d=>d.is_active==1);
          // const select= res.data.data.map(d=> ({ value: d.id, label: d.type_name}));
          // setCustomerType(data);
          // setCustomerTypeDropdown(select);
          setCustomer(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.name }))
          );
        }
      }
    });

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        // setShowLoaderModal(false);

        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
        }
      }
    });

    // await new DesignationService().getdesignatedDropdown().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const deta = res.data.data
    //       setBa(deta.BA.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name  + " " + "(" + d.id + ")" })));
    //       setDev(deta.DEV.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
    //       setTester(deta.TESTER.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
    //     }
    //   }
    // })

    await new UserService().getUser().then((res) => {
      console.log("userssss", res);

      if (res.status === 200) {
        if (res.data.status == 1) {
          const user = res.data.data.filter((d) => d.is_active == 1);
          setBa(
            res.data.data
              .filter((d) => d.is_active == 1 && d.account_for == "SELF")
              .map((d) => ({
                value: d.id,
                label: d.first_name + " " + d.last_name,
              }))
          );
          user.sort((a, b) => {
            if (a.first_name && b.first_name) {
              return a.first_name.localeCompare(b.first_name);
            }
            return 0;
          });
          setUsers(
            res.data.data
              .filter((d) => d.is_active == 1 && d.account_for == "SELF")
              .map((d) => ({
                value: d.id,
                label: d.first_name + " " + d.last_name,
              }))
          );
        }
      }
    });
  };

  // const Select = props => (
  //   <FixRequiredSelect
  //     {...props}
  //     SelectComponent={BaseSelect}
  //     options={customer}
  //   />
  // );
  // const handleFocus = (e)=>{
  //   if(customerRef.current.props.value === null){
  //   alert("please select customer")
  //   }
  // }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      // File size exceeds 2MB, notify the user and clear the input field
      alert("File size must be less than 2MB.");
      event.target.value = null; // Clear the input field
    }
  }

  useEffect(() => {
    loadData();
    // console.log(customerRef.current.props.value);
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[19].can_create === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  const [error, setError] = useState(false);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Create Project" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <form onSubmit={handleForm}>
            <div className="card mt-2">
              <div className="card-body">
                <div className="form-group row mt-2">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Select Customer : <Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <Select
                      options={customer}
                      required
                      id="customer_id"
                      name="customer_id"
                      ref={customerRef}
                      // onBlur={handleFocus}
                    />
                  </div>

                  <label
                    className="col-sm-2 col-form-label"
                    style={{ textAlign: "right" }}
                  >
                    <b>
                      Project Name : <Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="project_name"
                      name="project_name"
                      required={true}
                      onKeyPress={(e) => {
                        Validation.addressFieldOnly(e);
                      }}
                    />
                  </div>
                </div>

                <div className="form-group row mt-2">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Select Owner : <Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    {users && (
                      <Select
                        options={users}
                        id="project_owner"
                        name="project_owner[]"
                        // condition="CUSTOMER"
                        required={true}
                        isMulti={true}
                      />
                    )}
                  </div>

                  <label
                    className="col-sm-2 col-form-label"
                    style={{ textAlign: "right" }}
                  >
                    <b>Project Logo : </b>
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      id="logo"
                      name="logo"
                      accept=".png, .jpeg, .jpg" // Accept only specific image file formats
                      //  accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <small style={{ color: "#2167d2" }}>
                      Please upload only .png/.jpeg/.jpg image format
                    </small>
                    {error && error ? (
                      <p style={{ color: "red" }} className="text-error">
                        {error}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="form-group row mt-2">
                  <label className="col-sm-2 col-form-label">
                    <b>Reviewer : </b>
                  </label>
                  {ba && (
                    <div className="col-sm-4">
                      <Select
                        id="project_reviewer"
                        name="project_reviewer[]"
                        options={ba}
                        isMulti
                      />
                    </div>
                  )}
                </div>
                {/*
                <div className="form-group row mt-2">
                  <label className="col-sm-2 col-form-label">
                    <b>Developer : </b>
                  </label>
                  {dev &&
                    <div className="col-sm-4">
                      <Select id="dev_id" name="dev_id"
                        options={dev}
                      />
                    </div>
                  }
                </div>


                <div className="form-group row mt-2">
                  <label className="col-sm-2 col-form-label">
                    <b>Tester :</b>
                  </label>
                  {tester &&
                    <div className="col-sm-4">
                      <Select id="tester_id" name="tester_id"
                        options={tester}
                      />
                    </div>
                  }
                </div> */}

                <div className="form-group row mt-2">
                  <label htmlFor="" className="col-sm-2 col-form-label">
                    <b>
                      Description : <Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-10">
                    <textarea
                      className="form-control form-control-sm"
                      id="description"
                      name="description"
                      rows="6"
                      required={true}
                      onKeyPress={(e) => {
                        Validation.addressFieldOnly(e);
                      }}
                    />
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>GIT Project URL : </b>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="git_url"
                      name="git_url"
                    />
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>API Document Link : </b>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="api_document_link"
                      name="api_document_link"
                    />
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>Remark: </b>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="remark"
                      name="remark"
                    />
                  </div>
                </div>

                {/* <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>Status : </b>
                  </label>
                  <div className="col-sm-10">
                    <div className="row">
                      <div className="col-md-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="is_active"
                            id="is_active_1"
                            value="1"
                            defaultChecked={true}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="is_active_1"
                          >
                            Active
                          </label>
                        </div>
                      </div>
                      <div className="col-md-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="is_active"
                            id="is_active_0"
                            value="0"
                            readonly={true}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="is_active_0"
                          >
                            Deactive
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>{" "}
              {/* CARD BODY */}
            </div>
            {/* CARD */}

            <div className="mt-3" style={{ textAlign: "right" }}>
              <button type="submit" className="btn btn-sm btn-primary">
                Submit
              </button>
              <Link
                to={`/${_base}/Project`}
                className="btn btn-sm btn-danger text-white"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
