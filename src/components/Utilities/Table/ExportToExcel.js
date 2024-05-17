import React from 'react';
import { Spinner } from 'react-bootstrap';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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
}) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = async (apiData, fileName) => {
    if (onApiClick) {
      await onApiClick();
      const ws = XLSX.utils.json_to_sheet(apiData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
      onClickHandler && onClickHandler();
    } else {
      const ws = XLSX.utils.json_to_sheet(apiData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
      onClickHandler && onClickHandler();
    }
  };

  return (
    <button
      className={` ${className} ${isLoading && 'px-4'} text-white`}
      onClick={e => exportToCSV(apiData, fileName)}
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
