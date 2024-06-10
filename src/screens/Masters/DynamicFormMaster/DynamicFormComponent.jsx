import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import DataTable from 'react-data-table-component';

import DynamicFormService from '../../../services/MastersService/DynamicFormService';
import PageHeader from '../../../components/Common/PageHeader';

import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';

import { Spinner } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import { dynamicFormData } from '../DynamicFormDropdown/Slices/DynamicFormDropDownAction';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

function DynamicFormComponent() {
  const location = useLocation();

  const [notify, setNotify] = useState(null);

  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const roleId = localStorage.getItem('role_id');

  const searchRef = useRef();
  const dispatch = useDispatch();

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 13)
  );

  const data = useSelector(
    (DynamicFormDropDownSlice) =>
      DynamicFormDropDownSlice.dynamicFormDropDown.getDynamicFormDropDownData
  );
  const exportData = useSelector(
    (DynamicFormDropDownSlice) =>
      DynamicFormDropDownSlice.dynamicFormDropDown.getDynamicFormData
  );
  const isLoading = useSelector(
    (DynamicFormDropDownSlice) =>
      DynamicFormDropDownSlice.dynamicFormDropDown.isLoading.dyanamicFormList
  );

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

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value) => {};

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '80px',
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/DynamicForm/Edit/` + row.id}
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
      name: 'Form Name',
      selector: (row) => row.template_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.template_name && (
            <OverlayTrigger overlay={<Tooltip>{row.template_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.template_name && row.template_name.length < 10
                    ? row.template_name
                    : row.template_name.substring(0, 10) + '....'}
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
      sortable: false,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}
          {row.is_active == 0 && (
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

  const loadData = async () => {
    setShowLoaderModal(null);
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
    dispatch(dynamicFormData());
    dispatch(dynamicFormData());
    if (location && location.state) {
      setNotify(location.state.alert);
    }
    if (!checkRole.length) {
      dispatch(getRoles());
    }
    if (!data.length) {
    }
    if (!exportData.length) {
    }
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Dynamic Form Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base + '/DynamicForm/Create'}`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Form
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
              placeholder="Search by Form Name...."
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
              fileName="Dynamic Form master Records"
            />
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {data && (
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
                  progressPending={isLoading}
                  progressComponent={<TableLoadingSkelton />}
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
export default DynamicFormComponent;

export function DynamicFormDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new DynamicFormService().getDynamicForm().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            counter: counter++,
            id: data[key].id,
            template_name: data[key].template_name
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
        >
          {props.defaultValue == 0 && <option value="">Select Form</option>}
          {props.defaultValue != 0 && <option value="">Select Form</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.template_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.template_name}
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
