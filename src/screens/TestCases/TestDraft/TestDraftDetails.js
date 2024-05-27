import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import CustomAlertModal from "../../../components/custom/modal/CustomModal";

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

  const [openConfirmModal, setOpenConfirmModal] = useState({
    open: false,
    formData: "",
  });

  const columns = [
    {
      name: "Action",
      selector: (row) => (
        <>
          <i className="icofont-edit cp  icon-large" />

          <i className="icofont-history text-dark w-10  cp bg-warning rounded-circle  ml-2 icon-large mx-2 custom-font" />
        </>
      ),
      sortable: false,
      width: "100px",
    },

    {
      name: (
        <div className="d-flex">
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
      <div className="d-flex justify-content-end mt-3">
        <button
          type="submit"
          className="btn btn-sm btn bg-custom text-white"
          onClick={() =>
            setOpenConfirmModal({
              data: "",
              open: true,
            })
          }
        >
          <i class="icofont-paper-plane custom-font"></i> {""}
          Send To Reviewer
        </button>
      </div>

      <CustomAlertModal
        show={openConfirmModal?.open}
        type="success"
        // message={`Do you want to ${
        //   type === "ADD" ? "save" : "update"
        // } this record?`}
        // onSuccess={handelAddEditReviewComment}
        onClose={() => setOpenConfirmModal({ open: false })}
        // isLoading={
        //   isLoading?.addReviewCommentMaster ||
        //   isLoading?.editReviewCommentMaster
        // }
      />
    </>
  );
}

export default TestDraftDetails;
