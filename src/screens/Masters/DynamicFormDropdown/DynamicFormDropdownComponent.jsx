import React, { useEffect, useState, useRef, useDebugValue } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { _base } from '../../../settings/constants';
import ErrorLogService from '../../../services/ErrorLogService';

import DynamicFormDropdownMasterService from '../../../services/MastersService/DynamicFormDropdownMasterService';
import PageHeader from '../../../components/Common/PageHeader';

import Alert from '../../../components/Common/Alert';

import 'react-data-table-component-extensions/dist/index.css';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

export default function DynamicFormDropdownComponent() {
  const location = useLocation();

  const [data, setData] = useState(null);
  const [dataa, setDataa] = useState(null);
  const [notify, setNotify] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const [exportData, setExportData] = useState(null);
  const roleId = localStorage.getItem('role_id');

  const dispatch = useDispatch();
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 35)
  );

  const [searchTerm, setSearchTerm] = useState('');

  const [filteredData, setFilteredData] = useState([]);
  const handleSearch = (value) => {};

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

  const handleModal = (data) => {
    setModal(data);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/DynamicFormDropdown/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    { name: 'Sr', selector: (row) => row.counter, sortable: true },

    {
      name: 'Dropdown Name',
      selector: (row) => row.dropdown_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.dropdown_name && (
            <OverlayTrigger overlay={<Tooltip>{row.dropdown_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.dropdown_name && row.dropdown_name.length < 10
                    ? row.dropdown_name
                    : row.dropdown_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger">Deactive</span>
          )}
        </div>
      )
    },

    { name: 'Created At', selector: (row) => row.created_at, sortable: true },
    { name: 'Created By', selector: (row) => row.created_by, sortable: true },

    { name: 'Updated At', selector: (row) => row.updated_at, sortable: true },
    { name: 'Updated By', selector: (row) => row.updated_by, sortable: true }
  ];

  const loadData = async () => {
    setIsLoading(true); // Set loading state to true when starting data fetching

    try {
      const res =
        await new DynamicFormDropdownMasterService().getAllDynamicFormDropdown();

      if (res.status === 200) {
        let counter = 1;
        const temp = res.data.data;
        const data = [];
        const exportTempData = [];

        for (const key in temp) {
          data.push({
            counter: counter++,
            id: temp[key].id,
            dropdown_name: temp[key].dropdown_name,
            is_active: temp[key].is_active,
            updated_at: temp[key].updated_at,
            created_at: temp[key].created_at,
            created_by: temp[key].created_by,
            updated_by: temp[key].updated_by
          });
        }

        setData(data);
        setDataa(data);

        for (const key in data) {
          exportTempData.push({
            Sr: data[key].counter,
            Dropdown: data[key].dropdown_name,
            Status: data[key].is_active ? 'Active' : 'Deactive',
            created_at: temp[key].created_at,
            created_by: temp[key].created_by,
            updated_at: data[key].updated_at,
            updated_by: data[key].updated_by
          });
        }

        setExportData(exportTempData);
      }
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
      const { response } = error;

      if (response) {
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'Status',
          'Get_Status',
          'INSERT',
          errorObject.data.message
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === 'Enter') {
        handleSearch();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [data]);

  useEffect(() => {
    loadData();
    if (location && location.state) {
      setNotify(location.state.alert);
    }
    if (!checkRole.length) {
      dispatch(getRoles());
    }
  }, []);
  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Dropdown Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <Link
                to={`/${_base}/DynamicFormDropdown/Create`}
                className="btn btn-dark btn-set-task w-sm-100"
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Dropdown
              </Link>
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
              placeholder="Search by Dropdown Name...."
              ref={searchRef}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              style={{ marginTop: '0px', fontWeight: '600' }}
              value={searchTerm}
              onClick={() => handleSearch(searchTerm)}
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
              apiData={exportData}
              fileName="Dynamic Form Dropdown master Records"
            />
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {isLoading && <TableLoadingSkelton />}
              {!isLoading && data && (
                <DataTable
                  columns={columns}
                  data={data.filter((customer) => {
                    if (typeof searchTerm === 'string') {
                      if (typeof customer === 'string') {
                        return customer
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      } else if (typeof customer === 'object') {
                        return Object.values(customer).some(
                          (value) =>
                            typeof value === 'string' &&
                            value
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
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
        </div>
      </div>
    </div>
  );
}
