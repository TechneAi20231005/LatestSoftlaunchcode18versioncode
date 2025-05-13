import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import PageHeader from '../../../components/Common/PageHeader';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { getFunctionMasterListThunk } from '../../../redux/services/testCases/functionMaster';
import AddEditFunctionMaster from './AddEditFunctionMaster';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
function FunctionMasterComponent() {
  const dispatch = useDispatch();

  // // redux state
  const { functionMasterList, isLoading } = useSelector(
    (state) => state?.functionMaster
  );
  const [reset, setReset] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [filteredFunctionMasterList, setFilterFunctionMasterList] = useState(
    []
  );

  const [addEditFunctionModal, setAddEditFunctionModal] = useState({
    type: '',
    data: '',
    open: false
  });

  const handleSearch = () => {
    const filteredList = customSearchHandler(functionMasterList, searchValue);
    setFilterFunctionMasterList(filteredList);
  };

  const handleReset = () => {
    setSearchValue('');
    setFilterFunctionMasterList(functionMasterList);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'counter',
        header: 'Sr. No.',
        size: 90,
        accessorFn: (row, index) => index + 1,
        enableColumnOrdering: false,
        enableGrouping: false,
        enableColumnFilter: false
      },
      {
        header: 'Action',
        accessorKey: 'action',
        size: 110,
        enableColumnOrdering: false,
        enableGrouping: false,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <i
            className="icofont-edit text-primary cp"
            onClick={() =>
              setAddEditFunctionModal({
                type: 'EDIT',
                data: row?.original,
                open: true
              })
            }
          />
        )
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
        header: 'Function Title',
        accessorKey: 'function_name',
        enableSorting: false,
        width: '200px',
        muiTableBodyCellProps: () => ({
          sx: {
            color: '#f19828',
            fontWeight: 400
          }
        })
      },
      {
        accessorFn: (originalRows) =>
          `${originalRows?.is_automation_script || '--'} `,
        header: 'Is Automation Script',
        Header: (
          <span>
            Is Automation Script
            <i
              className="icofont-filter ms-2 text-dark"
              style={{ cursor: 'pointer' }}
            />
          </span>
        ),

        size: 250,
        enableSorting: false
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        filterVariant: 'date-range',
        accessorFn: (row) => new Date(row.created_at),
        Cell: ({ row }) =>
          row.original.created_at
            ? moment(row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
            : '--',
        size: 350
      },

      {
        accessorKey: 'created_by',
        header: 'Created By',
        accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
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
        id: 'updated_by',
        accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
        header: 'Updated By',
        size: 185
      }
    ],
    []
  );

  const transformDataForExport = (data) => {
    return data.map((row) => ({
      ...row,
      created_by:
        (row?.created_by?.first_name || '-' + ' ') +
        ' ' +
        (row?.created_by?.last_name || '-'),

      updated_by:
        (row?.updated_by?.first_name || '-' + ' ') +
        ' ' +
        (row?.updated_by?.last_name || '-'),
      status: row.is_active == 1 ? 'Active' : 'Deactive'
    }));
  };

  const transformedData = transformDataForExport(filteredFunctionMasterList);

  const clearFilters = () => {
    setReset(true);
  };

  useEffect(() => {
    dispatch(getFunctionMasterListThunk());
  }, []);

  useEffect(() => {
    setFilterFunctionMasterList(functionMasterList);
  }, [functionMasterList]);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  const exportDataKeys = {
    function_name: 'Function Title',
    remark: 'Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Function Master Record'
  };

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between gap-2 flex-wrap">
        <PageHeader headerTitle="Function Master" />
        <div>
          <button
            className="btn btn-primary text-white "
            onClick={() =>
              setAddEditFunctionModal({
                type: 'ADD',
                data: '',
                open: true
              })
            }
          >
            <i className="icofont-plus px-2"></i>
            Add Function Type
          </button>
        </div>
      </div>

      {filteredFunctionMasterList && (
        <div className="card mt-2">
          <MaterialTable
            data={transformedData}
            columns={columns}
            setReset={setReset}
            reset={reset}
            isLoading={isLoading?.getFunctionMasterList}
            exportDataKeys={exportDataKeys}
          />
        </div>
      )}
      <AddEditFunctionMaster
        show={addEditFunctionModal?.open}
        type={addEditFunctionModal?.type}
        currentFunctionData={addEditFunctionModal?.data}
        close={(prev) => setAddEditFunctionModal({ ...prev, open: false })}
        clearFilters={clearFilters}
      />
    </div>
  );
}

export default FunctionMasterComponent;
