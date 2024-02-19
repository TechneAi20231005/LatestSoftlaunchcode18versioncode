import { createSlice } from "@reduxjs/toolkit";
import { getCustomerTypeData, postCustomerData, updateCustomerData } from "./CustomerTypeComponentAction";


const initialState = {
  status: "",
  err: "",
  getCustomerTypeData:[],
  exportCustomerData:[],
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
  notify: "",

};

export const customerMasterSlice = createSlice({
  name: "customerMasterSlice",
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
    builder.addCase(getCustomerTypeData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getCustomerTypeData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getCustomerTypeData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getCustomerTypeData.length; i++) {
          getCustomerTypeData[i].counter = count++;
        }
        state.getCustomerTypeData = [...getCustomerTypeData];
        let exportCustomerData = [];

        for (const i in getCustomerTypeData) {
          exportCustomerData.push({
            // Sr: getCustomerTypeData[i].counter,
            // Department: getCustomerTypeData[i].department,
            // Status: getCustomerTypeData[i].is_active ? "Active" : "Deactive",
            // Remark: getCustomerTypeData[i].remark,
            // created_at: getCustomerTypeData[i].created_at,
            // created_by: getCustomerTypeData[i].created_by,
            // updated_at: getCustomerTypeData[i].updated_at,
            // updated_by: getCustomerTypeData[i].updated_by,



            Sr: getCustomerTypeData[i].counter,
                      customer_type_name: getCustomerTypeData[i].type_name,
                       Status: getCustomerTypeData[i].is_active ? "Active" : "Deactive",
                       Remark: getCustomerTypeData[i].remark,
                       created_at: getCustomerTypeData[i].created_at,
                       created_by: getCustomerTypeData[i].created_by,
                       updated_at: getCustomerTypeData[i].updated_at,
                       updated_by: getCustomerTypeData[i].updated_by,
          });
        }
        state.exportCustomerData=exportCustomerData




      }
    });
    builder.addCase(getCustomerTypeData.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________________post____________________________

    builder.addCase(postCustomerData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(postCustomerData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let postCustomerData = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        state.postCustomerData = postCustomerData;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(postCustomerData.rejected, (state) => {
      state.status = "rejected";
    });

    //_____________________________updateData______________________________
    builder.addCase(updateCustomerData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(updateCustomerData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let updateCustomerData = payload.data.data;
        console.log(updateCustomerData);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.updateCustomerData = updateCustomerData;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(updateCustomerData.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export const { handleModalOpen, handleModalClose } =
customerMasterSlice.actions;

export default customerMasterSlice.reducer;
