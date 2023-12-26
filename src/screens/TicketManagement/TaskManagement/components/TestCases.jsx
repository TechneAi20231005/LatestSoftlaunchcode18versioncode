//Rushikesh Harkare //
import React, { useEffect, useState, useRef } from "react";
import {
  _base,
  _attachmentUrl,
  _apiUrl,
  userSessionData,
} from "../../../../settings/constants";
import { Modal, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import TestCasesService from "../../../../services/TicketService/TestCaseService";
import PageHeader from "../../../../components/Common/PageHeader";
import { Astrick } from "../../../../components/Utilities/Style";
import { ExportToExcel } from "../../../../components/Utilities/Table/ExportToExcel";
import ErrorLogService from "../../../../services/ErrorLogService";
import Alert from "../../../../components/Common/Alert";
import {
  getAttachment,
  deleteAttachment,
} from "../../../../services/OtherService/AttachmentService";
import { Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MyTicketService from "../../../../services/TicketService/MyTicketService";
import ModuleService from "../../../../services/ProjectManagementService/ModuleService";
import SubModuleService from "../../../../services/ProjectManagementService/SubModuleService";
import * as Validation from "../../../../components/Utilities/Validation";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import BasketService from "../../../../services/TicketService/BasketService";
import TestingTypeServices from "../../../../services/MastersService/TestingTypeService";
import Select from "react-select";
import DesignationService from "../../../../services/MastersService/DesignationService";
const TestCases = ({ match }) => {
  const ticket_id = match.params.ticketId;
  const task_id = match.params.taskId;
  const module_id = match.params.moduleId;
  const [testingTypeDropdown, setTestingTypeDropdown] = useState();
  const [testCaseFunction, setTestCaseFunction] = useState();



  const history = useNavigate()
  const [tId, setTId] = useState("");
  const [data, setData] = useState(null);
  const [colors, setColors] = useState("green");
  const [priority, setPriority] = useState("white");
  const [notify, setNotify] = useState(null);
  const [platform, setPlatform] = useState("WEBSITE");
  const [selectedFile, setSelectedFile] = useState([]);
  const [attachment, setAttachment] = useState([]);
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const [importModal, setImportModal] = useState({
    ishowModal: false,
    imodalData: "",
    imodalHeader: "",
  });
  const [ticketData, setTicketData] = useState();
  const [moduleData, setModuleData] = useState();
  const [moduleDropdown, setModuleDropdown] = useState();
  const [submoduleData, setSubmoduleData] = useState();
  const [submoduleDropdown, setSubmoduleDropdown] = useState();
  const fileInputRef = useRef(null);
  const formRef = useRef();
  const [attach, setAttach] = useState(null);
  const [isselected, setIsselectd] = useState(false);
  const [userTypeData, setUserTypeData] = useState(null);
  const [testerStatus, setTesterStatus] = useState();
  const [tempshow, setTempshow] = useState(false);
  const [executable, setExecutable] = useState();
  const [copiedData, setCopiedData] = useState({ type: null, data: null });
  const [isReviewer, setIsReviewer] = useState(null);
  const testerRef = useRef(null);
  const [ba, setBa] = useState(null);
  const [dev, setDev] = useState(null);
  const [ownership, setOwnership] = useState();
  const [showLoaderModal, setShowLoaderModal] = useState();

  const [sendtoModal, setSendtoModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [defaultData, setDefaultData] = useState({
    script_path: null,
  });

  // Reset Form Fields after Submit

  const [exportData, setExportData] = useState();

  // send to modal
  const handleSendtoModal = (data) => {
    setSendtoModal(data);
  };

  const useSessionData = {
    userId: sessionStorage.getItem("id"),
  };
  // Handle Modal For Edit Form
  const handleModal = (data) => {
    setModal(data);
  };

  const handleImportModal = (data) => {
    setImportModal(data);
  };

  const defaultDataHandle = (e) => {
    setDefaultData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  // Load Attachments
  const loadAttachment = async () => {
    setNotify(null);
    if (data.id) {
      await getAttachment(data.id, "TEST_CASE").then((res) => {
        if (res.status === 200) {
          setAttachment(null);
          setAttachment(res.data.data);
        }
      });
    } else {
      setAttachment(null);
    }
  };

  // Set Input Field For Platform Selection
  const handlePlatform = (e) => {
    setPlatform(prev => e.target.value);
    //   if(copiedData.data){
    //   setCopiedData(prev=>{
    //     const newPrev = {...prev}
    //     newPrev.data['platform'] = e.target.value
    //     return newPrev
    //   })
    // }
  };
  const handleCopiedData = (e, buttonType, index) => {
    if (e) {
      setData((prev) => null);
      setData(data);

      setCopiedData((prev) => ({
        type: buttonType,
        data: data[index],
      }));
    }
  }

  // Function to handle selecting a tester status
  const handleTesterStatus = e => {
    if (testerRef.current.value === 'FAIL') {
      setTesterStatus(false) // Set the tester status to false if the value is 'FAIL'
    } else {
      setTesterStatus(true);
    }
  };



  // Expandable Component to render attachments
  const ExpandedComponent = ({ data }) => (
    <pre>
      <Table style={{ width: "30%" }}>
        <thead>
          <tr>
            <th>Sr</th>
            <th>Attachment Name</th>
            <th>Acton</th>
          </tr>
        </thead>
        <tbody>
          {data.attachments &&
            data.attachments.length > 0 &&
            data.attachments.map((attachment, key) => {
              return (
                <tr key={key}>
                  <td>{key + 1}</td>
                  <td>{attachment.name}</td>
                  <td>
                    <a
                      href={`${_attachmentUrl}/${attachment.path}`}
                      target="_blank"
                      className="btn btn-primary btn-sm p-1"
                    >
                      <i
                        class="icofont-eye"
                        style={{ fontSize: "15px", height: "15px" }}
                      ></i>
                    </a>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </pre>
  );

  const updateEnable = async (e, index) => {
    var value;
    if (e) {
      if (e.target.checked == true) {
        value = 1;
      } else {
        value = 0;
      }
    }
    var tempData = data[index];
    const form = new FormData();
    form.append("is_enabled", value);
    Object.keys(tempData).map((key) => {
      if (
        key !== "counter" &&
        key !== "index" &&
        key !== "is_disabled" &&
        key !== "attachments" &&
        key !== "task_name" &&
        key !== "userId" &&
        key !== "reviewer_status" &&
        key !== "status" &&
        key !== "role" &&
        key !== "testing_type_name" &&
        key !== "is_enabled" &&
        key !== 'approved_status'

      ) {
        const value = tempData[key] || ""; // Use empty string if value is falsy
        form.append(key, value);
      }
    });

    await new TestCasesService()
      .updateTestCases(tempData.id, form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            loadData();
            // setNotify({ type: 'success', message: res.data.message })
            //loadData();
          }
        } else {
          setNotify({ type: "danger", message: res.data.message });

          new ErrorLogService().sendErrorLog(
            "TestCase",
            "Create_TestCases",
            "INSERT",
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: "danger", message: "Request Error !!!" });
        new ErrorLogService().sendErrorLog(
          "TestCase",
          "Create_TestCases",
          "INSERT",
          errorObject.data.message
        );
      });
  };
  const mainTestingTypeRef = useRef()

  const resetForm = (e) => {
    if (e) {
      if (testingRef.current) {
        testingRef.current.clearValue();
      }
      document.getElementById("function").value = "";
      document.getElementById("field").value = "";
      document.getElementById("test_description").value = "";
      document.getElementById("expected_result").value = "";
      if (executable == 1) {
        document.getElementById("actual_result").value = "";
      }
      document.getElementById("tester_comments").value = "";
      if (executable == 1) {
        document.getElementById("reviewer_comments").value = "";
      }
      if (executable == 1) {
        document.getElementById("tester_status").value = "";
      }
      document.getElementById("severity").value = "";
      if (executable == 1) {
        document.getElementById("attachment").value = "";
      }
    }

  }

  // Columns for DataTable
  const columns = [
    {
      name: " Enable/Disable",
      cell: (row) => (
        <div
          class="form-check form-switch"
        //  onClick={() => handleEnabledChange(row.id)}
        >

          {executable == 0 && (
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              name="is_enabled"
              id={`is_enabled_${row.id}`}
              onBlur={e => updateEnable(e, row.index)}
              defaultChecked={row.is_enabled == 1 ? true : false} // Check if row is in selectedRows state
              onChange={(e) => {
                toggleRowSelection(e, row.id, row);
              }}
            />
          )}
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => { },
      sortable: false,
      cell: (row) => (
        // row.is_disabled == false &&
        <div className="btn-group " role="group">
          {executable == 0 && (
            <a href="#Top" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{ borderRadius: "10px", marginRight: "5px", marginTop: "3px" }}
                disabled={row.is_enabled == 0}
                onClick={(e) => {
                  handleCopiedData(e, "ADD", row.index);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <i class="icofont-plus-circle"></i>{" "}
              </button>
            </a>
          )}
          <a href="#Top" style={{ textDecoration: "none" }}>
            <button
              type="button"
              style={{ borderRadius: "20px", marginRight: "5px" }}
              className="btn btn-sm btn-info "
              disabled={row.is_enabled == 0}
              onClick={(e) => {
                handleCopiedData(e, "EDIT", row.index);
                // getData(e, row.index)
              }}
            >
              <i class="icofont-edit text-white"></i>
            </button>
          </a>
          <Link
            to={`/${_base}/TestCaseHistory/` + row.id}
            className="btn btn-sm btn-danger text-white"
            onClick={(e) => {
              if (row.is_enabled == 0) {
                e.preventDefault(); // Prevents link from navigating
              }
            }}
            style={{ borderRadius: "20px", fontSize: "15px" }}
          >
            <i class="icofont-history"></i>
          </Link>
        </div>
      ),
    },
    {
      name: "Test Case Id",
      selector: (row) => row.test_case_id,
      sortable: true,
    },
    {
      name: "Platform",
      selector: (row) => row.platform,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.platform && (
            <OverlayTrigger overlay={<Tooltip>{row.platform} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.platform && row.platform.length < 10
                    ? row.platform
                    : row.platform.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "APK Version",
      selector: (row) => row.apk_version,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >

          {row.apk_version && (
            <OverlayTrigger overlay={<Tooltip>{row.apk_version} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.apk_version ? row.apk_version : ""}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "Os Version",
      selector: (row) => row.os_version,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.os_version && (
            <OverlayTrigger overlay={<Tooltip>{row.os_version} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.os_version ? row.os_version : ""}

                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "Function",
      selector: (row) => row.function,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.function && (
            <OverlayTrigger overlay={<Tooltip>{row.function} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.function && row.function.length < 10
                    ? row.function
                    : row.function.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "Field",
      selector: (row) => row.field,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.field && (
            <OverlayTrigger overlay={<Tooltip>{row.field} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.field && row.field.length < 10
                    ? row.field
                    : row.field.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "Testing Type",
      selector: (row) => row.testing_type_name,
      sortable: true,
    },

    {
      name: "Description",
      selector: (row) => row.test_description,
      sortable: true,
      width: "280px",
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.test_description && (
            <OverlayTrigger
              overlay={<Tooltip>{row.test_description} </Tooltip>}
            >
              <div>
                <span className="ms-1" >
                  {row.test_description}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "Expected Result",
      selector: (row) => row.expected_result,
      sortable: true,
      width: "280px",


      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.expected_result && (
            <OverlayTrigger overlay={<Tooltip>{row.expected_result} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.expected_result}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "Actual Result",
      selector: (row) => row.actual_result,
      sortable: true,
      width: "280px",

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.actual_result && (
            <OverlayTrigger overlay={<Tooltip>{row.actual_result} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.actual_result}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "Tester status",
      selector: (row) => row.tester_status,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.tester_status && (
            <OverlayTrigger overlay={<Tooltip>{row.tester_status} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.tester_status && row.tester_status.length < 10
                    ? row.tester_status
                    : row.tester_status.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "Severity",
      selector: (row) => row.severity,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.severity && (
            <OverlayTrigger overlay={<Tooltip>{row.severity} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.severity && row.severity.length < 10
                    ? row.severity
                    : row.severity.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "Script Path",
      selector: (row) => row.script_path,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.script_path && (
            <OverlayTrigger overlay={<Tooltip>{row.script_path} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.script_path && row.script_path.length < 10
                    ? row.script_path
                    : row.script_path.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "Tester Comments",
      selector: (row) => row.tester_comments,
      sortable: true,
      width: "280px",

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.tester_comments && (
            <OverlayTrigger overlay={<Tooltip>{row.tester_comments} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.tester_comments}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "Reviewer Comments",
      selector: (row) => row.reviewer_comments,
      sortable: true,
      width: "280px",
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.reviewer_comments && (
            <OverlayTrigger overlay={<Tooltip>{row.reviewer_comments} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.reviewer_comments}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.is_enabled == 0,
      style: {
        backgroundColor: "#D3D3D3",
        // color: "white",
        fontWeight: "bold",
      },
    },
  ];

  // Define Data of Table Data
  const tableData = {
    columns,
    data,
  };

  // Onclick method for Cancel the Modal//
  const cancelButton = (e) => {
    setModal({ showModal: false });
  };

  // Get Last TestCase Id //
  const getLastId = async () => {
    await new TestCasesService().getLastId(ticket_id, task_id).then((res) => {
      if (res.status === 200) {
        setTId(res.data);
      }
    });
  };
  const [sentReview, setSentReview] = useState(false)
  const [showreviewBtn, setShowReviewBtn] = useState()
  const [iterationCount, setIterationCount] = useState();
  // Send test Cases For Review  //
  const sendTestCasesForReview = async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);

    form.append("test_case_id", selectedRowsData);
    await new TestCasesService().getReviewTestCases(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setSentReview(true)
          setNotify({ type: "success", message: res.data.message });
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    });
  };

  // upload Attachment
  const uploadAttachmentHandler = (e, type) => {
    if (type === "UPLOAD") {
      var tempSelectedFile = [];
      for (var i = 0; i < e.target.files.length; i++) {
        tempSelectedFile.push({ file: e.target.files[i] });
      }
      fileInputRef.current.value = "";
      setSelectedFile(tempSelectedFile);
    } else {
      alert("Invalid Option");
    }
  };
  // function ends

  // maximum length check for attachments
  const maxLengthCheck = (e) => {
    if (e.target.files.length > 5) {
      alert("You Can Upload Only 5 Attachments");
      document.getElementById("attachment").value = null;
    }
  };
  // function ends

  const [testCaseId, setTestCaseId] = useState();
  const [paginationData, setPaginationData] = useState()
  // Load All Data and Render
  const loadData = async () => {
    setShowLoaderModal(null)
    setShowLoaderModal(true)

    const data = [];
    await getLastId();

    await new MyTicketService().getTicketById(ticket_id).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setTicketData(res.data.data);
        }
      }
    });

    await new BasketService().getBasketTaskData(ticket_id).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.is_reviewer;
          setIsReviewer(temp);
          setOwnership(res.data.ownership);
        }
      }
    });

    await new ModuleService().getModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setModuleData(res.data.data);
          setModuleDropdown(
            res.data.data.map((d) => ({ value: d.id, label: d.module_name }))
          );
        }
      }
    });

    await new SubModuleService().getSubModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setSubmoduleData(res.data.data);
          setSubmoduleDropdown(
            res.data.data.map((d) => ({
              value: d.id,
              label: d.sub_module_name,
            }))
          );
        }
      }
    });

    await new TestingTypeServices().getAlltestingType().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          var temp = res.data.data.filter((d) => d.is_active == 1)

          setTestingTypeDropdown(temp.map(d => ({
            value: d.id,
            label: d.testing_type,
          })));

        }
      }
    });

    await new TestCasesService()
      .getdesignatedDropdown(ticket_id)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            const deta = res.data.data.ALL;
            setBa(
              deta
                .filter(
                  (d) => d.is_active == 1 && d.id != userSessionData.userId
                )
                .map((d) => ({
                  value: d.id,
                  label: d.first_name + "-" + d.last_name,
                }))
            );
          }
        }
      });

    await new TestCasesService()
      .getTestCases(useSessionData.userId, ticket_id, task_id)
      .then((res) => {
        setShowLoaderModal(false)
        setData(null);
        setUserTypeData(null);
        const temp = res.data.data.data;
        setPaginationData(res.data.data)
        const userType = res.data.type;
        const execution = res.data.execution;
        setIterationCount(res.data.iterationCount);
        const showBtn = res.data.show_review_btn

        const ExportTempData = [];
        const tempData = [];
        for (const key in temp) {
          tempData.push({
            index: tempData.length,
            id: temp[key].id,
            test_case_id: temp[key].test_case_id,
            task_name: temp[key].task_name,
            testing_type_name: temp[key].testing_type_name,
            testing_type: temp[key].testing_type,
            function: temp[key].function,
            field: temp[key].field,
            submodule: temp[key].submodule,
            platform: temp[key].platform,
            apk_version: temp[key].apk_version,
            os_version: temp[key].os_version,
            test_description: temp[key].test_description,
            expected_result: temp[key].expected_result,
            actual_result: temp[key].actual_result,
            tester_comments: temp[key].tester_comments,
            reviewer_comments: temp[key].reviewer_comments,
            tester_status: temp[key].tester_status,
            severity: temp[key].severity,
            module_name: temp[key].module_name,
            attachments: temp[key].attachments,
            is_enabled: temp[key].is_enabled,
            script_path: temp[key].script_path,
          });
        }
        setData((prev) => null);
        setData(tempData);
        const a = tempData.map((d, i) => {
          return d.test_case_id;
        });
        setTestCaseId(a);
        setUserTypeData(userType);
        setExecutable(execution);
        setShowReviewBtn(showBtn)
        for (const key in temp) {
          ExportTempData.push({
            test_case_id: temp[key].test_case_id,
            platform: temp[key].platform,
            apk_version: temp[key].apk_version,
            os_version: temp[key].os_version,
            function: temp[key].function,
            field: temp[key].field,
            testing_type_name: temp[key].testing_type_name,
            test_description: temp[key].test_description,
            expected_result: temp[key].expected_result,
            actual_result: temp[key].actual_result,
            tester_status: temp[key].tester_status,
            severity: temp[key].severity,
            script_path: temp[key].script_path,
            tester_comments: temp[key].tester_comments,
            reviewer_comments: temp[key].reviewer_comments,
            module_name: temp[key].module_name,
            submodule: temp[key].submodule,
          });
        }
        setExportData(ExportTempData);
      });

    // called To show the Function field aptions - Asmita Margaje
    await new TestCasesService()
      .getTestcasesFunction()
      .then((res) => {
        console.log("res",res.data.data)
        var temFunction = res.data.data
        setTestCaseFunction(temFunction.map(d => ({
          value: d.id,
          label: d.function,
        })));

      })
  };
  const testingRef = useRef();
  const testingFunctionRef = useRef();


  
  // Submit Main Form
  const handleForm = async (e) => {
    e.preventDefault();
    var flag = 1;

    const form = new FormData(e.target);
    setNotify(null);
    var button_type = e.target.button_type.value;
    var response = null;

    if (testingRef.current.commonProps.hasValue == false) {
      alert("Please select Testing Type");
      flag = 0;
    }

    if (testingFunctionRef.current.commonProps.hasValue == false) {
      alert("Please select Function");
      flag = 0;
    }

    if (flag == 1) {
      if (button_type == "UPDATE") {
        response = new TestCasesService().updateTestCases(
          form.getAll("id"),
          form
        );
      } else {
        response = new TestCasesService().postTestCases(form);
      }
      await response.then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            // document.getElementById("function").value = "";
            // document.getElementById("field").value = "";
            // document.getElementById("test_description").value = "";
            // document.getElementById("expected_result").value = "";

            // if (executable == 1) {
            //   if (document.getElementById("actual_result").value != "") {
            //     document.getElementById("actual_result").value = "";
            //   }
            // }

            // document.getElementById("tester_comments").value = "";
            // if (executable == 1) {
            //   document.getElementById("tester_status").value = "";
            // }
            // document.getElementById("severity").value = "";

            // setTestingTypeDropdown(null);
            //       if(testingRef.current.commonProps.hasValue == true){
            //       testingRef.current.clearValue()
            // }
            if (executable == 1) {
              document.getElementById("attachment").value = "";
            }
            setNotify({ type: "success", message: res.data.message });

            // setCopiedData((prevState) => ({
            //   ...prevState,
            //   data: null,
            // }));
            loadData();
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          setNotify({ type: "danger", message: res.data.message });
          new ErrorLogService().sendErrorLog(
            "TestCase",
            button_type == "UPDATE" ? "UPDATE_TEST_CASE" : "CREATE_TEST_CASE",
            button_type == "UPDATE" ? "UPDATE" : "INSERT",
            res.message
          );
        }
      });
    }
  };


  // Update Form
  const updateForm = (id) => async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setNotify(null);
    await new TestCasesService()
      .updateTestCases(id, form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1)
            setNotify({ type: "success", message: res.data.message });
          loadData();
        } else {
          setNotify({ type: "danger", message: res.data.message });

          new ErrorLogService().sendErrorLog(
            "TestCase",
            "Create_TestCases",
            "INSERT",
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: "danger", message: "Request Error !!!" });
        new ErrorLogService().sendErrorLog(
          "TestCase",
          "Create_TestCases",
          "INSERT",
          errorObject.data.message
        );
      });
  };

  // upload Test Case from Excel
  const handleimportTestCase = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    // let path = d.replace("'\","")
    setNotify(null);
    await new TestCasesService().uploadTestCase(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setNotify({ type: "success", message: res.data.message });
          setImportModal({
            ishowModal: false,
            imodalData: "",
            imodalHeader: "",
          });
          loadData();
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      } else {
        setNotify({ type: "danger", message: res.data.message });
      }
      const d = res.data.data;
      let path = d.replace("\\", "");
      if (res.data.message == "File to Download!!!") {
        window.location.href = `${_attachmentUrl}` + "/" + path;
      }
    });
  };

  // Update State of Status Color
  const colorStyle = (e) => {
    if (e.target.value == "PASS") {
      setColors("green");
    } else {
      setColors("red");
    }
  };

  // Update State of Priority Color

  const priorityStyle = (e) => {
    setPriority(null);
    switch (e.target.value) {
      case "HIGH":
        setPriority("red");
        break;
      case "MEDIUM":
        setPriority("orange");
        break;
      case "LOW":
        setPriority("green");
      default:
        return "green";
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tempData = [];

    await new TestCasesService()
      .getTestCases(useSessionData.userId, ticket_id, task_id, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            let counter = 1;
            const temp = res.data.data;
            for (const key in temp) {
              tempData.push({
                index: tempData.length,
                counter: counter++,
                id: temp[key].id,
                test_case_id: temp[key].test_case_id,
                task_name: temp[key].task_name,
                testing_type: temp[key].testing_type,
                testing_type_name: temp[key].testing_type_name,
                function: temp[key].function,
                submodule: temp[key].submodule,
                platform: temp[key].platform,
                apk_version: temp[key].apk_version,
                os_version: temp[key].os_version,
                steps_to_follow: temp[key].steps_to_follow,
                test_description: temp[key].test_description,
                expected_result: temp[key].expected_result,
                actual_result: temp[key].actual_result,
                tester_comments: temp[key].tester_comments,
                tester_status: temp[key].tester_status,
                severity: temp[key].severity,
                module_name: temp[key].module_name,
                attachments: temp[key].attachments,
                is_enabled: temp[key].is_enabled,
                userId: temp[key].userId,
                script_path: temp[key].script_path,
              });
            }
            setData(null);
            setData(tempData);
            const ExportTempData = [];
            for (const key in temp) {
              ExportTempData.push({
                test_case_id: temp[key].test_case_id,
                testing_type_name: temp[key].testing_type_name,
                function: temp[key].function,
                field: temp[key].field,
                submodule: temp[key].submodule,
                platform: temp[key].platform,
                apk_version: temp[key].apk_version,
                os_version: temp[key].os_version,
                test_description: temp[key].test_description,
                expected_result: temp[key].expected_result,
                tester_comments: temp[key].tester_comments,
                severity: temp[key].severity,
                module_name: temp[key].module_name,
                script_path: temp[key].script_path,
                reviewer_comments: temp[key].reviewer_comments,
                actual_result: temp[key].actual_result,
              });
            }
            setExportData(ExportTempData);
          }
        }
      });
  };
  const [selectedRowsData, setSelectedRowsData] = useState([]);

  const [selectingRows, setSelectingRows] = useState([]);
  const [disable, setDisable] = useState([]);
  const [enable, setEnable] = useState();

  const handleSelectedRowsChange = (e) => {
    var idArray = e.selectedRows.map((d) => d.id);
    setSelectingRows(idArray);
    setSelectedRowsData(idArray);
    setDisable(e.selectedRows);
  };

  const testingTypeRef = useRef();
  const testingTypesRef = useRef();
  const severityRef = useRef();

  const handleReset = (e) => {
    if (testingTypesRef.current) {
      testingTypesRef.current.clearValue();
    }
    document.getElementById("severityy").value = "";

    if (executable == 1) {
      document.getElementById("testerr_status").value = "";
    }
    loadData();
  };

  const sendTestCasesToTestPlan = async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);
    form.append("test_case_id", selectedRowsData);

    await new TestCasesService().addToExistingTestSuite(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          // setNotify({ type: "success", message: "Test Cases Added To Test Plan" });
          history.push({
            pathname: `/${_base}/TestBank`,
            state: {
              alert: { type: "success", message: "Test Cases Added To Test Plan" },
            },
          });
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    });
  };

  const handleSendNotificationToMulti = async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);
    form.append("iteration", iterationCount + 1);
    form.append("test_case_id", selectedRowsData);

    await new TestCasesService().sendNotificationToMulti(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setSendtoModal({ showModal: false, modalData: "", modalHeader: "" });
          setNotify({ type: "success", message: res.data.message });
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    });
  };

  // const handleEnable = (row,e) =>{
  //   const updatedData = data.map((rowData) => {
  //     if (rowData.id === row.id) {
  //       return {
  //         ...rowData,
  //         selectableRowDisabled: !rowData.selectableRowDisabled, // Toggle the selectableRowDisabled property
  //       };
  //     }
  //     return rowData;
  //   });
  //   setData(updatedData);
  // }

  const toggleRowSelection = (e, rowId, row) => {
    // If rowId is already in selectedRows state, remove it, otherwise add it
    // if (selectingRows.includes(rowId)) {
    if (row.is_enabled == 0) {
      setSelectingRows(selectingRows.filter((d) => d != rowId));
    } else {
      setSelectingRows((prev) => [...prev, rowId]);
    }

  };

  // const selectableRowDisabled = (row) => {
  //   return selectingRows.includes(row.id);
  // };

  // const toggleRowSelection = (rowId) => {
  //   // If rowId is already in selectedRows state, remove it, otherwise add it
  //   if (selectingRows.includes(rowId)) {
  //     setSelectingRows(selectingRows.filter((selectedRowId) => selectedRowId !== rowId));
  //   } else {
  //     setSelectingRows([...selectingRows, rowId]);
  //   }
  // };

  const handlePaginationRowChanged = async (e, type) => {
    e.preventDefault()
    var form;
    if (type == "LIMIT") {
      const limit = parseInt(e.target.value)
      const typeOf = type
      // const currentPage = limit < 
      form = {
        limit: limit,
        // typeOf: "AssignToMe",
        page: 1
      }
    } else if (type == "MINUS") {
      // const limit = parseInt(e.target.value)
      form = {
        // limit: limit,
        // typeOf: "AssignToMe",
        page: paginationData.current_page - 1
      }
    } else if (type == "PLUS") {
      form = {
        // limit: limit,
        // typeOf: "AssignToMe",
        page: paginationData.current_page + 1
      }
    }
    await new TestCasesService()
      .getTestCases(useSessionData.userId, ticket_id, task_id, form)
      .then((res) => {
        setData(null);
        setUserTypeData(null);
        const temp = res.data.data.data;
        setPaginationData(res.data.data)
        const userType = res.data.type;
        const execution = res.data.execution;
        setIterationCount(res.data.iterationCount);
        const showBtn = res.data.show_review_btn

        const ExportTempData = [];
        const tempData = [];
        for (const key in temp) {
          tempData.push({
            index: tempData.length,
            id: temp[key].id,
            test_case_id: temp[key].test_case_id,
            task_name: temp[key].task_name,
            testing_type_name: temp[key].testing_type_name,
            testing_type: temp[key].testing_type,
            function: temp[key].function,
            field: temp[key].field,
            submodule: temp[key].submodule,
            platform: temp[key].platform,
            apk_version: temp[key].apk_version,
            os_version: temp[key].os_version,
            test_description: temp[key].test_description,
            expected_result: temp[key].expected_result,
            actual_result: temp[key].actual_result,
            tester_comments: temp[key].tester_comments,
            reviewer_comments: temp[key].reviewer_comments,
            tester_status: temp[key].tester_status,
            severity: temp[key].severity,
            module_name: temp[key].module_name,
            attachments: temp[key].attachments,
            is_enabled: temp[key].is_enabled,
            script_path: temp[key].script_path,
          });
        }
        setData((prev) => null);
        setData(tempData);
        const a = tempData.map((d, i) => {
          return d.test_case_id;
        });
        setTestCaseId(a);
        setUserTypeData(userType);
        setExecutable(execution);
        setShowReviewBtn(showBtn)
        for (const key in temp) {
          ExportTempData.push({
            test_case_id: temp[key].test_case_id,
            platform: temp[key].platform,
            apk_version: temp[key].apk_version,
            os_version: temp[key].os_version,
            function: temp[key].function,
            field: temp[key].field,
            testing_type_name: temp[key].testing_type_name,
            test_description: temp[key].test_description,
            expected_result: temp[key].expected_result,
            actual_result: temp[key].actual_result,
            tester_status: temp[key].tester_status,
            severity: temp[key].severity,
            script_path: temp[key].script_path,
            tester_comments: temp[key].tester_comments,
            reviewer_comments: temp[key].reviewer_comments,
            module_name: temp[key].module_name,
            submodule: temp[key].submodule,
          });
        }
        setExportData(ExportTempData);
      });



  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {/* Edit Functionality */}
      {notify && <Alert alertData={notify} />}
      {/* Page Header */}
      <div >
        <form
          onSubmit={handleForm}
          method="post"
          encType="multipart/form-data"
        >
          <div className="container-xxl" id="Top">
            <PageHeader
              headerTitle={
                executable == 1 ? "Test Case Execution" : "Test Cases"
              }
            />
            <div className="card mt-2"

            >
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>Script Path :</b>
                    </label>
                    {data && (
                      <input
                        type="text"
                        className="form-control"
                        id="script_path"
                        name="script_path"
                        onChange={(e) => defaultDataHandle(e)}
                        readOnly={
                          executable == 1
                            ? true
                            : false
                        }
                        defaultValue={
                          data && data[0] && data[0].script_path
                            ? data && data[0].script_path
                            : ""
                        }
                      />
                    )}

                    {!data && (
                      <input
                        type="text"
                        className="form-control"
                        id="script_path"
                        name="script_path"
                        readOnly={
                          executable == 1
                            ? true
                            : false
                        }
                        onChange={(e) => defaultDataHandle(e)}
                      />
                    )}
                  </div>

                  <div className="col-sm-3 ">
                    <label className="col-form-label">
                      <b>
                        Platform : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <select
                      required={true}
                      className="form-control form-control-1sm"
                      id="platform"
                      name="platform"
                      onChange={e => handlePlatform(e)}
                      disabled={
                        executable == 1 ? true : false
                      }
                    >
                      <option
                        value="WEBSITE"
                        selected={
                          data &&
                            data[0] &&
                            data &&
                            data[0].platform == "WEBSITE"
                            ? true
                            : false
                        }
                      >
                        WEBSITE
                      </option>
                      <option
                        value="APP"
                        selected={
                          data && data[0] && data && data[0].platform == "APP"
                            ? true
                            : false
                        }
                      >
                        APP
                      </option>

                    </select>
                  </div>




                  {platform === "APP" && (
                    <div className="col-sm-2">
                      <label className="col-form-label">
                        <b>APK Version :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="apk_version"
                        name="apk_version"
                        // defaultValue={data && data[0] && data[0].apk_version}
                        onKeyPress={(e) => Validation.NumbersSpeicalOnlyDot(e)}
                        readOnly={
                          executable == 1
                            ? true
                            : false
                        }
                        onPaste={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                      />
                    </div>
                  )}
                  {platform === "APP" && (
                    <div className="col-sm-2">
                      <label className="col-form-label">
                        <b>OS Version :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="os_version"
                        name="os_version"
                        onPaste={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        readOnly={
                          executable == 1
                            ? true
                            : false
                        }
                        // defaultValue={data && data[0] && data[0].os_version}
                        onKeyPress={(e) => Validation.NumbersSpeicalOnlyDot(e)}
                      ></input>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
          {/* Main Form */}

          {/* {userTypeData && userTypeData == "TESTER" && */}

          <div className="container-xxl">
            <div className="card mt-2">
              <div className="card-body">
                <div className="form-group row">
                  <div className="">
                    <input
                      type="hidden"
                      class="form-control form-control-sm"
                      id="ticket_id"
                      name="ticket_id"
                      value={ticket_id}
                      required
                    />

                    <input
                      type="hidden"
                      class="form-control form-control-sm"
                      id="task_id"
                      name="task_id"
                      value={task_id}
                      required
                    />
                    {copiedData && (
                      <input
                        type="hidden"
                        class="form-control form-control-sm"
                        id="id"
                        name="id"
                        defaultValue={
                          copiedData.data && copiedData.type == "EDIT"
                            ? copiedData.data.id
                            : ""
                        }
                      />
                    )}
                  </div>

                  <div className="col-sm-2 mt-2 ">
                    <label className="col-form-label">
                      <b>
                        Test Case Id :
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <input
                      type="text"
                      readOnly={true}
                      className="form-control"
                      name="test_case_id"
                      defaultValue={
                        copiedData.data && copiedData.type == "EDIT"
                          ? copiedData.data.test_case_id
                          : tId
                      }
                      required={true}
                    ></input>
                  </div>

                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>
                        Testing Type : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {testingTypeDropdown && copiedData.data && (
                      <Select
                        type="text"
                        className="form-control"
                        id="testing_type"
                        name="testing_type"
                        key={Math.random()}
                        options={testingTypeDropdown}
                        required={true}
                        ref={testingRef}
                        defaultValue={
                          copiedData.data &&
                          testingTypeDropdown.filter(
                            (d) => d.value == copiedData.data.testing_type
                          )
                        }
                        isDisabled={executable == 1 ? true : false}
                      />
                    )}

                    {testingTypeDropdown && !copiedData.data && (
                      <Select
                        type="text"
                        className="form-control"
                        id="testing_type"
                        name="testing_type"
                        options={testingTypeDropdown}
                        required={true}
                        ref={testingRef}
                        isDisabled={executable == 1 ? true : false}
                      />
                    )}
                  </div>
{console.log("test",testCaseFunction)}
                  <div className="col-sm-3 mt-2">
                    <label className="col-form-label">
                      <b>
                        Function : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {testCaseFunction && !copiedData.data &&(
                      <Select
                        className="form-control"
                        id="function"
                        name="function"
                        options={testCaseFunction}
                        required={true}
                        ref={testingFunctionRef}
                        isDisabled={executable == 1 ? true : false}
                        
                      />)
                    }


{testCaseFunction && copiedData.data &&(
                      <Select
                        className="form-control"
                        id="function"
                        name="function"
                        options={testCaseFunction}
                        required={true}
                        ref={testingFunctionRef}
                        isDisabled={executable == 1 ? true : false}
                        defaultValue={
                          copiedData.data &&
                          testCaseFunction.filter(
                            (d) => d.value == copiedData.data.function
                          )
                        }
                      />)
                    }



                   
                  </div>
                  <div className="col-sm-3 mt-2 ">
                    <label className="col-form-label">
                      <b>Field :</b>
                    </label>
                    <input
                      type="text"
                      key={Math.random()}
                      className="form-control"
                      id="field"
                      name="field"
                      readOnly={
                        executable == 1 ? true : false
                      }
                      defaultValue={
                        copiedData.data && copiedData.data.field
                          ? copiedData.data.field
                          : ""
                      }
                    ></input>
                  </div>
                  <div className="col-sm-4 mt-2">
                    <label className="col-form-label">
                      <b>
                        Test Description : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      key={Math.random()}
                      id="test_description"
                      name="test_description"
                      required={true}
                      defaultValue={
                        copiedData.data && copiedData.data.test_description
                      }
                      readOnly={
                        executable == 1 ? true : false
                      }
                    ></textarea>
                  </div>

                  <div className="col-sm-4 mt-2">
                    <label className="col-form-label">
                      <b>
                        Expected Result : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      key={Math.random()}
                      id="expected_result"
                      name="expected_result"
                      required={true}
                      defaultValue={
                        copiedData.data && copiedData.data.expected_result
                      }
                      readOnly={
                        executable == 1 ? true : false
                      }
                    ></textarea>
                  </div>
                  {executable == 1 && (
                    <div className="col-sm-4 mt-2">
                      <label className="col-form-label">
                        <b>
                          Actual Result : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="4"
                        id="actual_result"
                        key={Math.random()}
                        name="actual_result"
                        required={true}
                        defaultValue={
                          copiedData.data && copiedData.data.actual_result
                            ? copiedData.data.actual_result
                            : ""
                        }
                      ></textarea>
                    </div>
                  )}
                  <div className="col-sm-4 mt-2">
                    <label className="col-form-label">
                      <b>Tester Comment :</b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      id="tester_comments"
                      key={Math.random()}
                      name="tester_comments"
                      defaultValue={
                        copiedData.data && copiedData.data.tester_comments
                          ? copiedData.data.tester_comments
                          : ""
                      }
                    ></textarea>
                  </div>

                  {executable == 1 && (
                    <div className="col-sm-4 mt-2">
                      <label className="col-form-label">
                        <b>Reviewer Comment :</b>
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="4"
                        id="reviewer_comments"
                        key={Math.random()}
                        name="reviewer_comments"
                        defaultValue={
                          copiedData.data && copiedData.data.reviewer_comments
                            ? copiedData.data.reviewer_comments
                            : ""
                        }
                        readOnly={true}
                      ></textarea>
                    </div>
                  )}

                  {executable == 1 && (
                    <div className="col-sm-2 mt-5">
                      <label className="col-form-label">
                        <b>
                          Tester Status : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <select
                        className="form-control form-control-1sm"
                        id="tester_status"
                        name="tester_status"
                        key={Math.random()}
                        ref={testerRef}
                        required
                        defaultValue={
                          copiedData.data && copiedData.data.tester_status
                        }
                        onChange={(e) => {
                          handleTesterStatus(e);
                        }}
                      >
                        <option value=""></option>

                        <option
                          value="PASS"
                          selected={
                            copiedData.data &&
                              copiedData.data.tester_status == "PASS"
                              ? true
                              : false
                          }
                          style={{ backgroundColor: "white", color: "black" }}
                        >
                          Pass
                        </option>
                        <option
                          value="FAIL"
                          selected={
                            copiedData.data &&
                              copiedData.data.tester_status == "FAIL"
                              ? true
                              : false
                          }
                          style={{ backgroundColor: "white", color: "black" }}
                        >
                          Fail
                        </option>
                        <option
                          value="UNDER_DEVELOPMENT"
                          selected={
                            copiedData.data &&
                              copiedData.data.tester_status == "UNDER_DEVELOPMENT"
                              ? true
                              : false
                          }
                          style={{ backgroundColor: "white", color: "black" }}
                        >
                          Under Development
                        </option>
                        <option
                          value="SUGGESTION"
                          selected={
                            copiedData.data &&
                              copiedData.data.tester_status == "SUGGESTION"
                              ? true
                              : false
                          }
                          style={{ backgroundColor: "white", color: "black" }}
                        >
                          Suggestion
                        </option>
                        <option
                          value="REOPEN"
                          selected={
                            copiedData.data &&
                              copiedData.data.tester_status == "REOPEN"
                              ? true
                              : false
                          }
                          style={{ backgroundColor: "white", color: "black" }}
                        >
                          Reopen
                        </option>
                      </select>
                    </div>
                  )}

                  <div className="col-sm-2 mt-5">
                    <label className="col-form-label">
                      <b>
                        {" "}
                        Severity :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <select
                      className="form-control form-control-sm"
                      id="severity"
                      name="severity"
                      defaultValue={null}
                      key={Math.random()}
                      required
                      disabled={executable == 1 ? true : false}
                    // style={{ backgroundColor: `${priority}`, color: 'white' }}
                    >
                      <option></option>
                      <option
                        value="HIGH"
                        selected={
                          copiedData.data && copiedData.data.severity == "HIGH"
                            ? true
                            : false
                        }
                      >
                        High
                      </option>
                      <option
                        value="MEDIUM"
                        selected={
                          copiedData.data &&
                            copiedData.data.severity == "MEDIUM"
                            ? true
                            : false
                        }
                      >
                        Medium
                      </option>
                      ;
                      <option
                        value="LOW"
                        selected={
                          copiedData.data && copiedData.data.severity == "LOW"
                            ? true
                            : false
                        }
                      >
                        Low
                      </option>
                      ;
                    </select>
                  </div>

                  {executable == 1 && (
                    <div className=" col-sm-4 mt-3">
                      <label className="col-form-label">
                        <b>Screenshot :</b>
                      </label>
                      <input
                        type="file"
                        accept="image/jpg,image/jpeg,image/png, video/mp4"
                        name="attachment[]"
                        id="attachment"
                        className="form-control"
                        key={Math.random()}
                        multiple
                        onChange={maxLengthCheck}
                        ref={fileInputRef}
                        required={testerStatus === "FAIL" ? true : false}
                      // onChange={(e) => { uploadAttachmentHandler(e, "UPLOAD", '') }}
                      ></input>
                    </div>
                  )}
                  <div className="d-flex flex-row-reverse">
                    <button className=" p-2 btn btn-primary" type="button" onClick={e => resetForm(e)}>
                      Cancel
                    </button>
                    {/* {tId && JSON.stringify( tId)}
                  {tId && testCaseId &&  testCaseId.filter((d)=> d != tId) &&
                    <button
                    className=" p-2 btn btn-warning"
                    type="submit"
                    name="button_type"
                    value="SUBMIT"
                    >
                    Submit
                    </button>
                  } */}
                    {copiedData.data && copiedData.type == "EDIT" ? (
                      <button
                        className=" p-2 btn btn-warning"
                        type="submit"
                        name="button_type"
                        value="UPDATE"
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        className=" p-2 btn btn-warning"
                        type="submit"
                        name="button_type"
                        value="SUBMIT"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                  <div className="d-flex justify-content-center">
                    {data &&
                      copiedData.data &&
                      copiedData.data.index > 0 &&
                      copiedData.type == "EDIT" && (
                        <button
                          type="button"
                          className="btn btn-primary text-white"
                          onClick={(e) => {
                            handleCopiedData(
                              e,
                              "EDIT",
                              copiedData.data.index - 1
                            );
                          }}
                        >
                          <i className="icofont-arrow-left"></i>
                        </button>
                      )}

                    {data &&
                      copiedData.data &&
                      copiedData.data.index < data.length - 1 &&
                      copiedData.type == "EDIT" && (
                        <button
                          type="button"
                          className="btn btn-primary text-white"
                          onClick={(e) => {
                            handleCopiedData(
                              e,
                              "EDIT",
                              copiedData.data.index + 1
                            );
                          }}
                        >
                          <i className="icofont-arrow-right"></i>
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* }  */}

      {/* Filter search */}
      <div className="container-xxl">
        <form onSubmit={(e) => handleFilter(e)} method="post">
          <div className="card mt-2" style={{ zIndex: 10 }}>
            <div className="card-body">
              <div className="form-group row">
                <div className="col-sm-3">
                  <label>
                    <b>Testing Type:</b>
                  </label>
                  <Select
                    type="text"
                    className="form-control"
                    id="testing_type"
                    name="testing_type"
                    required={true}
                    options={testingTypeDropdown}
                    ref={testingTypesRef}
                  />
                  {/* <option value={null} disabled selected>
                      select
                    </option>
                    <option
                      value="PASS"
                      style={{ backgroundColor: "white", color: "black" }}
                    >
                      Pass
                    </option>
                    <option
                      value="FAIL"
                      style={{ backgroundColor: "white", color: "black" }}
                    >
                      Fail
                    </option>
                    <option
                      value="UNDER_DEVELOPMENT"
                      style={{ backgroundColor: "white", color: "black" }}
                    >
                      Under Development
                    </option>
                    <option
                      value="SUGGESTION"
                      style={{ backgroundColor: "white", color: "black" }}
                    >
                      Suggestion
                    </option>
                  </select> */}
                </div>

                <div className="col-sm-3">
                  <label>
                    <b>Function:</b>
                  </label>
                  <Select
                    type="text"
                    className="form-control"
                    id="testing_type"
                    name="testing_type"
                    required={true}
                    options={testCaseFunction}
                    ref={testCaseFunction}
                  />
                  </div>


                <div className="col-sm-2 mt-2">
                  <label>
                    <b>Severity:</b>
                  </label>
                  <select
                    className="form-control form-control-sm"
                    ref={severityRef}
                    id="severityy"
                    name="severity"
                  >
                    <option></option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                {executable == 1 && (
                  <div className="col-sm-3 mt-2">
                    <label>
                      <b>Tester Status :</b>
                    </label>
                    <select
                      className="form-control form-control-sm"
                      id="testerr_status"
                      name="tester_status"
                    >
                      <option value=""></option>

                      <option value="PASS">Pass</option>
                      <option value="FAIL">Fail</option>
                      <option value="UNDER_DEVELOPMENT">
                        Under Development
                      </option>
                      <option value="SUGGESTION">Suggestion</option>
                      <option value="REOPEN">Reopen</option>
                    </select>
                  </div>
                )}
                <div className="col-md-2 mt-2">
                  <button
                    className="btn btn-sm btn-warning text-white"
                    type="submit"
                    style={{ marginTop: "20px", fontWeight: "600" }}
                  >
                    <i className="icofont-search-1 "></i> Search
                  </button>
                  <button
                    className="btn btn-sm btn-info text-white"
                    type="button"
                    onClick={() => handleReset()}
                    style={{ marginTop: "20px", fontWeight: "600" }}
                  >
                    <i className="icofont-refresh text-white"></i> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* Data Table */}
      <div className='container-xxl'>
        <div className='card mt-2'>
          <div className='card-body'>
            <div className='row clearfix g-3'>
              <div className='col-sm-12'>
                {data && (
                  <span
                    style={{
                      color: 'red',
                      fontWeight: 'bold',
                      fontStyle: 'italic'
                    }}
                  >
                    Note: User Can Send TestCases For Review only once{' '}
                  </span>
                )}
                <div className='d-flex flex-row-reverse'>
                  {userTypeData === 'TESTER' && executable == 0 && (
                    <div>
                      <a
                        href="http://3.108.206.34/2_Testing/TSNewBackend/public/TestCases/downloadSampleFormat.csv"
                        className="btn btn-warning"
                        download
                      >
                        <i class="icofont-download"></i> Download Format File
                      </a>

                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={(e) => {
                          handleImportModal({
                            ishowModal: true,
                            imodalData: "",
                            imodalHeader: "Import Test Case",
                          });
                        }}
                      >
                        <i class="icofont-upload-alt"></i> Import
                      </button>
                    </div>
                  )}

                  <ExportToExcel
                    className="btn btn-sm btn-danger"
                    apiData={exportData}
                    fileName="Test Cases"
                  />

                  <div>
                    {executable === 1 && (
                      <button
                        className="btn btn-warning "
                        type="button"
                        onClick={() => {
                          handleSendtoModal({
                            showModal: true,
                            modalData: "",
                            modalHeader: "Assign Test Cases To",
                          });
                        }}
                      >
                        Send To <i className="icofont-sign-in" />
                      </button>
                    )}
                  </div>
                  <div>
                    <form method="post" onSubmit={sendTestCasesForReview}>
                      <div>
                        {executable == 0 && showreviewBtn == 1 && (
                          <button disabled={sentReview == true ? true : false} className="btn  btn-primary" type="submit">
                            Review <i className="icofont-sign-in" />
                          </button>
                        )}


                      </div>

                      <div>
                        <input
                          type="hidden"
                          id="ticket_id"
                          name="ticket_id"
                          value={ticket_id}
                        />
                      </div>
                      <div>
                        <input
                          type="hidden"
                          id="task_id"
                          name="task_id"
                          value={task_id}
                        />
                      </div>
                    </form>
                    {executable == 0 && showreviewBtn == 0 && (
                      <form
                        method="post"
                        onSubmit={sendTestCasesToTestPlan}
                      >
                        {data &&
                          <button
                            className="btn btn-primary"
                            type="submit"
                          >
                            Add To Test Plan <i className="icofont-sign-in" />
                          </button>
                        }
                      </form>
                    )}
                  </div>
                </div>
                <div>
                  {data && (
                    <DataTable
                      columns={columns}
                      defaultSortField="title"
                      data={data}
                      conditionalRowStyles={conditionalRowStyles}
                      expandableRows={true}
                      selectableRows={true}
                      onSelectedRowsChange={handleSelectedRowsChange} // handle selection of rows
                      // onSelectedRowsChange={selectTest}
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      expandableRowsComponent={ExpandedComponent}
                      // selectableRowDisabled={selectableRowDisabled} // add the selectableRowDisabled prop
                      responsive={true}
                      onRowClicked={(e, row) => toggleRowSelection(e, row.id)} // Call toggleRowSelection when a row is clicked
                    />
                  )}
                  <div className="back-to-top pull-right mt-2 mx-2">
                    <label className="mx-2">
                      rows per page
                    </label>
                    <select onChange={e => { handlePaginationRowChanged(e, "LIMIT") }} className="mx-2">
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="40">40</option>

                    </select>
                    {paginationData &&
                      <small>{paginationData.from}-{paginationData.to} of {paginationData.total}</small>
                    }
                    <button onClick={e => { handlePaginationRowChanged(e, "MINUS") }} className="mx-2"><i className="icofont-arrow-left"></i></button>
                    <button onClick={e => { handlePaginationRowChanged(e, "PLUS") }}><i className="icofont-arrow-right"></i></button>
                  </div>
                </div>
                {/* import test cases modal */}
                <Modal
                  centered
                  show={importModal.ishowModal}
                  size="sm"
                  onHide={(e) => {
                    handleImportModal({
                      ishowModal: false,
                      imodalData: "",
                      imodalHeader: "",
                    });
                  }}
                >
                  <form
                    method="post"
                    onSubmit={handleimportTestCase}
                    encType="multipart/form-data"
                    ref={formRef}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title className="fw-bold">
                        {modal.modalHeader}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="">
                        <input
                          type="hidden"
                          class="form-control form-control-sm"
                          id="test_case_id"
                          name="test_case_id"
                          value={
                            data &&
                            data.map((e) => {
                              return e.test_case_id;
                            })
                          }
                          required
                        />
                        <input
                          type="hidden"
                          class="form-control form-control-sm"
                          id="ticket_id"
                          name="ticket_id"
                          value={ticket_id}
                          required
                        />
                        <input
                          type="hidden"
                          id="created_by"
                          name="created_by"
                          value={userSessionData.userId}
                        />

                        <input
                          type="hidden"
                          id="tenant_id"
                          name="tenant_id"
                          value={userSessionData.tenantId}
                        />

                        <input
                          type="hidden"
                          class="form-control form-control-sm"
                          id="task_id"
                          name="task_id"
                          value={task_id}
                          required
                        />
                      </div>

                      <div className=" col-sm ">
                        <label className="col-form-label">
                          <b>Upload Excel/CSV File :</b>
                        </label>
                        <input
                          type="file"
                          name="attachment"
                          id="attachment"
                          accept=".xlsx, .xls, .csv"
                          className="form-control"
                        ></input>
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary"
                        style={{ backgroundColor: "#484C7F" }}
                      >
                        Import
                      </button>
                    </Modal.Footer>
                  </form>
                </Modal>
                {/* import test cases modal  end */}

                {/* send to modal */}
                <Modal
                  size="md"
                  centered
                  show={sendtoModal.showModal}
                  onHide={(e) => {
                    handleSendtoModal({
                      showModal: false,
                      modalData: "",
                      modalHeader: "",
                    });
                  }}
                >
                  <form method="post" onSubmit={handleSendNotificationToMulti}>
                    <Modal.Header closeButton>
                      <Modal.Title className="fw-bold">
                        {sendtoModal.modalHeader}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="container">
                        <div className="deadline-form ">
                          <div className="form-group row ">
                            <input
                              type="hidden"
                              name="ticket_id"
                              id="ticket_id"
                              value={ticket_id}
                            />
                            <div className="col-md">
                              <label className="col-form-label">
                                <b>Send To:</b>
                              </label>
                              {ba && (
                                <Select
                                  className="form-control"
                                  name="user_id[]"
                                  id="user_id"
                                  isMulti
                                  options={ba}
                                />
                              )}
                            </div>
                            {/* <div className="col-sm-8">
                              <label className="col-form-label"><b>Developer:</b></label>
                              {dev &&
                              <Select 
                              className="form-control"
                              name="developer_id"
                              id="developer_id"
                              options={dev}
                              /> */}
                            {/* } */}

                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
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
                        onClick={(e) => {
                          handleSendtoModal({
                            showModal: false,
                            modalData: "",
                            modalHeader: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </Modal.Footer>
                  </form>
                </Modal>
                {/* send to modal end */}
              </div>
            </div>
          </div>
        </div>
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
    </>
  );
};

export default TestCases;
