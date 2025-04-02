import { description } from 'platform';
import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';
import MyTicketDropdown from './MyTicketDropdown';
import NoDataComponent from './NoDataComponent';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

const DataTableCustom = React.memo(
  ({
    allTicketsData = [],
    type,
    isLoading = false,
    setPage,
    setPerPage,
    totalRows
  }) => {
    const columns = useMemo(() => {
      return [
        {
          name: 'Action',
          button: true,
          ignoreRowClick: true,
          allowOverflow: false,
          width: '80px',
          cell: (row) =>
            Object.values(row).length > 0 ? (
              <MyTicketDropdown type={type} data={row} />
            ) : null
        },
        {
          name: 'Sr No',
          selector: (row) =>
            Object.values(row).length > 0 ? (_, index) => index + 1 : null,
          width: '70px'
        },
        {
          name: 'Ticket Id',
          selector: (row) =>
            Object.values(row).length > 0 ? row?.ticket_id || '--' : '',
          width: '150px'
        },
        {
          name: 'Description',
          selector: (row) =>
            Object.values(row).length > 0 ? row?.description || '--' : '',
          width: '300px'
        },
        {
          name: 'Ticket Raised Date',
          selector: (row) =>
            Object.values(row).length > 0 ? row?.ticket_date || '--' : '',
          width: '180px'
        },
        {
          name: 'Expected Solve Date',
          selector: (row) =>
            Object.values(row).length > 0
              ? row?.expected_solve_date || '--'
              : '',
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
          selector: (row) =>
            Object.values(row).length > 0 ? row?.query_type?.query_type_name || '--' : '',
          sortable: true,
          width: '150px'
        },
        {
          name: 'Passed Status',
          selector: (row) =>
            Object.values(row).length > 0 ? row.passed_status || '--' : '',
          sortable: true,
          width: '150px'
        },
        {
          name: 'Status',
          selector: (row) =>
            Object.values(row).length > 0 ? row.status?.status || '--' : '',
          sortable: true,
          width: '150px'
        },
        {
          name: 'Assign To Dept',
          selector: (row) =>
            Object.values(row).length > 0
              ? row.assign_to_department?.department || '--'
              : '',
          sortable: true,
          width: '180px'
        },
        {
          name: 'Assigned To',
          selector: (row) =>
            Object.values(row).length > 0 ? (row.assignee?.first_name || '-') + (row.assignee?.first_name || '-') : '',
          sortable: true,
          width: '180px'
        },
        {
          name: 'Created By',
          selector: (row) =>
            Object.values(row).length > 0 ? (row.created_by?.first_name || '-') + (row.created_by?.first_name || '-') : '',
          sortable: true,
          width: '150px'
        },
        {
          name: 'Solved Date',
          selector: (row) =>
            Object.values(row).length > 0 ? row.ticket_solved_date || '--' : '',
          sortable: true,
          width: '180px'
        },
        {
          name: 'Solved By',
          selector: (row) =>
            Object.values(row).length > 0 ? row.ticket_solved_by || '--' : '',
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

    const handlePageChange = (page) => setPage(page);
    const handlePerRowsChange = (newPerPage, page) => {
      setPage(page);
      setPerPage(newPerPage);
    };

    return Object.values(filledData[0]).length === 0 &&
      Object.values(filledData[1]).length === 0 ? (
      <NoDataComponent />
    ) : (
      <DataTable
        columns={columns}
        data={filledData}
        progressPending={isLoading}
        progressComponent={<TableLoadingSkelton />}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        dense
      />
    );
  }
);

export default DataTableCustom;
