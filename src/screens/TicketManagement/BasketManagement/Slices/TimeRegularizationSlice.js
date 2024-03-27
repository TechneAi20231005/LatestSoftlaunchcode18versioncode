import { createSlice } from "@reduxjs/toolkit";
import { getTaskHistoryData } from "./TaskHistoryAction";
import { postTimeRegularizationData } from "./TimeRegularizationAction";


const initialState = {
  status: "",
  err: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
 TimeRegularizationData:[],
 exportData:[],
  notify:[]
};

export const TimeRegularizationSlice = createSlice({
  name: "TimeRegularizationSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
   
  },
  extraReducers: (builder) => {
   

    // get task data 
    

    builder.addCase(postTimeRegularizationData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(postTimeRegularizationData.fulfilled,(state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
let TimeRegularizationData = payload.data.data
state.TimeRegularizationData =TimeRegularizationData
        
           
          state.status = "succeded"
          state.notify = null;
          state.notify = { type: "success", message: payload.data.message };
          let modal = { showModal: false, modalData: "", modalHeader: "" };
          state.modal = modal;
        } else {
          let notify = { type: "danger", message: payload.data.message };
          state.notify = null;
          state.notify = notify;
        
        }
      });
      builder.addCase(postTimeRegularizationData.rejected, (state) => {
        state.status = "rejected";
      });


    }
})
   
export default TimeRegularizationSlice.reducer;