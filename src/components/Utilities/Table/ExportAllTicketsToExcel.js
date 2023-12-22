import React from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import MyTicketService from '../../../services/TicketService/MyTicketService'

export const ExportAllTicketsToExcel = ({
  apiData,
  fileName,
  className,
  buttonTitle,
  typeOf
}) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = async (e, fileName, typeOf) => {
    e.preventDefault()
    var type
    var tempExport = []

    if (typeOf == 'AssignToMe') {
      type = 'AssignToMe'
    }
    if (typeOf == 'CreatedByMe') {
      type = 'CreatedByMe'
    }
    if (typeOf == 'DepartmentWise') {
        type = 'DepartmentWise'
      }
    if (typeOf == 'YourTask') {
        type = 'YourTask'
      }
      if (typeOf == 'UnPassed') {
        type = 'UnPassed'
      }
  

    const form = {
      typeOf: type,
      filter: 'export'
    }
    await new MyTicketService().getUserTicketsTest(form).then(res => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          var dataToDownload =res.data.data.data
          for (const key in dataToDownload) {
            tempExport.push({
              TICKET_ID: dataToDownload[key].ticket_id,
              TICKET_DATE: dataToDownload[key].ticket_date,
              EXPECTED_SOLVE_DATE: dataToDownload[key].expected_solve_date,
              ASSIGN_TO_DEPARTMENT: dataToDownload[key].assign_to_department,
              ASSIGN_TO_USER: dataToDownload[key].assign_to_user,
              QUERY_TYPE_NAME: dataToDownload[key].query_type_name,
              PRIORITY: dataToDownload[key].priority,
              STATUS: dataToDownload[key].status_name,
              DESCRIPTION: dataToDownload[key].description,
              CREATED_BY: dataToDownload[key].created_by_name,
              Confirmation_Required: dataToDownload[key].confirmation_required
                ? 'YES'
                : 'NO',
              Ref_id: dataToDownload[key].cuid,
              from_department_name: dataToDownload[key].from_department_name,
              Status: dataToDownload[key].is_active ? 'Active' : 'Deactive',
              module_name: dataToDownload[key].module_name,
              Passed_Status: dataToDownload[key].passed_status,
              Passed_Status_Changed_At:
                dataToDownload[key].passed_status_changed_at,
              Passed_Status_Changed_By_Name:
                dataToDownload[key].passed_status_changed_by_name,
              Passed_Status_Remark: dataToDownload[key].passed_status_remark,
              project_name: dataToDownload[key].project_name,
              // query_type_name: dataToDownload[key].query_type_name,
              Status_name: dataToDownload[key].status_name,
              sub_module_name: dataToDownload[key].sub_module_name
            })
          }
        }
      }
    })
    const ws = XLSX.utils.json_to_sheet(tempExport)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  return (
    <button
      className={` ${className} text-white`}
      onClick={e => exportToCSV(e, fileName, typeOf)}
    >
      <i className='icofont-download'></i>{' '}
      {buttonTitle ? buttonTitle : 'Export-ALL'}
    </button>
  )
}
