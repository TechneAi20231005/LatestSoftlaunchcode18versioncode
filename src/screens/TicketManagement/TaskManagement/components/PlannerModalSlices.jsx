import { createSlice } from '@reduxjs/toolkit';

import { getUserTaskData, updateTaskPlannerData } from './PlannerModalAction';

const initialState = {
  status: '',
  err: '',

  userData: []
};

export const PlannerModalSlices = createSlice({
  name: 'PlannerModalSlices',
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
    handleModalInStore: (state, action) => {
      state.modal = action.payload;
    },
    handleModalClose: (state, action) => {
      state.modal = action.payload;
    },
    hideNotification(state) {
      state.notify = false;
    }
  },
  extraReducers: (builder) => {
    //getUserTaskData
    builder.addCase(getUserTaskData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(getUserTaskData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let userData = payload.data.data;
        state.status = 'succeeded';

        state.showLoaderModal = false;
        state.userData = userData;
      } else {
        // let notify = { type: 'danger', message: payload.data.message };
        // state.notify = null;
        // state.notify = notify;
      }
    });
    builder.addCase(getUserTaskData.rejected, (state) => {
      state.status = 'rejected';
    });
    //updateTaskPlanner

    builder.addCase(updateTaskPlannerData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(updateTaskPlannerData.fulfilled, (state, action) => {
      state.notify = null;
      const { payload } = action;

      state.notify = null;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateTaskPlanner = payload.data.data;
        state.status = 'succeeded';

        state.showLoaderModal = false;
        state.updateTaskPlanner = updateTaskPlanner;
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        let notify = { type: 'danger', message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(updateTaskPlannerData.rejected, (state) => {
      state.status = 'rejected';
    });
  }
});

export const {
  handleModalInStore,
  handleModalClose,
  loaderModal,
  hideNotification
} = PlannerModalSlices.actions;
export default PlannerModalSlices.reducer;
