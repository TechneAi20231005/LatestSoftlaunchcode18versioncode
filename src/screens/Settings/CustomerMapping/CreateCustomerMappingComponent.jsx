import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import CustomerMappingService from "../../../services/SettingService/CustomerMappingService";
import { _base, userSessionData } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";
import { ToastContainer, toast } from "react-toastify";

import DepartmentService from "../../../services/MastersService/DepartmentService";

import DynamicFormService from "../../../services/MastersService/DynamicFormService";
import UserService from "../../../services/MastersService/UserService";
import { useRef } from "react";
import Table from "react-bootstrap/Table";

import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "../../Dashboard/DashboardAction";
import {
  getQueryTypeData,
  getTemplateData,
  getcustomerTypeData,
} from "./Slices/CustomerMappingAction";
import { getUserForMyTicketsData } from "../../TicketManagement/MyTicketComponentAction";

export function getDateTime() {
  var now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  month = month >= 10 ? month : `0${month}`;
  let day = now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`;
  let hour = now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`;
  let min = now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`;
  let sec = now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`;
  var datetime =
    year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  return datetime;
}

export default function CreateCustomerMappingComponent() {
  const history = useNavigate();
  const dispatch = useDispatch();
  const departmentDropdownRef = useRef();
  const [notify, setNotify] = useState();

  const [dynamicForm, setDynamicForm] = useState();
  const [dynamicFormDropdown, setDynamicFormDropdown] = useState();

  const [selectedDynamicForm, setSelectedDynamicForm] = useState();

  const [userData, setUserData] = useState([]);

  const [department, setDepartment] = useState();
  const [departmentDropdown, setDepartmentDropdown] = useState();

  const [user, setUser] = useState();
  const [userDropdown, setUserDropdown] = useState();

  const [ratiowiseData, setRatiowiseData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [showUserSelect, setShowUserSelect] = useState(false);

  const [ratioTotal, setRatioTotal] = useState(0);

  const [confirmationRequired, setConfirmationRequired] = useState("");

  const handleConfirmationChange = (e) => {
    setConfirmationRequired(e?.target?.value);
  };

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 32)
  );

  const {
    customerTypeData: customerTypeDropdown,
    queryTypeData: queryType,
    queryTypeDropDownData: queryTypeDropdown,
    templateDropDownData: templateDropdown,
  } = useSelector(
    (CustomerMappingSlice) => CustomerMappingSlice.customerMaster
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

  const loadData = async () => {
    await getDynamicForm();
  };

  const getDynamicForm = async () => {
    try {
      const res = await new DynamicFormService().getDynamicForm();
      if (res.status === 200) {
        if (res.data.status === 1) {
          const data = res.data.data.filter((d) => d.is_active == 1);
          const select = res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ value: d.id, label: d.template_name }));
          setDynamicForm(data);
          setDynamicFormDropdown(select);
        }
      }
    } catch (error) {
      console.error("Error fetching dynamic form:", error);
    }
  };

  const handleQueryType = async (e) => {
    setNotify(null);
    setDynamicForm(null);
    setDynamicFormDropdown(null);
    setSelectedDynamicForm(null);
    await getDynamicForm();

    const queryTypeTemp = queryType.filter((d) => d.id === e.value);

    const dynamicFormDropdownTemp = dynamicForm
      .filter((d) => d.id == queryTypeTemp[0].form_id)
      .map((d) => ({ value: d.id, label: d.template_name }));

    if (dynamicFormDropdownTemp?.length > 0) {
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
      if (res.payload.status === 200) {
        if (res.payload.data.status === 1) {
          const data = res.payload.data.data.filter((d) => d.is_active === 1);
          setUser(data);
          var dropwdown = res.payload.data.data
            .filter((d) => d.is_active === 1)
            .map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " (" + d.id + ")",
            }));
          setUserDropdown(dropwdown);
        }
      }
    });
  };
  //MAIN METHOD TO HANDLE CHANGES IN STATE DATA
  const handleAutoChanges = async (e, type, nameField) => {
    if (type === "Select2" && nameField === "customer_type_id") {
      setSelectedCustomer(e?.length);
    }

    const value =
      type === "Select2" && nameField === "customer_type_id"
        ? e?.map((i) => i.value)
        : e?.value
        ? e?.value
        : e?.target?.value;

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
      if (res.status === 200) {
        if (res.data.status === 1) {
          const dropdown = res.data.data
            .filter(
              (d) =>
                d.is_active === 1 && d.multiple_department_id.includes(e.value)
            )

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
          if (dropdown.length === 0) {
            setUserDropdown([{ value: "", label: "No data found" }]);
          }
        }
      }
    });
  };

  const handleRatioInput = (index) => (e) => {
    e.preventDefault();
    const newValue = parseInt(e.target.value) || 0;

    if (newValue > 100) {
      e.target.value = 0;
      toast.error("Cannot Enter More than 100 !!!");
    } else {
      const newData = [...userData];
      newData[index] = { user_id: userDropdown[index]?.value, ratio: newValue };
      const sum = newData.reduce(
        (result, item) => result + (item ? item.ratio : 0),
        0
      );

      if (sum > 100) {
        e.target.value = 0;
        toast.error("Ratio Total Must Be 100 !!!");
      } else {
        setUserData(newData);
        setRatioTotal(sum);
      }
    }
  };

  const customerDetail = useRef();
  const queryTypeDetail = useRef();
  const dynamicDetail = useRef();
  const templateDetail = useRef();
  const priorityDetail = useRef();
  const confirmationRequiredDetail = useRef();
  const approachDetail = useRef();
  const useridDetail = useRef();
  const statusDtail = useRef();
  const userRatioDetail = useRef();
  const handleForm = async (e) => {
    e.preventDefault();

    let userIDs;
    if (Array.isArray(useridDetail?.current?.props?.value)) {
      userIDs = useridDetail?.current?.props?.value?.map((item) => item.value);
    } else {
      const value = useridDetail?.current?.props?.value?.value;
      userIDs = value ? [value] : [];
    }

    const getUserData = () => {
      // Get an array of user IDs
      const userIds = userDropdown?.map((ele) => ele?.value);

      return userIds;
    };

    const RwuserID = getUserData();

    const customerID = customerDetail?.current?.props?.value;
    const queryTypeid = queryTypeDetail?.current?.props?.value?.value;
    const dynamicFormid = dynamicDetail?.current?.props?.value[0]?.value;
    const templateid = templateDetail?.current?.props?.value?.value;
    const priorityID = priorityDetail?.current?.value;
    const confirmationId = confirmationRequired;
    const approachId = approachDetail?.current?.value;
    const departmentId = departmentDropdownRef?.current?.props?.value[0]?.value
      ? departmentDropdownRef?.current?.props?.value[0]?.value
      : departmentDropdownRef?.current?.props?.value?.value;
    const userID = userIDs;

    const statusID = statusDtail?.current?.value;

    let arrayOfId = [];
    for (let i = 0; i < customerID?.length; i++) {
      arrayOfId.push(customerID[i]?.value);
    }
    const form = {};

    form.customer_type_id = arrayOfId;
    form.query_type_id = queryTypeid;
    form.dynamic_form_id = dynamicFormid;
    form.template_id = templateid ? templateid : null;
    form.priority = priorityID;
    form.confirmation_required = confirmationId;
    form.approach = approachId;
    form.department_id = departmentId;
    if (data.approach === "RW") {
      form.user_id = RwuserID;
      form.userData = userData;
    } else {
      form.user_id = userID;
    }

    form.status = statusID;

    form.tenant_id = sessionStorage.getItem("tenant_id");
    form.created_by = userSessionData.userId;
    form.created_at = getDateTime();

    var flag = 1;
    if (data?.approach === "RW") {
      if (
        (ratioTotal && ratioTotal > 100) ||
        (ratioTotal && ratioTotal < 100)
      ) {
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
              res?.message
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
            errorObject?.data?.message
          );
        });
    } else {
    }
  };

  useEffect(() => {
    setNotify(null);
    dispatch(getTemplateData());
    loadData();
    getUser();
    dispatch(getQueryTypeData());

    dispatch(getcustomerTypeData());

    if (!checkRole?.length) {
      dispatch(getRoles());
    }
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
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
                    <b>Select Customer Type :</b>
                  </label>
                  <div className="col-sm-4">
                    <Select
                      id="customer_type_id[]"
                      name="customer_type_id[]"
                      options={customerTypeDropdown}
                      isMulti
                      ref={customerDetail}
                      onChange={(e) => {
                        handleAutoChanges(e, "Select2", "customer_type_id");
                      }}
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
                      ref={queryTypeDetail}
                      options={queryTypeDropdown}
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
                        ref={dynamicDetail}
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
                        ref={dynamicDetail}
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
                      ref={templateDetail}
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
                      ref={priorityDetail}
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

                  <div className="col-sm-1">
                    <div className="form-group mt-2 text-left d-flex justify-content-between">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="confirmation_required"
                          id="confirmation_required_yes"
                          ref={confirmationRequiredDetail}
                          onChange={handleConfirmationChange}
                          required
                          value="1"
                          defaultChecked={
                            data && data.confirmation_required !== "1"
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="confirmation_required_yes"
                        >
                          Yes
                        </label>
                      </div>

                      <div className="form-check mx-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="confirmation_required"
                          id="confirmation_required_no"
                          value="0"
                          ref={confirmationRequiredDetail}
                          required
                          defaultChecked={
                            data &&
                            (data.confirmation_required == 1 ||
                              data.confirmation_required == "0")
                          }
                          onChange={handleConfirmationChange}
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
                      ref={approachDetail}
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
                      {selectedCustomer === 0 && (
                        <option value="SELF">Self</option>
                      )}
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
                            setShowUserSelect(true);
                          }}
                        />
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
                    {showUserSelect && (
                      <>
                        {userDropdown && data.approach !== "RW" && (
                          <div className="col-sm-4">
                            <Select
                              isMulti={data.approach !== "SP"}
                              isSearchable={true}
                              ref={useridDetail}
                              name="user_id[]"
                              className="basic-multi-select"
                              classNamePrefix="select"
                              options={userDropdown}
                              required
                            />
                          </div>
                        )}
                      </>
                    )}

                    {userDropdown && data.approach === "RW" && (
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
                                  {console.log(ratiowiseData)}
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control col-sm-2"
                                      name="ratio[]"
                                      defaultValue={0}
                                      ref={userRatioDetail}
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

                <div className="mt-3 d-flex justify-content-end">
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
