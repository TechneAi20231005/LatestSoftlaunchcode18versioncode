import React, { useEffect, useState, useRef } from "react";
import { Modal, Spinner, Table } from "react-bootstrap";
import ErrorLogService from "../../../../services/ErrorLogService";
import Alert from "../../../../components/Common/Alert";
import {
  getRegularizationTime,
  changeStatusRegularizationTime,
} from "../../../../services/TicketService/TaskService";

const TimeRegularizationHistory = (props) => {
  const [notify, setNotify] = useState(null);
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef();

  // Function to filter rquestData based on search terms

  const handleClearSearchData = (e) => {
    setSearchTerm(""); // Clear search term by updating state
  };

  const ticketId = props.ticketId;

  const rquestData = props?.data;
  const loadData = () => {
    // Assuming getRegularizationTime is a function that returns a Promise
    new getRegularizationTime(ticketId)
      .then((res) => {
        if (res.data.data) {
          // Process the data
          const temp = res.data.data.map((d) => ({
            id: d.id,
            created_by_name: d.created_by_name,
            from_date: d.from_date,
            to_date: d.to_date,
            from_time: d.from_time,
            to_time: d.to_time,
            remark: d.remark,
            is_checked: 0,
            regularization_time_status: d.regularization_time_status,
            task_name: d.task_name,
            ticket_id_name: d.ticket_id_name,
            actual_time: d.actual_time,
            task_hours: d.task_hours,
            scheduled_time: d.scheduled_time,
            status: d.status_remark,
          }));

          // Assuming setDataa is a function to set the state
          setDataa(temp);
        } else {
        }
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message to the user
      });
  };

  const [selectAll, setSelectAll] = useState(false);

  // Function to handle Select All checkbox
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    // Logic to toggle all checkboxes in rows based on selectAll state
    const checkboxes = document.getElementsByName("status[]");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !selectAll;
    });
  };

  const handleInputChange = (e, i) => {
    setData(
      rquestData.map((d, index) =>
        index === i ? { ...d, is_checked: e.target.checked == true ? 1 : 0 } : d
      )
    );
  };

  const handleForm = (type) => {
    setNotify(null);
    const formData = { type: type, payload: data };
    const check = formData.payload.filter((d) => {
      return d.is_checked == 1;
    });

    if (check.length > 0) {
      new changeStatusRegularizationTime(formData).then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setNotify({ type: "success", message: res.data.message });

            new getRegularizationTime(props.ticketId).then((res) => {
              if (res.data.data && res.data.data.length > 0) {
                var temp = [];
                setData(null);
                res.data.data.forEach((d) => {
                  temp.push({
                    id: d.id,
                    created_by_name: d.created_by_name,
                    from_date: d.from_date,
                    to_date: d.to_date,
                    from_time: d.from_time,
                    to_time: d.to_time,
                    status: d.status_remark,
                    is_checked: 0,
                    remark: d.remark,
                    regularization_time_status: d.regularization_time_status,
                    task_name: d.task_name,
                    ticket_id_name: d.ticket_id_name,
                    actual_time: d.actual_time,
                    task_hours: d.task_hours,
                    scheduled_time: d.scheduled_time,
                  });
                });
                setData(temp);
              }
            });
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        }
      });
    } else {
      setNotify({
        type: "danger",
        message: "Please select the checkbox against request !!!",
      });
    }
  };

  const filteredData = rquestData.filter(
    (x) =>
      x.ticket_id_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      x.task_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadData();
  }, []);

  return (
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
          Time Regularization History
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className="row">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Ticket ID or Task Name...."
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchRef}
                value={searchTerm}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-sm btn-warning text-white mr-2"
                type="button"
                // value={searchTerm}
                style={{ fontWeight: "600" }}
              >
                <i className="icofont-search-1 "></i> Search
              </button>
              <button
                className="btn btn-sm btn-info text-white"
                type="button"
                onClick={(e) => {
                  handleClearSearchData(e);
                }}
                style={{ fontWeight: "600" }}
              >
                <i className="icofont-refresh text-white"></i> Reset
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table
              className="table table-bordered mt-3 table-responsive"
              id="tab_logic"
            >
              <thead>
                <tr>
                  <th className="text-center"> Sr. No. </th>

                  <th className="text-center"> Ticket Id </th>
                  <th className="text-center"> Task Name </th>
                  <th className="text-center"> Requested By </th>
                  <th className="text-center"> From Date </th>
                  <th className="text-center"> To Date </th>
                  <th className="text-center"> Scheduled Time </th>
                  <th className="text-center"> From Time </th>
                  <th className="text-center"> To Time </th>
                  <th className="text-center"> Actual Time </th>
                  <th className="text-center"> Remark </th>
                  <th className="text-center"> Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData &&
                  filteredData?.map((x, i) => {
                    return (
                      <tr id={`addr_${i}`} key={i}>
                        <td>{i + 1}</td>

                        <td title={x.ticket_id_name}>{x.ticket_id_name}</td>
                        <td title={x.task_name}>{x.task_name}</td>
                        <td>{x.created_by_name}</td>
                        <td>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            id={`from_date${i}`}
                            name="from_date[]"
                            value={x.from_date}
                            required
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            id={`to_date${i}`}
                            name="to_date[]"
                            value={x.to_date}
                            required
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            id={`scheduled_time${i}`}
                            name="scheduled_time[]"
                            value={x.scheduled_time}
                            required
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            id={`from_time${i}`}
                            name="from_time[]"
                            value={x.from_time}
                            required
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            id={`to_time${i}`}
                            name="to_time[]"
                            value={x.to_time}
                            required
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            style={{ width: "100px" }}
                            id={`actual_time${i}`}
                            name="actual_time[]"
                            value={x.actual_time}
                            required
                            readOnly={true}
                          />
                        </td>
                        <td title={x.remark}>
                          <input
                            type="text"
                            style={{ width: "100px" }}
                            className="form-control form-control-sm"
                            id={`remark${i}`}
                            name="remark[]"
                            value={x.remark}
                            required
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id={`status${i}`}
                            name="status[]"
                            style={{ width: "100px" }}
                            value={x.status}
                            required
                            readOnly={true}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default TimeRegularizationHistory;
