import React, { useState } from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import MyTicketService from '../../../services/TicketService/MyTicketService';
import { Button, LinearProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const ExportAllTicketsToExcel = ({ fileName, typeOf }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const exportToCSV = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(10);

    const progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 95) return oldProgress;
        return oldProgress + 5;
      });
    }, 500);

    let type;
    if (
      [
        'AssignToMe',
        'CreatedByMe',
        'DepartmentWise',
        'YourTask',
        'UnPassed'
      ].includes(typeOf)
    ) {
      type = typeOf;
    }

    const form = { typeOf: type, filter: 'export' };

    try {
      const res = await new MyTicketService().getUserTicketsTest(form);

      if (res.status === 200 && res.data.status === 1) {
        let dataToDownload = res.data.data;
        let tempExport = dataToDownload.map((item) => ({
          TICKET_ID: item.ticket_id,
          TICKET_DATE: item.ticket_date,
          EXPECTED_SOLVE_DATE: item.expected_solve_date,
          ASSIGN_TO_DEPARTMENT: item.assign_to_department,
          ASSIGN_TO_USER: item.assign_to_user,
          QUERY_TYPE_NAME: item.query_type_name,
          PRIORITY: item.priority,
          DESCRIPTION: item.description,
          CREATED_BY: item.created_by_name,
          Confirmation_Required: item.confirmation_required ? 'YES' : 'NO',
          Ref_id: item.cuid,
          from_department_name: item.from_department_name,
          module_name: item.module_name,
          Passed_Status: item.passed_status,
          Passed_Status_Changed_At: item.passed_status_changed_at,
          Passed_Status_Changed_By_Name: item.passed_status_changed_by_name,
          Passed_Status_Remark: item.passed_status_remark,
          project_name: item.project_name,
          Status_name: item.status_name,
          sub_module_name: item.sub_module_name
        }));

        const ws = XLSX.utils.json_to_sheet(tempExport);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, fileName + fileExtension);
        setProgress(100);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setLoading(false);
        setCompleted(true);
        setTimeout(() => setCompleted(false), 2000);
      }, 500);
    }
  };

  return (
    <div>
      <Button
        className="text-primary"
        disabled={loading}
        onClick={exportToCSV}
        startIcon={
          completed ? (
            <CheckCircleIcon style={{ color: 'green' }} />
          ) : (
            <FileDownloadIcon />
          )
        }
      >
        {completed
          ? 'Download Complete'
          : loading
          ? `Downloading... ${progress}%`
          : 'Export All Data'}
      </Button>

      {/* Show Progress Bar */}
      {loading && (
        <LinearProgress
          variant="determinate"
          value={progress}
          style={{ marginTop: 10 }}
        />
      )}
    </div>
  );
};
