import { createSlice } from "@reduxjs/toolkit";
import { getTaskHistoryData } from "./TaskHistoryAction";


const initialState = {
  status: "",
  err: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
 TaskHistoryData:[],
 AllTaskHistoryData:[],
 exportData:[],
  notify:[]
};

export const TaskHistorySlice = createSlice({
  name: "TaskHistorySlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
   
  },
  extraReducers: (builder) => {
   

    // get task data 
    

    builder.addCase(getTaskHistoryData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(getTaskHistoryData.fulfilled,(state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {

            let AllTaskHistoryData=[]
            let count = 1;
            for (let i = 0; i < payload.data.data.length; i++) {
              payload.data.data[i].counter = count++;
            }
          let TaskHistoryData = payload.data.data.forEach(d => {
            AllTaskHistoryData.push({
              Sr_No: d.counter,
              Task_Id:d.ticket_id,

              task_name: d.task_name,
              basket_name: d.basket_name,
              start_date: d.start_date,
              end_date: d.end_date,
              priority: d.priority,
              status: d.status,

              task_desc: d.task_desc,
              task_hours: d.task_hours,
              created_at: d.created_at,
              updated_at: d.updated_at,

              created_by_name: d.created_by_name,
              updated_by_name: d.updated_by_name,
             

            });
        })
        state.TaskHistoryData=TaskHistoryData
          state.AllTaskHistoryData = AllTaskHistoryData
          state.exportData= AllTaskHistoryData
          state.status = "succeded"
        }
      });
      builder.addCase(getTaskHistoryData.rejected, (state) => {
        state.status = "rejected";
      });


    }
})
   
export default TaskHistorySlice.reducer;