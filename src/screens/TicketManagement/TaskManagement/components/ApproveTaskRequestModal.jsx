import React, { useEffect, useState, useRef } from 'react';
import { Modal, Table } from 'react-bootstrap';
import ErrorLogService from "../../../../services/ErrorLogService";
import Alert from "../../../../components/Common/Alert";

import { getRegularizationTime, changeStatusRegularizationTime, getTaskRegularizationTime, changeTaskStatusRegularizationTime } from '../../../../services/TicketService/TaskService';

const ApproveTaskRequestModal = (props) => {
    const [notify, setNotify] = useState(null);
    const [data, setData] = useState();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const loadData = () => {


        new getTaskRegularizationTime().then(res => {

            if (res.data.data) {
                var temp = [];
                setData(null);
                res.data.data.forEach(d => {
                    temp.push({
                        'id': d.id,

                        'from_date': d.from_date,
                        'to_date': d.to_date,
                        "ticket_id":d.ticket_id,
                        'status': d.status,
                        'remark': d.remark,
                       "requested_by":d.requested_by,
                        'task_name': d.task_name,
                        'task_hours': d.task_hours,
                        'is_checked': 0,
                        "ticket_task_id":d.ticket_task_id,
                        "ticket_basket_id":d.ticket_basket_id,
                        "user_id":d.user_id


                    });
                })
                setData(temp);
            }
        })

    }


    const handleInputChange = (e, i) => {
        setData(
            data.map((d, index) =>
                index === i
                    ? { ...d, is_checked: e.target.checked == true ? 1 : 0 }
                    : d
            ))
    }


    const handleForm = (type) => {
        setNotify(null);
        const formData = { type: type, payload: data }



        


        const check = formData.payload.filter(d => { return d.is_checked == 1 });
        if (check.length > 0) {
            new changeTaskStatusRegularizationTime(formData).then(res => {
                if (res.status === 200) {
                    if (res.data.status == 1) {
                        setNotify({ type: 'success', message: res.data.message });
                        

                        new getRegularizationTime().then(res => {
                            if (res.data.data && res.data.data.length > 0) {

                                var temp = [];
                                setData(null);
                                res.data.data.forEach(d => {
                                    temp.push({
                                        'id': d.id,

                                        'from_date': d.from_date,
                                        'to_date': d.to_date,
                                        'status': d.status,
                                        'is_checked': 0,
                                        'remark': d.remark,
                                        'task_name': d.task_name,
                                        'ticket_id_name': d.ticket_id_name,
                                        'task_hours':d.task_hours,
                                        'requested_by':d.requested_by,

'ticket_id':d.ticket_id
                                    });
                                })
                                setData(temp);

                            }
                        })

                    } else {
                        setNotify({ type: 'danger', message: res.data.message });
                    }
                }
            })
        } else {
            setNotify({ type: 'danger', message: "Select request before action !!!" });
        }
    }

    useEffect(() => {
        loadData();
    }, [])

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

            <Modal.Title id="example-custom-modal-styling-title" className="text-center font-weight-bold">
    Task Request Regularization
</Modal.Title>


            </Modal.Header>
            <Modal.Body>

                <div className='text-right' style={{ 'text-align': 'right' }}>
                    <button type="button" className="btn btn-primary btn-sm" style={{ backgroundColor: "#484C7F" }}
                        onClick={(e) => handleForm("APPROVED")}
                    >Approve</button>
                    <button type="button" className="btn btn-danger btn-sm text-white"
                        onClick={e => handleForm("REJECTED")}
                    >Reject</button>
                </div>
                <div className='table-responsive'>
                    <table
                        className="table table-bordered mt-3 table-responsive"
                        id="tab_logic"
                    >
                        <thead>
                            <tr>

                                <th className="text-center"> Sr. No. </th>
                                <th className="text-center"> Select </th>
                                <th className="text-center"> Ticket Id </th>

                                <th className="text-center"> Requested By </th>

                                <th className="text-center"> Task Name </th>

                                <th className="text-center"> From Date </th>
                                <th className="text-center"> To Date </th>

                                <th className="text-center"> Task Hours </th>

                                <th className="text-center"> Remark </th>
                                <th className="text-center"> Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data && data.map((x, i) => {
                                return <tr id={`addr_${i}`} key={i}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <input type="hidden" id={`status_${i}`} name="id[]"
                                            value={x.id}

                                        />
                                        <input type="checkbox" id={`status_${i}`} name="status[]"
                                            onChange={(e) => handleInputChange(e, i)}
                                            checked={x.is_checked == 1}

                                            // disabled={x.status != "PENDING"}



                                        />
                                    </td>


                                    <td title={x.task_name}>{x.ticket_id}</td>
                                    <td>
                                        {x.requested_by}
                                    </td>
                                    <td title={x.task_name}>{x.task_name}</td>
                                    {/* <td>
                                        <input type="text" className="form-control form-control-sm"
                                            id={`task_name${i}`}
                                            name="task_name[]"
                                            value={x.task_name}
                                            required
                                            // readOnly={true}
                                        />
                                    </td> */}
                                    <td>
                                        <input type="date" className="form-control form-control-sm"
                                            id={`from_date${i}`}
                                            name="from_date[]"
                                            value={x.from_date}
                                            required
                                            readOnly={true}
                                        />
                                    </td>

                                    <td>
                                        <input type="date" className="form-control form-control-sm"
                                            id={`to_date${i}`}
                                            name="to_date[]"
                                            value={x.to_date}
                                            required
                                            readOnly={true}
                                        />
                                    </td>

                                   
                                    <td>
                                        <input type="time" className="form-control form-control-sm"
                                            id={`task_hours${i}`}
                                            name="task_hours[]"
                                            defaultValue={x.task_hours}
                                            readOnly={true}
                                            required
                                        />
                                    </td>



                                    
                                    

                                    <td>
                                        {x.remark}
                                    </td>
                                    <td>
                                        {x.status}
                                    </td>
                                </tr>
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>

        </Modal>
    )
}

export default ApproveTaskRequestModal