import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Astrick } from '../../../components/Utilities/Style'
import PageHeader from '../../../components/Common/PageHeader'
import * as Validation from '../../../components/Utilities/Validation'
function CreateSourceMaster() {
  

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Create Source Master" />
            {/* {data && JSON.stringify(data)} */}
            <div className='card mt-2'>
                <div className='card-body'>
                    <form>
                       
                        {/* {showtype && showtype == "REGULAR" && */}
                            <div>
                                <div className='row mt-2'>
                                    <div className='col-md-2'>
                                        <label><b>Source Name :<Astrick color="red" size="13px" /></b></label>
                                    </div>
                                    <div className='col-md-4'>
                                        <input type="text" className='form-control form-control-sm'
                                            onKeyPress={e => { Validation.CharactersNumbersOnly(e) }}
                                            name='dropdown_name' id='dropdown_name'
                                            required
                                            // onInput={e => handleChange(e)}
                                        />
                                    </div>


                                    <div className="row mt-5">
                                    <div className='col-md-2'>
                                        <label><b>Is Active :<Astrick color="red" size="13px" /></b></label>
                                    </div>
                                                <div className="col-md-1">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="is_active" id="is_active_1" 
                                                        value='1' 
                                                        // checked={queryTypeData.is_active===1 || queryTypeData.is_active==='1'}
                                                        // onChange={e => { changeHandler(e); } }
                                                        />
                                                        <label className="form-check-label">
                                                            Yes
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-1">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="is_active" id="is_active_0" 
                                                        value='0' 
                                                        // checked={queryTypeData.is_active===0 || queryTypeData.is_active==='0'}
                                                        // onChange={e => { changeHandler(e); } }
                                                        />
                                                        <label className="form-check-label" >
                                                           No
                                                        </label>
                                                    </div>
                                                    </div>
                                                </div>


                                </div>

                    
                            </div>
                        {/* } */}
                       
                        <div className='pull-right mt-2'>
                            <button type="submit" className="btn btn-sm btn-primary">Submit</button>
                            {/* <Link to={`/${_base}/DynamicForm`} className="btn btn-sm btn-danger text-white">Cancel</Link> */}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateSourceMaster
