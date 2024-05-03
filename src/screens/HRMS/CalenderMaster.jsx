import React, { useState } from "react";
import Calendar from "react-calendar";
import Chart from "react-apexcharts";
import { Modal } from "react-bootstrap";
import { Astrick } from "../../components/Utilities/Style";
import Select from "react-select";

function CalenderMaster() {
  const [date, setDate] = useState(new Date());

  const handleModal = (data) => {
    setModal(data);
  };

  const LeaveType = [
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Annual Leave", label: "Annual Leave" },
    { value: "Maternity Leave", label: "Maternity Leave" },
    { value: "Common Leave", label: "Common  Leave" },
    { value: "Other Leave", label: "Other  Leave" },
  ];

  const options = [
    { value: "Full Day", label: "Full Day" },
    { value: "Half Day", label: "Half Day" },
  ];

  const Days = [
    { value: "First Half (AM)", label: "First Half (AM)" },
    { value: "Second Half (PM)", label: "Second Half (PM)" },
  ];

  const [modal, setModal] = useState({
    setModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [chartData, setChartData] = useState({
    series: [40],
    Chart: {
      height: "auto",
    },
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Anuual Leave"],

      colors: ["#DC4C64", "#E4A11B", "#198754", "#FBFBFB"],

      dataLables: {
        showL: false,
        style: {
          textColor: "white",

          colors: ["#a42c2c", "#fff"],
        },
      },
    },
  });

  return (
    <>
      <div className="d-flex justify-content-end">
        <button
          type="submit"
          className="btn btn-lg btn-primary"
          onClick={() => {
            handleModal({
              showModal: true,
              modalData: null,
              modalHeader: "Apply Leave",
            });
          }}
        >
          Apply Leave
        </button>
      </div>

      <div className="row">
        <div className="col-md-3">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height="150"
          />
        </div>
        <div className="col-md-3">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height="150"
          />
        </div>
        <div className="col-md-3">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height="150"
          />
        </div>
        <div className="col-md-3">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height="150"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-10">
          <div className="calendar-container">
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={({ date }) =>
                date.getDate() === 15 ? "react-calendar__tile--highlight" : ""
              }
            />
          </div>
        </div>
        <div className="col-md-2 mt-5">
          <div className="color-box">
            <div className="red-box"></div>
            <span className="fs-5">Annual leave</span>
          </div>
          <br></br>

          <div className="color-box">
            <div className="blue-box"></div>
            <span className="fs-5">Public Holiday</span>
          </div>
          <br></br>
          <div className="color-box">
            <div className="sick-box"></div>
            <span className="fs-5">Sick Leave</span>
          </div>
          <br></br>
          <div className="color-box">
            <div className="Attendance-box"></div>
            <span className="fs-5">Attendance</span>
          </div>
          <br></br>
          <div className="color-box">
            <div className="week-off"></div>
            <span className="fs-5">Week Off</span>
          </div>
          <br></br>
          <div className="color-box">
            <div className="extraworking-box"></div>
            <span className="fs-5">Extra Working</span>
          </div>
          <br></br>
          <div className="color-box">
            <div className="late-box"></div>
            <span className="fs-5">Late In</span>
          </div>
          <br></br>
          <div className="color-box">
            <div className="halfday-box"></div>
            <span className="fs-5">Half Day</span>
          </div>
          <br></br>
          <div className="color-box">
            <div className="earlyout-box"></div>
            <span className="fs-5">Early Out</span>
          </div>
          <br></br>
        </div>

        <Modal
          centered
          size="xl"
          show={modal.showModal}
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
            // onSubmit={handleForm(modal.modalData ? modal.modalData.id : "")}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="deadline-form">
                <div className="row">
                  <div className="col-md-5 mt-3">
                    <label className="form-label font-weight-bold">
                      Leave Type :<Astrick color="red" size="13px" />
                    </label>

                    <Select
                      options={LeaveType}
                      name="from_department_id"
                      id="from_department_id"
                      isMulti
                      required={true}
                    />
                  </div>
                  <div className="col-md-5  mt-3">
                    <label className="form-label font-weight-bold">
                      Available Balance <Astrick color="red" size="13px" />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control"
                      id="state"
                      name="state"
                      maxLength={25}
                      required
                      defaultValue={
                        modal.modalData ? modal.modalData.state : ""
                      }
                      // onKeyPress={(e) => {
                      //   Validation.CharacterWithSpace(e);
                      // }}
                      onPaste={(e) => {
                        e.preventDefault();
                        return false;
                      }}
                      onCopy={(e) => {
                        e.preventDefault();
                        return false;
                      }}
                    />
                  </div>

                  <div className="col-md-5 mt-4">
                    <label className="form-label font-weight-bold">
                      Leave For
                      <Astrick color="red" size="13px" />
                    </label>
                    <Select options={options} id="leave_for" name="leave_for" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-5 mt-4">
                    <label className="form-label font-weight-bold">
                      First Half/Second Half
                      <Astrick color="red" size="13px" />
                    </label>
                    <Select options={Days} id="leave_for" name="leave_for" />
                  </div>

                  <div className="col-md-5 mt-4">
                    <label className="form-label font-weight-bold">
                      From Date
                      <Astrick color="red" size="13px" />
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-md"
                      id="state"
                      name="state"
                      maxLength={25}
                      required
                      defaultValue={
                        modal.modalData ? modal.modalData.state : ""
                      }
                      // onKeyPress={(e) => {
                      //   Validation.CharacterWithSpace(e);
                      // }}
                      onPaste={(e) => {
                        e.preventDefault();
                        return false;
                      }}
                      onCopy={(e) => {
                        e.preventDefault();
                        return false;
                      }}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-5 mt-4">
                      <label className="form-label font-weight-bold">
                        First Half/Second Half
                        <Astrick color="red" size="13px" />
                      </label>
                      <Select options={Days} id="leave_for" name="leave_for" />
                    </div>

                    <div className="col-md-5 mt-4">
                      <label className="form-label font-weight-bold">
                        To Date
                        <Astrick color="red" size="13px" />
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-md"
                        id="state"
                        name="state"
                        maxLength={25}
                        required
                        defaultValue={
                          modal.modalData ? modal.modalData.state : ""
                        }
                        // onKeyPress={(e) => {
                        //   Validation.CharacterWithSpace(e);
                        // }}
                        onPaste={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                      />
                    </div>

                    <div className="col-md-2 mt-4">
                      <label className="form-label font-weight-bold">
                        Days
                        <Astrick color="red" size="13px" />
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-md"
                        id="state"
                        name="state"
                        maxLength={25}
                        required
                        defaultValue={
                          modal.modalData ? modal.modalData.state : ""
                        }
                        // onKeyPress={(e) => {
                        //   Validation.CharacterWithSpace(e);
                        // }}
                        onPaste={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-12 mt-4">
                    <label className="form-label font-weight-bold">
                      Reason for Leave :
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="remark"
                      name="remark"
                      required={true}
                      rows="4"
                      maxLength={50}
                    />
                  </div>

                  {/* {modal.modalData && (
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Status :<Astrick color="red" size="13px" />
                      </label>
                      <div className="row">
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_1"
                              value="1"
                              defaultChecked={
                                modal.modalData &&
                                modal.modalData.is_active === 1
                                  ? true
                                  : !modal.modalData
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_1"
                            >
                              Active
                            </label>
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_0"
                              value="0"
                              readOnly={modal.modalData ? false : true}
                              defaultChecked={
                                modal.modalData &&
                                modal.modalData.is_active === 0
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_0"
                            >
                              Deactive
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {!modal.modalData && (
                <button
                  type="submit"
                  className="btn btn-primary text-white"
                  style={{ backgroundColor: "#484C7F" }}
                >
                  Add
                </button>
              )}
              {/* {modal.modalData && checkRole && checkRole[5].can_update == 1 ? (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: "#484C7F" }}
              >
                Update
              </button>
            ) : (
              ""
            )} */}
              <button
                type="button"
                className="btn btn-danger text-white"
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
    </>
  );
}

export default CalenderMaster;
