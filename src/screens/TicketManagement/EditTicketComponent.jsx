import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner, Modal, Table } from "react-bootstrap";
import Alert from "../../components/Common/Alert";
import { userSessionData, _base } from "../../settings/constants";
import Attachment from "../../components/Common/Attachment";
import * as Validation from "../../components/Utilities/Validation";
import { _attachmentUrl } from "../../settings/constants";
import {
  getAttachment,
  deleteAttachment,
} from "../../services/OtherService/AttachmentService";
import DatePicker from "react-date-picker";
import ErrorLogService from "../../services/ErrorLogService";
import MyTicketService from "../../services/TicketService/MyTicketService";
import editorStyles from "./SimpleMentionEditor.module.css";
import DynamicFormDropdownMasterService from "../../services/MastersService/DynamicFormDropdownMasterService";
import UserService from "../../services/MastersService/UserService";
import PageHeader from "../../components/Common/PageHeader";
import Select from "react-select";
import { getCurrentDate } from "../../components/Utilities/Functions";
import { UserDropdown } from "../Masters/UserMaster/UserComponent";
import { DepartmentDropdown } from "../Masters/DepartmentMaster/DepartmentComponent";
import { StatusDropdown } from "../Masters/StatusMaster/StatusComponent";
import { QueryTypeDropdown } from "../Masters/QueryTypeMaster/QueryTypeComponent";
import { ProjectDropdown } from "../ProjectManagement/ProjectMaster/ProjectComponent";
import { ModuleDropdown } from "../ProjectManagement/ModuleMaster/ModuleComponent";
import { SubModuleDropdown } from "../ProjectManagement/SubModuleMaster/SubModuleComponent";
import { Astrick } from "../../components/Utilities/Style";
import { userSessionData as user } from "../../settings/constants";
import RenderDynamicForm from "./TaskManagement/RenderDynamicForm";
import CommentData from "./CommentData";

import DepartmentService from "../../services/MastersService/DepartmentService";
import QueryTypeService from "../../services/MastersService/QueryTypeService";
import CustomerMappingService from "../../services/SettingService/CustomerMappingService";

import ProjectService from "../../services/ProjectManagementService/ProjectService";
import ModuleService from "../../services/ProjectManagementService/ModuleService";
import SubModuleService from "../../services/ProjectManagementService/SubModuleService";
import DesignationService from "../../services/MastersService/DesignationService";

import StatusService from "../../services/MastersService/StatusService";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import { Mention, MentionsInput } from "react-mentions";
import Chatbox from "./NewChatBox";
import Shimmer from "./ShimmerComponent";

export default function EditTicketComponent({ match }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);

  const { id } = useParams();
  const ticketId = id;

  const [dateValue, setDateValue] = useState(new Date());

  const editor = useRef(null);

  const [idCount, setIdCount] = useState([]);

  const [convertedContent, setConvertedContent] = useState(null);
  const [allUsers, setAllUsers] = useState();
  const [allUsersString, setAllUsersString] = useState();
  const [projectData, setProjectData] = useState();
  const [statusValue, setStatusValue] = useState();
  const [checkRole, setCheckRole] = useState(null);
  const roleId = sessionStorage.getItem("role_id");

  const [projectDropdown, setProjectDropdown] = useState();

  const [moduleData, setModuleData] = useState();
  const [moduleDropdown, setModuleDropdown] = useState();

  const [subModuleData, setSubModuleData] = useState();
  const [subModuleDropdown, setSubModuleDropdown] = useState();

  const [data, setData] = useState(null);
  const [rows, setRows] = useState();

  const [dynamicTicketData, setDynamicTicketData] = useState(null);
  const [attachment, setAttachment] = useState(null);

  const [queryType, setQueryType] = useState();
  const [queryTypeDropdown, setQueryTypeDropdown] = useState();

  const [department, setDepartment] = useState();
  const [departmentDropdown, setDepartmentDropdown] = useState();

  const [user, setUser] = useState([]);
  const [userDropdown, setUserDropdown] = useState([]);
  const [userDrp, setUserdrp] = useState(null);

  const [isSolved, setIsSolved] = useState(false);
  const current = new Date();
  const todayDate = `${current.getFullYear()}-${
    current.getMonth() + 1 < 10
      ? "0" + current.getMonth() + 1
      : current.getMonth() + 1
  }-${current.getDate()}`;
  const [defaults, setDefaults] = useState(null);
  const [customerMapping, setCustomerMapping] = useState();
  const [userName, setUserName] = useState("");
  const [defaultUserName, setDefaultUserName] = useState("");

  const [ba, setBa] = useState(null);
  const [dev, setDev] = useState(null);
  const [tester, setTester] = useState(null);
  const [ticketStatus, setTicketStatus] = useState();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalDetails, setConfirmationModalDetails] =
    useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [updateStatus, setUpdateStatus] = useState({});
  const [dateErr, setDateErr] = useState(null);

  const [proceed, setProceed] = useState(true);

  const [selectedFile, setSelectedFile] = useState([]);
  const fileInputRef = useRef(null);

  const handleTicketStatus = (e) => {
    setData((prev) => {
      const newPrev = { ...prev };
      newPrev["status_id"] = e.value;
      return newPrev;
    });
    if (e.value == 3) {
      setProceed(false);
    }
  };

  const handleConfirmationModal = async (type, data) => {
    if (type && data.status_id == 3) {
      setProceed(false);
      await new MyTicketService()
        .sendTicketConfirmationOtp(data.id)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status == 1) {
              setConfirmationModalDetails(null);
              setConfirmationModalDetails(res.data);
            } else {
              setNotify(null);
              setNotify(res.data.message);
            }
          }
        });
    }
    setConfirmationModal(type);
  };

  const handleResendOtp = async (type, data) => {
    setNotify(null);
    if (ticketStatus == 3 && data) {
      setProceed(false);
      await new MyTicketService()
        .sendTicketConfirmationOtp(data.id)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status == 1) {
              setNotify({ type: "success", message: "Otp has been sent !!!" });
              setConfirmationModalDetails(null);
              setConfirmationModalDetails(res.data);
            }
          }
        });
    }
    setConfirmationModal(type);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setNotify(null);
    const formData = new FormData(e.target);
    await new MyTicketService()
      .verifyTicketConfirmationOtp(data.id, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            loadData();
            setProceed(true);
            setConfirmationModal(false);
            setNotify({ type: "success", message: res.data.message });
          } else {
            setNotify({ type: "danger", message: res.data.message });
            setProceed(false);
          }
        }
      });
  };

  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const handleDependent = (e, name) => {
    setData({
      ...data,
      [name]: e.value,
    });
  };

  const [expectedTrue, setExpectedTrue] = useState();
  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const status = formData.getAll("status_id");
    if (status.includes("3")) {
      setExpectedTrue(true);
    }
    formData.delete("attachment[]");
    if (selectedFile) {
      for (var i = 0; i < selectedFile.length; i++) {
        formData.append("attachment[]", selectedFile[i].file);
      }
    }

    if (
      data.status_id == 3 &&
      proceed == false &&
      (data.confirmation_required == 1 || data.confirmation_required == "1")
    ) {
      await handleConfirmationModal(true, data);
    } else {
      setNotify(null);
      await new MyTicketService()
        .updateTicket(ticketId, formData)
        .then((res) => {
          setShowLoaderModal(null);
          setShowLoaderModal(false);
          if (res.status === 200) {
            if (res.data.status === 1) {
              history({
                pathname: `/${_base}/Ticket`,
                state: {
                  alert: { type: "success", message: res.data.message },
                },
              });
            } else {
              setNotify({ type: "danger", message: res.data.message });
            }
          } else {
            setNotify({ type: "danger", message: res.message });
            new ErrorLogService().sendErrorLog(
              "Ticket",
              "Update_Ticket",
              "INSERT",
              res.message
            );
          }
        })
        .catch((error) => {
          setShowLoaderModal(false);
          const { response } = error;
          const { request, ...errorObject } = response;
          setNotify({ type: "danger", message: "Request Error !!!" });
          new ErrorLogService().sendErrorLog(
            "Ticket",
            "Update_Ticket",
            "INSERT",
            errorObject.data.message
          );
        });
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
                value: d.id,
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

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState();
  const [commentData, setCommentData] = useState()
  const [users, setUsers] = useState();
  const [projectId, setProjectId] = useState();
  const [reviewerData, setReviewerData] = useState();
  const [statusData, setStatusData] = useState();
  const loadData = async () => {
    setSelectedFile([]);
    setShowLoaderModal(null);
    setShowLoaderModal(true);

    const inputRequired =
      "id,employee_id,first_name,last_name,middle_name,is_active";
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
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
          setUserdrp(select);
        }
      }
    });

    await new MyTicketService().getTicketById(ticketId).then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        setProjectId(res.data.data.project_id);
        setUsers(res.data.data.ticket_users);
        setTicketStatus(data.status_id);
        setRows(res.data.data.dynamic_form);

        if (data.status_id == 3) {
          setIsSolved(true);
        }
        setData(null);
        setData(data);
        handleAttachment("GetAttachment", ticketId);
        if (rows) {
          var dynamicForm = res.data.data.dynamic_form;
          const returnedData = [];
          const filteredArray = dynamicForm.filter(
            (formInstance) =>
              formInstance.inputType === "select" &&
              formInstance.inputAddOn.inputDataSource
          );

          Promise.all(
            filteredArray.map((d) =>
              new DynamicFormDropdownMasterService().getDropdownById(
                d.inputAddOn.inputDataSource
              )
            )
          )
            .then((result) => {
              var tempResponse = [];

              result.forEach((resu, i) => {
                if (resu.status == 200) {
                  if (resu.data.status == 1) {
                    var temp = [];
                    temp = resu.data.data.dropdown.map((d) => ({
                      value: d.id,
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
                    dynamicForm[i].inputAddOn.inputDataSourceData =
                      tempResponse[0];
                    tempResponse.splice(i, 1);
                  }
                }
              });
              setRows(dynamicForm);
            })
            .catch((err) => {
              console.log("Error >>>>>>>>>>>>>>>>>>>>>>", err);
            });
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

    await new DesignationService().getdesignatedDropdown().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const deta = res.data.data;
          setBa(
            deta.BA.filter((d) => d.is_active === 1).map((d) => ({
              value: d.id,
              label: d.first_name + "-" + d.last_name + " (" + d.id + ")",
            }))
          );
          setDev(
            deta.DEV.filter((d) => d.is_active === 1).map((d) => ({
              value: d.id,
              label: d.first_name + "-" + d.last_name + " (" + d.id + ")",
            }))
          );
          setTester(
            deta.TESTER.filter((d) => d.is_active === 1).map((d) => ({
              value: d.id,
              label: d.first_name + "-" + d.last_name + " (" + d.id + ")",
            }))
          );
        }
      }
    });

    await new CustomerMappingService()
      .getCustomerMappingSettings()
      .then((res) => {
        const queryType = [];
        const department = [];
        if (res.data.status === 1) {
          if (res.data.data) {
            const queryTypeTemp = [];
            setCustomerMapping(null);
            setCustomerMapping(res.data.data);
            res.data.data.forEach((query) => {
              if (query.query_type_id) {
                queryTypeTemp.push(query.query_type_id);
              }
            });
          }
        }
      });

    new QueryTypeService().getQueryType().then((resp) => {
      if (resp.data.status === 1) {
        var queryType = [];
        resp.data.data.forEach((q) => {
          if (q.query_type_name) {
            queryType.push({ value: q.id, label: q.query_type_name });
          }
        });
        setQueryType(queryType);
      }
    });

    await new DepartmentService().getDepartment().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          const data = res.data.data.filter((d) => d.is_active == 1);
          const select = res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ value: d.id, label: d.department }));
          setDepartment(data);
          setDepartmentDropdown(select);
        }
      }
    });

    await new ProjectService().getProject().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data.filter((d) => d.is_active == 1);
          setProjectData(temp);
          setProjectDropdown(
            temp.map((d) => ({ value: d.id, label: d.project_name }))
          );
        }
      }
    });

    await new ModuleService().getModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const temp = res.data.data.filter((d) => d.is_active == 1);

          setModuleData(temp);
          setModuleDropdown(
            temp.map((d) => ({ value: d.id, label: d.module_name }))
          );
        }
      }
    });

    await new SubModuleService().getSubModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const temp = res.data.data.filter((d) => d.is_active == 1);
          setSubModuleData(temp);
          setSubModuleDropdown(
            temp.map((d) => ({ value: d.id, label: d.sub_module_name }))
          );
        }
      }
    });

    await new StatusService().getStatus().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          const temp = res.data.data.filter((d) => d.is_active == 1);
          setStatusValue(temp);
          const select = temp.map((d) => ({ value: d.id, label: d.status }));
          setStatusData(select);
        }
      }
    });

    loadComments();
    setShowLoaderModal(false);

  };

  const loadComments = async () => {
    setIsLoading(true)
    await new MyTicketService().getComments(ticketId).then((res) => {
      if (res.status === 200) {
        setCommentData(res.data.data);
        setIsLoading(false)
      }
    });
  };

  const handleAttachment = (type, ticket_id, attachmentId = null) => {
    if (type === "GetAttachment") {
      getAttachment(ticket_id, "TICKET").then((res) => {
        if (res.status === 200) {
          setAttachment(res.data.data);
        }
      });
    }
    if (type === "DeleteAttachment") {
      deleteAttachment(attachmentId).then((res) => {
        if (res.status === 200) {
          getAttachment(ticket_id, "TICKET").then((resp) => {
            if (resp.status === 200) {
              setAttachment(resp.data.data);
            }
          });
        }
      });
    }
  };

  const handleDateChange = (e) => {
    if (e.target.value === "") {
      setDateErr(true);
    } else {
      setDateErr(false);
    }
  };

  const moduleIdRef = useRef();
  const subModuleIdRef = useRef();
  const reviewerIdRef = useRef();

  const handleDepartment = (e) => {
    if (e) {
      const select = user
        .filter((d) => d.department_id == e.value)
        .map((d) => ({
          value: d.id,
          label: d.first_name + " " + d.last_name + "(" + d.id + ")",
        }));
      setUserDropdown(select);
      setUserName(null);
    }
  };

  const clearValue = (name) => {
    switch (name) {
      case "module_id":
        if (moduleIdRef.current) {
          moduleIdRef.current.clearValue();
        }
        break;
      case "submodule_id":
        if (subModuleIdRef.current) {
          subModuleIdRef.current.clearValue();
        }
        break;
      case "ticket_reviewer":
        if (reviewerIdRef.current) {
          reviewerIdRef.current.clearValue();
        }
        break;
      default:
        break;
    }
  };

  const handleProjectChange = async (e) => {
    clearValue("module_id");
    clearValue("submodule_id");
    clearValue("ticket_reviewer");

    setModuleDropdown(null);
    setModuleDropdown(
      moduleData
        .filter((d) => d.project_id == e.value)
        .map((d) => ({ value: d.id, label: d.module_name }))
    );
    await new ProjectService().getReviewersByProject(e.value).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setReviewerData(
            res.data.data.map((d) => ({
              value: d.user_id,
              label: d.employee_name,
            }))
          );
        }
      }
    });
  };

  const handleModuleChange = (e) => {
    if (e) {
      setSubModuleDropdown(null);
      setSubModuleDropdown(
        subModuleData
          .filter((d) => d.module_id == e.value)
          .map((d) => ({ value: d.id, label: d.sub_module_name }))
      );
    }
  };

  const loadAttachment = async () => {
    setNotify(null);
    if (ticketId) {
      await getAttachment(ticketId, "TICKET").then((res) => {
        if (res.status === 200) {
          setAttachment(null);
          setAttachment(res.data.data);
        }
      });
    } else {
      setAttachment(null);
    }
  };

  const uploadAttachmentHandler = (e, type, id = null) => {
    if (type === "UPLOAD") {
      var tempSelectedFile = [];
      for (var i = 0; i < e.target.files.length; i++) {
        tempSelectedFile.push({
          file: e.target.files[i],
          show_to_customer: 0,
          show_to_project_owner: 0,
        });
      }
      fileInputRef.current.value = "";
      setSelectedFile(tempSelectedFile);
    } else if (type === "DELETE") {
      let filteredFileArray = selectedFile.filter(
        (item, index) => id !== index
      );
      setSelectedFile(filteredFileArray);
    } else if (type === "CUSTOMER") {
      var file = selectedFile;
      file[id].show_to_customer = file[id].show_to_customer ? 0 : 1;
      setSelectedFile(file);
    } else if (type === "PROJECT_OWNER") {
      var file = selectedFile;
      file[id].show_to_project_owner = file[id].show_to_project_owner ? 0 : 1;
      setSelectedFile(file);
    } else {
      alert("Invalid Option");
    }
  };
  const handleDeleteAttachment = (e, id) => {
    deleteAttachment(id).then((res) => {
      loadAttachment();
    });
  };
  const loadCommentsCallback = useCallback(() => {
    loadComments();
  }, [loadComments]);
  const option = [
    {
      value: "Priyanka Dupargude",
      label: "Priyanka Dupargude",
    },
  ];

  useEffect(() => {
    loadData();
    setConfirmationModal(false, null);
    loadAttachment();
  }, []);

  useEffect(() => {
    if (user && data !== null) {
      const userData = user.map((d) => ({
        value: d.id,
        label: d.first_name + " " + d.last_name,
      }));
      setUserName(userData.filter((d) => d.value == data.assign_to_user_id));
      // setUserDropdown(user.filter(d => d.department_id == data.assign_to_department_id).map(d => ({ value: d.id, label: d.first_name + " " + d.last_name })))
      setUserDropdown(
        user
          .filter((d) => d.department_id == data.assign_to_department_id)
          .map((d) => ({
            value: d.id,
            label: d.first_name + " " + d.last_name,
          }))
      );
      // console.log("u",data.map(d => d.department_id == data.assign_to_department_id).filter(d => ({ value: d.id, label: d.first_name + " " + d.last_name })))
    }
  }, [user]);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${currentDate.getSeconds().toString().padStart(2, "0")}`;

  useEffect(() => {
    if (checkRole && checkRole[15].can_update === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle={`Edit Ticket - ${data ? data.ticket_id : ""}`} />
      <div className="row">
        <div className="col-md-8">
          {notify && <Alert alertData={notify} />}
          {data && (
            <form
              onSubmit={handleForm}
              method="post"
              encType="multipart/form-data"
            >
              <input
                type="hidden"
                className="form-control form-control-sm"
                id="object_id"
                name="object_id"
                value={data.object_id}
                readOnly={true}
              />
              <div className="card mt-2">
                <div className="card-body">
                  <div className="form-group row d-flex justify-content-between">
                    <div className="col-sm-4">
                      <label className="col-form-label">
                        <b>Query Type: </b>
                      </label>
                      {queryType && (
                        <Select
                          id="query_type_id"
                          name="query_type_id"
                          options={queryType}
                          defaultValue={
                            data &&
                            queryType.filter(
                              (d) => d.value == data.query_type_id
                            )
                          }
                          menuIsOpen={false}
                        />
                      )}
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">
                        <b>Confirmation Required: </b>
                      </label>
                      <p style={{ fontSize: "20px", fontWeight: "600" }}>
                        {data && data.confirmation_required === 1
                          ? "YES"
                          : "NO"}
                      </p>
                    </div>
                    <div className="col-sm-4">
                      <p
                        style={
                          data.passed_status == "UNPASS"
                            ? {
                                color: "red",
                                fontWeight: "600",
                                fontSize: "20px",
                              }
                            : {
                                color: "green",
                                fontWeight: "600",
                                fontSize: "20px",
                              }
                        }
                      >
                        {data.passed_status}
                      </p>
                      {data.passed_status == "PASS" && (
                        <p
                          style={{
                            color: "green",
                            fontWeight: "600",
                            fontSize: "15px",
                          }}
                        >
                          {data.passed_status_remark}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-2">
                <div className="card-body">
                  <div className="form-group row ">
                    <div className="col-sm-4">
                      <label className="col-form-label">
                        <b>
                          Ticket Date : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        id="ticket_date"
                        name="ticket_date"
                        value={data.ticket_date}
                        readOnly={true}
                      />
                    </div>
                    {expectedTrue && JSON.stringify(expectedTrue)}
                    <div className="col-sm-4">
                      <label className="col-form-label">
                        <b>
                          Expected Solve Date :{" "}
                          {expectedTrue && expectedTrue == true ? (
                            <Astrick color="red" size="13px" />
                          ) : (
                            ""
                          )}
                        </b>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        id="expected_solve_date"
                        name="expected_solve_date"
                        min={data.ticket_date}
                        max={"2100-12-31"}
                        onFocus={(e) => {
                          handleDateChange(e);
                        }}
                        defaultValue={data.expected_solve_date}
                        required={
                          expectedTrue && expectedTrue == true ? true : false
                        }
                      />
                      {dateErr && dateErr == true && expectedTrue == true && (
                        <span style={{ color: "red" }}>Please Select Date</span>
                      )}
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">
                        <b>Ref Id :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="cuid"
                        name="cuid"
                        defaultValue={data.cuid}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* CARD */}
              <div className="card mt-2">
                <div className="card-body">
                  <div className="form-group row ">
                    <div className="col-sm-4">
                      <label className="col-form-label">
                        <b>Entry Department :</b>
                      </label>
                      {departmentDropdown && (
                        <Select
                          id="assign_to_department_id"
                          name="assign_to_department_id"
                          options={departmentDropdown}
                          onChange={(e) => {
                            handleDepartment(e);
                          }}
                          defaultValue={departmentDropdown.filter(
                            (d) => d.value == data.from_department_id
                          )}
                          isDisabled={true}
                        />
                      )}
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">
                        <b>Entry User : </b>
                      </label>

                      {userDrp && (
                        <Select
                          options={userDropdown}
                          defaultValue={userDrp.filter(
                            (d) => d.value == data.created_by
                          )}
                          isDisabled={true}
                        />
                      )}
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">
                        <b>Ticket Type : </b>
                      </label>

                      <input
                        className="form-control form-control-sm"
                        type="text"
                        defaultValue={data && data.type_name}
                        readOnly
                        name="ticket_type_id"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* CARD */}

              {/* {data && data.passed_status == "PASS" && */}
              <div className="card mt-2">
                <div className="card-body">
                  <div className="form-group row">
                    <div className="col-sm-3">
                      <label className=" col-form-label">
                        <b>
                          Project : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {projectDropdown && (
                        <Select
                          id="project_id"
                          name="project_id"
                          options={projectDropdown}
                          onChange={handleProjectChange}
                          defaultValue={projectDropdown.filter(
                            (d) => d.value == data.project_id
                          )}
                        />
                      )}
                    </div>
                    <div className="col-sm-3">
                      <label className=" col-form-label">
                        <b>
                          Module : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {moduleDropdown && (
                        <Select
                          id="module_id"
                          name="module_id"
                          options={moduleDropdown}
                          ref={moduleIdRef}
                          clearValue={true}
                          onChange={handleModuleChange}
                          defaultValue={moduleDropdown.filter(
                            (d) => d.value == data.module_id
                          )}
                        />
                      )}
                    </div>

                    <div className="col-sm-3">
                      <label className=" col-form-label">
                        <b>Sub Module :</b>
                      </label>
                      {subModuleDropdown && (
                        <Select
                          options={subModuleDropdown}
                          id="submodule_id"
                          name="submodule_id"
                          ref={subModuleIdRef}
                          defaultValue={subModuleDropdown.filter(
                            (d) => d.value == data.submodule_id
                          )}
                        />
                      )}
                    </div>

                    <div className="col-sm-3">
                      <label className=" col-form-label">
                        <b>Reviewer :</b>
                      </label>
                      <Select
                        name="ticket_reviewer"
                        id="ticket_reviewer"
                        options={reviewerData}
                        ref={reviewerIdRef}
                        defaultValue={
                          data &&
                          data.ticket_users.REVIEWER.map((d) => ({
                            value: d.id,
                            label: d.name,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {data && data.passed_status == "PASS" && (
                <div className="card mt-2">
                  <div className="card-body">
                    <div className="form-group row ">
                      <div className="col-sm-3">
                        <label className=" col-form-label">
                          <b>
                            Assign to Department :{" "}
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        {departmentDropdown && (
                          <Select
                            id="assign_to_department_id"
                            name="assign_to_department_id"
                            options={departmentDropdown}
                            onChange={(e) => {
                              handleDepartment(e);
                            }}
                            defaultValue={departmentDropdown.filter(
                              (d) => d.value == data.assign_to_department_id
                            )}
                            isDisabled={isSolved}
                          />
                        )}
                      </div>
                      <div className="col-sm-3">
                        <label className="col-form-label">
                          <b>
                            Assign to User : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        {userDropdown && (
                          <Select
                            id="assign_to_user_id"
                            name="assign_to_user_id"
                            options={userDropdown}
                            onChange={(event) => {
                              if (event) {
                                setUserName(event);
                              }
                            }}
                            defaultValue={
                              userDropdown &&
                              data.assign_to_user_id &&
                              userDropdown.filter(
                                (d) => d.value == data.assign_to_user_id
                              )
                            }
                            // defaultValue={data.assign_to_user}
                            isDisabled={isSolved}
                          />
                        )}
                      </div>
                      <div className="col-sm-3">
                        <label className="col-form-label">
                          <b>
                            Priority :<Astrick color="red" size="13px" />
                          </b>
                        </label>
                        {/* <select className="form-control form-control-sm" 
                                            id="priority"
                                                name="priority" 
                                                required={true}                                                 
                                                disabled={data && (data.status_id==3 || data.status_id=="3")}
                                                >
                                                <option value="Low"
                                                    selected={data.priority === "Low" ? true : false}>Low
                                                </option>
                                                <option value="Medium"
                                                    selected={data.priority === "Medium" ? true : false}>Medium
                                                </option>
                                                <option value="High"
                                                    selected={data.priority === "High" ? true : false}>High
                                                </option>
                                                <option value="Very High"
                                                    selected={data.priority === "Very High" ? true : false}>Very
                                                    High
                                                </option>
                                            </select> */}
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="priority"
                          name="priority"
                          required={true}
                          readOnly={true}
                          defaultValue={data.priority}
                        />
                      </div>

                      <div className="col-sm-3">
                        <label className=" col-form-label">
                          <b>
                            Status : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        {/* <StatusDropdown id="status_id" name="status_id"
                                                required
                                                defaultValue={data.status_id}
                                                // disabled={data && (data.status_id==3 || data.status_id=="3")}
                                                getChangeValue={e => handleTicketStatus(e)}
                                            /> */}

                        {statusData && (
                          <Select
                            id="status_id"
                            name="status_id"
                            options={statusData}
                            onChange={(e) => handleTicketStatus(e)}
                            defaultValue={statusData.filter(
                              (d) => d.value == data.status_id
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {rows && rows.length > 0 && (
                <div className="card mt-2">
                  <div className="card-body">
                    <div className="row">
                      {rows.map((data, index) => {
                        var range = "";
                        return (
                          <div className={`${data.inputWidth} mt-2`}>
                            <label>
                              <b>{data.inputLabel} :</b>
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
                                onChange={dynamicChangeHandle}
                                readOnly
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
                                defaultValue={data.inputDefaultValue}
                                onChange={dynamicChangeHandle}
                              />
                            )}
                            {data.inputType === "date" && (
                              <div className="form-control">
                                <DatePicker
                                  // onChange={onChangeDate}
                                  value={dateValue}
                                  format={data.inputFormat}
                                  style={{ width: "100%" }}
                                />
                              </div>
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
                                onChange={dynamicChangeHandle}
                                className="form-control form-control-sm"
                              />
                            )}
                            {data.inputType === "number" && (
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
                                    ? data.inputName
                                        .replace(/ /g, "_")
                                        .toLowerCase()
                                    : ""
                                }
                                name={data.inputName}
                                defaultValue={data.inputDefaultValue}
                                onChange={dynamicChangeHandle}
                                min={data.inputAddOn.inputRange ? range[0] : ""}
                                max={data.inputAddOn.inputRange ? range[1] : ""}
                                className="form-control form-control-sm"
                              />
                            )}
                            {data.inputType === "select" && (
                              <input
                                type="text"
                                // defaultValue={selectedDropdown ? selectedDropdown[data.inputName] : ""}
                                // defaultValue={data.inputDefaultValue ? data.inputAddOn.inputDataSourceData.filter(d => d.value == data.inputDefaultValue) : ""}
                                defaultValue={data.inputDefaultValue}
                                // options={data.inputAddOn.inputDataSourceData}
                                // id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                                name={data.inputName}
                                // onChange={e => { dynamicDependancyHandle(data.inputName, e, data.inputAddOn.inputOnChangeSource) }}
                                className="form-control form-control-sm"
                                required={data.inputMandatory ? true : false}
                                readOnly
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="card mt-2">
                <div className="card-body">
                  <div className="form-group row">
                    <div className="col-sm-12 mt-3">
                      <label className=" col-form-label">
                        <b>Description : </b>
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        id="description"
                        name="description"
                        required
                        rows="4"
                        defaultValue={data.description}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-12 ml-0 pl-0">
                  <label className="form-label">
                    <b>Attachment : </b>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    ref={fileInputRef}
                    onChange={(e) => {
                      uploadAttachmentHandler(e, "UPLOAD", "");
                    }}
                  />
                </div>
              </div>

              {selectedFile && selectedFile.length > 0 && (
                <div className="row">
                  <div className="col-md-6">
                    <Table bordered size="sm">
                      <thead>
                        <tr className="p-1">
                          <th className="p-1 text-center">Attached File</th>
                          <th className="p-1 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFile.map((ele, i) => {
                          return (
                            <tr className="p-1">
                              <td className="p-1">
                                <b>{i + 1}.</b> {ele.file.name}
                              </td>
                              <td className="p-1 text-center">
                                <button
                                  className="btn btn-danger text-white btn-sm p-0 px-1 mt-0"
                                  type="button"
                                  onClick={(e) => {
                                    uploadAttachmentHandler(e, "DELETE", i);
                                  }}
                                >
                                  <i
                                    className="icofont-ui-delete"
                                    style={{ fontSize: "12px" }}
                                  ></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
              <div
                className="d-flex justify-content-start mt-2"
                style={{ overflowX: "auto" }}
              >
                {attachment &&
                  attachment.map((attach, index) => {
                    return (
                      <div
                        className="justify-content-start"
                        style={{
                          marginRight: "20px",
                          padding: "0px",
                          width: "200px",
                        }}
                      >
                        <div
                          className="card"
                          style={{ backgroundColor: "#EBF5FB" }}
                        >
                          <div className="card-header">
                            <p style={{ fontSize: "12px" }}>
                              <b>{attach.name}</b>
                            </p>
                            <div className="d-flex justify-content-end p-0">
                              <a
                                href={`${_attachmentUrl + "/" + attach.path}`}
                                target="_blank"
                                className="btn btn-warning btn-sm p-0 px-1"
                              >
                                <i
                                  className="icofont-download"
                                  style={{ fontSize: "12px", height: "15px" }}
                                ></i>
                              </a>
                              <button
                                className="btn btn-danger text-white btn-sm p-0 px-1"
                                type="button"
                                onClick={(e) => {
                                  handleDeleteAttachment(e, attach.id);
                                }}
                              >
                                <i
                                  className="icofont-ui-delete"
                                  style={{ fontSize: "12px" }}
                                ></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* <div className='card mt-2'>
                            <div className='card-body'>
                                <div className="col-sm-4 mt-3">
                                    <label className=" col-form-label">
                                        <b>Upload Attachment : </b>
                                    </label>
                                    <input type="file"
                                        id="attachment"
                                        name="attachment[]"
                                        multiple
                                    />
                                </div>
                            </div>
                            <Attachment
                                data={attachment}
                                refId={ticketId}
                                handleAttachment={handleAttachment}
                            />
                        </div> */}

              <div className="mt-3" style={{ textAlign: "right" }}>
                {isSolved == false && (
                  <button type="submit" className="btn btn-sm btn-primary">
                    Submit
                  </button>
                )}
                <Link
                  to={`/${_base}/Ticket/View/` + data.id}
                  className="btn btn-sm btn-info text-white"
                >
                  View
                </Link>
                <Link
                  to={`/${_base}/Ticket`}
                  className="btn btn-danger btn-sm text-white"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>

          {isLoading ? (<Shimmer count={10}/>) :(
        <div className="col-md-4">
            <Chatbox ticketId={ticketId} loadComment ={loadCommentsCallback} commentData={commentData} />
        </div>
            )}

       
      </div>

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

      {confirmationModal && (
        <Modal
          centered
          show={confirmationModal}
          onHide={(e) => {
            handleConfirmationModal(false, null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Confirm OTP</Modal.Title>
          </Modal.Header>
          <form onSubmit={verifyOtp} method="POST">
            <Modal.Body>
              {confirmationModalDetails && (
                <center>
                  <h3>{confirmationModalDetails.message}</h3>
                </center>
              )}
              {data && (
                <input
                  type="hidden"
                  className="form-control form-control-sm"
                  name="id"
                  id="id"
                  defaultValue={data.id}
                />
              )}
              <div className="form-group row ">
                <div className="col-sm-12">
                  <label className=" col-form-label">
                    <b>
                      Enter OTP : <Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="otp"
                    id="otp"
                    minLength={6}
                    maxLength={6}
                    onKeyPress={(e) => {
                      Validation.NumbersOnly(e);
                    }}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="d-flex justify-content-between">
                {data && (
                  <button
                    type="button"
                    className="btn btn-warning text-white"
                    onClick={(e) => handleResendOtp(true, data)}
                  >
                    Resend OTP
                  </button>
                )}
                <span>
                  <button
                    type="submit"
                    className="btn btn-primary text-white"
                    style={{ backgroundColor: "#484C7F" }}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger text-white"
                    onClick={() => {
                      handleConfirmationModal(false, null);
                    }}
                  >
                    Close
                  </button>
                </span>
              </div>
            </Modal.Footer>
          </form>
        </Modal>
      )}
    </div>
  );
}
