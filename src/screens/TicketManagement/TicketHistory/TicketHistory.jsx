import React, { useCallback, useEffect, useState } from 'react';
import MyTicketService from '../../../services/TicketService/MyTicketService';
import PageHeader from '../../../components/Common/PageHeader';
// import DataTable from 'react-data-table-component';
import { useParams } from 'react-router-dom';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';

const getConditionalCellStyles = (fieldValue) => ({
  when: (row) =>
    row.changes && row.changes.length > 1 && row.changes.includes(fieldValue),
  style: {
    color: 'red',
    fontWeight: 'bold',
    '&:hover': {
      cursor: 'pointer'
    }
  }
});

const TicketHistory = ({ match }) => {
  const { id } = useParams();

  const [data, setData] = useState();
  const columns = [
    {
      header: 'Sr',
      accessorKey: 'counter',
      size: 120,
      enableColumnFilter: false
    },
    {
      accessorKey: 'ticket_id',
      header: 'TicketId',
      size: 160,
      conditionalCellStyles: [getConditionalCellStyles('ticket_id')]
    },
    // {
    //   name: 'Ticket Type',
    //   selector: (row) => row.parent_name,
    //   sortable: true,
    //   conditionalCellStyles: [
    //     {
    //       when: (row) =>
    //         row.changes &&
    //         row.changes.length > 1 &&
    //         row.changes.includes('parent_name'),
    //       style: {
    //         color: 'red',
    //         fontWeight: 'bold',
    //         '&:hover': {
    //           cursor: 'pointer'
    //         }
    //       }
    //     }
    //   ]
    // },

    {
      accessorFn: (row) => row.created_by || '--',
      header: 'Ticket Created By User',
      size: 220,
      conditionalCellStyles: [getConditionalCellStyles('created_by')]
    },

    {
      accessorFn: ({ row }) => row?.from_department || '--',
      header: 'Ticket Created By Department',
      size: 220,
      conditionalCellStyles: [getConditionalCellStyles('from_department')]
    },

    {
      accessorFn: (row) => row.expected_solve_date || '--',
      header: 'Expected Date',
      size: 220,
      conditionalCellStyles: [getConditionalCellStyles('expected_solve_date')]
    },
    {
      accessorFn: (row) => row.passed_status_changed_at || '--',
      header: 'Passed Date',
      size: 190,
      conditionalCellStyles: [
        getConditionalCellStyles('passed_status_changed_at')
      ]
    },

    {
      accessorFn: (row) => row.passed_status || '--',
      header: 'Passed Status',
      size: 210,
      conditionalCellStyles: [getConditionalCellStyles('passed_status')]
    },

    {
      accessorFn: (row) => row.passed_status_changed_by || '--',
      header: 'Passed By',
      size: 180,
      conditionalCellStyles: [
        getConditionalCellStyles('passed_status_changed_by')
      ]
    },

    {
      accessorFn: (row) => row.query_type_name || '--',
      header: 'Query Type',
      size: 190,
      conditionalCellStyles: [getConditionalCellStyles('query_type_name')]
    },
    {
      accessorFn: (row) => row.project_name || '--',
      header: 'Project Name',
      size: 200,
      conditionalCellStyles: [getConditionalCellStyles('project_name')]
    },
    {
      accessorFn: (row) => row.module_name || '--',
      header: 'Module Name',
      size: 200,
      conditionalCellStyles: [getConditionalCellStyles('module_name')]
    },
    {
      accessorFn: (row) => row.sub_module_name || '--',
      header: 'Submodule Name',
      size: 230,
      conditionalCellStyles: [getConditionalCellStyles('sub_module_name')]
    },
    { accessorFn: (row) => row.cuid || '--', header: 'Ref Id', size: 170 },

    {
      accessorFn: (row) => row.type_name || '--',
      header: 'Ticket Type',
      size: 190,
      conditionalCellStyles: [getConditionalCellStyles('type_name')]
    },

    {
      accessorFn: (row) => row.priority || '--',
      header: 'Priority',
      size: 170,
      conditionalCellStyles: [getConditionalCellStyles('priority')]
    },
    {
      accessorFn: (row) => row.assign_to_user || '--',
      header: 'Assign To User',
      size: 220,
      conditionalCellStyles: [getConditionalCellStyles('assign_to_user')]
    },
    {
      accessorFn: (row) => row.department || '--',
      header: 'Assign Department',
      size: 230,
      conditionalCellStyles: [getConditionalCellStyles('department')]
    },
    {
      accessorFn: (row) => row.status || '--',
      header: 'Status',
      size: 170,
      conditionalCellStyles: [getConditionalCellStyles('status')]
    },
    {
      accessorFn: (row) => row.confirmation_required || '--',
      header: 'Confirmation',
      size: 195,
      Cell: ({ row }) =>
        row?.original?.confirmation_required === 1 ? 'YES' : 'NO',
      conditionalCellStyles: [getConditionalCellStyles('confirmation_required')]
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.created_at) || '--',
      header: 'Created At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`,
      conditionalCellStyles: [getConditionalCellStyles('created_at')]
    },

    {
      accessorFn: (originalRow) => originalRow.created_by || '--',
      header: 'Created By',
      conditionalCellStyles: [getConditionalCellStyles('created_by')]
    },

    {
      accessorFn: (originalRow) => new Date(originalRow.updated_at) || '--',
      header: 'Updated At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`,
      conditionalCellStyles: [getConditionalCellStyles('updated_at')]
    },
    {
      accessorFn: (originalRow) => originalRow.updated_by || '--',
      header: 'Updated By',
      size: 190,
      conditionalCellStyles: [getConditionalCellStyles('updated_by')]
    },
    {
      accessorKey: 'operation',
      header: 'Operation',
      size: 190,
      conditionalCellStyles: [getConditionalCellStyles('operation')]
    }
  ];

  // const conditionalRowStyles = [
  //   {
  //     when: row => row.operation=="UPDATE",
  //     style: {
  //       color: "red"
  //     }
  //   }
  // ];

  const loadData = useCallback(async () => {
    await new MyTicketService().getHistory(id).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          let counter = 1;
          const tempData = [];
          const temp = res.data.data.data;
          console.log('data', temp);
          for (const key in temp) {
            tempData.push({
              counter: counter++,
              operation: temp[key].operation,
              ticket_id: temp[key].ticket_id,
              ticket_date: temp[key].ticket_date,
              from_department: temp[key].from_department,
              expected_solve_date: temp[key].expected_solve_date,
              passed_status_changed_at: temp[key].passed_status_changed_at,
              passed_status: temp[key].passed_status,
              passed_status_changed_by: temp[key].passed_status_changed_by,
              query_type_name: temp[key].query_type_name,
              project_name: temp[key].project_name,
              module_name: temp[key].module_name,
              sub_module_name: temp[key].sub_module_name,
              cuid: temp[key].cuid,
              type_id: temp[key].type_id,
              priority: temp[key].priority,
              assign_to_user: temp[key].assign_to_user,
              department: temp[key].department,
              status: temp[key].status,
              confirmation_required: temp[key].confirmation_required,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
              type_name: temp[key].type_name,
              changes: temp[key].changes
            });
          }
          setData(tempData);
        }
      }
    });
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <div>
        {/* Page Header */}
        <div className="container-xxl">
          <PageHeader showBackBtn headerTitle="Ticket History" />
        </div>
        <div className="card mt-2">
          {data && (
            <MaterialTable isExportData={false} columns={columns} data={data} />
            // <DataTable
            //   columns={columns}
            //   data={data}
            //   defaultSortField="title"
            //   pagination
            //   selectableRows={false}
            //   className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            //   highlightOnHover={true}
            //   // conditionalRowStyles={conditionalRowStyles}
            // />
          )}
        </div>
      </div>
    </>
  );
};

export default TicketHistory;
