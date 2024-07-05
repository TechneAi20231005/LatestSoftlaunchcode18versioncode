import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { _base } from '../../../settings/constants';

import TemplateService from '../../../services/MastersService/TemplateService';
import PageHeader from '../../../components/Common/PageHeader';

import Alert from '../../../components/Common/Alert';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { exportTempateData, templateData } from './TemplateComponetAction';
import { getRoles } from '../../Dashboard/DashboardAction';

import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';

function TemplateComponent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const templatedata = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.templateData
  );
  const isLoading = useSelector(
    (TemplateComponetSlice) =>
      TemplateComponetSlice.tempateMaster.isLoading.templateDataList
  );

  const exportData = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.exportData
  );

  const notify = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.notify
  );
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 15)
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(templatedata, searchTerm);
    setFilteredData(filteredList);
  }, [templatedata, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(templatedata);
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
            to={`/${_base}/Template/Edit/` + row.id}
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
      width: '80px'
    },

    {
      name: 'Template Name',
      selector: (row) => row['Template Name'],
      sortable: true,
      width: '150px',
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
      width: '150px',
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
      sortable: true,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: true,
      width: '150px'
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
      width: '150px'
    }
  ];

  useEffect(() => {
    dispatch(exportTempateData());
    dispatch(templateData());

    if (!templatedata.length) {
      dispatch(getRoles());
    }
    if (location && location.state) {
    }
  }, [dispatch, location, templatedata.length]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    setFilteredData(templatedata);
  }, [templatedata]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch, searchTerm]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Template Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base + '/Template/Create'}`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Template
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
        placeholder="Search by template name...."
        exportFileName="Template Master Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className="card mt-2">
        {templatedata && (
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

function TemplateDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new TemplateService().getTemplate().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            id: data[key].id,
            template_name: data[key].template_name,
            created_at: data[key].created_at,
            created_by: data[key].created_by
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
          value={props.defaultValue}
        >
          {props.defaultValue !== 0 && (
            <option value={0}>Select Template</option>
          )}
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

export { TemplateComponent, TemplateDropdown };
