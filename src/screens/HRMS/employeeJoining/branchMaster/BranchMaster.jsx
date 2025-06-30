import React, { useEffect, useState } from 'react';
import { Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import AddEditBranchModal from './AddEditBranchModal';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import { getBranchMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/branchMaster';
import { customSearchHandler } from '../../../../utils/customFunction';
import moment from 'moment';
import MaterialTable from '../../../../components/custom/MUI Table/MaterialTable';

function BranchMaster() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { branchMasterList, isLoading } = useSelector(
    (state) => state?.branchMaster
  );

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addEditBranchModal, setAddEditBranchModal] = useState({
    type: '',
    data: '',
    open: false
  });
  const [filteredBranchMasterList, setFilteredBranchMasterList] = useState([]);
  const [reset, setReset] = useState(false);
  const clearFilters = () => {
    setReset(true);
  };
  // // static data
  // const columns = [
  //   {
  //     name: 'Action',
  //     selector: row => (
  //       <i
  //         className="icofont-edit text-primary cp text-center"
  //         onClick={() => setAddEditBranchModal({ type: 'EDIT', data: row, open: true })}
  //       />
  //     ),
  //     sortable: false,
  //     width: '70px',
  //   },
  //   {
  //     name: 'Sr. No.',
  //     selector: (row, index) => index + 1,
  //     sortable: false,
  //     width: '70px',
  //   },
  //   {
  //     name: 'Branch Name',
  //     sortable: true,
  //     selector: row => row?.location_name || '--',
  //     width: '200px',
  //   },
  //   {
  //     name: 'Remark',
  //     sortable: true,
  //     selector: row =>
  //       row?.remark ? (
  //         <OverlayTrigger
  //           placement="top"
  //           overlay={<Tooltip id={`tooltip-${row.id}`}>{row?.remark}</Tooltip>}
  //         >
  //           <span>{row?.remark || '--'}</span>
  //         </OverlayTrigger>
  //       ) : (
  //         '--'
  //       ),
  //     width: '300px',
  //   },
  //   {
  //     name: 'Status',
  //     selector: row => <StatusBadge status={row?.is_active} />,
  //     sortable: true,
  //     width: '120px',
  //   },
  //   {
  //     name: 'Created At',
  //     selector: row => row?.created_at || '--',
  //     sortable: true,
  //     width: '175px',
  //   },
  //   {
  //     name: 'Created By',
  //     selector: row => row?.created_by || '--',
  //     sortable: true,
  //     width: '175px',
  //   },

  //   {
  //     name: 'Updated At',
  //     selector: row => row?.updated_at || '--',
  //     sortable: true,
  //     width: '175px',
  //   },
  //   {
  //     name: 'Updated By',
  //     selector: row => row?.updated_by || '--',
  //     sortable: true,
  //     width: '175px',
  //   },
  // ];

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
          <i
            className="icofont-edit text-primary cp text-center"
            onClick={() =>
              setAddEditBranchModal({ type: 'EDIT', data: row, open: true })
            }
          />
        );
      }
    },
    {
      accessorKey: 'counter',
      header: 'Sr',
      size: 70,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableColumnFilter: false
    },
    {
      accessorKey: 'location_name',
      header: 'Branch Name',
      size: 160,
      filterVariant: 'autocomplete',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
    },
    {
      accessorKey: 'remark',
      header: 'Remark',
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
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
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
      accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
      header: 'Updated By'
    }
  ];

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = customSearchHandler(branchMasterList, searchValue);
    setFilteredBranchMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilteredBranchMasterList(branchMasterList);
  };

  const transformDataForExport = (data) => {
    return data?.map((row, index) => ({
      'Sr No.': index + 1,
      'Branch Name': row?.location_name || '--',
      Remark: row?.remark || '--',
      Status: row?.is_active ? 'Active' : 'Deactive',
      'Created At': row?.created_at || '--',
      'Created By': row?.created_by || '--',
      'Updated At': row?.updated_at || '--',
      'Updated By': row?.updated_by || '--'
    }));
  };

  const exportDataKeys = {
    location_name: 'Branch Name',
    remark: 'Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Branch Lists Records'
  };
  // // life cycle
  useEffect(() => {
    dispatch(getBranchMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when branchMasterList changes
  useEffect(() => {
    setFilteredBranchMasterList(branchMasterList);
  }, [branchMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Branch Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() =>
                  setAddEditBranchModal({ type: 'ADD', data: '', open: true })
                }
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Branch
              </button>
            );
          }}
        />
        {/* <Row className="row_gap_3">
          <Col xs={12} md={7} xxl={8}>
            <input
              type="search"
              name="interview_search"
              id="branchmaster_branchname"
              value={searchValue}
              onChange={(e) => setSearchValue(e?.target?.value)}
              placeholder="Enter branch name..."
              className="form-control"
            />
          </Col>
          <Col
            xs={12}
            md={5}
            xxl={4}
            className="d-flex justify-content-sm-end btn_container"
          >
            <button
              className="btn btn-warning text-white"
              type="button"
              onClick={handleSearch}
            >
              <i className="icofont-search-1 " /> Search
            </button>
            <button
              className="btn btn-info text-white"
              type="button"
              onClick={handleReset}
            >
              <i className="icofont-refresh text-white" /> Reset
            </button>
            <ExportToExcel
              className="btn btn-danger"
              apiData={transformDataForExport(filteredBranchMasterList)}
              fileName="Branch Lists Records"
              disabled={!filteredBranchMasterList.length}
            />
          </Col>
        </Row> */}
        {/* <DataTable
          columns={columns}
          data={filteredBranchMasterList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.getBranchMasterList}
          progressComponent={<TableLoadingSkelton />}
        /> */}
        <div className="card mt-2">
          {filteredBranchMasterList && (
            <MaterialTable
              columns={columns}
              data={filteredBranchMasterList}
              isLoading={isLoading?.getBranchMasterList}
              reset={reset}
              setReset={setReset}
              exportDataKeys={exportDataKeys}
            />
          )}
        </div>
      </Container>

      <AddEditBranchModal
        show={addEditBranchModal?.open}
        type={addEditBranchModal?.type}
        currentBranchData={addEditBranchModal?.data}
        close={(prev) => setAddEditBranchModal({ ...prev, open: false })}
      />
    </>
  );
}

export default BranchMaster;
