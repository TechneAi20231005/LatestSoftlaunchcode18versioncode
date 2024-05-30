import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Astrick } from "../../../components/Utilities/Style";

import PageHeader from "../../../components/Common/PageHeader";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import { Modal, Form } from "react-bootstrap";
import { _base } from "../../../settings/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  getByTestPlanIDListThunk,
  getTestCaseReviewListThunk,
} from "../../../redux/services/testCases/testCaseReview";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { getReviewCommentMasterListThunk } from "../../../redux/services/testCases/reviewCommentMaster";

function TestCaseReviewDetails() {
  const { test_plan_id } = useParams();
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const dispatch = useDispatch();

  const { testPlanIdData } = useSelector((state) => state?.testCaseReview);
  const { getFilterReviewCommentMasterList } = useSelector(
    (state) => state?.reviewCommentMaster
  );

  const generateOptions = (options) => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  };

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
      selector: (row) => row.module_name,
      sortable: false,
      width: "100px",
    },

    {
      name: "Submodule",
      selector: (row) => row.sub_module_name,
      sortable: false,
      width: "100px",
    },
    {
      name: "Function",
      selector: (row) => row.function_name,
      sortable: false,
      width: "100px",
    },
    {
      name: "field",
      selector: (row) => row.field,
      sortable: false,
      width: "100px",
    },
    {
      name: "Testing Type",
      selector: (row) => row.type_name,
      sortable: false,
      width: "100px",
    },

    {
      name: "Testing Group",
      selector: (row) => row.group_name,
      sortable: false,
      width: "100px",
    },

    {
      name: "Test ID",
      selector: (row) => row.id,
      sortable: false,
      width: "100px",
    },
    {
      name: "Severity",
      selector: (row) => row.severity,
      sortable: false,
      width: "100px",
    },

    {
      name: "Test Description",
      selector: (row) => row.test_description,
      sortable: false,
      width: "100px",
    },
    {
      name: "Steps",
      selector: (row) => row.steps,
      sortable: false,
      width: "100px",
    },

    {
      name: "Expected Result",
      selector: (row) => row.expected_result,
      sortable: false,
      width: "100px",
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: false,
      width: "100px",
    },

    {
      name: "Reviewer comment",
      selector: (row) => row?.name,
      sortable: true,
      width: "250px",
      cell: (row) => (
        <select className="form-select" aria-label="Default select example">
          {generateOptions(getFilterReviewCommentMasterList)}
        </select>
      ),
    },
    {
      name: "Remark",
      selector: (row) => row?.remark,
      sortable: true,
      width: "300px",
      cell: (row) => (
        <input
          class="form-control"
          type="text"
          placeholder="Enter Remark"
          aria-label="default input example"
        ></input>
      ),
    },
    {
      name: "Project",
      selector: (row) => row.project_name,
      sortable: false,
      width: "100px",
    },

    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: false,
      width: "100px",
    },

    {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: false,
      width: "100px",
    },
  ];

  useEffect(() => {
    // getTestPlanData();
    dispatch(getByTestPlanIDListThunk({ test_plan_id: test_plan_id }));
    dispatch(getReviewCommentMasterListThunk());
  }, []);
  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Test Case Review"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <button className="btn btn-primary text-white c">
                Filter <i className="icofont-filter" />
              </button>

              <ExportToExcel
                className="btn btn-sm btn-danger "
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
          data={testPlanIdData}
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

          <select className="form-select">
            {generateOptions(getFilterReviewCommentMasterList)}
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
          className="btn btn-sm mx-2  btn-warning text-white"
        >
          <i class="icofont-paper-plane icon-large"></i>
          Resend
        </button>
        <button
          type="submit"
          className="btn btn-lg mx-2 btn-danger text-white "
        >
          Reject
        </button>

        <button
          type="submit"
          className="btn btn-lg mx-2 btn-success  text-white "
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
