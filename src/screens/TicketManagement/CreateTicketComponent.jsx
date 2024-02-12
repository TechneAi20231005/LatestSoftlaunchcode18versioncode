import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Modal } from "react-bootstrap";
import Alert from "../../components/Common/Alert";
import { _base, userSessionData } from "../../settings/constants";
import ErrorLogService from "../../services/ErrorLogService";
import DynamicFormService from "../../services/MastersService/DynamicFormService";
import MyTicketService from "../../services/TicketService/MyTicketService";
import { _attachmentUrl } from "../../settings/constants";
import ReportService from "../../services/ReportService/ReportService";
import PageHeader from "../../components/Common/PageHeader";
import UserService from "../../services/MastersService/UserService";
import DatePicker from "react-date-picker";
import Select from "react-select";
import { Astrick } from "../../components/Utilities/Style";
import * as Validation from "../../components/Utilities/Validation";
import DynamicFormDropdownMasterService from "../../services/MastersService/DynamicFormDropdownMasterService";
import { getCurrentDate } from "../../components/Utilities/Functions";
import { userSessionData as user } from "../../settings/constants";
import DepartmentService from "../../services/MastersService/DepartmentService";
import QueryTypeService from "../../services/MastersService/QueryTypeService";
import CustomerMappingService from "../../services/SettingService/CustomerMappingService";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";

import RenderDynamicForm from "./TaskManagement/RenderDynamicForm";
import DepartmentMappingService from "../../services/MastersService/DepartmentMappingService";
import TaskTicketTypeService from "../../services/MastersService/TaskTicketTypeService";
import { UseDispatch,useDispatch,useSelector } from "react-redux"
import TicketSlices from "./Slices/TicketSlices";
import { getAllQueryGroupData, getCustomerMappingsetting, getDepartmentMappingByEmployeeIdData, getParentData, postCreateticket, queryTypesData } from "./Slices/TicketAction";
import { getRoles } from "../Dashboard/DashboardAction";
export default function CreateTicketComponent() {
  const history = useNavigate();
  // const [notify, setNotify] = useState(null);
  const departmentRef = useRef();
  const current = new Date();

const dispatch= useDispatch()

const customerMapping = useSelector(TicketSlices=>TicketSlices.ticket.customerMappingData)
const queryGroupData = useSelector(TicketSlices=>TicketSlices.ticket.queryGroupData)
const queryGroupDropdown = useSelector(TicketSlices=>TicketSlices.ticket.queryGroupDropDownData)
const notify = useSelector(TicketSlices=>TicketSlices.ticket.notify)

const checkRole = useSelector((DashboardSlice) =>DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 14));

// console.log("cus",customerMappings)








const navigate = useNavigate();


  const todayDate = `${current.getFullYear()}-${current.getMonth() + 1 < 10
    ? "0" + current.getMonth() + 1
    : current.getMonth() + 1
    }-${current.getDate()}`;

  const ticketData = {
    department_id: null,
    customer_mapping_id: null,
    ticket_uploading: "REGULAR",
    confirmation_required: "0",
    query_type_id: null,
    ticket_date: todayDate,
    expected_solve_date: null,
    cuid: null,
    ticket_type: null,
    priority: null,
    description: null,
    status: null,
    assign_to_department_id: null,
    assign_to_user_id: null,
    project_id: null,
    module_id: null,
    submodule_id: null,
  };

  const [data, setData] = useState(ticketData);

  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [defaults, setDefaults] = useState(null);

  const [department, setDepartment] = useState(null);
  const [rows, setRows] = useState();

  const [dynamicTicketData, setDynamicTicketData] = useState(null);

  const [queryType, setQueryType] = useState(null);
  // const [customerMapping, setCustomerMapping] = useState(null);
  const [selectedCustomerMapping, setSelectedCustomerMapping] = useState(null);

  const [isFileGenerated, setIsFileGenerated] = useState(null);
  const [alldepartmentData, setAllDepartmentData] = useState();
  const [getAllType, setGetAllType] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [inputDataSourceData, setInputDataSourceData] = useState();
  const [dateValue, setDateValue] = useState(new Date());
  const [expectedSolveDate, setExpectedSolveDate] = useState(null);
  // const [checkRole, setCheckRole] = useState(null);
  const [parent, setParent] = useState();
  const [parentName, setParentName] = useState();
  // const [queryGroupData, setQueryGroupData] = useState(null);
  const [queryTypeData, setQueryTypeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [userDepartments, setUserDepartments] = useState();
  const [user, setUser] = useState("");

  // const [queryGroupDropdown, setQueryGroupDropdown] = useState(null);
  const [queryGroupTypeData, setQueryGroupTypeData] = useState();

  const roleId = sessionStorage.getItem("role_id");
  const ticketTypeRefs = useRef();

  const handleForm = async (e) => {
    e.preventDefault();
    if (isSubmitted) {
      return
    }
    setIsSubmitted(true);

    const formData = new FormData(e.target);
    var flag = 1;
    // var a = JSON.stringify(Object.fromEntries(formData));

    // formData.append("dynamicForm", JSON.stringify(rows))
    var selectCountry = formData.getAll("customer_id");
    var selectQueryGroup = formData.getAll("query_group_id");
    var selectgetAll = formData.get("ticket_type_id");

    if (selectCountry == "") {
      flag = 0;
      //setNotify(null);
      //   alert('Please Select Customer')
      //setNotify({ type: 'danger', message: 'Please Select Country' })
    }
    if (selectQueryGroup == "") {
      alert("Please select query group");
      e.preventDefault();
      flag = 0;
    } else {
      flag = 1;
    }

    // setNotify(null);
    if (flag == 1) {
      dispatch(postCreateticket(formData)).then((res)=>{
        if(res.payload.data.status===1 && res.payload.status === 200){
          navigate(`/${_base}/Ticket`)
          setIsSubmitted(false);
        } else {
          // setNotify({ type: "danger", message: res.message });
          setIsSubmitted(false);

          new ErrorLogService().sendErrorLog(
            "Ticket",
            "Create_Ticket",
            "INSERT",
            res.message
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          const { response } = error;
          const { request, ...errorObject } = response;
          setIsSubmitted(false)
          // setNotify({ type: "danger", message: "Request Error !!!" });
          new ErrorLogService().sendErrorLog(
            "Ticket",
            "Create_Ticket",
            "INSERT",
            errorObject.data.message
          );
        } else {
          console.log(error);
        }
      });
  


    


  //     await new MyTicketService()
  //       .postTicket(formData)
  //       .then((res) => {
  //         if (res.status === 200) {
  //           if (res.data.status === 1) {
  //             history({
  //               pathname: `/${_base}/Ticket`,
  //             }
  //               ,
  //               {
  //                 state: {
  //                   type: "success", message: res.data.message,
  //                 }
  //               }
  //             );
  //             // window.location.reload(false)
  //             setIsSubmitted(false);
  //           } else {
  //             if (formData.getAll("ticket_uploading") == "REGULAR") {
  //               setNotify({ type: "danger", message: res.data.message });
  //               setIsSubmitted(false);
  //             } else {
  //               var URL = `${_attachmentUrl}` + res.data.data;
  //               window.open(URL, "_blank").focus();
  //               setIsSubmitted(false);

  //               setNotify({ type: "danger", message: res.message });

  //             }
  //           }
  //         } else {
  //           setNotify({ type: "danger", message: res.message });
  //           setIsSubmitted(false);

  //           new ErrorLogService().sendErrorLog(
  //             "Ticket",
  //             "Create_Ticket",
  //             "INSERT",
  //             res.message
  //           );
  //         }
  //       })
  //       .catch((error) => {
  //         if (error.response) {
  //           const { response } = error;
  //           const { request, ...errorObject } = response;
  //           setIsSubmitted(false)
  //           setNotify({ type: "danger", message: "Request Error !!!" });
  //           new ErrorLogService().sendErrorLog(
  //             "Ticket",
  //             "Create_Ticket",
  //             "INSERT",
  //             errorObject.data.message
  //           );
  //         } else {
  //           console.log(error);
  //         }
  //       });
    }
  };

  const queryTypeRef = useRef();
console.log("customer",customerMapping)
  const handleGetQueryTypeForm = async (e) => {
    if (e && e.value) {
      setRows(null);
      var data = customerMapping?.filter((val) => val.query_type_id == e.value);
      console.log("new",data)
      const cmId = data?.length > 0 ? data[0].id : null;
      if (cmId) {
        await new MyTicketService().getExpectedSolveDate(cmId).then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              setExpectedSolveDate(res.data.data);
            }
          }
        });
      } else {
        console.error("cmId is null. Cannot make API call.");
      }

      setRows(null);
      if (data && data.length == 0) {
        alert(
          "Dynamic Form is not mapped against this Query Type, Please Map Form first"
        );
        setQueryGroupTypeData(null);
      } else {
        var dynamicForm = data[0]?.dynamic_form;
        const returnedData = [];
        const filteredArray = dynamicForm?.filter(
          (formInstance) =>
            formInstance.inputType === "select" &&
            formInstance.inputAddOn.inputDataSource
        );

        await Promise.all(
          filteredArray.map((d) =>
            new DynamicFormDropdownMasterService().getDropdownById(
              d.inputAddOn.inputDataSource
            )
          )
        )
          .then((result) => {
            var tempResponse = [];

            result.forEach((res, i) => {
              if (res.status == 200) {
                if (res.data.status == 1) {
                  var temp = [];
                  temp = res.data.data.dropdown.map((d) => ({
                    value: d.id + "|" + d.label,
                    label: d.label,
                  }));
                  tempResponse.push(temp);
                }
              }
            });

            //Remove from array
            dynamicForm.forEach((d, i) => {
              if (d.inputType === "select") {
                if (tempResponse.length > 0) {
                  //REVERSE
                  // dynamicForm[i].inputAddOn.inputDataSourceData=tempResponse[tempResponse.length-1];
                  // tempResponse.splice(-1);

                  dynamicForm[i].inputAddOn.inputDataSourceData =
                    tempResponse[0];
                  tempResponse.splice(i, 1);
                }
              }
            });
          })
          .catch((err) => { });
        setRows(dynamicForm);
      }
    }
  };

  const [selectedDropdown, setSelectedDropdown] = useState([]);

  const dynamicDependancyHandle = async (key, e, dependanceDropdownName) => {
    setSelectedDropdown({ ...selectedDropdown, [key]: e });
    var currentData = rows.filter(
      (d) => d.inputName === dependanceDropdownName
    );
    if (dependanceDropdownName) {
      var formdata = new FormData();
      formdata.append("key", key);
      formdata.append("value", e.value);
      formdata.append("dropdownName", dependanceDropdownName);
      formdata.append("dropdownId", currentData[0].inputAddOn.inputDataSource);

      var dropdown = [];
      await new DynamicFormDropdownMasterService()
        .getDropdownByName(formdata)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.status == 1) {
              var temp = [];
              dropdown = res.data.data.dropdown.map((d) => ({
                value: d.id + "|" + d.label,
                label: d.label,
              }));
            }
          }
        });
      var rowIndex = rows.findIndex(
        (d) =>
          d.inputName === dependanceDropdownName &&
          d.inputAddOn.inputDataSource ==
          currentData[0].inputAddOn.inputDataSource
      );
      setRows((prev) => {
        const newPrev = [...prev];
        newPrev[rowIndex].inputAddOn.inputDataSourceData = dropdown;
        return newPrev;
      });
    }
  };

  const dynamicChangeHandle = (e) => {
    const { name, value } = e.target;
    setSelectedDropdown({ ...selectedDropdown, [name]: value });
    setDynamicTicketData((prev) => ({ ...prev, [name]: value }));
  };

  const loadData = async () => {
    dispatch(getAllQueryGroupData())
    const query_type_id = "";
    const queryTypeTemp = [];

    dispatch(getCustomerMappingsetting(query_type_id)).then((res)=>{
      res.payload.data.data.forEach((query) => {
        if (query.query_type_id) {
          if (!queryTypeTemp.includes(query.query_type_id)) {
            queryTypeTemp.push(query.query_type_id);
          }
        }
      });
    })




    // await new CustomerMappingService()
    //   .getCustomerMappingSettings(query_type_id)
    //   .then((res) => {
    //     const queryType = [];
    //     const department = [];
    //     if (res.data.status === 1) {
    //       if (res.data.data) {
    //         //SET ALL CUSTOMER MAPPING DATA IN A STATE
    //         setCustomerMapping(null);
    //         setCustomerMapping(res.data.data);

    //         res.data.data.forEach((query) => {
    //           if (query.query_type_id) {
    //             if (!queryTypeTemp.includes(query.query_type_id)) {
    //               queryTypeTemp.push(query.query_type_id);
    //             }
    //           }
    //         });
    //       }
    //     }
    //   });

    var queryType = [];
  dispatch(queryTypesData()).then((resp) => {
    if (resp.payload.data.status === 1) {
      setUser(queryType);
      setQueryTypeData(resp.payload.data.data.filter((d) => d.is_active == 1));
      resp.payload.data.data
        .filter((q) => q.is_active == 1)
        .filter((q) => queryTypeTemp.includes(q.id))
        .forEach((q) => {
          queryType.push({ id: q.id, query_type_name: q.query_type_name });
        });
      setQueryType(queryType);
    }
  });
    // await new QueryTypeService().getQueryType().then((resp) => {
    //   if (resp.data.status === 1) {
    //     setUser(queryType);
    //     setQueryTypeData(resp.data.data.filter((d) => d.is_active == 1));
    //     resp.data.data
    //       .filter((q) => q.is_active == 1)
    //       .filter((q) => queryTypeTemp.includes(q.id))
    //       .forEach((q) => {
    //         queryType.push({ id: q.id, query_type_name: q.query_type_name });
    //       });
    //     setQueryType(queryType);
    //   }
    // });


    // await new QueryTypeService().getAllQueryGroup().then((res) => {
    //   if (res.data.status == 1) {
    //     setQueryGroupData(res.data.data?.filter((d) => d.is_active == 1));
    //     setQueryGroupDropdown(
    //       res?.data?.data
    //         .filter((d) => d.is_active == 1)
    //         .map((d) => ({ value: d.id, label: d.group_name }))
    //     );
    //   }
    // });
   

    dispatch(getParentData()).then((res) => {
      if (res.payload.status === 200) {
        if (res.payload.data.status === 1) {
          if (res.payload.status === 200) {
            const mappedData = res.payload.data.data.map((d) => ({
              value: d.id,
              label: d.type_name,
            }));

            setParent(mappedData);
          } else {
            console.error("error", res.status);
          }
        }
      }})


    // await new TaskTicketTypeService().getParent().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status === 1) {
    //       if (res.status === 200) {
    //         const mappedData = res.data.data.map((d) => ({
    //           value: d.id,
    //           label: d.type_name,
    //         }));

    //         setParent(mappedData);
    //       } else {
    //         console.error("error", res.status);
    //       }
    //     }
    //   }
    // });

    // await new DepartmentService().getDepartment().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const temp = res.data.data;
    //       setAllDepartmentData(
    //         temp
    //           .filter((d) => d.id)
    //           .map((d) => ({ value: d.id, label: d.department }))
    //       );
    //     }
    //   }
    // });

    dispatch(getDepartmentMappingByEmployeeIdData(userSessionData.userId)).then((resp) => {
      if (resp.payload.data.status === 1) {
        setUserDepartments(
          resp.payload.data.data.map((d) => ({
            value: d.department_id,
            label: d.department,
          }))
        );
        if (resp.payload.data.data.length > 0) {
          setData((prev) => {
            const newPrev = { ...prev };
            newPrev["from_department_id"] = resp.payload.data.data[0].department_id;
            return newPrev;
          });
        }
      }
    });


    // new DepartmentMappingService()
    //   .getDepartmentMappingByEmployeeId(userSessionData.userId)
    //   .then((resp) => {
    //     if (resp.data.status === 1) {
    //       setUserDepartments(
    //         resp.data.data.map((d) => ({
    //           value: d.department_id,
    //           label: d.department,
    //         }))
    //       );
    //       if (resp.data.data.length > 0) {
    //         setData((prev) => {
    //           const newPrev = { ...prev };
    //           newPrev["from_department_id"] = resp.data.data[0].department_id;
    //           return newPrev;
    //         });
    //       }
    //     }
    //   });

  //   await new ManageMenuService().getRole(roleId).then((res) => {
  //     if (res.status === 200) {
  //       if (res.data.status == 1) {
  //         const getRoleId = sessionStorage.getItem("role_id");
  //         setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
  //       }
  //     }
  //   });
  };

  const handleDownloadFormat = async (e) => {
    // setNotify(null);s
    if (data.from_department_id && data.query_type_id) {
      const formData = new FormData();
      formData.append("customer_mapping_id", data.customer_mapping_id);
      formData.append("expected_solve_date", data.expected_solve_date);
      formData.append("ticket_type_id", data.ticket_type);
      if (departmentRef && departmentRef?.current?.props?.value) {
        formData.append(
          "department_id",
          departmentRef.current.props.value.value
        );
      }
      await new MyTicketService().getBulkFormat(formData).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            URL = `${_attachmentUrl}` + res.data.data;
            window.open(URL, "_blank").focus();
            setIsFileGenerated(res.data.data);
          } else {
            // setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          // setNotify({ type: "danger", message: res.message });
        }
      });
    } else {
      // setNotify({
      //   type: "danger",
      //   message: "Select Department & Query Type !!!",
      // });
    }
  };

  const handleQueryGroupDropDown = async (e) => {
    if (queryTypeRef.current) {
      queryTypeRef.current.clearValue();
    }
    await new QueryTypeService().getQueryTypeMapped(e.value).then((res) => {
      if (res.data.status == 1) {
        setQueryGroupTypeData(
          res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ value: d.id, label: d.query_type_name }))
        );
      }
    });
  };

  const handleParentchange = async (e) => {
    if (ticketTypeRefs.current) {
      ticketTypeRefs.current.clearValue();
    }
    await new TaskTicketTypeService().getAllType().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const temp = res.data.data;
          setGetAllType(
            temp
              .filter((d) => d.type === "TICKET" && d.is_active == 1)
              .map((d) => ({ value: d.id, label: d.type_name }))
          );
        }
      }
    });
  };

  const handleAutoChanges = async (e, type, nameField) => {
    if (data) {
      var value = type == "Select2" ? e && e.value : e.target.value;
      if (nameField == "query_type_id") {
        const x = customerMapping?.filter((d) => d.query_type_id == value);
        if (x?.length > 0) {
          setData((prev) => {
            const newPrev = { ...prev };
            newPrev["customer_mapping_id"] = x[0].id;
            newPrev["confirmation_required"] = x[0].confirmation_required;
            newPrev["priority"] = x[0].priority;
            return newPrev;
          });
        }
      }
    }
    setData((prev) => {
      const newPrev = { ...prev };
      newPrev[nameField] = value;
      return newPrev;
    });
  };

  useEffect(() => {
    loadData();
    if(!checkRole.length){
      getRoles()
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
      <PageHeader headerTitle="Create Ticket" />

      {notify && <Alert alertData={notify} />}
      <form onSubmit={handleForm} method="post" encType="multipart/form-data">
        <input
          type="hidden"
          className="form-control form-control-sm"
          id="customer_mapping_id"
          name="customer_mapping_id"
          value={data && data.customer_mapping_id}
        />

        <div className="card mt-2">
          <div className="card-body">
            <div className="row" style={{ fontSize: "18px" }}>
              <div className="col-sm-2">
                <label className="col-form-label">
                  <b>
                    Create Ticket <Astrick color="red" /> :{" "}
                  </b>
                </label>
              </div>
              <div className="col-sm-8 mt-2">
                <label class="fancy-checkbox parsley-error" />
                <input
                  type="radio"
                  required=""
                  key={Math.random()}
                  id="ticket_uploading_regular"
                  name="ticket_uploading"
                  value="REGULAR"
                  checked={data.ticket_uploading === "REGULAR"}
                  onChange={(e) =>
                    handleAutoChanges(e, "Radio", "ticket_uploading")
                  }
                />
                <span class="px-2">Manual</span>
                <label class="fancy-checkbox parsley-error" />
                <input
                  type="radio"
                  required=""
                  key={Math.random()}
                  id="ticket_uploading_bulk_uploading"
                  name="ticket_uploading"
                  value="BULK_UPLOADING"
                  checked={data.ticket_uploading === "BULK_UPLOADING"}
                  onChange={(e) =>
                    handleAutoChanges(e, "Radio", "ticket_uploading")
                  }
                />
                <span class="px-2">Bulk Upload</span>
              </div>
            </div>
          </div>
        </div>

        {data && data.ticket_uploading && (
          <div className="card mt-2">
            <div className="card-body">
              <div className="form-group row ">
                <div className="col-sm-3">
                  <label className="col-form-label">
                    <b>
                      Your Department
                      <Astrick color="red" /> :{" "}
                    </b>
                  </label>
                  {userDepartments && (
                    <Select
                      defaultValue={
                        userDepartments.length == 1 && userDepartments[0]
                      }
                      options={userDepartments}
                      name="from_department_id"
                      id="from_department_id"
                      ref={departmentRef}
                      required={true}
                      onChange={(e) =>
                        handleAutoChanges(e, "Select2", "from_department_id")
                      }
                    />
                  )}
                </div>

                <div className="col-sm-3">
                  <label className="col-form-label">
                    <b>
                      Query Group
                      <Astrick color="red" /> :
                    </b>
                  </label>

                  {queryGroupDropdown && (
                    <Select
                      id="query_group_id"
                      name="query_group_id"
                      required
                      options={queryGroupDropdown}
                      onChange={(e) => handleQueryGroupDropDown(e)}
                    />
                  )}
                </div>

                {queryGroupTypeData && (
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>
                        Query Type
                        <Astrick color="red" /> :
                      </b>
                    </label>
                    <Select
                      id="query_type_id"
                      name="query_type_id"
                      ref={queryTypeRef}
                      required
                      options={queryGroupTypeData}
                      onChange={(e) => {
                        handleAutoChanges(e, "Select2", "query_type_id");
                        handleGetQueryTypeForm(e);
                      }}
                    />
                  </div>
                )}

                <div className="col-sm-3">
                  <label className="col-form-label">
                    <b>
                      Parent Ticket Type
                      {/* <Astrick color="red" /> : */}
                    </b>
                  </label>

                  {parent && (
                    <Select
                      id="parent_id"
                      name="parent_id"
                      required
                      onChange={(e) => handleParentchange(e)}
                      options={parent}
                    />
                  )}
                </div>

                {getAllType && (
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>
                        Ticket Type
                        {/* <Astrick color="red" /> : */}
                      </b>
                    </label>

                    {getAllType && (
                      <Select
                        id="ticket_type_id"
                        name="ticket_type_id"
                        onChange={(e) => {
                          handleAutoChanges(e, "Select2", "ticket_type");
                        }}
                        ref={ticketTypeRefs}
                        options={getAllType}
                      />
                    )}
                  </div>
                )}

                {data.ticket_uploading === "BULK_UPLOADING" && (
                  <>
                    <div className="col-sm-3">
                      <label className="col-form-label">
                        <b>
                          Expected Solve Date :
                          <Astrick color="red" size="13px" />
                        </b>
                      </label>

                      <input
                        type="date"
                        className="form-control form-control-sm"
                        name="expected_solve_date"
                        id="expected_solve_date"
                        onChange={(e) => {
                          handleAutoChanges(e, "date", "expected_solve_date");
                        }}
                        required
                        min={expectedSolveDate ? expectedSolveDate : ""}
                      />
                    </div>
                    <div className="col-sm-3">
                      <button
                        type="button"
                        className="btn btn-danger text-white"
                        style={{ marginTop: "30px" }}
                        onClick={(e) => {
                          handleDownloadFormat(e);
                        }}
                      >
                        Generate Bulk Format
                      </button>
                    </div>
                  </>
                )}
              </div>

              {data.ticket_uploading == "REGULAR" && (
                <div className="form-group row mt-3">
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>Confirmation Required :</b>
                    </label>
                    <div class="form-group mt-2">
                      <label class="fancy-checkbox parsley-error" />
                      <input
                        type="radio"
                        required=""
                        key={Math.random()}
                        id="confirmation_required_yes"
                        name="confirmation_required"
                        value="1"
                        checked={
                          data.confirmation_required == "1" ||
                          data.confirmation_required == 1
                        }
                        onChange={(e) =>
                          handleAutoChanges(e, "Radio", "confirmation_required")
                        }
                      />
                      <span class="px-2">YES</span>

                      <label class="fancy-checkbox parsley-error" />
                      <input
                        type="radio"
                        required=""
                        key={Math.random()}
                        id="confirmation_required_no"
                        name="confirmation_required"
                        // defaultValue="0"
                        // defaultChecked="true"
                        value="0"
                        checked={
                          data.confirmation_required == "0" ||
                          data.confirmation_required == 0
                        }
                        onChange={(e) =>
                          handleAutoChanges(e, "Radio", "confirmation_required")
                        }
                      />
                      <span class="px-2">NO</span>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>Ref Id :</b>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="cuid"
                      name="cuid"
                      onInput={(e) => handleAutoChanges(e, "Text", "cuid")}
                    />
                  </div>
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>
                        Priority : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <select
                      className="form-control form-control-sm"
                      id="priority"
                      name="priority"
                      required={true}
                      value={data.priority}
                      onChange={(e) =>
                        handleAutoChanges(e, "Select", "priority")
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                  </div>

                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>
                        Expected Solve Date :<Astrick color="red" size="13px" />
                      </b>
                    </label>

                    <input
                      type="date"
                      className="form-control form-control-sm"
                      name="expected_solve_date"
                      id="expected_solve_date"
                      required
                      min={expectedSolveDate ? expectedSolveDate : ""}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* {rows && JSON.stringify(rows)} */}

        {/* {selectedDropdown && JSON.stringify(selectedDropdown)} */}

        {data.ticket_uploading === "REGULAR" && rows && rows.length > 0 && (
          <div className="card mt-2">
            <div className="card-body">
              <div className="row">
                {rows.map((data, index) => {
                  var range = "";
                  return (
                    <div className={`${data.inputWidth} mt-2`}>
                      <label>
                        <b>
                          {data.inputLabel}{" "}
                          {data.inputMandatory == true ? (
                            <Astrick color="red" size="13px" />
                          ) : (
                            ""
                          )}
                          :
                        </b>
                      </label>
                      {data.inputType === "text" && (
                        <input
                          type={data.inputType}
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, "_").toLowerCase()
                              : ""
                          }
                          name={data.inputName}
                          defaultValue={
                            selectedDropdown
                              ? selectedDropdown[data.inputName]
                              : ""
                          }
                          onChange={dynamicChangeHandle}
                          className="form-control form-control-sm"
                        />
                      )}
                      {data.inputType === "textarea" && (
                        <textarea
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, "_").toLowerCase()
                              : ""
                          }
                          name={data.inputName}
                          className="form-control form-control-sm"
                          defaultValue={
                            selectedDropdown
                              ? selectedDropdown[data.inputName]
                              : ""
                          }
                          onChange={dynamicChangeHandle}
                        >
                          {data.inputDefaultValue}
                        </textarea>
                      )}

                      {data.inputType === "date" && (
                        <div className="form-control">
                          <DatePicker
                            required={
                              data && data.inputMandatory == true ? true : false
                            }
                            // onChange={onChangeDate}
                            value={dateValue}
                            format={data.inputFormat}
                            style={{ width: "100%" }}
                          />
                        </div>
                      )}

                      {data.inputType === "datetime-local" && (
                        <div className="form-control">
                          <input
                            type="datetime-local"
                            name={data.inputName}
                            required={
                              data && data.inputMandatory == true ? true : false
                            }
                            onChange={dynamicChangeHandle}
                            // value={dateValue}
                            // format={data.inputFormat}
                            style={{ width: "100%" }}
                          />
                        </div>
                      )}

                      {data.inputType === "time" && (
                        <input
                          type={data.inputType}
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, "_").toLowerCase()
                              : ""
                          }
                          name={data.inputName}
                          defaultValue={
                            selectedDropdown
                              ? selectedDropdown[data.inputName]
                              : ""
                          }
                          onChange={dynamicChangeHandle}
                          className="form-control form-control-sm"
                        />
                      )}

                      {data.inputType == "radio" && data.inputAddOn.inputRadio
                        ? data.inputAddOn.inputRadio.map((d) => {
                          return (
                            <div>
                              <input
                                id={
                                  data.inputName
                                    ? data.inputName
                                      .replace(/ /g, "_")
                                      .toLowerCase()
                                    : ""
                                }
                                name={data.inputName}
                                className="mx-2"
                                type="radio"
                              />
                              <label for={d.value}>{d.label}</label>
                            </div>
                          );
                        })
                        : ""}

                      {data.inputType == "checkbox" &&
                        data.inputAddOn.inputCheckbox
                        ? data.inputAddOn.inputCheckbox.map((d) => {
                          return (
                            <div>
                              <input
                                id={
                                  data.inputName
                                    ? data.inputName
                                      .replace(/ /g, "_")
                                      .toLowerCase()
                                    : ""
                                }
                                name={data.inputName}
                                className="mx-2"
                                type="checkbox"
                              />
                              <label for={d.value}> {d.label}</label>
                            </div>
                          );
                        })
                        : ""}
                      {data.inputType === "number" && (
                        <input
                          type={data.inputType}
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, "_").toLowerCase()
                              : ""
                          }
                          name={data.inputName}
                          defaultValue={
                            selectedDropdown
                              ? selectedDropdown[data.inputName]
                              : ""
                          }
                          onChange={dynamicChangeHandle}
                          min={data.inputAddOn.inputRange ? range[0] : ""}
                          max={data.inputAddOn.inputRange ? range[1] : ""}
                          className="form-control form-control-sm"
                        />
                      )}
                      {data.inputType === "decimal" && (
                        <input
                          type="number"
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, "_").toLowerCase()
                              : ""
                          }
                          name={data.inputName}
                          onChange={dynamicChangeHandle}
                          minLength={parseInt(data.inputAddOn.inputRangeMin)}
                          maxLength={parseInt(data.inputAddOn.inputRangeMax)}
                          className="form-control form-control-sm"
                        />
                      )}
                      {data.inputType === "select" && (
                        <Select
                          defaultValue={
                            selectedDropdown
                              ? selectedDropdown[data.inputName]
                              : ""
                          }
                          options={data.inputAddOn.inputDataSourceData}
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, "_").toLowerCase()
                              : ""
                          }
                          name={data.inputName}
                          onChange={(e) => {
                            dynamicDependancyHandle(
                              data.inputName,
                              e,
                              data.inputAddOn.inputOnChangeSource
                            );
                          }}
                          className="form-control form-control-sm"
                          required={data.inputMandatory ? true : false}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {data.ticket_uploading === "REGULAR" && (
          <span>
            <div className="card mt-2">
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-sm-12 mt-3">
                    <label className=" col-form-label">
                      <b>
                        Description : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      id="description"
                      name="description"
                      required
                      rows="4"
                    />
                  </div>
                </div>
              </div>{" "}
              {/* CARD */}
            </div>

            <div className="card mt-2">
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-sm-12 mt-3">
                    <label className=" col-form-label">
                      <b>Upload Attachment :</b>
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      id="attachment"
                      name="attachment[]"
                      multiple
                      required={
                        data.ticket_uploading === "REGULAR" ? false : true
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </span>
        )}

        {data.ticket_uploading === "BULK_UPLOADING" && isFileGenerated && (
          <div className="card mt-2">
            <div className="card-body">
              <div className="form-group row mt-3">
                <div className="col-sm-12">
                  <h5 className="text-danger">
                    <b>Important Note:</b>
                  </h5>
                  <ul>
                    <li>Do not make any changes in first row</li>
                    <li>Do not change query type after export in file</li>
                  </ul>
                </div>
              </div>

              <div className="row">
                <label className="col-form-label">
                  <b>
                    Upload Generated File <Astrick color="red" /> :
                  </b>
                </label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  id="bulk_upload_file"
                  name="bulk_upload_file"
                  required
                />
              </div>
            </div>
          </div>
        )}
        <div className="mt-3" style={{ textAlign: "right" }}>
          {data.ticket_uploading == "REGULAR" && (
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={isSubmitted == true ? true : false}
            >
              Submit
            </button>
          )}

          {data.ticket_uploading == "BULK_UPLOADING" && (
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={isFileGenerated ? false : true}
            >
              Submit
            </button>
          )}
          <Link
            to={`/${_base}/Ticket`}
            className="btn btn-danger btn-sm text-white"
          >
            Cancel
          </Link>
        </div>
      </form>

      <Modal show={showLoaderModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="dark" />
        </Modal.Body>
      </Modal>
    </div>
  );
}
