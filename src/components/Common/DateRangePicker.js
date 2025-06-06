import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const DateRangePicker = ({ handleApplyDate }) => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const isCleared =
    dateRange?.startDate === null ||
    dateRange?.startDate === undefined ||
    dateRange?.startDate === '' ||
    dateRange?.endDate === null ||
    dateRange?.endDate === undefined ||
    dateRange?.endDate === '';

  useEffect(() => {
    if (!dateRange?.endDate && !dateRange?.startDate) {
      handleApplyDate(null);
    }
  }, [dateRange?.endDate, dateRange?.startDate]);
  return (
    <Stack
      direction={{ md: 'row', xs: 'column' }}
      gap={1}
      sx={{
        '& .react-datepicker__calendar-icon': {
          marginTop: '3px !important'
        },
        '& .react-datepicker-popper': {
          zIndex: '9999 !important'
        }
      }}
      mb={2}
    >
      <Stack gap={0.5} direction={'row'} flexWrap={'wrap'}>
        <DatePicker
          selected={dateRange?.startDate}
          onChange={(date) => {
            setDateRange({
              ...dateRange,
              startDate: date
            });
          }}
          showIcon
          toggleCalendarOnIconClick
          selectsStart
          startDate={dateRange?.startDate}
          endDate={dateRange?.endDate}
          isClearable
          icon="fa fa-calendar"
          name="startDate"
          placeholderText="Select Start Date"
        />
        <DatePicker
          selected={dateRange?.endDate}
          onChange={(date) => {
            setDateRange({
              ...dateRange,
              endDate: date
            });
          }}
          selectsEnd
          showIcon
          toggleCalendarOnIconClick
          startDate={dateRange?.startDate}
          endDate={dateRange?.endDate}
          minDate={dateRange?.startDate}
          isClearable
          icon="fa fa-calendar"
          name="endDate"
          placeholderText="Select End Date"
        />
      </Stack>

      <button
        className="btn btn-primary"
        onClick={() => {
          if (dateRange?.endDate && dateRange?.startDate) {
            handleApplyDate(dateRange);
          }
        }}
        style={{
          width: 'fit-content'
        }}
        type="button"
        disabled={isCleared}
      >
        Apply Date
      </button>
    </Stack>
  );
};

export default DateRangePicker;
