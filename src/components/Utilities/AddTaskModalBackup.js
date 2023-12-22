import React,{useState,useEffect} from 'react'
import { Button, Modal, Form, Row, Col, Select } from 'react-bootstrap';
// import {getDataUsingParam,putData} from '../../../services/TicketService/TicketTaskCard'

function AddTaskModalBackup(props) {

    const [form,setForm]=useState(
        {id:null,
        ticket_basket_id:null,
        task_name:null,
        task_hours:null,
        task_desc:null,
        priority:null,
        status:null
    });
     
    const category=["Cat1","Cat2","Cat3"];
    const priority=["High","Medium","Low"];

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(form);

        // putData(props.modalData[0]._id,form).then(res=>{
        //     console.log(res);
        // })    
    }
    
    const changeHandler = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    }

    useEffect(() => {
        // getDataUsingParam(props.modalData[0]._id).then(res=>{
        //     setForm({
        //         ...form,
        //         title:res.data[0].title,
        //         no_of_hours:res.data[0].no_of_hours,
        //     });
        // })
    }, [])
    
    return (
        <>

        <Modal  size="md" show={props.show} onHide={props.handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
           
        </Modal.Header>
        <Modal.Body style={{padding:'10px'}}>
        <form onSubmit={submitHandler}> 
            <div className="mb-3">
                <label  className="form-label">Task</label>
                <input type="text" className="form-control form-control-sm" name="task_name" 
                defaultValue={form.task_name}
                onChange={changeHandler}/>
            </div>
        

            <div className="mb-3">
                <label  className="form-label">No of Hours</label>
                <input type="text" className="form-control form-control-sm" name="task_desc" 
                defaultValue={form.task_desc}
                onChange={changeHandler}/>
            </div>


            <div className="row g-3 mb-3">
                <div className="col-sm">
                <label className="form-label">Task Priority</label>
                <select className="form-select" id="priority" name="priority" onChange={changeHandler}
                value={form.priority}
                >
                    <option value="">Select Priority</option>
                    { 
                    priority.map((data)=>{
                        return <option value={data}>{data}</option>
                    })
                }
                </select>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description (optional)</label>
                <textarea className="form-control" id="description" name="task_desc" rows={3}  defaultValue={""} onChange={changeHandler}/>
            </div>

            <div className='d-flex justify-content-between'>

            <button type="submit" className='btn btn-sm btn-info'>
                Done
            </button>
            <button type="button" className='btn btn-sm btn-danger' onClick={props.handleClose}>
                Close
            </button>
            </div>
            </form>
        </Modal.Body>
        <Modal.Footer>
 
        </Modal.Footer>
    </Modal>

    </>
    )
}

export default AddTaskModalBackup