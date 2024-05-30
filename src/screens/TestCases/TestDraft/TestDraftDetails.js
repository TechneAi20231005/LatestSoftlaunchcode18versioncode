import React, { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { Field, Form, Formik } from "formik";
import { Astrick } from "../../../components/Utilities/Style";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeData } from "../../Dashboard/DashboardAction";
import {
  importTestDraftThunk,
  sendTestCaseReviewerThunk,
} from "../../../redux/services/testCases/downloadFormatFile";
import EditTestCaseModal from "./EditTestCaseModal";

function TestDraftDetails(props) {
  const data = props.data;

  console.log("getTestDraftDataNew", data);
  // // initial state
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const handleModal = (data) => {
    setModal(data);
  };

  const [addEditTestCasesModal, setAddEditTestCasesModal] = useState({
    type: "",
    data: "",
    open: false,
  });
  const dispatch = useDispatch();
  const testerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getAllTesterDataList
  );
  // State to track selected rows
  const [selectAllNames, setSelectAllNames] = useState(false);
  const [selectedRowss, setSelectedRowss] = useState([]);
  const [reviewerId, setReviewerID] = useState();

  // Check if all rows are selected

  const handleSelectAllNamesChange = () => {
    const newSelectAllNames = !selectAllNames;
    setSelectAllNames(newSelectAllNames);
    if (newSelectAllNames) {
      setSelectedRowss(data.map((row) => row.id));
    } else {
      setSelectedRowss([]);
    }
  };

  // Handles individual checkbox change
  const handleCheckboxChangee = (row) => {
    setSelectedRowss((prevSelectedRows) => {
      if (prevSelectedRows.includes(row.id)) {
        return prevSelectedRows.filter((selectedRow) => selectedRow !== row.id);
      } else {
        return [...prevSelectedRows, row.id];
      }
    });
  };

  // Handle updates to dropdowns and input fields
  const handleInputChange = (id, field, value) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
      },
    }));
  };

  const [updatedData, setUpdatedData] = useState({});

  const columns = [
    // {
    //   name: "Action",
    //   selector: (row) => (
    //     // <>
    //       <i
    //         onClick={() =>
    //           setAddEditTestCasesModal({
    //             type: "EDIT",
    //             data: row,
    //             open: true,
    //           })
    //         }
    //         className="icofont-edit cp icon-large"
    //       />
    //       // <i className="icofont-history text-dark w-10 cp bg-warning rounded-circle ml-2 icon-large mx-2" />
    //     // </>
    //   ),
    //   sortable: false,
    //   width: "100px",
    // },
    {
      name: "Action",
      selector: (row) => (
        <i
          className="icofont-edit text-primary cp"
          onClick={() =>
            setAddEditTestCasesModal({
              type: "EDIT",
              data: row,
              open: true,
            })
          }
        />

        // <i className="icofont-history text-dark w-10 cp bg-warning rounded-circle ml-2 icon-large mx-2" />
      ),
      sortable: false,
      width: "70px",
    },
    {
      name: (
        <div
          style={{ display: "flex", alignItems: "center" }}
          onClick={handleSelectAllNamesChange}
        >
          <input
            type="checkbox"
            checked={selectAllNames}
            onChange={handleSelectAllNamesChange}
            style={{ marginRight: "5px" }}
          />
          Select All
        </div>
      ),
      selector: "selectAll",
      width: "7rem",
      center: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={selectedRowss.includes(row.id)}
            onChange={() => handleCheckboxChangee(row)}
            style={{ marginRight: "5px" }}
          />
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
      name: "Platform",
      selector: (row) => row.platform,
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
      name: "Field",
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

    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      sortable: false,
      width: "100px",
    },
    {
      name: "Updated By",
      selector: (row) => row.updated_by,
      sortable: false,
      width: "100px",
    },
    // {
    //   name: "Reviewr comment",
    //   selector: (row) => row.name,
    //   sortable: true,
    //   width: "250px",
    //   cell: (row) => (
    //     <select
    //       className="form-select"
    //       aria-label="Default select example"
    //       onChange={(e) =>
    //         handleInputChange(row.id, "reviewerComment", e.target.value)
    //       }
    //     >
    //       <option value="" selected>
    //         Open this select menu
    //       </option>
    //       <option value="1">One</option>
    //       <option value="2">Two</option>
    //       <option value="3">Three</option>
    //     </select>
    //   ),
    // },
    // {
    //   name: "Remark",
    //   selector: (row) => row.name,
    //   sortable: true,
    //   width: "400px",
    //   cell: (row) => (
    //     <input
    //       className="form-control"
    //       type="text"
    //       placeholder="Default input"
    //       aria-label="default input example"
    //       onChange={(e) => handleInputChange(row.id, "remark", e.target.value)}
    //     />
    //   ),
    // },
  ];
  const [sendToReviewerModal, setSendToReviewerModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const handleSendToReviewerModal = (currentData) => {
    setSendToReviewerModal(currentData);
  };

  const handleSubmit = () => {
    const testCasesData =
      selectedRowss.length > 0
        ? selectedRowss.map((id) => id)
        : data.map((row) => row.id);

    const formData = {
      testcase_id: testCasesData,
      reviewer_id: reviewerId,
    };
    console.log("finalData", formData);

    dispatch(
      sendTestCaseReviewerThunk({
        formData,
        onSuccessHandler: () => {
          setSendToReviewerModal({ showModal: false });
        },
        onErrorHandler: () => {
          // setOpenConfirmModal({ open: false });
        },
      })
    );
  };
  useEffect(() => {
    dispatch(getEmployeeData());
    dispatch(importTestDraftThunk());
  }, []);
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
          className="btn btn-sm bg-success text-white"
          onClick={() => {
            handleSendToReviewerModal({
              showModal: true,
              modalData: "",
              modalHeader: "Send To Reviewer Modal",
            });
          }}
        >
          <i class="icofont-paper-plane fs-0.8"></i> {""}
          Send To Reviewer
        </button>
      </div>

      <Modal
        centered
        show={sendToReviewerModal.showModal}
        size="sm"
        onHide={(e) => {
          handleSendToReviewerModal({
            showModal: true,
            modalData: "",
            modalHeader: "Send To Reviewer Modal",
          });
        }}
      >
        {" "}
        <Modal.Body>
          <label>
            <b>
              Reviewer : <Astrick color="red" size="13px" />
            </b>
          </label>
          <Select
            type="text"
            className="form-control form-control-sm"
            id="reviewer_id"
            name="reviewer_id"
            options={testerData}
            onChange={(e) => {
              const selectedId = e?.value;
              setReviewerID(selectedId);
              console.log("Selected ID:", e.value);
            }}
            placeholder="select..."
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            className="btn btn-sm btn bg-success text-white"
            onClick={() => handleSubmit()}
          >
            <i class="icofont-paper-plane "></i> {""}
            Send To Reviewer
          </button>

          <button
            type="button"
            className="btn btn bg-white shadow p-2 text-black"
            onClick={() => {
              handleSendToReviewerModal({
                showModal: false,
                modalData: "",
                modalHeader: "Send To Reviewer Modal",
              });
            }}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      {addEditTestCasesModal.open === true && (
        <EditTestCaseModal
          show={addEditTestCasesModal?.open}
          type={addEditTestCasesModal?.type}
          currentTestCasesData={addEditTestCasesModal?.data}
          close={(prev) => setAddEditTestCasesModal({ ...prev, open: false })}
        />
      )}
    </>
  );
}

export default TestDraftDetails;
