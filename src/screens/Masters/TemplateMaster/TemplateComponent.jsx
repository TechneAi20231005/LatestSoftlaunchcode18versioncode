import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { _base } from '../../../settings/constants';

import TemplateService from '../../../services/MastersService/TemplateService';
import PageHeader from '../../../components/Common/PageHeader';

import { useDispatch, useSelector } from 'react-redux';
import { templateData } from './TemplateComponetAction';
import { getRoles } from '../../Dashboard/DashboardAction';

import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import { errorHandler } from '../../../utils';
import moment from 'moment';

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

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 15)
  );

  const [filteredData, setFilteredData] = useState([]);

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
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
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
      Cell: ({ row }) =>
        row?.original?.created_at?.trim()
          ? moment(row?.original?.created_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
      header: 'Created By',
      size: 180
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.updated_at) || '--',
      header: 'Updated At',
      filterVariant: 'date-range',
      Cell: ({ row }) =>
        row?.original?.updated_at?.trim()
          ? moment(row?.original?.updated_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
      header: 'Updated By',
      size: 190
    }
  ];

  const exportDataKeys = {
    template_name: 'Template Name',
    calculate_from: 'Calculate From',
    basket_name: 'Basket Name',
    'Assign To': 'Assign To',
    task: 'Task',
    'Day Required': 'Day Required',
    'Hours Required': 'Hours Required',
    start_days: 'Start Days',
    end_days: 'End Days',
    remark: 'Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Template Master Record'
  };
  useEffect(() => {
    dispatch(templateData());
    if (!templatedata.length) {
      dispatch(getRoles());
    }
    if (location && location.state) {
    }
  }, [dispatch, location, templatedata.length]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `/${process.env.REACT_APP_ROOT_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    setFilteredData(templatedata);
  }, [templatedata]);

  return (
    <div className="container-xxl">
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

      <div className="card mt-2">
        {filteredData && (
          <MaterialTable
            exportDataKeys={exportDataKeys}
            isLoading={isLoading}
            data={filteredData}
            columns={columns}
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
    new TemplateService()
      .getTemplate()
      .then((res) => {
        if (res?.status === 200) {
          const data = res?.data?.data;
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
      })
      .catch((error) => errorHandler(error));
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
