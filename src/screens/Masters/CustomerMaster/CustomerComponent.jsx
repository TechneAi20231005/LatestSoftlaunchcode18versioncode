import React, { useEffect, useState, useRef } from 'react';
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
import SearchBar from '../../../components/Common/SearchBar ';
import { customSearchHandler } from '../../../utils/customFunction';

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

  const handleSearch = () => {
    const filteredList = customSearchHandler(getAllCustomerData, searchTerm);
    setFilteredData(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(getAllCustomerData);
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
            to={`/${_base}/Customer/Edit/` + row.id}
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
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      width: '150px'
    },
    { name: 'Type', selector: (row) => row.type_name, sortable: true },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}
          {row.is_active === 0 && (
            <span className="badge bg-danger" style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      ),
      sortable: true
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
  }, []);

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
  }, [searchTerm]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

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

      <SearchBar
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by customer name...."
        exportFileName="customer Master Record"
        exportData={exportCustomerData}
      />

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {getAllCustomerData && (
                <DataTable
                  columns={columns}
                  data={filteredData}
                  defaultSortField="title"
                  pagination
                  progressPending={isLoading}
                  progressComponent={<TableLoadingSkelton />}
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                  fileName="ABC"
                />
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
        var data = res.data.data;
        var data = data.filter((d) => d.is_active == 1);
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
