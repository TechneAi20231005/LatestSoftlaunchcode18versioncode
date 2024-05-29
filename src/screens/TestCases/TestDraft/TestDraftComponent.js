import React, { useEffect, useState } from "react";

import PageHeader from "../../../components/Common/PageHeader";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import CustomTab from "../../../components/custom/tabs/CustomTab";
import { RenderIf } from "../../../utils";
import TestDraftDetails from "./TestDraftDetails";
import ReviewedTestDraftDetails from "./ReviewedTestDraftDetails";
import DownloadFormatFileModal from "./DownloadFormatFileModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk,
  importTestDraftThunk,
} from "../../../redux/services/testCases/downloadFormatFile";
import { Modal } from "react-bootstrap";
import { Astrick } from "../../../components/Utilities/Style";
export default function TestDraftComponent({ close }) {
  // local state

  const dispatch = useDispatch();
  const { getTestDraftData } = useSelector((state) => state?.downloadFormat);

  console.log("getTestDraftData", getTestDraftData);
  const [currentTab, setCurrentTab] = useState("test_draft");
  const tabsLabel = [
    {
      label: "Test Draft",
      value: "test_draft",
    },
    { label: "Review Test Draft", value: "review_test_draft" },
  ];

  const [downloadmodal, setDownloadModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const handleDownloadModal = (data) => {
    setDownloadModal(data);
  };

  const [bulkModal, setBulkModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const handleBulkModal = (data) => {
    setBulkModal(data);
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    const file = e.target.elements.file_attachment.files[0]; // Access the file from the event target

    if (!file) {
      alert("Please choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file_attachment", file);
    dispatch(
      importTestDraftThunk({
        formData,
        onSuccessHandler: () => {
          setBulkModal({ showModal: false });
        },
        onErrorHandler: () => {
          // setOpenConfirmModal({ open: false });
        },
      })
    );
  };
  useEffect(() => {
    dispatch(getProjectModuleMasterThunk());
    dispatch(getModuleMasterThunk());
    dispatch(getSubModuleMasterThunk());
    dispatch(importTestDraftThunk());
  }, []);
  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Test Draft"
        renderRight={() => {
          return (
            <div className="d-flex justify-content-sm-end btn_container">
              <button className="btn btn-primary text-white me-2 ">
                Filter <i className="icofont-filter" />
              </button>

              <button
                className="btn btn-success text-white me-2 "
                onClick={(e) => {
                  handleDownloadModal({
                    showModal: true,
                    modalData: "",
                    modalHeader: "Edit Test Case",
                  });
                }}
              >
                Download Format File
              </button>
              <button
                onClick={() => {
                  handleBulkModal({
                    showModal: true,
                    modalData: "",
                    modalHeader: "Bulk Upload Vendor",
                  });
                }}
                className="btn btn-warning text-white "
              >
                Import Test Draft File
              </button>
              {currentTab === "review_test_draft" && (
                <ExportToExcel
                  className="btn btn-danger text-white ms-2 "
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
        <TestDraftDetails data={getTestDraftData} />
      </RenderIf>
      <RenderIf render={currentTab === "review_test_draft"}>
        <ReviewedTestDraftDetails />
      </RenderIf>

      {downloadmodal.showModal === true && (
        <DownloadFormatFileModal
          show={downloadmodal}
          close={() => setDownloadModal(false)}
        />
      )}

      <Modal
        centered
        show={bulkModal.showModal}
        size="sm"
        onHide={(e) => {
          handleBulkModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
          });
        }}
      >
        {" "}
        <Modal.Header>
          <Modal.Title className="fw-bold">
            {/* {bulkModal.modalHeader} */}
          </Modal.Title>
        </Modal.Header>
        <form method="post" onSubmit={handleBulkUpload}>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row ">
                <label className="form-label font-weight-bold">
                  Upload Excel/CSV File:
                  <Astrick color="red" size="13px" />
                </label>
                <input
                  type="file"
                  name="file_attachment"
                  id="file_attachment"
                  accept=".xlsx, .xls, .csv"
                  className="form-control"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-primary text-white"
              style={{ backgroundColor: "#484C7F" }}
              onClick={() => {
                handleBulkModal({
                  showModal: true,
                  modalData: "",
                  modalHeader: "Bulk Upload Test Draft",
                });
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                handleBulkModal({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                });
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
