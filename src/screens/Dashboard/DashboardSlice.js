import { createSlice } from "@reduxjs/toolkit";
import { getRoles } from "./DashboardAction";

const initialState = {
  status: "",
  err: "",
  getRoles: [],
};

export const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRoles.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      const { payload } = action;
      console.log(payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getRoles = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getRoles.length; i++) {
            getRoles[i].counter = count++;
        }
        state.getRoles = [...getRoles];
      }
    });
    builder.addCase(getRoles.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export default dashboardSlice.reducer;
