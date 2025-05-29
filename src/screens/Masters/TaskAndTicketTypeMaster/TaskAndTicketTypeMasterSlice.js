import { createSlice } from '@reduxjs/toolkit';

import { getClassificationTypes } from './TaskAndTicketTypeMasterAction';

const initialState = {
  status: '',
  err: '',
  isLoading: {
    testCaseCollectionTypeData: false
  },
  testCaseCollectionTypeData: []
};

export const taskAndTicketTypeSlice = createSlice({
  name: 'taskAndTicketTypeSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getClassificationTypes.pending, (state) => {
      state.status = 'loading';
      state.isLoading.testCaseCollectionTypeData = true;
    });
    builder.addCase(getClassificationTypes.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.testCaseCollectionTypeData = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.testCaseCollectionTypeData = payload.data?.data;
        state.status = 'succeded';
      }
    });
    builder.addCase(getClassificationTypes.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.testCaseCollectionTypeData = false;
    });
  }
});

export default taskAndTicketTypeSlice.reducer;
