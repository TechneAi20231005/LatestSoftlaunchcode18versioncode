import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PageHeader from "../../../components/Common/PageHeader";

function TestCaseHistoryComponent() {
  // // initial state
  const data = [
    {
      id: 1,
      name: "John Doe",
      age: 30,
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 25,
      email: "jane@example.com",
    },
    // Add more objects as needed
  ];

  const columns = [
    {
      name: "Module",
      selector: (row) => row.name,
      sortable: false,
      width: "100px",
    },

    {
      name: "Module",
      selector: (row) => row.name,
      sortable: false,
      width: "100px",
    },

    {
      name: "Module",
      selector: (row) => row.name,
      sortable: false,
      width: "100px",
    },
  ];
  return (
    <>
      <PageHeader headerTitle="Test Case History" />
      <Container fluid className="employee_joining_details_container">
        <DataTable
          columns={columns}
          data={data}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
        />
      </Container>
    </>
  );
}

export default TestCaseHistoryComponent;
