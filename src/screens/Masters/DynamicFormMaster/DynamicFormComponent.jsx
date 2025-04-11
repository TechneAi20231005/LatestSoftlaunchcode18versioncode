import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { _base } from '../../../settings/constants';

import DynamicFormService from '../../../services/MastersService/DynamicFormService';
import PageHeader from '../../../components/Common/PageHeader';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import { dynamicFormData } from '../DynamicFormDropdown/Slices/DynamicFormDropDownAction';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';
import { errorHandler } from '../../../utils';

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

  const isLoading = useSelector(
    (DynamicFormDropDownSlice) =>
      DynamicFormDropDownSlice.dynamicFormDropDown.isLoading.dyanamicFormList
  );

  const exportDataKeys = {
    template_name: 'Form Name',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Dynamic Form Master'
  };

  const columns = [
    {
      accessorKey: 'action', // Use a valid key
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,

      Cell: ({ row }) => {
        return (
          <div className="btn-group" role="group">
            <Link
              to={`/${_base}/DynamicForm/Edit/` + row.original?.id}
              className="btn btn-outline-secondary"
            >
              <i className="icofont-edit text-success"></i>
            </Link>
          </div>
        );
      }
    },
    {
      accessorKey: 'counter',
      header: 'Sr',
      size: 90,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableColumnFilter: false
    },
    {
      accessorKey: 'template_name',
      header: 'Form Name',
      size: 200,
      filterVariant: 'autocomplete',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
    },

    {
      accessorKey: 'is_active',
      header: 'Status',
      size: 150,
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
      header: 'Created At',
      accessorKey: 'created_at',
      filterVariant: 'date-range',
      accessorFn: (row) => new Date(row.created_at),
      Cell: ({ row }) =>
        row.original.created_at
          ? moment(row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
          : '--',
      size: 350
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
      header: 'Created By'
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated At',
      filterVariant: 'date-range',
      accessorFn: (row) => new Date(row.updated_at),
      Cell: ({ row }) =>
        row?.original?.updated_at?.trim()
          ? moment(row.original.updated_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
      header: 'Updated By',
      size: 200
    }
  ];

  useEffect(() => {
    dispatch(dynamicFormData());

    if (!checkRole.length) {
      dispatch(getRoles());
    }
    if (!data.length) {
    }
  }, [dispatch, data.length, location, checkRole.length]);

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

      <div className="card mt-2">
        {data && (
          <MaterialTable
            isLoading={isLoading}
            columns={columns}
            data={data}
            exportDataKeys={exportDataKeys}
          ></MaterialTable>
        )}
      </div>
    </div>
  );
}

function DynamicFormDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new DynamicFormService()
      .getDynamicForm()
      .then((res) => {
        if (res?.status === 200) {
          let counter = 1;
          const data = res?.data?.data?.data;
          for (const key in data) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              template_name: data[key].template_name
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
