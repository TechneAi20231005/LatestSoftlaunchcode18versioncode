// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import ErrorLogService from "../../../services/ErrorLogService";
// import CustomerService from "../../../services/MastersService/CustomerService";
// import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
// import CustomerType from "../../../services/MastersService/CustomerTypeService";
// import CountryService from "../../../services/MastersService/CountryService";
// import StateService from "../../../services/MastersService/StateService";
// import CityService from "../../../services/MastersService/CityService";
// import PageHeader from "../../../components/Common/PageHeader";
// import Alert from "../../../components/Common/Alert";
// import { Astrick } from "../../../components/Utilities/Style";
// import * as Validation from "../../../components/Utilities/Validation";
// import { _base } from "../../../settings/constants";
// import Select from "react-select";
// import { UseDispatch,useDispatch,useSelector } from "react-redux"
// import { dashboardSlice, hideNotification } from "../../Dashboard/DashbordSlice";
// import { getCityData, getCountryDataSort, getCustomerByIdData, getCustomerData, getCustomerType, getRoles, getStateData, getStateDataSort, updateCustomerData } from "../../Dashboard/DashboardAction";

// function EditCustomer({ match }) {
//   const history = useNavigate();
//   const [notify, setNotify] = useState(null);

//   const { id } = useParams();
//   const customerId = id;

//   // const [data, setData] = useState(null);
//   // const [customerType, setCustomerType] = useState(null);

//   const [country, setCountry] = useState(null);
//   // const [countryDropdown, setCountryDropdown] = useState(null);
//   const [state, setState] = useState(null);
//   // const [stateDropdown, setStateDropdown] = useState(null);
//   const [city, setCity] = useState(null);
//   const [cityDropdown, setCityDropdown] = useState(null);

//   const [updateStatus, setUpdateStatus] = useState({});

//   const [stateName, setStateName] = useState(null);
//   const [cityName, setCityName] = useState(null);

//   const stateRef = useRef(null);
//   const navigate = useNavigate();

//   const roleId = sessionStorage.getItem("role_id");
//   // const [checkRole, setCheckRole] = useState(null);
//   const [stateDropdownData, setStateDropdownData] = useState(false);
//   const [cityDropdownData, setCityDropdownData] = useState(false);
//   console.log(cityDropdownData);

//   const dispatch = useDispatch()
//   const data = useSelector(dashboardSlice=>dashboardSlice.dashboard.customerByIdData)
//   const customerType = useSelector(dashboardSlice=>dashboardSlice.dashboard.customerTypeData)
//   const countryDropdown = useSelector(dashboardSlice=>dashboardSlice.dashboard.filteredCountryData)

//   const stateDropdown = useSelector(dashboardSlice=>dashboardSlice.dashboard.stateData)
//   const filterStateData= useSelector(dashboardSlice=>dashboardSlice.dashboard.filteredStateData)
//   const AllcityDropDownData = useSelector((dashboardSlice) => dashboardSlice.dashboard.cityData);
//   const sortedCityData = useSelector((dashboardSlice) => dashboardSlice.dashboard.sortedCityData);

// console.log("a",sortedCityData);
// const checkRole = useSelector((DashboardSlice) =>DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 2));

// const Notify = useSelector(
//   (dashboardSlice) => dashboardSlice.dashboard.notify
// );

//   // const handleDependent = (e, name) => {
//   //   setData({
//   //     ...data,
//   //     [name]: e.value,
//   //   });
//   // };
//   const loadData = async () => {
//     // const data = [];
//     // await new CustomerService()
//     //   .getCustomerById(customerId)
//     //   .then((res) => {
//     //     if (res.status === 200) {
//     //       if (res.data.status === 1) {
//     //         setData(res.data.data);
//     //       } else {
//     //         setNotify({ type: "danger", message: res.data.message });
//     //       }
//     //     } else {
//     //       setNotify({ type: "danger", message: res.message });
//     //     }
//     //   })
//     //   .catch((error) => {
//     //     const { response } = error;
//     //     const { request, ...errorObject } = response;
//     //     new ErrorLogService().sendErrorLog(
//     //       "Customer",
//     //       "Get_Customer",
//     //       "INSERT",
//     //       errorObject.data.message
//     //     );
//     //   });

//     // await new CustomerType().getCustomerType().then((res) => {
//     //   if (res.status === 200) {
//     //     let counter = 1;
//     //     const data = res.data.data;
//     //     setCustomerType(
//     //       data
//     //         .filter((d) => d.is_active == 1)
//     //         .map((d) => ({ label: d.type_name, value: d.id }))
//     //     );
//     //   }
//     // });

//     //  **************************Country load data**************************************
//     // await new CountryService().getCountrySort().then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       setCountry(res.data.data.filter((d) => d.is_active === 1));
//     //       setCountryDropdown(
//     //         res.data.data
//     //           .filter((d) => d.is_active == 1)
//     //           .map((d) => ({ value: d.id, label: d.country }))
//     //       );
//     //     }
//     //   }
//     // });
//     //  ************************** State load data**************************************
//     // await new StateService().getStateSort().then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       setState(res.data.data.filter((d) => d.is_active === 1));
//     //       setStateDropdown(
//     //         res.data.data
//     //           .filter((d) => d.is_active === 1)
//     //           .map((d) => ({
//     //             value: d.id,
//     //             label: d.state,
//     //             country_id: d.country_id,
//     //           }))
//     //       );
//     //     }
//     //   }
//     // });
//     //  ************************** city load data**************************************
//     // await new CityService().getCity().then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       setCity(res.data.data.filter((d) => d.is_active === 1));
//     //       setCityDropdown(
//     //         res.data.data
//     //           .filter((d) => d.is_active === 1)
//     //           .map((d) => ({
//     //             value: d.id,
//     //             label: d.city,
//     //             state_id: d.state_id,
//     //           }))
//     //       );
//     //     }
//     //   }
//     // });

//     // await new ManageMenuService().getRole(roleId).then((res) => {
//     //   if (res.status === 200) {
//     //     if (res.data.status == 1) {
//     //       const getRoleId = sessionStorage.getItem("role_id");
//     //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//     //     }
//     //   }
//     // });
//   };

//   const [contactError, setContactError] = useState(null);
//   const [contactErr, setContactErr] = useState(false);
//   const [contactNumber, setContactNumber] = useState(null);



//   const handleMobileValidation = (e) => {
//     const contactNumber = e.target.value;
//     setContactNumber(contactNumber);
//     if (
//       contactNumber.charAt(0) == "9" ||
//       contactNumber.charAt(0) == "8" ||
//       contactNumber.charAt(0) == "7" ||
//       contactNumber.charAt(0) == "6"
//     ) {
//       setContactErr(false);
//       setContactError("");
//     } else if (contactNumber.length === 10) {
//       setContactErr(true);
//       setContactError("Invalid Mobile Number");
//     } else {
//       setContactError("");
//     }
//   };

//   const handleForm = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     var flag = 1;
//     // var a = JSON.stringify(Object.fromEntries(formData))
//     // console.log(a)

//     var customerType = formData.getAll("customer_type_id");
//     var selectEmail = formData.getAll("email_id");
//     var selectCountry = formData.getAll("country_id");
//     var selectState = formData.getAll("state_id");
//     var selectCity = formData.getAll("city_id");

//     if (
//       customerType == "" ||
//       selectEmail == "" ||
//       selectCountry == "" ||
//       selectState == "" ||
//       selectCity == ""
//     ) {
//       flag = 0;
//       setNotify(null);
//       if (customerType == "") {
//         // setNotify(null);
//         alert("Please Select Customer Type");
//         // setNotify({ type: 'danger', message: "Please Select Customer Type" });
//       } else if (selectEmail == "") {
//         // setNotify(null);
//         alert("Please Select Email");
//         // setNotify({ type: 'danger', message: "Please Select Customer Type" });
//       } else if (selectCountry == "") {
//         // setNotify(null);
//         alert("Please Select Country");
//         // setNotify({ type: 'danger', message: "Please Select Country" });
//       } else if (selectState == "") {
//         // setNotify(null);
//         alert("Please Select State");
//         // setNotify({ type: 'danger', message: "Please Select State" });
//       } else if (selectCity == "") {
//         // setNotify(null);
//         alert("Please Select City");
//         // setNotify({ type: 'danger', message: "Please Select City" });
//       } else {
//         // setNotify(null);
//         alert("Please Check Form");
//         // setNotify({ type: 'danger', message: "Please Check Form" });
//       }
//     }

//     if (flag == 1) {
//       setNotify(null);
//       dispatch(updateCustomerData({id:customerId, payload:formData})).then((res)=>{
//         if(res.payload.data.status===1 && res.payload.status === 200){
//           navigate(`/${_base}/Customer`)
//           dispatch(getCustomerData())
//         }
//       })
//       // .then((res)=>{
//       //   if(res.payload.data.status===1 && res.payload.status === 200){
//       //     navigate(`/${_base}/Customer`)
//       //   }
//       // })
//       // await new CustomerService()
//       //   .updateCustomer(customerId, formData)
//       //   .then((res) => {
//       //     if (res.status === 200) {
//       //       if (res.data.status === 1) {
//       //         history({
//       //           pathname: `/${_base}/Customer`,
             
//       //         },
//       //        { state: {
//       //           type: "success", message: res.data.message ,
//       //        }
//       //       } 
//       //         );
//       //       } else {
//       //         setNotify({ type: "danger", message: res.data.message });
//       //       }
//       //     } else {
//       //       setNotify({ type: "danger", message: res.message });
//       //       new ErrorLogService().sendErrorLog(
//       //         "Customer",
//       //         "Create_Customer",
//       //         "INSERT",
//       //         res.message
//       //       );
//       //     }
//       //   })
//       //   .catch((error) => {
//       //     const { response } = error;
//       //     const { request, ...errorObject } = response;
//       //     setNotify({ type: "danger", message: "Request Error !!!" });
//       //     new ErrorLogService().sendErrorLog(
//       //       "Customer",
//       //       "Create_Customer",
//       //       "INSERT",
//       //       errorObject.data.message
//       //     );
//       //   });
//     }
//   };



//   const handleDependentChange = (e, type) => {
//     if (type == "COUNTRY") {
//       // setStateDropdown(state.filter(d => d.country_id == e.value).map(d => ({ value: d.id, label: d.state })));
//       // setStateDropdown(
//       //   state
//       //     .filter((d) => d.country_id == e.value)
//       //     .map((d) => ({ value: d.id, label: d.state }))
//       // );
//       setStateDropdownData(stateDropdown?.filter((filterState) => filterState.country_id === e.value)?.map((d) => ({ value: d.id, label: d.state })))
//       // console.log("state", stateDropdown.filter((filterState) => filterState.country_id === e.value).map((d) => ({ value: d.id, label: d.state })))
//       // setCityDropdownData(AllcityDropDownData.filter((filterState) => filterState.state_id===e.value).map((d) => ({ value: d.id, label: d.city })))
//       //  console.log("city11",AllcityDropDownData.filter((filterState) => filterState.state_id===e.value).map((d) => ({ value: d.id, label: d.city })))

//       // console.log("state dropdown" , stateDropdown(state.filter(d => d.country_id == e.value).map(d => ({ value: d.id, label: d.state }))))
//       //   const newStatus = { ...updateStatus, statedrp: 1 };
//       //   setUpdateStatus(newStatus);
//       //   setStateName(null);
//       //   setCityName(null);
//     }
//     if (type == "STATE") {
//       // setCityDropdown(city.filter(d => d.state_id == e.value).map(d => ({ value: d.id, label: d.city })));
//       setCityDropdownData(AllcityDropDownData?.filter((filterState) => filterState.state_id === e.value)?.map((d) => ({ value: d.id, label: d.city })))

//       // setCityDropdown(
//       //   city
//       //     .filter((d) => d.state_id == e.value)
//       //     .map((d) => ({ value: d.id, label: d.city }))
//       // );
//       // const newStatus = { ...updateStatus, citydrp: 1 };
//       // setUpdateStatus(newStatus);
//       setStateName(e);
//       setCityName(null);
//     }
//   };

//   const handleCountryChange = (e) => {
//     // setStateDropdown(
//     //   state
//     //     .filter((d) => d.country_id == e.value)
//     //     .map((d) => ({ value: d.id, label: d.state }))
//     // );
//     setStateDropdownData(stateDropdown?.filter((filterState) => filterState.country_id === e.value)?.map((d)=>({ value: d.id, label: d.state })))

//     const newStatus = { ...updateStatus, statedrp: 1 };
//     setUpdateStatus(newStatus);
//     setStateName(null);
//     setCityName(null);
//     setCityDropdown(null);
//   };


//   console.log("s",stateDropdownData);

//   const handleStateChange = (e) => {
//     console.log("e",e);
//     // setCityDropdown(
//     //   city
//     //     .filter((d) => d.state_id == e.value)
//     //     .map((d) => ({ value: d.id, label: d.city }))
//     // 
//     // setCityDropdownData(AllcityDropDownData.filter((filterState) => filterState.state_id===e.value).map((d) => ({ value: d.id, label: d.city })))

    
//     // const newStatus = { ...updateStatus, citydrp: 1 };
//     // setUpdateStatus(newStatus);
//     // setStateName(e);
//     // setCityName(null);
//        setCityDropdownData(AllcityDropDownData.filter((filterState) => filterState.state_id===e.value).map((d) => ({ value: d.id, label: d.city })))

//     const newStatus = { ...updateStatus, citydrp: 1 };
//     setUpdateStatus(newStatus);
//     setStateName(e);
//     setCityName(null);
//   }
  

//   console.log("city",cityDropdownData);
//   // useEffect(() => {
//   //   if (Notify) {
//   //     const timer = setTimeout(() => {
//   //       dispatch(hideNotification());
//   //     }, 5000); // Adjust the timeout duration as needed
//   //     return () => clearTimeout(timer);
//   //   }
//   // }, [Notify, dispatch]);

//   useEffect(() => {
//     if(!data.length){
//     dispatch(getCustomerByIdData(customerId))}
//     if(!customerType.length){
//       dispatch(getCustomerType())}
//       if( !countryDropdown.length){
//         dispatch(getCountryDataSort())
  
//       }

//       dispatch(getStateDataSort())
//       if(!stateDropdown.length){
//         dispatch(getStateData());
    
//         }
        
//         if(!checkRole.length){
//           dispatch(getRoles())
    
//         }

//         if(!AllcityDropDownData.length){
//           dispatch(getCityData())
    
//         }

//   }, []);

//   console.log("dataqq",data)

//   useEffect(() => {
//     if (
//       data !== null &&
//       stateDropdown !== null &&
//       updateStatus.statedrp === undefined
//     ) {
//       // setStateDropdownData((prev) =>
//       //   prev?.filter((stateItem) => stateItem.country_id === data.country_id)
//       // );
//       const newStatus = { ...updateStatus, statedrp: 1 };
//       setUpdateStatus(newStatus);
//       setStateName(
//         data &&
//           stateDropdown &&
//           stateDropdown.filter((d) => d.value == data.state_id)
//       );
//     }
//   }, [data, stateDropdown]);

//   useEffect(() => {
//     if (
//       data !== null &&
//       cityDropdown !== null &&
//       updateStatus.citydrp === undefined
//     ) {
//       setCityDropdown((prev) =>
//         prev.filter((stateItem) => stateItem.state_id === data.state_id)
//       );
//       const newStatus = { ...updateStatus, citydrp: 1 };
//       setUpdateStatus(newStatus);
//       setCityName(
//         data &&
//           cityDropdown &&
//           cityDropdown.filter((d) => d.value == data.city_id)
//           ? data &&
//               cityDropdown &&
//               cityDropdown.filter((d) => d.value == data.city_id)
//           : cityName
//       );
//     }
//     if (checkRole && checkRole[0]?.can_update === 0) {
//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
//     }
//   }, [data, cityDropdown, checkRole]);

//   return (
//     <div className="container-xxl">
//       {Notify && <Alert alertData={Notify} />}

//       <PageHeader headerTitle="Edit Customer" />

//       <div className="row clearfix g-3">
//         <div className="col-sm-12">
//           {data && (
//             <form onSubmit={handleForm}>
//               {/* ********* MAIN DATA ********* */}
//               <div className="card mt-2">
//                 <div className="card-header bg-primary text-white p-2">
//                   <h5>Customer Details</h5>
//                 </div>
//                 <div className="card-body">
//                   <div className="form-group row">
//                     <label className="col-sm-2 col-form-label">
//                       <b>
//                         Customer Name : <Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     <div className="col-sm-4">
//                       <input
//                         type="text"
//                         className="form-control form-control-sm"
//                         id="name"
//                         name="name"
//                         placeholder="Customer Name"
//                         maxLength={30}
//                         required
//                         defaultValue={data ? data.name : null}
//                         onKeyPress={(e) => {
//                           Validation.CharactersOnly(e);
//                         }}
//                       />
//                     </div>
//                   </div>

//                   <div className="form-group row mt-3">
//                     <label className="col-sm-2 col-form-label">
//                       <b>
//                         Customer Type :<Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     <div className="col-sm-4">
//                       {customerType && data.customer_type_id && (
//                         <Select
//                           options={customerType}
//                           name="customer_type_id"
//                           id="customer_type_id"
//                           required
//                           defaultValue={
//                             data &&
//                             customerType.filter(
//                               (d) => d.value == data.customer_type_id
//                             )
//                           }
//                         />
//                       )}
//                     </div>
//                   </div>

//                   <div className="form-group row mt-3">
//                     <label className="col-sm-2 col-form-label">
//                       <b>
//                         Email Address :<Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     <div className="col-sm-4">
//                       <input
//                         type="text"
//                         className="form-control form-control-sm"
//                         id="email_id"
//                         name="email_id"
//                         placeholder="Email Address"
//                         required
//                         defaultValue={data.email_id}
//                         onKeyPress={(e) => {
//                           Validation.emailOnly(e);
//                         }}
//                         pattern="^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$"
//                       />
//                     </div>
//                   </div>

//                   <div className="form-group row mt-3">
//                     <label className="col-sm-2 col-form-label">
//                       <b>
//                         Contact Number : <Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     <div className="col-sm-4">
//                       <input
//                         type="text"
//                         className="form-control form-control-sm"
//                         id="contact_no"
//                         name="contact_no"
//                         placeholder="Contact Number"
//                         defaultValue={data.contact_no}
//                         minLength={10}
//                         maxLength={10}
//                         onKeyPress={(e) => {
//                           Validation.NumbersOnly(e);
//                         }}
//                         onChange={handleMobileValidation}
//                         autoComplete="off"
//                       />
//                     </div>
//                   </div>
//                   {contactError && (
//                     <small
//                       style={{
//                         color: "red",
//                         position: "relative",
//                         left: "12.375rem",
//                       }}
//                     >
//                       {contactError}
//                     </small>
//                   )}
//                   <div className="form-group row mt-3">
//                     <label className="col-sm-2 col-form-label">
//                       <b>Remark :</b>
//                     </label>
//                     <div className="col-sm-4">
//                       <input
//                         type="text"
//                         className="form-control form-control-sm"
//                         id="remark"
//                         name="remark"
//                         maxLength={50}
//                         defaultValue={data.remark}
//                       />
//                     </div>
//                   </div>
//                   <div className="form-group row mt-3">
//                     <label className="col-sm-2 col-form-label">
//                       <b>Status :</b>
//                     </label>
//                     <div className="col-sm-4">
//                       <div className="row">
//                         <div className="col-md-2">
//                           <div className="form-check">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="is_active"
//                               id="is_active_1"
//                               value="1"
//                               defaultChecked={
//                                 data && data.is_active === 1
//                                   ? true
//                                   // : !data
//                                   // ? true
//                                   : false
//                               }
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="is_active_1"
//                             >
//                               Active
//                             </label>
//                           </div>
//                         </div>{" "}
//                         &nbsp; &nbsp;
//                         <div className="col-md-1">
//                           <div className="form-check">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="is_active"
//                               id="is_active_0"
//                               value="0"
//                               // readOnly={(modal.modalData) ? false : true }
//                               defaultChecked={data && data.is_active==0 ? true :false}
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="is_active_0"
//                             >
//                               Deactive
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>{" "}
//                 {/* CARD BODY */}
//               </div>
//               {/* CARD */}

//               <div className="card mt-2">
//                 <div className="card-header bg-primary text-white p-2">
//                   <h5>Address Details</h5>
//                 </div>
//                 <div className="card-body">
//                   <div className="form-group row mt-3">
//                     <label className="col-sm-2 col-form-label">
//                       <b>
//                         Address :<Astrick color="red" size="13px" />
//                       </b>
//                     </label>
//                     <div className="col-sm-10">
//                       <textarea
//                         className="form-control form-control-sm"
//                         id="address"
//                         name="address"
//                         placeholder="Enter maximum 250 character"
//                         rows="3"
//                         maxLength={250}
//                         onKeyPress={(e) => {
//                           Validation.addressFieldOnly(e);
//                         }}
//                         required
//                         defaultValue={data.address}
//                       />
//                     </div>
//                   </div>

//                   <div className="form-group row mt-3">
//                     <label className="col-sm-2 col-form-label">
//                       <b>
//                         Pincode : <Astrick color="red" />
//                       </b>
//                     </label>
//                     <div className="col-sm-4">
//                       <input
//                         type="text"
//                         className="form-control form-control-sm"
//                         id="pincode"
//                         name="pincode"
//                         defaultValue={data.pincode}
//                         minLength={6}
//                         maxLength={6}
//                         onKeyPress={(e) => {
//                           Validation.NumbersOnly(e);
//                         }}
//                         required
//                         autoComplete="off"
//                       />
//                     </div>

//                     <label
//                       className="col-sm-2 col-form-label"
//                       style={{ textAlign: "right" }}
//                     >
//                       <b>
//                         Country : <Astrick color="red" />
//                       </b>
//                     </label>
//                     {console.log("countryDropdown",countryDropdown)}
                    
//                     <div className="col-sm-4">
//                       {countryDropdown && (
//                         <Select
//                           options={countryDropdown}
//                           id="country_id"
//                           name="country_id"
//                           // defaultValue={
//                           //   data &&
//                           //   countryDropdown &&
//                           //   countryDropdown.filter(
//                           //     (d) => d.value == data.country_id
//                           //   )
//                           // }
//                           defaultValue={countryDropdown&& countryDropdown.filter((d)=>d.value==data.country_id)}
//                           onChange={handleCountryChange}
//                           //defaultValue={data && countryDropdown && countryDropdown.filter(d => d.value == data.country_id)}
//                         />
//                       )}
//                     </div>
//                   </div>
//                   <div className="form-group row mt-3">
//                     <label className="col-sm-2 col-form-label">
//                       <b>
//                         State : <Astrick color="red" />
//                       </b>
//                     </label>
//                     {console.log("pp",stateDropdownData&&stateDropdownData)}
//                     <div className="col-sm-4">
//                       { data && filterStateData && (
//                         <Select
//                           options={stateDropdownData}
//                           id="state_id"
//                           name="state_id"
//                           // defaultValue={data && stateDropdown && stateDropdown.filter(d => d.value == data.state_id)}
//                           defaultValue={filterStateData&&filterStateData.filter((d)=>d.value==data.state_id)}
//                           // onChange={handleCountryChange}
//                           onChange={(e) => handleDependentChange(e, "STATE")}
//                           // value={stateDropdown}
//                         />
//                       )}
//                     </div>
//                     {console.log("sss",stateDropdown)}
//                     {console.log("ddd",data)}


//                     <label
//                       className="col-sm-2 col-form-label"
//                       style={{ textAlign: "right" }}
//                     >
//                       <b>
//                         City : <Astrick color="red" />
//                       </b>
//                     </label>
//                     {console.log("pss",data)}
//               {console.log("cityDropdownData",cityDropdownData)}

//                     <div className="col-sm-4">
//                       {cityDropdownData &&sortedCityData && data && (
//                         <Select
//                           options={cityDropdownData}
//                           id="city_id"
//                           name="city_id"
//                           // defaultValue={data && cityDropdown && cityDropdown.filter(d => d.value == data.city_id) ? data && cityDropdown && cityDropdown.filter(d => d.value == data.city_id) : cityName}
//                           defaultValue={sortedCityData&&sortedCityData.filter((d)=>d.value==data.city_id)}
//                           // defaultInputValue={AllcityDropDownData&& AllcityDropDownData[0].city}
//                           // onChange={(e) => setCityName(e)}
//                           onChange={(e) => setCityName(e)}
//                           // value={cityDropdownData}
//                         />
//                       )}

//                       {console.log("ci",sortedCityData&&sortedCityData.filter((d)=>d.value==data.city_id))}
//                     </div>
//                   </div>
//                 </div>
//                 {/* CARD BODY*/}
//               </div>
//               {/* CARD */}

//               <div className="mt-3" style={{ textAlign: "right" }}>
//                 {checkRole && checkRole[0]?.can_update === 1 ? (
//                   <button type="submit" className="btn btn-primary">
//                     Update
//                   </button>
//                 ) : (
//                   ""
//                 )}
//                 <Link
//                   to={`/${_base}/Customer`}
//                   className="btn btn-danger text-white"
//                 >
//                   Cancel
//                 </Link>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditCustomer;


import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorLogService from "../../../services/ErrorLogService";
import CustomerService from "../../../services/MastersService/CustomerService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import CustomerType from "../../../services/MastersService/CustomerTypeService";
import CountryService from "../../../services/MastersService/CountryService";
import StateService from "../../../services/MastersService/StateService";
import CityService from "../../../services/MastersService/CityService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import { _base } from "../../../settings/constants";
import Select from "react-select";

function EditCustomer({ match }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);

  const { id } = useParams();
  const customerId = id;

  const [data, setData] = useState(null);
  const [customerType, setCustomerType] = useState(null);

  const [country, setCountry] = useState(null);
  const [countryDropdown, setCountryDropdown] = useState(null);
  const [state, setState] = useState(null);
  const [stateDropdown, setStateDropdown] = useState(null);
  const [city, setCity] = useState(null);
  const [cityDropdown, setCityDropdown] = useState(null);

  const [updateStatus, setUpdateStatus] = useState({});

  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);

  const stateRef = useRef(null);

  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);

  const handleDependent = (e, name) => {
    setData({
      ...data,
      [name]: e.value,
    });
  };

  const loadData = async () => {
    const data = [];
    await new CustomerService()
      .getCustomerById(customerId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setData(res.data.data);
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          setNotify({ type: "danger", message: res.message });
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          "Customer",
          "Get_Customer",
          "INSERT",
          errorObject.data.message
        );
      });

    await new CustomerType().getCustomerType().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        setCustomerType(
          data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ label: d.type_name, value: d.id }))
        );
      }
    });

    //  **************************Country load data**************************************
    await new CountryService().getCountrySort().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setCountry(res.data.data.filter((d) => d.is_active === 1));
          setCountryDropdown(
            res.data.data
              .filter((d) => d.is_active == 1)
              .map((d) => ({ value: d.id, label: d.country }))
          );
        }
      }
    });
    //  ************************** State load data**************************************
    await new StateService().getStateSort().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setState(res.data.data.filter((d) => d.is_active === 1));
          setStateDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({
                value: d.id,
                label: d.state,
                country_id: d.country_id,
              }))
          );
        }
      }
    });
    //  ************************** city load data**************************************
    await new CityService().getCity().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setCity(res.data.data.filter((d) => d.is_active === 1));
          setCityDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({
                value: d.id,
                label: d.city,
                state_id: d.state_id,
              }))
          );
        }
      }
    });

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
        }
      }
    });
  };

  const [contactError, setContactError] = useState(null);
  const [contactErr, setContactErr] = useState(false);
  const [contactNumber, setContactNumber] = useState(null);
  const handleMobileValidation = (e) => {
    const contactNumber = e.target.value;
    setContactNumber(contactNumber);
    if (
      contactNumber.charAt(0) == "9" ||
      contactNumber.charAt(0) == "8" ||
      contactNumber.charAt(0) == "7" ||
      contactNumber.charAt(0) == "6"
    ) {
      setContactErr(false);
      setContactError("");
    } else if (contactNumber.length === 10) {
      setContactErr(true);
      setContactError("Invalid Mobile Number");
    } else {
      setContactError("");
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    var flag = 1;
    // var a = JSON.stringify(Object.fromEntries(formData))
    // console.log(a)

    var customerType = formData.getAll("customer_type_id");
    var selectEmail = formData.getAll("email_id");
    var selectCountry = formData.getAll("country_id");
    var selectState = formData.getAll("state_id");
    var selectCity = formData.getAll("city_id");

    if (
      customerType == "" ||
      selectEmail == "" ||
      selectCountry == "" ||
      selectState == "" ||
      selectCity == ""
    ) {
      flag = 0;
      setNotify(null);
      if (customerType == "") {
        // setNotify(null);
        alert("Please Select Customer Type");
        // setNotify({ type: 'danger', message: "Please Select Customer Type" });
      } else if (selectEmail == "") {
        // setNotify(null);
        alert("Please Select Email");
        // setNotify({ type: 'danger', message: "Please Select Customer Type" });
      } else if (selectCountry == "") {
        // setNotify(null);
        alert("Please Select Country");
        // setNotify({ type: 'danger', message: "Please Select Country" });
      } else if (selectState == "") {
        // setNotify(null);
        alert("Please Select State");
        // setNotify({ type: 'danger', message: "Please Select State" });
      } else if (selectCity == "") {
        // setNotify(null);
        alert("Please Select City");
        // setNotify({ type: 'danger', message: "Please Select City" });
      } else {
        // setNotify(null);
        alert("Please Check Form");
        // setNotify({ type: 'danger', message: "Please Check Form" });
      }
    }

    if (flag == 1) {
      setNotify(null);
      await new CustomerService()
        .updateCustomer(customerId, formData)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              history({
                pathname: `/${_base}/Customer`,
             
              },
             { state: {
                type: "success", message: res.data.message ,
             }
            } 
              );
            } else {
              setNotify({ type: "danger", message: res.data.message });
            }
          } else {
            setNotify({ type: "danger", message: res.message });
            new ErrorLogService().sendErrorLog(
              "Customer",
              "Create_Customer",
              "INSERT",
              res.message
            );
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          setNotify({ type: "danger", message: "Request Error !!!" });
          new ErrorLogService().sendErrorLog(
            "Customer",
            "Create_Customer",
            "INSERT",
            errorObject.data.message
          );
        });
    }
  };

  const handleCountryChange = (e) => {
    setStateDropdown(
      state
        .filter((d) => d.country_id == e.value)
        .map((d) => ({ value: d.id, label: d.state }))
    );
    const newStatus = { ...updateStatus, statedrp: 1 };
    setUpdateStatus(newStatus);
    setStateName(null);
    setCityName(null);
    setCityDropdown(null);
  };

  const handleStateChange = (e) => {
    setCityDropdown(
      city
        .filter((d) => d.state_id == e.value)
        .map((d) => ({ value: d.id, label: d.city }))
    );
    const newStatus = { ...updateStatus, citydrp: 1 };
    setUpdateStatus(newStatus);
    setStateName(e);
    setCityName(null);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (
      data !== null &&
      stateDropdown !== null &&
      updateStatus.statedrp === undefined
    ) {
      setStateDropdown((prev) =>
        prev.filter((stateItem) => stateItem.country_id === data.country_id)
      );
      const newStatus = { ...updateStatus, statedrp: 1 };
      setUpdateStatus(newStatus);
      setStateName(
        data &&
          stateDropdown &&
          stateDropdown.filter((d) => d.value == data.state_id)
      );
    }
  }, [data, stateDropdown]);

  useEffect(() => {
    if (
      data !== null &&
      cityDropdown !== null &&
      updateStatus.citydrp === undefined
    ) {
      setCityDropdown((prev) =>
        prev.filter((stateItem) => stateItem.state_id === data.state_id)
      );
      const newStatus = { ...updateStatus, citydrp: 1 };
      setUpdateStatus(newStatus);
      setCityName(
        data &&
          cityDropdown &&
          cityDropdown.filter((d) => d.value == data.city_id)
          ? data &&
              cityDropdown &&
              cityDropdown.filter((d) => d.value == data.city_id)
          : cityName
      );
    }
    if (checkRole && checkRole[3].can_update === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [data, cityDropdown, checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Edit Customer" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {data && (
            <form onSubmit={handleForm}>
              {/* ********* MAIN DATA ********* */}
              <div className="card mt-2">
                <div className="card-header bg-primary text-white p-2">
                  <h5>Customer Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Customer Name : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="name"
                        name="name"
                        placeholder="Customer Name"
                        maxLength={30}
                        required
                        defaultValue={data ? data.name : null}
                        onKeyPress={(e) => {
                          Validation.CharactersOnly(e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Customer Type :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      {customerType && data.customer_type_id && (
                        <Select
                          options={customerType}
                          name="customer_type_id"
                          id="customer_type_id"
                          required
                          defaultValue={
                            data &&
                            customerType.filter(
                              (d) => d.value == data.customer_type_id
                            )
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Email Address :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="email_id"
                        name="email_id"
                        placeholder="Email Address"
                        required
                        defaultValue={data.email_id}
                        pattern="^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$"
                      />
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Contact Number : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="contact_no"
                        name="contact_no"
                        placeholder="Contact Number"
                        defaultValue={data.contact_no}
                        minLength={10}
                        maxLength={10}
                        onKeyPress={(e) => {
                          Validation.NumbersOnly(e);
                        }}
                        onChange={handleMobileValidation}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  {contactError && (
                    <small
                      style={{
                        color: "red",
                        position: "relative",
                        left: "12.375rem",
                      }}
                    >
                      {contactError}
                    </small>
                  )}
                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>Remark :</b>
                    </label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="remark"
                        name="remark"
                        maxLength={50}
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
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_1"
                              value="1"
                              defaultChecked={
                                data && data.is_active
                                  ? true
                                  : !data
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_1"
                            >
                              Active
                            </label>
                          </div>
                        </div>{" "}
                        &nbsp; &nbsp;
                        <div className="col-md-1">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_0"
                              value="0"
                              // readOnly={(modal.modalData) ? false : true }
                              //defaultChecked={data && data.is_active==1 ? true :false}
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
                  </div>
                </div>{" "}
                {/* CARD BODY */}
              </div>
              {/* CARD */}

              <div className="card mt-2">
                <div className="card-header bg-primary text-white p-2">
                  <h5>Address Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Address :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        className="form-control form-control-sm"
                        id="address"
                        name="address"
                        placeholder="Enter maximum 250 character"
                        rows="3"
                        maxLength={250}
                        onKeyPress={(e) => {
                          Validation.addressFieldOnly(e);
                        }}
                        required
                        defaultValue={data.address}
                      />
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Pincode : <Astrick color="red" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="pincode"
                        name="pincode"
                        defaultValue={data.pincode}
                        minLength={6}
                        maxLength={6}
                        onKeyPress={(e) => {
                          Validation.NumbersOnly(e);
                        }}
                        required
                        autoComplete="off"
                      />
                    </div>

                    <label
                      className="col-sm-2 col-form-label"
                      style={{ textAlign: "right" }}
                    >
                      <b>
                        Country : <Astrick color="red" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      {countryDropdown && data && (
                        <Select
                          options={countryDropdown}
                          id="country_id"
                          name="country_id"
                          defaultValue={
                            data &&
                            countryDropdown &&
                            countryDropdown.filter(
                              (d) => d.value == data.country_id
                            )
                          }
                          onChange={handleCountryChange}
                          //defaultValue={data && countryDropdown && countryDropdown.filter(d => d.value == data.country_id)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        State : <Astrick color="red" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      {stateDropdown && data && (
                        <Select
                          options={stateDropdown}
                          id="state_id"
                          name="state_id"
                          // defaultValue={data && stateDropdown && stateDropdown.filter(d => d.value == data.state_id)}
                          defaultValue={stateName}
                          onChange={handleStateChange}
                          value={stateName}
                        />
                      )}
                    </div>

                    <label
                      className="col-sm-2 col-form-label"
                      style={{ textAlign: "right" }}
                    >
                      <b>
                        City : <Astrick color="red" />
                      </b>
                    </label>

                    <div className="col-sm-4">
                      {cityDropdown && data && (
                        <Select
                          options={cityDropdown}
                          id="city_id"
                          name="city_id"
                          // defaultValue={data && cityDropdown && cityDropdown.filter(d => d.value == data.city_id) ? data && cityDropdown && cityDropdown.filter(d => d.value == data.city_id) : cityName}
                          defaultValue={cityName}
                          onChange={(e) => setCityName(e)}
                          value={cityName}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* CARD BODY*/}
              </div>
              {/* CARD */}

              <div className="mt-3" style={{ textAlign: "right" }}>
                {checkRole && checkRole[3].can_update === 1 ? (
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                ) : (
                  ""
                )}
                <Link
                  to={`/${_base}/Customer`}
                  className="btn btn-danger text-white"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditCustomer;
