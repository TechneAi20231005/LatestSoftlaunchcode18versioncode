import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Modal, Spinner, Accordion, table } from 'react-bootstrap';
import { Astrick } from '../../components/Utilities/Style';
import ErrorLogService from '../../services/ErrorLogService';
import UserService from '../../services/MastersService/UserService';
import ReportService from '../../services/ReportService/ReportService';
import PageHeader from '../../components/Common/PageHeader';
import Select from 'react-select';
import { ExportToExcel } from '../../components/Utilities/Table/ExportToExcel';
import ManageMenuService from '../../services/MenuManagementService/ManageMenuService';
import { getRoles } from '../Dashboard/DashboardAction';
import { useDispatch, useSelector } from 'react-redux';

export default function ResourcePlanningReportComponent() {
  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 38)
  );
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [selectedUser, setSelectedUser] = useState([]);
  const [individualTask, setIndividualTask] = useState([]);
  const roleId = sessionStorage.getItem('role_id');
  // const [checkRole, setCheckRole] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [todate, setTodate] = useState([]);
  const [fromdate, setFromdate] = useState([]);

  const [todateformat, setTodateformat] = useState('');
  const [fromdateformat, setFromdateformat] = useState('');

  const columns = [
    { name: 'Sr', selector: (row) => row.sr, sortable: true, width: '75px' },
    { name: 'Ticket Id', selector: (row) => row.ticket_id, sortable: true },
    {
      name: 'Task Owner',
      selector: (row) => row.task_owner,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Task Name',
      selector: (row) => row.task_name,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Start Date',
      selector: (row) => row.task_start_Date,
      sortable: true
    },

    {
      name: 'Task Scheduled Hours',
      selector: (row) => row.task_scheduled_Hours,
      sortable: true
    },
    {
      name: 'Actual Worked',
      selector: (row) => row.task_actual_worked,
      sortable: true
    },
    {
      name: 'Delivery Scheduled',
      selector: (row) => row.task_delivery_scheduled,
      sortable: true
    },
    { name: 'Status', selector: (row) => row.task_status, sortable: true },
    {
      name: 'Actual Status',
      selector: (row) => row.task_actual_status,
      sortable: true
    },
    {
      name: 'Completed At',
      selector: (row) => row.task_completed_at,
      sortable: true
    }
    // { name: 'Action', width:"18%", button: true,
    //     ignoreRowClick: true,
    //     allowOverflow: true,
    //     cell: row =>
    //     <button type="button" className="btn btn-sm btn-danger text-white"
    //     name="a"
    //     onClick={(e)=>getTasks(e,row.user_id,toDateRef.current.value,fromDateRef.current.value)}>
    //     <i className='icofont-ui-delete text-white'
    //     style={{fontSize:'15px'}}></i>
    // </button>
    // }
  ];

  const loadData = async () => {
    const tempUserData = [];
    const exportTempData = [];
    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        const data = res.data.data.filter(
          (d) => d.is_active == 1 && d.account_for === 'SELF'
        );
        for (const key in data) {
          tempUserData.push({
            value: data[key].id,
            label:
              data[key].first_name +
              ' ' +
              data[key].last_name +
              ' (' +
              data[key].id +
              ')'
          });
        }
        const aa = tempUserData.sort(function (a, b) {
          return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
        });
        setUserData(aa);
      }
    });

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });
    dispatch(getRoles());

    // const data = [];
    // await new ReportService()
    //   .variantsReport()
    //   .then((res) => {
    //     if (res.status === 200) {
    //       let counter = 1;
    //       const temp = res.data.data;
    //       for (const key in temp) {
    //         data.push({
    //           sr: counter++,
    //           ticket_id: temp[key].ticket_id,
    //           task_owner: temp[key].task_owner,
    //           task_name: temp[key].task_name,
    //           task_start_Date: temp[key].task_start_Date,
    //           task_scheduled_Hours: temp[key].task_scheduled_Hours,
    //           task_actual_worked: temp[key].task_actual_worked,
    //           task_delivery_scheduled: temp[key].task_delivery_scheduled,
    //           task_last_update: temp[key].task_last_update,
    //           task_status: temp[key].task_status,
    //           task_actual_status: temp[key].task_actual_status,
    //           task_completed_at: temp[key].task_completed_at,
    //         });
    //       }
    // setData(null);
    // setData(data);
    // for (const i in temp) {
    //   exportTempData.push({
    //     sr: counter++,
    //     ticket_id: temp[i].ticket_id,
    //     task_owner: temp[i].task_owner,
    //     task_name: temp[i].task_name,
    //     task_start_Date: temp[i].task_start_Date,
    //     task_scheduled_Hours: temp[i].task_scheduled_Hours,
    //     task_actual_worked: temp[i].task_actual_worked,
    //     task_delivery_scheduled: temp[i].task_delivery_scheduled,
    //     task_last_update: temp[i].task_last_update,
    //     task_status: temp[i].task_status,
    //     task_actual_status: temp[i].task_actual_status,
    //     task_completed_at: temp[i].task_completed_at,
    //   });
    // }

    //   setExportData(null);
    //   setExportData(exportTempData);
    // }
    // }
    // )
    // .catch((error) => {
    //   const { response } = error;
    //   const { request, ...errorObject } = response;
    //   new ErrorLogService().sendErrorLog(
    //     "VariantsReport",
    //     "Get_VariantsReport",
    //     "INSERT",
    //     errorObject.data.message
    //   );
    // });
  };

  const handleFromDate = (e) => {
    const gettodatevalue = e.target.value;
    const setdateformat = gettodatevalue.split('-');
    const settoyear = setdateformat[0];
    const settomonth = setdateformat[1];
    const settodate = setdateformat[2];
    const settodateformat = settoyear + '' + settomonth + '' + settodate;
    setTodate(gettodatevalue);
    setTodateformat(settodateformat);
  };

  const handleToDate = (e) => {
    const getfromdatevalue = e.target.value;
    const setfromformat = getfromdatevalue.split('-');
    const setfromyear = setfromformat[0];
    const setfrommonth = setfromformat[1];
    const setfromdate = setfromformat[2];
    const setfromformatdate =
      setfromyear + '' + setfrommonth + '' + setfromdate;
    setFromdate(getfromdatevalue);
    setFromdateformat(setfromformatdate);
  };

  const resetFunction = (e) => {
    setSelectedUser([]);
    setUserData([]);
  };

  const handleForm = async (e) => {
    setShowLoaderModal(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const tempData = [];
    const exportTempData = [];

    if (todateformat > fromdateformat) {
      alert('Please select Date After From date');
    } else {
      var flag = 1;
      await new ReportService()
        .variantsReport(formData)
        .then((res) => {
          if (res.status === 200) {
            setShowLoaderModal(false);
            if (res.data.status == 1) {
              let sr = 1;
              const data = res.data.data;
              const arr = [];
              for (let i = 0; i < selectedUser.length; i++) {
                const filterData = data.filter(
                  (data) => data.task_owner_id === selectedUser[i]?.value
                );
                const payload = {
                  task_owner: selectedUser[i]?.label,
                  user_task: filterData
                };
                arr.push(payload);
                setIndividualTask(arr);
              }
              console.log('individualtask', individualTask);

              if (data && data.length > 0) {
                for (const key in data) {
                  tempData.push({
                    sr: sr++,
                    ticket_id: data[key].ticket_id,
                    task_owner: data[key].task_owner,
                    task_name: data[key].task_name,
                    task_start_Date: data[key].task_start_Date,
                    task_scheduled_Hours: data[key].task_scheduled_Hours,
                    task_actual_worked: data[key].task_actual_worked,
                    task_delivery_scheduled: data[key].task_delivery_scheduled,
                    task_last_update: data[key].task_last_update,
                    task_status: data[key].task_status,
                    task_actual_status: data[key].task_actual_status,
                    task_updated_at: data[key].updated_at,
                    task_completed_at: data[key].task_completed_at
                  });
                }
                setData(null);
                setData(tempData);
                let count = 1;
                for (const key in data) {
                  exportTempData.push({
                    sr: count++,
                    ticket_id: data[key].ticket_id,
                    task_owner: data[key].task_owner,
                    task_name: data[key].task_name,
                    task_start_Date: data[key].task_start_Date,
                    task_scheduled_Hours: data[key].task_scheduled_Hours,
                    task_actual_worked: data[key].task_actual_worked,
                    task_delivery_scheduled: data[key].task_delivery_scheduled,
                    task_last_update: data[key].task_last_update,
                    task_status: data[key].task_status,
                    task_actual_status: data[key].task_actual_status,
                    task_updated_at: data[key].updated_at,
                    task_completed_at: data[key].task_completed_at
                  });
                }

                setExportData(null);
                setExportData(exportTempData);
              } else {
                setData(null);
              }
            } else {
              setData(null);
            }
          } else {
            new ErrorLogService().sendErrorLog(
              'VariantsReport',
              'Get_VariantsReport',
              'INSERT',
              res.message
            );
          }
        })
        .catch((error) => {
          // const { response } = error;
          // const { request, ...errorObject } = response;
          // new ErrorLogService().sendErrorLog(
          //   'VariantsReport',
          //   'Get_VariantsReport',
          //   'INSERT',
          //   errorObject.data.message
          // );
        });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, []);
  console.log('individualTask', individualTask);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Variance Report" />

      <div className="card mt-2">
        <div className="card-body  ">
          <form onSubmit={handleForm}>
            <div className="row">
              <div className="col-md-4 px-2">
                <label htmlFor="" className="">
                  <b>Select User :</b>
                </label>
                {userData && (
                  <Select
                    isMulti
                    isSearchable={true}
                    name="user_id[]"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(e) => setSelectedUser([...e])}
                    options={userData && userData}
                  />
                )}
              </div>

              <div className="col-md-4 px-2">
                <label htmlFor="" className="">
                  <b>
                    From Date : <Astrick color="red" size="13px" />
                  </b>
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  onChange={handleFromDate}
                  name="from_date"
                  required
                />
              </div>

              <div className="col-md-4 px-2">
                <label htmlFor="" className="">
                  <b>
                    To Date : <Astrick color="red" size="13px" />
                  </b>
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  onChange={handleToDate}
                  name="to_date"
                  required
                />
              </div>
            </div>
            <div className="px-2 mt-2 row gap-2 justify-content-end">
              <button
                className="col-md-2 col-lg-1  btn btn-sm btn-warning text-white"
                type="submit"
              >
                <i className="icofont-search-1 "></i> Search
              </button>
              <button
                className="col-md-2 col-lg-1 btn btn-sm btn-info text-white"
                type="button"
                onClick={resetFunction}
                // window.location.reload(false);
              >
                <i className="icofont-refresh text-white"></i> Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {data && data.length > 0 && (
        <div className="px-2 my-2 text-end">
          <ExportToExcel
            className="btn btn-sm btn-danger"
            apiData={exportData && exportData}
            fileName="Variance Report"
          />
        </div>
      )}
      <div className="mb-4 mt-2 text-primary fwt-bold">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="fwt-bold">
              User Detailed Report
            </Accordion.Header>
            <Accordion.Body>
              <table class="table table-md table-hover table-striped-columns">
                <thead>
                  <tr>
                    {/* <th scope="col-">#</th> */}
                    <th scope="col">User Name</th>
                    <th scope="col">Total Task</th>
                    <th scope="col">Total In-Time</th>
                    <th scope="col">Total Delayed</th>
                    <th scope="col">Total Scheduled</th>
                    <th scope="col">Total Played</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="mt-2">
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr className="mt-2">
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                </tbody>
              </table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <div className="col-sm-12">
        {data && (
          <DataTable
            columns={columns}
            data={data}
            defaultSortField="title"
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
            // expandableRows
            // expandableRowsComponent={ExpandedComponent}
          />
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
    </div>
  );
}
