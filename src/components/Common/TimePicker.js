import { useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Stack } from '@mui/material';

const TimeRangePicker = ({
  handleTimeChange,
  ind = null,
  defaultValue = null
}) => {
  let date;
  if (defaultValue?.value) {
    const [hours, minutes] = defaultValue.value.split(':').map(Number);
    date = new Date();
    date.setHours(hours, minutes, 0, 0);
  }

  const [selectedTime, setSelectedTime] = useState(date || null);

  const handleGenerateRange = (newVal) => {
    setSelectedTime(newVal);
    handleTimeChange(newVal, ind);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack
        spacing={2}
        sx={{
          '& .MuiInputBase-root': {
            height: '100%'
          },
          '& input': {
            padding: '0 0.5rem !important',
            backgroundColor: '#e9ecef !important',
            opacity: '1 !important',
            minWidth: '2rem !important'
          }
        }}
      >
        <TimePicker
          value={selectedTime}
          name="total_hours[]"
          onChange={handleGenerateRange}
          ampm={false}
          timeSteps={{ minutes: 1 }}
          sx={{ height: ind ? '2rem' : '2.5rem' }}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default TimeRangePicker;
