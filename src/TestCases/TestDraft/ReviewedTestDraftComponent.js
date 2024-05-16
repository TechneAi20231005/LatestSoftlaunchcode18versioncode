import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Astrick } from "../../components/Utilities/Style";
import edit from "../../assets/images/edit.png";
import Vector from "../../assets/images/Vector.png";
import icons_back from "../../assets/images/icons_back.png";
import PageHeader from "../../components/Common/PageHeader";
import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
import { Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { _base } from "../../settings/constants";

function ReviewedTestDraftComponent() {
  const [currentTab, setCurrentTab] = useState("review_test_draft");
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const handleModal = (data) => {
    setModal(data);
  };

  const [downloadmodal, setDownloadModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const handleDownloadModal = (data) => {
    setDownloadModal(data);
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
          <img
            src={edit}
            style={{ width: "22px" }}
            className="mx-2 mb-1"
            alt=""
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: "", // You can add relevant data here
                modalHeader: "Edit Test Case",
              });
            }}
          />
          <Link
            to={`/${_base}/TestCaseHistoryComponent`}
            style={{ textDecoration: "none", color: "blue" }}
          >
            <i
              style={{
                fontSize: "18px",
                backgroundColor: "#FFB800",
                borderRadius: "60%",
              }}
              class="icofont-history text-dark w-10  cp"
            />
          </Link>
        </>
      ),
      sortable: false,
      width: "90px",
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
      name: "Reviewr coment",
      selector: (row) => row?.name,
      sortable: true,
      width: "250px",
      cell: (row) => (
        <select class="form-select" aria-label="Default select example">
          <option selected className style={{ border: "30px" }}>
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
        headerTitle="Test Draft"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <button
                className="btn btn-primary text-white"
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontFamily: "Open Sans",
                }}
              >
                Filter <i className="icofont-filter" />
              </button>
              <button
                className="btn btn btn-set-task w-sm-100"
                style={{
                  backgroundColor: " #198754",
                  color: "white",
                  fontWeight: "600",
                  fontFamily: "Open Sans",
                }}
                onClick={(e) => {
                  handleDownloadModal({
                    showModal: true,
                    modalData: "", // You can add relevant data here
                    modalHeader: "Edit Test Case ",
                  });
                }}
              >
                Download Format File
              </button>
              <button
                className="btn btn-warning btn-set-task w-sm-100"
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontFamily: "Open Sans",
                }}
              >
                Import Test Draft File
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
            </div>
          );
        }}
      />
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

      <div className="row mt-4">
        <div className="col-md-3">
          <label className="form-label font-weight-bold">
            Content Type :<Astrick color="red" size="13px" />{" "}
          </label>

          <select class="form-select" aria-label="Default select example">
            <option selected className style={{ border: "30px" }}>
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

      <div className="d-flex justify-content-end">
        <Link
          to={{
            pathname: `/${_base}/TestDraft`,
            state: "review_test_draft", // Pass currentTab as state
          }}
          // onClick={() => setCurrentTab("review_test_draft")}
          className="btn btn-primary text-white"
        >
          <img
            src={icons_back}
            style={{ width: "18px" }}
            className="my-1 mb-1"
            alt=""
          />{" "}
          Back
        </Link>
        <button
          type="submit"
          className="btn btn-sm btn"
          style={{ backgroundColor: " #198754", color: "white" }}
        >
          <img
            src={Vector}
            style={{ width: "15px" }}
            className="my-1 mb-1"
            alt=""
          />{" "}
          Send To Reviewer
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
              className="btn btn shadow p-2 text-primary"
              style={{ backgroundColor: " white" }}
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

      <Modal
        centered
        show={downloadmodal.showModal}
        size="lg"
        onHide={(e) => {
          handleDownloadModal({
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
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-primary text-white"
              style={{ backgroundColor: " #198754", color: "white" }}
            >
              Download CSV
            </button>
            <button
              type="button"
              className="btn btn shadow p-2"
              style={{ backgroundColor: " white", color: "black" }}
              onClick={() => {
                handleDownloadModal({
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

export default ReviewedTestDraftComponent;
