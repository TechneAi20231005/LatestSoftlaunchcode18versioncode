import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import CustomerService from '../../../services/MastersService/CustomerService';

import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';
import { _base } from '../../../settings/constants';

import 'react-data-table-component-extensions/dist/index.css';

import { useDispatch, useSelector } from 'react-redux';

import { getCustomerData, getRoles } from '../../Dashboard/DashboardAction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';

function CustomerComponent() {
  //initial state

  const dispatch = useDispatch();
  const location = useLocation();
  //redux state
  const { getAllCustomerData, exportCustomerData } = useSelector(
    (state) => state.dashboard
  );

  const isLoading = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.isLoading.getCustomerList
  );

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 4)
  );

  //local state
  const [searchTerm, setSearchTerm] = useState('');
  const [notify, setNotify] = useState(null);

  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(getAllCustomerData, searchTerm);
    setFilteredData(filteredList);
  }, [getAllCustomerData, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(getAllCustomerData);
  };

  const columns = [
    {
      accessorKey: 'action',
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      accessorFn: ({ row }) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/Customer/Edit/` + row?.original?.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    {
      accessorFn: (originalRow) => originalRow?.counter || '--',
      header: 'Sr',
      size: 90,
      enableColumnOrdering: false,
      enableGrouping: false
    },
    {
      accessorFn: (originalRow) => originalRow?.name || '--',
      header: 'Customer Name',
      size: 220
    },
    {
      accessorFn: (originalRow) => originalRow?.customer_type || '--',
      header: 'Type',
      size: 160
    },
    {
      accessorFn: (originalRow) => originalRow?.is_active || '--',
      header: 'Status',
      size: 150,

      Cell: ({ row }) => (
        <div>
          {row?.original?.is_active === 1 ? (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          ) : row?.original?.is_active === 0 ? (
            <span className="badge bg-danger" style={{ width: '4rem' }}>
              Deactive
            </span>
          ) : (
            '--'
          )}
        </div>
      )
    },
    {
      accessorFn: (originalRow) => originalRow?.created_at || '--',
      header: 'Created At',
      size: 180
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by || '--',
      header: 'Created By',
      size: 180
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_at || '--',
      header: 'Updated At',
      size: 180
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_by || '--',
      header: 'Updated By',
      size: 200
    }
  ];

  useEffect(() => {
    dispatch(getCustomerData());

    if (!checkRole.length) {
      dispatch(getRoles());
    }
    if (location && location.state) {
      setNotify(location.state);
    }
    return () => {
      setNotify(null);
    };
  }, [checkRole.length, dispatch, location]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    setFilteredData(getAllCustomerData);
  }, [getAllCustomerData]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch, searchTerm]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Customer Master"
        renderRight={() => {
          return (
            <div>
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base}/Customer/Create`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6" />
                  Add Customer
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
        placeholder="Search by customer name...."
        exportFileName="customer Master Record"
        exportData={exportCustomerData}
        showExportButton={true}
      /> */}

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {getAllCustomerData && (
                <MaterialTable columns={columns} data={filteredData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];

    new CustomerService().getCustomer().then((res) => {
      if (res.status === 200) {
        var data = res?.data?.data;
        // var data = data.filter((d) => d.is_active === 1);
        for (const key in data) {
          tempData.push({
            id: data[key].id,
            name: data[key].name
          });
        }
      }
      setData(tempData);
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
        >
          <option>Select Customer</option>
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

export { CustomerComponent, CustomerDropdown };
