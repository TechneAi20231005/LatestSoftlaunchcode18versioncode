// import React, { useEffect, useState, useRef } from "react";
// import { Modal, Dropdown } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import ErrorLogService from "../../../services/ErrorLogService";
// import CountryService from "../../../services/MastersService/CountryService";
// import PageHeader from "../../../components/Common/PageHeader";
// import Select from "react-select";
// import { Astrick } from "../../../components/Utilities/Style";
// import * as Validation from "../../../components/Utilities/Validation";
// import Alert from "../../../components/Common/Alert";
// import StateService from "../../../services/MastersService/StateService";
// import CityService from "../../../services/MastersService/CityService";
// import BillTypeMasterService from "../../../services/Bill Checking/Masters/BillTypeMasterService";
// import UserService from "../../../services/MastersService/UserService";
// import { userSessionData } from "../../../settings/constants";
// import { Table } from "react-bootstrap";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
// import CustomTabHeader from "./CustomTabHandler";
// import TabContent from "./TabContent";
// import { name } from "platform";
// import { logDOM } from "@testing-library/react";
// import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";

// function BillTypeMaster() {
//   const [data, setData] = useState(null);
//   const [notify, setNotify] = useState();
//   const [modal, setModal] = useState({
//     showModal: false,
//     modalData: "",
//     modalHeader: "",
//   });
//   const [dangerNotify, setDangerNotify] = useState()
//    const [doubleClicked, setDoubleClicked] = useState(false);
//   const [approverData, setApproverData] = useState({
//     data: [
//       {
//         bill_approval_level: 1,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 2,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 3,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 4,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 5,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 6,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//     ],
//   });
//   const [approverEditData, setApproverEditData] = useState({
//     data: [
//       {
//         bill_approval_level: 1,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 2,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 3,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 4,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 5,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//       {
//         bill_approval_level: 6,
//         amount: null,
//         employee_id: null,
//         required_users: null,
//         required_numbers: null,
//       },
//     ],
//   });

//   const [employeeOptions, setEmployeeOptions] = useState([]); // State for dropdown options of assigned employees
//   const [requiredOptions, setRequiredOptions] = useState([]); // State for dropdown options of required users


//   const roleId = sessionStorage.getItem("role_id");
//   const [checkRole, setCheckRole] = useState(null);

//   const [key, setKey] = useState("");
//   const [defaultkey, seDefaultKey] = useState();
//   const [amtTab, setAmtTab] = useState();
//   const [updateModal, setUpdateModal] = useState({
//     showModals: false,
//     modalsData: "",
//     modalsHeader: "",
//   });

//   const userId = userSessionData.userId;
//   const handleModal = (data) => {
//     // var tempEmployeeId = [];
//     // if (data.modalsData) {
//     //   if (data.modalsData.employee.length > 0) {
//     //     data.modalsData.employee.forEach((d) => {
//     //       tempEmployeeId.push(d.employee_id);
//     //     });
//     //     data.modalsData.employeeId = tempEmployeeId;
//     //   }
//     // }
//     setUpdateModal(data);
//   };

//   const updatedModal = (data) => {
//     setModal(data);
//   };
//   const [viewModal, setViewModal] = useState({
//     isShowModal: false,
//     isModalData: "",
//     isModalHeader: "",
//   });
//   const handleViewModal = (data) => {
//     setViewModal(data);
//   };

//   const searchRef = useRef();
//   const handleSearch = () => {
//     const search = searchRef.current.value;
//     const temp = data.filter((d) => {
//       return d.bill_type
//         .toLowerCase()
//         .match(new RegExp(search.toLowerCase(), "g"));
//     });
//     setData(temp);
//   };
//   const [userData, setUserData] = useState();
//   const [state, setState] = useState();
//   const [city, setCity] = useState();
//   const [CountryDropdown, setCountryDropdown] = useState();
//   const [stateDropdown, setStateDropdown] = useState();
//   const [cityDropdown, setCityDropdown] = useState();
//   const fileInputRef = useRef(null);
//   const [editableData, setEditableData] = useState();
//   const columns = [
//     {
//       name: "Action",
//       selector: (row) => {},
//       sortable: false,
//       cell: (row) => (
//         <div
//           className="btn-group"
//           role="group"
//           aria-label="Basic outlined example"
//         >
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             data-bs-toggle="modal"
//             data-bs-target="#depedit"
//             onClick={(e) => {
//               handleModal({
//                 showModals: true,
//                 modalsData: row,
//                 modalsHeader: "Edit Bill Type",
//               });
//               handleEditableData(e, row.id);
//             }}
//           >
//             <i className="icofont-edit text-success"></i>
//           </button>

//           <button
//             type="button"
//             className="btn btn-sm btn-info "
//             data-bs-toggle="modal"
//             data-bs-target="#view"
//             style={{
//               borderRadius: "30px",
//               width: "30px",
//               height: "30px",
//               marginLeft: "5px",
//             }}
//             onClick={(e) => {
//               handleViewModal({
//                 isShowModal: true,
//                 isModalData: row,
//                 isModalHeader: "View Bill Type",
//               });
//               handleEditableData(e, row.id);
//             }}
//           >
//             <i className="icofont-eye-alt text-white"></i>
//           </button>
//         </div>
//       ),
//     },
  
//     { name: "Bill Type", selector: (row) => row.bill_type, sortable: true },
//     {
//       name: "Status",
//       selector: (row) => row.is_active,
//       sortable: false,
//       cell: (row) => (
//         <div>
//           {row.is_active === 1 && (
//             <span className="badge bg-primary">Active</span>
//           )}
//           {row.is_active === 0 && (
//             <span className="badge bg-danger">Deactive</span>
//           )}
//         </div>
//       ),
//     },
//     { name: "Remark", selector: (row) => row.remark, sortable: true },
//     { name: "Created At", selector: (row) => row.created_at, sortable: true },
//     { name: "Created By", selector: (row) => row.created_by, sortable: true },
//     { name: "Updated At", selector: (row) => row.updated_at, sortable: true },
//     { name: "Updated By", selector: (row) => row.updated_by, sortable: true },
//   ];
//   const firstApproverRef = useRef("");
//   const secondApproverRef = useRef("");
//   const thirdApproverRef = useRef("");
//   const fourthApproverRef = useRef("");

//   const [approver1, setApprover1] = useState();
//   const [empData, setEmpData] = useState([]);
//   const [requiredData, setRequiredData] = useState([]);

//   const handleEditableData = async (e, id) => {
//     setApproverEditData({
//       data: null,
//     });
//     setEditableData(null);
//     e.preventDefault();
//     await new BillTypeMasterService().getBillTypeDataById(id).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status === 1) {
//           setEditableData(res.data.data);
//           seDefaultKey(res.data.data.levels_of_approver);
//           const approverDatas = res.data.data.approver || [];

//           // Initialize empData and requiredData arrays
//           const empDataArray = [];
//           const requiredDataArray = [];

//           const mappedApproverData = approverDatas.map((item, index) => {
//             const {
//               amount,
//               is_required_number,
//               bil_approval_level,
//               employee_id,
//               required_users,
//             } = item;

//             // Convert employee_id array to an array of integers
//             const parsedEmployeeIds =
//               employee_id && employee_id.length > 0
//                 ? employee_id.map((employee) => parseInt(employee.id))
//                 : [];

//             // Add employee_id array to empDataArray
//             empDataArray.push(parsedEmployeeIds);

//             // Convert required_users array to an array of integers
//             const parsedRequiredUsers =
//               required_users && required_users.length > 0
//                 ? required_users.map((employee) => parseInt(employee.id))
//                 : [];

//             // Add required_users array to requiredDataArray
//             requiredDataArray.push(parsedRequiredUsers);
//             return {
//               bill_approval_level: bil_approval_level,
//               amount: amount || null,
//               employee_id: parsedEmployeeIds,
//               required_users: parsedRequiredUsers,
//               required_numbers: is_required_number || null,
//             };
//           });

//           // Set empData and requiredData states
//           setEmpData(empDataArray);
//           setRequiredData(requiredDataArray);

//           setApproverEditData({
//             data: mappedApproverData,
//           });
//         }
//       }
//     });
//   };

//   const [assignedUserData, setAssigneduserData] = useState();
//   const [requiredUserData, setRequireduserData] = useState();
//   const loadData = async () => {
//     const data = [];
//     var tempArray = [];

//     await new BillTypeMasterService().getBillTypeData().then((res) => {
//       if (res.status === 200) {
//         let counter = 1;
//         const temp = res.data.data;
//         for (const key in temp) {
//           data.push({
//             id: temp[key].id,
//             counter: counter++,
//             bill_type: temp[key].bill_type,
//             is_active: temp[key].is_active,
//             remark: temp[key].remark,
//             created_at: temp[key].created_at,
//             created_by: temp[key].created_by,
//             updated_at: temp[key].updated_at,
//             updated_by: temp[key].updated_by,
//             employee: temp[key].employee,
//           });
//         }

//         setData(null);
//         setData(data);
//       }
//     });

//     // await new BillTypeMasterService().getBillTypeDataById()

//     await new UserService().getUser().then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           const a = res.data.data.filter((d) => d.is_active == 1);
//           setUserData(
//             a.map((d) => ({
//               value: d.id,
//               label: d.first_name + " " + d.last_name + " " + "(" + d.id + ")",
//             }))
//           );
//           setAssigneduserData(
//             a.map((d) => ({
//               value: d.id,
//               label: d.first_name + " " + d.last_name + " " + "(" + d.id + ")",
//             }))
//           );
//           setRequireduserData(
//             a.map((d) => ({
//               value: d.id,
//               label: d.first_name + " " + d.last_name + " " + "(" + d.id + ")",
//             }))
//           );
//         }
//       }
//     });

//     await new ManageMenuService().getRole(roleId).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status == 1) {
//           const getRoleId = sessionStorage.getItem("role_id");
//           setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//         }
//       }
//     });
//   };

//   const tab2AmountRef = useRef();
//   const tab3AmountRef = useRef();
//   const tab4AmountRef = useRef();
//   const tab5AmountRef = useRef();
//   const tab6AmountRef = useRef();
//   const tab1AssignRef = useRef();
//   const tab1RequiredRef = useRef();
//   const tab2AssignRef = useRef();
//   const tab2RequiredRef = useRef();
//   const tab3AssignRef = useRef();
//   const tab3RequiredRef = useRef();
//   const tab4AssignRef = useRef();
//   const tab4RequiredRef = useRef();
//   const tab5AssignRef = useRef();
//   const tab5RequiredRef = useRef();
//   const tab6AssignRef = useRef();
//   const tab6RequiredRef = useRef();

//   const handleForm = async (e) => {
//     e.preventDefault();
//   var flag = 0;
//   var requiredNumbersElement1 = document.getElementById("required_numbers1");
//   var requiredNumbersElement2 = document.getElementById("required_numbers2");
//   var requiredNumbersElement3 = document.getElementById("required_numbers3");
//   var requiredNumbersElement4 = document.getElementById("required_numbers4");
//   var requiredNumbersElement5 = document.getElementById("required_numbers5");
//   var requiredNumbersElement6 = document.getElementById("required_numbers6");
    


//   if(key >= 1){
//   if (!requiredNumbersElement1 || requiredNumbersElement1.value === "") {
//     requiredNumbersElement1.focus();
//     alert("Please enter the required number of users for the first tab");
//     flag = 0;
//   } else if (tab1AssignRef.current && tab1AssignRef.current.commonProps.hasValue === false) {
//     tab1AssignRef.current.focus();
//     flag = 0;
//   } else if (tab1RequiredRef.current && tab1RequiredRef.current.commonProps.hasValue === false) {
//     tab1RequiredRef.current.focus();
//     flag = 0;
//   }else{
//     flag =1
//   }
// }


// if(key >= 2){
//   if (!requiredNumbersElement2 || requiredNumbersElement2.value === "") {
//     requiredNumbersElement2.focus();
//     alert("Please enter the required number of users for the second tab");
//     flag = 0;
//   } else if (tab2AssignRef.current && tab2AssignRef.current.commonProps.hasValue === false) {
//     tab2AssignRef.current.focus();
//     flag = 0;
//   } else if (tab2RequiredRef.current && tab2RequiredRef.current.commonProps.hasValue === false) {
//     tab2RequiredRef.current.focus();
//     flag = 0;
//   }else{
//     flag =1
//   }
// }

// if(key >= 3){
//   if (!requiredNumbersElement3 || requiredNumbersElement3.value === "") {
//     requiredNumbersElement3.focus();
//     alert("Please enter the required number of users for the second tab");
//     flag = 0;
//   } else if (tab3AssignRef.current && tab3AssignRef.current.commonProps.hasValue === false) {
//     tab3AssignRef.current.focus();
//     flag = 0;
//   } else if (tab3RequiredRef.current && tab3RequiredRef.current.commonProps.hasValue === false) {
//     tab3RequiredRef.current.focus();
//     flag = 0;
//   }else{
//     flag =1
//   }
// }


// if(key >= 4){
//   if (!requiredNumbersElement4 || requiredNumbersElement4.value === "") {
//     requiredNumbersElement4.focus();
//     alert("Please enter the required number of users for the second tab");
//     flag = 0;
//   } else if (tab4AssignRef.current && tab4AssignRef.current.commonProps.hasValue === false) {
//     tab4AssignRef.current.focus();
//     flag = 0;
//   } else if (tab4RequiredRef.current && tab4RequiredRef.current.commonProps.hasValue === false) {
//     tab4RequiredRef.current.focus();
//     flag = 0;
//   }else{
//     flag =1
//   }
// }


// if(key >= 5){
//   if (!requiredNumbersElement5 || requiredNumbersElement5.value === "") {
//     requiredNumbersElement5.focus();
//     alert("Please enter the required number of users for the second tab");
//     flag = 0;
//   } else if (tab5AssignRef.current && tab5AssignRef.current.commonProps.hasValue === false) {
//     tab2AssignRef.current.focus();
//     flag = 0;
//   } else if (tab5RequiredRef.current && tab5RequiredRef.current.commonProps.hasValue === false) {
//     tab5RequiredRef.current.focus();
//     flag = 0;
//   }else{
//     flag =1
//   }
// }

// if(key === 6){
//   if (!requiredNumbersElement6 || requiredNumbersElement6.value === "") {
//     requiredNumbersElement6.focus();
//     alert("Please enter the required number of users for the second tab");
//     flag = 0;
//   } else if (tab6AssignRef.current && tab6AssignRef.current.commonProps.hasValue === false) {
//     tab6AssignRef.current.focus();
//     flag = 0;
//   } else if (tab6RequiredRef.current && tab6RequiredRef.current.commonProps.hasValue === false) {
//     tab6RequiredRef.current.focus();
//     flag = 0;
//   }else{
//     flag =1
//   }
// }

//   const form = new FormData(e.target);
//   form.append("approverData", JSON.stringify(approverData));
//   var a = JSON.stringify(Object.fromEntries(form));
//   setNotify(null);
//   setDangerNotify(null);
//     if (flag === 1) {
//       await new BillTypeMasterService()
//         .createBillType(form)
//         .then((res) => {
//           if (res.status === 200) {
//             if (res.data.status == 1) {
//               setNotify({ type: "success", message: res.data.message });
//               setModal({ showModals: false, modalsData: "", modalsHeader: "" });
//               loadData();
//             } else {
//               setDangerNotify({ type: "danger", message: res.data.message });
//             }
//           } else {
//             setDangerNotify({ type: "danger", message: res.data.message });
//             new ErrorLogService().sendErrorLog(
//               "BillType",
//               "Create_Bill_Type",
//               "INSERT",
//               res.message
//             );
//           }
//         })
//         .catch((error) => {
//           const { response } = error;
//           const { request, ...errorObject } = response;
//           setNotify({ type: "danger", message: "Request Error !!!" });
//           new ErrorLogService().sendErrorLog(
//             "BillType",
//             "Create_Bill_Type",
//             "INSERT",
//             errorObject.data.message
//           );
//         });
//     }
//   };







//   const selectRefs = useRef(
//     Array(6)
//       .fill(null)
//       .map(() => React.createRef())
//   );
//   const selectRequiredUserRefs = useRef(
//     Array(6)
//       .fill(null)
//       .map(() => React.createRef())
//   );
//   const assignToEmpRef = useRef();
//   const validateForm = () => {
//     let isFormValid = true;

//     selectRefs.current.forEach((ref, index) => {
//       const selectedValue = ref.current?.value;

//       if (
//         ref.current &&
//         ref.current.commonProps &&
//         ref.current.commonProps.hasValue === false &&
//         !selectedValue
//       ) {
//         // Empty selection, display error message or highlight the dropdown
//         alert(`Please select Approver`);
//         ref.current.focus();
//         isFormValid = false;
//       }
//     });

//     selectRequiredUserRefs.current.forEach((ref, index) => {
//       const selectedValue = ref.current?.value;

//       if (
//         ref.current &&
//         ref.current.commonProps &&
//         ref.current.commonProps.hasValue === false &&
//         !selectedValue
//       ) {
//         // Empty selection, display error message or highlight the dropdown
//         alert(`Please select required user`);
//         ref.current.focus();
//         isFormValid = false;
//       }
//     });

//     if (assignToEmpRef.current) {
//       if (assignToEmpRef.current.commonProps.hasValue == false) {
//         alert(`Please select a assign to person`);
//         assignToEmpRef.current.focus();
//         isFormValid = false;
//       }
//     }

//     return isFormValid;
//   };

//   const updateForm = (id) => async (e) => {
//     e.preventDefault();

//     // Perform validation here
//     const isFormValid = validateForm();
//     if (!isFormValid) {
//       return; // Exit the function if validation fails
//     }
//     const form = new FormData(e.target);
//     form.append("approverData", JSON.stringify(approverEditData));

//     setNotify(null);
//     setDangerNotify(null)
//     await new BillTypeMasterService()
//       .updateBillType(id, form)
//       .then((res) => {
//         if (res.status === 200) {
//           if (res.data.status === 1) {
//             setNotify({ type: "success", message: res.data.message });
//             setUpdateModal({
//               showModals: false,
//               modalsData: "",
//               modalsHeader: "",
//             });
//             loadData();
//           } else {
//             setDangerNotify({ type: "danger", message: res.data.message });
//           }
//         } else {
//           setDangerNotify({ type: "danger", message: res.data.message });
//           new ErrorLogService().sendErrorLog(
//             "BillType",
//             "Update_Bill_Type",
//             "UPDATE",
//             res.message
//           );
//         }
//       })
//       .catch((error) => {
//         const { response } = error;
//         const { request, ...errorObject } = response;
//         setNotify({ type: "danger", message: "Request Error !!!" });
//         new ErrorLogService().sendErrorLog(
//           "BillType",
//           "Update_Bill_Type",
//           "UPDATE",
//           errorObject.data.message
//         );
//       });
//   };
//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       handleSearch();
//     }
//   };

 

//   const [formSubmitted, setFormSubmitted] = useState(false);

//   const tab1Ref = useRef();


//   const handleTabContentChange = (index, fieldName, value) => {
//     if(index == 0 && fieldName !== "required_users" && fieldName !== "required_numbers" && tab1RequiredRef.current){
//       tab1RequiredRef.current.clearValue();
//       setSelectedUsers1(()=> null)
//     }
//     if(index == 1 && fieldName !== "required_users"&& fieldName !== "required_numbers"&& tab2RequiredRef.current){
//       tab2RequiredRef.current.clearValue();
//       setSelectedUsers2(()=> null)
//     }
//     if(index == 2 && fieldName !== "required_users"&& fieldName !== "required_numbers" && tab3RequiredRef.current){
//       tab3RequiredRef.current.clearValue();
//       setSelectedUsers3(()=> null)
//     }
//     if(index == 3 && fieldName !== "required_users"&& fieldName !== "required_numbers" && tab4RequiredRef.current){
//       tab4RequiredRef.current.clearValue();
//       setSelectedUsers4(()=> null)
//     }
//     if(index == 4 && fieldName !== "required_users"&& fieldName !== "required_numbers"&& tab5RequiredRef.current){
//       tab5RequiredRef.current.clearValue();
//       setSelectedUsers5(()=> null)
//     }
//     if(index == 5 && fieldName !== "required_users"&& fieldName !== "required_numbers" && tab6RequiredRef.current){
//       tab6RequiredRef.current.clearValue();
//       setSelectedUsers6(()=> null)
//     }

//     // empty filed of required numbers on change of required users dropdown 
    
//     if(index == 0 && fieldName !== "employee_id" && fieldName !== "required_numbers"  ){
//       document.getElementById("required_numbers1").value =""
//     }
//     if(index == 1 && fieldName !== "employee_id" && fieldName !== "required_numbers"){
//       document.getElementById("required_numbers2").value =""
//     }
//     if(index == 2 && fieldName !== "employee_id"&& fieldName !== "required_numbers" ){
//       document.getElementById("required_numbers3").value =""
//     }
//     if(index == 3 && fieldName !== "employee_id"&& fieldName !== "required_numbers"){
//       document.getElementById("required_numbers4"&& fieldName !== "required_numbers").value =""
//     }
//     if(index == 4 && fieldName !== "employee_id"&& fieldName !== "required_numbers"){
//       document.getElementById("required_numbers5").value =""
//     }
//     if(index == 5 && fieldName !== "employee_id"&& fieldName !== "required_numbers"){
//       document.getElementById("required_numbers6").value =""
//     }
//     setApproverData((prevApproverData) => {
//       const updatedData = [...prevApproverData.data];
//       const obj = updatedData[index];

//       if (fieldName === "employee_id") {
//         obj.employee_id = value.map((option) => option.value);
//       } else if (fieldName === "required_users") {
//         obj.required_users = value.map((option) => option.value);
//       } else if (fieldName === "required_numbers") {
//         obj.required_numbers = value;
//       }

//       return { data: updatedData };
//     });
//   };


//   const handleDefaultValueChange = (index, fieldName, value) => {
//     setApproverEditData((prevApproverData) => {
//       const updatedData = [...prevApproverData.data];
//       const obj = { ...updatedData[index] };

//       if (fieldName === "employee_id") {
//         obj.employee_id =
//           value && value.length > 0 ? value.map((option) => option.value) : [];
//       } else if (fieldName === "required_users") {
//         obj.required_users =
//           value && value.length > 0 ? value.map((option) => option.value) : [];
//       } else if (fieldName === "required_numbers") {
//         obj.required_numbers = value;
//       }

//       updatedData[index] = obj;

//       return { data: updatedData };
//     });
//   };

  

//   const handleTabChange = (selectedKey) => {

//     setAmtTab(selectedKey);
//   };

//   const handleAmountChange = ( newAmount, name) => {
//     setApproverData((prevApproverData) => {
//       const updatedData = prevApproverData.data.map((level) => {
//         if (level.bill_approval_level === name) {
//           return { ...level, amount: newAmount };
//         }
//         return level;
//       });
//       return { data: updatedData };
//     });
//   };

//   const handleDefaultAmountChange = ( bill_approval_level, newAmount) => {

//     setApproverEditData((prevApproverData) => {
//       const updatedData = prevApproverData.data.map((level) => {
//         if (level.bill_approval_level === bill_approval_level) {
//           return { ...level, amount: newAmount };
//         }
//         return level;
//       });
//       return { data: updatedData };
    
//     });
//   };
//   const setLevel = (e) => {
//     setKey(null);
//     const selectedKey = parseInt(e.target.value);
//     if (selectedKey === key && doubleClicked) {
//       setDoubleClicked(false); // Reset double-click event
//     } else {
//       setKey(selectedKey);
//     }
//   };

//   const setLevelKey = (e) => {
//     seDefaultKey(null);
//     const selectedKey = parseInt(e.target.value);

//     if (selectedKey === defaultkey && doubleClicked) {
//       setDoubleClicked(false); // Reset double-click event
//     } else {
//       const existingData = approverEditData.data;
//       const newData = [];

//       for (let i = 1; i <= selectedKey; i++) {
//         const existingLevel = existingData.find(
//           (data) => data.bill_approval_level == i
//         );

//         if (existingLevel) {
//           newData.push(existingLevel);
//         } else {
//           newData.push({
//             bill_approval_level: i,
//             amount: i <= defaultkey ? data.amount : "",
//             required_numbers: i <= defaultkey ? data.required_numbers : "",
//             employee_id: [],
//             required_users: [],
//           });
//         }
//       }

//       setApproverEditData({ data: newData });
//       seDefaultKey(selectedKey);
//     }
//   };

//   const [selectedUsers1, setSelectedUsers1] = useState();
//   const [selectedUsers2, setSelectedUsers2] = useState();
//   const [selectedUsers3, setSelectedUsers3] = useState();
//   const [selectedUsers4, setSelectedUsers4] = useState();
//   const [selectedUsers5, setSelectedUsers5] = useState();
//   const [selectedUsers6, setSelectedUsers6] = useState();

//   const handleSelectedUsers = (index, selectedOptions) => {
//     if (selectedOptions) {
//       if (index == 0) {
//         setSelectedUsers1(selectedOptions);
//       }
//       if (index == 1) {
//         setSelectedUsers2(selectedOptions);
//       }
//       if (index == 2) {
//         setSelectedUsers3(selectedOptions);
//       }
//       if (index == 3) {
//         setSelectedUsers4(selectedOptions);
//       }
//       if (index == 4) {
//         setSelectedUsers5(selectedOptions);
//       }
//       if (index == 5) {
//         setSelectedUsers6(selectedOptions);
//       }
//     }
//   };

//   const [requiredNumbers, setRequiredNumbers] = useState();
//   const numbersValidation = (e, index) => {
//     setRequiredNumbers(null);
//     if (e) {
//       var value = e.target.value;
//       var firstValue =
//         approverData.data && approverData.data[0].required_users.length;
//       if (index == 0) {
//         if (firstValue < value) {
//           setRequiredNumbers(firstValue);
//         }
//       }
//     }
//   };
//   const [selectedRequiredUserData, setSelectedRequiredUserData] = useState();
//   const handleSelectedRequired = (selectedOptions, index) => {
    
//     selectRequiredUserRefs.current[index].current.clearValue(); // Clear only the changed "required users" dropdown

//     setApproverEditData((prevApproverData) => {
//       const updatedData = prevApproverData.data.map((level, i) => {
//         if (i === index) {
//           const updatedLevel = { ...level };
//           updatedLevel.required_users = selectedOptions.map(
//             (option) => option.value
//           );
//           return updatedLevel;
//         }
//         return level;
//       });

//       return { data: updatedData };
//     });

//     setSelectedRequiredUserData((prevSelectedOptions) => {
//       if (Array.isArray(prevSelectedOptions)) {
//         const updatedSelectedOptions = [...prevSelectedOptions];
//         updatedSelectedOptions[index] = selectedOptions;
//         return updatedSelectedOptions;
//       }
//       return [];
//     });
//   };

//   useEffect(() => {
//     loadData();
//   }, [approverEditData]);
 



//   useEffect(()=>{
//     if(checkRole && checkRole[47].can_read === 0){  
//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
//     }
//   },[checkRole])


//   return (
//     <div className="container-xxl">
//       {notify && <Alert alertData={notify} />}
//       <PageHeader
//         headerTitle="Bill Type Master"
//         renderRight={() => {
//           return (
//             <div className="col-auto d-flex w-sm-100">
//               <button
//                 className="btn btn-dark btn-set-task w-sm-100"
//                 onClick={() => {
//                   updatedModal({
//                     showModal: true,
//                     modalData: null,
//                     modalHeader: "Add Bill type",
//                   });
//                 }}
//               >
//                 <i className="icofont-plus-circle me-2 fs-6"></i>Add Bill Type
//               </button>
//             </div>
//           );
//         }}
//       />
//       {/* SEARCH FILTER */}
//       <div className="card card-body">
//         <div className="row">
//           <div className="col-md-8">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search...."
//               ref={searchRef}
//               onKeyDown={handleKeyDown}
//             />
//           </div>
//           <div className="col-md-3">
//             <button
//               className="btn btn-sm btn-warning text-white"
//               type="button"
//               onClick={(e) =>
//                 searchRef.current.value
//                   ? handleSearch(e)
//                   : alert("please enter a search")
//               }
//             >
//               <i className="icofont-search-1 "></i> Search
//             </button>
//             <button
//               className="btn btn-sm btn-info text-white"
//               type="button"
//               onClick={() => window.location.reload(false)}
//             >
//               <i className="icofont-refresh text-white"></i> Reset
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* DATA TABLE */}
//       <div className="card mt-2">
//         <div className="card-body">
//           <div className="row clearfix g-3">
//             <div className="col-sm-12">
//               {data && (
//                 <DataTable
//                   columns={columns}
//                   data={data}
//                   pagination
//                   className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//                   highlightOnHover={true}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* ADD BILL TYPE */}
//       <Modal
//         centered
//         show={modal.showModal}
//         size="xl"
//         onHide={(e) => {
//           updatedModal({
//             showModal: false,
//             modalData: "",
//             modalHeader: "",
//           });
//         }}
//       >

//         <form
//           method="post"
//           onSubmit={(e) =>
//             handleForm(e, modal.modalData ? modal.modalData.id : null)
//           }
//         >
//           <Modal.Header closeButton>

//             <Modal.Title className="fw-bold">Add Bill Type</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//           {dangerNotify && <Alert alertData={dangerNotify} />}
//             <div className="deadline-form">
//               <div className="row g-3 mb-3">
//                 <div className="row g-3 mb-3">
//                   <input
//                     type="hidden"
//                     id="user_id"
//                     name="user_id"
//                     defaultValue={userId}
//                   />

//                   <div className="col-sm-4 ">
//                     <label className="form-label font-weight-bold">
//                       Bill Type :<Astrick color="red" size="13px" />
//                     </label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       id="bill_type"
//                       name="bill_type"
//                       required={true}
//                       maxLength={20}
//                     />
//                   </div>
//                   <div className="col-sm-4 ">
//                     <label className="form-label font-weight-bold">
//                       Levels of Approver :<Astrick color="red" size="13px" />
//                     </label>

//                     <select
//                       className="form-control"
//                       id="levels_of_approver"
//                       name="levels_of_approver"
//                       onChange={(e) => {
//                         setLevel(e);
//                       }}
//                       required={true}
//                     >
//                       <option value=""></option>
//                       <option value="1">1</option>
//                       <option value="2">2</option>
//                       <option value="3">3</option>
//                       <option value="4">4</option>
//                       <option value="5">5</option>
//                       <option value="6">6</option>
//                     </select>
//                   </div>
//                   <div className="col-sm-4 ">
//                     <label className="form-label font-weight-bold">
//                       Assigned To :<Astrick color="red" size="13px" />
//                     </label>
//                     {userData && (
//                       <Select
//                         isMulti
//                         options={userData && userData}
//                         placeholder="Please Select User"
//                         id="assign_employee_id[]"
//                         name="assign_employee_id[]"
//                       />
//                     )}
//                   </div>
//                 </div>
//                 <div className="row g-3">
//                   <div className="col-sm-12">
//                     {/* <Tabs
//                             transition={false}
//                             id="noanim-tab-example1"
//                             defaultActiveKey={key}
//                             activeKey={key}
//                             onSelect={handleTabChange}
//                           >
//                           </Tabs>  */}
//                     {key && (
//                       <Tabs
//                         transition={false}
//                         id="noanim-tab-example1"
//                         activeKey={amtTab}
//                         onSelect={(e) => handleTabChange(e)}
//                       >
//                         {userData &&
//                           approverData &&
//                           approverData.data.map((level, index) => {
//                             if (key >= 1 && level.bill_approval_level === 1) {
//                               return (
//                                 <Tab
//                                   key={level.bill_approval_level}
//                                   eventKey={level.bill_approval_level}
//                                   title={
//                                     <CustomTabHeader
//                                       title=""
//                                       id="tab1_amt"
//                                       name={`bill_approval_level${level.bill_approval_level}`}
//                                       amount={level.amount}
//                                       index={index}
//                                       data={approverData}
//                                       formSubmitted={formSubmitted}
//                                       ref={tab1Ref}
//                                       onChange={( newAmount) =>
//                                         handleAmountChange(
//                                           newAmount,
//                                           level.bill_approval_level,
//                                         )
//                                       }
//                                     />
//                                   }
//                                 >
//                                   {/* Content for each tab */}
//                                   <div className="card mb-3 mt-3">
//                                     <div className="card-body">
//                                       <div className="row">
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Assigned user(s) :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {userData && (
//                                             <Select
//                                               isMulti
//                                               options={userData}
//                                               ref={tab1AssignRef}
//                                               placeholder="Please Select User"
//                                               id="employee_id[]"
//                                               name="employee_id[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "employee_id",
//                                                   selectedOptions
//                                                 );
//                                                 handleSelectedUsers(
//                                                   index,
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required users :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {selectedUsers1 && (
//                                             <Select
//                                               isMulti
//                                               options={selectedUsers1}
//                                               ref={tab1RequiredRef}
//                                               isClearable
//                                               id="required_users"
//                                               name="required_users[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "required_users",
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
                                     
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required Members :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           <input
//                                             type="number"
//                                             className="form-control"
//                                             id="required_numbers1"
//                                             name="required_numbers"
//                                             placeholder="please enter required user numbers"
//                                             onChange={(e) => {
//                                               handleTabContentChange(
//                                                 index,
//                                                 "required_numbers",
//                                                 e.target.value
//                                               );
//                                               if (
//                                                 level.required_users?.length <
//                                                 e.target.value
//                                               ) {
//                                                 return (e.target.value = "");
//                                               }
//                                             }}
//                                           />
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </Tab>
//                               );
//                             }
//                           })}

//                         {userData &&
//                           approverData &&
//                           approverData.data.map((level, index) => {
//                             const isLastTab =
//                               index === approverData.data.length - 1;
//                             if (key >= 2 && level.bill_approval_level == 2) {
//                               return (
//                                 <Tab
//                                   key={level.bill_approval_level}
//                                   eventKey={level.bill_approval_level}
//                                   title={
//                                     <CustomTabHeader
//                                       isLastTab={isLastTab} // Pass isLastTab prop
//                                       title=""
//                                       ref={tab2AmountRef}
//                                       data={approverData}
//                                       index={index}
//                                       name={`bill_approval_level${level.bill_approval_level}`}
//                                       amount={level.amount}
//                                       min={
//                                         level.bill_approval_level === 2
//                                           ? approverData.data[0].amount
//                                           : "00.00"
//                                       }
//                                       onChange={( newAmount) =>
//                                         handleAmountChange(
//                                           newAmount,
//                                           level.bill_approval_level,
//                                         )
//                                       }
//                                     />
//                                   }
//                                 >
//                                   {/* Content for each tab */}
//                                   <div className="card mb-3 mt-3">
//                                     <div className="card-body">
//                                       <div className="row">
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Assigned user(s) :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {userData && (
//                                             <Select
//                                               isMulti
//                                               options={userData}
//                                               ref={tab2AssignRef}
//                                               id="employee_id[]"
//                                               name="employee_id[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "employee_id",
//                                                   selectedOptions
//                                                 );
//                                                 handleSelectedUsers(
//                                                   index,
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required users :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {selectedUsers2 && (
//                                             <Select
//                                               isMulti
//                                               options={selectedUsers2}
//                                               id="required_users"
//                                               ref={tab2RequiredRef}
//                                               name="required_users[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "required_users",
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required Members :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           <input
//                                             type="number"
//                                             className="form-control"
//                                             id="required_numbers2"
//                                             name="required_numbers"
//                                             onChange={(e) => {
//                                               handleTabContentChange(
//                                                 index,
//                                                 "required_numbers",
//                                                 e.target.value
//                                               );
//                                               if (
//                                                 level.required_users?.length <
//                                                 e.target.value
//                                               ) {
//                                                 return (e.target.value = "");
//                                               }
//                                             }}
//                                           />
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </Tab>
//                               );
//                             }
//                           })}

//                         {userData &&
//                           approverData &&
//                           approverData.data.map((level, index) => {
//                             const isLastTab =
//                               index === approverData.data.length - 1;
//                             if (key >= 3 && level.bill_approval_level == 3) {
//                               return (
//                                 <Tab
//                                   key={level.bill_approval_level}
//                                   eventKey={level.bill_approval_level}
//                                   title={
//                                     <CustomTabHeader
//                                       isLastTab={isLastTab} // Pass isLastTab prop
//                                       title=""
//                                       name={`bill_approval_level${level.bill_approval_level}`}
//                                       amount={level.amount}
//                                       ref={tab3AmountRef}
//                                       index={index}
//                                       data={approverData}
//                                       onChange={( newAmount) =>
//                                         handleAmountChange(
//                                           newAmount,
//                                           level.bill_approval_level,
//                                         )
//                                       }
//                                     />
//                                   }
//                                 >
//                                   <div className="card mb-3 mt-3">
//                                     <div className="card-body">
//                                       <div className="row">
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Assigned user(s) :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {userData && (
//                                             <Select
//                                               isMulti
//                                               options={userData}
//                                               ref={tab3AssignRef}
//                                               id="employee_id[]"
//                                               name="employee_id[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "employee_id",
//                                                   selectedOptions
//                                                 );
//                                                 handleSelectedUsers(
//                                                   index,
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required users :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {selectedUsers3 && (
//                                             <Select
//                                               isMulti
//                                               options={selectedUsers3}
//                                               id="required_users"
//                                               ref={tab3RequiredRef}
//                                               name="required_users[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "required_users",
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required Members :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           <input
//                                             type="number"
//                                             className="form-control"
//                                             id="required_numbers3"
//                                             name="required_numbers"
//                                             onChange={(e) => {
//                                               handleTabContentChange(
//                                                 index,
//                                                 "required_numbers",
//                                                 e.target.value
//                                               );
//                                               if (
//                                                 level.required_users?.length <
//                                                 e.target.value
//                                               ) {
//                                                 return (e.target.value = "");
//                                               }
//                                             }}
//                                           />
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </Tab>
//                               );
//                             }
//                           })}

//                         {userData &&
//                           approverData &&
//                           approverData.data.map((level, index) => {
//                             if (key >= 4 && level.bill_approval_level == 4) {
//                               return (
//                                 <Tab
//                                   key={level.bill_approval_level}
//                                   eventKey={level.bill_approval_level}
//                                   title={
//                                     <CustomTabHeader
//                                       title=""
//                                       name={`bill_approval_level${level.bill_approval_level}`}
//                                       amount={level.amount}
//                                       data={approverData}
//                                       index={index}
//                                       ref={tab4AmountRef}
//                                       onChange={( newAmount) =>
//                                         handleAmountChange(
//                                           newAmount,
//                                           level.bill_approval_level,
//                                         )
//                                       }
//                                     />
//                                   }
//                                 >
//                                   <div className="card mb-3 mt-3">
//                                     <div className="card-body">
//                                       <div className="row">
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Assigned user(s) :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {userData && (
//                                             <Select
//                                               isMulti
//                                               ref={tab4AssignRef}
//                                               options={userData}
//                                               id="employee_id[]"
//                                               name="employee_id[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "employee_id",
//                                                   selectedOptions
//                                                 );
//                                                 handleSelectedUsers(
//                                                   index,
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required users :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {selectedUsers4 && (
//                                             <Select
//                                               isMulti
//                                               options={selectedUsers4}
//                                               id="required_users"
//                                               ref={tab4RequiredRef}
//                                               name="required_users[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "required_users",
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required Members :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           <input
//                                             type="number"
//                                             className="form-control"
//                                             id="required_numbers4"
//                                             name="required_numbers"
//                                             onChange={(e) => {
//                                               handleTabContentChange(
//                                                 index,
//                                                 "required_numbers",
//                                                 e.target.value
//                                               );
//                                               if (
//                                                 level.required_users?.length <
//                                                 e.target.value
//                                               ) {
//                                                 return (e.target.value = "");
//                                               }
//                                             }}
//                                           />
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </Tab>
//                               );
//                             }
//                           })}

//                         {userData &&
//                           approverData &&
//                           approverData.data.map((level, index) => {
//                             if (key >= 5 && level.bill_approval_level == 5) {
//                               return (
//                                 <Tab
//                                   key={level.bill_approval_level}
//                                   eventKey={level.bill_approval_level}
//                                   title={
//                                     <CustomTabHeader
//                                       title=""
//                                       ref={tab5AmountRef}
//                                       data={approverData}
//                                       index={index}
//                                       name={`bill_approval_level${level.bill_approval_level}`}
//                                       amount={level.amount}
//                                       onChange={( newAmount) =>
//                                         handleAmountChange(
//                                           newAmount,
//                                           level.bill_approval_level,
//                                         )
//                                       }
//                                     />
//                                   }
//                                 >
//                                   <div className="card mb-3 mt-3">
//                                     <div className="card-body">
//                                       <div className="row">
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Assigned user(s) :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {userData && (
//                                             <Select
//                                               isMulti
//                                               options={userData}
//                                               ref={tab5AssignRef}
//                                               id="employee_id[]"
//                                               name="employee_id[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "employee_id",
//                                                   selectedOptions
//                                                 );
//                                                 handleSelectedUsers(
//                                                   index,
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required users :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {selectedUsers5 && (
//                                             <Select
//                                               isMulti
//                                               options={selectedUsers5}
//                                               id="required_users"
//                                               ref={tab5RequiredRef}
//                                               name="required_users[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "required_users",
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required Members :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           <input
//                                             type="number"
//                                             className="form-control"
//                                             id="required_numbers5"
//                                             name="required_numbers"
//                                             onChange={(e) => {
//                                               handleTabContentChange(
//                                                 index,
//                                                 "required_numbers",
//                                                 e.target.value
//                                               );
//                                               if (
//                                                 level.required_users?.length <
//                                                 e.target.value
//                                               ) {
//                                                 return (e.target.value = "");
//                                               }
//                                             }}
//                                           />
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </Tab>
//                               );
//                             }
//                           })}

//                         {userData &&
//                           approverData &&
//                           approverData.data.map((level, index) => {
//                             if (key == 6 && level.bill_approval_level == 6) {
//                               return (
//                                 <Tab
//                                   key={level.bill_approval_level}
//                                   eventKey={level.bill_approval_level}
//                                   title={
//                                     <CustomTabHeader
//                                       title=""
//                                       name={`bill_approval_level${level.bill_approval_level}`}
//                                       amount={level.amount}
//                                       data={approverData}
//                                       ref={tab6AmountRef}
//                                       index={index}
//                                       onChange={( newAmount) =>
//                                         handleAmountChange(
//                                           newAmount,
//                                           level.bill_approval_level,
//                                         )
//                                       }
//                                     />
//                                   }
//                                 >
//                                   <div className="card mb-3 mt-3">
//                                     <div className="card-body">
//                                       <div className="row">
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Assigned user(s) :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {userData && (
//                                             <Select
//                                               isMulti
//                                               ref={tab6AssignRef}
//                                               options={userData}
//                                               id="employee_id[]"
//                                               name="employee_id[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "employee_id",
//                                                   selectedOptions
//                                                 );
//                                                 handleSelectedUsers(
//                                                   index,
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required users :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           {selectedUsers6 && (
//                                             <Select
//                                               isMulti
//                                               options={selectedUsers6}
//                                               ref={tab6RequiredRef}
//                                               id="required_users"
//                                               name="required_users[]"
//                                               required={true}
//                                               onChange={(selectedOptions) => {
//                                                 handleTabContentChange(
//                                                   index,
//                                                   "required_users",
//                                                   selectedOptions
//                                                 );
//                                               }}
//                                             />
//                                           )}
//                                         </div>
//                                         <div className="col-sm-3">
//                                           <label className="form-label font-weight-bold">
//                                             Required Members :
//                                             <Astrick color="red" size="13px" />
//                                           </label>
//                                           <input
//                                             type="number"
//                                             className="form-control"
//                                             id="required_numbers6"
//                                             name="required_numbers"
//                                             onChange={(e) => {
//                                               handleTabContentChange(
//                                                 index,
//                                                 "required_numbers",
//                                                 e.target.value
//                                               );
//                                               if (
//                                                 level.required_users?.length <
//                                                 e.target.value
//                                               ) {
//                                                 return (e.target.value = "");
//                                               }
//                                             }}
//                                           />
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </Tab>
//                               );
//                             }
//                           })}
//                       </Tabs>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Remarks :<Astrick color="red" size="13px" />
//                   </label>

//                   <textarea
//                     type="text"
//                     className="form-control"
//                     id="remark"
//                     name="remark"
//                     required={true}
//                     rows="4"
//                     maxLength={50}
//                   />
//                 </div>
//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Status :<Astrick color="red" size="13px" />
//                   </label>
//                   <div className="row">
//                     <div className="col-md-2">
//                       <div className="form-check">
//                         <input
//                           className="form-check-input"
//                           type="radio"
//                           name="is_active"
//                           id="is_active"
//                           value="1"
//                           defaultChecked={
//                             modal.modalData && modal.modalData.is_active === 1
//                               ? true
//                               : !modal.modalData
//                               ? true
//                               : false
//                           }
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor="is_active_1"
//                         >
//                           Active
//                         </label>
//                       </div>
//                     </div>
//                     <div className="col-md-1">
//                       <div className="form-check">
//                         <input
//                           className="form-check-input"
//                           type="radio"
//                           name="is_active"
//                           id="is_active"
//                           value="0"
//                           readOnly={modal.modalData ? false : true}
//                           defaultChecked={
//                             modal.modalData && modal.modalData.is_active === 0
//                               ? true
//                               : false
//                           }
//                         />
//                         <label className="form-check-label" htmlFor="is_active">
//                           Deactive
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <button
//               type="submit"
//               className="btn btn-primary text-white"
//               style={{ backgroundColor: "#484C7F" }}
//             >
//               Submit
//             </button>

//             <button
//               type="button"
//               className="btn btn-danger text-white"
//               onClick={() => {
//                 updatedModal({
//                   showModal: false,
//                   modalData: "",
//                   modalHeader: "",
//                 });
//               }}
//             >
//               Close
//             </button>
//           </Modal.Footer>
//         </form>
//       </Modal>

//       {/* update Modal */}
//       <Modal
//         centered
//         show={updateModal.showModals}
//         size="xl"
//         onHide={(e) => {
//           handleModal({
//             showModals: false,
//             modalsData: null,
//             modalsHeader: "",
//           });
//         }}
//       >
//         <form
//           method="post"
//           onSubmit={updateForm(
//             updateModal.modalsData ? updateModal.modalsData.id : ""
//           )}
//         >
//           <Modal.Header closeButton>
//           {dangerNotify && <Alert alertData={dangerNotify} />}
//             <Modal.Title className="fw-bold">
//               {updateModal.modalsHeader}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="deadline-form">
//               <div className="row g-3 mb-3">
//                 <div className="row g-3 mb-3">
//                   <input
//                     type="hidden"
//                     id="user_id"
//                     name="user_id"
//                     defaultValue={userId}
//                   />
//                   <div className="col-sm-4 ">
//                     <label className="form-label font-weight-bold">
//                       Bill Type :<Astrick color="red" size="13px" />
//                     </label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       id="bill_type"
//                       name="bill_type"
//                       required={true}
//                       maxLength={20}
//                       defaultValue={editableData && editableData.bill_type}
//                     />
//                   </div>

//                   <div className="col-sm-4 ">
//                     <label className="form-label font-weight-bold">
//                       Levels of Approver :<Astrick color="red" size="13px" />
//                     </label>
//                     {/* {editableData && JSON.stringify(editableData.levels_of_approver)} */}
//                     <select
//                       className="form-control"
//                       id="levels_of_approver"
//                       name="levels_of_approver"
//                       defaultValue={
//                         editableData && editableData.levels_of_approver
//                       }
//                       onChange={(e) => {
//                         setLevelKey(e);
//                       }}
//                       required={true}
//                     >
//                       <option selected value="">
//                         ...select
//                       </option>
//                       <option
//                         selected={
//                           editableData && editableData.levels_of_approver == "1"
//                         }
//                         value="1"
//                       >
//                         1
//                       </option>
//                       <option
//                         selected={
//                           editableData && editableData.levels_of_approver == "2"
//                         }
//                         value="2"
//                       >
//                         2
//                       </option>
//                       <option
//                         selected={
//                           editableData && editableData.levels_of_approver == "3"
//                         }
//                         value="3"
//                       >
//                         3
//                       </option>
//                       <option
//                         selected={
//                           editableData && editableData.levels_of_approver == "4"
//                         }
//                         value="4"
//                       >
//                         4
//                       </option>
//                       <option
//                         selected={
//                           editableData && editableData.levels_of_approver == "5"
//                         }
//                         value="5"
//                       >
//                         5
//                       </option>
//                       <option
//                         selected={
//                           editableData && editableData.levels_of_approver == "6"
//                         }
//                         value="6"
//                       >
//                         6
//                       </option>
//                     </select>
//                   </div>
//                   <div className="col-sm-4 ">
//                     <label className="form-label font-weight-bold">
//                       Assigned To :<Astrick color="red" size="13px" />
//                     </label>
//                     {userData && editableData && (
//                       <Select
//                         isMulti
//                         options={userData}
//                         placeholder="Please Select User"
//                         id="assign_employee_id[]"
//                         ref={assignToEmpRef}
//                         name="assign_employee_id[]"
//                         defaultValue={
//                           editableData &&
//                           userData.filter((d) =>
//                             editableData.assign_users.includes(d.value)
//                           )
//                         }
//                       />
//                     )}
//                   </div>
//                 </div>
//                 <div className="row g-3">
//                   <div className="col-sm-12">
//                     {/* <Tabs
//                             transition={false}
//                             id="noanim-tab-example1"
//                             defaultActiveKey={key}
//                             activeKey={key}
//                             onSelect={handleTabChange}
//                           >
//                           </Tabs>  */}
//                     <Tabs
//                       transition={false}
//                       id="noanim-tab-example1"
//                       activeKey={amtTab}
//                       onSelect={(e) => handleTabChange(e)}
//                     >
//                       {approverEditData.data &&
//                         approverEditData.data.map((level, index) => {
//                           if (level.bill_approval_level <= defaultkey) {
//                             const employeeIds = empData.map(
//                               (employee) => employee
//                             );

//                             const requiredUserIds = requiredData.map(
//                               (emp) => emp
//                             );
//                             return (
//                               <Tab
//                                 key={level.bill_approval_level}
//                                 eventKey={level.bill_approval_level}
//                                 title={
//                                   <CustomTabHeader
//                                     title=""
//                                     amount={level.amount}
//                                     index={index}
//                                     data={approverEditData}
//                                     onChange={(newAmount) =>
//                                       handleDefaultAmountChange(
//                                         level.bill_approval_level,
//                                         newAmount
//                                       )
//                                     }
//                                   />
//                                 }
//                               >
//                                 {/* Content for each tab */}
//                                 <div className="card mb-3 mt-3">
//                                   <div className="card-body">
//                                     <div className="row">
//                                       <div className="col-sm-3">
//                                         <label className="form-label font-weight-bold">
//                                           Assigned user(s):
//                                           <Astrick color="red" size="13px" />
//                                         </label>

//                                         {assignedUserData &&
//                                           employeeIds &&
//                                           employeeIds[index] && (
//                                             <Select
//                                               isMulti
//                                               options={assignedUserData}
//                                               id={`employee_id_${level.bill_approval_level}`}
//                                               name={`employee_id_${level.bill_approval_level}`}
//                                               ref={selectRefs.current[index]} // Assign ref based on the index
//                                               defaultValue={assignedUserData.filter(
//                                                 (user) =>
//                                                   employeeIds[index]?.includes(
//                                                     user.value
//                                                   )
//                                               )}
//                                               onChange={(selectedOptions) => {
//                                                 handleDefaultValueChange(
//                                                   level.bill_approval_level - 1,

//                                                   "employee_id",

//                                                   selectedOptions
//                                                 );
//                                                 handleSelectedRequired(
//                                                   selectedOptions,
//                                                   index
//                                                 );
//                                               }}
//                                             />
//                                           )}

//                                         {!employeeIds ||
//                                           (!employeeIds[index] && (
//                                             <Select
//                                               isMulti
//                                               options={assignedUserData}
//                                               ref={selectRefs.current[index]} // Assign ref based on the index
//                                               id={`employee_id_${level.bill_approval_level}`}
//                                               name={`employee_id_${level.bill_approval_level}`}
//                                               onChange={(selectedOptions) => {
//                                                 handleDefaultValueChange(
//                                                   level.bill_approval_level - 1,

//                                                   "employee_id",

//                                                   selectedOptions
//                                                 );
//                                                 handleSelectedRequired(
//                                                   selectedOptions,
//                                                   index
//                                                 );
//                                               }}
//                                             />
//                                           ))}
//                                       </div>

//                                       <div className="col-sm-3">
//                                         <label className="form-label font-weight-bold">
//                                           Required users:
//                                           <Astrick color="red" size="13px" />
//                                         </label>

//                                         {requiredUserData &&
//                                           approverEditData.data &&
//                                           requiredUserIds &&
//                                           requiredUserIds[index] && (
//                                             <Select
//                                               isMulti
//                                               options={
//                                                 (selectedRequiredUserData &&
//                                                   selectedRequiredUserData[
//                                                     index
//                                                   ]) ||
//                                                 []
//                                               }
//                                               ref={
//                                                 selectRequiredUserRefs.current[
//                                                   index
//                                                 ]
//                                               } // Assign ref based on the index
//                                               key={`employee_id_${level.bill_approval_level}`}
//                                               id={`employee_id_${level.bill_approval_level}`}
//                                               name={`employee_id_${level.bill_approval_level}`}
//                                               required={true}
//                                               defaultValue={requiredUserData.filter(
//                                                 (user) =>
//                                                   requiredUserIds[
//                                                     index
//                                                   ]?.includes(user.value)
//                                               )}
//                                               onChange={(selectedOptions) =>
//                                                 handleDefaultValueChange(
//                                                   level.bill_approval_level - 1,

//                                                   "required_users",

//                                                   selectedOptions
//                                                 )
//                                               }
//                                             />
//                                           )}

//                                         {!employeeIds ||
//                                           (!employeeIds[index] && (
//                                             <Select
//                                               isMulti
//                                               ref={
//                                                 selectRequiredUserRefs.current[
//                                                   index
//                                                 ]
//                                               } // Assign ref based on the index
//                                               options={
//                                                 (selectedRequiredUserData &&
//                                                   selectedRequiredUserData[
//                                                     index
//                                                   ]) ||
//                                                 []
//                                               }
//                                               key={`employee_id_${level.bill_approval_level}`}
//                                               id={`employee_id_${level.bill_approval_level}`}
//                                               name={`employee_id_${level.bill_approval_level}`}
//                                               required={true}
//                                               // defaultValue={userData.filter(
//                                               //   (user) =>
//                                               //     requiredUserIds[
//                                               //       index
//                                               //     ]?.includes(user.value)
//                                               // )}
//                                               onChange={(selectedOptions) =>
//                                                 handleDefaultValueChange(
//                                                   level.bill_approval_level - 1,

//                                                   "required_users",

//                                                   selectedOptions
//                                                 )
//                                               }
//                                             />
//                                           ))}
//                                       </div>

//                                       <div className="col-sm-3">
//                                         <label className="form-label font-weight-bold">
//                                           Required Members:
//                                           <Astrick color="red" size="13px" />
//                                         </label>

//                                         <input
//                                           type="number"
//                                           className="form-control"
//                                           id={`required_numbers_${level.bill_approval_level}`}
//                                           name={`required_numbers_${level.bill_approval_level}`}
//                                           defaultValue={level.required_numbers}
//                                           required={defaultkey === 1}
//                                           onChange={(e) => {
//                                             handleDefaultValueChange(
//                                               level.bill_approval_level - 1,

//                                               "required_numbers",

//                                               e.target.value
//                                             );
//                                             if (
//                                               level.required_users?.length <
//                                               e.target.value
//                                             ) {
//                                               return (e.target.value = "");
//                                             }
//                                           }}
//                                         />
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </Tab>
//                             );
//                           } else {
//                             return null;
//                           }
//                         })}
//                     </Tabs>
//                   </div>
//                 </div>

//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Remarks :<Astrick color="red" size="13px" />
//                   </label>

//                   <textarea
//                     type="text"
//                     className="form-control"
//                     id="remark"
//                     name="remark"
//                     required={true}
//                     defaultValue={editableData && editableData.remark}
//                     rows="4"
//                     maxLength={50}
//                   />
//                 </div>
//                 <div className="col-sm-12">
//                   <label className="form-label font-weight-bold">
//                     Status :<Astrick color="red" size="13px" />
//                   </label>
//                   <div className="row">
//                     <div className="col-md-2">
//                       <div className="form-check">
//                         <input
//                           className="form-check-input"
//                           type="radio"
//                           name="is_active"
//                           id="is_active"
//                           value="1"
//                           defaultChecked={
//                             modal.modalData && modal.modalData.is_active === 1
//                               ? true
//                               : !modal.modalData
//                               ? true
//                               : false
//                           }
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor="is_active_1"
//                         >
//                           Active
//                         </label>
//                       </div>
//                     </div>
//                     <div className="col-md-1">
//                       <div className="form-check">
//                         <input
//                           className="form-check-input"
//                           type="radio"
//                           name="is_active"
//                           id="is_active"
//                           value="0"
//                           readOnly={modal.modalData ? false : true}
//                           defaultChecked={
//                             modal.modalData && modal.modalData.is_active === 0
//                               ? true
//                               : false
//                           }
//                         />
//                         <label className="form-check-label" htmlFor="is_active">
//                           Deactive
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             {updateModal.modalsData && (
//               <button
//                 type="submit"
//                 className="btn btn-primary text-white"
//                 style={{ backgroundColor: "#484C7F" }}
//               >
//                 Update
//               </button>
//             )}
//             <button
//               type="button"
//               className="btn btn-danger text-white"
//               onClick={() => {
//                 handleModal({
//                   showModals: false,
//                   modalsData: "",
//                   modalsHeader: "",
//                 });
//               }}
//             >
//               Cancel
//             </button>
//           </Modal.Footer>
//         </form>
//       </Modal>

//       {/* View Modal */}

//       <Modal
//         centered
//         show={viewModal.isShowModal}
//         size="xl"
//         scrollable
//         onHide={(e) => {
//           handleViewModal({
//             isShowModal: false,
//             isModalData: "",
//             isModalHeader: "",
//           });
//         }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title className="fw-bold">
//             {viewModal.isModalHeader}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Table>
//             <thead>
//               <tr>
//                 <th className="text-center" style={{ minWidth: "180px" }}>ID</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>Bill type</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>Approver Levels</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>Levels</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>Amount</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>Approvers</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>Required Approvers</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>Assigned Person</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>Status</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>Remark</th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>
//                   Created At
//                 </th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>
//                   Created By
//                 </th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>
//                   Updated At
//                 </th>
//                 <th className="text-center" style={{ minWidth: "180px" }}>
//                   Updated By
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {approverEditData.data &&
//                 approverEditData.data.map((level, index) => (
//                   <tr>
//                     <td className="text-center"> {viewModal.isModalData.id } </td>
//                     <td className="text-center"> {viewModal.isModalData.bill_type} </td>
//                     {editableData && (
//                       <td
//                         className="text-center"
//                         rowSpan={editableData.length + 1}
//                       >
//                         {" "}
//                         {editableData.levels_of_approver}{" "}
//                       </td>
//                     )}
//                     <td className="text-center">
//                       {" "}
//                       {level.bill_approval_level}{" "}
//                     </td>
//                     <td className="text-center"> {level.amount} </td>
//                     <td className="text-center">
//                       {assignedUserData && (
//                         <Select
//                           className="col-sm"
//                           isMulti
//                           isDisabled
//                           defaultValue={
//                             data &&
//                             assignedUserData.filter((d) =>
//                               level.employee_id?.includes(d.value)
//                             )
//                           }
//                         />
//                       )}
//                     </td>
//                     <td className="text-center">
//                       {requiredUserData && (
//                         <Select
//                           className="col-sm"
//                           isMulti
//                           isDisabled
//                           defaultValue={
//                             data &&
//                             requiredUserData.filter((d) =>
//                               level.required_users?.includes(d.value)
//                             )
//                           }
//                         />
//                       )}
//                     </td>
//                     {editableData && (
//                       <td
//                         className="text-center"
                        
//                       >
//                       <Select 
//                       className="col-sm"
//                       isDisabled
//                       isMulti
//                       defaultValue={data && userData.filter((d)=>
//                         editableData.assign_users?.includes(d.value)
//                         )}
//                       />
//                       </td>
//                     )}
//                     <td className="text-center">
//                       {
//                         (viewModal.isModalData.is_active == 1 ? "ACTIVE" : "DEACTIVE")
//                       }
//                     </td>
//                     <td className="text-center">{viewModal.isModalData.remark} </td>
//                     <td className="text-center">{viewModal.isModalData.created_at} </td>
//                     <td className="text-center">{viewModal.isModalData.created_by} </td>
//                     <td className="text-center">{viewModal.isModalData.updated_at} </td>
//                     <td className="text-center">{viewModal.isModalData.updated_by} </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </Table>
//         </Modal.Body>

//         <Modal.Footer>
//           <button
//             type="button"
//             className="btn btn-danger text-white"
//             onClick={() => {
//               handleViewModal({
//                 isShowModal: false,
//                 isModalData: "",
//                 isModalHeader: "",
//               });
//             }}
//           >
//             Cancel
//           </button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }



// export default BillTypeMaster;
