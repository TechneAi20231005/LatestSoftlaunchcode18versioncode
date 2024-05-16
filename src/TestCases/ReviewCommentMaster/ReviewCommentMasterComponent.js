import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Astrick } from "../../components/Utilities/Style";
import edit from "../../assets/images/edit.png";
import PageHeader from "../../components/Common/PageHeader";
import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
import { Modal, Form } from "react-bootstrap";

function ReviewCommentMasterComponent() {
  // // initial state

  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const handleModal = (data) => {
    setModal(data);
  };
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
    <div className="container-xxl">
      <PageHeader
        headerTitle="Review Comment Master"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <div className="justify-content-between">
                <button
                  className="btn btn-primary text-white"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontFamily: "Open Sans",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={(e) => {
                    handleModal({
                      showModal: true,
                      modalData: "", // You can add relevant data here
                      modalHeader: "Add Testing Type",
                    });
                  }}
                >
                  <i
                    className="icofont-plus"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Add Reviewer Comment
                </button>
              </div>
            </div>
          );
        }}
      />
      <div className="col-md-12 d-flex justify-content-start">
        <div className="col">
          <input className="form-control form-control-md"></input>
        </div>
        <button
          className="btn btn-warning text-white"
          style={{
            color: "white",
            fontWeight: "600",
            fontFamily: "Open Sans",
          }}
        >
          <i style={{ marginRight: "8px" }} class="icofont-search"></i>
          Search
        </button>

        <ExportToExcel
          className="btn btn-sm btn-danger"
          //   apiData={ExportData}
          style={{
            color: "white",
            fontWeight: "600",
            fontFamily: "Open Sans",
          }}
          fileName="State master Records"
        />

        <button
          className="btn btn-info btn-set-task w-md-100"
          style={{
            color: "white",
            fontWeight: "600",
            fontFamily: "Open Sans",
          }}
        >
          <i style={{ marginRight: "8px" }} class="icofont-refresh"></i>
          Reset
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
      />

      <Modal
        centered
        show={modal.showModal}
        size="lg"
        onHide={(e) => {
          handleModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
          });
        }}
      >
        <form
          method="post"
          // onSubmit={handleBulkUpload}
        >
          <Modal.Header>
            <Modal.Title className="fw-bold text-primary ">
              Add Reviewer Comment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col">
              <div className="col-md-12 ">
                <Form.Group>
                  <Form.Label className="font-weight-bold font-size-16px lh-21.79px mb-0">
                    Reviewer Comment Title <Astrick color="red" size="13px" />{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-12 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold mb-0">
                    Remark
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn btn-lg p-2 btn-primary "
              style={{ width: "100px" }}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn btn-lg shadow  p-2 text-primary"
              style={{ backgroundColor: " white", width: "100px" }}
              onClick={() => {
                handleModal({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                });
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default ReviewCommentMasterComponent;
