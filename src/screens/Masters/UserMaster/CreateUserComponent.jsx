import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';
import { Astrick } from '../../../components/Utilities/Style';

import CustomerService from '../../../services/MastersService/CustomerService';

import InputGroup from 'react-bootstrap/InputGroup';

import { useDispatch, useSelector } from 'react-redux';
import {
  getAllRoles,
  getCityData,
  getCountryDataSort,
  getRoles,
  getStateData,
  getStateDataSort,
  postUserData,
  getEmployeeData
} from '../../Dashboard/DashboardAction';

import { getDesignationDataListThunk } from '../DesignationMaster/DesignationAction';

import { departmentData } from '../DepartmentMaster/DepartmentMasterAction';
import { getRoleData } from '../RoleMaster/RoleMasterAction';
import { toast } from 'react-toastify';
import { getJobRoleMasterListThunk } from '../../../redux/services/jobRoleMaster';

function CreateUserComponent({ match }) {
  const [tabKey, setTabKey] = useState('All_Tickets');
  const roleDropdown = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.getRoleData
  );
  const departmentDropdown = useSelector(
    (DepartmentMasterSlice) =>
      DepartmentMasterSlice.department.sortDepartmentData
  );

  const [filteredRoles, setFilteredRoles] = useState([]);

  const state = null;

  const [accountFor, setAccountFor] = useState('SELF');

  const [CustomerDrp, setCustomerDrp] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Notify = useSelector((dashbordSlice) => dashbordSlice.dashboard.notify);

  const CountryData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.filteredCountryData
  );

  const AllcityDropDownData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.FilterCity
  );

  const designationDropdown = useSelector(
    (DesignationSlice) =>
      DesignationSlice.designationMaster.sortedDesignationData
  );
  console.log('designationDropdown', designationDropdown);
  const sortDesignationDropdown = [...designationDropdown].sort((a, b) => {
    if (a.label < b.label) return -1;
    if (a.label > b.label) return 1;
    return 0;
  });

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 3)
  );
  const stateDropdown = useSelector(
    (DashbordSlice) => DashbordSlice.dashboard.activeState
  );

  const { jobRoleMasterList, isLoading } = useSelector(
    (state) => state?.jobRoleMaster
  );

  const jobRoleDropDown =
    jobRoleMasterList &&
    jobRoleMasterList
      ?.filter((d) => d.is_active === 1)
      .map((i) => ({
        value: i.id,
        label: i.job_role
      }));

  const options = [
    { value: 'MY_TICKETS', label: 'My Tickets' },
    {
      value: 'DEPARTMENT_TICKETS',
      label: 'Department Tickets'
    }
  ];

  const mappingData = {
    department_id: null,
    ticket_show_type: null,
    ticket_passing_authority: 0,
    is_default: 0
  };
  const [rows, setRows] = useState([
    {
      department_id: [],
      ticket_show_type: null,
      ticket_passing_authority: 0,
      is_default: 0
    }
  ]);

  // const [empty, setEmpty] = useState([
  //   {
  //     department_id: [],
  //     ticket_show_type: null,
  //     ticket_passing_authority: 0,
  //     is_default: 0
  //   }
  // ]);

  // const [updateStatus, setUpdateStatus] = useState({});

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

  const userForm = useRef();
  const confirmedPasswordRef = useRef(0);

  const [inputState, setInputState] = useState({
    firstNameErr: '',
    middleNameErr: '',
    lastNameErr: '',
    emailErr: '',
    userNameErr: '',
    contactNoErr: '',
    whatsappErr: '',
    passwordErr: '',
    confirmed_PassErr: '',
    roleErr: '',
    designationErr: '',
    departmentErr: '',
    jobRoleErr: ''
  });

  function checkingValidation(form) {
    var selectFirstName = form.getAll('first_name')[0];
    var selectMiddleName = form.getAll('middle_name')[0];
    var selectLastName = form.getAll('last_name')[0];
    var selectEmail = form.getAll('email_id')[0];
    var selectUserName = form.getAll('user_name')[0];
    var selectContactNo = form.getAll('contact_no')[0];
    var selectPassword = form.getAll('password')[0];
    // var selectWhatsapp = form.getAll('whats_app_contact_no')[0];
    var selectRole = form.getAll('role_id')[0];
    var selectJobRole = form.getAll('job_role')[0];
    var selectDesignation = form.getAll('designation_id')[0];

    let flag = 0;
    if (selectFirstName === '') {
      setInputState({ ...state, firstNameErr: ' Please Enter First Name' });
      flag = 1;
    } else if (selectMiddleName === '') {
      setInputState({ ...state, middleNameErr: ' Please Enter Middle Name' });
      flag = 1;
    } else if (selectLastName === '') {
      setInputState({ ...state, lastNameErr: ' Please Enter last Name' });
      flag = 1;
    } else if (selectEmail === '') {
      setInputState({ ...state, emailErr: ' Please Enter Email' });
      flag = 1;
    } else if (selectUserName === '') {
      setInputState({ ...state, userNameErr: ' Please Enter username' });
      flag = 1;
    } else if (selectContactNo === '') {
      setInputState({ ...state, contactNoErr: ' Please Enter contact no.' });
      flag = 1;
    } else if (selectPassword === '') {
      setInputState({ ...state, passwordErr: ' Please Enter Password' });
      flag = 1;
    } else if (confirmedPasswordRef.current.value === '') {
      setInputState({
        ...state,
        confirmed_PassErr: ' Please Enter Confirmed password'
      });
      flag = 1;
    } else if (selectRole === '') {
      setInputState({ ...state, roleErr: ' Please Select role' });
      flag = 1;
    } else if (selectJobRole === '') {
      setInputState({ ...state, jobRoleErr: ' Please Select job role' });
      flag = 1;
    } else if (selectDesignation === '') {
      setInputState({ ...state, designationErr: ' Please Select designation' });
      flag = 1;
    } else if (selectPassword.length < 6) {
      setInputState({
        ...state,
        passwordErr: ' Please maintain password length 6 to 20 characters'
      });
      alert('Please maintain password length 6 to 20 characters');

      flag = 1;
    } else if (selectPassword.length > 20) {
      setInputState({
        ...state,
        passwordErr: ' Please maintain password length 6 to 20 characters'
      });
      alert('Please maintain password length 6 to 20 characters');

      flag = 1;
    } else if (selectContactNo.length < 10) {
      setInputState({
        ...state,
        contactNoErr: 'contact number length should be 10 digit'
      });
      flag = 1;
    } else if (selectContactNo.length > 10) {
      setInputState({
        ...state,
        contactNoErr: 'contact number length should be 10 digit'
      });
      flag = 1;
    } else if (contactValid === true) {
      alert('Enter valid Contact Number');
      flag = 1;
    } else if (whatsappValid === true) {
      alert('Enter valid Whatsapp Number');
      flag = 1;
    } else if (mailError === true) {
      alert('Invalid Email');
      flag = 1;
    }
    return flag;
  }

  // const [emailError, setEmailError] = useState(null);
  // const [mailError, setMailError] = useState(false);
  const mailError = false;

  // const [contactNumber, setContactNumber] = useState(null);

  const [contactValid, setContactValid] = useState(false);
  const handleContactValidation = (e) => {
    const contactValidation = e.target.value;
    if (
      contactValidation.charAt(0) === '9' ||
      contactValidation.charAt(0) === '8' ||
      contactValidation.charAt(0) === '7' ||
      contactValidation.charAt(0) === '6'
    ) {
      setInputState({ ...state, contactNoErr: '' });
      setContactValid(false);
    } else {
      setInputState({ ...state, contactNoErr: 'Invalid Mobile Number' });
      setContactValid(true);
    }

    if (contactValidation.length < 10) {
      // setContactNumber(contactValidation);
    }
  };

  // const [whatsappNumber, setWhatsappNumber] = useState(null);
  // const [whatsappError, setWhatsappError] = useState(null);
  const [whatsappValid, setWhatsappValid] = useState(false);
  const handleWhatsappValidation = (e) => {
    const whatsappValidation = e.target.value;
    if (
      whatsappValidation.charAt(0) === '9' ||
      whatsappValidation.charAt(0) === '8' ||
      whatsappValidation.charAt(0) === '7' ||
      whatsappValidation.charAt(0) === '6'
    ) {
      setInputState({ ...state, whatsappErr: '' });
      setWhatsappValid(false);
    } else {
      setInputState({ ...state, whatsappErr: 'Invalid Whatsapp Number' });
      setWhatsappValid(true);
    }

    if (whatsappValidation.length < 11) {
      // setWhatsappNumber(whatsappValidation);
    }
  };

  // const [passwordError, setPasswordError] = useState(null);
  // const [passwordValid, setPasswordValid] = useState(false);
  const [stateDropdownData, setStateDropdownData] = useState([]);
  const [cityDropdownData, setCityDropdownData] = useState([]);

  const handlePasswordValidation = (e) => {
    if (e.target.value === '') {
      setInputState({ ...state, passwordErr: 'Please enter Password' });
    } else {
      setInputState({ ...state, passwordErr: '' });
    }
    setPassword(e.target.value);
    const passwordValidation = e.target.value;
    if (passwordValidation.length > 20) {
      // setPasswordError('Enter Password min. 6 & max. 20');
      // setPasswordValid(true);
    } else if (passwordValidation.length < 6) {
      // setPasswordError('Enter Password min. 6 & max. 20');
      // setPasswordValid(true);
    } else {
      // setPasswordError('');
      // setPasswordValid(false);
    }

    // Compare passwords
    if (
      confirmedPasswordRef.current.value !== '' &&
      confirmedPasswordRef.current.value !== passwordValidation
    ) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  // const [pincodeNumber, setPincodenumber] = useState(null);
  const [pincodeError, setPincodeError] = useState(null);
  const [pincodeValid, setPincodeValid] = useState(false);
  const handlePincodeValidation = (e) => {
    const whatsappValidation = e.target.value;
    if (whatsappValidation.length === 6) {
      setPincodeError('');
      setPincodeValid(false);
    } else {
      setPincodeError('Invalid Pincode');
      setPincodeValid(true);
    }
  };

  const handleConfirmedPassword = (event) => {
    if (event.target.value === '') {
      setInputState({
        ...state,
        confirmed_PassErr: 'Please Enter Confirmed password'
      });
    } else {
      setInputState({ ...state, confirmed_PassErr: '' });
    }
    if (event.target.value === password) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  };

  const [selectRole, setSelctRole] = useState(null);
  const [selectJobRole, setSelcJobtRole] = useState(null);

  const handleSelectRole = (e) => {
    const newValue = e;
    setSelctRole(newValue);
  };
  const handleSelectJobRole = (e) => {
    const newValue = e;
    setSelcJobtRole(newValue);
  };
  const handleForm = async (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true); // Set loading state to true
    // setNotify(null);

    const form = new FormData(e.target);
    var flag = 1;

    const formValidation = checkingValidation(form);
    if (formValidation === 1) {
      setLoading(false); // Reset loading state
      return false;
    }

    var selectDepartment = form.getAll('department_id[]');
    if (selectDepartment === '') {
      setInputState({ ...state, departmentErr: ' Please Select Department' });
      setLoading(false); // Reset loading state
      return false;
    }

    if (confirmPasswordError === true) {
      alert('Password Does not Match');
      setLoading(false); // Reset loading state
      return false;
    } else if (mailError === true) {
      alert('Enter valid email');
      setLoading(false); // Reset loading state
      return false;
    } else if (pincodeValid === true) {
      alert('Enter valid Pincode');
      setLoading(false); // Reset loading state
      return false;
    } else if (
      confirmPasswordError === false &&
      mailError === false &&
      contactValid === false &&
      whatsappValid === false &&
      pincodeValid === false
    ) {
      if (flag === 1) {
        dispatch(postUserData(form)).then((res) => {
          if (res?.payload?.status === 200) {
            if (res?.payload?.data?.status === 1) {
              // Success case
              toast.success(res?.payload?.data?.message, {
                autoClose: 10000 // 10 seconds in milliseconds
              });
              navigate(`/${_base}/User`);
              dispatch(getEmployeeData());

              // Navigate after 3 seconds
              setTimeout(() => {
                navigate(`/${_base}/User`);
              }, 3000);
            } else {
              // Error case when status is not 1
              toast.error(res?.payload?.data?.message, {
                autoClose: 10000 // 10 seconds in milliseconds
              });
            }
          } else {
            // Error case when status code is not 200
            toast.error('An unexpected error occurred. Please try again.', {
              autoClose: 10000 // 10 seconds in milliseconds
            });
          }
          setLoading(false);
        });
      }
    }
  };

  const loadData = useCallback(async () => {
    dispatch(getCountryDataSort());
    dispatch(getStateDataSort());

    await new CustomerService().getCustomer().then((res) => {
      if (res?.status === 200) {
        if (res?.data?.status === 1) {
          setCustomerDrp(
            res?.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({
                value: d.id,
                label: d.name
              }))
          );
        }
      }
    });
  }, [dispatch]);

  const handleDependentChange = (e, type) => {
    if (type === 'COUNTRY') {
      setStateDropdownData(
        stateDropdown &&
          stateDropdown
            ?.filter((filterState) => filterState.country_id === e.value)
            ?.map((d) => ({ value: d.id, label: d.state }))
      );
    }
    if (type === 'STATE') {
      setCityDropdownData(
        AllcityDropDownData &&
          AllcityDropDownData?.filter(
            (filterState) => filterState.state_id === e.value
          )?.map((d) => ({
            value: d.id,
            label: d.city
          }))
      );

      setStateName(e);
      setCityName(null);
    }
  };
  // const [defaultDepartmentDropdown, setDefaultDepartmentDropdown] = useState();
  // const handleDeparmentChange = (e) => {
  //   setDefaultDepartmentDropdown(e);
  // };

  const handleAddRow = async () => {
    // setNotify(null);
    let flag = 1;
    if (flag === 1) {
      setRows([...rows, mappingData]);
    } else {
      // setNotify({ type: 'danger', message: 'Complete Previous Record' });
    }
  };

  const handleUserSelect = (selectedOptions, index) => {
    const selectedDepartmentId = selectedOptions.value;

    // Check if the selected department is already present in the rows
    const isDepartmentAlreadySelected = rows.some(
      (row) => row.department_id === selectedDepartmentId
    );

    if (isDepartmentAlreadySelected) {
      // If the department is already selected, show an error message
      // You can handle the error message display as per your UI design
      alert(
        'This Department is already selected. Please select another Department.'
      );
      return;
    }

    // Update the state with the selected department if it's not already selected
    const updatedAssign = [...rows];
    updatedAssign[index] = {
      ...updatedAssign[index],
      department_id: selectedDepartmentId
    };
    setRows(updatedAssign);
  };

  // const handleTicketTypeShow = (selectedTicketOption, index) => {
  //   const selectedTicketID = selectedTicketOption.value;

  //   const isDepartmentAlreadySelected = rows.some(
  //     (row) => row.ticket_show_type === selectedTicketID
  //   );

  //   const updatedAssign = [...rows];
  //   updatedAssign[index] = {
  //     ...updatedAssign[index],
  //     ticket_show_type: selectedTicketID
  //   };
  //   setRows(updatedAssign);
  // };

  const handleRemoveSpecificRow = (index) => async () => {
    const updatedAssign = [...rows];
    updatedAssign.splice(index, 1);

    setRows(updatedAssign);
  };

  const sortSlefRole =
    roleDropdown &&
    roleDropdown?.filter((d) => {
      return d.role.toLowerCase() !== 'user';
    });
  const filterSelfRole = sortSlefRole
    ?.filter((d) => d.is_active === 1)
    .map((d) => ({
      value: d.id,
      label: d.role
    }));
  const orderedSelfRoleData = filterSelfRole?.sort(function (a, b) {
    return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
  });

  const customerSort =
    roleDropdown &&
    roleDropdown?.filter((d) => {
      return d.role.toLowerCase() === 'user';
    });
  const filterCutomerRole = customerSort
    ?.filter((d) => d.is_active === 1)
    .map((d) => ({
      value: d.id,
      label: d.role
    }));
  const orderedCustomerRoleData = filterCutomerRole?.sort(function (a, b) {
    return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
  });

  const accountForChange = async (account_for) => {
    setSelctRole(null);
    setAccountFor(account_for);
    const accountFor = account_for;
    const filteredAsAccountFor = roleDropdown?.filter((filterData) => {
      if (accountFor === 'SELF') {
        return filterData.role.toLowerCase() !== 'user';
      } else if (accountFor === 'CUSTOMER') {
        return filterData.role.toLowerCase() === 'user';
      }
      return false;
    });

    const response = filteredAsAccountFor
      .filter((d) => d.is_active === 1)
      .map((d) => ({
        value: d.id,
        label: d.role
      }));
    const aa = response.sort(function (a, b) {
      return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
    });
    setFilteredRoles(aa);
  };

  const [departmentValue, setDepartmentValue] = useState(false);
  const departmentRef = useRef(null);
  const handleCheckInput = (e, id, type) => {
    if (e.value) {
      setDepartmentValue(true);
    }
    if (e.value === '') {
      setInputState({ ...state, designationErr: 'Please Select Department' });
    } else {
      setInputState({ ...state, designationErr: '' });
    }
    let flag = 1;
    if (type === 'DEPARTMENT') {
      rows.forEach((d, i) => {
        if (d.department_id === e.value) {
          flag = 0;
          alert(
            ' Please select another Department.This Department already considered.'
          );
          departmentRef.current.clear();
        }
      });
    }

    if (flag === 1) {
      let temp_state = [...rows];
      let actualIndex = null;
      temp_state.forEach((ele, index) => {
        if (index === id) {
          actualIndex = index;
        }
      });
      let temp_element = { ...rows[actualIndex] };

      if (type === 'DEPARTMENT') {
        temp_element.department_id = e.value;
      } else if (type === 'TICKET_SHOW') {
        temp_element.ticket_show_type = e.value;
      } else if (type === 'TICKET_PASSING_AUTHORITY') {
        temp_element.ticket_passing_authority =
          e.target.checked === true ? 1 : 0;
      } else if (type === 'IS_DEFAULT') {
        temp_element.is_default = e.target.checked === true ? 1 : 0;
      }
      temp_state[actualIndex] = temp_element;
      setRows(temp_state);
    }
  };

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [copyData, setCopyData] = useState(null);
  const whatsappRef = useRef(null);
  function copyTextValue(e) {
    if (e.target.checked) {
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }
    var text1 = e.target.checked
      ? document.getElementById('contact_no').value
      : '';
    setCopyData(text1);
  }

  useEffect(() => {
    whatsappRef.current.value = copyData;
  }, [copyData]);

  // const passwordHandle = (e, s) => {
  //   setPassword(e.target.value);
  // };

  // function language() {
  //   '#first_name'.on('keypress', function (event) {
  //     var englishAlphabetAndWhiteSpace = /[A-Za-z ]/g;
  //     var key = String.fromCharCode(event.which);
  //     if (englishAlphabetAndWhiteSpace.test(key)) {
  //       return true;
  //     }
  //     alert('this is not in English'); //put any message here!!!
  //   });
  // }
  useEffect(() => {
    loadData();
    if (!checkRole.length) {
      dispatch(getRoles());
    }
    dispatch(getRoleData());
    if (!designationDropdown.length) {
      dispatch(getDesignationDataListThunk());
    }

    if (!AllcityDropDownData.length) {
      dispatch(getCityData());
    }

    if (!cityDropdownData.length) {
      dispatch(getCityData());
    }

    if (!stateDropdown.length) {
      dispatch(getStateData());
    }
    if (!stateDropdownData.length) {
      dispatch(getStateData());
    }

    // handleData()
    dispatch(getAllRoles());
    dispatch(departmentData());
  }, [
    AllcityDropDownData.length,
    checkRole.length,
    cityDropdownData.length,
    designationDropdown.length,
    dispatch,
    loadData,
    stateDropdown.length,
    stateDropdownData.length
  ]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    dispatch(getJobRoleMasterListThunk());
  }, []);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Create User" />
      {Notify && <Alert alertData={Notify} />}

      <form onSubmit={handleForm} ref={userForm} method="post">
        <Tabs
          defaultActiveKey={tabKey}
          activeKey={tabKey}
          onSelect={(k) => setTabKey(k)}
          transition={false}
          id="noanim-tab-example1"
          className=" tab-body-header rounded d-inline-flex"
        >
          <Tab eventKey="All_Tickets" title="User Details">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    {localStorage.getItem('account_for') === 'SELF' && (
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
                            // key={Math.random()}
                            name="account_for"
                            // value={accountFor? accountFor :""}
                            readOnly={false}
                            required
                            onChange={(e) => accountForChange(e.target.value)}
                          >
                            <option value="SELF">SELF</option>
                            <option value="CUSTOMER">CUSTOMER</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {accountFor && accountFor === 'CUSTOMER' && (
                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Select Customer:
                            <Astrick color="red" />
                          </b>
                        </label>
                        <div className="col-sm-3">
                          <Select
                            id="customer_id"
                            name="customer_id"
                            required={true}
                            options={CustomerDrp}
                          />
                        </div>
                      </div>
                    )}

                    <div
                      className="form-group row mt-3"
                      style={{ position: 'relative', display: 'flex' }}
                    >
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
                          placeholder="Please enter first name"
                          maxLength={50}
                          onKeyPress={(e) => {
                            Validation.Characters(e);
                          }}
                          onChange={(event) => {
                            if (event.target.value === '') {
                              setInputState({
                                ...state,
                                firstNameErr: 'First Name Required'
                              });
                            } else {
                              setInputState({ ...state, firstNameErr: '' });
                            }
                          }}
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red'
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
                          maxLength={50}
                          onKeyPress={(e) => {
                            Validation.Characters(e);
                          }}
                          onChange={(event) => {
                            if (event.target.value === '') {
                              setInputState({
                                ...state,
                                middleNameErr: 'Middle Name Required'
                              });
                            } else {
                              setInputState({ ...state, middleNameErr: '' });
                            }
                          }}
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red'
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
                          maxLength={50}
                          onKeyPress={(e) => {
                            Validation.Characters(e);
                          }}
                          onChange={(event) => {
                            if (event.target.value === '') {
                              setInputState({
                                ...state,
                                lastNameErr: 'Last Name Required'
                              });
                            } else {
                              setInputState({ ...state, lastNameErr: '' });
                            }
                          }}
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red'
                            }}
                          >
                            {inputState.lastNameErr}
                          </small>
                        )}
                      </div>
                    </div>

                    <div
                      className="form-group row mt-4"
                      style={{ position: 'relative', display: 'flex' }}
                    >
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
                          onChange={(event) => {
                            const email = event?.target?.value;
                            if (
                              !email.match(
                                /^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
                              )
                            ) {
                              setInputState({
                                ...state,
                                emailErr: 'Please enter a valid email address'
                              });
                            } else {
                              setInputState({ ...state, emailErr: '' });
                            }
                          }}
                          placeholder="Please enter valid email address"
                          // onKeyPress={(e) => {
                          //   handleEmail(e);
                          // }}
                        />

                        {inputState && (
                          <small
                            style={{
                              color: 'red'
                            }}
                          >
                            {inputState.emailErr}
                          </small>
                        )}
                      </div>

                      <label className="col-sm-3 col-form-label text-end">
                        <b>
                          Username: <Astrick color="red" />
                        </b>
                      </label>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          id="user_name"
                          name="user_name"
                          placeholder="Username"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          maxLength={30}
                          onChange={(event) => {
                            if (event.target.value === '') {
                              setInputState({
                                ...state,
                                userNameErr: 'Please enter username'
                              });
                            } else {
                              setInputState({ ...state, userNameErr: '' });
                            }
                          }}
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red'
                            }}
                          >
                            {inputState.userNameErr}
                          </small>
                        )}
                      </div>
                    </div>

                    <div
                      className="form-group row mt-3"
                      style={{ position: 'relative', display: 'flex' }}
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
                          placeholder="Contact Number"
                          // value={contactNumber? contactNumber :""}
                          // key={Math.random()}
                          maxLength="10"
                          minLength="10"
                          onKeyPress={(e) => {
                            Validation.mobileNumbersOnly(e);
                          }}
                          onChange={handleContactValidation}
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red'
                            }}
                          >
                            {inputState.contactNoErr}
                          </small>
                        )}
                      </div>
                      <label className="col-sm-3 col-form-label text-end ">
                        <b className="mx-3">Same as Contact No. or</b>
                        <br />
                        <b className="mx-3">Whats App Contact Number :</b>
                        {/* <label className="col-sm-3 col-form-label text-end "> */}
                        {/* </label> */}
                        <input
                          type="checkbox"
                          name="check1"
                          onChange={copyTextValue}
                          style={{ position: 'absolute', top: '32%' }}
                        />
                        {/* <b>Whats App Number :</b> */}
                      </label>
                      {/* <div className="col-sm-1 text-center">
                        <input
                          type="checkbox"
                          name="check1"
                          onChange={copyTextValue}
                          style={{ position: "absolute", top: "30%" }}
                        />
                      </div> */}

                      {/* <label className="col-sm-2 col-form-label text-md-start">
                        <b>Whats App Number :</b>
                      </label> */}
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="whats_app_contact_no"
                          name="whats_app_contact_no"
                          placeholder="Whats App Contact Number"
                          readOnly={isReadOnly}
                          // value={whatsappNumber? whatsappNumber :""}
                          // key={Math.random()}
                          ref={whatsappRef}
                          onKeyPress={(e) => {
                            Validation.mobileNumbersOnly(e);
                          }}
                          onChange={handleWhatsappValidation}
                          maxLength="10"
                          minLength="10"
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red'
                            }}
                          >
                            {inputState.whatsappErr}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          {' '}
                          Password : <Astrick color="red" />
                        </b>
                      </label>
                      <div
                        className="col-sm-3"
                        style={{ position: 'relative', display: 'flex' }}
                      >
                        <InputGroup className="">
                          <input
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Password"
                            minLength={6} // Minimum length is set to 6characters
                            maxLength={20}
                            type={passwordShown ? 'text' : 'password'}
                            onKeyPress={(e) => {
                              Validation.password(e);
                            }}
                            onChange={handlePasswordValidation}
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
                              color: 'red',
                              position: 'absolute',
                              top: '95%'
                            }}
                          >
                            {inputState.passwordErr}
                          </small>
                        )}
                      </div>

                      <label className="col-sm-3 col-form-label text-end">
                        <b>
                          Confirmed Password :<Astrick color="red" />{' '}
                        </b>
                      </label>
                      <div
                        className="col-sm-3"
                        style={{ position: 'relative', display: 'flex' }}
                      >
                        <InputGroup>
                          <input
                            className="form-control form-control-sm "
                            placeholder="confirmed_password"
                            ref={confirmedPasswordRef}
                            onChange={handleConfirmedPassword}
                            type={passwordShown1 ? 'text' : 'Password'}
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

                        {inputState.confirmed_PassErr && (
                          <small
                            style={{
                              color: 'red',
                              position: 'absolute',
                              top: '95%'
                            }}
                          >
                            {inputState.confirmed_PassErr}
                          </small>
                        )}
                      </div>
                      {!inputState.confirmed_PassErr &&
                        confirmPasswordError && (
                          <span
                            style={{
                              color: 'red',
                              position: 'relative',
                              left: '67%'
                            }}
                          >
                            Password Not matched
                          </span>
                        )}
                    </div>

                    <div
                      className="form-group row mt-4"
                      style={{ position: 'relative', display: 'flex' }}
                    >
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Select Role : <Astrick color="red" />
                        </b>
                      </label>
                      <div className="col-sm-3">
                        <Select
                          id="role_id"
                          name="role_id"
                          // defaultValue={filteredRoles}
                          value={selectRole}
                          // options={filteredRoles}
                          options={
                            accountFor === 'SELF'
                              ? orderedSelfRoleData
                              : orderedCustomerRoleData
                          }
                          onChange={(e) => {
                            handleSelectRole(e);
                            if (e.value === '') {
                              setInputState({
                                ...state,
                                roleErr: 'Please Select Role'
                              });
                            } else {
                              setInputState({ ...state, roleErr: '' });
                            }
                          }}
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red',
                              position: 'relative'
                            }}
                          >
                            {inputState.roleErr}
                          </small>
                        )}
                      </div>

                      <label
                        className="col-sm-3 col-form-label text-end"
                        style={{ textAlign: 'right' }}
                      >
                        <b>
                          Select Designation : <Astrick color="red" />
                        </b>
                      </label>
                      <div className="col-sm-3">
                        <Select
                          id="designation_id"
                          name="designation_id"
                          options={sortDesignationDropdown}
                          onChange={(event) => {
                            if (event.value === '') {
                              setInputState({
                                ...state,
                                designationErr: 'Please Select Designation'
                              });
                            } else {
                              setInputState({ ...state, designationErr: '' });
                            }
                          }}
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red',
                              position: 'relative'
                            }}
                          >
                            {inputState.designationErr}
                          </small>
                        )}
                      </div>
                    </div>
                    <div
                      className="form-group row mt-4"
                      style={{ position: 'relative', display: 'flex' }}
                    >
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Select Job Role : <Astrick color="red" />
                        </b>
                      </label>
                      <div className="col-sm-3">
                        <Select
                          id="job_role"
                          name="job_role"
                          // defaultValue={filteredRoles}
                          value={selectJobRole}
                          // options={filteredRoles}
                          options={jobRoleDropDown}
                          onChange={(e) => {
                            handleSelectJobRole(e);
                            if (e.value === '') {
                              setInputState({
                                ...state,
                                jobRoleErr: 'Please Select Job Role'
                              });
                            } else {
                              setInputState({ ...state, jobRoleErr: '' });
                            }
                          }}
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red',
                              position: 'relative'
                            }}
                          >
                            {inputState.jobRoleErr}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
                          // onKeyPress={(e) => {
                          //   Validation.addressFieldOnly(e);}}
                        />
                      </div>
                    </div>
                    {inputState && (
                      <small
                        style={{
                          color: 'red',
                          position: 'absolute',
                          right: '70%'
                        }}
                      >
                        {inputState.addressErr}
                      </small>
                    )}

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>Pincode :</b>
                      </label>
                      <div className="col-sm-4">
                        <input
                          type="pincode"
                          className="form-control form-control-sm"
                          id="pincode"
                          name="pincode"
                          maxLength={6}
                          onKeyPress={(e) => {
                            Validation.NumbersOnly(e);
                          }}
                          onChange={handlePincodeValidation}
                        />
                        {inputState && (
                          <small
                            style={{
                              color: 'red'
                            }}
                          >
                            {pincodeError}
                          </small>
                        )}
                      </div>

                      <label
                        className="col-sm-2 col-form-label"
                        style={{ textAlign: 'right' }}
                      >
                        <b>Country :</b>
                      </label>
                      <div className="col-sm-4">
                        <Select
                          options={CountryData}
                          name="country_id"
                          id="country_id"
                          onChange={(e) => handleDependentChange(e, 'COUNTRY')}
                        />
                      </div>
                    </div>
                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>State :</b>
                      </label>
                      <div className="col-sm-4">
                        <Select
                          // options={
                          //   updateStatus.statedrp !== undefined
                          //     ? stateDropdown
                          //     : []
                          // }

                          options={stateDropdownData}
                          name="state_id"
                          id="state_id"
                          onChange={(e) => handleDependentChange(e, 'STATE')}
                          defaultValue={stateName ? stateName : ''}
                          // key={Math.random()}
                          // value={stateName ? state : ""}
                        />
                      </div>

                      <label
                        className="col-sm-2 col-form-label"
                        style={{ textAlign: 'right' }}
                      >
                        <b>City :</b>
                      </label>

                      <div className="col-sm-4">
                        <Select
                          options={cityDropdownData && cityDropdownData}
                          name="city_id"
                          id="city_id"
                          onChange={(e) => setCityName(e)}
                          defaultValue={cityName ? cityName : ''}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="User_Settings" title="User Setting">
            <div className="card">
              <div className="card-body">
                <table
                  className="table table-bordered table-responsive mt-5"
                  id="tab_logic"
                >
                  <thead>
                    <tr>
                      <th className="text-center" style={{ width: '100px' }}>
                        {' '}
                        SR No
                      </th>
                      <th className="text-center" style={{ width: '300px' }}>
                        {' '}
                        Department
                      </th>
                      <th className="text-center" style={{ width: '300px' }}>
                        {' '}
                        Ticket Type Show
                      </th>
                      <th className="text-center" style={{ width: '300px' }}>
                        {' '}
                        Ticket Passing Authority
                      </th>
                      <th className="text-center" style={{ width: '300px' }}>
                        {' '}
                        Make Default
                      </th>
                      <th className="text-center" style={{ width: '100px' }}>
                        {' '}
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((item, idx) => (
                      <tr id={`addr_${idx}`} key={idx}>
                        <td className="text-center">{idx + 1}</td>
                        <td>
                          <Select
                            isSearchable={true}
                            name="department_id[]"
                            id="department_id[]"
                            key={idx}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            options={departmentDropdown}
                            value={departmentDropdown.filter((d) =>
                              Array.isArray(item.department_id)
                                ? item.department_id.includes(d.value)
                                : item.department_id === d.value
                            )}
                            required
                            style={{ zIndex: '100' }}
                            onChange={(selectedOption) =>
                              handleUserSelect(selectedOption, idx)
                            }
                          />
                        </td>
                        <td>
                          <Select
                            options={options}
                            id={`ticket_show_type_id_` + idx}
                            name="ticket_show_type[]"
                            onChange={(e) =>
                              handleCheckInput(e, idx, 'TICKET_SHOW')
                            }
                            value={options.filter((d) =>
                              Array.isArray(item.ticket_show_type)
                                ? item.ticket_show_type.includes(d.value)
                                : item.ticket_show_type === d.value
                            )}
                            required
                          />
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
                            checked={item.ticket_passing_authority === 1}
                            onChange={(e) =>
                              handleCheckInput(
                                e,
                                idx,
                                'TICKET_PASSING_AUTHORITY'
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="hidden"
                            name="is_default[]"
                            value={item.is_default ? item.is_default : ''}
                          />
                          <input
                            type="checkbox"
                            id={`is_default_` + idx}
                            checked={item.is_default === 1}
                            onChange={(e) =>
                              handleCheckInput(e, idx, 'IS_DEFAULT')
                            }
                          />
                        </td>

                        <td>
                          {idx === 0 && departmentValue === true && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary pull-left"
                              onClick={handleAddRow}
                            >
                              <i className="icofont-plus-circle"></i>
                            </button>
                          )}
                          {idx !== 0 && (
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
            </div>
            {inputState && (
              <small
                style={{
                  color: 'red',
                  position: 'absolute',
                  right: '70%'
                }}
              >
                {inputState.departmentErr}
              </small>
            )}
          </Tab>
        </Tabs>

        <div className="mt-3" style={{ textAlign: 'right' }}>
          {tabKey === 'All_Tickets' && (
            <span
              onClick={() => {
                const form = new FormData(userForm.current);
                const flag = checkingValidation(form);
                if (flag === 1) {
                  return false;
                } else {
                  setTabKey('User_Settings');
                }
              }}
              className="btn btn-primary"
            >
              Next
            </span>
          )}
          {tabKey === 'User_Settings' && (
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          )}

          {tabKey === 'User_Settings' && (
            <button
              onClick={() => setTabKey('All_Tickets')}
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

export default CreateUserComponent;
