import React, { useState, useEffect } from 'react'
import { Modal, Table } from 'react-bootstrap';
import { _attachmentUrl } from '../../../../settings/constants'
import { postTimerData, getTaskOwnerTime } from '../../../../services/TicketService/TaskService'
import *  as Validation from '../../../../components/Utilities/Validation';
import Alert from "../../../../components/Common/Alert";
import * as time from '../../../../components/Utilities/Functions'
import { set } from 'mobx';

const StartStopModal = (props) => {

    const [checkedUser, setCheckedUser] = useState([]);

    const [checkOwnerTime, setCheckOwnerTime] = useState();

    const [userData, setUserData] = useState(props.data.taskOwners);

    const loadData = async () => {
        
        const userIds = [];
        props.data.taskOwners.forEach(user => {
            userIds.push(user.id);
        })

        const form = new FormData();
        form.append('task_id', props.data.taskId)
        form.append('user_id', userIds);
        
        await getTaskOwnerTime(form).then(res => {
            const temp = userData;
            
            temp.forEach((t, k1) => {
                res.data.forEach((d, k2) => {
                    if (d.user_id == t.id) {
                        temp[k1].status = d.status;
                    }
                })
            })
            setUserData([]);
            setUserData(temp);
        })
    }

    const handleChange = (e) => {

        const checked = e.target.checked;
        const checkedValue = e.target.value;
        const checkedName = e.target.name;
        if(checked == false){
            alert("Please select atleast one user")

        }
        // Case 1 : The user checks the box
        if (checked == true) {
            setCheckedUser([...checkedUser, checkedValue]);
        }
        // Case 2  : The user unchecks the box
        else {
            setCheckedUser(
                checkedUser.filter((e) => e !== checkedValue)
            );
        }
    };

    //Timer
    const [timerState, setTimerState] = useState(props.data.all.time_status);
    const handleTimer = (e) => {
        e.preventDefault();

        if (checkedUser != '') {
            var userId = checkedUser;
        } else {
            var userId = localStorage.getItem('id')
        }

        var data = {
            ticket_id: props.data.all.ticket_id,
            ticket_basket_id: props.data.all.ticket_basket_id,
            ticket_task_id: props.data.all.id,
            user_id: userId,
            status: timerState == "START" ? 'STOP' : 'START',
            time: time.getDateTime(),
            type: props.data.all.type,

        }
        postTimerData(data).then(res => {
            // setNotify(null);  
            if (res.status === 200) {
                if (res.data.status === 1) {
                    if (timerState === "START") {
                        setTimerState("STOP");
                    } else {
                        setTimerState("START");
                    }    
                    props.hide();                
                    props.loadBasket();
                } else {
                    // setNotify({type:"danger",message:res.data.message})  
                }
            }
        })
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div>
            <Modal centered
                show={props.show}
                onHide={props.hide}
            >
                <form method="post">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">Select Participants</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="deadline-form">                            
                            {props.data.taskOwners && props.data.all.time_status == 'STOP' && props.data.taskOwners.map((name, i) => {
                                return <div className="mb-3" key={i}>
                                    <div className="form-check">
                                        <input type="checkbox"name="checkedUser" className="form-check-input" value={name.id} onChange={handleChange}/>
                                        <label className="form-check-label" for="dropdownCheck">{name.taskOwnerName}</label>
                                    </div>
                                </div>
                            })}
                            {userData && props.data.all.time_status == 'START' && userData.map((user, i) => {
                                return <div className="mb-3" key={i}>
                                    {(user.status !== "START" && user.status != null) &&
                                    <div className="form-check">
                                        <input type="checkbox" name="checkedUser" className="form-check-input" value={user.id} onChange={handleChange} defaultChecked={(user.status == "STOP") ? "checked" : ""}/>
                                        <label className="form-check-label" for="dropdownCheck">{user.taskOwnerName}</label>
                                    </div>
                                    }
                                </div>
                            })} 
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* {/* onClick={handleSubmit} */}
                            {props.data.all.time_status == 'STOP' && <button type="submit" className="btn btn-primary text-white" style={{ backgroundColor: "#484C7F" }} onClick={handleTimer}>
                                Start Task
                            </button>
                            }
                            {props.data.all.time_status == 'START' && <button type="submit" className="btn btn-primary text-white" style={{ backgroundColor: "#484C7F" }} onClick={handleTimer}>
                                Stop Task
                            </button>
                            }
                    
                    </Modal.Footer>
                </form>
            </Modal>


        </div>
    )
}

export default StartStopModal