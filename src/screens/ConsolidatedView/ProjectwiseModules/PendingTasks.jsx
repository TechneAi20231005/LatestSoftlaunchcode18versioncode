import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { _base } from "../../../settings/constants";
import { Dropdown } from 'react-bootstrap';
import PageHeader from '../../../components/Common/PageHeader';
import DataTable from "react-data-table-component";
import ConsolidatedService from '../../../services/ProjectManagementService/ConsolidatedService';
const PendingTasks = ({match}) => {

  const projectId= match.params.projectId

  const [data, setData] = useState(null)

const columns=[ {
  name: "Action", selector: (row) => 
    <Link to={`/${_base}/Ticket/Task/`+row.id}>
    <button
      type="button"
      style={{marginRight: "5px",borderRadius: "20px",}}
      className="btn btn-sm btn-primary">
      <i class="icofont-eye-open"></i>
      
    </button>
    </Link>
  , sortable: true,
},
      // <Dropdown className="d-inline-flex m-1">
      //   <Dropdown.Toggle as="button" variant="" id="dropdown-basic" className="btn btn-primary text-white"                       >
      //     <i className="icofont-listine-dots"></i>
      //   </Dropdown.Toggle>
      //   <Dropdown.Menu as="ul" className="border-0 shadow p-1">
      //     <li> <Link to={`/${_base}/Ticket/View/`} className="btn btn-sm btn-info text-white" style={{ width: "100%", zIndex: 100 }}>
      //       <i className="icofont-external-link "></i> View</Link> </li>
      //   </Dropdown.Menu>
      // </Dropdown>
  
  
  { name: "Ticket Id", selector: (row) => row.ticket_id, sortable: true },
  { name: "Task Name", selector: (row) => row.task_name, sortable: true },
  { name: "Task HRS", selector: (row) => row.task_hours, sortable: true },
  { name: "Delayed Date", selector: (row) => row.expected_solve_date, sortable: true },
]

const loadData = async()=>{
  
  const data =[]
  await new ConsolidatedService().getTaskData(projectId, "PENDING").then((res) => {
  // alert(project_id)

    if (res.status === 200){
      let counter=1;
      const temp=res.data.data
      for(const key in temp){
        data.push({
          counter: counter++,
          id: temp[key].id,
          ticket_id: temp[key].ticket_id,
          task_name: temp[key].task_name,
          task_hours: temp[key].task_hours,
          expected_solve_date: temp[key].expected_solve_date,
        })
      }
    }
  })
     
      setData(null)
      setData(data)
  
  
    }
useEffect(() => {
  loadData()
 },[])


  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Pending Tasks"></PageHeader>

      <div className="card-body shadow-lg p-3 mb-2 mt-4 bg-white rounded">
        {data &&<DataTable
          columns={columns}
          data={data}
          defaultSortField="title"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
        />
        }
      </div>
      </div>
    
  )
}

export default PendingTasks;