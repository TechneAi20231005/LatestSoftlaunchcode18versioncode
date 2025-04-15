import React, { useEffect, useState } from 'react';
import { Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddEditInterviewMasterModal from './AddEditInterviewMasterModal';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';
import { getInterviewMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/interviewListMaster';
import { customSearchHandler } from '../../../../utils/customFunction';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';
import moment from 'moment';
import MaterialTable from '../../../../components/custom/MUI Table/MaterialTable';

function InterviewMaster() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { interviewMasterList, isLoading } = useSelector(
    (state) => state?.interviewMaster
  );

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addEditInterviewModal, setAddEditInterviewModal] = useState({
    open: false,
    type: '',
    data: ''
  });
  const [filteredInterviewMasterList, setFilteredInterviewMasterList] =
    useState([]);
  const [reset, setReset] = useState(false);
  const clearFilters = () => {
    setReset(true);
  };

  // // static data
  // const columns = [
  //   {
  //     name: 'Action',
  //     selector: (row) => (
  //       <>
  //         <i
  //           className="icofont-edit text-primary cp me-3"
  //           onClick={() =>
  //             setAddEditInterviewModal({ type: 'EDIT', data: row, open: true })
  //           }
  //         />
  //         <i
  //           class="icofont-eye-alt text-primary cp"
  //           onClick={() =>
  //             setAddEditInterviewModal({ type: 'VIEW', data: row, open: true })
  //           }
  //         />
  //       </>
  //     ),
  //     sortable: false,
  //     width: '90px'
  //   },
  //   {
  //     name: 'Sr. No.',
  //     selector: (row, index) => index + 1,
  //     sortable: false,
  //     width: '80px'
  //   },
  //   {
  //     name: 'Step Count',
  //     selector: (row) => row?.steps_count ?? '--',
  //     sortable: true,
  //     width: '110px'
  //   },
  //   {
  //     name: 'Department',
  //     selector: (row) =>
  //       row?.department ? (
  //         <OverlayTrigger
  //           placement="top"
  //           overlay={
  //             <Tooltip id={`tooltip-${row.id}`}>{row?.department}</Tooltip>
  //           }
  //         >
  //           <span>{row?.department ?? '--'}</span>
  //         </OverlayTrigger>
  //       ) : (
  //         '--'
  //       ),
  //     sortable: true,
  //     width: '150px'
  //   },
  //   {
  //     name: 'Designation',
  //     selector: (row) =>
  //       row?.designation ? (
  //         <OverlayTrigger
  //           placement="top"
  //           overlay={
  //             <Tooltip id={`tooltip-${row.id}`}>{row?.designation}</Tooltip>
  //           }
  //         >
  //           <span>{row?.designation ?? '--'}</span>
  //         </OverlayTrigger>
  //       ) : (
  //         '--'
  //       ),
  //     sortable: true,
  //     width: '150px'
  //   },
  //   {
  //     name: 'Experience Level',
  //     selector: (row) => row?.experience_level ?? '--',
  //     sortable: true,
  //     width: '150px'
  //   },
  //   {
  //     name: 'Status',
  //     sortable: true,
  //     selector: (row) => <StatusBadge status={row?.is_active} />,
  //     with: '120px'
  //   },
  //   {
  //     name: 'Created At',
  //     selector: (row) => row?.created_at ?? '--',
  //     sortable: true,
  //     width: '190px'
  //   },
  //   {
  //     name: 'Created By',
  //     selector: (row) => row?.created_by ?? '--',
  //     sortable: true,
  //     width: '190px'
  //   },

  //   {
  //     name: 'Updated At',
  //     selector: (row) => row?.updated_at ?? '--',
  //     sortable: true,
  //     width: '190px'
  //   },
  //   {
  //     name: 'Updated By',
  //     selector: (row) => row?.updated_by ?? '--',
  //     sortable: true,
  //     width: '190px'
  //   }
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
          <>
            <i
              className="icofont-edit text-primary cp me-3"
              onClick={() =>
                setAddEditInterviewModal({
                  type: 'EDIT',
                  data: row?.original,
                  open: true
                })
              }
            />
            <i
              class="icofont-eye-alt text-primary cp"
              onClick={() =>
                setAddEditInterviewModal({
                  type: 'VIEW',
                  data: row,
                  open: true
                })
              }
            />
          </>
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
    // {
    //   accessorKey: 'steps_count',
    //   header: 'Step Count',
    //   size: 160,
    //   filterVariant: 'autocomplete',
    //   muiTableBodyCellProps: () => ({
    //     sx: {
    //       color: '#f19828',
    //       fontWeight: 400
    //     }
    //   })
    // },
    {
      accessorKey: 'steps_count',
      header: 'Step Count',
      size: 160
    },
    {
      accessorKey: 'department',
      header: 'Department',
      size: 160
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      size: 160
    },
    {
      accessorKey: 'experience_level',
      header: 'Experience Level',
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
    const filteredList = customSearchHandler(interviewMasterList, searchValue);
    setFilteredInterviewMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilteredInterviewMasterList(interviewMasterList);
  };

  const transformDataForExport = (data) => {
    return data?.map((row, index) => ({
      'Sr No.': index + 1,
      Department: row?.department || '--',
      Designation: row?.designation || '--',
      'Experience Level': row?.experience_level || '--',
      'Step Count': row?.steps_count || '--',
      'Step Title': row?.details
        ?.map((detail) => detail?.step_title || '--')
        .join(', '),
      Name: row?.details
        ?.map((detail) => detail?.employee_name || '--')
        .join(', '),
      Email: row?.details
        ?.map((detail) => detail?.employee_email || '--')
        .join(', '),
      Remark: row?.remark || '--',
      Status: row?.is_active ? 'Active' : 'Deactive',
      'Created At': row?.created_at || '--',
      'Created By': row?.created_by || '--',
      'Updated At': row?.updated_at || '--',
      'Updated By': row?.updated_by || '--'
    }));
  };

  const exportDataKeys = {
    department: 'Department',
    designation: 'Designation',
    step_title: 'Step Title',
    experience_level: 'Experience Level',
    steps_count: 'Step Count',
    step_title: 'Step Title',
    employee_name: 'Name',
    email: 'Email',
    remark: 'Remark',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Interview Lists Records'
  };

  // // life cycle
  useEffect(() => {
    dispatch(getInterviewMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when interviewMasterList changes
  useEffect(() => {
    setFilteredInterviewMasterList(interviewMasterList);
  }, [interviewMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);
  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Interview Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() =>
                  setAddEditInterviewModal({ type: 'ADD', open: true })
                }
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Steps
              </button>
            );
          }}
        />
        {/* <Row className="row_gap_3">
          <Col xs={12} md={7} xxl={8}>
            <input
              type="search"
              name="interview_search"
              value={searchValue}
              onChange={(e) => setSearchValue(e?.target?.value)}
              placeholder="Enter interview name..."
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
              apiData={transformDataForExport(filteredInterviewMasterList)}
              fileName="Interview master Records"
              disabled={!filteredInterviewMasterList?.length}
            />
          </Col>
        </Row> */}
        {/* <DataTable
          columns={columns}
          data={filteredInterviewMasterList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.getInterviewMasterList}
          progressComponent={<TableLoadingSkelton />}
        /> */}
        <div className="card mt-2">
          {filteredInterviewMasterList && (
            <MaterialTable
              columns={columns}
              data={filteredInterviewMasterList}
              isLoading={isLoading?.getInterviewMasterList}
              reset={reset}
              setReset={setReset}
              exportDataKeys={exportDataKeys}
            />
          )}
        </div>
      </Container>
      <AddEditInterviewMasterModal
        show={addEditInterviewModal?.open}
        type={addEditInterviewModal?.type}
        currentInterviewData={addEditInterviewModal?.data}
        close={(prev) => setAddEditInterviewModal({ ...prev, open: false })}
        clearFilters={clearFilters}
      />
    </>
  );
}

export default InterviewMaster;
