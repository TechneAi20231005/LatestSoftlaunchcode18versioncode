import { createSlice } from '@reduxjs/toolkit';
import { getTestBankMasterListThunk } from '../../../services/testCases/testBank';

const initialState = {
  testBankList: [],
  isLoading: {
    testBankList: false
  },
  errorMsg: { testBankList: '' },
  successMsg: { testBankList: '' }
};
const testBankSlice = createSlice({
  name: 'Test Bank',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getTestBankMasterListThunk.pending, (state, action) => {
        state.isLoading.testBankList = true;
      })
      .addCase(getTestBankMasterListThunk.fulfilled, (state, action) => {
        state.isLoading.testBankList = false;
        state.testBankList = action?.payload?.data?.data;
        state.successMsg.testBankList = action?.payload?.message;
      })
      .addCase(getTestBankMasterListThunk.rejected, (state, action) => {
        state.isLoading.testBankList = false;
        state.testBankList = [];
        state.errorMsg.testBankList = action?.error?.message;
      });
  }
});

export default testBankSlice.reducer;
