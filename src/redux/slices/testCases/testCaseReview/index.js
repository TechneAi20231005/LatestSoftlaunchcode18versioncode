import { createSlice } from '@reduxjs/toolkit';

import {
  approveRejectByReviewerMasterThunk,
  getByTestPlanIDListThunk,
  getExportByTestPlanIDListThunk,
  getReviewTestCasesData,
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
  reviewTestCaseData: [],
  totalCount: 0,
  isLoading: {
    testCaseReviewList: false,
    testPlanIdData: false,
    filterTestPlanData: false,
    filterTestCaseReviewList: false,
    exportTestCaseReviewData: false,
    reviewTestCaseData: false
  },
  errorMsg: {
    testCaseReviewList: '',
    testPlanIdData: '',
    approveRejectData: '',
    allTestPlanIDData: '',
    filterTestPlanData: '',
    filterTestCaseReviewList: '',
    exportTestCaseReviewData: '',
    reviewTestCaseData: ''
  },
  successMsg: {
    testCaseReviewList: '',
    testPlanIdData: '',
    approveRejectData: '',
    allTestPlanIDData: '',
    filterTestPlanData: '',
    filterTestCaseReviewList: '',
    exportTestCaseReviewData: '',
    reviewTestCaseData: ''
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
        state.testCaseReviewList = action?.payload?.data?.data?.data || [];
        state.filterTestCaseReviewList = action?.payload?.data?.filter_data;
        state.totalCount = action?.payload?.data?.data?.total || 0;
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
      })

      .addCase(getReviewTestCasesData.pending, (state, action) => {
        state.isLoading.reviewTestCaseData = true;
      })
      .addCase(getReviewTestCasesData.fulfilled, (state, action) => {
        state.isLoading.reviewTestCaseData = false;
        state.reviewTestCaseData = action?.payload?.data;
        state.successMsg.reviewTestCaseData = action?.payload?.message;
      })
      .addCase(getReviewTestCasesData.rejected, (state, action) => {
        state.isLoading.reviewTestCaseData = false;
        state.reviewTestCaseData = [];
        state.errorMsg.reviewTestCaseData = action?.error?.message;
      });
  }
});

export default testCaseReviewSlice.reducer;
