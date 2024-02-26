import { createSlice } from "@reduxjs/toolkit";

import { getAllTenant, posttenantData, updatetenantData } from "./TenantConponentAction";

const initialState = {
  status: "",
  err: "",
  notify: {},
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
  exportRoleData: [],
  exportAllTenantData: [],
  getAllTenant: []


};

export const tenantmasterSlice = createSlice({
  name: "rolemasterSlice",
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
      state.notify = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTenant.pending, (state) => {
      state.status = "loading";
      // state.notify = null
    });
    builder.addCase(getAllTenant.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getAllTenant = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getAllTenant.length; i++) {
          getAllTenant[i].counter = count++;
        }
        state.getAllTenant = [...getAllTenant];
        state.exportAllTenantData = [...getAllTenant]
        let sr = 1;
        let exportAllTenantData = [];
        console.log('Tenant', getAllTenant)
        for (const i in getAllTenant) {
          exportAllTenantData.push({
            Sr: sr++,
            TenantName: getAllTenant[i].company_name,
            Country: getAllTenant[i].company_name,
            State: getAllTenant[i].company_name,
            City: getAllTenant[i].company_name,
            Role: getAllTenant[i].role,
            Status: getAllTenant[i].is_active ? "Active" : "Deactive",
            Remark: getAllTenant[i].remark,
            created_at: getAllTenant[i].created_at,
            created_by: getAllTenant[i].created_by,
            updated_at: getAllTenant[i].updated_at,
            updated_by: getAllTenant[i].updated_by,
          });
        }
        state.exportAllTenantData = exportAllTenantData
      }
    });
    builder.addCase(getAllTenant.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________________PostTenant________________________________
    builder.addCase(posttenantData.pending, (state) => {
      state.status = "loading";
      state.notify = null
    });
    builder.addCase(posttenantData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {

        state.modal = { showModal: false, modalData: null, modalHeader: "" };
        let posttenantData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        state.posttenantData = posttenantData;
        // state.notify = { type: "success", message: payload.data.message };
      }
    });
    builder.addCase(posttenantData.rejected, (state) => {
      state.status = "rejected";
    });


    builder.addCase(updatetenantData.pending, (state) => {
      state.status = "loading";
      state.notify = null
    });
    builder.addCase(updatetenantData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.data?.status === 1) {
        // state.notify = { type: "success", message: payload.data.message };

      }
    });
    builder.addCase(updatetenantData.rejected, (state) => {
      state.status = "rejected";
    });

    //___________________________________________UpdateRole_________________________________

    // builder.addCase(updatedRole.pending, (state) => {
    //   state.status = "loading";
    // });
    // builder.addCase(updatedRole.fulfilled, (state, action) => {
    //   const { payload } = action;
    //   console.log("payload Role", payload);
    //   if (payload?.status === 200 && payload?.data?.status === 1) {
    //     state.notify = { type: "success", message: payload.data.message };
    //     state.modal = { showModal: false, modalData: null, modalHeader: "" };

    //     let updatedRole = payload.data.data;
    //     console.log(updatedRole);
    //     state.status = "succeded";
    //     state.showLoaderModal = false;
    //     state.updatedRole = updatedRole;
    //   } else {
    //     state.notify = { type: "danger", message: payload.data.message };
    //   }
    // });
    // builder.addCase(updatedRole.rejected, (state) => {
    //   state.status = "rejected";
    // });
  },
});

export const { handleModalOpen, handleModalClose, handleError } = tenantmasterSlice.actions;
export default tenantmasterSlice.reducer;
