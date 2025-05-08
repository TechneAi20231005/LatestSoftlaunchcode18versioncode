import React, { useState } from 'react';
import MyTicketDropdown from './MyTicketDropdown';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import ServerMaterial from '../../../components/custom/MUI Table/ServerMaterial';
import DescriptionModal from './DescriptionModal';

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
    setReset = () => {},
    message = '',
  }) => {
    let tabType = type;
    const [modal, setModal] = useState({
      showModal: false,
      modalData: '',
      modalHeader: ''
    });

    const handleModal = (data) => {
      setModal(data);
    };
    const actionCell = ({ row }) => (
      <MyTicketDropdown
        setColumnFilters={setColumnFilters}
        setPagination={setPagination}
        type={tabType}
        data={row.original}
      />
    );
    const columns = [
      {
        accessorKey: 'action',
        header: 'Action',
        size: 120,
        Cell: actionCell,
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
        accessorFn: (originalRows) =>
          (
            <span
              onClick={() =>
                handleModal({
                  showModal: true,
                  modalData: originalRows,
                  modalHeader: ''
                })
              }
            >
              {originalRows?.description}
            </span>
          ) || '--',
        header: 'Description',
        enableColumnFilter: false,
        size: 250
      },
      {
        accessorKey: 'ticket_date',
        header: 'Ticket Date',
        filterVariant: 'date-range'
      },
      {
        accessorKey: 'expected_solve_date',
        header: 'Expected Solve Date',
        enableColumnFilter: false
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 160,
        enableColumnFilter: false,
        sortingFn: (rowA, rowB, columnId) => {

          const priorityOrder = {
            Low: 1,
            Medium: 2,
            High: 3,
            'Very High': 4,
          };
          const priorityA = rowA.getValue(columnId);
          const priorityB = rowB.getValue(columnId);
          return (priorityOrder[priorityA] || 0) - (priorityOrder[priorityB] || 0);
        },
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
      ...(type === 'CreatedByMe'
        ? [
            {
              accessorFn: (originalRows) => originalRows?.passed_status || '--',
              header: 'Passed Status',
              enableColumnFilter: false,
              size: 205
            }
          ]
        : []),
      {
        accessorFn: (originalRows) => originalRows?.status?.status || '--',
        header: 'Status',
        filterVariant: 'multi-select',
        filterSelectOptions: allStatusData?.selectData,
        size: 158
      },
      {
        accessorFn: (originalRows) =>
          originalRows?.assign_to_department?.department || '--',
        header: 'Assign To Dept',
        size: 220,
        filterVariant: 'multi-select',
        filterSelectOptions: allDepartmentData?.selectData
      },
      {
        accessorFn: (originalRows) =>
          `${originalRows?.assignee?.first_name || '--'} ${
            originalRows?.assignee?.last_name || '--'
          }`,
        header: 'Assigned To',
        size: 220,
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
              header: 'Solved Date',
              size: 190,
              enableColumnFilter: false
            },
            {
              accessorFn: (originalRows) =>
                `${originalRows?.ticket_solved_by?.first_name || '--'} ${
                  originalRows?.ticket_solved_by?.last_name || '--'
                }`,
              header: 'Solved By',
              enableColumnFilter: false
            }
          ]
        : [])
    ];

    return (
      <React.Fragment>
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
          message={message}
        />
        {modal.showModal && (
          <DescriptionModal modal={modal} handleModal={handleModal} />
        )}
      </React.Fragment>
    );
  }
);

export default DataTableCustom;
