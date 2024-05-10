import { createSlice } from '@reduxjs/toolkit';

import { uploadFileGenerateRequisitionThunk } from '../../../services/po/generateRequisition';

const initialState = {
  isLoading: {
    uploadFileGenerateRequisition: false,
  },
  errorMsg: { uploadFileGenerateRequisition: '' },
  successMsg: { uploadFileGenerateRequisition: '' },
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
      });
  },
});

export default generateRequisitionSlice.reducer;
