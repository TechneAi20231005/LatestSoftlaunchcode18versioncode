// // created by Asmita Margaje

import React, { useEffect, useState, useRef } from "react";
import { Modal, Table } from "react-bootstrap";
import ErrorLogService from "../../../../services/ErrorLogService";
import Alert from "../../../../components/Common/Alert";
import { requestRegularizationTime } from "../../../../services/TicketService/TaskService";
import {
  getRegularizationTime,
  getRegularizationTimeData,
  changeStatusRegularizationTime,
} from "../../../../services/TicketService/TaskService";

import { useDispatch, useSelector } from "react-redux";
import TimeRegularizationSlice from "../../BasketManagement/Slices/TimeRegularizationSlice";
import { postTimeRegularizationData } from "../../BasketManagement/Slices/TimeRegularizationAction";
const RequestModal = (props) => {
  const [notify, setNotify] = useState(null);
  const [inputList, setInputList] = useState([
    {
      from_time: "00:00",
      to_time: "00:00",
      from_date: null,
      to_date: null,
    },
  ]);

  const basketStartDate = props.date;

  const [date, setDate] = useState("");
  const [time, setTime] = useState(null);

  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [timeDifference, setTimeDifference] = useState("");
  const dispatch = useDispatch();

  const Notify = useSelector(
    (TimeRegularizationSlice) =>
      TimeRegularizationSlice.timeRegularization.notify
  );
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const handleFromDate = (e) => {
    setDate(e.target.value);
  };

  const [timeData, setTimeData] = useState({});
  var ticket_id = props.data.ticket_id;
  var ticket_basket_id = props.data.ticket_basket_id;
  var task_owner_id = localStorage.getItem("id");
  var ticket_task_id = props.data.id;

  const [firstCheckboxChecked, setFirstCheckboxChecked] = useState(false);
  const [secondCheckboxChecked, setSecondCheckboxChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFirstCheckboxChange = (e) => {
    if (e) {
      setFirstCheckboxChecked(e.target.checked);
      if (e.target.checked) {
        handleSecondCheckboxChange({ target: { checked: false } });
      }
    }
  };

  const handleSecondCheckboxChange = (e) => {
    if (e) {
      setSecondCheckboxChecked(e.target.checked);
      if (e.target.checked) {
        handleFirstCheckboxChange({ target: { checked: false } });
      }
    }
  };

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        increaseChecked: false,
        decreaseChecked: false,
        value: 0,
        actual_time: null,
      },
    ]);
  };

  // This function is called when the checkbox for regularization time increase is clicked.
  const handleIncreaseChange = (index) => {
    // Create a copy of the 'rows' array to avoid directly modifying the state.
    const updatedRows = [...rows];

    // Set the 'increaseChecked' property of the row at the specified index to true.
    updatedRows[index].increaseChecked = true;

    // Set the 'decreaseChecked' property of the same row to false.

    updatedRows[index].decreaseChecked = false;

    // Update the state with the modified array of rows.
    setRows(updatedRows);
  };

  const handleActualChange = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].actual_time = timeDifference;
    setRows(updatedRows);
  };

  // This function is called when the checkbox for regularization time decrease is clicked.
  const handleDecreaseChange = (index) => {
    // Create a copy of the 'rows' array to avoid directly modifying the state.
    const updatedRows = [...rows];

    // Set the 'decreaseChecked' property of the row at the specified index to true.
    updatedRows[index].decreaseChecked = true;

    // Set the 'increaseChecked' property of the same row to false.
    updatedRows[index].increaseChecked = false;

    // Update the state with the modified array of rows.
    setRows(updatedRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotify(null);

    const data = new FormData(e.target);
    data.append("scheduled_time", props.data.task_hours);
    // data.append('actual_total_time',"00:30");
    dispatch(postTimeRegularizationData(data));
    // handleClose();
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...rows];
    list.splice(index, 1);
    setRows(list);
  };

  // handle click event of the Add button
  const [remark, setRemark] = useState();
  const handleAddClick = (e) => {
    setRemark(e.target.value);
  };

  const [regularizeTimeData, setRegularizeTimeData] = useState([]);

  const loadData = () => {
    new getRegularizationTimeData(props.data.ticket_id, props.data.id).then(
      (res) => {
        if (res.data.data) {
          // setData(null);
          setRegularizeTimeData(res.data.data);
        }
      }
    );
  };

  useEffect(() => {
    // Code to update the actual_time value automatically
    const updatedRows = rows.map((row) => ({
      ...row,
      actual_time: timeDifference,
    }));
    setRows(updatedRows);
  }, [timeDifference]);

  useEffect(() => {
    setNotify(null);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const [rows, setRows] = useState([
    {
      from_date: "",
      to_date: "",
      from_time: "",
      to_time: "",
      actual_time: "",
    },
    // Add more rows as needed
  ]);

  const calculateTimeDifference = (fromDate, toDate, fromTime, toTime) => {
    if (fromDate && toDate && fromTime && toTime) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      // Extract hours and minutes from the time strings
      const fromHours = Number(fromTime.split(":")[0]);
      const fromMinutes = Number(fromTime.split(":")[1]);
      const toHours = Number(toTime.split(":")[0]);
      const toMinutes = Number(toTime.split(":")[1]);

      fromDateObj.setHours(fromHours, fromMinutes);
      toDateObj.setHours(toHours, toMinutes);

      // Calculate the time difference in milliseconds
      const timeDiffMs = toDateObj - fromDateObj;

      // Ensure the time difference is positive
      const positiveTimeDiffMs = Math.abs(timeDiffMs);

      const timeDiffMinutes = Math.floor(positiveTimeDiffMs / (1000 * 60));
      const hours = Math.floor(timeDiffMinutes / 60);
      const minutes = (timeDiffMinutes % 60).toString().padStart(2, "0");

      return `${hours}:${minutes}`;
    }

    return "";
  };

  const handleActualTimeChange = (index, fromTime, toTime) => {
    const fromDate = rows[index].from_date;
    const toDate = rows[index].to_date;
    const actualTime = calculateTimeDifference(
      fromDate,
      toDate,
      fromTime,
      toTime
    );

    // Convert actual time to hours and minutes
    const [hours, minutes] = actualTime.split(":").map(Number);

    // Convert actual time to a numerical value for comparison
    const actualTimeValue = hours * 60 + minutes;

    // Check if actual time is greater than 12:00 hours
    if (actualTimeValue > 12 * 60) {
      // Alert if actual time exceeds 12:00 hours
      alert("Actual time is greater than 12:00 hours.");
      // Return without updating the UI
      return;
    }

    // Update actual time in the state
    setRows((prev) => {
      return prev.map((data, rowIndex) => {
        if (rowIndex === index) {
          const newData = { ...data };
          newData.from_time = fromTime;
          newData.to_time = toTime;
          newData.actual_time = actualTime;
          return newData;
        } else {
          return data;
        }
      });
    });
  };

  const [fromDate, setFromDate] = useState(""); // State for from_date
  const [toDate, setToDate] = useState("");

  const handleDateChange = (index, dateType, value, fromTime, toTime) => {
    if (dateType === "from_date") {
      setFromDate((prevFromDates) => ({
        ...prevFromDates,
        [index]: value,
      }));
    } else if (dateType === "to_date") {
      setToDate((prevToDates) => ({
        ...prevToDates,
        [index]: value,
      }));
    }

    setRows((prev) => {
      const updatedRows = prev.map((data, rowIndex) => {
        if (rowIndex === index) {
          return {
            ...data,
            [dateType]: value,
            from_time: fromTime,
            to_time: toTime,
          };
        } else {
          return data;
        }
      });
      const updatedFromTime = updatedRows[index].from_time;
      const updatedToTime = updatedRows[index].to_time;
      const actualTime = calculateTimeDifference(
        updatedRows[index].from_date,
        updatedRows[index].to_date,
        updatedFromTime,
        updatedToTime
      );

      updatedRows[index].actual_time = actualTime;

      return updatedRows;
    });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setRows((prev) =>
      prev.map((data, rowIndex) =>
        rowIndex === index ? { ...data, [name]: value } : data
      )
    );
  };

  function calculateActualTime(fromDate, toDate, fromTime, toTime) {
    // Combine date and time into a single string
    const fromDateTime = `${fromDate} ${fromTime}`;
    const toDateTime = `${toDate} ${toTime}`;

    // Parse date and time using a specific format (assuming "MM/DD/YYYY hh:mm A" format)
    const fromDateTimeObj = new Date(fromDateTime);
    const toDateTimeObj = new Date(toDateTime);

    // Calculate the time difference in milliseconds
    let timeDiff = toDateTimeObj - fromDateTimeObj;

    // Ensure a positive time difference by adding a full day if necessary
    if (timeDiff < 0) {
      timeDiff += 24 * 60 * 60 * 1000; // Add a full day in milliseconds
    }

    // Convert the time difference to hours and minutes
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    // Format the result as HH:mm
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  // Define a function to handle row removal
  const handleRemoveClickk = (index) => {
    const updatedData = [...regularizeTimeData];
    updatedData.splice(index, 1); // Remove the row at the specified index
    setRegularizeTimeData(updatedData);
  };

  // Define a function to add a new row
  const addRoww = () => {
    const newRow = {
      from_date: "", // Initialize with default values
      to_date: "",
      from_time: "",
      to_time: "",
      actual_time: "", // You may set a default value if needed
      isAddingNewRow: true,
      remark: "",
    };
    const updatedData = [...regularizeTimeData, newRow];
    setRegularizeTimeData(updatedData);
  };

  const handleRemarkChange = (e, index) => {
    const { value } = e.target;
    const updatedData = [...regularizeTimeData]; // Make a copy of the array
    updatedData[index].remark = value; // Update the remark field of the corresponding row
    setRegularizeTimeData(updatedData); // Update the state with the modified array
  };

  const handleClose = () => {
    const timer = setTimeout(() => {
      props.close();
      clearInterval(timer);
    }, 5000);
  };
  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.hide}
        dialogClassName="modal-100w"
        size="xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        {Notify && <Alert alertData={Notify} />}

        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Time Regularization
          </Modal.Title>
        </Modal.Header>
        <Modal.Header>
          <Modal.Title id="example-custom-modal-styling-title">
            <div className="row">
              <div className="col-md">
                <h6
                  style={{ fontWeight: "bold", width: "300px" }}
                >{`Ticket ID: ${props.data.ticket_id_name}`}</h6>
              </div>
              <div className="col-md ">
                <h6 style={{ fontWeight: "bold", width: "580px" }}>{`Task Name:
  ${props.data.task_name}`}</h6>
              </div>

              <div className="col-md">
                <h6
                  style={{ fontWeight: "bold" }}
                >{`Scheduled Time: ${props.data.task_hours}`}</h6>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit} id="requestForm">
          <input
            type="hidden"
            id="ticket_id"
            name="ticket_id"
            value={ticket_id}
          />
          <input
            type="hidden"
            id="ticket_basket_id"
            name="ticket_basket_id"
            value={ticket_basket_id}
          />
          <input
            type="hidden"
            id="ticket_task_id"
            name="ticket_task_id"
            value={ticket_task_id}
          />

          <Modal.Body>
            <div className="table-responsive">
              <table
                className="table table-bordered mt-3 table-responsive"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> Sr No </th>
                    <th className="text-center"> From Date </th>
                    <th className="text-center"> To Date </th>
                    <th className="text-center"> From Time </th>
                    <th className="text-center"> To Time </th>
                    <th className="text-center"> Actual Time </th>

                    <th className="text-center"> Remark </th>
                    <th className="text-center"> Action</th>
                  </tr>
                </thead>
                <tbody>
                  {regularizeTimeData && regularizeTimeData.length > 0 ? (
                    <>
                      {regularizeTimeData &&
                        regularizeTimeData.map((row, index) => {
                          const handleFromDateChange = (
                            index,
                            value,
                            dateType
                          ) => {
                            if (dateType === "from_date") {
                              setFromDate((prevFromDates) => ({
                                ...prevFromDates,
                                [index]: value,
                              }));
                            } else if (dateType === "to_date") {
                              setToDate((prevToDates) => ({
                                ...prevToDates,
                                [index]: value,
                              }));
                            }

                            const updatedData = [...regularizeTimeData];
                            updatedData[index].from_date = value;
                            updatedData[index].actual_time =
                              calculateActualTime(
                                updatedData[index].from_date,
                                updatedData[index].to_date,
                                updatedData[index].from_time,
                                updatedData[index].to_time
                              );
                            setRegularizeTimeData(updatedData); // Assuming you are using state to manage the data
                          };

                          const handleToDateChange = (index, value) => {
                            const updatedData = [...regularizeTimeData];
                            updatedData[index].to_date = value;
                            // Calculate or set the 'actual_time' based on your logic here
                            updatedData[index].actual_time =
                              calculateActualTime(
                                updatedData[index].from_date,
                                updatedData[index].to_date,
                                updatedData[index].from_time,
                                updatedData[index].to_time
                              );
                            setRegularizeTimeData(updatedData); // Assuming you are using state to manage the data
                          };

                          const handleFromTimeChange = (index, value) => {
                            const updatedData = [...regularizeTimeData];
                            updatedData[index].from_time = value;
                            // Calculate or set the 'actual_time' based on your logic here
                            updatedData[index].actual_time =
                              calculateActualTime(
                                updatedData[index].from_date,
                                updatedData[index].to_date,
                                updatedData[index].from_time,
                                updatedData[index].to_time
                              );
                            setRegularizeTimeData(updatedData); // Assuming you are using state to manage the data
                          };

                          const handleToTimeChange = (index, value) => {
                            const updatedData = [...regularizeTimeData];
                            updatedData[index].to_time = value;
                            // Calculate or set the 'actual_time' based on your logic here
                            updatedData[index].actual_time =
                              calculateActualTime(
                                updatedData[index].from_date,
                                updatedData[index].to_date,
                                updatedData[index].from_time,
                                updatedData[index].to_time
                              );
                            setRegularizeTimeData(updatedData); // Assuming you are using state to manage the data
                          };

                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  name={`from_date[${index}]`}
                                  min={basketStartDate}
                                  max={formattedDate}
                                  value={row.from_date}
                                  onChange={(e) =>
                                    handleFromDateChange(
                                      index,
                                      e.target.value,
                                      "from_date"
                                    )
                                  }
                                  required
                                  readOnly={
                                    row.status != "REJECTED" &&
                                    !row.isAddingNewRow
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  name={`to_date[${index}]`}
                                  min={fromDate[index]}
                                  max={formattedDate}
                                  value={row.to_date}
                                  onChange={(e) =>
                                    handleToDateChange(
                                      index,
                                      e.target.value,
                                      "to_date"
                                    )
                                  }
                                  readOnly={
                                    row.status != "REJECTED" &&
                                    !row.isAddingNewRow
                                  }
                                  required
                                />
                              </td>

                              <td>
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  name={`from_time[${index}]`}
                                  value={row.from_time}
                                  onChange={(e) =>
                                    handleFromTimeChange(index, e.target.value)
                                  }
                                  readOnly={
                                    row.status != "REJECTED" &&
                                    !row.isAddingNewRow
                                  }
                                  required
                                />
                                <i className="icofont-clock"></i>
                              </td>
                              <td>
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  name={`to_time[${index}]`}
                                  value={row.to_time}
                                  onChange={(e) =>
                                    handleToTimeChange(index, e.target.value)
                                  }
                                  required
                                  readOnly={
                                    row.status != "REJECTED" &&
                                    !row.isAddingNewRow
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm-2"
                                  name={`actual_time[${index}]`}
                                  style={{ width: "5rem", height: 32 }}
                                  value={
                                    row.actual_time &&
                                    row.actual_time !== "NaN:NaN"
                                      ? row.actual_time
                                      : row.total_time || "00:00"
                                  }
                                  required
                                  readOnly={
                                    row.status != "REJECTED" &&
                                    !row.isAddingNewRow
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  title={remark && remark ? remark : ""}
                                  type="text"
                                  className="form-control form-control-sm"
                                  name={`remark[${index}]`}
                                  value={row.remark}
                                  onChange={(e) => handleRemarkChange(e, index)} // Assuming you have a function to handle remark changes
                                  required
                                  readOnly={
                                    row.status != "REJECTED" &&
                                    !row.isAddingNewRow
                                  }
                                />
                              </td>

                              <td>
                                {index + 1 === 1 && (
                                  <button
                                    onClick={addRoww}
                                    className="btn btn-primary"
                                    style={{ backgroundColor: "#484C7F" }}
                                  >
                                    <i className="icofont-plus-circle"></i>
                                  </button>
                                )}
                                {index + 1 > 1 && (
                                  <button
                                    className="mr10 mr-1 btn btn-danger"
                                    onClick={(row) => handleRemoveClickk(index)}
                                  >
                                    <i className="icofont-ui-delete"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </>
                  ) : (
                    <>
                      {rows.map((row, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                name={`from_date[${index}]`}
                                min={basketStartDate}
                                max={formattedDate}
                                value={row.from_date}
                                onChange={(e) =>
                                  handleDateChange(
                                    index,
                                    "from_date",
                                    e.target.value,
                                    row.from_time
                                  )
                                }
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                name={`to_date[${index}]`}
                                min={fromDate[index]}
                                max={formattedDate}
                                value={row.to_date}
                                onChange={(e) =>
                                  handleDateChange(
                                    index,
                                    "to_date",
                                    e.target.value,
                                    row.from_time,
                                    row.to_time
                                  )
                                }
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                name={`from_time[${index}]`}
                                value={row.from_time}
                                onChange={(e) =>
                                  handleActualTimeChange(
                                    index,
                                    e.target.value,
                                    row.to_time
                                  )
                                }
                                required
                              />
                              <i className="icofont-clock"></i>
                            </td>

                            <td>
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                name={`to_time[${index}]`}
                                value={row.to_time}
                                onChange={(e) =>
                                  handleActualTimeChange(
                                    index,
                                    row.from_time,
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm-2"
                                name={`actual_time[${index}]`}
                                style={{ width: "5rem", height: 32 }}
                                value={row.actual_time}
                                required
                              />
                            </td>

                            <td>
                              <input
                                title={remark && remark ? remark : ""}
                                type="text"
                                className="form-control form-control-sm"
                                name={`remark[${index}]`}
                                defaultValue={row && row.remark}
                                required
                              />
                            </td>

                            <td>
                              {index + 1 == 1 && (
                                <button
                                  onClick={addRow}
                                  className="btn btn-primary"
                                  style={{ backgroundColor: "#484C7F" }}
                                >
                                  <i className="icofont-plus-circle"></i>
                                </button>
                              )}

                              {index + 1 > 1 && (
                                <button
                                  className="mr10 mr-1 btn btn-danger"
                                  onClick={() => handleRemoveClick()}
                                >
                                  <i className="icofont-ui-delete"></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              style={{ backgroundColor: "#484C7F" }}
            >
              Submit
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default RequestModal;

// created by Asmita Margaje
