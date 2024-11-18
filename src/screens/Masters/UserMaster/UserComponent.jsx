import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { _base } from '../../../settings/constants';

import UserService from '../../../services/MastersService/UserService';
import PageHeader from '../../../components/Common/PageHeader';

import 'react-data-table-component-extensions/dist/index.css';

import { useDispatch, useSelector } from 'react-redux';

import { getEmployeeData, getRoles } from '../../Dashboard/DashboardAction';
import { departmentData } from '../DepartmentMaster/DepartmentMasterAction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';

function UserComponent() {
  //initial state

  const dispatch = useDispatch();

  //Redux State

  const [exportData, setExportData] = useState(null);

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 3)
  );

  const employeeData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.employeeData
  );
  const isLoding = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.isLoading.employeeDataList
  );
  //local state
  const [searchTerm, setSearchTerm] = useState('');

  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(employeeData, searchTerm);
    setFilteredData(filteredList);
  }, [employeeData, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(employeeData);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '80px',
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/User/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    {
      name: 'Sr',
      selector: (row) => row.counter,
      sortable: true,
      width: '60px'
    },
    { name: 'Account For', selector: (row) => row.account_for, sortable: true },
    {
      name: 'Customer',
      selector: (row) => row.customer,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Email',
      selector: (row) => row.email_id,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Contact No',
      selector: (row) => row.contact_no,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Username',
      selector: (row) => row.user_name,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}

          {row.is_active === 0 && (
            <span className="badge bg-danger " style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      )
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: true,
      width: '175px'
    }
  ];

  const loadData = async () => {
    const exportTempData = [];

    await new UserService().getExportTicket().then((res) => {
      if (res.status === 200) {
        const temp = res.data.data;

        for (const i in temp) {
          exportTempData.push({
            SrNo: exportTempData.length + 1,

            Account_for: temp[i].account_for,
            customer_name: temp[i].customer,
            Name:
              temp[i].first_name +
              ' ' +
              temp[i].middle_name +
              ' ' +
              temp[i].last_name,
            Email: temp[i].email_id,
            ContactNo: temp[i].contact_no,
            WhatsappNo: temp[i].whats_app_contact_no,
            User_Name: temp[i].user_name,
            Role: temp[i].role,
            Job_Role: temp[i].job_role,
            Designation: temp[i].designation,
            Address: temp[i].address,
            Pincode: temp[i].pincode,
            Country: temp[i].country,
            State: temp[i].state,
            City: temp[i].city,
            Department: temp[i].department,
            Ticket_Show_Type:
              temp[i].ticket_show_type === 'MY_TICKETS'
                ? 'My Tickets'
                : 'Department Tickets',

            Ticket_Passing_Authority: temp[i].ticket_passing_authority
              ? 'Yes'
              : 'No',
            Make_Default: temp[i].is_default ? 'yes' : 'No',
            Status: temp[i].is_active ? 'Active' : 'Deactive',
            created_at: temp[i].created_at,
            created_by: temp[i].created_by,
            updated_at: temp[i].updated_at,

            updated_by: temp[i].updated_by
          });
        }

        setExportData(null);
        setExportData(exportTempData);
      }
    });
  };

  useEffect(() => {
    loadData();

    dispatch(getEmployeeData());
    dispatch(getRoles());
    dispatch(departmentData());
  }, [dispatch]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  useEffect(() => {
    setFilteredData(employeeData);
  }, [employeeData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  return (
    <div className="container-xxl px-0">
      <PageHeader
        headerTitle="User Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base + '/User/Create'}`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add User
                </Link>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />

      <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by user name...."
        exportFileName="User Master Record"
        exportData={exportData}
        showExportButton={true}
      />
      <div className="card mt-2 px-0">
        {employeeData && (
          <DataTable
            columns={columns}
            data={filteredData}
            defaultSortField="title"
            pagination
            selectableRows={false}
            progressPending={isLoding}
            progressComponent={<TableLoadingSkelton />}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
          />
        )}
      </div>
    </div>
  );
}

function UserDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new UserService().getUser().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;

        for (const key in data) {
          tempData.push({
            id: data[key].id,
            name:
              data[key].first_name +
              ' ' +
              data[key].middle_name +
              ' ' +
              data[key].last_name +
              ' (' +
              data[key].id +
              ')'
          });
        }
        setData(tempData);
      }
    });
  }, []);

  return (
    <>
      {data && (
        <select
          className="form-control form-control-sm"
          id={props.id}
          name={props.name}
          onChange={props.getChangeValue}
          required={props.required ? true : false}
          readonly={true}
        >
          {props.defaultValue === 0 && (
            <option value="" selected>
              Select User
            </option>
          )}
          {props.defaultValue !== 0 && <option value="">Select User</option>}

          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.name}
                </option>
              );
            }
          })}
        </select>
      )}
      {!data && <p> Loading....</p>}
    </>
  );
}
export { UserComponent, UserDropdown };
