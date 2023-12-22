import React, { useEffect, useRef, useState } from 'react'
import PageHeader from '../../../components/Common/PageHeader'
import Collapse from 'react-bootstrap/Collapse'
import Select from 'react-select'
import { Astrick } from '../../../components/Utilities/Style'
import CityService from '../../../services/MastersService/CityService'

const CreateEmployeeComponent = () => {
  const [open, setOpen] = useState(false)
  const bloodGroups = [
    {value:'A RhD positive (A+)', label:'A RhD positive (A+)'},
    {value:'A RhD negative (A-)', label: 'A RhD negative (A-)'},
    {value:'B RhD positive (B+)', label: 'B RhD positive (B+)'},
    {value:'B RhD negative (B-)', label: 'B RhD negative (B-)'},
    {value:'O RhD positive (O+)', label: 'O RhD positive (O+)'},
    {value:'O RhD negative (O-)', label: 'O RhD negative (O-)'},
    {value:'AB RhD positive (AB+)', label: 'AB RhD positive (AB+)'},
    {value:'AB RhD negative (AB-)', label: 'AB RhD negative (AB-)'},
  ];
  const [cityDropdown, setCityDropdown] = useState()

  const loadData = async() =>{
    await new CityService().getCity().then((res)=>{
        if(res.status === 200){
            if(res.data.status == 1){
                const temp = res.data.data.filter(d=> d.country == "India")
                setCityDropdown(temp.map((d)=>({value:d.id, label:d.city})))
            }
        }
    })
  }

  useEffect(()=>{
    loadData()
  },[])
  return (
    <div className='container-xxl'>
      <PageHeader headerTitle='Create Employee' />
      {/* {notify && <Alert alertData={notify} />}   */}
      <div className='card shadow mt-2'>
        <div className='col-auto d-flex w-sm-100'>
          <b
            style={{ marginLeft: '1.2rem', fontSize: '20px' }}
            className='mt-3'
          >
            Basic Details
          </b>
          <button
            onClick={() => setOpen(!open)}
            aria-controls='example-collapse-text'
            aria-expanded={open}
            style={{ marginTop: '0.9rem' }}
            className='btn btn '
          >
            <i className='icofont-plus-circle me-2 fs-6 '></i>
          </button>
        </div>

        
          <Collapse in={open}>
            <div id='example-collapse-text'>
            <div className='mx-2 mt-2'>
            <div>
        {/* Display employee details */}
        <div className="form-group row ">

        <div className='col-sm-3'>
          <label className=" col-form-label">
            <b>Date of Birth:<Astrick color="red" size="13px" /></b>
          </label>
            <input
              type="date"
              name="date_of_birth"
              className="form-control form-control"
              required
            />
        </div>


        <div className='col-md-3'>
          <label className="col-form-label ">
            <b>Birth Place:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
            
            />
        </div>
        <div className='col-md-3'>
          <label className=" col-form-label">
            <b>Gender:</b>
          </label>
            <select
              className="form-control form-control"
              required
            >
                <option value="">select</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                {/* <option value="OTHER">OTHER</option> */}
            </select>
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Blood Group:</b>
          </label>
            <Select
              options={bloodGroups}
            //   className="form-control"
              
            />
        </div>
        </div>

     
        <div className="form-group row ">
        <div className='col-md-3 '>
          <label className="col-form-label">
            <b>Martial Status:</b>
          </label>
            <select
              className="form-control form-control"
              
            >
                <option value="">select</option>
                <option value="MARRIED">Married</option>
                <option value="UBMARRIED">Unmarried</option>
            </select>
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Date of Anniversary:</b>
          </label>
            <input
              type="date"
              className="form-control form-control"
              
            />
        </div>

        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Nationality:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
              
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Permanent State ID:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
              
            />
        </div>
        </div>


        <div className="form-group row ">
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>City:</b>
          </label>

            <Select
                options={cityDropdown && cityDropdown ? cityDropdown : ""}             
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Pincode:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
            
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Attachment for Document:</b>
          </label>
            <input
              type="file"
              className="form-control form-control"
             
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Present Address:</b>
          </label>
          <textarea
              rows="4"
              className="form-control form-control"
            
            />
        </div>
        </div>

        <div className='form-group row'>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Permanent Address:</b>
          </label>
            <textarea
              rows="4"
              type="text"
              className="form-control form-control"
           
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Personal Contact Number:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
             
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Personal Email ID:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
             
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Aadhar Card Number:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
            
            />
        </div>
        </div>

        <div className='form-group row'>

        <div className='col-md-3'>
          <label className="col-form-label">
            <b>PAN Number:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
            
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Driving License Number:</b>
          </label>
            <input
              type="text"
              className="form-control form-control-sm"
              
            />
        </div>
        <div className='col-md-3'>
          <label className=" col-form-label">
            <b>Driving License Expiry Date:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
             
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Gratuity Number:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
            
            />
        </div>
        </div>

        <div className='form-group row'>
        <div className='col-md-3'>
          <label className=" col-form-label">
            <b>Passport Number:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
            
            />
        </div>
        <div className='col-md-3'>
          <label className="col-form-label">
            <b>Physically Handicapped:</b>
          </label>
            <input
              type="text"
              className="form-control form-control"
            />
          </div>
        </div>
      </div>
            </div>
            </div>
          </Collapse>
        <hr />
      </div>
    </div>
  )
}

export default CreateEmployeeComponent
