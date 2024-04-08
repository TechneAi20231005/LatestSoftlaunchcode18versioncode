import React from 'react';
import DataTable from 'react-data-table-component';

function CandidateEditHistory() {
  // // static data
  const demoData = [
    { editedField: 'Lorem', updated_at: '2024-04-08', updated_by: 'John Doe' },
    { editedField: 'Ipsum', updated_at: '2024-04-07', updated_by: 'Jane Doe' },
    { editedField: 'Dolor', updated_at: '2024-04-06', updated_by: 'Alice Smith' },
    { editedField: 'Sit', updated_at: '2024-04-05', updated_by: 'Bob Johnson' },
  ];
  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
    },

    {
      name: 'Edited Field',
      sortable: true,
      selector: row => row?.editedField || '--',
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
    <div className="mt-4">
      <h5 className="my-0 text-primary">Candidates details edit activity</h5>
      <hr className="primary_divider mt-1" />
      <DataTable
        columns={columns}
        data={demoData}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
      />
    </div>
  );
}

export default CandidateEditHistory;
