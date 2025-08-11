import { useMemo, useState, useCallback } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import {
  Skeleton,
  Box,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  FormControl,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatTime24Hour } from '../../../../utils/formatTime24Hour';
import TimeRangePicker from '../../../../components/Common/TimePicker';
import PlannerCollapseTable from './Planner-Sections/PlannerCollapseTable';
import { Modal } from 'react-bootstrap';

const PlannerMRT = ({
  data,
  handleChange,
  taskUsers,
  setSelected,
  selected,
  times,
  isLoading,
  handleBulkSubmit
}) => {
  const [open, setOpen] = useState(false);
  const [bulkUser, setBulkUser] = useState('');
  const [timeError, setTimeError] = useState(false);
  const [hour, setHour] = useState(null);

  const taskUserOptions = useMemo(() => {
    return taskUsers?.map((user) => (
      <MenuItem key={user.userId} value={user.userId}>
        {user.taskUsers}
      </MenuItem>
    ));
  }, [taskUsers]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setHour(null);
    setBulkUser('');
  }, []);

  const result = useMemo(() => {
    if (!data || isLoading) return [];
    const uniqueData = {};

    data.forEach((item) => {
      const username = item?.username;
      const [itemHrs, itemMins] = item?.total_hours?.split(':')?.map(Number);
      if (!uniqueData[username]) {
        uniqueData[username] = {
          username,
          date: item?.date,
          total_hours: item?.total_hours || '00:00'
        };
      } else {
        const [existingHrs, existingMins] = uniqueData[username].total_hours
          .split(':')
          .map(Number);
        let totalMinutes = itemMins + existingMins;
        let totalHours = itemHrs + existingHrs + Math.floor(totalMinutes / 60);
        totalMinutes %= 60;
        uniqueData[username].total_hours = `${String(totalHours).padStart(
          2,
          '0'
        )}:${String(totalMinutes).padStart(2, '0')}`;
      }
    });
    return Object.values(uniqueData);
  }, [data, isLoading]);

  const handleBulkTimeChange = useCallback(
    (time) => {
      if (!time) {
        setTimeError(true);
        return;
      }
      setTimeError(false);
      const finalTime = formatTime24Hour(new Date(time));
      setHour(finalTime);
    },
    [result]
  );
  const columns = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: 'Assigned User',
        Cell: ({ cell }) =>
          isLoading ? <Skeleton variant="text" width={100} /> : cell.getValue()
      },
      {
        accessorKey: 'total_hours',
        header: 'Total Hours',
        enableSorting: true,
        enableColumnActions: false,
        enableColumnFilter: false,
        sortingFn: (rowA, rowB) => {
          const getMinutes = (timeStr) => {
            if (!timeStr) return 0;
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
          };
          return (
            getMinutes(rowA.getValue('total_hours')) -
            getMinutes(rowB.getValue('total_hours'))
          );
        },
        muiTableBodyCellProps: {
          sx: {
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'unset'
          }
        },
        Cell: ({ cell }) =>
          isLoading ? <Skeleton variant="text" width={80} /> : cell.getValue()
      }
    ],
    [isLoading]
  );

  const table = useMaterialReactTable({
    columns,
    data: result,
    enableExpandAll: false,
    state: { isLoading },
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)'
      })
    }),
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => {
        table.setExpanded({ [row.id]: !row.getIsExpanded() });
        setSelected([]);
      },
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s'
      }
    }),
    renderDetailPanel: ({ row }) => {
      return (
        <PlannerCollapseTable
          data={data}
          row={row}
          isLoading={isLoading}
          selected={selected}
          setSelected={setSelected}
          setOpen={setOpen}
          times={times}
          taskUsers={taskUsers}
          handleChange={handleChange}
        />
      );
    },
    enableDensityToggle: false
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Modal
        show={open}
        onHide={handleClose}
        backdrop="static"
        centered
        contentClassName="mui-like-modal"
      >
        <Modal.Body style={{ padding: 0 }}>
          <DialogTitle sx={{ px: 3, pt: 2, position: 'relative' }}>
            Apply Bulk Operations
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ px: 3, pt: 1, pb: 3 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl size="small" required fullWidth>
                <Select
                  value={bulkUser || ''}
                  onChange={(e) => setBulkUser(e.target.value)}
                  name="user_id[]"
                  displayEmpty
                  fullWidth
                  sx={{
                    height: '2.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <MenuItem value="" disabled>
                    --Select User--
                  </MenuItem>
                  {taskUserOptions}
                </Select>
              </FormControl>

              <TimeRangePicker
                handleTimeChange={handleBulkTimeChange}
                ind={null}
              />

              {timeError && (
                <small className="text-danger">Time is required</small>
              )}

              <button
                type="button"
                className="btn btn-primary btn-sm w-100"
                disabled={!hour || !bulkUser}
                onClick={() => {
                  handleBulkSubmit(bulkUser, hour);
                  handleClose();
                }}
                style={{ height: '2.5rem' }}
              >
                Bulk Update
              </button>
            </Box>
          </DialogContent>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PlannerMRT;
