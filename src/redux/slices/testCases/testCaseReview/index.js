import { createSlice } from '@reduxjs/toolkit';

import {
  approveRejectByReviewerMasterThunk,
  getByTestPlanIDListThunk,
  getTestCaseReviewListThunk
} from '../../../services/testCases/testCaseReview';

const initialState = {
  testCaseReviewList: [],
  testPlanIdData: [],
  approveRejectData: [],
  allTestPlanIDData: [],
  isLoading: {
    testCaseReviewList: false,
    testPlanIdData: false
  },
  errorMsg: {
    testCaseReviewList: '',
    testPlanIdData: '',
    approveRejectData: '',
    allTestPlanIDData: ''
  },
  successMsg: {
    testCaseReviewList: '',
    testPlanIdData: '',
    approveRejectData: '',
    allTestPlanIDData: ''
  }
};
const testCaseReviewSlice = createSlice({
  name: 'Test Case Review',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getTestCaseReviewListThunk.pending, (state, action) => {
        state.isLoading.testCaseReviewList = true;
      })
      .addCase(getTestCaseReviewListThunk.fulfilled, (state, action) => {
        state.isLoading.testCaseReviewList = false;
        state.testCaseReviewList = action?.payload?.data;
        state.successMsg.testCaseReviewList = action?.payload?.message;
      })
      .addCase(getTestCaseReviewListThunk.rejected, (state, action) => {
        state.isLoading.testCaseReviewList = false;
        state.testCaseReviewList = [];
        state.errorMsg.testCaseReviewList = action.error.message;
      })

      .addCase(getByTestPlanIDListThunk.pending, (state, action) => {
        state.isLoading.testPlanIdData = true;
      })
      .addCase(getByTestPlanIDListThunk.fulfilled, (state, action) => {
        state.isLoading.testPlanIdData = false;
        state.testPlanIdData = action?.payload?.data?.data;
        state.allTestPlanIDData = action?.payload?.data;

        state.successMsg.testPlanIdData = action?.payload?.message;
      })
      .addCase(getByTestPlanIDListThunk.rejected, (state, action) => {
        state.isLoading.testPlanIdData = false;
        state.testPlanIdData = [];
        state.errorMsg.testPlanIdData = action?.error?.message;
      })

      ////approve reject by reviewer
      .addCase(approveRejectByReviewerMasterThunk.pending, (state, action) => {
        state.isLoading.approveRejectData = true;
      })
      .addCase(
        approveRejectByReviewerMasterThunk.fulfilled,
        (state, action) => {
          state.isLoading.approveRejectData = false;
          state.approveRejectData = action?.payload?.data;
          state.successMsg.approveRejectData = action?.payload?.message;
        }
      )
      .addCase(approveRejectByReviewerMasterThunk.rejected, (state, action) => {
        state.isLoading.approveRejectData = false;
        state.approveRejectData = [];
        state.errorMsg.approveRejectData = action?.error?.message;
      });
  }
});

export default testCaseReviewSlice.reducer;
