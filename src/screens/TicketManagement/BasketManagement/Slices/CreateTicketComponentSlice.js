import { createSlice } from "@reduxjs/toolkit";
import { PostCreateTicket } from "./CreateTicketComponentAction";

const initialState = {
  status: "",
  err: "",
  
  notify: {},
  postTicketData:[]

};

export const CreateTicketComponentSlice = createSlice({
  name: "CreateTicketComponentSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
    
  },
  extraReducers: (builder) => {
    builder.addCase(PostCreateTicket.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(PostCreateTicket.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postTicketData = payload;
        state.postTicketData = postTicketData;
        state.status = "succeded";
      }
    });
    builder.addCase(PostCreateTicket.rejected, (state) => {
      state.status = "rejected";
    });

   
  },
});

export default CreateTicketComponentSlice.reducer;
