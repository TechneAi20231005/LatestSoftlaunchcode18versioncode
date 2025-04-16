import React, { useState, useMemo, useEffect } from 'react';
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton
} from 'material-react-table';
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Tooltip
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import NotFound from '../../NotFound';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { grey } from '@mui/material/colors';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

function MaterialTable({
  columns,
  data,
  enableSorting = true,
  enablePagination = true,
  enableFilters = true,
  enableStickyHeader = true,
  enableGrouping = true,
  enableFullScreenToggle = true,
  // isExportData = true,
  enableColumnResizing = true,
  enableColumnOrdering = true,
  enableFacetedValues = true,
  isLoading,
  enableColumnFilter = true,
  reset = false,
  exportDataKeys,
  setReset = () => {},
  isExportData = true
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
  };

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleExportData = (exportData) => {
    setLoading(true);
    setProgress(10);
    setCompleted(false);

    const step2 = setTimeout(() => {
      setProgress(50);
    }, 1000);

    const finishExport = setTimeout(() => {
      const dataToExport = [];
      for (let i = 0; i < exportData.length; i++) {
        const payload = {};
        const eachRow = exportData[i]?.original;
        for (let key in exportDataKeys) {
          payload['Sr no'] = i + 1;
          if (key.toLowerCase() !== 'filename') {
            if (eachRow[key] !== undefined && eachRow[key] !== null) {
              if (key === 'is_active') {
                payload[exportDataKeys[key]] =
                  eachRow[key] == 1 ? 'Active' : 'Deactive';
              } else {
                payload[exportDataKeys[key]] = eachRow[key] || '--';
              }
            } else {
              payload[exportDataKeys[key]] = '--';
            }
          }
        }
        dataToExport.push(payload);
      }

      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });

      FileSaver.saveAs(data, exportDataKeys.fileName + fileExtension);

      setProgress(100);
      setCompleted(true);
      setLoading(false);

      setTimeout(() => {
        setProgress(0);
        setCompleted(false);
      }, 2000);
    }, 2000);
    return () => {
      clearTimeout(step2);
      clearTimeout(finishExport);
    };
  };

  const [expandColumn, setExpandColumn] = useState(false);

  const handleColumnMenuToggle = () => {
    setExpandColumn(!expandColumn);
  };

  const globalFilterToggler = () => {
    setShowGlobalFilter(showGlobalFilter ? false : true);
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
  }, [expandColumn, columns]);

  const isFilterNotApplied =
    (columnFilters?.length === 0 ||
      (Array.isArray(columnFilters) &&
        Array.isArray(columnFilters?.[0]?.value) &&
        columnFilters?.[0]?.value?.every((value) => !value))) &&
    JSON.stringify(rowSelection) === '{}' &&
    JSON.stringify(columnVisibility) === '{}' &&
    pagination.pageIndex === 0 &&
    pagination.pageSize === 10 &&
    sorting?.length === 0 &&
    (globalFilter === undefined || globalFilter?.length === 0) &&
    groupBy?.length === 0;

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
          isExportData={isExportData}
          enableGrouping={enableGrouping}
          enableFullScreenToggle={data?.length > 0}
          enableColumnResizing={enableColumnResizing}
          enableColumnOrdering={enableColumnOrdering}
          enableFacetedValues={enableFacetedValues}
          enableColumnFilter={enableColumnFilter}
          muiTableBodyCellProps={{
            onMouseOver: handleMouseHover,
            style: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
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
            title: column?.columnDef?.header,
            onClick: (event) => {
              const isFilterIconClicked = event?.target?.innerText
                ?.toLowerCase()
                ?.startsWith('filter by ');
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
              <MRT_ToggleGlobalFilterButton
                table={table}
                onClick={globalFilterToggler}
                disabled={false}
              />
              <Tooltip title="Clear Filters" arrow>
                <IconButton
                  disabled={isFilterNotApplied}
                  onClick={resetFilters}
                >
                  <FilterAltOffIcon
                    sx={{
                      color: isFilterNotApplied
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
          renderTopToolbarCustomActions={({ table }) => {
            return (
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
                {isExportData && (
                  <Button
                    className="text-primary"
                    disabled={data.length === 0 || loading}
                    onClick={() =>
                      handleExportData(table.getFilteredRowModel()['rows'])
                    }
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
                )}

                {loading && (
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    style={{ marginTop: 10 }}
                  />
                )}
                {/* <Button
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
            );
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}

export default MaterialTable;
