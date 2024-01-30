import { createSlice } from "@reduxjs/toolkit";
import { moduleMaster } from "./ModuleAction";

const initialState = {
  status: "",
  err: "",
  moduleMaster: [],
};

export const moduleSlice = createSlice({
  name: "moduleSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(moduleMaster.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(moduleMaster.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let moduleMaster = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < moduleMaster.length; i++) {
          moduleMaster[i].counter = count++;
        }
        state.moduleMaster = [...moduleMaster];
      }
    });
    builder.addCase(moduleMaster.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export default moduleSlice.reducer;
