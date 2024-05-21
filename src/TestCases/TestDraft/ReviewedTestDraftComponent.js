import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Astrick } from "../../components/Utilities/Style";
import edit from "../../assets/images/edit.png";
import Vector from "../../assets/images/Vector.png";
import icons_back from "../../assets/images/icons_back.png";
import PageHeader from "../../components/Common/PageHeader";
import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { _base } from "../../settings/constants";
import { Field, Form, Formik } from "formik";
import { editTestCaseValidation } from "./Validation/EditTestCase";
import { Col, Row, Stack, Spinner } from "react-bootstrap";
import {
  CustomDropdown,
  CustomInput,
  CustomTextArea,
} from "../../components/custom/inputs/CustomInputs";
import EditTestCaseModal from "./EditTestCaseModal";
import DownloadFormatFileModal from "./DownloadFormatFileModal";
// import { CustomDropdown } from "../../components/custom/inputs/CustomInputs";

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

  // const testCaseInitialValue = {
  //   project_name: "",
  //   module_name: "",
  //   submodule_name: "",
  //   function: "",
  //   field: "",
  //   testing_type: "",
  //   testing_group: "",
  //   test_id: "",
  //   severity: "",
  //   steps: "",
  //   test_description: "",
  //   expected_result: "",
  // };

  // const handelAddCandidates = (formData) => {
  //   console.log("form", formData);
  //   const candidatesData = new FormData();
  //   candidatesData.append("project_name", formData.project_name);
  //   candidatesData.append("module_name", formData.module_name);
  //   candidatesData.append("submodule_name", formData.submodule_name);
  //   candidatesData.append("function", formData.function);
  //   candidatesData.append("field", formData.field);

  //   candidatesData.append("testing_type", formData.testing_type);

  //   candidatesData.append("testing_group", formData.testing_group);
  //   candidatesData.append("test_id", formData.test_id);
  //   candidatesData.append("severity", formData.severity);
  //   candidatesData.append("steps", formData.steps);
  //   candidatesData.append("test_description", formData.test_description);
  //   candidatesData.append("expected_result", formData.expected_result);
  // };
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
      {modal.showModal === true && (
        <EditTestCaseModal show={modal} close={() => setModal(false)} />
      )}
      {downloadmodal.showModal === true && (
        <DownloadFormatFileModal
          show={downloadmodal}
          close={() => setDownloadModal(false)}
        />
      )}
    </div>
  );
}

export default ReviewedTestDraftComponent;
