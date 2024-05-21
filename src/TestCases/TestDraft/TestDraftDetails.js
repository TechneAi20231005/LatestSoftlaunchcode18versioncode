import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";

function TestDraftDetails() {
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
      name: "Action",
      selector: (row) => (
        <>
          <i className="icofont-edit text-primary cp" />

          <i
            style={{
              fontSize: "18px",
              backgroundColor: "#FFB800",
              borderRadius: "60%",
            }}
            class="icofont-history text-dark w-10  cp"
          />
        </>
      ),
      sortable: false,
      width: "100px",
    },

    {
      name: (
        <div style={{ display: "flex", cursor: "pointer" }}>
          <input type="checkbox" />
        </div>
      ),
      selector: "selectAll",
      width: "5rem",
      center: true,
      cell: (row) => (
        <div>
          <input type="checkbox" />
        </div>
      ),
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
      <Container fluid className="employee_joining_details_container">
        <h5 className="mb-0 text-primary">Test Cases</h5>
        <hr className="primary_divider mt-1" />
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

export default TestDraftDetails;
