import { description } from 'platform';
import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';
import MyTicketDropdown from './MyTicketDropdown';
import NoDataComponent from './NoDataComponent';

const DataTableCustom = React.memo(({ allTicketsData = [], type }) => {
  console.log('Myticket data table rendered');

  const columns = useMemo(() => {
    return [
      {
        name: 'Action',
        button: true,
        ignoreRowClick: true,
        allowOverflow: false,
        width: '80px',
        cell: (row) => <MyTicketDropdown type={type} data={row} />
      },
      {
        name: 'Sr No',
        selector: (_, index) => index + 1,
        width: '70px'
      },
      {
        name: 'Ticket Id',
        selector: (row) => row?.ticket_id || '--',
        width: '150px'
      },
      {
        name: 'Description',
        selector: (row) => row?.description || '--',
        width: '300px'
      },
      {
        name: 'Ticket Raised Date',
        selector: (row) => row?.ticket_date || '--',
        width: '180px'
      },
      {
        name: 'Expected Solve Date',
        selector: (row) => row?.expected_solve_date || '--',
        width: '200px'
      },
      {
        name: 'Priority',
        selector: (row) => (
          <div>
            {row.priority === 'Very High' && (
              <span style={{ width: '60px' }} className="badge bg-danger">
                {row.priority}
              </span>
            )}
            {row.priority === 'High' && (
              <span style={{ width: '60px' }} className="badge bg-warning">
                {row.priority}
              </span>
            )}
            {row.priority === 'Medium' && (
              <span style={{ width: '60px' }} className="badge bg-info">
                {row.priority}
              </span>
            )}
            {row.priority === 'Low' && (
              <span style={{ width: '60px' }} className="badge bg-success">
                {row.priority}
              </span>
            )}
          </div>
        ),
        width: '120px'
      },
      {
        name: 'Type',
        selector: (row) => row.query_type_name || '--',
        sortable: true,
        width: '150px'
      },
      {
        name: 'Passed Status',
        selector: (row) => row.passed_status || '--',
        sortable: true,
        width: '150px'
      },
      {
        name: 'Status',
        selector: (row) => row.status_name || '--',
        sortable: true,
        width: '150px'
      },
      {
        name: 'Assign To Dept',
        selector: (row) => row.assign_to_department || '--',
        sortable: true,
        width: '180px'
      },
      {
        name: 'Assigned To',
        selector: (row) => row.assign_to_user || '--',
        sortable: true,
        width: '180px'
      },
      {
        name: 'Created By',
        selector: (row) => row.created_by_name || '--',
        sortable: true,
        width: '150px'
      },
      {
        name: 'Solved Date',
        selector: (row) => row.ticket_solved_date || '--',
        sortable: true,
        width: '180px'
      },
      {
        name: 'Solved By',
        selector: (row) => row.ticket_solved_by || '--',
        sortable: true,
        width: '180px'
      }
    ];
  }, [type, allTicketsData]);

  const MIN_ROWS = 5;
  const filledData = useMemo(() => {
    return allTicketsData.length >= MIN_ROWS
      ? allTicketsData
      : [
          ...allTicketsData,
          ...Array(MIN_ROWS - allTicketsData.length).fill({})
        ];
  }, [allTicketsData]);

  return (
    <DataTable
      columns={columns}
      data={filledData}
      noDataComponent={<NoDataComponent />}
      pagination
      dense
    />
  );
});

export default DataTableCustom;
