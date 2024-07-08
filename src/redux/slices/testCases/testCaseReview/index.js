import { createSlice } from '@reduxjs/toolkit';

import {
  approveRejectByReviewerMasterThunk,
  getByTestPlanIDListThunk,
  getExportByTestPlanIDListThunk,
  getTestCaseReviewListThunk
} from '../../../services/testCases/testCaseReview';

const initialState = {
  testCaseReviewList: [],
  testPlanIdData: [],
  filterTestPlanData: [],
  approveRejectData: [],
  allTestPlanIDData: [],
  filterTestCaseReviewList: [],
  exportTestCaseReviewData: [],
  isLoading: {
    testCaseReviewList: false,
    testPlanIdData: false,
    filterTestPlanData: false,
    filterTestCaseReviewList: false,
    exportTestCaseReviewData: false
  },
  errorMsg: {
    testCaseReviewList: '',
    testPlanIdData: '',
    approveRejectData: '',
    allTestPlanIDData: '',
    filterTestPlanData: '',
    filterTestCaseReviewList: '',
    exportTestCaseReviewData: ''
  },
  successMsg: {
    testCaseReviewList: '',
    testPlanIdData: '',
    approveRejectData: '',
    allTestPlanIDData: '',
    filterTestPlanData: '',
    filterTestCaseReviewList: '',
    exportTestCaseReviewData: ''
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
        state.testCaseReviewList = action?.payload?.data?.data?.data;
        state.filterTestCaseReviewList = action?.payload?.data?.filter_data;
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
        state.testPlanIdData = action?.payload?.data?.data?.data;
        state.filterTestPlanData = action?.payload?.data?.filter_data;
        state.allTestPlanIDData = action?.payload?.data;

        state.successMsg.testPlanIdData = action?.payload?.message;
      })
      .addCase(getByTestPlanIDListThunk.rejected, (state, action) => {
        state.isLoading.testPlanIdData = false;
        state.testPlanIdData = [];
        state.errorMsg.testPlanIdData = action?.error?.message;
      })

      // // export test case review

      .addCase(getExportByTestPlanIDListThunk.pending, (state, action) => {
        state.isLoading.exportTestCaseReviewData = true;
      })
      .addCase(getExportByTestPlanIDListThunk.fulfilled, (state, action) => {
        state.isLoading.exportTestCaseReviewData = false;
        state.exportTestCaseReviewData = action?.payload?.data?.data;
        state.successMsg.exportTestCaseReviewData = action?.payload?.message;
      })
      .addCase(getExportByTestPlanIDListThunk.rejected, (state, action) => {
        state.isLoading.exportTestCaseReviewData = false;
        state.exportTestCaseReviewData = [];
        state.errorMsg.exportTestCaseReviewData = action?.error?.message;
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
