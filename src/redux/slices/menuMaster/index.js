import { createSlice } from '@reduxjs/toolkit';
import {
  getMenuMasterList,
  addMenuMasterList,
  editMenuMasterList
} from '../../services/menuMaster/index';

const initialState = {
  menuMasterList: [],
  notify: null,
  isLoading: {
    getMenuMasterList: false,
    addMenuMasterList: false,
    editMenuMasterList: false
  },

  errorMsg: {
    addMenuMasterList: '',
    editMenuMasterList: ''
  },
  successMsg: {
    addMenuMasterList: '',
    editMenuMasterList: ''
  }
};

const menuMasterSlice = createSlice({
  name: 'Menu Master',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMenuMasterList.pending, (state, action) => {
        state.isLoading.getMenuMasterList = true;
        state.notify = null;
      })
      .addCase(getMenuMasterList.fulfilled, (state, action) => {
        state.isLoading.getMenuMasterList = false;
        state.menuMasterList = action?.payload?.data;
        if (action.payload.data.status === 0) {
          state.notify = {
            type: 'danger',
            message: action.payload.data.message
          };
        }
      })
      .addCase(getMenuMasterList.rejected, (state, action) => {
        state.isLoading.getMenuMasterList = false;
        state.menuMasterList = [];
        state.errorMsg.getQrCodeMasterList = action.error.message;
      })

      //add data
      .addCase(addMenuMasterList.pending, (state, action) => {
        state.isLoading.addMenuMasterList = true;
      })
      .addCase(addMenuMasterList.fulfilled, (state, action) => {
        state.isLoading.addMenuMasterList = false;
        state.successMsg.addMenuMasterList = action.payload;
      })
      .addCase(addMenuMasterList.rejected, (state, action) => {
        state.isLoading.addMenuMasterList = false;
        state.errorMsg.addMenuMasterList = action.error.message;
      })
      //edit Data

      .addCase(editMenuMasterList.pending, (state, action) => {
        state.isLoading.editMenuMasterList = true;
      })
      .addCase(editMenuMasterList.fulfilled, (state, action) => {
        state.isLoading.editMenuMasterList = false;
        state.successMsg.editMenuMasterList = action.payload;
      })
      .addCase(editMenuMasterList.rejected, (state, action) => {
        state.isLoading.editMenuMasterList = false;
        state.errorMsg.editMenuMasterList = action.error.message;
      });
  }
});

export default menuMasterSlice.reducer;
