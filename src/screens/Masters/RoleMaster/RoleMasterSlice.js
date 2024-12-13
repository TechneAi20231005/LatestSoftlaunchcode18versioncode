import { createSlice } from '@reduxjs/toolkit';
import {
  getAllMenu,
  getRoleData,
  postMenuData,
  postRole,
  updatedRole
} from './RoleMasterAction';

const initialState = {
  status: '',
  err: '',
  notify: '',
  menuData: [],
  modal: {
    showModal: false,
    modalData: '',
    modalHeader: ''
  },
  exportRoleData: [],
  filterRoleData: [],
  isLoading: {
    RoleList: false
  },

  getRoleData: [],
  roleDropDown: [],
  postMenuData: []
};

export const rolemasterSlice = createSlice({
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

    clearRoleDropdown: (state) => {
      state.filterRoleData = []; // Clear the filterRoleData array
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRoleData.pending, (state) => {
      state.status = 'loading';
      state.isLoading.RoleList = true;
      // state.notify = null;
    });
    builder.addCase(getRoleData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.RoleList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getRoleData = payload?.data?.data?.data;
        let filterRoleData = payload?.data?.data?.data
          .filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.role }));

        state.filterRoleData = filterRoleData;
        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getRoleData.length; i++) {
          getRoleData[i].counter = count++;
        }
        state.getRoleData = [...getRoleData];
        let exportRoleData = [];
        for (const i in getRoleData) {
          exportRoleData.push({
            Sr: getRoleData[i].counter,
            Role: getRoleData[i].role,
            Status: getRoleData[i].is_active ? 'Active' : 'Deactive',
            Remark: getRoleData[i].remark,
            created_at: getRoleData[i].created_at,
            created_by: getRoleData[i].created_by,
            updated_at: getRoleData[i].updated_at,
            updated_by: getRoleData[i].updated_by
          });
        }
        state.exportRoleData = exportRoleData;
      }
    });
    builder.addCase(getRoleData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.RoleList = false;
      state.notify = null;
    });

    //__________________________PostRole________________________________
    builder.addCase(postRole.pending, (state) => {
      state.status = 'loading';
      state.isLoading.RoleList = true;
      state.notify = null;
    });
    builder.addCase(postRole.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.RoleList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postRole = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;

        state.postRole = postRole;
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
    builder.addCase(postRole.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.RoleList = false;
    });

    //___________________________________________UpdateRole_________________________________

    builder.addCase(updatedRole.pending, (state) => {
      state.status = 'loading';
      state.isLoading.RoleList = true;

      state.notify = null;
    });
    builder.addCase(updatedRole.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.RoleList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updatedRole = payload.data.data;

        state.status = 'succeded';
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        state.showLoaderModal = false;
        state.updatedRole = updatedRole;
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(updatedRole.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.RoleList = false;
    });

    //_____________________getAllMenu________________________

    builder.addCase(getAllMenu.pending, (state) => {
      state.status = 'loading';
      state.isLoading.RoleList = true;

      state.notify = null;
    });
    builder.addCase(getAllMenu.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.RoleList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.menuData = payload.data.data.map((d) => ({
          id: d.id,
          name: d.name,
          can_read: 0,
          can_create: 0,
          can_update: 0
        }));
        state.status = 'succeeded';
      }
    });
    builder.addCase(getAllMenu.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.RoleList = false;
    });

    //______________________postMenuMange_______________________________

    builder.addCase(postMenuData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
      state.isLoading.RoleList = true;
    });
    builder.addCase(postMenuData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.RoleList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: 'success', message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: '' };

        let postMenuData = payload.data.data;
        state.status = 'succeded';
        state.showLoaderModal = false;
        state.postMenuData = postMenuData;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(postMenuData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.RoleList = false;
    });
    //_________________________
  }
});

export const { handleModalOpen, handleModalClose, clearRoleDropdown } =
  rolemasterSlice.actions;
export default rolemasterSlice.reducer;
