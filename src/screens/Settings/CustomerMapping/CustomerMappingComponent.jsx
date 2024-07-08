import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import DataTable from 'react-data-table-component';

import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';

import { _base } from '../../../settings/constants';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';

import {
  exportCustomerMappingData,
  getCustomerMappingData
} from './Slices/CustomerMappingAction';
import { getRoles } from '../../Dashboard/DashboardAction';

import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { customSearchHandler } from '../../../utils/customFunction';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
export default function CustomerMappingComponent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = useSelector(
    (CustomerMappingSlice) =>
      CustomerMappingSlice.customerMaster.customerMappingData
  );

  const isLoading = useSelector(
    (CustomerMappingSlice) =>
      CustomerMappingSlice.customerMaster.isLoading.customerMappingList
  );

  const exportData = useSelector(
    (CustomerMappingSlice) => CustomerMappingSlice.customerMaster.exportData
  );

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 32)
  );

  const [notify, setNotify] = useState(null);

  // const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(data, searchTerm);
    setFilteredData(filteredList);
  }, [data, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(data);
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
            to={`/${_base}/CustomerMapping/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    {
      name: 'Sr.No',
      selector: (row) => row.Sro,
      sortable: true,
      width: '60px'
    },
    // { name: 'Query', selector: row => row.query_type_name, sortable: true,width: "175px" },

    {
      name: 'Query',
      selector: (row) => row['Query'],
      sortable: true,
      with: '200px',
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.query_type_name && (
            <OverlayTrigger overlay={<Tooltip>{row.query_type_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.query_type_name && row.query_type_name.length < 10
                    ? row.query_type_name
                    : row.query_type_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Template',
      selector: (row) => row.template_name,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Form',
      selector: (row) => row.dynamic_form_name,
      sortable: true,
      width: '175px'
    },

    {
      name: 'Department',
      selector: (row) => row.department_name,
      sortable: true,
      width: '175px'
    },
    { name: 'Priority', selector: (row) => row.priority, sortable: true },
    {
      name: 'Approach',
      selector: (row) => row.approach,
      sortable: true,
      width: '175px'
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
            <span className="badge bg-danger" style={{ width: '4rem' }}>
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

  useEffect(() => {
    dispatch(getCustomerMappingData());
    dispatch(exportCustomerMappingData());

    if (!checkRole.length) {
      dispatch(getRoles());
    }
    if (location && location.state) {
      setNotify(location.state.alert);
    }
  }, [dispatch, checkRole.length, location]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader
        headerTitle="Customer Mapping"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base}/CustomerMapping/Create`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Create
                  Mapping Setting
                </Link>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />
      <SearchBoxHeader
        showInput={true}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by...."
        exportFileName="Customer Mapping Master Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className=" mt-2">
        <div className="col-sm-12">
          {data && (
            <DataTable
              columns={columns}
              data={filteredData}
              defaultSortField="title"
              pagination
              selectableRows={false}
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              highlightOnHover={true}
              progressPending={isLoading}
              progressComponent={<TableLoadingSkelton />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
