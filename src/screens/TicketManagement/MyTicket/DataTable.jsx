import React from 'react';
import MyTicketDropdown from './MyTicketDropdown';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import ServerMaterial from '../../../components/custom/MUI Table/ServerMaterial';

const DataTableCustom = React.memo(
  ({
    allTicketsData = [],
    type,
    isLoading = false,
    totalRows,
    pagination,
    setPagination,
    allStatusData,
    allDepartmentData,
    allUsersData,
    setAllTicketsData,
    activeTab,
    setTotalRows,
    setColumnFilters,
    columnFilters,
    reset = false,
    setReset = () => {}
  }) => {
    const columns = [
      {
        accessorKey: 'action',
        header: 'Action',
        size: 120,
        Cell: ({ row }) => <MyTicketDropdown type={type} data={row.original} />,
        enableColumnOrdering: false,
        enableGrouping: false,
        enableSorting: false,
        enableColumnFilter: false
      },
      {
        accessorKey: 'ticket_id',
        header: 'Ticket Id',
        size: 170,
        Cell: ({ row }) => (
          <Link to={`/${_base}/Ticket/View/${row?.original?.id}`}>
            <span className="fw-bold text-secondary">
              {row?.original?.ticket_id}
            </span>
          </Link>
        )
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableColumnFilter: false
      },
      {
        accessorKey: 'ticket_date',
        header: 'Ticket Raised Date',
        filterVariant: 'date-range',
      },
      {
        accessorKey: 'expected_solve_date',
        header: 'Expected Solve Date'
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 120,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const priority = cell.getValue();
          const badgeColors = {
            'Very High': 'danger',
            High: 'warning',
            Medium: 'info',
            Low: 'success'
          };
          return (
            <span
              className={`badge bg-${badgeColors[priority] || 'secondary'}`}
            >
              {priority}
            </span>
          );
        }
      },
      {
        accessorFn: (originalRows) =>
          originalRows?.query_type?.query_type_name || '--',
        header: 'Type',
        enableColumnFilter: false
      },
      {
        accessorFn: (originalRows) => originalRows?.passed_status || '--',
        header: 'Passed Status',
        enableColumnFilter: false
      },
      {
        accessorFn: (originalRows) => originalRows?.status?.status || '--',
        header: 'Status',
        filterVariant: 'multi-select',
        filterSelectOptions: allStatusData?.selectData,
        size: 150
      },
      {
        accessorFn: (originalRows) =>
          originalRows?.assign_to_department?.department || '--',
        header: 'Assign To Dept',
        filterVariant: 'multi-select',
        filterSelectOptions: allDepartmentData?.selectData
      },
      {
        accessorFn: (originalRows) =>
          `${originalRows?.assignee?.first_name || '--'} ${
            originalRows?.assignee?.last_name || '--'
          }`,
        header: 'Assigned To',
        filterVariant: 'multi-select',
        filterSelectOptions: allUsersData?.selectData
      },
      {
        accessorFn: (originalRows) =>
          `${originalRows?.created_by?.first_name || '--'} ${
            originalRows?.created_by?.last_name || '--'
          }`,
        header: 'Created By',
        enableColumnFilter: false
      },
      ...(type === 'UnPassed'
        ? [
            {
              accessorFn: (row) => row.ticket_solved_date || '--',
              header: 'Solved Date'
            },
            {
              accessorFn: (originalRows) =>
                `${originalRows?.ticket_solved_by?.first_name || ''} ${
                  originalRows?.ticket_solved_by?.last_name || ''
                }`,
              header: 'Solved By'
            }
          ]
        : [])
    ];

    return (
      <ServerMaterial
        columns={columns}
        data={allTicketsData || []}
        isLoading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
        totalRows={totalRows}
        manualPagination={true}
        manualFiltering={true}
        setAllTicketsData={setAllTicketsData}
        activeTab={activeTab}
        setTotalRows={setTotalRows}
        setColumnFilters={setColumnFilters}
        columnFilters={columnFilters}
        reset={reset}
        setReset={setReset}
        enableRowSelection={type === 'UnPassed'}
      />
    );
  }
);

export default DataTableCustom;
