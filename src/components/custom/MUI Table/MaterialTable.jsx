import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import NotFound from '../../NotFound';
import { errorHandler } from '../../../utils';
import ReportService from '../../../services/ReportService/ReportService';
import { ExportAllTicketsToExcel } from '../../Utilities/Table/ExportAllTicketsToExcel';

function MaterialTable({
  columns,
  data,
  enableSorting = true,
  enablePagination = true,
  enableFilters = true,
  enableStickyHeader = true,
  enableGrouping = true,
  enableFullScreenToggle = true,
  enableColumnResizing = true,
  enableColumnOrdering = true,
  enableFacetedValues = true,
  isLoading,
  enableColumnFilter = true,
  manualPagination = false,
  pagination,
  setPagination,
  totalRows,
  manualFiltering = false,
  filterSelectOptions,
  onColumnFiltersChange = () => {},
  setAllTicketsData,
  activeTab,
  setTotalRows,
  setColumnFilters,
  columnFilters
}) {
  const handleMouseHover = (event) => {
    const clickedRow = event.currentTarget;
    const innerText = clickedRow.innerText;
    clickedRow.setAttribute('title', innerText);
  };

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    console.log(rowData, 'rowData');
  };

  const handleExportData = () => {};

  const [expandColumn, setExpandColumn] = useState(false);

  // const [columnFilters, setColumnFilters] = useState([]);

  const handleColumnMenuOpen = () => {
    setExpandColumn(true);
  };

  const updatedColumns = useMemo(() => {
    return columns.map((col) => {
      if (col?.filterVariant === 'date-range') {
        return {
          ...col,
          size: expandColumn ? 350 : 180
        };
      }
      return col;
    });
  }, [expandColumn]);

  console.log(activeTab, "activeTab")

  return (
    <Box
      sx={{
        '& tbody > .MuiTableRow-root': { height: 45 },
        '& .MuiCircularProgress-root': { display: 'none' }
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MaterialReactTable
          columns={columns}
          data={data}
          enableSorting={enableSorting}
          enablePagination={enablePagination}
          enableFilters={enableFilters}
          localization={{
            noRecordsToDisplay: <NotFound topMargin={0} />,
            noResultsFound: <NotFound topMargin={0} />
          }}
          rowCount={totalRows}
          enableStickyHeader={enableStickyHeader}
          enableGrouping={enableGrouping}
          enableFullScreenToggle={data?.length > 0}
          enableColumnResizing={enableColumnResizing}
          manualFiltering={manualFiltering}
          enableColumnOrdering={enableColumnOrdering}
          onColumnFiltersChange={setColumnFilters}
          enableFacetedValues={enableFacetedValues}
          filterSelectOptions={filterSelectOptions}
          enableColumnFilter={enableColumnFilter}
          manualPagination={manualPagination}
          onPaginationChange={(newPagination) => {
            setPagination(newPagination);
          }}
          enableRowNumbers={true}
          muiTableBodyCellProps={{
            onMouseOver: handleMouseHover
          }}
          muiTableHeadCellProps={({ column }) => ({
            onClick: () => {
              handleColumnMenuOpen();
            }
          })}
          render
          state={{ isLoading: isLoading, pagination, columnFilters }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                padding: '8px',
                flexWrap: 'wrap'
              }}
            >

               <ExportAllTicketsToExcel
              className="btn btn-sm btn-danger mt-3"
              fileName="Assign To Me"
              typeOf={activeTab}
               />
              {/* <Button
                className="text-primary"
                disabled={data?.length === 0}
                onClick={handleExportData}
                startIcon={<FileDownloadIcon />}
              >
                Export All Data
              </Button>

              <Button
                className="text-primary"
                disabled={data?.length === 0}
                onClick={() =>
                  handleExportRows(table.getPrePaginationRowModel().rows)
                }
                startIcon={<FileDownloadIcon />}
              >
                Export All Rows
              </Button> */}
            </Box>
          )}
        />
      </LocalizationProvider>
    </Box>
  );
}

export default MaterialTable;
