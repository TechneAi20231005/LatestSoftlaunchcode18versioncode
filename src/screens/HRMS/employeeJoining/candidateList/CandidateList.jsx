import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddCandidatesModal from './AddCandidatesModal';
import { ApplicationStatusBadge } from '../../../../components/custom/Badges/StatusBadge';
import { _base } from '../../../../settings/constants';
import { customSearchHandler } from '../../../../utils/customFunction';
import { getCandidatesMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/candidatesListMaster';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';

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
      selector: row => row?.full_name || '--',
      width: '200px',
    },
    {
      name: 'Applied Position',
      selector: row => row?.designation || '--',
      sortable: true,
      width: '220px',
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
            row?.application_status_name === 'APPLIED'
              ? 'primary'
              : row?.application_status_name === 'IN PROCESS'
              ? 'warning'
              : row?.application_status_name === 'OFFER SENT'
              ? 'success'
              : 'danger'
          }
          name={
            row?.application_status_name === 'APPLIED'
              ? 'Applied'
              : row?.application_status_name === 'IN PROCESS'
              ? 'In Process'
              : row?.application_status_name === 'OFFER SENT'
              ? 'Offer Sent'
              : 'Rejected'
          }
        />
      ),
      sortable: true,
      width: '150px',
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
      'Date of Application': row?.application_date || '--',
      Status: row?.status || '--',
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
        <Row>
          <Col xs={12} md={8} xxl={9}>
            <input
              type="search"
              name="interview_search"
              value={searchValue}
              onChange={e => setSearchValue(e?.target?.value)}
              placeholder="Enter candidate name..."
              className="form-control"
            />
          </Col>
          <Col xs={12} md={4} xxl={3} className="text-end mt-2 mt-md-0">
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
              disabled={!filteredCandidatesMasterList.length}
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
