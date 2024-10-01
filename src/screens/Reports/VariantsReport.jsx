import React, { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Modal, Spinner } from 'react-bootstrap';
import { Astrick } from '../../components/Utilities/Style';
import ErrorLogService from '../../services/ErrorLogService';
import UserService from '../../services/MastersService/UserService';
import ReportService from '../../services/ReportService/ReportService';
import PageHeader from '../../components/Common/PageHeader';
import Select from 'react-select';
import { ExportToExcel } from '../../components/Utilities/Table/ExportToExcel';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { getRoles } from '../Dashboard/DashboardAction';
import { useDispatch, useSelector } from 'react-redux';

export default function ResourcePlanningReportComponent() {
  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 38)
  );
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const [exportData, setExportData] = useState(null);

  const [showLoaderModal, setShowLoaderModal] = useState(false);

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
      name: 'Sprint Name',
      selector: (row) => row.sprint_name || "-",
      sortable: true,
      width: '150px'
    },

    {
      name: 'Task Name',
      width: '10%',
      selector: (row) => row.task_name,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.task_name && (
            <OverlayTrigger overlay={<Tooltip>{row.task_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.task_name && row.task_name.length < 10
                    ? row.task_name
                    : row.task_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Task Type Name',
      width: '10%',
      selector: (row) => row.type_name,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.type_name && (
            <OverlayTrigger overlay={<Tooltip>{row.type_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.type_name && row.type_name.length < 10
                    ? row.type_name
                    : row.type_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
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
      width: '7%',
      selector: (row) => row.task_actual_status,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.task_actual_status && (
            <OverlayTrigger
              overlay={<Tooltip>{row.task_actual_status} </Tooltip>}
            >
              <div>
                <span className="ms-1">
                  {' '}
                  {row.task_actual_status && row.task_actual_status.length < 10
                    ? row.task_actual_status
                    : row.task_actual_status.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Completed At',
      width: '10%',
      selector: (row) => row.task_completed_at,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.task_completed_at && (
            <OverlayTrigger
              overlay={<Tooltip>{row.task_completed_at} </Tooltip>}
            >
              <div>
                <span className="ms-1">
                  {' '}
                  {row.task_completed_at && row.task_completed_at.length < 10
                    ? row.task_completed_at
                    : row.task_completed_at.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    }
  ];

  const loadData = useCallback(async () => {
    const tempUserData = [];

    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        const data = res.data.data.filter(
          (d) => d.is_active === 1 && d.account_for === 'SELF'
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

    dispatch(getRoles());
  }, [dispatch]);

  const handleFromDate = (e) => {
    const gettodatevalue = e.target.value;
    const setdateformat = gettodatevalue.split('-');
    const settoyear = setdateformat[0];
    const settomonth = setdateformat[1];
    const settodate = setdateformat[2];
    const settodateformat = settoyear + '' + settomonth + '' + settodate;

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

    setFromdateformat(setfromformatdate);
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
      await new ReportService()
        .variantsReport(formData)
        .then((res) => {
          if (res.status === 200) {
            setShowLoaderModal(false);
            if (res.data.status === 1) {
              let sr = 1;
              const data = res.data.data;
              if (data && data.length > 0) {
                for (const key in data) {
                  tempData.push({
                    sr: sr++,
                    ticket_id: data[key].ticket_id,
                    task_owner: data[key].task_owner,
                    task_name: data[key].task_name,
                    type_name: data[key].type_name,
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
                    sprint_name: data[key].sprint_name || "-",
                    sprint_start_date: data[key].start_date || "-",
                    sprint_end_date: data[key].end_date || "-",
                    task_name: data[key].task_name,
                    type_name: data[key].type_name,
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
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            'VariantsReport',
            'Get_VariantsReport',
            'INSERT',
            errorObject.data.message
          );
        });
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Variance Report" />

      <div className="card mt-2" style={{ zIndex: 10 }}>
        <div className="card-body">
          <form onSubmit={handleForm}>
            <div className="row">
              <div className="col-md-3">
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
                    options={userData && userData}
                  />
                )}
              </div>

              <div className="col-md-3">
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

              <div className="col-md-3">
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
            <div className="row">
              <div className="col-md-2">
                <button
                  className="btn btn-sm btn-warning text-white"
                  type="submit"
                  style={{ marginTop: '20px', fontWeight: '600' }}
                >
                  <i className="icofont-search-1 "></i> Search
                </button>
                <button
                  className="btn btn-sm btn-info text-white"
                  type="button"
                  onClick={() => window.location.reload(false)}
                  style={{ marginTop: '20px', fontWeight: '600' }}
                >
                  <i className="icofont-refresh text-white"></i> Reset
                </button>
              </div>
              {data && data.length > 0 && (
                <div
                  className="col-md-10"
                  style={{
                    textAlign: 'right',
                    marginTop: '20px',
                    fontWeight: '600'
                  }}
                >
                  <ExportToExcel
                    className="btn btn-sm btn-danger"
                    apiData={exportData && exportData}
                    fileName="Variance Report"
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
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
}
