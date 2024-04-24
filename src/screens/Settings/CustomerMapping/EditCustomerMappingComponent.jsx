import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomerMappingService from "../../../services/SettingService/CustomerMappingService";
import { _base, userSessionData } from "../../../settings/constants";

import ErrorLogService from "../../../services/ErrorLogService";

import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";

import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import DepartmentService from "../../../services/MastersService/DepartmentService";
import CustomerTypeService from "../../../services/MastersService/CustomerTypeService";
import QueryTypeService from "../../../services/MastersService/QueryTypeService";
import TemplateService from "../../../services/MastersService/TemplateService";
import DynamicFormService from "../../../services/MastersService/DynamicFormService";
import UserService from "../../../services/MastersService/UserService";

import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "../../Dashboard/DashboardAction";

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

export default function EditCustomerMappingComponentBackup({ match }) {
  const history = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const mappingId = id;
  const [notify, setNotify] = useState();

  const [customerType, setCustomerType] = useState();
  const [customerTypeDropdown, setCustomerTypeDropdown] = useState();

  const [queryType, setQueryType] = useState();
  const [queryTypeDropdown, setQueryTypeDropdown] = useState();

  const [dynamicForm, setDynamicForm] = useState();
  const [dynamicFormDropdown, setDynamicFormDropdown] = useState();
  const [selectedDynamicForm, setSelectedDynamicForm] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState(0);

  const [template, setTemplate] = useState();
  const [templateDropdown, setTemplateDropdown] = useState();

  const [department, setDepartment] = useState();
  const [departmentDropdown, setDepartmentDropdown] = useState();

  const [user, setUser] = useState();
  const [userDropdown, setUserDropdown] = useState();

  const [ratiowiseData, setRatiowiseData] = useState([]);
  const [ratiowiseReplica, setRatiowiseReplica] = useState([]);
  const [ratioTotal, setRatioTotal] = useState(0);

  const roleId = sessionStorage.getItem("role_id");
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 32)
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

  const [userData, setUserData] = useState();
  const priority = ["Low", "Medium", "High", "Very High"];

  const loadData = async () => {
    var tempData = "";
    await new CustomerMappingService()
      .getCustomerMappingById(mappingId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            tempData = res.data.data;
            setData({
              approach: tempData.approach,
              confirmation_required: tempData.confirmation_required,
              created_at: tempData.created_at,
              created_by: tempData.created_by,
              customer_id: tempData.customer_id,
              customer_type_id: tempData.customer_type_id,
              department_id: tempData.department_id,
              dynamic_form_id: tempData.dynamic_form_id,
              id: tempData.id,
              is_active: tempData.is_active,
              is_default: tempData.is_default,
              module_id: tempData.module_id,
              priority: tempData.priority,
              project_id: tempData.project_id,
              query_type_id: tempData.query_type_id,
              remark: tempData.remark,
              sla: tempData.sla,
              sub_module_id: tempData.sub_module_id,
              template_id: tempData.template_id,
              tenant_id: tempData.tenant_id,
              updated_at: tempData.updated_at,
              updated_by: tempData.updated_by,
              user_policy: tempData.user_policy,
              user_policy_label: tempData.user_policy_label,
            });
          }
        }
      });

    dispatch(getRoles());

    await new CustomerTypeService().getCustomerType().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          const data = res.data.data.filter((d) => d.is_active == 1);
          const select = res.data.data
            .filter((d) => d.is_active)
            .map((d) => ({ value: d.id, label: d.type_name }));
          setCustomerType(data);
          setCustomerTypeDropdown(select);
        }
      }
    });

    await new CustomerMappingService().getPriorityDropdown().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const select = res.data.data
            .filter((d) => d.is_active)
            .map((d) => ({ value: d.id, label: d.label }));
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
          setQueryTypeDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.query_type_name }))
          );
        }
      }
    });

    await getDynamicForm();

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
    await getDepartment();

    setUserDropdown(null);

    if (tempData.approach == "RW" && tempData.user_policy) {
      tempData.user_policy.forEach((d, i) => {
        var x = d.split(":");
        if (x.length > 1) {
          ratiowiseData[i] = parseInt(x[1]);
        }
      });
      var sum = ratiowiseData?.reduce((result, number) => result + number, 0);
      setRatioTotal(sum);
    }
    await new UserService().getUserWithMultipleDepartment().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          var defaultValue = [{ value: "", label: "Select User" }];

          const dropdown = res.data.data
            .filter((d) => d.is_active == 1)
            .filter((d) =>
              d.multiple_department_id.includes(tempData.department_id)
            )
            .map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " (" + d.id + ")",
            }));

          if (tempData.approach == "RW") {
            //DONT DELETE
            // const q = res.data.data.filter((d) => d.is_active == 1).filter((d) => d.multiple_department_id.includes(e.value))
            //   .map((d) => ({ value: d.id, label: d.first_name + " " + d.last_name+" ("+ d.id +")",ratio:0 }));
            defaultValue = dropdown;
          } else {
            defaultValue = [...defaultValue, ...dropdown];
          }
          setUserDropdown(defaultValue);
        }
      }
    });
  };

  const getDynamicForm = async () => {
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
    await new UserService().getUser().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          const data = res.data.data.filter((d) => d.is_active == 1);
          setUser(data);
          var defaultValue = [{ value: 0, label: "Select User" }];
          var dropwdown = res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " (" + d.id + ")",
            }));
          defaultValue = [...defaultValue, ...dropwdown];
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
      setRatiowiseData([]);
      setDepartmentDropdown(null);
      setUserDropdown(null);
      setData((prev) => {
        const newPrev = { ...prev };
        newPrev["department_id"] = null;
        newPrev["user_policy"] = null;
        newPrev["user_policy_label"] = null;
        return newPrev;
      });
      handleGetDepartmentUsers(e);
      await getDepartment();
    }

    if (nameField == "department_id" && data.department_id != value) {
      setData((prev) => {
        const newPrev = { ...prev };
        newPrev["user_policy_label"] = null;
        return newPrev;
      });
    }
    setData((prev) => {
      const newPrev = { ...prev };
      newPrev[nameField] = value;
      return newPrev;
    });
  };

  const handleGetDepartmentUsers = async (e, additional_id = null) => {
    setUserDropdown(null);
    await new UserService().getUserWithMultipleDepartment().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          var defaultValue = [{ value: "", label: "Select User" }];

          const dropdown = res.data.data
            .filter((d) => d.is_active == 1)
            .filter((d) =>
              additional_id
                ? d.multiple_department_id.includes(additional_id)
                : d.multiple_department_id.includes(e.value)
            )
            .map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " (" + d.id + ")",
            }));

          if (data.approach == "RW") {
            //DONT DELETE
            // const q = res.data.data.filter((d) => d.is_active == 1).filter((d) => d.multiple_department_id.includes(e.value))
            //   .map((d) => ({ value: d.id, label: d.first_name + " " + d.last_name+" ("+ d.id +")",ratio:0 }));
            defaultValue = dropdown;
          } else {
            defaultValue = [...defaultValue, ...dropdown];
          }

          setUserDropdown(defaultValue);
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
    sum = ratiowiseData.reduce((result, number) => result + number);
    if (sum > 100) {
      ratiowiseData[index] = 0;
      sum = ratiowiseData.reduce((result, number) => result + number);
    }
    setRatioTotal(sum);
  };

  const customerDetail = useRef();
  const queryTypeDetail = useRef();
  const dynamicDetail = useRef();
  const templateDetail = useRef();
  const priorityDetail = useRef();
  const confirmationRequiredDetail = useRef();
  const approachDetail = useRef();
  const statusDtail = useRef();
  const userNameDetail = useRef();
  const userRatioDetail = useRef();

  const departmentDropdownRef = useRef();

  const useridDetail = useRef();

  const handleForm = async (e) => {
    e.preventDefault();
    let userIDs;
    if (Array.isArray(useridDetail?.current?.props?.value)) {
      userIDs = useridDetail?.current?.props?.value.map((item) => item.value);
    } else {
      const value = useridDetail?.current?.props?.value?.value;
      userIDs = value ? [value] : [];
    }

    const getUserData = () => {
      // Get an array of user IDs
      const userIds = userDropdown?.map((ele) => ele?.value);

      return userIds;
    };

    const getUserDataa = () => {
      // Get an array of ratio values
      const ratios = userDropdown.map((ele, i) => {
        const ratio = userRatioDetail?.current?.value; // Assuming userRatioDetail is an array of refs containing input fields for ratios
        return parseInt(ratio, 10); // Convert the ratio to an integer
      });

      return ratios;
    };

    const RwuserID = getUserData();
    const userRatioData = getUserDataa();

    const customerID = customerDetail?.current?.props?.value;
    const queryTypeid = queryTypeDetail?.current?.props?.value[0]?.value;
    const dynamicFormid = dynamicDetail?.current?.props?.value[0]?.value;
    const templateid = templateDetail?.current?.props?.value.value;
    const priorityID = priorityDetail?.current?.value;
    const confirmationId = confirmationRequiredDetail?.current?.value;
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
    form.template_id = templateid;
    form.priority = priorityID;
    form.confirmation_required = confirmationId;
    form.approach = approachId;
    form.department_id = departmentId;
    if (data.approach === "RW") {
      form.user_id = RwuserID;
    } else {
      form.user_id = userID;
    }
    if (data.approach === "RW") {
      form.ratio = userRatioData;
    }

    form.status = statusID;

    form.tenant_id = sessionStorage.getItem("tenant_id");
    form.updated_by = userSessionData.userId;
    form.updated_at = getDateTime();

    // const form = new FormData(e.target);
    var flag = 1;
    if (data.approach === "RW") {
      if (ratioTotal !== 100) {
        alert("Sum Must Be 100");
        flag = 0;
      }
    }

    if (flag == 1) {
      await new CustomerMappingService()
        .updateCustomerMapping(mappingId, form)
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
        .catch((error) => {});
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Edit Customer Mapping" />
      {notify && <Alert alertData={notify} />}
      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <div className="card mt-2">
            <div className="card-body">
              {data && (
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
                      {customerTypeDropdown && data && (
                        <Select
                          id="customer_type_id[]"
                          name="customer_type_id[]"
                          ref={customerDetail}
                          options={customerTypeDropdown}
                          isMulti
                          defaultValue={
                            data &&
                            customerTypeDropdown.filter((d) =>
                              data.customer_type_id.includes(d.value)
                            )
                          }
                          onChange={(e) =>
                            handleAutoChanges(e, "Select2", "customer_type_id")
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Select Query Type :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      {queryTypeDropdown && (
                        <Select
                          id="query_type_id"
                          name="query_type_id"
                          options={queryTypeDropdown}
                          ref={queryTypeDetail}
                          defaultValue={queryTypeDropdown.filter(
                            (d) => data.query_type_id == d.value
                          )}
                          onChange={(e) => {
                            handleAutoChanges(e, "Select2", "query_type_id");
                            handleQueryType(e);
                          }}
                        />
                      )}
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
                          ref={dynamicDetail}
                          options={dynamicFormDropdown}
                          defaultValue={dynamicFormDropdown.filter(
                            (d) => data.dynamic_form_id == d.value
                          )}
                          onChange={(e) =>
                            handleAutoChanges(e, "Select2", "dynamic_form_id")
                          }
                        />
                      )}
                      {selectedDynamicForm && dynamicFormDropdown && "H" && (
                        <Select
                          id="dynamic_form_id"
                          name="dynamic_form_id"
                          ref={dynamicDetail}
                          defaultValue={selectedDynamicForm}
                          options={
                            dynamicFormDropdown ? dynamicFormDropdown : ""
                          }
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
                      {templateDropdown && (
                        <Select
                          id="template_id"
                          name="template_id"
                          options={templateDropdown}
                          ref={templateDetail}
                          defaultValue={templateDropdown.filter(
                            (d) => data.template_id == d.value
                          )}
                          onChange={(e) =>
                            handleAutoChanges(e, "Select2", "template_id")
                          }
                        />
                      )}
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
                        value={data.priority}
                      >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                      </select>
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
                              ref={statusDtail}
                              defaultChecked={
                                data.is_active == 1 ? true : false
                              }
                              key={Math.random()}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_1"
                            >
                              Active{" "}
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
                              ref={statusDtail}
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

                  <div className="row mt-2">
                    <div className="col-sm-2">
                      <label className="col-form-label">
                        <b>Confirmation Required :</b>
                        <Astrick color="red" size="13px" />
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
                            ref={confirmationRequiredDetail}
                            value="1"
                            required
                            key={Math.random()}
                            defaultChecked={
                              data.confirmation_required == 1 ||
                              data.confirmation_required == "1"
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
                            ref={confirmationRequiredDetail}
                            key={Math.random()}
                            defaultChecked={
                              data.confirmation_required == 0 ||
                              data.confirmation_required == "0"
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
                        ref={approachDetail}
                        required={true}
                        onChange={(e) => {
                          handleAutoChanges(e, "Select", "approach");
                        }}
                        value={data.approach}
                      >
                        <option value="">Select Approach</option>
                        <option value="RR">Departmentwise Round Robin</option>
                        <option value="HLT">User Having Less Ticket</option>
                        <option value="SP">Single Person</option>
                        <option value="RW">Ratio Wise</option>
                        {selectedCustomer == 0 && (
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
                            id="department_id"
                            name="department_id"
                            defaultValue={departmentDropdown.filter(
                              (d) => data.department_id == d.value
                            )}
                            options={departmentDropdown}
                            ref={departmentDropdownRef}
                            onChange={(e) => {
                              handleAutoChanges(e, "Select2", "department_id");
                              handleGetDepartmentUsers(e);
                            }}
                          />
                        )}
                        {/* {data.approach && !departmentDropdown && <span className="mt-2" style={{marginTop:"10%",fontSize:"16px"}}>Loading.....</span>} */}
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
                      {data && userDropdown && data.approach != "RW" && (
                        <div className="col-sm-4">
                          <Select
                            isMulti={data.approach != "SP"}
                            isSearchable={true}
                            name="user_id[]"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            ref={useridDetail}
                            defaultValue={
                              data && data.approach == "SP"
                                ? userDropdown.filter(
                                    (d) => d.value === data.user_policy?.user_id
                                  )
                                : data.user_policy?.map((d) => ({
                                    value: d.user_id,
                                    label: d.user_name,
                                  }))
                            }
                            options={userDropdown}
                            required
                            style={{ zIndex: "100" }}
                          />
                        </div>
                      )}
                      {!userDropdown && (
                        <span
                          className="mt-2"
                          style={{ marginTop: "10%", fontSize: "16px" }}
                        >
                          Loading.....
                        </span>
                      )}

                      {userDropdown &&
                        data.approach == "RW" &&
                        data.department_id && (
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
                                  // Find the corresponding user policy in user_policy array
                                  const userPolicy = data.user_policy?.find(
                                    (policy) =>
                                      policy.startsWith(`${ele.value}:`)
                                  );
                                  // Extract the ratio value from the user policy
                                  const defaultRatio = userPolicy
                                    ? parseInt(userPolicy.split(":")[1])
                                    : 0;
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
                                          ref={useridDetail}
                                          readOnly
                                        />
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          id={`index_` + Math.random()}
                                          name="user_name[]"
                                          value={ele.label}
                                          ref={userNameDetail}
                                          readOnly
                                        />
                                      </td>

                                      <td>
                                        <input
                                          type="text"
                                          className="form-control col-sm-2"
                                          name="ratio[]"
                                          defaultValue={defaultRatio}
                                          ref={userRatioDetail}
                                          //  defaultValue={
                                          //    ratiowiseData ? ratiowiseData[i] : 0
                                          //  }
                                          onInput={handleRatioInput(i)}
                                          //  max="100"
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
                      Update
                    </button>

                    <Link
                      to={`/${_base}/CustomerMapping`}
                      className="btn btn-danger btn-sm text-white"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
