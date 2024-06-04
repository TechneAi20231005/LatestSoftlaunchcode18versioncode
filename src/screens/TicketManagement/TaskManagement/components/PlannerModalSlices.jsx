import { createSlice } from '@reduxjs/toolkit';

import { getUserTaskData } from './PlannerModalAction';

const initialState = {
  status: '',
  err: '',

  postCity: [],

  isLoading: {
    getCityDataList: false,
    getCustomerList: false,
    CountyDataList: false,
    employeeDataList: false,
    stateDataList: false
  },
  customerTypeData: [],
  getUserById: []
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
    builder.addCase(getUserTaskData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(getUserTaskData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log('payload', payload);
      state.notify = null;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postCity = payload.data.data;
        state.status = 'succeeded';

        state.showLoaderModal = false;
        state.postCity = postCity;
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
    builder.addCase(getUserTaskData.rejected, (state) => {
      state.status = 'rejected';
    });

    // Update city
  }
});

export const {
  handleModalInStore,
  handleModalClose,
  loaderModal,
  hideNotification
} = PlannerModalSlices.actions;
export default PlannerModalSlices.reducer;
