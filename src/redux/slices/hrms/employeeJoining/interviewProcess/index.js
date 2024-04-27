import { createSlice } from '@reduxjs/toolkit';
import {
  createInterviewJobOfferProcessThunk,
  getInterviewProcessDataThunk,
  getSalaryNegotiatingActivityDataThunk,
  getSalaryOfferedByHrAndSrHr,
  manageOnBoardingProcessThunk,
  scheduleRescheduleInterviewThunk,
  updateInterviewProcessThunk,
} from '../../../../services/hrms/employeeJoining/interviewProcess';

const initialState = {
  interviewProcessData: [],
  salaryNegationActivityList: [],
  salaryOfferedByHrAndSrHrData: [],
  isLoading: {
    getInterviewProcessData: false,
    updateInterviewProcess: false,
    scheduleRescheduleInterview: false,
    jobOfferProcess: false,
    salaryNegationActivity: false,
    salaryOfferedByHrAndSrHr: false,
    onBoardingProcess: false,
  },
  errorMsg: {
    getInterviewProcessData: '',
    updateInterviewProcess: '',
    scheduleRescheduleInterview: '',
    jobOfferProcess: '',
    salaryNegationActivity: '',
    salaryOfferedByHrAndSrHr: '',
    onBoardingProcess: '',
  },
  successMsg: {
    getInterviewProcessData: '',
    updateInterviewProcess: '',
    scheduleRescheduleInterview: '',
    jobOfferProcess: '',
    salaryNegationActivity: '',
    salaryOfferedByHrAndSrHr: '',
    onBoardingProcess: '',
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
        state.interviewProcessData = action?.payload?.data;
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
      })

      // // create interview job offer process
      .addCase(createInterviewJobOfferProcessThunk.pending, (state, action) => {
        state.isLoading.jobOfferProcess = true;
      })
      .addCase(createInterviewJobOfferProcessThunk.fulfilled, (state, action) => {
        state.isLoading.jobOfferProcess = false;
        state.successMsg.jobOfferProcess = action.payload;
      })
      .addCase(createInterviewJobOfferProcessThunk.rejected, (state, action) => {
        state.isLoading.jobOfferProcess = false;
        state.errorMsg.jobOfferProcess = action.error.message;
      })

      // // get salary negation activity in job offer process
      .addCase(getSalaryNegotiatingActivityDataThunk.pending, (state, action) => {
        state.isLoading.salaryNegationActivity = true;
      })
      .addCase(getSalaryNegotiatingActivityDataThunk.fulfilled, (state, action) => {
        state.isLoading.salaryNegationActivity = false;
        state.salaryNegationActivityList = action?.payload?.data;
        state.successMsg.salaryNegationActivity = action.payload.msg;
      })
      .addCase(getSalaryNegotiatingActivityDataThunk.rejected, (state, action) => {
        state.isLoading.salaryNegationActivity = false;
        state.salaryNegationActivityList = [];
        state.errorMsg.salaryNegationActivity = action.error.message;
      })

      // // get salary offered by HR and Sr HR
      .addCase(getSalaryOfferedByHrAndSrHr.pending, (state, action) => {
        state.isLoading.salaryOfferedByHrAndSrHr = true;
      })
      .addCase(getSalaryOfferedByHrAndSrHr.fulfilled, (state, action) => {
        state.isLoading.salaryOfferedByHrAndSrHr = false;
        state.salaryOfferedByHrAndSrHrData = Array.isArray(action?.payload?.data)
          ? action?.payload?.data
          : [action?.payload?.data];
        state.successMsg.salaryOfferedByHrAndSrHr = action.payload.msg;
      })
      .addCase(getSalaryOfferedByHrAndSrHr.rejected, (state, action) => {
        state.isLoading.salaryOfferedByHrAndSrHr = false;
        state.salaryOfferedByHrAndSrHrData = [];
        state.errorMsg.salaryOfferedByHrAndSrHr = action.error.message;
      })

      // // manage onboarding process
      .addCase(manageOnBoardingProcessThunk.pending, (state, action) => {
        state.isLoading.onBoardingProcess = true;
      })
      .addCase(manageOnBoardingProcessThunk.fulfilled, (state, action) => {
        state.isLoading.onBoardingProcess = false;
        state.successMsg.onBoardingProcess = action.payload;
      })
      .addCase(manageOnBoardingProcessThunk.rejected, (state, action) => {
        state.isLoading.onBoardingProcess = false;
        state.errorMsg.onBoardingProcess = action.error.message;
      });
  },
});

export default interviewProcessSlice.reducer;
