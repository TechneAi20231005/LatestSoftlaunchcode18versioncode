import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { _base } from '../../../settings/constants';

import TemplateService from '../../../services/MastersService/TemplateService';
import PageHeader from '../../../components/Common/PageHeader';

import Alert from '../../../components/Common/Alert';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { exportTempateData, templateData } from './TemplateComponetAction';
import { getRoles } from '../../Dashboard/DashboardAction';

// import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
// import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import { Box } from '@mui/material';
// import { original } from '@reduxjs/toolkit';

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
      accessorKey: 'action',
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/Template/Edit/` + row?.original?.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    {
      accessorKey: 'counter',
      header: 'Sr',
      size: 100,
      enableColumnFilter: false
    },

    {
      accessorFn: (originalRow) => originalRow.template_name || '--',
      header: 'Template Name',
      size: 220,
      Cell: ({ row }) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.original?.template_name && (
            <OverlayTrigger
              overlay={<Tooltip>{row?.original?.template_name} </Tooltip>}
            >
              <Box sx={{ color: '#f19828' }}>
                <span className="ms-1">
                  {' '}
                  {row?.original?.template_name &&
                  row?.original.template_name.length < 10
                    ? row?.original?.template_name
                    : row?.original?.template_name.substring(0, 10) + '....'}
                </span>
              </Box>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      size: 160,
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
      accessorFn: (originalRow) => new Date(originalRow.created_at) || '--',
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
      size: 180
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

      {/* <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by template name...."
        exportFileName="Template Master Record"
        exportData={exportData}
        showExportButton={true}
      /> */}

      <div className="card mt-2">
        {templatedata && (
          <MaterialTable
            isLoading={isLoading}
            data={filteredData}
            columns={columns}
          />

          // <DataTable
          //   columns={columns}
          //   data={filteredData}
          //   defaultSortField="title"
          //   pagination
          //   selectableRows={false}
          //   progressPending={isLoading}
          //   progressComponent={<TableLoadingSkelton />}
          //   className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          //   highlightOnHover={true}
          // />
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
