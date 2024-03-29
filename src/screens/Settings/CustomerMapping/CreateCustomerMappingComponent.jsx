import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import CustomerMappingService from "../../../services/SettingService/CustomerMappingService";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";

import DepartmentService from "../../../services/MastersService/DepartmentService";
import CustomerTypeService from "../../../services/MastersService/CustomerTypeService";
import QueryTypeService from "../../../services/MastersService/QueryTypeService";
import TemplateService from "../../../services/MastersService/TemplateService";
import DynamicFormService from "../../../services/MastersService/DynamicFormService";
import UserService from "../../../services/MastersService/UserService";
import { useRef } from "react";
import Table from "react-bootstrap/Table";

import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "../../Dashboard/DashboardAction";
import { CustomerMappingSlice } from "./Slices/CustomerMappingSlice";
import {
  getQueryTypeData,
  getTemplateData,
  getcustomerTypeData,
} from "./Slices/CustomerMappingAction";
import { getUserForMyTicketsData } from "../../TicketManagement/MyTicketComponentAction";

export default function CreateCustomerMappingComponent() {
  const location = useLocation();

  const history = useNavigate();
  const [notify, setNotify] = useState();

  const userDropdownRef = useRef();
  const departmentDropdownRef = useRef();

  const [customerType, setCustomerType] = useState();


  const [dynamicForm, setDynamicForm] = useState();
  const [dynamicFormDropdown, setDynamicFormDropdown] = useState();

  const [selectedDynamicForm, setSelectedDynamicForm] = useState();

  const [template, setTemplate] = useState();
  // const [templateDropdown, setTemplateDropdown] = useState();

  const [department, setDepartment] = useState();
  const [departmentDropdown, setDepartmentDropdown] = useState();

  const [user, setUser] = useState();
  const [userDropdown, setUserDropdown] = useState();

  const [ratiowiseData, setRatiowiseData] = useState([]);
  const [ratiowiseReplica, setRatiowiseReplica] = useState([]);
  const [ratioTotal, setRatioTotal] = useState(0);
  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null)

  const dispatch = useDispatch();

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 32)
  );

  const customerTypeDropdown = useSelector(
    (CustomerMappingSlice) =>
      CustomerMappingSlice.customerMaster.customerTypeData
  );
  const queryType = useSelector(
    (CustomerMappingSlice) => CustomerMappingSlice.customerMaster.queryTypeData
  );
  const queryTypeDropdown = useSelector(
    (CustomerMappingSlice) =>
      CustomerMappingSlice.customerMaster.queryTypeDropDownData
  );

  const templateDropdown = useSelector(
    (CustomerMappingSlice) =>
      CustomerMappingSlice.customerMaster.templateDropDownData
  );

  const [data, setData] = useState({
    approach: null,
    confirmation_required: null,
    created_at: null,
    created_by: null,
    customer_id: null,
    customer_type_id: 123,
    department_id: null,
    dynamic_form_id: null,
    id: null,
    is_active: null,
    is_default: null,
    module_id: null,
    priority: [],
    project_id: null,
    query_type_id: null,
    remark: null,
    sla: null,
    sub_module_id: null,
    template_id: null,
    tenant_id: null,
    updated_at: null,
    updated_by: null,
    user_policy: [],
    user_policy_label: [],
  });

  const priority = ["Low", "Medium", "High", "Very High"];

  const loadData = async () => {
    

    await getDynamicForm();

   
  };

  const getDynamicForm = async () => {
    await new DynamicFormService().getDynamicForm().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          const data = res.data.data.filter((d) => d.is_active == 1);
          const select = res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ value: d.id, label: d.template_name }));
          setDynamicForm(data);
          setDynamicFormDropdown(select);
        }
      }
    });
  };

  const handleQueryType = async (e) => {
    setNotify(null);
    setDynamicForm(null);
    setDynamicFormDropdown(null);
    setSelectedDynamicForm(null);
    await getDynamicForm();

    const queryTypeTemp = queryType.filter((d) => d.id == e.value);

    const dynamicFormDropdownTemp = dynamicForm
      .filter((d) => d.id == queryTypeTemp[0].form_id)
      .map((d) => ({ value: d.id, label: d.template_name }));

    if (dynamicFormDropdownTemp.length > 0) {
      setData((prev) => {
        const newPrev = { ...prev };
        newPrev["dynamic_form_id"] = queryTypeTemp[0].form_id;
        return newPrev;
      });
      setSelectedDynamicForm(dynamicFormDropdownTemp);
    } else {
      setNotify({
        type: "warning",
        message: "No Form is mapped but still you can map new form",
      });
    }
  };

  const getDepartment = async () => {
    await new DepartmentService().getDepartment().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          setDepartment(res.data.data.filter((d) => d.is_active == 1));
          var defaultValue = [{ value: 0, label: "Select Department" }];
          var dropwdown = res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ value: d.id, label: d.department }));
          defaultValue = [...defaultValue, ...dropwdown];
          setDepartmentDropdown(defaultValue);
        }
      }
    });
  };

  const getUser = async () => {
    const inputRequired =
      "id,employee_id,first_name,last_name,middle_name,is_active";
    dispatch(getUserForMyTicketsData(inputRequired)).then((res) => {
      if (res.payload.status == 200) {
        if (res.payload.data.status == 1) {
          const data = res.payload.data.data.filter((d) => d.is_active == 1);
          setUser(data);
          // var defaultValue = [{ value: 0, label: "Select User" }];
          var dropwdown = res.payload.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " (" + d.id + ")",
            }));
          // defaultValue = [...defaultValue, ...dropwdown];
          setUserDropdown(dropwdown);
        }
      }
    });
  };

  //MAIN METHOD TO HANDLE CHANGES IN STATE DATA
  const handleAutoChanges = async (e, type, nameField) => {
    var value = type == "Select2" ? e.value : e.target.value;
    if (nameField == "approach" && value != data.approach) {
      setDepartmentDropdown(null);
      setUserDropdown(null);
      await getDepartment();
    }
    setData((prev) => {
      const newPrev = { ...prev };
      newPrev[nameField] = value;
      return newPrev;
    });
  };

  const handleGetDepartmentUsers = async (e) => {
    setUserDropdown(null);
    await new UserService().getUserWithMultipleDepartment().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          // var defaultValue = [{ value: "", label: "Select User" }];

          const dropdown = res.data.data
            .filter((d) => d.is_active == 1)
            .filter((d) => d.multiple_department_id.includes(e.value))
            .map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " (" + d.id + ")",
            }));
          let defaultValue;
          if (data.approach == "RW") {
            defaultValue = dropdown;
          } else {
            defaultValue = [...dropdown];
          }
          setUserDropdown(defaultValue.filter((option) => option.value !== ""));
        }
      }
    });
  };

  const handleRatioInput = (index) => async (e) => {
    e.preventDefault();
    const a = ratiowiseData;
    var sum = 0;
    var value = e.target.value ? e.target.value : 0;

    if (parseInt(value) > 100) {
      e.target.value = 0;
      ratiowiseData[index] = 0;
      alert("Cannot Enter More than 100 !!!");
    } else {
      ratiowiseData[index] = parseInt(value);
      if (ratiowiseData.length > 0) {
        sum = ratiowiseData.reduce((result, number) => result + number);
        if (sum > 100) {
          e.target.value = 0;
          ratiowiseData[index] = 0;
          alert("Ratio Total Must Be 100 !!!");
        }
      }
    }
    setRatioTotal(sum);

  
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

  

    var flag = 1;
    if (data.approach == "RW") {
      if (ratioTotal > 100 || ratioTotal < 100) {
        alert("Sum Must Be 100");
        flag = 0;
      }
    }

    if (flag == 1) {
      await new CustomerMappingService()
        .postCustomerMapping(form)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              history(
                {
                  pathname: `/${_base}/CustomerMapping`,
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
    } else {
      // alert("Error No 25");
    }
  };

  useEffect(() => {
    setNotify(null);
    loadData();
    getUser();
    dispatch(getQueryTypeData());
    dispatch(getTemplateData());
    dispatch(getcustomerTypeData());

    if (!checkRole.length) {
      dispatch(getRoles());
    }
    if (!customerTypeDropdown.length) {

    }
  
    if (!templateDropdown.length) {
     
    }
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Create Customer Mapping" />
      {notify && <Alert alertData={notify} />}

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <div className="card mt-2">
            <div className="card-body">
              <form
                method="post"
                encType="multipart/form-data"
                onSubmit={handleForm}
              >
                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Select Customer Type :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <Select
                      id="customer_type_id"
                      name="customer_type_id"
                      options={customerTypeDropdown}
                      onChange={(e) =>
                        handleAutoChanges(e, "Select2", "customer_type_id")
                      }
                    />
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Select Query Type :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <Select
                      id="query_type_id"
                      name="query_type_id"
                      options={queryTypeDropdown}
                      //onChange={handleQueryType}
                      onChange={(e) => {
                        handleAutoChanges(e, "Select2", "query_type_id");
                        handleQueryType(e);
                      }}
                    />
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>Select Form :</b>
                  </label>
                  <div className="col-sm-4">
                    {!selectedDynamicForm && dynamicFormDropdown && (
                      <Select
                        id="dynamic_form_id"
                        name="dynamic_form_id"
                        options={dynamicFormDropdown}
                        onChange={(e) =>
                          handleAutoChanges(e, "Select2", "dynamic_form_id")
                        }
                      />
                    )}
                    {selectedDynamicForm && dynamicFormDropdown && "H" && (
                      <Select
                        id="dynamic_form_id"
                        name="dynamic_form_id"
                        defaultValue={selectedDynamicForm}
                        options={dynamicFormDropdown ? dynamicFormDropdown : ""}
                        onChange={(e) =>
                          handleAutoChanges(e, "Select2", "dynamic_form_id")
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
                    <Select
                      id="template_id"
                      name="template_id"
                      options={[
                        { label: "Select Template", value: "" },
                        ...templateDropdown,
                      ]}
                      onChange={(e) =>
                        handleAutoChanges(e, "Select2", "template_id")
                      }
                    />
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Priority :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <select
                      className="form-control form-control-sm"
                      id="priority"
                      name="priority"
                      required={true}
                      onChange={(e) =>
                        handleAutoChanges(e, "Select", "priority")
                      }
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                  </div>
                </div>

               

                <div className="row mt-2">
                  <div className="col-sm-2">
                    <label className="col-form-label">
                      <b>
                        Confirmation Required :{" "}
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>

                  <div className="col-sm-1" style={{ textAlign: "left" }}>
                    <div
                      className="form-group mt-2 text-left d-flex justify-content-between"
                      style={{ textAlign: "left" }}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="confirmation_required"
                          id="confirmation_required_yes"
                          required
                          value="1"
                          defaultChecked={
                            data &&
                            (data.confirmation_required == 1 ||
                              data.confirmation_required == "1")
                          }
                        />
                        <label
                          className="form-check-label"
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
                          required
                          defaultChecked={
                            data &&
                            (data.confirmation_required == 1 ||
                              data.confirmation_required == "0")
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="confirmation_required_no"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Approach :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <select
                      className="form-control form-control-sm"
                      id="approach"
                      name="approach"
                      required={true}
                      onChange={(e) =>
                        handleAutoChanges(e, "Select", "approach")
                      }
                    >
                      <option value="">Select Approach</option>
                      <option value="RR">Departmentwise Round Robin</option>
                      <option value="HLT">User Having Less Ticket</option>
                      <option value="SP">Single Person</option>
                      <option value="RW">Ratio Wise</option>
                      <option value="SELF">Self</option>
                      <option value="AU">Assign to user</option>
                    </select>
                  </div>
                </div>

                {data.approach !== "SELF" && data.approach !== "AU" && (
                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Select Department :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      {departmentDropdown && (
                        <Select
                          ref={departmentDropdownRef}
                          id="department_id"
                          name="department_id"
                          defaultValue={departmentDropdown[0]}
                          options={departmentDropdown}
                          onChange={(e) => {
                            handleAutoChanges(e, "Select2", "department_id");
                            handleGetDepartmentUsers(e);
                          }}
                        />
                      )}
                      {data.approach && !departmentDropdown && (
                        <span
                          className="mt-2"
                          style={{ marginTop: "10%", fontSize: "16px" }}
                        >
                          Loading.....
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {data.approach !== "SELF" && data.approach !== "AU" && (
                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Select User :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {userDropdown && data.approach != "RW" && (
                      <div className="col-sm-4">
                        <Select
                          isMulti={data.approach != "SP"}
                          isSearchable={true}
                          name="user_id[]"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          options={userDropdown}
                          required
                          style={{ zIndex: "100" }}
                        />
                      </div>
                    )}

                    {data.approach && data.department_id && !userDropdown && (
                      <span
                        className="mt-2"
                        style={{ marginTop: "10%", fontSize: "16px" }}
                      >
                        Loading.....
                      </span>
                    )}

                    {userDropdown && data.approach == "RW" && (
                      <div className="col-sm-6">
                        <Table bordered className="mt-2" id="table">
                          <thead>
                            <tr className="text-center">
                              <th>#</th>
                              <th>Selected User</th>
                              <th>Enter Ratio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userDropdown.map((ele, i) => {
                              return (
                                <tr>
                                  <td>{i + 1}</td>
                                  <td>
                                    <input
                                      type="hidden"
                                      className="form-control form-control-sm"
                                      id={`index_` + Math.random()}
                                      name="user_id[]"
                                      value={ele.value}
                                      readOnly
                                    />
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      id={`index_` + Math.random()}
                                      name="user_name[]"
                                      value={ele.label}
                                      readOnly
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control col-sm-2"
                                      name="ratio[]"
                                      defaultValue={
                                        ratiowiseData ? ratiowiseData[i] : 0
                                      }
                                      onInput={handleRatioInput(i)}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                            <tr>
                              <td colSpan={2} className="text-right">
                                <b>TOTAL</b>
                              </td>

                              <td>
                                <input
                                  type="text"
                                  className="form-control col-sm-2"
                                  id={`index_` + Math.random()}
                                  value={ratioTotal}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3" style={{ textAlign: "right" }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Submit
                  </button>

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
