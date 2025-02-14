import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import Alert from '../../../../components/Common/Alert';
import {
  getRegularizationTime,
  changeStatusRegularizationTime
} from '../../../../services/TicketService/TaskService';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';

const ApproveRequestModal = (props) => {
  const [notify, setNotify] = useState(null);
  const [rquestData, setData] = useState(props?.data);

  const ticketId = props.ticketId;
  const NotificatinID = props.notificationId;

  const ticketIdName = props?.data && props.data[0]?.ticket_id_name;
  const loadData = () => {
    new getRegularizationTime(ticketId)

      .then((res) => {
        if (res.status === 200) {
          if (res.data.data) {
            // Process the data
            // const temp = res.data.data.map((d) => ({
            //   id: d.id,
            //   created_by_name: d.created_by_name,
            //   from_date: d.from_date,
            //   to_date: d.to_date,
            //   from_time: d.from_time,
            //   to_time: d.to_time,
            //   remark: d.remark,
            //   is_checked: 0,
            //   regularization_time_status: d.regularization_time_status,
            //   task_name: d.task_name,
            //   ticket_id_name: d.ticket_id_name,
            //   actual_time: d.actual_time,
            //   task_hours: d.task_hours,
            //   scheduled_time: d.scheduled_time,
            //   status: d.status_remark
            // }));
            // Assuming setDataa is a function to set the state
            // setDataa(temp);
          } else {
          }
        }
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message to the user
      });
  };

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    // Update the state with the new array where is_checked is set based on newSelectAll value
    const newData = rquestData.map((d) => ({
      ...d,
      is_checked: newSelectAll ? 1 : 0
    }));
    // Update the state with the new array
    setData(newData);

    // Update checkboxes to reflect the new state
    const checkboxes = document.getElementsByName('status[]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = newSelectAll;
    });
  };

  const handleInputChange = (e, i) => {
    // Clone the rquestData array
    const newData = [...rquestData];
    // Update the is_checked property of the clicked row
    newData[i].is_checked = e.target.checked ? 1 : 0;
    // Update the state with the new array
    setData(newData);
    // Update the selectAll state if needed
  };

  const handleForm = (type, notification_id) => {
    setNotify(null);
    const checkedItems = rquestData.filter((d) => d.is_checked === 1);
    const formData = {
      type: type,
      payload: checkedItems,
      notification_id: NotificatinID
    };
    const check = formData.payload.filter((d) => {
      return d.is_checked === 1;
    });
    if (check.length > 0) {
      new changeStatusRegularizationTime(formData).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setNotify({ type: 'success', message: res.data.message });
            props.hide();

            new getRegularizationTime(props.ticketId).then((res) => {
              setNotify(null);
              if (res.data.data && res.data.data.length > 0) {
                setNotify(null);

                var temp = [];
                // setData(null);
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
                    scheduled_time: d.scheduled_time
                  });
                });
                setData(temp);
              }
            });
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        }
      });
    } else {
      setNotify({
        type: 'danger',
        message: 'Please select the checkbox against request !!!'
      });
    }
  };

  useEffect(() => {
    if (props.data) {
      setData(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    loadData();
  }, [props?.data]);

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
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>Ticket ID :{ticketIdName}</div>
            <div className="text-right">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#484C7F', marginRight: '5px' }}
                onClick={(e) => handleForm('APPROVED', NotificatinID)}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm text-white"
                onClick={(e) => handleForm('REJECTED', NotificatinID)}
              >
                Reject
              </button>
            </div>
          </div>

          <div className="table-responsive">
            {props.isLoading === true ? (
              <TableLoadingSkelton />
            ) : rquestData?.length > 0 ? (
              <>
                <table
                  className="table table-bordered mt-3 table-responsive"
                  id="tab_logic"
                >
                  <thead>
                    <tr>
                      <th className="text-center"> Sr. No. </th>
                      <th className="text-center">
                        <input type="checkbox" onChange={handleSelectAll} />{' '}
                        Select
                      </th>
                      <th className="text-center"> Task Name </th>
                      <th className="text-center"> Requested By </th>
                      <th className="text-center"> From Date </th>
                      <th className="text-center"> To Date </th>
                      <th className="text-center"> From Time </th>
                      <th className="text-center"> To Time </th>
                      <th className="text-center"> Actual Time </th>
                      <th className="text-center"> Scheduled Time </th>

                      <th className="text-center"> Remark </th>
                      <th className="text-center"> Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rquestData &&
                      rquestData?.map((x, i) => {
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
                                disabled={x.status !== 'PENDING'}
                              />
                            </td>
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
                                id={`actual_time${i}`}
                                name="actual_time[]"
                                value={x.actual_time}
                                required
                                readOnly={true}
                                style={{ width: '100px' }}
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id={`scheduled_time${i}`}
                                name="scheduled_time[]"
                                value={x.scheduled_time}
                                required
                                style={{ width: '100px' }}
                                readOnly={true}
                              />
                            </td>
                            <td title={x.remark}>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id={`remark${i}`}
                                name="remark[]"
                                value={x.remark}
                                style={{ width: '100px' }}
                                required
                                readOnly={true}
                              />
                            </td>
                            <td title={x.status}>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id={`status${i}`}
                                name="status[]"
                                value={x.status}
                                required
                                style={{ width: '100px' }}
                                readOnly={true}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </>
            ) : (
              <p
                className="text-center opacity-50"
                style={{ fontWeight: 'bold', fontSize: 20 }}
              >
                No record found
              </p>
            )}
          </div>
        </>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ApproveRequestModal;
