import { createSlice } from '@reduxjs/toolkit';
import {
  departmentData,
  postdepartment,
  updateDepartment
} from './DepartmentMasterAction';

const initialState = {
  status: '',
  err: '',
  departmentData: [],
  exportDepartmentData: [],
  sortDepartmentData: [],
  modal: {
    showModal: false,
    modalData: '',
    modalHeader: ''
  },
  isLoading: {
    departmentDataList: false
  }
};

export const departmentMasterSlice = createSlice({
  name: 'departmentMasterSlice',
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
    }
  },
  extraReducers: (builder) => {
    builder.addCase(departmentData.pending, (state) => {
      state.status = 'loading';
      state.isLoading.departmentDataList = true;
      state.notify = null;
    });
    builder.addCase(departmentData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.departmentDataList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let departmentData = payload.data.data?.data;
        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < departmentData.length; i++) {
          departmentData[i].counter = count++;
        }
        state.departmentData = [...departmentData];
        let exportDepartmentData = [];

        let filterdata = payload.data.data.data?.filter(
          (d) => d.is_active === 1
        );
        let sortDepartmentData = [];
        for (const key in filterdata) {
          if (filterdata[key].department) {
            sortDepartmentData.push({
              value: filterdata[key].id,
              label: filterdata[key].department
            });
          }
        }

        state.sortDepartmentData = sortDepartmentData;

        for (const i in departmentData) {
          exportDepartmentData.push({
            Sr: departmentData[i].counter,
            Department: departmentData[i].department,
            Status: departmentData[i].is_active ? 'Active' : 'Deactive',
            Remark: departmentData[i].remark,
            created_at: departmentData[i].created_at,
            created_by: departmentData[i].created_by,
            updated_at: departmentData[i].updated_at,
            updated_by: departmentData[i].updated_by
          });
        }
        state.exportDepartmentData = exportDepartmentData;
      }
    });
    builder.addCase(departmentData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.departmentDataList = false;
    });

    //__________________________post____________________________

    builder.addCase(postdepartment.pending, (state) => {
      state.status = 'loading';
      state.isLoading.departmentDataList = true;
      state.notify = null;
    });
    builder.addCase(postdepartment.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postdepartment = payload.data.data;
        state.isLoading.departmentDataList = false;

        state.status = 'succeded';
        state.showLoaderModal = false;
        state.postdepartment = postdepartment;
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
    builder.addCase(postdepartment.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.departmentDataList = false;
    });

    //_____________________________updateData______________________________
    builder.addCase(updateDepartment.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
      state.isLoading.departmentDataList = true;
    });
    builder.addCase(updateDepartment.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateDepartment = payload.data.data;
        state.isLoading.departmentDataList = false;

        state.status = 'succeded';
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        state.showLoaderModal = false;
        state.updateDepartment = updateDepartment;

        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(updateDepartment.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.departmentDataList = false;
    });
  }
});

export const { handleModalOpen, handleModalClose } =
  departmentMasterSlice.actions;

export default departmentMasterSlice.reducer;
