import { createSlice } from '@reduxjs/toolkit';
import {
  addSourceMasterThunk,
  editSourceMasterThunk,
  getSourceMasterListThunk,
} from '../../../../services/hrms/employeeJoining/sourceMaster';

const initialState = {
  sourceMasterList: [],
  isLading: {
    getSourceMasterList: false,
    addSourceMaster: false,
    editSourceMaster: false,
  },
  errorMsg: { getSourceMasterList: '', addSourceMaster: '', editSourceMaster: '' },
  successMsg: { getSourceMasterList: '', addSourceMaster: '', editSourceMaster: '' },
};
const sourceMasterSlice = createSlice({
  name: 'Source master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getSourceMasterListThunk.pending, (state, action) => {
        state.isLading.getSourceMasterList = true;
      })
      .addCase(getSourceMasterListThunk.fulfilled, (state, action) => {
        state.isLading.getSourceMasterList = false;
        state.sourceMasterList = action.payload.data;
        state.successMsg.getSourceMasterList = action.payload.msg;
      })
      .addCase(getSourceMasterListThunk.rejected, (state, action) => {
        state.isLading.getSourceMasterList = false;
        state.sourceMasterList = [];
        state.errorMsg.getSourceMasterList = action.error.message;
      })

      // // add source master
      .addCase(addSourceMasterThunk.pending, (state, action) => {
        state.isLading.addSourceMaster = true;
      })
      .addCase(addSourceMasterThunk.fulfilled, (state, action) => {
        state.isLading.addSourceMaster = false;
        state.successMsg.addSourceMaster = action.payload;
      })
      .addCase(addSourceMasterThunk.rejected, (state, action) => {
        state.isLading.addSourceMaster = false;
        state.errorMsg.addSourceMaster = action.error.message;
      })

      // // edit source master
      .addCase(editSourceMasterThunk.pending, (state, action) => {
        state.isLading.editSourceMaster = true;
      })
      .addCase(editSourceMasterThunk.fulfilled, (state, action) => {
        state.isLading.editSourceMaster = false;
        state.successMsg.editSourceMaster = action.payload;
      })
      .addCase(editSourceMasterThunk.rejected, (state, action) => {
        state.isLading.editSourceMaster = false;
        state.errorMsg.editSourceMaster = action.error.message;
      });
  },
});

export default sourceMasterSlice.reducer;
