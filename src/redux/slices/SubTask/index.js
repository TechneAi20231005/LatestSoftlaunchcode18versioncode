import { createSlice } from '@reduxjs/toolkit';

import {
  addSubTaskModuleThunk,
  deleteSubTaskModuleThunk,
  getSubTaskListThunk
} from '../../services/SubTask';

const initialState = {
  isLoading: {
    getSubTaskList: false,

    addSubTaskModule: false,
    deleteSubTaskModule: false
  },
  errorMsg: {
    getSubTaskList: '',

    deleteSubTaskModule: ''
  },
  successMsg: {
    getSubTaskList: '',

    deleteSubTaskModule: ''
  }
};
const subTaskComponentSlices = createSlice({
  name: 'Review Comment master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      //getSubTask Module
      .addCase(getSubTaskListThunk.pending, (state, action) => {
        state.isLoading.getSubTaskList = true;
      })
      .addCase(getSubTaskListThunk.fulfilled, (state, action) => {
        state.isLoading.getSubTaskList = false;
        state.subTaskList = action?.payload?.data;

        state.successMsg.getSubTaskList = action?.payload?.message;
      })
      .addCase(getSubTaskListThunk.rejected, (state, action) => {
        state.isLoading.getSubTaskList = false;

        state.errorMsg.getSubTaskList = action?.error?.message;
      })

      // addSubTaskModule
      .addCase(addSubTaskModuleThunk.pending, (state, action) => {
        state.isLoading.addSubTaskModule = true;
      })
      .addCase(addSubTaskModuleThunk.fulfilled, (state, action) => {
        state.isLoading.addSubTaskModule = false;
        state.successMsg.addSubTaskModule = action.payload;
      })
      .addCase(addSubTaskModuleThunk.rejected, (state, action) => {
        state.isLoading.addSubTaskModule = false;
        state.errorMsg.addSubTaskModule = action.error.message;
      })

      // deleteSubTaskModule
      .addCase(deleteSubTaskModuleThunk.pending, (state, action) => {
        state.isLoading.deleteSubTaskModule = true;
      })
      .addCase(deleteSubTaskModuleThunk.fulfilled, (state, action) => {
        state.isLoading.deleteSubTaskModule = false;
        state.successMsg.deleteSubTaskModule = action.payload;
      })
      .addCase(deleteSubTaskModuleThunk.rejected, (state, action) => {
        state.isLoading.deleteSubTaskModule = false;
        state.errorMsg.deleteSubTaskModule = action.error.message;
      });
  }
});

export default subTaskComponentSlices.reducer;
