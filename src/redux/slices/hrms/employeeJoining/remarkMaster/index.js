import { createSlice } from '@reduxjs/toolkit';
import {
  addRemarkMasterThunk,
  editRemarkMasterThunk,
  getRemarkMasterListThunk,
} from '../../../../services/hrms/employeeJoining/remarkMaster';

const initialState = {
  remarkMasterList: [],
  isLading: {
    getRemarkMasterList: false,
    addRemarkMaster: false,
    editRemarkMaster: false,
  },
  errorMsg: { getRemarkMasterList: '', addRemarkMaster: '', editRemarkMaster: '' },
  successMsg: { getRemarkMasterList: '', addRemarkMaster: '', editRemarkMaster: '' },
};
const remarkMasterSlice = createSlice({
  name: 'Remark master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getRemarkMasterListThunk.pending, (state, action) => {
        state.isLading.getRemarkMasterList = true;
      })
      .addCase(getRemarkMasterListThunk.fulfilled, (state, action) => {
        state.isLading.getRemarkMasterList = false;
        state.remarkMasterList = action.payload.data;
        state.successMsg.getRemarkMasterList = action.payload.msg;
      })
      .addCase(getRemarkMasterListThunk.rejected, (state, action) => {
        state.isLading.getRemarkMasterList = false;
        state.remarkMasterList = [];
        state.errorMsg.getRemarkMasterList = action.error.message;
      })

      // // add remark master
      .addCase(addRemarkMasterThunk.pending, (state, action) => {
        state.isLading.addRemarkMaster = true;
      })
      .addCase(addRemarkMasterThunk.fulfilled, (state, action) => {
        state.isLading.addRemarkMaster = false;
        state.successMsg.addRemarkMaster = action.payload;
      })
      .addCase(addRemarkMasterThunk.rejected, (state, action) => {
        state.isLading.addRemarkMaster = false;
        state.errorMsg.addRemarkMaster = action.error.message;
      })

      // // edit remark master
      .addCase(editRemarkMasterThunk.pending, (state, action) => {
        state.isLading.editRemarkMaster = true;
      })
      .addCase(editRemarkMasterThunk.fulfilled, (state, action) => {
        state.isLading.editRemarkMaster = false;
        state.successMsg.editRemarkMaster = action.payload;
      })
      .addCase(editRemarkMasterThunk.rejected, (state, action) => {
        state.isLading.editRemarkMaster = false;
        state.errorMsg.editRemarkMaster = action.error.message;
      });
  },
});

export default remarkMasterSlice.reducer;
