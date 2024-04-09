import { createSlice } from '@reduxjs/toolkit';
import {
  addInterviewMasterThunk,
  editInterviewMasterThunk,
  getInterviewMasterListThunk,
} from '../../../../services/hrms/employeeJoining/interviewListMaster';

const initialState = {
  interviewMasterList: [],
  isLoading: {
    getInterviewMasterList: false,
    addInterviewMaster: false,
    editInterviewMaster: false,
  },
  errorMsg: { getInterviewMasterList: '', addInterviewMaster: '', editInterviewMaster: '' },
  successMsg: { getInterviewMasterList: '', addInterviewMaster: '', editInterviewMaster: '' },
};
const interviewMasterSlice = createSlice({
  name: 'Interview master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getInterviewMasterListThunk.pending, (state, action) => {
        state.isLoading.getInterviewMasterList = true;
      })
      .addCase(getInterviewMasterListThunk.fulfilled, (state, action) => {
        state.isLoading.getInterviewMasterList = false;
        state.interviewMasterList = action.payload.data;
        state.successMsg.getInterviewMasterList = action.payload.msg;
      })
      .addCase(getInterviewMasterListThunk.rejected, (state, action) => {
        state.isLoading.getInterviewMasterList = false;
        state.interviewMasterList = [];
        state.errorMsg.getInterviewMasterList = action.error.message;
      })

      // // add interview master
      .addCase(addInterviewMasterThunk.pending, (state, action) => {
        state.isLoading.addInterviewMaster = true;
      })
      .addCase(addInterviewMasterThunk.fulfilled, (state, action) => {
        state.isLoading.addInterviewMaster = false;
        state.successMsg.addInterviewMaster = action.payload;
      })
      .addCase(addInterviewMasterThunk.rejected, (state, action) => {
        state.isLoading.addInterviewMaster = false;
        state.errorMsg.addInterviewMaster = action.error.message;
      })

      // // edit interview master
      .addCase(editInterviewMasterThunk.pending, (state, action) => {
        state.isLoading.editInterviewMaster = true;
      })
      .addCase(editInterviewMasterThunk.fulfilled, (state, action) => {
        state.isLoading.editInterviewMaster = false;
        state.successMsg.editInterviewMaster = action.payload;
      })
      .addCase(editInterviewMasterThunk.rejected, (state, action) => {
        state.isLoading.editInterviewMaster = false;
        state.errorMsg.editInterviewMaster = action.error.message;
      });
  },
});

export default interviewMasterSlice.reducer;
