import React, { useEffect, useState } from 'react';
import { Col, Container, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddCandidatesModal from './AddCandidatesModal';
import { ApplicationStatusBadge } from '../../../../components/custom/Badges/StatusBadge';
import { customSearchHandler } from '../../../../utils/customFunction';
import { getCandidatesMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/candidatesListMaster';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';
import './style.scss';
import moment from 'moment';
import MaterialTable from '../../../../components/custom/MUI Table/MaterialTable';

function CandidateList() {
  // // initial state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // // redux state
  const { candidatesMasterList, isLoading } = useSelector(
    (state) => state?.candidatesMaster
  );

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addCandidateModal, setAddCandidateModal] = useState(false);
  const [filteredCandidatesMasterList, setFilteredCandidatesMasterList] =
    useState([]);

  // // static data
  // const columns = [
  //   {
  //     name: 'Action',
  //     selector: (row) => (
  //       <i
  //         className="icofont-external-link text-primary cp"
  //         onClick={() =>
  //           navigate(`${row?.id}`, { state: { currentCandidateId: row?.id } })
  //         }
  //       />
  //     ),
  //     sortable: false,
  //     width: '70px'
  //   },
  //   {
  //     name: 'Sr. No.',
  //     selector: (row, index) => index + 1,
  //     sortable: false,
  //     width: '70px'
  //   },
  //   {
  //     name: 'Candidate Name',
  //     sortable: true,
  //     selector: (row) =>
  //       row?.full_name ? (
  //         <OverlayTrigger
  //           placement="top"
  //           overlay={
  //             <Tooltip id={`tooltip-${row.id}`}>{row?.full_name}</Tooltip>
  //           }
  //         >
  //           <span>{row?.full_name || '--'}</span>
  //         </OverlayTrigger>
  //       ) : (
  //         '--'
  //       ),
  //     width: '150px'
  //   },
  //   {
  //     name: 'Application Id',
  //     selector: (row) => row?.application_id || '--',
  //     sortable: true,
  //     width: '150px'
  //   },
  //   {
  //     name: 'Applied Position',
  //     selector: (row) =>
  //       row?.designation ? (
  //         <OverlayTrigger
  //           placement="top"
  //           overlay={
  //             <Tooltip id={`tooltip-${row.id}`}>{row?.designation}</Tooltip>
  //           }
  //         >
  //           <span>{row?.designation || '--'}</span>
  //         </OverlayTrigger>
  //       ) : (
  //         '--'
  //       ),
  //     sortable: true,
  //     width: '200px'
  //   },
  //   {
  //     name: 'Phone Number',
  //     selector: (row) =>
  //       row?.mobile_no ? (
  //         <a href={`tel:${row?.mobile_no}`}>{row?.mobile_no}</a>
  //       ) : (
  //         '--'
  //       ),
  //     sortable: true,
  //     width: '130px'
  //   },
  //   {
  //     name: 'Source',
  //     selector: (row) => row?.source_name || '--',
  //     sortable: true,
  //     width: '175px'
  //   },
  //   {
  //     name: 'Status',
  //     selector: (row) => (
  //       <ApplicationStatusBadge
  //         type={
  //           row?.application_status_name === 'REJECTED'
  //             ? 'danger'
  //             : (() => {
  //                 switch (Number(row?.application_status_id)) {
  //                   case 1:
  //                     return 'primary';
  //                   case 2:
  //                     return 'warning';
  //                   case 3:
  //                     return 'info';
  //                   case 4:
  //                     return 'success';
  //                   default:
  //                     return 'danger';
  //                 }
  //               })()
  //         }
  //         name={row?.application_status_name || '--'}
  //       />
  //     ),
  //     sortable: true,
  //     minWidth: '100px'
  //   },
  //   {
  //     name: 'Date of Application',
  //     selector: (row) => row?.application_date || '--',
  //     sortable: true,
  //     width: '175px'
  //   }
  // ];
  const [reset, setReset] = useState(false);
  const clearFilters = () => {
    setReset(true);
  };
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
            className="icofont-external-link text-primary cp"
            onClick={() =>
              navigate(`${row?.original?.id}`, {
                state: { currentCandidateId: row?.original?.id }
              })
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
      accessorKey: 'full_name',
      header: 'Candidate Name',
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
      accessorKey: 'application_id',
      header: 'Application Id',
      size: 160
    },
    {
      accessorKey: 'designation',
      header: 'Applied Position',
      size: 160
    },
    {
      accessorKey: 'mobile_no',
      header: 'Phone Number',
      size: 160
    },
    {
      accessorKey: 'source_name',
      header: 'Source',
      size: 160
    },

    {
      accessorKey: 'application_status_name',
      header: 'Status',
      size: 150,
      accessorFn: (row) => row?.application_status_name || '--',
      filterFn: (row, id, filterValue) => {
        const status = row.getValue(id);
        return status?.toLowerCase().includes(filterValue?.toLowerCase());
      },
      Cell: ({ row }) => {
        const statusName = row?.original?.application_status_name;
        const statusId = Number(row?.original?.application_status_id);

        let badgeType = 'danger';
        if (statusName === 'REJECTED') {
          badgeType = 'danger';
        } else {
          switch (statusId) {
            case 1:
              badgeType = 'primary';
              break;
            case 2:
              badgeType = 'warning';
              break;
            case 3:
              badgeType = 'info';
              break;
            case 4:
              badgeType = 'success';
              break;
            default:
              badgeType = 'danger';
          }
        }

        return (
          <span className={`badge bg-${badgeType}`} style={{ width: '6rem' }}>
            {statusName || '--'}
          </span>
        );
      }
    },

    {
      accessorFn: (originalRow) => {
        return moment(originalRow.application_date).startOf('day').toDate();
      },
      header: 'Date of Applicatio',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        cell.row.original.application_date &&
        moment(cell.row.original.application_date).format('MM/DD/YYYY HH:mm:ss')
    }
  ];

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = customSearchHandler(candidatesMasterList, searchValue);
    setFilteredCandidatesMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilteredCandidatesMasterList(candidatesMasterList);
  };

  const transformDataForExport = (data) => {
    return data?.map((row, index) => ({
      'Sr No.': index + 1,
      'Candidates Name': row?.full_name || '--',
      'Applied Position': row?.designation || '--',
      'Phone Number': row?.mobile_no || '--',
      'Date of Application': row?.application_date || '--',
      Status: row?.application_status_name || '--',
      Source: row?.source_name || '--'
    }));
  };

  const exportDataKeys = {
    full_name: 'Candidates Name',
    designation: 'Applied Position',
    mobile_no: 'Phone Number',
    application_date: 'Date of Application',
    application_status_name: 'Status',
    source_name: 'Source',
    fileName: 'Candidate List Records'
  };

  // // life cycle
  useEffect(() => {
    dispatch(getCandidatesMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when candidatesMasterList changes
  useEffect(() => {
    setFilteredCandidatesMasterList(candidatesMasterList);
  }, [candidatesMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Candidate List"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() => setAddCandidateModal(true)}
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Candidate Data
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
              placeholder="Enter candidate name..."
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
              apiData={transformDataForExport(filteredCandidatesMasterList)}
              fileName="Candidates Lists Records"
              disabled={!filteredCandidatesMasterList?.length}
            />
          </Col>
        </Row> */}
        {/* <DataTable
          columns={columns}
          data={filteredCandidatesMasterList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.getCandidatesMasterList}
          progressComponent={<TableLoadingSkelton />}
        /> */}
        <div className="card mt-2">
          {filteredCandidatesMasterList && (
            <MaterialTable
              columns={columns}
              data={filteredCandidatesMasterList}
              isLoading={isLoading?.getCandidatesMasterList}
              reset={reset}
              setReset={setReset}
              exportDataKeys={exportDataKeys}
            />
          )}
        </div>
      </Container>

      <AddCandidatesModal
        show={addCandidateModal}
        close={() => setAddCandidateModal(false)}
        clearFilters={clearFilters}
      />
    </>
  );
}

export default CandidateList;
