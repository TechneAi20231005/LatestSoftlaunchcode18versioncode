import React, { useEffect, useState } from 'react';
import {
  MaterialReactTable
} from 'material-react-table';
import { Box } from '@mui/material';


function MaterialTable({ columns, data, }) {
  const handleMouseHover = (event) => {
    const clickedRow = event.currentTarget;
    const innerText = clickedRow.innerText;
    clickedRow.setAttribute('title', innerText);
  };

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    console.log(rowData, 'rowData');
  };
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(()=> {
   console.log(columnFilters, 'columnFilters')
  },[columnFilters])

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
        enableSorting
        enablePagination
        enableFilters
        enableStickyHeader
        enableGrouping
        enableFullScreenToggle={true}
        enableColumnResizing
        enableColumnOrdering={false}
        enableFacetedValues
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
        state={{ isLoading: data?.length === 0  }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              padding: '8px',
              flexWrap: 'wrap'
            }}
          >
            <button
              className="btn btn-danger"
              onClick={() =>
                handleExportRows(table.getPrePaginationRowModel().rows)
              }
              disabled={data?.length === 0}
              type="button"
            >
              <>
                <i className="icofont-download" />
                {'Export'}
              </>
            </button>
          </Box>
        )}
      />
    </Box>
  );
}

export default MaterialTable;
