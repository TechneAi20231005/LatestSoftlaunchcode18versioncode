import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';

import AddEditSourceModal from './AddEditSourceModal';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';
import { getSourceMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/sourceMaster';
import MaterialTable from '../../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';

function SourceMaster() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { sourceMasterList, isLoading } = useSelector(
    (state) => state?.sourceMaster
  );

  const [addEditSourceModal, setAddEditSourceModal] = useState({
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
          className="icofont-edit text-primary cp text-center"
          onClick={() =>
            setAddEditSourceModal({
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
      header: 'Source Name',
      accessorFn: (row) => row?.source_name?.trim() || '--',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      }),
      size: 200
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
      Cell: ({ row }) => {
        const isActive = row?.original?.is_active;
        return <StatusBadge status={isActive} />;
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
    remark: 'Remark',
    source_name: 'Source Name',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Source Master Record'
  };

  useEffect(() => {
    dispatch(getSourceMasterListThunk());
  }, [dispatch]);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Source Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() =>
                  setAddEditSourceModal({ type: 'ADD', data: '', open: true })
                }
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Source
              </button>
            );
          }}
        />
        {sourceMasterList && (
          <div className="mt-2">
            <MaterialTable
              columns={columns}
              data={sourceMasterList}
              exportDataKeys={exportDataKeys}
              isLoading={isLoading?.getSourceMasterList}
              reset={reset}
              setReset={setReset}
            />
          </div>
        )}
      </Container>

      <AddEditSourceModal
        show={addEditSourceModal?.open}
        type={addEditSourceModal?.type}
        currentSourceData={addEditSourceModal?.data}
        close={(prev) => setAddEditSourceModal({ ...prev, open: false })}
        clearFilters={clearFilters}
      />
    </>
  );
}

export default SourceMaster;
