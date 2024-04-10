import { createSlice } from '@reduxjs/toolkit';
import { getRemarkHistoryListThunk } from '../../../../services/hrms/employeeJoining/remarkHistory';

const initialState = {
  remarkHistoryList: [],
  isLoading: {
    getRemarkHistoryList: false,
  },
  errorMsg: { getRemarkHistoryList: '' },
  successMsg: { getRemarkHistoryList: '' },
};
const remarkHistorySlice = createSlice({
  name: 'Remark master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getRemarkHistoryListThunk.pending, (state, action) => {
        state.isLoading.getRemarkHistoryList = true;
      })
      .addCase(getRemarkHistoryListThunk.fulfilled, (state, action) => {
        state.isLoading.getRemarkHistoryList = false;
        state.remarkHistoryList = action.payload.data;
        state.successMsg.getRemarkHistoryList = action.payload.msg;
      })
      .addCase(getRemarkHistoryListThunk.rejected, (state, action) => {
        state.isLoading.getRemarkHistoryList = false;
        state.remarkHistoryList = [];
        state.errorMsg.getRemarkHistoryList = action.error.message;
      });
  },
});

export default remarkHistorySlice.reducer;
