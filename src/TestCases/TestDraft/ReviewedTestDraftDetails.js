import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Astrick } from "../../components/Utilities/Style";
import edit from "../../assets/images/edit.png";
import { Link } from "react-router-dom";
import { _base } from "../../settings/constants";

function ReviewedTestDraftDetails() {
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
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "80px",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>{row.id}</div>
      ),
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

    {
      name: (
        <div style={{ display: "flex", cursor: "pointer" }}>Test Plan Id</div>
      ),
      selector: "selectAll",
      width: "10rem",
      center: true,
      cell: (row) => (
        <div>
          <Link
            to={`/${_base}/ReviewedTestDraftComponent`}
            style={{ textDecoration: "underline", color: "blue" }}
          >
            {row.name}
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
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

export default ReviewedTestDraftDetails;
