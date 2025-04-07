import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { useDispatch, useSelector } from 'react-redux';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { getTestingGroupMasterListThunk } from '../../../redux/services/testCases/testingGroupMaster';
import AddTestingGroupModal from './AddTestingGroupModal';
import { Col, Row } from 'react-bootstrap';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
function TestingGroupMasterComponent() {
  const dispatch = useDispatch();
  const [reset, setReset] = useState(false);

  // // redux state
  const { testingGroupMasterList, isLoading } = useSelector(
    (state) => state?.testingGroupMaster
  );

  const [searchValue, setSearchValue] = useState('');
  const [filteredTestingGroupMasterList, setFilterTestingGroupMasterList] =
    useState([]);

  const [addEditTestingGroupModal, setAddEditTestingGroupModal] = useState({
    type: '',
    data: '',
    open: false
  });

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = customSearchHandler(
      testingGroupMasterList,
      searchValue
    );
    setFilterTestingGroupMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilterTestingGroupMasterList(testingGroupMasterList);
  };

  const columns = [
    {
      accessorKey: 'counter',
      header: 'Sr',
      size: 90,
      accessorFn: (row, index) => index + 1,
      enableColumnOrdering: false,
      enableGrouping: false
    },
    {
      header: 'Action',
      accessorKey: 'action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      Cell: ({ row }) => (
        <i
          className="icofont-edit text-primary cp"
          onClick={() =>
            setAddEditTestingGroupModal({
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
      header: 'Testing Group Title',
      enableSorting: false,
      size: 220,
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      }),
      accessorKey: 'group_name'
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      filterVariant: 'date-range',
      accessorFn: (row) => new Date(row.created_at),
      Cell: ({ row }) =>
        moment(row.original.created_at).format('MM/DD/YYYY HH:mm:ss'),
      size: 350
    },
    {
      accessorKey: 'created_by',
      header: 'Created By',
      accessorFn: (originalRow) =>
        originalRow?.updated_by?.first_name?.trim() +
        originalRow?.updated_by?.last_name?.trim()
          ? originalRow?.updated_by?.first_name?.trim() +
            ' ' +
            originalRow?.updated_by?.last_name?.trim()
          : '--',
      size: 180
    },
    {
      header: 'Updated At',
      accessorFn: (row) => row.updated_at || '--',
      enableSorting: false,
      width: '175px'
    },
    {
      id: 'updated_by',
      accessorFn: (originalRow) =>
        originalRow?.updated_by?.first_name?.trim() +
          originalRow?.updated_by?.last_name?.trim() || '--',
      header: 'Updated By',
      size: 185
    }
  ];

  const clearFilters = () => {
    setReset(true);
  };
  /* const transformDataForExport = (data) => {
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

  const transformedData = transformDataForExport(
    filteredTestingGroupMasterList
  );

  const exportColumns = [
    { title: 'Testing Group Title', field: 'group_name' },
    { title: 'Status', field: 'status' },

    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ]; */

  useEffect(() => {
    dispatch(getTestingGroupMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when testingTypeMasetrList changes
  useEffect(() => {
    setFilterTestingGroupMasterList(testingGroupMasterList);
  }, [testingGroupMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between">
        <PageHeader headerTitle="Testing Group Master" />
        <div>
          <button
            className="btn btn-primary text-white "
            onClick={() =>
              setAddEditTestingGroupModal({
                type: 'ADD',
                data: '',
                open: true
              })
            }
          >
            <i className="icofont-plus px-2"></i>
            Add Testing Group
          </button>
        </div>
      </div>

      <MaterialTable
        columns={columns}
        data={filteredTestingGroupMasterList}
        isLoading={isLoading?.getTestingGroupMasterList}
        setReset={setReset}
        reset={reset}
      />
      <AddTestingGroupModal
        show={addEditTestingGroupModal?.open}
        type={addEditTestingGroupModal?.type}
        currentTestingGroupData={addEditTestingGroupModal?.data}
        close={(prev) => setAddEditTestingGroupModal({ ...prev, open: false })}
        clearFilters={clearFilters}
      />
    </div>
  );
}

export default TestingGroupMasterComponent;
