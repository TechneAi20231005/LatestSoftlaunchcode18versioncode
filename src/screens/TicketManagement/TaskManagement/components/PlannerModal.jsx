import React, { useState, useEffect } from 'react'
import { Modal, Table } from 'react-bootstrap';
import { _attachmentUrl } from '../../../../settings/constants'
import { getTaskUser, updateTaskPlanner, getTaskPlanner } from '../../../../services/TicketService/TaskService'
import *  as Validation from '../../../../components/Utilities/Validation';
import Alert from "../../../../components/Common/Alert";
import Select from 'react-select';
function PlannerModal(props) {


    const [notify, setNotify] = useState();
    const [plannerData, setPlannerData] = useState([]);
    const [taskUsers, setTaskUsers] = useState(null);
    const [totalHours, setTotalHours] = useState(0.00);

    const [times, setTimes] = useState({ "label": "00", "value": "00" });

    

    const loadData = async () => {
        var hours = 0;
        var min = 0;
        var times = [{ "label": "00:00", "value": "00:00" }];
        do {
            min += 1;
            if (min == 60) {
                min = 0;
                hours += 1;
            }
            let a = (hours < 10 ? "0" + hours : hours) + ":" + (min < 10 ? "0" + min : min);
            times.push({ "label": a, "value": a })
        }
        while (hours <= 23);

        setTimes(times);

        // await getTaskUser(props.plannerData.taskId).then(res => {
        //     if (res.status === 200) {
        //         setTaskUsers(null);

        //         // res.data.data.forEach
        //         setTaskUsers(res.data.data);
        //     }
        // })


        setPlannerData(props.plannerData);

        // if(props.plannerData.data){
        //     let tempTotalHours=0;

        //     plannerData.data.forEach(ele=>{
        //             var t=ele.total_hours.replace(':', '.');
        //             tempTotalHours+=parseFloat(t)*60;  
        //     })
        //     var Hours = Math.floor(tempTotalHours /60);
        //     var minutes = tempTotalHours % 60;
        //     setTotalHours(Hours+":"+minutes);

        // }

        const sumHoras = [0, 0];
        for (let i = 0; i < props.plannerData.data.length; i++) {
            const [hours, minutes] = props.plannerData.data[i].total_hours.split(':').map(s => parseInt(s, 10));

            // console.log(hours+" "+minutes);

            //// hours
            //sumHoras[0] += hours;

            //// minutes
            // if ((sumHoras[i] + minutes) > 59) {
            //   const diff = sumHoras[1] + minutes - 60;
            //   sumHoras[0] += 1;
            //   sumHoras[1] = diff;
            // } else {
            //   sumHoras[1] += minutes ;
            // }

            sumHoras[0] += hours;
            sumHoras[1] += minutes;
            if (sumHoras[1] >= 60) {
                sumHoras[0] += 1;
                sumHoras[1] = 0;
            }

        }
        var t = (sumHoras[0] < 10 ? "0" + sumHoras[0] : sumHoras[0]) + ":" + (sumHoras[1] < 10 ? "0" + sumHoras[1] : sumHoras[1]);
        setTotalHours(t);
    }

    const handleChange = (e, index) => {
        var splitValue = e.value.split(':');
        const sumHoras = [0, 0];
        setPlannerData((prev) => {
            const newPrev = { ...prev }
            newPrev.data[index].total_hours = e.value
            return newPrev
        })

        for (let i = 0; i < plannerData.data.length; i++) {
            const [hours, minutes] = plannerData.data[i].total_hours.split(':').map(s => parseInt(s, 10));

            // // hours
            // sumHoras[0] += hours;

            // // minutes
            // if ((sumHoras[i] + minutes) > 59) {
            //   const diff = sumHoras[1] + minutes - 60;
            //   sumHoras[0] += 1;
            //   sumHoras[1] = diff;
            // } else {
            //   sumHoras[1] += minutes;
            // }
            sumHoras[0] += hours;
            sumHoras[1] += minutes;
            if (sumHoras[1] >= 60) {
                sumHoras[0] += 1;
                sumHoras[1] = 0;
            }

        }
        var t = (sumHoras[0] < 10 ? "0" + sumHoras[0] : sumHoras[0]) + ":" + (sumHoras[1] < 10 ? "0" + sumHoras[1] : sumHoras[1]);
        setTotalHours(t);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        //  for(var pair of data.entries()) {
        //     console.log(pair[0]+ ', '+ pair[1]);
        //  }
        setNotify(null);
        await updateTaskPlanner(plannerData.taskId, data).then(res => {
            if (res.status === 200) {
                if (res.data.status === 1) {
                    setNotify({ type: "success", message: res.data.message });
                } else {
                    setNotify({ type: "danger", message: res.data.message });
                }
            }
        });

    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <>
            <Modal show={props.show} size="lg" onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <h4 style={{ color: '#252640' }}>Task Planner </h4>
                </Modal.Header>
                <Modal.Body>
                    {notify && <Alert alertData={notify} />}

                    <form onSubmit={handleSubmit}>

                        <input type="hidden" name="ticket_basket_id" defaultValue={plannerData.ticket_basket_id} />
                        <input type="hidden" name="ticket_id" defaultValue={plannerData.ticket_id} />

                        <div className="row mt-3">
                            <div className="col-md-12">
                                {plannerData.data && <Table bordered size="sm">
                                    <thead>
                                        <tr className="p-1">
                                            <th className="p-1 text-center" style={{ fontSize: '15px' }}>Sr No</th>
                                            <th className="p-1 text-center" style={{ fontSize: '15px' }}>Assigned User</th>
                                            <th className="p-1 text-center" style={{ fontSize: '15px' }}>Date</th>
                                            <th className="p-1 text-center" style={{ fontSize: '15px' }}>Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plannerData.data.map((ele, index) => {
                                            return <tr className="p-1">
                                                <td className="p-1 text-center">{index + 1}
                                                    <input type="hidden" name="id[]" defaultValue={ele.id} />
                                                </td>

                                                <td className="p-1">
                                                    <select 
                                                    className="form-control form-control-sm" name="user_id[]">
                                                        {/* {taskUsers && taskUsers.map(user => {
                                                            if (user.userId === ele.user_id) {
                                                                return <option value={user.userId} selected>{user.taskUsers}</option>
                                                            } else {
                                                                return <option value={user.userId}>{user.taskUsers}</option>
                                                            }
                                                        })} */}

{props.plannerData.data && props.plannerData.data.map(user => {
                                                            if (user.userId === ele.user_id) {
                                                                return <option value={user.userId} selected>{user.username}</option>
                                                            } else {
                                                                return <option value={user.userId}>{ele.username}</option>
                                                            }
                                                        })}
                                                    </select>
                                                </td>

                                                <td className="p-1">
                                                    <input type="date" className="form-control form-control-sm"
                                                        readOnly={true}
                                                        name="date[]" defaultValue={ele.date} />
                                                </td>

                                                <td className="p-1">
                                                    {/* <input type="text" className="form-control form-control-sm"
                                                name="total_hours[]" 
                                                min="0"
                                                step="00.00"
                                                defaultValue={ele.total_hours}
                                                autoComplete="off"
                                                onKeyPress={(e)=>{Validation.NumbersSpeicalOnly(e);handleChange(e,index)}}
                                                /> */}
                                                    <Select
                                                        options={times}
                                                        defaultValue={times.filter(d => d.value === ele.total_hours).map(d => ({ "label": d.label, "value": d.value }))}
                                                        name="total_hours[]"
                                                        onChange={e => handleChange(e, index)}
                                                    />

                                                </td>
                                            </tr>
                                        })}

                                        <tr className="p-1" style={{ fontSize: "20px" }}>
                                            <td className="p-1 text-right" colspan="3" style={{ textAlign: "right" }}><b>TOTAL HOURS</b></td>
                                            <td className="p-1"><b>{totalHours}</b></td>
                                        </tr>

                                    </tbody>
                                </Table>
                                }
                                {!plannerData.data && <div className="alert alert-warning">NO PLAN ADDED !!!</div>}
                            </div>
                        </div>

                        <div className='d-flex justify-content-end'>
                            <button type="submit" className='btn btn-sm text-white'
                                style={{ backgroundColor: '#484C7F' }}>
                                Update
                            </button>

                            <button type="button" className='btn btn-sm btn-danger text-white' onClick={props.handleClose}>
                                Close
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>


        </>
    )
}

export default PlannerModal