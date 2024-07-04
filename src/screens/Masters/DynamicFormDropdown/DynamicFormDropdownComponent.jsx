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
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';

export default function DynamicFormDropdownComponent() {
  //initial state
  const location = useLocation();
  const dispatch = useDispatch();

  //redux state
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice?.dashboard?.getRoles.filter((d) => d.menu_id === 35)
  );

  //local state
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState([]);
  const [notify, setNotify] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const [exportData, setExportData] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = () => {
    const filteredList = customSearchHandler(data, searchTerm);
    setFilteredData(filteredList);
  };

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
          {row?.dropdown_name && (
            <OverlayTrigger overlay={<Tooltip>{row?.dropdown_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.dropdown_name && row.dropdown_name?.length < 10
                    ? row?.dropdown_name
                    : row?.dropdown_name.substring(0, 10) + '....'}
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
    loadData();
    if (location && location?.state) {
      setNotify(location?.state?.alert);
    }
    if (!checkRole?.length) {
      dispatch(getRoles());
    }
  }, []);
  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);
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
      <SearchBoxHeader
        showInput={true}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by dropdown name...."
        exportFileName="Dropdown Master Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {isLoading && <TableLoadingSkelton />}
              {!isLoading && data && (
                <DataTable
                  columns={columns}
                  data={filteredData}
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
