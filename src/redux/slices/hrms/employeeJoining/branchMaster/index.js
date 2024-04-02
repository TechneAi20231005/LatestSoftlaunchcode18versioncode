import { createSlice } from '@reduxjs/toolkit';
import {
  addBranchMasterThunk,
  editBranchMasterThunk,
  getBranchMasterListThunk,
} from '../../../../services/hrms/employeeJoining/branchMaster';

const initialState = {
  branchMasterList: [],
  isLading: {
    getBranchMasterList: false,
    addBranchMaster: false,
    editBranchMaster: false,
  },
  errorMsg: { getBranchMasterList: '', addBranchMaster: '', editBranchMaster: '' },
  successMsg: { getBranchMasterList: '', addBranchMaster: '', editBranchMaster: '' },
};
const branchMasterSlice = createSlice({
  name: 'Branch master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getBranchMasterListThunk.pending, (state, action) => {
        state.isLading.getBranchMasterList = true;
      })
      .addCase(getBranchMasterListThunk.fulfilled, (state, action) => {
        state.isLading.getBranchMasterList = false;
        state.branchMasterList = action.payload.data;
        state.successMsg.getBranchMasterList = action.payload.msg;
      })
      .addCase(getBranchMasterListThunk.rejected, (state, action) => {
        state.isLading.getBranchMasterList = false;
        state.branchMasterList = [];
        state.errorMsg.getBranchMasterList = action.error.message;
      })

      // // add branch master
      .addCase(addBranchMasterThunk.pending, (state, action) => {
        state.isLading.addBranchMaster = true;
      })
      .addCase(addBranchMasterThunk.fulfilled, (state, action) => {
        state.isLading.addBranchMaster = false;
        state.successMsg.addBranchMaster = action.payload;
      })
      .addCase(addBranchMasterThunk.rejected, (state, action) => {
        state.isLading.addBranchMaster = false;
        state.errorMsg.addBranchMaster = action.error.message;
      })

      // // edit branch master
      .addCase(editBranchMasterThunk.pending, (state, action) => {
        state.isLading.editBranchMaster = true;
      })
      .addCase(editBranchMasterThunk.fulfilled, (state, action) => {
        state.isLading.editBranchMaster = false;
        state.successMsg.editBranchMaster = action.payload;
      })
      .addCase(editBranchMasterThunk.rejected, (state, action) => {
        state.isLading.editBranchMaster = false;
        state.errorMsg.editBranchMaster = action.error.message;
      });
  },
});

export default branchMasterSlice.reducer;
