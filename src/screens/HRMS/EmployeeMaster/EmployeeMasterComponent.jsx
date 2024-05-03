import React, { useEffect, useState, useRef } from 'react'
import PageHeader from '../../../components/Common/PageHeader'
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel'
import { Link } from "react-router-dom";
import { _base } from '../../../settings/constants';

const EmployeeMasterComponent = () => {
  const [exportData, setExportData] = useState(null)

  const searchRef = useRef()
  const handleSearch = e => {
    const search = searchRef.current.value
    //   if (search.length > 0) {
    //     const temp1 = dataa.filter((d) => {
    //       return (d.name ? d.name : "")

    //         .toLowerCase()
    //         .match(new RegExp(search.toLowerCase(), "g"));
    //     });
    // }
  }

  //Search As Enter key press
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }
  return (
    <div className='container-xxl'>
      {/* {notify && flag == 1 && <Alert alertData={notify} />} */}

      <PageHeader
        headerTitle='Employee Master'
        renderRight={() => {
          return (

              <div className='col-auto d-flex w-sm-100'>
                <Link to={`/${_base + "/Employee/Create"}`}
                  className="btn btn-dark btn-set-task w-sm-100">
                <i className='icofont-plus-circle me-2 fs-6'></i>Add Employee
                </Link>
              </div>
                   )
                }}
              />
              <div className='card card-body'>
                <div className='row'>
                  <div className='col-md-9'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Search by Employee Name....'
                      ref={searchRef}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className='col-md-3'>
                    <button
                      className='btn btn-sm btn-warning text-white'
                      type='button'
                      onClick={handleSearch}
                      style={{ marginTop: '0px', fontWeight: '600' }}
                    >
                      <i className='icofont-search-1 '></i> Search
                    </button>
                    <button
                      className='btn btn-sm btn-info text-white'
                      type='button'
                      onClick={() => window.location.reload(false)}
                      style={{ marginTop: '0px', fontWeight: '600' }}
                    >
                      <i className='icofont-refresh text-white'></i> Reset
                    </button>
                    <ExportToExcel
                      className='btn btn-sm btn-danger'
                      apiData={exportData}
                      fileName='User master Records'
                    />
                  </div>
                </div>
              </div>
     
    </div>
  )
}

export default EmployeeMasterComponent
