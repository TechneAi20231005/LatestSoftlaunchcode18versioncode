import { createSlice } from "@reduxjs/toolkit";
import { UpdatePlannerData, getTaskPlannerData } from "./PlannerAction";


const initialState = {
  status: "",
  err: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
PlannerUpdateData:[],
taskPlannerData:[],
plannerData:[],
 exportData:[],
  notify:[]
};

export const PlannerSlice = createSlice({
  name: "PlannerSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
   
  },
  extraReducers: (builder) => {
   

    // get task data 
    

    builder.addCase(UpdatePlannerData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(UpdatePlannerData.fulfilled,(state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
let PlannerUpdateData = payload.data.data
state.PlannerUpdateData =PlannerUpdateData
        
           
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
      builder.addCase(UpdatePlannerData.rejected, (state) => {
        state.status = "rejected";
      });


      
    builder.addCase(getTaskPlannerData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(getTaskPlannerData.fulfilled,(state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
let taskPlannerData = payload.data.data
state.taskPlannerData =taskPlannerData
        
           
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
      builder.addCase(getTaskPlannerData.rejected, (state) => {
        state.status = "rejected";
      });


    }
})
   
export default PlannerSlice.reducer;