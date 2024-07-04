import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import ErrorLogService from '../../services/ErrorLogService';
import UserService from '../../services/MastersService/UserService';
import ReportService from '../../services/ReportService/ReportService';
import PageHeader from '../../components/Common/PageHeader';
import Select from 'react-select';

import * as Validation from '../../components/Utilities/Validation';
import { ExportToExcel } from '../../components/Utilities/Table/ExportToExcel';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../Dashboard/DashboardAction';
import TableLoadingSkelton from '../../components/custom/loader/TableLoadingSkelton';
import DropdownLoadingSkeleton from '../../components/custom/loader/DropdownLoadingSkeleton';
import SearchBoxHeader from '../../components/Common/SearchBoxHeader ';

function UserTaskReportComponent() {
  const dispatch = useDispatch();

  const [isLoading, setISLoading] = useState(false);

  const isMenuRoleChecked = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 24)
  );

  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);

  const [exportData, setExportData] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [todate, setTodate] = useState([]);
  const [fromdate, setFromdate] = useState([]);

  const [todateformat, setTodateformat] = useState('');
  const [fromdateformat, setFromdateformat] = useState('');
  // const initialState = {
  //   user_id: [],
  //   task_name: '',
  //   from_date: '',
  //   to_date: ''
  // };
  // const [formState, setFormState] = useState(initialState);

  const columns = [
    {
      name: 'Sr No',
      selector: (row) => row.sr,
      sortable: true,
      width: '100px'
    },
    {
      name: 'Ticket Id',
      selector: (row) => row.ticket_id,
      sortable: true,
      width: '150px'
    },
    { name: 'Task Name', selector: (row) => row.task_name, sortable: true },
    { name: 'User Name', selector: (row) => row.user_name, sortable: true },
    {
      name: 'Total Worked',
      selector: (row) => row.total_worked,
      sortable: true
    },
    { name: 'Status', selector: (row) => row.status, sortable: true },
    { name: 'Updated At', selector: (row) => row.updated_at, sortable: true }
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

    dispatch(getRoles);
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
    e.preventDefault();

    setISLoading(true);

    const formData = new FormData(e.target);

    if (todateformat > fromdateformat) {
      alert('Please select Date After From date');
    } else {
      await new ReportService()
        .getUserTaskReport(formData)
        .then((res) => {
          if (res.status === 200) {
            setSearchPerformed(true);
            const tempData = [];
            const exportTempData = [];

            let counter = 1;

            var temp = res.data.data;
            for (const key in temp) {
              tempData.push({
                sr: counter++,
                ticket_id: temp[key].ticket_id,
                task_name: temp[key].task_name,
                user_name: temp[key].employee_name,
                total_worked: temp[key].total_worked,
                status: temp[key].status,
                updated_at: temp[key].updated_at
              });
            }
            setData(null);
            setData(tempData);
            setISLoading(false);
            let count = 1;
            for (const key in temp) {
              exportTempData.push({
                sr: count++,
                ticket_id: temp[key].ticket_id,
                task_name: temp[key].task_name,
                user_name: temp[key].employee_name,
                total_worked: temp[key].total_worked,
                status: temp[key].status,
                updated_at: temp[key].updated_at
              });
            }
            setExportData(null);
            setExportData(exportTempData);
          } else {
            new ErrorLogService().sendErrorLog(
              'UserTask',
              'Get_UserTask',
              'INSERT',
              res.message
            );
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            'UserTask',
            'Get_UserTask',
            'INSERT',
            errorObject.data.message
          );
        });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleForm();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isMenuRoleChecked && isMenuRoleChecked[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [isMenuRoleChecked]);
  const handleReset = () => {
    // ) => window.location.reload(false)
    window.location.reload(false);
  };

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="User Task Report" />
      <form onSubmit={handleForm}>
        <div className="card mt-2">
          <div className="card-body p-5">
            <form onSubmit={handleForm}>
              <div className="row">
                <div className="col-md-3">
                  <label>
                    <b>Select User :</b>
                  </label>
                  {/* {showLoaderModal && <DropdownLoadingSkeleton />} */}
                  {userData && (
                    <Select
                      isMulti
                      isSearchable={true}
                      name="user_id[]"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      options={userData}
                    />
                  )}
                </div>
                <div className="col-md-3">
                  <label>
                    <b>Search Task :</b>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersOnly(e);
                    }}
                    onKeyDown={handleKeyDown}
                    name="task_name"
                  />
                </div>

                <div className="col-md-3">
                  <label>
                    <b>From Date :</b>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    name="from_date"
                    onChange={handleFromDate}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="" className="">
                    <b>To Date :</b>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    name="to_date"
                    onChange={handleToDate}
                  />
                </div>
                <div className="row_gap_3 mt-3">
                  <SearchBoxHeader
                    showInput={false}
                    title="User Task Report"
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
                <div className="col-md-6 ">
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
                      apiData={exportData}
                      fileName="User Task Report"
                    />
                  )}
                </div>
              </div> */}
              </div>
            </form>
          </div>
        </div>
      </form>

      {isLoading ? (
        <TableLoadingSkelton />
      ) : data && data.length > 0 ? (
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
        searchPerformed &&
        !isLoading && <div className="text-center mt-3">No data found</div>
      )}
    </div>
  );
}

export default UserTaskReportComponent;
