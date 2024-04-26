import { createSlice } from '@reduxjs/toolkit';
import {
  addSalaryMasterThunk,
  editSalaryMasterThunk,
  getSalaryMasterListThunk,
} from '../../../../services/hrms/employeeJoining/salaryMaster';

const initialState = {
  salaryMasterList: [],
  isLoading: {
    getSalaryMasterList: false,
    addSalaryMaster: false,
    editSalaryMaster: false,
  },
  errorMsg: { getSalaryMasterList: '', addSalaryMaster: '', editSalaryMaster: '' },
  successMsg: { getSalaryMasterList: '', addSalaryMaster: '', editSalaryMaster: '' },
};
const salaryMasterSlice = createSlice({
  name: 'Salary master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getSalaryMasterListThunk.pending, (state, action) => {
        state.isLoading.getSalaryMasterList = true;
      })
      .addCase(getSalaryMasterListThunk.fulfilled, (state, action) => {
        state.isLoading.getSalaryMasterList = false;
        state.salaryMasterList = action?.payload?.data;
        state.successMsg.getSalaryMasterList = action.payload.msg;
      })
      .addCase(getSalaryMasterListThunk.rejected, (state, action) => {
        state.isLoading.getSalaryMasterList = false;
        state.salaryMasterList = [];
        state.errorMsg.getSalaryMasterList = action.error.message;
      })

      // // add salary master
      .addCase(addSalaryMasterThunk.pending, (state, action) => {
        state.isLoading.addSalaryMaster = true;
      })
      .addCase(addSalaryMasterThunk.fulfilled, (state, action) => {
        state.isLoading.addSalaryMaster = false;
        state.successMsg.addSalaryMaster = action.payload;
      })
      .addCase(addSalaryMasterThunk.rejected, (state, action) => {
        state.isLoading.addSalaryMaster = false;
        state.errorMsg.addSalaryMaster = action.error.message;
      })

      // // edit salary master
      .addCase(editSalaryMasterThunk.pending, (state, action) => {
        state.isLoading.editSalaryMaster = true;
      })
      .addCase(editSalaryMasterThunk.fulfilled, (state, action) => {
        state.isLoading.editSalaryMaster = false;
        state.successMsg.editSalaryMaster = action.payload;
      })
      .addCase(editSalaryMasterThunk.rejected, (state, action) => {
        state.isLoading.editSalaryMaster = false;
        state.errorMsg.editSalaryMaster = action.error.message;
      });
  },
});

export default salaryMasterSlice.reducer;
