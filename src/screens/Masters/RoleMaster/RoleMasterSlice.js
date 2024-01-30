import { createSlice } from "@reduxjs/toolkit";
import { getRoleData } from "./RoleMasterAction";

const initialState = {
  status: "",
  err: "",
  getRoleData: [],
};

export const rolemasterSlice = createSlice({
  name: "rolemasterSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRoleData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getRoleData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log(payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getRoleData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getRoleData.length; i++) {
          getRoleData[i].counter = count++;
        }
        state.getRoleData = [...getRoleData];
      }
    });
    builder.addCase(getRoleData.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export default rolemasterSlice.reducer;
