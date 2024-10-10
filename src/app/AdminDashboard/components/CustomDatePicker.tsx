import React, { useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Stack, Button } from '@mui/material';
import { CustomDatePickerProps } from '../interfaces';
import { Dayjs } from 'dayjs';

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  const [tempStartDate, setTempStartDate] = useState<Dayjs | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Dayjs | null>(endDate);

  const handleApplyDates = () => {
    onStartDateChange(tempStartDate);
    onEndDateChange(tempEndDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <Stack direction="row" spacing={2} alignItems="center">
          <DatePicker
            label="Start Date"
            value={tempStartDate}
            onChange={(date) => setTempStartDate(date)}
          />
          <DatePicker
            label="End Date"
            value={tempEndDate}
            onChange={(date) => setTempEndDate(date)}
          />
          <Button 
            variant="contained" 
            onClick={handleApplyDates}
            sx={{ height: '56px' }}  // Match height with DatePicker
          >
            Apply Dates
          </Button>
        </Stack>
      </DemoContainer>
    </LocalizationProvider>
  );
}