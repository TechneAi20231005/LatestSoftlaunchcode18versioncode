import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import TestCasesService from "../../../../services/TicketService/TestCaseService";
import {
  _base,
  _attachmentUrl,
  _apiUrl,
  userSessionData,
} from "../../../../settings/constants";
import PageHeader from "../../../../components/Common/PageHeader";
import Alert from "../../../../components/Common/Alert";
import { Dropdown, Modal } from "react-bootstrap";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import ErrorLogService from "../../../../services/ErrorLogService";
import TesttingTypeServices from "../../../../services/MastersService/TestingTypeService";
import { ExportToExcel } from "../../../../components/Utilities/Table/ExportToExcel";
import { object } from "prop-types";
const TestCasesReviewerView = ({ match }) => {
  const history = useNavigate();

  const ticketId = match.params.ticketId;
  const taskId = match.params.taskId;
  const [sendtoModal, setSendtoModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [sendtoTestSuiteModal, setsendtoTestSuiteModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [addToExistingSuiteModal, setaddToExistingSuiteModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [createNewTestSuiteModal, setcreateNewTestSuiteModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [notify, setNotify] = useState(null);
  const handleSendtoModal = (data) => {
    setSendtoModal(data);
  };

  const handleSendtoTestSuiteModal = (suiteData) => {
    setsendtoTestSuiteModal(suiteData);
  };

  const handleAddToExistingSuiteModal = (existingSuiteData) => {
    setaddToExistingSuiteModal(existingSuiteData);
  };

  const handleCreateSuiteModal = (createSuiteData) => {
    setcreateNewTestSuiteModal(createSuiteData);
  };
  const [data, setData] = useState();
  const [approvedStatus, setApprovedStatus] = useState();

  const [editingRowId, setEditingRowId] = useState(null);
  const [styleColor, setStyleColor] = useState();

  const [testSuiteDropdown, setTestSuiteDropdown] = useState();
  const [ExportData, setExportData] = useState();
  const [isReviewer, setIsReviewer] = useState()
  const [testingTypeDropdown, setTestingTypeDropdown] = useState();
  const [testCaseFunction, setTestCaseFunction] = useState();

  const[paginationData, setPaginationData] = useState()
  const loadData = async () => {
    let counter = 1;
    await new TestCasesService()
      .getTestCases(userSessionData.userId, ticketId, taskId)
      .then((res) => {
        setData(null);
        const temp = res.data.data.data;
        const ExportTempData = [];
        const userType = res.data.type;
        const execution = res.data.execution;
        setPaginationData(res.data.data)
        setIsReviewer(res.data.show_review_btn)
        const tempData = [];
        for (const key in temp) {
          tempData.push({
            counter: counter++,
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
            severity: temp[key].severity,
            priority: temp[key].priority,
            module_name: temp[key].module_name,
            attachments: temp[key].attachments,
            approved_status: temp[key].approved_status,
            userId: temp[key].userId,
          });
        }
        setData(tempData);

        for (const key in temp) {
          ExportTempData.push({
            test_case_id: temp[key].test_case_id,
            task_name: temp[key].task_name,
            testing_type_name: temp[key].testing_type_name,
            function: temp[key].function,
            field: temp[key].field,
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
            submodule: temp[key].submodule,
            // is_disabled: false,
          });
        }
        setExportData(ExportTempData);
      });

    await new TesttingTypeServices().getAlltestingType().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          var temp = res.data.data.filter(d=> d.is_active == 1)
           temp = res.data.data.map((d) => ({
            value: d.id,
            label: d.testing_type,
          }));
          setTestingTypeDropdown(temp);
        }
      }
    });

    
    // called To show the Function field aptions - Asmita Margaje
    await new TestCasesService()
      .getTestcasesFunction()
      .then((res) => {
        var temFunction = res.data.data

        setTestCaseFunction(temFunction.map(d => ({
          value: d.id,
          label: d.function,
        })));

      })

    await new TestCasesService().getAllTestSuites().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data;
          setTestSuiteDropdown(
            temp.map((d) => ({ value: d.id, label: d.testsuit_name }))
          );
        }
      }
    });
  };

  const handlePaginationRowChanged = async (e, type)=>{
    e.preventDefault()
    var form;
    if(type == "LIMIT"){
      const limit = parseInt(e.target.value)
      const typeOf = type
      // const currentPage = limit < 
       form = {
        limit: limit,
        // typeOf: "AssignToMe",
        page: 1
      }
    }else if(type == "MINUS"){
      // const limit = parseInt(e.target.value)
       form = {
        // limit: limit,
        // typeOf: "AssignToMe",
        page: paginationData.current_page -1
      }
    } else if( type == "PLUS"){
       form = {
        // limit: limit,
        // typeOf: "AssignToMe",
        page: paginationData.current_page +1
      }
    }
    await new TestCasesService()
    .getTestCases(userSessionData.userId, ticketId, taskId)
    .then((res) => {
      setData(null);
      const temp = res.data.data.data;
      const ExportTempData = [];
      const userType = res.data.type;
      const execution = res.data.execution;
      setIsReviewer(res.data.show_review_btn)
      const tempData = [];
      for (const key in temp) {
        tempData.push({
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
          severity: temp[key].severity,
          priority: temp[key].priority,
          module_name: temp[key].module_name,
          attachments: temp[key].attachments,
          approved_status: temp[key].approved_status,
          userId: temp[key].userId,
        });
      }
      setData(tempData);

      for (const key in temp) {
        ExportTempData.push({
          test_case_id: temp[key].test_case_id,
          task_name: temp[key].task_name,
          testing_type_name: temp[key].testing_type_name,
          function: temp[key].function,
          field: temp[key].field,
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
          submodule: temp[key].submodule,
          // is_disabled: false,
        });
      }
      setExportData(ExportTempData);
    });
  }

  const handleAutoChange = async (e, type, rowId, nameField) => {
    if (e) {
      var value = null;
      if (type === "TOGGLE_BUTTON") {
        value = e.target.checked;

        if (value == true) {
          value = 1;
        } else {
          value = 2;
        }
        setStyleColor(value);
      } else {
        value = e.target.value;

      }
      setData((prev) => {
        var newPrev = [...prev];
        if (newPrev[rowId]) {
          // Check if newPrev[rowId] is defined
          newPrev[rowId][nameField] = value;
        }
        return newPrev;
      });
    }
  };

  const handleRowClicked = (row) => {
    setEditingRowId(row.id);
  };

  const sendTestCasesToTester = async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);
    form.append("test_case_id", selectedRowsData);
    await new TestCasesService()
      .getAssignTestCasesToTesters(form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setNotify({ type: "success", message: res.data.message });
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
          loadData();
        }
      });
  };
  const columns = [
    {
      name: "Action",
      width: "170px",
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        // row.is_disabled == false &&
        <div className="btn-group " role="group">
          {/* <button type="button" style={{ borderRadius: "20px",marginRight:"5px" }}
            // onClick={(e) => {
            //   handleCopiedData(e, row, "add")
            // }}
            >
            <i class="icofont-plus-circle"></i> </button>
          <button
            type="button"
            style={{ borderRadius: "20px", marginRight:"5px" }}
            className="btn btn-sm btn-info "
            // onClick={(e) => {
            //   handleCopiedData(e, row, "edit")
            // }}
          >
            <i class="icofont-edit text-white"></i>
          </button> */}

          <Link
            to={`/${_base}/TestCaseHistory/` + row.id}
            className="btn btn-sm btn-danger text-white"
            style={{ borderRadius: "20px", fontSize: "15px" }}
          >
            <i class="icofont-history"></i>
          </Link>
        </div>
      ),
    },
    {
      name: " Approved Status",
      cell: (row) => (
        <div
          class="form-check form-switch"
          //  onClick={() => handleEnabledChange(row.id)}
        >
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            // key={Math.random()}
            name="approved_status"
            id="approved_status"
            defaultChecked={row.approved_status == 2 ? false : true}
            // defaultChecked={row.approved_status == 0 ? true :false}
            onBlur={(e) => {
              updateForm(e, row.counter - 1);
            }}
            onChange={(e) => {
              handleAutoChange(
                e,
                "TOGGLE_BUTTON",
                row.counter - 1,
                "approved_status"
              );
              // updateForm(e, row.counter - 1);

            }}
          />
        </div>
      ),
    },
    {
      name: "Test Case Id",
      selector: (row) => row.test_case_id,
      sortable: true,
    },

    {
      name: "Testing Type",
      width: "300px",
      selector: (row) => (
        <div>
          <select
            className="col-md"
            type="text"
            id="testing_type"
            key={Math.random()}
            name="testing_type"
            style={{ borderStyle: "none" }}
            disabled={row.approved_status == 2}
            DataTa
            onChange={(e) =>
              {handleAutoChange(
                e,
                "TESTINGTYPE",
                row.counter - 1,
                "testing_type"
              );updateForm(e, row.counter - 1);}
            }
            // onBlur={(e) => {
              
            // }}
          >
            {testingTypeDropdown &&
              testingTypeDropdown.map((d, i) => {
                return (
                  <option
                    value={d.value}
                    selected={d.value == row.testing_type ? "selected" : ""}
                  >
                    {d.label}
                  </option>
                );
              })}
          </select>
        </div>
      ),
      // row.testing_type, sortable: true
    },

    {
      name: "Function",
      width: "300px",
      selector: (row) => (
        <div>
          <select
            className="col-md"
            type="text"
            id="function"
            key={Math.random()}
            name="function"
            style={{ borderStyle: "none" }}
            disabled={row.approved_status == 2}
            DataTa
            onChange={(e) =>
              {handleAutoChange(
                e,
                "TESTINGTYPE",
                row.counter - 1,
                "function"
              );updateForm(e, row.counter - 1);}
            }
            // onBlur={(e) => {
              
            // }}
          >
            {testCaseFunction &&
              testCaseFunction.map((d, i) => {
                return (
                  <option
                    value={d.value}
                    selected={d.value == row.function ? "selected" : ""}
                  >
                    {d.label}
                  </option>
                );
              })}
          </select>
        </div>
      ),
      // row.testing_type, sortable: true
    },


    // {
    //   name: "Function",
    //   width: "220px",
    //   selector: (row) => (
    //     <div>
    //       <input
    //         className="col-md"
    //         value={row.function}
    //         type="text"
    //         id="function"
    //         name="function"
    //         style={{ borderStyle: "none" }}
    //         readOnly={row.approved_status == 2? true: false}
    //         onChange={(e) =>
    //           handleAutoChange(e, "FUNCTION", row.counter - 1, "function")
    //         }
    //         onBlur={(e) => {
    //           updateForm(e, row.counter - 1);
    //         }}
    //       />
    //     </div>
    //   ),
    //   // row.testing_type, sortable: true
    // },
    {
      name: "Field",
      width: "220px",
      selector: (row) => (
        <div>
          <input
            className="col-md"
            value={row.field}
            type="text"
            id="field"
            name="field"
            style={{ borderStyle: "none" }}
            readOnly={row.approved_status == 2? true: false}

            onChange={(e) =>
              handleAutoChange(e, "FUNCTION", row.counter - 1, "field")
            }
            onBlur={(e) => {
              updateForm(e, row.counter - 1);
            }}
          />
        </div>
      ),
      // row.testing_type, sortable: true
    },

    {
      name: "Platform",
      width: "220px",
      selector: (row) => row.platform,
      // <div>
      //   <input
      //     className="col-md"
      //     value={row.platform}
      //     type="text"
      //     id="platform"
      //     name="platform"
      //     style={{ borderStyle: "none" }}
      //     onChange={(e) =>
      //       handleAutoChange(e, "FUNCTION", row.counter - 1, "platform")
      //     }
      //     onBlur={(e) => {
      //       updateForm(e, row.counter - 1);
      //     }}
      //   />
      // </div>

      // row.testing_type, sortable: true
    },
    {
      name: "APK_version",
      width: "220px",
      selector: (row) => 
      row.apk_version, sortable: true
    },
    {
      name: "Os_version",
      width: "220px",
      selector: (row) => 
      row.os_version, sortable: true
    },
    {
      name: "Test Description",
      width: "220px",
      selector: (row) => (
        <div>
          <textarea
            className="col-md"
            value={row.test_description}
            type="text"
            rows="10"
            id="test_description"
            name="test_description"
            style={{ borderStyle: "none" }}
            readOnly={row.approved_status == 2? true: false}

            onChange={(e) =>
              handleAutoChange(
                e,
                "FUNCTION",
                row.counter - 1,
                "test_description"
              )
            }
            onBlur={(e) => {
              updateForm(e, row.counter - 1);
            }}
          />
        </div>
      ),
      // row.testing_type, sortable: true
    },
    {
      name: "Expected Result",
      width: "220px",
      selector: (row) => (
        <div>
          <textarea
            className="col-md"
            value={row.expected_result}
            type="text"
            id="expected_result"
            readOnly={row.approved_status == 2? true: false}
            rows="10"
            name="expected_result"
            style={{ borderStyle: "none" }}
            onChange={(e) =>
              handleAutoChange(
                e,
                "FUNCTION",
                row.counter - 1,
                "expected_result"
              )
            }
            onBlur={(e) => {
              updateForm(e, row.counter - 1);
            }}
          />
        </div>
      ),
      // row.testing_type, sortable: true
    },

    {
      name: "Tester Comments",
      width: "220px",
      selector: (row) => (
        <div>
          <input
            className="col-md"
            value={row.tester_comments}
            type="text"
            style={{ borderStyle: "none" }}
            readOnly={(row.approved_status == 2 || isReviewer == 1)  ? true: false}

            id="tester_comments"
            name="tester_comments"
            onChange={(e) =>
              handleAutoChange(
                e,
                "FUNCTION",
                row.counter - 1,
                "tester_comments"
              )
            }
            onBlur={(e) => {
              updateForm(e, row.counter - 1);
            }}
          />

        </div>
      ),
      // row.testing_type, sortable: true
    },

    {
      name: "Reviewer Comments",
      width: "220px",
      selector: (row) => (
        <div>
          <input
            className="col-md"
            value={row.reviewer_comments}
            type="text"
            style={{ borderStyle: "none" }}
            readOnly={row.approved_status == 2? true: false}

            id="reviewer_comments"
            name="reviewer_comments"
            onChange={(e) =>
              handleAutoChange(
                e,
                "FUNCTION",
                row.counter - 1,
                "reviewer_comments"
              )
            }
            onBlur={(e) => {
              updateForm(e, row.counter - 1);
            }}
          />
        </div>
      ),
      // row.testing_type, sortable: true
    },

    {
      name: "Severity",
      width: "220px",
      selector: (row) => (
        <div>
          <select
            className="col-md"
            value={row.severity}
            type="text"
            id="severity"
            key={Math.random()}
            name="severity"
            style={{ borderStyle: "none" }}
            disabled={row.approved_status == 2? true: false}

            onChange={(e) => {
              handleAutoChange(e, "SEVERITY", row.counter - 1, "severity");
              updateForm(e, row.counter - 1);
            }}
            // onBlur={(e) => {
              
            // }}
          >
            <option selected={row.severity == "HIGH"} value="HIGH">
              High
            </option>
            <option selected={row.severity == "MEDIUM"} value="MEDIUM">
              Medium
            </option>
            ;
            <option selected={row.severity == "LOW"} value="LOW">
              Low
            </option>
            ;
          </select>
        </div>
      ),
      // row.testing_type, sortable: true
    },

    {
      name: "Priority",
      width: "220px",
      selector: (row) => (
        <div>
          <select
            className="col-md"
            type="text"
            id="priority"
            name="priority"
            value={row.priority}
            style={{ borderStyle: "none" }}
            disabled={row.approved_status == 2? true: false}

            // defaultValue={row.priority}
            onChange={(e) => {
              handleAutoChange(e, "PRIORITY", row.counter - 1, "priority");
              updateForm(e, row.counter - 1);
            }}
            // onBlur={(e) => {updateForm(e, row.counter - 1);
            // }}
          >
            <option
              selected={row.priority === "LOW" ? true : false}
              value="LOW"
            >
              Low
            </option>
            ;
            <option
              selected={row.priority === "MEDIUM" ? true : false}
              value="MEDIUM"
            >
              Medium
            </option>
            ;
            <option
              selected={row.priority === "HIGH" ? true : false}
              value="HIGH"
            >
              High
            </option>
          </select>
        </div>
      ),
      // row.testing_type, sortable: true
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.approved_status == 2,
      style: {
        backgroundColor: "#D3D3D3 ",
        color: "white",
        fontWeight: "bold",
      },
    },
  ];

  const handleFilter = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tempData = [];

    await new TestCasesService()
      .getTestCases(userSessionData.userId, ticketId, taskId, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            let counter = 1;
            const temp = res.data.data;
            console.log("res",res.data.data.data)
            for (const key in temp) {
              tempData.push({
                counter: counter++,
                id: temp[key].id,
                test_case_id: temp[key].test_case_id,
                task_name: temp[key].task_name,
                testing_type_name: temp[key].testing_type_name,

                testing_type: temp[key].testing_type,
                field: temp[key].field,
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
                reviewer_comments: temp[key].reviewer_comments,
                tester_status: temp[key].tester_status,
                severity: temp[key].severity,
                module_name: temp[key].module_name,
                attachments: temp[key].attachments,
                is_disabled: false,
                userId: temp[key].userId,
                approved_status: temp[key].approved_status,
              });
            }
            setData(null);
            setData(tempData);
          }
        }
      });
  };

  const [selectedRowsData, setSelectedRowsData] = useState([]);

  const handleSelectedRowsChange = (e) => {
    var idArray = e.selectedRows.map((d) => d.id);
    setSelectedRowsData(idArray);
  };

  const handleSendtoTester = async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);
    form.append("test_case_id", selectedRowsData);
  };

  const updateForm = async (e, index) => {
    var tempData = data[index];
    const form = new FormData();
    Object.keys(tempData).map((key) => {
      if (
        key != "counter" &&
        key != "is_disabled" &&
        key != "attachments" &&
        key != "task_name" &&
        key != "userId" &&
        key != "reviewer_status" &&
        key != "status" &&
        key != "role" &&
        key != "testing_type_name"
      ) {
        const value = tempData[key] || ""; // Use empty string if value is falsy
        form.append(key, value);
      }
    });

    await new TestCasesService()
      .updateTestCases(tempData.id, form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1)
            // setNotify({ type: 'success', message: res.data.message })
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

  const createNewTestSuite = async (e) => {
    setNotify(null);
    e.preventDefault();
    const form = new FormData(e.target);
    await new TestCasesService().createTestSuite(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setNotify({ type: "success", message: res.data.message });
          setcreateNewTestSuiteModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
          });
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    });
  };

  const addToExistingTestSuite = async (e) => {
    setNotify(null);
    e.preventDefault();
    const form = new FormData(e.target);
    form.append("test_case_id", selectedRowsData);

    await new TestCasesService().addToExistingTestSuite(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setNotify({ type: "success", message: res.data.message });
          history.push({
            pathname: `/${_base}/TestBank`,
            state: {
              alert: { type: "success", message: res.data.message },
            },
          });
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    });
  };

  const sendTestCasesToTestPlan = async (e) => {
    setNotify(null);
    e.preventDefault();
    const form = new FormData(e.target);
    form.append("test_case_id", selectedRowsData);

    await new TestCasesService().addToExistingTestSuite(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setNotify({ type: "success", message: res.data.message });
          history.push({
            pathname: `/${_base}/TestBank`,
            state: {
              alert: { type: "success", message: res.data.message },
            },
          });
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    });
  };

  // const a = (e) =>{
  //   const b = data && data.map((e,i)=>{
  //     if(e.approved_status == 2){
  //       setApprovedStatus(false)
  //     }
  //   })
  // }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <PageHeader headerTitle="Test Cases" />
      {notify && <Alert alertData={notify} />}
      {/* Modal For send to tester */}
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
        <form method="post" onSubmit={handleSendtoTester}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {sendtoModal.modalHeader}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <div className="deadline-form ">
                <div className="form-group row ">
                  <div className="col-sm-8">
                    <label className="col-form-label">Send To:</label>
                    <select className="form-control">
                      <option>Tester</option>
                      <option>Test Suite</option>
                    </select>
                  </div>
                  <div className="col-sm-8">
                    <label className="col-form-label">Remark:</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </form>
      </Modal>
      {/* Modal For send to tester */}

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
                    <span className="px-2">Add to existing test suite</span>
                    <label className="fancy-checkbox parsley-error" />
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
                    <span className="px-2">Create New Test Suite</span>
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

            <button type="button" className="btn btn-danger text-white">
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
      {/* Modal For Create Test Suite */}

      <div className="container-xxl">
        <form onSubmit={handleFilter} method="post">
          <div className="card mt-2" style={{ zIndex: 10 }}>
            <div className="card-body">
              <div className="form-group row">
                <input
                  type="hidden"
                  id="reviewed"
                  name="reviewed"
                  value="reviewed"
                />
                <div className="col-sm-3">
                  <label>
                    <b>Testing Type:</b>
                  </label>
                  <Select
                    className="form-control form-control-sm"
                    id="testing_type"
                    name="testing_type"
                    options={testingTypeDropdown}
                  />
                </div>


                <div className="col-sm-3">
                  <label>
                    <b>Function:</b>
                  </label>
                  <Select
                    className="form-control form-control-sm"
                    id="function"
                    name="function"
                    options={testCaseFunction}
                  />
                </div>

                <div className="col-sm-3">
                  <label>
                    <b>Severity:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="severity"
                    name="severity"
                  >
                    <option value={null}></option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

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
                    onClick={() => window.location.reload(false)}
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
      <div className="container-xxl">
        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                <div className="d-flex flex-row-reverse">
                  <Dropdown className="d-inline-flex m-1">
                    <Dropdown.Toggle
                      as="button"
                      variant=""
                      className="btn btn-primary p-1"
                    >
                      <i className="icofont-navigation-menu">Send To</i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="border-0 shadow p-0">
                      <ul>
                        <li>
                          <form
                            method="POST"
                            onSubmit={sendTestCasesToTester}
                            encType="multipart/form-data"
                          >
                            <div>
                              <input
                                type="hidden"
                                name="ticket_id"
                                id="ticket_id"
                                value={ticketId}
                              />

                              <input
                                type="hidden"
                                name="task_id"
                                id="task_id"
                                value={taskId}
                              />
                              <button
                                style={{ width: "90%" }}
                                className="btn btn-primary "
                                type="submit"
                                id="button"
                                name="button"
                                // onClick={() => { handleSendtoModal({ showModal: true, modalData: "", modalHeader: "Assign Test Cases To" }) }}
                              >
                                Tester <i className="icofont-sign-in" />
                              </button>
                            </div>
                          </form>
                        </li>
                        <li>
                          <form
                            method="post"
                            onSubmit={sendTestCasesToTestPlan}
                          >
                            <button
                              style={{ width: "90%" }}
                              className="btn btn-warning"
                              type="submit"
                              // onClick={(e) => {
                              //   handleSendtoTestSuiteModal({
                              //     showModal: true,
                              //     modalData: "",
                              //     modalHeader: "Test Suite",
                              //   });
                              // }}
                            >
                              Test Plan <i className="icofont-sign-in" />
                            </button>
                          </form>
                        </li>
                      </ul>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="d-flex flex-row-reverse">
                  <ExportToExcel
                    className="btn btn btn-danger p-1"
                    apiData={ExportData}
                    fileName="Test Cases"
                  />
                </div>

                {data && (
                  <>
                  <DataTable
                    columns={columns}
                    data={data}
                    selectableRows
                    onSelectedRowsChange={handleSelectedRowsChange} // handle selection of rows
                    conditionalRowStyles={conditionalRowStyles}
                    onRowClicked={handleRowClicked}
                  />
                  <div className="back-to-top pull-right mt-2 mx-2">
                        <label className="mx-2">
                            rows per page
                        </label>
                        <select onChange={e=>{handlePaginationRowChanged(e,"LIMIT")}} className="mx-2">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>

                        </select>
                        { paginationData &&
                        <small>{paginationData.from}-{paginationData.to} of {paginationData.total}</small>
                        }
                        <button onClick={e=>{handlePaginationRowChanged(e,"MINUS")}} className="mx-2"><i className="icofont-arrow-left"></i></button>
                        <button onClick={e=>{handlePaginationRowChanged(e,"PLUS")}}><i className="icofont-arrow-right"></i></button>
                  </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCasesReviewerView;
