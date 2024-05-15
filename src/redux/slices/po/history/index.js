import { createSlice } from '@reduxjs/toolkit';
import { getRequisitionHistoryThunk } from '../../../services/po/history';

const initialState = {
  requisitionHistoryList: [],
  isLoading: {
    getRequisitionHistoryList: false,
  },
  errorMsg: {
    getRequisitionHistoryList: '',
  },
  successMsg: {
    getRequisitionHistoryList: '',
  },
};
const requisitionHistoryPoSlice = createSlice({
  name: 'Requisition History PO',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getRequisitionHistoryThunk.pending, (state, action) => {
        state.isLoading.getRequisitionHistoryList = true;
      })
      .addCase(getRequisitionHistoryThunk.fulfilled, (state, action) => {
        state.isLoading.getRequisitionHistoryList = false;
        state.requisitionHistoryList = action.payload.data;
        state.successMsg.getRequisitionHistoryList = action.payload.msg;
      })
      .addCase(getRequisitionHistoryThunk.rejected, (state, action) => {
        state.isLoading.getRequisitionHistoryList = false;
        state.requisitionHistoryList = [];
        state.errorMsg.getRequisitionHistoryList = action.error.message;
      });
  },
});

export default requisitionHistoryPoSlice.reducer;