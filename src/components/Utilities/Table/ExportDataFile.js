import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useDispatch } from 'react-redux';
import { resetRequisitionHistoryExportDataList } from '../../../redux/slices/po/history';

// Function to transform data before exporting
export const ExportData = (data, columns) => {
  return data?.map((row, index) => {
    const transformedRow = {
      'Sr No.': index + 1
    };

    columns?.forEach((column) => {
      transformedRow[column.title] = row[column.field] || column.defaultValue || '--';
    });

    return transformedRow;
  });
};

export const ExportToExcel = ({
  apiData,
  fileName,
  className,
  buttonTitle,
  disabled,
  btnType = 'button',
  onClickHandler,
  isLoading,
  onApiClick,
  columns
}) => {
  const dispatch = useDispatch();

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = async (apiData, fileName) => {
    if (onApiClick) {
      await onApiClick();
      onClickHandler && onClickHandler();
    } else {
      const transformedData = ExportData(apiData, columns);
      const ws = XLSX.utils.json_to_sheet(transformedData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
      onClickHandler && onClickHandler();
    }
  };

  useEffect(() => {
    if (onApiClick && apiData?.length) {
      const transformedData = ExportData(apiData, columns);
      const ws = XLSX?.utils?.json_to_sheet(transformedData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
      dispatch(resetRequisitionHistoryExportDataList());
    }
  }, [apiData?.length]);

  return (
    <button
      className={` ${className} ${isLoading && 'px-4'} text-white`}
      onClick={(e) => exportToCSV(apiData, fileName)}
      disabled={disabled}
      type={btnType}
    >
      {isLoading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <>
          <i className="icofont-download" /> {buttonTitle ? buttonTitle : 'Export'}
        </>
      )}
    </button>
  );
};
