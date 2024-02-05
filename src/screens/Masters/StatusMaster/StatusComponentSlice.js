import { createSlice } from "@reduxjs/toolkit";
import { getStatusData ,postStatusData,updateStatusData} from "./StatusComponentAction";

const initialState = {
  status: "",
  err: "",
  notify: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
  exportStatusData:[],

  getStatusData: [],
};

export const statusMasterSlice = createSlice({
  name: "statusMasterSlice",
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
    builder.addCase(getStatusData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getStatusData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getStatusData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getStatusData.length; i++) {
            getStatusData[i].counter = count++;
        }
        state.getStatusData = [...getStatusData];
        let exportStatusData = [];
        for (const i in getStatusData) {
            exportStatusData.push({
            Sr: getStatusData[i].counter,
            Role: getStatusData[i].role,
            Status: getStatusData[i].is_active ? "Active" : "Deactive",
            Remark: getStatusData[i].remark,
            created_at: getStatusData[i].created_at,
            created_by: getStatusData[i].created_by,
            updated_at: getStatusData[i].updated_at,
            updated_by: getStatusData[i].updated_by,
          });
        }
        state.exportStatusData=exportStatusData
      }
    });
    builder.addCase(getStatusData.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________________PostRole________________________________
    builder.addCase(postStatusData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(postStatusData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let postStatusData = payload.data.data;
        console.log(postStatusData);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.postStatusData = postStatusData;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(postStatusData.rejected, (state) => {
      state.status = "rejected";
    });

    //___________________________________________UpdateRole_________________________________

    builder.addCase(updateStatusData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateStatusData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let updateStatusData = payload.data.data;
        console.log(updateStatusData);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.updateStatusData = updateStatusData;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(updateStatusData.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export const { handleModalOpen, handleModalClose } = statusMasterSlice.actions;
export default statusMasterSlice.reducer;
