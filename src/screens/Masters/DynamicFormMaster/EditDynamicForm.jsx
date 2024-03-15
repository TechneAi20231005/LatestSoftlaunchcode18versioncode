import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorLogService from "../../../services/ErrorLogService";
import { Link } from "react-router-dom";
import { _base } from "../../../settings/constants";

import DynamicFormService from "../../../services/MastersService/DynamicFormService";
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
import Alert from "../../../components/Common/Alert";

import { Astrick } from "../../../components/Utilities/Style";

import { useDispatch, useSelector } from "react-redux";
import {
  getAllRoles,
  getCityData,
  getCountryDataSort,
  getCustomerData,
  getRoles,
  getStateDataSort,
} from "../../Dashboard/DashboardAction";
import {
  dynamicFormData,
  getAllDropDownData,
} from "../DynamicFormDropdown/Slices/DynamicFormDropDownAction";

import * as Validation from "../../../components/Utilities/Validation";
import UserService from "../../../services/MastersService/UserService";
import { getDesignationData } from "../DesignationMaster/DesignationAction";
import { getStatusData } from "../StatusMaster/StatusComponentAction";
import QueryTypeService from "../../../services/MastersService/QueryTypeService";

function EditDynamicForm({ match }) {
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: null,
    message: null,
  });
  const { id } = useParams();
  const formId = id;
  const history = useNavigate();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 12)
  );

  const dropdown = useSelector(
    (DynamicFormDropDownSlice) =>
      DynamicFormDropDownSlice.dynamicFormDropDown.sortDropDown
  );

  const sortDropDownData =
    dropdown && dropdown.map((d) => ({ value: d.id, lable: d.dropdown_name }));

  const roleId = sessionStorage.getItem("role_id");

  const [notify, setNotify] = useState(null);
  const mainJson = {
    inputWidth: null,
    inputType: null,
    inputName: null,
    inputLabel: null,
    inputFormat: null,
    inputDefaultValue: null,
    inputAddOn: {
      inputRange: null,
      inputDataSource: null,
      inputDataSourceData: null,
      inputDateRange: null,
    },
  };

  const [rows, setRows] = useState([mainJson]);

  const [formShow, setFormShow] = useState(false);

  const [index, setIndex] = useState({ index: 0 });

  const [inputDataSource, setInputDataSource] = useState();
  const [inputLabelValue, setInputLabelValue] = useState();

  const [labelErr, setLabelErr] = useState(null);
  const [selectedValueErr, setSelectedValueErr] = useState("");

  const [selectedValue, setSelectedValue] = useState();

  const [userData, setUserData] = useState(null);
  const [radioSelect, setRadioSelect] = useState();

  const [labelNames, setLabelNames] = useState([]);

  const roleDropdown = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getAllRoles
      ?.filter((d) => d.is_active === 1)
      .map((d) => ({
        value: d.id,
        label: d.role,
      }))
  );

  const departmentDropdown = useSelector(
    (DepartmentMasterSlice) =>
      DepartmentMasterSlice.department.sortDepartmentData
  );

  const CountryData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.filteredCountryData
  );

  const CustomerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getCustomerData
  );

  const AllcityDropDownData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.sortedCityData
  );

  const designationDropdown = useSelector(
    (DesignationSlice) =>
      DesignationSlice.designationMaster.sortedDesignationData
  );

  const stateDropdown = useSelector(
    (DashbordSlice) => DashbordSlice.dashboard.filteredStateData
  );

  const statusData = useSelector((statusMasterSlice) =>
    statusMasterSlice.statusMaster.filterStatusData
      .filter((d) => d.is_active == 1)
      .map((d) => ({ value: d.id, label: d.status }))
  );

  const dataSourceOptions = [
    { value: "", label: "Select Data Source" },
    { value: "user", label: "User Master" },
    { value: "department", label: "Department Master" },
    { value: "role", label: "Role Master" },
    { value: "country", label: "Country Master" },
    { value: "state", label: "State Master" },
    { value: "city", label: "City Master" },
    { value: "designation", label: "Designation Master" },
    { value: "customer", label: "Customer Master" },
    { value: "status", label: "Status Master" },
    { value: "query", label: "Query Type Master" },
  ];

  const handleChange = (idx, type) => async (e) => {
    if (e.target.name === "inputLabel") {
      setInputLabelValue(e.target.value);
    }

    if (selectedValue) {
      setSelectedValueErr("");
    } else {
      setSelectedValueErr("Select Data Source");
    }

    setFormShow(false);

    setIndex({ index: idx });

    const { name, value } = e.target;

    const notAllowed = [
      "ref_id",
      "created_at",
      "updated_at",
      "attachment",
      "query_type_id",
      "query_type",
      "object_id",
      "tenant_id",
      "ticket_id",
      "user_id",
      "confirmation_required",
      "project_id",
      "module_id",
      "submodule_id",
      "cuid",
      "ticket_date",
      "expected_solve_date",
      "assign_to_department_id",
      "assign_to_user_id",
      "type_id",
      "priority",
      "status_id",
      "description",
      "from_department_id",
      "remark",
      "is_active",
      "created_by",
      "updated_by",
      "passed_status",
      "passed_status_changed_by",
      "passed_status_changed_at",
      "passed_status_remark",
      "ticket_confirmation_otp",
      "ticket_confirmation_otp_created_at",
    ];

    if (
      !notAllowed.includes(
        e.target.value
          .replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, "_")
          .toLowerCase()
      )
    ) {
      if (e.target.name === "inputWidth") {
        rows[idx].inputWidth = e.target.value;
      } else if (e.target.name === "inputType") {
        rows[idx].inputType = e.target.value;
        if (e.target.value == "date") {
          rows[idx].inputFormat = "y-MM-dd";
        } else {
          rows[idx].inputFormat = null;
        }
      } else if (e.target.name === "inputLabel") {
        rows[idx].inputLabel = e.target.value;
        rows[idx].inputName = e.target.value
          .replace(/[&\/\\#,+()$~%.'":*?<>{}^&*!@ ]/g, "_")
          .toLowerCase();

        labelNames[idx] = rows[idx].inputName;
      } else if (e.target.name === "inputDefaultValue") {
        rows[idx].inputDefaultValue = e.target.value;
      } else if (e.target.name === "inputMandatory") {
        rows[idx].inputMandatory = e.target.checked;
      } else if (e.target.name === "inputMultiple") {
        rows[idx].inputMultiple = e.target.checked;
      } else if (e.target.name === "inputDataOption") {
        rows[idx].inputOption = e.target.value;
      } else if (e.target.name == "inputRange") {
        rows[idx].inputAddOn.inputRange = e.target.value;
      } else if (e.target.name == "inputRangeMin") {
        rows[idx].inputAddOn.inputRangeMin = e.target.value;
      } else if (e.target.name == "inputRangeMax") {
        rows[idx].inputAddOn.inputRangeMax = e.target.value;
      } else if (e.target.name == "datetime-local") {
        rows[idx].inputAddOn.inputDateTime = e.target.value;
      } else if (e.target.name == "inputFormat") {
        rows[idx].inputFormat = e.target.value;
      }

      if (e.target.name === "inputDataSource" && e.target.value === "user") {
        const tempUserData = [];
        const test1 = e.target.value;
        rows[idx].inputAddOn.inputDataSourceData = test1;
        const inputRequired =
          "id,employee_id,first_name,last_name,middle_name,is_active";
        await new UserService()
          .getUserForMyTickets(inputRequired)
          .then((res) => {
            if (res.status === 200) {
              const data = res.data.data.filter((d) => d.is_active === 1);

              for (const key in data) {
                tempUserData.push({
                  value: data[key].id,
                  label:
                    data[key].first_name +
                    " " +
                    data[key].last_name +
                    " (" +
                    data[key].id +
                    ")",
                });
              }
              const aa = tempUserData.sort(function (a, b) {
                return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
              });
              setUserData(aa);
              rows[idx].inputAddOn.inputDataSourceData = aa;
              setInputDataSource(aa);
            }
          });
      } else if (
        e.target.name === "inputDataSource" &&
        e.target.value === "city"
      ) {
        rows[idx].inputAddOn.inputDataSourceData = AllcityDropDownData;
        setInputDataSource(AllcityDropDownData);
      } else if (
        e.target.name === "inputDataSource" &&
        e.target.value === "role"
      ) {
        rows[idx].inputAddOn.inputDataSourceData = roleDropdown;
        setInputDataSource(roleDropdown);
      } else if (
        e.target.name === "inputDataSource" &&
        e.target.value === "country"
      ) {
        rows[idx].inputAddOn.inputDataSourceData = CountryData;
        setInputDataSource(CountryData);
      } else if (
        e.target.name === "inputDataSource" &&
        e.target.value === "state"
      ) {
        rows[idx].inputAddOn.inputDataSourceData = stateDropdown;
        setInputDataSource(stateDropdown);
      } else if (
        e.target.name === "inputDataSource" &&
        e.target.value === "designation"
      ) {
        rows[idx].inputAddOn.inputDataSourceData = designationDropdown;
        setInputDataSource(designationDropdown);
      } else if (
        e.target.name === "inputDataSource" &&
        e.target.value === "customer"
      ) {
        rows[idx].inputAddOn.inputDataSourceData = CustomerData;
        setInputDataSource(CustomerData);
      } else if (
        e.target.name === "inputDataSource" &&
        e.target.value === "status"
      ) {
        rows[idx].inputAddOn.inputDataSourceData = statusData;
        setInputDataSource(statusData);
      } else if (
        e.target.name === "inputDataSource" &&
        e.target.value === "query"
      ) {
        await new QueryTypeService().getQueryType().then((res) => {
          if (res.status === 200) {
            const data = res.data.data
              .filter((d) => d.is_active == 1)
              .map((d) => ({ value: d.id, label: d.query_type_name }));

            rows[idx].inputAddOn.inputDataSourceData = data;

            setInputDataSource(data);
          }
        });
      }

      // else if (e.target.name == "inputRadio") {
      // setFormShow(formShow == true ? false : true);
      const test = e.target.value;

      const dropDownID = selectedValue && selectedValue;

      const newValue = e.target.name;
      if (newValue === "inputOnChangeSource") {
        const dropDownValue = e.target.value;
        setSelectedValue(dropDownValue);

        rows[idx].inputAddOn.inputRadio = test;
        await new DynamicFormDropdownMasterService()
          .getDropdownById(dropDownValue)
          .then((res) => {
            if (res.status == 200) {
              if (res.data.status == 1) {
                const dropNames = res.data.data;
                setRadioSelect(dropNames.master.dropdown_name);
                const temp = [];
                res.data.data.dropdown.forEach((d) => {
                  temp.push({ label: d.label, value: d.id });
                });
                rows[idx].inputAddOn.inputRadio = temp;
                setInputDataSource(temp);
              }
            }
          });
      }
    }
  };

  const handleAddRow = async () => {
    setShowAlert({ show: false, type: null, message: null });
    let flag = 1;
    let last = rows.length - 1;

    if (
      !rows[last].inputType ||
      !rows[last].inputLabel ||
      !rows[last].inputName
    ) {
      flag = 0;
      setShowAlert({ show: false, type: null, message: null });
    }

    const item = {
      inputWidth: null,
      inputType: null,
      inputName: null,
      inputLabel: null,
      inputFormat: null,
      inputDefaultValue: null,
      inputAddOn: {
        inputRange: null,
        inputDataSource: null,
        inputDataSourceData: null,
        inputDateRange: null,
      },
    };

    if (flag === 1) {
      setRows([...rows, item]);
      setRows([...rows, mainJson]);
    } else {
      setShowAlert({
        show: true,
        type: "warning",
        message: "Please Fill Previous Row Values",
      });
    }
  };

  // const handleRemoveSpecificRow = (idx) => () => {
  //   if (idx > 0) {
  //     setRows(rows.filter((_, i) => i !== idx));
  //   }
  // };

  const handleRemoveSpecificRow = (index) => async () => {
    const updatedAssign = [...rows];

    updatedAssign.splice(index, 1);

    // Update the state
    setRows(updatedAssign);
    //   }
    // });
  };

  const handldeFormShow = () => {
    const hasEmptyLabel = rows.some((row) => row.inputLabel === "");

    if (hasEmptyLabel) {
      setLabelErr("Label Is Required");
    } else {
      setLabelErr("");
    }
    setFormShow(formShow === true ? false : true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      template_name: e.target.template_name.value,
      is_active: e.target.is_active.value,
      remark: e.target.remark.value,
      data: JSON.stringify(rows),
    };

    await new DynamicFormService()
      .updateDynamicForm(formId, data)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            dispatch(dynamicFormData());
            // history({
            //   pathname: `/${_base}/DynamicForm`,

            // },{ state: { alert: { type: "success", message: res.data.message } }}

            // );

            setNotify({ type: "success", message: res.data.message });
            setTimeout(() => {
              navigate(`/${_base}/DynamicForm`, {
                state: {
                  alert: { type: "success", message: res.data.message },
                },
              });
            }, 3000);
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
      });
  };

  const loadData = async () => {
    dispatch(dynamicFormData());

    await new DynamicFormService().getDynamicFormById(formId).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setData(res.data.data);
          setRows(res.data.data.data);
        }
      }
    });
  };

  const [dateValue, setDateValue] = useState(new Date());
  const onChangeDate = (value) => {
    setDateValue(new Date(value));
  };

  useEffect(() => {
    loadData();
    if (!checkRole.length) {
      dispatch(getRoles());
    }

    if (!dropdown.length) {
      dispatch(getAllDropDownData());
    }

    if (!designationDropdown.length) {
      dispatch(getDesignationData());
    }

    if (!AllcityDropDownData.length) {
      dispatch(getCityData());
    }

    dispatch(getCountryDataSort());
    if (!stateDropdown.length) {
      dispatch(getStateDataSort());
    }
    dispatch(getCustomerData());
    dispatch(getStatusData());
    dispatch(getAllRoles());
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <>
      <div className="body d-flex py-3">
        <div className="container-xxl">
          <div className="row clearfix g-3">
            <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
              {/*************** HEADING ***************/}
              <div className="card">
                <div
                  className="card-header d-flex justify-content-between bg-transparent
                            border-bottom-0"
                >
                  <h2 className="mb-0 fw-bold "> Edit Dynamic Form</h2>
                </div>
              </div>
              {notify && <Alert alertData={notify} />}
              {/*************** TABLE ***************/}
              <div className="card mt-2">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-2">
                        <label>
                          <b>
                            Form Name : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="template_name"
                          id="template_name"
                          required
                          defaultValue={data && data.template_name}
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>Remark: </b>
                      </label>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="remark"
                          name="remark"
                          defaultValue={data ? data.remark : null}
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Status : <Astrick color="red" size="13px" />
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
                                defaultChecked={data && data.is_active === 1}
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
                                defaultChecked={data && data.is_active === 0}
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

                    <div className="table-responsive">
                      <table
                        className="table table-bordered mt-3 table-responsive"
                        id="tab_logic"
                      >
                        <thead>
                          <tr>
                            <th className="text-center" style={{ width: "5%" }}>
                              {" "}
                              Sr No.{" "}
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "15%" }}
                            >
                              {" "}
                              Type{" "}
                            </th>
                            <th className="text-center"> Width </th>
                            <th
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              {" "}
                              Label{" "}
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              {" "}
                              Def. Value{" "}
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              {" "}
                              Mandatory{" "}
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              {" "}
                              Multiple
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              {" "}
                              Format
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "20%" }}
                            >
                              {" "}
                              Add-Ons
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              {" "}
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows &&
                            rows.map((item, idx) => (
                              <tr id={`addr_${idx}`} key={idx}>
                                <td>{idx + 1}</td>
                                <td>
                                  <select
                                    className="form-control form-control-sm"
                                    required
                                    name="inputType"
                                    value={item.inputType}
                                    onChange={handleChange(idx)}
                                  >
                                    <option value="">Select Type</option>
                                    <option value="text">TEXT</option>
                                    <option value="textarea">TEXTAREA</option>
                                    <option value="number">NUMBER</option>
                                    <option value="decimal">DECIMAL</option>
                                    <option value="date">DATE</option>
                                    <option value="datetime-local">
                                      DATE TIME
                                    </option>
                                    <option value="time">TIME</option>
                                    <option value="select">SELECT</option>
                                    <option value="radio">RADIO</option>
                                    <option value="checkbox">CHECKBOX</option>
                                    <option value="select-master">
                                      SELECT MASTER
                                    </option>
                                  </select>
                                </td>
                                <td>
                                  <select
                                    className="form-control form-control-sm"
                                    required
                                    name="inputWidth"
                                    value={item.inputWidth}
                                    onChange={handleChange(idx)}
                                  >
                                    <option>Select Width</option>
                                    <option value="col-sm-2">Very Small</option>
                                    <option value="col-sm-4" selected>
                                      Small
                                    </option>
                                    <option value="col-sm-6">Medium</option>
                                    <option value="col-sm-8">Large</option>
                                    <option value="col-sm-10">X-Large</option>
                                    <option value="col-sm-12">XX-Large</option>
                                  </select>
                                </td>

                                <td>
                                  <input
                                    type="text"
                                    name="inputLabel"
                                    value={item.inputLabel}
                                    onChange={handleChange(idx)}
                                    className="form-control form-control-sm"
                                    required
                                    onKeyPress={(e) => {
                                      Validation.CharactersNumbersOnly(e);
                                    }}
                                  />
                                  {labelErr && (
                                    <p
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      {labelErr}
                                    </p>
                                  )}
                                </td>
                                <td>
                                  {item.inputType === "date" ||
                                  item.inputType === "time" ? (
                                    <input
                                      type={
                                        item.inputType === "date"
                                          ? "date"
                                          : "time"
                                      }
                                      name="inputDefaultValue"
                                      value={item.inputDefaultValue}
                                      onChange={handleChange(idx)}
                                      className="form-control form-control-sm"
                                      onKeyPress={(e) => {
                                        Validation.CharactersNumbersSpeicalOnly(
                                          e
                                        );
                                      }}
                                    />
                                  ) : (
                                    <input
                                      type={
                                        item.inputType === "datetime-local"
                                          ? "datetime-local"
                                          : "text"
                                      }
                                      name="inputDefaultValue"
                                      value={item.inputDefaultValue}
                                      onChange={handleChange(idx)}
                                      className="form-control form-control-sm"
                                      onKeyPress={(e) => {
                                        item.inputType === "number" ||
                                        item.inputType === "decimal"
                                          ? Validation.NumbersSpecialOnlyDecimal(
                                              e
                                            )
                                          : Validation.CharactersNumbersSpeicalOnly(
                                              e
                                            );
                                      }}
                                    />
                                  )}
                                </td>

                                <td>
                                  <input
                                    type="checkbox"
                                    name="inputMandatory"
                                    id="inputMandatory"
                                    defaultChecked={item.inputMandatory}
                                    onChange={handleChange(idx)}
                                  />
                                </td>

                                <td>
                                  {(item.inputType === "select-master" ||
                                    item.inputType === "checkbox" ||
                                    item.inputType === "select") && (
                                    <input
                                      type="checkbox"
                                      name="inputMultiple"
                                      id="inputMultiple"
                                      defaultChecked={item.inputMultiple}
                                      onChange={handleChange(idx)}
                                    />
                                  )}
                                </td>
                                <td>
                                  {rows[idx].inputType == "date" && (
                                    <select
                                      className="form-control form-control-sm"
                                      required
                                      name="inputFormat"
                                      onChange={handleChange(idx)}
                                      value={rows[idx].inputFormat}
                                    >
                                      <option>Select Format</option>
                                      <option value="y-MM-dd">
                                        yyyy-mm-dd
                                      </option>
                                      <option value="dd-MM-y">
                                        dd-mm-yyyy
                                      </option>
                                    </select>
                                  )}
                                </td>

                                <td>
                                  {rows[idx].inputType == "radio" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        onChange={handleChange(idx)}
                                        id="inputOnChangeSource"
                                        name="inputOnChangeSource"
                                        defaultValue={
                                          rows &&
                                          rows[idx]?.inputAddOn
                                            ?.inputOnChangeSource
                                        }
                                      >
                                        <option>Select Data Source</option>
                                        {dropdown &&
                                          dropdown.map((d, i) => {
                                            return (
                                              <option
                                                value={d.id}
                                                selected={
                                                  parseInt(
                                                    rows &&
                                                      rows[idx]?.inputAddOn
                                                        ?.inputOnChangeSource
                                                  ) === d.id
                                                }
                                              >
                                                {d.dropdown_name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                    </span>
                                  )}

                                  {rows[idx].inputType == "checkbox" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        onChange={handleChange(idx)}
                                        id="inputOnChangeSource"
                                        name="inputOnChangeSource"
                                        defaultValue={
                                          rows &&
                                          rows[idx]?.inputAddOn?.inputDataSource
                                        }
                                      >
                                        <option>Select Data Source</option>

                                        {dropdown &&
                                          dropdown.map((d, i) => {
                                            return (
                                              <option
                                                value={d.id}
                                                selected={
                                                  parseInt(
                                                    rows &&
                                                      rows[idx]?.inputAddOn
                                                        ?.inputOnChangeSource
                                                  ) === d.id
                                                }
                                              >
                                                {d.dropdown_name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                    </span>
                                  )}

                                  {rows[idx].inputType == "select-master" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        defaultValue={
                                          rows &&
                                          rows[idx]?.inputAddOn?.inputDataSource
                                        }
                                        onChange={handleChange(idx)}
                                        id="inputDataSource"
                                        name="inputDataSource"
                                        // value={props.selectData}
                                      >
                                        {dataSourceOptions.map((option) => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                            selected={
                                              parseInt(
                                                rows &&
                                                  rows[idx]?.inputAddOn
                                                    ?.inputDataSource
                                              ) === option.value
                                            }
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                    </span>
                                  )}

                                  {rows[idx].inputType == "select" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        onChange={handleChange(idx)}
                                        id="inputOnChangeSource"
                                        name="inputOnChangeSource"
                                        defaultValue={
                                          rows &&
                                          rows[idx]?.inputAddOn
                                            ?.inputOnChangeSource
                                        }
                                      >
                                        <option>Select Data Source</option>

                                        {dropdown &&
                                          dropdown.map((d, i) => {
                                            return (
                                              <option
                                                value={d.id}
                                                selected={
                                                  parseInt(
                                                    rows &&
                                                      rows[idx]?.inputAddOn
                                                        ?.inputOnChangeSource
                                                  ) === d.id
                                                }
                                              >
                                                {d.dropdown_name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                    </span>
                                  )}

                                  {rows[idx].inputType === "number" && (
                                    <div className="d-flex justify-content-between">
                                      <div class="form-group">
                                        <label>Min Number:</label>
                                        <input
                                          type="number"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMin"
                                          name="inputRangeMin"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                          min={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Max Number:</label>
                                        <input
                                          type="number"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMax"
                                          name="inputRangeMax"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                          max={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                        />
                                        {parseFloat(
                                          rows[idx].inputAddOn.inputRangeMin
                                        ) >
                                          parseFloat(
                                            rows[idx].inputAddOn.inputRangeMax
                                          ) && (
                                          <div className="text-danger">
                                            {" "}
                                            Max number should be greater than
                                            Min number
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {rows[idx].inputType === "decimal" && (
                                    <div className="d-flex justify-content-between">
                                      <div class="form-group">
                                        <label>Min Number:</label>
                                        <input
                                          type="number"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMin"
                                          name="inputRangeMin"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                          min={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Max Number:</label>
                                        <input
                                          type="number"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMax"
                                          name="inputRangeMax"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                          max={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                        />
                                        {parseFloat(
                                          rows[idx].inputAddOn.inputRangeMin
                                        ) >
                                          parseFloat(
                                            rows[idx].inputAddOn.inputRangeMax
                                          ) && (
                                          <div className="text-danger">
                                            Max number should be greater than
                                            Min number
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {rows[idx].inputType === "date" && (
                                    <span>
                                      <input
                                        type="text"
                                        onChange={handleChange(idx)}
                                        id="inputDateRange"
                                        name="inputDateRange"
                                        placeholder="Eg. 2022-01-01|2022-02-01"
                                        className="form-control form-control-sm"
                                        min={
                                          rows[idx].inputAddOn.inputDateRange
                                        }
                                        max={
                                          rows[idx].inputAddOn.inputDateRange
                                        }
                                      />
                                      <small style={{ color: "red" }}>
                                        <b>Min|Max (YYYY-MM-DD)</b>
                                      </small>
                                    </span>
                                  )}

                                  {rows[idx].inputType === "time" && (
                                    <div
                                      className="d-flex justify-content-between"
                                      key={rows[idx].key}
                                    >
                                      <div class="form-group">
                                        <label>Min Time:</label>
                                        <input
                                          type="time"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMin"
                                          name="inputRangeMin"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                          min={
                                            rows[idx].inputAddOn.inputRangeMin
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Max Time:</label>
                                        <input
                                          type="time"
                                          onChange={handleChange(idx)}
                                          id="inputRangeMax"
                                          name="inputRangeMax"
                                          className="form-control form-control-sm"
                                          defaultValue={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                          max={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
{console.log("rows",rows)}
                                  {rows[idx].inputType === "datetime-local" && (
                                    <div className="d-flex justify-content-between">
                                      <div class="form-group">
                                        <label>Date-time:</label>
                                        <input
                                          type="datetime-local"
                                          onChange={handleChange(idx)}
                                          defaultValue={
                                            rows[idx].inputAddOn.inputDateTime
                                          }
                                          id="datetime-local"
                                          name="datetime-local"
                                          className="form-control form-control-sm"
                                          min={
                                            rows[idx].inputAddOn.inputDateTime
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
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

                                  {idx != 0 && (
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

                    {!formShow && rows && rows.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-info pull-left text-white"
                        onClick={handldeFormShow}
                      >
                        View Form
                      </button>
                    )}
                    {formShow && rows && (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger pull-left text-white"
                        onClick={handldeFormShow}
                      >
                        Hide Form
                      </button>
                    )}

                    <div className="pull-right">
                      <button type="submit" className="btn btn-sm btn-primary">
                        Update
                      </button>
                      <Link
                        to={`/${_base}/DynamicForm`}
                        className="btn btn-sm btn-danger text-white"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>{" "}
                {/* Card Body */}
              </div>
              {/* Card */}
            </div>



            {formShow && rows && (
              <div className="row">
                {rows.map((data, index) => {
                  if (data.inputType && data.inputName && data.inputLabel) {
                    if (data.inputAddOn.inputRange) {
                      var range = data.inputAddOn.inputRange.split("|");
                    } else if (data.inputAddOn.inputDateRange) {
                      var range = data.inputAddOn.inputDateRange.split("|");
                    }

                    return (
                      <div key={index} className={`${data.inputWidth} mt-2`}>
                        <label>
                          <b>
                            {data.inputLabel} :
                            {data.inputMandatory === true ? (
                              <Astrick color="red" size="13px" />
                            ) : (
                              ""
                            )}
                          </b>
                        </label>

                        {data.inputType === "text" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            className="form-control form-control-sm"
                          />
                        )}

                        {data.inputType === "textarea" && (
                          <textarea
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            className="form-control form-control-sm"
                          >
                            {data.inputDefaultValue}
                          </textarea>
                        )}

                        {data.inputType === "date" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            min={data.inputAddOn.inputDateRange ? range[0] : ""}
                            max={data.inputAddOn.inputDateRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}


                        {data.inputType === "datetime-local" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            min={data.inputAddOn.inputDateRange ? range[0] : ""}
                            max={data.inputAddOn.inputDateRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}

                        {data.inputType === "time" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            min={data.inputAddOn.inputDateRange ? range[0] : ""}
                            max={data.inputAddOn.inputDateRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}
                        {data.inputType === "number" && (
                          <input
                            type="text"
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputAddOn.inputRange}
                            min={data.inputAddOn.inputRange ? range[0] : ""}
                            max={data.inputAddOn.inputRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}

                        {data.inputType === "select" && (
                          <select
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            className="form-control form-control-sm"
                          >
                            <option> {data.inputDefaultValue}</option>
                            {data.inputAddOn.inputRadio &&
                              data.inputAddOn.inputRadio.map((option) => {
                                return (
                                  <option
                                    selected={
                                      parseInt(
                                        data &&
                                          data?.inputAddOn?.inputDataSource
                                      ) === option.value
                                    }
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                );
                              })}
                          </select>
                        )}

                        {data?.inputType === "radio" && (
                          <div className="row mt-3">
                            {data &&
                              data?.inputAddOn?.inputRadio?.map((i, index) => (
                                <div key={index} className="col">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="is_active"
                                      id={`is_active_${index}`}
                                      value="1"
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`is_active_${index}`}
                                    >
                                      {i.label}
                                    </label>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        {data.inputType === "checkbox" && (
                          <div className="row mt-3">
                            {data &&
                              data.inputAddOn.inputRadio.map((i, index) => (
                                <div key={index} className="col">
                                  <div className="form-check">
                                    <input
                                      className="sm-1"
                                      type="checkbox"
                                      style={{
                                        marginRight: "8px",
                                        marginLeft: "10px",
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`is_active_${index}`}
                                    >
                                      {i.label}
                                    </label>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        {data.inputType === "decimal" && (
                          <div className="d-flex justify-content-between">
                            <div class="form-group">
                              <label>Min Number:</label>
                              <input
                                type="number"
                                id="inputRangeMin"
                                name="inputRangeMin"
                                className="form-control form-control-sm"
                                defaultValue={data.inputAddOn.inputRangeMin}
                                min={data.inputAddOn.inputRangeMin}
                              />
                            </div>
                            <div className="form-group">
                              <label>Max Number:</label>
                              <input
                                type="number"
                                id="inputRangeMax"
                                name="inputRangeMax"
                                className="form-control form-control-sm"
                                defaultValue={data.inputAddOn.inputRangeMax}
                                max={data.inputAddOn.inputRangeMax}
                              />
                            </div>
                          </div>
                        )}

                        {data.inputType === "select-master" && (
                          <select
                            id={
                              data.inputName
                                ? data.inputName
                                    .replace(/ /g, "_")
                                    .toLowerCase()
                                : ""
                            }
                            defaultValue={data.inputAddOn.inputDataSource}
                            name={data.inputName}
                            className="form-control form-control-sm"
                          >
                            <option> {data.inputName}</option>
                            {data.inputAddOn.inputDataSourceData &&
                              data.inputAddOn.inputDataSourceData.map(
                                (option) => {
                                  return (
                                    <option
                                      selected={
                                        parseInt(
                                          data &&
                                            data?.inputAddOn
                                              ?.inputDataSourceData
                                        ) === option.value
                                      }
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  );
                                }
                              )}
                          </select>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>{" "}
          {/*ROW*/}
        </div>
        {/*CONTAINER*/}
      </div>
      {/*BODY*/}
    </>
  );
}

export default EditDynamicForm;
