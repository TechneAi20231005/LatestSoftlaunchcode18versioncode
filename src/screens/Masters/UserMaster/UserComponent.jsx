import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import DataTable from 'react-data-table-component';
import { _base } from '../../../settings/constants';

import UserService from '../../../services/MastersService/UserService';
import PageHeader from '../../../components/Common/PageHeader';

import 'react-data-table-component-extensions/dist/index.css';

import { useDispatch, useSelector } from 'react-redux';

import { getEmployeeData, getRoles } from '../../Dashboard/DashboardAction';
import { departmentData } from '../DepartmentMaster/DepartmentMasterAction';
// import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
// import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
// import NotFound from '../../../components/NotFound';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import { Box, colors } from '@mui/material';

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
  const exportDataKeys = {
    account_for: 'Account_For',
    customer: 'Customer Name',
    name: 'Name',
    email_id: 'Email',
    contact_no: 'Contact_No',
    whats_app_contact_no: 'WhatsappNo',
    user_name: 'User_Name',
    role: 'Role',
    jobRole: 'Job Role',
    designation: 'Designation',
    address: 'Address',
    pincode: 'Pincode',
    country: 'Country',
    state: 'State',
    city: 'City',
    department: 'Department',
    Ticket_Show_Type: 'Ticket Show Type',
    Ticket_Passing_Authority: 'Ticket Passing Authority',
    Make_Default: 'Make Default',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'User Master Record'
  };

  const columns = [
    {
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,
      accessorFn: (originalRow) => {
        return (
          <div className="btn-group" role="group">
            <Link
              to={`/${_base}/User/Edit/` + originalRow?.id}
              className="btn btn-outline-secondary"
            >
              <i className="icofont-edit text-success"></i>
            </Link>
          </div>
        );
      }
    },
    {
      accessorFn: (originalRow) => originalRow?.counter || '--',
      header: 'Sr',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableColumnFilter: false
    },
    {
      accessorFn: (originalRow) => originalRow?.account_for || '--',
      accessorKey: 'account_for',
      header: 'Account For',
      size: 190
    },
    {
      accessorFn: (originalRow) => originalRow?.customer || '--',
      accessorKey: 'customer',
      header: 'Customer',
      size: 180
    },
    {
      accessorFn: (originalRow) => originalRow?.name || '--',
      header: 'Name',
      size: 180,
      Cell: ({ row }) => (
        <Box sx={{ color: '#f19828' }}>{row?.original?.name}</Box>
      )
    },
    {
      accessorFn: (originalRow) => originalRow?.email_id || '--',
      header: 'Email',
      size: 160
    },
    {
      accessorFn: (originalRow) => originalRow?.contact_no || '--',
      header: 'Contact No',
      size: 190
    },
    {
      accessorFn: (originalRow) => originalRow?.user_name || '--',
      header: 'Username'
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      size: 150,
      accessorFn: (row) => (row.is_active === 1 ? 'Active' : 'Deactive'),
      filterFn: (row, id, filterValue) => {
        const status = row.getValue(id);
        return status.toLowerCase().includes(filterValue.toLowerCase());
      },
      Cell: ({ row }) => {
        const isActive = row?.original?.is_active;
        return (
          <span
            className={`badge ${isActive ? 'bg-primary' : 'bg-danger'}`}
            style={{ width: '4rem' }}
          >
            {isActive ? 'Active' : 'Deactive'}
          </span>
        );
      }
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.created_at),
      header: 'Created At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`
    },
    {
      accessorFn: (originalRow) => originalRow.created_by || '--',
      header: 'Created By',
      size: 190
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.updated_at) || '--',
      header: 'Updated At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`
    },
    {
      accessorFn: (originalRow) => originalRow.updated_by || '--',
      header: 'Updated By',
      size: 190
    }
  ];

  const loadData = async () => {
    const exportTempData = [];

    await new UserService().getExportTicket().then((res) => {
      if (res.status === 200) {
        const temp = res?.data?.data?.data;
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
            Job_Role: temp[i].jobRole,
            Designation: temp[i].designation,
            Address: temp[i].address,
            Pincode: temp[i].pincode,
            Country: temp[i].country,
            State: temp[i].state,
            City: temp[i].city,
            Department: temp[i].department
              ?.map((d) => d.department_name)
              ?.join(','),
            Ticket_Show_Type: temp[i].department
              ?.map((d) => d.ticket_show_type)
              ?.join(','),

            Ticket_Passing_Authority: temp[i].department
              ?.map((d) => (d.ticket_passing_authority ? 'Yes' : 'No'))
              ?.join(','),
            Make_Default: temp[i].department
              ?.map((d) => (d.is_default ? 'Yes' : 'No'))
              ?.join(','),
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
    <div className="container-xxl">
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

      {/* <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by user name...."
        exportFileName="User Master Record"
        exportData={exportData}
        showExportButton={true}
      /> */}
      <div className="card mt-2 px-0">
        {filteredData && (
          <MaterialTable
            exportDataKeys={exportDataKeys}
            isLoading={isLoding}
            columns={columns}
            data={filteredData}
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
