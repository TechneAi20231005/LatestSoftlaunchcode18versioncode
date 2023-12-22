import React, { useEffect, useState, useRef } from "react";
import { Modal, Table } from "react-bootstrap";
import ErrorLogService from "../../../../services/ErrorLogService";
import Alert from "../../../../components/Common/Alert";
// import { requestRegularizationTime } from "../../../../services/TicketService/TaskService";
import { taskRequestRegularizationTime } from "../../../../services/TicketService/TaskService";
import { getRegularizationTime, changeStatusRegularizationTime } from '../../../../services/TicketService/TaskService';

const TaskRegularizationModal = (props) => {

  const [notify, setNotify] = useState(null);
  const [inputList, setInputList] = useState([
    {
      // date: "",
      from_time: "00:00",
      to_time: "00:00",
      from_date: null,
      to_date: null
    },
  ]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState(null);

  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [timeDifference, setTimeDifference] = useState('');



  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;


  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index] = { ...list[index], [name]: value };

    const fromDateList = list.map(item => item[`from_date[${index}]`]);
    const toDateList = list.map(item => item[`to_date[${index}]`]);

    const payload = {
      from_date: fromDateList.filter(date => date !== undefined),
      to_date: toDateList.filter(date => date !== undefined),
      // Add other relevant values from the component state or props
      // Example: fromDate: date,
      //          fromTime: time,
      //          ...
    };

    if (name.includes("from_date")) {
      setDate(value);
    }
    if (name.includes("from_time")) {
      setTime(value);
    }

    setInputList(list);
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




  const [rows, setRows] = useState([{ increaseChecked: false, decreaseChecked: false, value: 0, actual_time: null }]);
  const addRow = () => {
    setRows(prevRows => [...prevRows, { increaseChecked: false, decreaseChecked: false, value: 0, actual_time: null }]);
  };




  // Assuming you are using React and have a state variable called 'values'




  const calculateTimeDifference = () => {
    // Your existing code for calculating the time difference goes here
    if (fromTime && toTime) {
      const fromDateTime = new Date(`2000-01-01T${fromTime}`);
      const toDateTime = new Date(`2000-01-01T${toTime}`);

      const timeDiffMs = toDateTime - fromDateTime;
      const timeDiffMinutes = Math.floor(timeDiffMs / (1000 * 60));

      let hours = Math.floor(timeDiffMinutes / 60);
      let minutes = timeDiffMinutes % 60;

      if (hours === 24 && minutes === 0) {
        hours = 0;
        minutes = 0;
      }

      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      setTimeDifference(formattedTime); // Assuming setTimeDifference is a state setter function

      return formattedTime;
    }

    return '';
  };

  const handleActualTimeChange = (index, fromTime, toTime) => {
    const calculateTimeDifference = (fromTime, toTime) => {
      if (fromTime && toTime) {
        const fromDateTime = new Date(`2000-01-01T${fromTime}`);
        const toDateTime = new Date(`2000-01-01T${toTime}`);

        const timeDiffMs = toDateTime - fromDateTime;
        const timeDiffMinutes = Math.floor(timeDiffMs / (1000 * 60));

        let hours = Math.floor(timeDiffMinutes / 60);
        let minutes = timeDiffMinutes % 60;

        if (hours === 24 && minutes === 0) {
          hours = 0;
          minutes = 0;
        }

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        return formattedTime;
      }

      return '';
    };

    setRows((prev) => {
      return prev.map((data, rowIndex) => {
        if (rowIndex === index) {
          const newData = { ...data }; // Create a new copy of the row data
          newData.from_time = fromTime; // Update the from_time value
          newData.to_time = toTime; // Update the to_time value
          newData.actual_time = calculateTimeDifference(fromTime, toTime); // Calculate and set the actual_time
          return newData;
        } else {
          return data;
        }
      });
    });
  };




  const handleRowInputChange = (e, rowIndex) => {
    const { name, value, type, checked } = e.target;
    const updatedRows = rows.map((row, index) => {
      if (index === rowIndex) {
        if (type === "checkbox") {
          return { ...row, [name]: checked };
        } else if (name === "actual_time[]") {
          const formattedTime = calculateTimeDifference(value);
          return { ...row, [name]: value, timeDifference: formattedTime };
        } else {
          return { ...row, [name]: value };
        }
      } else {
        return row;
      }
    });

    setRows(updatedRows);
    setDate(e.target.value)
  };






  const handleIncreaseChange = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].increaseChecked = true;
    updatedRows[index].decreaseChecked = false;
    setRows(updatedRows);
  };

  const handleActualChange = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].actual_time = timeDifference;
    setRows(updatedRows);
  };

  const handleDecreaseChange = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].decreaseChecked = true;
    updatedRows[index].increaseChecked = false;
    setRows(updatedRows);
  };






  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setNotify(null);
  //   const data = new FormData(e.target);
  //   data.append('user_id', localStorage.getItem("id"));
  //   // data.append('actual_total_time',"00:30");        

  //   new taskRequestRegularizationTime(data).then((res) => {
  //     if (res.status === 200) {
  //       if (res.data.status === 1) {
  //         setNotify({ type: "success", message: res.data.message });
  //         // window.location.reload(false)
  //         props.hide();
  //         document.getElementById("requestForm").reset();
  //       } else {
  //         setNotify({ type: "danger", message: res.data.message });
  //       }
  //     }

  //   });
  // };

  // created by Asmita Margaje

  const handleSubmit = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Clear any existing notifications
    setNotify(null);

    // Create a FormData object from the form element 'e.target'
    const data = new FormData(e.target);

    // Append the user_id from localStorage to the form data
    data.append('user_id', localStorage.getItem("id"));

    // Create a request for task regularization time using 'data'
    new taskRequestRegularizationTime(data).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          // If the request was successful, set a success notification
          setNotify({ type: "success", message: res.data.message });

          // Hide the form (assuming 'props.hide()' does that)
          props.hide();

          // Reset the form with id 'requestForm'
          document.getElementById("requestForm").reset();
        } else {
          // If the request was not successful, set an error notification
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    });
};




  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...rows];
    list.splice(index, 1);
    setRows(list);
  };

  // handle click event of the Add button
  const[remark, setRemark] = useState()
  const handleAddClick = (e) => {
    setRemark(e.target.value)
    // setInputList([...inputList, { name: null, id: null }]);
  };
  const [approveData, setApproveData] = useState()

  const getApproveData = () => {


    new getRegularizationTime(props.data.ticket_id).then(res => {

      if (res.data.data) {
        var temp = [];
        setApproveData(null);
        res.data.data.forEach(d => {
          temp.push({
            'id': d.id,
            'created_by_name': d.created_by_name,
            'from_date': d.from_date,
            'to_date': d.to_date,
            'from_time': d.from_time,
            'to_time': d.to_time,
            'status': d.status,
            'remark': d.remark,
            'is_checked': 0,
            'regularization_time_status': d.regularization_time_status,
            'task_name': d.task_name,
            'ticket_id_name': d.ticket_id_name,
            'ticket_task_id': d.ticket_task_id

          });
        })
        setApproveData(temp);
      }
    })

  }


  useEffect(() => {
    calculateTimeDifference();
  }, [fromTime, toTime, rows]);



  useEffect(() => {
    // Code to update the actual_time value automatically
    const updatedRows = rows.map(row => ({
      ...row,
      actual_time: timeDifference
    }));
    setRows(updatedRows);
  }, [timeDifference]);
const[fromDate, setFromDate] =useState()
const handleFromDate = (e) => {
setFromDate(e.target.value)
}
  useEffect(() => {
    setNotify(null);
    getApproveData()

  }, []);


  return (
    <div>
      {notify && <Alert alertData={notify} />}
      <Modal
        show={props.show}
        onHide={props.hide}
        dialogClassName="modal-100w"
        size="xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header 
        closeButton
        >
          <Modal.Title id="example-custom-modal-styling-title">
            <span className="fw-bold" style={{textAlign:'center'}}>Task Regularization</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Header>
          <Modal.Title id="example-custom-modal-styling-title">
            <div className="row">
              {/* <div className="col">
                <h6>Task Name</h6>
              </div> */}                    
              <div className="col-md" >
                <h6 style={{ fontWeight: 'bold', width: '300px' }}>{`Ticket ID: ${props.data.ticket_id_name}`}</h6>
              </div>
              <div className="col-md ">
                <h6 style={{ fontWeight: 'bold', width: '580px' }}>{`Task Name:
                ${props.data.task_name}`}</h6>
              </div>

              <div className="col-md">
                <h6 style={{ fontWeight: 'bold' }}>{`Scheduled Time: ${props.data.task_hours}`}</h6>
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
                    <th className="text-center"> Task Name </th>

                    <th className="text-center"> From Date </th>
                    <th className="text-center"> To Date </th>
                    {/* <th className="text-center"> From Time </th> */}
                    {/* <th className="text-center"> To Time </th> */}
                    <th className="text-center"> Task Hours </th>


                    {/* <th className="text-center"> Increase Time </th> */}
                    {/* <th className="text-center"> Decrease Time </th> */}
                    <th className="text-center"> Remark </th>
                    <th className="text-center"> Action</th>
                  </tr>
                </thead>
                <tbody>



                  {rows.map((row, index) => (
                    <tr key={index}>
                      {/* ... */}
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name={`task_name[${index}]`}
                          // defaultValue={props.data.from_date ? props.data.from_date : props.data.start_date}
                          // max={props.allData.ticketStartDate}
                          // onChange={(e)=>handleFromDate(e)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          name={`from_date[${index}]`}
                          defaultValue={props.data.from_date ? props.data.from_date : props.data.start_date}
                          // max={props.allData.ticketStartDate}
                          onChange={(e)=>handleFromDate(e)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          name={`to_date[${index}]`}

                          defaultValue={props.data.to_date ? props.data.to_date : props.data.end_date}
                          min={fromDate}
                          // max={props.allData.ticketStartDate}
                          onChange={(e) => handleRowInputChange(e, index)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name={`task_hours[${index}]`}
                          required
                          defaultValue={
                            props.data.task_hours ? props.data.task_hours : "00:00"
                          }                        />

                      </td>
                     
                      <td >
                        <input
                        title={remark && remark ?remark : ""}
                          type="text"
                          className="form-control form-control-sm"
                          name="remark[]"
                          onChange={e=> handleAddClick(e)}
                          defaultValue={props.data.remark}
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
                  ))}

                </tbody>
              </table>
              {/* {props && JSON.stringify(props.allData.ticketStartDate)} */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              style={{ backgroundColor: "#484C7F" }}
              disabled={props.data.is_regularized === "YES" ? true : false}

            >
              Submit
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default TaskRegularizationModal;