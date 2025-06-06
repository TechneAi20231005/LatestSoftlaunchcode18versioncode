import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import {
  Skeleton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Table } from 'react-bootstrap';

import { formatTime24Hour } from '../../../../utils/formatTime24Hour';
import TimeRangePicker from '../../../../components/Common/TimePicker';

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

  const result = useMemo(() => {
    if (!data || isLoading) return [];

    const uniqueData = {};

    data.forEach((item) => {
      const username = item?.username;
      const [itemHrs, itemMins] = item?.total_hours?.split(':').map(Number);

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

        const paddedHours = String(totalHours).padStart(2, '0');
        const paddedMinutes = String(totalMinutes).padStart(2, '0');

        uniqueData[username].total_hours = `${paddedHours}:${paddedMinutes}`;
      }
    });

    return Object.values(uniqueData);
  }, [data, isLoading]);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleTimeChange = (time, index) => {
    const finalTime = formatTime24Hour(new Date(time));
    handleChange(finalTime, index);
  };
  const [timeError, setTimeError] = useState(false);
  const [hour, setHour] = useState(null);
  const handleBulkTimeChange = (time, index = null) => {
    if (!time) {
      setTimeError(true);
      return;
    }
    setTimeError(false);
    setHour(time);
    const finalTime = formatTime24Hour(new Date(time));
    if (!index) {
      for (let i = 0; i < result.length; i++) {
        handleChange(finalTime, i);
      }
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: result,
    enableExpandAll: false,
    state: {
      isLoading: isLoading
    },
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
      const dataforUser = data?.filter(
        (item) =>
          item?.username?.toLowerCase() === row.original.username?.toLowerCase()
      );

      if (isLoading) {
        return (
          <Box sx={{ p: 2 }}>
            <Skeleton height={30} />
            <Skeleton height={30} />
            <Skeleton height={30} />
          </Box>
        );
      }

      return (
        <>
          <Table bordered size="sm">
            <thead>
              <tr className="p-1">
                <th className="p-1 text-center" style={{ fontSize: '15px' }}>
                  Sr No
                </th>
                <th className="p-1 text-center" style={{ fontSize: '15px' }}>
                  <input
                    type="checkbox"
                    name="selectAll"
                    checked={
                      dataforUser.length > 0 &&
                      dataforUser.every((ele) =>
                        selected.some((sel) => sel.id === ele.id)
                      )
                    }
                    onChange={() => {
                      const allSelected = dataforUser.every((ele) =>
                        selected.some((sel) => sel.id === ele.id)
                      );
                      setSelected(allSelected ? [] : dataforUser);
                    }}
                  />
                </th>
                <th className="p-1 text-center" style={{ fontSize: '15px' }}>
                  Assigned User
                </th>
                <th className="p-1 text-center" style={{ fontSize: '15px' }}>
                  Date
                </th>
                <th className="p-1 text-center" style={{ fontSize: '15px' }}>
                  Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {dataforUser.map((ele, index) => (
                <tr className="p-1" key={ele.id}>
                  <td className="p-1 text-center">
                    {index + 1}
                    <input type="hidden" name="id[]" defaultValue={ele.id} />
                  </td>
                  <td className="p-1 text-center">
                    <input
                      type="checkbox"
                      name="selected[]"
                      checked={selected.some((sel) => sel.id === ele.id)}
                      onChange={() => {
                        setSelected((prevSelected) => {
                          const alreadySelected = prevSelected.find(
                            (sel) => sel.id === ele.id
                          );
                          if (alreadySelected) {
                            return prevSelected.filter(
                              (sel) => sel.id !== ele.id
                            );
                          } else {
                            return [...prevSelected, ele];
                          }
                        });
                      }}
                    />
                  </td>
                  <td className="p-1">
                    <select
                      className="form-control form-control-sm"
                      name="user_id[]"
                      defaultValue={ele.user_id}
                    >
                      {taskUsers &&
                        taskUsers.map((user) => (
                          <option key={user.userId} value={user.userId}>
                            {user.taskUsers}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      readOnly={true}
                      name="date[]"
                      defaultValue={ele.date}
                    />
                  </td>
                  <td className="p-1" style={{ width: '12rem' }}>
                    <TimeRangePicker
                      handleTimeChange={handleTimeChange}
                      ind={index}
                      defaultValue={
                        times?.length > 0
                          ? times?.find((d) => d.value === ele.total_hours)
                          : ''
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              setOpen(true);
            }}
            disabled={selected?.length === 0}
          >
            Apply Bulk Operations
          </button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            slotProps={{
              paper: {
                sx: {
                  width: '400px',
                  borderRadius: '12px'
                }
              }
            }}
            sx={{
              padding: '5rem'
            }}
          >
            <DialogTitle id="form-dialog-title">
              Apply Bulk Operations
            </DialogTitle>
            <DialogContent>
              <div className="d-flex gap-3 justify-content-end align-items-start flex-column">
                <FormControl size="small" required fullWidth>
                  <Select
                    labelId="bulk-user-label"
                    id="bulk-user"
                    value={bulkUser || ''}
                    onChange={(e) => {
                      setBulkUser(e.target.value);
                    }}
                    name="user_id[]"
                    displayEmpty
                    sx={{
                      height: '2.5rem',
                      '& .MuiSelect-select': {
                        paddingTop: '8px',
                        paddingBottom: '8px'
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      --Select User--
                    </MenuItem>
                    {taskUsers?.map((user, ind) => (
                      <MenuItem key={ind} value={user.userId}>
                        {user.taskUsers}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="form-group w-100">
                  <TimeRangePicker
                    handleTimeChange={handleBulkTimeChange}
                    ind={null}
                  />
                  {timeError && (
                    <small className="text-danger">Time is required</small>
                  )}
                </div>

                <div className="form-group" style={{ width: '100%' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm w-100"
                    disabled={!hour || !bulkUser}
                    onClick={() => {
                      handleBulkSubmit();
                      setOpen(false);
                    }}
                    style={{ height: '2.5rem' }}
                  >
                    Bulk Update
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
    muiSkeletonProps: {
      animation: 'wave',
      sx: {
        backgroundColor: 'rgba(8, 2, 2, 0.5)'
      }
    },
    enableDensityToggle: false
  });

  const [bulkUser, setBulkUser] = useState('');

  return (
    <MaterialReactTable
      table={table}
      state={{
        isLoading: isLoading
      }}
    />
  );
};

export default PlannerMRT;
