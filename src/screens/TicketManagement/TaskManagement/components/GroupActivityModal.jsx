import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from 'react-bootstrap';

import { postTimerDataGroupActivity } from '../../../../services/TicketService/TaskService';

import Avatar from 'react-avatar';

const GroupActivityModal = (props) => {
  const handleSelectAll = (e) => {
    // var data=taskOwners;
    setTaskOwners((current) =>
      current.map((d, i) => {
        return { ...d, is_present: e.target.checked === true ? 1 : 0 };
      })
    );
  };

  const [timerState, setTimerState] = useState('START');

  const handleCheckBox = (e, index) => {
    setTaskOwners((prevState) => {
      prevState[index].is_present = e.target.checked === true ? 1 : 0;
      return [...prevState];
    });
  };

  const [taskOwners, setTaskOwners] = useState();

  const loadData = useCallback( () => {
    const tempData = props.data.taskOwners.map((d, i) => {
      return { ...d, is_present: d.is_started === 'YES' ? 1 : 0 };
    });
    setTaskOwners(tempData);
  },[props.data.taskOwners]);

  const isPresentRef = useRef();
  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    var flag = 0;
    // var a = taskOwners.map((d,i)=>{
    //     if(d.is_present === 1){
    //         flag = 1
    //     }
    // })
    if (flag === 0) {
      alert('Please Select atleast one User');
      return false;
    }
    // for(var i=0; i=ids.length;i++){
    //     alert(ids[i]);
    // }

    // for (let [key, value] of formData.entries()) {
    //     console.log(`${key}: ${value}`);
    //   }
    //   console.log(formData.toString())
    // var selectForm = formData.getAll(formData)
    // console.log(selectForm)
    await new postTimerDataGroupActivity(formData).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          props.loadBasket();
          setTimerState(res.data.data);
        }
      }
    });
  };

  useEffect(() => {
    loadData();
    if (props.data.time_status) {
      setTimerState(props.data.time_status);
    }
  }, [loadData, props.data.time_status]);

  return (
    <div>
      <Modal centered show={props.show} onHide={props.hide}>
        {/* {JSON && JSON.stringify(props.data)} */}

        <form method="post" onSubmit={handleForm}>
          <input type="hidden" name="ticket_task_id" value={props.data.id} />

          <input type="hidden" name="ticket_id" value={props.data.ticket_id} />

          <input type="hidden" name="status" value={timerState} />

          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Task Users</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table">
              <thead>
                <th>Sr</th>
                <th>Assigned User</th>
                <th className="text-center">
                  {timerState === 'START' && (
                    <input
                      type="checkbox"
                      name="select_all"
                      onChange={handleSelectAll}
                    />
                  )}
                </th>
              </thead>
              <tbody>
                {taskOwners &&
                  taskOwners.map((d, i) => {
                    return (
                      <tr className="p-0">
                        <td className="p-1">
                          {i + 1}

                          <input
                            type="hidden"
                            key={Math.random()}
                            name="user_id[]"
                            value={d.id}
                            className="form-check-input"
                          />
                        </td>
                        <td className="p-1">
                          <div>
                            <Avatar
                              name={d.taskOwnerName}
                              size="30"
                              round={true}
                              textSizeRatio={1.2}
                              title={d.taskOwnerName}
                              key={i}
                            />
                            <span style={{ marginLeft: '10px' }}>
                              {d.taskOwnerName}
                            </span>
                          </div>
                        </td>
                        <td className="text-center p-1">
                          <input
                            type="hidden"
                            key={Math.random()}
                            value={d.is_present}
                            id={`${'is_present_text_' + i}`}
                            name="is_present[]"
                          />
                          <input
                            type="checkbox"
                            key={Math.random()}
                            value="1"
                            ref={isPresentRef}
                            id={`${'is_present_' + i}`}
                            className="form-check-input"
                            defaultChecked={d.is_present === 1}
                            onChange={(e) => handleCheckBox(e, i)}
                            disabled={
                              timerState === 'STOP' && d.is_present === 1
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Modal.Body>

          <Modal.Footer>
            {timerState === 'STOP' && (
              <button
                type="submit"
                className="btn btn-danger text-white"
                name="button_type"
                value="STOP"
              >
                Stop Timer
              </button>
            )}

            {timerState === 'START' && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: '#484C7F' }}
                name="button_type"
                value="START"
              >
                Start Timer
              </button>
            )}
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default GroupActivityModal;
