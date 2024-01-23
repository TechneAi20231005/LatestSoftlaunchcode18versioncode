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
import { Link, useParams } from "react-router-dom";
import {
  getAttachment,
  deleteAttachment,
} from "../../../../services/OtherService/AttachmentService";
import { Table } from "react-bootstrap";
import MyTicketService from "../../../../services/TicketService/MyTicketService";
import ModuleService from "../../../../services/ProjectManagementService/ModuleService";
import SubModuleService from "../../../../services/ProjectManagementService/SubModuleService";
import * as Validation from "../../../../components/Utilities/Validation";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Select from "react-select";
import ProjectService from "../../../../services/ProjectManagementService/ProjectService";
import DesignationService from "../../../../services/MastersService/DesignationService";
import TestingTypeServices from "../../../../services/MastersService/TestingTypeService"
import { useLocation } from "react-router-dom";

const TestBankComponent = ({ match, props,  }) => {
  const location = useLocation()
  const {id} = useParams();
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
   const [testingTypeDropdown, setTestingTypeDropdown] = useState();

  const handleSendtoModal = (data) => {
    setSendtoModal(data);
  };
  const [showInput, setShowInput] = useState(false);
  const handleUpdateClick = () => {
    setShowInput(true);
  };
  const [showLoaderModal, setShowLoaderModal] = useState(false)

  const [showTestSuite, setTestSuite] = useState(false);
  const handleTestSuite = () => {
    setTestSuite(true);
  };

  const [sendtoTestSuiteModal, setsendtoTestSuiteModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });


  
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const handleSendtoTestSuiteModal = (suiteData) => {
    setsendtoTestSuiteModal(suiteData);
  };
  const handleSelectedRowsChange = (e) => {
    var idArray = e.selectedRows.map((d) => d.id);
    setSelectedRowsData(idArray);
  };

  const columns = [
    // {
    //   name: "Action",
    //   selector: (row) => {},
    //   sortable: false,
    //   cell: (row) =>
    //     row.is_disabled == false && (
    //       <div className="btn-group" role="group">
    //         <button
    //           type="button"
    //           style={{ borderRadius: "20px" }}
    //           className="btn btn-sm btn-info "
    //           onClick={(e) => {
    //             handleModal({
    //               showModal: true,
    //               modalData: row,
    //               modalHeader: "Edit Test Case",
    //             });
    //           }}
    //         >
    //           <i class="icofont-edit text-white"></i>
    //         </button>

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
    { name: "Sr", selector: (row) => row.counter, sortable: true, },

    {
      name: "Test Case Id",
      selector: (row) => row.test_case_id,
      sortable: true,
    },

    {
      name: "TicketId",
      selector: (row) => row.ticket_id,
      sortable: true,
    },

    {
      name: "Project Name",
      selector: (row) => row.project_name,
      sortable: true,
    },

    {
      name: "Function",
      selector: (row) => row.function,
      sortable: true,
    },

    {
      name: "Field",
      selector: (row) => row.field,
      sortable: true,
    },

    // {
    //   name: "Priority",
    //   selector: (row) => row.priority,
    //   sortable: true,
    // },

    // {
    //   name: "Task Name",
    //   width: "250px",
    //   selector: (row) => row.task_name,
    // },
    {
      name: "Testing Type",
      selector: (row) => row.testing_type_name,
      sortable: true,
    },
    { name: "Module", selector: (row) => row.module_name, sortable: true },
    { name: "Sub Module", selector: (row) => row.submodule, sortable: true },
    { name: "Platform", selector: (row) => row.platform, sortable: true },
    { name: "APK Version", selector: (row) => row.apk_version, sortable: true },
    { name: "Os Version", selector: (row) => row.os_version, sortable: true },
    // { name: "Steps", selector: (row) => row.steps_to_follow, sortable: true },
    {
      name: 'Description',
      selector: row => row.test_description,
      sortable: true,
      width: '280px',

      cell: row => (
        <div
          className='btn-group'
          role='group'
          aria-label='Basic outlined example'
        >
          {row.test_description && (
            <OverlayTrigger overlay={<Tooltip>{row.test_description} </Tooltip>}>
              <div>
                <span className='ms-1'> {row.test_description}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Expected Result',
      selector: row => row.expected_result,
      sortable: true,
      width: '280px',

      cell: row => (
        <div
          className='btn-group'
          role='group'
          aria-label='Basic outlined example'
        >
          {row.expected_result && (
            <OverlayTrigger overlay={<Tooltip>{row.expected_result} </Tooltip>}>
              <div>
                <span className='ms-1'> {row.expected_result}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Actual Result',
      selector: row => row.actual_result,
      sortable: true,
      width: '280px',

      cell: row => (
        <div
          className='btn-group'
          role='group'
          aria-label='Basic outlined example'
        >
          {row.actual_result && (
            <OverlayTrigger overlay={<Tooltip>{row.actual_result} </Tooltip>}>
              <div>
                <span className='ms-1'> {row.actual_result}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
   {
      name: 'Tester Comments',
      selector: row => row.tester_comments,
      sortable: true,
      width: '280px',

      cell: row => (
        <div
          className='btn-group'
          role='group'
          aria-label='Basic outlined example'
        >
          {row.tester_comments && (
            <OverlayTrigger overlay={<Tooltip>{row.tester_comments} </Tooltip>}>
              <div>
                <span className='ms-1'> {row.tester_comments}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: "Tester Status",
      selector: (row) => row.tester_status,
      sortable: true,
    },
    // {
    //   name: "Developer Status",
    //   selector: (row) => row.tester_status,
    //   sortable: true,
    // },
    // {
    //   name: "BA Status",
    //   selector: (row) => row.tester_status,
    //   sortable: true,
    // },
    // {
    //   name: "Developer Comments",
    //   selector: (row) => row.dev_comments,
    //   sortable: true,
    //   width:"280px"
    // },
    // {
    //   name: "BA Comments",
    //   selector: (row) => row.ba_comments,
    //   sortable: true,
    //   width:"280px"
    // },
    // {
    //   name: "Reviewer Comments",
    //   selector: (row) => row.reviewer_comments,
    //   sortable: true,
    //   width:"280px"
    // },
    { name: "Severity", selector: (row) => row.severity, sortable: true },
    {
      name: "Script Path",
      selector: (row) => row.scrpt_path,
      sortable: true,
    },
  ];

  const tableData = {
    columns,
    data,
  };

  const useSessionData = {
    userId: sessionStorage.getItem("id"),
  };

  const [testSuiteDropdown, setTestSuiteDropdown] = useState();
  const [tester, setTester] = useState();

  
  const [ticketIdDropdown, setticketIdDropdown] = useState();
  // Load All Data and Render
  const loadData = async () => {
    const data = [];
    // await new TestCasesService().getTaskBytTicket(ticketId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const temp = res.data.data;
    //       setTaskDropdown(
    //         temp.map((d) => ({ value: d.id, label: d.task_name }))
    //       );
    //     }
    //   }
    // });

    await new TestingTypeServices().getAlltestingType().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data.filter(d=> d.is_active == 1)
          
          const  tempo = temp.map((d) => ({
            value: d.id,
            label: d.testing_type,
          }));
          setTestingTypeDropdown(tempo);
        }
      }
    });

    await new DesignationService().getdesignatedDropdown(ticketId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          var deta = res.data.data
          setTester(deta.TESTER.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name  })));
        }
      }
    })
    await new TestCasesService().getAllTestSuites().then((res)=>{
      if(res.status === 200){
          if(res.data.status == 1){

              const temp = res.data.data;
              setTestSuiteDropdown(
                temp.map((d) => ({ value: d.id, label: d.testsuit_name }))
              );            }
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
    await new ProjectService().getProject().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data
          
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
          const temp = res.data.data

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
          const temp = res.data.data
          
          setSubModuleData(temp);
          setSubModuleDropdown(
            temp.map((d) => ({
              value: d.id,
              label: d.sub_module_name,
            }))
          );
        }
      }
    });

   
  };

  const moduleIdRef = useRef()
  const subModuleIdRef = useRef()
  const projectIdRef = useRef()
  const ticketIdRef = useRef()
  const testSuiteRef = useRef()
  const testingTypeRef = useRef()


  const clearValue = (name) => {
    switch (name) {
        case "module_id":
            if (moduleIdRef.current)
            {
                moduleIdRef.current.clearValue();
            }
            break;
            case "submodule_id":
            if (subModuleIdRef.current) {
                subModuleIdRef.current.clearValue();
            }
            break; 
        default:
            break;
    }
}



const handleProjectChange = async(e) => {
    clearValue('module_id')
    clearValue('submodule_id')
    setModuleDropdown(moduleData.filter(d => d.project_id == e.value).map(d => ({ value: d.id, label: d.module_name })));
  
}

const handleModuleChange = (e) => {
    if(e){
    setSubModuleDropdown(subModuleData.filter(d => d.module_id == e.value).map(d => ({ value: d.id, label: d.sub_module_name })));
    }
}

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
            })}
        </tbody>
      </Table>
    </pre>
  );

  const [exportData, serExportData] = useState()
  const handleFilter = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const tempData = [];
    const exportTempData = [];

    var flag =1
    if(projectIdRef.current.commonProps.hasValue ||
       moduleIdRef.current.commonProps.hasValue  ||
       subModuleIdRef.current.commonProps.hasValue ||
       ticketIdRef.current.commonProps.hasValue ||
       document.getElementById('severity').value != "" ||
       document.getElementById('priority').value != "" ||
       testSuiteRef.current.commonProps.hasValue ||
       document.getElementById('tester_status').value != "" ||
       document.getElementById('developer_status').value != "" ||
       document.getElementById('ba_status').value != "" ||
       testingTypeRef.current.commonProps.hasValue ){
      flag =1
    } else{
      alert("please select atleast one value")
      flag = 0
    }

    if(flag === 1){
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
                reviewer_comments:temp[key].reviewer_comments,
                project_name: temp[key].project_name,
                module_name: temp[key].module_name,
                submodule: temp[key].submodule,
                ticket_id: temp[key].ticket_id,
                tester_status: temp[key].tester_status,
                ba_status: temp[key].ba_status,
                developer_status: temp[key].developer_status,
                dev_comments: temp[key].dev_comments,
                ba_comments: temp[key].ba_comments,
                script_path:temp[key].script_path,
                severity: temp[key].severity,
                priority: temp[key].priority,
                test_case_id: temp[key].test_case_id,
               task_name: temp[key].task_name,
               testing_type: temp[key].testing_type,
               function: temp[key].function,
               platform: temp[key].platform,
               apk_version: temp[key].apk_version,
               os_version: temp[key].os_version,
               testing_type_name: temp[key].testing_type_name,
               test_description: temp[key].test_description,
               expected_result: temp[key].expected_result,
               actual_result: temp[key].actual_result,
               tester_comments: temp[key].tester_comments,
               screenshot: temp[key].screenshot,
               field: temp[key].field,

              });
            }
            setData(null);
            setData(tempData);

            for (const key in temp) {
              exportTempData.push({
                ticket_id: temp[key].ticket_id,
                test_case_id: temp[key].test_case_id,
                project_name: temp[key].project_name,
                module_name: temp[key].module_name,
                submodule: temp[key].submodule,
                test_description: temp[key].test_description,
                expected_result: temp[key].expected_result,
                actual_result: temp[key].actual_result,
                reviewer_comments:temp[key].reviewer_comments,
                priority: temp[key].priority,
                tester_status: temp[key].tester_status,
                ba_status: temp[key].ba_status,
                developer_status: temp[key].developer_status,
                dev_comments: temp[key].dev_comments,
                ba_comments: temp[key].ba_comments,
                script_path:temp[key].script_path,
                severity: temp[key].severity,
               task_name: temp[key].task_name,
               function: temp[key].function,
               platform: temp[key].platform,
               apk_version: temp[key].apk_version,
               os_version: temp[key].os_version,
               testing_type_name: temp[key].testing_type_name,
               tester_comments: temp[key].tester_comments,
               screenshot: temp[key].screenshot,
               field: temp[key].field,

              });
            }
            serExportData(exportTempData)
          }
        }
      });
    }
  };

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


  const handleAddToExistingSuiteModal = (existingSuiteData) => {
    setaddToExistingSuiteModal(existingSuiteData);
  };

  const handleCreateSuiteModal = (createSuiteData) => {
    setcreateNewTestSuiteModal(createSuiteData);
  };
  const addToExistingTestSuite = async(e) =>{
    setNotify(null)
    e.preventDefault();
    const form = new FormData(e.target)
    form.append("test_case_id",selectedRowsData)

    await new TestCasesService().addToExistingTestSuite(form).then((res)=>{
      if(res.status === 200){
        if(res.data.status == 1){
          setNotify({ type: "success", message: res.data.message });
          setsendtoTestSuiteModal({showModal: false,modalData: "",modalHeader: "",});
          setaddToExistingSuiteModal({showModal: false,modalData: "",modalHeader: "",});

        }else{
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    })
  }

  const testerIdRef =useRef()
  const ticketIdsRef =useRef()
  const basketIdRef =useRef()

  const sendTestcasesToTesterForExecution = async(e) =>{
    setShowLoaderModal(null)
    setShowLoaderModal(true)
    e.preventDefault()
    setNotify(null)
    var flag = 1
    const form = new FormData(e.target)
    form.append("test_case_id",selectedRowsData)
    if(testerIdRef.current.commonProps.hasValue == false){
      alert("please select tester")
      flag =0
    }
    if(ticketIdsRef.current.commonProps.hasValue == false){
      alert("please select ticketId")
      flag =0
    }
    if(basketIdRef.current.commonProps.hasValue == false){
      alert("please select basket")
      flag =0
    }
    var s = form.get("task_hours")
    if(s == "00:00"){
      alert('Please enter task hours')
      flag=0
    }
    
    if(flag ===1){
    await new TestCasesService().getAssignTestCasesToTester(form).then((res)=>{
      if(res.status === 200){
        if(res.data.status == 1){
          setShowLoaderModal(false)
          setSendtoModal({showModal:false, modalData:"",modalHeader:""})
          setNotify({ type: "success", message: res.data.message });
        }else{
          setNotify({ type: "danger", message: res.data.message });

        }
      }
    })
  }
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

  const createNewTestSuite = async (e) =>{
    setNotify(null)
    e.preventDefault();
    const form = new FormData (e.target)
    await new TestCasesService().createTestSuite(form).then((res)=>{
      if(res.status === 200){
        if(res.data.status == 1){
          setNotify({ type: "success", message: res.data.message });
          setcreateNewTestSuiteModal({showModal:false, modalData:"",modalHeader:""})
          loadData();
        }else{
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    })
  }

  const [date, setDate] = useState()

  const handleDate =(e) =>{
    setDate(e.target.value);
  }
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    loadData();

    if (location.state && location.state.alert && flag === 0) {
      setNotify(location.state.alert);
      setFlag(1);
    }

    return () => {
      setNotify(null);
    };
  }, [location.state]);

  return (
    <div>
      <PageHeader headerTitle="Test Plan" />
      {notify && <Alert alertData={notify} />}
    
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
                    <span class="px-2">Add To Existing Test Suite</span>
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


      {/* Assign Test case to Tester */}

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
            <Modal.Title className="fw-bold">Assign Task 
               </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
          <div className="col-sm-4">
                <label>
                  <b>Tester<Astrick color="red" />:</b>
                </label>
                {tester &&
                <Select
                  className="form-control form-control-sm"
                  id="tester_id"
                  name="tester_id"
                  ref={testerIdRef}
                  options={tester}
                />
                }     
                </div>
           
            <div className="col-sm-4">
                  <label>
                    <b>Ticket Id <Astrick color="red" />:</b>
                  </label>
                  {ticketIdDropdown &&
                  <Select
                    className="form-control form-control-sm "
                    name="ticket_id"
                    id="ticket_id"
                    options={ticketIdDropdown}
                    ref={ticketIdsRef}

                    onChange={e=>handleTicketBasket(e)}

                  />
                  }
               
                </div>
              <div className="col-sm-4">
                <label>
                  <b>Select Basket <Astrick color="red" />:</b>
                </label>
                {basketDropdown &&
                <Select
                  className="form-control form-control-sm"
                  id="basket_id"
                  name="basket_id"
                  ref={basketIdRef}
                  options={basketDropdown}
                />
                }     
                </div>  
                <div className="col-sm-4 mt-2">
                <label>
                  <b>Task Name <Astrick color="red" />:</b>
                </label>
                <input
                  type ="text"
                  className="form-control form-control-sm"
                  id="task_id"
                  required
                  name="task_id"
                />
                </div>   
                <div className="col-sm-4 mt-2">
                <label>
                  <b>Start Date <Astrick color="red" />:</b>
                </label>
                <input
                  type ="date"
                  className="form-control form-control-sm"
                  id="start_date"
                  name="start_date"
                  onChange={handleDate}
                  required
                />
                </div>  
                <div className="col-sm-4 mt-2">
                <label>
                  <b>End Date <Astrick color="red" />:</b>
                </label>
                <input
                  type ="date"
                  className="form-control form-control-sm"
                  id="end_date"
                  name="end_date"
                  min={date}
                  required
                />
                </div>   
                <div className="col-sm-4 mt-2">
                <label>
                  <b>Task Hours <Astrick color="red" />:</b>
                </label>
                <input
                  type ="text"
                  className="form-control form-control-sm"
                  id="task_hours"
                  defaultValue={"00:00"}
                  onKeyPress={e=>{Validation.NumbersOnly(e)}}
                  name="task_hours"
                  required
                  
                />
                </div>
                <Modal.Footer>
                <small
             style={{fontSize:"13px", color:'blue', fontWeight:"bold", fontStyle:"italic"}}>
              Note:- (All fields are manadatory)
               </small>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
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
              </div>
          </Modal.Body>
        </form>
      </Modal>
      {/* Assign Test case to Tester */}

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
                    ref ={projectIdRef}
                    options={projectDropdown}
                    onChange={e=>{handleProjectChange(e)}}

                  />
                }
                </div>

                <div className="col-sm-4">
                  <label>
                    <b>Module:</b>
                  </label>
                  {moduleDropdown &&
                  <Select
                    className="form-control form-control-sm"
                    id="module_id"
                    name="module_id"
                    options={moduleDropdown}
                    ref = {moduleIdRef}
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
                    className="form-control form-control-sm"
                    id="submodule_id"
                    name="submodule_id"
                    
                    ref={subModuleIdRef}
                    options={subModuleDropdown}
                    onChange={handleModuleChange}
                  />
                  }
                </div>

                <div className="col-sm-4">
                  <label>
                    <b>Ticket Id:</b>
                  </label>
                  {ticketIdDropdown &&
                  <Select
                    className="form-control form-control-sm mt-2"
                    name="ticket_id"
                    id="ticket_id"
                    ref= {ticketIdRef}
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
                <div className="col-sm-4">
                  <label>
                    <b>Test Suite:</b>
                  </label>
                  {testSuiteDropdown &&
                  <Select
                    className="form-control form-control-sm mt-2"
                    id="testsuit_id"
                    name="testsuit_id"
                    ref= {testSuiteRef}
                   options={testSuiteDropdown} 
                  />
                    }
          
                </div>
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
                    <option value="SUGGESTION">SUGGESTION</option>
                    <option value="UNDER_DEVELOPMENT">UNDER DEVELOPMENT</option>
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

                   <option value="SOLVED" >SOLVED</option>
                      <option value="RSOLVED">RSOLVED</option>
                      <option value="DEFFERED">DEFFERED</option>
                      <option value="NOT_A_BUG">NOT A BUG</option>
                      <option value="PENDING">PENDING</option>
                      <option value="CR">CR</option>
                  </select>
                </div>
                <div className="col-sm-4 mt-2">
                  <label>
                    <b>BA Status:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="ba_status"
                    name="ba_status"
                  >
                          <option value="" selected disabled hidden>Select..</option>
                      <option value="NOT_A_BUG">NOT A BUG</option>
                      <option value="CR">CR</option>
                          <option value="BUG">BUG</option>
                      <option value="NOT_IN_THIS_PHASE">NOT IN THIS PHASE</option>
                      <option value="SOLVED">SOLVED</option>
                      <option value="SOLVED">TO BE DISCUSSED</option>
                  </select>
                </div>

                <div className="col-sm-3">
                  <label>
                    <b>Testing Type:</b>
                  </label>
                  <Select
                    className="form-control form-control-sm"
                    id="testing_type"
                    name="testing_type"
                    ref={testingTypeRef}
                    options={testingTypeDropdown}
                  />
                </div>

                <div className="d-flex flex-row-reverse">
                  <button
                    className="btn btn-sm btn-info text-white"
                    type="button"
                    onClick={() => window.location.reload(false)}
                    style={{ marginTop: "20px", fontWeight: "600" }}
                  >
                    <i className="icofont-refresh text-white"></i> Reset
                  </button>
                  <button 
                    className="btn btn-sm btn-warning text-white"
                    type="submit"
                    style={{ marginTop: "20px", fontWeight: "600" }}
                  >
                    <i className="icofont-search-1 "></i> Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
{data &&
      <div className="container-xxl">
        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
              { data && selectedRowsData && selectedRowsData.length <= 0 &&
                    <span style={{color:"red", fontWeight:"bold", fontStyle:"italic"}}>Note: Please select atleast one test case before sending to test suite or assign to tester</span> }
               
                <div className="d-flex flex-row-reverse">
                  {data && data.length >=0 &&
                  <ExportToExcel
                    className="btn btn-sm btn-danger"
                    apiData={exportData}
                    fileName="Test Cases"
                  />
                  }

           
           
                  <div>
                    {data && 
                    <>
                  
                    <button
                      className="btn  btn-warning"
                      type="button"
                      onClick={() => {
                        handleSendtoTestSuiteModal({
                          showModal: true,
                          modalData: "",
                          modalHeader: "Test Suite ",
                        });
                      }}
                    >
                      Test Suite <i className="icofont-sign-in" />
                    </button>
                    </>
                    }

                {data && data.length > 0 &&
                    <button
                      className="btn  btn-primary"
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
                  <DataTableExtensions {...tableData}>
                    <DataTable
                      columns={columns}
                      defaultSortField="title"
                      data={data}
                      pagination
                      selectableRows={true}
                      // onSelectedRowsChange={selectTest}
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover={true}
                      pointerOnHover={true}
                      // expandableRows
                      onSelectedRowsChange={handleSelectedRowsChange} // handle selection of rows

                      // expandableRowsComponent={ExpandedComponent}
                      // selectableRowDisabled={rowDisabledCriteria}
                      responsive={true}
                    />
                  </DataTableExtensions>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    }
       <Modal show={showLoaderModal} centered>
          <Modal.Body className='text-center'>
            <Spinner animation='grow' variant='primary' />
            <Spinner animation='grow' variant='secondary' />
            <Spinner animation='grow' variant='success' />
            <Spinner animation='grow' variant='danger' />
            <Spinner animation='grow' variant='warning' />
            <Spinner animation='grow' variant='info' />
            <Spinner animation='grow' variant='dark' />
          </Modal.Body>
        </Modal>
    </div>
  );
};

export default TestBankComponent;

