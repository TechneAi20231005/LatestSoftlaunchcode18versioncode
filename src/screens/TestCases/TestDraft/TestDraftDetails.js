import React, { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { Field, Form, Formik } from "formik";
import { Astrick } from "../../../components/Utilities/Style";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeData } from "../../Dashboard/DashboardAction";
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

  const dispatch = useDispatch();
  const testerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getAllTesterDataList
  );
  // State to track selected rows
  const [selectAllNames, setSelectAllNames] = useState(false);
  const [selectedRowss, setSelectedRowss] = useState([]);

  // Check if all rows are selected

  // const handleSelectAllNamesChange = () => {
  //   const newSelectAllNames = !selectAllNames;
  //   setSelectAllNames(newSelectAllNames);
  //   if (newSelectAllNames) {
  //     setSelectedRowss(data.map((row) => row.id));
  //   } else {
  //     setSelectedRowss([]);
  //   }
  // };

  // // Handles individual checkbox change
  // const handleCheckboxChangee = (row) => {
  //   setSelectedRowss((prevSelectedRows) => {
  //     if (prevSelectedRows.includes(row.id)) {
  //       return prevSelectedRows.filter((selectedRow) => selectedRow !== row.id);
  //     } else {
  //       return [...prevSelectedRows, row.id];
  //     }
  //   });
  // };

  // Handles the "Select All" checkbox change
  // const handleSelectAllNamesChange = () => {
  //   const newSelectAllNames = !selectAllNames;
  //   setSelectAllNames(newSelectAllNames);
  //   if (newSelectAllNames) {
  //     setSelectedRowss(data.map((row) => row.id));
  //   } else {
  //     setSelectedRowss([]);
  //   }
  // };

  // // Handles individual checkbox change
  // const handleCheckboxChangee = (row) => {
  //   setSelectedRowss((prevSelectedRows) => {
  //     if (prevSelectedRows.includes(row.id)) {
  //       return prevSelectedRows.filter((selectedRow) => selectedRow !== row.id);
  //     } else {
  //       return [...prevSelectedRows, row.id];
  //     }
  //   });
  // };

  // // Handle updates to dropdowns and input fields
  // const handleInputChange = (id, field, value) => {
  //   setUpdatedData((prevData) => ({
  //     ...prevData,
  //     [id]: {
  //       ...prevData[id],
  //       [field]: value,
  //     },
  //   }));
  // };

  // const handleSubmit = () => {
  //   const selectedData = data.filter((row) => selectedRowss.includes(row.id));
  //   const finalData = selectedData.map((row) => ({
  //     ...row,
  //     ...updatedData[row.id],
  //   }));

  //   console.log("finalData", finalData);
  // };

  const [updatedData, setUpdatedData] = useState({});

  const columns = [
    {
      name: "Action",
      selector: (row) => (
        <>
          <i className="icofont-edit cp icon-large" />
          <i className="icofont-history text-dark w-10 cp bg-warning rounded-circle ml-2 icon-large mx-2" />
        </>
      ),
      sortable: false,
      width: "100px",
    },
    // {
    //   name: (
    //     <div
    //       style={{ display: "flex", alignItems: "center" }}
    //       onClick={handleSelectAllNamesChange}
    //     >
    //       <input
    //         type="checkbox"
    //         checked={selectAllNames}
    //         onChange={handleSelectAllNamesChange}
    //         style={{ marginRight: "5px" }}
    //       />
    //       Select All
    //     </div>
    //   ),
    //   selector: "selectAll",
    //   width: "3rem",
    //   center: true,
    //   cell: (row) => (
    //     <div style={{ display: "flex", alignItems: "center" }}>
    //       <input
    //         type="checkbox"
    //         checked={selectedRowss.includes(row.id)}
    //         onChange={() => handleCheckboxChangee(row)}
    //         style={{ marginRight: "5px" }}
    //       />
    //     </div>
    //   ),
    // },
    {
      name: "Module",
      selector: (row) => row.name,
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

  const handleSendToReviewerModal = (data) => {
    setSendToReviewerModal(data);
  };

  useEffect(() => {
    dispatch(getEmployeeData());
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
      {/* <div className="row mt-4">
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
      </div> */}
      {/* <button onClick={handleSubmit}>Submit</button> */}
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
        <form
          method="post"
          //  onSubmit={handleBulkUpload}
        >
          <Modal.Body>
            <small>Test Plan Id :</small>
            <hr style={{ borderColor: "gray", borderWidth: "1px" }} />
            <label>
              <b>
                Reviewer : <Astrick color="red" size="13px" />
              </b>
            </label>
            <Select
              type="text"
              className="form-control form-control-sm"
              //  id="tds_section"
              //  name="tds_section"
              options={testerData}
              placeholder="select..."
            />
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-sm btn bg-success text-white"
              onClick={() => {
                handleSendToReviewerModal({
                  showModal: true,
                  modalData: "",
                  modalHeader: "Send To Reviewer Modal",
                });
              }}
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
        </form>
      </Modal>
    </>
  );
}

export default TestDraftDetails;
