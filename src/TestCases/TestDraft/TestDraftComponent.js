import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";

import PageHeader from "../../components/Common/PageHeader";
import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
import CustomTab from "../../components/custom/tabs/CustomTab";
import { RenderIf } from "../../utils";
import TestDraftDetails from "./TestDraftDetails";
import ReviewedTestDraftComponent from "./ReviewedTestDraftComponent";
import ReviewedTestDraftDetails from "./ReviewedTestDraftDetails";
import { Astrick } from "../../components/Utilities/Style";
import { useLocation } from "react-router-dom";
export default function TestDraftComponent() {
  // local state
  const [currentTab, setCurrentTab] = useState("test_draft");
  const tabsLabel = [
    {
      label: "Test Draft",
      value: "test_draft",
    },
    { label: "Review Test Draft", value: "review_test_draft" },
  ];

  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const handleModal = (data) => {
    setModal(data);
  };
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
                  handleModal({
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
              {currentTab === "review_test_draft" && (
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
              )}
            </div>
          );
        }}
      />

      <div className="mt-3">
        <CustomTab
          tabsData={tabsLabel}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </div>
      <RenderIf render={currentTab === "test_draft"}>
        <TestDraftDetails />
      </RenderIf>
      <RenderIf render={currentTab === "review_test_draft"}>
        <ReviewedTestDraftDetails />
      </RenderIf>
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
