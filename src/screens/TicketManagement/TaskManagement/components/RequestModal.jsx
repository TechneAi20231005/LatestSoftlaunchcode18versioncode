// // created by Asmita Margaje

import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import Alert from '../../../../components/Common/Alert';

import { getRegularizationTimeData } from '../../../../services/TicketService/TaskService';

import { useDispatch } from 'react-redux';

import { postTimeRegularizationData } from '../../BasketManagement/Slices/TimeRegularizationAction';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';
const RequestModal = (props) => {
  const [notify, setNotify] = useState(null);

  const basketStartDate = props.date;

  const timeDifference = '';
  const dispatch = useDispatch();

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  var ticket_id = props.data.ticket_id;
  var ticket_basket_id = props.data.ticket_basket_id;
  var ticket_task_id = props.data.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleFirstCheckboxChange = (e) => {
    if (e) {
      if (e.target.checked) {
        handleSecondCheckboxChange({ target: { checked: false } });
      }
    }
  };

  const handleSecondCheckboxChange = (e) => {
    if (e) {
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
        actual_time: null
      }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotify(null);

    const data = new FormData(e.target);
    data?.append('scheduled_time', props.data.task_hours);
    dispatch(postTimeRegularizationData(data)).then((res) => {
      if (res?.payload?.data?.status === 1) {
        setNotify({ type: 'success', message: res?.payload?.data?.message });
        setTimeout(() => {
          props.close();
          props.taskData();
        }, 1000);
      } else {
        setNotify({ type: 'danger', message: res?.payload?.data?.message });
      }
    });
  };

  const handleRemoveClick = (index) => {
    const list = [...rows];
    list.splice(index, 1);
    setRows(list);
  };

  const remark = null;

  const [regularizeTimeData, setRegularizeTimeData] = useState([]);

  const loadData = () => {
    setIsLoading(null);
    setIsLoading(true);
    new getRegularizationTimeData(props.data.ticket_id, props.data.id).then(
      (res) => {
        if (res.status === 200) {
          setIsLoading(false);
          if (res.data.data) {
            setRegularizeTimeData(res.data.data);
          }
        }
      }
    );
  };
  useEffect(() => {
    const updatedRows = rows.map((row) => ({
      ...row,
      actual_time: timeDifference
    }));
    setRows(updatedRows);
  }, [timeDifference]);

  useEffect(() => {}, []);

  useEffect(() => {
    loadData();
  }, []);

  const [rows, setRows] = useState([
    {
      from_date: '',
      to_date: '',
      from_time: '',
      to_time: '',
      actual_time: '',
      remark: ''
    }
    // Add more rows as needed
  ]);

  const calculateTimeDifference = (fromDate, toDate, fromTime, toTime) => {
    if (fromDate && toDate && fromTime && toTime) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      // Extract hours and minutes from the time strings
      const fromHours = Number(fromTime.split(':')[0]);
      const fromMinutes = Number(fromTime.split(':')[1]);
      const toHours = Number(toTime.split(':')[0]);
      const toMinutes = Number(toTime.split(':')[1]);

      fromDateObj.setHours(fromHours, fromMinutes);
      toDateObj.setHours(toHours, toMinutes);

      // Calculate the time difference in milliseconds
      const timeDiffMs = toDateObj - fromDateObj;

      // Ensure the time difference is positive
      const positiveTimeDiffMs = Math.abs(timeDiffMs);

      const timeDiffMinutes = Math.floor(positiveTimeDiffMs / (1000 * 60));
      const hours = Math.floor(timeDiffMinutes / 60);
      const minutes = (timeDiffMinutes % 60).toString().padStart(2, '0');

      return `${hours}:${minutes}`;
    }

    return '';
  };

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  // Format hours and minutes to always have two digits
  const formattedHours = currentHours.toString().padStart(2, '0');
  const formattedMinutes = currentMinutes.toString().padStart(2, '0');

  // Combine formatted hours and minutes
  const currentTimeFormatted = `${formattedHours}:${formattedMinutes}`;

  const handleActualTimeChange = (index, fromTime, toTime) => {
    const fromDate = rows[index].from_date;
    const toDate = rows[index].to_date;

    // Get the current date formatted similarly to fromDate and toDate
    const currentDate = new Date().toISOString().split('T')[0]; // Assuming the format is 'YYYY-MM-DD'

    if (fromDate === currentDate && fromTime > currentTimeFormatted) {
      alert('From time cannot be a future time.');
      return;
    }

    if (toDate === currentDate && toTime > currentTimeFormatted) {
      alert('To time cannot be a future time.');
      return;
    }

    if (toTime?.length > 0 && toTime < fromTime) {
      alert('To time cannot be earlier than from time.');
      return;
    }

    const actualTime = calculateTimeDifference(
      fromDate,
      toDate,
      fromTime,
      toTime
    );

    // Convert actual time to hours and minutes
    const [hours, minutes] = actualTime.split(':').map(Number);

    // Convert actual time to a numerical value for comparison
    const actualTimeValue = hours * 60 + minutes;

    // Check if actual time is greater than 12:00 hours
    if (actualTimeValue > 12 * 60) {
      // Alert if actual time exceeds 12:00 hours
      alert('Actual time is greater than 12:00 hours.');
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

  const [fromDate, setFromDate] = useState(''); // State for from_date

  const handleDateChange = (index, dateType, value, fromTime, toTime) => {
    if (dateType === 'from_date') {
      setFromDate((prevFromDates) => ({
        ...prevFromDates,
        [index]: value
      }));
    } else if (dateType === 'to_date') {
    }

    setRows((prev) => {
      const updatedRows = prev.map((data, rowIndex) => {
        if (rowIndex === index) {
          return {
            ...data,
            [dateType]: value,
            from_time: fromTime,
            to_time: toTime
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
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
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
      from_date: '', // Initialize with default values
      to_date: '',
      from_time: '',
      to_time: '',
      actual_time: '', // You may set a default value if needed
      isAddingNewRow: true,
      remark: ''
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

  const handleRemarkChangee = (event, index) => {
    const { value } = event.target;
    const newRows = [...rows];
    newRows[index].remark = value;
    setRows(newRows);
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
        {notify && <Alert alertData={notify} />}

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
                  style={{ fontWeight: 'bold', width: '300px' }}
                >{`Ticket ID: ${props.data.ticket_id_name}`}</h6>
              </div>
              <div className="col-md ">
                <h6 style={{ fontWeight: 'bold', width: '580px' }}>{`Task Name:
  ${props.data.task_name}`}</h6>
              </div>

              <div className="col-md">
                <h6
                  style={{ fontWeight: 'bold' }}
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
              {isLoading === true ? (
                <TableLoadingSkelton />
              ) : (
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
                      {regularizeTimeData && regularizeTimeData.length > 0 && (
                        <th className="text-center"> Status</th>
                      )}
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
                              if (dateType === 'from_date') {
                                setFromDate((prevFromDates) => ({
                                  ...prevFromDates,
                                  [index]: value
                                }));
                              } else if (dateType === 'to_date') {
                              }

                              const updatedData = [...regularizeTimeData];
                              updatedData[index].from_date = value;
                              const actualTime = calculateActualTime(
                                updatedData[index].from_date,
                                updatedData[index].to_date,
                                updatedData[index].from_time,
                                updatedData[index].to_time
                              );

                              updatedData[index].actual_time = actualTime;
                              setRegularizeTimeData(updatedData);
                            };

                            const handleToDateChange = (index, value) => {
                              const updatedData = [...regularizeTimeData];
                              updatedData[index].to_date = value;
                              // Calculate actual time
                              const actualTime = calculateActualTime(
                                updatedData[index].from_date,
                                updatedData[index].to_date,
                                updatedData[index].from_time,
                                updatedData[index].to_time
                              );
                              const [hours, minutes] = actualTime
                                .split(':')
                                .map(Number);
                              const actualTimeValue = hours * 60 + minutes;

                              updatedData[index].actual_time = actualTime;
                              setRegularizeTimeData(updatedData);
                            };

                            const handleFromTimeChange = (index, value) => {
                              const updatedData = [...regularizeTimeData];
                              const fromDate = updatedData[index].from_date;

                              const currentDate = new Date()
                                .toISOString()
                                .split('T')[0]; // Assuming the format is 'YYYY-MM-DD'

                              updatedData[index].from_time = value;

                              if (
                                fromDate === currentDate &&
                                value > currentTimeFormatted
                              ) {
                                alert('From time cannot be a future time.');
                                return;
                              }

                              // Calculate actual time
                              const actualTime = calculateActualTime(
                                updatedData[index].from_date,
                                updatedData[index].to_date,
                                updatedData[index].from_time,
                                updatedData[index].to_time
                              );

                              updatedData[index].actual_time = actualTime;
                              setRegularizeTimeData(updatedData);
                            };

                            const handleToTimeChange = (index, value) => {
                              const updatedData = [...regularizeTimeData];
                              const toDate = updatedData[index].to_date;

                              const currentDate = new Date()
                                .toISOString()
                                .split('T')[0]; // Assuming the format is 'YYYY-MM-DD'

                              updatedData[index].to_time = value;

                              if (
                                toDate === currentDate &&
                                value > currentTimeFormatted
                              ) {
                                alert('To time cannot be a future time.');
                                return;
                              }

                              const fromTime = updatedData[index].from_time;
                              if (fromTime && value < fromTime) {
                                alert(
                                  'To time cannot be earlier than from time.'
                                );
                                return;
                              }

                              const actualTime = calculateActualTime(
                                updatedData[index].from_date,
                                updatedData[index].to_date,
                                updatedData[index].from_time,
                                updatedData[index].to_time
                              );

                              const [hours, minutes] = actualTime
                                .split(':')
                                .map(Number);
                              const actualTimeValue = hours * 60 + minutes;
                              if (actualTimeValue > 12 * 60) {
                                alert(
                                  'Actual time is greater than 12:00 hours.'
                                );
                                return;
                              }

                              updatedData[index].actual_time = actualTime;
                              setRegularizeTimeData(updatedData);
                            };

                            return (
                              <tr
                                key={index}
                                className={
                                  row.is_active === 0 ? 'strikethrough' : ''
                                }
                              >
                                <td>{index + 1}</td>
                                <td
                                  className={
                                    row.is_active === 0 ? 'strikethrough' : ''
                                  }
                                >
                                  <input
                                    type={row.is_active === 0 ? 'text' : 'date'}
                                    className={`form-control form-control-sm ${
                                      row.is_active === 0 ? 'strikethrough' : ''
                                    }`}
                                    name={`from_date[${index}]`}
                                    min={basketStartDate}
                                    max={formattedDate}
                                    value={row.from_date}
                                    onChange={(e) =>
                                      handleFromDateChange(
                                        index,
                                        e.target.value,
                                        'from_date'
                                      )
                                    }
                                    required
                                    disabled={row.is_regularized === 'YES'}
                                  />
                                </td>

                                <td>
                                  <input
                                    type={row.is_active === 0 ? 'text' : 'date'}
                                    className={`form-control form-control-sm ${
                                      row.is_active === 0 ? 'strikethrough' : ''
                                    }`}
                                    name={`to_date[${index}]`}
                                    min={fromDate[index]}
                                    max={formattedDate}
                                    value={row.to_date}
                                    onChange={(e) =>
                                      handleToDateChange(
                                        index,
                                        e.target.value,
                                        'to_date'
                                      )
                                    }
                                    disabled={row.is_regularized === 'YES'}
                                    required
                                  />
                                </td>

                                <td>
                                  <input
                                    type={row.is_active === 0 ? 'text' : 'time'}
                                    className={`form-control form-control-sm${
                                      row.is_active === 0 ? 'strikethrough' : ''
                                    }`}
                                    name={`from_time[${index}]`}
                                    value={row.from_time}
                                    onChange={(e) =>
                                      handleFromTimeChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    disabled={row.is_regularized === 'YES'}
                                    required
                                  />
                                  <i className="icofont-clock"></i>
                                </td>
                                <td>
                                  <input
                                    type={row.is_active === 0 ? 'text' : 'time'}
                                    className="form-control form-control-sm"
                                    name={`to_time[${index}]`}
                                    value={row.to_time}
                                    onChange={(e) =>
                                      handleToTimeChange(index, e.target.value)
                                    }
                                    required
                                    disabled={row.is_regularized === 'YES'}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm-2"
                                    name={`actual_time[${index}]`}
                                    style={{ width: '5rem', height: 32 }}
                                    value={
                                      row.actual_time &&
                                      row.actual_time !== 'NaN:NaN'
                                        ? row.actual_time
                                        : row.total_time || '00:00'
                                    }
                                    required
                                    disabled={row.is_regularized === 'YES'}
                                  />
                                </td>
                                <td>
                                  <input
                                    title={remark && remark ? remark : ''}
                                    type="text"
                                    className="form-control form-control-sm"
                                    name={`remark[${index}]`}
                                    value={row.remark}
                                    onChange={(e) =>
                                      handleRemarkChange(e, index)
                                    }
                                    required
                                    disabled={row.is_regularized === 'YES'}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="status"
                                    defaultValue={row.status}
                                    disabled
                                    required
                                  />
                                  <i className="icofont-clock"></i>
                                </td>

                                <td>
                                  {index + 1 === 1 && (
                                    <button
                                      onClick={addRoww}
                                      className="btn btn-primary"
                                      style={{ backgroundColor: '#484C7F' }}
                                      disabled={row.status === 'PENDING'}
                                    >
                                      <i className="icofont-plus-circle"></i>
                                    </button>
                                  )}
                                  {index + 1 > 1 && (
                                    <button
                                      className="mr10 mr-1 btn btn-danger"
                                      onClick={(row) =>
                                        handleRemoveClickk(index)
                                      }
                                      disabled={
                                        row.status === 'REJECTED' ||
                                        row.status === 'APPROVED'
                                      }
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
                                      'from_date',
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
                                      'to_date',
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
                                  style={{ width: '5rem', height: 32 }}
                                  value={row.actual_time}
                                  required
                                />
                              </td>

                              <td>
                                <input
                                  title={remark && remark ? remark : ''}
                                  type="text"
                                  className="form-control form-control-sm"
                                  name={`remark[${index}]`}
                                  value={row && row.remark}
                                  required
                                  onChange={(event) =>
                                    handleRemarkChangee(event, index)
                                  }
                                />
                              </td>

                              <td>
                                {index + 1 === 1 && (
                                  <button
                                    onClick={addRow}
                                    className="btn btn-primary"
                                    style={{ backgroundColor: '#484C7F' }}
                                  >
                                    <i className="icofont-plus-circle"></i>
                                  </button>
                                )}

                                {index + 1 > 1 && (
                                  <button
                                    className="mr10 mr-1 btn btn-danger"
                                    onClick={() => handleRemoveClick(index)}
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
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              style={{ backgroundColor: '#484C7F' }}
              disabled={
                regularizeTimeData?.length > 0 &&
                regularizeTimeData?.filter((d) => d?.status === 'PENDING')
                  ?.length > 0
              }
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
