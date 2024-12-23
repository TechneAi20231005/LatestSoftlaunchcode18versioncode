import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import DataTable from 'react-data-table-component';

import DynamicFormService from '../../../services/MastersService/DynamicFormService';
import PageHeader from '../../../components/Common/PageHeader';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import { dynamicFormData } from '../DynamicFormDropdown/Slices/DynamicFormDropDownAction';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';

function DynamicFormComponent() {
  //initial state
  const location = useLocation();

  const dispatch = useDispatch();

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 13)
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

  // const loadData = async () => {
  //   setShowLoaderModal(null);
  // };

  useEffect(() => {
    // loadData();
    dispatch(dynamicFormData());
    dispatch(dynamicFormData());
    if (location && location.state) {
      // setNotify(location.state.alert);
    }
    if (!checkRole.length) {
      dispatch(getRoles());
    }
    if (!data.length) {
    }
    if (!exportData.length) {
    }
  }, [dispatch, data.length, exportData.length, location, checkRole.length]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

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
      <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by form name...."
        exportFileName="Dynamic form Master Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className="card mt-2">
        {data && (
          <DataTable
            columns={columns}
            data={filteredData}
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
  );
}

function DynamicFormDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new DynamicFormService().getDynamicForm().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data.data;
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
          {props.defaultValue === 0 && <option value="">Select Form</option>}
          {props.defaultValue !== 0 && <option value="">Select Form</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
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
export { DynamicFormComponent, DynamicFormDropdown };
