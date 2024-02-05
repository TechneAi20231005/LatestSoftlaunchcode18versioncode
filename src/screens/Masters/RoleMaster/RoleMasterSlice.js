import { createSlice } from "@reduxjs/toolkit";
import { getRoleData, postRole, updatedRole } from "./RoleMasterAction";

const initialState = {
  status: "",
  err: "",
  notify: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
  exportRoleData:[],

  getRoleData: [],
};

export const rolemasterSlice = createSlice({
  name: "rolemasterSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
    handleModalOpen: (state, action) => {
      state.modal = action.payload;
    },
    handleModalClose: (state, action) => {
      state.modal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRoleData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getRoleData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getRoleData = payload.data.data;
        state.status = "succeded";
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
            Status: getRoleData[i].is_active ? "Active" : "Deactive",
            Remark: getRoleData[i].remark,
            created_at: getRoleData[i].created_at,
            created_by: getRoleData[i].created_by,
            updated_at: getRoleData[i].updated_at,
            updated_by: getRoleData[i].updated_by,
          });
        }
        state.exportRoleData=exportRoleData
      }
    });
    builder.addCase(getRoleData.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________________PostRole________________________________
    builder.addCase(postRole.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(postRole.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let postRole = payload.data.data;
        console.log(postRole);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.postRole = postRole;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(postRole.rejected, (state) => {
      state.status = "rejected";
    });

    //___________________________________________UpdateRole_________________________________

    builder.addCase(updatedRole.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updatedRole.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let updatedRole = payload.data.data;
        console.log(updatedRole);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.updatedRole = updatedRole;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(updatedRole.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export const { handleModalOpen, handleModalClose } = rolemasterSlice.actions;
export default rolemasterSlice.reducer;
