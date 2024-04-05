import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddEditInterviewMasterModal from './AddEditInterviewMasterModal';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';

function InterviewMaster() {
  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addEditInterviewModal, setAddEditInterviewModal] = useState({
    open: false,
    type: '',
    data: '',
  });

  // // static data
  const demoData = [
    {
      srNo: 1,
      department: 'Engineering',
      designation: 'Software Engineer',
      experienceLevel: 'Junior',
      is_active: 1,
      step_count: 3,
      step_title: 'Step 1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      remark: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      srNo: 2,
      department: 'Marketing',
      designation: 'Marketing Manager',
      experienceLevel: 'Senior',
      is_active: 0,
      step_count: 2,
      step_title: 'Step 2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      remark: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
        <>
          <i
            className="icofont-edit cp me-3"
            onClick={() => setAddEditInterviewModal({ type: 'EDIT', data: row, open: true })}
          />
          <i
            class="icofont-eye-alt cp"
            onClick={() => setAddEditInterviewModal({ type: 'VIEW', data: row, open: true })}
          />
        </>
      ),
      sortable: false,
    },

    {
      name: 'Department',
      selector: row => row?.department,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Designation',
      selector: row => row?.designation,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Experience Level',
      selector: row => row?.designation,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Status',
      sortable: true,
      selector: row => <StatusBadge status={row?.is_active} />,
    },
    {
      name: 'Step Count',
      selector: row => row?.step_count,
      sortable: true,
      width: '110px',
    },
    {
      name: 'Step Title',
      selector: row => row?.step_title,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Name',
      selector: row => row?.name,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Email',
      selector: row => row?.email,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Remark',
      selector: row => row?.remark,
      sortable: true,
      width: '175px',
    },
  ];

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Interview Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() => setAddEditInterviewModal({ type: 'ADD', open: true })}
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Steps
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
              placeholder="Enter interview name..."
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
              fileName="Interview master Records"
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
      <AddEditInterviewMasterModal
        show={addEditInterviewModal?.open}
        type={addEditInterviewModal?.type}
        currentInterviewData={addEditInterviewModal?.data}
        close={prev => setAddEditInterviewModal({ ...prev, open: false })}
      />
    </>
  );
}

export default InterviewMaster;
