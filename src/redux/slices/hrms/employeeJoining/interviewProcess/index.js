import { createSlice } from '@reduxjs/toolkit';
import {
  getInterviewProcessDataThunk,
  scheduleRescheduleInterviewThunk,
  updateInterviewProcessThunk,
} from '../../../../services/hrms/employeeJoining/interviewProcess';

const initialState = {
  interviewProcessData: [],
  isLoading: {
    getInterviewProcessData: false,
    updateInterviewProcess: false,
    scheduleRescheduleInterview: false,
  },
  errorMsg: {
    getInterviewProcessData: '',
    updateInterviewProcess: '',
    scheduleRescheduleInterview: '',
  },
  successMsg: {
    getInterviewProcessData: '',
    updateInterviewProcess: '',
    scheduleRescheduleInterview: '',
  },
};
const interviewProcessSlice = createSlice({
  name: 'Interview process',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getInterviewProcessDataThunk.pending, (state, action) => {
        state.isLoading.getInterviewProcessData = true;
      })
      .addCase(getInterviewProcessDataThunk.fulfilled, (state, action) => {
        state.isLoading.getInterviewProcessData = false;
        state.interviewProcessData = action.payload.data;
        state.successMsg.getInterviewProcessData = action.payload.msg;
      })
      .addCase(getInterviewProcessDataThunk.rejected, (state, action) => {
        state.isLoading.getInterviewProcessData = false;
        state.interviewProcessData = [];
        state.errorMsg.getInterviewProcessData = action.error.message;
      })

      // // update interview process
      .addCase(updateInterviewProcessThunk.pending, (state, action) => {
        state.isLoading.updateInterviewProcess = true;
      })
      .addCase(updateInterviewProcessThunk.fulfilled, (state, action) => {
        state.isLoading.updateInterviewProcess = false;
        state.successMsg.updateInterviewProcess = action.payload;
      })
      .addCase(updateInterviewProcessThunk.rejected, (state, action) => {
        state.isLoading.updateInterviewProcess = false;
        state.errorMsg.updateInterviewProcess = action.error.message;
      })

      // // schedule reschedule interview
      .addCase(scheduleRescheduleInterviewThunk.pending, (state, action) => {
        state.isLoading.scheduleRescheduleInterview = true;
      })
      .addCase(scheduleRescheduleInterviewThunk.fulfilled, (state, action) => {
        state.isLoading.scheduleRescheduleInterview = false;
        state.successMsg.scheduleRescheduleInterview = action.payload;
      })
      .addCase(scheduleRescheduleInterviewThunk.rejected, (state, action) => {
        state.isLoading.scheduleRescheduleInterview = false;
        state.errorMsg.scheduleRescheduleInterview = action.error.message;
      });
  },
});

export default interviewProcessSlice.reducer;
