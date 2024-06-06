import { createSlice } from '@reduxjs/toolkit';

import { getUserTaskData, updateTaskPlannerData } from './PlannerModalAction';

const initialState = {
  userData: [],
  isLoading: {
    userData: false,
    updateTask: false
  },
  errorMsg: {
    userData: '',
    updateTask: ''
  },
  successMsg: {
    userData: '',
    updateTask: ''
  }
};

export const PlannerModalSlices = createSlice({
  name: 'PlannerModalSlices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserTaskData.pending, (state, action) => {
        state.isLoading.userData = true;
      })
      .addCase(getUserTaskData.fulfilled, (state, action) => {
        state.isLoading.userData = false;
        state.userData = action?.payload?.data;

        state.successMsg.userData = action.payload.msg;
      })
      .addCase(getUserTaskData.rejected, (state, action) => {
        state.isLoading.userData = false;
        state.userData = [];
        state.errorMsg.userData = action.error.message;
      })

      .addCase(updateTaskPlannerData.pending, (state, action) => {
        state.isLoading.updateTask = true;
      })
      .addCase(updateTaskPlannerData.fulfilled, (state, action) => {
        state.isLoading.updateTask = false;
        state.updateTask = action?.payload?.data;

        state.successMsg.updateTask = action.payload.msg;
      })
      .addCase(updateTaskPlannerData.rejected, (state, action) => {
        state.isLoading.updateTask = false;
        state.updateTask = '';
        state.errorMsg.updateTask = action.error.msg;
      });
  }
});

export default PlannerModalSlices.reducer;
