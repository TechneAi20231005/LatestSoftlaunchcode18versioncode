import React, { useEffect, useState } from "react";
import MyTicketService from "../../../services/TicketService/MyTicketService";
import PageHeader from "../../../components/Common/PageHeader";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { useParams } from "react-router-dom";

const TicketHistory = ({ match }) => {
  const { id } = useParams();

  const [data, setData] = useState();

  const columns = [
    { name: "Sr", selector: (row) => row.counter, sortable: true },
    { name: "TicketId", selector: (row) => row.ticket_id, sortable: true },
    { name: "Ticket Type", selector: (row) => row.type_name, sortable: true },

    {
      name: "Ticket Created By User",
      selector: (row) => row.created_by,
      sortable: true,
    },
    {
      name: "Ticket Created By Department",
      selector: (row) => row.from_department,
      sortable: true,
    },
    {
      name: "Expected Date",
      selector: (row) => row.expected_solve_date,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("expected_solve_date"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Passing Date",
      selector: (row) => row.passed_status_changed_at,
      sortable: true,
      width: "6%",
    },
    {
      name: "Passed Status",
      selector: (row) => row.passed_status,
      sortable: true,
    },
    {
      name: "Passed By",
      selector: (row) => row.passed_status_changed_by,
      sortable: true,
    },
    {
      name: "Query Type",
      selector: (row) => row.query_type_name,
      sortable: true,
    },
    {
      name: "Project Name",
      selector: (row) => row.project_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("project_name"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Module Name",
      selector: (row) => row.module_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("module_name"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Submodule Name",
      selector: (row) => row.sub_module_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("sub_module_name"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    { name: "Ref Id", selector: (row) => row.cuid, sortable: true },
    { name: "Ticket Type", selector: (row) => row.type_name, sortable: true },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("project_name"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Assign To User",
      selector: (row) => row.assign_to_user,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("assign_to_user"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Assign Department",
      selector: (row) => row.department,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("department"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("status"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Confirmation",
      selector: (row) => (row.confirmation_required == 1 ? "YES" : "NO"),
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
      width: "6%",
    },
    { name: "Created By", selector: (row) => row.created_by, sortable: true },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      sortable: true,
      width: "6%",
    },
    { name: "Updated By", selector: (row) => row.updated_by, sortable: true },
    {
      name: "Operation",
      selector: (row) => row.operation,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("operation"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
  ];

  // const conditionalRowStyles = [
  //   {
  //     when: row => row.operation=="UPDATE",
  //     style: {
  //       color: "red"
  //     }
  //   }
  // ];

  const loadData = async () => {
    await new MyTicketService().getHistory(id).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          let counter = 1;
          const tempData = [];
          const temp = res.data.data;
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
              changes: temp[key].changes,
            });
          }
          setData(tempData);
        }
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div>
        {/* Page Header */}
        <div className="container-xxl">
          <PageHeader headerTitle="Ticket History" />
        </div>
        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {data && (
                  <DataTable
                    columns={columns}
                    data={data}
                    defaultSortField="title"
                    pagination
                    selectableRows={false}
                    className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                    highlightOnHover={true}
                    // conditionalRowStyles={conditionalRowStyles}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketHistory;
