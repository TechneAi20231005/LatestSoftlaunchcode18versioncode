import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';

import AddEditRemarkModal from './AddEditRemarkModal';
import { getRemarkMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/remarkMaster';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';

import MaterialTable from '../../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';

function RemarkMaster() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { remarkMasterList, isLoading } = useSelector(
    (state) => state?.remarkMaster
  );

  // // local state

  const [addEditRemarkModal, setAddEditRemarkModal] = useState({
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
            setAddEditRemarkModal({
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
      header: 'Remark Description',
      accessorFn: (row) => row?.remark_description?.trim() || '--',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      }),
      size: 240
    },
    {
      header: 'Supporting Remark',
      accessorFn: (row) => row?.remark?.trim() || '--',
      size: 240
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

  const exportDataKeys = {
    remark_description: 'Remark Description',
    remark: 'Supporting Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Remark Master Record'
  };

  // // life cycle
  useEffect(() => {
    dispatch(getRemarkMasterListThunk());
  }, []);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Remark Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() =>
                  setAddEditRemarkModal({ type: 'ADD', data: '', open: true })
                }
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Remark
              </button>
            );
          }}
        />
        {remarkMasterList && (
          <div className="mt-2">
            <MaterialTable
              columns={columns}
              data={remarkMasterList}
              exportDataKeys={exportDataKeys}
              isLoading={isLoading?.getRemarkMasterList}
              setReset={setReset}
              reset={reset}
            />
          </div>
        )}
      </Container>

      <AddEditRemarkModal
        show={addEditRemarkModal?.open}
        type={addEditRemarkModal?.type}
        currentRemarkData={addEditRemarkModal?.data}
        close={(prev) => setAddEditRemarkModal({ ...prev, open: false })}
        clearFilters={clearFilters}
      />
    </>
  );
}

export default RemarkMaster;
