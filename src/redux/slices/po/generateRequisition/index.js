import { createSlice } from '@reduxjs/toolkit';

import {
  getGenerateRequisitionListThunk,
  uploadFileGenerateRequisitionThunk,
} from '../../../services/po/generateRequisition';

const initialState = {
  generateRequisitionListData: [],
  isLoading: {
    uploadFileGenerateRequisition: false,
    generateRequisitionList: false,
  },
  errorMsg: { uploadFileGenerateRequisition: '', generateRequisitionList: '' },
  successMsg: { uploadFileGenerateRequisition: '', generateRequisitionLis: '' },
};
const generateRequisitionSlice = createSlice({
  name: 'Generate Requisition',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      // // generate requisitions using bulk upload
      .addCase(uploadFileGenerateRequisitionThunk.pending, (state, action) => {
        state.isLoading.uploadFileGenerateRequisition = true;
      })
      .addCase(uploadFileGenerateRequisitionThunk.fulfilled, (state, action) => {
        state.isLoading.uploadFileGenerateRequisition = false;
        state.successMsg.uploadFileGenerateRequisition = action.payload;
      })
      .addCase(uploadFileGenerateRequisitionThunk.rejected, (state, action) => {
        state.isLoading.uploadFileGenerateRequisition = false;
        state.errorMsg.uploadFileGenerateRequisition = action.error.message;
      })

      // // get generate requisitions list data
      .addCase(getGenerateRequisitionListThunk.pending, (state, action) => {
        state.isLoading.generateRequisitionList = true;
      })
      .addCase(getGenerateRequisitionListThunk.fulfilled, (state, action) => {
        state.isLoading.generateRequisitionList = false;
        state.generateRequisitionListData = action.payload?.data;
        state.successMsg.generateRequisitionList = action.payload?.msg;
      })
      .addCase(getGenerateRequisitionListThunk.rejected, (state, action) => {
        state.isLoading.generateRequisitionList = false;
        state.generateRequisitionListData = [];
        state.errorMsg.generateRequisitionList = action.error.message;
      });
  },
});

export default generateRequisitionSlice.reducer;
