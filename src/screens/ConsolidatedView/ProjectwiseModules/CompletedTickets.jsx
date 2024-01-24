// import React, { useState, useEffect } from 'react'
// import Table from 'react-bootstrap/Table';
// import { Link } from 'react-router-dom';
// import { _base } from "../../../../settings/constants";
// import { Dropdown } from 'react-bootstrap';
// import PageHeader from '../../../../components/Common/PageHeader';
// import DataTable from "react-data-table-component";
// import ConsolidatedService from '../../../../services/ProjectManagementService/ConsolidatedService';

// const CompletedTickets = ({ match }) => {
//   const projectId = match.params.project_id
//   const [data, setData] = useState(null)

//   const loadData = async () => {
//     const data = []
//     await new ConsolidatedService().getTicketData(projectId, "COMPLETED").then((res) => {
//       if (res.status === 200) {
//         let counter = 1;
//         const temp = res.data.data
//         for (const key in temp) {
//           data.push({
//             counter: counter++,
//             id: temp[key].id,
//             ticket_id: temp[key].ticket_id,
//             description: temp[key].description,
//             ticket_date: temp[key].ticket_date,
//             expected_solve_date: temp[key].expected_solve_date,
//             priority: temp[key].priority,
//             type_id: temp[key].type_id,
//             department_name: temp[key].department_name,
//             assing_to_user_name: temp[key].assing_to_user_name,
//             created_by_name: temp[key].created_by_name
//           })
//         }
//       }
//     })

//     setData(null)
//     setData(data)


//   }

//   const columns = [
//     {
//       name: "Action", selector: (row) => 
//         <Link to={`/${_base}/Ticket/View/`+row.id}>
//         <button
//           type="button"
//           style={{marginRight: "5px",borderRadius: "20px",}}
//           className="btn btn-sm btn-primary">
//           <i class="icofont-eye-open"></i>
          
//         </button>
//         </Link>
//       , sortable: true,
//     },
//     { name: "Ticket Id", selector: (row) => row.ticket_id, sortable: true },
//     { name: "Description", selector: (row) => row.description, sortable: true },
//     { name: "Ticket Date", selector: (row) => row.ticket_date, sortable: true },
//     { name: "Expected Date", selector: (row) => row.expected_solve_date, sortable: true },
//     { name: "Priority", selector: (row) => row.priority, sortable: true },
//     { name: "Type", selector: (row) => row.type_id, sortable: true },
//     { name: "Assign To Dept", selector: (row) => row.department_name, sortable: true },
//     { name: "Assign To", selector: (row) => row.assing_to_user_name, sortable: true },
//     { name: "Created By", selector: (row) => row.created_by_name, sortable: true },
//   ]

 
//   useEffect(() => {
//     loadData()
//   }, [])
//   return (
//     <div className="container-xxl">
    
//       <PageHeader headerTitle="Completed Tickets"></PageHeader>

//       <div className="card-body shadow-lg p-3 mb-2 mt-4 bg-white rounded">
//         {data && <DataTable
//           columns={columns}
//           data={data}
//           defaultSortField="title"
//           pagination
//           selectableRows={false}
//           className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
//           highlightOnHover={true}
//         />
//         }


//         {/* <Table  striped bordered hover size="sm">
//         <thead>
//           <tr>
//             <th className="bg bg-primary" style={{textAlign:"center", color:"white"}}>SR No</th>
//             <th className="bg bg-primary" style={{textAlign:"center", color:"white"}}>Completed Tickets</th>
//           </tr>
//         </thead>

//         <tbody>
//           <tr>
//             <td style={{textAlign:"center"}}>1</td>
//             <td style={{textAlign:"center"}}>TS1660</td>
//           </tr>

//           <tr style={{marginTop:"10px"}}>
//             <td style={{textAlign:"center"}}>2</td>
//             <td style={{textAlign:"center"}}>TS1700</td>
//           </tr>
          
//           <tr>
//             <td style={{textAlign:"center"}}>3</td>
//             <td style={{textAlign:"center"}}>TS1800</td>
//           </tr>

//           <tr>
//             <td style={{textAlign:"center"}}>4</td>
//             <td style={{textAlign:"center"}}>TS1800</td>
//           </tr>
//         </tbody>
//       </Table> */}
//       </div>
//     </div>

//   )
// }

// export default CompletedTickets

import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { _base } from "../../../settings/constants";
import { Dropdown } from 'react-bootstrap';
import PageHeader from '../../../components/Common/PageHeader';
import DataTable from "react-data-table-component";
import ConsolidatedService from '../../../services/ProjectManagementService/ConsolidatedService';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
const CompletedTickets = ({ match }) => {
  const projectId = match.params.projectId
  const [data, setData] = useState(null)

  const loadData = async () => {
    const data = []
    await new ConsolidatedService().getTicketData(projectId, "COMPLETED").then((res) => {
      // alert(project_id)
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
            type_id: temp[key].type_id,
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

  const columns = [
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
    { name: "Description",width: "250px", selector: (row) => row.description, cell: (row) => (
      <div role="group">
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="task_name">{row.description}</Tooltip>}
        >
          <div>
            {row.description.length > 10 ? row.description.substring(0, 25) + "..." : row.description}
          </div>
        </OverlayTrigger>
      </div>
    ) },
    { name: "Ticket Date", selector: (row) => row.ticket_date, sortable: true },
    { name: "Expected Date", selector: (row) => row.expected_solve_date, sortable: true },
    { name: "Priority", selector: (row) => row.priority, sortable: true },
    { name: "Type", selector: (row) => row.type_id, sortable: true },
    { name: "Assign To Dept", selector: (row) => row.department_name, sortable: true },
    { name: "Assign To", selector: (row) => row.assing_to_user_name, sortable: true },
    { name: "Created By", selector: (row) => row.created_by_name, sortable: true },
  ]

 
  useEffect(() => {
    loadData()
  }, [])
  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Completed Tickets"></PageHeader>

      <div className="card-body shadow-lg p-3 mb-2 mt-4 bg-white rounded">
        {data && <DataTable
          columns={columns}
          data={data}
          defaultSortField="title"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
        />
        }


        {/* <Table  striped bordered hover size="sm">
        <thead>
          <tr>
            <th className="bg bg-primary" style={{textAlign:"center", color:"white"}}>SR No</th>
            <th className="bg bg-primary" style={{textAlign:"center", color:"white"}}>Completed Tickets</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{textAlign:"center"}}>1</td>
            <td style={{textAlign:"center"}}>TS1660</td>
          </tr>

          <tr style={{marginTop:"10px"}}>
            <td style={{textAlign:"center"}}>2</td>
            <td style={{textAlign:"center"}}>TS1700</td>
          </tr>
          
          <tr>
            <td style={{textAlign:"center"}}>3</td>
            <td style={{textAlign:"center"}}>TS1800</td>
          </tr>

          <tr>
            <td style={{textAlign:"center"}}>4</td>
            <td style={{textAlign:"center"}}>TS1800</td>
          </tr>
        </tbody>
      </Table> */}
      </div>
    </div>

  )
}

export default CompletedTickets