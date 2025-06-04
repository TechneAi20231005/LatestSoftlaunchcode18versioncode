import { createSlice } from '@reduxjs/toolkit';

import {
  addTestCaseThunk,
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
  getTestCaseStatusDataList,
  importTestDraftThunk,
  sendTestCaseReviewerThunk,
  sendTestPlanReviewerThunk,
  testDraftDetailsHistoryThunk,
  testPlansHistoryThunk
} from '../../../services/testCases/downloadFormatFile';

const initialState = {
  getProjectModuleList: [],
  getModuleList: [],
  projectId: null,
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
  testPlantHistory: [],
  filterReviewedDraftTestList: { payload: null },
  filterData: false,
  editTestCase: false,
  sendTestCasesReviewer: false,
  testCasesStatusDataList: [],
  sendTestPlanReviewerList: [],
  addTestPlanReviewerList: [],
  getProjectModuleListId: [],

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
    testPlantHistory: false,
    exportAllReviewDraftTestListData: false,
    testCasesStatusDataList: false,
    sendTestPlanReviewerList: false,
    addTestPlanReviewerList: false,
    getProjectModuleListId: false
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
    exportAllReviewDraftTestListData: '',
    testCasesStatusDataList: '',
    sendTestPlanReviewerList: '',
    testPlantHistory: '',
    testDraftHistory: '',
    addTestPlanReviewerList: '',
    getProjectModuleListId: ''
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
    testDraftHistory: '',
    filterReviewedDraftTestList: '',
    exportAllReviewDraftTestListData: '',
    testCasesStatusDataList: '',
    sendTestPlanReviewerList: '',
    testPlantHistory: '',
    addTestPlanReviewerList: '',
    getProjectModuleListId: ''
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
            value: project.project_name,
            label: project.project_name
          }));
        state.getProjectModuleListId = action?.payload?.data
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
          .map((module) => ({
            value: module.module_name,
            label: module.module_name
          }));

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
            value: submodule.sub_module_name,
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
        console.log('state', action?.payload?.data?.project_id);

        state.isLoading.getDraftTestListData = false;
        state.successMsg.getDraftTestListData = action?.payload;
        // console.log('projectid', action?.payload);
        state.projectId = action?.payload?.data?.project_id;
        let data = !action?.payload?.data?.data?.data
          ? action?.payload?.data?.data?.data
          : action?.payload?.data?.data?.data?.filter(
              (d) =>
                d?.tai_bc_status_conventions?.convention_name?.toUpperCase() ===
                'DRAFT'
            );

        state.getDraftTestListData = data;
        state.filterData = action?.payload?.data?.filter_data;

        state.allDraftListData = action?.payload?.data;
      })
      .addCase(getDraftTestCaseList.rejected, (state, action) => {
        state.isLoading.getDraftTestListData = false;
        console.log('projectid', action);

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
        state.allReviewDraftTestListData = action?.payload?.data?.data;
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
      })

      .addCase(testPlansHistoryThunk.pending, (state, action) => {
        state.isLoading.testPlantHistory = true;
      })
      .addCase(testPlansHistoryThunk.fulfilled, (state, action) => {
        state.isLoading.testPlantHistory = false;
        state.successMsg.testPlantHistory = action?.payload;
        state.testPlantHistory = action?.payload?.data.data;
      })
      .addCase(testPlansHistoryThunk.rejected, (state, action) => {
        state.isLoading.testPlantHistory = false;
        state.errorMsg.testPlantHistory = action?.error?.message;
      })

      ////test cases status data

      .addCase(getTestCaseStatusDataList.pending, (state, action) => {
        state.isLoading.testCasesStatusDataList = true;
      })
      .addCase(getTestCaseStatusDataList.fulfilled, (state, action) => {
        state.isLoading.testCasesStatusDataList = false;
        state.successMsg.testCasesStatusDataList = action?.payload;
        state.testCasesStatusDataList = action?.payload?.data?.data;
        // ?.find(
        //   (d) => d.convention_name === 'PENDING'
        // );
        // .map((i) => i.id);
      })
      .addCase(getTestCaseStatusDataList.rejected, (state, action) => {
        state.isLoading.testCasesStatusDataList = false;
        state.errorMsg.testCasesStatusDataList = action?.error?.message;
      })

      .addCase(sendTestPlanReviewerThunk.pending, (state, action) => {
        state.isLoading.sendTestPlanReviewerList = true;
      })
      .addCase(sendTestPlanReviewerThunk.fulfilled, (state, action) => {
        state.isLoading.sendTestPlanReviewerList = false;
        state.successMsg.sendTestPlanReviewerList = action?.payload;
      })
      .addCase(sendTestPlanReviewerThunk.rejected, (state, action) => {
        state.isLoading.sendTestPlanReviewerList = false;
        state.errorMsg.sendTestPlanReviewerList = action?.error?.message;
      })

      .addCase(addTestCaseThunk.pending, (state, action) => {
        state.isLoading.addTestPlanReviewerList = true;
      })
      .addCase(addTestCaseThunk.fulfilled, (state, action) => {
        state.isLoading.addTestPlanReviewerList = false;
        state.successMsg.addTestPlanReviewerList = action?.payload;
      })
      .addCase(addTestCaseThunk.rejected, (state, action) => {
        state.isLoading.addTestPlanReviewerList = false;
        state.errorMsg.addTestPlanReviewerList = action?.error?.message;
      });
  }
});

export default downloadFormatSlice.reducer;
