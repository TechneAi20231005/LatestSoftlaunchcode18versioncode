import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Astrick } from "../../../components/Utilities/Style";

import PageHeader from "../../../components/Common/PageHeader";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import { Modal, Form } from "react-bootstrap";
import { _base } from "../../../settings/constants";

function TestCaseReviewDetails() {
  const [currentTab, setCurrentTab] = useState("review_test_draft");
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const handleModal = (data) => {
    setModal(data);
  };
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
          <i
            className="icofont-edit text-primary cp"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: "", // You can add relevant data here
                modalHeader: "Edit Test Case Review",
              });
            }}
          />
        </>
      ),
      sortable: false,
      width: "90px",
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
    {
      name: "Reviewr coment",
      selector: (row) => row?.name,
      sortable: true,
      width: "250px",
      cell: (row) => (
        <select class="form-select" aria-label="Default select example">
          <option selected className>
            Open this select menu
          </option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      ),
    },
    {
      name: "Remark",
      selector: (row) => row?.name,
      sortable: true,
      width: "400px",
      cell: (row) => (
        <input
          class="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
        ></input>
      ),
    },
  ];
  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Test Case Review"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <button className="btn btn-primary text-white custom-font">
                Filter <i className="icofont-filter" />
              </button>

              <ExportToExcel
                className="btn btn-sm btn-danger custom-font"
                //   apiData={ExportData}

                fileName="State master Records"
              />
            </div>
          );
        }}
      />
      <Container fluid className="employee_joining_details_container">
        <h5 className="mb-0 text-primary">Test Cases</h5>
        <hr className="primary_divider " />
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

      <div className="row mt-4">
        <div className="col-md-3">
          <label className="form-label font-weight-bold">
            Content Type :<Astrick color="red" size="13px" />{" "}
          </label>

          <select class="form-select" aria-label="Default select example">
            <option selected className>
              Open this select menu
            </option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label font-weight-bold">Remark :</label>
          <input className="form-control"></input>
        </div>
      </div>

      <div className=" d-flex  justify-content-end">
        <button
          type="submit"
          className="btn btn-sm mx-2 custom-font btn-warning text-white"
        >
          <i class="icofont-paper-plane icon-large"></i>
          Resend
        </button>
        <button
          type="submit"
          className="btn btn-lg mx-2 btn-danger text-white custom-font"
        >
          Reject
        </button>

        <button
          type="submit"
          className="btn btn-lg mx-2 btn-success custom-font text-white "
        >
          Approve
        </button>
      </div>

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
              Edit Test Case
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Project Name
                  </Form.Label>
                  <Form.Control as="select">
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Module Name
                  </Form.Label>
                  <Form.Control as="select">
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Submodule Name
                  </Form.Label>
                  <Form.Control as="select">
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Control>
                </Form.Group>
              </div>

              <div className="col-md-4 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Function <Astrick color="red" size="13px" />{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-4 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold">Field</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-4 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Testing Type <Astrick color="red" size="13px" />{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>

              <div className="col-md-4 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Testing Group <Astrick color="red" size="13px" />{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-4 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Test Id <Astrick color="red" size="13px" />{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-4 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Severity <Astrick color="red" size="13px" />{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>

              <div className="col-md-6 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold">Steps</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3} // You can adjust the number of rows as per your requirement
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>

              <div className="col-md-6 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Test Description <Astrick color="red" size="13px" />{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    className="form-control-lg"
                    rows={3} // You can adjust the number of rows as per your requirement
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>

              <div className="col-md-6 mt-2">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Expected Result <Astrick color="red" size="13px" />{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    className="form-control-lg"
                    rows={3} // You can adjust the number of rows as per your requirement
                    placeholder="Enter Submodule Name"
                  ></Form.Control>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-primary shadow p-2">
              Update
            </button>
            <button
              type="button"
              className="btn btn shadow p-2 text-primary text-white"
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

export default TestCaseReviewDetails;
