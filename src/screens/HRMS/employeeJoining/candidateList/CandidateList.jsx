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

function CandidateList() {
  // // initial state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // // redux state
  const { candidatesMasterList, isLoading } = useSelector(state => state?.candidatesMaster);

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addCandidateModal, setAddCandidateModal] = useState(false);
  const [filteredCandidatesMasterList, setFilteredCandidatesMasterList] = useState([]);

  // // static data
  const columns = [
    {
      name: 'Action',
      selector: row => (
        <i
          className="icofont-external-link text-primary cp"
          onClick={() => navigate(`${row?.id}`, { state: { currentCandidateId: row?.id } })}
        />
      ),
      sortable: false,
      width: '70px',
    },
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px',
    },
    {
      name: 'Candidate Name',
      sortable: true,
      selector: row =>
        row?.full_name ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${row.id}`}>{row?.full_name}</Tooltip>}
          >
            <span>{row?.full_name || '--'}</span>
          </OverlayTrigger>
        ) : (
          '--'
        ),
      width: '220px',
    },
    {
      name: 'Applied Position',
      selector: row => row?.designation || '--',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Phone Number',
      selector: row =>
        row?.mobile_no ? <a href={`tel:${row?.mobile_no}`}>{row?.mobile_no}</a> : '--',
      sortable: true,
      width: '130px',
    },
    {
      name: 'Source',
      selector: row => row?.source_name || '--',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Status',
      selector: row => (
        <ApplicationStatusBadge
          type={
            row?.application_status_name === 'REJECTED'
              ? 'danger'
              : (() => {
                  switch (Number(row?.application_status_id)) {
                    case 1:
                      return 'primary';
                    case 2:
                      return 'warning';
                    case 3:
                      return 'warning';
                    case 4:
                      return 'success';
                    default:
                      return 'danger';
                  }
                })()
          }
          name={row?.application_status_name || '--'}
        />
      ),
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Date of Application',
      selector: row => row?.application_date || '--',
      sortable: true,
      width: '175px',
    },
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

  const transformDataForExport = data => {
    return data?.map((row, index) => ({
      'Sr No.': index + 1,
      'Candidates Name': row?.full_name || '--',
      'Applied Position': row?.designation || '--',
      'Phone Number': row?.mobile_no || '--',
      'Date of Application': row?.application_date || '--',
      Status: row?.application_status_name || '--',
      Source: row?.source_name || '--',
    }));
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
              <button className="btn btn-dark px-5" onClick={() => setAddCandidateModal(true)}>
                <i className="icofont-plus me-2 fs-6" />
                Add Data
              </button>
            );
          }}
        />
        <Row className="row_gap_3">
          <Col xs={12} md={7} xxl={8}>
            <input
              type="search"
              name="interview_search"
              value={searchValue}
              onChange={e => setSearchValue(e?.target?.value)}
              placeholder="Enter candidate name..."
              className="form-control"
            />
          </Col>
          <Col xs={12} md={5} xxl={4} className="d-flex justify-content-sm-end btn_container">
            <button className="btn btn-warning text-white" type="button" onClick={handleSearch}>
              <i className="icofont-search-1 " /> Search
            </button>
            <button className="btn btn-info text-white" type="button" onClick={handleReset}>
              <i className="icofont-refresh text-white" /> Reset
            </button>
            <ExportToExcel
              className="btn btn-danger"
              apiData={transformDataForExport(filteredCandidatesMasterList)}
              fileName="Candidates Lists Records"
              disabled={!filteredCandidatesMasterList?.length}
            />
          </Col>
        </Row>
        <DataTable
          columns={columns}
          data={filteredCandidatesMasterList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.getCandidatesMasterList}
          progressComponent={<TableLoadingSkelton />}
        />
      </Container>

      <AddCandidatesModal show={addCandidateModal} close={() => setAddCandidateModal(false)} />
    </>
  );
}

export default CandidateList;
