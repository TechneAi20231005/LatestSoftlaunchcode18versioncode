import React, { useEffect, useMemo, useState } from 'react';
import MyTicketDropdown from './MyTicketDropdown';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import StatusService from '../../../services/MastersService/StatusService';
import { errorHandler } from '../../../utils';

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
  }) => {


    // console.log(allStatusData?.selectData, 'allStatusData');

    const selectedOption = [
        {
            value: 92,
            label: "New status "
        },
        {
            "value": 91,
            "label": "Badhiya233 "
        },
        {
            "value": 90,
            "label": "Good "
        },
        {
            "value": 89,
            "label": "Unsolveee "
        },
        {
            "value": 88,
            "label": "Asaytrew "
        },
        {
            "value": 87,
            "label": "Unsolve11 "
        },
        {
            "value": 86,
            "label": "Statuss "
        },
        {
            "value": 85,
            "label": "On roll "
        },
        {
            "value": 84,
            "label": "Jkdxkjsdkjsda "
        },
        {
            "value": 81,
            "label": "Test!@15 "
        },
        {
            "value": 80,
            "label": "Test!@123 "
        },
        {
            "value": 79,
            "label": "Test!@12 "
        },
        {
            "value": 78,
            "label": "Nnhkii "
        },
        {
            "value": 77,
            "label": "Xz "
        },
        {
            "value": 76,
            "label": "Forwarded to inventory 128t "
        },
        {
            "value": 74,
            "label": "In Progress Ashish "
        },
        {
            "value": 73,
            "label": "To Do Ashish "
        },
        {
            "value": 72,
            "label": "New statuss "
        },
        {
            "value": 71,
            "label": "J "
        },
        {
            "value": 70,
            "label": "Lj "
        },
        {
            "value": 68,
            "label": "Forwarded to inventory 12 "
        },
        {
            "value": 67,
            "label": "Test hi "
        },
        {
            "value": 66,
            "label": "Hello "
        },
        {
            "value": 65,
            "label": "Forwarded to inventory "
        },
        {
            "value": 64,
            "label": "Forwarded "
        },
        {
            "value": 63,
            "label": "Acc "
        },
        {
            "value": 62,
            "label": "Asasas "
        },
        {
            "value": 61,
            "label": "Dsds "
        },
        {
            "value": 60,
            "label": "Sa "
        },
        {
            "value": 59,
            "label": "A "
        },
        {
            "value": 58,
            "label": "Nn "
        },
        {
            "value": 55,
            "label": "Rahul Gosavi "
        },
        {
            "value": 54,
            "label": "Higher class "
        },
        {
            "value": 53,
            "label": "Good condition "
        },
        {
            "value": 52,
            "label": "SolveqqqQQQQQ "
        },
        {
            "value": 51,
            "label": "Sachin "
        },
        {
            "value": 50,
            "label": "Pradip "
        },
        {
            "value": 49,
            "label": "Amruta "
        },
        {
            "value": 48,
            "label": "Aishwarya "
        },
        {
            "value": 47,
            "label": "Swapnil joravar "
        },
        {
            "value": 46,
            "label": "Interview "
        },
        {
            "value": 45,
            "label": "Raj "
        },
        {
            "value": 44,
            "label": "I am Jalal "
        },
        {
            "value": 43,
            "label": "My name is Pune "
        },
        {
            "value": 42,
            "label": "Amol jamkhedkar "
        },
        {
            "value": 41,
            "label": "Qqqqq "
        },
        {
            "value": 40,
            "label": "Abhijeet "
        },
        {
            "value": 39,
            "label": "Q "
        },
        {
            "value": 38,
            "label": "Hello ji "
        },
        {
            "value": 37,
            "label": "Solveqqq "
        },
        {
            "value": 36,
            "label": "Jkdxkjsdkjsd "
        },
        {
            "value": 35,
            "label": "Summer "
        },
        {
            "value": 34,
            "label": "Winter in Pune "
        },
        {
            "value": 33,
            "label": "Winter "
        },
        {
            "value": 32,
            "label": "Unsolve "
        },
        {
            "value": 31,
            "label": "1234567 "
        },
        {
            "value": 30,
            "label": "In complete "
        },
        {
            "value": 29,
            "label": "Still working "
        },
        {
            "value": 28,
            "label": "Load add "
        },
        {
            "value": 26,
            "label": "Load "
        },
        {
            "value": 25,
            "label": "Follow up "
        },
        {
            "value": 24,
            "label": "Loaded "
        },
        {
            "value": 22,
            "label": "BUG "
        },
        {
            "value": 21,
            "label": "Duplicate "
        },
        {
            "value": 20,
            "label": "Rejected "
        },
        {
            "value": 19,
            "label": "Requirement Gathering "
        },
        {
            "value": 18,
            "label": "User side pending "
        },
        {
            "value": 17,
            "label": "D365 "
        },
        {
            "value": 16,
            "label": "Under Observation "
        },
        {
            "value": 15,
            "label": "Confirmation "
        },
        {
            "value": 14,
            "label": "FRS Sign Off "
        },
        {
            "value": 13,
            "label": "Documentation pending "
        },
        {
            "value": 9,
            "label": "Forwarded to Testing "
        },
        {
            "value": 8,
            "label": "Forwarded to Development "
        },
        {
            "value": 7,
            "label": "Work InProcess "
        },
        {
            "value": 6,
            "label": "Forwarded to ACME "
        },
        {
            "value": 4,
            "label": "Complete "
        },
        {
            "value": 3,
            "label": "Solved "
        },
        {
            "value": 2,
            "label": "In Progress "
        },
        {
            "value": 1,
            "label": "Unsolved "
        }
    ]

    const columns =
       [
        {
          accessorKey: 'action',
          header: 'Action',
          size: 120,
          Cell: ({ row }) => (
            <MyTicketDropdown type={type} data={row.original} />
          ),
          enableColumnOrdering: false,
          enableGrouping: false,
          enableSorting: false
        },
        // {
        //   accessorKey: 'sr_no',
        //   header: 'Sr No',
        //   size: 70,
        //   Cell: ({ row }) => {
        //     const pageIndex = pagination?.pageIndex || 0;
        //     const pageSize = pagination?.pageSize || 10;
        //     return pageIndex * pageSize + row.index + 1;
        //   },
        //   enableColumnOrdering: false,
        //   enableGrouping: false,
        //   enableSorting: false
        // },
        {
          accessorKey: 'ticket_id',
          header: 'Ticket Id',
          size: 170
        },
        {
          accessorKey: 'description',
          header: 'Description'
          // size: 150
        },
        {
          accessorKey: 'ticket_date',
          header: 'Ticket Raised Date'
        },
        {
          accessorKey: 'expected_solve_date',
          header: 'Expected Solve Date'
        },
        {
          accessorKey: 'priority',
          header: 'Priority',
          size: 120,
          Cell: ({ cell }) => {
            const priority = cell.getValue();
            return (
              <div>
                {priority === 'Very High' && (
                  <span className="badge bg-danger">{priority}</span>
                )}
                {priority === 'High' && (
                  <span className="badge bg-warning">{priority}</span>
                )}
                {priority === 'Medium' && (
                  <span className="badge bg-info">{priority}</span>
                )}
                {priority === 'Low' && (
                  <span className="badge bg-success">{priority}</span>
                )}
              </div>
            );
          }
        },
        {
          accessorKey: 'query_type.query_type_name',
          header: 'Type'
          // size: 150,
        },
        {
          accessorKey: 'passed_status',
          header: 'Passed Status'
          // size: 150,
        },
        {
          accessorFn:(originalRows) => originalRows?.status?.status,
          header: 'Status',
          filterVariant: 'multi-select',
          filterSelectOptions: allStatusData?.selectData,
          size: 150,
        },
        {
          accessorKey: 'assign_to_department.department',
          header: 'Assign To Dept',
            filterVariant: 'multi-select',
            filterSelectOptions: allDepartmentData?.selectData,
          // size: 180,
        },
        {
          accessorFn: (row) =>
            `${row.assignee?.first_name || ''} ${
              row.assignee?.last_name || ''
            }`,
          header: 'Assigned To',
            filterVariant: 'multi-select',
            filterSelectOptions: allUsersData?.selectData,
          // size: 180,
        },
        {
          accessorFn: (row) =>
            `${row.created_by?.first_name || ''} ${
              row.created_by?.last_name || ''
            }`,
          header: 'Created By'
          // size: 150,
        },
        {
          accessorFn: (row) => row.ticket_solved_date || '--',
          header: 'Solved Date'
        },
        {
          accessorFn: (row) => row.ticket_solved_by || '--',
          header: 'Solved By'
        }
      ];



    return (
      <MaterialTable
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
      />
    );
  }
);

export default DataTableCustom;
