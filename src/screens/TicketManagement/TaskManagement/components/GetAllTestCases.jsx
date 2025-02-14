import React, { useEffect, useState, useRef } from 'react';
import {
  _base,
  _attachmentUrl,
  userSessionData
} from '../../../../settings/constants';
import { Alert, Modal, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import TestCasesService from '../../../../services/TicketService/TestCaseService';
import PageHeader from '../../../../components/Common/PageHeader';
import { Astrick } from '../../../../components/Utilities/Style';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import ErrorLogService from '../../../../services/ErrorLogService';

import { Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import * as Validation from '../../../../components/Utilities/Validation';

import Select from 'react-select';
import TestingTypeServices from '../../../../services/MastersService/TestingTypeService';

const GetAllTestCases = () => {
  const { id } = useParams();
  const ticketId = id;
  const isReviewer = null;
  const userTypeData = null;
  const [data, setData] = useState(null);
  // const [userTypeData, setUserTypeData] = useState(null);

  const [notify, setNotify] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  // const [isReviewer, setIsReviewer] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [sendtoModal, setSendtoModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  // const [colors, setColors] = useState('green')
  // const [priority, setPriority] = useState('white');
  const [exportData, setExportData] = useState('white');
  const [testingTypeDropdown, setTestingTypeDropdown] = useState();

  const [taskDropdown, setTaskDropdown] = useState();
  const handleSendtoModal = (data) => {
    setSendtoModal(data);
  };

  const [ba, setBa] = useState(null);

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            style={{ borderRadius: '20px' }}
            className="btn btn-sm btn-info "
            onClick={(e) => {
              getData(e, row.index);
            }}
          >
            <i class="icofont-edit text-white"></i>
          </button>

          <Link
            to={`/${_base}/TestCaseHistory/` + row.id}
            className="btn btn-sm btn-danger text-white"
            style={{ borderRadius: '20px', fontSize: '15px' }}
          >
            <i class="icofont-history"></i>
          </Link>
        </div>
      )
    },
    {
      name: 'Test Case Id',
      selector: (row) => row.test_case_id,
      sortable: true
    },
    // {name: "Task Name", width: "250px", selector: (row) => row.task_name},
    {
      name: 'Testing Type',
      selector: (row) => row.testing_type_name,
      sortable: true
    },
    { name: 'Module', selector: (row) => row.module_name, sortable: true },
    { name: 'Sub Module', selector: (row) => row.submodule, sortable: true },
    { name: 'Platform', selector: (row) => row.platform, sortable: true },
    { name: 'APK Version', selector: (row) => row.apk_version, sortable: true },
    { name: 'Os Version', selector: (row) => row.os_version, sortable: true },
    { name: 'Function', selector: (row) => row.function, sortable: true },
    { name: 'Field', selector: (row) => row.field, sortable: true },
    {
      name: 'Description',
      selector: (row) => row.test_description,
      sortable: true
    },
    {
      name: 'Expected Result',
      selector: (row) => row.expected_result,
      sortable: true
    },
    {
      name: 'Actual Result',
      selector: (row) => row.actual_result,
      sortable: true
    },
    {
      name: 'Tester Comments',
      selector: (row) => row.tester_comments,
      sortable: true
    },
    { name: 'BA Comments', selector: (row) => row.ba_comments, sortable: true },
    {
      name: 'DEV Comments',
      selector: (row) => row.dev_comments,
      sortable: true
    },
    {
      name: 'Reviewer Comments',
      selector: (row) => row.reviewer_comments,
      sortable: true
    },
    {
      name: 'Tester Status',
      selector: (row) => row.tester_status,
      sortable: true
    },
    { name: 'BA Status', selector: (row) => row.ba_status, sortable: true },
    { name: 'DEV Status', selector: (row) => row.dev_status, sortable: true },
    { name: 'Severity', selector: (row) => row.severity, sortable: true },
    { name: 'Priority', selector: (row) => row.priority, sortable: true }
  ];

  const tableData = {
    columns,
    data
  };
  // const labels = ['Pass', 'Fail', 'Reopen', 'Under Development', 'Suggestion']

  // const [chartData, setChartData] = useState({
  //   series: [],
  //   Chart: {
  //     height: '150px'
  //   },
  //   annotations: {
  //     // yaxis: [
  //     //   {
  //     //     y: 0,
  //     //     y2: null,
  //     //     strokeDashArray: 1,
  //     //     borderColor: "#c2c2c2",
  //     //     fillColor: "#c2c2c2",
  //     //     opacity: 0.3,
  //     //     offsetX: 0,
  //     //     offsetY: -3,
  //     //     width: "100%",
  //     //     yAxisIndex: 0,
  //     //     label: {
  //     //       borderColor: "#c2c2c2",
  //     //       borderWidth: 1,
  //     //       borderRadius: 2,
  //     //       text: undefined,
  //     //       textAnchor: "end",
  //     //       position: "right",
  //     //       offsetX: 0,
  //     //       offsetY: 0,
  //     //       mouseEnter: undefined,
  //     //       mouseLeave: undefined,
  //     //       click: undefined,
  //     //       style: {
  //     //         background: "#fff",
  //     //         color: "#777",
  //     //         fontSize: "12px",
  //     //         fontWeight: 400,
  //     //         fontFamily: undefined,
  //     //         cssClass: "apexcharts-yaxis-annotation-label",
  //     //         padding: {
  //     //           left: 5,
  //     //           right: 5,
  //     //           top: 0,
  //     //           bottom: 2,
  //     //         },
  //     //       },
  //     //     },
  //     //   },
  //     // ],
  //     // xaxis: [
  //     //   {
  //     //     x: 0,
  //     //     x2: null,
  //     //     strokeDashArray: 1,
  //     //     borderColor: "#c2c2c2",
  //     //     fillColor: "#c2c2c2",
  //     //     opacity: 0.3,
  //     //     offsetX: 0,
  //     //     offsetY: 0,
  //     //     label: {
  //     //       borderColor: "#c2c2c2",
  //     //       borderWidth: 1,
  //     //       borderRadius: 2,
  //     //       text: undefined,
  //     //       textAnchor: "middle",
  //     //       position: "top",
  //     //       orientation: "vertical",
  //     //       offsetX: 0,
  //     //       offsetY: 0,
  //     //       mouseEnter: undefined,
  //     //       mouseLeave: undefined,
  //     //       click: undefined,
  //     //       style: {
  //     //         background: "#fff",
  //     //         color: "#777",
  //     //         fontSize: "12px",
  //     //         fontWeight: 400,
  //     //         fontFamily: undefined,
  //     //         cssClass: "apexcharts-xaxis-annotation-label",
  //     //       },
  //     //     },
  //     //   },
  //     // ],
  //     // points: [
  //     //   {
  //     //     x: 0,
  //     //     y: null,
  //     //     yAxisIndex: 0,
  //     //     seriesIndex: 0,
  //     //     mouseEnter: undefined,
  //     //     mouseLeave: undefined,
  //     //     click: undefined,
  //     //     marker: {
  //     //       size: 0,
  //     //       fillColor: "#fff",
  //     //       strokeColor: "#333",
  //     //       strokeWidth: 3,
  //     //       shape: "circle",
  //     //       radius: 2,
  //     //       OffsetX: 0,
  //     //       OffsetY: 0,
  //     //       cssClass: "",
  //     //     },
  //     //     label: {
  //     //       borderColor: "#c2c2c2",
  //     //       borderWidth: 1,
  //     //       borderRadius: 2,
  //     //       text: undefined,
  //     //       textAnchor: "middle",
  //     //       offsetX: 0,
  //     //       offsetY: -15,
  //     //       mouseEnter: undefined,
  //     //       mouseLeave: undefined,
  //     //       click: undefined,
  //     //       style: {
  //     //         background: "#fff",
  //     //         color: "#777",
  //     //         fontSize: "12px",
  //     //         fontWeight: 400,
  //     //         fontFamily: undefined,
  //     //         cssClass: "apexcharts-point-annotation-label",
  //     //         padding: {
  //     //           left: 5,
  //     //           right: 5,
  //     //           top: 0,
  //     //           bottom: 2,
  //     //         },
  //     //       },
  //     //     },
  //     //     image: {
  //     //       path: undefined,
  //     //       width: 20,
  //     //       height: 20,
  //     //       offsetX: 0,
  //     //       offsetY: 0,
  //     //     },
  //     //   },
  //     // ],
  //     text: [],

  //     texts: [
  //       {
  //         // x: 0,
  //         // y: 0,
  //         // textAnchor: "start",
  //         // foreColor: undefined,
  //         // fontSize: "13px",
  //         // fontFamily: undefined,
  //         // fontWeight: 400,
  //         // appendTo: ".apexcharts-annotations",
  //         // backgroundColor: "transparent",
  //         // borderColor: "#c2c2c2",
  //         // borderRadius: 0,
  //         // borderWidth: 0,
  //         // paddingLeft: 4,
  //         // paddingRight: 4,
  //         // paddingTop: 2,
  //         // paddingBottom: 2,
  //       }
  //     ]

  //     // images: [
  //     //   {
  //     //     path: "",
  //     //     x: 0,
  //     //     y: 0,
  //     //     width: 20,
  //     //     height: 20,
  //     //     appendTo: ".apexcharts-annotations",
  //     //   },
  //     // ],
  //   },
  //   options: {
  //     chart: {
  //       type: 'pie'
  //     },
  //     labels: labels,
  //     colors: ['#198754', '#DC4C64', '#E4A11B', '#4fb8c9', '#BF40BF'],
  //     dataLabels: {
  //       enabled: false,
  //       formatter: function (val) {
  //         return val.toFixed(0) // Display numbers without decimals
  //       },
  //       style: {
  //         textColor: 'white',
  //         colors: ['#333', '#fff']
  //       }
  //     }
  //   }
  // })

  const useSessionData = {
    userId: localStorage.getItem('id')
  };

  const [iterationCount, setIterationCount] = useState();

  const [d, setD] = useState();
  // Load All Data and Render
  const loadData = async () => {
    // setShowLoaderModal(null)
    // setShowLoaderModal(true)
    const data = [];
    await new TestCasesService().getTaskBytTicket(ticketId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data;
          setTaskDropdown(
            temp.map((d) => ({ value: d.id, label: d.task_name }))
          );
        }
      }
    });

    // await new BasketService().getBasketTaskData(ticketId).then(res => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       setIsReviewer(res.data.is_reviewer)
    //     }
    //   }
    // })

    await new TestCasesService().getdesignatedDropdown(ticketId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const deta = res.data.data.ALL;
          setBa(
            deta
              .filter((d) => d.is_active == 1 && d.id != userSessionData.userId)
              .map((d) => ({
                value: d.id,
                label: d.first_name + '-' + d.last_name
              }))
          );
        }
      }
    });
    await new TestingTypeServices().getAlltestingType().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          var temp = res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({
              value: d.id,
              label: d.testing_type
            }));
          setTestingTypeDropdown(temp);
        }
      }
    });

    // await new TestCasesService()
    //   .getTestCasesByTicket(useSessionData.userId, ticketId)
    //   .then(res => {
    //     if(res.status === 200){
    //       if(res.data.status==1){
    //         setShowLoaderModal(false)
    //     setData(null)
    //     setUserTypeData(null)
    //     let counter = 1
    //     const temp = res.data.data
    //     setIsReviewer(res.data.is_reviewer)
    //     setIterationCount(res.data.iterationCount)
    //     console.log(res);
    //     const userType = res.data.type
    //     setUserTypeData(userType)
    //     const tempData = []
    //     const exportTempData = []
    //     for (const key in temp) {
    //       tempData.push({
    //         index: tempData.length,
    //         id: temp[key].id,
    //         ticket_id: temp[key].ticket_id,
    //         test_case_id: temp[key].test_case_id,
    //         task_name: temp[key].task_name,
    //         testing_type_name: temp[key].testing_type_name,
    //         testing_type: temp[key].testing_type,
    //         function: temp[key].function,
    //         field: temp[key].field,
    //         submodule: temp[key].submodule,
    //         platform: temp[key].platform,
    //         apk_version: temp[key].apk_version,
    //         os_version: temp[key].os_version,
    //         steps_to_follow: temp[key].steps_to_follow,
    //         test_description: temp[key].test_description,
    //         expected_result: temp[key].expected_result,
    //         actual_result: temp[key].actual_result,
    //         tester_comments: temp[key].tester_comments,
    //         tester_status: temp[key].tester_status,
    //         severity: temp[key].severity,
    //         module_name: temp[key].module_name,
    //         attachments: temp[key].attachments,
    //         is_disabled: false,
    //         userId: temp[key].userId,
    //         ba_comments: temp[key].ba_comments,
    //         dev_comments: temp[key].dev_comments,
    //         dev_status: temp[key].dev_status,
    //         reviewer_comments: temp[key].reviewer_comments
    //       })
    //     }
    //     setData(tempData)
    //     // var detas = res.data.iterationData
    //     // setD(res.data.iterationData)
    //     // // const iterationData = res.data.iterationData;
    //     // var chartTempData = { ...chartData } // Make a copy of chartData using object spread

    //     // chartTempData.annotations.text.push(
    //     //   Object.values(res.data.iterationData).map(data => data.duration)
    //     // )
    //     // if (typeof detas === 'object' && detas !== null) {
    //     //   var chartSeries = []
    //     //   for (var key in detas) {
    //     //     if (detas.hasOwnProperty(key)) {
    //     //       var d = detas[key]
    //     //       // Process each 'd' object here
    //     //       // Create a new chart series object for each 'd' object
    //     //       var seriesObject = {
    //     //         name: 'Chart ' + key,
    //     //         data: [d.pass, d.fail, d.pending]
    //     //       }
    //     //       // data: [d.pass, d.fail, d.reopen, d.under_development, d.suggestion],
    //     //       chartSeries.push(seriesObject)
    //     //     }
    //     //   }

    //     //   // Update the chart series with the new series objects
    //     //   chartTempData.series = chartSeries
    //     //   setChartData(chartTempData)
    //     // }

    //     for (const key in temp) {
    //       exportTempData.push({
    //         // index: tempData.length + 1,
    //         // id: temp[key].id,
    //         test_case_id: temp[key].test_case_id,
    //         ticket_id: temp[key].ticket_id,
    //         field: temp[key].field,
    //         task_name: temp[key].task_name,
    //         testing_type_name: temp[key].testing_type_name,
    //         function: temp[key].function,
    //         field: temp[key].field,
    //         submodule: temp[key].submodule,
    //         platform: temp[key].platform,
    //         apk_version: temp[key].apk_version,
    //         os_version: temp[key].os_version,
    //         test_description: temp[key].test_description,
    //         expected_result: temp[key].expected_result,
    //         actual_result: temp[key].actual_result,
    //         tester_comments: temp[key].tester_comments,
    //         reviewer_comments: temp[key].reviewer_comments,
    //         dev_comments: temp[key].dev_comments,
    //         ba_comments: temp[key].ba_comments,
    //         tester_status: temp[key].tester_status,
    //         ba_status: temp[key].ba_status,
    //         dev_status: temp[key].dev_status,
    //         severity: temp[key].severity,
    //         module_name: temp[key].module_name,
    //         ba_comments: temp[key].ba_comments,
    //         dev_comments: temp[key].dev_comments,
    //         priority: temp[key].priority
    //       })
    //     }
    //     setExportData(exportTempData)
    //   }}
    //   })
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

    var temp = data.map((d, i) => (ids.includes(d.id) ? i : 'x'));

    temp = temp.filter((d) => d != 'x');

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
  const fileInputRef = useRef(null);

  const selectInputRef = useRef();
  const selectTestingTypeRef = useRef();
  const selectTesterStatusRef = useRef();
  const selectBAStatusRef = useRef();
  const selectDevStatusRef = useRef();
  const selectPriorityRef = useRef();
  const selectSeverityRef = useRef();

  const handleClearData = (e) => {
    if (selectInputRef.current.commonProps.hasValue != null) {
      selectInputRef.current.clearValue();
    }
    if (selectTestingTypeRef.current.commonProps.hasValue != null) {
      selectTestingTypeRef.current.clearValue();
    }
    if (selectTesterStatusRef.current.value != null) {
      document.getElementById('tester_status').value = '';
    }
    if (selectTesterStatusRef.current.value != null) {
      document.getElementById('tester_status').value = '';
    }
    if (selectBAStatusRef.current.value != null) {
      document.getElementById('ba_status').value = '';
    }
    if (selectDevStatusRef.current.value != null) {
      document.getElementById('developer_status').value = '';
    }
    if (selectPriorityRef.current.value != null) {
      document.getElementById('priority').value = '';
    }
    if (selectSeverityRef.current.value != null) {
      document.getElementById('severity').value = '';
    }
  };

  // maximum length check for attachments
  const maxLengthCheck = (e) => {
    if (e.target.files.length > 5) {
      alert('You Can Upload Only 5 Attachments');
      document.getElementById('attachment').value = null;
    }
  };
  // function ends

  // const priorityStyle = e => {
  //   setPriority(null)
  //   switch (e.target.value) {
  //     case 'HIGH':
  //       setPriority('red')
  //       break
  //     case 'MEDIUM':
  //       setPriority('orange')
  //       break
  //     case 'LOW':
  //       setPriority('green')
  //     default:
  //       return 'green'
  //   }
  // }

  // Update State of Status Color
  // const colorStyle = e => {
  //   if (e.target.value == 'PASS') {
  //     setColors('green')
  //   } else {
  //     setColors('red')
  //   }
  // }
  // Handle Modal For Edit Form
  const handleModal = (type) => {
    setModal(type);
  };

  const getData = (e, index) => {
    handleModal(true);
    setModalData(data[index]);
  };
  const updateForm = (id) => async (e) => {
    setNotify(null);
    setShowLoaderModal(null);
    e.preventDefault();
    var flag = 0;
    const form = new FormData(e.target);
    form.append('ticket_id', ticketId);
    setShowLoaderModal(true);
    await new TestCasesService()
      .updateTestCases(id, form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setShowLoaderModal(false);
            setNotify({ type: 'success', message: res.data.message });
            flag = 1;
          }
        } else {
          setNotify({ type: 'danger', message: res.data.message });

          new ErrorLogService().sendErrorLog(
            'TestCase',
            'Create_TestCases',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: 'danger', message: 'Request Error !!!' });
        new ErrorLogService().sendErrorLog(
          'TestCase',
          'Create_TestCases',
          'INSERT',
          errorObject.data.message
        );
      });
    if (flag == 1) {
      let tempData = [];
      const formData = {}; // Create an object to store your form data

      if (selectInputRef && selectInputRef.current) {
        const taskName = selectInputRef.current.props.value?.value; // Use optional chaining (?.)
        if (taskName) {
          formData.task_id = taskName;
        }
      }

      if (selectTestingTypeRef && selectTestingTypeRef.current) {
        const testingType = selectTestingTypeRef.current.props.value?.value; // Use optional chaining (?.)
        if (testingType) {
          formData.testing_type = testingType;
        }
      }

      if (document.getElementById('tester_status')) {
        formData.tester_status = document.getElementById('tester_status').value;
      }

      if (document.getElementById('ba_status')) {
        formData.ba_status = document.getElementById('ba_status').value;
      }

      if (document.getElementById('developer_status')) {
        formData.developer_status =
          document.getElementById('developer_status').value;
      }

      if (document.getElementById('priority')) {
        formData.priority = document.getElementById('priority').value;
      }

      if (document.getElementById('severity')) {
        formData.severity = document.getElementById('severity').value;
      }

      formData.limit = paginationData.per_page;
      formData.page = paginationData.current_page;

      setShowLoaderModal(true);
      await new TestCasesService()
        .getTestCasesByTicket(useSessionData.userId, ticketId, formData)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status == 1) {
              setShowLoaderModal(false);
              let counter = 1;
              const temp = res.data.data.data;

              setPaginationData(res.data.data);
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
                  dev_comments: temp[key].dev_comments,
                  tester_status: temp[key].tester_status,
                  dev_status: temp[key].dev_status,
                  severity: temp[key].severity,
                  module_name: temp[key].module_name,
                  attachments: temp[key].attachments,
                  userId: temp[key].userId
                });
              }
              setData(null);
              setData(tempData);
              setExportData(null);
              setExportData(tempData);
            }
          }
        });
    }
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
            setNotify({ type: 'success', message: res.data.message });
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        }
      });
  };

  const rowDisabledCriteria = (row) => row.is_disabled;

  // Expandable Component to render attachments
  const ExpandedComponent = ({ data }) => (
    <pre>
      <Table style={{ width: '30%' }}>
        <thead>
          <tr>
            <th>Sr</th>
            <th>Attachment Name</th>
            <th>Acton</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.attachments &&
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
                        style={{ fontSize: '15px', height: '15px' }}
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
  const [paginationData, setPaginationData] = useState();
  const handleFilterAgain = async (e, type) => {
    setShowLoaderModal(null);
    e.preventDefault();
    let tempData = [];
    const formData = {}; // Create an object to store your form data

    if (selectInputRef && selectInputRef.current) {
      const taskName = selectInputRef.current.props.value?.value; // Use optional chaining (?.)
      if (taskName) {
        formData.task_id = taskName;
      }
    }

    if (selectTestingTypeRef && selectTestingTypeRef.current) {
      const testingType = selectTestingTypeRef.current.props.value?.value; // Use optional chaining (?.)
      if (testingType) {
        formData.testing_type = testingType;
      }
    }

    if (document.getElementById('tester_status')) {
      formData.tester_status = document.getElementById('tester_status').value;
    }

    if (document.getElementById('ba_status')) {
      formData.ba_status = document.getElementById('ba_status').value;
    }

    if (document.getElementById('developer_status')) {
      formData.developer_status =
        document.getElementById('developer_status').value;
    }

    if (document.getElementById('priority')) {
      formData.priority = document.getElementById('priority').value;
    }

    if (document.getElementById('severity')) {
      formData.severity = document.getElementById('severity').value;
    }

    if (type === 'LIMIT') {
      formData.limit = parseInt(e.target.value);
      formData.page = paginationData.current_page;
    } else if (type === 'MINUS') {
      formData.limit = document.getElementById('limit_per_page').value;
      formData.page = paginationData.current_page - 1;
    } else if (type === 'PLUS') {
      formData.limit = document.getElementById('limit_per_page').value;
      formData.page = paginationData.current_page + 1;
    }
    setShowLoaderModal(true);
    await new TestCasesService()
      .getTestCasesByTicket(useSessionData.userId, ticketId, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setShowLoaderModal(false);
            let counter = 1;
            const temp = res.data.data.data;
            setPaginationData(res.data.data);
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
                dev_comments: temp[key].dev_comments,
                tester_status: temp[key].tester_status,
                dev_status: temp[key].dev_status,
                severity: temp[key].severity,
                module_name: temp[key].module_name,
                attachments: temp[key].attachments,
                userId: temp[key].userId
              });
            }
            setData(null);
            setData(tempData);
            setExportData(null);
            setExportData(tempData);
          }
        }
      });
  };

  const handleFilter = async (e, type) => {
    setShowLoaderModal(null);
    e.preventDefault();
    const formData = new FormData(e.target);
    const tempData = [];
    var taskId = formData.getAll('task_id');
    formData.append('limit', 10);
    formData.append('page', 1);
    setShowLoaderModal(true);
    await new TestCasesService()
      .getTestCasesByTicket(useSessionData.userId, ticketId, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setShowLoaderModal(false);
            let counter = 1;
            const temp = res.data.data.data;
            setPaginationData(res.data.data);
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
                dev_comments: temp[key].dev_comments,
                tester_status: temp[key].tester_status,
                dev_status: temp[key].dev_status,
                severity: temp[key].severity,
                module_name: temp[key].module_name,
                attachments: temp[key].attachments,
                userId: temp[key].userId
              });
            }
            setData(null);
            setData(tempData);
            setExportData(null);
            setExportData(tempData);
          }
        }
      });
  };

  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const handleSelectedRowsChange = (e) => {
    var idArray = e.selectedRows.map((d) => d.id);
    setSelectedRowsData(idArray);
  };

  const handleSendNotificationToMulti = async (e) => {
    e.preventDefault();
    setNotify(null);
    // setChartData(null)
    const tempdata = data.map((item) => item.id);
    const form = new FormData(e.target);
    form.append('testCaseIds', tempdata);
    if (userTypeData === 'TESTER') {
      form.append('iteration', iterationCount + 1);
    } else {
      form.append('iteration', iterationCount);
    }
    await new TestCasesService().sendNotificationToMulti(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setSendtoModal({ showModal: false, modalData: '', modalHeader: '' });
          setNotify({ type: 'success', message: res.data.message });
          loadData();
        } else {
          setNotify({ type: 'danger', message: res.data.message });
        }
      }
    });
  };

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'ALL'
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <PageHeader headerTitle="Test Cases" />
      {notify && <Alert alertData={notify} />}

      {/* Edit Functionality */}
      {/* {data && JSON.stringify(data)} */}
      <Modal size="xl" centered show={modal} onHide={(e) => handleModal(false)}>
        {modalData && (
          <form method="post" onSubmit={updateForm(modalData.id)}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Edit Test Case</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="deadline-form">
                <div className="form-group row">
                  <div className="">
                    {/* {modalData && JSON.stringify(modalData)} */}
                    <input
                      type="hidden"
                      class="form-control form-control-sm"
                      id="key"
                      key={Math.random()}
                      defaultValue={modalData && modalData ? modalData.id : ''}
                    />

                    <input
                      type="hidden"
                      class="form-control form-control-sm"
                      id="ticket_id"
                      name="ticket_id"
                      key={Math.random()}
                      value={modalData ? modalData.ticket_id : ''}
                    />
                  </div>
                  <div className="">
                    <label className="col-form-label">
                      <b>Test Case Id: </b>
                    </label>
                    <input
                      type="text"
                      id="test_case_id"
                      name="test_case_id"
                      key={Math.random()}
                      defaultValue={modalData.test_case_id}
                      readOnly={true}
                      className="form-control"
                    ></input>
                  </div>

                  <div className="col-sm-2">
                    <label className="col-form-label">
                      <b>Testing Type :</b>
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      id="testing_type"
                      name="testing_type"
                      defaultValue={modalData && modalData.testing_type}
                      disabled
                    >
                      <option>Functional</option>
                      <option>Integration</option>
                      <option>Validation</option>
                      <option>UI/UX</option>
                    </select>
                  </div>

                  <div className="col-sm-2">
                    <label className="col-form-label">
                      <b>Function :</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="function"
                      name="function"
                      key={Math.random()}
                      defaultValue={modalData.function}
                      required
                      readOnly
                    ></input>
                  </div>
                  <div className="col-sm-2">
                    <label className="col-form-label">
                      <b>Field :</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="field"
                      name="field"
                      key={Math.random()}
                      defaultValue={modalData.field}
                      required
                      readOnly
                    ></input>
                  </div>

                  <div className="col-sm-2 ">
                    <label className="col-form-label">
                      <b> Platform :</b>
                    </label>
                    <select
                      className="form-control form-control-1sm"
                      id="platform"
                      name="platform"
                      key={Math.random()}
                      defaultValue={modalData.platform}
                      required
                      disabled
                    >
                      <option>Website</option>;<option>App</option>;
                    </select>
                  </div>

                  <div className="col-sm-2">
                    <label className="col-form-label">
                      <b>APK Version :</b>
                    </label>
                    <input
                      type="number"
                      step="any"
                      key={Math.random()}
                      className="form-control"
                      id="apk_version"
                      name="apk_version"
                      readOnly
                      defaultValue={modalData.apk_version}
                      onKeyPress={(e) => {
                        Validation.NumbersOnly(e);
                      }}
                    ></input>
                  </div>
                  <div className="col-sm-2">
                    <label className="col-form-label">
                      <b>OS Version :</b>
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      key={Math.random()}
                      id="os_version"
                      readOnly
                      name="os_version"
                      defaultValue={
                        modalData ? modalData.os_version : 'os_version'
                      }
                      onKeyPress={(e) => {
                        Validation.NumbersOnly(e);
                      }}
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
                      id="test_description"
                      name="test_description"
                      key={Math.random()}
                      required
                      readOnly
                      defaultValue={
                        modalData
                          ? modalData.test_description
                          : 'test_description'
                      }
                    ></textarea>
                  </div>

                  <div className="col-sm-4 mt-2">
                    <label className="col-form-label">
                      <b>Expected Result :</b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      id="expected_result"
                      name="expected_result"
                      required
                      readOnly
                      key={Math.random()}
                      defaultValue={
                        modalData
                          ? modalData.expected_result
                          : 'expected_result'
                      }
                    ></textarea>
                  </div>

                  <div className="col-sm-4 mt-2">
                    <label className="col-form-label">
                      <b>Actual Result :</b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      id="actual_result"
                      name="actual_result"
                      disabled
                      required
                      readOnly={
                        userTypeData != 'DEV' ||
                        userTypeData != 'BA' ||
                        isReviewer == true
                          ? false
                          : true
                      }
                      key={Math.random()}
                      defaultValue={
                        modalData ? modalData.actual_result : 'actual_result'
                      }
                    ></textarea>
                  </div>
                  <div className="col-sm-4 mt-2">
                    <label className="col-form-label">
                      <b>Tester Comment :</b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      id="tester_comments"
                      name="tester_comments"
                      key={Math.random()}
                      defaultValue={
                        modalData
                          ? modalData.tester_comments
                          : 'tester_comments'
                      }
                      readOnly={userTypeData === 'DEV' || userTypeData === 'BA'}
                    ></textarea>
                  </div>
                  <div className="col-sm-4 mt-2">
                    <label className="col-form-label">
                      <b>Developer Comment :</b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      id="dev_comments"
                      name="dev_comments"
                      key={Math.random()}
                      defaultValue={
                        modalData ? modalData.dev_comments : 'dev_comments'
                      }
                      readOnly={
                        userTypeData === 'TESTER' || userTypeData === 'BA'
                      }
                    ></textarea>
                  </div>
                  <div className="col-sm-4 mt-2">
                    <label className="col-form-label">
                      <b>BA Comment :</b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      id="ba_comments"
                      name="ba_comments"
                      key={Math.random()}
                      defaultValue={
                        modalData ? modalData.ba_comments : 'ba_comments'
                      }
                      readOnly={
                        userTypeData === 'DEV' || userTypeData === 'TESTER'
                          ? true
                          : false
                      }
                    ></textarea>
                  </div>

                  <div className="col-sm-4 mt-2">
                    <label className="col-form-label">
                      <b>Reviewer Comment :</b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      id="reviewer_comments"
                      name="reviewer_comments"
                      key={Math.random()}
                      defaultValue={
                        modalData
                          ? modalData.reviewer_comments
                          : 'reviewer_comments'
                      }
                      readOnly={isReviewer == false ? true : false}
                    ></textarea>
                  </div>

                  <div className="col-sm-2 mt-2">
                    <label className="col-form-label">
                      <b>Tester Status : </b>
                    </label>
                    <select
                      className="form-control form-control-1sm"
                      id="tester_status"
                      name="tester_status"
                      defaultValue={
                        modalData ? modalData.tester_status : 'tester_status'
                      }
                      // onChange={(e) => colorStyle(e)}
                      required
                      key={Math.random()}
                      // style={{ backgroundColor: `${colors}`, color: 'white' }}
                      // disabled={userTypeData !== "DEV"||userTypeData != "BA"|| isReviewer == true ? false :true}>
                      disabled={
                        userTypeData == 'DEV' ||
                        userTypeData == 'BA' ||
                        isReviewer === '0'
                          ? true
                          : false
                      }
                    >
                      <option value="" selected>
                        Select..
                      </option>
                      <option
                        value="PASS"
                        style={{ backgroundColor: 'white', color: 'black' }}
                      >
                        Pass
                      </option>
                      <option
                        value="FAIL"
                        style={{ backgroundColor: 'white', color: 'black' }}
                      >
                        Fail
                      </option>
                      <option
                        value="UNDER_DEVELOPMENT"
                        style={{ backgroundColor: 'white', color: 'black' }}
                      >
                        Under Development
                      </option>
                      <option
                        value="SUGGESTION"
                        style={{ backgroundColor: 'white', color: 'black' }}
                      >
                        Suggestion
                      </option>
                    </select>
                  </div>
                  <div className="col-sm-2 mt-2">
                    <label className="col-form-label">
                      <b>Developer Status : </b>
                    </label>
                    <select
                      className="form-control form-control-1sm"
                      id="dev_status"
                      name="dev_status"
                      defaultValue={
                        modalData ? modalData.dev_status : 'dev_status'
                      }
                      // onChange={(e) => colorStyle(e)}
                      key={Math.random()}
                      // style={{ backgroundColor: `${colors}`, color: 'white' }}
                      disabled={
                        userTypeData === 'TESTER' || userTypeData === 'BA'
                      }
                    >
                      <option value="" selected>
                        Select..
                      </option>
                      <option value="SOLVED">SOLVED</option>
                      <option value="RSOLVED">RSOLVED</option>
                      <option value="DEFFERED">DEFFERED</option>
                      <option value="NOT_A_BUG">NOT A BUG</option>
                      <option value="PENDING">PENDING</option>
                      <option value="CR">CR</option>
                    </select>
                  </div>

                  <div className="col-sm-2 mt-2">
                    <label className="col-form-label">
                      <b>BA Status : </b>
                    </label>
                    <select
                      className="form-control form-control-1sm"
                      id="ba_status"
                      name="ba_status"
                      key={Math.random()}
                      defaultValue={
                        modalData ? modalData.ba_status : 'ba_status'
                      }
                      // onChange={(e) => colorStyle(e)}
                      // style={{ backgroundColor: `${colors}`, color: 'white' }}
                      disabled={
                        userTypeData === 'DEV' || userTypeData === 'TESTER'
                      }
                    >
                      <option value="" selected>
                        Select..
                      </option>
                      <option value="NOT_A_BUG">NOT A BUG</option>
                      <option value="CR">CR</option>
                      <option value="BUG">BUG</option>
                      <option value="NOT_IN_THIS_PHASE">
                        NOT IN THIS PHASE
                      </option>
                      <option value="SOLVED">SOLVED</option>
                    </select>
                  </div>

                  <div className="col-sm-2 mt-2">
                    <label className="col-form-label">
                      <b> Severity : </b>
                    </label>
                    <select
                      className="form-control form-control-1sm"
                      id="severity"
                      name="severity"
                      disabled
                      key={Math.random()}
                      defaultValue={modalData ? modalData.severity : 'severity'}
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>;
                      <option value="LOW">Low</option>;
                    </select>
                  </div>

                  <div className="col-sm-2 mt-2">
                    <label className="col-form-label">
                      <b> Priority : </b>
                    </label>
                    <select
                      className="form-control form-control-1sm"
                      id="priority"
                      name="priority"
                      key={Math.random()}
                      defaultValue={modalData ? modalData.priority : 'priority'}
                      disabled={
                        userTypeData === 'DEV' || userTypeData === 'TESTER'
                      }
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>;
                      <option value="LOW">Low</option>;
                    </select>
                  </div>
                  {userTypeData == 'TESTER' ||
                    (isReviewer == 1 && (
                      <div className=" col-sm-4 mt-2">
                        <label className="col-form-label">
                          <b>Screenshot :</b>
                        </label>
                        <input
                          type="file"
                          accept="image/jpg,image/jpeg,image/png, video/mp4"
                          name="attachment[]"
                          id="attachment"
                          className="form-control"
                          multiple
                          required={
                            modalData && modalData.tester_status == 'FAIL'
                              ? true
                              : false
                          }
                          onChange={maxLengthCheck}
                          ref={fileInputRef}
                          // required={testerStatus === "FAIL" ? true : false}
                          // onChange={(e) => { uploadAttachmentHandler(e, "UPLOAD", '') }}
                        ></input>
                      </div>
                    ))}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="col-sm-1  mt-4">
                {/* {data && modalData.index-1 > 1 && */}
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={(e) => {
                    getData(e, modalData.index - 1);
                  }}
                >
                  Prev
                </button>
                {/* } */}
              </div>
              <div className="col-sm-1  mt-4">
                {/* {data && modalData.index+1 < data.length && */}
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={(e) => {
                    getData(e, modalData.index + 1);
                  }}
                >
                  Next
                </button>
                {/* } */}
              </div>

              <div className="col-sm-1  mt-4">
                <button className="btn btn-warning" type="submit">
                  Update
                </button>
              </div>
              <div className="col-sm-1 mt-4">
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={(e) => {
                    handleModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Modal>
      {/* Edit Functionality */}

      {/* Send Test Cases Notification */}
      <Modal
        size="md"
        centered
        show={sendtoModal.showModal}
        onHide={(e) => {
          handleSendtoModal({
            showModal: false,
            modalData: '',
            modalHeader: ''
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {sendtoModal.modalHeader}
          </Modal.Title>
        </Modal.Header>
        <form method="post" onSubmit={handleSendNotificationToMulti}>
          <Modal.Body>
            <div className="container">
              <div className="deadline-form ">
                <div className="form-group row ">
                  <input
                    type="hidden"
                    name="ticket_id"
                    id="ticket_id"
                    value={ticketId}
                  />
                  <div className="col-md">
                    <label className="col-form-label">
                      <b>Select User:</b>
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
              style={{ backgroundColor: '#484C7F' }}
            >
              Submit
            </button>

            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={(e) => {
                handleSendtoModal({
                  showModal: false,
                  modalData: '',
                  modalHeader: ''
                });
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
      {/* Send Test Cases Notifcation */}

      <div className="container-xxl">
        <form onSubmit={handleFilter} method="post">
          <div className="card mt-2" style={{ zIndex: 10 }}>
            <div className="card-body">
              <div className="form-group row">
                <div className="col-sm-4">
                  <label>
                    <b>Task Name:</b>
                  </label>
                  <Select
                    className="form-control form-control-sm-6"
                    id="task_id"
                    name="task_id"
                    isClearable
                    options={taskDropdown}
                    ref={selectInputRef}
                  />
                </div>

                <div className="col-sm-2">
                  <label>
                    <b>Testing Type :</b>
                  </label>
                  {testingTypeDropdown && (
                    <Select
                      type="text"
                      className="form-control form-control-sm"
                      id="testing_type"
                      name="testing_type"
                      options={testingTypeDropdown}
                      ref={selectTestingTypeRef}
                    />
                  )}
                </div>

                <div className="col-sm-2">
                  <label>
                    <b>Tester Status:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="tester_status"
                    name="tester_status"
                    ref={selectTesterStatusRef}
                  >
                    {/* <option value={null} disabled selected>select</option> */}
                    <option value={null}></option>

                    <option
                      value="PASS"
                      style={{ backgroundColor: 'white', color: 'black' }}
                    >
                      Pass
                    </option>
                    <option
                      value="FAIL"
                      style={{ backgroundColor: 'white', color: 'black' }}
                    >
                      Fail
                    </option>
                    <option
                      value="UNDER_DEVELOPMENT"
                      style={{ backgroundColor: 'white', color: 'black' }}
                    >
                      Under Development
                    </option>
                    <option
                      value="SUGGESTION"
                      style={{ backgroundColor: 'white', color: 'black' }}
                    >
                      Suggestion
                    </option>
                  </select>
                </div>

                <div className="col-sm-2">
                  <label>
                    <b>BA Status:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    name="ba_status"
                    id="ba_status"
                    ref={selectBAStatusRef}
                  >
                    <option value="" selected disabled hidden>
                      Select..
                    </option>
                    <option value="NOT_A_BUG">NOT A BUG</option>
                    <option value="CR">CR</option>
                    <option value="BUG">BUG</option>
                    <option value="NOT_IN_THIS_PHASE">NOT IN THIS PHASE</option>
                    <option value="SOLVED">SOLVED</option>
                  </select>
                </div>

                <div className="col-sm-2">
                  <label>
                    <b>Dev Status:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="developer_status"
                    name="developer_status"
                    ref={selectDevStatusRef}
                  >
                    <option value="" selected disabled hidden>
                      Select..
                    </option>

                    <option value="SOLVED">SOLVED</option>
                    <option value="RSOLVED">RSOLVED</option>
                    <option value="DEFFERED">DEFFERED</option>
                    <option value="NOT_A_BUG">NOT A BUG</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CR">CR</option>
                  </select>
                </div>

                <div className="col-sm-2 mt-2">
                  <label>
                    <b>Priority:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="priority"
                    name="priority"
                    ref={selectPriorityRef}
                  >
                    <option value={null}></option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM </option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div className="col-sm-2 mt-2">
                  <label>
                    <b>Severity:</b>
                  </label>
                  <select
                    className="form-control form-control-sm mt-2"
                    id="severity"
                    name="severity"
                    ref={selectSeverityRef}
                  >
                    <option value={null}></option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div className="col-md-2 mt-3">
                  <button
                    id="filterSearch"
                    className="btn btn-sm btn-warning text-white"
                    type="submit"
                    style={{ marginTop: '20px', fontWeight: '600' }}
                  >
                    <i className="icofont-search-1 "></i> Search
                  </button>
                  <button
                    className="btn btn-sm btn-info text-white"
                    type="button"
                    // onClick={() => window.location.reload(false)}
                    onClick={handleClearData}
                    style={{ marginTop: '20px', fontWeight: '600' }}
                  >
                    <i className="icofont-refresh text-white"></i> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* <div className='card mt-2'>
          <div className='card-body'>
            <div className='form-group row'>
              <div className='row'>
                {chartData &&
                  chartData.series.map((series, index) => (
                    <div className='col-sm-4' key={index}>
                      <h6 className='fw-bold'>Iteration Cycle {index + 1}</h6>
                      <b>Duration: {chartData.annotations.text[0][index]}</b>
                      <Chart
                        options={chartData.options}
                        series={series.data}
                        type='donut'
                        height='150'
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <div className="container-xxl">
        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {/* { data && selectedRowsData && selectedRowsData.length <= 0 &&
                    <span style={{color:"red", fontWeight:"bold", fontStyle:"italic"}}>Note: Please select atleast one test case before sending </span> }
                */}

                <div className="d-flex flex-row-reverse">
                  <ExportToExcel
                    className="btn btn-sm btn-danger"
                    apiData={exportData}
                    fileName="Test Cases"
                  />
                  <div>
                    {data && (
                      <button
                        className="btn  btn-primary"
                        type="button"
                        onClick={() => {
                          handleSendtoModal({
                            showModal: true,
                            modalData: '',
                            modalHeader: 'Assign Test Cases To'
                          });
                        }}
                      >
                        Send To <i className="icofont-sign-in" />
                      </button>
                    )}
                  </div>
                </div>
                <div></div>

                {data && (
                  <DataTableExtensions {...tableData}>
                    <DataTable
                      columns={columns}
                      // defaultSortField="title"
                      data={data}
                      // pagination
                      // paginationComponentOptions={paginationComponentOptions}

                      // selectableRows={true}
                      // onSelectedRowsChange={selectTest}
                      onSelectedRowsChange={handleSelectedRowsChange} // handle selection of rows
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover={true}
                      pointerOnHover={true}
                      expandableRows
                      expandableRowsComponent={ExpandedComponent}
                      // selectableRowDisabled={rowDisabledCriteria}
                      responsive={true}
                    />
                  </DataTableExtensions>
                )}
                <div className="back-to-top pull-right mt-2 mx-2">
                  <label className="mx-2">rows per page</label>
                  <select
                    id="limit_per_page"
                    onChange={(e) => {
                      handleFilterAgain(e, 'LIMIT');
                    }}
                    className="mx-2"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                  </select>
                  {/* { assignedToMeData &&
                        <small>{assignedToMeData.from}-{assignedToMeData.to} of {assignedToMeData.total}</small>
                        } */}
                  <button
                    type="button"
                    onClick={(e) => {
                      handleFilterAgain(e, 'MINUS');
                    }}
                    className="mx-2"
                  >
                    <i className="icofont-arrow-left"></i>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      handleFilterAgain(e, 'PLUS');
                    }}
                  >
                    <i className="icofont-arrow-right"></i>
                  </button>
                </div>
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
    </div>
  );
};

export default GetAllTestCases;
