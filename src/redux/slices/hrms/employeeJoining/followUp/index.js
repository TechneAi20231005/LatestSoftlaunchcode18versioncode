import { createSlice } from '@reduxjs/toolkit';
import {
  addFollowUpThunk,
  getFollowUpListThunk,
} from '../../../../services/hrms/employeeJoining/followUp';

const initialState = {
  followUpList: [],
  isLoading: {
    getFollowUpList: false,
    addFollowUp: false,
    editFollowUp: false,
  },
  errorMsg: { getFollowUpList: '', addFollowUp: '', editFollowUp: '' },
  successMsg: { getFollowUpList: '', addFollowUp: '', editFollowUp: '' },
};
const followUpSlice = createSlice({
  name: 'Remark master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getFollowUpListThunk.pending, (state, action) => {
        state.isLoading.getFollowUpList = true;
      })
      .addCase(getFollowUpListThunk.fulfilled, (state, action) => {
        state.isLoading.getFollowUpList = false;
        state.followUpList = action.payload.data;
        state.successMsg.getFollowUpList = action.payload.msg;
      })
      .addCase(getFollowUpListThunk.rejected, (state, action) => {
        state.isLoading.getFollowUpList = false;
        state.followUpList = [];
        state.errorMsg.getFollowUpList = action.error.message;
      })

      // // add remark master
      .addCase(addFollowUpThunk.pending, (state, action) => {
        state.isLoading.addFollowUp = true;
      })
      .addCase(addFollowUpThunk.fulfilled, (state, action) => {
        state.isLoading.addFollowUp = false;
        state.successMsg.addFollowUp = action.payload;
      })
      .addCase(addFollowUpThunk.rejected, (state, action) => {
        state.isLoading.addFollowUp = false;
        state.errorMsg.addFollowUp = action.error.message;
      });
  },
});

export default followUpSlice.reducer;
