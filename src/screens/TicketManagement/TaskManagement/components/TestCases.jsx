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
import TestCasesService from "../../../../services/TicketService/TestCaseService";
import PageHeader from "../../../../components/Common/PageHeader";
import { Astrick } from "../../../../components/Utilities/Style";
import { ExportToExcel } from "../../../../components/Utilities/Table/ExportToExcel";
import ErrorLogService from "../../../../services/ErrorLogService";
import Alert from "../../../../components/Common/Alert";
import { Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import * as Validation from "../../../../components/Utilities/Validation";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import TestingTypeServices from "../../../../services/MastersService/TestingTypeService";
import DataTableExtensions from "react-data-table-component-extensions";

import Select from "react-select";
const TestCases = ({ match }) => {
  // All THE STATES ARE MENTIONED
  // Getting the ticket ID from URL parameters
  const { ticketId, taskId, moduleId } = useParams();
  const ticket_id = ticketId;
  // Getting the task ID from URL parameters
  const task_id = taskId;
  // Getting the module ID from URL parameters
  const module_id = moduleId;

  // State for the testing type dropdown
  const [testingTypeDropdown, setTestingTypeDropdown] = useState();

  // State for the "tId" (seems to be a test ID)
  const [tId, setTId] = useState("");

  // State for holding general data
  const [data, setData] = useState(null);

  // State for controlling colors (possibly for UI)
  const [colors, setColors] = useState("green");

  // State for controlling priority (possibly for UI)
  const [priority, setPriority] = useState("white");

  // State for notifications
  const [notify, setNotify] = useState(null);

  // State for the platform
  const [platform, setPlatform] = useState("");

  // State for selected files
  const [selectedFile, setSelectedFile] = useState([]);

  // State for attachment data
  const [attachment, setAttachment] = useState([]);

  // State for ticket data
  const [ticketData, setTicketData] = useState();

  // State for module data
  const [moduleData, setModuleData] = useState();

  // State for module dropdown options
  const [moduleDropdown, setModuleDropdown] = useState();

  // State for submodule data
  const [submoduleData, setSubmoduleData] = useState();

  // State for submodule dropdown options
  const [submoduleDropdown, setSubmoduleDropdown] = useState();

  // A ref for file input
  const fileInputRef = useRef(null);

  // A ref for a form
  const formRef = useRef();

  // State for attachments
  const [attach, setAttach] = useState(null);

  // State for checking if something is selected
  const [isselected, setIsselectd] = useState(false);

  // State for user type data
  const [userTypeData, setUserTypeData] = useState(null);

  // State for tester status
  const [testerStatus, setTesterStatus] = useState();

  // State for temporary show
  const [tempshow, setTempshow] = useState(false);

  // State for executability
  const [executable, setExecutable] = useState();

  // State for copied data
  const [copiedData, setCopiedData] = useState({ type: null, data: null });

  // State for checking if the user is a reviewer
  const [isReviewer, setIsReviewer] = useState(null);

  // A ref for the tester
  const testerRef = useRef(null);

  // State for business analyst data
  const [ba, setBa] = useState(null);

  // State for developer data
  const [dev, setDev] = useState(null);

  // State for ownership data
  const [ownership, setOwnership] = useState();

  // State for selected rows' data
  const [selectedRowsData, setSelectedRowsData] = useState([]);

  // State for selecting rows
  const [selectingRows, setSelectingRows] = useState([]);

  // State for disabling certain elements
  const [disable, setDisable] = useState([]);

  // State for enabling certain elements
  const [enable, setEnable] = useState();

  // State for exported data
  const [exportData, setExportData] = useState();

  // State for test suite dropdown options
  const [testSuiteDropdown, setTestSuiteDropdown] = useState();

  // State for showing a loader
  const [showLoader, setShowLoader] = useState();

  // State for reviewing status
  const [sentReview, setSentReview] = useState(false);

  // State for showing review button
  const [showreviewBtn, setShowReviewBtn] = useState();

  // State for iteration count
  const [iterationCount, setIterationCount] = useState();

  // State for showing a loader modal
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  // State for the test case ID
  const [testCaseId, setTestCaseId] = useState();

  // State for the 'send to Modal'
  const [sendtoModal, setSendtoModal] = useState({
    showModal: false, // Flag indicating whether the modal should be shown
    modalData: "", // Data to be displayed in the modal
    modalHeader: "", // Header/title for the modal
  });

  // State for the general 'modal'
  const [modal, setModal] = useState({
    showModal: false, // Flag indicating whether the modal should be shown
    modalData: "", // Data to be displayed in the modal
    modalHeader: "", // Header/title for the modal
  });

  // State for the 'import Modal'
  const [importModal, setImportModal] = useState({
    ishowModal: false, // Flag indicating whether the modal should be shown
    imodalData: "", // Data to be displayed in the modal
    imodalHeader: "", // Header/title for the modal
  });

  // State for the 'add to Existing Suite' modal
  const [addToExistingSuiteModal, setaddToExistingSuiteModal] = useState({
    showModal: false, // Flag indicating whether the modal should be shown
    modalData: "", // Data to be displayed in the modal
    modalHeader: "", // Header/title for the modal
  });

  // State for the 'create New Test Suite' modal
  const [createNewTestSuiteModal, setcreateNewTestSuiteModal] = useState({
    showModal: false, // Flag indicating whether the modal should be shown
    modalData: "", // Data to be displayed in the modal
    modalHeader: "", // Header/title for the modal
  });

  // State for the 'send to Test Suite' modal
  const [sendtoTestSuiteModal, setsendtoTestSuiteModal] = useState({
    showModal: false, // Flag indicating whether the modal should be shown
    modalData: "", // Data to be displayed in the modal
    modalHeader: "", // Header/title for the modal
  });

  // Initializing state using the useState hook with default data.
  const [defaultData, setDefaultData] = useState({
    script_path: null, // Initializing the script_path property with a null value.
  });
  // STATES ENDS

  // This function is used to handle sending data to the 'send to Test Suite' modal.
  const handleSendtoTestSuiteModal = (suiteData) => {
    setsendtoTestSuiteModal(suiteData); // Set the data for the 'send to Test Suite' modal.
  };

  // This function is used to handle adding data to the 'add to Existing Suite' modal.
  const handleAddToExistingSuiteModal = (existingSuiteData) => {
    setaddToExistingSuiteModal(existingSuiteData); // Set the data for the 'add to Existing Suite' modal.
  };

  // This function is used to handle creating a new suite in the 'create Suite' modal.
  const handleCreateSuiteModal = (createSuiteData) => {
    setcreateNewTestSuiteModal(createSuiteData); // Set the data for the 'create Suite' modal.
  };

  // A ref for a single testing type
  const testingTypeRef = useRef();

  // A ref for multiple testing types (possibly an array)
  const testingTypesRef = useRef();

  // A ref for severity (presumably related to the severity of a task or issue)
  const severityRef = useRef();

  // A ref for testingType
  const testingRef = useRef();

  // Function to handle showing the 'send to Modal' with specified data
  const handleSendtoModal = (data) => {
    setSendtoModal(data); // Set the 'send to Modal' data to the provided data
  };

  // Object to store session-related data retrieved from sessionStorage
  const useSessionData = {
    userId: sessionStorage.getItem("id"), // Get the 'id' value from sessionStorage and store it in userId
  };

  // Function to handle showing the general 'modal' for edit forms with specified data
  const handleModal = (data) => {
    setModal(data); // Set the 'modal' data to the provided data
  };

  // Function to handle showing the 'import Modal' with specified data
  const handleImportModal = (data) => {
    setImportModal(data); // Set the 'import Modal' data to the provided data
  };

  // Function to handle updating the default data with a new value based on input event
  const defaultDataHandle = (e) => {
    setDefaultData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, // Update the specific property in 'defaultData' with the new value
    }));
  };

  // Function to handle selecting a platform
  const handlePlatform = (e) => {
    setPlatform(e.target.value); // Update the selected platform based on the event's target value
  };

  // Function to handle copying data based on the provided parameters
  const handleCopiedData = (e, buttonType, index) => {
    if (e) {
      // Check if the event is provided
      setData((prev) => null); // Clear the current data (setting it to null)
      setData(data); // Set the data back to its original value (effectively a no-op)

      // Set the copied data and its type based on the provided index
      setCopiedData((prev) => ({
        type: buttonType,
        data: data[index],
      }));
    }
  };

  // Function to handle selecting a tester status
  const handleTesterStatus = (e) => {
    if (testerRef.current.value === "FAIL") {
      setTesterStatus(false); // Set the tester status to false if the value is 'FAIL'
    } else {
      setTesterStatus(true); // Set the tester status to true for other values
    }
  };

  // Component to render attachments in an expandable view
  const ExpandedComponent = ({ data }) => (
    <pre>
      <Table style={{ width: "30%" }}>
        <thead>
          <tr>
            <th>Sr</th>
            <th>Attachment Name</th>
            <th>Action</th>
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

  // Comments explain that this component renders attachments in a table.
  // The attachments are accessed from the 'data' prop.
  // Each attachment is listed with its name and a link to view the attachment.

  // Function to update the 'is_enabled' field of a test case
  const updateEnable = async (e, index) => {
    var value;
    if (e) {
      if (e.target.checked == true) {
        value = 1; // Set value to 1 if the checkbox is checked
      } else {
        value = 0; // Set value to 0 if the checkbox is unchecked
      }
    }

    var tempData = data[index]; // Get the test case data at the provided index

    const form = new FormData();
    form.append("is_enabled", value); // Add the updated 'is_enabled' value to the form

    // Iterate through each key in tempData and append its value to the form
    Object.keys(tempData).map((key) => {
      if (
        // Skip certain keys while appending to the form
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
        key !== "approved_status"
      ) {
        const value = tempData[key] || ""; // Use empty string if value is falsy
        form.append(key, value);
      }
    });

    // Update the test case using the updated form data
    await new TestCasesService()
      .updateTestCases(tempData.id, form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            loadData(); // Reload data on success
            // setNotify({ type: 'success', message: res.data.message })
            //loadData();
          }
        } else {
          setNotify({ type: "danger", message: res.data.message });

          // Log an error if the update fails
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

        // Log an error in case of an error during the update
        new ErrorLogService().sendErrorLog(
          "TestCase",
          "Create_TestCases",
          "INSERT",
          errorObject.data.message
        );
      });
  };

  // Function to reset form fields based on the provided event
  const resetForm = (e) => {
    if (e) {
      // Check if the testingRef is available
      if (testingRef.current) {
        testingRef.current.clearValue(); // Clear the value of the testingRef component
      }

      // Clear the values of specific form fields using their IDs
      document.getElementById("function").value = "";
      document.getElementById("field").value = "";
      document.getElementById("test_description").value = "";
      document.getElementById("expected_result").value = "";

      // Check if 'executable' is 1 (presumably indicating executable test)
      if (executable == 1) {
        document.getElementById("actual_result").value = ""; // Clear actual result field
      }

      document.getElementById("tester_comments").value = "";

      // Check if 'executable' is 1 (presumably indicating executable test)
      if (executable == 1) {
        document.getElementById("reviewer_comments").value = ""; // Clear reviewer comments field
        document.getElementById("tester_status").value = ""; // Clear tester status field
      }

      document.getElementById("severity").value = "";

      // Check if 'executable' is 1 (presumably indicating executable test)
      if (executable == 1) {
        document.getElementById("attachment").value = ""; // Clear attachment field
      }
    }
  };

  // Load All Data and Render
  const loadData = async () => {
    setShowLoaderModal(null);
    setShowLoaderModal(true);

    const data = []; // Initialize an empty array called "data" to store test case data

    await getLastId(); // Call a function to get the last ID

    // Fetch test cases using TestCasesService
    await new TestCasesService()
      .getTestCases(useSessionData.userId, ticket_id, task_id)
      .then((res) => {
        setData(null); // Clear existing data
        setUserTypeData(null); // Clear existing user type data

        const temp = res.data.data.data; // Get the test case data from the API response
        const userType = res.data.type; // Get the user type from the API response
        const execution = res.data.execution; // Get the execution data from the API response

        // Set various pieces of data using values from the API response
        setIterationCount(res.data.iterationCount);
        const showBtn = res.data.show_review_btn;

        const ExportTempData = []; // Initialize an empty array for temporary export data
        const tempData = []; // Initialize an empty array for temporary test case data

        // Loop through each test case in the response and extract relevant properties
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
            approved_status: temp[key].approved_status,
          });
        }

        setData((prev) => null); // Clear the current data
        setData(tempData); // Set the new test case data

        const a = tempData.map((d, i) => {
          return d.test_case_id;
        });

        setTestCaseId(a); // Set the test case IDs

        setUserTypeData(userType); // Set the user type data
        setExecutable(execution); // Set the execution data
        setShowReviewBtn(showBtn); // Set the show review button data
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

    // Fetch all testing types data
    await new TestingTypeServices().getAlltestingType().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          var temp = res.data.data.filter((d) => d.is_active == 1);
          setTestingTypeDropdown(
            temp.map((d) => ({
              value: d.id,
              label: d.testing_type,
            })) // Create testing type dropdown options
          );
        }
      }
    });

    // Fetch designated dropdown data based on ticket ID
    await new TestCasesService()
      .getdesignatedDropdown(ticket_id)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setShowLoaderModal(false);
            const deta = res.data.data.ALL;
            setBa(
              deta
                .filter(
                  (d) => d.is_active == 1 && d.id != userSessionData.userId
                )
                .map((d) => ({
                  value: d.id,
                  label: d.first_name + "-" + d.last_name,
                })) // Create designated dropdown options
            );
          }
        }
      });
  };

  // Columns for DataTable
  const columns = [
    ...(executable !== 1
      ? [
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
                    // key={Math.random}
                    // onBlur={e=>updateEnable(e, row.index)}
                    defaultChecked={row.is_enabled == 1 ? true : false} // Check if row is in selectedRows state
                    onChange={(e) => {
                      toggleRowSelection(e, row.id, row);
                      updateEnable(e, row.index);
                    }}
                  />
                )}
              </div>
            ),
          },
        ]
      : []),

    {
      name: "Action",
      selector: (row) => {},
      sortable: false,
      width: "100px",
      cell: (row) => (
        // row.is_disabled == false &&
        <div className="btn-group " role="group">
          {executable == 0 && (
            <a href="#Top" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  borderRadius: "10px",
                  marginRight: "5px",
                  marginTop: "3px",
                }}
                disabled={row.is_enabled == 0}
                onClick={(e) => {
                  handleCopiedData(e, "ADD", row.index);
                  window.scrollTo({ top: 0, behavior: "smooth" });
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
      name: "Function",
      selector: (row) => row.function,
      sortable: true,
      width: "100px",
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
                  {row.function && row.function.length < 30
                    ? row.function
                    : row.function.substring(0, 30) + "...."}
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
      width: "150px",
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
                  {row.field && row.field.length < 30
                    ? row.field
                    : row.field.substring(0, 30) + "...."}
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
      width: "120px",
    },

    {
      name: "Description",
      selector: (row) => row.test_description,
      sortable: true,
      width: "300px",
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
                <span className="ms-1">{row.test_description}</span>
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
      width: "300px",

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.expected_result && (
            <OverlayTrigger overlay={<Tooltip>{row.expected_result} </Tooltip>}>
              <div>
                <span className="ms-1"> {row.expected_result}</span>
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
      width: "200px",

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.actual_result && (
            <OverlayTrigger overlay={<Tooltip>{row.actual_result} </Tooltip>}>
              <div>
                <span className="ms-1"> {row.actual_result}</span>
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
      name: "Tester Comments",
      selector: (row) => row.tester_comments,
      sortable: true,
      width: "200px",

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.tester_comments && (
            <OverlayTrigger overlay={<Tooltip>{row.tester_comments} </Tooltip>}>
              <div>
                <span className="ms-1"> {row.tester_comments}</span>
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
      width: "200px",
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.reviewer_comments && (
            <OverlayTrigger
              overlay={<Tooltip>{row.reviewer_comments} </Tooltip>}
            >
              <div>
                <span className="ms-1"> {row.reviewer_comments}</span>
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
  ];

  const conditionalRowStyles = [
    // Apply styles to rows where is_enabled is 0
    {
      when: (row) => row.is_enabled == 0,
      style: {
        backgroundColor: "#D3D3D3", // Set background color for disabled rows
        fontWeight: "bold", // Make text bold for disabled rows
      },
    },
  ];

  // Define Data of Table Data
  const tableData = {
    columns,
    data,
  };

  // Function to fetch and set the last TestCase Id
  const getLastId = async () => {
    // Call TestCasesService to fetch the last TestCase Id
    await new TestCasesService().getLastId(ticket_id, task_id).then((res) => {
      if (res.status === 200) {
        setTId(res.data); // Set the fetched last TestCase Id
      }
    });
  };

  // Function to send selected test cases for review
  const sendTestCasesForReview = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setNotify(null); // Clear any existing notifications
    const form = new FormData(e.target); // Create a new FormData object from the form

    form.append("test_case_id", selectedRowsData); // Append selected test case data to the form
    await new TestCasesService().getReviewTestCases(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setSentReview(true); // Set flag to indicate successful submission for review
          setNotify({ type: "success", message: res.data.message }); // Set success notification
        } else {
          setNotify({ type: "danger", message: res.data.message }); // Set error notification
        }
      }
    });
  };

  // Function to check the maximum length of uploaded attachments
  const maxLengthCheck = (e) => {
    if (e.target.files.length > 5) {
      // Check if the number of uploaded files exceeds 5
      alert("You Can Upload Only 5 Attachments"); // Display an alert
      document.getElementById("attachment").value = null; // Clear the file input value
    }
  };

  // Function to handle form submission
  const handleForm = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    var flag = 1;
    setNotify(null); // Clear any existing notifications
    const form = new FormData(e.target); // Create a new FormData object from the form
    var button_type = e.target.button_type.value; // Get the button type from the form
    var response = null;

    // Check if Testing Type has been selected
    if (testingRef.current.commonProps.hasValue == false) {
      alert("Please select Testing Type");
      flag = 0;
    }

    // Continue if all conditions are met
    if (flag == 1) {
      if (button_type == "UPDATE") {
        response = new TestCasesService().updateTestCases(
          form.getAll("id"),
          form
        ); // Update test cases if button type is 'UPDATE'
      } else {
        response = new TestCasesService().postTestCases(form); // Post new test cases if button type is not 'UPDATE'
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
            // Update page navigation based on copied data index
            setNotify({ type: "success", message: res.data.message }); // Set success notification
            loadData(); // Reload the data
            if (
              copiedData.data.index !== null &&
              data &&
              copiedData.data.index < data.length - 1 &&
              button_type == "UPDATE"
            ) {
              document.getElementById("plus1").click();
            } else if (copiedData.data.index > 0 && button_type == "UPDATE") {
              document.getElementById("minus1").click();
            } else {
            }

            // Clear form inputs after successful submission
            // ...
          } else {
            setNotify({ type: "danger", message: res.data.message }); // Set error notification
          }
        } else {
          setNotify({ type: "danger", message: res.data.message }); // Set error notification
          // Log the error
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

  // Function to handle importing Test Case from Excel
  const handleimportTestCase = async (e) => {
    setShowLoaderModal(null); // Clear existing loader modal status
    setShowLoaderModal(true); // Show loader modal
    e.preventDefault(); // Prevent the default form submission behavior
    const form = new FormData(e.target); // Create a new FormData object from the form
    setNotify(null); // Clear any existing notifications

    // Call TestCasesService to upload Test Case from Excel
    await new TestCasesService().uploadTestCase(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setShowLoaderModal(false); // Hide loader modal
          setNotify({ type: "success", message: res.data.message }); // Set success notification
          setImportModal({
            ishowModal: false,
            imodalData: "",
            imodalHeader: "",
          }); // Close the import modal
          loadData(); // Reload the data
        } else {
          setNotify({ type: "danger", message: res.data.message }); // Set error notification
          setShowLoaderModal(false); // Hide loader modal
        }
      } else {
        setNotify({ type: "danger", message: res.data.message }); // Set error notification
        setShowLoaderModal(false); // Hide loader modal
      }

      // Process data to handle downloading if needed
      const d = res.data.data;
      let path = d.replace("\\", "");
      if (res.data.message == "File to Download!!!") {
        // Redirect to download the file
        window.location.href = `${_attachmentUrl}` + "/" + path;
      }
    });
  };

  // Function to handle test case filtering
  const handleFilter = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(e.target); // Create a new FormData object from the form
    const tempData = []; // Initialize an array to store filtered data

    // Call TestCasesService to get filtered test cases
    await new TestCasesService()
      .getTestCases(useSessionData.userId, ticket_id, task_id, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            let counter = 1;
            const temp = res.data.data;

            // Process the filtered data and populate the tempData array
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

            // Update state with filtered data
            setData(null);
            setData(tempData);

            // Process data for export
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

            // Update export data state
            setExportData(ExportTempData);
          }
        }
      });
  };

  // Function to handle changes in selected rows
  const handleSelectedRowsChange = (e) => {
    // Extract IDs from the selected rows
    var idArray = e.selectedRows.map((d) => d.id);

    // Update state with the array of selected row IDs
    setSelectingRows(idArray);

    // Update state with the array of selected row IDs for data processing
    setSelectedRowsData(idArray);

    // Update the 'disable' state with the selected rows
    setDisable(e.selectedRows);
  };

  // Function to handle form reset
  const handleReset = (e) => {
    // Clear selected testing types using the ref
    if (testingTypesRef.current) {
      testingTypesRef.current.clearValue();
    }

    // Reset severity value
    document.getElementById("severityy").value = "";

    // Reset tester status value if applicable
    if (executable == 1) {
      document.getElementById("testerr_status").value = "";
    }

    // Reload the data to reset the filter
    loadData();
  };

  // Function to handle sending notifications to multiple recipients
  const handleSendNotificationToMulti = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setNotify(null); // Clear any existing notifications
    const form = new FormData(e.target); // Create a new FormData object from the form
    form.append("iteration", iterationCount + 1); // Append iteration count
    form.append("test_case_id", selectedRowsData); // Append selected test case IDs

    // Call TestCasesService to send notifications to multiple recipients
    await new TestCasesService().sendNotificationToMulti(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setSendtoModal({ showModal: false, modalData: "", modalHeader: "" }); // Close the send-to modal
          setNotify({ type: "success", message: res.data.message }); // Set success notification
        } else {
          setNotify({ type: "danger", message: res.data.message }); // Set error notification
        }
      }
    });
  };

  // Function to toggle the selection state of a row
  const toggleRowSelection = (e, rowId, row) => {
    // Check if the row is disabled (is_enabled == 0)
    if (row.is_enabled == 0) {
      // If the row is disabled, remove its ID from the selectingRows state
      setSelectingRows(selectingRows.filter((d) => d != rowId));
    } else {
      // If the row is enabled, toggle its ID in the selectingRows state
      // This adds the ID if it's not present, or removes it if it's already present
      setSelectingRows((prev) => [...prev, rowId]);
    }
  };
  // get test suite data
  const getTestSuite = async (e) => {
    // Fetch all test suites data
    await new TestCasesService().getAllTestSuites().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const temp = res.data.data;
          setTestSuiteDropdown(
            temp.map((d) => ({ value: d.id, label: d.testsuit_name })) // Create test suite dropdown options
          );
        }
      }
    });
  };
  // Function to add selected test cases to an existing test suite
  const addToExistingTestSuite = async (e) => {
    setNotify(null); // Clear any existing notifications
    e.preventDefault(); // Prevent the default form submission behavior
    const form = new FormData(e.target); // Create a new FormData object from the form
    form.append("test_case_id", selectedRowsData); // Append selected test case IDs

    // Call TestCasesService to add test cases to an existing test suite from reviewer
    await new TestCasesService()
      .addToExistingTestSuiteFromReviewer(form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            // Set success notification and close relevant modals
            setNotify({ type: "success", message: res.data.message });
            setsendtoTestSuiteModal({
              showModal: false,
              modalData: "",
              modalHeader: "",
            });
            setaddToExistingSuiteModal({
              showModal: false,
              modalData: "",
              modalHeader: "",
            });
          } else {
            // Set error notification
            setNotify({ type: "danger", message: res.data.message });
          }
        }
      });
  };

  // Function to create a new test suite
  const createNewTestSuite = async (e) => {
    setNotify(null); // Clear any existing notifications
    e.preventDefault(); // Prevent the default form submission behavior
    const form = new FormData(e.target); // Create a new FormData object from the form

    // Call TestCasesService to create a new test suite
    await new TestCasesService().createTestSuite(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          // Set success notification and close the modal
          setNotify({ type: "success", message: res.data.message });
          setcreateNewTestSuiteModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
          });
          loadData(); // Reload data to update the view
        } else {
          // Set error notification
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    });
  };

  // UseEffect block to load data when the component mounts
  useEffect(() => {
    loadData(); // Load initial data
  }, []);
  const paginationComponentOptions = {
    selectAllRowsItem: true, // Enable the "Select All" option
    selectAllRowsItemText: "All", // Text for the "Select All" option
  };
  return (
    <>
      {/* Edit Functionality */}
      {notify && <Alert alertData={notify} />}
      {/* Page Header */}
      <div>
        <form onSubmit={handleForm} method="post" encType="multipart/form-data">
          <div className="container-xxl" id="Top">
            <PageHeader
              headerTitle={
                executable == 1 ? "Test Case Execution" : "Test Cases"
              }
            />
            <div className="card mt-2">
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
                        readOnly={executable == 1 ? true : false}
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
                        readOnly={executable == 1 ? true : false}
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
                      onSelect={handlePlatform}
                      disabled={executable == 1 ? true : false}
                    >
                      <option value="">Select...</option>
                      <option selected={platform == "WEBSITE"} value="WEBSITE">
                        WEBSITE
                      </option>
                      <option selected={platform == "APP"} value="APP">
                        APP{" "}
                      </option>
                    </select>
                  </div>

                  {platform && platform == "APP" && (
                    <div className="col-sm-2">
                      <label className="col-form-label">
                        <b>APK Version :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="apk_version"
                        name="apk_version"
                        onKeyPress={(e) => Validation.NumbersSpeicalOnlyDot(e)}
                        readOnly={executable == 1 ? true : false}
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
                  {platform && platform == "APP" && (
                    <div className="col-sm-2">
                      <label className="col-form-label">
                        <b>OS Version :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="os_version"
                        name="os_version"
                        q
                        onPaste={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        readOnly={executable == 1 ? true : false}
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

                  <div className="col-sm-3 mt-2">
                    <label className="col-form-label">
                      <b>
                        Function : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <input
                      type="text"
                      key={Math.random()}
                      className="form-control"
                      id="function"
                      name="function"
                      required={true}
                      readOnly={executable == 1 ? true : false}
                      defaultValue={
                        copiedData.data && copiedData.data.function
                          ? copiedData.data.function
                          : ""
                      }
                    />
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
                      readOnly={executable == 1 ? true : false}
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
                      readOnly={executable == 1 ? true : false}
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
                      readOnly={executable == 1 ? true : false}
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
                        onSelect={(e) => {
                          handleTesterStatus(e);
                        }}
                      >
                        <option value=""></option>

                        <option
                          value="PASS"
                          selected={
                            copiedData?.data &&
                            copiedData?.data.tester_status == "PASS"
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
                            copiedData?.data &&
                            copiedData?.data.tester_status == "FAIL"
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
                            copiedData?.data &&
                            copiedData?.data.tester_status ==
                              "UNDER_DEVELOPMENT"
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
                            copiedData?.data &&
                            copiedData?.data.tester_status == "SUGGESTION"
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
                            copiedData?.data &&
                            copiedData?.data.tester_status == "REOPEN"
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
                      ></input>
                    </div>
                  )}
                  <div className="d-flex flex-row-reverse">
                    <button
                      className=" p-2 btn btn-primary"
                      type="button"
                      onClick={(e) => resetForm(e)}
                    >
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
                          id="minus1"
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
                          id="plus1"
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
                <div className="col-sm-4">
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

                <div className="col-sm-3 mt-2">
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
      <div className="container-xxl">
        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {data && (
                  <span
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    Note: User Can Send TestCases For Review only once{" "}
                  </span>
                )}
                <div className="d-flex flex-row-reverse">
                  {userTypeData === "TESTER" && executable == 0 && (
                    <div>
                      <a
                        href="http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/TestCases/downloadSampleFormat.csv"
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
                          <button
                            disabled={sentReview == true ? true : false}
                            className="btn  btn-primary"
                            type="submit"
                          >
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
                      <button
                        className="btn  btn-warning"
                        type="button"
                        onClick={() => {
                          handleSendtoTestSuiteModal({
                            showModal: true,
                            modalData: "",
                            modalHeader: "Test Suite ",
                          });
                          getTestSuite();
                        }}
                      >
                        Test Suite <i className="icofont-sign-in" />
                      </button>
                    )}
                  </div>
                </div>
                <div></div>

                {data && (
                  <DataTableExtensions {...tableData}>
                    <DataTable
                      columns={columns}
                      defaultSortField="title"
                      data={data}
                      pagination
                      conditionalRowStyles={conditionalRowStyles}
                      expandableRows={true}
                      selectableRows={true}
                      paginationComponentOptions={paginationComponentOptions}
                      onSelectedRowsChange={handleSelectedRowsChange} // handle selection of rows
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      expandableRowsComponent={ExpandedComponent}
                      responsive={true}
                      onRowClicked={(e, row) => toggleRowSelection(e, row.id)} // Call toggleRowSelection when a row is clicked
                    />
                  </DataTableExtensions>
                )}
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

                {/* modal for send to test suite */}
                <Modal
                  size="md"
                  centered
                  show={sendtoTestSuiteModal.showModal}
                  onHide={(e) => {
                    handleSendtoTestSuiteModal({
                      showModal: false,
                      modalData: "",
                      modalHeader: "",
                    });
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">
                      {sendtoTestSuiteModal.modalHeader}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="container">
                      <div className="deadline-form ">
                        <div className="form-group row ">
                          <div className="row" style={{ fontSize: "16px" }}>
                            <div className="col-sm-2"></div>
                            <div className="col-sm-16 mt-2">
                              <label class="fancy-checkbox parsley-error" />
                              <input
                                type="radio"
                                required=""
                                key={Math.random()}
                                id="existing_test_suite"
                                name="new_test_suite"
                                value="EXISTING"
                                onClick={() => {
                                  handleAddToExistingSuiteModal({
                                    showModal: true,
                                    modalData: "",
                                    modalHeader: "Add to Existing Test Suite",
                                  });
                                }}
                              />
                              <span class="px-2">
                                Add To Existing Test Suite
                              </span>
                              <label class="fancy-checkbox parsley-error" />
                              <input
                                type="radio"
                                required=""
                                key={Math.random()}
                                id="new_test_suite"
                                name="new_test_suite"
                                value="NEW"
                                onClick={() => {
                                  handleCreateSuiteModal({
                                    showModal: true,
                                    modalData: "",
                                    modalHeader: "Create Test Suite",
                                  });
                                }}
                              />
                              <span class="px-2">Create New Test Suite</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
                {/* modal for send to test suite */}

                {/* Modal For Add to Existing Test Suite */}
                <Modal
                  size="md"
                  centered
                  show={addToExistingSuiteModal.showModal}
                  onHide={(e) => {
                    handleAddToExistingSuiteModal({
                      showModal: false,
                      modalData: "",
                      modalHeader: "",
                    });
                  }}
                >
                  <form method="post" onSubmit={addToExistingTestSuite}>
                    <Modal.Header closeButton>
                      <Modal.Title className="fw-bold">
                        {addToExistingSuiteModal.modalHeader}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="container">
                        <div className="deadline-form">
                          <div className="form-group row ">
                            <div className="col-sm-12">
                              <label className="col-form-label">
                                <b>Select Test Suite</b>
                              </label>
                              {testSuiteDropdown && (
                                <Select
                                  className="form-control center"
                                  name="testsuit_id"
                                  id="testsuit_id"
                                  options={testSuiteDropdown}
                                />
                              )}
                            </div>
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
                          handleAddToExistingSuiteModal({
                            showModal: false,
                            modalData: "",
                            modalHeader: "",
                          });
                          handleSendtoTestSuiteModal({
                            showModal: true,
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
                {/* Modal For Add to Existing Test Suite */}

                {/* Modal For Create Test Suite */}
                <Modal
                  size="md"
                  centered
                  show={createNewTestSuiteModal.showModal}
                  onHide={(e) => {
                    handleCreateSuiteModal({
                      showModal: false,
                      modalData: "",
                      modalHeader: "",
                    });
                  }}
                >
                  <form
                    method="post"
                    onSubmit={createNewTestSuite}
                    encType="multipart/form-data"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title className="fw-bold">
                        {createNewTestSuiteModal.modalHeader}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="container">
                        <div className="deadline-form">
                          <div className="form-group row ">
                            <div className="col-sm-12">
                              <label className="col-form-label">
                                <b>Test Suite Name:</b>
                              </label>
                              <input
                                className="form-control center"
                                type="text"
                                required
                                id="testsuit_name"
                                name="testsuit_name"
                              />
                            </div>
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
                          handleCreateSuiteModal({
                            showModal: false,
                            modalData: "",
                            modalHeader: "",
                          });
                          handleSendtoTestSuiteModal({
                            showModal: true,
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
                {/* Modal For Create Test Suite */}
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
      </div>
    </>
  );
};

export default TestCases;
