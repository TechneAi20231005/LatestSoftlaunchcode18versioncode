import { createSlice } from '@reduxjs/toolkit';
import {
  dynamicFormData,
  dynamicFormDropDownData,
  getAllDropDownData,
  getAllDynamicFormDropdownData
} from './DynamicFormDropDownAction';

const initialState = {
  status: '',
  err: '',
  notify: '',
  sortDropDown: [],
  modal: {
    showModal: false,
    modalData: '',
    modalHeader: ''
  },
  isLoading: {
    dyanamicFormList: false,
    getAllDynamicFormDropdownData: false
  },
  getDynamicFormDropDownData: [],
  exportDynamicFormDropDownData: [],
  getDynamicFormData: [],
  getAllDynamicFormDropdownData: [],
  exportDynamicFormData: [],
  dropDownData: { index: 0 }
};

export const DynamicFormDropDownSlice = createSlice({
  name: 'DynamicFormDropDownSlice',
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
    builder.addCase(dynamicFormDropDownData.pending, (state) => {
      state.status = 'loading';
      state.isLoading.dyanamicFormList = true;
    });
    builder.addCase(dynamicFormDropDownData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.status = 'succeded';
        let counter = 1;
        let getDynamicFormData = [];
        const temp = payload.data.data;

        for (const key in temp) {
          getDynamicFormData.push({
            counter: counter++,
            id: temp[key].id,
            dropdown_name: temp[key].dropdown_name,
            is_active: temp[key].is_active,
            // remark: temp[key].remark,
            created_at: temp[key].created_at,
            created_by: temp[key].created_by,
            updated_at: temp[key].updated_at,
            updated_by: temp[key].updated_by
          });
        }

        state.getDynamicFormData = getDynamicFormData;
        let exportDynamicFormData = [];
        for (const i in temp) {
          exportDynamicFormData.push({
            Sr: getDynamicFormData[i].counter,
            dropdown_name: temp[i].dropdown_name,
            Status: temp[i].is_active ? 'Active' : 'Deactive',
            created_at: temp[i].created_at,
            created_by: temp[i].created_by,
            updated_at: temp[i].updated_at,
            updated_by: temp[i].updated_by
          });
        }
        state.exportDynamicFormData = exportDynamicFormData;
        state.isLoading.dyanamicFormList = false;
      }
    });
    builder.addCase(dynamicFormDropDownData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.dyanamicFormList = false;
    });

    builder.addCase(dynamicFormData.pending, (state) => {
      state.status = 'loading';
      state.isLoading.dyanamicFormList = true;
    });
    builder.addCase(dynamicFormData.fulfilled, (state, action) => {
      const { payload } = action;
      // state.isLoading.dyanamicFormList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.status = 'succeded';
        let counter = 1;
        let getDynamicFormDropDownData = [];
        const temp = payload.data.data.data;
        for (const key in temp) {
          getDynamicFormDropDownData.push({
            counter: counter++,
            id: temp[key].id,
            template_name: temp[key].template_name,
            is_active: temp[key].is_active,
            updated_at: temp[key].updated_at,
            updated_by: temp[key].updated_by,
            created_at: temp[key].created_at,
            created_by: temp[key].created_by
          });
        }

        state.getDynamicFormDropDownData = getDynamicFormDropDownData;
        let getDynamicFormData = [];
        for (const i in temp) {
          getDynamicFormData.push({
            Sr: getDynamicFormDropDownData[i].counter,
            form_Name: temp[i].template_name,
            Status: temp[i].is_active ? 'Active' : 'Deactive',
            created_at: temp[i].created_at,
            created_by: temp[i].created_by,
            updated_at: temp[i].updated_at,
            updated_by: temp[i].updated_by
          });
        }
        state.getDynamicFormData = getDynamicFormData;
        state.isLoading.dyanamicFormList = false;
      }
    });
    builder.addCase(dynamicFormData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.dyanamicFormList = false;
    });

    builder.addCase(getAllDropDownData.pending, (state) => {
      state.status = 'loading';
      state.isLoading.dyanamicFormList = true;
    });
    builder.addCase(getAllDropDownData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.dyanamicFormList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.status = 'succeded';
        let dropDownData = payload.data.data?.data?.map((d) => ({
          label: d.dropdown_name,
          value: d.id
        }));
        state.dropDownData = dropDownData;
        let sortDropDown = payload.data.data.data;
        state.sortDropDown = sortDropDown;
      }
    });
    builder.addCase(getAllDropDownData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.dyanamicFormList = false;
    });
    builder.addCase(getAllDynamicFormDropdownData.pending, (state) => {
      state.status = 'loading';
      state.isLoading.getAllDynamicFormDropdownData = true;
    });
    builder.addCase(
      getAllDynamicFormDropdownData.fulfilled,
      (state, action) => {
        const { payload } = action;

        if (payload?.status === 200 && payload?.data?.status === 1) {
          state.status = 'succeded';
          let dropDownData = payload.data.data?.data?.map((item, index) => ({
            counter: index + 1,
            id: item.id,
            dropdown_name: item.dropdown_name,
            is_active: item.is_active,
            updated_at: item.updated_at,
            created_at: item.created_at,
            created_by: item.created_by,
            updated_by: item.updated_by
          }));
          state.getAllDynamicFormDropdownData = dropDownData;

        }
          state.isLoading.getAllDynamicFormDropdownData = false;
      }
    );
    builder.addCase(getAllDynamicFormDropdownData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.getAllDynamicFormDropdownData = false;
    });
  }
});
export default DynamicFormDropDownSlice.reducer;
