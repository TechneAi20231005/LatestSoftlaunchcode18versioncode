import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Table } from 'react-bootstrap';
import ErrorLogService from '../../services/ErrorLogService';
import UserService from '../../services/MastersService/UserService';
import ReportService from '../../services/ReportService/ReportService';
import PageHeader from '../../components/Common/PageHeader';
import Select from 'react-select';
import { Astrick } from '../../components/Utilities/Style';
import { ExportToExcel } from '../../components/Utilities/Table/ExportToExcel';
import { Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { _base, userSessionData } from '../../settings/constants';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../Dashboard/DashboardAction';
import TableLoadingSkelton from '../../components/custom/loader/TableLoadingSkelton';
import DropdownLoadingSkeleton from '../../components/custom/loader/DropdownLoadingSkeleton';

export default function ResourcePlanningReportComponent() {
  const dispatch = useDispatch();

  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 25)
  );

  const [todate, setTodate] = useState([]);
  const [fromdate, setFromdate] = useState([]);

  const [todateformat, setTodateformat] = useState('');
  const [fromdateformat, setFromdateformat] = useState('');

  const columns = [
    { name: 'Sr', selector: (row) => row.sr, sortable: false, width: '70px' },
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true,
      width: '150px'
    },
    {
      name: 'User Name',
      selector: (row) => row.user_name,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Hours',
      selector: (row) => row.hours,
      sortable: true,
      width: '100px'
    }
  ];

  const loadData = async () => {
    setShowLoaderModal(null);
    setShowLoaderModal(true);
    const tempUserData = [];
    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        setShowLoaderModal(false);
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

  const handleForm = async (e) => {
    setShowLoaderModal(null);
    setIsLoading(true);

    e.preventDefault();
    const formData = new FormData(e.target);
    const tempData = [];
    var flag = 1;

    if (todateformat > fromdateformat) {
      alert('Please select End Date Greater than Start date');
    } else {
      if (flag === 1) {
        try {
          const res = await new ReportService().getResourcePlanningReport(
            formData
          );
          if (res.status === 200) {
            setIsLoading(false);

            setShowLoaderModal(false);
            if (res.data.status === 1) {
              let sr = 1;
              const data = res.data.data;

              if (data && data.length > 0) {
                for (const key in data) {
                  tempData.push({
                    sr: sr++,
                    date: data[key].date,
                    hours: data[key].hours,
                    user_id: data[key].user_id,
                    user_name: data[key].user_name,
                    tasks: data[key].tasks
                  });
                }
                setData(null);
                setData(tempData);

                const exportTempData = [];
                for (const i in data) {
                  const tasks = Array.isArray(data[i].tasks)
                    ? data[i].tasks
                    : [];
                  let counter = 1;
                  for (const task of tasks) {
                    exportTempData.push({
                      sr: counter++,
                      ticket_id: task.ticket_id,
                      date: data[i].date,
                      user_name: data[i].user_name,
                      task_name: task.task_name,
                      total_hours: task.total_hours
                    });
                  }
                }

                setExportData(exportTempData);
              } else {
                setData(null);
              }
            } else {
              setData(null);
            }
          } else {
            new ErrorLogService().sendErrorLog(
              'ResourcePlanning',
              'Get_ResourcePlanning',
              'INSERT',
              res.message
            );
          }
        } catch (error) {
          if (error.response && error.response.data) {
            new ErrorLogService().sendErrorLog(
              'ResourcePlanning',
              'Get_ResourcePlanning',
              'INSERT',
              error.response.data.message
            );
          } else {
            new ErrorLogService().sendErrorLog(
              'ResourcePlanning',
              'Get_ResourcePlanning',
              'INSERT',
              error.message
            );
          }
        }
      }
    }
  };

  const ExpandedComponent = ({ data }) => (
    <pre>
      <Table>
        <thead>
          <tr>
            <th>Sr</th>
            <th>Task Name</th>
            <th>Task Hour</th>
          </tr>
        </thead>
        <tbody>
          {data.tasks &&
            data.tasks.length > 0 &&
            data.tasks.map((task, key) => {
              return (
                <tr>
                  <td>{key + 1}</td>

                  <td>
                    <Link to={`/${_base}/Ticket/Task/${task.id}`}>
                      <span style={{ fontWeight: 'bold' }}>
                        {' '}
                        {task.ticket_id}{' '}
                      </span>
                    </Link>
                    - {task.task_name}
                  </td>
                  <td>{task.total_hours}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </pre>
  );

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, []);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Resource Planing Report" />

      <div className="card mt-2">
        <div className="card-body">
          <form onSubmit={handleForm}>
            <div className="row">
              <div className="col-md-3">
                <label htmlFor="" className="">
                  <b>Select User :</b>
                </label>
                {showLoaderModal && <DropdownLoadingSkeleton />}
                {!showLoaderModal && userData && (
                  <Select
                    isMulti
                    isSearchable={true}
                    name="user_id[]"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={userData}
                    required
                  />
                )}
              </div>

              <div className="col-md-3">
                <label htmlFor="" className="">
                  <b>
                    From Date :<Astrick color="red" size="13px" />
                  </b>
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  name="from_date"
                  onChange={handleFromDate}
                  required
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="" className="">
                  <b>
                    To Date :<Astrick color="red" size="13px" />
                  </b>
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  name="to_date"
                  onChange={handleToDate}
                  required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                <button
                  className="btn btn-sm btn-warning text-white"
                  type="submit"
                >
                  <i className="icofont-search-1 "></i> Search
                </button>
                <button
                  className="btn btn-sm btn-info text-white"
                  type="button"
                  onClick={() => window.location.reload(false)}
                >
                  <i className="icofont-refresh text-white"></i> Reset
                </button>
              </div>
              <div className="col-md-6 d-flex justify-content-end">
                <ExportToExcel
                  className="btn btn-sm btn-danger"
                  apiData={exportData}
                  fileName="Planning Report"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {isLoading ? (
                <TableLoadingSkelton />
              ) : data && data.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={data}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                  expandableRows
                  expandableRowsComponent={ExpandedComponent}
                />
              ) : (
                <div className="text-center">No data found</div>
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
