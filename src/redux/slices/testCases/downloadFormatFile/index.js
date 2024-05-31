import { createSlice } from "@reduxjs/toolkit";

import {
  downloadFormatFileThunk,
  editTestCaseThunk,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk,
  importTestDraftThunk,
  sendTestCaseReviewerThunk,
} from "../../../services/testCases/downloadFormatFile";

const initialState = {
  getProjectModuleList: [],
  getMouleList: [],
  getSubMouleList: [],
  getModuleData: [],
  getSubModuleData: [],
  getTestDraftData: [],
  editTestCase: false,
  sendTestCasesReviewer: false,

  isLoading: {
    downloadFormatFile: false,
    getProjectModuleList: false,
    importTestDraftFile: false,
    getMouleList: false,
    getModuleData: false,
    getSubModuleData: false,
    getSubMouleList: false,
    editTestCase: false,
    sendTestCasesReviewer: false,
  },
  errorMsg: { getProjectModuleList: "" },
  successMsg: { getProjectModuleList: "" },
};
const downloadFormatSlice = createSlice({
  name: "Download Format File",
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
          .filter((d) => d.is_active == 1)
          .map((d) => ({ value: d.id, label: d.project_name }));
        state.successMsg.getProjectModuleList = action.payload;
      })
      .addCase(getProjectModuleMasterThunk.rejected, (state, action) => {
        state.isLoading.getProjectModuleList = false;
        state.errorMsg.getProjectModuleList = action.error.message;
      })

      // // get module
      .addCase(getModuleMasterThunk.pending, (state, action) => {
        state.isLoading.getMouleList = true;
      })
      .addCase(getModuleMasterThunk.fulfilled, (state, action) => {
        state.isLoading.getMouleList = false;
        state.getModuleData = action.payload?.data.filter(
          (d) => d.is_active == 1
        );
        state.getMouleList = action?.payload?.data
          .filter((d) => d.is_active == 1)
          .map((d) => ({ value: d.id, label: d.module_name }));

        state.successMsg.getMouleList = action.payload;
      })
      .addCase(getModuleMasterThunk.rejected, (state, action) => {
        state.isLoading.getMouleList = false;
        state.errorMsg.getMouleList = action.error.message;
      })

      // // get sub Module

      .addCase(getSubModuleMasterThunk.pending, (state, action) => {
        state.isLoading.getSubMouleList = true;
      })
      .addCase(getSubModuleMasterThunk.fulfilled, (state, action) => {
        state.isLoading.getSubMouleList = false;
        state.getSubModuleData = state.getSubMouleList =
          action?.payload?.data.filter((d) => d.is_active == 1);
        state.getSubMouleList = action?.payload?.data
          .filter((d) => d.is_active == 1)
          .map((d) => ({ value: d.id, label: d.sub_module_name }));
        state.successMsg.getSubMouleList = action.payload;
      })
      .addCase(getSubModuleMasterThunk.rejected, (state, action) => {
        state.isLoading.getSubMouleList = false;
        state.errorMsg.getSubMouleList = action.error.message;
      })

      // // download format file
      .addCase(downloadFormatFileThunk.pending, (state, action) => {
        state.isLoading.downloadFormatFile = true;
      })
      .addCase(downloadFormatFileThunk.fulfilled, (state, action) => {
        state.isLoading.downloadFormatFile = false;
        state.successMsg.downloadFormatFile = action.payload;
      })
      .addCase(downloadFormatFileThunk.rejected, (state, action) => {
        state.isLoading.downloadFormatFile = false;
        state.errorMsg.downloadFormatFile = action.error.message;
      })

      // // import test draft
      .addCase(importTestDraftThunk.pending, (state, action) => {
        state.isLoading.downloadFormatFile = true;
      })
      .addCase(importTestDraftThunk.fulfilled, (state, action) => {
        state.isLoading.importTestDraftFile = false;
        state.successMsg.importTestDraftFile = action.payload;
        state.getTestDraftData = action.payload.data;
      })
      .addCase(importTestDraftThunk.rejected, (state, action) => {
        state.isLoading.importTestDraftFile = false;
        state.errorMsg.importTestDraftFile = action.error.message;
      })

      // // send test cases to reviewer

      .addCase(sendTestCaseReviewerThunk.pending, (state, action) => {
        state.isLoading.sendTestCasesReviewer = true;
      })
      .addCase(sendTestCaseReviewerThunk.fulfilled, (state, action) => {
        state.isLoading.sendTestCasesReviewer = false;
        state.successMsg.sendTestCasesReviewer = action.payload;
      })
      .addCase(sendTestCaseReviewerThunk.rejected, (state, action) => {
        state.isLoading.sendTestCasesReviewer = false;
        state.errorMsg.sendTestCasesReviewer = action.error.message;
      })

      ////edit test cases

      .addCase(editTestCaseThunk.pending, (state, action) => {
        state.isLoading.editTestCase = true;
      })
      .addCase(editTestCaseThunk.fulfilled, (state, action) => {
        state.isLoading.editTestCase = false;
        state.successMsg.editTestCase = action.payload;
      })
      .addCase(editTestCaseThunk.rejected, (state, action) => {
        state.isLoading.editTestCase = false;
        state.errorMsg.editTestCase = action.error.message;
      });
  },
});

export default downloadFormatSlice.reducer;
