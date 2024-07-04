import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import { Astrick } from '../../components/Utilities/Style';
import ErrorLogService from '../../services/ErrorLogService';
import UserService from '../../services/MastersService/UserService';
import ReportService from '../../services/ReportService/ReportService';
import PageHeader from '../../components/Common/PageHeader';
import Select from 'react-select';
import { ExportToExcel } from '../../components/Utilities/Table/ExportToExcel';

import { getRoles } from '../Dashboard/DashboardAction';
import { useDispatch, useSelector } from 'react-redux';
import DropdownLoadingSkeleton from '../../components/custom/loader/DropdownLoadingSkeleton';
import TableLoadingSkelton from '../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../components/Common/SearchBoxHeader ';

export default function ResourcePlanningReportComponent() {
  const dispatch = useDispatch();
  const isMenuRoleChecked = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 38)
  );
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [data, setData] = useState(null);
  const [exportData, setExportData] = useState(null);

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
  ];

  const loadData = async () => {
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
  const handleReset = () => {
    window.location.reload(false);
  };

  const handleForm = async (e) => {
    setIsLoading(true);
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
            setIsLoading(false);

            setSearchPerformed(true);
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
  }, []);

  useEffect(() => {
    if (isMenuRoleChecked && isMenuRoleChecked[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, []);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Variance Report" />
      <div>
        <div className="card mt-2">
          <div className="card-body p-5">
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
              <div className="row_gap_3">
                <SearchBoxHeader
                  showInput={false}
                  title="Variance Report"
                  // showtitle={true}
                  handleReset={handleReset}
                  submitButtonType="submit"
                  resetButtonType="button"
                  placeholder="Search by city name...."
                  exportFileName="City Master Record"
                  exportData={exportData}
                  showExportButton={true}
                />
              </div>

              {/* <div className="row mt-4">
              <div className="col-md-6">
                <button
                  className="btn btn-sm btn-warning text-white"
                  type="submit"
                >
                  <i className="icofont-search-1 " /> Search
                </button>
                <button
                  className="btn btn-sm btn-info text-white"
                  type="button"
                  onClick={() => window.location.reload(false)}
                >
                  <i className="icofont-refresh text-white" /> Reset
                </button>
              </div>
              <div className="col-md-6 d-flex justify-content-end">
                {data && data.length > 0 && (
                  <ExportToExcel
                    className="btn btn-sm btn-danger"
                    apiData={exportData && exportData}
                    fileName="Variance Report"
                  />
                )}
              </div>
            </div> */}
            </form>
          </div>
        </div>
      </div>

      {/* <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12"> */}
      {isLoading ? (
        <TableLoadingSkelton />
      ) : (
        <>
          {data && data.length > 0 ? (
            <div className="card mt-3">
              <DataTable
                columns={columns}
                data={data}
                defaultSortField="title"
                pagination
                selectableRows={false}
                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                highlightOnHover={true}
              />
            </div>
          ) : (
            <>
              {searchPerformed && !isLoading && (
                <div className="text-center">No data found</div>
              )}
            </>
          )}
        </>
      )}
    </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
