import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import { _base } from '../../settings/constants';
import { Spinner } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTenant } from './TenantConponentAction';

import { getEmployeeData, getRoles } from '../Dashboard/DashboardAction';

import MaterialTable from '../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';

function TenantComponent() {
  const dispatch = useDispatch();
  const getAllTenantData = useSelector(
    (TenantComponentSlice) => TenantComponentSlice.tenantMaster.getAllTenant
  );

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 33)
  );
  const getAllEmployeeData = useSelector(
    (DashboardSlice) => DashboardSlice.dashboard.employeeData
  );
  const isLoading = useSelector(
    (TenantComponentSlice) => TenantComponentSlice.tenantMaster.isLoading
  );
  const isMasterAdmin = localStorage.getItem('role_name');
  const showLoaderModal = false;

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
            to={`/${_base}/TenantMaster/Edit/` + row?.original?.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    {
      accessorFn: (originalRow, i) => i + 1 || '--',
      header: 'Sr',
      size: 120,
      enableColumnFilter: false
    },
    {
      accessorFn: (originalRow) => originalRow?.company_name || '--',
      header: 'Name',
      size: 180
    },
    {
      accessorFn: (originalRow) => originalRow?.series || '--',
      header: 'Ticket ID Series',
      size: 220
    },

    {
      accessorFn: (originalRow) => originalRow?.company_type || '--',
      header: 'Type',
      size: 200
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
      Cell: ({ row }) => (
        <span
          className={
            'badge bg-' +
            (row?.original?.is_active === 1 ? 'primary' : 'danger')
          }
        >
          {row?.original?.is_active === 1 ? `Active` : `Deactive`}
        </span>
      )
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.created_at) || '--',
      header: 'Created At',
      filterVariant: 'date-range',
      Cell: ({ row }) =>
        row?.original?.created_at?.trim()
          ? moment(row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
      header: 'Created By',
      size: 190
    },

    {
      accessorFn: (originalRow) => new Date(originalRow.updated_at) || '--',
      header: 'Updated At',
      filterVariant: 'date-range',
      Cell: ({ row }) =>
        row?.original?.updated_at?.trim()
          ? moment(row.original.updated_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
      header: 'Updated By',
      size: 190
    }
  ];

  const exportDataKeys = {
    company_name: 'Tenant Name',
    series: 'TicketID Series',
    company_type: 'Company Type',
    country: 'Country',
    state: 'State',
    city: 'City',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Tenant Master Record'
  };

  useEffect(() => {
    dispatch(getEmployeeData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTenant());
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Tenant Master"
        renderRight={() => {
          return (
            <div
              className={
                isMasterAdmin === 'MasterAdmin'
                  ? 'col-auto d-flex w-sm-100'
                  : 'd-none'
              }
            >
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base + '/TenantMaster/Create'}`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Tenant
                </Link>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />

      <div className="card mt-2">
        {getAllTenantData && (
          <MaterialTable
            isLoading={isLoading}
            columns={columns}
            data={getAllTenantData}
            exportDataKeys={exportDataKeys}
          />
        )}
      </div>
      <Modal show={showLoaderModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="dark" />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TenantComponent;
