import { createSlice } from '@reduxjs/toolkit';
import {
  getQrCodeList,
  getQrCodeListById,
  addQrCodeList
} from '../../../../services/hrms/employeeJoining/qrCodeListMaster';

const initialState = {
  qrCodeMasterList: [],
  qrCodeDetailsData: [],
  notify: null,
  isLoading: {
    getQrCodeMasterList: false,
    getQrCodeDetailsData: false,
    addQrCodeMasterList: false
  },

  errorMsg: {
    addQrCodeMasterList: ''
  },
  successMsg: {
    addQrCodeMasterList: ''
  }
};

const qrCodeMasterSlice = createSlice({
  name: 'QrCode master',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getQrCodeList.pending, (state, action) => {
        state.isLoading.getQrCodeMasterList = true;
        state.notify = null;
      })
      .addCase(getQrCodeList.fulfilled, (state, action) => {
        console.log(action.payload, 'action');
        state.isLoading.getQrCodeMasterList = false;
        state.qrCodeMasterList = action?.payload?.data;
        if (action.payload.data.status === 0) {
          state.notify = {
            type: 'danger',
            message: action.payload.data.message
          };
        }
      })
      .addCase(getQrCodeList.rejected, (state, action) => {
        state.isLoading.getQrCodeMasterList = false;
        state.qrCodeMasterList = [];
        state.errorMsg.getQrCodeMasterList = action.error.message;
      })

      // qr code details data
      .addCase(getQrCodeListById.pending, (state, action) => {
        state.isLoading.getQrCodeDetailsData = true;
        state.notify = null;
      })
      .addCase(getQrCodeListById.fulfilled, (state, action) => {
        state.isLoading.getQrCodeDetailsData = false;
        state.qrCodeDetailsData = action?.payload?.data;
        if (action.payload.data.status === 0) {
          state.notify = {
            type: 'danger',
            message: action.payload.data.message
          };
        }
      })
      .addCase(getQrCodeListById.rejected, (state, action) => {
        state.isLoading.getQrCodeDetailsData = false;
        state.qrCodeDetailsData = [];
        state.errorMsg.getQrCodeDetailsData = action.error.message;
      })

      .addCase(addQrCodeList.pending, (state, action) => {
        state.isLoading.addQrCodeMasterList = true;
      })
      .addCase(addQrCodeList.fulfilled, (state, action) => {
        state.isLoading.addQrCodeMasterList = false;
        state.successMsg.addQrCodeMasterList = action.payload;
      })
      .addCase(addQrCodeList.rejected, (state, action) => {
        state.isLoading.addQrCodeMasterList = false;
        state.errorMsg.addQrCodeMasterList = action.error.message;
      });
  }
});

export default qrCodeMasterSlice.reducer;
