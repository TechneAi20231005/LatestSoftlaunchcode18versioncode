import { createSlice } from "@reduxjs/toolkit";
import { getAllTaskData, getBasketTaskData } from "./TaskComponentAction";


const initialState = {
  status: "",
  err: "",
  basketData:[],
  taskData:[]
  
};

export const TaskcomponentSlice = createSlice({
  name: "TaskcomponentSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBasketTaskData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getBasketTaskData.fulfilled,(state, action) => {
      const { payload } = action;
      console.log("p",payload)
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let basketData = payload
        console.log("bas",basketData)
        state.basketData = basketData
        state.status = "succeded"
      }
    });
    builder.addCase(getBasketTaskData.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getAllTaskData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(getAllTaskData.fulfilled,(state, action) => {
        const { payload } = action;
        console.log("p",payload)
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let taskData = payload.data.data
          console.log("bas",taskData)

          state.taskData = taskData
          state.status = "succeded"
        }
      });
      builder.addCase(getAllTaskData.rejected, (state) => {
        state.status = "rejected";
      });
  

}
});
export default TaskcomponentSlice.reducer;