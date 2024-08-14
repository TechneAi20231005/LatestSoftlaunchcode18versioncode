import React, { useEffect, useState, useRef } from "react";
import {
  _base,
  _attachmentUrl,
  _apiUrl,
  userSessionData,
} from "../../../../settings/constants";
import { Modal } from "react-bootstrap";
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
import { Link, useParams } from "react-router-dom";
import MyTicketService from "../../../../services/TicketService/MyTicketService";
import ModuleService from "../../../../services/ProjectManagementService/ModuleService";
import SubModuleService from "../../../../services/ProjectManagementService/SubModuleService";
import * as Validation from "../../../../components/Utilities/Validation";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Select from "react-select";
import DesignationService from "../../../../services/MastersService/DesignationService";
import ProjectService from "../../../../services/ProjectManagementService/ProjectService";

const TestSuiteComponent = ({ match, location }) => {
  // const ticketId = match.params.id;
  const {id}=useParams()

  const ticketId = id


  const [data, setData] = useState(null);
  const [userTypeData, setUserTypeData] = useState(null);
  const [notify, setNotify] = useState(null);
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [projectData, setProjectData] = useState();
  const [projectDropdown, setProjectDropdown] = useState();

  const [moduleData, setModuleData] = useState();
  const [moduleDropdown, setModuleDropdown] = useState();

  const [subModuleData, setSubModuleData] = useState();
  const [subModuleDropdown, setSubModuleDropdown] = useState();

  const [sendtoModal, setSendtoModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const [colors, setColors] = useState("green");
  const [priority, setPriority] = useState("white");

  const [taskDropdown, setTaskDropdown] = useState();
  const handleSendtoModal = (data) => {
    setSendtoModal(data);
  };
  const [showInput, setShowInput] = useState(false);
  const handleUpdateClick = () => {
    setShowInput(true);
  };

  const [showTestSuite, setTestSuite] = useState(false);
  const handleTestSuite = () => {
    setTestSuite(true);
  };

  const columns = [
    // {
    //   name: "Action",
    //   selector: (row) => {},
    //   sortable: false,
    //   cell: (row) =>
    //     row.is_disabled == false && (
    //       <div className="btn-group" role="group">

    //         <Link
    //           to={`/${_base}/TestCaseHistory/` + row.id}
    //           className="btn btn-sm btn-danger text-white"
    //           style={{ borderRadius: "20px", fontSize: "15px" }}
    //         >
    //           <i class="icofont-history"></i>
    //         </Link>
    //       </div>
    //     ),
    // },
    {
      name: "Test Case Id",
      selector: (row) => row.test_case_id,
      sortable: true,
    },

    // {
    //   name: "Task Name",
    //   width: "250px",
    //   selector: (row) => row.task_name,
    // },
    {
      name: "Testing Type",
      selector: (row) => row.testing_type,
      sortable: true,
    },
    { name: "Module", selector: (row) => row.module_name, sortable: true },
    { name: "Sub Module", selector: (row) => row.submodule, sortable: true },
    { name: "Platform", selector: (row) => row.platform, sortable: true },
    { name: "APK Version", selector: (row) => row.apk_version, sortable: true },
    { name: "Os Version", selector: (row) => row.os_version, sortable: true },
    { name: "Steps", selector: (row) => row.steps_to_follow, sortable: true },
    {
      name: "Description",
      selector: (row) => row.test_description,
      sortable: true,
    },
    {
      name: "Expected Result",
      selector: (row) => row.expected_result,
      sortable: true,
    },
    {
      name: "Actual Result",
      selector: (row) => row.actual_result,
      sortable: true,
    },
    {
      name: "Tester Comments",
      selector: (row) => row.tester_comments,
      sortable: true,
    },
    {
      name: "Tester Status",
      selector: (row) => row.tester_status,
      sortable: true,
    },
    { name: "Severity", selector: (row) => row.severity, sortable: true },
  ];

  const tableData = {
    columns,
    data,
  };

  const useSessionData = {
    userId: localStorage.getItem("id"),
  };

  const [testSuiteDropdown, setTestSuiteDropdown] = useState();
  const [tester, setTester] = useState();
  const [ticketIdDropdown, setticketIdDropdown] = useState();
  // Load All Data and Render
  const loadData = async () => {
    const data = [];




    await new TestCasesService().getAllTestSuites().then((res)=>{
        if(res.status === 200){
            if(res.data.status == 1){

                const temp = res.data.data;
                setTestSuiteDropdown(
                  temp.map((d) => ({ value: d.id, label: d.testsuit_name }))
                );            }
        }
    })

    await new ProjectService().getProject().then(res => {
      if (res.status === 200) {
          if (res.data.status == 1) {
            const temp = res.data.data
              setProjectData(res.data.data)

             setProjectDropdown( temp.map((d) => ({ value: d.id, label: d.project_name })))
            }
      }
  })

  await new TestCasesService().getAllTicketId().then((res)=>{
    if(res.status ===200){
        if(res.data.status == 1){
            const temp = res.data.data;
            setticketIdDropdown(
              temp.map((d) => ({ value: d.id, label: d.ticket_id }))
            );           }
    }
  })

  await new ModuleService().getModule().then((res) => {
      if (res.status === 200) {
          if (res.data.status === 1) {
              setModuleData(res.data.data);
              setModuleDropdown(res.data.data.map(d => ({ value: d.id, label: d.module_name })));
          }
      }
  })

  await new SubModuleService().getSubModule().then((res) => {
      if (res.status === 200) {
          if (res.data.status === 1) {
              setSubModuleData(res.data.data);
              setSubModuleDropdown(res.data.data.map(d => ({ value: d.id, label: d.sub_module_name })));
          }
      }
  })



      await new DesignationService().getdesignatedDropdown().then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            var deta = res.data.data
            setTester(deta.TESTER.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name  })));
          }
        }
      })
  };

  const selectTest = (selectedRows) => {
    //  var ids = selectedRows.selectedRows.map(d=> d.id == selectedRows.is_disabled)
    //  console.log(ids);
    var ids = selectedRows.selectedRows.map((d) => d.id);

    var a = data;
    //  a.forEach((d,i)=>{
    //     if(ids.includes(d.id)){
    //         a[i].is_disabled =  !a[i].is_disabled;
    //     }
    //  })

    var temp = data.map((d, i) => (ids.includes(d.id) ? i : "x"));

    temp = temp.filter((d) => d != "x");

    //  setData(null);
    //  setData(a);

    temp.forEach((d) => {
      data[d].is_disabled = true;
      setData([...data]);
    });

    // data[itemIndex].quantity = nextItems[itemIndex].quantity + 1;
    // this.setState([...nextItems]);

    //  var a= data.map(d => ids.includes(d.id) ? {...d,"is_disabled"=true} : {...d,is_disabled=false});
    // console.log(a);

    //  setData(prev => (
    //         data.map(d => ids.includes(d.id) ? {...d, "is_disabled": !d.is_disabled } : "" )
    //     )
    //     )
  };
  const handleProjectChange = (project_id) => {
    setModuleDropdown(null);
    setModuleDropdown(moduleData.filter(d => d.project_id == project_id.value).map(d => ({ value: d.id, label: d.module_name })));
}

const handleModuleChange = (module_id) => {
    setSubModuleDropdown(null);
    setSubModuleDropdown(subModuleData.filter(d => d.module_id == module_id.value).map(d => ({ value: d.id, label: d.sub_module_name })));
}

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

  // Update State of Status Color
  const colorStyle = (e) => {
    if (e.target.value == "PASS") {
      setColors("green");
    } else {
      setColors("red");
    }
  };
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
          setModal({ showModal: false, modalData: "", modalHeader: "" });
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

  // Handle Modal For Edit Form
  const handleModal = (data) => {
    setModal(data);
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData();
    await new TestCasesService()
      .sendNotification(useSessionData.userId, form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {

            setNotify({ type: "success", message: res.data.message });
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        }
      });
  };

  const rowDisabledCriteria = (row) => row.is_disabled;

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
                <tr>
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
            })}g
        </tbody>
      </Table>
    </pre>
  );
  const handleFilter = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const tempData = [];

    await new TestCasesService()
      .getTestcasesByFilter( form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            let counter = 1;
            const temp = res.data.data;
            for (const key in temp) {
              tempData.push({
                counter: counter++,
                id: temp[key].id,
                project_name: temp[key].project_name,
                module_name: temp[key].module_name,
                submodule: temp[key].submodule,
                ticket_id: temp[key].ticket_id,
                testSuit_id: temp[key].testSuit_id,
                tester_status: temp[key].tester_status,
                ba_status: temp[key].ba_status,
                developer_status: temp[key].developer_status,
                severity: temp[key].severity,
                priority: temp[key].priority,
                test_case_id: temp[key].test_case_id,
               task_name: temp[key].task_name,
               testing_type: temp[key].testing_type,
               function: temp[key].function,
               platform: temp[key].platform,
               apk_version: temp[key].apk_version,
               os_version: temp[key].os_version,
               steps_to_follow: temp[key].steps_to_follow,
               test_description: temp[key].test_description,
               expected_result: temp[key].expected_result,
               actual_result: temp[key].actual_result,
               tester_comments: temp[key].tester_comments,
               attachments: temp[key].attachments,
               userId: temp[key].userId,
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

    var idArray=e.selectedRows.map((d)=>d.id);
    setSelectedRowsData(idArray);
 };

  const sendTestcasesToTesterForExecution = async(e) =>{
    e.preventDefault()
    setNotify(null)
    const form = new FormData(e.target)
    form.append("test_case_id",selectedRowsData)
    await new TestCasesService().getAssignTestCasesToTester(form).then((res)=>{
      if(res.status === 200){
        if(res.data.status == 1){
          setSendtoModal({showModal:false, modalData:"",modalHeader:""})
          setNotify({ type: "success", message: res.data.message });
        }else{
          setNotify({ type: "danger", message: res.data.message });

        }
      }
    })
  }
  const [basketDropdown, setBasketDropdown]= useState();
  const handleTicketBasket = async(e) =>{
    // e.preventDefault();
    await new TestCasesService().getBasketTasksData(e.value, userSessionData.userId,"BASKET").then((res)=>{
      if(res.status === 200) {
        if(res.data.status ==1){
          var temp = res.data.data
         setBasketDropdown( temp.map(d=> ({value:d.id, label:d.basket_name})))
        }
      }
    })
  }

  useEffect(() => {
    loadData();
    // if (location && location.state) {
    //     setNotify(location.state.alert);
    //   }
    //   return () => {
    //     // setNotify(null);
    //   };
  }, []);

  return (
    <div>
      <PageHeader headerTitle="Test Suite" />
      {notify && <Alert alertData={notify} />}
      <Modal
        size="xl"
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
        <form method="post" onSubmit ={sendTestcasesToTesterForExecution}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
          <div className="col-sm-4">
                <label>
                  <b>Tester:</b>
                </label>
                {tester &&
                <Select
                  className="form-control form-control-sm"
                  id="tester_id"
                  name="tester_id"
                  options={tester}
                />
                }
                </div>

            <div className="col-sm-4">
                  <label>
                    <b>Tecket Id:</b>
                  </label>
                  {ticketIdDropdown &&
                  <Select
                    className="form-control form-control-sm "
                    name="ticket_id"
                    id="ticket_id"
                    options={ticketIdDropdown}
                    onChange={e=>handleTicketBasket(e)}

                  />
                  }

                </div>
              <div className="col-sm-4">
                <label>
                  <b>Select Basket:</b>
                </label>
                {basketDropdown &&
                <Select
                  className="form-control form-control-sm"
                  id="basket_id"
                  name="basket_id"
                  options={basketDropdown}
                />
                }
                </div>
                <div className="col-sm-4 mt-2">
                <label>
                  <b>Task Name:</b>
                </label>
                <input
                  type ="text"
                  className="form-control form-control-sm"
                  id="task_id"
                  name="task_id"
                />
                </div>
                <div className="col-sm-4 mt-2">
                <label>
                  <b>Start Date:</b>
                </label>
                <input
                  type ="date"
                  className="form-control form-control-sm"
                  id="start_date"
                  name="start_date"
                />
                </div>
                <div className="col-sm-4 mt-2">
                <label>
                  <b>End Date:</b>
                </label>
                <input
                  type ="date"
                  className="form-control form-control-sm"
                  id="end_date"
                  name="end_date"
                />
                </div>
                <div className="col-sm-4 mt-2">
                <label>
                  <b>Task Hours:</b>
                </label>
                <input
                  type ="time"
                  className="form-control form-control-sm"
                  id="task_hours"
                  name="task_hours"

                />
                </div>
                <Modal.Footer>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    style={{ backgroundColor: "#484C7F" }}
                  >
                    Submit
                  </button>

                  {/* <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    style={{ backgroundColor: "#bb2d3b" }}
                  >
                    Close
                  </button> */}
                </Modal.Footer>
              </div>
          </Modal.Body>
        </form>
      </Modal>

      <div className="container-xxl">
        <form onSubmit={handleFilter} method="post">
          <div className="card mt-2" style={{ zIndex: 10 }}>
            <div className="card-body">
              <div className="form-group row">
                <div className="col-sm-4">
                  <label>
                    <b>Project:</b>
                  </label>
                  {projectDropdown &&
                  <Select
                    className="form-control form-control-sm"
                    id="project_id"
                    name="project_id"
                    options={projectDropdown}
                    onChange={handleProjectChange}

                  />
                }
                </div>

                <div className="col-sm-4">
                  <label>
                    <b>Module:</b>
                  </label>
                  {moduleDropdown &&
                  <Select
                    className="form-control form-control-sm mt-2"
                    id="module_id"
                    name="module_id"
                    options={moduleDropdown}
                    onChange={handleModuleChange}
                  />
                  }
                </div>
                <div className="col-sm-4">
                  <label>
                    <b>Sub Module:</b>
                  </label>
                  {subModuleDropdown &&
                  <Select
                    className="form-control form-control-sm mt-2"
                    id="submodule_id"
                    name="submodule_id"
                    options={subModuleDropdown}
                    onChange={handleModuleChange}
                  />
                  }
                </div>

                <div className="col-sm-4">
                  <label>
                    <b>Tecket Id:</b>
                  </label>
                  {ticketIdDropdown &&
                  <Select
                    className="form-control form-control-sm mt-2"
                    name="ticket_id"
                    id="ticket_id"
                    options={ticketIdDropdown}
                  />
                  }

                </div>

                <div className="col-sm-4">
                  <label>
                    <b>Severity:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="severity"
                    name="severity"
                  >
                          <option value="" selected disabled hidden>Select..</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div className="col-sm-4">
                  <label>
                    <b>Priority:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="priority"
                    name="priority"
                  >
                          <option value="" selected disabled hidden>Select..</option>

                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
                {/* <div className="col-sm-4">
                  <label>
                    <b>Test Suite:</b>
                  </label>
                  {testSuiteDropdown &&
                  <Select
                    className="form-control form-control-sm mt-2"
                    id="testsuit_id"
                    name="testsuit_id"
                   options={testSuiteDropdown}
                  />
                    }

                </div> */}
                <div className="col-sm-4">
                  <label>
                    <b>Tester Status:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="tester_status"
                    name="tester_status"
                  >
                          <option value="" selected disabled hidden>Select..</option>

                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                  </select>
                </div>
                <div className="col-sm-4">
                  <label>
                    <b>Developer Status:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="developer_status"
                    name="developer_status"
                  >
                          <option value="" selected disabled hidden>Select..</option>

                   <option value="PASS" >Pass</option>
                      <option value="FAIL">Fail</option>
                      <option value="UNDER_DEVELOPMENT">Under Development</option>
                      <option value="SUGGESTION">Suggestion</option>
                  </select>
                </div>
                <div className="col-sm-4">
                  <label>
                    <b>BA Status:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="ba_status"
                    name="ba_status"
                  >
                          <option value="" selected disabled hidden>Select..</option>
                      <option value="PASS" >Pass</option>
                      <option value="FAIL">Fail</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <button // if (location && location.state) {
    //     setNotify(location.state.alert);
    //   }
    //   return () => {
    //     // setNotify(null);
    //   };
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
                  <ExportToExcel
                    className="btn btn-sm btn-danger"
                    apiData={data}
                    fileName="Test Cases"
                  />
                  <div>
                    {data && data.length > 0 &&
                    <button
                      className="btn  btn-warning"
                      type="button"
                      onClick={() => {
                        handleSendtoModal({
                          showModal: true,
                          modalData: "",
                          modalHeader: "Assign Test Cases To",
                        });
                      }}
                    >
                      Assign To <i className="icofont-sign-in" />
                    </button>
                       }
                  </div>


                </div>
                <div></div>

                {data && (
                //   <DataTableExtensions {...tableData}>
                    <DataTable
                      columns={columns}
                      defaultSortField="title"
                      data={data}
                      pagination
                      selectableRows={true}
                    //   onSelectedRowsChange={selectTest}
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover={true}
                    //   pointerOnHover={true}
                    //   expandableRows
                    onSelectedRowsChange={handleSelectedRowsChange} // handle selection of rows
                      expandableRowsComponent={ExpandedComponent}
                    //   selectableRowDisabled={rowDisabledCriteria}
                      responsive={true}
                    />
                //   </DataTableExtensions>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSuiteComponent;
