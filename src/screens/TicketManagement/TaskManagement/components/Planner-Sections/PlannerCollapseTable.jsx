import { Box, Skeleton } from '@mui/material';
import { Table } from 'react-bootstrap';
import TimeRangePicker from '../../../../../components/Common/TimePicker';
import { formatTime24Hour } from '../../../../../utils/formatTime24Hour';

const PlannerCollapseTable = ({
  isLoading,
  data,
  row,
  selected,
  setSelected,
  times,
  taskUsers,
  setOpen,
  handleChange
}) => {
  const dataforUser = data?.filter(
    (item) =>
      item?.username?.toLowerCase() === row.original.username?.toLowerCase()
  );

  const handleTimeChange = (time, index) => {
    const finalTime = formatTime24Hour(new Date(time));
    handleChange(finalTime, index, dataforUser?.[0]?.user_id);
  };

  return isLoading ? (
    <Box sx={{ p: 2 }}>
      <Skeleton height={30} />
      <Skeleton height={30} />
      <Skeleton height={30} />
    </Box>
  ) : (
    <Box>
      <Table bordered size="sm">
        <thead>
          <tr className="p-1">
            <th>Sr No</th>
            <th>
              <input
                type="checkbox"
                name="selectAll"
                checked={dataforUser.every((ele) =>
                  selected.some((sel) => sel.id === ele.id)
                )}
                onChange={() => {
                  const allSelected = dataforUser.every((ele) =>
                    selected.some((sel) => sel.id === ele.id)
                  );
                  setSelected(allSelected ? [] : dataforUser);
                }}
              />
            </th>
            <th>Assigned User</th>
            <th>Date</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {dataforUser?.map((ele, index) => (
            <tr key={ele.id}>
              <td>
                {index + 1}
                <input type="hidden" name="id[]" defaultValue={ele.id} />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="selected[]"
                  checked={selected.some((sel) => sel.id === ele.id)}
                  onChange={() => {
                    setSelected((prev) =>
                      prev.find((sel) => sel.id === ele.id)
                        ? prev.filter((sel) => sel.id !== ele.id)
                        : [...prev, ele]
                    );
                  }}
                />
              </td>
              <td>
                <select
                  className="form-control form-control-sm"
                  name="user_id[]"
                  defaultValue={ele.user_id}
                >
                  {taskUsers?.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.taskUsers}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  readOnly
                  name="date[]"
                  defaultValue={ele.date}
                />
              </td>
              <td style={{ width: '12rem' }}>
                <TimeRangePicker
                  handleTimeChange={handleTimeChange}
                  ind={index}
                  defaultValue={times?.find((d) => d.value === ele.total_hours)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Box display={'flex'} justifyContent={'end'}>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setOpen(true)}
          disabled={selected.length === 0}
        >
          Apply Bulk Operations
        </button>
      </Box>
    </Box>
  );
};

export default PlannerCollapseTable;
