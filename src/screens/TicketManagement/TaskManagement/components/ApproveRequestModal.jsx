import React, { useEffect, useState, useRef } from "react";
import { Modal, Spinner, Table } from "react-bootstrap";
import ErrorLogService from "../../../../services/ErrorLogService";
import Alert from "../../../../components/Common/Alert";
import {
  getRegularizationTime,
  changeStatusRegularizationTime,
} from "../../../../services/TicketService/TaskService";

const ApproveRequestModal = (props) => {
  const [notify, setNotify] = useState(null);
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState([]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const ticketId = props.ticketId;

  const rquestData = props?.data;
  console.log("ticketId11", rquestData && rquestData.map((i) => i.from_date));
  const loadData = () => {
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    //     new getRegularizationTime(props.ticketId).then((res) => {
    //       if (res.data.data) {
    //         // setShowLoaderModal(false);
    //         console.log("res==>", res.data.data);

    //         var temp = [];
    //         // setData(null);
    //         res.data.data.forEach((d) => {
    //           temp.push({
    //             id: d.id,
    //             created_by_name: d.created_by_name,
    //             from_date: d.from_date,
    //             to_date: d.to_date,
    //             from_time: d.from_time,
    //             to_time: d.to_time,
    //             remark: d.remark,
    //             is_checked: 0,
    //             regularization_time_status: d.regularization_time_status,
    //             task_name: d.task_name,
    //             ticket_id_name: d.ticket_id_name,
    //             actual_time: d.actual_time,
    //             task_hours: d.task_hours,
    //             scheduled_time: d.scheduled_time,
    //             status: d.status_remark,
    //           });
    //         });
    //         setDataa(temp);
    //         console.log("dataee", dataa);
    //         console.log("temp", temp);
    //       }
    //     });
    //   };

    // Assuming getRegularizationTime is a function that returns a Promise
    new getRegularizationTime(ticketId)
      .then((res) => {
        if (res.data.data) {
          console.log("res==>", res.data.data);

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
        console.error("Error fetching regularization time:", error);
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

  console.log("selectAll", selectAll);

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
    console.log("data==>", data);
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

  useEffect(() => {
    loadData();
  }, []);
  {
    console.log("new2", dataa);
  }

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
          Request Regularization
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {showLoaderModal ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              minHeight: "calc(100% - 1rem)",
              margin: "0",
            }}
          >
            <div className="text-center">
              <Spinner animation="grow" variant="primary" />
              <Spinner animation="grow" variant="secondary" />
              <Spinner animation="grow" variant="success" />
              <Spinner animation="grow" variant="danger" />
              <Spinner animation="grow" variant="warning" />
              <Spinner animation="grow" variant="info" />
              <Spinner animation="grow" variant="dark" />
            </div>
          </div>
        ) : ( */}
        <>
          <div className="text-right" style={{ "text-align": "right" }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: "#484C7F" }}
              onClick={(e) => handleForm("APPROVED")}
            >
              Approve
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm text-white"
              onClick={(e) => handleForm("REJECTED")}
            >
              Reject
            </button>
          </div>
          {/* <div className="table-responsive">
            <table
              className="table table-bordered mt-3 table-responsive"
              id="tab_logic"
            >
              <thead>
                <tr>
                  <th className="text-center"> Sr. No. </th>
                  <th className="text-center"> Select </th>
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
                {console.log("ddd", data)}
                {data &&
                  data.map((x, i) => {
                    console.log("xxx", x);
                    return (
                      <tr id={`addr_${i}`} key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <input
                            type="hidden"
                            id={`status_${i}`}
                            name="id[]"
                            value={x.id}
                          />
                          <input
                            type="checkbox"
                            id={`status_${i}`}
                            name="status[]"
                            onChange={(e) => handleInputChange(e, i)}
                            checked={x.is_checked == 1}
                            disabled={x.status != "PENDING"}
                          />
                        </td>

                        <td title={x.task_name}>{x.ticket_id_name}</td>

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
                            type="text"
                            className="form-control form-control-sm"
                            id={`scheduled_time${i}`}
                            name="scheduled_time[]"
                            defaultValue={x.scheduled_time}
                            readOnly={true}
                            required
                            style={{ width: "100px" }}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            id={`from_time_${i}`}
                            name="from_time[]"
                            defaultValue={x.from_time}
                            readOnly={true}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            id={`to_time_${i}`}
                            name="to_time[]"
                            defaultValue={x.to_time}
                            readOnly={true}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-md"
                            id={`actual_time${i}`}
                            name="actual_time[]"
                            defaultValue={x.actual_time}
                            readOnly={true}
                            required
                            style={{ width: "100px" }}
                          />
                        </td>

                        <td>{x.remark}</td>
                        <td>{x.status}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div> */}
          {console.log("new", dataa)}
          <div className="table-responsive">
            <table
              className="table table-bordered mt-3 table-responsive"
              id="tab_logic"
            >
              <thead>
                <tr>
                  <th className="text-center"> Sr. No. </th>
                  {/* <th className="text-center"> Select </th>
                   */}
                  <th className="text-center">
                    <input type="checkbox" onChange={handleSelectAll} /> Select
                  </th>
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
                {rquestData &&
                  rquestData?.map((x, i) => {
                    // Log each item x in the data array for debugging
                    //   console.log("Item", x);
                    {
                      console.log("x==>", x.checked);
                    }
                    return (
                      <tr id={`addr_${i}`} key={i}>
                        <td>{i + 1}</td>

                        <td>
                          <input
                            type="hidden"
                            id={`status_${i}`}
                            name="id[]"
                            value={x.id}
                          />
                          <input
                            type="checkbox"
                            id={`status_${i}`}
                            name="status[]"
                            onChange={(e) => handleInputChange(e, i)}
                            // checked={x.is_checked === 1}
                            // defaultChecked={x.is_checked === 1}
                            disabled={x.status !== "PENDING"}
                          />
                        </td>
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
                            type="time"
                            className="form-control form-control-sm"
                            id={`actual_time${i}`}
                            name="actual_time[]"
                            value={x.actual_time}
                            required
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
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
                            value={x.status}
                            required
                            readOnly={true}
                          />
                        </td>

                        {/* Render other table cells similarly */}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
        {/* )} */}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ApproveRequestModal;

{
  /* <div className="table-responsive">
            <table
              className="table table-bordered mt-3 table-responsive"
              id="tab_logic"
            >
              <thead>
                <tr>
                  <th className="text-center"> Sr. No. </th>
                  <th className="text-center"> Select </th>
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
                {rquestData &&
                  rquestData?.map((x, i) => {
                    // Log each item x in the data array for debugging
                    //   console.log("Item", x);
                    return (
                      <tr id={`addr_${i}`} key={i}>
                        <td>{i + 1}</td>

                        <td>
                          <input
                            type="hidden"
                            id={`status_${i}`}
                            name="id[]"
                            value={x.id}
                          />
                          <input
                            type="checkbox"
                            id={`status_${i}`}
                            name="status[]"
                            onChange={(e) => handleInputChange(e, i)}
                            //   checked={x.is_checked === 1}
                            defaultChecked
                            disabled={x.status !== "PENDING"}
                          />
                        </td>
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
                            type="time"
                            className="form-control form-control-sm"
                            id={`actual_time${i}`}
                            name="actual_time[]"
                            value={x.actual_time}
                            required
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
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
                            value={x.status}
                            required
                            readOnly={true}
                          />
                        </td>

                        {/* Render other table cells similarly */
}
//             </tr>
//           );
//         })}
//     </tbody>
//   </table>
// </div> */}
