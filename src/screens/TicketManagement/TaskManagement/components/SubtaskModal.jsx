// import React, { useEffect, useState, useRef } from 'react';
// import { Modal, Table } from 'react-bootstrap';
// import SubtaskService from "../../../../services/TicketService/SubtaskService";
// import ErrorLogService from "../../../../services/ErrorLogService";
// import Alert from "../../../../components/Common/Alert";

// export default function SubtaskModal(props) {
//     const formRef = useRef()

//     const [notify, setNotify] = useState();

//     const [data, setData] = useState();
//     const resetForm = () => {
//         formRef.current.reset();
//     }
//     const handleForm = async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         // for(var pair of formData.entries()) {
//         //     ({pair[0]+":"+pair[1]});
//         // }

//         // const a=[];
//         // for (let [key, value] of formData.entries()) {
//         //     a[key]=value;

//         // }
//         // setData(prev=>[prev,...a]);

//         await new SubtaskService().postSubtask(formData).then(res => {
//             // setData(null)
//             setNotify(null)
//             if (res.status === 200) {
//                 if (res.data.status === 1) {
//                     loadSubtask();
//                 }
//                 else {
//                     setNotify({ type: 'danger', message: res.data.message });
//                     // loadSubtask();

//                 }
//             }
//         })
//         resetForm();

//     }

//     const loadSubtask = async () => {
//         setData(null);
//         setNotify(null);
//         await new SubtaskService().getSubtask(props.taskId).then(res => {
//             if (res.status === 200) {
//                 if (res.data.status === 1) {
//                     setData(res.data.data);
//                 }
//                 // else{
//                 //     setNotify({ type: 'danger', message: res.data.message });
//                 // }
//             }
//         });
//     }

//     const completeSubtask = async (e, subtaskId) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('is_completed', 1);
//         await new SubtaskService().completeSubtask(subtaskId, formData).then(res => {
//             if (res.status === 200) {
//                 if (res.data.status === 1) {
//                     loadSubtask();
//                 }
//             }
//         });
//     }

//     const deleteSubtask = async (e, subtaskId) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // formData.append('is_active',0);
//         formData.append('ticket_id', props.ticketId);
//         formData.append('ticket_task_id', props.taskId);
//         // formData.append('subtask',props.subtask);




//         await new SubtaskService().deleteSubtask(subtaskId, formData).then(res => {
//             if (res.status === 200) {
//                 if (res.data.status === 1) {
//                     loadSubtask();
//                 }
//             }
//         });
//     }


//     useEffect(() => {
//         loadSubtask();
//     }, [])


//     return (
//         <>
//             {notify && <Alert alertData={notify} />}
//             <Modal
//                 show={props.show}
               
//                   scrollable={true}
//                                   onHide={props.hide}
//                 dialogClassName="modal-100w"
//                 aria-labelledby="example-custom-modal-styling-title"
//             >
//                 <Modal.Header closeButton>
//                     <Modal.Title id="example-custom-modal-styling-title">
//                         Subtask
//                     </Modal.Title>
//                 </Modal.Header>

//                 <Modal.Body>

//                     <Table hover size="xl">
//                         <thead>
//                             <tr>
//                                 <th className="text-center"> Sr No </th>
//                                 <th style={{width:"200px"}}>Subtask </th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>

//                             {data && data.map((ele, i) => {
//                                 return <tr>
//                                     <td className="p-1 text-center">{i + 1}</td>

//                                     {ele.is_completed === 0 && <td className="p-1">{ele.subtask}</td>}
//                                     {ele.is_completed === 1 && <td className="p-1"><strike>{ele.subtask}</strike></td>}
//                                     <td className="">
//                                         {props.data.status === "COMPLETED" ? "" : <>
//                                             {ele.is_completed === 0 && <button type="button" style={{ border: 'none', borderRadius: '25%', height: '25px', width: '35px', textAlign: 'center', margin: '0px', padding: '0px' }}
//                                                 onClick={(e) => { deleteSubtask(e, ele.id) }}
//                                             >
//                                                 <i class="icofont-delete-alt" style={{ fontSize: '15px', color: '#EC7063', margin: 'auto' }}></i>
//                                             </button>
//                                             }</>}
//                                         {props.data.status === "COMPLETED" ? "" : <>
//                                             {ele.is_completed === 0 &&
//                                                 <button type="button" className="mr-1 text-white" style={{ border: 'none', borderRadius: '10px', height: '25px', width: '50px', textAlign: 'center', margin: '0px', padding: '0px', backgroundColor: "#3498DB", fontSize: "12px" }}
//                                                     onClick={(e) => { completeSubtask(e, ele.id) }}
//                                                 >
//                                                     Done
//                                                 </button>
//                                             }</>}
//                                     </td>
//                                 </tr>
//                             })
//                             }

//                         </tbody>
//                     </Table>
//                     <form onSubmit={handleForm} ref={formRef} >
//                         <div className="row">
//                             <div className="col-md-10">
//                                 <input type="hidden" class="form-control form-control-sm"
//                                     id="ticket_id"
//                                     name="ticket_id"
//                                     value={props.ticketId}

//                                     required />

//                                 <input type="hidden" class="form-control form-control-sm"
//                                     id="ticket_task_id"
//                                     name="ticket_task_id"
//                                     value={props.taskId}
//                                     required />

//                                 <input type="text" class="form-control form-control-sm"
//                                     id="subtask"
//                                     name="subtask"
//                                     disabled={props.data.status === "COMPLETED" ? true : false}
//                                     maxLength={50}

//                                     required />
//                             </div>
//                             <div className="col-md-2">
//                                 <button type="submit" disabled={props.data.status === "COMPLETED" ? true : false} style={{ border: 'none', borderRadius: '25%', height: '35px', width: '35px', textAlign: 'center', margin: '0px', padding: '0px' }}>
//                                     <i class="icofont-ui-add" style={{ fontSize: '20px', color: '#3498DB', margin: 'auto' }}></i>
//                                 </button>
//                             </div>
//                         </div>
//                     </form>


//                 </Modal.Body>
//                 {/* <Modal.Footer>
                    
//           </Modal.Footer> */}
//             </Modal>
//         </>
//     )
// }
import React, { useEffect, useState, useRef } from 'react';
import { Modal, Table } from 'react-bootstrap';
import SubtaskService from "../../../../services/TicketService/SubtaskService";
import ErrorLogService from "../../../../services/ErrorLogService";
import Alert from "../../../../components/Common/Alert";
import {useDispatch,useSelector} from "react-redux"
import { CompleteSubtask,DeleteSubtask, getSubTaskData, postSubtaskData } from '../../BasketManagement/Slices/SubtaskAction';
import SubtaskSlice from '../../BasketManagement/Slices/SubtaskSlice';

export default function SubtaskModal(props) {
    const formRef = useRef()

    // const [notify, setNotify] = useState();
    const dispatch = useDispatch()
    const subtaskData = useSelector(SubtaskSlice=>SubtaskSlice.subTask.getAllSubTaskData)
    const Notify = useSelector(SubtaskSlice=>SubtaskSlice.subTask.notify)
    const [data, setData] = useState();
    const resetForm = () => {
        formRef.current.reset();
    }
    const handleForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // for(var pair of formData.entries()) {
        //     ({pair[0]+":"+pair[1]});
        // }

        // const a=[];
        // for (let [key, value] of formData.entries()) {
        //     a[key]=value;

        // }
        // setData(prev=>[prev,...a]);

dispatch(postSubtaskData(formData))
                    loadSubtask();


        // await new SubtaskService().postSubtask(formData).then(res => {
        //     // setData(null)
        //     setNotify(null)
        //     if (res.status === 200) {
        //         if (res.data.status === 1) {
        //             loadSubtask();
        //         }
        //         else {
        //             setNotify({ type: 'danger', message: res.data.message });
        //             // loadSubtask();

        //         }
        //     }
        // })
        resetForm();

    }

    const loadSubtask = async () => {
        setData(null);
        // setNotify(null);
        dispatch(getSubTaskData(props.taskId))
        // await new SubtaskService().getSubtask(props.taskId).then(res => {
        //     if (res.status === 200) {
        //         if (res.data.status === 1) {
        //             setData(res.data.data);
        //         }
        //         // else{
        //         //     setNotify({ type: 'danger', message: res.data.message });
        //         // }
        //     }
        // });
    }

    const completeSubtask = async (e, subtaskId) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('is_completed', 1);
        dispatch(CompleteSubtask({subtaskId:subtaskId,payload:formData}))
        loadSubtask()
        // await new SubtaskService().completeSubtask(subtaskId, formData).then(res => {
        //     if (res.status === 200) {
        //         if (res.data.status === 1) {
        //             loadSubtask();
        //         }
        //     }
        // });
    }

    const deleteSubtask = async (e, subtaskId) => {
        e.preventDefault();
        const formData = new FormData();
        // formData.append('is_active',0);
        formData.append('ticket_id', props.ticketId);
        formData.append('ticket_task_id', props.taskId);
        // formData.append('subtask',props.subtask);
dispatch(DeleteSubtask({subtaskId:subtaskId,payload:formData}))
loadSubtask()



        // await new SubtaskService().deleteSubtask(subtaskId, formData).then(res => {
        //     if (res.status === 200) {
        //         if (res.data.status === 1) {
        //             loadSubtask();
        //         }
        //     }
        // });
    }


    useEffect(() => {
        loadSubtask();
      
    }, [])


    return (
        <>
            {Notify && <Alert alertData={Notify} />}
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
                                <th style={{width:"200px"}}>Subtask </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {subtaskData && subtaskData.map((ele, i) => {
                                return <tr>
                                    <td className="p-1 text-center">{i + 1}</td>

                                    {ele.is_completed === 0 && <td className="p-1">{ele.subtask}</td>}
                                    {ele.is_completed === 1 && <td className="p-1"><strike>{ele.subtask}</strike></td>}
                                    <td className="">
                                        {props.data.status === "COMPLETED" ? "" : <>
                                            {ele.is_completed === 0 && <button type="button" style={{ border: 'none', borderRadius: '25%', height: '25px', width: '35px', textAlign: 'center', margin: '0px', padding: '0px' }}
                                                onClick={(e) => { deleteSubtask(e, ele.id) }}
                                            >
                                                <i class="icofont-delete-alt" style={{ fontSize: '15px', color: '#EC7063', margin: 'auto' }}></i>
                                            </button>
                                            }</>}
                                        {props.data.status === "COMPLETED" ? "" : <>
                                            {ele.is_completed === 0 &&
                                                <button type="button" className="mr-1 text-white" style={{ border: 'none', borderRadius: '10px', height: '25px', width: '50px', textAlign: 'center', margin: '0px', padding: '0px', backgroundColor: "#3498DB", fontSize: "12px" }}
                                                    onClick={(e) => { completeSubtask(e, ele.id) }}
                                                >
                                                    Done
                                                </button>
                                            }</>}
                                    </td>
                                </tr>
                            })
                            }

                        </tbody>
                    </Table>
                    <form onSubmit={handleForm} ref={formRef} >
                        <div className="row">
                            <div className="col-md-10">
                                <input type="hidden" class="form-control form-control-sm"
                                    id="ticket_id"
                                    name="ticket_id"
                                    value={props.ticketId}

                                    required />

                                <input type="hidden" class="form-control form-control-sm"
                                    id="ticket_task_id"
                                    name="ticket_task_id"
                                    value={props.taskId}
                                    required />

                                <input type="text" class="form-control form-control-sm"
                                    id="subtask"
                                    name="subtask"
                                    disabled={props.data.status === "COMPLETED" ? true : false}
                                    maxLength={50}

                                    required />
                            </div>
                            <div className="col-md-2">
                                <button type="submit" disabled={props.data.status === "COMPLETED" ? true : false} style={{ border: 'none', borderRadius: '25%', height: '35px', width: '35px', textAlign: 'center', margin: '0px', padding: '0px' }}>
                                    <i class="icofont-ui-add" style={{ fontSize: '20px', color: '#3498DB', margin: 'auto' }}></i>
                                </button>
                            </div>
                        </div>
                    </form>


                </Modal.Body>
                {/* <Modal.Footer>
                    
          </Modal.Footer> */}
            </Modal>
        </>
    )
}
