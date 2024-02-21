import { createSlice } from "@reduxjs/toolkit";
import {
  getDesignationData,
  postDesignationData,
  updatedDesignationData,
} from "./DesignationAction";

const initialState = {
  status: "",
  err: "",
  notify: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },

  getDesignationData: [],
  exportDesignation: [],
  sortedDesignationData:[]
};

export const desegnationSlice = createSlice({
  name: "desegnationSlice",
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
    builder.addCase(getDesignationData.pending, (state) => {
      state.status = "loading";
      state.notify=null
    });
    builder.addCase(getDesignationData.fulfilled, (state, action) => {
      const { payload } = action;
    

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getDesignationData = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getDesignationData.length; i++) {
          getDesignationData[i].counter = count++;
        }
        state.getDesignationData = [...getDesignationData];
        let exportDesignation = [];
        for (const i in getDesignationData) {
          exportDesignation.push({
                    Sr: getDesignationData[i].counter,
              Designation: getDesignationData[i].designation,
              Status: getDesignationData[i].is_active ? "Active" : "Deactive",
              Remark: getDesignationData[i].remark,
              created_at: getDesignationData[i].created_at,
              created_by: getDesignationData[i].created_by,
              updated_at: getDesignationData[i].updated_at,
              updated_by: getDesignationData[i].updated_by,
          });
        }

        const sortedDesignationData= payload.data?.data?.filter((d) => d.is_active === 1)
        .map((d) => ({
          value: d.id,
          label: d.designation,
        }))

        state.sortedDesignationData=sortedDesignationData

        state.exportDesignation = exportDesignation;
      }
    });
    builder.addCase(getDesignationData.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________________PostRole________________________________
    builder.addCase(postDesignationData.pending, (state) => {
      state.status = "loading";
      state.notify=null
      
    });
    builder.addCase(postDesignationData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
      

        let postDesignationData = payload.data.data;
    
        state.status = "succeded";
        state.showLoaderModal = false;
        state.postDesignationData = postDesignationData;
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };
     
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(postDesignationData.rejected, (state) => {
      state.status = "rejected";
    });

    //___________________________________________UpdateDesignation_________________________________

    builder.addCase(updatedDesignationData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(updatedDesignationData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
       let updatedDesignationData = payload.data.data;
       
       state.status = "succeeded";
       state.notify = null;
       state.notify = { type: "success", message: payload.data.message };
       state.showLoaderModal = false;

       state.updatedDesignationData = updatedDesignationData;

       let modal = { showModal: false, modalData: "", modalHeader: "" };
       state.modal = modal;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(updatedDesignationData.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export const { handleModalOpen, handleModalClose } = desegnationSlice.actions;
export default desegnationSlice.reducer;
