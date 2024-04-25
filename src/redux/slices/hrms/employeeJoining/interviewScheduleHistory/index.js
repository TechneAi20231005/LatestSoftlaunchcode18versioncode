import { createSlice } from '@reduxjs/toolkit';
import { getInterviewScheduleHistoryThunk } from '../../../../services/hrms/employeeJoining/interviewScheduleHistory';

const initialState = {
  candidateInterviewScheduleHistoryList: [],
  isLoading: {
    getCandidateInterviewScheduleHistory: false,
  },
  errorMsg: { getCandidateInterviewScheduleHistory: '' },
  successMsg: { getCandidateInterviewScheduleHistory: '' },
};
const interviewProcessSlice = createSlice({
  name: 'Candidate Interview Schedule History',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getInterviewScheduleHistoryThunk.pending, (state, action) => {
        state.isLoading.getCandidateInterviewScheduleHistory = true;
      })
      .addCase(getInterviewScheduleHistoryThunk.fulfilled, (state, action) => {
        state.isLoading.getCandidateInterviewScheduleHistory = false;
        state.candidateInterviewScheduleHistoryList = action?.payload?.data;
        state.successMsg.getCandidateInterviewScheduleHistory = action.payload.msg;
      })
      .addCase(getInterviewScheduleHistoryThunk.rejected, (state, action) => {
        state.isLoading.getCandidateInterviewScheduleHistory = false;
        state.candidateInterviewScheduleHistoryList = [];
        state.errorMsg.getCandidateInterviewScheduleHistory = action.error.message;
      });
  },
});

export default interviewProcessSlice.reducer;
