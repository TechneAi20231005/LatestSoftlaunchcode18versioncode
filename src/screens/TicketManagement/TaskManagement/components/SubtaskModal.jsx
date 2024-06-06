import React, { useEffect, useRef } from 'react';
import { Modal, Table } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import {
  addSubTaskModuleThunk,
  completedTaskListThunk,
  deleteSubTaskModuleThunk,
  getSubTaskListThunk
} from '../../../../redux/services/SubTask';
import { getDateTime } from '../../../../components/Utilities/Functions';

export default function SubtaskModal(props) {
  const formRef = useRef();
  const dispatch = useDispatch();

  const data = useSelector(
    (subTaskComponentSlices) => subTaskComponentSlices.subTask.subTaskList
  );

  const resetForm = () => {
    formRef.current.reset();
  };
  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('tenant_id', localStorage.getItem('tenant_id'));
    formData.append('created_by', localStorage.getItem('id'));
    formData.append('created_at', getDateTime());

    dispatch(addSubTaskModuleThunk({ formData: formData }));
    loadSubtask();
    resetForm();
  };

  const loadSubtask = async () => {
    dispatch(getSubTaskListThunk({ taskId: props.taskId }));
  };

  const completeSubtask = async (e, subtaskId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('is_completed', 1);
    dispatch(
      completedTaskListThunk({ subtaskId: subtaskId, formData: formData })
    );

    loadSubtask();
  };

  const deleteSubtask = async (e, subtaskId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('ticket_id', props.ticketId);
    formData.append('ticket_task_id', props.taskId);

    dispatch(
      deleteSubTaskModuleThunk({ subtaskId: subtaskId, formData: formData })
    );
    loadSubtask();
  };

  useEffect(() => {
    loadSubtask();
  }, []);

  return (
    <>
      {/* {notify && <Alert alertData={notify} />} */}
      <Modal
        show={props.show}
        scrollable={true}
        onHide={props.hide}
        dialogClassName="modal-100w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Subtask
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Table hover size="xl">
            <thead>
              <tr>
                <th className="text-center"> Sr No </th>
                <th style={{ width: '200px' }}>Subtask </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((ele, i) => {
                  return (
                    <tr>
                      <td className="p-1 text-center">{i + 1}</td>

                      {ele.is_completed === 0 && (
                        <td className="p-1">{ele.subtask}</td>
                      )}
                      {ele.is_completed === 1 && (
                        <td className="p-1">
                          <strike>{ele.subtask}</strike>
                        </td>
                      )}
                      <td className="">
                        {props.data.status === 'COMPLETED' ? (
                          ''
                        ) : (
                          <>
                            {ele.is_completed === 0 && (
                              <button
                                className="btn-small-icon"
                                type="button"
                                style={{
                                  border: 'none',
                                  borderRadius: '25%',
                                  height: '25px',
                                  width: '35px',
                                  textAlign: 'center',
                                  margin: '0px',
                                  padding: '0px'
                                }}
                                onClick={(e) => {
                                  deleteSubtask(e, ele.id);
                                }}
                              >
                                <i
                                  class="icofont-delete-alt"
                                  style={{
                                    fontSize: '15px',
                                    color: '#EC7063',
                                    margin: 'auto'
                                  }}
                                ></i>
                              </button>
                            )}
                          </>
                        )}
                        {props.data.status === 'COMPLETED' ? (
                          ''
                        ) : (
                          <>
                            {ele.is_completed === 0 && (
                              <button
                                type="button"
                                className="mr-1 text-white"
                                style={{
                                  border: 'none',
                                  borderRadius: '10px',
                                  height: '25px',
                                  width: '50px',
                                  textAlign: 'center',
                                  margin: '0px',
                                  padding: '0px',
                                  backgroundColor: '#3498DB',
                                  fontSize: '12px'
                                }}
                                onClick={(e) => {
                                  completeSubtask(e, ele.id);
                                }}
                              >
                                Done
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <form onSubmit={handleForm} ref={formRef}>
            <div className="row">
              <div className="col-md-10">
                <input
                  type="hidden"
                  class="form-control form-control-sm"
                  id="ticket_id"
                  name="ticket_id"
                  value={props.ticketId}
                  required
                />

                <input
                  type="hidden"
                  class="form-control form-control-sm"
                  id="ticket_task_id"
                  name="ticket_task_id"
                  value={props.taskId}
                  required
                />

                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="subtask"
                  name="subtask"
                  disabled={props.data.status === 'COMPLETED' ? true : false}
                  maxLength={100}
                  required
                />
              </div>
              <div className="col-md-2">
                <button
                  type="submit"
                  disabled={props.data.status === 'COMPLETED' ? true : false}
                  style={{
                    border: 'none',
                    borderRadius: '25%',
                    height: '35px',
                    width: '35px',
                    textAlign: 'center',
                    margin: '0px',
                    padding: '0px'
                  }}
                >
                  <i
                    class="icofont-ui-add"
                    style={{
                      fontSize: '20px',
                      color: '#3498DB',
                      margin: 'auto'
                    }}
                  ></i>
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
