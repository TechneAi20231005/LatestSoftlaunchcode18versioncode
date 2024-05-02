import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";

import DynamicFormService from "../../../services/MastersService/DynamicFormService";
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";

import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";

import * as Validation from "../../../components/Utilities/Validation";

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
import { masterURL } from "../../../settings/constants";
import DynamicComponent from "./DynamicComponent";
import UserService from "../../../services/MastersService/UserService";
import { departmentData } from "../DepartmentMaster/DepartmentMasterAction";
import { getDesignationData } from "../DesignationMaster/DesignationAction";
import { statusMasterSlice } from "../StatusMaster/StatusComponentSlice";
import { getStatusData } from "../StatusMaster/StatusComponentAction";
import QueryTypeService from "../../../services/MastersService/QueryTypeService";

function CreateDynamicForm() {
  const [notify, setNotify] = useState(null);

  const mainJson = {
    inputWidth: "col-sm-6",
    inputType: [],
    inputName: null,
    inputLabel: null,
    inputFormat: null,
    inputDefaultValue: null,
    inputMandatory: null,
    inputMultiple: null,
    inputAddOn: {
      inputRange: null,
      inputRangeMin: null,
      inputDateRange1: null,
      inputDateRange2: null,
      inputRangeMax: null,
      inputDataSource: null,
      inputDataSourceData: null,
      inputDateRange: null,
      inputDateTime: null,
      inputRadio: null,
      inputCheckbox: null,
      inputOnChangeSource: null,
    },
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  console.log("departmentDropdown", departmentDropdown);

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

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 13)
  );
  const dropdown = useSelector(
    (DynamicFormDropDownSlice) =>
      DynamicFormDropDownSlice.dynamicFormDropDown.sortDropDown
  );

  const statusData = useSelector((statusMasterSlice) =>
    statusMasterSlice.statusMaster.filterStatusData
      .filter((d) => d.is_active == 1)
      .map((d) => ({ value: d.id, label: d.status }))
  );

  const [rows, setRows] = useState([mainJson]);
  const [labelNames, setLabelNames] = useState([]);

  const [formShow, setFormShow] = useState(false);

  const [index, setIndex] = useState({ index: 0 });

  const [inputDataSource, setInputDataSource] = useState();
  const roleId = sessionStorage.getItem("role_id");

  const [radioSelect, setRadioSelect] = useState();

  const [userData, setUserData] = useState(null);

  const [selectedValue, setSelectedValue] = useState();
  const [inputLabelValue, setInputLabelValue] = useState();
  const [minDate, setMinDate] = useState();

  const [selectedValueErr, setSelectedValueErr] = useState("");
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [maxErr, setMaxErr] = useState();
  const [selectMasterValue, setSelectMasterValue] = useState();

  const handleChange = (idx, type) => async (e) => {
    if (e.target.name === "inputDateRange1") {
      setMinDate(e.target.value);
    }
    if (e.target.name === "inputLabel") {
      setInputLabelValue(e.target.value);
    }

    if (e.target.name === "inputDataSource") {
      setSelectMasterValue(e.target.value);
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
      } else if (e.target.name == "inputDateRange1") {
        rows[idx].inputAddOn.inputDateRange1 = e.target.value;
      } else if (e.target.name == "inputDateRange2") {
        rows[idx].inputAddOn.inputDateRange2 = e.target.value;
      } else if (e.target.name == "datetime-local") {
        rows[idx].inputAddOn.inputDateTime = e.target.value;
      } else if (e.target.name == "inputFormat") {
        rows[idx].inputFormat = e.target.value;
      }
      console.log("ro22", rows[idx].inputAddOn);
      if (e.target.name === "inputDataSource" && e.target.value === "user") {
        const tempUserData = [];
        const test1 = e.target.value;
        rows[idx].inputAddOn.inputDataSource = test1;

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
        e.target.value === "department"
      ) {
        rows[idx].inputAddOn.inputDataSourceData = departmentDropdown;
        setInputDataSource(departmentDropdown);
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
                rows[idx].inputAddOn.inputOnChangeSource = dropDownValue;
              }
            }
          });
      }
    }
  };

  const handleUserSelect = (selectedOptions, index) => {
    const selectedUserIds = selectedOptions.value;

    const updatedAssign = [...rows];

    updatedAssign[index] = {
      ...updatedAssign[index],
      inputType: selectedUserIds,
    };

    setRows(updatedAssign);
  };

  const handleAddRow = async () => {
    setNotify(null);
    let flag = 1;
    let last = rows.length - 1;

    if (!rows[last].inputType || !rows[last].inputLabel) {
      flag = 0;
      setNotify(null);
    }

    const item = {
      inputWidth: "col-sm-6",
      inputType: null,
      inputName: null,
      inputLabel: null,
      inputFormat: null,
      inputDefaultValue: null,
      inputMandatory: null,
      inputMultiple: null,
      inputAddOn: {
        inputRange: null,
        inputRangeMin: null,
        inputRangeMax: null,
        inputDataSource: null,
        inputDataSourceData: null,
        inputDateRange: null,
        inputDateTime: null,
        inputRadio: null,
        inputCheckbox: null,
        inputOnChangeSource: null,
      },
    };

    if (flag === 1) {
      setRows([...rows, item]);
      setRows([...rows, mainJson]);
    } else {
      setNotify({ type: "danger", message: "Fill Complete Details !!!" });
    }
  };

  const [labelErr, setLabelErr] = useState();

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

  const handleRemoveSpecificRow = (index) => async () => {
    const updatedAssign = [...rows];
    updatedAssign.splice(index, 1);

    setRows(updatedAssign);
  };

  const handldeFormShow = () => {
    if (!inputLabelValue) {
      setLabelErr("Label Is Required");
    } else {
      setLabelErr("");
    }

    setFormShow(formShow == true ? false : true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      template_name: e.target.template_name.value,
      data: JSON.stringify(rows),
    };

    await new DynamicFormService().postDynamicForm(data).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          dispatch(dynamicFormData());

          setNotify({ type: "success", message: res.data.message });
          setTimeout(() => {
            navigate(`/${_base}/DynamicForm`, {
              state: { alert: { type: "success", message: res.data.message } },
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
    //     if (res.status == 200) {
    //         if (res.data.status == 1) {
    //             // const temp=[];
    //             // res.data.data.forEach(d=>{
    //             //     temp.push({'label':d.dropdown_name,'value':d.id});
    //             // })
    //             // setDropdown(temp);
    //             setDropdown(res.data.data.map((d) => ({ label: d.dropdown_name, value: d.id })))
    //         }
    //     }
    // })
    // await new ManageMenuService().getRole(roleId).then((res) => {
    //     if (res.status === 200) {
    //     //   setShowLoaderModal(false);
    //       if (res.data.status == 1) {
    //         const getRoleId = sessionStorage.getItem("role_id");
    //         setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //       }
    //     }
    //   });
  };

  const [dateValue, setDateValue] = useState(new Date());
  const onChangeDate = (value) => {
    setDateValue(new Date(value));
  };

  useEffect(() => {
    loadData();

    dispatch(getAllRoles());
    dispatch(departmentData());

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
  }, [rows]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
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
                  <h2 className="mb-0 fw-bold ">Dynamic Form</h2>
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
                            Form Name :<Astrick color="red" size="13px" />
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
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                        />
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
                                    key={idx}
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
                                    defaultValue={item.inputWidth}
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
                                      defaultValue={item.inputDefaultValue}
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
                                      defaultValue={item.inputDefaultValue}
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
                                    defaultValue={item.inputMandatory}
                                    onChange={handleChange(idx)}
                                    className="center"
                                  />
                                </td>

                                <td>
                                  {(rows[idx].inputType === "select-master" ||
                                    rows[idx].inputType == "select" ||
                                    rows[idx].inputType == "checkbox") && (
                                    <input
                                      type="checkbox"
                                      name="inputMultiple"
                                      defaultValue={item.inputMultiple}
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
                                      <option value="dd-MM-y">
                                        mm-dd-yyyy
                                      </option>
                                    </select>
                                  )}
                                </td>

                                <td>
                                  {rows[idx].inputType == "select-master" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        onChange={handleChange(idx)}
                                        id="inputDataSource"
                                        name="inputDataSource"
                                      >
                                        {dataSourceOptions.map((option) => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                    </span>
                                  )}

                                  {rows[idx].inputType == "radio" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        onChange={handleChange(idx)}
                                        id="inputOnChangeSource"
                                        name="inputOnChangeSource"
                                        // defaultValue={selectedValue}
                                      >
                                        {console.log("selected", selectedValue)}
                                        {console.log("selected", selectedValue)}

                                        <option>Select Data Source</option>

                                        {dropdown &&
                                          dropdown.map((d, i) => {
                                            return (
                                              <option value={d.id}>
                                                {d.dropdown_name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                      {!selectedValue && (
                                        <small style={{ color: "red" }}>
                                          <b>Select Data Source</b>
                                        </small>
                                      )}
                                    </span>
                                  )}

                                  {rows[idx].inputType == "checkbox" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        // onChange={props.onGetChange}
                                        onChange={handleChange(idx)}
                                        id="inputOnChangeSource"
                                        name="inputOnChangeSource"
                                      >
                                        <option>Select Data Source</option>

                                        {dropdown &&
                                          dropdown.map((d, i) => {
                                            return (
                                              <option value={d.id}>
                                                {d.dropdown_name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                      {!selectedValue && (
                                        <small style={{ color: "red" }}>
                                          <b>Select Data Source</b>
                                        </small>
                                      )}
                                    </span>
                                  )}

                                  {rows[idx].inputType == "select" && (
                                    <span>
                                      <select
                                        className="form-control form-control-sm"
                                        // onChange={props.onGetChange}
                                        onChange={handleChange(idx)}
                                        id="inputOnChangeSource"
                                        name="inputOnChangeSource"
                                      >
                                        <option>Select Data Source</option>

                                        {dropdown &&
                                          dropdown.map((d, i) => {
                                            return (
                                              <option value={d.id}>
                                                {d.dropdown_name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                      {!selectedValue && (
                                        <small style={{ color: "red" }}>
                                          <b>Select Data Source</b>
                                        </small>
                                      )}
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
                                          // defaultValue={props.data.inputAddOn.inputRangeMax}
                                          max={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                        />

                                        <>
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
                                        </>
                                      </div>
                                    </div>
                                  )}

                                  {rows[idx].inputType === "date" && (
                                    // <span
                                    //   style={{
                                    //     display: "flex",
                                    //     alignItems: "center",
                                    //   }}
                                    // >
                                    //   <input
                                    //     type="date"
                                    //     onChange={handleChange(idx)}
                                    //     id="inputDateRange"
                                    //     name="inputDateRange"
                                    //     placeholder="Eg. 2022-01-01|2022-02-01"
                                    //     className="form-control form-control-sm"
                                    //     min={
                                    //       rows[idx].inputAddOn.inputDateRange
                                    //     }
                                    //     max={
                                    //       rows[idx].inputAddOn.inputDateRange
                                    //     }
                                    //   />
                                    //    <small style={{ color: "red" }}>
                                    //     <b>Min date</b>
                                    //   </small>
                                    //   <input
                                    //     type="date"
                                    //     onChange={handleChange(idx)}
                                    //     id="inputDateRange"
                                    //     name="inputDateRange"
                                    //     placeholder="Eg. 2022-01-01|2022-02-01"
                                    //     className="form-control form-control-sm"
                                    //     min={
                                    //       rows[idx].inputAddOn.inputDateRange
                                    //     }
                                    //     max={
                                    //       rows[idx].inputAddOn.inputDateRange
                                    //     }
                                    //   />

                                    //   <small style={{ color: "red" }}>
                                    //     <b>max date</b>
                                    //   </small>
                                    // </span>
                                    <span
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <input
                                        type="date"
                                        onChange={handleChange(idx)}
                                        id="inputDateRange1"
                                        name="inputDateRange1"
                                        className="form-control form-control-sm"
                                      />
                                      <small style={{ color: "red" }}>
                                        <b>Min date</b>
                                      </small>
                                      <input
                                        type="date"
                                        onChange={handleChange(idx)}
                                        id="inputDateRange2"
                                        name="inputDateRange2"
                                        className="form-control form-control-sm"
                                        min={minDate}
                                        max={
                                          rows[idx].inputAddOn.inputDateRange
                                        }
                                      />
                                      <small style={{ color: "red" }}>
                                        <b>Max date</b>
                                      </small>
                                    </span>
                                  )}
                                  {console.log("minDate", minDate)}
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
                                          max={
                                            rows[idx].inputAddOn.inputRangeMax
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {rows[idx].inputType === "datetime-local" && (
                                    <div className="d-flex justify-content-between">
                                      <div class="form-group">
                                        <label>Date-time:</label>
                                        <input
                                          type="datetime-local"
                                          onChange={handleChange(idx)}
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

                    <div className="float-end">
                      <button type="submit" className="btn btn-sm btn-primary">
                        Submit
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
                  {
                  }
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
                            min={data.inputAddOn.inputDateRange1}
                            max={data.inputAddOn.inputDateRange2}
                            className="form-control form-control-sm"
                          />
                        )}
                        {console.log("dddd", data)}
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
                            // defaultValue={data.inputAddOn.inputRange}
                            defaultValue={data.inputDefaultValue}
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
                            // defaultValue={data.inputDefaultValue}
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
                                // onChange={handleChange(idx)}

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
                                // onChange={handleChange(idx)}

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

export default CreateDynamicForm;
