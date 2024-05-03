import React, {useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table';
import PageHeader from '../../../components/Common/PageHeader';
import DataTable from "react-data-table-component";
import { Link } from 'react-router-dom';
import { _base } from "../../../settings/constants";
import { Dropdown } from 'react-bootstrap';
import ConsolidatedService from '../../../services/ProjectManagementService/ConsolidatedService'


const PendingTicket = ({match}) => {
  const projectId = match.params.projectId
const moduleId = match.params.moduleId
  const [data, setData] = useState(null)

const columns=[
  {
    name: "Action", selector: (row) => 
      <Link to={`/${_base}/Ticket/View/`+row.id}>
      <button
        type="button"
        style={{marginRight: "5px",borderRadius: "20px",}}
        className="btn btn-sm btn-primary">
        <i class="icofont-eye-open"></i>
        
      </button>
      </Link>
    , sortable: true,
  },
 
  { name: "Ticket Id", selector: (row) => row.ticket_id, sortable: true },
  { name: "Description", selector: (row) => row.description, sortable: true },
  { name: "Ticket Date", selector: (row) => row.ticket_date, sortable: true },
  { name: "Expected Date", selector: (row) => row.expected_solve_date, sortable: true },
  { name: "Priority", selector: (row) => row.priority, sortable: true },
  { name: "Type", selector: (row) => row.query_type_name, sortable: true },
  { name: "Assign To Dept", selector: (row) => row.department_name, sortable: true },
  { name: "Assign To", selector: (row) => row.assing_to_user_name, sortable: true },
  { name: "Created By", selector: (row) => row.created_by_name, sortable: true },
]

const loadData = async() => {
  const data = []
  await new ConsolidatedService().getModulesTicketData(projectId,moduleId, "PENDING").then((res)=>{
    if (res.status === 200) {
      let counter = 1;
      const temp = res.data.data
      for (const key in temp) {
        data.push({
          counter: counter++,
          id: temp[key].id,
          ticket_id: temp[key].ticket_id,
          description: temp[key].description,
          ticket_date: temp[key].ticket_date,
          expected_solve_date: temp[key].expected_solve_date,
          priority: temp[key].priority,
          query_type_name: temp[key].query_type_name,
          department_name: temp[key].department_name,
          assing_to_user_name: temp[key].assing_to_user_name,
          created_by_name: temp[key].created_by_name
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
      
      <PageHeader headerTitle="Pending Tickets"></PageHeader>
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

export default PendingTicket