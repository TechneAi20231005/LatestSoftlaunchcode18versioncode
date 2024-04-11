import React from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';

// // static import
import TableLoadingSkelton from '../../../../../../components/custom/loader/TableLoadingSkelton';

function CandidateEditHistory() {
  // // redux state
  const { candidateDetailsData, isLoading } = useSelector(state => state?.candidatesMaster);
  const { history } = candidateDetailsData;

  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px',
    },
    {
      name: 'Full Name',
      sortable: true,
      selector: row => row?.full_name || '--',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Preferred Role',
      sortable: true,
      selector: row => row?.preferred_role || '--',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Preferred Location',
      sortable: true,
      selector: row => row?.preferred_location || '--',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Current Years Of Work Experience',
      sortable: true,
      selector: row => row?.relevant_experience || '--',
      sortable: true,
      width: '230px',
    },
    {
      name: 'Current Monthly Salary',
      sortable: true,
      selector: row => row?.current_monthly_salary || '--',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Expected Monthly Salary (Net)',
      sortable: true,
      selector: row => row?.expected_monthly_salary || '--',
      sortable: true,
      width: '215px',
    },
    {
      name: 'Notice Period (In Days)',
      sortable: true,
      selector: row => row?.notice_period || '--',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Updated At',
      selector: row => row?.updated_at || '--',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Updated By',
      selector: row => row?.updated_by || '--',
      sortable: true,
      width: '175px',
    },
  ];

  return (
    <div className="mt-4">
      <h5 className="my-0 text-primary">Candidates details edit activity</h5>
      <hr className="primary_divider mt-1" />
      <DataTable
        columns={columns}
        data={history}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getCandidatesDetailsData}
        progressComponent={<TableLoadingSkelton />}
      />
    </div>
  );
}

export default CandidateEditHistory;
