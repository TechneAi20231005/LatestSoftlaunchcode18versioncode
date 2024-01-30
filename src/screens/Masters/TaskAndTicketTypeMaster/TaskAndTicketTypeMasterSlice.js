import { createSlice } from "@reduxjs/toolkit";
import { taskAndTicketMaster } from "./TaskAndTicketTypeMasterAction";

const initialState = {
  status: "",
  err: "",
  taskAndTicketMaster: [],
};

export const taskandticketTypeSlice = createSlice({
  name: "taskandticketTypeSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(taskAndTicketMaster.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(taskAndTicketMaster.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let taskAndTicketMaster = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < taskAndTicketMaster.length; i++) {
          taskAndTicketMaster[i].counter = count++;
        }
        state.taskAndTicketMaster = [...taskAndTicketMaster];
      }
    });
    builder.addCase(taskAndTicketMaster.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export default taskandticketTypeSlice.reducer;
