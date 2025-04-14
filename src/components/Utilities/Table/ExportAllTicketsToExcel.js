import React, { useState } from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import MyTicketService from '../../../services/TicketService/MyTicketService';
import { Button, LinearProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportService from '../../../services/ReportService/ReportService';
import moment from 'moment';

export const ExportAllTicketsToExcel = ({
  fileName,
  typeOf,
  columnFilters,
  gridData = []
}) => {
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

    let dataToDownload = [];

    const hasColumnFilters = columnFilters?.some((filter) => {
      const value = filter?.value;

      if (filter.id === 'ticket_date' && Array.isArray(value)) {
        return value[0] || value[1];
      }

      if (Array.isArray(value)) {
        return value.some((v) => v);
      }

      return !!value;
    });

    try {
      if (hasColumnFilters) {
        const fromDateRaw = columnFilters.find((f) => f.id === 'ticket_date')
          ?.value?.[0];
        const toDateRaw = columnFilters.find((f) => f.id === 'ticket_date')
          ?.value?.[1];
        const getFormattedDate = (date) =>
          date ? moment(date).format('YYYY-MM-DD') : '';
        const payload = {
          department_id:
            columnFilters.find(
              (f) => f.id === 'assign_to_department.department'
            )?.value || [],
          status_id: columnFilters.find((f) => f.id === 'Status')?.value || [],
          ticket_id:
            columnFilters.find((filter) => filter.id === 'ticket_id')?.value ||
            '',
          assign_to_user_id:
            columnFilters.find((f) => f.id === 'Assigned To')?.value || [],
          from_date: getFormattedDate(fromDateRaw),
          to_date: getFormattedDate(toDateRaw),
          export: 'export'
        };

        const res = await new ReportService().getTicketReport(payload);

        if (res.status === 200 && res.data.status === 1) {
          dataToDownload = res.data.data;
        }
      } else {
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

        const res = await new MyTicketService().getUserTicketsTest(form);

        if (res.status === 200 && res.data.status === 1) {
          dataToDownload = res.data.data;
        }
      }

      if (dataToDownload.length > 0) {
        const tempExport = dataToDownload.map((item) => ({
          TICKET_ID: item.ticket_id,
          TICKET_DATE: item.ticket_date,
          EXPECTED_SOLVE_DATE: item.expected_solve_date,
          ASSIGN_TO_DEPARTMENT: item.assign_to_department?.department,
          ASSIGN_TO_USER: item.assign_to_user,
          QUERY_TYPE_NAME: item?.query_type?.query_type_name,
          PRIORITY: item.priority,
          DESCRIPTION: item.description,
          CREATED_BY: item.created_by_name,
          Confirmation_Required: item.confirmation_required ? 'YES' : 'NO',
          Ref_id: item.cuid,
          from_department_name: item.from_department_name,
          module_name: item?.module?.module_name,
          Passed_Status: item.passed_status,
          Passed_Status_Changed_At: item.passed_status_changed_at,
          Passed_Status_Changed_By_Name: item.passed_status_changed_by_name,
          Passed_Status_Remark: item.passed_status_remark,
          project_name: item?.project?.project_name,
          Status_name: item?.status?.status,
          sub_module_name: item?.sub_module?.sub_module_name
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
        disabled={loading || gridData.length === 0}
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
