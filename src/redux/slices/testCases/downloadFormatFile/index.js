import { createSlice } from "@reduxjs/toolkit";
import {
  addFunctionMasterThunk,
  editFunctionMasterThunk,
  getFunctionMasterListThunk,
} from "../../../services/testCases/functionMaster";
import {
  downloadFormatFileThunk,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk,
  importTestDraftThunk,
} from "../../../services/testCases/downloadFormatFile";

const initialState = {
  getProjectMouleList: [],
  getMouleList: [],
  getSubMouleList: [],
  getModuleData: [],
  getSubModuleData: [],

  isLoading: {
    downloadFormatFile: false,
    getProjectMouleList: false,
    importTestDraftFile: false,
    getMouleList: false,
    getModuleData: false,
    getSubModuleData: false,
    getSubMouleList: false,
  },
  errorMsg: { getProjectMouleList: "" },
  successMsg: { getProjectMouleList: "" },
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
        state.isLoading.getProjectMouleList = true;
      })
      .addCase(getProjectModuleMasterThunk.fulfilled, (state, action) => {
        state.isLoading.getProjectMouleList = false;
        state.getProjectMouleList = action?.payload?.data
          .filter((d) => d.is_active == 1)
          .map((d) => ({ value: d.id, label: d.project_name }));
        state.successMsg.getProjectMouleList = action.payload;
      })
      .addCase(getProjectModuleMasterThunk.rejected, (state, action) => {
        state.isLoading.getProjectMouleList = false;
        state.errorMsg.getProjectMouleList = action.error.message;
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

      // // add remark master
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
      })
      .addCase(importTestDraftThunk.rejected, (state, action) => {
        state.isLoading.importTestDraftFile = false;
        state.errorMsg.importTestDraftFile = action.error.message;
      });
  },
});

export default downloadFormatSlice.reducer;
