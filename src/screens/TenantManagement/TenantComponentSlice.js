import { createSlice } from '@reduxjs/toolkit';

import {
  getAllTenant,
  posttenantData,
  updatetenantData
} from './TenantConponentAction';

const initialState = {
  status: '',
  err: '',
  notify: {},
  modal: {
    showModal: false,
    modalData: '',
    modalHeader: ''
  },
  isLoading: false,
  exportRoleData: [],
  exportAllTenantData: [],
  getAllTenant: []
};

export const tenantmasterSlice = createSlice({
  name: 'rolemasterSlice',
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
    handleModalOpen: (state, action) => {
      state.modal = action.payload;
    },
    handleModalClose: (state, action) => {
      state.modal = action.payload;
    },
    handleError: (state, action) => {
      state.notify = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTenant.pending, (state) => {
      state.status = 'loading';
      state.isLoading = true;
    });
    builder.addCase(getAllTenant.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getAllTenant = payload.data.data?.data;
        state.status = 'succeded';
        state.getAllTenant = getAllTenant;
        state.showLoaderModal = false;
        state.isLoading = false;
      }
    });
    builder.addCase(getAllTenant.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading = false;
    });

    //__________________________PostTenant________________________________
    builder.addCase(posttenantData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });
    builder.addCase(posttenantData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.modal = { showModal: false, modalData: null, modalHeader: '' };
        let posttenantData = payload.data.data?.data;
        state.status = 'succeded';
        state.showLoaderModal = false;
        state.posttenantData = posttenantData;
      }
    });
    builder.addCase(posttenantData.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(updatetenantData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });
    builder.addCase(updatetenantData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.data?.status === 1) {
        // state.notify = { type: "success", message: payload.data.message };
      }
    });
    builder.addCase(updatetenantData.rejected, (state) => {
      state.status = 'rejected';
    });

    //___________________________________________UpdateRole_________________________________
  }
});

export const { handleModalOpen, handleModalClose, handleError } =
  tenantmasterSlice.actions;
export default tenantmasterSlice.reducer;
