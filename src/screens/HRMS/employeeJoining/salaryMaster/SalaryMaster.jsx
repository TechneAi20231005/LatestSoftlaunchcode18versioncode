import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddEditSalaryModal from './AddEditSalaryModal';

function SalaryMaster() {
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
      name: 'Department',
      selector: row => row?.department,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Designation',
      sortable: true,
      selector: row => row?.designation,
    },
    {
      name: 'Location',
      selector: row => row?.location,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Experience Level',
      selector: row => row?.experienceLevel,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Salary (Net)',
      selector: row => row?.salaryNet,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Status',
      selector: row => row?.status,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Remark',
      selector: row => row?.remark,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Created By',
      selector: row => row?.createdBy,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Updated At',
      selector: row => row?.updatedAt,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Updated By',
      selector: row => row?.updatedBy,
      sortable: true,
      width: '175px',
    },
  ];
  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addEditSalaryModal, setAddEditSalaryModal] = useState({
    type: '',
    data: '',
    open: false,
  });

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Salary Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() => setAddEditSalaryModal({ type: 'ADD', data: '', open: true })}
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Salary
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
              placeholder="Search..."
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
              fileName="Salary Lists Records"
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

      <AddEditSalaryModal
        show={addEditSalaryModal?.open}
        type={addEditSalaryModal?.type}
        currentSalaryData={addEditSalaryModal?.data}
        close={prev => setAddEditSalaryModal({ ...prev, open: false })}
      />
    </>
  );
}

export default SalaryMaster;
