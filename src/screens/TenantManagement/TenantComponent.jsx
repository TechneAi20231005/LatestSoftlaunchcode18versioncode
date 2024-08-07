import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import PageHeader from '../../components/Common/PageHeader';

import { _base } from '../../settings/constants';
import Alert from '../../components/Common/Alert';

import { Spinner } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTenant } from './TenantConponentAction';

import { getEmployeeData, getRoles } from '../Dashboard/DashboardAction';

import { ExportToExcel } from '../../components/Utilities/Table/ExportToExcel';

function TenantComponent() {
  const dispatch = useDispatch();
  const getAllTenantData = useSelector(
    (TenantComponentSlice) => TenantComponentSlice.tenantMaster.getAllTenant
  );
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 33)
  );
  const getAllEmployeeData = useSelector(
    (DashboardSlice) => DashboardSlice.dashboard.employeeData
  );
  const exportAllTenantData = useSelector(
    (TenantComponentSlice) =>
      TenantComponentSlice.tenantMaster.exportAllTenantData
  );
  const [data, setData] = useState(null);
  // const [notify, setNotify] = useState(null);
  const notify = useSelector(
    (TenantComponentSlice) => TenantComponentSlice.tenantMaster.notify
  );

  const isMasterAdmin = localStorage.getItem('role_name');
  // const [checkRole, setCheckRole] = useState(null);
  const showLoaderModal = false;
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef();
  function SearchInputData(data, search) {
    const lowercaseSearch = search.toLowerCase();

    return data.filter((d) => {
      for (const key in d) {
        if (
          typeof d[key] === 'string' &&
          d[key].toLowerCase().includes(lowercaseSearch)
        ) {
          return true;
        }
      }
      return false;
    });
  }

  const handleSearch = () => {
    const SearchValue = searchRef.current.value;
    const result = SearchInputData(data, SearchValue);
    setData(result);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '100px',
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/TenantMaster/Edit/` + row.id}
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
      width: '100px'
    },
    { name: 'Name', selector: (row) => row.company_name, sortable: true },
    { name: 'Ticket ID Series', selector: (row) => row.series, sortable: true },

    { name: 'Type', selector: (row) => row.company_type, sortable: true },
    {
      name: 'Status',
      //   selector: (row) => row.is_active,
      sortable: false,
      width: '100px',

      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active === 0 && (
            <span className="badge bg-danger">Deactive</span>
          )}
        </div>
      )
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: true
    },
    {
      name: 'Created By',
      cell: (row) => {
        let tenantCreatedBy = getAllEmployeeData?.filter(
          (filterEmployee) => filterEmployee.id === row.created_by
        );
        return (
          <div>
            {tenantCreatedBy[0]?.first_name
              ? `${tenantCreatedBy[0]?.first_name}  ${tenantCreatedBy[0]?.last_name}`
              : ''}
          </div>
        );
      },
      sortable: true
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: true
      // width: "100px",
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: true
    }
  ];

  useEffect(() => {
    dispatch(getEmployeeData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTenant());
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify?.type === 'success' && <Alert alertData={notify} />}

      <PageHeader
        headerTitle="Tenant Master"
        renderRight={() => {
          return (
            <div
              className={
                isMasterAdmin === 'MasterAdmin'
                  ? 'col-auto d-flex w-sm-100'
                  : 'd-none'
              }
            >
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base + '/TenantMaster/Create'}`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Tenant
                </Link>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />

      <div className="card card-body">
        <div className="row">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Search...."
              ref={searchRef}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              onClick={handleSearch}
              style={{ marginTop: '0px', fontWeight: '600' }}
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
              style={{ marginTop: '0px', fontWeight: '600' }}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
            <ExportToExcel
              className="btn btn-sm btn-danger"
              apiData={exportAllTenantData}
              fileName="Tenant Master"
            />
          </div>
        </div>
      </div>

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {getAllTenantData && (
            <DataTable
              columns={columns}
              data={getAllTenantData.filter((customer) => {
                if (typeof searchTerm === 'string') {
                  if (typeof customer === 'string') {
                    return customer
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  } else if (typeof customer === 'object') {
                    return Object.values(customer).some(
                      (value) =>
                        typeof value === 'string' &&
                        value.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  }
                }
                return false;
              })}
              defaultSortField="title"
              pagination
              selectableRows={false}
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              highlightOnHover={true}
            />
          )}
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

export default TenantComponent;
