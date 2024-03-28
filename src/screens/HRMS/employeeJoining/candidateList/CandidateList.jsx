import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddCandidatesModal from './AddCandidatesModal';

function CandidateList() {
  // // static data
  const columns = [
    {
      name: 'Sr. No.',
      selector: row => row?.srNo,
      sortable: false,
      width: '15%',
    },

    { name: 'Action', selector: row => {}, sortable: false },
    {
      name: 'Candidate Name',
      sortable: true,
      selector: row => row?.candidateName,
    },

    {
      name: 'Applied Position',
      selector: row => row?.appliedPosition,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Date of Application',
      selector: row => row?.dateOfApplication,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Status',
      selector: row => row?.status,
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
  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addCandidateModal, setAddCandidateModal] = useState(false);

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
          data={[]}
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
