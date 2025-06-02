import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';

import PageHeader from '../../../../components/Common/PageHeader';

import AddEditSalaryModal from './AddEditSalaryModal';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';
import { getSalaryMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/salaryMaster';
import { formatNumberWithCurrency } from '../../../../utils/customFunction';
import MaterialTable from '../../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';

function SalaryMaster() {
  const dispatch = useDispatch();

  const { salaryMasterList, isLoading } = useSelector(
    (state) => state?.salaryMaster
  );

  const [addEditSalaryModal, setAddEditSalaryModal] = useState({
    type: '',
    data: '',
    open: false
  });

  const [reset, setReset] = useState(false);
  const clearFilters = () => {
    setReset(true);
  };
  // // static data
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
        <i
          className="icofont-edit text-primary cp"
          onClick={() =>
            setAddEditSalaryModal({
              type: 'EDIT',
              data: row?.original,
              open: true
            })
          }
        />
      )
    },
    {
      header: 'Sr',
      size: 90,
      accessorFn: (_row, index) => index + 1,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableColumnFilter: false
    },
    {
      header: 'Department',
      accessorFn: (row) => row?.department?.trim() || '--',
      size: 190
    },
    {
      header: 'Designation',
      accessorFn: (row) => row?.designation?.trim() || '--',
      size: 190
    },
    {
      header: 'Location',
      accessorKey: 'location',
      accessorFn: (row) => row?.location?.trim() || '--',
      size: 170
    },
    {
      header: 'Experience Level',
      accessorFn: (row) => row?.experience_level?.trim() || '--',
      size: 230
    },
    {
      header: 'Salary (Net)',
      accessorKey: 'max_salary',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      }),
      size: 190
    },

    {
      header: 'Remark',
      accessorFn: (row) => row?.remark?.trim() || '--',
      size: 160
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
      Cell: ({ row }) => <StatusBadge status={row?.original?.is_active} />
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
      accessorFn: (originalRow) => originalRow.created_by?.trim() || '--',
      header: 'Created By',
      size: 180
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
      size: 185
    }
  ];

  const salarayDataMapper = (data) => {
    return data?.map((row, index) => ({
      ...row,
      location: row?.locations
        ?.map((location) => location?.location_name || '--')
        ?.join(', '),
      max_salary: row?.max_salary
        ? formatNumberWithCurrency(row?.max_salary)
        : '--'
    }));
  };
  const transformedData = salarayDataMapper(salaryMasterList);

  const exportDataKeys = {
    department: 'Department',
    designation: 'Designation',
    location: 'Location',
    experience_level: 'Experience Level',
    max_salary: 'Salary (Net)',
    remark: 'Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Salary Master Record'
  };
  useEffect(() => {
    dispatch(getSalaryMasterListThunk());
  }, [dispatch]);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Salary Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() =>
                  setAddEditSalaryModal({ type: 'ADD', data: '', open: true })
                }
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Salary
              </button>
            );
          }}
        />

        {transformedData && (
          <div className="mt-2">
            <MaterialTable
              columns={columns}
              data={transformedData}
              exportDataKeys={exportDataKeys}
              isLoading={isLoading.getSalaryMasterList}
              setReset={setReset}
              reset={reset}
            />
          </div>
        )}
      </Container>

      <AddEditSalaryModal
        show={addEditSalaryModal?.open}
        type={addEditSalaryModal?.type}
        currentSalaryData={addEditSalaryModal?.data}
        close={(prev) => setAddEditSalaryModal({ ...prev, open: false })}
        clearFilters={clearFilters}
      />
    </>
  );
}

export default SalaryMaster;
