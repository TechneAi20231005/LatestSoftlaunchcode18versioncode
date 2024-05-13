import { createSlice } from '@reduxjs/toolkit';
import { getStatusData, postStatusData, updateStatusData } from './StatusComponentAction';

const initialState = {
  status: '',
  err: '',
  notify: '',
  modal: {
    showModal: false,
    modalData: '',
    modalHeader: '',
  },
  isLoading: {
    statusData: false,
  },
  exportStatusData: [],

  getStatusData: [],
  sortStatusData: [],
  filterStatus: [],
  postStatusData: '',
  filterStatusData: [],
};

export const statusMasterSlice = createSlice({
  name: 'statusMasterSlice',
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
  },
  extraReducers: builder => {
    builder.addCase(getStatusData.pending, state => {
      state.status = 'loading';
      state.isLoading.statusData = true;
      state.notify = null;
    });
    builder.addCase(getStatusData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.statusData = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getStatusData = payload.data.data;
        let filterStatusData = payload.data.data.filter(d => d.tenant_id != 0);
        state.filterStatusData = [...filterStatusData];
        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getStatusData.length; i++) {
          getStatusData[i].counter = count++;
        }
        state.getStatusData = [...getStatusData];

        let sortStatusData = [];
        for (const key in getStatusData) {
          // if (temp[key].is_active == 1) {
          if (getStatusData[key].id) {
            sortStatusData.push({
              value: getStatusData[key].id,
              label: getStatusData[key].status,
            });
          }
        }

        let filerStatus = payload.data.data
          .filter(d => d.is_active == 1)
          .map(d => ({ value: d.id, label: d.status }));
        state.filterStatus = filerStatus;
        state.sortStatusData = sortStatusData;
        let exportStatusData = [];
        for (const i in getStatusData) {
          exportStatusData.push({
            // Sr: getStatusData[i].counter,
            // Role: getStatusData[i].role,
            // Status: getStatusData[i].is_active ? "Active" : "Deactive",
            // Remark: getStatusData[i].remark,
            // created_at: getStatusData[i].created_at,
            // created_by: getStatusData[i].created_by,
            // updated_at: getStatusData[i].updated_at,
            // updated_by: getStatusData[i].updated_by,

            Sr: getStatusData[i].counter,
            status_Name: getStatusData[i].status,
            Status: getStatusData[i].is_active ? 'Active' : 'Deactive',
            // Remark:getStatusData[i].remark,
            created_at: getStatusData[i].created_at,
            created_by: getStatusData[i].created_by,
            updated_at: getStatusData[i].updated_at,
            updated_by: getStatusData[i].updated_by,
          });
        }
        state.exportStatusData = exportStatusData;
      }
    });
    builder.addCase(getStatusData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.statusData = false;
      state.notify = null;
    });

    //__________________________PostRole________________________________
    builder.addCase(postStatusData.pending, state => {
      state.status = 'loading';
      state.notify = null;
      state.isLoading.statusData = true;
    });
    builder.addCase(postStatusData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.statusData = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postStatusData = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        state.postStatusData = postStatusData;
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        let notify = { type: 'danger', message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(postStatusData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.statusData = false;
    });

    //___________________________________________UpdateRole_________________________________

    builder.addCase(updateStatusData.pending, state => {
      state.status = 'loading';
      state.notify = null;
      state.isLoading.statusData = true;
    });
    builder.addCase(updateStatusData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateStatusData = payload.data.data;
        state.notify = null;
        state.isLoading.statusData = false;

        state.status = 'succeded';
        state.showLoaderModal = false;
        state.updateStatusData = updateStatusData;
        state.notify = { type: 'success', message: payload.data.message };
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(updateStatusData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.statusData = false;
    });
  },
});

export const { handleModalOpen, handleModalClose } = statusMasterSlice.actions;
export default statusMasterSlice.reducer;
