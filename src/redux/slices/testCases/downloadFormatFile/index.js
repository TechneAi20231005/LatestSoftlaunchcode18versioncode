import { createSlice } from '@reduxjs/toolkit';

import {
  downloadFormatFileThunk,
  editTestCaseThunk,
  getAllDraftTestCaseList,
  getAllReviewTestDraftList,
  getByTestPlanIDReviewedListThunk,
  getDraftTestCaseList,
  getExportAllReviewTestDraftList,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk,
  importTestDraftThunk,
  sendTestCaseReviewerThunk,
  testDraftDetailsHistoryThunk
} from '../../../services/testCases/downloadFormatFile';

const initialState = {
  getProjectModuleList: [],
  getModuleList: [],
  getSubModuleList: [],
  getDraftTestListData: [],
  allDraftTestListData: [],
  allReviewDraftTestListData: [],
  exportAllReviewDraftTestListData: [],
  allReviewDraftTestListDataByID: [],
  allReviewDraftTestListData: [],
  allReviewDraftTestListDataTotal: [],
  filterReviewList: [],
  filterData: { payload: null },
  getModuleData: [],
  getSubModuleData: [],
  getTestDraftData: [],
  allDraftListData: [],
  testDraftHistory: [],
  filterReviewedDraftTestList: { payload: null },
  filterData: false,
  editTestCase: false,
  sendTestCasesReviewer: false,

  isLoading: {
    downloadFormatFile: false,
    allReviewDraftTestListData: false,
    getProjectModuleList: false,
    importTestDraftFile: false,
    getModuleList: false,
    filterData: false,
    getDraftTestListData: false,
    allDraftListData: false,
    filterReviewedDraftTestList: false,
    allDraftTestListData: false,
    allReviewDraftTestListData: false,
    allReviewDraftTestListDataByID: false,
    filterReviewList: false,
    getModuleData: false,
    getSubModuleData: false,
    getSubModuleList: false,
    editTestCase: false,
    sendTestCasesReviewer: false,
    testDraftHistory: false,
    exportAllReviewDraftTestListData: false
  },
  errorMsg: {
    getProjectModuleList: '',
    getDraftTestListData: '',
    allDraftListData: '',
    filterReviewList: '',
    allReviewDraftTestListData: '',
    allDraftTestListData: '',
    allReviewDraftTestListData: '',
    allReviewDraftTestListDataByID: '',
    filterReviewedDraftTestList: '',
    exportAllReviewDraftTestListData: ''
  },
  successMsg: {
    getProjectModuleList: '',
    getDraftTestListData: '',
    allDraftTestListData: '',
    allReviewDraftTestListData: '',
    allDraftListData: '',
    filterReviewList: '',
    allReviewDraftTestListData: '',
    allReviewDraftTestListDataByID: '',
    testDraftHistory: false,
    filterReviewedDraftTestList: '',
    exportAllReviewDraftTestListData: ''
  }
};
const downloadFormatSlice = createSlice({
  name: 'Download Format File',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      // // get project

      .addCase(getProjectModuleMasterThunk.pending, (state, action) => {
        state.isLoading.getProjectModuleList = true;
      })
      .addCase(getProjectModuleMasterThunk.fulfilled, (state, action) => {
        state.isLoading.getProjectModuleList = false;
        state.getProjectModuleList = action?.payload?.data
          .filter((project) => project.is_active === 1)
          .map((project) => ({
            value: project.id,
            label: project.project_name
          }));
        state.successMsg.getProjectModuleList = action.payload;
      })
      .addCase(getProjectModuleMasterThunk.rejected, (state, action) => {
        state.isLoading.getProjectModuleList = false;
        state.errorMsg.getProjectModuleList = action.error.message;
      })

      // // get module
      .addCase(getModuleMasterThunk.pending, (state, action) => {
        state.isLoading.getModuleList = true;
      })
      .addCase(getModuleMasterThunk.fulfilled, (state, action) => {
        state.isLoading.getModuleList = false;
        state.getModuleData = action.payload?.data.filter(
          (module) => module.is_active === 1
        );
        state.getModuleList = action?.payload?.data
          .filter((module) => module.is_active === 1)
          .map((module) => ({ value: module.id, label: module.module_name }));

        state.successMsg.getModuleList = action.payload;
      })
      .addCase(getModuleMasterThunk.rejected, (state, action) => {
        state.isLoading.getModuleList = false;
        state.errorMsg.getModuleList = action.error.message;
      })

      // // get sub Module

      .addCase(getSubModuleMasterThunk.pending, (state, action) => {
        state.isLoading.getSubModuleList = true;
      })
      .addCase(getSubModuleMasterThunk.fulfilled, (state, action) => {
        state.isLoading.getSubModuleList = false;
        state.getSubModuleData = state.getSubModuleList =
          action?.payload?.data.filter(
            (submodule) => submodule.is_active === 1
          );
        state.getSubModuleList = action?.payload?.data
          .filter((submodule) => submodule.is_active === 1)
          .map((submodule) => ({
            value: submodule.id,
            label: submodule.sub_module_name
          }));
        state.successMsg.getSubModuleList = action?.payload;
      })
      .addCase(getSubModuleMasterThunk.rejected, (state, action) => {
        state.isLoading.getSubModuleList = false;
        state.errorMsg.getSubModuleList = action?.error?.message;
      })

      // // download format file
      .addCase(downloadFormatFileThunk.pending, (state, action) => {
        state.isLoading.downloadFormatFile = true;
      })
      .addCase(downloadFormatFileThunk.fulfilled, (state, action) => {
        state.isLoading.downloadFormatFile = false;
        state.successMsg.downloadFormatFile = action?.payload;
      })
      .addCase(downloadFormatFileThunk.rejected, (state, action) => {
        state.isLoading.downloadFormatFile = false;
        state.errorMsg.downloadFormatFile = action?.error?.message;
      })

      // // import test draft
      .addCase(importTestDraftThunk.pending, (state, action) => {
        state.isLoading.importTestDraftFile = true;
      })
      .addCase(importTestDraftThunk.fulfilled, (state, action) => {
        state.isLoading.importTestDraftFile = false;
        state.successMsg.importTestDraftFile = action?.payload;
        state.getTestDraftData = action?.payload?.data;
      })
      .addCase(importTestDraftThunk.rejected, (state, action) => {
        state.isLoading.importTestDraftFile = false;
        state.errorMsg.importTestDraftFile = action?.error?.message;
      })

      // // send test cases to reviewer

      .addCase(sendTestCaseReviewerThunk.pending, (state, action) => {
        state.isLoading.sendTestCasesReviewer = true;
      })
      .addCase(sendTestCaseReviewerThunk.fulfilled, (state, action) => {
        state.isLoading.sendTestCasesReviewer = false;
        state.successMsg.sendTestCasesReviewer = action?.payload;
      })
      .addCase(sendTestCaseReviewerThunk.rejected, (state, action) => {
        state.isLoading.sendTestCasesReviewer = false;
        state.errorMsg.sendTestCasesReviewer = action?.error?.message;
      })

      ////edit test cases

      .addCase(editTestCaseThunk.pending, (state, action) => {
        state.isLoading.editTestCase = true;
      })
      .addCase(editTestCaseThunk.fulfilled, (state, action) => {
        state.isLoading.editTestCase = false;
        state.successMsg.editTestCase = action?.payload;
      })
      .addCase(editTestCaseThunk.rejected, (state, action) => {
        state.isLoading.editTestCase = false;
        state.errorMsg.editTestCase = action?.error?.message;
      })

      .addCase(getDraftTestCaseList.pending, (state, action) => {
        state.isLoading.getDraftTestListData = true;
      })
      .addCase(getDraftTestCaseList.fulfilled, (state, action) => {
        state.isLoading.getDraftTestListData = false;
        state.successMsg.getDraftTestListData = action?.payload;
        let data = !action?.payload?.data?.data?.data
          ? action?.payload?.data?.data
          : action?.payload?.data?.data?.data;

        state.getDraftTestListData = data;
        state.filterData = action?.payload?.data?.filter_data;

        state.allDraftListData = action?.payload?.data;
      })
      .addCase(getDraftTestCaseList.rejected, (state, action) => {
        state.isLoading.getDraftTestListData = false;
        state.errorMsg.getDraftTestListData = action?.error?.message;
      })

      .addCase(getAllDraftTestCaseList.pending, (state, action) => {
        state.isLoading.allDraftTestListData = true;
      })
      .addCase(getAllDraftTestCaseList.fulfilled, (state, action) => {
        state.isLoading.allDraftTestListData = false;
        state.successMsg.allDraftTestListData = action?.payload;
        state.allDraftTestListData = action?.payload?.data;
      })
      .addCase(getAllDraftTestCaseList.rejected, (state, action) => {
        state.isLoading.allDraftTestListData = false;
        state.errorMsg.allDraftTestListData = action?.error?.message;
      })

      //// get all review test draft

      .addCase(getAllReviewTestDraftList.pending, (state, action) => {
        state.isLoading.allReviewDraftTestListData = true;
      })
      .addCase(getAllReviewTestDraftList.fulfilled, (state, action) => {
        state.isLoading.allReviewDraftTestListData = false;
        state.successMsg.allReviewDraftTestListData = action?.payload;
        state.allReviewDraftTestListData = action?.payload?.data?.data?.data;
        state.filterReviewedDraftTestList = action?.payload?.data?.filter_data;
      })
      .addCase(getAllReviewTestDraftList.rejected, (state, action) => {
        state.isLoading.allReviewDraftTestListData = false;
        state.errorMsg.allReviewDraftTestListData = action?.error?.message;
      })

      // export reviewed data

      .addCase(getExportAllReviewTestDraftList.pending, (state, action) => {
        state.isLoading.exportAllReviewDraftTestListData = true;
      })
      .addCase(getExportAllReviewTestDraftList.fulfilled, (state, action) => {
        state.isLoading.exportAllReviewDraftTestListData = false;
        state.successMsg.exportAllReviewDraftTestListData = action?.payload;
        state.exportAllReviewDraftTestListData = action?.payload?.data?.data;
      })
      .addCase(getExportAllReviewTestDraftList.rejected, (state, action) => {
        state.isLoading.exportAllReviewDraftTestListData = false;
        state.errorMsg.exportAllReviewDraftTestListData =
          action?.error?.message;
      })

      //// get by id reviewed list

      .addCase(getByTestPlanIDReviewedListThunk.pending, (state, action) => {
        state.isLoading.allReviewDraftTestListDataByID = true;
      })
      .addCase(getByTestPlanIDReviewedListThunk.fulfilled, (state, action) => {
        state.isLoading.allReviewDraftTestListDataByID = false;
        state.successMsg.allReviewDraftTestListDataByID = action?.payload;
        state.allReviewDraftTestListDataByID =
          action?.payload?.data?.data?.data;
        state.allReviewDraftTestListData = action?.payload?.data;
        state.allReviewDraftTestListDataTotal = action?.payload?.data;

        state.filterReviewList = action?.payload?.data?.filter_data;
      })
      .addCase(getByTestPlanIDReviewedListThunk.rejected, (state, action) => {
        state.isLoading.allReviewDraftTestListDataByID = false;
        state.errorMsg.allReviewDraftTestListDataByID = action?.error?.message;
      })

      //// test draft history

      .addCase(testDraftDetailsHistoryThunk.pending, (state, action) => {
        state.isLoading.testDraftHistory = true;
      })
      .addCase(testDraftDetailsHistoryThunk.fulfilled, (state, action) => {
        state.isLoading.testDraftHistory = false;
        state.successMsg.testDraftHistory = action?.payload;
        state.testDraftHistory = action?.payload?.data;
      })
      .addCase(testDraftDetailsHistoryThunk.rejected, (state, action) => {
        state.isLoading.testDraftHistory = false;
        state.errorMsg.testDraftHistory = action?.error?.message;
      });
  }
});

export default downloadFormatSlice.reducer;
