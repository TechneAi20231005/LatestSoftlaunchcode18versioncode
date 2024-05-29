import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { _base } from "../../../settings/constants";
import PageHeader from "../../../components/Common/PageHeader";
import { getTestCaseReviewListThunk } from "../../../redux/services/testCases/testCaseReview";
import { useDispatch, useSelector } from "react-redux";

function TestCaseReviewComponent() {
  // // initial state
  const dispatch = useDispatch();

  const { testCaseReviewList } = useSelector((state) => state?.testCaseReview);

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
      width: "70px",
    },
    {
      name: <div className="d-flex">Test Plan Id</div>,
      selector: "Test Plan ID",
      width: "10rem",
      center: true,
      cell: (row) => (
        <div>
          <Link
            to={`/${_base + "/TestCaseReviewDetails/" + row.test_plan_id}`}
            className="link_underline_primary"
          >
            {row.test_plan_id}
            {console.log("row", row.test_plan_id)}
          </Link>
        </div>
      ),
    },
    {
      name: "Tester Name",
      selector: (row) => row.tester_name,
      sortable: false,
      width: "10rem",
    },
    {
      name: "Total Testcase",
      selector: (row) => row.total_testcases,
      sortable: false,
      width: "7rem",
    },
    {
      name: "Reviewed Testcase",
      selector: (row) => row.reviewed_testcases,
      sortable: false,
      width: "10rem",
    },
    {
      name: "Rejected Testcase",
      selector: (row) => row.total_rejected,
      sortable: false,
      width: "10rem",
    },
    {
      name: "Approved Testcse",
      selector: (row) => row.total_approved,
      sortable: false,
      width: "10rem",
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: false,
      width: "7rem",
    },

    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      sortable: false,
      width: "7rem",
    },
  ];

  useEffect(() => {
    dispatch(getTestCaseReviewListThunk());
  }, []);
  return (
    <>
      <PageHeader headerTitle="Test Case Review" />

      <Container fluid className="employee_joining_details_container">
        <DataTable
          columns={columns}
          data={testCaseReviewList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          //   progressPending={isLoading?.getInterviewMasterList}
          //   progressComponent={<TableLoadingSkelton />}
        />
      </Container>
    </>
  );
}

export default TestCaseReviewComponent;
