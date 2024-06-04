import { createSlice } from '@reduxjs/toolkit';

import {
  downloadFormatFileThunk,
  editTestCaseThunk,
  getAllDraftTestCaseList,
  getAllReviewTestDraftList,
  getByTestPlanIDReviewedListThunk,
  getDraftTestCaseList,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk,
  importTestDraftThunk,
  sendTestCaseReviewerThunk
} from '../../../services/testCases/downloadFormatFile';

const initialState = {
  getProjectModuleList: [],
  getModuleList: [],
  getSubModuleList: [],
  getDraftTestListData: [],
  allDraftTestListData: [],
  allReviewDraftTestListData: [],
  allReviewDraftTestListDataByID: [],

  getModuleData: [],
  getSubModuleData: [],
  getTestDraftData: [],
  editTestCase: false,
  sendTestCasesReviewer: false,

  isLoading: {
    downloadFormatFile: false,
    getProjectModuleList: false,
    importTestDraftFile: false,
    getModuleList: false,
    getDraftTestListData: false,
    allDraftTestListData: false,
    allReviewDraftTestListData: false,
    allReviewDraftTestListDataByID: false,
    getModuleData: false,
    getSubModuleData: false,
    getSubModuleList: false,
    editTestCase: false,
    sendTestCasesReviewer: false
  },
  errorMsg: {
    getProjectModuleList: '',
    getDraftTestListData: '',
    allDraftTestListData: '',
    allReviewDraftTestListData: '',
    allReviewDraftTestListDataByID: ''
  },
  successMsg: {
    getProjectModuleList: '',
    getDraftTestListData: '',
    allDraftTestListData: '',
    allReviewDraftTestListData: '',
    allReviewDraftTestListDataByID: ''
  }
};
const downloadFormatSlice = createSlice({
  name: 'Download Format File',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder

      // // get project

      .addCase(getProjectModuleMasterThunk.pending, (state, action) => {
        state.isLoading.getProjectModuleList = true;
      })
      .addCase(getProjectModuleMasterThunk.fulfilled, (state, action) => {
        state.isLoading.getProjectModuleList = false;
        state.getProjectModuleList = action?.payload?.data
          .filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.project_name }));
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
          (d) => d.is_active === 1
        );
        state.getModuleList = action?.payload?.data
          .filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.module_name }));

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
          action?.payload?.data.filter((d) => d.is_active === 1);
        state.getSubModuleList = action?.payload?.data
          .filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.sub_module_name }));
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
        state.isLoading.downloadFormatFile = true;
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
        state.getDraftTestListData = action?.payload?.data?.data;
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
        state.allReviewDraftTestListData = action?.payload?.data;
      })
      .addCase(getAllReviewTestDraftList.rejected, (state, action) => {
        state.isLoading.allReviewDraftTestListData = false;
        state.errorMsg.allReviewDraftTestListData = action?.error?.message;
      })

      //// get by id reviewed list

      .addCase(getByTestPlanIDReviewedListThunk.pending, (state, action) => {
        state.isLoading.allReviewDraftTestListDataByID = true;
      })
      .addCase(getByTestPlanIDReviewedListThunk.fulfilled, (state, action) => {
        state.isLoading.allReviewDraftTestListDataByID = false;
        state.successMsg.allReviewDraftTestListDataByID = action?.payload;
        state.allReviewDraftTestListDataByID = action?.payload?.data?.data;
      })
      .addCase(getByTestPlanIDReviewedListThunk.rejected, (state, action) => {
        state.isLoading.allReviewDraftTestListDataByID = false;
        state.errorMsg.allReviewDraftTestListDataByID = action?.error?.message;
      });
  }
});

export default downloadFormatSlice.reducer;
