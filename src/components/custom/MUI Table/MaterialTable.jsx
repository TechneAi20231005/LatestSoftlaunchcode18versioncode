import React, { useState, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import NotFound from '../../NotFound';

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
  enableColumnFilter = true
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
  console.log(isLoading, 'isLoading');

  const handleExportData = () => {};

  const [expandColumn, setExpandColumn] = useState(false);

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

  return (
    <Box
      sx={{
        '& tbody > .MuiTableRow-root': { height: 45 },
        '& .MuiCircularProgress-root': { display: 'none' }
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MaterialReactTable
          columns={updatedColumns}
          data={data}
          enableSorting={enableSorting}
          enablePagination={enablePagination}
          enableFilters={enableFilters}
          localization={{
            noRecordsToDisplay: <NotFound topMargin={0} />,
            noResultsFound: <NotFound topMargin={0} />
          }}
          enableStickyHeader={enableStickyHeader}
          enableGrouping={enableGrouping}
          enableFullScreenToggle={data?.length > 0}
          enableColumnResizing={enableColumnResizing}
          enableColumnOrdering={enableColumnOrdering}
          enableFacetedValues={enableFacetedValues}
          enableColumnFilter={enableColumnFilter}
          muiTableBodyCellProps={{
            onMouseOver: handleMouseHover
          }}
          muiTableHeadCellProps={({ column }) => ({
            onClick: () => {
              handleColumnMenuOpen();
            }
          })}
          render
          state={{ isLoading: isLoading }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                padding: '8px',
                flexWrap: 'wrap'
              }}
            >
              <Button
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
              </Button>
            </Box>
          )}
        />
      </LocalizationProvider>
    </Box>
  );
}

export default MaterialTable;
