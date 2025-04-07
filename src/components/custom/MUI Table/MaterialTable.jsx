import React, { useState, useMemo, useEffect } from 'react';
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import NotFound from '../../NotFound';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { grey } from '@mui/material/colors';

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
  reset = false,
  setReset = () => {}
}) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [groupBy, setGroupBy] = useState([]);
  const [globalFilter, setGlobalFilter] = useState([]);
  const [showGlobalFilter, setShowGlobalFilter] = useState(false);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
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

  const handleColumnMenuToggle = () => {
    setExpandColumn(!expandColumn);
  };

  const resetFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    setPagination({ pageIndex: 0, pageSize: 10 });
    setRowSelection({});
    setColumnVisibility({});
    setGroupBy([]);
    setGlobalFilter([]);
    setShowGlobalFilter(false);
    setShowColumnFilters(false);
    setReset(false);
    setExpandColumn(false);
  };
  useEffect(() => {
    if (reset) {
      resetFilters();
    }
  }, [reset]);

  const updatedColumns = useMemo(() => {
    return columns.map((col) => {
      if (col?.filterVariant === 'date-range') {
        return {
          ...col,
          size: expandColumn ? 350 : 190,
          muiFilterTextFieldProps: (column) => ({
            placeholder: column?.rangeFilterIndex === 0 ? 'From' : 'To'
          }),
          filterFn: (row, columnId, filterValues) => {
            if (!filterValues[0] && !filterValues[1]) return true;

            const rowDate = new Date(row.getValue(columnId));
            const fromDate = filterValues[0] ? new Date(filterValues[0]) : null;
            const toDate = filterValues[1] ? new Date(filterValues[1]) : null;
            if (toDate) toDate.setHours(23, 59, 59, 999);

            return (
              (!fromDate || rowDate >= fromDate) &&
              (!toDate || rowDate <= toDate)
            );
          }
        };
      }
      return col;
    });
  }, [expandColumn]);

  return (
    <Box
      sx={{
        '& tbody > .MuiTableRow-root': { height: 50 },
        '& .MuiCircularProgress-root': { display: 'none' },
        '& .css-wsew38': {
          sm: { flexDirection: 'row' },
          xs: { flexDirection: 'column' },
          alignItems: 'center'
        },
        '& .css-1p0wbhh': {
          marginY: 'auto'
        }
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MaterialReactTable
          columns={updatedColumns}
          data={data}
          muiSkeletonProps={{
            animation: 'wave',
            sx: {
              backgroundColor: 'rgba(8, 2, 2, 0.5)'
            }
          }}
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
            onMouseOver: handleMouseHover,
            style: {
              display: '-webkit-box',
              WebkitLineClamp: 0.5,
              /*WebkitBoxOrient: 'vertical', */
              overflow: 'hidden',
              lineHeight: '1.5rem'
            }
          }}
          render
          state={{
            isLoading: isLoading,
            columnFilters,
            sorting,
            pagination,
            rowSelection,
            columnVisibility,
            globalFilter,
            grouping: groupBy,
            showGlobalFilter,
            showColumnFilters
          }}
          muiTableHeadCellProps={({ column }) => ({
            onClick: (event) => {
              const isFilterIconClicked = event.target.innerText
                .toLowerCase()
                .startsWith('filter by ');
              if (isFilterIconClicked && column.getCanFilter()) {
                handleColumnMenuToggle();
              }
            }
          })}
          onGroupingChange={setGroupBy}
          onColumnFiltersChange={setColumnFilters}
          onSortingChange={setSorting}
          onPaginationChange={setPagination}
          onRowSelectionChange={setRowSelection}
          onColumnVisibilityChange={setColumnVisibility}
          onGlobalFilterChange={setGlobalFilter}
          onShowGlobalFilterChange={setShowGlobalFilter}
          onShowColumnFiltersChange={setShowColumnFilters}
          renderToolbarInternalActions={({ table }) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                md: { flexWrap: 'nowrap' },
                sm: { flexWrap: 'wrap' },
                marginY: 'auto'
              }}
            >
              <MRT_ToggleGlobalFilterButton table={table} />
              <Tooltip title="Clear Filters" arrow>
                <IconButton
                  disabled={
                    table.getState().columnFilters?.length === 0 &&
                    JSON.stringify(table.getState().rowSelection) === '{}' &&
                    JSON.stringify(table.getState().columnVisibility) ===
                      '{}' &&
                    table.getState().pagination.pageIndex === 0 &&
                    table.getState().pagination.pageSize === 10 &&
                    table.getState().sorting?.length === 0 &&
                    (table.getState().globalFilter === undefined ||
                      table.getState().globalFilter?.length === 0) &&
                    table.getState().grouping?.length === 0
                  }
                  onClick={resetFilters}
                >
                  <FilterAltOffIcon
                    sx={{
                      color:
                        table.getState().columnFilters?.length === 0 &&
                        JSON.stringify(table.getState().rowSelection) ===
                          '{}' &&
                        JSON.stringify(table.getState().columnVisibility) ===
                          '{}' &&
                        table.getState().pagination.pageIndex === 0 &&
                        table.getState().pagination.pageSize === 10 &&
                        table.getState().sorting?.length === 0 &&
                        (table.getState().globalFilter === undefined ||
                          table.getState().globalFilter?.length === 0) &&
                        table.getState().grouping?.length === 0
                          ? (theme) => theme.palette.action.disabled
                          : grey[600]
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Box onClick={handleColumnMenuToggle}>
                <MRT_ToggleFiltersButton table={table} />
              </Box>
              <MRT_ShowHideColumnsButton table={table} />
              <MRT_ToggleFullScreenButton table={table} />
            </Box>
          )}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                padding: '8px',
                flexWrap: 'wrap',
                xs: { width: '100%' },
                sm: { width: 'fit-content' }
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
