              import React, { useState, useEffect, useRef } from "react";
              import { Link, useNavigate } from "react-router-dom";
              import CustomerMappingService from "../../../services/SettingService/CustomerMappingService";
              import { _base } from "../../../settings/constants";

              import ErrorLogService from "../../../services/ErrorLogService";

              import PageHeader from "../../../components/Common/PageHeader";
              import Alert from "../../../components/Common/Alert";
              import Select from "react-select";

              import { CustomerTypeDropdown } from "../../Masters/CustomerTypeMaster/CustomerTypeComponent";
              import { TemplateDropdown } from "../../Masters/TemplateMaster/TemplateComponent";
              import { DepartmentDropdown } from "../../Masters/DepartmentMaster/DepartmentComponent";
              import { QueryTypeDropdown } from "../../Masters/QueryTypeMaster/QueryTypeComponent";
              import { DynamicFormDropdown } from "../../Masters/DynamicFormMaster/DynamicFormComponent";
              import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
              import DepartmentService from "../../../services/MastersService/DepartmentService";
              import CustomerTypeService from "../../../services/MastersService/CustomerTypeService";
              import QueryTypeService from "../../../services/MastersService/QueryTypeService";
              import TemplateService from "../../../services/MastersService/TemplateService";
              import DynamicFormService from "../../../services/MastersService/DynamicFormService";
              import UserService from "../../../services/MastersService/UserService";
              import { forEach } from "jszip";

              export default function EditCustomerMappingComponent({ match }) {
                const history = useNavigate();
                const mappingId = match.params.id;
                const [notify, setNotify] = useState();

                const [mainData,setMainData]=useState({approach:null,user_policy:[],})

                const roleId = sessionStorage.getItem("role_id");
                const [checkRole, setCheckRole] = useState(null);

                const priority = ["High", "Very High", "Medium", "Low"];
                const approachData = [
                  {
                    code: "RR",
                    approach: "Departmentwise Round Robin",
                  },
                  {
                    code: "HLT",
                    approach: "User Having Less Ticket",
                  },
                  {
                    code: "SP",
                    approach: "Single Person",
                  },
                  {
                    code: "RW",
                    approach: "Ratio Wise",
                  },
                ];
                const [departmentId, setDepartmentId] = useState();
                const [customerType, setCustomerType] = useState();
                const [CustomerTypeDropdown, setCustomerTypeDropdown] = useState();

                const [queryType, setQueryType] = useState();
                const [QueryTypeDropdown, setQueryTypeDropdown] = useState();

                const [dynamicForm, setDynamicForm] = useState();
                const [DynamicFormDropdown, setDynamicFormDropdown] = useState();

                const [template, setTemplate] = useState();
                const [TemplateDropdown, setTemplateDropdown] = useState();

                const [department, setDepartment] = useState();
                const [DepartmentDropdown, setDepartmentDropdown] = useState();

                const [user, setUser] = useState();
                const [userDropdown, setUserDropdown] = useState();
                const [usersDropdown, setUsersDropdown] = useState(null);

                const [data, setData] = useState({
                  current_approach:[],
                  approach: [],
                  confirmation_required:null,
                  created_at: null,
                  created_by:null,
                  customer_id: null,
                  customer_type_id: null,
                  department_id:null,
                  dynamic_form_id:null,
                  id:null,
                  is_active:null,
                  is_default:null,
                  module_id: null,
                  priority: [],
                  project_id: null,
                  query_type_id: null,
                  remark:null,
                  sla:null,
                  sub_module_id: null,
                  template_id: null,
                  tenant_id:null,
                  updated_at:null,
                  updated_by:null,
                  user_policy: [],
                  user_policy_label:[],
                });

                const [userData, setUserData] = useState();

                const [approach, setApproach] = useState();

                const [updateStatus, setUpdateStatus] = useState({});

                const handleChange = (value, name) => {
                  if (name == "customer_type_id" && value) {
                    setData({
                      ...data,
                      customer_type_id: value,
                      customer_id: null,
                      project_id: null,
                      module_id: null,
                      sub_module_id: null,
                    });
                  } else if (name == "customer_id" && value) {
                    setData({ ...data, customer_type_id: null, customer_id: value });
                  } else if (name == "project_id" && value) {
                    setData({ ...data, customer_type_id: null, project_id: value.value });
                  } else if (name == "module_id" && value) {
                    setData({ ...data, customer_type_id: null, module_id: value.value });
                  } else if (name == "sub_module_id" && value) {
                    setData({ ...data, customer_type_id: null, sub_module_id: value.value });
                  } else {
                    setData({ ...data, [name]: value });
                  }
                };

                const handleDependent = (e, name) => {
                  setData({ ...data, [name]: e.value });
                };

                const handleForm = async (e) => {
                  e.preventDefault();
                  const form = new FormData(e.target);
                  var flag = 1;
                  // for (var pair of form) {
                  //     console.log(pair[0] + ', ' + pair[1]);
                  // }
                  const getApproch = form.getAll("approach")[0];
                  if (getApproch == "RW") {
                    if (rationTotal !== 100) {
                      alert("Total Should be 100");
                    }
                  }

                  var customerType = form.getAll("customer_type_id");
                  var selectQuery = form.getAll("query_type_id");
                  var selectDynamicForm = form.getAll("dynamic_form_id");
                  var selectPriority = form.getAll("priority");
                  var selectApproch = form.getAll("approach");
                  var selectDepartment = form.getAll("department_id");
                  if (getApproch == "RW") {
                    var selectRWUser = form.getAll("user[]");
                  } else {
                    var selectUser = form.getAll("user");
                  }

                  // if (customerType == "" || selectQuery == "" || selectDynamicForm == "" || selectPriority == "" || selectApproch == "" || selectDepartment == "" || selectUser == "" || selectRWUser == "") {
                  //     flag = 0;
                  //     setNotify(null)
                  //     if (customerType == "") {
                  //         // setNotify(null);
                  //         alert("Please Select Customer Type");
                  //         // setNotify({ type: 'danger', message: "Please Select Customer Type" });
                  //     } else if (selectQuery == "") {
                  //         // setNotify(null);
                  //         alert("Please Select Query");
                  //         // setNotify({ type: 'danger', message: "Please Select Customer Type" });
                  //     } else if (selectDynamicForm == "") {
                  //         // setNotify(null);
                  //         alert("Please Select DynamicForm");
                  //         // setNotify({ type: 'danger', message: "Please Select Country" });
                  //     } else if (selectPriority == "") {
                  //         // setNotify(null);
                  //         alert("Please Select Priority");
                  //         // setNotify({ type: 'danger', message: "Please Select State" });
                  //     } else if (selectApproch == "") {
                  //         // setNotify(null);
                  //         alert("Please Select Approch");
                  //         // setNotify({ type: 'danger', message: "Please Select City" });
                  //     } else if (selectDepartment == "") {
                  //         // setNotify(null);
                  //         alert("Please Select Department");
                  //         // setNotify({ type: 'danger', message: "Please Check Form" });
                  //     }
                  // }

                  // if (flag == 1) {
                  await new CustomerMappingService()
                    .updateCustomerMapping(mappingId, form)
                    .then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === 1) {
                          history.push({
                            pathname: `/${_base}/CustomerMapping`,
                            state: { alert: { type: "success", message: res.data.message } },
                          });
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
                      new ErrorLogService().sendErrorLog(
                        "Status",
                        "Create_Status",
                        "INSERT",
                        errorObject.data.message
                      );
                    });

                  // }
                };

                const handleQueryType = (e) => {
                  setNotify(null);
                  const queryTypeTemp = queryType.filter((d) => d.id == e.value);

                  const dynamicFormDropdownTemp = dynamicForm
                    .filter((d) => d.id == queryTypeTemp[0].form_id)
                    .map((d) => ({ value: d.id, label: d.template_name }));
                  if (dynamicFormDropdownTemp.length > 0) {
                    setDynamicFormDropdown(null);
                    setDynamicFormDropdown(dynamicFormDropdownTemp);
                  } else {
                    setNotify({
                      type: "warning",
                      message: "No Form is mapped but still you can map new form",
                    });
                  }
                };

                const [userPolicy, setUserPolicy] = useState();
                const [priorityDropdown, setpriorityDropdown] = useState();



                const loadData = async () => {
                  await new CustomerMappingService()
                    .getCustomerMappingById(mappingId)
                    .then((res) => {
                      if (res.status === 200) {
                        if (res.data.status == 1) {
                          setData(res.data.data);
                          setUserPolicy(data.user_policy);
                          setApproach(res.data.data.approach);
                          setDepartmentId(res.data.data.department_id);
                          handleDepartment("", res.data.data.department_id);
                          
                        }
                      }
                    });

                  await new CustomerMappingService().getPriorityDropdown().then((res) => {
                    if (res.status === 200) {
                      if (res.data.status === 1) {
                        const select = res.data.data.map((d) => ({
                          value: d.id,
                          label: d.label,
                        }));
                        setpriorityDropdown(select);
                      }
                    }
                  });
                  await new CustomerTypeService().getCustomerType().then((res) => {
                    if (res.status == 200) {
                      if (res.data.status == 1) {
                        const data = res.data.data.filter((d) => d.is_active == 1);
                        const select = res.data.data.map((d) => ({
                          value: d.id,
                          label: d.type_name,
                        }));
                        setCustomerType(data);
                        setCustomerTypeDropdown(select);
                      }
                    }
                  });

                  await new QueryTypeService().getQueryType().then((res) => {
                    if (res.status == 200) {
                      if (res.data.status == 1) {
                        const data = res.data.data.filter((d) => d.is_active == 1);
                        const select = res.data.data.map((d) => ({
                          value: d.id,
                          label: d.query_type_name,
                        }));
                        setQueryType(data);
                        setQueryTypeDropdown(select);
                      }
                    }
                  });

                  await new DynamicFormService().getDynamicForm().then((res) => {
                    if (res.status == 200) {
                      if (res.data.status == 1) {
                        const data = res.data.data.filter((d) => d.is_active == 1);
                        const select = res.data.data.map((d) => ({
                          value: d.id,
                          label: d.template_name,
                        }));
                        setDynamicForm(data);
                        setDynamicFormDropdown(select);
                      }
                    }
                  });

                  await new TemplateService().getTemplate().then((res) => {
                    if (res.status == 200) {
                      if (res.data.status == 1) {
                        const data = res.data.data.filter((d) => d.is_active == 1);
                        const select = res.data.data.map((d) => ({
                          value: d.id,
                          label: d.template_name,
                        }));
                        setTemplate(data);
                        setTemplateDropdown(select);
                      }
                    }
                  });

                  await new DepartmentService().getDepartment().then((res) => {
                    if (res.status == 200) {
                      if (res.data.status == 1) {
                        setDepartment(res.data.data.filter((d) => d.is_active == 1));
                        setDepartmentDropdown(
                          res.data.data
                            .filter((d) => d.is_active == 1)
                            .map((d) => ({ value: d.id, label: d.department }))
                        );
                      }
                    }
                  });

                  await new UserService().getUser().then((res) => {
                    if (res.status == 200) {
                      if (res.data.status == 1) {
                        const data = res.data.data.filter((d) => d.is_active == 1);
                        const select = res.data.data
                          .filter((d) => d.is_active == 1)
                          .map((d) => ({
                            value: d.id,
                            label: d.first_name + " " + d.last_name,
                          }));
                        setUser(data);
                        setUserDropdown(select);
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

                const deptRef = useRef()
                const rrRef = useRef()
                const hltRef = useRef()

                const handleApproch = (e) => {
                  var value = e.target.value;
                  setData({
                    ...data,
                    current_approach:e.target.value,
                    approach:e.target.value

                  })
                  // setApproach(value);
                  deptRef.current.clearValue(); 
                  // hltRef.current.clearValue(); 
               
                  // setUserDropdown(null);
                  // spRef.current.clearValue(); 
                  // rrRef.current.clearValue(); 
                 
                };



            const handleDepartment = async (e, id = null) => {
                if(data.current_approach == "HLT"){
                  setData({
                    ...data,
                     user_policy:null
                  })
                  // hltRef.current.clearValue(); 

                }else if(data.current_approach == "RR"){
                  setData({
                    ...data,
                     user_policy:null
                  })
                  // hltRef.current.clearValue(); 
                }

                // if(hltRef.current.commonProps.hasValue == true){ 
                // }else if(rrRef.current.commonProps.hasValue == true){
                //   rrRef.current.clearValue(); 
                // }
                const tempUser = [];
                new UserService().getUser().then((res) => {
                  if (res.status === 200) {
                    const temp = res.data.data;
                    for (const key in temp) {
                      if (temp[key].department_id == e.value) {
                        tempUser.push({
                          value: temp[key].id,
                          label: temp[key].first_name + " " + temp[key].last_name,
                        });
                      }
                    }
                    setUserData(null);
                    setUsersDropdown(tempUser);
                    setUserData(tempUser);
                  }
                });
              };
                 
                 

                const [rationTotal, setRationTotal] = useState(0);
                const [currentValueIndex, setCurrentValueIndex] = useState(null);
                const [ratioArray, setRatioArray] = useState([]);
                const checkRatio = (event, index) => {
                  setCurrentValueIndex({ index, value: event.target.value });
                };

                useEffect(() => {
                  loadData();
                  // console.log(data && priorityDropdown.map(d=>({label:}) d.label== data.priority));
                }, []);

                useEffect(() => {
                  if (currentValueIndex) {
                    let list = [...ratioArray];
                    if (currentValueIndex.value > 100) {
                      alert("more than 100 not allowed");
                      return false;
                    }

                    list[currentValueIndex.index] = currentValueIndex.value;
                    setRatioArray(list);
                    if (rationTotal > 100) {
                      alert("Total should not be greater than 100");
                      list[currentValueIndex.index] = "";
                      setRatioArray(list);
                    }
                  }
                }, [currentValueIndex]);

                useEffect(() => {
                  let sum = 0;
                  for (let i = 0; i < ratioArray.length; i++) {
                    if (ratioArray[i] !== "" && ratioArray[i] !== null) {
                      sum += parseInt(ratioArray[i]);
                    }
                  }

                  if (sum > 100) {
                    alert("Total Value should be less than 100");
                    let list = [...ratioArray];
                    list[currentValueIndex.index] = 0;
                    setRatioArray(list);
                  }
                  setRationTotal(sum);
                }, [ratioArray, data]);

                // useEffect(() => {
                //   if (data !== null && user !== undefined) {
                //     const userData = user
                //       .filter((person) => {
                //         return person.department_id === data.department_id;
                //       })
                //       .map((d) => ({ value: d.id, label: d.first_name + " " + d.last_name }));
                //     setUsersDropdown(userData);
                //     setUserData(userData);
                //   }
                // }, [data, user]);

                var temp = [];

                useEffect(() => {
                  if (data.approach) {
                    if (data.approach === "RW" && data.user_policy) {
                      const ratioArray = data.user_policy;
                      const newarray = [];
                      for (let i = 0; i < ratioArray.length; i++) {
                        const secondValue = ratioArray[i];
                        newarray.push(secondValue);
                      }
                      // for (let i = 0; i < newarray.length; i++) {
                      //     console.log(newarray)
                      // }
                      let editSum = 0;
                      newarray.forEach((value) => {
                        editSum += Number(value);
                      });
                      setRationTotal(editSum);
                    }
                  }
                }, [data]);

                return (
                  <div className="container-xxl">
                    <PageHeader headerTitle="Edit Customer Mapping" />
                    {notify && <Alert alertData={notify} />}
                    <div className="row clearfix g-3">
                      <div className="col-sm-12">
                        <div className="card mt-2">
                          <div className="card-body">
                            <form
                              onSubmit={handleForm}
                              method="post"
                              encType="multipart/form-data"
                            >
                              <div className="form-group row mt-3">
                                <label className="col-sm-2 col-form-label">
                                  <b>Select Customer Type :</b>
                                </label>
                                <div className="col-sm-4">
                                  {data && CustomerTypeDropdown && (
                                    <Select
                                      id="customer_type_id"
                                      name="customer_type_id"
                                      options={CustomerTypeDropdown}
                                      defaultValue={
                                        data &&
                                        CustomerTypeDropdown.filter(
                                          (d) => d.value == data.customer_type_id
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>

                              <div className="form-group row mt-3">
                                <label className="col-sm-2 col-form-label">
                                  <b>Select Query Type :</b>
                                </label>
                                <div className="col-sm-4">
                                  {data && QueryTypeDropdown && (
                                    <Select
                                      id="query_type_id"
                                      name="query_type_id"
                                      options={QueryTypeDropdown}
                                      onChange={handleQueryType}
                                      defaultValue={
                                        data &&
                                        QueryTypeDropdown.filter(
                                          (d) => d.value == data.query_type_id
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>

                              <div className="form-group row mt-3">
                                <label className="col-sm-2 col-form-label">
                                  <b>Select Form :</b>
                                </label>
                                <div className="col-sm-4">
                                  {data && DynamicFormDropdown && (
                                    <Select
                                      id="dynamic_form_id"
                                      name="dynamic_form_id"
                                      options={DynamicFormDropdown}
                                      defaultValue={
                                        data &&
                                        DynamicFormDropdown.filter(
                                          (d) => d.value == data.dynamic_form_id
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="form-group row mt-3">
                                <label className="col-sm-2 col-form-label">
                                  <b>Select Template :</b>
                                </label>
                                <div className="col-sm-4">
                                  {data && TemplateDropdown && (
                                    <Select
                                      id="template_id"
                                      name="template_id"
                                      options={TemplateDropdown}
                                      defaultValue={
                                        data &&
                                        TemplateDropdown.filter(
                                          (d) => d.value == data.template_id
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>

                              <div className="form-group row mt-3">
                                <label className="col-sm-2 col-form-label">
                                  <b>Priority :</b>
                                </label>
                                <div className="col-sm-4">
                                  <select
                                    className="form-control form-control-sm"
                                    id="priority"
                                    name="priority"
                                    required={true}
                                  >
                                    {priority.map((data) => {
                                      if (data.priority && data.priority === data) {
                                        return (
                                          <option value={data} selected>
                                            {data}
                                          </option>
                                        );
                                      } else {
                                        return <option value={data}>{data}</option>;
                                      }
                                    })}
                                  </select>
                                </div>
                              </div>
                              {/* {priorityDropdown && priorityDropdown.map((d,i)=>{
                                                              if(data.priority && data.priority === d){
                                                                  return   <Select className="form-control form-control-sm" id="priority" name="priority[]" required={true}
                                                                  isMulti
                                                                  options={priorityDropdown}
                                                              />
                                                              }
                                                      
                                                      })} */}

                              <div className="form-group row mt-3">
                                <label className="col-sm-2 col-form-label">
                                  <b>Approach :</b>
                                </label>
                                <div className="col-sm-4">
                                  <select
                                    className="form-control form-control-sm"
                                    id="approach"
                                    name="approach"
                                    required={true}
                                    onChange={(e) => {
                                      handleApproch(e);
                                    }}
                                  >
                                    {approachData.map((approach) => {
                                      if (data && approach.code == data.approach) {
                                        return (
                                          <option value={approach.code} selected>
                                            {approach.approach}
                                          </option>
                                        );
                                      } else {
                                        return (
                                          <option value={approach.code}>
                                            {approach.approach}
                                          </option>
                                        );
                                      }
                                    })}
                                  </select>
                                </div>
                              </div>

                              <div className="form-group row mt-3">
                                <label className="col-sm-2 col-form-label">
                                  <b>Select Department :</b>
                                </label>
                                <div className="col-sm-4">
                                  {data && DepartmentDropdown && (
                                    <Select
                                      id="department_id"
                                      name="department_id"
                                      ref= {deptRef}
                                      options={DepartmentDropdown}
                                      onChange={e=>handleDepartment(e)}
                                      defaultValue={
                                        data &&
                                        DepartmentDropdown.filter(
                                          (d) => d.value == data.department_id
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                              {   approach && approach == "RR" && (
                                <div className="form-group row mt-3">
                                  <label className="col-sm-2 col-form-label">
                                    <b>Select User :</b>
                                  </label>
                                  <div className="col-sm-4">
                                    {data && usersDropdown && 
                                      <Select
                                        isMulti
                                        isSearchable={true}
                                        name="user[]"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        ref={rrRef}
                                        options={usersDropdown}
                                        onChange={e=>handleDepartment(e)}
                                        required
                                        defaultValue={data.user_policy_label}
                                        style={{ zIndex: "100" }}
                                      />
                                    }
                                  </div>
                                </div>
                              )}



                              {approach && approach == "HLT" && (
                                <div className="form-group row mt-3">
                                  <label className="col-sm-2 col-form-label">
                                    <b>Select User :</b>
                                  </label>
                                  <div className="col-sm-4">
                                    {usersDropdown && (
                                      <Select
                                        id="user"
                                        name="user[]"
                                        isMulti
                                        required
                                        ref={hltRef}
                                        defaultValue={data.user_policy_label}
                                        options={usersDropdown}
                                      />
                                    )}
                                  </div>
                                </div>
                              )}

                              {approach && userDropdown && approach == "SP" && (
                                <div className="form-group row mt-3">
                                  <label className="col-sm-2 col-form-label">
                                    <b>Select User :</b>
                                  </label>
                                  <div className="col-sm-4">
                                    <Select
                                      id="user"
                                      name="user_id[]"
                                      required
                                      options={userDropdown}
                                      defaultValue={
                                        userDropdown &&
                                        userDropdown.filter(
                                          (d) => d.value == parseInt(data.user_policy)
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )}

                              {approach && approach == "RW" && (
                                <>
                                  <div className="row mt-4">
                                    <div className="col-md-6">
                                      <table className="table">
                                        <thead className="thead">
                                          <th style={{ width: "50px" }}>Sr</th>
                                          <th style={{ width: "300px" }}>User</th>
                                          <th style={{ width: "100px" }}>Ratio</th>
                                        </thead>
                                        <tbody className="tbody">
                                          {userData &&
                                            departmentId &&
                                            userData.map((ele, i) => {
                                              const ratioArray = data.user_policy;
                                              const newarray = [];
                                              for (let i = 0; i < ratioArray.length; i++) {
                                                const secondValue = ratioArray[i];
                                                newarray.push(secondValue);
                                              }
                                              // for (let i = 0; i < newarray.length; i++) {
                                              //     console.log(newarray)
                                              // }
                                              //     let editSum = 0;
                                              //     newarray.forEach((value) => {
                                              //         editSum += Number(value);
                                              //     });
                                              //     console.log(editSum)
                                              // setRationTotal(editSum);

                                              return (
                                                <tr>
                                                  <td>{i + 1}</td>
                                                  <td>
                                                    <input
                                                      type="text"
                                                      className="form-control col-sm-4"
                                                      value={ele.label}
                                                    />
                                                    <input
                                                      type="hidden"
                                                      value={ele.value}
                                                      name="user[]"
                                                    />
                                                  </td>
                                                  <td>
                                                    <input
                                                      type="text"
                                                      className="form-control col-sm-2"
                                                      name="ratio[]"
                                                      Value={newarray[i]}
                                                      onChange={(event) =>
                                                        checkRatio(event, i)
                                                      }
                                                    />
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          <tr>
                                            <td
                                              colSpan={2}
                                              className="text-right"
                                              style={{ textAlign: "right" }}
                                            >
                                              Total
                                            </td>
                                            <td>
                                              <h6>{rationTotal ? rationTotal : 0}</h6>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </>
                              )}

                              {data && (
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
                                              data.is_active == 1 ? true : false
                                            }
                                            key={Math.random()}
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
                                            defaultChecked={
                                              data.is_active == 0 ? true : false
                                            }
                                            key={Math.random()}
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
                              )}

                              <div className="row mt-2">
                                <div className="col-sm-2">
                                  <label className="col-form-label">
                                    <b>Confirmation Required :</b>
                                  </label>
                                </div>

                                <div className="col-sm-1" style={{ textAlign: "left" }}>
                                  <div
                                    class="form-group mt-2 text-left d-flex justify-content-between"
                                    style={{ textAlign: "left" }}
                                  >
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="confirmation_required"
                                        id="confirmation_required_yes"
                                        value="1"
                                        key={Math.random()}
                                        defaultChecked={
                                          data && data.confirmation_required == 1
                                        }
                                      />
                                      <label
                                        className="form-check-label "
                                        htmlFor="confirmation_required_yes"
                                      >
                                        Yes
                                      </label>
                                    </div>

                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="confirmation_required"
                                        id="confirmation_required_no"
                                        value="0"
                                        key={Math.random()}
                                        defaultChecked={
                                          data && data.confirmation_required == 0
                                        }
                                      />
                                      <label
                                        className="form-check-label "
                                        htmlFor="confirmation_required_no"
                                      >
                                        No
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3" style={{ textAlign: "right" }}>
                                {checkRole && checkRole[32].can_update === 1 ? (
                                  <button type="submit" className="btn btn-primary btn-sm">
                                    Update
                                  </button>
                                ) : (
                                  ""
                                )}
                                <Link
                                  to={`/${_base}/CustomerMapping`}
                                  className="btn btn-danger btn-sm text-white"
                                >
                                  Cancel
                                </Link>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }




               // const select = user.filter(d => d.department_id == e.value).map(d => ({ value: d.id, label: d.first_name + " " + d.last_name }))
                  // setUserDropdown(select);
                  // let department_id = null;
                  // if (id) {
                  //     department_id = id;
                  // } else {
                  //     department_id = e.value;
                  // }
                  // // if (user) {
                  // //     const select = user.filter(d => d.department_id == department_id).map(d => ({ value: d.id, label: d.first_name + " " + d.last_name }))
                  // //     setUserDropdown(select);
                  // //     console.log(select)
                  // // }

                  // setDepartmentId(department_id);
                  // const tempUser = [];
                  // new UserService().getUser().then(res => {
                  //     if (res.status === 200) {
                  //         const temp = res.data.data
                  //         for (const key in temp) {
                  //            //console.log(temp[key])
                  //             if (temp[key].department_id == departmentId) {
                  //                 tempUser.push({
                  //                     value: temp[key].id,
                  //                     label: temp[key].first_name + " " + temp[key].last_name,
                  //                 })
                  //             }
                  //         }
                  //         setUserData(null);
                  //         setUserData(tempUser);
                  //     }
                  // })

                  // const select = user.filter(d => d.department_id == e.value).map(d => ({ value: d.id, label: d.first_name + " " + d.last_name }))
                  // setUserDropdown(select);
                  // setDepartmentId(e.value)
