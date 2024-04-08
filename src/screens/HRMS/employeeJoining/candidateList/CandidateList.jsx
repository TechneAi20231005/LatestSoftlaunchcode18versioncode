import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddCandidatesModal from './AddCandidatesModal';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';
import { _base } from '../../../../settings/constants';

function CandidateList() {
  // // initial state
  const navigate = useNavigate();
  console.log(navigate);

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addCandidateModal, setAddCandidateModal] = useState(false);

  // // static data
  const demoData = [
    {
      srNo: 1,
      candidate_name: 'John Doe',
      applied_position: 'Software Engineer',
      date_of_application: '2024-04-05',
      is_active: true,
      source: 'LinkedIn',
    },
    {
      srNo: 2,
      candidate_name: 'Jane Smith',
      applied_position: 'Marketing Manager',
      date_of_application: '2024-04-04',
      is_active: false,
      source: 'Indeed',
    },
  ];

  const columns = [
    {
      name: 'Sr. No.',
      selector: row => row?.srNo,
      sortable: false,
    },

    {
      name: 'Action',
      selector: row => (
        <i
          className="icofont-external-link text-primary cp"
          onClick={() => navigate(`${row?.srNo}`)}
        />
      ),
      sortable: false,
    },
    {
      name: 'Candidate Name',
      sortable: true,
      selector: row => row?.candidate_name,
    },

    {
      name: 'Applied Position',
      selector: row => row?.applied_position,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Date of Application',
      selector: row => row?.date_of_application,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Status',
      selector: row => <StatusBadge status={row?.is_active} />,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Source',
      selector: row => row?.source,
      sortable: true,
      width: '175px',
    },
  ];

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
            <button className="btn btn-warning text-white" type="button">
              <i className="icofont-search-1 " /> Search
            </button>
            <button
              className="btn btn-info text-white"
              type="button"
              onClick={() => setSearchValue('')}
            >
              <i className="icofont-refresh text-white" /> Reset
            </button>
            <ExportToExcel
              className="btn btn-danger"
              apiData={[]}
              fileName="Candidates Lists Records"
            />
          </Col>
        </Row>
        <DataTable
          columns={columns}
          data={demoData}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
        />
      </Container>

      <AddCandidatesModal show={addCandidateModal} close={() => setAddCandidateModal(false)} />
    </>
  );
}

export default CandidateList;
