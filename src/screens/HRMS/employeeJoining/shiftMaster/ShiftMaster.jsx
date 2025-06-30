import React, { useEffect, useState } from 'react';
import PageHeader from '../../../../components/Common/PageHeader';
import { Container } from 'react-bootstrap';
import AddEditShiftModal from './AddEditShiftModal';
import MaterialTable from '../../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getShiftMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/shiftMaster';
function ShiftMaster() {
  const dispatch = useDispatch();
  const [addEditShiftModal, setAddEditShiftModal] = useState({
    type: '',
    data: null,
    open: false
  });
  const [filterShiftMasterList, setFilterShiftMasterList] = useState([]);
  const [reset, setReset] = useState(false);

  const { shiftMasterList, isLoading } = useSelector(
    (state) => state?.shiftMaster
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
      Cell: ({ row }) => {
        return (
          <i
            className="icofont-edit text-primary cp text-center"
            onClick={() =>
              setAddEditShiftModal({
                type: 'EDIT',
                data: row?.original,
                open: true
              })
            }
          />
        );
      }
    },
    {
      accessorFn: (originalRow, i) => i + 1,
      header: 'Sr',
      size: 70,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableColumnFilter: false
    },
    {
      accessorKey: 'shift_name' || '--',
      header: 'Shift Name',
      size: 190,
      filterVariant: 'autocomplete',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
    },
    {
      accessorFn: (originalRow) => originalRow.shift_type || '--',
      header: 'Shift Type',
      size: 190,
      filterVariant: 'autocomplete'
    },
    {
      accessorFn: (originalRow) => originalRow.start_time || '--',
      header: 'Start time',
      size: 190,
      filterVariant: 'autocomplete'
    },
    {
      accessorFn: (originalRow) => originalRow.end_time || '--',
      header: 'End Time',
      size: 190,
      filterVariant: 'autocomplete'
    },
    {
      accessorFn: (originalRow) => originalRow.no_of_working_min || '--',
      header: 'No Of Working Min',
      size: 210,
      filterVariant: 'autocomplete'
    },
    {
      accessorKey: 'grace_period_in_min',
      header: 'Grace Period In Min',
      size: 210
    },
    {
      accessorFn: (originalRow) =>
        originalRow?.late_mark_period_in_min_after_grace_period,
      header: 'Late Mark Period In Min After Grace Period',
      size: 280
    },
    {
      accessorFn: (originalRow) => originalRow?.early_out_allowed_in_month,
      header: 'Early Out Allowed In Month',
      size: 250
    },
    {
      accessorKey: 'early_out_allowed_min',
      header: 'Early Out Allowed In Hours',
      size: 250
    },
    {
      accessorKey: 'no_of_late_mark_for_half_day',
      header: 'No. Of Late Mark For Half Day',
      size: 250
    },
    {
      accessorKey: 'min_to_consider_half_day',
      header: 'Min To Consider In Half Day',
      size: 250
    },
    {
      accessorFn: (originalRow) =>
        originalRow.min_to_consider_in_one_and_half_day || '--',
      header: 'Min To Consider In One And Half Day',
      size: 250
    },
    {
      accessorKey: 'min_to_consider_double_day',
      header: 'Min To Consider Double Day',
      size: 250
    },
    {
      accessorFn: (originalRow) => originalRow.remark || '--',
      header: 'Remark',
      size: 160
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      size: 150,
      accessorFn: (row) =>
        row?.original?.is_active === '0' ? 'Deactive' : 'Active',
      Cell: ({ row }) => {
        const isActive = row?.original?.is_active === '1';
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
      accessorFn: (originalRow) => {
        return moment(originalRow.created_at).startOf('day').toDate();
      },
      header: 'Created At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        cell.row.original.created_at &&
        moment(cell.row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by || '--',
      header: 'Created By'
    },
    {
      accessorFn: (originalRow) =>
        moment(originalRow.updated_at).startOf('day').toDate(),
      header: 'Updated At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        cell.row?.original?.updated_at?.trim()
          ? moment(cell.row?.original?.updated_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_by || '--',
      header: 'Updated By'
    }
  ];

  const exportShiftData = {
    shift_name: 'Shift Name',
    shift_type: 'Shift Type',
    grace_period_in_min: 'Grace Period In Min',
    late_mark_period_in_min_after_grace_period:
      'Late Mark Period In Min After Grace Period',
    early_out_allowed_in_month: 'Early Out Allowed In Month',
    early_out_allowed_min: 'Early Out Allowed In Min',
    no_of_late_mark_for_half_day: 'No. Of Late Mark For Half Day',
    min_to_consider_half_day: 'Min To Consider In Half Day',
    min_to_consider_in_one_and_half_day: 'Min To Consider In One And Half Day',
    min_to_consider_double_day: 'Min To Consider Double Day',
    remark: 'Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Shift Lists Records'
  };

  useEffect(() => {
    dispatch(getShiftMasterListThunk());
  }, []);

  useEffect(() => {
    setFilterShiftMasterList(shiftMasterList);
  }, [shiftMasterList]);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Shift Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() =>
                  setAddEditShiftModal({ type: 'ADD', data: '', open: true })
                }
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Shift
              </button>
            );
          }}
        />
        <div className="card mt-2">
          {filterShiftMasterList?.length > 0 && (
            <MaterialTable
              columns={columns}
              data={filterShiftMasterList}
              isLoading={isLoading?.getShiftMasterList}
              reset={reset}
              setReset={setReset}
              exportDataKeys={exportShiftData}
            />
          )}
        </div>
      </Container>
      <AddEditShiftModal
        show={addEditShiftModal?.open}
        type={addEditShiftModal?.type}
        currentShiftData={addEditShiftModal?.data}
        close={(prev) => setAddEditShiftModal({ ...prev, open: false })}
      />
    </>
  );
}

export default ShiftMaster;
