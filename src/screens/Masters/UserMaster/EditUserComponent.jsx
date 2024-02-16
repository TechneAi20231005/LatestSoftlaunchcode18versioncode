import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { _base } from "../../../settings/constants";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ErrorLogService from "../../../services/ErrorLogService";

import UserService from "../../../services/MastersService/UserService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from "react-select";
import * as Validation from "../../../components/Utilities/Validation";
import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";
import InputGroup from "react-bootstrap/InputGroup";
import { CustomerDropdown } from "../CustomerMaster/CustomerComponent";

import DepartmentService from "../../../services/MastersService/DepartmentService";
import RoleService from "../../../services/MastersService/RoleService";
import DesignationService from "../../../services/MastersService/DesignationService";
import DepartmentMappingService from "../../../services/MastersService/DepartmentMappingService";
import CountryService from "../../../services/MastersService/CountryService";
import StateService from "../../../services/MastersService/StateService";
import CityService from "../../../services/MastersService/CityService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import { UseDispatch,useDispatch,useSelector } from "react-redux";
import { DashbordSlice } from "../../Dashboard/DashbordSlice";
import { getCountryDataSort, getRoles } from "../../Dashboard/DashboardAction";
import { rolemasterSlice } from "../RoleMaster/RoleMasterSlice";
import { getRoleData } from "../RoleMaster/RoleMasterAction";
function EditUserComponent({ match }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  const [tabKey, setTabKey] = useState("All_Tickets");

  
const dispatch = useDispatch()

const CountryData = useSelector(
      (DashbordSlice) => DashbordSlice.dashboard.filteredCountryData
    );
    const checkRole = useSelector((DashbordSlice) =>
        DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 3)
      );

      const roleDropdown = useSelector(rolemasterSlice=>rolemasterSlice.rolemaster.filterRoleData)
      // console.log("r",r)

  const {id}=useParams()
  const userId=parseInt(id)

  
  const [data, setData] = useState(null);
  const [accountFor, setAccountFor] = useState(null);
  const [country, setCountry] = useState(null);
  // const [countryDropdown, setCountryDropdown] = useState(null);
  const [state, setState] = useState(null);
  const [stateDropdown, setStateDropdown] = useState(null);
  const [city, setCity] = useState(null);
  const [cityDropdown, setCityDropdown] = useState(null);

  const [userDepartment, setUserDepartment] = useState(null);
  const [departmentDropdown, setDepartmentDropdown] = useState(null);
  const [defaultDepartmentDropdown, setDefaultDepartmentDropdown] = useState();
  const [defaultDepartment, setDefaultDepartment] = useState();

  // const [roleDropdown, setRoleDropdown] = useState(null);

  const [dataa, setDataa] = useState({ employee_id: null, departments: null });

  const options = [
    { value: "MY_TICKETS", label: "My Tickets" },
    { value: "DEPARTMENT_TICKETS", label: "Department Tickets" },
  ];
  const mappingData = {
    department_id: null,
    ticket_passing_authority: null,
    ticket_show_type: null,
    is_default: 0,
  };
  const [rows, setRows] = useState([mappingData]);

  const [designationDropdown, setDesignationDropdown] = useState(null);

  const [updateStatus, setUpdateStatus] = useState({});

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [passwordShown1, setPasswordShown1] = useState(false);
  const togglePasswordVisiblity1 = () => {
    setPasswordShown1(passwordShown1 ? false : true);
  };

  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);

  const [password, setPassword] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null);

  const confirmedPasswordRef = useRef(0);
  const userForm = useRef();

  const [passwordError, setPasswordError] = useState(null);
  const [passwordValid, setPasswordValid] = useState(false);

  const handlePasswordValidation = (e) => {
    if (e.target.value === "") {
      setInputState({ ...state, passwordErr: "Please enter Password" });
    } else {
      setInputState({ ...state, passwordErr: "" });
    }
    setPassword(e.target.value);
    const passwordValidation = e.target.value;
    if (passwordValidation.length > 20) {
      setPasswordError("Enter Password min. 6 & max. 20");
      setPasswordValid(true);
    } else if (passwordValidation.length < 6) {
      setPasswordError("Enter Password min. 6 & max. 20");
      setPasswordValid(true);
    } else {
      setPasswordError("");
      setPasswordValid(false);
    }

    // Compare passwords
    if (
      confirmedPasswordRef.current.value !== "" &&
      confirmedPasswordRef.current.value !== passwordValidation
    ) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  const [inputState, setInputState] = useState({
    firstNameErr: "",
    middleNameErr: "",
    lastNameErr: "",
    emailErr: "",
    userNameErr: "",
    contactNoErr: "",
    whatsappErr: "",
    passwordErr: "",
    confirmed_PassErr: "",
    roleErr: "",
    designationErr: "",
    departmentErr: "",
    ticketTypeShowErr:"",
    PinCodeErr:""
  });

  function checkingValidation(form) {
    var selectFirstName = form.getAll("first_name")[0];
    var selectMiddleName = form.getAll("middle_name")[0];
    var selectLastName = form.getAll("last_name")[0];
    var selectEmail = form.getAll("email_id")[0];
    var selectUserName = form.getAll("user_name")[0];
    var selectContactNo = form.getAll("contact_no")[0];
    var selectPassword = form.getAll("password")[0];
    var selectWhatsapp = form.getAll("whats_app_contact_no")[0];
    var selectRole = form.getAll("role_id")[0];
    var selectDesignation = form.getAll("designation_id")[0];

    let flag = 0;
    if (selectFirstName == "") {
      setInputState({ ...state, firstNameErr: " Please enter First Name" });
      flag = 1;
    } else if (selectMiddleName == "") {
      setInputState({ ...state, middleNameErr: " Please enter Middle Name" });
      flag = 1;
    } else if (selectLastName == "") {
      setInputState({ ...state, lastNameErr: " Please enter last Name" });
      flag = 1;
    } else if (selectEmail == "") {
      setInputState({ ...state, emailErr: " Please enter Email" });
      flag = 1;
    } else if (selectUserName == "") {
      setInputState({ ...state, userNameErr: " Please enter username" });
      flag = 1;
    } else if (selectContactNo == "") {
      setInputState({ ...state, contactNoErr: " Please enter contact no." });
      flag = 1;
    } else if (selectRole == "") {
      setInputState({ ...state, roleErr: " Please Select role" });
      flag = 1;
    } else if (selectDesignation == "") {
      setInputState({ ...state, designationErr: " Please Select designation" });
      flag = 1;
    } else if (selectContactNo.length < 10) {
      setInputState({ ...state, contactNoErr: "Invalid Contact Number" });
      flag = 1;
    } else if (selectContactNo.length > 10) {
      setInputState({
        ...state,
        contactNoErr: "contact length should be equal to 10",
      });
      flag = 1;
    } else if (contactValid == true) {
      alert("Enter valid Contact Number");
      flag = 1;

      flag = 1;
    } else if (mailError == true) {
      alert("Invalid Email");
      flag = 1;
    }
    return flag;
  }

  const [emailError, setEmailError] = useState(null);
  const [mailError, setMailError] = useState(false);

  const handleEmail = (e) => {
    if (e.target.value === "") {
      setInputState({ ...state, emailErr: "Please enter valid Email" });
    } else {
      setInputState({ ...state, emailErr: "" });
    }
    const email = e.target.value;
    const emailRegex =
      /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    if (emailRegex.test(email) === false) {
      setEmailError("Invalid Email");
      setMailError(true);
    } else {
      setEmailError("");
      setMailError(false);
    }
  };

  // const [sameAs, setSameAs] = useState(false)

  // const handleSameAs = (e) = {
  //     console.log(e.target.checked)
  // }

  const [contactNumber, setContactNumber] = useState(null);

  const [contactValid, setContactValid] = useState(false);
  const handleContactValidation = (e) => {
    const contactValidation = e.target.value;
    if (
      contactValidation.charAt(0) == "9" ||
      contactValidation.charAt(0) == "8" ||
      contactValidation.charAt(0) == "7" ||
      contactValidation.charAt(0) == "6"
    ) {
      setInputState({ ...state, contactNoErr: "" });
      setContactValid(false);
    } else {
      setInputState({ ...state, contactNoErr: "Invalid Mobile Number" });
      setContactValid(true);
    }

    if (contactValidation.length < 11) {
      setContactNumber(contactValidation);
    }
  };

  const [whatsappNumber, setWhatsappNumber] = useState(null);

  const [whatsappValid, setWhatsappValid] = useState(false);
  const handleWhatsappValidation = (e) => {
    const whatsappValidation = e.target.value;
    if (
      whatsappValidation.charAt(0) == "9" ||
      whatsappValidation.charAt(0) == "8" ||
      whatsappValidation.charAt(0) == "7" ||
      whatsappValidation.charAt(0) == "6"
    ) {
      setInputState({ ...state, whatsappErr: "" });
      setWhatsappValid(false);
    } else {
      setInputState({ ...state, whatsappErr: "Invalid Whatsapp Number" });
      setWhatsappValid(true);
    }

    if (whatsappValidation.length < 11) {
      setWhatsappNumber(whatsappValidation);
    }
  };

  const handleDependent = (e, name) => {
    setData({
      ...data,
      [name]: e.value,
    });
  };

  const handleChangeAccountFor = (e) => {
    setAccountFor(e.target.value);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    var flag = 1;
    setNotify(null);
    var a = JSON.stringify(Object.fromEntries(form));

    const formValidation = checkingValidation(form);
    if (formValidation === 1) {
      return false;
    }

    var selectDepartment = form.getAll("department_id[]");
    if (selectDepartment == "") {
      setInputState({ ...state, departmentErr: " Please Select Department" });
      return false;
    }

    if (inputState.PinCodeErr) {
      alert("Invalid Pincode");
      return;
    }
    var selectTicketTypeShow = form.getAll("ticket_show_type_id[]");
    if (selectTicketTypeShow == "") {
      setInputState({ ...state, ticketTypeShowErr: " Please Select Ticket Type Show" });
      return false;
    }

    if (flag === 1) {
      await new UserService()
        .updateUser(userId, form)
        .then((res) => {
          console.log("res",res)
          if (res.status === 200) {
            if (res.data.status === 1) {
              
              history({
                pathname: `/${_base}/User`,
              },   
                  {state: {type:"success", message: res.data.message}},
                     );
            } else {
              setNotify({ type: "danger", message: res.data.message });
            }
          } else {
            setNotify({ type: "danger", message: res.message });
            new ErrorLogService().sendErrorLog(
              "User",
              "Create_User",
              "INSERT",
              res.message
            );
          }
        })
        .catch((error) => {

          if (error.response) {
            const { request, ...errorObject } = error.response;
            new ErrorLogService().sendErrorLog(
              "User",
              "Create_User",
              "INSERT",
              errorObject.data.message
            );
          } else {
            console.error(error);
          }
          
          
          
        });
      // }
    }
  };

    const sortSlefRole= roleDropdown && roleDropdown?.filter(d=>{return d.label?.toLowerCase() !== "user"; })
const filterSelfRole = sortSlefRole?.map((d) => ({
  value: d.value,
  label: d.label,
}));
const orderedSelfRoleData = filterSelfRole?.sort(function (a, b) {
  return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
});


const customerSort= roleDropdown && roleDropdown?.filter(d=>{return d.label?.toLowerCase() === "user"; })
const filterCutomerRole = customerSort?.map((d) => ({
  value: d.value,
  label: d.label,
}));
const orderedCustomerRoleData = filterCutomerRole?.sort(function (a, b) {
  return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
});


  const [filteredRoles, setFilteredRoles] = useState([]);

  const accountForChange = async (account_for) => {
    setAccountFor(account_for);
    const accountFor = account_for;
    const filteredAsAccountFor = roleDropdown.filter((filterData) => {
      console.log("fi",filterData)
      if (accountFor === "SELF") {
        return filterData.label?.toLowerCase() !== "user";
      } else if (accountFor === "CUSTOMER") {
        return filterData.label?.toLowerCase() === "user";
      }
    });
    // const response = filteredAsAccountFor
    //   // ?.filter((d) => d.is_active === 1)
    //   // .map((d) => ({
    //   //   value: d.value,
    //   //   label: d.label,
    //   // }));
    // const aa = response.sort(function (a, b) {
    //   return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
    // });
    // setFilteredRoles(aa);
  }


  const loadData = async () => {
    setRows([mappingData]);

    //  **************************Country load data**************************************
    // await new CountryService().getCountry().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       setCountry(res.data.data.filter((d) => d.is_active === 1));
    //       setCountryDropdown(
    //         res.data.data
    //           .filter((d) => d.is_active == 1)
    //           .map((d) => ({ value: d.id, label: d.country }))
    //       );
    //     }
    //   }
    // });
    //  ************************** State load data**************************************
    await new StateService().getState().then((res) => {
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

    await new DepartmentService().getDepartment().then((res) => {
      if (res.status == 200) {
        const temp = [];
        if (res.data.status == 1) {
          setDepartmentDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.department }))
          );
        }
      }
    });

    // await new RoleService().getRole().then((res) => {
    //   if (res.status == 200) {
    //     if (res.data.status == 1) {
    //       const data = res.data.data.filter((d) => d.is_active == 1);
    //       setRoleDropdown(
    //         res.data.data
    //           .filter((d) => d.is_active === 1)
    //           .map((d) => ({ value: d.id, label: d.role }))
    //       );
    //     }
    //   }
    // });

    await new DesignationService().getDesignation().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          const data = res.data.data.filter((d) => d.is_active == 1);
          setDesignationDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.designation }))
          );
        }
      }
    });

    const data = [];
    await new UserService()
      .getUserById(userId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            const temp = res.data.data;
            setAccountFor(temp.account_for);
            const tempDept = temp.department.map((d) => ({
              value: d.department_id,
              label: d.department_name,
            }));
            setDefaultDepartmentDropdown(tempDept);
            const tempUserDept = temp.department.map((d) => ({
              value: d.department_id,
              label: d.department_name,
            }));
            setUserDepartment(tempUserDept);
            const tempDefaultDept = temp.department
              .filter((d) => d.is_default == 1)
              .map((d) => ({
                value: d.department_id,
                label: d.department_name,
              }));
            setDefaultDepartment(tempDefaultDept);
            setData(null);
            setData(temp);
          } else {
          }
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          "Status",
          "Get_Status",
          "INSERT",
          errorObject.data.message
        );
      });

    await new DepartmentMappingService()
      .getDepartmentMappingByEmployeeId(userId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            const temp = [];
            res.data.data.forEach((d) => {
              temp.push({
                department_id: d.department_id,
                ticket_passing_authority: d.ticket_passing_authority,
                ticket_show_type: d.ticket_show_type,
                is_default: d.is_default,
              });
            });
            setRows(null);
            setRows(temp);
          } else {
            setRows([mappingData]);
          }
        } else {
          setRows([mappingData]);
        }
      });

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //       // setRoleMenu(res.data.data.map((menu)=>{ menu.menu_id}))
    //     }
    //   }
    // });
  };
  const handleDependentChange = (e, type) => {
    if (type == "COUNTRY") {
      //setStateDropdown(state.filter(d => d.country_id == e.value).map(d => ({ value: d.id, label: d.state })));
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
    }
    if (type == "STATE") {
      //setCityDropdown(city.filter(d => d.state_id == e.value).map(d => ({ value: d.id, label: d.city })));
      setCityDropdown(
        city
          .filter((d) => d.state_id == e.value)
          .map((d) => ({ value: d.id, label: d.city }))
      );
      const newStatus = { ...updateStatus, citydrp: 1 };
      setUpdateStatus(newStatus);
      setStateName(e);
      setCityName(null);
    }
  };
  const handleAddRow = async () => {
    setNotify(null);
    let flag = 1;
    

    if (flag === 1) {
       setRows([...rows, mappingData]);
    } else {
      setNotify({ type: "danger", message: "Complete Previous Record" });
    }
  };

  console.log("rowsm",rows)
  console.log("m",mappingData)


  const handleRemoveSpecificRow = (idx) => () => {
    if (idx > 0) {
      setRows(rows.filter((_, i) => i !== idx));
    }
  };

  const [departmentValue, setDepartmentValue] = useState(false);

  const handleCheckInput = (e, id, type) => {
    // if (e.value) {
    //     setDepartmentValue(true)
    // }
    let flag = 1;
    if (type == "DEPARTMENT") {
      rows.forEach((d, i) => {
        if (d.department_id == e.value) {
          flag = 0;
          alert("Department is already selected ");
        }
      });
    }

    if (flag == 1) {
      let temp_state = [...rows];
      let actualIndex = null;
      temp_state.forEach((ele, index) => {
        if (index == id) {
          actualIndex = index;
        }
      });
      let temp_element = { ...rows[actualIndex] };
      if (type == "DEPARTMENT") {
        temp_element.department_id = e.value;
      } else if (type == "TICKET_SHOW") {
        temp_element.ticket_show_type = e.value;
      } else if (type == "TICKET_PASSING_AUTHORITY") {
        temp_element.ticket_passing_authority =
          e.target.checked == true ? 1 : 0;
      } else if (type == "IS_DEFAULT") {
        temp_element.is_default = e.target.checked == true ? 1 : 0;
        temp_state.forEach((d, i) => {
          temp_state[i].is_default = 0;
        });
      }
      temp_state[actualIndex] = temp_element;
      setRows(temp_state);
    }
  };

  const handleDeparmentChange = (e) => {
    setDefaultDepartmentDropdown(e);
  };

  const handleConfirmedPassword = (event) => {
    if (event.target.value === password) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  };

  const [value, setValue] = useState("");
  const onPaste = (e) => {
    const paste = e.clipboardData.getData("text/plain");
    if (paste.match(/[-\.]/)) return;
    setValue(paste);
  };
  useEffect(()=>{
    if(checkRole && checkRole[0]?.can_update === 0){
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  },[checkRole])
  useEffect(() => {
    loadData();
    if(!CountryData.length){
    dispatch(getCountryDataSort())}
    if(!checkRole.length){
    dispatch(getRoles())}
    if(!roleDropdown.length){
    dispatch(getRoleData())}

  }, []);
  // useEffect(() => {

  //   loadData();
  //   var role = checkRole && checkRole.map((d,index)=>{
  //     if(d.menu_id == 3){
  //     return d[index]
  //     }
  //   })

  //     if(role === 0){
  //     <Redirect to= {`/${_base}/Dashboard`}/>
  //   }
  // }, [role]);

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

  const [copyData, setCopyData] = useState(null);

  const [isReadOnly, setIsReadOnly] = useState(false);
  // function copyTextValue(e) {
  //   if (e.target.checked) {
  //     setIsReadOnly(true);
  //   } else {
  //     setIsReadOnly(false);
  //   }
  //   var text1 = e.target.checked
  //     ? document.getElementById("contact_no").value
  //     : "";
  //   setCopyData(text1);
  //   // document.getElementById("whats_app_contact_no").value = text1;
  // }

  console.log("checked",isReadOnly)

  function copyTextValue(e) {
    console.log("eee",e)
    if (e.target.checked) {
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }
    var text1 = e.target.checked
      ? document.getElementById("contact_no").value
      : "";
    setCopyData(text1);
    console.log("text",text1)

    // document.getElementById("whats_app_contact_no").value = text1;
  }

  console.log("copydata",copyData)

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
  }, [data, cityDropdown]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Edit User" />
      {notify && <Alert alertData={notify} />}

      <form
        onSubmit={handleForm}
        ref={userForm}
        encType="multipart/form-data"
        method="post"
      >
        <Tabs
          defaultActiveKey={tabKey}
          activeKey={tabKey}
          onSelect={(k) => setTabKey(k)}
          transition={false}
          id="noanim-tab-example1"
          className=" tab-body-header rounded d-inline-flex"
        >
          <Tab eventKey="All_Tickets" title="User Details">
            {data && (
              <div className="row clearfix g-3">
                <div className="col-sm-12">
                  <div className="card">
                    {/* <div className='card-header bg-primary text-white p-2'>
                                  <h5>User Details</h5>
                              </div> */}
                    <div className="card-body">
                      <div className="form-group row">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Account For :<Astrick color="red" />
                          </b>
                        </label>
                        <div className="col-sm-3">
                          <select
                            className="form-control form-control-sm"
                            id="account_for"
                            name="account_for"
                            value={accountFor ? accountFor : ""}
                            // onChange={(e) => {
                            //   setAccountFor(e.target.value);
                            // }}
                            onChange={(e) => accountForChange(e.target.value)}

                          >
                            {/* <option value="SELF" selected>{data.accountFor}</option> */}
                            <option value="SELF">SELF</option>
                            <option value="CUSTOMER">CUSTOMER</option>
                          </select>
                        </div>
                      </div>

                      {accountFor && accountFor === "CUSTOMER" && (
                        <div className="form-group row mt-3">
                          <label className="col-sm-2 col-form-label">
                            <b>
                              Select Customer:
                              <Astrick color="red" />
                            </b>
                          </label>
                          <div className="col-sm-4">
                            <CustomerDropdown
                              id="customer_id"
                              name="customer_id"
                              defaultValue={
                                data.customer_id ? data.customer_id : ""
                              }
                              readOnly={true}
                              required={true}
                            />
                          </div>
                        </div>
                      )}

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Full Name :<Astrick color="red" />
                          </b>
                        </label>
                        <div className="col-sm-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="first_name"
                            name="first_name"
                            placeholder="First Name"
                            maxLength={30}
                            defaultValue={
                              data.first_name ? data.first_name : ""
                            }
                            onKeyPress={(e) => {
                              Validation.Characters(e);
                            }}
                            onChange={(event) => {
                              if (event.target.value === "") {
                                setInputState({
                                  ...state,
                                  firstNameErr: "First Name Required",
                                });
                              } else {
                                setInputState({ ...state, firstNameErr: "" });
                              }
                            }}
                          />
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                              }}
                            >
                              {inputState.firstNameErr}
                            </small>
                          )}
                        </div>
                        <div className="col-sm-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="middle_name"
                            name="middle_name"
                            placeholder="Middle Name"
                            maxLength={30}
                            defaultValue={
                              data.middle_name ? data.middle_name : ""
                            }
                            onKeyPress={(e) => {
                              Validation.Characters(e);
                            }}
                            onChange={(event) => {
                              if (event.target.value === "") {
                                setInputState({
                                  ...state,
                                  middleNameErr: "Middle Name Required",
                                });
                              } else {
                                setInputState({ ...state, middleNameErr: "" });
                              }
                            }}
                          />
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                              }}
                            >
                              {inputState.middleNameErr}
                            </small>
                          )}
                        </div>
                        <div className="col-sm-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="last_name"
                            name="last_name"
                            placeholder="Last Name"
                            maxLength={30}
                            defaultValue={data.last_name ? data.last_name : ""}
                            onKeyPress={(e) => {
                              Validation.Characters(e);
                            }}
                            onChange={(event) => {
                              if (event.target.value === "") {
                                setInputState({
                                  ...state,
                                  lastNameErr: "Last Name Required",
                                });
                              } else {
                                setInputState({ ...state, lastNameErr: "" });
                              }
                            }}
                          />

                          {inputState && (
                            <small
                              style={{
                                color: "red",
                              }}
                            >
                              {inputState.lastNameErr}
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Email Address : <Astrick color="red" />
                          </b>
                        </label>
                        <div className="col-sm-3">
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            id="email_id"
                            name="email_id"
                            placeholder="Email Address"
                            defaultValue={data.email_id ? data.email_id : ""}
                            onChange={handleEmail}
                            //onKeyPress={e => { Validation.password(e) }}
                          />
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                              }}
                            >
                              {emailError}
                            </small>
                          )}
                        </div>

                        <label className="col-sm-3 col-form-label text-end">
                          <b>
                            Username : <Astrick color="red" />
                          </b>
                        </label>
                        <div className="col-sm-3">
                          <input
                            type="text"
                            className="form-control"
                            id="user_name"
                            name="user_name"
                            placeholder="Username"
                            maxLength={30}
                            onKeyPress={(e) => {
                              Validation.CharactersNumbersOnly(e);
                            }}
                            defaultValue={data.user_name ? data.user_name : ""}
                            onChange={(event) => {
                              if (event.target.value === "") {
                                setInputState({
                                  ...state,
                                  userNameErr: "Please enter username",
                                });
                              } else {
                                setInputState({ ...state, userNameErr: "" });
                              }
                            }}
                          />
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                              }}
                            >
                              {inputState.userNameErr}
                            </small>
                          )}
                        </div>
                      </div>

                      <div
                        className="form-group row mt-3"
                        style={{ position: "relative", display: "flex" }}
                      >
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Contact Number : <Astrick color="red" />
                          </b>
                        </label>
                        <div className="col-sm-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="contact_no"
                            name="contact_no"
                            maxLength="10"
                            minLength="10"
                            placeholder="Contact Number"
                            defaultValue={
                              data.contact_no ? data.contact_no : ""
                            }
                            // value={contactNumber ? contactNumber : ""}
                            onChange={handleContactValidation}
                            onKeyPress={(e) => {
                              Validation.mobileNumbersOnly(e);
                            }}
                          />
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                              }}
                            >
                              {inputState.contactNoErr}
                            </small>
                          )}
                        </div>
                        {/* <label className="col-sm-2 col-form-label">
                          <b>Same as Contact No. :</b>
                        </label> */}
                         <label className="col-sm-3 col-form-label text-end ">
                        <b className="mx-3">Same as Contact No. or</b>
                        <br/>
                        <b className="mx-3">Whats App Contact Number :</b>
                       {/* <label className="col-sm-3 col-form-label text-end "> */}
                        {/* </label> */}
                        <input
                          type="checkbox"
                          name="check1"
                          defaultChecked={data.check1 == 1}

                          onChange={copyTextValue}
                          style={{ position: "absolute", top: "32%" }}
                        />
                        {/* <b>Whats App Number :</b> */}
                      </label>
                        {/* <div className="col-sm-1">
                          <input
                            defaultChecked={data.check1 == 1}
                            type="checkbox"
                            name="check1"
                            onChange={copyTextValue}
                            style={{ position: "absolute", top: "20%" }}
                          />
                        </div> */}
                        {/*
                        <label className="col-sm-2 col-form-label">
                          <b>Whats App Number :</b>
                        </label> */}
                        {console.log("cop",data.whats_app_contact_no)}


{isReadOnly === true ?

<>
<div className="col-sm-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="whats_app_contact_no"
                            name="whats_app_contact_no"
                            placeholder="Whats App Contact Number"
                            // defaultValue={
                            //   isReadOnly == true ? copyData :
                            //   data.contact_no || data.whats_app_contact_no
                                
                            // }
                            value={copyData}
                            readOnly={isReadOnly}
                            // value={copyData ? copyData : ""}
                            minLength={10}
                            maxLength={10}
                            onKeyPress={(e) => {
                              Validation.mobileNumbersOnly(e);
                            }}
                            onChange={handleWhatsappValidation}
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onCopy={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                          />
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                              }}
                            >
                              {inputState.whatsappErr}
                            </small>
                          )}
                        </div>
                      
</>
:
<>
<div className="col-sm-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="whats_app_contact_no"
                            name="whats_app_contact_no"
                            placeholder="Whats App Contact Number"
                            defaultValue={
                              
                             isReadOnly === false ? data.contact_no : data.whats_app_contact_no
                                
                            }
                          
                            readOnly={isReadOnly}
                            // value={copyData ? copyData : ""}
                            minLength={10}
                            maxLength={10}
                            onKeyPress={(e) => {
                              Validation.mobileNumbersOnly(e);
                            }}
                            onChange={handleWhatsappValidation}
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onCopy={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                          />
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                              }}
                            >
                              {inputState.whatsappErr}
                            </small>
                          )}
                        </div>
                      
</>
}


                        {/* <div className="col-sm-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="whats_app_contact_no"
                            name="whats_app_contact_no"
                            placeholder="Whats App Contact Number"
                            defaultValue={
                              isReadOnly == true ? copyData :
                              data.contact_no || data.whats_app_contact_no
                                
                            }
                            readOnly={isReadOnly}
                            // value={copyData ? copyData : ""}
                            minLength={10}
                            maxLength={10}
                            onKeyPress={(e) => {
                              Validation.mobileNumbersOnly(e);
                            }}
                            onChange={handleWhatsappValidation}
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onCopy={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                          />
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                              }}
                            >
                              {inputState.whatsappErr}
                            </small>
                          )}
                        </div> */}
                      </div>

                      {/* <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b> Password : </b>
                        </label>
                        <div
                          className="col-sm-4"
                          style={{ position: "relative", display: "flex" }}
                        >
                          <InputGroup className="">
                            <input
                              className="form-control"
                              id="password"
                              name="password"
                              placeholder="Password"
                              minLength={6}
                              maxLength={12}
                              type={passwordShown ? "text" : "password"}
                              onKeyPress={(e) => {
                                Validation.password(e);
                              }}
                              onChange={(e) => { handlePasswordValidation(e)}}
                            />
                            <InputGroup.Text>
                              <i
                                className="bi bi-eye-fill"
                                onClick={togglePasswordVisiblity}
                              ></i>
                            </InputGroup.Text>
                          </InputGroup>
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                                position: "absolute",
                                top: "95%",
                              }}
                            >
                              {inputState.passwordErr}
                            </small>
                          )}
                        </div>

                        <label className="col-sm-2 col-form-label">
                          <b>Confirmed Password : </b>
                        </label>
                        <div
                          className="col-sm-4"
                          style={{ position: "relative", display: "flex" }}
                        >
                          <InputGroup className="">
                            <input
                              className="form-control form-control-sm "
                              id="confirmed_password"
                              name="confirmed_password"
                              placeholder="confirmed_password"
                              type={passwordShown1 ? "text" : "password"}
                              onKeyPress={(e) => {
                                Validation.password(e);
                              }}
                              onChangeCapture={handleConfirmedPassword}
                              onPaste={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                              onCopy={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                            />
                            <InputGroup.Text>
                              <i
                                className="bi bi-eye-fill"
                                onClick={togglePasswordVisiblity1}
                              ></i>
                            </InputGroup.Text>
                          </InputGroup>
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                                position: "absolute",
                                top: "95%",
                              }}
                            >
                              {inputState.confirmed_PassErr}
                            </small>
                          )}
                        </div>
                        {confirmPasswordError && (
                          <span
                            style={{
                              color: "red",
                              position: "relative",
                              left: "67%",
                            }}
                          >
                            Password Not matched
                          </span>
                        )}
                      </div> */}

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            {" "}
                            Password : <Astrick color="red" />
                          </b>
                        </label>
                        <div
                          className="col-sm-3"
                          style={{ position: "relative", display: "flex" }}
                        >
                          <InputGroup className="">
                            <input
                              typeof="password"
                              className="form-control"
                              id="password"
                              name="password"
                              placeholder="Password"
                              // minLength={6} // Minimum length is set to 8 characters
                              // maxLength={12}
                              type={passwordShown ? "text" : "password"}
                              onKeyPress={(e) => {
                                Validation.password(e);
                              }}
                              // onChange={handlePasswordValidation}
                              onPaste={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                              onCopy={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                            />

                            <InputGroup.Text>
                              <i
                                className="bi bi-eye-fill"
                                onClick={togglePasswordVisiblity}
                              ></i>
                            </InputGroup.Text>
                          </InputGroup>

                          {inputState && (
                            <small
                              style={{
                                color: "red",
                                position: "absolute",
                                top: "95%",
                              }}
                            >
                              {inputState.passwordErr}
                            </small>
                          )}
                        </div>

                        <label className="col-sm-3 col-form-label text-end">
                          <b>
                            Confirmed Password :<Astrick color="red" />{" "}
                          </b>
                        </label>
                        <div
                          className="col-sm-3"
                          style={{ position: "relative", display: "flex" }}
                        >
                          <InputGroup>
                            <input
                              className="form-control form-control-sm "
                              placeholder="confirmed_password"
                              name="confirm_password"
                              id="confirm_password"
                              ref={confirmedPasswordRef}
                              // onChange={handleConfirmedPassword}
                              type={passwordShown1 ? "text" : "Password"}
                              onPaste={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                              onCopy={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                            />
                            <InputGroup.Text>
                              <i
                                className="bi bi-eye-fill"
                                onClick={togglePasswordVisiblity1}
                              ></i>
                            </InputGroup.Text>
                          </InputGroup>

                          {inputState && (
                            <small
                              style={{
                                color: "red",
                                position: "absolute",
                                top: "95%",
                              }}
                            >
                              {inputState.confirmed_PassErr}
                            </small>
                          )}
                        </div>
                        {confirmPasswordError && (
                          <span
                            style={{
                              color: "red",
                              position: "relative",
                              left: "67%",
                            }}
                          >
                            Password Not matched
                          </span>
                        )}
                      </div>
                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Select Role : <Astrick color="red" />
                          </b>
                        </label>
                        <div className="col-sm-3">
                          {roleDropdown && (
                            <Select
                              id="role_id"
                              name="role_id"
                              // options={roleDropdown}
                          options={accountFor === "SELF" ? orderedSelfRoleData : orderedCustomerRoleData}

                              defaultValue={
                                data &&
                                roleDropdown &&
                                roleDropdown.filter(
                                  (d) => d.value == data.role_id
                                )
                              }
                            />
                          )}
                          {inputState && (
                            <small
                              style={{
                                color: "red",
                                position: "relative",
                              }}
                            >
                              {inputState.roleErr}
                            </small>
                          )}
                        </div>

                        <label
                          className="col-sm-3 col-form-label "
                          style={{ textAlign: "right" }}
                        >
                          <b>
                            Select Designation : <Astrick color="red" />
                          </b>
                        </label>
                        {designationDropdown && (
                          <div className="col-sm-3">
                            <Select
                              id="designation_id"
                              name="designation_id"
                              options={designationDropdown}
                              defaultValue={
                                data &&
                                designationDropdown &&
                                designationDropdown.filter(
                                  (d) => d.value == data.designation_id
                                )
                              }
                            />
                          </div>
                        )}
                        {inputState && (
                          <small
                            style={{
                              color: "red",
                              position: "relative",
                            }}
                          >
                            {inputState.designationErr}
                          </small>
                        )}
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Status : <Astrick color="red" />
                          </b>
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
                                  defaultChecked={
                                    data && data.is_active === 1 ? true : false
                                  }
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
                                  defaultChecked={
                                    data && data.is_active === 0 ? true : false
                                  }
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
                  </div>{" "}
                  {/* CARD */}
                  {/* ********* ADDRESS ********* */}
                  <div className="card mt-2">
                    <div className="card-header bg-primary text-white p-2">
                      <h5>Address Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>Address : </b>
                        </label>
                        <div className="col-sm-10">
                          <textarea
                            className="form-control form-control-sm"
                            id="address"
                            name="address"
                            placeholder="Enter maximum 250 character"
                            rows="4"
                            maxLength={250}
                            onKeyPress={(e) => {
                              Validation.addressFieldOnly(e);
                            }}
                            defaultValue={data.address ? data.address : ""}
                          />
                        </div>
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>Pincode : </b>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="pincode"
                            name="pincode"
                            defaultValue={data.pincode ? data.pincode : ""}
                            minLength={6}
                            maxLength={6}
                            onKeyPress={(e) => {
                              Validation.NumbersOnly(e);
                            }}
                            onChange={(event) => {
                              const pincode = event.target.value.trim();
      
                              const pincodeRegex = /^\d{6}$/; // regular expression to match 6 digits
      
                              if (pincode === "") {
                                setInputState({
                                  ...state,
                                  PinCodeErr: "",
                                });
                              } else if (!pincodeRegex.test(pincode)) {
                                setInputState({
                                  ...state,
                                  PinCodeErr: " Enter a 6 digit pin code.",
                                });
                              } else {
                                setInputState({ ...state, PinCodeErr: "" });
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onCopy={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                          />
                           {inputState && (
                      <small
                        style={{
                          color: "red",
                        }}
                      >
                        {inputState.PinCodeErr}
                      </small>
                    )}
                        </div>
                       

                        <label
                          className="col-sm-2 col-form-label"
                          style={{ textAlign: "right" }}
                        >
                          <b>Country : </b>
                        </label>
                        <div className="col-sm-4">
                          <Select
                            options={CountryData}
                            id="country_id"
                            name="country_id"
                            defaultValue={
                              data &&
                              CountryData &&
                              CountryData.filter(
                                (d) => d.value == data.country_id
                              )
                            }
                            onChange={(e) =>
                              handleDependentChange(e, "COUNTRY")
                            }
                            //defaultValue={data && countryDropdown && countryDropdown.filter(d => d.value == data.country_id)}
                          />
                        </div>
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>State : </b>
                        </label>
                        <div className="col-sm-4">
                          <Select
                            options={
                              updateStatus.statedrp !== undefined
                                ? stateDropdown
                                : []
                            }
                            id="state_id"
                            name="state_id"
                            // defaultValue={data && stateDropdown && stateDropdown.filter(d => d.value == data.state_id)}
                            defaultValue={stateName ? stateName : ""}
                            onChange={(e) => handleDependentChange(e, "STATE")}
                            // value={stateName ? stateName : ""}
                          />
                        </div>

                        <label
                          className="col-sm-2 col-form-label"
                          style={{ textAlign: "right" }}
                        >
                          <b>City : </b>
                        </label>

                        {cityDropdown && (
                          <div className="col-sm-4">
                            <Select
                              options={
                                updateStatus.citydrp !== undefined
                                  ? cityDropdown
                                  : []
                              }
                              id="city_id"
                              name="city_id"
                              // defaultValue={data && cityDropdown && cityDropdown.filter(d => d.value == data.city_id) ? data && cityDropdown && cityDropdown.filter(d => d.value == data.city_id) : cityName}
                              defaultValue={cityName ? cityName : ""}
                              onChange={(e) => setCityName(e)}
                              // value={cityName ? cityName : ""}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* CARD BODY*/}
                  </div>
                  {/* CARD */}
                </div>
              </div>
            )}
          </Tab>
          <Tab eventKey="User_Settings" title="Departments">
            <div className="card">
              <div className="card-body">
                {rows && (
                  <div className="">
                    <table
                      className="table table-bordered table-responsive mt-5"
                      id="tab_logic"
                    >
                      <thead>
                        <tr>
                          <th
                            className="text-center"
                            style={{ width: "100px" }}
                          >
                            {" "}
                            SR No{" "}
                          </th>
                          <th
                            className="text-center"
                            style={{ width: "300px" }}
                          >
                            {" "}
                            Department
                          </th>
                          <th
                            className="text-center"
                            style={{ width: "300px" }}
                          >
                            {" "}
                            Ticket Type Show{" "}
                          </th>
                          <th
                            className="text-center"
                            style={{ width: "300px" }}
                          >
                            {" "}
                            Ticket Passing Authority{" "}
                          </th>
                          <th
                            className="text-center"
                            style={{ width: "300px" }}
                          >
                            {" "}
                            Make Default{" "}
                          </th>
                          <th
                            className="text-center"
                            style={{ width: "100px" }}
                          >
                            {" "}
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows && rows?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center">{idx + 1}</td>
                            <td>
                              
                              {/* {departmentDropdown && item.department_id && */}
                              <Select
                                options={departmentDropdown}
                                id={`department_id_` + idx}
                                name="department_id[]"
                                // onChange={e => departmentHandler(idx, e)}
                                defaultValue={
                                  departmentDropdown?.filter(
                                    (d) => d.value == item.department_id
                                  )
                                }
                              />
                            {/* } */}
                            </td>
                           
                            <td>
                              {/* {options && item.ticket_show_type && */}
                              <Select
                                options={options}
                                id={`ticket_show_type_id_` + idx}
                                name="ticket_show_type_id[]"
                                // onChange={e => ticketShowHandler(idx, e)}
                                defaultValue={
                                  rows &&
                                  item.ticket_show_type &&
                                  options.filter(
                                    (d) => d.value == item.ticket_show_type
                                  )
                                }
                              />
                              {/* } */}
                            </td>

                            <td className="text-center">
                              <input
                                type="hidden"
                                name="ticket_passing_authority[]"
                                value={
                                  item.ticket_passing_authority
                                    ? item.ticket_passing_authority
                                    : 0
                                }
                              />

                              <input
                                type="checkbox"
                                id={`ticket_passing_authority_` + idx}
                                checked={item.ticket_passing_authority == 1}
                                onChange={(e) =>
                                  handleCheckInput(
                                    e,
                                    idx,
                                    "TICKET_PASSING_AUTHORITY"
                                  )
                                }
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="hidden"
                                name="is_default[]"
                                value={item.is_default ? item.is_default : ""}
                              />
                              <input
                                type="checkbox"
                                id={`is_default_` + idx}
                                checked={item.is_default == 1}
                                onChange={(e) =>
                                  handleCheckInput(e, idx, "IS_DEFAULT")
                                }
                              />
                            </td>

                            <td>
                              {idx == 0 && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary pull-left"
                                  onClick={handleAddRow}
                                >
                                  <i className="icofont-plus-circle"></i>
                                </button>
                              )}
                              {rows.length == idx + 1 && idx != 0 && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={handleRemoveSpecificRow(idx)}
                                >
                                  <i className="icofont-ui-delete"></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {inputState && (
              <small
                style={{
                  color: "red",
                  position: "absolute",
                  right: "70%",
                }}
              >
                {inputState.departmentErr}
              </small>
            )}
             {inputState && (
              <small
                style={{
                  color: "red",
                  position: "absolute",
                  right: "70%",
                }}
              >
                {inputState.ticketTypeShowErr}
              </small>
            )}
          </Tab>
        </Tabs>
        <div className="mt-3" style={{ textAlign: "right" }}>
          {tabKey == "All_Tickets" && (
            <span
              onClick={() => {
                const form = new FormData(userForm.current);
                const flag = checkingValidation(form);
                if (flag === 1) {
                  return false;
                } else {
                  setTabKey("User_Settings");
                }
              }}
              className="btn btn-primary"
            >
              Next
            </span>
          )}
          {tabKey == "User_Settings" && (
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          )}

         
          {tabKey == "User_Settings" && (
            <button
              onClick={() => setTabKey("All_Tickets")}
              className="btn btn-primary"
            >
              Back
            </button>
          )}
           <Link to={`/${_base}/User`} className="btn btn-danger text-white">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditUserComponent;


// import React, { useEffect, useState, useRef } from "react";
// import { Link, json, useNavigate, useParams } from "react-router-dom";
// import { _base } from "../../../settings/constants";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
// import ErrorLogService from "../../../services/ErrorLogService";

// import UserService from "../../../services/MastersService/UserService";
// import PageHeader from "../../../components/Common/PageHeader";
// import Select from "react-select";
// import * as Validation from "../../../components/Utilities/Validation";
// import Alert from "../../../components/Common/Alert";
// import { Astrick } from "../../../components/Utilities/Style";
// import InputGroup from "react-bootstrap/InputGroup";
// import { CustomerDropdown } from "../CustomerMaster/CustomerComponent";

// import DepartmentService from "../../../services/MastersService/DepartmentService";
// import RoleService from "../../../services/MastersService/RoleService";
// import DesignationService from "../../../services/MastersService/DesignationService";
// import DepartmentMappingService from "../../../services/MastersService/DepartmentMappingService";
// import CountryService from "../../../services/MastersService/CountryService";
// import StateService from "../../../services/MastersService/StateService";
// import CityService from "../../../services/MastersService/CityService";
// import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
// import {useDispatch,useSelector} from "react-redux"
// import { getAllRoles, getAllUserById, getCityData, getCountryDataSort, getRoles, getStateData, getStateDataSort, updateUserData } from "../../Dashboard/DashboardAction";
// import DashbordSlice from "../../Dashboard/DashbordSlice";
// import { getDesignationData } from "../DesignationMaster/DesignationAction";
// import RoleMasterSlice from "../RoleMaster/RoleMasterSlice";
// import { getRoleData } from "../RoleMaster/RoleMasterAction";
// import { departmentData } from "../DepartmentMaster/DepartmentMasterAction";
// function EditUserComponent({ match }) {
//   const history = useNavigate();
//   const [notify, setNotify] = useState(null);
//   const [tabKey, setTabKey] = useState("All_Tickets");

  

//   const {id}=useParams()
//   const userId=parseInt(id)

  
//   // const [data, setData] = useState(null);
//   const [accountFor, setAccountFor] = useState("SELF");
//   const [country, setCountry] = useState(null);
//   const [countryDropdown, setCountryDropdown] = useState(null);
//   const [state, setState] = useState(null);
//   // const [stateDropdown, setStateDropdown] = useState(null);
//   const [city, setCity] = useState(null);
//   // const [cityDropdown, setCityDropdown] = useState(null);

//   const [userDepartment, setUserDepartment] = useState(null);
//   // const [departmentDropdown, setDepartmentDropdown] = useState(null);
//   const [defaultDepartmentDropdown, setDefaultDepartmentDropdown] = useState();
//   const [defaultDepartment, setDefaultDepartment] = useState();

//   // const [roleDropdown, setRoleDropdown] = useState(null);

//   const [dataa, setDataa] = useState({ employee_id: null, departments: null });


//   const departmentDropdown = useSelector(DepartmentMasterSlice=>DepartmentMasterSlice.department.sortDepartmentData)
//   console.log("dpar",departmentDropdown)

//   const dispatch = useDispatch()


//   const data = useSelector(DashbordSlice=>DashbordSlice.dashboard.getAllUser)
//   console.log("ddd11",data)

//   const options = [
//     { value: "MY_TICKETS", label: "My Tickets" },
//     { value: "DEPARTMENT_TICKETS", label: "Department Tickets" },
//   ];
//   const mappingData = {
//     department_id: null,
//     ticket_passing_authority: null,
//     ticket_show_type: null,
//     is_default: 0,
//   };
//   const [rows, setRows] = useState([mappingData]);

//   // const [designationDropdown, setDesignationDropdown] = useState(null);

//   const [updateStatus, setUpdateStatus] = useState({});

//   const [passwordShown, setPasswordShown] = useState(false);
//   const togglePasswordVisiblity = () => {
//     setPasswordShown(passwordShown ? false : true);
//   };

//   const [passwordShown1, setPasswordShown1] = useState(false);
//   const togglePasswordVisiblity1 = () => {
//     setPasswordShown1(passwordShown1 ? false : true);
//   };

//   const [stateName, setStateName] = useState(null);
//   const [cityName, setCityName] = useState(null);

//   const [password, setPassword] = useState(null);
//   const [confirmPasswordError, setConfirmPasswordError] = useState(false);

//   const roleId = sessionStorage.getItem("role_id");
//   // const [checkRole, setCheckRole] = useState(null);

//   const confirmedPasswordRef = useRef(0);
//   const userForm = useRef();

//   const [passwordError, setPasswordError] = useState(null);
//   const [passwordValid, setPasswordValid] = useState(false);


//   const Notify = useSelector( (DashbordSlice) => DashbordSlice.dashboard.notify);
//   const CountryData = useSelector(
//     (DashbordSlice) => DashbordSlice.dashboard.filteredCountryData
//   );

//   console.log("CountryData",CountryData)
//   const roleDropdown = useSelector(
//     (DashbordSlice) => DashbordSlice.dashboard.getAllRoles
//   );
// const filterrole=useSelector(RoleMasterSlice=>RoleMasterSlice.rolemaster.filterRoleData)
//   console.log("f",filterrole)
//   const cityData = useSelector(
//     (DashbordSlice) => DashbordSlice.dashboard.sortedCityData
//   );
//   const AllcityDropDownData = useSelector(
//     (DashbordSlice) => DashbordSlice.dashboard.cityData
//   );
//   const designationDropdown = useSelector(
//     (DesignationSlice) =>
//       DesignationSlice.designationMaster.sortedDesignationData
//   );
//   const checkRole = useSelector((DashbordSlice) =>
//     DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 3)
//   );
//   const stateDropdown = useSelector(
//     (DashbordSlice) => DashbordSlice.dashboard.stateData
//   );

//   console.log("s",stateDropdown)
//   const handlePasswordValidation = (e) => {
//     if (e.target.value === "") {
//       setInputState({ ...state, passwordErr: "Please enter Password" });
//     } else {
//       setInputState({ ...state, passwordErr: "" });
//     }
//     setPassword(e.target.value);
//     const passwordValidation = e.target.value;
//     if (passwordValidation.length > 20) {
//       setPasswordError("Enter Password min. 6 & max. 20");
//       setPasswordValid(true);
//     } else if (passwordValidation.length < 6) {
//       setPasswordError("Enter Password min. 6 & max. 20");
//       setPasswordValid(true);
//     } else {
//       setPasswordError("");
//       setPasswordValid(false);
//     }

//     // Compare passwords
//     if (
//       confirmedPasswordRef.current.value !== "" &&
//       confirmedPasswordRef.current.value !== passwordValidation
//     ) {
//       setConfirmPasswordError(true);
//     } else {
//       setConfirmPasswordError(false);
//     }
//   };

//   const [inputState, setInputState] = useState({
//     firstNameErr: "",
//     middleNameErr: "",
//     lastNameErr: "",
//     emailErr: "",
//     userNameErr: "",
//     contactNoErr: "",
//     whatsappErr: "",
//     passwordErr: "",
//     confirmed_PassErr: "",
//     roleErr: "",
//     designationErr: "",
//     departmentErr: "",
//   });

//   function checkingValidation(form) {
//     var selectFirstName = form.getAll("first_name")[0];
//     var selectMiddleName = form.getAll("middle_name")[0];
//     var selectLastName = form.getAll("last_name")[0];
//     var selectEmail = form.getAll("email_id")[0];
//     var selectUserName = form.getAll("user_name")[0];
//     var selectContactNo = form.getAll("contact_no")[0];
//     var selectPassword = form.getAll("password")[0];
//     var selectWhatsapp = form.getAll("whats_app_contact_no")[0];
//     var selectRole = form.getAll("role_id")[0];
//     var selectDesignation = form.getAll("designation_id")[0];

//     let flag = 0;
//     if (selectFirstName == "") {
//       setInputState({ ...state, firstNameErr: " Please enter First Name" });
//       flag = 1;
//     } else if (selectMiddleName == "") {
//       setInputState({ ...state, middleNameErr: " Please enter Middle Name" });
//       flag = 1;
//     } else if (selectLastName == "") {
//       setInputState({ ...state, lastNameErr: " Please enter last Name" });
//       flag = 1;
//     } else if (selectEmail == "") {
//       setInputState({ ...state, emailErr: " Please enter Email" });
//       flag = 1;
//     } else if (selectUserName == "") {
//       setInputState({ ...state, userNameErr: " Please enter username" });
//       flag = 1;
//     } else if (selectContactNo == "") {
//       setInputState({ ...state, contactNoErr: " Please enter contact no." });
//       flag = 1;
//     } else if (selectRole == "") {
//       setInputState({ ...state, roleErr: " Please Select role" });
//       flag = 1;
//     } else if (selectDesignation == "") {
//       setInputState({ ...state, designationErr: " Please Select designation" });
//       flag = 1;
//     } else if (selectContactNo.length < 10) {
//       setInputState({ ...state, contactNoErr: "Invalid Contact Number" });
//       flag = 1;
//     } else if (selectContactNo.length > 10) {
//       setInputState({
//         ...state,
//         contactNoErr: "contact length should be equal to 10",
//       });
//       flag = 1;
//     } else if (contactValid == true) {
//       alert("Enter valid Contact Number");
//       flag = 1;

//       flag = 1;
//     } else if (mailError == true) {
//       alert("Invalid Email");
//       flag = 1;
//     }
//     return flag;
//   }

//   const [emailError, setEmailError] = useState(null);
//   const [mailError, setMailError] = useState(false);
//   const [stateDropdownData, setStateDropdownData] = useState([]);
//   const [cityDropdownData, setCityDropdownData] = useState(false);

//   const handleEmail = (e) => {
//     if (e.target.value === "") {
//       setInputState({ ...state, emailErr: "Please enter valid Email" });
//     } else {
//       setInputState({ ...state, emailErr: "" });
//     }
//     const email = e.target.value;
//     const emailRegex =
//       /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
//     if (emailRegex.test(email) === false) {
//       setEmailError("Invalid Email");
//       setMailError(true);
//     } else {
//       setEmailError("");
//       setMailError(false);
//     }
//   };

//   // const [sameAs, setSameAs] = useState(false)

//   // const handleSameAs = (e) = {
//   //     console.log(e.target.checked)
//   // }

//   const [contactNumber, setContactNumber] = useState(null);

//   const [contactValid, setContactValid] = useState(false);
//   const handleContactValidation = (e) => {
//     const contactValidation = e.target.value;
//     if (
//       contactValidation.charAt(0) == "9" ||
//       contactValidation.charAt(0) == "8" ||
//       contactValidation.charAt(0) == "7" ||
//       contactValidation.charAt(0) == "6"
//     ) {
//       setInputState({ ...state, contactNoErr: "" });
//       setContactValid(false);
//     } else {
//       setInputState({ ...state, contactNoErr: "Invalid Mobile Number" });
//       setContactValid(true);
//     }

//     if (contactValidation.length < 11) {
//       setContactNumber(contactValidation);
//     }
//   };

//   const [whatsappNumber, setWhatsappNumber] = useState(null);
//   const [filteredRoles, setFilteredRoles] = useState([]);

//   const [whatsappValid, setWhatsappValid] = useState(false);
//   const handleWhatsappValidation = (e) => {
//     const whatsappValidation = e.target.value;
//     if (
//       whatsappValidation.charAt(0) == "9" ||
//       whatsappValidation.charAt(0) == "8" ||
//       whatsappValidation.charAt(0) == "7" ||
//       whatsappValidation.charAt(0) == "6"
//     ) {
//       setInputState({ ...state, whatsappErr: "" });
//       setWhatsappValid(false);
//     } else {
//       setInputState({ ...state, whatsappErr: "Invalid Whatsapp Number" });
//       setWhatsappValid(true);
//     }

//     if (whatsappValidation.length < 11) {
//       setWhatsappNumber(whatsappValidation);
//     }
//   };

//   // const handleDependent = (e, name) => {
//   //   setData({
//   //     ...data,
//   //     [name]: e.value,
//   //   });
//   // };

//   const handleChangeAccountFor = (e) => {
//     setAccountFor(e.target.value);
//   };

//   const handleForm = async (e) => {
//     e.preventDefault();
//     const form = new FormData(e.target);
//     var flag = 1;
//     setNotify(null);
//     var a = JSON.stringify(Object.fromEntries(form));

//     const formValidation = checkingValidation(form);
//     if (formValidation === 1) {
//       return false;
//     }

//     if (flag === 1) {
//       dispatch(updateUserData({id:userId,payload:form}))

//       // await new UserService()
//       //   .updateUser(userId, form)
//       //   .then((res) => {
//       //     if (res.status === 200) {
//       //       if (res.data.status === 1) {
              
//       //         history({
//       //           pathname: `/${_base}/User`,
//       //         },   
//       //             {state: {type:"success", message: res.data.message}},
//       //                );
//       //       } else {
//       //         setNotify({ type: "danger", message: res.data.message });
//       //       }
//       //     } else {
//       //       setNotify({ type: "danger", message: res.message });
//       //       new ErrorLogService().sendErrorLog(
//       //         "User",
//       //         "Create_User",
//       //         "INSERT",
//       //         res.message
//       //       );
//       //     }
//       //   })
//       //   .catch((error) => {

//       //     if (error.response) {
//       //       const { request, ...errorObject } = error.response;
//       //       new ErrorLogService().sendErrorLog(
//       //         "User",
//       //         "Create_User",
//       //         "INSERT",
//       //         errorObject.data.message
//       //       );
//       //     } else {
//       //       console.error(error);
//       //     }
          
          
          
//       //   });
//       // }
//     }
//   };

//   const loadData = async () => {
//     //  **************************Country load data**************************************
//     // await new CountryService().getCountry().then((res) => {
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
//     // await new StateService().getState().then((res) => {
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

//     // await new DepartmentService().getDepartment().then((res) => {
//     //   if (res.status == 200) {
//     //     const temp = [];
//     //     if (res.data.status == 1) {
//     //       setDepartmentDropdown(
//     //         res.data.data
//     //           .filter((d) => d.is_active === 1)
//     //           .map((d) => ({ value: d.id, label: d.department }))
//     //       );
//     //     }
//     //   }
//     // });

//     // await new RoleService().getRole().then((res) => {
//     //   if (res.status == 200) {
//     //     if (res.data.status == 1) {
//     //       const data = res.data.data.filter((d) => d.is_active == 1);
//     //       setRoleDropdown(
//     //         res.data.data
//     //           .filter((d) => d.is_active === 1)
//     //           .map((d) => ({ value: d.id, label: d.role }))
//     //       );
//     //     }
//     //   }
//     // });

//     // await new DesignationService().getDesignation().then((res) => {
//     //   if (res.status == 200) {
//     //     if (res.data.status == 1) {
//     //       const data = res.data.data.filter((d) => d.is_active == 1);
//     //       setDesignationDropdown(
//     //         res.data.data
//     //           .filter((d) => d.is_active === 1)
//     //           .map((d) => ({ value: d.id, label: d.designation }))
//     //       );
//     //     }
//     //   }
//     // });
//   // }
//     // const data = [];
//     // await new UserService()
//     //   .getUserById(userId)
//     //   .then((res) => {
//     //     if (res.status === 200) {
//     //       if (res.data.status == 1) {
//     //         const temp = res.data.data;
//     //         setAccountFor(temp.account_for);
//     //         const tempDept = temp.department.map((d) => ({
//     //           value: d.department_id,
//     //           label: d.department_name,
//     //         }));
//     //         setDefaultDepartmentDropdown(tempDept);
//     //         const tempUserDept = temp.department.map((d) => ({
//     //           value: d.department_id,
//     //           label: d.department_name,
//     //         }));
//     //         setUserDepartment(tempUserDept);
//     //         const tempDefaultDept = temp.department
//     //           .filter((d) => d.is_default == 1)
//     //           .map((d) => ({
//     //             value: d.department_id,
//     //             label: d.department_name,
//     //           }));
//     //         setDefaultDepartment(tempDefaultDept);
//     //         setData(null);
//     //         setData(temp);
//     //       } else {
//     //       }
//     //     }
//     //   })
//     //   .catch((error) => {
//     //     const { response } = error;
//     //     const { request, ...errorObject } = response;
//     //     new ErrorLogService().sendErrorLog(
//     //       "Status",
//     //       "Get_Status",
//     //       "INSERT",
//     //       errorObject.data.message
//     //     );
//     //   });

//     await new DepartmentMappingService()
//       .getDepartmentMappingByEmployeeId(userId)
//       .then((res) => {
//         if (res.status === 200) {
//           if (res.data.status == 1) {
//             const temp = [];
//             res.data.data.forEach((d) => {
//               temp.push({
//                 department_id: d.department_id,
//                 ticket_passing_authority: d.ticket_passing_authority,
//                 ticket_show_type: d.ticket_show_type,
//                 is_default: d.is_default,
//               });
//             });
//             setRows(null);
//             setRows(temp);
//           } else {
//             setRows([mappingData]);
//           }
//         } else {
//           setRows([mappingData]);
//         }
//       });

//   //   await new ManageMenuService().getRole(roleId).then((res) => {
//   //     if (res.status === 200) {
//   //       if (res.data.status == 1) {
//   //         const getRoleId = sessionStorage.getItem("role_id");
//   //         setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
//   //         // setRoleMenu(res.data.data.map((menu)=>{ menu.menu_id}))
//   //       }
//   //     }
//   //   });
//   };
//   const handleDependentChange = (e, type) => {
//     if (type == "COUNTRY") {
//       //setStateDropdown(state.filter(d => d.country_id == e.value).map(d => ({ value: d.id, label: d.state })));
//       // setStateDropdown(
//       //   state
//       //     .filter((d) => d.country_id == e.value)
//       //     .map((d) => ({ value: d.id, label: d.state }))
//       // );
//       setStateDropdownData(stateDropdown.filter((filterState) => filterState.country_id === e.value).map((d)=>({ value: d.id, label: d.state })))
//       setCityDropdownData(AllcityDropDownData.filter((filterState) => filterState.state_id===e.value).map((d) => ({ value: d.id, label: d.city })))
//       const newStatus = { ...updateStatus, statedrp: 1 };
//       setUpdateStatus(newStatus);
//       setStateName(null);
//       setCityName(null);
//       setCityDropdownData(null);

//     }
//     if (type == "STATE") {
//       //setCityDropdown(city.filter(d => d.state_id == e.value).map(d => ({ value: d.id, label: d.city })));
//       // setCityDropdownData(
//       //   city
//       //     .filter((d) => d.state_id == e.value)
//       //     .map((d) => ({ value: d.id, label: d.city }))
//       // );
//       setCityDropdownData(AllcityDropDownData?.filter((filterState) => filterState.state_id===e.value)?.map((d) => ({ value: d.id, label: d.city })))

//       const newStatus = { ...updateStatus, citydrp: 1 };
//       setUpdateStatus(newStatus);
//       setStateName(e);
//       setCityName(null);
//     }
//   };
//   const handleAddRow = async () => {
//     setNotify(null);
//     let flag = 1;
//     // let last=rows.length-1;

//     // if(!rows[last].department_id ){
//     //     flag=0;
//     //     setNotify({ type: 'danger', message: "Complete Previous Record" })
//     // }

//     if (flag === 1) {
//       await setRows([...rows, mappingData]);
//     } else {
//       setNotify({ type: "danger", message: "Complete Previous Record" });
//     }
//   };

//   const handleRemoveSpecificRow = (idx) => () => {
//     if (idx > 0) {
//       setRows(rows.filter((_, i) => i !== idx));
//     }
//   };

//   const [departmentValue, setDepartmentValue] = useState(false);

//   const handleCheckInput = (e, id, type) => {
//     // if (e.value) {
//     //     setDepartmentValue(true)
//     // }
//     let flag = 1;
//     if (type == "DEPARTMENT") {
//       rows.forEach((d, i) => {
//         if (d.department_id == e.value) {
//           flag = 0;
//           alert("Department is already selected ");
//         }
//       });
//     }

//     if (flag == 1) {
//       let temp_state = [...rows];
//       let actualIndex = null;
//       temp_state.forEach((ele, index) => {
//         if (index == id) {
//           actualIndex = index;
//         }
//       });
//       let temp_element = { ...rows[actualIndex] };
//       if (type == "DEPARTMENT") {
//         temp_element.department_id = e.value;
//       } else if (type == "TICKET_SHOW") {
//         temp_element.ticket_show_type = e.value;
//       } else if (type == "TICKET_PASSING_AUTHORITY") {
//         temp_element.ticket_passing_authority =
//           e.target.checked == true ? 1 : 0;
//       } else if (type == "IS_DEFAULT") {
//         temp_element.is_default = e.target.checked == true ? 1 : 0;
//         temp_state.forEach((d, i) => {
//           temp_state[i].is_default = 0;
//         });
//       }
//       temp_state[actualIndex] = temp_element;
//       setRows(temp_state);
//     }
//   };
//   const [roleD, setRoleD] = useState(filterrole.filter(d => d.value === data.role_id)); // State to hold the selected role


// // const roleD =   data &&
// // filterrole &&filterrole.filter((d) => d.value == data.role_id)

// useEffect(() => {
//   // Dispatch action to set default value when component mounts
//   if (data && filterrole) {
//     const defaultRole = filterrole.filter(d => d.value === data.role_id);
//     console.log("dd",defaultRole)
//     if (defaultRole) {
//       setRoleD(defaultRole.value);
//     }
//   }
// }, [data, filterrole]);
// console.log("rol",roleD)  

// const handleChange = (selectedValue) => {
//   // Handle onChange event
//   setRoleD(selectedValue);
//   // Dispatch action or perform other actions based on the selected value
// };


//   const sortSlefRole= roleDropdown && roleDropdown?.filter(d=>{return d.role.toLowerCase() !== "user"; })
// const filterSelfRole = sortSlefRole?.filter((d) => d.is_active === 1)
// .map((d) => ({
//   value: d.id,
//   label: d.role,
// }));
// const orderedSelfRoleData = filterSelfRole?.sort(function (a, b) {
//   return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
// });


// const customerSort= roleDropdown && roleDropdown?.filter(d=>{return d.role.toLowerCase() === "user"; })
// const filterCutomerRole = customerSort?.filter((d) => d.is_active === 1)
// .map((d) => ({
//   value: d.id,
//   label: d.role,
// }));
// const orderedCustomerRoleData = filterCutomerRole?.sort(function (a, b) {
//   return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
// });



//   const accountForChange = async (account_for) => {
//     setAccountFor(account_for);
//     const accountFor = account_for;
//     const filteredAsAccountFor = roleDropdown.filter((filterData) => {
//       if (accountFor === "SELF") {
//         return filterData.role.toLowerCase() !== "user";
//       } else if (accountFor === "CUSTOMER") {
//         return filterData.role.toLowerCase() === "user";
//       }
//     });

//     const response = filteredAsAccountFor
//       ?.filter((d) => d.is_active === 1)
//       .map((d) => ({
//         value: d.id,
//         label: d.role,
//       }));
//     const aa = response.sort(function (a, b) {
//       return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
//     });
//     setFilteredRoles(aa);
//   }

//   const handleDeparmentChange = (e) => {
//     setDefaultDepartmentDropdown(e);
//   };

//   const handleConfirmedPassword = (event) => {
//     if (event.target.value === password) {
//       setConfirmPasswordError(false);
//     } else {
//       setConfirmPasswordError(true);
//     }
//   };

//   const [value, setValue] = useState("");
//   const onPaste = (e) => {
//     const paste = e.clipboardData.getData("text/plain");
//     if (paste.match(/[-\.]/)) return;
//     setValue(paste);
//   };
//   useEffect(()=>{
//     if(checkRole && checkRole[0]?.can_update === 0){
//       // alert("Rushi")

//       window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
//     }
//   },[checkRole])

//   // useEffect(() => {
//   //   if (Notify) {
//   //     const timer = setTimeout(() => {
//   //       dispatch(hideNotification());
//   //     }, 5000); // Adjust the timeout duration as needed
//   //     return () => clearTimeout(timer);
//   //   }
//   // }, [Notify, dispatch]);
//   useEffect(() => {
//     loadData();

//     if(!data.length){

//       dispatch(getAllUserById(userId))
//     }
//     // if(!CountryData.length){
//     dispatch(getCountryDataSort())
//   // }
//     if(!stateDropdown){
//       dispatch(getStateDataSort());
    
//     }
//     // if(!stateDropdownData){
//       dispatch(getStateData());
    
//     // }
//     dispatch(departmentData())
//     // if(!AllcityDropDownData.length){
// dispatch(getCityData())
//     // }
//     if(!designationDropdown.length){
//       dispatch(getDesignationData())
//     }
//     if(!checkRole.length){
//     dispatch(getRoles());
//     }

//     dispatch(getAllRoles())

//     dispatch(getRoleData())

//     // if(!data){
//     // }
//   }, []);
//   // useEffect(() => {

//   //   loadData();
//   //   var role = checkRole && checkRole.map((d,index)=>{
//   //     if(d.menu_id == 3){
//   //     return d[index]
//   //     }
//   //   })

//   //     if(role === 0){
//   //     <Redirect to= {`/${_base}/Dashboard`}/>
//   //   }
//   // }, [role]);

//   useEffect(() => {
//     if (
//       data !== null &&
//       stateDropdown !== null &&
//       updateStatus.statedrp === undefined
//     ) {
//       // setStateDropdown((prev) =>
//       //   prev.filter((stateItem) => stateItem.country_id === data.country_id)
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

//   const [copyData, setCopyData] = useState(null);

//   const [isReadOnly, setIsReadOnly] = useState(false);
//   function copyTextValue(e) {
//     if (e.target.checked) {
//       console.log("e",e.target.checked)
//       setIsReadOnly(true);
//     } else {
//       setIsReadOnly(false);
//     }
//     var text1 = e.target.checked
//       ? document.getElementById("contact_no").value
//       : "";
//     setCopyData(text1);
//     // document.getElementById("whats_app_contact_no").value = text1;
//   }

//   useEffect(() => {
//     if (
//       data !== null &&
//       cityDropdownData !== null &&
//       updateStatus.citydrp === undefined
//     ) {
//       // setCityDropdownData((prev) =>
//       //   prev.filter((stateItem) => stateItem.state_id === data.state_id)
//       // );
//       const newStatus = { ...updateStatus, citydrp: 1 };
//       setUpdateStatus(newStatus);
//       setCityName(
//         data &&
//           cityDropdownData &&
//           cityDropdownData.filter((d) => d.value == data.city_id)
//           ? data &&
//           cityDropdownData &&
//           cityDropdownData.filter((d) => d.value == data.city_id)
//           : cityName
//       );
//     }
//   }, [data, cityDropdownData]);

//   return (
//     <div className="container-xxl">
//       <PageHeader headerTitle="Edit User" />
//       {Notify && <Alert alertData={Notify} />}

//       <form
//         onSubmit={handleForm}
//         ref={userForm}
//         encType="multipart/form-data"
//         method="post"
//       >
//         <Tabs
//           defaultActiveKey={tabKey}
//           activeKey={tabKey}
//           onSelect={(k) => setTabKey(k)}
//           transition={false}
//           id="noanim-tab-example1"
//           className=" tab-body-header rounded d-inline-flex"
//         >
//           <Tab eventKey="All_Tickets" title="User Details">
//             {data && (
//               <div className="row clearfix g-3">
//                 <div className="col-sm-12">
//                   <div className="card">
//                     {/* <div className='card-header bg-primary text-white p-2'>
//                                   <h5>User Details</h5>
//                               </div> */}
//                     <div className="card-body">
//                     {localStorage.getItem("account_for") == "SELF" && (
//                       <div className="form-group row">
//                         <label className="col-sm-2 col-form-label">
//                           <b>
//                             Account For :<Astrick color="red" />
//                           </b>
//                         </label>
//                         <div className="col-sm-3">
//                           <select
//                             className="form-control form-control-sm"
//                             id="account_for"
//                             name="account_for"
//                             value={accountFor ? accountFor : ""}
//                             // onChange={(e) => {
//                             //   setAccountFor(e.target.value);
//                             // }}
//                             onChange={(e) => accountForChange(e.target.value)}
//                           >
//                             {/* <option value="SELF" selected>{data.accountFor}</option> */}
//                             <option value="SELF">SELF</option>
//                             <option value="CUSTOMER">CUSTOMER</option>
//                           </select>
//                         </div>
//                       </div>
//                     )}

//                       {accountFor && accountFor === "CUSTOMER" && (
//                         <div className="form-group row mt-3">
//                           <label className="col-sm-2 col-form-label">
//                             <b>
//                               Select Customer:
//                               <Astrick color="red" />
//                             </b>
//                           </label>
//                           <div className="col-sm-4">
//                             <CustomerDropdown
//                               id="customer_id"
//                               name="customer_id"
//                               defaultValue={
//                                 data.customer_id ? data.customer_id : ""
//                               }
                              
//                               readOnly={true}
//                               required={true}
//                             />
//                           </div>
//                         </div>
//                       )}

//                       <div className="form-group row mt-3">
//                         <label className="col-sm-2 col-form-label">
//                           <b>
//                             Full Name :<Astrick color="red" />
//                           </b>
//                         </label>
//                         <div className="col-sm-3">
//                           <input
//                             type="text"
//                             className="form-control form-control-sm"
//                             id="first_name"
//                             name="first_name"
//                             placeholder="First Name"
//                             maxLength={30}
//                             defaultValue={
//                               data.first_name ? data.first_name : ""
//                             }
//                             onKeyPress={(e) => {
//                               Validation.CharactersNumbersOnly(e);
//                             }}
//                             onChange={(event) => {
//                               if (event.target.value === "") {
//                                 setInputState({
//                                   ...state,
//                                   firstNameErr: "First Name Required",
//                                 });
//                               } else {
//                                 setInputState({ ...state, firstNameErr: "" });
//                               }
//                             }}
//                           />
//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                               }}
//                             >
//                               {inputState.firstNameErr}
//                             </small>
//                           )}
//                         </div>
//                         <div className="col-sm-3">
//                           <input
//                             type="text"
//                             className="form-control form-control-sm"
//                             id="middle_name"
//                             name="middle_name"
//                             placeholder="Middle Name"
//                             maxLength={30}
//                             defaultValue={
//                               data.middle_name ? data.middle_name : ""
//                             }
//                             onKeyPress={(e) => {
//                               Validation.CharactersNumbersOnly(e);
//                             }}
//                             onChange={(event) => {
//                               if (event.target.value === "") {
//                                 setInputState({
//                                   ...state,
//                                   middleNameErr: "Middle Name Required",
//                                 });
//                               } else {
//                                 setInputState({ ...state, middleNameErr: "" });
//                               }
//                             }}
//                           />
//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                               }}
//                             >
//                               {inputState.middleNameErr}
//                             </small>
//                           )}
//                         </div>
//                         <div className="col-sm-3">
//                           <input
//                             type="text"
//                             className="form-control form-control-sm"
//                             id="last_name"
//                             name="last_name"
//                             placeholder="Last Name"
//                             maxLength={30}
//                             defaultValue={data.last_name ? data.last_name : ""}
//                             onKeyPress={(e) => {
//                               Validation.CharactersNumbersOnly(e);
//                             }}
//                             onChange={(event) => {
//                               if (event.target.value === "") {
//                                 setInputState({
//                                   ...state,
//                                   lastNameErr: "Last Name Required",
//                                 });
//                               } else {
//                                 setInputState({ ...state, lastNameErr: "" });
//                               }
//                             }}
//                           />

//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                               }}
//                             >
//                               {inputState.lastNameErr}
//                             </small>
//                           )}
//                         </div>
//                       </div>

//                       <div className="form-group row mt-3">
//                         <label className="col-sm-2 col-form-label">
//                           <b>
//                             Email Address : <Astrick color="red" />
//                           </b>
//                         </label>
//                         <div className="col-sm-3">
//                           <input
//                             type="email"
//                             className="form-control form-control-sm"
//                             id="email_id"
//                             name="email_id"
//                             placeholder="Email Address"
//                             defaultValue={data.email_id ? data.email_id : ""}
//                             onChange={handleEmail}
//                             //onKeyPress={e => { Validation.password(e) }}
//                           />
//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                               }}
//                             >
//                               {emailError}
//                             </small>
//                           )}
//                         </div>

//                         <label className="col-sm-3 col-form-label text-end">
//                           <b>
//                             Username : <Astrick color="red" />
//                           </b>
//                         </label>
//                         <div className="col-sm-3">
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="user_name"
//                             name="user_name"
//                             placeholder="Username"
//                             maxLength={30}
//                             onKeyPress={(e) => {
//                               Validation.CharactersNumbersOnly(e);
//                             }}
//                             defaultValue={data.user_name ? data.user_name : ""}
//                             onChange={(event) => {
//                               if (event.target.value === "") {
//                                 setInputState({
//                                   ...state,
//                                   userNameErr: "Please enter username",
//                                 });
//                               } else {
//                                 setInputState({ ...state, userNameErr: "" });
//                               }
//                             }}
//                           />
//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                               }}
//                             >
//                               {inputState.userNameErr}
//                             </small>
//                           )}
//                         </div>
//                       </div>

//                       <div
//                         className="form-group row mt-3"
//                         style={{ position: "relative", display: "flex" }}
//                       >
//                         <label className="col-sm-2 col-form-label">
//                           <b>
//                             Contact Number : <Astrick color="red" />
//                           </b>
//                         </label>
//                         <div className="col-sm-3">
//                           <input
//                             type="text"
//                             className="form-control form-control-sm"
//                             id="contact_no"
//                             name="contact_no"
//                             placeholder="Contact Number"
//                             defaultValue={
//                               data.contact_no ? data.contact_no : ""
//                             }
//                             // value={contactNumber ? contactNumber : ""}
//                             onChange={handleContactValidation}
//                             onKeyPress={(e) => {
//                               Validation.mobileNumbersOnly(e);
//                             }}
//                           />
//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                               }}
//                             >
//                               {inputState.contactNoErr}
//                             </small>
//                           )}
//                         </div>
//                         {/* <label className="col-sm-2 col-form-label">
//                           <b>Same as Contact No. :</b>
//                         </label> */}
//                          <label className="col-sm-3 col-form-label text-end ">
//                         <b className="mx-3">Same as Contact No. or</b>
//                         <br/>
//                         <b className="mx-3">Whats App Contact Number :</b>
//                        {/* <label className="col-sm-3 col-form-label text-end "> */}
//                         {/* </label> */}
//                         <input
//                           type="checkbox"
//                           name="check1"
//                           defaultChecked={data.check1 == 1}

//                           onChange={copyTextValue}
//                           style={{ position: "absolute", top: "32%" }}
//                         />
//                         {/* <b>Whats App Number :</b> */}
//                       </label>
//                         {/* <div className="col-sm-1">
//                           <input
//                             defaultChecked={data.check1 == 1}
//                             type="checkbox"
//                             name="check1"
//                             onChange={copyTextValue}
//                             style={{ position: "absolute", top: "20%" }}
//                           />
//                         </div> */}
//                         {/*
//                         <label className="col-sm-2 col-form-label">
//                           <b>Whats App Number :</b>
//                         </label> */}
//                         {console.log("data**",data)}
//                         <div className="col-sm-3">
//                           <input
//                             type="text"
//                             className="form-control form-control-sm"
//                             id="whats_app_contact_no"
//                             name="whats_app_contact_no"
//                             placeholder="Whats App Contact Number"
//                             defaultValue={
//                               data.whats_app_contact_no
//                                 ? data.whats_app_contact_no
//                                 : ""
//                             }
//                             readOnly={isReadOnly}
//                             // value={copyData ? copyData : ""}
//                             minLength={10}
//                             maxLength={10}
//                             onKeyPress={(e) => {
//                               Validation.mobileNumbersOnly(e);
//                             }}
//                             onChange={handleWhatsappValidation}
//                             onPaste={(e) => {
//                               e.preventDefault();
//                               return false;
//                             }}
//                             onCopy={(e) => {
//                               e.preventDefault();
//                               return false;
//                             }}
//                           />
//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                               }}
//                             >
//                               {inputState.whatsappErr}
//                             </small>
//                           )}
//                         </div>
//                       </div>

//                       {/* <div className="form-group row mt-3">
//                         <label className="col-sm-2 col-form-label">
//                           <b> Password : </b>
//                         </label>
//                         <div
//                           className="col-sm-4"
//                           style={{ position: "relative", display: "flex" }}
//                         >
//                           <InputGroup className="">
//                             <input
//                               className="form-control"
//                               id="password"
//                               name="password"
//                               placeholder="Password"
//                               minLength={6}
//                               maxLength={12}
//                               type={passwordShown ? "text" : "password"}
//                               onKeyPress={(e) => {
//                                 Validation.password(e);
//                               }}
//                               onChange={(e) => { handlePasswordValidation(e)}}
//                             />
//                             <InputGroup.Text>
//                               <i
//                                 className="bi bi-eye-fill"
//                                 onClick={togglePasswordVisiblity}
//                               ></i>
//                             </InputGroup.Text>
//                           </InputGroup>
//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                                 position: "absolute",
//                                 top: "95%",
//                               }}
//                             >
//                               {inputState.passwordErr}
//                             </small>
//                           )}
//                         </div>

//                         <label className="col-sm-2 col-form-label">
//                           <b>Confirmed Password : </b>
//                         </label>
//                         <div
//                           className="col-sm-4"
//                           style={{ position: "relative", display: "flex" }}
//                         >
//                           <InputGroup className="">
//                             <input
//                               className="form-control form-control-sm "
//                               id="confirmed_password"
//                               name="confirmed_password"
//                               placeholder="confirmed_password"
//                               type={passwordShown1 ? "text" : "password"}
//                               onKeyPress={(e) => {
//                                 Validation.password(e);
//                               }}
//                               onChangeCapture={handleConfirmedPassword}
//                               onPaste={(e) => {
//                                 e.preventDefault();
//                                 return false;
//                               }}
//                               onCopy={(e) => {
//                                 e.preventDefault();
//                                 return false;
//                               }}
//                             />
//                             <InputGroup.Text>
//                               <i
//                                 className="bi bi-eye-fill"
//                                 onClick={togglePasswordVisiblity1}
//                               ></i>
//                             </InputGroup.Text>
//                           </InputGroup>
//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                                 position: "absolute",
//                                 top: "95%",
//                               }}
//                             >
//                               {inputState.confirmed_PassErr}
//                             </small>
//                           )}
//                         </div>
//                         {confirmPasswordError && (
//                           <span
//                             style={{
//                               color: "red",
//                               position: "relative",
//                               left: "67%",
//                             }}
//                           >
//                             Password Not matched
//                           </span>
//                         )}
//                       </div> */}
//                       <div className="form-group row mt-3">
//                         <label className="col-sm-2 col-form-label">
//                           <b>
//                             {" "}
//                             Password : <Astrick color="red" />
//                           </b>
//                         </label>
//                         <div
//                           className="col-sm-3"
//                           style={{ position: "relative", display: "flex" }}
//                         >
//                           <InputGroup className="">
//                             <input
//                               typeof="password"
//                               className="form-control"
//                               id="password"
//                               name="password"
//                               placeholder="Password"
//                               // minLength={6} // Minimum length is set to 8 characters
//                               // maxLength={12}
//                               // defaultValue={data.password}
//                               type={passwordShown ? "text" : "password"}
//                               onKeyPress={(e) => {
//                                 Validation.password(e);
//                               }}
//                               // onChange={handlePasswordValidation}
//                               onPaste={(e) => {
//                                 e.preventDefault();
//                                 return false;
//                               }}
//                               onCopy={(e) => {
//                                 e.preventDefault();
//                                 return false;
//                               }}
//                             />

//                             <InputGroup.Text>
//                               <i
//                                 className="bi bi-eye-fill"
//                                 onClick={togglePasswordVisiblity}
//                               ></i>
//                             </InputGroup.Text>
//                           </InputGroup>

//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                                 position: "absolute",
//                                 top: "95%",
//                               }}
//                             >
//                               {inputState.passwordErr}
//                             </small>
//                           )}
//                         </div>

//                         <label className="col-sm-3 col-form-label text-end">
//                           <b>
//                             Confirmed Password :<Astrick color="red" />{" "}
//                           </b>
//                         </label>
//                         <div
//                           className="col-sm-3"
//                           style={{ position: "relative", display: "flex" }}
//                         >
//                           <InputGroup>
//                             <input
//                               className="form-control form-control-sm "
//                               placeholder="confirmed_password"
//                               name="confirm_password"
//                               id="confirm_password"
//                               ref={confirmedPasswordRef}
//                               // onChange={handleConfirmedPassword}
//                               // defaultValue={data.password}

//                               type={passwordShown1 ? "text" : "Password"}
//                               onPaste={(e) => {
//                                 e.preventDefault();
//                                 return false;
//                               }}
//                               onCopy={(e) => {
//                                 e.preventDefault();
//                                 return false;
//                               }}
//                             />
//                             <InputGroup.Text>
//                               <i
//                                 className="bi bi-eye-fill"
//                                 onClick={togglePasswordVisiblity1}
//                               ></i>
//                             </InputGroup.Text>
//                           </InputGroup>

//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                                 position: "absolute",
//                                 top: "95%",
//                               }}
//                             >
//                               {inputState.confirmed_PassErr}
//                             </small>
//                           )}
//                         </div>
//                         {confirmPasswordError && (
//                           <span
//                             style={{
//                               color: "red",
//                               position: "relative",
//                               left: "67%",
//                             }}
//                           >
//                             Password Not matched
//                           </span>
//                         )}
//                       </div>

//                       <div className="form-group row mt-3">
//                         <label className="col-sm-2 col-form-label">
//                           <b>
//                             Select Role : <Astrick color="red" />
//                           </b>
//                         </label>
//                         <div className="col-sm-3">

//                           {filterrole && data &&
//                            (
                            
//                             <Select
//                               id="role_id"
//                               name="role_id"
//                               // options={filteredRoles}
//                           options={accountFor === "SELF" ? orderedSelfRoleData : orderedCustomerRoleData}
//                           onChange={handleChange}
//                               // defaultValue={
//                               //   data &&
//                               //   filterrole &&
//                               //   filterrole.filter(
//                               //     (d) => d.value == data.role_id
//                               //   )
//                               // }
//                               value={roleD}

//                             />
//                           )}

// {filterrole && data && <h1></h1>}


//                           {inputState && (
//                             <small
//                               style={{
//                                 color: "red",
//                                 position: "relative",
//                               }}
//                             >
//                               {inputState.roleErr}
//                             </small>
//                           )}
//                         </div>

//                         <label
//                           className="col-sm-3 col-form-label "
//                           style={{ textAlign: "right" }}
//                         >
//                           <b>
//                             Select Designation : <Astrick color="red" />
//                           </b>
//                         </label>
//                         {designationDropdown && (
//                           <div className="col-sm-3">
//                             <Select
//                               id="designation_id"
//                               name="designation_id"
//                               options={designationDropdown}
//                               defaultValue={
//                                 data &&
//                                 designationDropdown &&
//                                 designationDropdown.filter(
//                                   (d) => d.value == data.designation_id
//                                 )
//                               }
//                             />
//                           </div>
//                         )}
//                         {inputState && (
//                           <small
//                             style={{
//                               color: "red",
//                               position: "relative",
//                             }}
//                           >
//                             {inputState.designationErr}
//                           </small>
//                         )}
//                       </div>

//                       <div className="form-group row mt-3">
//                         <label className="col-sm-2 col-form-label">
//                           <b>
//                             Status : <Astrick color="red" />
//                           </b>
//                         </label>
//                         <div className="col-sm-10">
//                           <div className="row">
//                             <div className="col-md-2">
//                               <div className="form-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="radio"
//                                   name="is_active"
//                                   id="is_active_1"
//                                   value="1"
//                                   defaultChecked={
//                                     data && data.is_active === 1 ? true : false
//                                   }
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="is_active_1"
//                                 >
//                                   Active
//                                 </label>
//                               </div>
//                             </div>
//                             <div className="col-md-1">
//                               <div className="form-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="radio"
//                                   name="is_active"
//                                   id="is_active_0"
//                                   value="0"
//                                   defaultChecked={
//                                     data && data.is_active === 0 ? true : false
//                                   }
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="is_active_0"
//                                 >
//                                   Deactive
//                                 </label>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>{" "}
//                     {/* CARD BODY */}
//                   </div>{" "}
//                   {/* CARD */}
//                   {/* ********* ADDRESS ********* */}
//                   <div className="card mt-2">
//                     <div className="card-header bg-primary text-white p-2">
//                       <h5>Address Details</h5>
//                     </div>
//                     <div className="card-body">
//                       <div className="form-group row mt-3">
//                         <label className="col-sm-2 col-form-label">
//                           <b>Address : </b>
//                         </label>
//                         <div className="col-sm-10">
//                           <textarea
//                             className="form-control form-control-sm"
//                             id="address"
//                             name="address"
//                             placeholder="Enter maximum 250 character"
//                             rows="4"
//                             maxLength={250}
//                             onKeyPress={(e) => {
//                               Validation.addressFieldOnly(e);
//                             }}
//                             defaultValue={data.address ? data.address : ""}
//                           />
//                         </div>
//                       </div>

//                       <div className="form-group row mt-3">
//                         <label className="col-sm-2 col-form-label">
//                           <b>Pincode : </b>
//                         </label>
//                         <div className="col-sm-4">
//                           <input
//                             type="text"
//                             className="form-control form-control-sm"
//                             id="pincode"
//                             name="pincode"
//                             defaultValue={data.pincode ? data.pincode : ""}
//                             minLength={6}
//                             maxLength={6}
//                             onKeyPress={(e) => {
//                               Validation.NumbersOnly(e);
//                             }}
//                             onPaste={(e) => {
//                               e.preventDefault();
//                               return false;
//                             }}
//                             onCopy={(e) => {
//                               e.preventDefault();
//                               return false;
//                             }}
//                           />
//                         </div>

//                         <label
//                           className="col-sm-2 col-form-label"
//                           style={{ textAlign: "right" }}
//                         >
//                           <b>Country : </b>
//                         </label>
//                         <div className="col-sm-4">
//                           <Select
//                             options={CountryData}
//                             id="country_id"
//                             name="country_id"
//                             defaultValue={
//                               data &&
//                               CountryData &&
//                               CountryData.filter(
//                                 (d) => d.value == data.country_id
//                               )
//                             }
//                             onChange={(e) =>
//                               handleDependentChange(e, "COUNTRY")
//                             }
//                             //defaultValue={data && countryDropdown && countryDropdown.filter(d => d.value == data.country_id)}
//                           />
//                         </div>
//                       </div>
//                       {console.log("count",stateDropdownData)}

//                       <div className="form-group row mt-3">
//                         <label className="col-sm-2 col-form-label">
//                           <b>State : </b>
//                         </label>
//                         <div className="col-sm-4">
//                           <Select
//                             options={
//                               updateStatus.statedrp !== undefined
//                                 ? stateDropdownData
//                                 : []
//                             }
//                             id="state_id"
//                             name="state_id"
//                             defaultValue={data && stateDropdown && stateDropdown.filter(d => d.value == data.state_id)}
//                             // defaultValue={stateName ? stateName : ""}
//                             onChange={(e) => handleDependentChange(e, "STATE")}
//                             // value={stateName ? stateName : ""}
//                           />
//                         </div>

//                         <label
//                           className="col-sm-2 col-form-label"
//                           style={{ textAlign: "right" }}
//                         >
//                           <b>City : </b>
//                         </label>

//                         {cityDropdownData && (
//                           <div className="col-sm-4">
//                             <Select
//                               options={
//                                 updateStatus.citydrp !== undefined
//                                   ? cityDropdownData

//                                   : []
//                               }
//                               id="city_id"
//                               name="city_id"
//                               // defaultValue={data && cityDropdown && cityDropdown.filter(d => d.value == data.city_id) ? data && cityDropdown && cityDropdown.filter(d => d.value == data.city_id) : cityName}
//                               defaultValue={cityName ? cityName : ""}
//                               onChange={(e) => setCityName(e)}
//                               // value={cityName ? cityName : ""}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     {/* CARD BODY*/}
//                   </div>
//                   {/* CARD */}
//                 </div>
//               </div>
//             )}
//           </Tab>
//           <Tab eventKey="User_Settings" title="Departments">
//             <div className="card">
//               <div className="card-body">
//                 {rows && (
//                   <div className="">
//                     <table
//                       className="table table-bordered table-responsive mt-5"
//                       id="tab_logic"
//                     >
//                       <thead>
//                         <tr>
//                           <th
//                             className="text-center"
//                             style={{ width: "100px" }}
//                           >
//                             {" "}
//                             SR No{" "}
//                           </th>
//                           <th
//                             className="text-center"
//                             style={{ width: "300px" }}
//                           >
//                             {" "}
//                             Department
//                           </th>
//                           <th
//                             className="text-center"
//                             style={{ width: "300px" }}
//                           >
//                             {" "}
//                             Ticket Type Show{" "}
//                           </th>
//                           <th
//                             className="text-center"
//                             style={{ width: "300px" }}
//                           >
//                             {" "}
//                             Ticket Passing Authority{" "}
//                           </th>
//                           <th
//                             className="text-center"
//                             style={{ width: "300px" }}
//                           >
//                             {" "}
//                             Make Default{" "}
//                           </th>
//                           <th
//                             className="text-center"
//                             style={{ width: "100px" }}
//                           >
//                             {" "}
//                             Action
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {rows && rows?.map((item, idx) => (
//                           <tr key={idx}>
//                             <td className="text-center">{idx + 1}</td>
//                             <td>
//                               {console.log("rows",rows)}
                              
//                               {departmentDropdown && item.department_id &&
//                               <Select
//                                 options={departmentDropdown}
//                                 id={`department_id_` + idx}
//                                 name="department_id[]"
//                                 // onChange={e => departmentHandler(idx, e)}
//                                 defaultValue={
//                                   departmentDropdown?.filter(
//                                     (d) => d.value == item.department_id
//                                   )
//                                 }
//                               />
//                             }
//                             </td>
//                             <td>
//                               {options && item.ticket_show_type &&
//                               <Select
//                                 options={options}
//                                 id={`ticket_show_type_id_` + idx}
//                                 name="ticket_show_type[]"
//                                 // onChange={e => ticketShowHandler(idx, e)}
//                                 defaultValue={
//                                   rows &&
//                                   item.ticket_show_type &&
//                                   options.filter(
//                                     (d) => d.value == item.ticket_show_type
//                                   )
//                                 }
//                               />
//                               }
//                             </td>

//                             <td className="text-center">
//                               <input
//                                 type="hidden"
//                                 name="ticket_passing_authority[]"
//                                 value={
//                                   item.ticket_passing_authority
//                                     ? item.ticket_passing_authority
//                                     : 0
//                                 }
//                               />

//                               <input
//                                 type="checkbox"
//                                 id={`ticket_passing_authority_` + idx}
//                                 checked={item.ticket_passing_authority == 1}
//                                 onChange={(e) =>
//                                   handleCheckInput(
//                                     e,
//                                     idx,
//                                     "TICKET_PASSING_AUTHORITY"
//                                   )
//                                 }
//                               />
//                             </td>
//                             <td className="text-center">
//                               <input
//                                 type="hidden"
//                                 name="is_default[]"
//                                 value={item.is_default ? item.is_default : ""}
//                               />
//                               <input
//                                 type="checkbox"
//                                 id={`is_default_` + idx}
//                                 checked={item.is_default == 1}
//                                 onChange={(e) =>
//                                   handleCheckInput(e, idx, "IS_DEFAULT")
//                                 }
//                               />
//                             </td>

//                             <td>
//                               {idx == 0 && (
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm btn-outline-primary pull-left"
//                                   onClick={handleAddRow}
//                                 >
//                                   <i className="icofont-plus-circle"></i>
//                                 </button>
//                               )}
//                               {rows.length == idx + 1 && idx != 0 && (
//                                 <button
//                                   type="button"
//                                   className="btn btn-outline-danger btn-sm"
//                                   onClick={handleRemoveSpecificRow(idx)}
//                                 >
//                                   <i className="icofont-ui-delete"></i>
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Tab>
//         </Tabs>
//         <div className="mt-3" style={{ textAlign: "right" }}>
//           {tabKey == "All_Tickets" && (
//             <span
//               onClick={() => {
//                 const form = new FormData(userForm.current);
//                 const flag = checkingValidation(form);
//                 if (flag === 1) {
//                   return false;
//                 } else {
//                   setTabKey("User_Settings");
//                 }
//               }}
//               className="btn btn-primary"
//             >
//               Next
//             </span>
//           )}
//           {tabKey == "User_Settings" && (
//             <button type="submit" className="btn btn-primary">
//               Submit
//             </button>
//           )}

//           <Link to={`/${_base}/User`} className="btn btn-danger text-white">
//             Cancel
//           </Link>
//           {tabKey == "User_Settings" && (
//             <button
//               onClick={() => setTabKey("All_Tickets")}
//               className="btn btn-primary"
//             >
//               Back
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// export default EditUserComponent;

