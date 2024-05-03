import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import { ExportToExcel } from '../../../../../../components/Utilities/Table/ExportToExcel';
import { getInterviewScheduleHistoryThunk } from '../../../../../../redux/services/hrms/employeeJoining/interviewScheduleHistory';
import TableLoadingSkelton from '../../../../../../components/custom/loader/TableLoadingSkelton';

function InterviewScheduleHistory() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;

  // // redux state
  const { candidateInterviewScheduleHistoryList, isLoading } = useSelector(
    state => state?.candidateInterviewScheduleHistory,
  );

  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px',
    },
    {
      name: 'Step Title',
      selector: row => row?.step_title || '--',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Status',
      selector: row =>
        row?.schedule_type ? (row?.schedule_type === 'SCHEDULE' ? 'Schedule' : 'Reschedule') : '--',
      sortable: true,
      width: '120px',
    },
    {
      name: 'Schedule Date & Time',
      selector: row => row?.schedule_datetime || '--',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Created At',
      selector: row => row?.created_at || '--',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Created By',
      selector: row => row?.created_by || '--',
      sortable: true,
      width: '175px',
    },
  ];

  const transformDataForExport = data => {
    return data?.map((row, index) => ({
      'Sr No.': index + 1,
      'Step Title': row?.step_title || '',
      Status: row?.schedule_type
        ? row?.schedule_type === 'SCHEDULE'
          ? 'Schedule'
          : 'Reschedule'
        : '--',
      'Schedule Date & Time': row?.schedule_datetime || '',
      'Created At': row?.created_at || '--',
      'Created By': row?.created_by || '--',
    }));
  };

  // // life cycle
  useEffect(() => {
    dispatch(getInterviewScheduleHistoryThunk({ currentId: currentCandidateId }));
  }, []);

  return (
    <Container fluid className="employee_joining_details_container">
      <div className="d-flex justify-content-between align-items-center text-primary">
        <h5 className="mb-0">Interview Schedule History</h5>
        <ExportToExcel
          className="btn btn-danger"
          apiData={transformDataForExport(candidateInterviewScheduleHistoryList)}
          fileName="Interview schedule history"
          disabled={!candidateInterviewScheduleHistoryList.length}
        />
      </div>
      <hr className="primary_divider mt-1" />
      <DataTable
        columns={columns}
        data={candidateInterviewScheduleHistoryList}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getCandidateInterviewScheduleHistory}
        progressComponent={<TableLoadingSkelton />}
      />
    </Container>
  );
}

export default InterviewScheduleHistory;
