import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { _base } from '../../../settings/constants'
import ErrorLogService from "../../../services/ErrorLogService";
import AddOn from './AddOn';
import { masterURL } from '../../../settings/constants'
import { getData } from '../../../services/DynamicService/DynamicService'
import DynamicFormService from '../../../services/MastersService/DynamicFormService';
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
// import RenderDynamicForm from '../../TicketComponent/RenderDynamicForm';
import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";
import Select from 'react-select';
import { Checkbox } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import *  as Validation from '../../../components/Utilities/Validation';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import inputData from './data.json'

function CreateDynamicForm({ match }) {
    const [notify, setNotify] = useState(null);
    const history = useNavigate();
    const [data, setData] = useState(null);
    const inputData = [{ "type": "text", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false }, { "type": "textarea", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "cols": 3 }, { "type": "number", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "minlength": null, "maxlength": null, "min": null, "max": null }, { "type": "date", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "min": null, "max": null, "format": null }, { "type": "datetime", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "min": null, "max": null, "format": null }, { "type": "time", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "minlength": null, "maxlength": null, "min": null, "max": null, "format": null }, { "type": "select", "label": null, "id": null, "name": null, "value": null, "placeholder": null, "required": null, "readonly": false, "disabled": false, "dropdownSourceName": null, "dropdownSourceData": [], "whomToChange": null }];
    const [dynamicForm, setDynamicForm] = useState([]);
    const [currentForm, setCurrentForm] = useState();

    const [dropdown, setDropdown] = useState();
    const loadData = async () => {
        // match.params.id
        if (match.params.id) {
            await new DynamicFormService().getDynamicFormById(match.params.id).then(res => {
                if (res.status === 200) {
                    if (res.data.data) {
                        setData(res.data.data)
                        setDynamicForm(res.data.data.data)
                    }
                }
            })
        }
        await new DynamicFormDropdownMasterService().getAllDropdown().then((res) => {
            if (res.status == 200) {
                if (res.data.status == 1) {
                    setDropdown(res.data.data.map((d) => ({ label: d.dropdown_name, value: d.id })))
                }
            }
        })
    }

   

    const [showDynamicFormModal, setShowDynamicFormModal] = useState({ display: false, index: null, data: null });

   
    const handleDynamicModal = (e, display, index = null, data = null) => {
        setCurrentForm();
        if (data) {
            setCurrentForm(data);
        }
        setShowDynamicFormModal({ display: display, index: index, data: data });
    }


    const handleDeleteAll = (i) => {
        const newFields = dynamicForm.filter((d, i) => i !== i);
        setDynamicForm(newFields);

      };

    const handleDelete = (i) => {
        const newInputFields = [...dynamicForm];
        newInputFields.splice(i, 1);
        setDynamicForm(newInputFields);
      };




       


    const handleSelectedDropdown = e => {
        setCurrentForm(prev => null);
        setCurrentForm(inputData.filter((d) => d.type === e.target.value)[0]);

    }


 

    const addToForm = e => {
        e.preventDefault();

setCurrentForm(null)
        if (currentForm.label === null) {
            alert("Please enter the label name")

        } else {
            setDynamicForm(prev => [...prev, currentForm])
            setCurrentForm();
        }


    }
   

   

    const handleEditModal = (e, index, data) => {
        // alert(index);
        // setCurrentForm();
        // setCurrentForm(data);
        // setShowDynamicFormModal(true,index,data)
    }
    const EditForm = (index) => {
        dynamicForm[index] = currentForm;
        handleDynamicModal(false, null, null)
    }

    const handleInputChange = async(e) => {
        let temp =[]
        const { name, value } = e.target;
        setCurrentForm({
            ...currentForm,
            [name]: value
        })
        if(value && name == "dropdownSourceName"){
        await new DynamicFormDropdownMasterService().getDropdownById(value).then((res)=>{
            if(res.status === 200){
              if(res.data.status == 1){
                const options = res.data.data.dropdown.map(d => ({ value: d.id, label: d.label }));
                currentForm.dropdownSourceData =options
              setCurrentForm(prevForm => ({
                ...prevForm,
                dropdownSourceData: options
              }));
              }
            }
        })
        loadData()
      }

               

    }
  

   
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            template_name: e.target.template_name.value,
            dynamicForm: dynamicForm
        }
        if (match.params.id) {
            alert(match.params.id);
            await new DynamicFormService().updateDynamicForm(match.params.id, data).then(res => {
                if (res.status === 200) {
                    if (res.data.status === 1) {
                        history.push({
                            pathname: `/${_base}/DynamicForm`,
                            state: { alert: { type: 'success', message: res.data.message } }
                        });
                    } else {
                        setNotify({ type: 'danger', message: res.data.message });
                    }
                } else {
                    setNotify({ type: 'danger', message: res.message });
                    new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
                }
            });
        } else {
            await new DynamicFormService().postDynamicForm(data).then(res => {
                if (res.status === 200) {
                    if (res.data.status === 1) {
                        history.push({
                            pathname: `/${_base}/DynamicForm`,
                            state: { alert: { type: 'success', message: res.data.message } }
                        });
                    } else {
                        setNotify({ type: 'danger', message: res.data.message });
                    }
                } else {
                    setNotify({ type: 'danger', message: res.message });
                    new ErrorLogService().sendErrorLog("User", "Create_User", "INSERT", res.message);
                }
            });
        }
    }

    const [selectedId, setSelectedId] = useState()
    useEffect(() => {
        loadData();
        var selected =[]
         selected = dynamicForm.map(d=> d.dropdownSourceName)
        setSelectedId(selected);
    }, [dynamicForm], selectedId)
    return (
        <>
            <div className="body d-flex py-3">
                <div className="container-xxl">
                    <div className="row clearfix g-3">
                        <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
                            {/*************** HEADING ***************/}
                            <div className="card">
                                <div className="card-header d-flex justify-content-between bg-transparent
                                border-bottom-0">
                                    <h2 className="mb-0 fw-bold ">Dynamic Form</h2>
                                    {/* <Link to="Country/Create/" className="btn btn-dark btn-sm btn-set-task w-sm-100">
                                        <i className="icofont-plus-circle me-2 fs-6" />
                                        Add
                                    </Link> */}
                                </div>
                            </div>
                            {notify && <Alert alertData={notify} />}
                            <Modal show={showDynamicFormModal.display}
                                onHide={e => handleDynamicModal(e, false, null, null)}
                                size="lg"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        {showDynamicFormModal.data ? "Edit Field" : "Add New Field"}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <select
                                        className='form-control form-control-sm'
                                        onChange={handleSelectedDropdown}
                                        defaultValue={showDynamicFormModal.data ? showDynamicFormModal.data.type : ""}

                                    >
                                        <option>Select Type</option>
                                        {inputData.map((d, i) => {
                                            return <option value={d.type}>{d.type.toUpperCase()}</option>
                                        })}
                                    </select>
                                   
                                    {currentForm &&
                                        <div className='row'>
                                            {currentForm.hasOwnProperty('label') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Label Name : <Astrick color="red" size="13px" /></b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"
                                                        name="label"
                                                        defaultValue={currentForm.label}
                                                        onInput={e => handleInputChange(e)}
                                                        onKeyPress={e => {
                                                            Validation.CharacterWithSpace(e)
                                                        }}
                                                        required

                                                    />
                                                </div>
                                            }

                                            {/* {currentForm.hasOwnProperty('name') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Name :</b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"                                                        
                                                        name="name"    
                                                        defaultValue={currentForm.name}
                                                        onInput={e=>handleInputChange(e)}                                                    
                                                    />
                                                </div>
                                            } */}

                                            {currentForm.hasOwnProperty('value') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Default Value :</b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"
                                                        name="defalutValue"
                                                        defaultValue={currentForm.defalutValue}
                                                        onInput={e => handleInputChange(e)}
                                                        onKeyPress={e => {
                                                            Validation.CharacterWithSpace(e)
                                                        }}
                                                    />
                                                </div>
                                            }

                                            {currentForm.hasOwnProperty('placeholder') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Placeholder :</b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"
                                                        name="placeholder"
                                                        defaultValue={currentForm.placeholder}
                                                        onInput={e => handleInputChange(e)}
                                                        onKeyPress={e => {
                                                            Validation.CharacterWithSpace(e)
                                                        }}
                                                    />
                                                </div>
                                            }
                                            {currentForm.hasOwnProperty('required') &&
                                                <div className='col-md-3'>
                                                    <label><b>Required :</b></label>
                                                    <select className="form-control form-control-sm"
                                                        type="text"
                                                        name="required"
                                                        defaultValue={currentForm.required}
                                                        onChange={e => handleInputChange(e)}
                                                    >
                                                        <option value="FALSE">No</option>
                                                        <option value="TRUE">Yes</option>
                                                    </select>
                                                </div>
                                            }
                                            {currentForm.hasOwnProperty('readonly') &&
                                                <div className='col-md-3'>
                                                    <label><b>Readonly :</b></label>
                                                    <select className="form-control form-control-sm"
                                                        type="text"
                                                        name="readonly"
                                                        onChange={e => handleInputChange(e)}
                                                        defaultValue={currentForm.readonly}
                                                    >
                                                        <option value="FALSE">No</option>
                                                        <option value="TRUE">Yes</option>
                                                    </select>
                                                </div>
                                            }

                                            {currentForm.hasOwnProperty('disabled') &&
                                                <div className='col-md-3'>
                                                    <label><b>Disabled :</b></label>
                                                    <select className="form-control form-control-sm"
                                                        type="text"
                                                        name="disabled"
                                                        defaultValue={currentForm.disabled}
                                                        onChange={e => handleInputChange(e)}
                                                    >
                                                        <option value="NO">No</option>
                                                        <option value="YES">Yes</option>
                                                    </select>
                                                </div>
                                            }
                                            {currentForm.hasOwnProperty('cols') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Cols :</b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"
                                                        name="cols"
                                                        defaultValue={currentForm.cols}
                                                        onInput={e => handleInputChange(e)}
                                                        maxLength={1}
                                                        onKeyPress={e => {
                                                            Validation.NumbersOnly(e)
                                                        }}
                                                    />
                                                </div>
                                            }
                                            {currentForm.hasOwnProperty('minlength') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Min Length :</b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"
                                                        name="minlength"
                                                        defaultValue={currentForm.minlength}
                                                        onInput={e => handleInputChange(e)}
                                                        onKeyPress={e => {
                                                            Validation.NumbersOnly(e)
                                                        }}
                                                    />
                                                </div>
                                            }
                                            {currentForm.hasOwnProperty('maxlength') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Max Length :</b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"
                                                        name="maxlength"
                                                        defaultValue={currentForm.maxlength}
                                                        onInput={e => handleInputChange(e)}
                                                        onKeyPress={e => {
                                                            Validation.NumbersOnly(e)
                                                        }}
                                                    />
                                                </div>
                                            }
                                            {currentForm.hasOwnProperty('min') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Min Value :</b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"
                                                        name="min"
                                                        defaultValue={currentForm.min}
                                                        onInput={e => handleInputChange(e)}
                                                        onKeyPress={e => {
                                                            Validation.NumbersOnly(e)
                                                        }}
                                                    />
                                                </div>
                                            }
                                            {currentForm.hasOwnProperty('max') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Max Value :</b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"
                                                        name="max"
                                                        defaultValue={currentForm.max}
                                                        onInput={e => handleInputChange(e)}
                                                        onKeyPress={e => {
                                                            Validation.NumbersOnly(e)
                                                        }}
                                                    />
                                                </div>
                                            }

                                            {currentForm.hasOwnProperty('format') &&
                                                <div className='col-md-3'>
                                                    <label><b>Enter Format :</b></label>
                                                    <input className="form-control form-control-sm"
                                                        type="text"
                                                        name="format"
                                                        defaultValue={currentForm.format}
                                                        onInput={e => handleInputChange(e)}
                                                    />
                                                </div>
                                            }
                                            {currentForm.hasOwnProperty('dropdownSourceName') && dropdown &&
                                                <div className='col-md-3'>
                                                    <label><b>Dropdown Source :</b></label>
                                                    <select className="form-control form-control-sm"
                                                        name="dropdownSourceName"
                                                        defaultValue={currentForm.dropdownSourceName}
                                                        onChange={(e,index) => handleInputChange(e, index)}
                                                    >
                                                        <option value="">Select Source</option>
                                                        {dropdown && dropdown.map((d, i) => {
                                                            return <option value={d.value}>{d.label}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            }

                                            {/* {currentForm.hasOwnProperty('dropdownSourceData') &&
                                                <div className='col-md-3'>
                                                <label><b>Dropdown Source Data:</b></label>
                                                <select className="form-control form-control-sm"                                                      
                                                    name="dropdownSourceData"
                                                    defaultValue={currentForm.dropdownSourceData}
                                                    onChange={e=>handleInputChange(e)}
                                                    >
                                                </select>
                                            </div>
                                            } */}
                                           
                                            {currentForm.hasOwnProperty('whomToChange') &&
                                                <div className='col-md-3'>
                                                    <label><b>Make Change In :</b></label>
                                                    <select className="form-control form-control-sm"
                                                        name="whomToChange"
                                                        defaultValue={currentForm.whomToChange}
                                                        onChange={e => handleInputChange(e)}
                                                    >
                                                        <option value="">Select Child</option>
                                                        {selectedId && dropdown &&
                                                           dropdown.filter(d => selectedId.includes(JSON.stringify(d.value))).map((d, i) => {
                                                             return <option key={d.name} value={d.name}>{d.label}</option>
                                                           })
                                                        }
                                                    </select>
                                                </div>
                                            }
                                        </div>
                                    }
                                </Modal.Body>
                                <Modal.Footer>
                                    <button type="button" className="btn btn-sm btn-danger" onClick={e => handleDynamicModal(e, false, null, null)}>
                                        Close
                                    </button>
                                    {(showDynamicFormModal.data) ?
                                        <button type="button" className="btn btn-sm btn-secondary" onClick={(e) => EditForm(showDynamicFormModal.index)}>
                                            Edit From
                                        </button>
                                        :
                                        <button type="button" className="btn btn-sm btn-warning" onClick={(e) => addToForm(e)}>
                                            Add To From
                                        </button>
                                    }
                                </Modal.Footer>
                            </Modal>

                            {/*************** TABLE ***************/}
                            <div className='card mt-2'>
                                <div className='card-body'>
                                    <form onSubmit={handleSubmit}>
                                        <div className='row'>
                                            <div className='col-md-2'>
                                                <label><b>Form Name :<Astrick color="red" size="13px" /></b></label>
                                            </div>
                                            <div className='col-md-4'>
                                                <input type="text" className='form-control form-control-sm'
                                                    name='template_name' id='template_name'
                                                    defaultValue={data ? data.template_name : ""}
                                                    required
                                                    onKeyPress={e => {
                                                        Validation.CharactersNumbersOnly(e)
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-12 text-right' style={{ textAlign: "right" }}>
                                                <button type="button" className="btn btn-sm btn-primary"
                                                    onClick={e => handleDynamicModal(e, true, null, null)}>
                                                    Add New Field
                                                </button>
                                            </div>
                                        </div>


                                        {/* {dynamicForm && JSON.stringify(dynamicForm)} */}

                                        <div class="row" >
                                            {dynamicForm && dynamicForm.map((d, i) => {
                                                if (d.type == "text") {
                                                    return <div class="col-md-4" key={Math.random()}>
                                                        <label><b>{d.label} : </b></label>
                                                        <input type="text"
                                                            className="form-control"
                                                            id={d.id}
                                                            name={d.label.replace(' ', '_').toLowerCase()}
                                                            defaultValue={d.defalutValue}
                                                            // readOnly={(d.readonly) ? false : true}
                                                            readOnly={ d.readonly == "TRUE" }
                                                            placeholder={d.placeholder}
                                                        // required={d.required}
                                                        // readonly={d.readonly}
                                                        // disabled={d.disabled}
                                                        />

                                                        <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
                                                        <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>


                                                    </div>
                                                }
                                                if (d.type == "textarea") {
                                                    return <div class="col-md-4">
                                                        <label><b>{d.label} :</b></label>
                                                        <textarea
                                                            className="form-control"
                                                            id={d.id}
                                                            name={d.name}
                                                            defaultValue={d.defaultValue}
                                                            placeholder={d.placeholder}
                                                            // required={d.required}
                                                            // readonly={d.readonly}
                                                            // disabled={d.disabled}
                                                            cols={d.cols}
                                                        />
                                                        <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
                                                        <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={() => handleDelete(i)} >Delete</button>
                                                   
                                                    </div>
                                                }
                                                if (d.type == "number") {
                                                    return <div class="col-md-4">
                                                        <label><b>{d.label} :</b></label>
                                                        <input type="number"
                                                            className="form-control"
                                                            id={d.id}
                                                            name={d.name}
                                                            defaultValue={d.defaultValue}
                                                            placeholder={d.placeholder}
                                                            // required={d.required}
                                                            // readonly={d.readonly}
                                                            // disabled={d.disabled}
                                                            minLength={d.minlength}
                                                            maxLength={d.maxlength}
                                                            min={d.min}
                                                            max={d.max}
                                                        />
                                                        <button type="button" className="btn btn-sm btn-primary" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
                                                    </div>
                                                }
                                                if (d.type == "date") {
                                                    return <div class="col-md-4">
                                                        <label><b>{d.label} :</b></label>
                                                        <input type="date"
                                                            className="form-control"
                                                            id={d.id}
                                                            name={d.name}
                                                            defaultValue={d.defaultValue}
                                                            placeholder={d.placeholder}
                                                            // required={d.required}
                                                            // readonly={d.readonly}
                                                            // disabled={d.disabled}
                                                            min={d.min}
                                                            max={d.max}
                                                        />
                                                        <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
                                                    </div>

                                                }
                                                if (d.type == "datetime") {
                                                    return <div class="col-md-4">
                                                        <label><b>{d.label} :</b></label>
                                                        <input type="datetime"
                                                            className="form-control"
                                                            id={d.id}
                                                            name={d.name}
                                                            defaultValue={d.defaultValue}
                                                            placeholder={d.placeholder}
                                                            // required={d.required}
                                                            // readonly={d.readonly}
                                                            // disabled={d.disabled}
                                                            min={d.min}
                                                            max={d.max}
                                                            format={d.format}
                                                        />
                                                        <button type="button" style={{ width: '17%' }} className="btn btn-sm btn-primary mt-3" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
                                                    </div>
                                                }
                                                if (d.type == "time") {
                                                    return <div class="col-md-4">
                                                        <label><b>{d.label} :</b></label>
                                                        <input type="time"
                                                            className="form-control"
                                                            id={d.id}
                                                            name={d.name}
                                                            defaultValue={d.defaultValue}
                                                            placeholder={d.placeholder}
                                                            // required={d.required}
                                                            // readonly={d.readonly}
                                                            // disabled={d.disabled}
                                                            min={d.min}
                                                            max={d.max}
                                                            format={d.format}
                                                        />
                                                    </div>
                                                }
                                                if (d.type == "select") {
                                                    return <div class="col-md-4">
                                                        <label><b>{d.label} :</b></label>
                                                        <Select className="form-control"
                                                            id={d.id}
                                                            name={d.name}
                                                            defaultValue={d.defaultValue}
                                                            options={d.dropdownSourceData}
                                                        // required={d.required}
                                                        // readonly={d.readonly}
                                                        // disabled={d.disabled}
                                                        />
                                                        <div className="mt-5">
                                                            <button type="button" className="btn btn-sm btn-primary" onClick={e => handleDynamicModal(e, true, i, d)}>Edit</button>
                                                        </div>
                                                    </div>
                                                }
                                            })
                                            }
                                        </div>
                                       {dynamicForm.length > 0 &&

                                        <div className="mt-4">
                                            <button type="submit" className='btn btn-sm btn-primary'>Submit</button>
                                            <button type="button" className='btn btn-sm btn-primary'onClick={() => handleDeleteAll()} >Clear All Field</button>

                                        </div>

                                      }

                                    </form>

                                </div>   {/* Card Body */}
                            </div>{/* Card */}
                        </div>

                    </div> {/*ROW*/}
                </div>{/*CONTAINER*/}
            </div>{/*BODY*/}
        </>
    )
}


export default CreateDynamicForm