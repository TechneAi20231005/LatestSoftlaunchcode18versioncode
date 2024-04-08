import React from 'react';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

// // static import
import { ExportToExcel } from '../../../../../../components/Utilities/Table/ExportToExcel';
import StatusBadge from '../../../../../../components/custom/Badges/StatusBadge';

function InterviewScheduleHistory() {
  // // static data
  const demoData = [
    {
      status: 'Schedule',
      schedule_date_time: '2024-04-10 09:00',
      created_at: '2024-04-01 08:30',
      created_by: 'John',
      updated_at: '2024-04-02 10:45',
      updated_by: 'Alice',
    },
    {
      status: 'Reschedule',
      schedule_date_time: '2024-04-12 11:30',
      created_at: '2024-03-15 10:00',
      created_by: 'Jane',
      updated_at: '2024-03-20 09:15',
      updated_by: 'Bob',
    },
    {
      status: 'Schedule',
      schedule_date_time: '2024-04-08 15:45',
      created_at: '2024-04-05 14:20',
      created_by: 'Doe',
      updated_at: '2024-04-06 16:30',
      updated_by: 'Smith',
    },
  ];
  // Add more demo data
  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: 'Status',
      selector: row => row?.status || '--',
      sortable: true,
    },
    {
      name: 'Schedule Date & Time',
      selector: row => row?.schedule_date_time || '--',
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => row?.created_at || '--',
      sortable: true,
    },
    {
      name: 'Created By',
      selector: row => row?.created_by || '--',
      sortable: true,
    },

    {
      name: 'Updated At',
      selector: row => row?.updated_at || '--',
      sortable: true,
    },
    {
      name: 'Updated By',
      selector: row => row?.updated_by || '--',
      sortable: true,
    },
  ];
  return (
    <Container className="employee_joining_details_container">
      <div className="d-flex justify-content-between align-items-center text-primary">
        <h5 className="mb-0">Interview Schedule History</h5>
        <ExportToExcel
          className="btn btn-danger"
          apiData={[]}
          fileName="Interview schedule history"
        />
      </div>
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
  );
}

export default InterviewScheduleHistory;
