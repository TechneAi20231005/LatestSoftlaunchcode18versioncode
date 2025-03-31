import React, { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

function MaterialTable({
  columns,
  data,
  enableSorting = true,
  enablePagination = true,
  enableFilters  = true,
  enableStickyHeader  = true ,
  enableGrouping  = true,
  enableFullScreenToggle  = true,
  enableColumnResizing  = true,
  enableColumnOrdering  = true,
  enableFacetedValues = true,
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
  const [columnFilters, setColumnFilters] = useState([]);

  return (
    <Box
      sx={{
        '& tbody > .MuiTableRow-root': {
          height: 45
        },
        '& .MuiCircularProgress-root': {
          display: 'none'
        }
      }}
    >
      <MaterialReactTable
        columns={columns}
        data={data}
        enableSorting ={enableSorting}
        enablePagination ={enablePagination}
        enableFilters={enableFilters}
        enableStickyHeader={enableStickyHeader}
        enableGrouping={enableGrouping}
        enableFullScreenToggle={enableFullScreenToggle}
        enableColumnResizing={enableColumnResizing}
        enableColumnOrdering={enableColumnOrdering}
        enableFacetedValues={enableFacetedValues}
        muiTableBodyCellProps={{
          onMouseOver: handleMouseHover
        }}
        // manualFiltering
        // onColumnFiltersChange={ setColumnFilters}
        // onColumnFiltersChange={(updater) => {
        //   setColumnFilters((prevFilters) =>
        //     typeof updater === "function" ? updater(prevFilters) : updater
        //   );
        // }}
        state={{ isLoading: data?.length === 0 }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              padding: '8px',
              flexWrap: 'wrap'
            }}
          >
            <Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>
              Export All Data
            </Button>

            <Button
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
    </Box>
  );
}

export default MaterialTable;
