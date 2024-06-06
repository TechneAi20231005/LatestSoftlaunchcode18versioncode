import { createSlice } from '@reduxjs/toolkit';

import {
  getGenerateRequisitionListThunk,
  uploadFileGenerateRequisitionThunk
} from '../../../services/po/generateRequisition';

const initialState = {
  generateRequisitionListData: [],
  generateRequisitionExportDataList: [],
  isLoading: {
    uploadFileGenerateRequisition: false,
    generateRequisitionList: false,
    getGenerateRequisitionExportDataList: false
  },
  errorMsg: { uploadFileGenerateRequisition: '', generateRequisitionList: '' },
  successMsg: { uploadFileGenerateRequisition: '', generateRequisitionList: '' }
};
const generateRequisitionSlice = createSlice({
  name: 'Generate Requisition',
  initialState,
  reducers: {
    resetGenerateRequisitionExportDataList(state, action) {
      state.generateRequisitionExportDataList = [];
    }
  },
  extraReducers(builder) {
    builder
      // // generate requisitions using bulk upload
      .addCase(uploadFileGenerateRequisitionThunk.pending, (state, action) => {
        state.isLoading.uploadFileGenerateRequisition = true;
      })
      .addCase(
        uploadFileGenerateRequisitionThunk.fulfilled,
        (state, action) => {
          state.isLoading.uploadFileGenerateRequisition = false;
          state.successMsg.uploadFileGenerateRequisition = action.payload;
        }
      )
      .addCase(uploadFileGenerateRequisitionThunk.rejected, (state, action) => {
        state.isLoading.uploadFileGenerateRequisition = false;
        state.errorMsg.uploadFileGenerateRequisition = action.error.message;
      })

      // // get generate requisitions list data
      .addCase(getGenerateRequisitionListThunk.pending, (state, action) => {
        const { datatype } = action.meta.arg;
        if (datatype) {
          state.isLoading.getGenerateRequisitionExportDataList = true;
        } else {
          state.isLoading.generateRequisitionList = true;
        }
      })
      .addCase(getGenerateRequisitionListThunk.fulfilled, (state, action) => {
        if (action?.payload?.isExport) {
          state.generateRequisitionExportDataList = action.payload.data;
          state.isLoading.getGenerateRequisitionExportDataList = false;
        } else {
          state.isLoading.generateRequisitionList = false;
          state.generateRequisitionListData = action.payload?.data;
          state.successMsg.generateRequisitionList = action.payload?.msg;
        }
      })
      .addCase(getGenerateRequisitionListThunk.rejected, (state, action) => {
        state.isLoading.generateRequisitionList = false;
        state.isLoading.getGenerateRequisitionExportDataList = false;
        state.generateRequisitionListData = [];
        state.generateRequisitionExportDataList = [];
        state.errorMsg.generateRequisitionList = action.error.message;
      });
  }
});

export const { resetGenerateRequisitionExportDataList } =
  generateRequisitionSlice.actions;
export default generateRequisitionSlice.reducer;
