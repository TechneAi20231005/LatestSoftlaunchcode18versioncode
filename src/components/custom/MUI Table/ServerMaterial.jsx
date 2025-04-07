import React, { useState, useMemo, useEffect } from 'react';
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import NotFound from '../../NotFound';
import { ExportAllTicketsToExcel } from '../../Utilities/Table/ExportAllTicketsToExcel';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { grey } from '@mui/material/colors';
import UnPassModal from '../../../screens/TicketManagement/MyTicket/UnPassModal';

function ServerMaterial({
  columns,
  data,
  enableSorting = true,
  enablePagination = true,
  enableFilters = true,
  enableStickyHeader = true,
  enableGrouping = true,
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
  columnFilters,
  reset = false,
  setReset = () => {},
  enableRowSelection = false
}) {
  const handleMouseHover = (event) => {
    const clickedRow = event.currentTarget;
    const innerText = clickedRow.innerText;
    clickedRow.setAttribute('title', innerText);
  };

  const [expandColumn, setExpandColumn] = useState(false);

  const [groupBy, setGroupBy] = useState([]);

  const [globalFilter, setGlobalFilter] = useState([]);

  const [showGlobalFilter, setShowGlobalFilter] = useState(false);

  const [rowSelection, setRowSelection] = useState({});

  const [remarkModal, setRemarkModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  // const [columnFilters, setColumnFilters] = useState([]);

  const handleColumnMenuToggle = () => {
    setExpandColumn(!expandColumn);
  };

  const updatedColumns = useMemo(() => {
    return columns.map((col) => {
      if (col?.filterVariant === 'date-range') {
        return {
          ...col,
          muiFilterTextFieldProps: (column) => ({
            placeholder: column?.rangeFilterIndex === 0 ? 'From' : 'To'
          }),
          size: expandColumn ? 350 : 180
        };
      }
      return col;
    });
  }, [expandColumn, columns.length]);

  useEffect(() => {
    if (reset) {
      setGroupBy([]);
      setGlobalFilter([]);
      setShowGlobalFilter(false);
      setReset(false);
      setExpandColumn(false);
    }
  }, [reset]);

  const handleRemarkModal = (data) => {
    setRemarkModal(data);
  };

  // console.log(totalRows,"totalRows");

  return (
    <>
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
            muiSkeletonProps={{
              animation: 'wave',
              sx: {
                backgroundColor: 'rgba(8, 2, 2, 0.5)'
              }
            }}
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
            onGroupingChange={setGroupBy}
            onColumnFiltersChange={setColumnFilters}
            enableFacetedValues={enableFacetedValues}
            filterSelectOptions={filterSelectOptions}
            enableRowSelection={enableRowSelection}
            enableColumnFilter={enableColumnFilter}
            manualPagination={manualPagination}
            onShowGlobalFilterChange={setShowGlobalFilter}
            onPaginationChange={setPagination}
            onRowSelectionChange={setRowSelection}
            enableRowNumbers={true}
            muiTableBodyCellProps={{
              onMouseOver: handleMouseHover,
              style: {
                display: '-webkit-box',
                WebkitLineClamp: 0.5,
                overflow: 'hidden',
                lineHeight: '1.5rem'
              }
            }}
            getRowId={(originalRow) => originalRow.ticket_id}
            onGlobalFilterChange={setGlobalFilter}
            muiTableHeadCellProps={({ column }) => ({
              onClick: (event) => {
                const isFilterIconClicked = event.target.innerText
                  ?.toLowerCase()
                  ?.startsWith('filter by ');
                if (isFilterIconClicked && column.getCanFilter()) {
                  handleColumnMenuToggle();
                }
              }
            })}
            render
            state={{
              isLoading: isLoading,
              pagination,
              columnFilters,
              grouping: groupBy,
              globalFilter,
              showGlobalFilter,
              rowSelection
            }}
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
                    // disabled={
                    //   table.getState().columnFilters?.length === 0 &&
                    //   JSON.stringify(table.getState().rowSelection) === '{}' &&
                    //   JSON.stringify(table.getState().columnVisibility) ===
                    //     '{}' &&
                    //   table.getState().pagination.pageIndex === 0 &&
                    //   table.getState().pagination.pageSize === 10 &&
                    //   table.getState().sorting?.length === 0 &&
                    //   (table.getState().globalFilter === undefined ||
                    //     table.getState().globalFilter?.length === 0) &&
                    //   table.getState().grouping?.length === 0
                    // }
                    onClick={() => {
                      table.setColumnFilters([]);
                      table.resetSorting();
                      table.resetPagination();
                      table.resetRowSelection();
                      table.resetColumnVisibility();
                      table.resetGrouping();
                      table.reset();
                      table.resetGlobalFilter();
                      table.setShowGlobalFilter(false);
                      table.setShowColumnFilters(false);
                    }}
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
                  gap: '12px',
                  padding: '8px',
                  flexWrap: 'wrap'
                }}
              >
                <ExportAllTicketsToExcel
                  className="btn btn-sm btn-danger mt-3"
                  fileName={activeTab?.replace(/([A-Z])/g, ' $1')?.trim()}
                  typeOf={activeTab}
                  columnFilters={columnFilters}
                  gridData={data}
                />

                {activeTab === 'UnPassed' && (
                  <>
                    <button
                      className="btn btn-success btn-block text-white"
                      onClick={(e) => {
                        handleRemarkModal({
                          showModal: true,
                          modalData: Object.keys(rowSelection),
                          modalHeader: 'Enter Remark',
                          status: 'PASS'
                        });
                      }}
                      disabled={Object.keys(rowSelection)?.length === 0}
                    >
                      <i className="icofont-checked"></i> Pass
                    </button>
                    <button
                      className="btn btn-danger btn-block text-white"
                      onClick={(e) => {
                        handleRemarkModal({
                          showModal: true,
                          modalData: Object.keys(rowSelection),
                          modalHeader: 'Enter Remark',
                          status: 'Reject'
                        });
                      }}
                      disabled={Object.keys(rowSelection)?.length === 0}
                    >
                      <i className="icofont-close-squared-alt"></i> Reject
                    </button>
                  </>
                )}
              </Box>
            )}
          />
        </LocalizationProvider>
      </Box>
      {
        remarkModal.showModal && <UnPassModal
        remarkModal={remarkModal}
        handleRemarkModal={handleRemarkModal}
        setPagination={setPagination}
        setColumnFilters={setColumnFilters}
        setRowSelection={setRowSelection}
      />
      }
    </>
  );
}

export default ServerMaterial;
