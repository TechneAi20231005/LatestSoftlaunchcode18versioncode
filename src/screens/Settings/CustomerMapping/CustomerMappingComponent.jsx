import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../../../components/Common/PageHeader';
import { _base } from '../../../settings/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  exportCustomerMappingData,
  getCustomerMappingData
} from './Slices/CustomerMappingAction';
import { getRoles } from '../../Dashboard/DashboardAction';

import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
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

  // const exportData = useSelector(
  //   (CustomerMappingSlice) => CustomerMappingSlice.customerMaster.exportData
  // );

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 32)
  );

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
            to={`/${_base}/CustomerMapping/Edit/` + row?.original?.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    {
      accessorKey: 'Sro',
      header: 'Sr',
      size: 120,
      enableColumnFilter: false
    },
    {
      accessorFn: (originalRow) => originalRow.query_type_name || '--',
      header: 'Query',
      size: 180
    },
    {
      accessorFn: (originalRow) => originalRow.template_name || '--',
      header: 'Template',
      size: 200
    },
    {
      accessorFn: (originalRow) => originalRow.dynamic_form_name || '--',
      header: 'Form',
      size: 180
    },

    {
      accessorFn: (originalRow) => originalRow.department_name || '--',
      header: 'Department',
      size: 180
    },
    { accessorKey: 'priority', header: 'Priority', size: 180 },
    {
      accessorFn: (originalRow) => originalRow.approach || '--',
      header: 'Approach',
      size: 180
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
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
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
      accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
      header: 'Updated By',
      size: 190
    }
  ];

  const exportDataKeys = {
    query_type_name: 'Query',
    template_name: 'Template',
    dynamic_form_name: 'Dynamic Form Name',
    department_name: 'Department',
    priority: 'priority',
    approach: 'approach',
    remark: 'remark',
    'Customer Type Name': 'Customer Type Name',
    'Assign User': 'Assign User',
    'Confirmation Required': 'Confirmation Required',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Customer Mapping Master Record'
  };

  useEffect(() => {
    dispatch(getCustomerMappingData());
    dispatch(exportCustomerMappingData());

    if (!checkRole.length) {
      dispatch(getRoles());
    }
  }, [dispatch, checkRole.length, location]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
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

      <div className="card mt-2">
        {data && (
          <MaterialTable
            exportDataKeys={exportDataKeys}
            isLoading={isLoading}
            data={data}
            columns={columns}
          />
        )}
      </div>
    </div>
  );
}
