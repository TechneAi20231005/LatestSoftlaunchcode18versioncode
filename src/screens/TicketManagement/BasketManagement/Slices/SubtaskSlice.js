import { createSlice } from "@reduxjs/toolkit";
import { CompleteSubtask, DeleteSubtask, getSubTaskData, postSubtaskData } from "./SubtaskAction";


const initialState = {
  status: "",
  err: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
  subtask:[],
  getAllSubTaskData:[],
  completeSubTask:[],
  deleteSubtask:[],
  notify:[]
};

export const SubTaskSlice = createSlice({
  name: "SubTaskSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
   
  },
  extraReducers: (builder) => {
   

    // get task data 
    

    builder.addCase(getSubTaskData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(getSubTaskData.fulfilled,(state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let getAllSubTaskData = payload.data.data

          state.getAllSubTaskData = getAllSubTaskData
          state.status = "succeded"
        }
      });
      builder.addCase(getSubTaskData.rejected, (state) => {
        state.status = "rejected";
      });

// post Task details  
      builder.addCase(postSubtaskData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(postSubtaskData.fulfilled,(state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let subtask = payload.data.data

          state.subtask = subtask
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
      builder.addCase(postSubtaskData.rejected, (state) => {
        state.status = "rejected";
      });


      // complete subtask  Details


      builder.addCase(CompleteSubtask.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(CompleteSubtask.fulfilled,(state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let completeSubTask = payload.data.data

          state.completeSubTask = completeSubTask
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
      builder.addCase(CompleteSubtask.rejected, (state) => {
        state.status = "rejected";
      });



      // delete subtask


      builder.addCase(DeleteSubtask.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(DeleteSubtask.fulfilled,(state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let deleteSubtask = payload.data.data

          state.deleteSubtask = deleteSubtask
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
      builder.addCase(DeleteSubtask.rejected, (state) => {
        state.status = "rejected";
      });


    }
})
   
export default SubTaskSlice.reducer;